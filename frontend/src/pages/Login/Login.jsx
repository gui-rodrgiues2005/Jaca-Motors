import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../CriarConta/CriarConta.scss';
import Loader from '../../components/loader/loader'

const Login = () => {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState({
    senha: false,
    confirmarSenha: false
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    CNPJ: '',
    Senha: ''
  });

  const toggleMostrarSenha = (campo) => {
    setMostrarSenha(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Enviando dados de login:", formData);

    const token = localStorage.getItem('token'); // Este é o token que você recebe da sua API
    localStorage.setItem("token", token);
    localStorage.setItem("loginTime", Date.now().toString());
    console.log(token);

    try {
      const response = await axios.post('http://localhost:5096/api/auth/login', formData);
      console.log("Resposta do servidor:", response.data);

      localStorage.setItem('token', response.data.token);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro ao fazer login:", error.response?.data);
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card login">
        <h2>Bem-vindo!</h2>
        <p className="welcome-text">Precisamos do seu acesso para liberar o sistema. Por favor, entre com o seu Cnpj e Senha.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="CNPJ"
              required
            />
          </div>
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
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <Loader/> : 'Entrar'}
          </button>

          <p className="auth-link">
            Não tem uma conta? <span onClick={() => navigate('/registro')}>Criar conta</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;