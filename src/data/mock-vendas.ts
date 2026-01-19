import { type Venda } from "../types/venda";

export const vendasMock: Venda[] = [
  {
    id: "1",
    data: "2024-03-20T10:00:00",
    responsavel: "Maicon",
    cliente: "João Silva",
    veiculo: "Carro",
    modelo: "Toyota Corolla",
    placa: "ABC-1234",
    servicos: [{ nome: "Lavagem Completa", preco: 80 }],
    total: 80,
    metodoPagamento: "pix",
    status: "concluido",
  },
  {
    id: "2",
    data: "2024-03-20T11:30:00",
    responsavel: "Felipe",
    cliente: "Maria Oliveira",
    veiculo: "Carro",
    modelo: "Honda Civic",
    placa: "XYZ-9876",
    servicos: [
      { nome: "Lavagem Simples", preco: 50 },
      { nome: "Pretinho", preco: 10 }
    ],
    total: 60,
    metodoPagamento: "dinheiro",
    status: "pendente",
  },
  {
  id: "3",
  data: "2024-03-20T14:00:00",
  responsavel: "Maicon",
  cliente: "Carlos Mendes",
  veiculo: "Moto",
  modelo: "Honda Broz 160",
  placa: "KLM-4567",
  servicos: [
    { nome: "Lavagem Completa", preco: 80 },
    { nome: "Cera Rápida", preco: 40 }
  ],
  total: 120,
  metodoPagamento: "cartao",
  status: "concluido",
},
{
  id: "4",
  data: "2024-03-21T09:15:00",
  responsavel: "Felipe",
  cliente: "Ana Paula Santos",
  veiculo: "Moto",
  modelo: " Shy 175",
  placa: "QWE-1122",
  servicos: [
    { nome: "Lavagem Simples", preco: 50 }
  ],
  total: 50,
  metodoPagamento: "pix",
  status: "concluido",
},
{
  id: "5",
  data: "2024-03-21T16:45:00",
  responsavel: "Felipe",
  cliente: "Rafael Costa",
  veiculo: "Carro",
  modelo: "Fiat Argo",
  placa: "RTY-8899",
  servicos: [
    { nome: "Lavagem Completa", preco: 80 },
    { nome: "Higienização Interna", preco: 150 },
    { nome: "Pretinho", preco: 10 }
  ],
  total: 240,
  metodoPagamento: "dinheiro",
  status: "pendente",
}
];