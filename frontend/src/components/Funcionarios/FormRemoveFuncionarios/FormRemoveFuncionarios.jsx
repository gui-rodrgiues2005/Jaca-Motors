import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormRemoveFuncionarios.scss';

const FormRemoveFuncionarios = () => {
    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadFuncionarios();
    }, []);

    const loadFuncionarios = async () => {
        try {
            const response = await axios.get('http://localhost:5096/api/Funcionarios');
            setFuncionarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            alert('Erro ao carregar funcionários');
        }
    };

    const handleDelete = async () => {
        if (!selectedFuncionario) {
            alert('Por favor, selecione um funcionário para remover');
            return;
        }

        if (window.confirm('Tem certeza que deseja remover este funcionário?')) {
            try {
                await axios.delete(`http://localhost:5096/api/Funcionarios/${selectedFuncionario.funcionarioID}`);
                alert('Funcionário removido com sucesso!');
                setSelectedFuncionario(null);
                loadFuncionarios();
            } catch (error) {
                console.error('Erro ao remover funcionário:', error);
                alert('Erro ao remover funcionário');
            }
        }
    };

    const filteredFuncionarios = funcionarios.filter(funcionario =>
        funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-remove-funcionario-container">
            <div className="form-remove-funcionario">
                <h2>Remover Funcionário</h2>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar funcionário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Selecionar</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                                <th>Cargo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFuncionarios.map((funcionario) => (
                                <tr 
                                    key={funcionario.funcionarioID}
                                    className={selectedFuncionario?.funcionarioID === funcionario.funcionarioID ? 'selected' : ''}
                                    onClick={() => setSelectedFuncionario(funcionario)}
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            name="funcionario"
                                            checked={selectedFuncionario?.funcionarioID === funcionario.funcionarioID}
                                            onChange={() => setSelectedFuncionario(funcionario)}
                                        />
                                    </td>
                                    <td>{funcionario.nome}</td>
                                    <td>{funcionario.email}</td>
                                    <td>{funcionario.cpf}</td>
                                    <td>{funcionario.telefone}</td>
                                    <td>{funcionario.cargo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="button-container">
                    <button 
                        className="btn-cancelar"
                        onClick={() => navigate('/funcionarios')}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-remover"
                        onClick={handleDelete}
                        disabled={!selectedFuncionario}
                    >
                        Remover Funcionário
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormRemoveFuncionarios;