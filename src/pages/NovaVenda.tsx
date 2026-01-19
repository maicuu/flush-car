import { useState } from "react";
// 1. Trocamos @/ por ../ para resolver os erros 2307 e 2305
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { type Venda, type Servico } from "../types/venda";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function NovaVenda() {
  const [cliente, setCliente] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [placa, setPlaca] = useState("");
  const [servicos, setServicos] = useState<Servico[]>([{ nome: "", preco: 0 }]);

  // 2. SOLUÇÃO PERFORMANCE: Calculamos direto aqui, sem useEffect!
  // Isso remove o erro de "cascading renders"
  const total = servicos.reduce((acc, item) => acc + Number(item.preco), 0);

  const adicionarServico = () => {
    setServicos([...servicos, { nome: "", preco: 0 }]);
  };

  const atualizarServico = (index: number, campo: keyof Servico, valor: string | number) => {
    const novosServicos = [...servicos];
    novosServicos[index] = { ...novosServicos[index], [campo]: valor };
    setServicos(novosServicos);
  };

  const salvarVenda = () => {
    // 1. Geramos o ID primeiro, fora do objeto.
    // O crypto.randomUUID() é o padrão moderno para IDs únicos.
    const novoId = window.crypto.randomUUID();

    const novaVenda: Venda = {
      id: novoId, 
      data: new Date().toISOString(),
      cliente,
      veiculo,
      placa,
      servicos,
      total,
      metodoPagamento: "pix",
      status: "pendente",
    };

    console.log("Venda salva:", novaVenda);
    alert("Venda registrada com sucesso!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Nova Ordem de Serviço</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Dados do Veículo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* 3. SOLUÇÃO 'any': Tipamos o 'e' como React.ChangeEvent<HTMLInputElement> */}
            <Input 
              placeholder="Nome do Cliente" 
              value={cliente} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCliente(e.target.value)} 
            />
            <Input 
              placeholder="Modelo do Veículo" 
              value={veiculo} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVeiculo(e.target.value)} 
            />
            <Input 
              placeholder="Placa" 
              value={placa} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaca(e.target.value)} 
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-50">
          <CardHeader><CardTitle>Resumo Financeiro</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <span className="text-sm text-muted-foreground uppercase">Total a pagar</span>
            <span className="text-5xl font-extrabold text-primary">R$ {total.toFixed(2)}</span>
            <Badge variant="outline">Aguardando Finalização</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Serviços e Taxas</CardTitle>
          <Button variant="outline" size="sm" onClick={adicionarServico}>+ Adicionar Serviço</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {servicos.map((servico, index) => (
            <div key={index} className="flex gap-4">
              <Input 
                className="flex-1" 
                placeholder="Descrição" 
                value={servico.nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => atualizarServico(index, "nome", e.target.value)}
              />
              <Input 
                className="w-[150px]" 
                type="number" 
                placeholder="R$ 0,00" 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => atualizarServico(index, "preco", parseFloat(e.target.value) || 0)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button className="w-full h-12 text-lg" onClick={salvarVenda}>Finalizar Venda</Button>
    </div>
  );
}


export function AvatarDemo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg">
        <AvatarImage
          src="https://github.com/evilrabbit.png"
          alt="@evilrabbit"
        />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
