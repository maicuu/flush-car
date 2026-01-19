// src/data/mockServicos.ts

export interface CatalogoItem {
  id: string;
  nome: string;
  precoBase: number;
}

export const CATALOGO_SERVICOS: CatalogoItem[] = [
  { id: "1", nome: "Lavagem Simples", precoBase: 50 },
  { id: "2", nome: "Lavagem Completa", precoBase: 80 },
  { id: "3", nome: "Higienização Interna", precoBase: 150 },
  { id: "4", nome: "Polimento Comercial", precoBase: 250 },
  { id: "5", nome: "Cera de Carnaúba", precoBase: 40 },
];

export const TIPOS_VEICULO = [
  { label: "Pequeno", multiplicador: 1.0, icon: "🚗", descricao: "Hatch (Ex: Gol, Onix)" },
  { label: "Médio", multiplicador: 1.2, icon: "🚘", descricao: "Sedan (Ex: Corolla, Civic)" },
  { label: "Grande", multiplicador: 1.5, icon: "🛻", descricao: "SUV / Pickups (Ex: Hilux, SW4)" },
];