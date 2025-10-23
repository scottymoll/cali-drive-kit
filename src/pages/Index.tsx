import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

const Index: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to Our Website</h1>
                <p>Explore our features and services.</p>
                <FeatureCard />
            </main>
            <Footer />
        </div>
    );
};

export default Index;