import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path='/' component={Index} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;