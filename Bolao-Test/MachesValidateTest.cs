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
using System.Threading.Tasks;
using FluentAssertions;
using System.Text;
using Bolao.Services;

namespace Bolao_Test;

public class MachesValidateTest : IAsyncLifetime
{
    private readonly ITestOutputHelper _output;
    private readonly BolaoDbContext _context;
    private readonly MachesRepository _repository;
    private readonly MachesValidate _machesValidate;

    public MachesValidateTest(ITestOutputHelper output)
    {
        _output = output;
        
        string currentDir = Directory.GetCurrentDirectory();
        string envPath = Path.Combine(currentDir, "..", ".env"); 
        if (!File.Exists(envPath)) envPath = Path.Combine(currentDir, ".env");
        
        if (File.Exists(envPath)) Env.Load(envPath);

        string dbPassword = Environment.GetEnvironmentVariable("MYSQL_PASSWORD");
        string dbUser = Environment.GetEnvironmentVariable("MYSQL_USER");
        string dbName = Environment.GetEnvironmentVariable("MYSQL_DATABASE"); 
        string dbPort = "3307"; 

        var connectionString = $"Server=localhost;Port={dbPort};Database={dbName};User={dbUser};Password={dbPassword};GuidFormat=Char36;AllowPublicKeyRetrieval=True;SslMode=None";
        
        var options = new DbContextOptionsBuilder<BolaoDbContext>()
            .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            .Options;
            
        _context = new BolaoDbContext(options);
        _repository = new MachesRepository(_context);
        _machesValidate = new MachesValidate();
    }

    public async Task InitializeAsync()
    {
        await _machesValidate.SeedTournament(_repository, _context);
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_Run_WorldCup_Simulation_Application()
    {
        // Executar a simulação completa via serviço
        string report = await _machesValidate.RunFullSimulation(_repository);
        
        // Logar o relatório no XUnit
        _output.WriteLine(report);
        
        // Salvar em arquivo para persistência
        await File.WriteAllTextAsync("../simulacao_report.md", report);

        // Asserções básicas de integridade
        var finalMatch = (await _repository.GetAllMatch()).First(m => m.Stage == MatchStage.Final);
        finalMatch.Status.Should().Be(MatchStatus.Finished);
        finalMatch.WinnerId.Should().NotBeNull();
    }
}
