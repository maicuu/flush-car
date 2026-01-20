import { Download } from "lucide-react";

type Props = {
  data: string;
  responsavel: string;
  status: string;
  busca: string;
  responsaveis: string[];
  onDataChange: (v: string) => void;
  onResponsavelChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onBuscaChange: (v: string) => void;
  onExportar: () => void;
};

export function FiltrosHistorico(props: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 
                border border-slate-200 dark:border-slate-700
                rounded-xl shadow-sm p-4 mb-8">

    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

      <div>
        <label className="text-base text-slate-900 dark:text-slate-200">
          Data
        </label>
        <input
          type="date"
          value={props.data}
          onChange={(e) => props.onDataChange(e.target.value)}
          className="w-full mt-1 rounded-lg 
                    bg-white dark:bg-slate-800
                    border border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-slate-100"
        />
      </div>

      <div>
        <label className="text-base text-slate-900 dark:text-slate-200">
          Responsável
        </label>
        <select
          value={props.responsavel}
          onChange={(e) => props.onResponsavelChange(e.target.value)}
          className="w-full mt-1 rounded-lg 
                    bg-white dark:bg-slate-800
                    border border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-slate-100"
        >
          <option value="">Todos</option>
          {props.responsaveis.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-base text-slate-900 dark:text-slate-200">
          Status
        </label>
        <select
          value={props.status}
          onChange={(e) => props.onStatusChange(e.target.value)}
          className="w-full mt-1 rounded-lg 
                    bg-white dark:bg-slate-800
                    border border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-slate-100"
        >
          <option value="">Todos</option>
          <option value="concluido">Concluído</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div>
        <label className="text-base text-slate-900 dark:text-slate-200">
          Buscar
        </label>
        <input
          value={props.busca}
          onChange={(e) => props.onBuscaChange(e.target.value)}
          placeholder="Cliente, placa ou modelo"
          className="w-full mt-1 rounded-lg 
                    bg-white dark:bg-slate-800
                    border border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-slate-100
                    placeholder-slate-400"
        />
      </div>

      <button 
        onClick={props.onExportar}
        className="group flex items-center gap-2 
                  bg-emerald-500 hover:bg-emerald-600
                  text-white px-5 py-4 rounded-2xl
                  font-black text-xs tracking-widest
                  transition-all shadow-lg shadow-emerald-500/20
                  active:scale-95"
      >
        <Download className="w-5 h-5" /> EXPORTAR RELATÓRIO
      </button>

    </div>
  </div>

  );
}
