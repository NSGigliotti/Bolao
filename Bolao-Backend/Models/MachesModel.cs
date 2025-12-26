using System;
using Bolao.Enum;

namespace Bolao.Models;

public class MatchModel
{
    public int Id { get; set; } 
    public DateTime MatchDate { get; set; }
    public MatchStage Stage { get; set; }
    public int? Round { get; set; }
    public MatchStatus Status { get; set; } = MatchStatus.NotStarted;

    public int HomeTeamId { get; set; }
    public virtual TeamModel HomeTeam { get; set; } = null!;
    public int? HomeTeamScore { get; set; }

    public int AwayTeamId { get; set; }
    public virtual TeamModel AwayTeam { get; set; } = null!;
    public int? AwayTeamScore { get; set; }

    public int? WinnerId { get; set; }

    public virtual TeamModel? Winner { get; set; }

    public bool IsGroupStage => Stage == MatchStage.GroupStageRound1;
    
}



