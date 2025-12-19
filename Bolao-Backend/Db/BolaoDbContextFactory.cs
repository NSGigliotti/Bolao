using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using DotNetEnv;

namespace Bolao.Data ;

    public class BolaoDbContextFactory : IDesignTimeDbContextFactory<BolaoDbContext>
    {
        public BolaoDbContext CreateDbContext(string[] args)
        {
            // Carregar variáveis do .env (procurar no diretório atual e no pai)
            var currentDir = Directory.GetCurrentDirectory();
            var envPath = Path.Combine(currentDir, ".env");
            
            if (!File.Exists(envPath))
            {
                var parentDir = Directory.GetParent(currentDir)?.FullName;
                if (parentDir != null)
                {
                    envPath = Path.Combine(parentDir, ".env");
                }
            }
            
            if (File.Exists(envPath))
            {
                DotNetEnv.Env.Load(envPath);
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            // Substituir placeholders pelas variáveis de ambiente
            connectionString = connectionString
                .Replace("${MYSQL_DATABASE}", Environment.GetEnvironmentVariable("MYSQL_DATABASE") ?? "bolao_db")
                .Replace("${MYSQL_USER}", Environment.GetEnvironmentVariable("MYSQL_USER") ?? "bolao_user")
                .Replace("${MYSQL_PASSWORD}", Environment.GetEnvironmentVariable("MYSQL_PASSWORD") ?? "");

            var optionsBuilder = new DbContextOptionsBuilder<BolaoDbContext>();
            
            optionsBuilder.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString) 
            );
            return new BolaoDbContext(optionsBuilder.Options);
        }
    }
