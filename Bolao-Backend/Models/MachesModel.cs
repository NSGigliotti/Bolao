using System;
using Bolao.Enum;

namespace Bolao.Models;

public class MatchModel
{
    public int Id { get; set; } 
    public DateTime MatchDate { get; set; }
    public MatchStage Stage { get; set; }
    public MatchStatus Status { get; set; } = MatchStatus.NotStarted;

    public Guid HomeTeamId { get; set; }
    public virtual TeamModel HomeTeam { get; set; } = null!;
    public int? HomeTeamScore { get; set; }

    public Guid AwayTeamId { get; set; }
    public virtual TeamModel AwayTeam { get; set; } = null!;
    public int? AwayTeamScore { get; set; }

    public Guid? WinnerId { get; set; }

    public bool IsGroupStage => Stage == MatchStage.GroupStage;
}



