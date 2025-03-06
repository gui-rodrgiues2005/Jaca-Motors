import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Fornecedores.scss';

const Fornecedores = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [fornecedores, setFornecedores] = useState([]);

  const filteredFornecedores = fornecedores.filter((fornecedor) =>
    fornecedor.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    axios.get('http://localhost:5096/api/Fornecedores')
      .then((response) => {
        console.log('Dados recebidos:', response.data); // Para debug
        setFornecedores(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados dos fornecedores:', error);
      });
  }, []);

  return (
    <div className='container-fornecedores'>
      <div className='buttons-container-fornecedores'>
        <button className='button-cadastrar-fornecedor' onClick={() => navigate('/adicionar-fornecedor')}>Cadastrar Fornecedor</button>
        <button className='button-remover-fornecedor' onClick={() => navigate('/remover-fornecedor')}>Remover Fornecedor</button>
      </div>

      <label className='buscar-fornecedores'>
        <input
          type='text'
          placeholder='Buscar Fornecedores...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className='icon__search' />
      </label>

      <div className="fornecedores">
        <h3>Fornecedores</h3>
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>Cadastrado em</th>
            </tr>
          </thead>
          <tbody>
            {/* Renderizando os fornecedores filtrados */}
            {filteredFornecedores.length > 0 ? (
              filteredFornecedores.map((fornecedor, index) => (
                <tr key={fornecedor.fornecedorID} className="fornecedor-row">
                  <td>{fornecedor.nome}</td>
                  <td>{fornecedor.email}</td>
                  <td>{fornecedor.cnpj}</td>
                  <td>{fornecedor.telefone}</td>
                  <td>{new Date(fornecedor.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr className='no-data'>
                <td colSpan="5">Nenhum fornecedor encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fornecedores;
