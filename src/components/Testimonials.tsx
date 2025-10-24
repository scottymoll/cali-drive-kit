import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "I sold my Honda Civic in 4 days for $1,200 more than I expected. The pricing guide was spot on!",
      author: "Sarah M.",
      location: "Los Angeles, CA",
      kit: "Basic",
      rating: 5
    },
    {
      quote: "The DMV paperwork section saved me hours of confusion. Everything was perfectly organized and California-specific.",
      author: "Mike R.",
      location: "San Diego, CA",
      kit: "Basic",
      rating: 5
    },
    {
      quote: "The premium kit's advanced pricing strategies helped me get $3,500 above market value for my Tesla. Worth every penny!",
      author: "Jennifer L.",
      location: "San Francisco, CA",
      kit: "Premium",
      rating: 5
    }
  ];

  const logos = [
    "California DMV",
    "Kelley Blue Book",
    "AutoTrader",
    "Cars.com"
  ];

  return (
    <section className="py-20 bg-white" aria-labelledby="testimonials-title">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real results from real people who used our kits to sell their cars successfully
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-sand-50 rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-golden-300" aria-hidden="true" />
                ))}
              </div>
              
              <div className="mb-4">
                <Quote className="w-6 h-6 text-pacific-300 mb-3" aria-hidden="true" />
                <blockquote className="text-gray-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                </div>
                <div className="text-xs bg-pacific-100 text-pacific-700 px-2 py-1 rounded-full">
                  {testimonial.kit} Kit
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Logos */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-6">As seen in and recommended by:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {logos.map((logo, index) => (
              <div key={index} className="text-gray-400 font-medium text-sm">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
