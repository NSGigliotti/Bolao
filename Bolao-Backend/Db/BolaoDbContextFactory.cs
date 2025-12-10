using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Bolao.Data ;

    public class BolaoDbContextFactory : IDesignTimeDbContextFactory<BolaoDbContext>
    {
        public BolaoDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<BolaoDbContext>();
            
            optionsBuilder.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString) 
            );
            return new BolaoDbContext(optionsBuilder.Options);
        }
    }
