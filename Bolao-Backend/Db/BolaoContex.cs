using Bolao.Models;
using Microsoft.EntityFrameworkCore;

namespace Bolao.Data;

public class BolaoDbContext : DbContext
{
    public BolaoDbContext(DbContextOptions<BolaoDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserModel>(entity =>
        {
            entity.Property(e => e.IsAdmin).HasColumnName("IsAdmin").IsRequired();
        });

        modelBuilder.Entity<PredictionModel>(entity =>
      {
          entity.Property(p => p.UserId).HasColumnType("char(36)").IsRequired();
      });

        modelBuilder.Entity<UserModel>().Property(u => u.Id).HasColumnType("char(36)");

        modelBuilder.Entity<MatchModel>(entity =>
        {
            entity.HasOne(m => m.HomeTeam).WithMany().HasForeignKey(m => m.HomeTeamId).OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.AwayTeam).WithMany().HasForeignKey(m => m.AwayTeamId).OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.Winner).WithMany().HasForeignKey(m => m.WinnerId).IsRequired(false);
        });
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<TeamModel> Teams { get; set; }
    public DbSet<MatchModel> Matches { get; set; }
    public DbSet<PredictionModel> Prediction { get; set; }
}