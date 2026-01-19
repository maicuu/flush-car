import { useState, useMemo } from "react";
import { CATALOGO_SERVICOS, TIPOS_VEICULO } from "../data/mockServicos";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Trash2, Plus, CheckCircle2, Car, Truck, Monitor as Van } from "lucide-react";
import { type Venda, type Servico } from "../types/venda";

export default function NovaVenda() {
  const [cliente, setCliente] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [placa, setPlaca] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState(TIPOS_VEICULO[1]); 

  // ALTERAÇÃO AQUI: Agora inicia com um serviço vazio por padrão
  const [servicos, setServicos] = useState<Servico[]>([
    { nome: "", preco: 0, responsavel: "Maicon" }
  ]);

  const servicosCalculados = useMemo(() => {
    return servicos.map((servico) => {
      const itemCatalogo = CATALOGO_SERVICOS.find((s) => s.nome === servico.nome);
      return {
        ...servico,
        // Lógica de cálculo conforme tipo de veículo
        preco: itemCatalogo ? itemCatalogo.precoBase * tipoVeiculo.multiplicador : 0,
      };
    });
  }, [servicos, tipoVeiculo]);

  const total = servicosCalculados.reduce((acc, item) => acc + Number(item.preco), 0);

  const adicionarServicoVazio = () => {
    setServicos([...servicos, { nome: "", preco: 0, responsavel: "Maicon" }]);
  };

  const selecionarDoCatalogo = (index: number, servicoId: string) => {
    const item = CATALOGO_SERVICOS.find((s) => s.id === servicoId);
    if (item) {
      const novos = [...servicos];
      novos[index] = { ...novos[index], nome: item.nome };
      setServicos(novos);
    }
  };

  const salvarVenda = () => {
    if (!cliente || servicos.length === 0) {
      alert("⚠️ Preencha os dados básicos.");
      return;
    }
    const novaVenda: Venda = {
      id: window.crypto.randomUUID(),
      data: new Date().toISOString(),
      cliente, veiculo, placa,
      servicos: servicosCalculados,
      total,
      metodoPagamento: "pix",
      status: "pendente",
    };
    console.log("Venda salva:", novaVenda);
    alert("✅ O.S Gerada com sucesso!");
  };

  const getIcon = (label: string) => {
    if (label.toLowerCase().includes("pequeno")) return <Car className="h-5 w-5" />;
    if (label.toLowerCase().includes("médio")) return <Van className="h-5 w-5" />;
    return <Truck className="h-5 w-5" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-none shadow-md bg-white dark:bg-slate-900 overflow-hidden">
            <div className="h-1.5 bg-cyan-500 w-full" />
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Cliente</label>
                  <Input 
                    value={cliente} onChange={(e) => setCliente(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border-none h-12 dark:text-white shadow-inner" 
                    placeholder="Nome do cliente..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Veículo</label>
                  <Input 
                    value={veiculo} onChange={(e) => setVeiculo(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border-none h-12 dark:text-white shadow-inner" 
                    placeholder="Modelo e cor..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {TIPOS_VEICULO.map((t) => (
                  <button key={t.label} onClick={() => setTipoVeiculo(t)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      tipoVeiculo.label === t.label 
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 shadow-md" 
                      : "border-transparent bg-slate-50 dark:bg-slate-800 text-slate-400"
                    }`}>
                    {getIcon(t.label)}
                    <span className="text-[10px] font-black uppercase">{t.label} (x{t.multiplicador})</span>
                  </button>
                ))}
              </div>

              <Input 
                placeholder="PLACA DO VEÍCULO" value={placa} 
                className="bg-slate-900 text-cyan-400 text-center font-mono text-2xl h-16 uppercase tracking-[0.3em] border-none shadow-2xl"
                onChange={(e) => setPlaca(e.target.value)} 
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between border-b dark:border-slate-800 p-6">
              <CardTitle className="text-slate-900 dark:text-white text-xl font-black uppercase tracking-tight">Serviços</CardTitle>
              <Button onClick={adicionarServicoVazio} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl px-6 font-bold shadow-lg shadow-cyan-500/20">
                <Plus className="h-4 w-4 mr-2" /> SERVIÇOS ADICIONAIS
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {servicosCalculados.map((servico, index) => (
                <div key={index} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-4">
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px] space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Trabalho</label>
                      <Select 
                        value={CATALOGO_SERVICOS.find(s => s.nome === servico.nome)?.id}
                        onValueChange={(val) => selecionarDoCatalogo(index, val)}
                      >
                        <SelectTrigger className="bg-white dark:bg-slate-900 dark:text-white border-slate-200 dark:border-slate-700 h-11">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 dark:text-white">
                          {CATALOGO_SERVICOS.map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Valor</label>
                      <div className="h-11 flex items-center justify-center bg-cyan-500/10 rounded-lg font-black text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        R$ {servico.preco.toFixed(2)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => (setServicos(servicos.filter((_, i) => i !== index)))} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t dark:border-slate-700">
                    {["Maicon", "Luiz", "Felipe"].map((nome) => (
                      <div key={nome} className="flex flex-col items-center gap-1">
                        <Avatar onClick={() => {
                          const novos = [...servicos];
                          novos[index].responsavel = nome;
                          setServicos(novos);
                        }}
                          className={`h-10 w-10 cursor-pointer border-2 transition-all ${
                            servico.responsavel === nome ? "border-cyan-500 ring-4 ring-cyan-500/10 scale-110" : "opacity-30 grayscale"
                          }`}>
                          <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-xs font-bold dark:text-white">{nome[0]}</AvatarFallback>
                        </Avatar>
                        <span className={`text-[8px] font-bold ${servico.responsavel === nome ? "text-cyan-500" : "text-slate-400"}`}>{nome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-slate-900 text-white sticky top-6 border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="h-2 bg-cyan-500 w-full" />
            <CardContent className="p-8 space-y-8">
              <div className="text-center">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Subtotal</span>
                <div className="text-6xl font-black text-white tracking-tighter mt-2">
                  <span className="text-cyan-500 text-2xl mr-1">R$</span>{total.toFixed(2)}
                </div>
              </div>

              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-400">Taxa Veículo</span>
                  <span className="text-cyan-400 font-black">{tipoVeiculo.label} (x{tipoVeiculo.multiplicador})</span>
                </div>
              </div>

              <Button 
                onClick={salvarVenda} 
                className="w-full h-20 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xl shadow-[0_20px_40px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-1 active:scale-95 rounded-2xl"
              >
                <CheckCircle2 className="mr-3 h-7 w-7" /> FINALIZAR O.S
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}