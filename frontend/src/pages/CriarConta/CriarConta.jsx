import React, { use, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './CriarConta.scss';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState({
        senha: false,
        confirmarSenha: false
    });
    const [senhaForca, setSenhaForca] = useState({
        comprimento: false,
        maiuscula: false,
        minuscula: false,
        numero: false,
        especial: false
    });
    const [formData, setFormData] = useState({
        nome: '',
        nomeDono: '',
        cnpj: '',
        telefone: '',
        senha: '',
        confirmarSenha: '',
        endereco: {
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
        }
    });

    const validarSenha = (senha) => {
        const validacoes = {
            comprimento: senha.length >= 8,
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            numero: /[0-9]/.test(senha),
            especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
        };
        setSenhaForca(validacoes);
        return Object.values(validacoes).every(v => v);
    };

    const toggleMostrarSenha = (campo) => {
        setMostrarSenha(prev => ({
            ...prev,
            [campo]: !prev[campo]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'senha') {
            validarSenha(value);
        }
        if (name.includes('endereco.')) {
            const enderecoField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                endereco: {
                    ...prev.endereco,
                    [enderecoField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Object.values(senhaForca).every(v => v)) {
            toast.error('Por favor, crie uma senha mais forte!');
            return;
        }

        if (formData.senha !== formData.confirmarSenha) {
            toast.error('As senhas não correspondem!');
            return;
        }

        // Criar objeto com a estrutura esperada pelo backend
        const dadosParaEnviar = {
            nome: formData.nome,
            nomeDono: formData.nomeDono,
            cnpj: formData.cnpj,
            telefone: formData.telefone,
            senha: formData.senha,
            endereco: {
                logradouro: formData.endereco.logradouro,
                numero: formData.endereco.numero,
                bairro: formData.endereco.bairro,
                cidade: formData.endereco.cidade,
                estado: formData.endereco.estado,
                cep: formData.endereco.cep
            }
        };

        setLoading(true);
        try {
            console.log('Dados enviados:', dadosParaEnviar); // Para debug
            const response = await axios.post('http://localhost:5096/api/auth/register', dadosParaEnviar);
            toast.success('Conta criada com sucesso!');
            navigate('/login');
        } catch (error) {
            console.error('Erro completo:', error); // Para debug
            toast.error(error.response?.data?.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register">
                <h2>Criar Conta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Dados da Empresa</h3>
                        <div className="form-group">
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome da Empresa" required />
                            <input type="text" name="nomeDono" value={formData.nomeDono} onChange={handleChange} placeholder="Nome do Proprietário" required />
                        </div>

                        <div className="form-group">
                            <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ" required />
                        </div>
                        <div className="form-group">
                            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" required />
                        </div>
                    </div>
                    <div className="form-section">
                        <h3>Endereço</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                name="endereco.cep"
                                value={formData.endereco.cep}
                                onChange={handleChange}
                                placeholder="CEP"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="endereco.logradouro"
                                value={formData.endereco.logradouro}
                                onChange={handleChange}
                                placeholder="Logradouro"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="endereco.numero"
                                    value={formData.endereco.numero}
                                    onChange={handleChange}
                                    placeholder="Número"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="endereco.bairro"
                                    value={formData.endereco.bairro}
                                    onChange={handleChange}
                                    placeholder="Bairro"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="endereco.cidade"
                                    value={formData.endereco.cidade}
                                    onChange={handleChange}
                                    placeholder="Cidade"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="endereco.estado"
                                    value={formData.endereco.estado}
                                    onChange={handleChange}
                                    placeholder="Estado"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <h3>Segurança</h3>
                        <p className='senha-requisitos'>Lembre-se de guardar sua senha, ela é importante para a segurança da sua empresa.</p>
                        <div className="form-group">
                            <div className="input-password-wrapper">
                                <input
                                    type={mostrarSenha.senha ? "text" : "password"}
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    placeholder="Senha"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => toggleMostrarSenha('senha')}
                                >
                                    {mostrarSenha.senha ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </button>
                            </div>
                            <div className="senha-requisitos">
                                <div className={`requisito ${senhaForca.comprimento ? 'valido' : ''}`}>
                                    {senhaForca.comprimento ? "✓" : "○"} Mínimo de 8 caracteres
                                </div>
                                <div className={`requisito ${senhaForca.maiuscula ? 'valido' : ''}`}>
                                    {senhaForca.maiuscula ? "✓" : "○"} Pelo menos uma letra maiúscula
                                </div>
                                <div className={`requisito ${senhaForca.minuscula ? 'valido' : ''}`}>
                                    {senhaForca.minuscula ? "✓" : "○"} Pelo menos uma letra minúscula
                                </div>
                                <div className={`requisito ${senhaForca.numero ? 'valido' : ''}`}>
                                    {senhaForca.numero ? "✓" : "○"} Pelo menos um número
                                </div>
                                <div className={`requisito ${senhaForca.especial ? 'valido' : ''}`}>
                                    {senhaForca.especial ? "✓" : "○"} Pelo menos um caractere especial
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-password-wrapper">
                                <input
                                    type={mostrarSenha.confirmarSenha ? "text" : "password"}
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                    placeholder="Confirmar Senha"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => toggleMostrarSenha('confirmarSenha')}
                                >
                                    {mostrarSenha.confirmarSenha ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Criando conta...' : 'Criar Conta'}
                    </button>

                    <p className="auth-link">
                        Já tem uma conta? <span onClick={() => navigate('/login')}>Fazer login</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;