import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackCheckoutStarted } from '@/lib/analytics';

const BasicCheckout: React.FC = () => {
  useEffect(() => {
    trackCheckoutStarted('basic');
  }, []);

  const features = [
    'Pricing Guide & Worksheets',
    'Photo & Listing Blueprint', 
    'Buyer Screening Scripts',
    'Safe Test-Drive Protocol',
    'Offer & Negotiation Tactics',
    'CA DMV Paperwork Steps'
  ];

  const handlePurchase = () => {
    // In production, this would integrate with Stripe/Gumroad
    // For now, redirect to thank-you page
    window.location.href = '/thank-you?plan=basic';
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Order</h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pacific-100 rounded-full flex items-center justify-center">
                    <span className="text-pacific-600 font-bold text-sm">B</span>
                  </div>
                  Basic Kit
                </CardTitle>
                <CardDescription>Essential tools for confident car selling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Basic Kit</span>
                    <span className="text-2xl font-bold text-pacific-600">$19.99</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-2xl">$19.99</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">One-time payment • Instant access</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-seafoam-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Secure checkout powered by Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-yellow-800 text-xs font-bold">!</span>
                      </div>
                      <span className="font-medium">Demo Mode</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      This is a demo checkout. In production, this would integrate with Stripe Checkout.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pacific-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pacific-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-pacific-600 hover:bg-pacific-700 text-white py-3 text-lg font-semibold"
                    onClick={handlePurchase}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Complete Purchase - $19.99
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By purchasing, you agree to our Terms of Service and Privacy Policy.
                    You'll receive instant access via email after payment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Badges */}
            <div className="mt-6 flex justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Stripe Powered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BasicCheckout;
