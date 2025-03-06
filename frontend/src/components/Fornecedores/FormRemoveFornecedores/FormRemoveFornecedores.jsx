import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormRemoveFornecedores.scss';

const FormRemoveFornecedores = () => {
    const navigate = useNavigate();
    const [fornecedores, setFornecedores] = useState([]);
    const [selectedFornecedor, setSelectedFornecedor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadFornecedores();
    }, []);

    const loadFornecedores = async () => {
        try {
            const response = await axios.get('http://localhost:5096/api/Fornecedores');
            setFornecedores(response.data);
        } catch (error) {
            console.error('Erro ao carregar fornecedores:', error);
            alert('Erro ao carregar fornecedores');
        }
    };

    const handleDelete = async () => {
        if (!selectedFornecedor) {
            alert('Por favor, selecione um fornecedor para remover');
            return;
        }

        if (window.confirm('Tem certeza que deseja remover este fornecedor?')) {
            try {
                await axios.delete(`http://localhost:5096/api/Fornecedores/${selectedFornecedor.fornecedorID}`);
                alert('Fornecedor removido com sucesso!');
                setSelectedFornecedor(null);
                loadFornecedores();
            } catch (error) {
                console.error('Erro ao remover fornecedor:', error);
                alert('Erro ao remover fornecedor');
            }
        }
    };

    const filteredFornecedores = fornecedores.filter(fornecedor =>
        fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-remove-fornecedor-container">
            <div className="form-remove-fornecedor">
                <h2>Remover Fornecedor</h2>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar fornecedor..."
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
                                <th>CNPJ</th>
                                <th>Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFornecedores.map((fornecedor) => (
                                <tr 
                                    key={fornecedor.fornecedorID}
                                    className={selectedFornecedor?.fornecedorID === fornecedor.fornecedorID ? 'selected' : ''}
                                    onClick={() => setSelectedFornecedor(fornecedor)}
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            name="fornecedor"
                                            checked={selectedFornecedor?.fornecedorID === fornecedor.fornecedorID}
                                            onChange={() => setSelectedFornecedor(fornecedor)}
                                        />
                                    </td>
                                    <td>{fornecedor.nome}</td>
                                    <td>{fornecedor.email}</td>
                                    <td>{fornecedor.cnpj}</td>
                                    <td>{fornecedor.telefone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="button-container">
                    <button 
                        className="btn-cancelar"
                        onClick={() => navigate('/fornecedores')}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-remover"
                        onClick={handleDelete}
                        disabled={!selectedFornecedor}
                    >
                        Remover Fornecedor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormRemoveFornecedores;