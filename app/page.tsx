import { Navbar } from "@/components/home/Navbar";
import { HeroBanner } from "@/components/home/HeroBanner";
import { MenuList } from "@/components/home/MenuList";
import { ScrollingBanner } from "@/components/home/ScrollingBanner";
import { Footer } from "@/components/home/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroBanner />

      {/* Menu sections — loaded from the backend */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-12">
        <MenuList />
      </main>

      <ScrollingBanner />
      <Footer />
    </>
  );
}
