import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

const Index = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to Our Site</h1>
        <FeatureCard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;