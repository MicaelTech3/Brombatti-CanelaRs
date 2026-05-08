import { Menu, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../../imports/download.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [done, setDone] = useState(false);
  const whatsappNumber = '5554984192145';

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Olá! Gostaria de enviar minha lista de compras.`, '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes crossScreen {
          0%   { left: -160px; top: 60%; transform: translateY(-50%) scale(1); }
          20%  { top: 40%; transform: translateY(-50%) scale(1.1); }
          35%  { top: 65%; transform: translateY(-50%) scale(0.95); }
          50%  { top: 38%; transform: translateY(-50%) scale(1.05); }
          65%  { top: 60%; transform: translateY(-50%) scale(0.98); }
          80%  { top: 45%; transform: translateY(-50%) scale(1.02); }
          100% { left: calc(100% + 160px); top: 50%; transform: translateY(-50%) scale(1); }
        }

        .logo-bounce {
          position: fixed;
          width: auto;
          height: 140px;
          z-index: 100;
          animation: crossScreen 1.6s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }

        @keyframes fadeOutOverlay {
          0%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }

        .splash-overlay {
          animation: fadeOutOverlay 2s ease forwards;
        }
      `}</style>

      {!done && (
        <>
          <div className="splash-overlay fixed inset-0 z-[99] bg-white pointer-events-none" />
          <img src={logo} alt="Brombatti" className="logo-bounce" />
        </>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Supermercado Brombatti"
                className="w-auto transition-transform duration-300 hover:scale-110"
                style={{ height: '64px' }}
              />
              <div>
                <h1 className="text-xl font-bold text-primary">Supermercado Brombatti</h1>
                <p className="text-xs text-muted-foreground">Canela/RS</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#inicio" className="text-foreground hover:text-primary transition-colors">Início</a>
              <a href="#ofertas" className="text-foreground hover:text-primary transition-colors">Ofertas da Semana</a>
              <a href="#acougue-padaria" className="text-foreground hover:text-primary transition-colors">Açougue & Padaria</a>
              <a href="#localizacao" className="text-foreground hover:text-primary transition-colors">Localização</a>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#20BA5A] transition-colors"
              >
                <Phone className="h-4 w-4" />
                Pedir pelo WhatsApp
              </button>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              <a href="#inicio" className="block py-2 text-foreground hover:text-primary transition-colors">Início</a>
              <a href="#ofertas" className="block py-2 text-foreground hover:text-primary transition-colors">Ofertas da Semana</a>
              <a href="#acougue-padaria" className="block py-2 text-foreground hover:text-primary transition-colors">Açougue & Padaria</a>
              <a href="#localizacao" className="block py-2 text-foreground hover:text-primary transition-colors">Localização</a>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#20BA5A] transition-colors w-full justify-center"
              >
                <Phone className="h-4 w-4" />
                Pedir pelo WhatsApp
              </button>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}