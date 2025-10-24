import React from 'react';
import { Star, Users, Award, Shield } from 'lucide-react';

const TrustStrip: React.FC = () => {
  const stats = [
    { icon: Users, value: "2,500+", label: "Cars Sold" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: Award, value: "98%", label: "Success Rate" },
    { icon: Shield, value: "30-Day", label: "Money-Back" }
  ];

  const testimonials = [
    "Sold my Honda in 4 days for $1,200 more than expected!",
    "The DMV paperwork section saved me hours of confusion.",
    "Worth every penny - got $3,500 above market value!"
  ];

  return (
    <section className="py-12 bg-white border-b" aria-labelledby="trust-title">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-8">
          <h2 id="trust-title" className="text-2xl font-bold text-gray-900 mb-4">
            Trusted by California Car Sellers
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className="w-8 h-8 text-pacific-500" aria-hidden="true" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-sand-50 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-golden-300" aria-hidden="true" />
                ))}
              </div>
              <p className="text-gray-700 italic text-sm">"{testimonial}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
