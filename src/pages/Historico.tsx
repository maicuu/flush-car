import { vendasMock } from "../data/mock-vendas"; // Importa o array de vendas mockadas (dados)
import type { Venda } from "../types/venda"; // Importa apenas o tipo Venda (TypeScript)

export default function Historico() { // Define o componente da página Histórico
    return ( // Retorna o JSX que será renderizado na tela
    <div className="p-6"> {/* Container principal com padding */}
      <h1 className="text-2xl font-bold mb-6">Histórico</h1> {/* Título da página */}
      
      <div className="space-y-4"> {/* Espaçamento vertical entre os cards */}
        {vendasMock.map((venda: Venda) => ( // Percorre todas as vendas e renderiza um card para cada uma
          <div
            key={venda.id} // Chave única exigida pelo React para listas
            className="border rounded-lg p-4 shadow-sm" // Estilo do card
          >
            <div className="flex justify-between items-center"> {/* Linha superior do card */}
              <div>
                <p className="font-semibold">{venda.cliente}</p> {/* Nome do cliente */}
                <p className="text-sm text-gray-500">
                  {new Date(venda.data).toLocaleString("pt-BR")} {/* Data formatada */}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded text-sm ${ // Classes base do status
                  venda.status === "concluido" // Verifica o status da venda
                    ? "bg-green-100 text-green-700" // Se concluído → verde
                    : "bg-yellow-100 text-yellow-700" // Se não → amarelo
                }`}
              >
                {venda.status} {/* Texto do status */}
              </span>
            </div>

            <div className="mt-3 text-sm"> {/* Corpo do card */}
              <p>
                <strong>Veículo:</strong> {venda.veiculo} ({venda.placa}) {/* Veículo e placa */}
              </p>

              <p className="mt-2 font-medium">Serviços:</p> {/* Título da lista de serviços */}
              <ul className="list-disc ml-5"> {/* Lista com marcadores */}
                {venda.servicos.map((servico, index) => ( // Percorre os serviços da venda
                  <li key={index}> {/* Chave única do serviço */}
                    {servico.nome} – R$ {servico.preco} {/* Nome e preço do serviço */}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between mt-3 font-semibold"> {/* Rodapé do card */}
                <span>Método: {venda.metodoPagamento}</span> {/* Método de pagamento */}
                <span>Total: R$ {venda.total}</span> {/* Valor total da venda */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


