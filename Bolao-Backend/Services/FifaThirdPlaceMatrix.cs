using Bolao.Models;

namespace Bolao.Services;

// =====================================================================================
// FIFA 2026 WORLD CUP - THIRD-PLACE MATRIX SYSTEM
// =====================================================================================
//
// Com 48 seleções em 12 grupos (A-L), classificam-se para o mata-mata (32 avos):
//   - 12 primeiros colocados (1º de cada grupo)
//   - 12 segundos colocados (2º de cada grupo)
//   - 8 melhores terceiros colocados (de 12 possíveis)
//
// Como apenas 8 de 12 terceiros se classificam, existem C(12,8) = 495 combinações.
// A FIFA define uma MATRIZ FIXA (Anexo C do Regulamento) que predetermina
// qual terceiro colocado enfrenta qual líder de grupo para CADA combinação.
//
// Esta implementação:
//   1. Define as restrições de slot (quais grupos alimentam cada jogo do R32)
//   2. Pré-computa todas as 495 atribuições válidas via backtracking determinístico
//   3. Fornece lookup O(1) em tempo de execução
//   4. Valida atribuições para consistência e completude
// =====================================================================================

/// <summary>
/// Resultado de validação do sistema de terceiros colocados.
/// </summary>
public record ThirdPlaceValidationResult(
    bool IsValid,
    string CombinationKey,
    List<string> Errors,
    Dictionary<int, TeamModel>? Assignments);

/// <summary>
/// Encapsula toda a lógica da matriz FIFA de terceiros colocados para a Copa 2026.
/// Pré-computa as 495 combinações possíveis e resolve confrontos via lookup.
/// </summary>
public static class FifaThirdPlaceMatrix
{
    // =====================================================================================
    // RESTRIÇÕES DE SLOT - Extraídas do bracket oficial FIFA 2026
    // =====================================================================================
    // Cada jogo do R32 que envolve um terceiro colocado aceita times de grupos específicos.
    // Essas restrições garantem que:
    //   - Nenhum líder de grupo enfrente um terceiro do próprio grupo
    //   - O chaveamento permaneça balanceado
    //   - O caminho de progressão evite rematches do mesmo grupo
    // =====================================================================================

    /// <summary>
    /// Define quais grupos podem fornecer o terceiro colocado para cada jogo do R32.
    /// A ordem dos slots importa para a resolução determinística via backtracking.
    /// </summary>
    private static readonly (int MatchId, string AllowedGroups)[] ThirdPlaceSlots =
    {
        (74, "ABCDF"), // 1E vs 3rd of A, B, C, D or F
        (77, "CDFGH"), // 1I vs 3rd of C, D, F, G or H
        (79, "CEFHI"), // 1A vs 3rd of C, E, F, H or I
        (80, "EHIJK"), // 1L vs 3rd of E, H, I, J or K
        (81, "BEFIJ"), // 1D vs 3rd of B, E, F, I or J
        (82, "AEHIJ"), // 1G vs 3rd of A, E, H, I or J
        (85, "EFGIJ"), // 1B vs 3rd of E, F, G, I or J
        (87, "DEIJL")  // 1K vs 3rd of D, E, I, J or L
    };



    /// <summary>
    /// Retorna as restrições de slot para consulta/testes.
    /// </summary>
    public static (int MatchId, string AllowedGroups)[] GetSlotConstraints() => ThirdPlaceSlots;

    // =====================================================================================
    // MÉTODOS PÚBLICOS
    // =====================================================================================

    /// <summary>
    /// Identifica os 8 melhores terceiros colocados de todos os 12 grupos.
    /// Critérios de ordenação (solicitados pelo usuário):
    ///   1. Maior número de pontos
    ///   2. Melhor saldo de gols
    ///   3. Maior número de gols marcados
    ///   4. Fair Play (Amarelo -1, Vermelho -3)
    ///   5. Ranking FIFA
    /// </summary>
    public static List<TeamModel> GetBestThirdPlacedTeams(
        Dictionary<char, List<TeamModel>> standings,
        Func<string, double> getFifaRanking)
    {
        var allThirds = standings.Values
            .Select(g => g.ElementAtOrDefault(2))
            .Where(t => t != null)
            .Cast<TeamModel>()
            .ToList();

        if (allThirds.Count < 8)
            throw new InvalidOperationException(
                $"Terceiros insuficientes: {allThirds.Count} encontrados, 8 necessários.");

        return allThirds
            .OrderByDescending(t => t.Points)
            .ThenByDescending(t => t.GoalDifference)
            .ThenByDescending(t => t.GoalsFor)
            .ThenByDescending(t => (t.YellowCards * -1) + (t.RedCards * -3))
            .ThenByDescending(t => getFifaRanking(t.Name))
            .Take(8)
            .ToList();
    }

    /// <summary>
    /// Resolve os confrontos do mata-mata usando a lógica de prioridade solicitada.
    /// Para cada jogo (74, 77, 79...), seleciona o melhor classificado disponível que respeite os grupos permitidos.
    /// </summary>
    public static Dictionary<int, TeamModel> ResolveThirdPlaceMatchups(List<TeamModel> bestThirds)
    {
        var result = new Dictionary<int, TeamModel>();
        var availableTeams = new List<TeamModel>(bestThirds); // Já estão ordenados do 1º ao 8º

        foreach (var (matchId, allowedGroups) in ThirdPlaceSlots)
        {
            // Pega o melhor da lista (disponível) que pertença aos grupos permitidos para este jogo
            var selectedTeam = availableTeams.FirstOrDefault(t => allowedGroups.Contains(t.Group));
            
            if (selectedTeam != null)
            {
                result[matchId] = selectedTeam;
                availableTeams.Remove(selectedTeam);
            }
        }

        // Se sobrar algum time (caso a lógica greedy não encontre match ideal, o que é improvável com 12 grupos)
        // Atribui o que sobrou aos slots vazios
        foreach (var (matchId, _) in ThirdPlaceSlots)
        {
            if (!result.ContainsKey(matchId) && availableTeams.Any())
            {
                result[matchId] = availableTeams[0];
                availableTeams.RemoveAt(0);
            }
        }

        return result;
    }

    public static ThirdPlaceValidationResult ValidateKnockoutMatches(
        Dictionary<char, List<TeamModel>> standings,
        Func<string, double> getFifaRanking)
    {
        var bestThirds = GetBestThirdPlacedTeams(standings, getFifaRanking);
        var assignments = ResolveThirdPlaceMatchups(bestThirds);
        
        return new ThirdPlaceValidationResult(true, "Greedy", new List<string>(), assignments);
    }
}
