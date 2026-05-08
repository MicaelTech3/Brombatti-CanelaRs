import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { ChefHat, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  visible: boolean;
  onOffer: boolean;
}

export function ButcherPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Busca apenas produtos das categorias Açougue e Padaria
    const q = query(
      collection(db, 'products'),
      where('category', 'in', ['Açougue', 'Padaria'])
    );

    const unsub = onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setLoading(false);
    });

    return unsub;
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-red-600" />
            Açougue & Padaria
          </h2>
          <p className="text-gray-500 text-sm mt-1">Visão filtrada exclusiva dos itens de fabricação própria e cortes.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pães, cortes, etc..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Produto</th>
                <th className="px-6 py-4 font-medium">Setor</th>
                <th className="px-6 py-4 font-medium">Preço</th>
                <th className="px-6 py-4 font-medium">Status no Site</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Carregando itens...</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12">
                    <div className="flex flex-col items-center">
                      <ChefHat className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">Nenhum item de Açougue ou Padaria encontrado.</p>
                      <p className="text-sm text-gray-400 mt-1">Para adicionar, vá até a aba Produtos e cadastre com a categoria correspondente.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        {p.onOffer && <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Oferta Ativa</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${p.category === 'Açougue' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    R$ {Number(p.price).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4">
                    {p.visible ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Visível</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-xs font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"/> Oculto</span>
                    )}
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
