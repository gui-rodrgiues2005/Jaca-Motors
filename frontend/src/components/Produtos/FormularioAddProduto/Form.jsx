import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import './Form.scss';

const AdicionarProduto = () => {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [produto, setProduto] = useState({
    nome: "",
    tipoProdutoID: 0,
    fornecedorID: 0,
    funcionarioID: 0,
    descricao: "",
    quantidadeEstoque: 0,
    precoCompra: 0,
    precoVenda: 0,
  });

  // Carregar fornecedores e funcionários
  useEffect(() => {
    // Buscar fornecedores
    axios
      .get("http://localhost:5096/api/Produtos/fornecedores")
      .then((response) => {
        setFornecedores(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar fornecedores", error);
      });

    // Buscar funcionários
    axios
      .get("http://localhost:5096/api/Produtos/funcionarios")
      .then((response) => {
        setFuncionarios(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar funcionários", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!produto.nome || !produto.tipoProdutoID || !produto.fornecedorID || !produto.funcionarioID) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Objeto simplificado para enviar
    const produtoParaEnviar = {
      nome: produto.nome,
      tipoProdutoID: produto.tipoProdutoID,
      fornecedorID: produto.fornecedorID,
      funcionarioID: produto.funcionarioID,
      descricao: produto.descricao,
      quantidadeEstoque: produto.quantidadeEstoque,
      precoCompra: produto.precoCompra,
      precoVenda: produto.precoVenda
    };

    try {
      const response = await axios.post("http://localhost:5096/api/Produtos/comprar", produtoParaEnviar);
      console.log("Response data:", response.data);
      alert("Compra registrada com sucesso!");
      navigate('/produtos');

      // Limpar formulário
      setProduto({
        nome: "",
        tipoProdutoID: 0,
        fornecedorID: 0,
        funcionarioID: 0,
        descricao: "",
        quantidadeEstoque: 0,
        precoCompra: 0,
        precoVenda: 0,
      });
    } catch (error) {
      console.error("Erro ao registrar a compra:", error);
      const mensagemErro = error.response?.data?.message || "Erro ao registrar a compra";
      alert(mensagemErro);
    }
  };

  return (
    <div className="adicionar-produto-container">
      <div className="form-arrow">
        <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate('/produtos')} className="icon-arrow"/>
        <h3>Adicionar Produto</h3>
      </div>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-column">
          <div className="form-group">
            <label>Nome do Produto</label>
            <input
              type="text"
              value={produto.nome}
              onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Categoria do Produto</label>
            <select
              value={produto.tipoProdutoID}
              onChange={(e) => setProduto({ ...produto, tipoProdutoID: parseInt(e.target.value) })}
            >
              <option value="">Selecione a Categoria</option>
              <option value="1">Peças</option>
              <option value="2">Acessórios</option>
              <option value="3">Óleos e Lubricantes</option>
              <option value="4">Pneus</option>
            </select>
          </div>

          <div className="form-group">
            <label>Selecione o Fornecedor</label>
            <select
              value={produto.fornecedorID}
              onChange={(e) => setProduto({ ...produto, fornecedorID: Number(e.target.value) })}
            >
              <option value={0}>Selecione o Fornecedor</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.fornecedorID} value={fornecedor.fornecedorID}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Funcionário que esta realizando o Registro</label>
            <select
              value={produto.funcionarioID}
              onChange={(e) => setProduto({ ...produto, funcionarioID: Number(e.target.value) })}
            >
              <option value={0}>Selecione o Funcionário</option>
              {funcionarios.map((funcionario) => (
                <option key={funcionario.funcionarioID} value={funcionario.funcionarioID}>
                  {funcionario.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={produto.descricao}
              onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Quantidade em Estoque</label>
            <input
              type="number"
              value={produto.quantidadeEstoque}
              onChange={(e) => setProduto({ ...produto, quantidadeEstoque: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label>Preço de Compra (Unidade)</label>
            <input
              type="text"
              value={produto.precoCompra > 0 ? `R$ ${produto.precoCompra}` : ""}
              placeholder="R$ 0,00"
              onChange={(e) => {
                // Remover "R$ " e formatar o número corretamente
                const valor = e.target.value.replace("R$", "").trim();
                const numero = Number(valor.replace(",", "."));
                if (!isNaN(numero)) {
                  setProduto({ ...produto, precoCompra: numero });
                }
              }}
            />
          </div>

          <div className="form-group">
            <label>Preço de Venda (Unidade)</label>
            <input
              type="text"
              value={produto.precoVenda > 0 ? `R$ ${produto.precoVenda}` : ""}
              placeholder="R$ 0,00"
              onChange={(e) => {
                const valor = e.target.value.replace("R$", "").trim();
                const numero = Number(valor.replace(",", "."));
                if (!isNaN(numero)) {
                  setProduto({ ...produto, precoVenda: numero });
                }
              }}
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-submit">Registrar Compra</button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarProduto;
