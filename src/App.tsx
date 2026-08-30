import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SilkBackground } from "@/components/SilkBackground";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuGallery } from "@/components/MenuGallery";
import { Experience } from "@/components/Experience";
import { Gallery } from "@/components/Gallery";
import { Reservation } from "@/components/Reservation";
import { Location } from "@/components/Location";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <SmoothScrollProvider>
      <SilkBackground />
      <Navbar />
      <main>
        <Hero />
        <MenuGallery />
        <Experience />
        <Gallery />
        <Reservation />
        <Location />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}

export default App;
