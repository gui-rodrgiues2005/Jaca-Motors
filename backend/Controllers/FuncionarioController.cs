using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FuncionariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Funcionarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Funcionario>>> GetFuncionarios()
        {
            var funcionarios = await _context.Funcionarios
                .Select(f => new
                {
                    f.FuncionarioID,
                    f.Nome,
                    f.Cargo,
                    f.Telefone,
                    f.CreatedAt,
                    Email = f.Email ?? "",  // Retorna string vazia se for nulo
                    CPF = f.CPF ?? "",      // Retorna string vazia se for nulo
                    f.Ativo,
                    f.UpdatedAt
                })
                .ToListAsync();

            return Ok(funcionarios);
        }

        // GET: api/Funcionarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Funcionario>> GetFuncionario(int id)
        {
            var funcionario = await _context.Funcionarios.FindAsync(id);
            if (funcionario == null)
            {
                return NotFound();
            }
            return funcionario;
        }

        // POST: api/Funcionarios
        [HttpPost]
        public async Task<ActionResult<Funcionario>> PostFuncionario(Funcionario funcionario)
        {
            _context.Funcionarios.Add(funcionario);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFuncionario), new { id = funcionario.FuncionarioID }, funcionario);
        }

        // PUT: api/Funcionarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFuncionario(int id, Funcionario funcionario)
        {
            if (id != funcionario.FuncionarioID)
            {
                return BadRequest();
            }

            _context.Entry(funcionario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Funcionarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFuncionario(int id)
        {
            var funcionario = await _context.Funcionarios.FindAsync(id);
            if (funcionario == null)
            {
                return NotFound();
            }

            _context.Funcionarios.Remove(funcionario);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("listar-funcionarios")]
        public async Task<ActionResult> ListarFuncionarios()
        {
            var funcionarios = await _context.Funcionarios
                .Where(f => f.Ativo) // Apenas funcionários ativos
                .Select(f => new
                {
                    f.FuncionarioID,
                    f.Nome
                })
                .ToListAsync();

            return Ok(funcionarios);
        }

        // Endpoint para verificar email de alerta
        [HttpGet("verificar-email-alerta/{funcionarioId}")]
        public async Task<ActionResult> VerificarEmailAlerta(int funcionarioId)
        {
            var funcionario = await _context.Funcionarios
                .Where(f => f.FuncionarioID == funcionarioId && f.Ativo)
                .Select(f => new
                {
                    f.Nome,
                    f.EmailAlerta,
                    TemEmailAlerta = !string.IsNullOrEmpty(f.EmailAlerta)
                })
                .FirstOrDefaultAsync();

            if (funcionario == null)
                return NotFound("Funcionário não encontrado.");

            return Ok(new
            {
                funcionario.Nome,
                funcionario.EmailAlerta,
                funcionario.TemEmailAlerta
            });
        }

        [HttpPost("atualizar-email-alerta")]
        public async Task<IActionResult> AtualizarEmailAlerta([FromBody] AtualizarEmailRequest request)
        {
            var funcionario = await _context.Funcionarios
                .FirstOrDefaultAsync(f => f.Nome == request.Nome);

            if (funcionario == null)
                return NotFound($"Funcionário '{request.Nome}' não encontrado.");

            funcionario.EmailAlerta = request.Email;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "E-mail de alerta atualizado com sucesso.",
                funcionario = new
                {
                    funcionario.Nome,
                    funcionario.EmailAlerta
                }
            });
        }



        // Classe para o request
        public class AtualizarEmailRequest
        {
            public string Nome { get; set; }
            public string Email { get; set; }
        }
    }
}
