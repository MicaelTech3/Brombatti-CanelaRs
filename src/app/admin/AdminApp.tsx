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
import { SitePage } from './pages/SitePage';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
          <span className="text-gray-500 text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      {/* padding-top no mobile para compensar a top bar fixa */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="butcher" element={<ButcherPage />} />
          <Route path="site" element={<SitePage />} />
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
