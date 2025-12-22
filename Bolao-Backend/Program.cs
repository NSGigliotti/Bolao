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

//app.UseHttpsRedirection();

app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers();

app.Run();
