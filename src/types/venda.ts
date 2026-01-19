export interface Servico {
  nome: string;
  preco: number;
  responsavel?: string;
}

export interface Venda {
  id: string;
  empresa_slug: string; // O novo campo chave
  data: string;
  cliente: string;
  veiculo: string;
  placa: string;
<<<<<<< HEAD
=======
  telefone?: string;
>>>>>>> 60eb2ab61abd1ec5b3d1e9925bfdeaf43365d3e0
  servicos: Servico[];
  total: number;
  metodoPagamento: string;
  status: 'pendente' | 'em_progresso' | 'concluido';
  tipo_veiculo_label?: string;
  multiplicador_aplicado?: number;
}