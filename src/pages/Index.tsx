import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import PricingTable from "@/components/PricingTable";
import KitGrid from "@/components/KitGrid";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Guarantee from "@/components/Guarantee";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Skip navigation for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pacific-500 text-white px-4 py-2 rounded-md z-50"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      <Header />

      <main role="main" aria-label="Main content" id="main-content">
        <Hero />
        <TrustStrip />
        <PricingTable />
        <KitGrid />
        <HowItWorks />
        <FAQ />
        <Guarantee />
      </main>

      <Footer />
    </div>
  );
};

export default Index;