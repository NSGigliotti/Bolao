using Bolao.Data;
using Bolao.DTOs;
using Bolao.Enum;
using Bolao.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Bolao.Services;

public class TeamTrace
{
    public string TeamName { get; set; }
    public string Group { get; set; }
    public int Position { get; set; }
    public string QualificationType { get; set; } // Direct, BestThird
    public int? SourceMatchId { get; set; } // For knockout winners

    public override string ToString() => SourceMatchId.HasValue
            ? $"{TeamName} (Vindo do Jogo {SourceMatchId})"
            : $"{TeamName} (Grupo {Group} - {Position}º colocado - {QualificationType})";
}

public class MachesValidate
{
    // =====================================================================================
    // Round of 32 - BRACKET OFICIAL FIFA 2026 (Regulamento, Anexo C)
    // =====================================================================================
    // Jogos 73-88: 16 jogos dos 32-avos de final
    // Fonte: FIFA World Cup 2026 Competition Regulations + Wikipedia knockout stage
    //
    // ESTRUTURA:
    //   - 8 jogos entre 1º/2º colocados (sem terceiros)
    //   - 8 jogos envolvendo terceiros colocados (1º de grupo vs 3º)
    //
    // NUMERAÇÃO OFICIAL DOS JOGOS:
    //   73: 2A vs 2B           74: 1E vs 3rd(ABCDF)
    //   75: 1F vs 2C           76: 1C vs 2F
    //   77: 1I vs 3rd(CDFGH)   78: 2E vs 2I
    //   79: 1A vs 3rd(CEFHI)   80: 1L vs 3rd(EHIJK)
    //   81: 1D vs 3rd(BEFIJ)   82: 1G vs 3rd(AEHIJ)
    //   83: 2K vs 2L           84: 1H vs 2J
    //   85: 1B vs 3rd(EFGIJ)   86: 1K vs 3rd(DEIJL)
    //   87: 1J vs 2H           88: 2D vs 2G
    // =====================================================================================
    private static readonly Dictionary<int, (string Home, string Away)> R32Pairings = new()
    {
        { 73, ("A2", "B2") },         { 74, ("E1", "3rd_ABCDF") },
        { 75, ("F1", "C2") },         { 76, ("C1", "F2") },
        { 77, ("I1", "3rd_CDFGH") },  { 78, ("E2", "I2") },
        { 79, ("A1", "3rd_CEFHI") },  { 80, ("L1", "3rd_EHIJK") },
        { 81, ("D1", "3rd_BEFIJ") },  { 82, ("G1", "3rd_AEHIJ") },
        { 83, ("K2", "L2") },         { 84, ("H1", "J2") },
        { 85, ("B1", "3rd_EFGIJ") },  { 86, ("J1", "H2") },
        { 87, ("K1", "3rd_DEIJL") },  { 88, ("D2", "G2") }
    };

    // Sequential bracket progression for R16, QF, SF, and Final
    private static readonly Dictionary<int, (string Home, string Away)> KnockoutFixedMapping = new()
    {
        // Round of 16 (89-96) - Cruzamento Vertical (1 vs 3, 2 vs 4...)
        { 89, ("W73", "W75") }, { 90, ("W74", "W76") }, { 91, ("W77", "W79") }, { 92, ("W78", "W80") },
        { 93, ("W81", "W83") }, { 94, ("W82", "W84") }, { 95, ("W85", "W87") }, { 96, ("W86", "W88") },
        // Quarter-Finals (97-100)
        { 97, ("W89", "W91") }, { 98, ("W90", "W92") }, { 99, ("W93", "W95") }, { 100, ("W94", "W96") },
        // Semi-Finals (101-102)
        { 101, ("W97", "W99") }, { 102, ("W98", "W100") },
        // Third Place and Final
        { 103, ("L101", "L102") }, { 104, ("W101", "W102") }
    };

