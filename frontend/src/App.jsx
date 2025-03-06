import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard/Dashboard";
import Produtos from "./components/Produtos/Produtos";
import Fornecedores from "./components/Fornecedores/Fornecedores";
import Relatorios from "./components/Relatorio/Relatorio";
import Configuracao from "./components/Configuracao/Configuracao";
import Funcionarios from "./components/Funcionarios/Funcionarios";
import Movimentacoes from "./components/Movimentacoes/Movimentacoes"; 
import AdicionarProduto from "./components/Produtos/FormularioAddProduto/Form";
import RemoverProduto from "./components/Produtos/FormularioVenda/FormVenda";
import FormAddFornecedores from "./components/Fornecedores/FormAddFornecedores/FormAddForncedores";
import FormRemoveFornecedores from "./components/Fornecedores/FormRemoveFornecedores/FormRemoveFornecedores";
import FormAddFuncionarios from "./components/Funcionarios/FormAddFuncionarios/FormAddFuncionarios";
import FormRemoveFuncionarios from "./components/Funcionarios/FormRemoveFuncionarios/FormRemoveFuncionarios";

function App() {
  return (
    <Routes> {/* Use Routes aqui, não dentro do Router */}
      <Route path="/" element={<HomePage />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="funcionarios" element={<Funcionarios />} />
        <Route path="movimentacoes" element={<Movimentacoes />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracao />} /> 
        <Route path="/adicionar-produto" element={<AdicionarProduto />} />
        <Route path="/remover-produto" element={<RemoverProduto />} />
        <Route path="/adicionar-fornecedor" element={<FormAddFornecedores />} />
        <Route path="/remover-fornecedor" element={<FormRemoveFornecedores />} />
        <Route path="/adicionar-funcionario" element={<FormAddFuncionarios />} />
        <Route path="/remover-funcionario" element={<FormRemoveFuncionarios />} />
      </Route>
    </Routes>
  );
}

export default App;
