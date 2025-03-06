namespace backend.Models
{
    public class Produto
    {
        public int ProdutoID { get; set; }
        public string Nome { get; set; }
        public int TipoProdutoID { get; set; }
        public int FornecedorID { get; set; }
        public int FuncionarioID { get; set; }
        public string? Descricao { get; set; }
        public int QuantidadeEstoque { get; set; }
        public decimal PrecoCompra { get; set; }
        public decimal PrecoVenda { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navegação
        public virtual Fornecedor Fornecedor { get; set; }
        public virtual TipoProduto TipoProduto { get; set; }
        public virtual Funcionario Funcionario { get; set; } 
    }
}