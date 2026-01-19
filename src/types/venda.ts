export interface Servico {
  nome: string;
  preco: number;
  responsavel: string;
}

export interface Venda {
  id: string;
  created_at: string;
  cliente: string;
  veiculo: string;
  placa: string;
  telefone?: string;
  tipo_veiculo_label: string;
  multiplicador_aplicado: number;
  servicos: Servico[];
  total: number;
  status: 'pendente' | 'lavando' | 'concluido';
  metodo_pagamento: string; // Adicione esta linha
  empresa_slug: string;
}