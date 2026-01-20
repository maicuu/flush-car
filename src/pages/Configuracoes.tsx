import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  HelpCircle, 
  Building, 
  ChevronRight, 
  Plus, 
  Trash2,
  Save
} from 'lucide-react';

import { supabase, APP_SLUG } from '../lib/supabase';

export default function Configuracoes() {
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);

  const MenuCard = ({ icon, title, desc, id }: any) => (
    <button 
      onClick={() => setSecaoAtiva(id)}
      className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] hover:shadow-xl hover:scale-[1.02] transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <h3 className="text-sm font-black uppercase italic tracking-tighter">{title}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase">{desc}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-300" size={20} />
    </button>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Ajustes</h1>
        <div className="h-1 w-12 bg-cyan-500 rounded-full mt-2"></div>
      </header>

      {!secaoAtiva ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MenuCard id="unidade" icon={<Building size={20}/>} title="Dados da Unidade" desc="Nome e Contato da Loja" />
          <MenuCard id="equipe" icon={<Users size={20}/>} title="Equipe / Funcionários" desc="Gerenciar quem trabalha no pátio" />
          <MenuCard id="servicos" icon={<DollarSign size={20}/>} title="Tabela de Preços" desc="Editar valores de lavagens" />
          <MenuCard id="ajuda" icon={<HelpCircle size={20}/>} title="Ajuda e Suporte" desc="Falar com o desenvolvedor" />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setSecaoAtiva(null)}
            className="mb-6 text-[10px] font-black uppercase text-slate-400 hover:text-cyan-500 flex items-center gap-2"
          >
            ← Voltar para Ajustes
          </button>

          {secaoAtiva === 'unidade' && <PainelUnidade />}
          {secaoAtiva === 'equipe' && <PainelEquipe />}
          {secaoAtiva === 'servicos' && <PainelServicos />}
          {secaoAtiva === 'ajuda' && <PainelAjuda />}
        </div>
      )}
    </div>
  );
}

// --- NOVO: PAINEL DE DADOS DA UNIDADE ---
const PainelUnidade = () => {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function buscarDados() {
      const { data } = await supabase
        .from('configuracoes_unidade')
        .select('*')
        .eq('empresa_slug', APP_SLUG)
        .single();
      
      if (data) {
        setNome(data.nome_unidade || "");
        setWhatsapp(data.whatsapp_contato || "");
      }
      setLoading(false);
    }
    buscarDados();
  }, []);

  async function salvar() {
    setSalvando(true);
    const { error } = await supabase
      .from('configuracoes_unidade')
      .upsert({ 
        empresa_slug: APP_SLUG, 
        nome_unidade: nome.toUpperCase(), 
        whatsapp_contato: whatsapp 
      }, { onConflict: 'empresa_slug' });

    if (error) alert("Erro ao salvar!");
    else alert("Dados atualizados!");
    setSalvando(false);
  }

  if (loading) return <div className="text-center py-10 animate-pulse font-black text-slate-400 text-xs text-xs">CARREGANDO...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
      <h2 className="text-lg font-black uppercase italic tracking-tighter">Dados da Unidade</h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome do Lava Jato</label>
          <input 
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none font-bold text-sm focus:ring-2 ring-cyan-500 outline-none"
            placeholder="EX: FLUSH CAR MATRIZ"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp (Com DDD)</label>
          <input 
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none font-bold text-sm focus:ring-2 ring-cyan-500 outline-none"
            placeholder="88988563165"
          />
        </div>

        <button 
          onClick={salvar}
          disabled={salvando}
          className="bg-cyan-500 text-white p-4 rounded-2xl font-black uppercase italic text-sm hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {salvando ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
        </button>
      </div>
    </div>
  );
};

// --- PAINEL DE EQUIPE DINÂMICO ---
const PainelEquipe = () => {
  const [lista, setLista] = useState<{ id: string, nome: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('lavadores').select('*').eq('empresa_slug', APP_SLUG);
      if (data) setLista(data);
      setLoading(false);
    }
    carregar();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-black uppercase italic tracking-tighter">Gerenciar Equipe</h2>
        <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-cyan-600"> + Novo </button>
      </div>
      {loading ? (
        <div className="text-center py-10 animate-pulse font-black text-slate-400 text-xs">CARREGANDO...</div>
      ) : (
        <div className="grid gap-3">
          {lista.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-black text-[10px]">{item.nome[0]}</div>
                <span className="text-xs font-black uppercase tracking-tight">{item.nome}</span>
              </div>
              <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- PAINEL DE SERVIÇOS DINÂMICO ---
const PainelServicos = () => {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('servicos').select('*').eq('empresa_slug', APP_SLUG);
      if (data) setServicos(data);
      setLoading(false);
    }
    carregar();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-black uppercase italic tracking-tighter">Tabela de Preços</h2>
        <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-cyan-600"> + Novo </button>
      </div>
      {loading ? (
        <div className="text-center py-10 animate-pulse font-black text-slate-400 text-xs">CARREGANDO...</div>
      ) : (
        <div className="space-y-4">
          {servicos.map(s => (
            <div key={s.id} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black uppercase italic text-sm text-cyan-500">{s.nome}</h3>
                <button className="text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <PriceBox label="Hatch" value={s.preco_hatch} />
                <PriceBox label="Sedan" value={s.preco_sedan} />
                <PriceBox label="SUV" value={s.preco_suv_picape} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PriceBox = ({ label, value }: any) => (
  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center border dark:border-slate-700">
    <p className="text-[8px] font-bold text-slate-400 uppercase">{label}</p>
    <p className="text-xs font-black italic">R$ {value}</p>
  </div>
);

// --- PAINEL DE AJUDA ---
const PainelAjuda = () => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 text-center md:text-left">
    <h2 className="text-lg font-black uppercase italic tracking-tighter">Suporte ao Desenvolvedor</h2>
    <p className="text-slate-400 text-sm leading-relaxed font-medium">
      Precisa de ajuda ou deseja solicitar uma nova funcionalidade? 
      Estou à disposição para garantir que o <strong>Flush Car</strong> rode perfeitamente.
    </p>
    <a 
      href="https://wa.me/5588999999999" 
      target="_blank"
      className="inline-block bg-green-500 hover:bg-green-600 text-white font-black uppercase px-8 py-4 rounded-2xl transition-all shadow-lg shadow-green-500/20"
    >
      Chamar suporte agora
    </a>
  </div>
);