import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NovaVenda from "./pages/NovaVenda";
import Configuracoes from "./pages/Configuracoes"; // 1. Importe a nova página
import Dashboard from './pages/Dashboard'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NovaVenda />} />
        {/* 2. Adicione a rota para configurações */}
        <Route path="/config" element={<Configuracoes />} />
        <Route path="/dash" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;