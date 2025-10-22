import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { TestimonialCard } from '../components/TestimonialCard';

const Index = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to Our Website</h1>
        <section>
          <h2>Features</h2>
          <FeatureCard />
        </section>
        <section>
          <h2>Testimonials</h2>
          <TestimonialCard />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;