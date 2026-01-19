import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Configuracoes() {
  return (
    <div className="p-10 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-slate-800">Página de Configurações</h1>
      <p className="text-muted-foreground">O roteamento está funcionando se você consegue ler isso!</p>
      
      {/* Botão para voltar à página inicial */}
      <Button asChild variant="link">
        <Link to="/">← Voltar para Nova Venda</Link>
      </Button>
    </div>
  );
}