import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/db';
import { Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  imageUrl: string;
  visible: boolean;
  onOffer: boolean;
  unit: string;
}

const DEFAULT_OFFERS = [
  {
    id: '1',
    name: 'Picanha Premium',
    price: 45.90,
    originalPrice: 59.90,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1599834255434-c137726a0637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'Açougue',
    visible: true,
    onOffer: true,
    description: '',
  },
  {
    id: '2',
    name: 'Pão Francês',
    price: 8.90,
    originalPrice: 12.90,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'Padaria',
    visible: true,
    onOffer: true,
    description: '',
  },
  {
    id: '3',
    name: 'Tomate',
    price: 4.50,
    originalPrice: 6.90,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1768734837679-9b3180433384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'Hortifruti',
    visible: true,
    onOffer: true,
    description: '',
  },
  {
    id: '4',
    name: 'Banana Prata',
    price: 3.90,
    originalPrice: 5.50,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1768734837464-c5045c6a98c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'Hortifruti',
    visible: true,
    onOffer: true,
    description: '',
  },
];

export function Offers() {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca produtos onde onOffer == true e visible == true
    const q = query(
      collection(db, 'products'),
      where('visible', '==', true),
      where('onOffer', '==', true)
    );
    
    const unsub = onSnapshot(q, snap => {
      const prods = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setOffers(prods);
      setLoading(false);
    });
    return unsub;
  }, []);

  const displayOffers = offers.length > 0 ? offers : (loading ? [] : DEFAULT_OFFERS);

  if (!loading && displayOffers.length === 0) return null;

  return (
    <section id="ofertas" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4">Ofertas da Semana</h2>
          <p className="text-muted-foreground">
            Aproveite nossas promoções especiais com produtos de qualidade
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayOffers.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                {offer.imageUrl ? (
                  <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Sem imagem</div>
                )}
                <span className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                  <Tag className="h-3 w-3" />
                  Oferta
                </span>
              </div>
              <div className="p-4">
                <h4 className="mb-2 text-gray-800 font-medium">{offer.name}</h4>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-red-600">
                    R$ {Number(offer.price).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-sm text-gray-500">/{offer.unit}</span>
                </div>
                {offer.originalPrice ? (
                  <span className="text-sm text-gray-400 line-through">
                    R$ {Number(offer.originalPrice).toFixed(2).replace('.', ',')}
                  </span>
                ) : (
                  <span className="text-sm text-transparent select-none">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
