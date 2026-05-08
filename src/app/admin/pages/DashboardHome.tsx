import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { Package, Star, Tag, MessageCircle } from 'lucide-react';

export function DashboardHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    productsOnOffer: 0,
    totalCategories: 0,
    whatsappClicks: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta produtos
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      let total = 0;
      let onOffer = 0;
      snap.forEach(d => {
        total++;
        if (d.data().onOffer) onOffer++;
      });
      setStats(s => ({ ...s, totalProducts: total, productsOnOffer: onOffer }));
    });

    // Produtos recentes
    const qRecent = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(5));
    const unsubRecent = onSnapshot(qRecent, snap => {
      setRecentProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Escuta categorias
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snap) => {
      setStats(s => ({ ...s, totalCategories: snap.size }));
    });

    // Escuta cliques do WhatsApp
    const unsubWhatsapp = onSnapshot(doc(db, 'stats', 'whatsapp'), (docSnap) => {
      if (docSnap.exists()) {
        setStats(s => ({ ...s, whatsappClicks: docSnap.data().clicks || 0 }));
      }
    });

    setLoading(false);

    return () => {
      unsubProducts();
      unsubRecent();
      unsubCategories();
      unsubWhatsapp();
    };
  }, []);

  const cards = [
    { title: 'Total de Produtos', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Produtos em Oferta', value: stats.productsOnOffer, icon: Star, color: 'bg-yellow-500' },
    { title: 'Total de Categorias', value: stats.totalCategories, icon: Tag, color: 'bg-purple-500' },
    { title: 'Cliques no WhatsApp', value: stats.whatsappClicks, icon: MessageCircle, color: 'bg-green-500' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
        <p className="text-gray-500 text-sm mt-1">Acompanhe as métricas do seu aplicativo em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-400" />
            Últimos Produtos Cadastrados
          </h3>
          <a href="/admin/products" className="text-sm font-medium text-red-600 hover:text-red-700">
            Ver Todos
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Produto</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Preço</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Nenhum produto cadastrado ainda.</td>
                </tr>
              )}
              {recentProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-800">{prod.name}</p>
                        {prod.onOffer && <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Em Oferta</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{prod.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">R$ {Number(prod.price).toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${prod.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {prod.visible ? 'Visível' : 'Oculto'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
