import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Star, Settings, LogOut, ChefHat, Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import logo from '../../../imports/download.png';

const links = [
  { to: '/admin',            label: 'Dashboard',        icon: LayoutDashboard, end: true },
  { to: '/admin/products',   label: 'Produtos',          icon: Package },
  { to: '/admin/offers',     label: 'Ofertas da Semana', icon: Star },
  { to: '/admin/categories', label: 'Categorias',        icon: Tag },
  { to: '/admin/butcher',    label: 'Açougue & Padaria', icon: ChefHat },
  { to: '/admin/site',       label: 'Página do Site',    icon: Globe },
  { to: '/admin/settings',   label: 'Configurações',     icon: Settings },
];

export function Sidebar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Brombatti" className="h-10" />
          <div>
            <p className="font-bold text-sm leading-tight">Brombatti</p>
            <p className="text-xs text-gray-400">Painel Admin</p>
          </div>
        </div>
        {/* Botão fechar — só aparece no drawer mobile */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: sidebar fixa */}
      <div className="hidden md:flex w-64 min-h-screen flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile: botão hamburguer fixo no topo */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 shadow-md">
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="p-1"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Brombatti" className="h-8" />
          <span className="font-bold text-sm">Painel Admin</span>
        </div>
      </div>

      {/* Mobile: overlay + drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-64 h-full">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
