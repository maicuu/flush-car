import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import NovaVenda from "./pages/NovaVenda";
import Historico from "./pages/Historico";
import StatusDia from "./pages/StatusDia";
// import Dashboard from "./pages/Dashboard";
import Configuracoes from "./pages/Configuracoes";

function App() {
  return (
    <Router 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <Routes>
        {/* Envolvendo as rotas com o Layout para manter o menu visível */}
        <Route element={<Layout />}>
          {/* Dashboard como página inicial oficial */}
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nova-venda" element={<NovaVenda />} />
          <Route path="/status" element={<StatusDia />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/config" element={<Configuracoes />} />
        </Route>

        {/* Redireciona qualquer rota inexistente para o Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;