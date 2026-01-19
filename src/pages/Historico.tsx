import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase, APP_SLUG } from "../lib/supabase";
import type { Venda, Servico } from "../types/venda";
import { FiltrosHistorico } from "../components/FiltrosHistorico";
import { VendaCard } from "../components/VendaCard";

const POR_PAGINA = 10;

export default function Historico() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [data, setData] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [status, setStatus] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const carregarHistorico = useCallback(async () => {
    const { data: dadosSupabase, error } = await supabase
      .from('vendas')
      .select('*')
      .eq('empresa_slug', APP_SLUG)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao carregar histórico:", error.message);
    } else {
      setVendas((dadosSupabase as Venda[]) || []);
    }
  }, []);

  useEffect(() => {
    // Carregamento assíncrono para evitar aviso de cascading renders
    const fetchData = async () => {
      await carregarHistorico();
    };
    fetchData();
  }, [carregarHistorico]);

  const filtradas = useMemo(() => {
    return vendas.filter(v => {
      const dataVenda = v.created_at || ""; 
      
      return (
        (!data || dataVenda.startsWith(data)) &&
        (!responsavel || v.servicos?.some((s: Servico) => s.responsavel === responsavel)) &&
        (!status || v.status === status) &&
        (!busca ||
          v.cliente.toLowerCase().includes(busca.toLowerCase()) ||
          v.placa.toLowerCase().includes(busca.toLowerCase()) ||
          v.veiculo.toLowerCase().includes(busca.toLowerCase()))
      );
    });
  }, [vendas, data, responsavel, status, busca]);

  const totalFaturado = filtradas.reduce((acc, v) => acc + Number(v.total), 0);
  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA) || 1;
  const vendasPaginadas = filtradas.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  const responsaveis = ["MAICON", "LUIZ", "FELIPE"];

  function exportarCSV() {
    const csv = [
      ["Data", "Cliente", "Veículo", "Placa", "Total", "Status"],
      ...filtradas.map(v => [
        v.created_at ? new Date(v.created_at).toLocaleDateString() : "",
        v.cliente,
        v.veiculo,
        v.placa,
        v.total,
        v.status
      ])
    ].map(l => l.join(";")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flush-car-relatorio.csv`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Histórico de Vendas</h1>
            <p className="text-gray-600">
              Total faturado: <strong className="text-emerald-600 font-black text-xl">R$ {totalFaturado.toFixed(2)}</strong>
            </p>
          </div>
          <button 
            onClick={exportarCSV}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Exportar CSV
          </button>
        </div>

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

        <div className="space-y-4 mt-8">
          {vendasPaginadas.length > 0 ? (
            vendasPaginadas.map(v => (
              <VendaCard key={v.id} venda={v} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
              Nenhuma venda encontrada com os filtros selecionados.
            </div>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(p => p - 1)}
              className="px-4 py-2 text-sm font-bold border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(p => p + 1)}
              className="px-4 py-2 text-sm font-bold border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}