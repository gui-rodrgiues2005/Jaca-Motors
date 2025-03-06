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
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cliente
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Cliente.ToListAsync();
        }

        // GET: api/Cliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }
            return cliente;
        }

        // POST: api/Cliente
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            _context.Cliente.Add(cliente);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCliente), new { id = cliente.ClienteID }, cliente);
        }

        // PUT: api/clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Putcliente(int id, Cliente cliente)
        {
            if (id != cliente.ClienteID)
            {
                return BadRequest();
            }

            _context.Entry(cliente).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletecliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Cliente.Remove(cliente);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
