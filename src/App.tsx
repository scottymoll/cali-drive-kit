import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Index />
      </main>
      <Footer />
    </div>
  );
};

export default App;