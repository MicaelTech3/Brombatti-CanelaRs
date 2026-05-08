import os

# ─── Base do projeto (mesma pasta do script) ───────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(BASE, "src")

# ─── Arquivos a criar ────────────────────────────────────────────────────────
files = {

# ── Firebase ────────────────────────────────────────────────────────────────
"firebase/config.ts": """
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDh_jhJSAjQNLZd6n49nvhDsm2Rw7IJxnU",
  authDomain: "brombatti-canela.firebaseapp.com",
  projectId: "brombatti-canela",
  storageBucket: "brombatti-canela.firebasestorage.app",
  messagingSenderId: "123959667984",
  appId: "1:123959667984:web:f88408ac2e57d0ac7a4995",
  measurementId: "G-WFEHQS26VP"
};

export const app = initializeApp(firebaseConfig);
""".strip(),

"firebase/auth.ts": """
import { getAuth } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
""".strip(),

"firebase/db.ts": """
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { app } from "./config";

export const db = getFirestore(app);
export const storage = getStorage(app);
""".strip(),

# ── AuthContext ──────────────────────────────────────────────────────────────
"app/admin/AuthContext.tsx": """
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../../firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
""".strip(),

# ── Sidebar ──────────────────────────────────────────────────────────────────
"app/admin/components/Sidebar.tsx": """
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Star, Settings, LogOut, ChefHat } from 'lucide-react';
import { useAuth } from '../AuthContext';
import logo from '../../../imports/download.png';

const links = [
  { to: '/admin',            label: 'Dashboard',        icon: LayoutDashboard, end: true },
  { to: '/admin/products',   label: 'Produtos',          icon: Package },
  { to: '/admin/offers',     label: 'Ofertas da Semana', icon: Star },
  { to: '/admin/categories', label: 'Categorias',        icon: Tag },
  { to: '/admin/butcher',    label: 'Açougue & Padaria', icon: ChefHat },
  { to: '/admin/settings',   label: 'Configurações',     icon: Settings },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <img src={logo} alt="Brombatti" className="h-10" />
        <div>
          <p className="font-bold text-sm leading-tight">Brombatti</p>
          <p className="text-xs text-gray-400">Painel Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
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
}
""".strip(),

# ── LoginPage ────────────────────────────────────────────────────────────────
"app/admin/pages/LoginPage.tsx": """
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import logo from '../../../imports/download.png';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Brombatti" className="h-16 mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">Painel Admin</h1>
          <p className="text-sm text-gray-500">Supermercado Brombatti</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="admin@brombatti.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
""".strip(),

# ── Pages placeholders ────────────────────────────────────────────────────────
"app/admin/pages/DashboardHome.tsx": """
export function DashboardHome() {
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-800">Dashboard</h2></div>;
}
""".strip(),

"app/admin/pages/ProductsPage.tsx": """
export function ProductsPage() {
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-800">Produtos</h2></div>;
}
""".strip(),

"app/admin/pages/OffersPage.tsx": """
export function OffersPage() {
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-800">Ofertas da Semana</h2></div>;
}
""".strip(),

"app/admin/pages/CategoriesPage.tsx": """
export function CategoriesPage() {
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-800">Categorias</h2></div>;
}
""".strip(),

"app/admin/pages/ButcherPage.tsx": """
export function ButcherPage() {
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-800">Açougue & Padaria</h2></div>;
}
""".strip(),

"app/admin/pages/SettingsPage.tsx": """
export function SettingsPage() {
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-800">Configurações</h2></div>;
}
""".strip(),

# ── AdminApp ─────────────────────────────────────────────────────────────────
"app/admin/AdminApp.tsx": """
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardHome } from './pages/DashboardHome';
import { ProductsPage } from './pages/ProductsPage';
import { OffersPage } from './pages/OffersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ButcherPage } from './pages/ButcherPage';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500 text-sm">Carregando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="butcher" element={<ButcherPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </AuthProvider>
  );
}
""".strip(),

# ── main.tsx (substituir) ─────────────────────────────────────────────────────
"main.tsx": """
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app/App.tsx";
import AdminApp from "./app/admin/AdminApp.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
""".strip(),

}

# ─── Criar arquivos ───────────────────────────────────────────────────────────
created, skipped = [], []

for rel_path, content in files.items():
    full_path = os.path.join(SRC, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    if os.path.exists(full_path):
        skipped.append(rel_path)
        # Sobrescreve mesmo assim (força atualização)

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content + "\n")
    created.append(rel_path)

# ─── Relatório ────────────────────────────────────────────────────────────────
print("\n✅ Arquivos criados/atualizados:\n")
for f in created:
    print(f"   📄 src/{f}")

print(f"\n🎉 Pronto! {len(created)} arquivo(s) gerado(s).")
print("\n👉 Próximos passos:")
print("   1. pnpm install")
print("   2. pnpm dev")
print("   3. Acesse http://localhost:5173/admin/login")