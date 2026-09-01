import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ScrollBackgroundVideo } from "@/components/ScrollBackgroundVideo";
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
      <ScrollBackgroundVideo />
      <div className="relative z-[1]">
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
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
