import React from 'react';
import './App.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Index } from './pages/Index';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Index />
      <Footer />
    </div>
  );
};

export default App;