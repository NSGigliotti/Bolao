using System;

namespace Bolao.Models;

public class PredictionModel
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public virtual UserModel User { get; set; } = null!;

    public int MatchId { get; set; }
    public virtual MatchModel Match { get; set; } = null!;

    public int HomeTeamScore { get; set; }
    public int AwayTeamScore { get; set; }

    public PredictionModel(Guid userId) { }

    public PredictionModel(Guid userId, int matchId, int homeTeamScore, int awayTeamScore)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        MatchId = matchId;
        HomeTeamScore = homeTeamScore;
        AwayTeamScore = awayTeamScore;
    }
}