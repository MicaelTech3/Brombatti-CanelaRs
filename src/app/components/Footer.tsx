import { MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/db';

const DEFAULT = {
  address: 'Av. Júlio de Castilhos, 615',
  city: 'Centro - Canela/RS',
  phone: '5554984192145',
  hours: 'Segunda a Sábado | 09h às 20h',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
};

export function Footer() {
  const [config, setConfig] = useState(DEFAULT);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteConfig', 'contact'), snap => {
      if (snap.exists()) {
        const d = snap.data();
        setConfig({
          address: d.address || DEFAULT.address,
          city: d.city || DEFAULT.city,
          phone: d.phone || DEFAULT.phone,
          hours: d.hours || DEFAULT.hours,
          facebook: d.facebook || DEFAULT.facebook,
          instagram: d.instagram || DEFAULT.instagram,
        });
      }
    });
    return unsub;
  }, []);

  // Separar horário no pipe se existir
  const [hoursLabel, hoursValue] = config.hours.includes('|')
    ? config.hours.split('|').map(s => s.trim())
    : [config.hours, ''];

  return (
    <footer id="localizacao" className="bg-foreground text-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-white mb-6">Nossa Localização</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/90">{config.address}</p>
                  <p className="text-white/70">{config.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/90">{hoursLabel}</p>
                  {hoursValue && <p className="text-white/70">{hoursValue}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={config.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3478.5!2d-50.8145!3d-29.3642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDIxJzUxLjEiUyA1MMKwNDgnNTIuMiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Supermercado Brombatti"
            />
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/70">
            &copy; {new Date().getFullYear()} Supermercado Brombatti. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
