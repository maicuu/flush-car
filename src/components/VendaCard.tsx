import type { Venda } from "../types/venda";

export function VendaCard({ venda }: { venda: Venda }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 space-y-6">
      <div className="flex justify-between">
        <div>
          <p><strong>Responsável:</strong> {venda.responsavel}</p>
          <p><strong>Cliente:</strong> {venda.cliente}</p>
          <p><strong>Data:</strong> {new Date(venda.data).toLocaleString("pt-BR")}</p>
        </div>

        <span className={`inline-flex items-center rounded px-0.5 text-base font-medium   ${
          venda.status === "concluido"
            ? "bg-green-400 text-green-700"
            : venda.status === "pendente"
            ? "bg-yellow-200 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}>
          {venda.status}
        </span>
      </div>

      <div className="bg-gray-50 border rounded-xl p-4 flex justify-between">
        <div>
          <p><strong>Veículo:</strong> {venda.veiculo}</p>
          <p><strong>Modelo:</strong> {venda.modelo}</p>
        </div>
        <div className="relative border-2 border-black rounded-md overflow-hidden">
  
        <div className="bg-blue-700 text-white text-xs px-2 flex justify-between items-center">
          BRASIL
        </div>
        {/* Bandeira no cantinho */}
        <img
          src="https://flagcdn.com/w20/br.png"
          alt="Brasil"
          className="absolute top-1 right-1 w-4 h-auto rounded-sm"
        />
          <div className="px-3 py-1 font-mono font-extrabold tracking-widest">
            {venda.placa}
          </div>
        </div>
      </div>

      <div>
        <strong>Serviços:</strong>
        {venda.servicos.map((s, i) => (
          <div key={i} className="flex justify-between border rounded px-4 py-2 mt-2 bg-gray-50">
            <span>{s.nome}</span>
            <span>R$ {s.preco}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t pt-4">
        <span><strong>Método:</strong> {venda.metodoPagamento}</span>
        <span className="text-xl font-bold">R$ {venda.total}</span>
      </div>
    </div>
  );
}
