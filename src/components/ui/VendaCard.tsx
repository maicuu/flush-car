// O segredo está aqui: ../../ para subir duas pastas
import { Venda } from "../../types/venda"; 
import { Clock, CheckCircle2, Droplets, CreditCard, User, Calendar, Hash } from "lucide-react";

export function VendaCard({ venda }: { venda: Venda }) {
  // Configuração de Status Estilizada
  const statusStyles = {
    pendente: {
      label: "Aguardando",
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      border: "border-amber-200/50",
      icon: <Clock className="w-3.5 h-3.5" />
    },
    lavando: {
      label: "Em Lavagem",
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "border-blue-200/50",
      icon: <Droplets className="w-3.5 h-3.5 animate-bounce" />
    },
    concluido: {
      label: "Finalizado",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      border: "border-emerald-200/50",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    }
  };

  const style = statusStyles[venda.status] || statusStyles.pendente;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300">
      
      {/* Indicador Lateral de Cor */}
      <div className={`absolute left-0 top-8 bottom-8 w-1 rounded-r-full ${style.text.replace('text', 'bg')}`} />

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* BLOCO 1: IDENTIFICAÇÃO (PLACA E CARRO) */}
        <div className="flex items-center gap-4 min-w-[250px]">
          <div className="flex flex-col border-[2.5px] border-slate-900 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-blue-600 text-[8px] font-bold text-white px-2 py-0.5 flex justify-between items-center tracking-tighter">
              <span>BRASIL</span>
              <div className="w-2 h-1.5 bg-yellow-400 rounded-sm" />
            </div>
            <div className="bg-white px-3 py-1 text-center">
              <span className="text-slate-900 font-black text-lg tracking-tighter uppercase leading-none">
                {venda.placa}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              {venda.veiculo}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
              <User className="w-3.5 h-3.5 text-cyan-500" />
              {venda.cliente}
            </div>
          </div>
        </div>

        {/* BLOCO 2: SERVIÇOS E RESPONSÁVEIS */}
        <div className="flex-1 flex flex-wrap gap-2 items-center border-y lg:border-y-0 lg:border-x border-slate-50 dark:border-slate-800 py-4 lg:py-0 lg:px-6">
          {venda.servicos.map((s, i) => (
            <div key={i} className="flex flex-col bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase leading-none mb-1">{s.nome}</span>
              <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-wider">{s.responsavel}</span>
            </div>
          ))}
        </div>

        {/* BLOCO 3: STATUS E PAGAMENTO */}
        <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end gap-3 min-w-[160px]">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-black uppercase text-[10px] tracking-widest ${style.bg} ${style.text} ${style.border}`}>
            {style.icon}
            {style.label}
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-slate-400 font-bold text-[9px] uppercase mb-1">
              <CreditCard className="w-3 h-3" />
              {venda.metodo_pagamento || "Pendente"}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              <span className="text-xs text-slate-400 mr-1 italic">R$</span>
              {Number(venda.total).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER (DATA E ID) */}
      <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {new Date(venda.created_at).toLocaleDateString()}
          </div>
          <span className="opacity-30">|</span>
          <div>{new Date(venda.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-300 dark:text-slate-600">
          <Hash className="w-2.5 h-2.5" /> {venda.id.split('-')[0]}
        </div>
      </div>
    </div>
  );
}