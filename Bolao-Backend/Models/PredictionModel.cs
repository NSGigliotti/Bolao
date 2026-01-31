using System;

namespace Bolao.Models;

public class PredictionModel
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public virtual UserModel User { get; set; } = null!;

    public int MatchId { get; set; }
    public virtual MatchModel Match { get; set; } = null!;

    public int? HomeTeamId { get; set; }
    [System.ComponentModel.DataAnnotations.Schema.ForeignKey("HomeTeamId")]
    public virtual TeamModel? HomeTeam { get; set; }

    public int HomeTeamScore { get; set; }

    public int? AwayTeamId { get; set; }
    [System.ComponentModel.DataAnnotations.Schema.ForeignKey("AwayTeamId")]
    public virtual TeamModel? AwayTeam { get; set; }

    public int AwayTeamScore { get; set; }
    public int PointsGained { get; set; }

    public PredictionModel() { }

    public PredictionModel(Guid userId, int matchId, int homeTeamScore, int awayTeamScore, int? homeTeamId, int? awayTeamId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        MatchId = matchId;
        HomeTeamScore = homeTeamScore;
        AwayTeamScore = awayTeamScore;
        HomeTeamId = homeTeamId;
        AwayTeamId = awayTeamId;
    }
}