using Bolao.Enum;
using Bolao.Interfaces;
using Bolao.Models;

public class MachesValidate
{
    private readonly Dictionary<int, (string Home, string Away)> BracketMapping = new()
    {
        // Round of 32 (Matches 73-88)
        { 73, ("2A", "2B") },
        { 74, ("1E", "3rd_74") }, // 3rd A/B/C/D/F
        { 75, ("1F", "2C") },
        { 76, ("1C", "2F") },
        { 77, ("1I", "3rd_77") }, // 3rd C/D/F/G/H
        { 78, ("2E", "2I") },
        { 79, ("1A", "3rd_79") }, // 3rd C/E/F/H/I
        { 80, ("1L", "3rd_80") }, // 3rd E/H/I/J/K
        { 81, ("1D", "3rd_81") }, // 3rd B/E/F/I/J
        { 82, ("1G", "3rd_82") }, // 3rd A/E/H/I/J
        { 83, ("2K", "2L") },
        { 84, ("1H", "2J") },
        { 85, ("1B", "3rd_85") }, // 3rd E/F/G/I/J
        { 86, ("1J", "2H") },
        { 87, ("1K", "3rd_87") }, // 3rd D/E/I/J/L
        { 88, ("2D", "2G") },

        // Round of 16 (Matches 89-96)
        { 89, ("W74", "W77") },
        { 90, ("W73", "W75") },
        { 91, ("W76", "W78") },
        { 92, ("W79", "W80") },
        { 93, ("W83", "W84") },
        { 94, ("W81", "W82") },
        { 95, ("W86", "W88") },
        { 96, ("W85", "W87") },

        // Quarter Finals (Matches 97-100)
        { 97, ("W89", "W90") },
        { 98, ("W93", "W94") },
        { 99, ("W91", "W92") },
        { 100, ("W95", "W96") },

        // Semi Finals (Matches 101-102)
        { 101, ("W97", "W98") },
        { 102, ("W99", "W100") },

        // 3rd Place (Match 103)
        { 103, ("L101", "L102") },

        // Final (Match 104)
        { 104, ("W101", "W102") }
    };

