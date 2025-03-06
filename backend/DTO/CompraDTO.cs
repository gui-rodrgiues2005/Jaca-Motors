public class CompraProdutoDTO
{
    public string Nome { get; set; }
    public int TipoProdutoID { get; set; }
    public int FornecedorID { get; set; }
    public int FuncionarioID { get; set; }
    public string Descricao { get; set; }
    public int QuantidadeEstoque { get; set; }
    public decimal PrecoCompra { get; set; }
    public decimal PrecoVenda { get; set; }
}