using Xunit;
using Moq;
using Bolao.DTOs;
using Bolao.Models;
using Bolao.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

public class ResultMachesTest
{
    private readonly Mock<IMachesRepository> _matchesRepositoryMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly MachesService _matchesService;

    public ResultMachesTest()
    {
        _matchesRepositoryMock = new Mock<IMachesRepository>();
        _userRepositoryMock = new Mock<IUserRepository>();
        _matchesService = new MachesService(_matchesRepositoryMock.Object, _userRepositoryMock.Object);
    }

    [Fact]
    public async Task ResultUpdate_MatchNotFound_ReturnsError()
    {
        // Arrange
        var dto = new ResultUpdateDTOs { MachID = 1 };
        _matchesRepositoryMock.Setup(x => x.GetMatchAsync(dto.MachID))
            .ReturnsAsync((MatchModel)null);

        // Act
        var result = await _matchesService.ResultUpdate(dto);

        // Assert
        Assert.Equal("Partida não encontrada", result);
    }

    [Fact]
    public async Task ResultUpdate_ExactScore_Award3Points()
    {
        // Arrange
        var matchId = 1;
        var dto = new ResultUpdateDTOs { MachID = matchId, HomeTeamScore = 2, AwayTeamScore = 1 };
        var match = new MatchModel { Id = matchId };
        var prediction = new PredictionModel(Guid.NewGuid()) { MatchId = matchId, HomeTeamScore = 2, AwayTeamScore = 1, PointsGained = 0 };
        var predictions = new List<PredictionModel> { prediction };

        _matchesRepositoryMock.Setup(x => x.GetMatchAsync(matchId)).ReturnsAsync(match);
        _matchesRepositoryMock.Setup(x => x.GetAllPedicitonByMachsId(matchId)).ReturnsAsync(predictions);

        // Act
        var result = await _matchesService.ResultUpdate(dto);

        // Assert
        Assert.Equal(3, prediction.PointsGained);
        _matchesRepositoryMock.Verify(x => x.UpdateMatchAsync(It.Is<MatchModel>(m => m.HomeTeamScore == 2 && m.AwayTeamScore == 1)), Times.Once);
        _matchesRepositoryMock.Verify(x => x.UpdatePredictionAsync(prediction), Times.Once);
        Assert.Equal("Placares e pontuações atualizados com sucesso", result);
    }

    [Fact]
    public async Task ResultUpdate_CorrectWinner_Award1Point()
    {
        // Arrange
        var matchId = 1;
        // Official: Home wins 2-0
        var dto = new ResultUpdateDTOs { MachID = matchId, HomeTeamScore = 2, AwayTeamScore = 0 }; 
        var match = new MatchModel { Id = matchId };
        
        // Prediction: Home wins 1-0 (Correct winner, wrong score)
        var prediction = new PredictionModel(Guid.NewGuid()) { MatchId = matchId, HomeTeamScore = 1, AwayTeamScore = 0, PointsGained = 0 };
        var predictions = new List<PredictionModel> { prediction };

        _matchesRepositoryMock.Setup(x => x.GetMatchAsync(matchId)).ReturnsAsync(match);
        _matchesRepositoryMock.Setup(x => x.GetAllPedicitonByMachsId(matchId)).ReturnsAsync(predictions);

        // Act
        await _matchesService.ResultUpdate(dto);

        // Assert
        Assert.Equal(1, prediction.PointsGained);
        _matchesRepositoryMock.Verify(x => x.UpdatePredictionAsync(prediction), Times.Once);
    }

    [Fact]
    public async Task ResultUpdate_CorrectDraw_Award1Point()
    {
        // Arrange
        var matchId = 1;
        // Official: Draw 1-1
        var dto = new ResultUpdateDTOs { MachID = matchId, HomeTeamScore = 1, AwayTeamScore = 1 }; 
        var match = new MatchModel { Id = matchId };
        
        // Prediction: Draw 0-0 (Correct result "Draw", wrong score)
        var prediction = new PredictionModel(Guid.NewGuid()) { MatchId = matchId, HomeTeamScore = 0, AwayTeamScore = 0, PointsGained = 0 };
        var predictions = new List<PredictionModel> { prediction };

        _matchesRepositoryMock.Setup(x => x.GetMatchAsync(matchId)).ReturnsAsync(match);
        _matchesRepositoryMock.Setup(x => x.GetAllPedicitonByMachsId(matchId)).ReturnsAsync(predictions);

        // Act
        await _matchesService.ResultUpdate(dto);

        // Assert
        Assert.Equal(1, prediction.PointsGained);
        _matchesRepositoryMock.Verify(x => x.UpdatePredictionAsync(prediction), Times.Once);
    }

    [Fact]
    public async Task ResultUpdate_WrongPrediction_Award0Points()
    {
        // Arrange
        var matchId = 1;
        // Official: Home wins 2-1
        var dto = new ResultUpdateDTOs { MachID = matchId, HomeTeamScore = 2, AwayTeamScore = 1 }; 
        var match = new MatchModel { Id = matchId };
        
        // Prediction: Away wins 0-1
        var prediction = new PredictionModel(Guid.NewGuid()) { MatchId = matchId, HomeTeamScore = 0, AwayTeamScore = 1, PointsGained = 0 };
        var predictions = new List<PredictionModel> { prediction };

        _matchesRepositoryMock.Setup(x => x.GetMatchAsync(matchId)).ReturnsAsync(match);
        _matchesRepositoryMock.Setup(x => x.GetAllPedicitonByMachsId(matchId)).ReturnsAsync(predictions);

        // Act
        await _matchesService.ResultUpdate(dto);

        // Assert
        Assert.Equal(0, prediction.PointsGained);
        _matchesRepositoryMock.Verify(x => x.UpdatePredictionAsync(prediction), Times.Once);
    }

    [Fact]
    public async Task ResultUpdate_MultiplePredictions_UpdatesAllCorrectly()
    {
        // Arrange
        var matchId = 1;
        // Official: Home wins 2-1
        var dto = new ResultUpdateDTOs { MachID = matchId, HomeTeamScore = 2, AwayTeamScore = 1 };
        var match = new MatchModel { Id = matchId };

        var p1 = new PredictionModel(Guid.NewGuid()) { MatchId = matchId, HomeTeamScore = 2, AwayTeamScore = 1, PointsGained = 0 }; // Exact score (3 pts)
        var p2 = new PredictionModel(Guid.NewGuid()) { MatchId = matchId, HomeTeamScore = 1, AwayTeamScore = 0, PointsGained = 0 }; // Correct winner (1 pt)
        var p3 = new PredictionModel(Guid.NewGuid()) { MatchId = matchId, HomeTeamScore = 0, AwayTeamScore = 1, PointsGained = 0 }; // Wrong (0 pts)

        var predictions = new List<PredictionModel> { p1, p2, p3 };

        _matchesRepositoryMock.Setup(x => x.GetMatchAsync(matchId)).ReturnsAsync(match);
        _matchesRepositoryMock.Setup(x => x.GetAllPedicitonByMachsId(matchId)).ReturnsAsync(predictions);

        // Act
        await _matchesService.ResultUpdate(dto);

        // Assert
        Assert.Equal(3, p1.PointsGained);
        Assert.Equal(1, p2.PointsGained);
        Assert.Equal(0, p3.PointsGained);
        _matchesRepositoryMock.Verify(x => x.UpdatePredictionAsync(It.IsAny<PredictionModel>()), Times.Exactly(3));
    }
}
