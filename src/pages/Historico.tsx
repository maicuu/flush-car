import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase, APP_SLUG } from "../lib/supabase";
import type { Venda, Servico } from "../types/venda";
import { FiltrosHistorico } from "../components/FiltrosHistorico";
// ATENÇÃO: Verifique se o caminho abaixo é ../components/VendaCard 
// ou ../components/ui/VendaCard dependendo de onde você salvou o arquivo
import { VendaCard } from "../components/ui/VendaCard"; 
import { DollarSign, Car, BarChart3, SearchX, Download } from "lucide-react";

const POR_PAGINA = 8;

export default function Historico() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    data: "",
    responsavel: "",
    status: "",
    busca: ""
  });
  const [pagina, setPagina] = useState(1);

  const responsaveis = ["MAICON", "LUIZ", "FELIPE"];

  const carregarHistorico = useCallback(async () => {
    try {
      setLoading(true);
      const { data: dados, error } = await supabase
        .from('vendas')
        .select('*')
        .eq('empresa_slug', APP_SLUG)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendas((dados as Venda[]) || []);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Erro na busca:", err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarHistorico(); }, [carregarHistorico]);

  // RESET DE PÁGINA: Sempre que filtrar algo, volta para a página 1
  useEffect(() => {
    setPagina(1);
  }, [filtros]);

  const filtradas = useMemo(() => {
    return vendas.filter(v => {
      // Filtro de Data
      const matchData = !filtros.data || v.created_at?.startsWith(filtros.data);
      
      // Filtro de Responsável
      const matchResp = !filtros.responsavel || v.servicos?.some((s: Servico) => 
        s.responsavel?.toUpperCase() === filtros.responsavel.toUpperCase()
      );
      
      // Filtro de Status
      const matchStatus = !filtros.status || v.status === filtros.status;
      
      // Filtro de Busca Global (Cliente, Placa, Veículo e Método de Pagamento)
      const buscaLower = filtros.busca.toLowerCase();
      const matchBusca = !filtros.busca || 
        [v.cliente, v.placa, v.veiculo, v.metodo_pagamento]
          .some(field => field?.toLowerCase().includes(buscaLower));
      
      return matchData && matchResp && matchStatus && matchBusca;
    });
  }, [vendas, filtros]);

  const stats = useMemo(() => {
    const total = filtradas.reduce((acc, v) => acc + Number(v.total), 0);
    return {
      faturado: total,
      qtd: filtradas.length,
      ticket: filtradas.length ? total / filtradas.length : 0
    };
  }, [filtradas]);

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA) || 1;
  const vendasPaginadas = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const exportarCSV = () => {
    const headers = "Data;Cliente;Veiculo;Placa;Metodo;Total;Status\n";
    const rows = filtradas.map(v => (
      `${new Date(v.created_at || '').toLocaleDateString()};${v.cliente};${v.veiculo};${v.placa};${v.metodo_pagamento || 'N/A'};${v.total};${v.status}`
    )).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `relatorio-flush-car.csv`);
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Fluxo <span className="text-cyan-500 text-not-italic text-2xl">HISTÓRICO</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-1">
            {stats.qtd} Registros Encontrados
          </p>
        </div>
        
        {/* <button 
          onClick={exportarCSV}
          className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Download className="w-4 h-4" /> EXPORTAR RELATÓRIO
        </button> */}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Faturado", val: `R$ ${stats.faturado.toFixed(2)}`, icon: <DollarSign />, color: "bg-emerald-50 text-emerald-600" },
          { label: "Serviços", val: stats.qtd, icon: <Car />, color: "bg-cyan-50 text-cyan-600" },
          { label: "Ticket Médio", val: `R$ ${stats.ticket.toFixed(2)}`, icon: <BarChart3 />, color: "bg-purple-50 text-purple-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] flex items-center gap-5 border border-slate-50 dark:border-slate-800 shadow-sm">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <FiltrosHistorico
        data={filtros.data}
        responsavel={filtros.responsavel}
        status={filtros.status}
        busca={filtros.busca}
        responsaveis={responsaveis}
        onDataChange={(val) => setFiltros(f => ({...f, data: val}))}
        onResponsavelChange={(val) => setFiltros(f => ({...f, responsavel: val}))}
        onStatusChange={(val) => setFiltros(f => ({...f, status: val}))}
        onBuscaChange={(val) => setFiltros(f => ({...f, busca: val}))}
        onExportar={exportarCSV}
      />

      {/* LISTAGEM - Onde o VendaCard aparece */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-4 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800" />)}
          </div>
        ) : filtradas.length > 0 ? (
          vendasPaginadas.map(v => <VendaCard key={v.id} venda={v} />)
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
            <SearchX className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-400 font-black uppercase italic tracking-tighter text-xl">Nenhum resultado</h3>
          </div>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <button 
            disabled={pagina === 1}
            onClick={() => { setPagina(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-black text-xs uppercase tracking-widest disabled:opacity-30 transition-all hover:bg-slate-50"
          >
            Anterior
          </button>
          <div className="h-14 flex items-center px-6 bg-slate-900 text-white rounded-2xl font-black">
            {pagina} / {totalPaginas}
          </div>
          <button 
            disabled={pagina === totalPaginas}
            onClick={() => { setPagina(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-black text-xs uppercase tracking-widest disabled:opacity-30 transition-all hover:bg-slate-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}