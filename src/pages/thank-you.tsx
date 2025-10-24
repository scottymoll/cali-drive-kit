import React from 'react';
import { CheckCircle2, Download, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ThankYou: React.FC = () => {
  const quickStartSteps = [
    "Download your kit files from the links below",
    "Start with the pricing guide to value your car",
    "Follow the DMV checklist for paperwork",
    "Use the buyer screening scripts for safety",
    "Complete the sale with confidence!"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pacific-50 to-seafoam-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-pacific-600 hover:text-pacific-700">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="text-lg font-semibold text-gray-900">CA Car Seller Kit</div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" aria-hidden="true" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Purchase!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your CA Car Seller Kit is ready for download. You'll also receive an email with all the links.
          </p>
        </div>

        {/* Download Links */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Download Your Kit
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-pacific-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Kit Files</h3>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Pricing Guide & Worksheets (PDF)</li>
                <li>• DMV Paperwork Checklist (PDF)</li>
                <li>• Buyer Screening Scripts (PDF)</li>
                <li>• Test-Drive Safety Protocol (PDF)</li>
                <li>• Listing Templates (Word/PDF)</li>
              </ul>
              <Button className="w-full bg-pacific-600 hover:bg-pacific-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Basic Kit
              </Button>
            </div>

            <div className="border border-golden-200 rounded-lg p-6 bg-gradient-to-br from-golden-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Premium Kit Files</h3>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Everything in Basic Kit</li>
                <li>• Advanced Pricing Strategies (PDF)</li>
                <li>• Legal Forms Library (PDF)</li>
                <li>• Professional Templates (Word/Excel)</li>
                <li>• Fraud Prevention Guide (PDF)</li>
                <li>• Market Intelligence Report (PDF)</li>
              </ul>
              <Button className="w-full bg-golden-300 text-pacific-900 hover:bg-golden-200">
                <Download className="w-4 h-4 mr-2" />
                Download Premium Kit
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Quick Start Guide
          </h2>
          
          <div className="space-y-4">
            {quickStartSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pacific-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pacific-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="bg-sand-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Need Help?
          </h2>
          
          <p className="text-gray-600 mb-6">
            We're here to help you sell your car successfully. Reach out if you have any questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@ca-car-seller.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-pacific-600 text-white rounded-lg hover:bg-pacific-700 transition-colors font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </a>
            
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThankYou;
