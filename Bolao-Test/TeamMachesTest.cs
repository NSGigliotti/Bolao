using Xunit;
using Xunit.Abstractions;
using Bolao.Models;
using Bolao.Enum;
using Bolao.Data;
using System.Collections.Generic;
using System.Linq;
using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;

namespace Bolao_Test;

public class TeamMachesTest
{
    private readonly ITestOutputHelper _output;
    private readonly BolaoDbContext _context;

    public TeamMachesTest(ITestOutputHelper output)
    {
        _output = output;
        
        // Load .env file
        string envPath = FindEnvFile(Directory.GetCurrentDirectory());
        if (string.IsNullOrEmpty(envPath)) throw new FileNotFoundException("Could not find .env file.");
        Env.Load(envPath);

        string dbPassword = Environment.GetEnvironmentVariable("MYSQL_PASSWORD") ?? "Bolao!Password@2026";
        string dbUser = Environment.GetEnvironmentVariable("MYSQL_USER") ?? "bolao_user";
        string dbName = Environment.GetEnvironmentVariable("MYSQL_DATABASE") ?? "bolao_db";
        string dbPort = "3307"; 

        var connectionString = $"Server=localhost;Port={dbPort};Database={dbName};User={dbUser};Password={dbPassword};GuidFormat=Char36;";
        
        var options = new DbContextOptionsBuilder<BolaoDbContext>()
            .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            .Options;
            
        _context = new BolaoDbContext(options);
    }

    private string? FindEnvFile(string currentPath)
    {
        var dir = new DirectoryInfo(currentPath);
        while (dir != null)
        {
            var path = Path.Combine(dir.FullName, ".env");
            if (File.Exists(path)) return path;
            dir = dir.Parent;
        }
        return null;
    }

    [Fact]
    public void SimulateFullTournament()
    {
        // 1. Fetch Teams
        var teams = _context.Teams.ToList();
        Assert.True(teams.Count >= 48, $"Expected at least 48 teams, found {teams.Count}");
        _output.WriteLine($"Fetched {teams.Count} teams from DB.");

        // 2. Simulate Group Stage Matches (Stages 0, 1, 2)
        SimulateGroupStageMatches(teams);
        
        // 3. Determine Qualifiers
        var qualifiedTeams = GetKnockoutQualifiers(teams);
        _output.WriteLine("\n=== QUALIFIED FOR ROUND OF 32 ===");
        foreach (var t in qualifiedTeams) _output.WriteLine($"{t.Name} ({t.Group})");

        // 4. Knockout Stages (Stages 3 to 8)
        var currentRoundTeams = qualifiedTeams;
        MatchStage[] stages = { 
            MatchStage.RoundOf32, 
            MatchStage.RoundOf16, 
            MatchStage.QuarterFinals, 
            MatchStage.SemiFinals, 
            MatchStage.ThirdPlace, // Skip ThirdPlace for simplicity or handle it if you want
            MatchStage.Final 
        };

        foreach (var stage in stages)
        {
            if (stage == MatchStage.ThirdPlace) continue; // Optional: skipping 3rd place logic for now to focus on winner path
            currentRoundTeams = PlayKnockoutRoundDB(currentRoundTeams, stage);
        }

        // Get Final Match Result to find the Winner
        var finalMatch = _context.Matches.Include(m => m.Winner)
                                         .FirstOrDefault(m => m.Stage == MatchStage.Final);
                                         
        _output.WriteLine("\n=================================================");
        _output.WriteLine($"🏆 WORLD CUP 2026 WINNER: {finalMatch?.Winner?.Name} 🏆");
        _output.WriteLine("=================================================");
    }

