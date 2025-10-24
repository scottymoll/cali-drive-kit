import React from 'react';
import { Shield, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

const Guarantee: React.FC = () => {
  const guaranteeFeatures = [
    {
      icon: Shield,
      title: "30-Day Money-Back",
      description: "Full refund if you're not completely satisfied"
    },
    {
      icon: CheckCircle2,
      title: "Proven Results",
      description: "2,500+ cars sold using our methods"
    },
    {
      icon: Clock,
      title: "Instant Access",
      description: "Download immediately after purchase"
    },
    {
      icon: RefreshCw,
      title: "Lifetime Updates",
      description: "Free updates for Premium customers"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-pacific-50 to-seafoam-50" aria-labelledby="guarantee-title">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 id="guarantee-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Guarantee
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            30-day no-questions-asked refund if you're not thrilled with your results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {guaranteeFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-pacific-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-pacific-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pacific-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Safety & Fraud Prevention
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our kits include comprehensive safety protocols to protect you from common car selling scams
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Buyer Safety Checklist:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-seafoam-500 flex-shrink-0" />
                    Verify buyer's identity and driver's license
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-seafoam-500 flex-shrink-0" />
                    Meet in public places for test drives
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-seafoam-500 flex-shrink-0" />
                    Never accept personal checks or wire transfers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-seafoam-500 flex-shrink-0" />
                    Complete all paperwork before handing over keys
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Red Flags to Watch For:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Buyers offering more than asking price
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Requests to ship the car or use escrow
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Poor grammar or suspicious communication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Refusal to meet in person or test drive
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guarantee;
