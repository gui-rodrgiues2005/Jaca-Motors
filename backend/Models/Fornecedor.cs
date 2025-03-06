using System;

namespace backend.Models
{
    public class Fornecedor
    {
        public int FornecedorID { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string CNPJ { get; set; }
        public string Telefone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
