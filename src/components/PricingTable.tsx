import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Star, Shield } from 'lucide-react';

const PricingTable: React.FC = () => {
  const features = [
    { name: "Essential checklists + scripts", basic: true, premium: true },
    { name: "DMV paperwork steps", basic: true, premium: true },
    { name: "Buyer screening scripts", basic: true, premium: true },
    { name: "Test-drive safety protocol", basic: true, premium: true },
    { name: "Pricing worksheets", basic: true, premium: true },
    { name: "Advanced pricing strategies", basic: false, premium: true },
    { name: "Legal forms library", basic: false, premium: true },
    { name: "Professional templates", basic: false, premium: true },
    { name: "Fraud prevention guide", basic: false, premium: true },
    { name: "Market intelligence", basic: false, premium: true },
    { name: "Lifetime updates", basic: false, premium: true }
  ];

  const whyPremium = [
    "Advanced pricing strategies to maximize profit",
    "Complete legal forms library with templates", 
    "Professional workflow for faster sales"
  ];

  return (
    <section className="py-20 bg-sand-50" aria-labelledby="pricing-title">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 id="pricing-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Kit
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to sell your car in California. Pick the level that's right for you.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Basic Kit */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Kit</h3>
              <div className="text-4xl font-bold text-pacific-600 mb-2">$19.99</div>
              <p className="text-gray-600">Essential checklists + scripts to list quickly and legally.</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {features.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-seafoam-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature.name}</span>
                </div>
              ))}
            </div>

            <Link to="/checkout/basic" className="block">
              <Button 
                className="w-full bg-pacific-600 hover:bg-pacific-700 text-white py-3 text-lg font-semibold h-12 focus:ring-4 focus:ring-pacific-300/50"
                aria-label="Get Basic Kit for $19.99"
              >
                Get Basic Kit — $19.99
              </Button>
            </Link>
          </div>

          {/* Premium Kit */}
          <div className="bg-gradient-to-br from-pacific-500 to-pacific-600 rounded-2xl p-8 shadow-2xl border-2 border-pacific-400 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-golden-300 text-pacific-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2" aria-label="Most popular option">
                <Star className="w-4 h-4" aria-hidden="true" />
                MOST POPULAR
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Premium Kit</h3>
              <div className="text-4xl font-bold text-golden-300 mb-2">$97</div>
              <p className="text-pacific-100">Everything in Basic + advanced pricing, legal templates, and pro-level workflow.</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  {feature.premium ? (
                    <Check className="w-5 h-5 text-golden-300 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className={feature.premium ? "text-white" : "text-pacific-200"}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <Link to="/checkout/premium" className="block">
              <Button 
                className="w-full bg-golden-300 text-pacific-900 hover:bg-golden-200 py-3 text-lg font-semibold h-12 focus:ring-4 focus:ring-golden-300/50"
                aria-label="Get Premium Kit for $97"
              >
                Get Premium Kit — $97
              </Button>
            </Link>
          </div>
        </div>

        {/* Why Premium */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Why Premium?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {whyPremium.map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <Star className="w-5 h-5 text-golden-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Shield className="w-5 h-5 text-seafoam-500" />
            <span className="font-semibold">30-day no-questions-asked refund if you're not thrilled.</span>
          </div>
          <p className="text-sm text-gray-500">
            Instant download • Works on all devices • California-specific guidance
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
