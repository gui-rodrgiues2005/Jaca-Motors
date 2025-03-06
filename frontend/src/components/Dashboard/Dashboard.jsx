import React, { useEffect, useState } from 'react';
import './Dashboard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faTruck,
  faUsers,
  faExchangeAlt,
  faDollarSign,
  faMoneyBillWave,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import axios from 'axios';

const DashboardCard = ({ titulo, valor, icon, color }) => (
  <div className='itens__dashboard'>
    <div className='dados__dashboard'>
      {titulo}
      <FontAwesomeIcon icon={icon} color={color} />
    </div>
    <p className='valor__dados'>{valor}</p>
  </div>
);

const Dashboard = () => {
  // Estados
  const [dadosLoja, setDadosLoja] = useState({
    valorTotalEstoque: 0,
    valorTotalCusto: 0,
    lucroPotencial: 0,
    quantidadeTotalProdutos: 0,
    quantidadeFornecedores: 0,
    quantidadeMovimentacoes: 0,
    quantidadeFuncionarios: 0,
    precoMedioProduto: 0
  });

  const [dataEstoque, setDataEstoque] = useState([
    { categoria: "Peças", quantidade: 0 },
    { categoria: "Acessórios", quantidade: 0 },
    { categoria: "Óleos e lubrificantes", quantidade: 0 },
    { categoria: "Pneus", quantidade: 0 }
  ]);

  const [dataMovimentacoes, setDataMovimentacoes] = useState([
    { tipo: "Entrada", valor: 0 },
    { tipo: "Saída", valor: 0 }
  ]);

  const [movimentacoesRecentes, setMovimentacoesRecentes] = useState([]);

  // Configurações
  const COLORS = ["#2ecc71", "#e74c3c"];

  // Dados dos Cards
  const cardsData = [
    {
      titulo: "Produtos",
      valor: dadosLoja.quantidadeTotalProdutos,
      icon: faBox,
      color: "#3498db"
    },
    {
      titulo: "Fornecedores",
      valor: dadosLoja.quantidadeFornecedores,
      icon: faTruck,
      color: "#e67e22"
    },
    {
      titulo: "Movimentações",
      valor: dadosLoja.quantidadeMovimentacoes,
      icon: faExchangeAlt,
      color: "#2ecc71"
    },
    {
      titulo: "Funcionários",
      valor: dadosLoja.quantidadeFuncionarios,
      icon: faUsers,
      color: "#9b59b6"
    },
    {
      titulo: "Valor Total do Estoque",
      valor: `R$ ${dadosLoja.valorTotalEstoque.toFixed(2)}`,
      icon: faDollarSign,
      color: "#f1c40f"
    },
    {
      titulo: "Lucro Potencial",
      valor: `R$ ${dadosLoja.lucroPotencial.toFixed(2)}`,
      icon: faMoneyBillWave,
      color: "#27ae60"
    },
    {
      titulo: "Preço Médio do Produto",
      valor: `R$ ${dadosLoja.precoMedioProduto.toFixed(2)}`,
      icon: faTag,
      color: "#e74c3c"
    }
  ];

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dadosLojaRes, estoqueRes, movimentacoesRes, movRecentesRes] = await Promise.all([
          axios.get('http://localhost:5096/api/Produtos/dados-loja'),
          axios.get('http://localhost:5096/api/Produtos/estoque-por-categoria'),
          axios.get('http://localhost:5096/api/Produtos/entrada-saida'),
          axios.get('http://localhost:5096/api/MovimentacaoProduto')
        ]);

        setDadosLoja(dadosLojaRes.data);
        setDataEstoque(prevData =>
          prevData.map(item => ({
            ...item,
            quantidade: estoqueRes.data.find(d => d.categoria === item.categoria)?.quantidade || 0
          }))
        );
        setDataMovimentacoes([
          { tipo: "Entrada", valor: movimentacoesRes.data.entrada },
          { tipo: "Saída", valor: movimentacoesRes.data.saida }
        ]);
        setMovimentacoesRecentes(movRecentesRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='section__dashboard'>
      <h3 className='dashboard_title'>Dashboard</h3>

      {/* Cards */}
      <div className='dados__wrapper'>
        <div className='dados__containers'>
          {/* Cards originais */}
          {cardsData.map((card, index) => (
            <DashboardCard key={`card-${index}`} {...card} />
          ))}
          {/* Duplicação para scroll infinito */}
          {cardsData.map((card, index) => (
            <DashboardCard key={`card-dup-${index}`} {...card} />
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="graficos">
        <div className="grafico__estoque--categoria">
          <h3>Estoque por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dataEstoque}
              margin={{ top: 10, right: 10, left: -40, bottom: 10 }}
              barGap={20} // Espaço entre as barras
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" fontSize={7} className='name-coluns' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill="#8e44ad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico__movimentacao--tipo">
          <h3>Movimentações por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataMovimentacoes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="valor"
                label={({ tipo, value }) => `${tipo}: ${value}`}
                nameKey="tipo"
              >
                {dataMovimentacoes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Legend
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {value === "Entrada" ? "⬇ Entrada" : "⬆ Saída"}
                  </span>
                )}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="movimentacoes__recentes">
        <h3>Movimentações Recentes</h3>
        <table className="tabela__movimentacoes">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {[...movimentacoesRecentes]
              .sort((a, b) => new Date(b.dataHoraMov) - new Date(a.dataHoraMov))
              .map((movimentacao, index) => (
                <tr key={index}>
                  <td>{new Date(movimentacao.dataHoraMov).toLocaleDateString()}</td>
                  <td>{movimentacao.produtoNome}</td>
                  <td className={movimentacao.tipoMovID === 1 ? 'entrada' : 'saida'}>
                    <span>{movimentacao.tipoMovID === 1 ? '⬇ Entrada' : '⬆ Saída'}</span>
                  </td>
                  <td>{movimentacao.quantidade}</td>
                  <td>R$ {movimentacao.precoTotal.toFixed(2).replace('.', ',')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;