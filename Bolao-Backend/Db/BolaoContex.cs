using Bolao.Models;
using Microsoft.EntityFrameworkCore;

namespace Bolao.Data;

public class BolaoDbContext : DbContext
{
    public BolaoDbContext (DbContextOptions<BolaoDbContext> options) : base(options)
    {
    }

    public DbSet<UserModel> Users {get; set;}
}