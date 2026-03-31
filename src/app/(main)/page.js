import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import PriceComparison from "@/components/PriceComparison";
import OurFocus from "@/components/OurFocus";
import BestSelling from "@/components/BestSelling";

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <Hero />

      {/* Categories */}
      <Categories />

      {/* New Arrivals */}
      <BestSelling />

      {/* Price Comparison */}
      <PriceComparison />

      {/* Our Focus Section */}
      <OurFocus />
    </div>
  );
}