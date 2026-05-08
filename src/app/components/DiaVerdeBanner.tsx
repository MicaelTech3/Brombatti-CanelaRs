import { Leaf, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DiaVerdeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const today = new Date().getDay();
    const isTuesdayOrWednesday = today === 2 || today === 3;
    setIsVisible(isTuesdayOrWednesday && !isDismissed);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-white py-3 px-4 relative">
      <div className="mx-auto max-w-7xl flex items-center justify-center gap-2">
        <Leaf className="h-5 w-5 animate-pulse" />
        <p className="text-center">
          <strong>Hoje é Dia Verde!</strong> Confira as ofertas especiais de hortifruti.
        </p>
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Fechar banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
