using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Bolao.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class JwtService
{
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;

    public JwtService(IConfiguration configuration)
    {
        _jwtSecret = configuration["JWT_SECRET_KEY"] ?? throw new InvalidOperationException("A chave 'JWT_SECRET_KEY' não está configurada.");
        _jwtIssuer = configuration["JWT_ISSUER"] ?? "DefaultIssuer";
        _jwtAudience = configuration["JWT_AUDIENCE"] ?? "DefaultAudience";
    }

    public string GenerateToken(UserModel user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);

        Console.WriteLine("ISADMIN : " + user.IsAdmin);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = _jwtIssuer,
            Audience = _jwtAudience,
            Expires = DateTime.UtcNow.AddYears(100),
            SigningCredentials = new SigningCredentials(
        new SymmetricSecurityKey(key),
        SecurityAlgorithms.HmacSha256Signature
    ),
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }



}