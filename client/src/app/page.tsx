import FaqSection from "@/components/home/FaqSection";
import HeroSection from "@/components/home/HeroSection";
import HomeFooter from "@/components/home/HomeFooter";
import PricingSection from "@/components/home/PricingSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="pointer-events-none absolute -top-36 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-green/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-8 md:pt-12">
        <HeroSection />
        <WhyChooseUsSection />

        <PricingSection />
        <FaqSection />
        <HomeFooter />
      </div>
    </main>
  );
}
