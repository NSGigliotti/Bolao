using Bolao.Models;

namespace Bolao.DTOs;

public class MakePredictionDTOs
{
    public int MatchId { get; set; }

    public int IdHomeTeam { get; set; }
    public string HomeTeamName { get; set; }
    public int HomeTeamScore { get; set; }
    public int IdAwayTeam { get; set; }
    public string AwayTeamName { get; set; }
    public int AwayTeamScore { get; set; }
}