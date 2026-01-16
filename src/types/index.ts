// Definindo como é um serviço no sistema
export interface Service {
  id: string;
  name: string;
  price: number;
}

// Definindo como é um cliente
export interface Customer {
  id: string;
  name: string;
  phone: string;
}

// Definindo a Ordem de Serviço (Venda)
export interface Sale {
  id: string;
  customerId: string;
  vehiclePlate: string;
  services: Service[];
  employeeId: string;
  total: number;
  status: 'pendente' | 'concluido' | 'cancelado';
  createdAt: Date;
}