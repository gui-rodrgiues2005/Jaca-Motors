import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ClienteRemove.scss';

const ClienteRemove = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5096/api/Clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            alert('Erro ao carregar clientes');
        }
    };

    const handleDelete = async () => {
        if (!selectedCliente) {
            alert('Por favor, selecione um cliente para remover');
            return;
        }

        if (window.confirm('Tem certeza que deseja remover este cliente?')) {
            try {
                await axios.delete(`http://localhost:5096/api/Clientes/${selectedCliente.clienteID}`);
                alert('Cliente removido com sucesso!');
                setSelectedCliente(null);
                loadClientes();
            } catch (error) {
                console.error('Erro ao remover cliente:', error);
                alert('Erro ao remover cliente');
            }
        }
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-remove-cliente-container">
            <div className="form-remove-cliente">
                <h2>Remover Cliente</h2>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.map((cliente) => (
                                <tr 
                                    key={cliente.clienteID}
                                    className={selectedCliente?.clienteID === cliente.clienteID ? 'selected' : ''}
                                    onClick={() => setSelectedCliente(cliente)}
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            name="cliente"
                                            checked={selectedCliente?.clienteID === cliente.clienteID}
                                            onChange={() => setSelectedCliente(cliente)}
                                        />
                                    </td>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.cpf}</td>
                                    <td>{cliente.telefone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="button-container">
                    <button 
                        className="btn-cancelar"
                        onClick={() => navigate('/clientes')}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-remover"
                        onClick={handleDelete}
                        disabled={!selectedCliente}
                    >
                        Remover Cliente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClienteRemove;