import { Calendar, Download, DollarSign, ShoppingCart, TrendingUp, Car, CreditCard, User } from "lucide-react";

export default function FechamentoDiario() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Fechamento Diário
          </h1>
          <p className="text-slate-500 text-sm">
            Resumo completo do caixa do dia
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              className="text-sm outline-none"
            />
          </div>

          <button className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-100">
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <ResumoCard
          title="Faturamento Total"
          value="R$ 0,00"
          subtitle="19/01/2026"
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />

        <ResumoCard
          title="Vendas Realizadas"
          value="0"
          subtitle="Total do dia"
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
        />

        <ResumoCard
          title="Ticket Médio"
          value="R$ 0,00"
          subtitle="Por venda"
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        />

        <ResumoCard
          title="Veículos Atendidos"
          value="0"
          subtitle="Total do dia"
          icon={<Car className="w-5 h-5 text-blue-500" />}
        />
      </div>

      {/* Blocos intermediários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <InfoBox
          title="Por Forma de Pagamento"
          icon={<CreditCard className="w-4 h-4 text-blue-500" />}
          text="Nenhuma venda registrada"
        />

        <InfoBox
          title="Top 3 Serviços"
          icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          text="Nenhum serviço vendido"
        />

        <InfoBox
          title="Por Funcionário"
          icon={<User className="w-4 h-4 text-blue-500" />}
          text="Nenhuma venda registrada"
        />
      </div>

      {/* Vendas do dia */}
      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-lg font-black text-slate-900 mb-4">
          Vendas do Dia
        </h2>
        <p className="text-center text-slate-400 py-10">
          Nenhuma venda registrada neste dia
        </p>
      </div>

    </div>
  );
}

/* ===== Componentes reutilizáveis ===== */

function ResumoCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white border rounded-xl p-4 flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="text-xl font-black text-blue-600">{value}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      {icon}
    </div>
  );
}

function InfoBox({ title, icon, text }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-black text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-400 text-center py-6">
        {text}
      </p>
    </div>
  );
}
