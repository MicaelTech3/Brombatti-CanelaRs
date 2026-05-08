import { DiaVerdeBanner } from './components/DiaVerdeBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryCards } from './components/CategoryCards';
import { Offers } from './components/Offers';
import { Facilities } from './components/Facilities';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <DiaVerdeBanner />
      <Header />
      <main>
        <Hero />
        <CategoryCards />
        <Offers />
        <Facilities />
      </main>
      <Footer />
    </div>
  );
}