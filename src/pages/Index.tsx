import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import ErrorBoundary from '../components/ErrorBoundary';

const Index: React.FC = () => {
    return (
        <ErrorBoundary>
            <div>
                <Header />
                <main>
                    <h1>Welcome to Our Site</h1>
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
        </ErrorBoundary>
    );
};

export default Index;