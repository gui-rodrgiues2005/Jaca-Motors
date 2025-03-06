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
    public class ConfiguracaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        [HttpPost("backup")]
        public async Task<IActionResult> RealizarBackup()
        {
            // Implementar lógica de backup
            return Ok(new { mensagem = "Backup realizado com sucesso" });
        }
         
        [HttpPost("gerar-token")]
        public async Task<IActionResult> GerarToken()
        {
            var token = Guid.NewGuid().ToString();
            return Ok(new { token });
        }
        
    }
}