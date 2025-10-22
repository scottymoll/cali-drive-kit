import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path='/' component={Index} />
        <Route path='*' component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;