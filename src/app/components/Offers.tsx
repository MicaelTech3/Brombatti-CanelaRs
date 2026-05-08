import { Tag } from 'lucide-react';

const offers = [
  {
    id: 1,
    name: 'Picanha Premium',
    price: 'R$ 45,90',
    oldPrice: 'R$ 59,90',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1599834255434-c137726a0637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXRjaGVyJTIwc2hvcCUyMG1lYXQlMjBjb3VudGVyfGVufDF8fHx8MTc3ODI0ODEwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Oferta Limitada',
  },
  {
    id: 2,
    name: 'Pão Francês',
    price: 'R$ 8,90',
    oldPrice: 'R$ 12,90',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwYmFrZXJ5fGVufDF8fHx8MTc3ODI0ODEwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Fabricação Própria',
  },
  {
    id: 3,
    name: 'Tomate',
    price: 'R$ 4,50',
    oldPrice: 'R$ 6,90',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1768734837679-9b3180433384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBmcnVpdHMlMjBwcm9kdWNlJTIwbWFya2V0fGVufDF8fHx8MTc3ODI0ODEwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Dia Verde',
  },
  {
    id: 4,
    name: 'Banana Prata',
    price: 'R$ 3,90',
    oldPrice: 'R$ 5,50',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1768734837464-c5045c6a98c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBmcnVpdHMlMjBwcm9kdWNlJTIwbWFya2V0fGVufDF8fHx8MTc3ODI0ODEwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Dia Verde',
  },
];

export function Offers() {
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
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-destructive text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {offer.badge}
                </span>
              </div>
              <div className="p-4">
                <h4 className="mb-2">{offer.name}</h4>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-primary">{offer.price}</span>
                  <span className="text-sm text-muted-foreground">/{offer.unit}</span>
                </div>
                <span className="text-sm text-muted-foreground line-through">{offer.oldPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
