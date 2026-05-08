import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { Package, Star, Tag, MessageCircle } from 'lucide-react';

export function DashboardHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    productsOnOffer: 0,
    totalCategories: 0,
    whatsappClicks: 0,
  });
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
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
    </div>
  );
}
