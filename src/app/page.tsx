import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Servicos from "@/components/Servicos";
import Portfolio from "@/components/Portfolio";
import AtaPreco from "@/components/AtaPreco";
import MapaAtuacao from "@/components/MapaAtuacao";
import Diferenciais from "@/components/Diferenciais";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Servicos />
        <Portfolio />
        <AtaPreco />
        <MapaAtuacao />
        <Diferenciais />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
