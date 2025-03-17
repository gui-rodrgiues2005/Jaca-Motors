namespace backend.Models
{
    public class Endereco
    {
        public int Id { get; set; }
        public int EmpresaID { get; set; }  
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string CEP { get; set; }
        
        // Relacionamento com a empresa
        public Empresa Empresa { get; set; }
    }
}