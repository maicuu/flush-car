import { useMemo, useState } from "react";
import { vendasMock } from "../data/mock-vendas";
import type { Venda } from "../types/venda";
import { FiltrosHistorico } from "../components/FiltrosHistorico";
import { VendaCard } from "../components/VendaCard";

const POR_PAGINA = 3;

export default function Historico() {
  const [data, setData] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [status, setStatus] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const responsaveis = [...new Set(vendasMock.map(v => v.responsavel))];

  const filtradas = useMemo(() => {
    return vendasMock.filter(v => {
      return (
        (!data || v.data.startsWith(data)) &&
        (!responsavel || v.responsavel === responsavel) &&
        (!status || v.status === status) &&
        (!busca ||
          v.cliente.toLowerCase().includes(busca.toLowerCase()) ||
          v.placa.toLowerCase().includes(busca.toLowerCase()) ||
          v.modelo.toLowerCase().includes(busca.toLowerCase()))
      );
    });
  }, [data, responsavel, status, busca]);

  const totalFaturado = filtradas.reduce((acc, v) => acc + v.total, 0);

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA);
  const vendasPaginadas = filtradas.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  function exportarCSV() {
    const csv = [
      ["Responsável", "Cliente", "Data", "Placa", "Total"],
      ...filtradas.map(v => [
        v.responsavel,
        v.cliente,
        v.data,
        v.placa,
        v.total
      ])
    ].map(l => l.join(";")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historico.csv";
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">Histórico de Vendas</h1>
        <p className="mb-6 text-gray-600">
          Total faturado: <strong>R$ {totalFaturado}</strong>
        </p>

        <FiltrosHistorico
          data={data}
          responsavel={responsavel}
          status={status}
          busca={busca}
          responsaveis={responsaveis}
          onDataChange={setData}
          onResponsavelChange={setResponsavel}
          onStatusChange={setStatus}
          onBuscaChange={setBusca}
          onExportar={exportarCSV}
        />

        <div className="space-y-6">
          {vendasPaginadas.map(v => (
            <VendaCard key={v.id} venda={v} />
          ))}
        </div>

        {/* PAGINAÇÃO */}
        <div className="flex justify-between items-center mt-8">
          <button
            disabled={pagina === 1}
            onClick={() => setPagina(p => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span>
            {pagina} / {totalPaginas}
          </span>

          <button
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(p => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>

      </div>
    </div>
  );
}
