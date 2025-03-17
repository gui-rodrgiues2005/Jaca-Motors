using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Models;
using backend.Data;
using backend.DTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            try
            {
                var empresaExistente = await _context.Empresa
                    .FirstOrDefaultAsync(e => e.CNPJ == model.CNPJ);

                if (empresaExistente != null)
                {
                    return BadRequest("CNPJ já cadastrado");
                }

                var empresa = new Empresa
                {
                    Nome = model.Nome,
                    NomeDono = model.NomeDono,
                    CNPJ = model.CNPJ,
                    Telefone = model.Telefone,
                    Senha = BCrypt.Net.BCrypt.HashPassword(model.Senha),
                    Endereco = new Endereco
                    {
                        Logradouro = model.Endereco.Logradouro,
                        Numero = model.Endereco.Numero,
                        Bairro = model.Endereco.Bairro,
                        Cidade = model.Endereco.Cidade,
                        Estado = model.Endereco.Estado,
                        CEP = model.Endereco.CEP
                    }
                };

                await _context.Empresa.AddAsync(empresa);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Empresa cadastrada com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar empresa", error = ex.InnerException?.Message ?? ex.Message });
            }

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            try
            {
                var empresa = await _context.Empresa
                    .Include(e => e.Endereco)
                    .FirstOrDefaultAsync(e => e.CNPJ == model.CNPJ);

                if (empresa == null || !BCrypt.Net.BCrypt.Verify(model.Senha, empresa.Senha))
                {
                    return BadRequest("CNPJ ou senha inválidos");
                }

                var token = GerarToken(empresa);

                return Ok(new
                {
                    token = token,
                    empresa = new
                    {
                        id = empresa.EmpresaID,
                        nomeEmpresa = empresa.Nome,
                        nomeDono = empresa.NomeDono,
                        cnpj = empresa.CNPJ,
                        endereco = empresa.Endereco
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao realizar login", error = ex.Message });
            }
        }

        public IActionResult ProtectedEndpoint()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(); // Retorna 401 se o token estiver ausente
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true, // Validando a expiração do token
                    ClockSkew = TimeSpan.Zero, // Sem tempo de tolerância para expiração
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuer = _configuration["JwtSettings:Issuer"],
                    ValidAudience = _configuration["JwtSettings:Audience"]
                }, out SecurityToken validatedToken);

                return Ok(new { message = "Acesso permitido." });
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized(); // Token expirado
            }
            catch (Exception)
            {
                return Unauthorized(); // Token inválido
            }
        }


        private string GerarToken(Empresa empresa)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, empresa.EmpresaID.ToString()),
                new Claim(ClaimTypes.Name, empresa.Nome),
                 new Claim("CNPJ", empresa.CNPJ)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}