namespace backend.Models
{
    public class Empresa
    {
        public int EmpresaID { get; set; }
        public string Nome { get; set; }
        public string NomeDono { get; set; }
        public string CNPJ { get; set; }
        public string Telefone { get; set; }
        public string Senha { get; set; }

        // Relacionamento 1:1 com Endereco
        public Endereco Endereco { get; set; }
    }

}