import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { TestimonialCard } from '../components/TestimonialCard';

const Index: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to Our Site</h1>
                <FeatureCard />
                <TestimonialCard />
            </main>
            <Footer />
        </div>
    );
};

export default Index;