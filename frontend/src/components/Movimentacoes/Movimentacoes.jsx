import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Movimentacoes.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Movimentacoes = () => {
  // Movimentações recentes
  const [movimentacoesRecentes, setMovimentacoesRecentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca

  // Filtrando movimentações para vendas (tipoMovID === 2 representa saída/venda)
  const vendasFiltradas = movimentacoesRecentes.filter((movimentacao) =>
    movimentacao.tipoMovID === 2 &&
    movimentacao.produtoNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculando o total de vendas
  const totalVendas = vendasFiltradas.reduce((total, movimentacao) =>
    total + movimentacao.precoTotal, 0
  );

  useEffect(() => {
    axios.get('http://localhost:5096/api/MovimentacaoProduto')
      .then((response) => {
        setMovimentacoesRecentes(response.data);  // Ajuste para armazenar os dados corretamente
      })
      .catch((error) => {
        console.error('Erro ao buscar dados da loja:', error);
      });
  }, []);

  // Filtrando as movimentações com base no nome do produto
  const filteredMovimentacoes = movimentacoesRecentes.filter((movimentacao) =>
    movimentacao.produtoNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-movimentacoes">
      <label className='buscar-movimentacoes'>
        <input
          type='text'
          placeholder='Buscar movimentações...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className='icon__search' />
      </label>
      <div className="movimentacoes">
        <h3>Movimentações</h3>
        <div className='tabela-container'>
          <table className="tabela">
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
              {/* Renderizando as movimentações filtradas */}
              {filteredMovimentacoes.length > 0 ? (
                filteredMovimentacoes.map((movimentacao, index) => (
                  <tr key={index}>
                    <td>{new Date(movimentacao.dataHoraMov).toLocaleDateString()}</td>
                    <td>{movimentacao.produtoNome}</td>
                    <td className={movimentacao.tipoMovID === 1 ? 'entrada' : 'saida'}>
                      <span>{movimentacao.tipoMovID === 1 ? '⬇ Entrada' : '⬆ Saída'}</span>
                    </td>
                    <td>{movimentacao.quantidade}</td>
                    <td>R$ {movimentacao.precoTotal.toFixed(2).replace('.', ',')}</td> {/* Exibindo o valor formatado */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhuma movimentação encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className='vendas'>
        <div className="tabela-container">
          <div className="vendas-section">
            <h3>Produtos Vendidos</h3>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Produto</th>
                  <th>Cliente</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {vendasFiltradas.length > 0 ? (
                  <>
                    {vendasFiltradas.map((movimentacao, index) => (
                      <tr key={index}>
                        <td>{new Date(movimentacao.dataHoraMov).toLocaleString('pt-BR')}</td>
                        <td>{movimentacao.produtoNome}</td>
                        <td>{movimentacao.clienteNome}</td>
                        <td>{movimentacao.quantidade}</td>
                        <td>R$ {(movimentacao.precoTotal / movimentacao.quantidade).toFixed(2).replace('.', ',')}</td>
                        <td>R$ {movimentacao.precoTotal.toFixed(2).replace('.', ',')}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan="4"><strong>Total de Vendas:</strong></td>
                      <td><strong>R$ {totalVendas.toFixed(2).replace('.', ',')}</strong></td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="5">Nenhuma venda encontrada</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Movimentacoes;
