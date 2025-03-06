using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacaoProdutoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovimentacaoProdutoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetMovimentacoes()
        {
            var movimentacoes = await _context.Movimentacao
                .Include(m => m.Produto)
                .OrderByDescending(m => m.DataHoraMov)
                .Take(10) 
                .Select(m => new
                {
                    m.MovimentacaoID,
                    m.DataHoraMov,
                    m.TipoMovID,
                    m.Quantidade,
                    m.PrecoTotal,
                    ClienteNome = m.Cliente.Nome,
                    ProdutoNome = m.Produto.Nome
                    
                })
                .ToListAsync();

            return Ok(movimentacoes);
        }
    }
}