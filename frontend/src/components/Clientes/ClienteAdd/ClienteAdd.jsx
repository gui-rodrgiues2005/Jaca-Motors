import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ClienteAdd.scss';

const ClienteAdd = () => {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:5096/api/Clientes', cliente);
            alert('Cliente cadastrado com sucesso!');
            navigate('/clientes');
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            alert('Erro ao cadastrar cliente. Por favor, tente novamente.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="form-add-cliente-container">
            <form onSubmit={handleSubmit} className="form-add-cliente">
                <h2>Cadastrar Novo Cliente</h2>
                
                <div className="form-group">
                    <label htmlFor="nome">Nome do Cliente</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder='Nome Completo do cliente'
                        value={cliente.nome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email(opcional)</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='exemplo@gmail.com'
                        value={cliente.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cpf">CPF</label>
                    <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        placeholder='000.000.000-00'
                        value={cliente.cpf}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        placeholder='(00) 00000-0000'
                        value={cliente.telefone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-buttons">
                    <button type="button" onClick={() => navigate('/clientes')} className="btn-cancelar">
                        Cancelar
                    </button>
                    <button type="submit" className="btn-cadastrar">
                        Cadastrar Clientes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClienteAdd;