import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FeatureCard } from '../components/FeatureCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Index: React.FC = () => {
    return (
        <ErrorBoundary>
            <div className="container">
                <Header />
                <main>
                    <h1>Welcome to Our Site</h1>
                    <section className="features">
                        <h2>Features</h2>
                        <FeatureCard />
                    </section>
                    <section className="testimonials">
                        <h2>What Our Users Say</h2>
                        <TestimonialCard />
                    </section>
                </main>
                <Footer />
            </div>
        </ErrorBoundary>
    );
};

export default Index;