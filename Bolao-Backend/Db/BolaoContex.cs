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
            entity.Property(e => e.IsAdmin)
                  .HasColumnName("IsAdmin")
                  .IsRequired();
        });

        modelBuilder.Entity<MatchModel>(entity =>
    {
        entity.Property(e => e.HomeTeamId).HasColumnType("char(36)");
        entity.Property(e => e.AwayTeamId).HasColumnType("char(36)");
        entity.Property(e => e.WinnerId).HasColumnType("char(36)");
    });
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<TeamModel> Teams { get; set; }
    public DbSet<MatchModel> Matches { get; set; }
}