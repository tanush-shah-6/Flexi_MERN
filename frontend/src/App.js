// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Home/Hero';
import FeatureSection from './components/Home/Features';
import Footer from './components/Footer/Footer';
import Tools from './pages/Tools'; // Import the Tools page
import 'font-awesome/css/font-awesome.min.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero />
                            <FeatureSection />
                        </>
                    } />
                    <Route path="/tools" element={<Tools />} /> {/* Route for the Tools page */}
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
