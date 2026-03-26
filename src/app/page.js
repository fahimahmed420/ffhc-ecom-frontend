import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import OurFocus from "@/components/OurFocus";
import PriceComparison from "@/components/PriceComparison";

export default function Home() {
  return (
    <div className="pb-16 md:pb-0">
      <div className="">
        <Hero/>
        <Categories/>
        <PriceComparison/>
        <OurFocus/>
      </div>
    </div>
  );
}