    private void SimulateGroupStageMatches(List<TeamModel> teams)
    {
        // Fetch matches for stages 0, 1, 2
        var matches = _context.Matches.Where(m => (int)m.Stage <= 2).ToList();
        var random = new Random();

        foreach (var match in matches)
        {
            // Simulate Score
            match.HomeTeamScore = random.Next(0, 4);
            match.AwayTeamScore = random.Next(0, 4);
            match.Status = MatchStatus.Finished;

            // Update stats for teams involved
            var homeTeam = teams.FirstOrDefault(t => t.Id == match.HomeTeamId);
            var awayTeam = teams.FirstOrDefault(t => t.Id == match.AwayTeamId);
            
            if (homeTeam == null || awayTeam == null) continue;

            homeTeam.GamesPlayed++;
            awayTeam.GamesPlayed++;
            homeTeam.GoalsFor += match.HomeTeamScore.Value;
            awayTeam.GoalsFor += match.AwayTeamScore.Value;
            homeTeam.GoalsAgainst += match.AwayTeamScore.Value;
            awayTeam.GoalsAgainst += match.HomeTeamScore.Value;

            if (match.HomeTeamScore > match.AwayTeamScore)
            {
                homeTeam.Wins++;
                homeTeam.Points += 3;
                awayTeam.Losses++;
                match.WinnerId = homeTeam.Id;
            }
            else if (match.AwayTeamScore > match.HomeTeamScore)
            {
                awayTeam.Wins++;
                awayTeam.Points += 3;
                homeTeam.Losses++;
                match.WinnerId = awayTeam.Id;
            }
            else
            {
                homeTeam.Draws++;
                awayTeam.Draws++;
                homeTeam.Points += 1;
                awayTeam.Points += 1;
            }
        }
    }

    private List<TeamModel> PlayKnockoutRoundDB(List<TeamModel> qualifiedTeams, MatchStage stage)
    {
        _output.WriteLine($"\n--- {stage} ---");
        var matches = _context.Matches.Where(m => m.Stage == stage).OrderBy(m => m.Id).ToList();
        var random = new Random();
        var winners = new List<TeamModel>();

        // Fill bracket slots
        int teamIndex = 0;
        foreach (var match in matches)
        {
            if (teamIndex + 1 >= qualifiedTeams.Count) break;

            var home = qualifiedTeams[teamIndex];
            var away = qualifiedTeams[teamIndex + 1];
            teamIndex += 2;

            match.HomeTeamId = home.Id;
            match.HomeTeam = home;
            match.AwayTeamId = away.Id;
            match.AwayTeam = away;

            // Simulate Score
            int scoreH = random.Next(0, 4);
            int scoreA = random.Next(0, 4);

            if (scoreH == scoreA) // Penalties
            {
                 if (random.Next(0, 2) == 0) scoreH++; else scoreA++;
            }

            match.HomeTeamScore = scoreH;
            match.AwayTeamScore = scoreA;
            match.Status = MatchStatus.Finished;
            match.WinnerId = scoreH > scoreA ? home.Id : away.Id;
            match.Winner = scoreH > scoreA ? home : away;
            
            winners.Add(match.Winner);
            _output.WriteLine($"Match {match.Id}: {home.Name} vs {away.Name} -> {scoreH}-{scoreA} (Winner: {match.Winner.Name})");
        }

        return winners;
    }

    private List<TeamModel> GetKnockoutQualifiers(List<TeamModel> teams)
    {
        var advanced = new List<TeamModel>();
        var thirds = new List<TeamModel>();
        
        _output.WriteLine("Standings:");

        foreach (var group in teams.GroupBy(t => t.Group).OrderBy(g => g.Key))
        {
            var sorted = group.OrderByDescending(t => t.Points)
                              .ThenByDescending(t => t.GoalDifference)
                              .ThenByDescending(t => t.GoalsFor)
                              .ToList();
            
            _output.WriteLine($"Group {group.Key}: 1.{sorted[0].Name}({sorted[0].Points}) 2.{sorted[1].Name}({sorted[1].Points})");

            advanced.AddRange(sorted.Take(2));
            if (sorted.Count > 2) thirds.Add(sorted[2]);
        }

        var bestThirds = thirds.OrderByDescending(t => t.Points)
                               .ThenByDescending(t => t.GoalDifference)
                               .ThenByDescending(t => t.GoalsFor)
                               .Take(8)
                               .ToList();
                               
        advanced.AddRange(bestThirds);
        return advanced; 
    }
}
