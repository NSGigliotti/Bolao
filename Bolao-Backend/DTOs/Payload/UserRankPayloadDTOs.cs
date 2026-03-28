namespace Bolao.DTOs;

public class UserRankPayloadDTOs
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
    public PaymentStatus Status { get; set; }

    public UserRankPayloadDTOs(Guid id, string name, int score, PaymentStatus status)
    {
        Id = id;
        Name = name;
        Score = score;
        Status = status;
    }
}