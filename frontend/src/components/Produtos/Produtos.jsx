import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import AdicionarProduto from './FormularioAddProduto/Form';
import axios from 'axios'
import './Produtos.scss';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5096/api/Produtos')
      .then((response) => {
        setProdutos(response.data);  // Armazenando os dados corretamente
      })
      .catch((error) => {
        console.error('Erro ao buscar dados dos produtos:', error);
      });
  }, []);

  // Filtrando os produtos com base no nome
  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-produtos">
      <div className='buttons__edit-produtos'>
        <button className="btn-add-produtos" onClick={() => navigate("/adicionar-produto")}>
          <FontAwesomeIcon icon={faPlus} /> Registrar compra de produtos
        </button>

        <button className="btn-remove-produtos" onClick={() => navigate("/remover-produto")}>
          <FontAwesomeIcon icon={faMinus} />
          Registrar venda de produtos
        </button>
      </div>

      <label className='buscar-produtos'>
        <input
          type='text'
          placeholder='Buscar Produtos...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className='icon__search' />
      </label>

      <div className="produtos">
        <h3>Produtos</h3>
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Fornecedor</th>
              <th>Preço Compra</th>
              <th>Preço Venda</th>
              <th>Estoque</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Renderizando os produtos filtrados */}
            {filteredProdutos.length > 0 ? (
              filteredProdutos.map((produto, index) => (
                <tr key={index}>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td>{produto.fornecedorNome}</td>
                  <td>R$ {produto.precoCompra.toFixed(2).replace('.', ',')}</td>
                  <td>R$ {produto.precoVenda.toFixed(2).replace('.', ',')}</td>
                  <td>{produto.quantidadeEstoque}</td>
                  <td>R$ {(produto.precoVenda * produto.quantidadeEstoque).toFixed(2).replace('.', ',')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum produto encontrado.</td> {/* Ajustado para 7 colunas */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Produtos;
