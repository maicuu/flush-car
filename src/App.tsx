import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Certifique-se de criar este arquivo na pasta components
import NovaVenda from "./pages/NovaVenda";
import Configuracoes from "./pages/Configuracoes";

// Importe as futuras páginas aqui
// import Dashboard from "./pages/Dashboard";
// import Historico from "./pages/Historico";

function App() {
  return (
    <Router>
      <Routes>
        {/* O Layout envolve todas as rotas dentro dele */}
        <Route element={<Layout />}>
          {/* Rota principal (Home) */}
          <Route path="/" element={<NovaVenda />} />
          
          {/* Outras rotas que herdarão o Menu e o Cabeçalho */}
          <Route path="/config" element={<Configuracoes />} />
          
          {/* Rotas que você pode criar depois */}
          <Route path="/dashboard" element={<div className="p-8 dark:text-white font-bold">Página Dashboard (Em breve)</div>} />
          <Route path="/historico" element={<div className="p-8 dark:text-white font-bold">Página Histórico (Em breve)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;