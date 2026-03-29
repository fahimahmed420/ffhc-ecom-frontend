import Navbar from "@/components/Navbar";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import NewArrivals from "@/components/NewArrivals";
import PriceComparison from "@/components/PriceComparison";
import OurFocus from "@/components/OurFocus";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen pb-20">
      <Navbar />
      <Hero />
      <Categories />
      <NewArrivals/>
      <PriceComparison/>
      <OurFocus/>
      <Footer />
      <BottomNav />
    </main>
  );
}