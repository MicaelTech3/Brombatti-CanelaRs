import { Accessibility, CreditCard, Bath, MessageSquare } from 'lucide-react';

const facilities = [
  {
    icon: Accessibility,
    title: 'Acessível',
    description: 'Acesso para cadeirantes',
  },
  {
    icon: CreditCard,
    title: 'Pagamento por Aproximação',
    description: 'Aceita NFC e cartões contactless',
  },
  {
    icon: Bath,
    title: 'Banheiros',
    description: 'Banheiros disponíveis no local',
  },
  {
    icon: MessageSquare,
    title: 'Envie sua Lista',
    description: 'Mande pelo WhatsApp e nós separamos',
  },
];

export function Facilities() {
  const whatsappNumber = '5554984192145';

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Olá! Gostaria de enviar minha lista de compras.`, '_blank');
  };

  return (
    <section className="py-16 bg-accent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-12">Facilidades e Diferenciais</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilities.map((facility) => {
            const Icon = facility.icon;
            return (
              <div key={facility.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="mb-2">{facility.title}</h4>
                <p className="text-muted-foreground text-sm">{facility.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="mb-4">Serviço de Lista pelo WhatsApp</h3>
            <p className="text-muted-foreground mb-6">
              Envie sua lista de compras pelo WhatsApp para <strong>(54) 98419-2145</strong> e nós separamos tudo para você!
              É prático, rápido e você economiza tempo.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] text-white px-8 py-3 rounded-lg hover:bg-[#20BA5A] transition-colors inline-flex items-center gap-2"
            >
              <MessageSquare className="h-5 w-5" />
              Enviar Lista Agora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
