import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FeatureCard } from '../components/FeatureCard';
import { TestimonialCard } from '../components/TestimonialCard';
import './Index.css';

const Index = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to Our Website</h1>
                <section className="features">
                    <FeatureCard />
                </section>
                <section className="testimonials">
                    <TestimonialCard />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Index;