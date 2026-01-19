import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NovaVenda from "./pages/NovaVenda";
<<<<<<< HEAD
import Configuracoes from "./pages/Configuracoes"; // 1. Importe a nova página
import Historico from "./pages/Historico";
=======
import StatusDia from "./pages/StatusDia"; // Importando sua nova página
import Configuracoes from "./pages/Configuracoes";
>>>>>>> 60eb2ab61abd1ec5b3d1e9925bfdeaf43365d3e0

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Historico />} />
        {/* 2. Adicione a rota para configurações */}
        <Route path="/config" element={<Configuracoes />} />
=======
        {/* O Layout envolve todas as rotas dentro dele */}
        <Route element={<Layout />}>
          {/* Rota principal: Nova Venda (onde você está trabalhando) */}
          <Route path="/" element={<NovaVenda />} />
          
          {/* Nova Rota: Fluxo do Dia / Status */}
          <Route path="/status" element={<StatusDia />} />
          
          <Route path="/config" element={<Configuracoes />} />
          
          {/* Placeholders para o que está com o Maicon e o Luiz */}
          <Route path="/dashboard" element={<div className="p-8 dark:text-white font-bold">Página Dashboard (Em breve)</div>} />
          <Route path="/historico" element={<div className="p-8 dark:text-white font-bold">Página Histórico (Em breve)</div>} />
        </Route>
>>>>>>> 60eb2ab61abd1ec5b3d1e9925bfdeaf43365d3e0
      </Routes>
    </Router>
  );
}

export default App;