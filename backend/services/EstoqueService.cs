using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using backend.Models;

public class EstoqueService
{
    private readonly AppDbContext _context;

    public EstoqueService(AppDbContext context)
    {
        _context = context;
    }
    public async Task VerificarEstoqueMinimo()
    {
        var produtos = await _context.Produtos
            .Where(p => p.QuantidadeEstoque < 10)
            .ToListAsync();

        if (!produtos.Any()) return;

        var emailsAlerta = await _context.Funcionarios
            .Where(f => !string.IsNullOrEmpty(f.EmailAlerta))
            .Select(f => f.EmailAlerta)
            .ToListAsync();

        foreach (var email in emailsAlerta)
        {
            await EnviarAlertaEmail(produtos, email);
        }
    }
    private async Task EnviarAlertaEmail(List<Produto> produtos, string destinatario)
    {
        string assunto = "⚠️ Alerta: Produtos com Estoque Baixo";

        // Cria uma tabela HTML com os produtos
        var corpoHtml = @"
            <h2>Produtos com Estoque Baixo</h2>
            <table border='1' style='border-collapse: collapse; width: 100%;'>
                <tr style='background-color: #f2f2f2;'>
                    <th style='padding: 8px;'>Produto</th>
                    <th style='padding: 8px;'>Quantidade Atual</th>
                    <th style='padding: 8px;'>Estoque Mínimo</th>
                </tr>";

        foreach (var produto in produtos)
        {
            corpoHtml += $@"
                <tr>
                    <td style='padding: 8px;'>{produto.Nome}</td>
                    <td style='padding: 8px; color: red;'>{produto.QuantidadeEstoque}</td>
                    <td style='padding: 8px;'>{10}</td>
                </tr>";
        }

        corpoHtml += "</table>";

        try
        {
            using (var smtp = new SmtpClient("smtp.gmail.com", 587))
            {
                smtp.EnableSsl = true;

                var mensagem = new MailMessage
                {
                    From = new MailAddress(destinatario, "Sistema de Estoque"),
                    Subject = assunto,
                    Body = corpoHtml,
                    IsBodyHtml = true
                };

                mensagem.To.Add(destinatario);

                try
                {
                    await smtp.SendMailAsync(mensagem);
                    Console.WriteLine($"✅ Email enviado para {destinatario}");
                }
                catch (SmtpException smtpEx)
                {
                    Console.WriteLine($"❌ Erro SMTP ao enviar e-mail: {smtpEx.Message}");
                    throw;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Erro ao enviar e-mail: {ex.Message}");
            throw;
        }
    }
}
