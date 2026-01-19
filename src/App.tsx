import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NovaVenda from "./pages/NovaVenda"; // O caminho correto baseado na sua estrutura

function App() {
  return (
    <Router>
      <Routes>
        {/* Definimos que a página de Nova Venda é a principal */}
        <Route path="/" element={<NovaVenda />} />
      </Routes>
    </Router>
  );
}

export default App;