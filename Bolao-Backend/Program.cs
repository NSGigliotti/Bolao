using Bolao.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<BolaoDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 36)), 
        mysqlOptions => mysqlOptions.EnableRetryOnFailure()
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var db = services.GetRequiredService<BolaoDbContext>();
    
    var retries = 10;
    while (retries > 0)
    {
        try
        {
            logger.LogInformation("Attempting to migrate database...");
            db.Database.Migrate();
            logger.LogInformation("Database migrated successfully.");
            break;
        }
        catch (Exception ex)
        {
            retries--;
            logger.LogError(ex, "Migration failed. Retries remaining: {Retries}", retries);
            if (retries == 0) throw;
            Thread.Sleep(3000);
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
