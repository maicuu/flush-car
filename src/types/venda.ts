// src/types/venda.ts

export interface Servico {
  nome: string;
  preco: number;
}

export interface Venda {
  id: string;
  data: string; // Guardaremos em formato ISO (ex: "2024-05-20T10:00:00")
  cliente: string;
  veiculo: string;
  placa: string;
  servicos: Servico[];
  total: number;
  metodoPagamento: "pix" | "cartao" | "dinheiro";
  status: "concluido" | "pendente";
}