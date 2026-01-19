import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Eye, EyeOff } from 'lucide-react';

const DADOS_MOCK = [
  { id: 1, cliente: "João Silva", valor: 50.00, responsavel: "MAICON" },
  { id: 2, cliente: "Maria Oliveira", valor: 80.00, responsavel: "FELIPE" },
  { id: 3, cliente: "Carlos Souza", valor: 45.00, responsavel: "LUIZ" },
  { id: 4, cliente: "Ana Costa", valor: 120.00, responsavel: "FELIPE" },
  { id: 5, cliente: "Roberto", valor: 90.00, responsavel: "MAICON" },
];

const Dashboard = () => {
  const [filtro, setFiltro] = useState('TODOS');
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Força a montagem para evitar erros de hidratação e dimensões
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dadosFiltrados = useMemo(() => {
    return filtro === 'TODOS' ? DADOS_MOCK : DADOS_MOCK.filter(v => v.responsavel === filtro);
  }, [filtro]);

  const dadosGrafico = useMemo(() => {
    const resumo = { MAICON: 0, LUIZ: 0, FELIPE: 0 };
    DADOS_MOCK.forEach(v => {
      resumo[v.responsavel as keyof typeof resumo] += v.valor;
    });
    return Object.keys(resumo).map(nome => ({
      nome,
      total: resumo[nome as keyof typeof resumo]
    }));
  }, []);

  const faturamentoTotal = dadosFiltrados.reduce((acc, v) => acc + v.valor, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black uppercase tracking-tighter">Wash_Control v1</h1>
          <button 
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mostrarDetalhes ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Filtros - Baseado nos responsáveis da imagem: Maicon, Luiz, Felipe */}
        <div className="flex gap-2 mb-8">
          {['TODOS', 'MAICON', 'LUIZ', 'FELIPE'].map((nome) => (
            <button
              key={nome}
              onClick={() => setFiltro(nome)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                filtro === nome ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-200 text-gray-400'
              }`}
            >
              {nome}
            </button>
          ))}
        </div>

        {!mostrarDetalhes ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <CardResumo t="Faturamento" v={`R$ ${faturamentoTotal.toFixed(2)}`} c="text-green-600" />
              <CardResumo t="Vendas" v={dadosFiltrados.length} c="text-blue-600" />
              <CardResumo t="Tkt Médio" v={`R$ ${(faturamentoTotal / (dadosFiltrados.length || 1)).toFixed(2)}`} c="text-orange-600" />
            </div>

            {/* Gráfico com correção definitiva usando height fixo no container */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <h3 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest text-center">Desempenho por Equipe</h3>
              
              <div className="w-full flex justify-center" style={{ minHeight: '300px' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="nome" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fontWeight: 'bold', fill: '#9ca3af'}} 
                      />
                      <YAxis hide />
                      <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                      <Bar dataKey="total" radius={[6, 6, 6, 6]} barSize={50}>
                        {dadosGrafico.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.nome === 'FELIPE' ? '#f97316' : '#e5e7eb'} 
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
          /* Lista com Coluna Centralizada */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 p-4 px-6 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
              <span>Cliente</span>
              <span className="text-center">Responsável</span>
              <span className="text-right">Valor</span>
            </div>
            <div className="divide-y divide-gray-100">
              {dadosFiltrados.map(v => (
                <div key={v.id} className="p-4 px-6 grid grid-cols-3 items-center hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-sm text-gray-700">{v.cliente}</span>
                  <div className="flex justify-center">
                    <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded text-gray-500 uppercase">
                      {v.responsavel}
                    </span>
                  </div>
                  <span className="font-black text-gray-900 text-sm text-right">R$ {v.valor.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CardResumo = ({ t, v, c }: { t: string, v: string | number, c: string }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
    <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">{t}</p>
    <p className={`text-xl font-black ${c}`}>{v}</p>
  </div>
);

export default Dashboard;