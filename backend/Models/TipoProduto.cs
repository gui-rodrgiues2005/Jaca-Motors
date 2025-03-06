using System;

namespace backend.Models
{
    public class TipoProduto
    {
        public int TipoProdutoID { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public virtual ICollection<Produto> Produtos { get; set; }

    }
}