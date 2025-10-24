import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const SafetyCallout: React.FC = () => {
  const safetyTips = [
    "ID-only test drives with verified driver's license",
    "Cashier's check or branch meetups for payment",
    "Signed bill of sale before handover",
    "Meet in public places for test drives",
    "Never accept personal checks or wire transfers"
  ];

  const redFlags = [
    "Buyers offering more than asking price",
    "Requests to ship the car or use escrow",
    "Poor grammar or suspicious communication",
    "Refusal to meet in person or test drive"
  ];

  return (
    <section className="py-20 bg-red-50" aria-labelledby="safety-title">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 id="safety-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Safety & Fraud Prevention
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Protect yourself from common car selling scams with our proven safety protocols
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Safety Tips */}
          <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-green-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-900">Safety Best Practices</h3>
            </div>
            <ul className="space-y-3">
              {safetyTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flags */}
          <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-900">Red Flags to Watch For</h3>
            </div>
            <ul className="space-y-3">
              {redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-pacific-50 rounded-xl p-8 border border-pacific-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Remember: Your Safety Comes First
            </h3>
            <p className="text-gray-700 mb-6">
              If something feels off, trust your instincts. It's better to walk away from a sale than to put yourself at risk.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Always verify buyer identity
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Complete paperwork before handover
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Meet in public, well-lit areas
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyCallout;
