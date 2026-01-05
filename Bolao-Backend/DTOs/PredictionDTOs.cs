using Bolao.Models;

public class PredictionDTOs
{
    public Guid Id { get; set; }

    public int UserId { get; set; }
    public virtual UserModel User { get; set; } = null!;

    public int MatchId { get; set; }
    public virtual MatchModel Match { get; set; } = null!;

    public int HomeTeamScore { get; set; }
    public int AwayTeamScore { get; set; }
}