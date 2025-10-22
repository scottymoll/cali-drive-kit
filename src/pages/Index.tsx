import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import Header from '../components/Header';
import TestimonialCard from '../components/TestimonialCard';

const Index: React.FC = () => {
  return (
    <ErrorBoundary>
      <Header />
      <main>
        <h1>Welcome to Our Website</h1>
        <FeatureCard />
        <TestimonialCard />
      </main>
      <Footer />
    </ErrorBoundary>
  );
};

export default Index;