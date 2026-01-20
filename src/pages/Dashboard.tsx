import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import { supabase, APP_SLUG } from '../lib/supabase';
import { Venda, Servico } from '../types/venda';

const Dashboard = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const carregarDadosReais = useCallback(async () => {
    const { data, error } = await supabase
      .from('vendas')
      .select('*')
      .eq('empresa_slug', APP_SLUG);
    
    if (error) {
      console.error("Erro ao buscar dados:", error.message);
      return;
    }
    
    if (data) setVendas(data as Venda[]);
  }, []);

  useEffect(() => {
    let montado = true;
    const inicializar = async () => {
      await carregarDadosReais();
      if (montado) setIsMounted(true);
    };
    inicializar();
    return () => { montado = false; };
  }, [carregarDadosReais]);

  const dadosGrafico = useMemo(() => {
    const resumo = { MAICON: 0, LUIZ: 0, FELIPE: 0 };
    vendas.forEach(venda => {
      venda.servicos?.forEach((s: Servico) => {
        const resp = s.responsavel?.toUpperCase();
        if (resp && resp in resumo) {
          resumo[resp as keyof typeof resumo] += Number(s.preco || 0);
        }
      });
    });
    return Object.keys(resumo).map(nome => ({
      nome,
      total: resumo[nome as keyof typeof resumo]
    }));
  }, [vendas]);

  const dadosListaFiltrados = useMemo(() => {
    if (filtro === 'TODOS') return vendas;
    return vendas.filter(v => 
      v.servicos?.some((s: Servico) => s.responsavel?.toUpperCase() === filtro)
    );
  }, [vendas, filtro]);

  const faturamentoTotal = useMemo(() => {
    if (filtro === 'TODOS') {
      return vendas.reduce((acc, v) => acc + Number(v.total || 0), 0);
    }
    return vendas.reduce((acc, v) => {
      const parteFuncionario = v.servicos
        ?.filter((s: Servico) => s.responsavel?.toUpperCase() === filtro)
        .reduce((sum, s) => sum + Number(s.preco || 0), 0);
      return acc + (parteFuncionario || 0);
    }, 0);
  }, [vendas, filtro]);

  return (
    // Removido bg-gray-50 fixo para usar o fundo do Layout
    <div className="min-h-screen font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-2">
        
        {/* HEADER DO DASHBOARD */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black uppercase tracking-tighter italic dark:text-white">Flush_Control v1</h1>
          <button 
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            {mostrarDetalhes ? <EyeOff size={20} className="text-slate-600 dark:text-slate-400" /> : <Eye size={20} className="text-slate-600 dark:text-slate-400" />}
          </button>
        </div>

        {/* FILTROS (PILLS) */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['TODOS', 'MAICON', 'LUIZ', 'FELIPE'].map((nome) => (
            <button
              key={nome}
              onClick={() => setFiltro(nome)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap ${
                filtro === nome 
                ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              {nome}
            </button>
          ))}
        </div>

        {!mostrarDetalhes ? (
          <div className="animate-in fade-in duration-500">
            {/* CARDS DE RESUMO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <CardResumo t="Faturamento" v={`R$ ${faturamentoTotal.toFixed(2)}`} c="text-emerald-600 dark:text-emerald-400" />
              <CardResumo t="Vendas" v={dadosListaFiltrados.length} c="text-blue-600 dark:text-blue-400" />
              <CardResumo t="Tkt Médio" v={`R$ ${(faturamentoTotal / (dadosListaFiltrados.length || 1)).toFixed(2)}`} c="text-orange-600 dark:text-orange-400" />
            </div>

            {/* GRÁFICO */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-8 tracking-widest text-center">Produção por Lavador (R$)</h3>
              
              <div className="w-full flex justify-center" style={{ minHeight: '300px' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosGrafico} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <XAxis 
                        dataKey="nome" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fontWeight: 'bold', fill: '#9ca3af'}} 
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{fill: 'transparent'}} 
                        contentStyle={{
                          borderRadius: '12px', 
                          backgroundColor: '#1e293b', // Fundo escuro para o tooltip
                          border: 'none', 
                          color: '#fff',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                        }} 
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={45}>
                        {dadosGrafico.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.nome === filtro ? '#f97316' : '#e2e8f0'} 
                            className="transition-all duration-300 dark:fill-slate-800"
                            style={{ fill: entry.nome === filtro ? '#f97316' : undefined }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* LISTA DE VENDAS */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 p-4 px-6 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
              <span>Cliente / Veículo</span>
              <span className="text-center">Status</span>
              <span className="text-right">Valor Total</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {dadosListaFiltrados.length > 0 ? (
                dadosListaFiltrados.map(v => (
                  <div key={v.id} className="p-4 px-6 grid grid-cols-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{v.cliente}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">{v.veiculo} • {v.placa}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase border ${
                        v.status === 'concluido' 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm text-right">R$ {Number(v.total).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 dark:text-slate-600 text-sm">Nenhum registro encontrado.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CardResumo = ({ t, v, c }: { t: string, v: string | number, c: string }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-transform hover:scale-[1.02]">
    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-tighter">{t}</p>
    <p className={`text-2xl font-black ${c}`}>{v}</p>
  </div>
);

export default Dashboard;