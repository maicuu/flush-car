// src/types/venda.ts
export type TipoVeiculo = "Carro" | "Moto";

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
  telefone?: string; // O '?' indica que é opcional
  tipo_veiculo_label: string;
  multiplicador_aplicado: number;
  servicos: Servico[];
  total: number;
  status: 'pendente' | 'lavando' | 'concluido';
  metodo_pagamento: string;
  empresa_slug: string;
}