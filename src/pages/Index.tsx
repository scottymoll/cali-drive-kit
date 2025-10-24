import React, { useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import PricingTable from "@/components/PricingTable";
import KitGrid from "@/components/KitGrid";
import HowItWorks from "@/components/HowItWorks";
import SafetyCallout from "@/components/SafetyCallout";
import FAQ from "@/components/FAQ";
import Guarantee from "@/components/Guarantee";
import Testimonials from "@/components/Testimonials";
import { trackPageView } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    trackPageView('home');
  }, []);

  return (
    <div className="min-h-screen">
      {/* Skip navigation for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
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
        <SafetyCallout />
        <Testimonials />
        <FAQ />
        <Guarantee />
      </main>

      <Footer />
    </div>
  );
};

export default Index;