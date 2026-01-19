import { useEffect, useState } from "react";
import { supabase, APP_SLUG } from "../lib/supabase";
import { Venda } from "../types/venda"; // Importe o tipo correto
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
// Removi o 'Car' que não estava sendo usado para limpar o aviso
import { MessageCircle, CheckCircle2, Clock } from "lucide-react"; 

export default function StatusDia() {
  // 1. Trocamos 'any' pelo tipo 'Venda' para segurança
  const [vendas, setVendas] = useState<Venda[]>([]);

  useEffect(() => {
    // Definimos a função dentro do useEffect para evitar o aviso de renderização em cascata
    const carregarVendas = async () => {
      const { data } = await supabase
        .from('vendas')
        .select('*')
        .eq('empresa_slug', APP_SLUG)
        .order('created_at', { ascending: false });
      
      if (data) setVendas(data as unknown as Venda[]);
    };

    carregarVendas();

    const channel = supabase
      .channel('vendas-realtime')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'vendas', filter: `empresa_slug=eq.${APP_SLUG}` }, 
          () => carregarVendas()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const atualizarStatus = async (id: string, novoStatus: string) => {
    await supabase.from('vendas').update({ status: novoStatus }).eq('id', id);
  };

  // 2. Trocamos o 'any' aqui também pelo tipo 'Venda'
  const avisarClienteWpp = (venda: Venda) => {
    const mensagem = encodeURIComponent(`Olá ${venda.cliente}, seu ${venda.veiculo} está pronto! 🚿`);
    window.open(`https://wa.me/55${venda.telefone}?text=${mensagem}`, "_blank");
  };
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-black dark:text-white uppercase">Fluxo do Dia</h1>
        <Badge className="bg-cyan-500">{vendas.length} Carros</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* COLUNA: LAVANDO (Status Pendente ou Em Progresso) */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-400 uppercase text-sm">
            <Clock className="text-amber-500" /> Lavando
          </h2>
          {vendas.filter(v => v.status === 'pendente').map(v => (
            <Card key={v.id} className="dark:bg-slate-900 border-none shadow-md">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold dark:text-white">{v.veiculo} <span className="text-xs opacity-50">({v.placa})</span></p>
                  <p className="text-xs text-slate-500">{v.cliente}</p>
                </div>
                <Button size="sm" onClick={() => atualizarStatus(v.id, 'concluido')} className="bg-amber-500 hover:bg-amber-600">
                  Pronto?
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* COLUNA: PRONTO (Status Concluído) */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-400 uppercase text-sm">
            <CheckCircle2 className="text-emerald-500" /> Prontos
          </h2>
          {vendas.filter(v => v.status === 'concluido').map(v => (
            <Card key={v.id} className="dark:bg-slate-900 border-l-4 border-l-emerald-500 border-y-0 border-r-0 shadow-md">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold dark:text-white">{v.veiculo}</p>
                  <p className="text-xs text-emerald-500">Aguardando retirada</p>
                </div>
                <Button onClick={() => avisarClienteWpp(v)} className="bg-emerald-500 gap-2">
                  <MessageCircle className="h-4 w-4" /> AVISAR
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}