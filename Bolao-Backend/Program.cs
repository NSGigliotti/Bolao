using Bolao.Data;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Bolao.Interfaces;
using Bolao.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;


DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var jwtSecret = builder.Configuration["JWT_SECRET_KEY"];
var jwtIssuer = builder.Configuration["JWT_ISSUER"] ?? "DefaultIssuer";
var jwtAudience = builder.Configuration["JWT_AUDIENCE"] ?? "DefaultAudience";

var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IMachesService, MachesService>();
builder.Services.AddScoped<IMachesRepository, MachesRepository>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => 
{

    options.Events = new JwtBearerEvents
{
    OnForbidden = context =>
    {
        context.Response.StatusCode = 403;
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsync("{\"error\": \"Acesso negado: Você não tem permissão de Administrador.\"}");
    }
};

    options.RequireHttpsMetadata = false; //! definir como true em produção
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,

        //RoleClaimType = "role"
    };
});


builder.Services.AddDbContext<BolaoDbContext>(options =>
{
   options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 36)), 
        mysqlOptions => 
        {
            mysqlOptions.EnableRetryOnFailure();
        }
    );
    
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var db = services.GetRequiredService<BolaoDbContext>();
    
    // Wait for DB to be ready
    var dbReady = false;
    var dbRetries = 20;
    while (!dbReady && dbRetries > 0)
    {
        try
        {
            using (var client = new System.Net.Sockets.TcpClient())
            {
                var result = client.BeginConnect("db", 3306, null, null);
                var success = result.AsyncWaitHandle.WaitOne(TimeSpan.FromSeconds(1));
                if (success)
                {
                    client.EndConnect(result);
                    dbReady = true;
                    logger.LogInformation("Successfully connected to database server.");
                }
                else
                {
                    throw new Exception("Timed out");
                }
            }
        }
        catch
        {
            dbRetries--;
            logger.LogWarning("Waiting for database server to be ready ({Retries} attempts left)...", dbRetries);
            Thread.Sleep(2000);
        }
    }

    var retries = 10;
    while (retries > 0 && dbReady)
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
            if (retries > 0)
            {
                logger.LogWarning("Migration failed: {Message}. Waiting 3s before retry. Retries remaining: {Retries}", ex.Message, retries);
                Thread.Sleep(3000);
            }
            else
            {
                logger.LogError(ex, "Migration failed permanently.");
                throw;
            }
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers();

app.Run();
