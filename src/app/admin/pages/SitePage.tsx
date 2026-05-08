import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { Save, Globe, Image, Phone, MapPin, Clock } from 'lucide-react';

// ── tipos ────────────────────────────────────────────────────────────────────
interface HeroConfig {
  title: string;
  subtitle: string;
  backgroundUrl: string;
  ctaText: string;
}

interface ContactConfig {
  address: string;
  city: string;
  phone: string;
  hours: string;
  facebook: string;
  instagram: string;
}

// ── defaults (fallback quando o doc não existe ainda) ─────────────────────────
const DEFAULT_HERO: HeroConfig = {
  title: 'O coração de Canela bate aqui',
  subtitle: 'Qualidade que sua família conhece',
  backgroundUrl: 'https://images.unsplash.com/photo-1768734837464-c5045c6a98c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ctaText: 'Ver Ofertas de Hoje',
};

const DEFAULT_CONTACT: ContactConfig = {
  address: 'Av. Júlio de Castilhos, 615',
  city: 'Centro - Canela/RS',
  phone: '5554984192145',
  hours: 'Segunda a Sábado | 09h às 20h',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
};

// ── componente ────────────────────────────────────────────────────────────────
export function SitePage() {
  const [tab, setTab] = useState<'hero' | 'contact'>('hero');
  const [hero, setHero] = useState<HeroConfig>(DEFAULT_HERO);
  const [contact, setContact] = useState<ContactConfig>(DEFAULT_CONTACT);
  const [savingHero, setSavingHero] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savedHero, setSavedHero] = useState(false);
  const [savedContact, setSavedContact] = useState(false);

  // Ler Hero do Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteConfig', 'hero'), snap => {
      if (snap.exists()) setHero(snap.data() as HeroConfig);
    });
    return unsub;
  }, []);

  // Ler Contact do Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteConfig', 'contact'), snap => {
      if (snap.exists()) setContact(snap.data() as ContactConfig);
    });
    return unsub;
  }, []);

  const saveHero = async () => {
    setSavingHero(true);
    try {
      await setDoc(doc(db, 'siteConfig', 'hero'), hero);
      setSavedHero(true);
      setTimeout(() => setSavedHero(false), 2000);
    } finally {
      setSavingHero(false);
    }
  };

  const saveContact = async () => {
    setSavingContact(true);
    try {
      await setDoc(doc(db, 'siteConfig', 'contact'), contact);
      setSavedContact(true);
      setTimeout(() => setSavedContact(false), 2000);
    } finally {
      setSavingContact(false);
    }
  };

  const setH = (k: keyof HeroConfig, v: string) => setHero(h => ({ ...h, [k]: v }));
  const setC = (k: keyof ContactConfig, v: string) => setContact(c => ({ ...c, [k]: v }));

  return (
    <div className="p-4 md:p-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Globe className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Página do Site</h2>
          <p className="text-sm text-gray-500">Edite o conteúdo exibido aos clientes em tempo real</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-200 p-1 rounded-xl w-fit mb-6">
        {([
          { key: 'hero', label: 'Banner Principal', icon: Image },
          { key: 'contact', label: 'Contato & Rodapé', icon: MapPin },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB: Hero ─────────────────────────────────────────────────────── */}
      {tab === 'hero' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* Preview */}
          <div className="relative h-40 rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.backgroundUrl || DEFAULT_HERO.backgroundUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
            <div className="relative h-full flex items-center px-6">
              <div>
                <p className="text-white font-bold text-lg leading-tight">{hero.title || 'Título aqui'}</p>
                <p className="text-white/80 text-sm mt-1">{hero.subtitle || 'Subtítulo aqui'}</p>
                <span className="mt-2 inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-lg">
                  {hero.ctaText || 'Botão'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 -mt-2">↑ Preview em tempo real</p>

          {/* Campos */}
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Título Principal</label>
              <input
                type="text"
                value={hero.title}
                onChange={e => setH('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="O coração de Canela bate aqui"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subtítulo</label>
              <input
                type="text"
                value={hero.subtitle}
                onChange={e => setH('subtitle', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Qualidade que sua família conhece"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">URL da Imagem de Fundo</label>
              <input
                type="url"
                value={hero.backgroundUrl}
                onChange={e => setH('backgroundUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Texto do Botão CTA</label>
              <input
                type="text"
                value={hero.ctaText}
                onChange={e => setH('ctaText', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ver Ofertas de Hoje"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveHero}
              disabled={savingHero}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {savedHero ? '✓ Salvo!' : savingHero ? 'Salvando...' : 'Salvar Banner'}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: Contact ──────────────────────────────────────────────────── */}
      {tab === 'contact' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <MapPin className="inline h-3 w-3 mr-1" />Endereço
              </label>
              <input
                type="text"
                value={contact.address}
                onChange={e => setC('address', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Av. Júlio de Castilhos, 615"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cidade / Bairro</label>
              <input
                type="text"
                value={contact.city}
                onChange={e => setC('city', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Centro - Canela/RS"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <Phone className="inline h-3 w-3 mr-1" />WhatsApp (apenas números, com DDI)
              </label>
              <input
                type="text"
                value={contact.phone}
                onChange={e => setC('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="5554984192145"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <Clock className="inline h-3 w-3 mr-1" />Horário de Funcionamento
              </label>
              <input
                type="text"
                value={contact.hours}
                onChange={e => setC('hours', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Segunda a Sábado | 09h às 20h"
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Redes Sociais</p>
              <div className="grid gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Facebook (URL)</label>
                  <input
                    type="url"
                    value={contact.facebook}
                    onChange={e => setC('facebook', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://facebook.com/seuusuario"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Instagram (URL)</label>
                  <input
                    type="url"
                    value={contact.instagram}
                    onChange={e => setC('instagram', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://instagram.com/seuusuario"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveContact}
              disabled={savingContact}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {savedContact ? '✓ Salvo!' : savingContact ? 'Salvando...' : 'Salvar Contato'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
