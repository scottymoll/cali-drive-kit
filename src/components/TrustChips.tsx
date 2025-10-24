import React from 'react';
import { Shield, Download, MapPin } from 'lucide-react';

const TrustChips: React.FC = () => {
  const chips = [
    { icon: Shield, text: "30-Day Money-Back", description: "Full refund guarantee" },
    { icon: Download, text: "Instant Download", description: "Get started immediately" },
    { icon: MapPin, text: "California-Specific", description: "Built for CA DMV rules" }
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8" role="list" aria-label="Trust indicators">
      {chips.map((chip, index) => (
        <div key={index} className="flex items-center gap-2 text-pacific-700" role="listitem">
          <chip.icon className="w-5 h-5 text-pacific-500" aria-hidden="true" />
          <span className="font-medium text-sm sm:text-base">{chip.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustChips;
