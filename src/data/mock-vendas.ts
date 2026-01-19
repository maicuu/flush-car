import { type Venda } from "../types/venda";

export const vendasMock: Venda[] = [
  {
    id: "1",
    data: "2024-03-20T10:00:00",
    cliente: "João Silva",
    veiculo: "Toyota Corolla",
    placa: "ABC-1234",
    servicos: [{ nome: "Lavagem Completa", preco: 80 }],
    total: 80,
    metodoPagamento: "pix",
    status: "concluido",
  },
  {
    id: "2",
    data: "2024-03-20T11:30:00",
    cliente: "Maria Oliveira",
    veiculo: "Honda Civic",
    placa: "XYZ-9876",
    servicos: [
      { nome: "Lavagem Simples", preco: 50 },
      { nome: "Pretinho", preco: 10 }
    ],
    total: 60,
    metodoPagamento: "dinheiro",
    status: "pendente",
  }
];