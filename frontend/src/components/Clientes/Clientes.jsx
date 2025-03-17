import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Clientes.scss';

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

  const filteredClientes = clientes.filter((Cliente) =>
    Cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    axios.get('http://localhost:5096/api/Clientes')
      .then((response) => {
        console.log('Dados recebidos:', response.data); // Para debug
        setClientes(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados dos Clientes:', error);
      });
  }, []);

  return (
    <div className='container-Clientes'>
      <div className='buttons-container-clientes'>
        <button className='button-cadastrar-cliente' onClick={() => navigate('/adicionar-cliente')}>Cadastrar Cliente</button>
        <button className='button-remover-cliente' onClick={() => navigate('/remover-cliente')}>Remover Cliente</button>
      </div>

      <label className='buscar-clientes'>
        <input
          type='text'
          placeholder='Buscar Clientes...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className='icon__search' />
      </label>

      <div className="clientes">
        <h3>Clientes</h3>
        <div className='tabela-wrapper'>
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderizando os fornecedores filtrados */}
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente, index) => (
                  <tr key={cliente.clienteID} className="cliente-row">
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.cpf}</td>
                    <td>{new Date(cliente.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr className='no-data'>
                  <td colSpan="5">Nenhum Cliente encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
