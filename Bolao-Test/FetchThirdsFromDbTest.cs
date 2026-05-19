using Xunit;
using Xunit.Abstractions;
using Bolao.Models;
using Bolao.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bolao.Services;
using System.IO;
using DotNetEnv;
using System;

namespace Bolao_Test;

public class FetchThirdsFromDbTest
{
    private readonly ITestOutputHelper _output;
    private readonly BolaoDbContext _context;
    private readonly MachesRepository _repository;
    private readonly MachesValidate _machesValidate;

    public FetchThirdsFromDbTest(ITestOutputHelper output)
    {
        _output = output;
        string currentDir = Directory.GetCurrentDirectory();
        string envPath = Path.Combine(currentDir, "..", ".env"); 
        if (!File.Exists(envPath)) envPath = Path.Combine(currentDir, ".env");
        if (File.Exists(envPath)) Env.Load(envPath);

        string dbPassword = Environment.GetEnvironmentVariable("MYSQL_PASSWORD") ?? "root";
        string dbUser = Environment.GetEnvironmentVariable("MYSQL_USER") ?? "root";
        string dbName = Environment.GetEnvironmentVariable("MYSQL_DATABASE") ?? "bolao"; 
        string dbPort = "3307"; 

        var connectionString = $"Server=localhost;Port={dbPort};Database={dbName};User={dbUser};Password={dbPassword};GuidFormat=Char36;AllowPublicKeyRetrieval=True;SslMode=None";
        
        var options = new DbContextOptionsBuilder<BolaoDbContext>()
            .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            .Options;
            
        _context = new BolaoDbContext(options);
        _repository = new MachesRepository(_context);
        _machesValidate = new MachesValidate();
    }

    [Fact]
    public async Task Show_Ranked_Thirds_A_B_C_D_F()
    {
        var allTeams = await _context.Teams.ToListAsync();
        var allMatches = await _context.Matches.Where(m => m.Status == Bolao.Enum.MatchStatus.Finished).ToListAsync();

        // Reset stats to ensure fresh calculation
        foreach (var t in allTeams) {
            t.Points = 0; t.GoalsFor = 0; t.GoalsAgainst = 0; t.YellowCards = 0; t.RedCards = 0;
        }

        // Simulate stats from matches (assuming matches are in DB)
        foreach (var m in allMatches.Where(m => m.IsGroupStage))
        {
            var home = allTeams.FirstOrDefault(t => t.Id == m.HomeTeamId);
            var away = allTeams.FirstOrDefault(t => t.Id == m.AwayTeamId);
            if (home == null || away == null) continue;

            home.GoalsFor += m.HomeTeamScore ?? 0;
            home.GoalsAgainst += m.AwayTeamScore ?? 0;
            away.GoalsFor += m.AwayTeamScore ?? 0;
            away.GoalsAgainst += m.HomeTeamScore ?? 0;

            if (m.HomeTeamScore > m.AwayTeamScore) home.Points += 3;
            else if (m.AwayTeamScore > m.HomeTeamScore) away.Points += 3;
            else { home.Points += 1; away.Points += 1; }
        }

        char[] targetGroups = { 'A', 'B', 'C', 'D', 'F' };
        var thirds = new List<TeamModel>();

        _output.WriteLine("=== STANDINGS DOS GRUPOS SELECIONADOS ===");
        foreach (var g in targetGroups)
        {
            var groupTeams = allTeams.Where(t => t.Group == g).ToList();
            // Using the SortByFifaCriteria which now uses the simplified 5 rules
            var sorted = _machesValidate.InvokePrivateMethod<List<TeamModel>>("SortByFifaCriteria", groupTeams, allMatches);
            
            _output.WriteLine($"\nGrupo {g}:");
            for(int i=0; i<sorted.Count; i++) {
                var t = sorted[i];
                _output.WriteLine($"{i+1}º: {t.Name} - Pts: {t.Points}, SG: {t.GoalDifference}, GP: {t.GoalsFor}");
            }

            if (sorted.Count >= 3) thirds.Add(sorted[2]);
        }

        var rankedThirds = thirds
            .OrderByDescending(t => t.Points)
            .ThenByDescending(t => t.GoalDifference)
            .ThenByDescending(t => t.GoalsFor)
            .ThenByDescending(t => (t.YellowCards * -1) + (t.RedCards * -3))
            .ThenByDescending(t => _machesValidate.InvokePrivateMethod<double>("GetFifaRanking", t.Name))
            .ToList();

        _output.WriteLine("\n\n=== RANKING DOS TERCEIROS (A, B, C, D, F) ===");
        _output.WriteLine("| Pos | Grupo | Seleção          | Pts | SG | GP | FP |");
        for (int i = 0; i < rankedThirds.Count; i++)
        {
            var t = rankedThirds[i];
            int fp = (t.YellowCards * -1) + (t.RedCards * -3);
            _output.WriteLine($"| {i+1}º  |  {t.Group}    | {t.Name,-16} | {t.Points,3} | {t.GoalDifference,2} | {t.GoalsFor,2} | {fp,2} |");
        }
    }
}

public static class ReflectionExtensions
{
    public static T InvokePrivateMethod<T>(this object obj, string methodName, params object[] args)
    {
        var method = obj.GetType().GetMethod(methodName, System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
        return (T)method.Invoke(obj, args);
    }
}
