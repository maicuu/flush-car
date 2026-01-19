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

  // 2. useEffect ajustado para evitar cascading renders
  useEffect(() => {
    let montado = true;

    // Chamamos a função de forma assíncrona dentro de um escopo isolado
    const inicializar = async () => {
      await carregarDadosReais();
      if (montado) {
        setIsMounted(true);
      }
    };

    inicializar();

    return () => {
      montado = false;
    };
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
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black uppercase tracking-tighter italic">Flush_Control v1</h1>
          <button 
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-shadow shadow-sm"
          >
            {mostrarDetalhes ? <EyeOff size={20} className="text-gray-600" /> : <Eye size={20} className="text-gray-600" />}
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['TODOS', 'MAICON', 'LUIZ', 'FELIPE'].map((nome) => (
            <button
              key={nome}
              onClick={() => setFiltro(nome)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap ${
                filtro === nome ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200' : 'bg-white border-gray-200 text-gray-400'
              }`}
            >
              {nome}
            </button>
          ))}
        </div>

        {!mostrarDetalhes ? (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <CardResumo t="Faturamento" v={`R$ ${faturamentoTotal.toFixed(2)}`} c="text-emerald-600" />
              <CardResumo t="Vendas" v={dadosListaFiltrados.length} c="text-blue-600" />
              <CardResumo t="Tkt Médio" v={`R$ ${(faturamentoTotal / (dadosListaFiltrados.length || 1)).toFixed(2)}`} c="text-orange-600" />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <h3 className="text-[10px] font-black text-gray-400 uppercase mb-8 tracking-widest text-center">Produção por Lavador (R$)</h3>
              
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
                        cursor={{fill: '#f9fafb'}} 
                        contentStyle={{
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }} 
                      />
                      <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={45}>
                        {dadosGrafico.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.nome === filtro ? '#f97316' : '#e2e8f0'} 
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 p-4 px-6 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 rounded-t-2xl">
              <span>Cliente / Veículo</span>
              <span className="text-center">Status</span>
              <span className="text-right">Valor Total</span>
            </div>
            <div className="divide-y divide-gray-100">
              {dadosListaFiltrados.length > 0 ? (
                dadosListaFiltrados.map(v => (
                  <div key={v.id} className="p-4 px-6 grid grid-cols-3 items-center hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-700">{v.cliente}</span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase">{v.veiculo} • {v.placa}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase border ${
                        v.status === 'concluido' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <span className="font-black text-gray-900 text-sm text-right">R$ {Number(v.total).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 text-sm">Nenhum registro encontrado.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CardResumo = ({ t, v, c }: { t: string, v: string | number, c: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center transition-transform hover:scale-[1.02]">
    <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">{t}</p>
    <p className={`text-2xl font-black ${c}`}>{v}</p>
  </div>
);

export default Dashboard;