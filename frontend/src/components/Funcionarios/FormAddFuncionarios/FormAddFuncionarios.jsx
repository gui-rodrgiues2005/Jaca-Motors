import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormAddFuncionarios.scss';


const FormAddFuncionarios = () => {
    const navigate = useNavigate();
    const [funcionario, setFuncionario] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        cargo: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:5096/api/Funcionarios', funcionario);
            alert('Funcionário cadastrado com sucesso!');
            navigate('/funcionarios');
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            alert('Erro ao cadastrar funcionário. Por favor, tente novamente.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFuncionario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="form-add-funcionario-container">
            <form onSubmit={handleSubmit} className="form-add-funcionario">
                <h2>Cadastrar Novo Funcionário</h2>
                
                <div className="form-group">
                    <label htmlFor="nome">Nome do Funcionário</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder='Nome Completo do funcionário'
                        value={funcionario.nome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email (opcional)</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='exemplo@gmail.com'
                        value={funcionario.email}
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
                        value={funcionario.cpf}
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
                        value={funcionario.telefone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cargo">Cargo</label>
                    <input
                        type="text"
                        id="cargo"
                        name="cargo"
                        placeholder='Cargo do funcionário'
                        value={funcionario.cargo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-buttons">
                    <button type="button" onClick={() => navigate('/funcionarios')} className="btn-cancelar">
                        Cancelar
                    </button>
                    <button type="submit" className="btn-cadastrar">
                        Cadastrar Funcionário
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormAddFuncionarios;