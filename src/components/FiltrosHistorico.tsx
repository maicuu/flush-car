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
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

        <div>
          <label className="text-base text-black">Data</label>
          <input
            type="date"
            value={props.data}
            onChange={(e) => props.onDataChange(e.target.value)}
            className="w-full mt-1 rounded-lg border-gray-300"
          />
        </div>

        <div>
          <label className="text-base text-black">Responsável</label>
          <select
            value={props.responsavel}
            onChange={(e) => props.onResponsavelChange(e.target.value)}
            className="w-full mt-1 rounded-lg border-gray-300"
          >
            <option value="">Todos</option>
            {props.responsaveis.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-base text-black">Status</label>
          <select
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value)}
            className="w-full mt-1 rounded-lg border-gray-300"
          >
            <option value="">Todos</option>
            <option value="concluido">Concluído</option>
            <option value="pendente">Pendente</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="text-base text-black">Buscar</label>
          <input
            value={props.busca}
            onChange={(e) => props.onBuscaChange(e.target.value)}
            placeholder="Cliente, placa ou modelo"
            className="w-full mt-1 rounded-lg border-gray-300"
          />
        </div>

        <button
          onClick={props.onExportar}
          className="bg-green-600 text-white rounded-lg py-2 hover:bg-green-700"
        >
          Exportar CSV
        </button>
      </div>
    </div>
  );
}
