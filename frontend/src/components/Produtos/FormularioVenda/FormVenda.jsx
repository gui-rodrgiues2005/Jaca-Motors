import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import './FormVenda.scss';

const RegistrarVenda = () => {
    const navigate = useNavigate();
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [venda, setVenda] = useState({
        produtoID: 0,
        funcionarioID: 0,
        clienteID: 0,
        quantidade: 0,
        fornecedorID: 0,
        tipoProdutoID: 0
    });

    // Carregar dados iniciais
    useEffect(() => {
        // Buscar produtos
        axios
            .get("http://localhost:5096/api/Produtos")
            .then((response) => {
                // Filtra apenas os produtos com estoque maior ou igual a 5
                const produtosFiltrados = response.data.filter(produto => produto.quantidadeEstoque >= 5);
                setProdutos(produtosFiltrados);
            })
            .catch((error) => {
                console.error("Erro ao carregar produtos", error);
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

        // Buscar clientes
        axios
            .get("http://localhost:5096/api/Clientes")
            .then((response) => {
                setClientes(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar clientes", error);
            });

        // Buscar fornecedores
        axios
            .get("http://localhost:5096/api/Produtos/fornecedores")
            .then((response) => {
                setFornecedores(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar fornecedores", error);
            });
    }, []);

    const handleProdutoChange = (e) => {
        const produtoID = Number(e.target.value);
        setVenda({ ...venda, produtoID });

        const produto = produtos.find(p => p.produtoID === produtoID);
        setProdutoSelecionado(produto || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!venda.produtoID || !venda.funcionarioID || !venda.clienteID || venda.quantidade <= 0) {
            alert("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        const produtoSelecionado = produtos.find(p => p.produtoID === venda.produtoID);

        if (!produtoSelecionado) {
            alert("Produto não encontrado");
            return;
        }

        if (venda.quantidade > produtoSelecionado.quantidadeEstoque) {
            alert("Quantidade maior que o estoque disponível");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5096/api/Produtos/venda", {
                produtoID: venda.produtoID,
                clienteID: venda.clienteID,
                funcionarioID: venda.funcionarioID,
                quantidade: venda.quantidade
            });

            console.log("Venda registrada:", response.data);
            alert("Venda registrada com sucesso!");
            navigate('/produtos');

            setVenda({
                produtoID: 0,
                funcionarioID: 0,
                clienteID: 0,
                quantidade: 0
            });

        } catch (error) {
            console.error("Erro ao registrar a venda:", error);
            const mensagemErro = error.response?.data?.message || "Erro ao registrar a venda";
            alert(mensagemErro);
        }
    };

    return (
        <div className="registrar-venda-container">
            <div className="form-arrow">
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate('/produtos')} className="icon-arrow" />
                <h3>Registrar Venda</h3>
            </div>
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-column">
                    <div className="form-group">
                        <label>Selecione o Produto</label>
                        <select
                            value={venda.produtoID}
                            onChange={handleProdutoChange}
                        >
                            <option value={0}>Selecione o Produto</option>
                            {produtos.map((produto) => (
                                <option key={produto.produtoID} value={produto.produtoID}>
                                    {produto.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Funcionário Responsável</label>
                        <select
                            value={venda.funcionarioID}
                            onChange={(e) => setVenda({ ...venda, funcionarioID: Number(e.target.value) })}
                        >
                            <option value={0}>Selecione o Funcionário</option>
                            {funcionarios.map((funcionario) => (
                                <option key={funcionario.funcionarioID} value={funcionario.funcionarioID}>
                                    {funcionario.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Cliente</label>
                        <select
                            value={venda.clienteID}
                            onChange={(e) => setVenda({ ...venda, clienteID: Number(e.target.value) })}
                        >
                            <option value={0}>Selecione o Cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.clienteID} value={cliente.clienteID}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Confirme o Fornecedor expecificado nas informações</label>
                        <select
                            value={venda.fornecedorID}
                            onChange={(e) => setVenda({ ...venda, fornecedorID: Number(e.target.value) })}
                        >
                            <option value={0}>Selecione o Fornecedor</option>
                            {fornecedores.map((fornecedor) => (
                                <option key={fornecedor.fornecedorID} value={fornecedor.fornecedorID}>
                                    {fornecedor.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-column">
                    {produtoSelecionado && (
                        <div className="produto-info">
                            <h4>Informações do Produto</h4>
                            <p>Produto - {produtoSelecionado.nome}</p>
                            <p>Preço de Venda -  R$ {produtoSelecionado.precoVenda.toFixed(2)}</p>
                            <p>Disponível em Estoque - {produtoSelecionado.quantidadeEstoque}</p>
                            <p>Fornecedor - {produtoSelecionado.fornecedorNome}</p>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Quantidade</label>
                        <input
                            type="number"
                            min="1"
                            max={produtoSelecionado?.quantidadeEstoque || 0}
                            value={venda.quantidade}
                            onChange={(e) => setVenda({ ...venda, quantidade: Number(e.target.value) })}
                        />
                    </div>

                    {produtoSelecionado && venda.quantidade > 0 && (
                        <div className="total-venda">
                            <h4>Total da Venda</h4>
                            <p>R$ {(produtoSelecionado.precoVenda * venda.quantidade).toFixed(2)}</p>
                        </div>
                    )}
                </div>

                <div className="form-footer">
                    <button type="submit" className="btn-submit">Registrar Venda</button>
                </div>
            </form>
        </div>
    );
};

export default RegistrarVenda;
