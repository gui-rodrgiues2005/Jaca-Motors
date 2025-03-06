using System;

namespace backend.Models
{
    public class Funcionario
    {
        public int FuncionarioID { get; set; }
        public string Nome { get; set; }
        public string Cargo { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string CPF { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public string ? EmailAlerta { get; set; }
    }
}
