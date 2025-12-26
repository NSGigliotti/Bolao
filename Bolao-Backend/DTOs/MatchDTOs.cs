using Bolao.Models;

public class MatchDto
{
    public string StageName { get; set; }
    public required List<MatchModel> Matchs { get; set; }
}