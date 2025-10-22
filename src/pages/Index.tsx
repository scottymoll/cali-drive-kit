import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FeatureCard } from '../components/FeatureCard';

const Index = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to Our Website</h1>
                <p>Please review the findings and required fixes to improve the website.</p>
                <FeatureCard />
            </main>
            <Footer />
        </div>
    );
};

export default Index;