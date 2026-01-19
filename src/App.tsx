import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NovaVenda from "./pages/NovaVenda";
import StatusDia from "./pages/StatusDia"; // Importando sua nova página
import Configuracoes from "./pages/Configuracoes";

function App() {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;