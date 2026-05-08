import { Menu, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../../imports/download.png';
import splashVideo from '../../imports/3d.mp4';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/db';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const whatsappNumber = '5554984192145';

  useEffect(() => {
    // Corte seco e instantâneo com exatos 2 segundos
    const t = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => {
    // Registra o clique no Firestore sem bloquear a tela
    setDoc(doc(db, 'stats', 'whatsapp'), { clicks: increment(1) }, { merge: true }).catch(console.error);
    window.open(`https://wa.me/${whatsappNumber}?text=Olá! Gostaria de enviar minha lista de compras.`, '_blank');
  };

  return (
    <>
      <style>{`
        .video-splash {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 101;
          object-fit: cover;
          background: #000;
        }

        .splash-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #000;
        }
      `}</style>

      {showSplash && (
        <>
          <div className="splash-overlay" />

          {/* Vídeo de abertura vertical em tela cheia. */}
          <video
            src={splashVideo}
            autoPlay
            muted
            playsInline
            className="video-splash"
          />
        </>
      )}

      {/* Header - só aparece depois do splash */}
      {!showSplash && (
        <div className="page-content">
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
        </div>
      )}
    </>
  );
}