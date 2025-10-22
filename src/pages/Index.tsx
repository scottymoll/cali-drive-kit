import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import './Index.css';

const Index: React.FC = () => {
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