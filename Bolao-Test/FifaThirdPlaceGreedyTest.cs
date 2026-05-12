using Xunit;
using Xunit.Abstractions;
using Bolao.Models;
using Bolao.Services;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;

namespace Bolao_Test;

public class FifaThirdPlaceGreedyTest
{
    private readonly ITestOutputHelper _output;

    public FifaThirdPlaceGreedyTest(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public void ResolveThirdPlaceMatchups_Should_Assign_Australia_To_Match_74_If_Rank_1()
    {
        // 1. Criar lista de 8 melhores (D é rank 1)
        var bestThirds = new List<TeamModel>
        {
            new TeamModel("Australia", "AUS", 'D') { Points = 0 }, // Rank 1
            new TeamModel("Argelia", "ALG", 'J') { Points = 0 },
            new TeamModel("Egito", "EGY", 'G') { Points = 0 },
            new TeamModel("Noruega", "NOR", 'I') { Points = 0 },
            new TeamModel("Panama", "PAN", 'L') { Points = 0 },
            new TeamModel("Costa do Marfim", "CIV", 'E') { Points = 0 },
            new TeamModel("Suecia", "SWE", 'F') { Points = 0 },
            new TeamModel("Republica Tcheca", "CZE", 'A') { Points = 0 }
        };

        // 2. Resolver
        var assignments = FifaThirdPlaceMatrix.ResolveThirdPlaceMatchups(bestThirds);

        // 3. Verificar
        assignments[74].Name.Should().Be("Australia");
        assignments[74].Group.Should().Be('D');
        
        _output.WriteLine("✅ Australia (D) atribuída corretamente ao jogo 74.");
    }

    [Fact]
    public void ResolveThirdPlaceMatchups_Should_Follow_Rank_Priority()
    {
        var bestThirds = new List<TeamModel>
        {
            new TeamModel("Time 1", "T1", 'A'), // Pode entrar no 74, 82
            new TeamModel("Time 2", "T2", 'B'), // Pode entrar no 74, 81
            new TeamModel("Time 3", "T3", 'C'), // Pode entrar no 74, 77, 79
            new TeamModel("Time 4", "T4", 'D'), // Pode entrar no 74, 77, 87
            new TeamModel("Time 5", "T5", 'F'), // Pode entrar no 74, 77, 79, 81, 85
            new TeamModel("Time 6", "T6", 'G'), // Pode entrar no 77, 85
            new TeamModel("Time 7", "T7", 'H'), // Pode entrar no 77, 79, 80, 82
            new TeamModel("Time 8", "T8", 'I')  // Pode entrar no 79, 80, 81, 82, 85, 87
        };

        var assignments = FifaThirdPlaceMatrix.ResolveThirdPlaceMatchups(bestThirds);

        // Match 74: ABCDF. Time 1 (A) é o melhor que cabe.
        assignments[74].Name.Should().Be("Time 1");
        
        // Match 77: CDFGH. Time 3 (C) é o melhor que cabe (Time 2 não cabe).
        assignments[77].Name.Should().Be("Time 3");

        _output.WriteLine("✅ Lógica de prioridade por Rank respeitada.");
    }
}
