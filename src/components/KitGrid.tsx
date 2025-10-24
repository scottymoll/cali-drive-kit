import React from 'react';
import { 
  Calculator, 
  FileText, 
  MessageSquare, 
  Shield, 
  Handshake, 
  ClipboardList,
  DollarSign,
  Camera,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const KitGrid: React.FC = () => {
  const kitItems = [
    {
      icon: Calculator,
      title: "Pricing Guide",
      description: "Worksheets to price your car competitively",
      basic: true,
      premium: true
    },
    {
      icon: FileText,
      title: "DMV Steps",
      description: "Complete California DMV paperwork checklist",
      basic: true,
      premium: true
    },
    {
      icon: MessageSquare,
      title: "Buyer Scripts",
      description: "Phone and text templates for screening buyers",
      basic: true,
      premium: true
    },
    {
      icon: Shield,
      title: "Test-Drive Protocol",
      description: "Safety checklist for test drives",
      basic: true,
      premium: true
    },
    {
      icon: ClipboardList,
      title: "Templates",
      description: "Ready-to-use forms and checklists",
      basic: true,
      premium: true
    },
    {
      icon: DollarSign,
      title: "Advanced Pricing",
      description: "Pro strategies to maximize your car's value",
      basic: false,
      premium: true
    },
    {
      icon: Camera,
      title: "Photo Guide",
      description: "Professional listing photography tips",
      basic: false,
      premium: true
    },
    {
      icon: AlertTriangle,
      title: "Fraud Prevention",
      description: "Spot scams and protect yourself",
      basic: false,
      premium: true
    },
    {
      icon: Handshake,
      title: "Negotiation Guide",
      description: "Close deals confidently with proven tactics",
      basic: false,
      premium: true
    },
    {
      icon: CheckCircle2,
      title: "Legal Forms",
      description: "Complete library of California-specific forms",
      basic: false,
      premium: true
    }
  ];

  return (
    <section className="py-20 bg-background" aria-labelledby="kit-title">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 id="kit-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Inside the Kit
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to sell your car safely and legally in California
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitItems.map((item, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                item.premium && !item.basic 
                  ? 'border-golden-200 bg-gradient-to-br from-golden-50 to-white' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  item.premium && !item.basic 
                    ? 'bg-golden-100 text-golden-600' 
                    : 'bg-pacific-100 text-pacific-600'
                }`}>
                  <item.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex gap-2">
                    {item.basic && (
                      <span className="text-xs bg-pacific-100 text-pacific-700 px-2 py-1 rounded-full">
                        Basic
                      </span>
                    )}
                    {item.premium && (
                      <span className="text-xs bg-golden-100 text-golden-700 px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            All files are instantly downloadable and work on any device
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#pricing" 
              className="inline-flex items-center justify-center px-6 py-3 bg-pacific-600 text-white rounded-lg hover:bg-pacific-700 transition-colors font-semibold"
            >
              See What's Included
            </a>
            <a 
              href="#faq" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              View FAQ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitGrid;
