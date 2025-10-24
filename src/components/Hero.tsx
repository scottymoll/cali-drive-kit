import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-coastal.jpg';
import TrustChips from './TrustChips';
import { trackCTAClick } from '@/lib/analytics';

const Hero: React.FC = () => {
  const handleCTAClick = (ctaType: 'basic' | 'premium', location: string) => {
    trackCTAClick(ctaType, location);
  };

  return (
    <section className="relative min-h-[75vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden" role="banner">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="California coastal highway with car selling concept"
          className="absolute inset-0 w-full h-full object-cover"
          width={1200}
          height={800}
          loading="eager"
          decoding="async"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pacific-900/80 to-pacific-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
        <h1 className="text-white mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          CA Car Seller Kit
        </h1>
        
        <h2 className="text-white/95 text-xl md:text-2xl lg:text-3xl font-medium mb-8 max-w-4xl mx-auto leading-relaxed">
          DMV-compliant steps, pricing worksheets, buyer-screening scripts, and safety protocols—so you sell fast and legally in California.
        </h2>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8" role="group" aria-label="Purchase options">
          <Link to="/checkout/basic" onClick={() => handleCTAClick('basic', 'hero')}>
            <Button
              size="lg"
              className="bg-pacific-600 hover:bg-pacific-700 text-white px-8 py-4 text-lg font-semibold h-12 min-w-[200px] focus:ring-4 focus:ring-pacific-300/50"
              aria-label="Get the Basic Kit for $19.99"
            >
              Get the Basic Kit — $19.99
            </Button>
          </Link>
          
          <Link to="/checkout/premium" onClick={() => handleCTAClick('premium', 'hero')}>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white px-8 py-4 text-lg font-semibold h-12 min-w-[200px] focus:ring-4 focus:ring-white/30"
              aria-label="See Premium Kit for $97"
            >
              See Premium — $97
            </Button>
          </Link>
        </div>

        <p className="text-white/80 text-sm mb-8">
          Instant download. Works on all devices.
        </p>

        {/* Trust Chips */}
        <TrustChips />
      </div>
    </section>
  );
};

export default Hero;
