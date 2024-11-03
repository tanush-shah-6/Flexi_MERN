// src/App.js
import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Home/Hero';
import Footer from './components/Footer/Footer';
import FeatureSection from './components/Home/Features';


const App = () => {
    return (
        <div className="App">
            <Header />
            <Hero />
            <FeatureSection />
            <Footer />
        </div>
    );
};

export default App;
