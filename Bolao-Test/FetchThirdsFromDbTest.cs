using Xunit;
using Xunit.Abstractions;
using Bolao.Models;
using Bolao.Data;
using Bolao.Services;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bolao_Test;

public class FetchThirdsFromDbTest
{
    private readonly ITestOutputHelper _output;

    public FetchThirdsFromDbTest(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public async Task Fetch_Thirds_Directly_From_All_Possible_Ports()
    {
        int[] ports = { 3306, 3307 };
        foreach (var port in ports) {
            _output.WriteLine($"\n--- TRYING PORT {port} ---");
            try {
                await TryFetch(port);
            } catch (Exception ex) {
                _output.WriteLine($"Error on port {port}: {ex.Message}");
            }
        }
    }

    private async Task TryFetch(int port)
    {
        string currentDir = Directory.GetCurrentDirectory();
        string envPath = Path.Combine(currentDir, "..", "..", "..", ".env"); // Tenta subir mais níveis se necessário
        if (!File.Exists(envPath)) envPath = Path.Combine(currentDir, "..", ".env");
        if (!File.Exists(envPath)) envPath = Path.Combine(currentDir, ".env");
        
        if (File.Exists(envPath)) Env.Load(envPath);

        string dbPassword = Environment.GetEnvironmentVariable("MYSQL_PASSWORD") ?? "bolao_password";
        string dbUser = Environment.GetEnvironmentVariable("MYSQL_USER") ?? "bolao_user";
        string dbName = Environment.GetEnvironmentVariable("MYSQL_DATABASE") ?? "bolao_db"; 

        var connectionString = $"Server=localhost;Port={port};Database={dbName};User={dbUser};Password={dbPassword};GuidFormat=Char36;AllowPublicKeyRetrieval=True;SslMode=None";
        
        var options = new DbContextOptionsBuilder<BolaoDbContext>()
            .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            .Options;
            
        using var context = new BolaoDbContext(options);
        
        var allTeams = await context.Teams.ToListAsync();
        var allMatches = await context.Matches.ToListAsync();

        _output.WriteLine($"Total Teams Found: {allTeams.Count}");
        _output.WriteLine($"Total Matches Found: {allMatches.Count}");
        
        var finishedMatches = allMatches.Where(m => m.Status == Bolao.Enum.MatchStatus.Finished || m.HomeTeamScore.HasValue).ToList();
        _output.WriteLine($"Total Matches with Results: {finishedMatches.Count}");
        
        var grouped = allMatches.GroupBy(m => m.Stage);
        foreach (var g in grouped) {
            string stageName = g.Key switch
            {
                Bolao.Enum.MatchStage.GroupStageRound1 => "1ª Rodada (Fase de Grupos)",
                Bolao.Enum.MatchStage.GroupStageRound2 => "2ª Rodada (Fase de Grupos)",
                Bolao.Enum.MatchStage.GroupStageRound3 => "3ª Rodada (Fase de Grupos)",
                _ => "Other"
            };
            _output.WriteLine($"Stage {g.Key}: {g.Count()} matches, Name: {stageName}");
        }

        if (finishedMatches.Count == 0) {
             _output.WriteLine("Warning: No results found in database for this port.");
             return;
        }

        // Limpar stats para recalculate fielmente do banco
        foreach (var t in allTeams) {
            t.Points = 0; t.GamesPlayed = 0; t.Wins = 0; t.GoalsFor = 0; t.GoalsAgainst = 0;
        }

        // Recalcular stats baseada nos jogos com resultado
        foreach (var m in finishedMatches.Where(m => m.IsGroupStage)) {
             var home = allTeams.FirstOrDefault(t => t.Id == m.HomeTeamId);
             var away = allTeams.FirstOrDefault(t => t.Id == m.AwayTeamId);
             if (home == null || away == null || !m.HomeTeamScore.HasValue || !m.AwayTeamScore.HasValue) continue;
             
             home.GamesPlayed++; away.GamesPlayed++;
             home.GoalsFor += m.HomeTeamScore.Value; home.GoalsAgainst += m.AwayTeamScore.Value;
             away.GoalsFor += m.AwayTeamScore.Value; away.GoalsAgainst += m.HomeTeamScore.Value;
             
             if (m.HomeTeamScore > m.AwayTeamScore) { home.Points += 3; home.Wins++; }
             else if (m.HomeTeamScore < m.AwayTeamScore) { away.Points += 3; away.Wins++; }
             else { home.Points += 1; away.Points += 1; }
        }

        var groups = "ABCDFGHIKL".ToCharArray(); // Pega mais grupos para garantir
        var results = new List<(TeamModel Team, double Rank)>();

        _output.WriteLine("\n[STANDINGS FROM DB]");
        foreach (var gChar in groups) {
            var groupTeams = allTeams.Where(t => t.Group == gChar).ToList();
            if (!groupTeams.Any()) continue;

            var sorted = groupTeams.OrderByDescending(t => t.Points)
                                   .ThenByDescending(t => t.GoalsFor - t.GoalsAgainst)
                                   .ThenByDescending(t => t.Wins)
                                   .ThenByDescending(t => t.GoalsFor)
                                   .ToList();
            
            _output.WriteLine($"Group {gChar}:");
            foreach(var t in sorted) {
                _output.WriteLine($"  {t.Name}: {t.Points}pts, SG {t.GoalsFor - t.GoalsAgainst}");
            }

            var third = sorted.ElementAtOrDefault(2);
            if (third != null && "ABCDF".Contains(gChar)) {
                double rank = GetRankingRobust(third.Name);
                results.Add((third, rank));
            }
        }

        _output.WriteLine("\n[FINAL LIST OF THIRDS SORTED BY RANK]");
        foreach (var res in results.OrderByDescending(r => r.Rank)) {
            _output.WriteLine($"{res.Team.Group}|{res.Team.Name}|{res.Team.Points}|{res.Team.GoalDifference}|{res.Team.GoalsFor}|{res.Rank:F2}");
        }
    }

    [Fact]
    public async Task Seed_Database()
    {
        int port = 3307; // Use specific port for seeding
        string currentDir = Directory.GetCurrentDirectory();
        string envPath = Path.Combine(currentDir, "..", "..", "..", ".env");
        if (!File.Exists(envPath)) envPath = Path.Combine(currentDir, "..", ".env");
        if (!File.Exists(envPath)) envPath = Path.Combine(currentDir, ".env");
        
        if (File.Exists(envPath)) Env.Load(envPath);

        string dbPassword = Environment.GetEnvironmentVariable("MYSQL_PASSWORD") ?? "bolao_password";
        string dbUser = Environment.GetEnvironmentVariable("MYSQL_USER") ?? "bolao_user";
        string dbName = Environment.GetEnvironmentVariable("MYSQL_DATABASE") ?? "bolao_db"; 

        var connectionString = $"Server=localhost;Port={port};Database={dbName};User={dbUser};Password={dbPassword};GuidFormat=Char36;AllowPublicKeyRetrieval=True;SslMode=None;AllowUserVariables=True";
        
        var options = new DbContextOptionsBuilder<BolaoDbContext>()
            .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            .Options;
            
        using var context = new BolaoDbContext(options);

        _output.WriteLine("Deleting existing data...");
        await context.Database.ExecuteSqlRawAsync("SET FOREIGN_KEY_CHECKS = 0;");
        await context.Database.ExecuteSqlRawAsync("DELETE FROM Prediction;");
        await context.Database.ExecuteSqlRawAsync("DELETE FROM Matches;");
        await context.Database.ExecuteSqlRawAsync("DELETE FROM Teams;");
        await context.Database.ExecuteSqlRawAsync("SET FOREIGN_KEY_CHECKS = 1;");

        _output.WriteLine("Reading init-teams.sql...");
        string sqlPath = "";
        string tempPath = currentDir;
        for (int i = 0; i < 6; i++)
        {
            sqlPath = Path.Combine(tempPath, "Bolao-Backend", "Db", "scripts", "init-teams.sql");
            if (File.Exists(sqlPath)) break;
            tempPath = Path.Combine(tempPath, "..");
        }
        
        if (!File.Exists(sqlPath)) throw new Exception($"Could not find init-teams.sql at {sqlPath}");
        
        string sql = await File.ReadAllTextAsync(sqlPath);
        
        _output.WriteLine("Executing seeding script...");
        // Split by semicolon and filter out empty strings to avoid multi-statement issues if provider doesn't support them well
        // However, for seeding, we need to be careful with the (SELECT Id...) subqueries.
        // Actually, for MySQL, we can just run the whole thing if we use a raw command.
        
        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync();
        using var command = connection.CreateCommand();
        command.CommandText = sql;
        await command.ExecuteNonQueryAsync();
        
        var teamCount = await context.Teams.CountAsync();
        var matchCount = await context.Matches.CountAsync();
        _output.WriteLine($"Seeding completed successfully! Teams: {teamCount}, Matches: {matchCount}");
    }

    private double GetRankingRobust(string name) {
        if (string.IsNullOrWhiteSpace(name)) return 0;
        var cleanName = name.Trim();
        if (Bolao.Config.FifaRankingsConfig.Points.TryGetValue(cleanName, out var p)) return p;
        
        // Tenta sem acentos se falhar (ex: Republica Tcheca)
        var fallbackName = cleanName.Replace("é", "e").Replace("ú", "u").Replace("á", "a").Replace("í", "i").Replace("ã", "a");
        foreach(var kv in Bolao.Config.FifaRankingsConfig.Points) {
            var keyClean = kv.Key.Replace("é", "e").Replace("ú", "u").Replace("á", "a").Replace("í", "i").Replace("ã", "a");
            if (string.Equals(keyClean, fallbackName, StringComparison.OrdinalIgnoreCase)) return kv.Value;
        }
        return 0;
    }
}
