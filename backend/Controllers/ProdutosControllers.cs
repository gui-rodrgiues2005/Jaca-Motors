using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using ClosedXML.Excel;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dados-loja")]
        public async Task<IActionResult> ObterDadosLoja()
        {
            try
            {
                // Calcula valor total baseado no preço de venda
                var valorTotalEstoque = await _context.Produtos
                    .SumAsync(p => p.PrecoVenda * p.QuantidadeEstoque);

                // Calcula valor total de custo (baseado no preço de compra)
                var valorTotalCusto = await _context.Produtos
                    .SumAsync(p => p.PrecoCompra * p.QuantidadeEstoque);

                // Calcula o lucro potencial
                var lucroPotencial = valorTotalEstoque - valorTotalCusto;

                var quantidadeTotalProdutos = await _context.Produtos
                    .SumAsync(p => p.QuantidadeEstoque);

                var quantidadeFornecedores = await _context.Fornecedor.CountAsync();
                var quantidadeMovimentacoes = await _context.Movimentacao.CountAsync();
                var quantidadeFuncionarios = await _context.Funcionarios.CountAsync();

                var saldoLoja = new
                {
                    ValorTotalEstoque = Math.Round(valorTotalEstoque, 2), // Valor total com preço de venda
                    ValorTotalCusto = Math.Round(valorTotalCusto, 2),    // Valor total com preço de compra
                    LucroPotencial = Math.Round(lucroPotencial, 2),      // Lucro potencial
                    QuantidadeTotalProdutos = quantidadeTotalProdutos,
                    QuantidadeFornecedores = quantidadeFornecedores,
                    QuantidadeMovimentacoes = quantidadeMovimentacoes,
                    QuantidadeFuncionarios = quantidadeFuncionarios,
                    PrecoMedioProduto = quantidadeTotalProdutos > 0
                        ? Math.Round(valorTotalEstoque / quantidadeTotalProdutos, 2)
                        : 0
                };

                return Ok(saldoLoja);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Erro ao calcular dados da loja",
                    message = ex.Message
                });
            }
        }

        // GET: api/Produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            var produtos = await _context.Produtos
                .Include(p => p.Fornecedor)
                .Select(p => new
                {
                    p.ProdutoID,
                    p.Nome,
                    Categoria = p.TipoProdutoID == 1 ? "Peças" :
                               p.TipoProdutoID == 2 ? "Acessórios" :
                               p.TipoProdutoID == 3 ? "Óleos e Lubrificantes" :
                               p.TipoProdutoID == 4 ? "Pneus" : "Outros",
                    p.FornecedorID,
                    FornecedorNome = p.Fornecedor.Nome,
                    p.PrecoCompra,
                    p.PrecoVenda,
                    p.QuantidadeEstoque,
                })
                .ToListAsync();

            return Ok(produtos);
        }

        // GET: api/Produtos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return NotFound();
            }
            return produto;
        }

        // PUT: api/Produtos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduto(int id, Produto produto)
        {
            if (id != produto.ProdutoID)
            {
                return BadRequest();
            }

            _context.Entry(produto).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Produtos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return NotFound();
            }

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("comprar")]
        public async Task<IActionResult> ComprarProduto([FromBody] CompraProdutoDTO compraProduto)
        {
            if (compraProduto == null)
            {
                return BadRequest("Dados inválidos");
            }

            // Validar se o funcionário existe
            var funcionario = await _context.Funcionarios.FindAsync(compraProduto.FuncionarioID);
            if (funcionario == null)
            {
                return BadRequest("Funcionário não encontrado");
            }

            // Validar se o fornecedor existe
            var fornecedor = await _context.Fornecedor.FindAsync(compraProduto.FornecedorID);
            if (fornecedor == null)
            {
                return BadRequest("Fornecedor não encontrado");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Criar novo produto com FuncionarioID
                var produto = new Produto
                {
                    Nome = compraProduto.Nome,
                    TipoProdutoID = compraProduto.TipoProdutoID,
                    FornecedorID = compraProduto.FornecedorID,
                    FuncionarioID = compraProduto.FuncionarioID, // Incluindo FuncionarioID
                    Descricao = compraProduto.Descricao,
                    QuantidadeEstoque = compraProduto.QuantidadeEstoque,
                    PrecoCompra = compraProduto.PrecoCompra,
                    PrecoVenda = compraProduto.PrecoVenda,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Produtos.Add(produto);
                await _context.SaveChangesAsync();

                // Registrar movimentação também com o funcionário
                var movimentacao = new Movimentacao
                {
                    ProdutoID = produto.ProdutoID,
                    FuncionarioID = compraProduto.FuncionarioID,
                    FornecedorID = compraProduto.FornecedorID,
                    TipoMovID = 1, // Entrada/Compra
                    TipoProdutoID = compraProduto.TipoProdutoID,
                    Quantidade = compraProduto.QuantidadeEstoque,
                    PrecoTotal = compraProduto.PrecoCompra * compraProduto.QuantidadeEstoque,
                    DataHoraMov = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Movimentacao.Add(movimentacao);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Produto registrado com sucesso!",
                    produtoId = produto.ProdutoID,
                    funcionarioNome = funcionario.Nome
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Erro ao registrar produto: {ex.Message}");
            }
        }

        [HttpPost("venda")]
        public async Task<IActionResult> RegistrarVenda([FromBody] VendaDTO vendaDTO)
        {
            if (vendaDTO == null)
            {
                return BadRequest("Dados da venda inválidos.");
            }

            var produto = await _context.Produtos.FindAsync(vendaDTO.ProdutoID);
            if (produto == null)
            {
                return BadRequest("Produto não encontrado.");
            }

            if (produto.QuantidadeEstoque < vendaDTO.Quantidade)
            {
                return BadRequest("Estoque insuficiente para a venda.");
            }

            // Atualizar estoque
            produto.QuantidadeEstoque -= vendaDTO.Quantidade;

            // Criar movimentação
            var novaMovimentacao = new Movimentacao
            {
                ProdutoID = vendaDTO.ProdutoID,
                ClienteID = vendaDTO.ClienteID,
                FuncionarioID = vendaDTO.FuncionarioID,
                FornecedorID = produto.FornecedorID,
                TipoMovID = 2, // Venda
                TipoProdutoID = produto.TipoProdutoID,
                Quantidade = vendaDTO.Quantidade,
                PrecoTotal = produto.PrecoVenda * vendaDTO.Quantidade,
                DataHoraMov = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Movimentacao.Add(novaMovimentacao);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Venda registrada com sucesso!" });
        }


        // Endpoint para buscar fornecedores
        [HttpGet("fornecedores")]
        public async Task<ActionResult<IEnumerable<Fornecedor>>> GetFornecedores()
        {
            var fornecedores = await _context.Fornecedor.ToListAsync();
            return Ok(fornecedores);
        }

        // Endpoint para buscar funcionários
        [HttpGet("funcionarios")]
        public async Task<ActionResult<IEnumerable<Funcionario>>> GetFuncionarios()
        {
            var funcionarios = await _context.Funcionarios.ToListAsync();
            return Ok(funcionarios);
        }



        /*
        [HttpPost("deposito")]
        public async Task<IActionResult> DepositarProduto([FromBody] Movimentacao movimentacao)
        {
            if (movimentacao == null || movimentacao.ProdutoID <= 0 || movimentacao.Quantidade <= 0)
            {
                return BadRequest("Produto ou quantidade inválida.");
            }

            var produto = await _context.Produtos.FindAsync(movimentacao.ProdutoID);
            if (produto == null)
            {
                return BadRequest("Produto não encontrado.");
            }

            // Verifica se o funcionário existe
            var funcionario = await _context.Funcionarios.FindAsync(movimentacao.FuncionarioID);
            if (funcionario == null)
            {
                return BadRequest("Funcionário não encontrado.");
            }

            // Registra a movimentação de depósito (entrada)
            var novaMovimentacao = new Movimentacao
            {
                FuncionarioID = movimentacao.FuncionarioID,
                TipoMovID = 3, // "Depósito" 
                PrecoTotal = produto.PrecoCompra * movimentacao.Quantidade, 
                DataHoraMov = DateTime.UtcNow,
                ProdutoID = movimentacao.ProdutoID,
                Quantidade = movimentacao.Quantidade
            };

            produto.QuantidadeEstoque += movimentacao.Quantidade;

            _context.Movimentacao.Add(novaMovimentacao);
            await _context.SaveChangesAsync();

            return Ok(produto); 
        }
        */

        [HttpGet("estoque-por-categoria")]
        public async Task<IActionResult> ObterEstoquePorCategoria()
        {
            var estoquePorCategoria = await _context.Produtos
                .GroupBy(p => new { p.TipoProdutoID, NomeCategoria = _context.TipoProduto.Where(tp => tp.TipoProdutoID == p.TipoProdutoID).Select(tp => tp.Nome).FirstOrDefault() })
                .Select(g => new
                {
                    Categoria = g.Key.NomeCategoria ?? "Desconhecido",
                    Quantidade = g.Sum(p => p.QuantidadeEstoque)
                })
                .ToListAsync();

            return Ok(estoquePorCategoria);
        }

        [HttpGet("entrada-saida")]
        public async Task<IActionResult> ObterEntradaSaida()
        {
            try
            {
                // Consulta que soma as quantidades de entradas e saídas
                var entradaSaida = await _context.Movimentacao
                    .Where(m => m.TipoMovID == 1 || m.TipoMovID == 2) // Filtra apenas as movimentações de Compras (1) e Vendas (2)
                    .GroupBy(m => m.TipoMovID) // Agrupa por TipoMovID (Entrada = 1, Saída = 2)
                    .Select(g => new
                    {
                        TipoMovID = g.Key,  // 1 para Entrada, 2 para Saída
                        Quantidade = g.Sum(m => m.Quantidade) // Soma a quantidade
                    })
                    .ToListAsync();

                // Retorna os totais de Entrada e Saída
                var totalEntrada = entradaSaida.FirstOrDefault(x => x.TipoMovID == 1)?.Quantidade ?? 0;
                var totalSaida = entradaSaida.FirstOrDefault(x => x.TipoMovID == 2)?.Quantidade ?? 0;

                // Retorna os dados como um objeto com Entrada e Saída
                return Ok(new
                {
                    entrada = totalEntrada,
                    saida = totalSaida
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao processar a requisição: {ex.Message}");
            }
        }

        // Exportar dados dos produtos para um arquivo CSV
        [HttpGet("exportar-produtos")]
        public async Task<IActionResult> ExportarProdutos()
        {
            var produtos = await _context.Produtos
            .Include(p => p.Fornecedor)
    .Select(p => new
    {
        Nome = p.Nome,
        Categoria = p.TipoProdutoID == 1 ? "Peças" :
                   p.TipoProdutoID == 2 ? "Acessórios" :
                   p.TipoProdutoID == 3 ? "Óleos e Lubrificantes" :
                   p.TipoProdutoID == 4 ? "Pneus" : "Outros",
        Quantidade = p.QuantidadeEstoque,
        PrecoCompra = string.Format(new System.Globalization.CultureInfo("pt-BR"), "{0:C}", p.PrecoCompra),
        PrecoVenda = string.Format(new System.Globalization.CultureInfo("pt-BR"), "{0:C}", p.PrecoVenda),
        ValorTotalEstoque = string.Format(new System.Globalization.CultureInfo("pt-BR"), "{0:C}", p.PrecoVenda * p.QuantidadeEstoque),
        Fornecedor = p.Fornecedor.Nome,
        UltimaAtualizacao = p.UpdatedAt.ToString("dd/MM/yyyy HH:mm")
    })
            .ToListAsync();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Produtos");

                // Cabeçalho
                worksheet.Cell(1, 1).Value = "Nome";
                worksheet.Cell(1, 2).Value = "Categoria";
                worksheet.Cell(1, 3).Value = "Quantidade";
                worksheet.Cell(1, 4).Value = "Preço Compra";
                worksheet.Cell(1, 5).Value = "Preço Venda";
                worksheet.Cell(1, 6).Value = "Valor Total em Estoque";
                worksheet.Cell(1, 7).Value = "Fornecedor";
                worksheet.Cell(1, 8).Value = "Última Atualização";

                // Estilo do cabeçalho
                var headerRow = worksheet.Row(1);
                headerRow.Style.Font.Bold = true;
                headerRow.Style.Fill.BackgroundColor = XLColor.LightGray;

                int linha = 2;
                foreach (var produto in produtos)
                {
                    worksheet.Cell(linha, 1).Value = produto.Nome;
                    worksheet.Cell(linha, 2).Value = produto.Categoria;
                    worksheet.Cell(linha, 3).Value = produto.Quantidade;
                    worksheet.Cell(linha, 4).Value = produto.PrecoCompra;
                    worksheet.Cell(linha, 5).Value = produto.PrecoVenda;
                    worksheet.Cell(linha, 6).Value = produto.ValorTotalEstoque;
                    worksheet.Cell(linha, 7).Value = produto.Fornecedor;
                    worksheet.Cell(linha, 8).Value = produto.UltimaAtualizacao;
                    linha++;
                }

                // Estilização
                worksheet.Columns().AdjustToContents();
                var tableRange = worksheet.Range(1, 1, linha - 1, 8);
                tableRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                tableRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Produtos.xlsx");
                }
            }
        }
    
    }
}
