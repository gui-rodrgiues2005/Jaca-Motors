namespace backend.Models
{
    public class Movimentacao
    {
        public int MovimentacaoID { get; set; }
        public int FuncionarioID { get; set; }
        public int FornecedorID { get; set; }
        public int TipoMovID { get; set; }
        public int TipoProdutoID { get; set; }
        public int ProdutoID { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoTotal { get; set; }
        public DateTime DataHoraMov { get; set; } = DateTime.Now;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public int? ClienteID { get; set; }

        // Adicionando a propriedade de navegação
        public Produto Produto { get; set; }
        public Cliente Cliente { get; set; }
    }
}