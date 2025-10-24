import React from 'react';
import Button from '../components/ui/button';
import heroImage from '../assets/hero-coastal.jpg';
import paperworkImage from '../assets/paperwork-flatlay.jpg';

const Index: React.FC = () => {
    return (
        <div>
            <h1>Welcome to Our Site</h1>
            <img src={heroImage} alt="Coastal view" />
            <Button>Get Started</Button>
            <img src={paperworkImage} alt="Flatlay of paperwork" />
        </div>
    );
};

export default Index;