    private static string RemoveDiacritics(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return text;
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }
        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }

    private static double GetFifaRanking(string teamName)
    {
        if (string.IsNullOrWhiteSpace(teamName)) return 0.0;
        
        var normalizedInput = RemoveDiacritics(teamName.Trim()).ToLowerInvariant();

        // Fazemos uma busca ignorando acentos e maiúsculas/minúsculas no dicionário
        var match = Bolao.Config.FifaRankingsConfig.Points.FirstOrDefault(x => RemoveDiacritics(x.Key).ToLowerInvariant() == normalizedInput);
        
        return match.Value > 0 ? match.Value : 0.0;
    }

    public async Task SeedTournament(IMachesRepository repository, BolaoDbContext context)
    {
        await context.Database.ExecuteSqlRawAsync("DELETE FROM Prediction");
        await context.Database.ExecuteSqlRawAsync("DELETE FROM Matches");
        await context.Database.ExecuteSqlRawAsync("DELETE FROM Teams");

        var groupsMap = new Dictionary<char, string[]>
        {
            ['A'] = new[] { "México", "África do Sul", "Coreia do Sul", "República Tcheca" },
            ['B'] = new[] { "Canadá", "Bósnia e Herzegovina", "Catar", "Suíça" },
            ['C'] = new[] { "Brasil", "Marrocos", "Haiti", "Escócia" },
            ['D'] = new[] { "Estados Unidos", "Paraguai", "Austrália", "Turquia" },
            ['E'] = new[] { "Alemanha", "Curaçao", "Costa do Marfim", "Equador" },
            ['F'] = new[] { "Países Baixos", "Japão", "Suécia", "Tunísia" },
            ['G'] = new[] { "Bélgica", "Egito", "Irã", "Nova Zelândia" },
            ['H'] = new[] { "Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai" },
            ['I'] = new[] { "França", "Senegal", "Iraque", "Noruega" },
            ['J'] = new[] { "Argentina", "Argélia", "Áustria", "Jordânia" },
            ['K'] = new[] { "Portugal", "RD Congo", "Uzbequistão", "Colômbia" },
            ['L'] = new[] { "Inglaterra", "Croácia", "Gana", "Panamá" }
        };

        foreach (var group in groupsMap)
        {
            foreach (var teamName in group.Value)
            {
                var abbreviation = teamName.Length >= 3 ? teamName.Substring(0, 3).ToUpper() : teamName.ToUpper();
                context.Teams.Add(new TeamModel(teamName, abbreviation, group.Key));
            }
        }
        await context.SaveChangesAsync();

        var teams = await context.Teams.ToListAsync();
        var now = DateTime.Now;
        
        int matchId = 1;
        foreach (var group in groupsMap.Keys)
        {
            var gTeams = teams.Where(t => t.Group == group).OrderBy(t => t.Name).ToList();
            await AddMatch(context, matchId++, gTeams[0].Id, gTeams[1].Id, MatchStage.GroupStageRound1, now);
            await AddMatch(context, matchId++, gTeams[2].Id, gTeams[3].Id, MatchStage.GroupStageRound1, now);
            await AddMatch(context, matchId++, gTeams[0].Id, gTeams[2].Id, MatchStage.GroupStageRound2, now);
            await AddMatch(context, matchId++, gTeams[1].Id, gTeams[3].Id, MatchStage.GroupStageRound2, now);
            await AddMatch(context, matchId++, gTeams[0].Id, gTeams[3].Id, MatchStage.GroupStageRound3, now);
            await AddMatch(context, matchId++, gTeams[1].Id, gTeams[2].Id, MatchStage.GroupStageRound3, now);
        }

        for (int i = 73; i <= 104; i++)
        {
            MatchStage stage = i <= 88 ? MatchStage.RoundOf32 :
                               i <= 96 ? MatchStage.RoundOf16 :
                               i <= 100 ? MatchStage.QuarterFinals :
                               i <= 102 ? MatchStage.SemiFinals :
                               i == 103 ? MatchStage.ThirdPlace : MatchStage.Final;
            
            await AddMatch(context, i, null, null, stage, now);
        }

        await context.SaveChangesAsync();
    }

    private async Task AddMatch(BolaoDbContext context, int id, int? h, int? a, MatchStage stage, DateTime date)
    {
        await context.Matches.AddAsync(new MatchModel 
        { 
            Id = id, 
            HomeTeamId = h, 
            AwayTeamId = a, 
            Stage = stage, 
            Status = MatchStatus.NotStarted,
            MatchDate = date
        });
    }

    public async Task<string> RunFullSimulation(IMachesRepository repository)
    {
        var random = new Random(42);
        var report = new StringBuilder();
        void Log(string msg) => report.AppendLine(msg);

        Log("[FASE DE GRUPOS]");
        
        var allMatches = await repository.GetAllMatch();
        var groupMatches = allMatches.Where(m => m.IsGroupStage).OrderBy(m => m.Id).ToList();
        var allTeams = await repository.GetGroupsAsync();

        foreach (var groupLetter in "ABCDEFGHIJKL")
        {
            Log($"\nGrupo {groupLetter}");
            var groupTeams = allTeams.Where(t => t.Group == groupLetter).ToList();
            var matchesInGroup = groupMatches.Where(m => groupTeams.Any(t => t.Id == m.HomeTeamId)).OrderBy(m => m.Id).ToList();

            foreach (var match in matchesInGroup)
            {
                await SimulateMatch(match, random);
                await repository.UpdateMatchAsync(match);
                var home = allTeams.First(t => t.Id == match.HomeTeamId);
                var away = allTeams.First(t => t.Id == match.AwayTeamId);
                Log($"{home.Name} {match.HomeTeamScore} x {match.AwayTeamScore} {away.Name}");
            }

            var groupCalculatedMatches = matchesInGroup.Where(m => m.Status == MatchStatus.Finished).ToList();
            foreach (var t in groupTeams) ResetTeamStats(t);
            foreach (var m in groupCalculatedMatches) UpdateStatsFromMatch(m, groupTeams);

            var standings = SortByFifaCriteria(groupTeams, groupCalculatedMatches);
            
            Log($"\n✅ TABELA GRUPO {groupLetter}:");
            Log("| Pos | Seleção          | Pts | GP | GC | SG |");
            for (int i = 0; i < standings.Count; i++)
            {
                var t = standings[i];
                Log($"| {i + 1}º  | {t.Name.PadRight(16)} | {t.Points.ToString().PadLeft(3)} | {t.GoalsFor.ToString().PadLeft(2)} | {t.GoalsAgainst.ToString().PadLeft(2)} | {t.GoalDifference.ToString().PadLeft(2)} |");
            }
        }

        await UpdateKnockoutBracket(repository);
        allMatches = await repository.GetAllMatch();
        allTeams = await repository.GetGroupsAsync();
        var standingsMap = CalculateGroupStandings(allTeams, allMatches.Where(m => m.IsGroupStage).ToList());
        var bestThirds = GetBestThirds(standingsMap);
        var baseTraces = BuildGroupTraces(allTeams, standingsMap, bestThirds);

        MatchStage[] knockoutStages = { 
            MatchStage.RoundOf32, MatchStage.RoundOf16, 
            MatchStage.QuarterFinals, MatchStage.SemiFinals, 
            MatchStage.ThirdPlace, MatchStage.Final 
        };

        foreach (var stage in knockoutStages)
        {
            string stageLabel = stage switch
            {
                MatchStage.RoundOf32 => "[16-AVOS DE FINAL]",
                MatchStage.RoundOf16 => "[OITAVAS DE FINAL]",
                MatchStage.QuarterFinals => "[QUARTAS DE FINAL]",
                MatchStage.SemiFinals => "[SEMIFINAL]",
                MatchStage.ThirdPlace => "[TERCEIRO LUGAR]",
                MatchStage.Final => "[FINAL]",
                _ => stage.ToString().ToUpper()
            };

            Log($"\n{stageLabel}");
            var stageMatches = allMatches.Where(m => m.Stage == stage).OrderBy(m => m.Id).ToList();
            
            foreach (var match in stageMatches)
            {
                await SimulateMatch(match, random, allowDraw: false);
                await repository.UpdateMatchAsync(match);

                var homeOrigin = GetTeamOrigin(match.HomeTeamId!.Value, match.Id, allMatches, baseTraces);
                var awayOrigin = GetTeamOrigin(match.AwayTeamId!.Value, match.Id, allMatches, baseTraces);

                Log($"{homeOrigin} {match.HomeTeamScore} x {match.AwayTeamScore} {awayOrigin}");
            }

            if (stage != MatchStage.Final)
            {
                await UpdateKnockoutBracket(repository);
                allMatches = await repository.GetAllMatch();
            }
        }

        var finalMatch = allMatches.First(m => m.Stage == MatchStage.Final);
        var winner = allTeams.First(t => t.Id == finalMatch.WinnerId);
        Log($"\n🏆 Campeão: {winner.Name}");

        return report.ToString();
    }

    public async Task UpdateKnockoutBracket(IMachesRepository repository)
    {
        var allMatches = await repository.GetAllMatch();
        var allTeams = (await repository.GetGroupsAsync()).GroupBy(t => t.Id).Select(g => g.First()).ToList();

        foreach (var t in allTeams) ResetTeamStats(t);
        var groupMatchesFinished = allMatches.Where(m => m.IsGroupStage && m.Status == MatchStatus.Finished).ToList();
        foreach (var m in groupMatchesFinished) UpdateStatsFromMatch(m, allTeams);

        var groupStandings = CalculateGroupStandings(allTeams, groupMatchesFinished);

        Console.WriteLine("\n[DEBUG] === RANKING DOS 12 TERCEIROS COLOCADOS (Para seleção dos 8 melhores) ===");
        Console.WriteLine("| Grupo | Seleção              | Pts | SG  | GP  | Fair Play | Ranking FIFA |");
        Console.WriteLine("|-------|-----------------------|-----|-----|-----|-----------|--------------|" );
        var allThirdsDebug = groupStandings.Values
            .Select(g => g.ElementAtOrDefault(2))
            .Where(t => t != null)
            .OrderByDescending(t => t!.Points)
            .ThenByDescending(t => t!.GoalDifference)
            .ThenByDescending(t => t!.GoalsFor)
            .ThenByDescending(t => (t!.YellowCards * -1) + (t!.RedCards * -3))
            .ThenByDescending(t => GetFifaRanking(t!.Name))
            .ToList();
            
        for (int i = 0; i < allThirdsDebug.Count; i++)
        {
            var t = allThirdsDebug[i]!;
            var rank = GetFifaRanking(t.Name);
            var fairPlay = (t.YellowCards * -1) + (t.RedCards * -3);
            var marker = i < 8 ? "✅" : "❌";
            Console.WriteLine($"| {marker} {t.Group}  | {t.Name,-21} | {t.Points,3} | {t.GoalDifference,3} | {t.GoalsFor,3} | {fairPlay,9} | {rank,12:F2} |");
        }

        var bestThirds = GetBestThirds(groupStandings);

        // === RESOLUÇÃO DOS CONFRONTOS DOS TERCEIROS ===
        var assignedThirds = AssignThirdPlaceTeams(bestThirds);

        // === DEBUG: Mostrar atribuição dos terceiros aos jogos ===
        Console.WriteLine("\n[DEBUG] === ATRIBUIÇÃO DOS TERCEIROS AOS JOGOS DO R32 ===");
        var slotsForDebug = new (int MatchId, string AllowedGroups)[]
        {
            (74, "ABCDF"), (77, "CDFGH"), (79, "CEFHI"), (80, "EHIJK"),
            (81, "BEFIJ"), (82, "AEHIJ"), (85, "EFGIJ"), (87, "DEIJL")
        };
        foreach (var (matchId, allowed) in slotsForDebug)
        {
            var pairing = R32Pairings[matchId];
            var homeCode = pairing.Home;
            var homeGroup = homeCode[0];
            var homeTeam = groupStandings.TryGetValue(homeGroup, out var hs) ? hs.FirstOrDefault()?.Name ?? "?" : "?";
            var thirdTeam = assignedThirds.TryGetValue(matchId, out var tt) ? $"{tt.Name} (3º Grupo {tt.Group})" : "NÃO ATRIBUÍDO";
            Console.WriteLine($"  Jogo {matchId}: {homeTeam} (1º{homeGroup}) vs {thirdTeam}  [permitidos: {allowed}]");
        }

        var knockoutMatches = allMatches.Where(m => m.Id >= 73).OrderBy(m => m.Id).ToList();
        foreach (var match in knockoutMatches)
        {
            if (match.Id <= 88)
            {
                var rule = R32Pairings[match.Id];
                match.HomeTeamId = ResolveSlot(rule.Home, groupStandings, assignedThirds)?.Id;
                match.AwayTeamId = ResolveSlot(rule.Away, groupStandings, assignedThirds)?.Id;
            }
            else
            {
                var rule = KnockoutFixedMapping[match.Id];
                match.HomeTeamId = ResolveFixedSlot(rule.Home, allMatches);
                match.AwayTeamId = ResolveFixedSlot(rule.Away, allMatches);
            }

            if (match.HomeTeamId == null || match.AwayTeamId == null)
            {
                match.Status = MatchStatus.NotStarted;
                match.HomeTeamScore = null; match.AwayTeamScore = null; match.WinnerId = null;
            }
            await repository.UpdateMatchAsync(match);
        }
        foreach (var t in allTeams) await repository.UpdateTeam(t);
    }

    /// <summary>
    /// Atribui os 8 melhores terceiros colocados aos seus respectivos jogos do R32.
    /// Segue a ordem de prioridade para os jogos 74, 77, 79, 80, 81, 82, 85, 87.
    /// </summary>
    private Dictionary<int, TeamModel> AssignThirdPlaceTeams(List<TeamModel> bestThirds)
    {
        var result = new Dictionary<int, TeamModel>();
        var availableThirds = new List<TeamModel>(bestThirds);

        var slots = new (int MatchId, string AllowedGroups)[]
        {
            (74, "ABCDF"),
            (77, "CDFGH"),
            (79, "CEFHI"),
            (80, "EHIJK"),
            (81, "BEFIJ"),
            (82, "AEHIJ"),
            (85, "EFGIJ"),
            (87, "DEIJL")
        };

        foreach (var (matchId, allowedGroups) in slots)
        {
            var team = availableThirds.FirstOrDefault(t => allowedGroups.Contains(t.Group));
            if (team != null)
            {
                result[matchId] = team;
                availableThirds.Remove(team);
            }
        }

        // Preencher slots restantes com terceiros disponíveis (fallback)
        foreach (var (matchId, _) in slots.Where(s => !result.ContainsKey(s.MatchId)))
        {
            if (availableThirds.Any())
            {
                result[matchId] = availableThirds[0];
                availableThirds.RemoveAt(0);
            }
        }

        return result;
    }

    private TeamModel? ResolveSlot(string code, Dictionary<char, List<TeamModel>> groupStandings, Dictionary<int, TeamModel> assignedThirds)
    {
        if (code.StartsWith("3rd_"))
        {
            var matchId = R32Pairings.FirstOrDefault(p => p.Value.Home == code || p.Value.Away == code).Key;
            return assignedThirds.TryGetValue(matchId, out var team) ? team : null;
        }

        char groupLetter = code[0];
        int pos = int.Parse(code[1].ToString());
        return groupStandings.TryGetValue(groupLetter, out var standing)
            ? standing.ElementAtOrDefault(pos - 1)
            : null;
    }

    public async Task SimulateMatch(MatchModel match, Random random, bool allowDraw = true)
    {
        if (match.HomeTeamId == null || match.AwayTeamId == null) return;
        match.HomeTeamScore = random.Next(0, 6);
        match.AwayTeamScore = random.Next(0, 6);
        if (!allowDraw && match.HomeTeamScore == match.AwayTeamScore)
        {
            if (random.Next(0, 2) == 0) match.HomeTeamScore++; else match.AwayTeamScore++;
        }
        match.WinnerId = match.HomeTeamScore > match.AwayTeamScore ? match.HomeTeamId : match.AwayTeamId;
        match.Status = MatchStatus.Finished;
    }

    private int? ResolveFixedSlot(string source, List<MatchModel> allMatches)
    {
        int mid = int.Parse(source.Substring(1));
        var m = allMatches.FirstOrDefault(x => x.Id == mid);
        if (source.StartsWith("W")) return m?.WinnerId;
        if (m == null || m.Status != MatchStatus.Finished || !m.HomeTeamId.HasValue || !m.AwayTeamId.HasValue) return null;
        return m.WinnerId == m.HomeTeamId ? m.AwayTeamId : m.HomeTeamId;
    }

    private void ResetTeamStats(TeamModel t)
    {
        t.Points = 0; t.GamesPlayed = 0; t.Wins = 0; t.Draws = 0; t.Losses = 0; t.GoalsFor = 0; t.GoalsAgainst = 0;
    }

    private void UpdateStatsFromMatch(MatchModel m, List<TeamModel> allTeams)
    {
        var home = allTeams.FirstOrDefault(t => t.Id == m.HomeTeamId);
        var away = allTeams.FirstOrDefault(t => t.Id == m.AwayTeamId);
        if (home == null || away == null || !m.HomeTeamScore.HasValue || !m.AwayTeamScore.HasValue) return;
        home.GamesPlayed++; away.GamesPlayed++;
        home.GoalsFor += m.HomeTeamScore.Value; home.GoalsAgainst += m.AwayTeamScore.Value;
        away.GoalsFor += m.AwayTeamScore.Value; away.GoalsAgainst += m.HomeTeamScore.Value;
        if (m.HomeTeamScore > m.AwayTeamScore) { home.Points += 3; home.Wins++; away.Losses++; }
        else if (m.HomeTeamScore < m.AwayTeamScore) { away.Points += 3; away.Wins++; home.Losses++; }
        else { home.Points += 1; away.Points += 1; home.Draws++; away.Draws++; }
    }

    private Dictionary<char, List<TeamModel>> CalculateGroupStandings(List<TeamModel> allTeams, List<MatchModel> groupMatches)
    {
        return allTeams.GroupBy(t => t.Group).ToDictionary(g => g.Key, g => SortByFifaCriteria(g.ToList(), groupMatches.Where(m => g.Any(t => t.Id == m.HomeTeamId)).ToList()));
    }

    private List<TeamModel> SortByFifaCriteria(List<TeamModel> teams, List<MatchModel> groupMatches)
    {
        var sorted = new List<TeamModel>();
        var groupedByPoints = teams.GroupBy(t => t.Points).OrderByDescending(g => g.Key);

        foreach (var group in groupedByPoints)
        {
            var tiedTeams = group.ToList();
            if (tiedTeams.Count == 1)
            {
                sorted.Add(tiedTeams[0]);
            }
            else
            {
                // Envia as equipes empatadas em pontos para resolver pelos passos 1, 2 e 3
                sorted.AddRange(ResolveTiedTeams(tiedTeams, groupMatches));
            }
        }
        return sorted;
    }

    private static bool IsHostNation(string teamName)
    {
        var normalized = RemoveDiacritics(teamName).ToLowerInvariant();
        return normalized == "mexico" || normalized == "estados unidos" || normalized == "canada";
    }

    private List<TeamModel> ResolveTiedTeams(List<TeamModel> tiedTeams, List<MatchModel> groupMatches)
    {
        if (tiedTeams.Count <= 1) return tiedTeams;
        
        var teamIds = new HashSet<int>(tiedTeams.Select(t => t.Id));
        
        // Jogos apenas entre os empatados (Passo 1: Confronto Direto)
        var miniMatches = groupMatches.Where(m => m.HomeTeamId.HasValue && m.AwayTeamId.HasValue && 
                                                  teamIds.Contains(m.HomeTeamId.Value) && 
                                                  teamIds.Contains(m.AwayTeamId.Value)).ToList();
                                                  
        var stats = tiedTeams.ToDictionary(t => t.Id, t => new H2HStats());
        
        foreach (var m in miniMatches)
        {
            var hId = m.HomeTeamId!.Value; var aId = m.AwayTeamId!.Value;
            stats[hId].GoalsFor += m.HomeTeamScore ?? 0; stats[hId].GoalsAgainst += m.AwayTeamScore ?? 0;
            stats[aId].GoalsFor += m.AwayTeamScore ?? 0; stats[aId].GoalsAgainst += m.HomeTeamScore ?? 0;
            if (m.HomeTeamScore > m.AwayTeamScore) stats[hId].Points += 3;
            else if (m.HomeTeamScore < m.AwayTeamScore) stats[aId].Points += 3;
            else { stats[hId].Points += 1; stats[aId].Points += 1; }
        }
        
        return tiedTeams
            // PASSO 1: Geral no Grupo (Prioridade FIFA moderna)
            .OrderByDescending(t => t.GoalDifference)             // melhor saldo de gols (todas as partidas)
            .ThenByDescending(t => t.GoalsFor)                   // maior número de gols (todas as partidas)
            .ThenByDescending(t => t.Wins)                       // maior número de vitórias (todas as partidas)
            // PASSO 2: Confronto Direto (Se persistir o empate)
            .ThenByDescending(t => stats[t.Id].Points)          // maior número de pontos (confronto direto)
            .ThenByDescending(t => stats[t.Id].GoalDifference)   // saldo de gols (confronto direto)
            .ThenByDescending(t => stats[t.Id].GoalsFor)         // gols marcados (confronto direto)
            // PASSO 3: Fair Play
            .ThenByDescending(t => (t.YellowCards * -1) + (t.RedCards * -3))
            // PASSO 4: Prioridade para Países Sedes (México, EUA, Canadá) no início
            .ThenByDescending(t => IsHostNation(t.Name) ? 1 : 0)
            // PASSO 5: Ranking da FIFA
            .ThenByDescending(t => GetFifaRanking(t.Name))       // ranking mais recente da FIFA (maior é melhor)
            .ToList();
    }

    /// <summary>
    /// Seleciona e ordena os 8 melhores terceiros colocados segundo os critérios de desempate.
    /// 1. Pontos, 2. Saldo, 3. Gols Pró, 4. Fair Play, 5. Ranking FIFA
    /// </summary>
    private List<TeamModel> GetBestThirds(Dictionary<char, List<TeamModel>> standings)
    {
        var allThirds = standings.Values
            .Select(g => g.ElementAtOrDefault(2))
            .Where(t => t != null)
            .Cast<TeamModel>()
            .ToList();

        return allThirds
            .OrderByDescending(t => t.Points)
            .ThenByDescending(t => t.GoalDifference)
            .ThenByDescending(t => t.GoalsFor)
            .ThenByDescending(t => (t.YellowCards * -1) + (t.RedCards * -3))
            .ThenByDescending(t => GetFifaRanking(t.Name))
            .Take(8)
            .ToList();
    }

    private string GetTeamOrigin(int teamId, int currentMatchId, List<MatchModel> allMatches, Dictionary<int, TeamTrace> baseTraces)
    {
        if (!baseTraces.TryGetValue(teamId, out var trace)) return "Desconhecido";
        string originSuffix = trace.Position switch { 1 => $"(1º Grupo {trace.Group})", 2 => $"(2º Grupo {trace.Group})", 3 => "(Melhor 3º colocado)", _ => "" };
        return $"{trace.TeamName} {originSuffix}";
    }

    private Dictionary<int, TeamTrace> BuildGroupTraces(List<TeamModel> allTeams, Dictionary<char, List<TeamModel>> standings, List<TeamModel> bestThirds)
    {
        var map = new Dictionary<int, TeamTrace>();
        foreach (var group in standings)
        {
            for (int i = 0; i < group.Value.Count; i++)
            {
                var team = group.Value[i];
                map[team.Id] = new TeamTrace { TeamName = team.Name, Group = group.Key.ToString(), Position = i + 1, QualificationType = i < 2 ? "Direct" : (bestThirds.Any(t => t.Id == team.Id) ? "BestThird" : "Eliminated") };
            }
        }
        return map;
    }

    private class H2HStats { public int Points { get; set; } public int GoalsFor { get; set; } public int GoalsAgainst { get; set; } public int GoalDifference => GoalsFor - GoalsAgainst; }
}