    public async Task UpdateKnockoutBracket(IMachesRepository repository)
    {
        var allMatches = await repository.GetAllMatch();
        var allTeams = await repository.GetGroupsAsync();

        // 1. Reset tournament stats and recalculate group stages
        foreach (var t in allTeams)
        {
            t.Points = 0;
            t.GamesPlayed = 0;
            t.Wins = 0;
            t.Draws = 0;
            t.Losses = 0;
            t.GoalsFor = 0;
            t.GoalsAgainst = 0;
        }

        var groupMatches = allMatches.Where(m => m.Stage <= MatchStage.GroupStageRound3 && m.Status == MatchStatus.Finished).ToList();
        foreach (var m in groupMatches)
        {
            var home = allTeams.FirstOrDefault(t => t.Id == m.HomeTeamId);
            var away = allTeams.FirstOrDefault(t => t.Id == m.AwayTeamId);

            if (home == null || away == null || !m.HomeTeamScore.HasValue || !m.AwayTeamScore.HasValue) continue;

            home.GamesPlayed++;
            away.GamesPlayed++;
            home.GoalsFor += m.HomeTeamScore.Value;
            home.GoalsAgainst += m.AwayTeamScore.Value;
            away.GoalsFor += m.AwayTeamScore.Value;
            away.GoalsAgainst += m.HomeTeamScore.Value;

            if (m.HomeTeamScore > m.AwayTeamScore)
            {
                home.Points += 3;
                home.Wins++;
                away.Losses++;
            }
            else if (m.HomeTeamScore < m.AwayTeamScore)
            {
                away.Points += 3;
                away.Wins++;
                home.Losses++;
            }
            else
            {
                home.Points += 1;
                away.Points += 1;
                home.Draws++;
                away.Draws++;
            }
        }

        // 2. Determine Qualifiers
        var groups = allTeams.GroupBy(t => t.Group).ToDictionary(g => g.Key, g => g.OrderByDescending(t => t.Points).ThenByDescending(t => t.GoalDifference).ThenByDescending(t => t.GoalsFor).ThenByDescending(t => t.Wins).ToList());

        var firstPlace = groups.ToDictionary(g => g.Key, g => g.Value[0]);
        var secondPlace = groups.ToDictionary(g => g.Key, g => g.Value[1]);
        var thirdPlace = groups.Values.Select(g => g[2]).OrderByDescending(t => t.Points).ThenByDescending(t => t.GoalDifference).ThenByDescending(t => t.GoalsFor).ThenByDescending(t => t.Wins).Take(8).ToList();

        // 3. Round of 32 Assignment logic (simplified constraint matching for 3rd places)
        var qualMap = new Dictionary<string, TeamModel>();
        foreach (var g in firstPlace) qualMap[$"1{g.Key}"] = g.Value;
        foreach (var g in secondPlace) qualMap[$"2{g.Key}"] = g.Value;

        // Special 3rd place assignment logic to satisfy FIFA link constraints
        AssignThirdPlaces(thirdPlace, qualMap);

        // 4. Update Matches in sequence
        var knockoutMatches = allMatches.Where(m => m.Id >= 73).OrderBy(m => m.Id).ToList();
        foreach (var match in knockoutMatches)
        {
            if (!BracketMapping.TryGetValue(match.Id, out var rule)) continue;

            match.HomeTeamId = ResolveTeam(rule.Home, qualMap, allMatches);
            match.AwayTeamId = ResolveTeam(rule.Away, qualMap, allMatches);

            // If teams are not defined yet, reset status
            if (match.HomeTeamId == null || match.AwayTeamId == null)
            {
                match.Status = MatchStatus.NotStarted;
                match.HomeTeamScore = null;
                match.AwayTeamScore = null;
                match.WinnerId = null;
            }

            await repository.UpdateMatchAsync(match);
        }

        // Save team stats
        foreach (var t in allTeams) await repository.UpdateTeam(t);
    }

    private void AssignThirdPlaces(List<TeamModel> thirdPlace, Dictionary<string, TeamModel> qualMap)
    {
        // Constraints from the link
        var slots = new List<(string Label, List<char> AllowedGroups)>
        {
            ("3rd_74", new List<char>{'A','B','C','D','F'}),
            ("3rd_77", new List<char>{'C','D','F','G','H'}),
            ("3rd_79", new List<char>{'C','E','F','H','I'}),
            ("3rd_80", new List<char>{'E','H','I','J','K'}),
            ("3rd_81", new List<char>{'B','E','F','I','J'}),
            ("3rd_82", new List<char>{'A','E','H','I','J'}),
            ("3rd_85", new List<char>{'E','F','G','I','J'}),
            ("3rd_87", new List<char>{'D','E','I','J','L'})
        };

        var availableTeams = thirdPlace.ToList();
        foreach (var slot in slots)
        {
            // Pick the best available team that is allowed in this slot
            var team = availableTeams.FirstOrDefault(t => slot.AllowedGroups.Contains(t.Group));
            if (team != null)
            {
                qualMap[slot.Label] = team;
                availableTeams.Remove(team);
            }
        }
    }

    private int? ResolveTeam(string source, Dictionary<string, TeamModel> qualMap, List<MatchModel> allMatches)
    {
        if (qualMap.TryGetValue(source, out var team)) return team.Id;

        if (source.StartsWith("W"))
        {
            int mid = int.Parse(source.Substring(1));
            var m = allMatches.FirstOrDefault(x => x.Id == mid);
            return m?.WinnerId;
        }

        if (source.StartsWith("L"))
        {
            int mid = int.Parse(source.Substring(1));
            var m = allMatches.FirstOrDefault(x => x.Id == mid);
            if (m == null || m.Status != MatchStatus.Finished || !m.HomeTeamId.HasValue || !m.AwayTeamId.HasValue) return null;
            return m.WinnerId == m.HomeTeamId ? m.AwayTeamId : m.HomeTeamId;
        }

        return null;
    }
}