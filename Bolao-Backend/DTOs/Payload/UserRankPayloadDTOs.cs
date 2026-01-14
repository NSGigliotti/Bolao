namespace Bolao.DTOs;

public class UserRankPayloadDTOs
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }

    public UserRankPayloadDTOs(Guid id, string name, int score)
    {
        Id = id;
        Name = name;
        Score = score;
    }
}