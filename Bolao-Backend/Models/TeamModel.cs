namespace Bolao.Models;

public class TeamModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Abbreviation { get; set; }
    public string? FlagUrl { get; set; }
    public char Group { get; set; }

    public int Points { get; set; }
    public int GamesPlayed { get; set; }
    public int Wins { get; set; }
    public int Draws { get; set; }
    public int Losses { get; set; }

    // Gols
    public int GoalsFor { get; set; }
    public int GoalsAgainst { get; set; }

    public int GoalDifference => GoalsFor - GoalsAgainst;

    public TeamModel() { }

    public TeamModel(string name, string abbreviation, char group, string? flagUrl = null)
    {
        Name = name;
        Abbreviation = abbreviation;
        Group = group;
        FlagUrl = flagUrl;

        Points = 0;
        GamesPlayed = 0;
        Wins = 0;
        Draws = 0;
        Losses = 0;
        GoalsFor = 0;
        GoalsAgainst = 0;
    }
}
