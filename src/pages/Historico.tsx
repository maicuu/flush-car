import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase, APP_SLUG } from "../lib/supabase";
import type { Venda, Servico } from "../types/venda";
import { FiltrosHistorico } from "../components/FiltrosHistorico";
import { VendaCard } from "../components/VendaCard";
import { Card, CardContent } from "../components/ui/card";
import { DollarSign, Car, Calendar as CalendarIcon, Download } from "lucide-react";

const POR_PAGINA = 8;

export default function Historico() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [status, setStatus] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  // Lista de responsáveis para o filtro
  const responsaveis = ["MAICON", "LUIZ", "FELIPE"];

  const carregarHistorico = useCallback(async () => {
    try {
      setLoading(true);
      const { data: dadosSupabase, error } = await supabase
        .from('vendas')
        .select('*')
        .eq('empresa_slug', APP_SLUG)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendas((dadosSupabase as Venda[]) || []);
    } catch (error: any) {
      console.error("Erro ao carregar histórico:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarHistorico();
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

  const stats = useMemo(() => ({
    faturado: filtradas.reduce((acc, v) => acc + Number(v.total), 0),
    totalVendas: filtradas.length,
    mediaPorVenda: filtradas.length ? (filtradas.reduce((acc, v) => acc + Number(v.total), 0) / filtradas.length) : 0
  }), [filtradas]);

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA) || 1;
  const vendasPaginadas = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const exportarCSV = () => {
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
    a.download = `relatorio-flush-car.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER E STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Histórico <span className="text-cyan-500">Geral</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Gerencie e exporte todos os seus serviços realizados</p>
        </div>
        
        <button 
          onClick={exportarCSV}
          className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
        >
          <Download className="h-4 w-4" /> Exportar Relatório
        </button>
      </div>

      {/* MINI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Faturado", value: `R$ ${stats.faturado.toFixed(2)}`, icon: <DollarSign />, color: "text-emerald-500" },
          { label: "Serviços", value: stats.totalVendas, icon: <Car />, color: "text-cyan-500" },
          { label: "Ticket Médio", value: `R$ ${stats.mediaPorVenda.toFixed(2)}`, icon: <CalendarIcon />, color: "text-purple-500" },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black dark:text-white leading-none">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
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

      {/* LISTAGEM */}
      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
            ))}
          </div>
        ) : vendasPaginadas.length > 0 ? (
          vendasPaginadas.map(v => <VendaCard key={v.id} venda={v} />)
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
             <p className="text-slate-400 font-bold italic">Nenhum registro encontrado...</p>
          </div>
        )}
      </div>

      {/* PAGINAÇÃO MODERNA */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={pagina === 1}
            onClick={() => { setPagina(p => p - 1); window.scrollTo(0, 0); }}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-20 hover:bg-white dark:hover:bg-slate-900 transition-all font-bold text-sm text-slate-600 dark:text-slate-400"
          >
            Anterior
          </button>
          
          <div className="flex gap-2">
             {Array.from({ length: totalPaginas }).map((_, i) => (
               <button 
                key={i}
                onClick={() => setPagina(i + 1)}
                className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                  pagina === i + 1 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                  : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
               >
                 {i + 1}
               </button>
             ))}
          </div>

          <button
            disabled={pagina === totalPaginas}
            onClick={() => { setPagina(p => p + 1); window.scrollTo(0, 0); }}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-20 hover:bg-white dark:hover:bg-slate-900 transition-all font-bold text-sm text-slate-600 dark:text-slate-400"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}