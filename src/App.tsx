import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NovaVenda from "./pages/NovaVenda";
import Configuracoes from "./pages/Configuracoes"; // 1. Importe a nova página
import Historico from "./pages/Historico";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Historico />} />
        {/* 2. Adicione a rota para configurações */}
        <Route path="/config" element={<Configuracoes />} />
      </Routes>
    </Router>
  );
}

export default App;