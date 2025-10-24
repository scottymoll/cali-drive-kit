import React from 'react';
import { CheckCircle2, FileText, Handshake } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: CheckCircle2,
      title: "Choose your kit",
      description: "Pick Basic or Premium based on your needs",
      detail: "Both kits include essential checklists and scripts. Premium adds advanced pricing strategies and legal templates."
    },
    {
      icon: FileText,
      title: "Follow the checklists",
      description: "From pricing to paperwork",
      detail: "Step-by-step guidance through pricing your car, creating listings, screening buyers, and handling DMV paperwork."
    },
    {
      icon: Handshake,
      title: "Close safely",
      description: "Transfer title the right way, avoid scams",
      detail: "Complete the sale with confidence using our safety protocols and legal transfer procedures."
    }
  ];

  return (
    <section className="py-20 bg-sand-50" aria-labelledby="how-it-works-title">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to sell your car safely and legally in California
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-pacific-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-pacific-600" aria-hidden="true" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pacific-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-lg text-gray-600 mb-4">
                {step.description}
              </p>
              
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Who This Is For
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-seafoam-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-seafoam-600 font-bold">1</span>
                </div>
                <p className="font-medium text-gray-900">First-time sellers</p>
                <p className="text-gray-600">Never sold a car before? We'll guide you through every step.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-seafoam-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-seafoam-600 font-bold">2</span>
                </div>
                <p className="font-medium text-gray-900">Busy parents</p>
                <p className="text-gray-600">Short on time? Our checklists make selling efficient and safe.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-seafoam-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-seafoam-600 font-bold">3</span>
                </div>
                <p className="font-medium text-gray-900">Safety-conscious sellers</p>
                <p className="text-gray-600">Protect yourself with our fraud prevention and safety protocols.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
