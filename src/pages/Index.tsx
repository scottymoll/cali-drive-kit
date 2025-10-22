import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import { useToast } from '../hooks/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();

  const handleReview = () => {
    toast({
      title: 'Review Submitted',
      description: 'Thank you for your feedback!',
      status: 'success',
    });
  };

  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to Our Website</h1>
        <p>Please review the findings and required fixes to improve the website.</p>
        <FeatureCard onReview={handleReview} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;