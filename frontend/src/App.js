import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Home/Hero';
import FeatureSection from './components/Home/Features';
import Footer from './components/Footer/Footer';
import Tools from './pages/Tools';
import Login from './pages/Login';
import Register from './pages/Register';
import Subjects from './pages/Subjects';
import 'font-awesome/css/font-awesome.min.css';

const App = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<><Hero /><FeatureSection /></>} />
                    <Route path="/tools" element={isAuthenticated ? <Tools /> : <Navigate to="/login" />} />
                    <Route path="#subjects" element={isAuthenticated ? <Subjects /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
