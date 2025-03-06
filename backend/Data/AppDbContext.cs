using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Funcionario> Funcionarios { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Fornecedor> Fornecedor { get; set; }
        public DbSet<Cliente> Cliente { get; set; }
        public DbSet<Movimentacao> Movimentacao { get; set; }
        public DbSet<TipoMov> TiposMov { get; set; }
        public DbSet<TipoProduto> TipoProduto { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>()
                .HasOne(p => p.TipoProduto)
                .WithMany(t => t.Produtos)
                .HasForeignKey(p => p.TipoProdutoID);
        }
    }
}
