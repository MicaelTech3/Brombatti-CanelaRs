import { Menu, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../../imports/download.png';
import splashVideo from '../../imports/3d.mp4';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const whatsappNumber = '5554984192145';

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3500); // Aumentei o tempo para 3.5s para o vídeo ter destaque
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Olá! Gostaria de enviar minha lista de compras.`, '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes logoEntrance {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
            filter: blur(10px);
          }
          25% {
            opacity: 1;
            filter: blur(0);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
          }
          70% {
            transform: translate(-50%, -50%) scale(0.98);
          }
          85% {
            transform: translate(-50%, -50%) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0;
            filter: blur(8px);
          }
        }

        .logo-animation {
          position: fixed;
          left: 50%;
          top: 50%;
          width: auto;
          height: 140px;
          z-index: 101;
          animation: logoEntrance 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.2));
        }

        .video-splash {
          position: fixed;
          left: 50%;
          top: 50%;
          width: 100vw;
          height: 100vh;
          max-width: 100%;
          z-index: 101;
          object-fit: cover;
          animation: logoEntrance 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
          border-radius: 24px;
        }

        @keyframes splashFadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }

        .splash-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #000; /* Fundo escuro para destacar o vídeo */
          pointer-events: none;
          animation: splashFadeOut 3.5s ease forwards;
        }

        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        .pulse-ring {
          position: fixed;
          left: 50%;
          top: 50%;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 2px solid rgba(37, 211, 102, 0.3);
          z-index: 100;
          animation: pulseRing 2s ease-out infinite;
        }

        @keyframes particlesFloat {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }

        .particle {
          position: fixed;
          left: 50%;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #25D366;
          z-index: 100;
          animation: particlesFloat 2s ease-out forwards;
        }

        .particle:nth-child(1) { animation-delay: 0s; }
        .particle:nth-child(2) { animation-delay: 0.2s; }
        .particle:nth-child(3) { animation-delay: 0.4s; }
        .particle:nth-child(4) { animation-delay: 0.6s; }
        .particle:nth-child(5) { animation-delay: 0.8s; }
        .particle:nth-child(6) { animation-delay: 1s; }

        @keyframes pageFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-content {
          animation: pageFadeIn 0.6s ease-out 3.5s both;
        }
      `}</style>

      {showSplash && (
        <>
          <div className="splash-overlay" />

          {/* Anéis pulsantes */}
          <div className="pulse-ring" />
          <div className="pulse-ring" style={{ animationDelay: '0.3s', width: '200px', height: '200px' }} />
          <div className="pulse-ring" style={{ animationDelay: '0.6s', width: '220px', height: '220px' }} />

          {/* Partículas */}
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />

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