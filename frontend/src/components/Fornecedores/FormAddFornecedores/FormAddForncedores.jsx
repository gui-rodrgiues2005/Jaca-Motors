import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormAddFornecedores.scss';

const FormAddFornecedores = () => {
    const navigate = useNavigate();
    const [fornecedor, setFornecedor] = useState({
        nome: '',
        email: '',
        cnpj: '',
        telefone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:5096/api/Fornecedores', fornecedor);
            alert('Fornecedor cadastrado com sucesso!');
            navigate('/fornecedores');
        } catch (error) {
            console.error('Erro ao cadastrar fornecedor:', error);
            alert('Erro ao cadastrar fornecedor. Por favor, tente novamente.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFornecedor(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="form-add-fornecedor-container">
            <form onSubmit={handleSubmit} className="form-add-fornecedor">
                <h2>Cadastrar Novo Fornecedor</h2>
                
                <div className="form-group">
                    <label htmlFor="nome">Nome do Fornecedor</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder='Nome do Fornecedor'
                        value={fornecedor.nome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='exemplo@gmail.com'
                        value={fornecedor.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cnpj">CNPJ</label>
                    <input
                        type="text"
                        id="cnpj"
                        name="cnpj"
                        placeholder='00.000.000/0000-00'
                        value={fornecedor.cnpj}
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
                        placeholder='(00) 0000-0000'
                        value={fornecedor.telefone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-buttons">
                    <button type="button" onClick={() => navigate('/fornecedores')} className="btn-cancelar">
                        Cancelar
                    </button>
                    <button type="submit" className="btn-cadastrar">
                        Cadastrar Fornecedor
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormAddFornecedores;