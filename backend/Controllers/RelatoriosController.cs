using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class RelatorioController : ControllerBase
{
    private readonly AppDbContext _context;

    public RelatorioController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("valor-estoque-categoria")]
    public async Task<IActionResult> GetValorEstoquePorCategoria()
    {
        var resultado = await _context.Produtos
            .Include(p => p.TipoProduto)
            .GroupBy(p => p.TipoProdutoID)
            .Select(g => new
            {
                categoria = g.First().TipoProduto.Descricao, 
                tipoProdutoId = g.Key,
                valor = g.Sum(p => p.PrecoVenda * p.QuantidadeEstoque)
            })
            .ToListAsync();

        return Ok(resultado);
    }

    [HttpGet("movimentacoes-periodo")]
    public async Task<IActionResult> GetMovimentacoesPorPeriodo(
        [FromQuery] DateTime dataInicial,
        [FromQuery] DateTime dataFinal)
    {
        var movimentacoes = await _context.Movimentacao
            .Where(m => m.DataHoraMov >= dataInicial && m.DataHoraMov <= dataFinal)
            .GroupBy(m => new
            {
                Mes = m.DataHoraMov.Month,
                Ano = m.DataHoraMov.Year
            })
            .Select(g => new
            {
                periodo = $"{g.Key.Mes}/{g.Key.Ano}",
                entrada = g.Where(m => m.TipoMovID == 1).Sum(m => m.PrecoTotal),
                saida = g.Where(m => m.TipoMovID == 2).Sum(m => m.PrecoTotal)
            })
            .ToListAsync();

        return Ok(movimentacoes);
    }

    [HttpGet("analise-financeira")]
    public async Task<IActionResult> GetAnaliseFinanceira(
        [FromQuery] DateTime dataInicial,
        [FromQuery] DateTime dataFinal)
    {
        var entradas = await _context.Movimentacao
            .Where(m => m.TipoMovID == 1 && m.DataHoraMov >= dataInicial && m.DataHoraMov <= dataFinal)
            .SumAsync(m => m.PrecoTotal);

        var saidas = await _context.Movimentacao
            .Where(m => m.TipoMovID == 2 && m.DataHoraMov >= dataInicial && m.DataHoraMov <= dataFinal)
            .SumAsync(m => m.PrecoTotal);

        return Ok(new
        {
            receitaTotal = entradas,
            custoTotal = saidas,
            lucroPrejuizo = entradas - saidas
        });
    }

    [HttpGet("produtos-mais-vendidos")]
    public async Task<IActionResult> GetProdutosMaisVendidos(
        [FromQuery] DateTime dataInicial,
        [FromQuery] DateTime dataFinal)
    {
        var topProdutos = await _context.Movimentacao
            .Where(m => m.TipoMovID == 2 && m.DataHoraMov >= dataInicial && m.DataHoraMov <= dataFinal)
            .GroupBy(m => m.ProdutoID)
            .Select(g => new
            {
                produtoNome = g.First().Produto.Nome,
                quantidadeVendida = g.Sum(m => m.Quantidade),
                receitaTotal = g.Sum(m => m.PrecoTotal),
                precoMedio = g.Average(m => m.PrecoTotal / m.Quantidade)
            })
            .OrderByDescending(x => x.quantidadeVendida)
            .Take(5)
            .ToListAsync();

        return Ok(topProdutos);
    }
}