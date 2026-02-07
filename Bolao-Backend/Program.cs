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

builder.Services.AddCors(options =>
{

    //  options.AddPolicy("AllowFrontend",
    //     builder =>
    //     {
    //         builder.WithOrigins("http://localhost:3000", "http://localhost:5173")
    //                .AllowAnyHeader()
    //                .AllowAnyMethod();
    //     });
    options.AddPolicy("LocalTunnelPolicy", policy =>
    {
        policy.AllowAnyOrigin() 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("bypass-tunnel-reminder"); 
    });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Bolao API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Insira o token JWT aqui ex: Bearer 12345abcdef"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var jwtSecret = builder.Configuration["JWT_SECRET_KEY"];
if (string.IsNullOrEmpty(jwtSecret))
{
    jwtSecret = "temporary_secret_key_for_development_and_migrations_only_12345";
}
var jwtIssuer = builder.Configuration["JWT_ISSUER"] ?? "DefaultIssuer";
var jwtAudience = builder.Configuration["JWT_AUDIENCE"] ?? "DefaultAudience";

var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IMachesService, MachesService>();
builder.Services.AddScoped<IMachesRepository, MachesRepository>();
builder.Services.AddScoped<MachesValidate>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true, // Ele verificará a data de 100 anos
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT_ISSUER"] ?? "DefaultIssuer",
        ValidAudience = builder.Configuration["JWT_AUDIENCE"] ?? "DefaultAudience",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT_SECRET_KEY"])),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnForbidden = context =>
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync("{\"error\": \"Acesso negado: Você não tem permissão de Administrador.\"}");
        }
    };

    options.RequireHttpsMetadata = true; //! definir como true em produção
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

app.UseCors("LocalTunnelPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
