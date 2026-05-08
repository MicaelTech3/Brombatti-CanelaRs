import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/db';

const DEFAULT = {
  title: 'O coração de Canela bate aqui',
  subtitle: 'Qualidade que sua família conhece',
  backgroundUrl: 'https://images.unsplash.com/photo-1768734837464-c5045c6a98c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ctaText: 'Ver Ofertas de Hoje',
};

export function Hero() {
  const [config, setConfig] = useState(DEFAULT);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteConfig', 'hero'), snap => {
      if (snap.exists()) {
        const data = snap.data();
        setConfig({
          title: data.title || DEFAULT.title,
          subtitle: data.subtitle || DEFAULT.subtitle,
          backgroundUrl: data.backgroundUrl || DEFAULT.backgroundUrl,
          ctaText: data.ctaText || DEFAULT.ctaText,
        });
      }
    });
    return unsub;
  }, []);

  return (
    <section id="inicio" className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${config.backgroundUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {config.title}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {config.subtitle}
            </p>
            <a
              href="#ofertas"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {config.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
