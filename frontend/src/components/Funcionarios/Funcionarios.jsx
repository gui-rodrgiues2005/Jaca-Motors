import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Funcionarios.scss';

const Funcionarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [funcionarios, setFuncionarios] = useState([]);
  const navigate = useNavigate();

  const filteredFuncionarios = funcionarios.filter((funcionario) =>
    funcionario.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    axios.get('http://localhost:5096/api/Funcionarios')
      .then((response) => {
        console.log('Dados recebidos:', response.data); // Para debug
        setFuncionarios(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados dos funcionarios:', error);
      });
  }, []);

  return (
    <div className='container-Funcionarios'>
      <div className='buttons-container-funcionarios'>
        <button className='button-cadastrar-funcionario' onClick={() => navigate('/adicionar-funcionario')}>Cadastrar Funcionário</button>
        <button className='button-remover-funcionario' onClick={() => navigate('/remover-funcionario')}>Remover Funcionário</button>
      </div>

      <label className='buscar-funcionarios'>
        <input
          type='text'
          placeholder='Buscar Funcionarios...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className='icon__search' />
      </label>

      <div className="funcionarios">
        <h3>Funcionarios</h3>
        <div className='tabela-wrapper'>
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderizando os fornecedores filtrados */}
              {filteredFuncionarios.length > 0 ? (
                filteredFuncionarios.map((funcionario, index) => (
                  <tr key={funcionario.funcionarioID} className="funcionario-row">
                    <td>{funcionario.nome}</td>
                    <td>{funcionario.cargo}</td>
                    <td>{funcionario.telefone}</td>
                    <td>{funcionario.cpf}</td>
                    <td>{new Date(funcionario.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr className='no-data'>
                  <td colSpan="5">Nenhum Funcionário encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Funcionarios;
