using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class Cliente
    {
        public int ClienteID { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string CPF { get; set; }
        public string Telefone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}