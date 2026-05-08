import { Beef, Sandwich, Apple } from 'lucide-react';

const categories = [
  {
    icon: Beef,
    title: 'Açougue',
    description: 'Cortes selecionados e tradição',
    color: 'bg-secondary',
    image: 'https://images.unsplash.com/photo-1597417321971-45e034f7a993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxidXRjaGVyJTIwc2hvcCUyMG1lYXQlMjBjb3VudGVyfGVufDF8fHx8MTc3ODI0ODEwMHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Sandwich,
    title: 'Padaria',
    description: 'Pães fresquinhos de fabricação própria',
    color: 'bg-[#d97706]',
    image: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwYmFrZXJ5fGVufDF8fHx8MTc3ODI0ODEwMHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Apple,
    title: 'Hortifruti - Dia Verde',
    description: 'Terças e quartas com frutas e legumes frescos',
    color: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1768734837679-9b3180433384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBmcnVpdHMlMjBwcm9kdWNlJTIwbWFya2V0fGVufDF8fHx8MTc3ODI0ODEwMHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function CategoryCards() {
  return (
    <section id="acougue-padaria" className="py-16 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-12">Nossas Especialidades</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 ${category.color} opacity-20`}></div>
                </div>
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${category.color} rounded-lg mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2">{category.title}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
