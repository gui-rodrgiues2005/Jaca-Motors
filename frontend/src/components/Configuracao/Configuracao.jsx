import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfiguracaoProvider, useConfiguracao } from './ConfigurcaoProvider';
import { toast } from 'react-toastify';
import {
  faUser,
  faBell,
  faDatabase,
  faPrint,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import './Configuracao.scss';
import axios from 'axios';


const ConfiguracaoContent = () => {
  const { configuracoes, atualizarConfiguracao } = useConfiguracao();
  const [carregando, setCarregando] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
  const [email, setEmail] = useState('');
  const [temEmailCadastrado, setTemEmailCadastrado] = useState(false);

  const handleExportacao = async () => {
    try {
      const response = await axios.get("http://localhost:5096/api/Produtos/exportar-produtos", {
        responseType: "blob", // Importante para lidar com arquivos binários
      });

      // Criar um link para download do arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("Download", "Produtos.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar produtos:", error);
      alert("Erro ao exportar produtos.");
    }
  };

  // Carregar funcionários
  useEffect(() => {
    const carregarFuncionarios = async () => {
      try {
        setCarregando(true);
        const response = await axios.get('http://localhost:5096/api/Funcionarios/listar-funcionarios');
        console.log('Funcionários carregados:', response.data); // Debug
        setFuncionarios(response.data);
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        toast.error('Erro ao carregar lista de funcionários');
      } finally {
        setCarregando(false);
      }
    };

    carregarFuncionarios();
  }, []);

  // Função para verificar email do funcionário selecionado
  const verificarEmailAlerta = async (funcionarioId) => {
    if (!funcionarioId) return;

    try {
      setCarregando(true);
      const response = await axios.get(`http://localhost:5096/api/Funcionarios/verificar-email-alerta/${funcionarioId}`);

      if (response.data.temEmailAlerta) {
        setEmail(response.data.emailAlerta);
        setTemEmailCadastrado(true);
        toast.info(`Email atual: ${response.data.emailAlerta}`);
      } else {
        setEmail('');
        setTemEmailCadastrado(false);
        toast.warning('Funcionário sem email cadastrado');
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      toast.error('Erro ao verificar email do funcionário');
      setTemEmailCadastrado(false);
    } finally {
      setCarregando(false);
    }
  };

  const atualizarEmail = async () => {
    if (!funcionarioSelecionado || !email) {
      toast.warning('Selecione um funcionário e digite um email');
      return;
    }

    try {
      setCarregando(true);
      await axios.post('http://localhost:5096/api/Funcionarios/atualizar-email-alerta', {
        nome: funcionarioSelecionado,
        email: email
      });

      toast.success('Email atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar email:', error);
      toast.error('Erro ao atualizar email');
    } finally {
      setCarregando(false);
    }
  };

  const carregarEmailSalvo = async () => {
    try {
      const response = await fetch(`http://localhost:5096/api/funcionarios/${userId}`);
      const data = await response.json();

      atualizarConfiguracao("emailNotificacoes", data.emailAlerta || "");
    } catch (error) {
      console.error("❌ Erro ao carregar o e-mail:", error);
    }
  };

  useEffect(() => {
    carregarEmailSalvo();
  }, []);

  return (
    <div className="configuracao">
      <h2>Configurações do Sistema</h2>

      <div className="configuracao__section">
        <h3>
          <FontAwesomeIcon icon={faPrint} /> Exportação
        </h3>
        <div className="configuracao__card">
          <div className="configuracao__item">
            <label>Exportar arquivos para Excel</label>
            <button
              className="btn-exportar"
              onClick={handleExportacao}
              disabled={carregando}
            >
              {carregando ? 'Exportando...' : 'Exportar Agora'}
            </button>
          </div>
        </div>
      </div>

      <div className="configuracao__section">
        <h3>
          <FontAwesomeIcon icon={faBell} /> Notificações
        </h3>
        <div className="configuracao__card">
          <div className="configuracao__item">
            <div className="titulo-info">
              <h3>Registre seu e-mail para receber notificações sobre seu Estoque</h3>
              <div className="info-icon" data-tooltip="⚠️ Recomendações de Segurança:&#10;&#10;1. Crie um email dedicado para o sistema&#10;2. Não use seu email pessoal principal&#10;3. Use autenticação em 2 fatores (mais seguro)&#10;4. Ou crie uma senha específica para apps&#10;&#10;📝 Como configurar:&#10;1. Entre em myaccount.google.com/security&#10;2. Ative 'Verificação em duas etapas'&#10;3. Vá em 'Senhas de app'&#10;4. Crie uma senha específica para o sistema">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
            </div>
            <label>Funcionário responsável</label>
            <select
              value={funcionarioSelecionado}
              onChange={(e) => {
                setFuncionarioSelecionado(e.target.value);
                verificarEmailAlerta(e.target.value);
              }}
              disabled={carregando}
            >
              <option value="">Selecione um funcionário</option>
              {funcionarios && funcionarios.map(func => (
                <option key={func.funcionarioID} value={func.funcionarioID}>
                  {func.nome}
                </option>
              ))}
            </select>

            <div className='email'>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email para alertas"
                disabled={!funcionarioSelecionado || carregando}
              />

              <button
                onClick={atualizarEmail}
                disabled={!funcionarioSelecionado || !email || carregando || temEmailCadastrado}
                className={temEmailCadastrado ? 'btn-disabled' : ''}
              >
                {carregando
                  ? 'Salvando...'
                  : temEmailCadastrado
                    ? 'Email já Cadastrado'
                    : 'Salvar Email'
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="configuracao__section">
        <h3>
          <FontAwesomeIcon icon={faDatabase} /> Resumo do Sistema
        </h3>
        <div className="configuracao__card">
          <div className="configuracao__item">
            <div className="resumo-info">
              <p>
                <strong>Exportação de Dados:</strong> Use o botão "Exportar Agora" para
                fazer o backup completo dos seus produtos em Excel.
              </p>
              <p>
                <strong>Notificações:</strong> Configure emails para receber alertas
                quando produtos atingirem estoque mínimo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente wrapper com o Provider
const Configuracao = () => {
  return (
    <ConfiguracaoProvider>
      <ConfiguracaoContent />
    </ConfiguracaoProvider>
  );
};

export default Configuracao;