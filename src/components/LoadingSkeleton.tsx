import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" role="main" aria-label="Loading California Car Seller Kit">
      {/* Header skeleton */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section skeleton */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-pacific-50 to-seafoam-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="h-16 w-full bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="h-6 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="h-12 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features section skeleton */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-12 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing section skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="h-12 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                  <div className="h-8 w-32 mx-auto bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-12 w-24 mx-auto bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-48 mx-auto bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3 mb-8">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer skeleton */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-96 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
};

export default LoadingSkeleton;
