namespace backend.DTO
{
       public class RegisterDTO
    {
        public string Nome { get; set; } 
        public string NomeDono { get; set; }
        public string CNPJ { get; set; }
        public string Telefone { get; set; }
        public string Senha { get; set; }
        public EnderecoDTO Endereco { get; set; }
    }
}