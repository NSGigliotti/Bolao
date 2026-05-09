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
    // Round of 32 pairings based on GE/Globo (Official FIFA 2026 Bracket)
    // Matches 73 to 88
    private static readonly Dictionary<int, (string Home, string Away)> R32Pairings = new()
    {
        { 73, ("E1", "3rd_ABCDF") }, { 74, ("I1", "3rd_CDFGH") }, { 75, ("A2", "B2") },    { 76, ("F1", "C2") },
        { 77, ("K2", "L2") },        { 78, ("H1", "J2") },        { 79, ("D1", "3rd_BEFIJ") }, { 80, ("G1", "3rd_AEHIJ") },
        { 81, ("C1", "F2") },        { 82, ("E2", "I2") },        { 83, ("A1", "3rd_CEFHI") }, { 84, ("L1", "3rd_EHIJK") },
        { 85, ("J1", "H2") },        { 86, ("D2", "G2") },        { 87, ("B1", "3rd_EFGIJ") }, { 88, ("K1", "3rd_DEIJL") }
    };

    // Sequential bracket progression for R16, QF, SF, and Final
    private static readonly Dictionary<int, (string Home, string Away)> KnockoutFixedMapping = new()
    {
        // Round of 16 (89-96)
        { 89, ("W73", "W74") }, { 90, ("W75", "W76") }, { 91, ("W77", "W78") }, { 92, ("W79", "W80") },
        { 93, ("W81", "W82") }, { 94, ("W83", "W84") }, { 95, ("W85", "W86") }, { 96, ("W87", "W88") },
        // Quarter-Finals (97-100)
        { 97, ("W89", "W90") }, { 98, ("W91", "W92") }, { 99, ("W93", "W94") }, { 100, ("W95", "W96") },
        // Semi-Finals (101-102)
        { 101, ("W97", "W98") }, { 102, ("W99", "W100") },
        // Third Place and Final
        { 103, ("L101", "L102") }, { 104, ("W101", "W102") }
    };

    private static double GetFifaRanking(string teamName)
    {
        return Bolao.Config.FifaRankingsConfig.Points.TryGetValue(teamName, out double points) ? points : 0.0;
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
        var bestThirds = GetBestThirds(groupStandings);
        var assignedThirds = AssignThirdPlaceTeams(bestThirds);

        var knockoutMatches = allMatches.Where(m => m.Id >= 73).OrderBy(m => m.Id).ToList();
        foreach (var match in knockoutMatches)
        {
            if (match.Id <= 88)
            {
                var rule = R32Pairings[match.Id];
                match.HomeTeamId = ResolveSlot(rule.Home, groupStandings, assignedThirds).Id;
                match.AwayTeamId = ResolveSlot(rule.Away, groupStandings, assignedThirds).Id;
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

    private Dictionary<int, TeamModel> AssignThirdPlaceTeams(List<TeamModel> bestThirds)
    {
        var result = new Dictionary<int, TeamModel>();
        var availableThirds = new List<TeamModel>(bestThirds.OrderBy(t => t.Group));
        
        var slots = new Dictionary<int, string>
        {
            { 73, "ABCDF" }, { 74, "CDFGH" }, { 79, "BEFIJ" }, { 80, "AEHIJ" },
            { 83, "CEFHI" }, { 84, "EHIJK" }, { 87, "EFGIJ" }, { 88, "DEIJL" }
        };

        foreach (var slot in slots)
        {
            var team = availableThirds.FirstOrDefault(t => slot.Value.Contains(t.Group));
            if (team != null)
            {
                result[slot.Key] = team;
                availableThirds.Remove(team);
            }
        }

        foreach (var slot in slots.Keys.Where(k => !result.ContainsKey(k)))
        {
            if (availableThirds.Any())
            {
                result[slot] = availableThirds[0];
                availableThirds.RemoveAt(0);
            }
        }

        return result;
    }

    private TeamModel ResolveSlot(string code, Dictionary<char, List<TeamModel>> groupStandings, Dictionary<int, TeamModel> assignedThirds)
    {
        if (code.StartsWith("3rd_"))
        {
            var matchId = R32Pairings.FirstOrDefault(p => p.Value.Home == code || p.Value.Away == code).Key;
            return assignedThirds.ContainsKey(matchId) ? assignedThirds[matchId] : null;
        }

        char groupLetter = code[0];
        int pos = int.Parse(code[1].ToString());
        return groupStandings[groupLetter].ElementAtOrDefault(pos - 1);
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
            // PRIMEIRO PASSO: Confronto Direto
            .OrderByDescending(t => stats[t.Id].Points)          // maior número de pontos (confronto direto)
            .ThenByDescending(t => stats[t.Id].GoalDifference)   // saldo de gols (confronto direto)
            .ThenByDescending(t => stats[t.Id].GoalsFor)         // gols marcados (confronto direto)
            // SEGUNDO PASSO: Geral no Grupo
            .ThenByDescending(t => t.GoalDifference)             // melhor saldo de gols (todas as partidas)
            .ThenByDescending(t => t.GoalsFor)                   // maior número de gols (todas as partidas)
            // TERCEIRO PASSO: Ranking da FIFA
            .ThenByDescending(t => GetFifaRanking(t.Name))       // ranking mais recente da FIFA (pontos: maior é melhor)
            .ToList();
    }

    private List<TeamModel> GetBestThirds(Dictionary<char, List<TeamModel>> standings)
    {
        // Definição dos oito melhores terceiros colocados:
        return standings.Values.Select(g => g.ElementAtOrDefault(2))
            .Where(t => t != null)
            .OrderByDescending(t => t!.Points)                   // 1. maior número de pontos obtidos em todas as partidas do grupo
            .ThenByDescending(t => t!.GoalDifference)            // 2. saldo de gols resultante de todas as partidas do grupo
            .ThenByDescending(t => t!.GoalsFor)                  // 3. maior número de gols marcados em todas as partidas do grupo
            .ThenByDescending(t => GetFifaRanking(t!.Name))      // 4. classificação de acordo com o Ranking da FIFA
            .Take(8)
            .Cast<TeamModel>()
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