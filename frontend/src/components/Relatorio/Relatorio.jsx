import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './Relatorio.scss';

const Relatorio = () => {
  const [dataInicial, setDataInicial] = useState("2025-01-06");
  const [dataFinal, setDataFinal] = useState("2025-01-06");
  const [dadosFinanceiros, setDadosFinanceiros] = useState({
    receitaTotal: 0,
    custoTotal: 0,
    lucroPrejuizo: 0
  });

  const [totalMovimentacoes, setTotalMovimentacoes] = useState({
    entradas: 0,
    saidas: 0
  });

  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);
  const [dataEstoque, setDataEstoque] = useState([
    { categoria: "Peças", valor: 0 },
    { categoria: "Acessórios", valor: 0 },
    { categoria: "Óleos e lubrificantes", valor: 0 },
    { categoria: "Pneus", valor: 0 }
  ]);

  const [dataMovimentacoes, setDataMovimentacoes] = useState([
    { periodo: "Janeiro", entrada: 0, saida: 0 },
    { periodo: "Fevereiro", entrada: 0, saida: 0 },
    { periodo: "Março", entrada: 0, saida: 0 },
    { periodo: "Abril", entrada: 0, saida: 0 }
  ]);

  const handleDateChange = (e, tipo) => {
    const novaData = e.target.value;

    if (tipo === 'inicial') {
      setDataInicial(novaData);
    } else {
      setDataFinal(novaData);
    }

    // Recarrega os dados quando as datas são alteradas
    fetchData();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          estoqueRes,
          movimentacoesRes,
          financeirosRes,
          produtosRes
        ] = await Promise.all([
          axios.get('http://localhost:5096/api/Relatorio/valor-estoque-categoria'),
          axios.get(`http://localhost:5096/api/Relatorio/movimentacoes-periodo?dataInicial=${dataInicial}&dataFinal=${dataFinal}`),
          axios.get(`http://localhost:5096/api/Relatorio/analise-financeira?dataInicial=${dataInicial}&dataFinal=${dataFinal}`),
          axios.get(`http://localhost:5096/api/Relatorio/produtos-mais-vendidos?dataInicial=${dataInicial}&dataFinal=${dataFinal}`)
        ]);

        setDataEstoque(estoqueRes.data);

        // Formatação dos dados de movimentação
        const movimentacoesFormatadas = movimentacoesRes.data.map(mov => ({
          periodo: mov.periodo,
          entrada: parseFloat(mov.entrada) || 0,
          saida: parseFloat(mov.saida) || 0
        }));

        setDataMovimentacoes(movimentacoesFormatadas);
        setDadosFinanceiros(financeirosRes.data);
        setProdutosMaisVendidos(produtosRes.data);

        // Calcula totais de movimentações
        const totais = movimentacoesFormatadas.reduce((acc, curr) => ({
          entradas: acc.entradas + curr.entrada,
          saidas: acc.saidas + curr.saida
        }), { entradas: 0, saidas: 0 });

        setTotalMovimentacoes(totais);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, [dataInicial, dataFinal]);

  return (
    <div className='container-relatorio'>
      <h2>Relatório</h2>
      <div className='relatorio__periodo'>
        <label>
          Data inicial
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => handleDateChange(e, 'inicial')}
          />
        </label>
        <label>
          Data final
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => handleDateChange(e, 'final')}
          />
        </label>
      </div>

      <div className='graficos__relatorio'>
        <div className='grafico__valor-em-estoque--categoria'>
          <h3>Valor em Estoque por Categoria</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={dataEstoque}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='categoria' />
              <YAxis />
              <Tooltip
                formatter={(value) => `R$ ${value.toFixed(2)}`}
              />
              <Legend />
              <Bar
                dataKey='valor'
                fill='#3498db'
                name="Valor em Estoque"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='grafico__movimentacao--periodo'>
          <h3>Movimentações por Período</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={dataMovimentacoes}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='periodo' />
              <YAxis />
              <Tooltip
                formatter={(value) => `R$ ${value.toFixed(2)}`}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Bar
                dataKey='entrada'
                fill='#2ecc71'
                name="Entradas"
              />
              <Bar
                dataKey='saida'
                fill='#e74c3c'
                name="Saídas"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='status-dados'>
        <div className='card'>
          <h3>Valor Total em Estoque</h3>
          <p>R$ {dataEstoque.reduce((acc, item) => acc + item.valor, 0).toFixed(2)}</p>
        </div>
        <div className='card'>
          <h3>Total de Entradas</h3>
          <p>R$ {totalMovimentacoes.entradas.toFixed(2)}</p>
        </div>
        <div className='card'>
          <h3>Total de Saídas</h3>
          <p>R$ {totalMovimentacoes.saidas.toFixed(2)}</p>
        </div>
      </div>

      <div className='analise-financeira'>
        <h3>Análise Financeira do Período</h3>
        <div className='dados--financeiros'>
          <div className='card'>
            <h4>Receita Total</h4>
            <p>R$ {dadosFinanceiros.receitaTotal.toFixed(2)}</p>
          </div>
          <div className='card'>
            <h4>Custo Total</h4>
            <p>R$ {dadosFinanceiros.custoTotal.toFixed(2)}</p>
          </div>
          <div className='card'>
            <h4>Lucro/Prejuízo</h4>
            <p className={dadosFinanceiros.lucroPrejuizo >= 0 ? 'lucro' : 'prejuizo'}>
              R$ {dadosFinanceiros.lucroPrejuizo.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className='mais--vendidos'>
        <h3>Top 5 Produtos Mais Vendidos</h3>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade Vendida</th>
              <th>Receita Total</th>
              <th>Preço Médio</th>
            </tr>
          </thead>
          <tbody>
            {produtosMaisVendidos.map((produto, index) => (
              <tr key={index}>
                <td>{produto.produtoNome}</td>
                <td>{produto.quantidadeVendida}</td>
                <td>R$ {produto.receitaTotal.toFixed(2)}</td>
                <td>R$ {produto.precoMedio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Relatorio;