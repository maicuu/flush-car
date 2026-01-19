import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Car, LayoutDashboard, History, PlusCircle, 
  Settings, Moon, Sun, Menu, X, LogOut, Activity 
} from "lucide-react";
import { Button } from "./ui/button";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Altere apenas este bloco dentro do Layout.tsx
const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> }, // Dashboard agora é o principal
  { name: "Nova Venda", path: "/nova-venda", icon: <PlusCircle className="h-5 w-5" /> }, // Nova Venda no caminho certo
  { name: "Fluxo do Dia", path: "/status", icon: <Activity className="h-5 w-5" /> },
  { name: "Histórico", path: "/historico", icon: <History className="h-5 w-5" /> },
  { name: "Configurações", path: "/config", icon: <Settings className="h-5 w-5" /> },
];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex transition-colors duration-300">
        
        {/* SIDEBAR LATERAL */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          transform transition-transform duration-300 lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-cyan-500 p-2 rounded-lg text-white">
                <Car className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter">
                FLUSH <span className="text-cyan-500">CAR</span>
              </h1>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                    ${location.pathname === item.path 
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>

            <Button variant="ghost" className="mt-auto justify-start gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
              <LogOut className="h-5 w-5" /> Sair
            </Button>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* CABEÇALHO */}
          <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X /> : <Menu />}
            </Button>

            <div className="hidden lg:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Painel de Controle</p>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                {menuItems.find(i => i.path === location.pathname)?.name || "Sistema"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setDarkMode(!darkMode)} 
                variant="outline" 
                size="icon" 
                className="rounded-full dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                {darkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              </Button>
              <div className="flex items-center gap-3 pl-3 border-l dark:border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold dark:text-white">Admin Flush</p>
                  <p className="text-[10px] text-cyan-500 font-bold">Gerente</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 font-sans">
                  AD
                </div>
              </div>
            </div>
          </header>

          {/* ONDE AS PÁGINAS APARECEM */}
          <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-6">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
}