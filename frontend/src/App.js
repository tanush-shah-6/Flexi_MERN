import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Home/Hero';
import FeatureSection from './components/Home/Features';
import Footer from './components/Footer/Footer';
import Tools from './pages/Tools';
import Login from './pages/Login';
import Register from './pages/Register';
import Subjects from './pages/Subjects';
import StudyRoom from './pages/StudyRoom';
import 'font-awesome/css/font-awesome.min.css';
import ChatRoom from './components/StudyRoom/ChatRoom';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Check for token when the component mounts
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setAuthChecked(true); // Mark authentication check as complete
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // Show loading state while checking authentication
    if (!authChecked) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<><Hero /><FeatureSection /></>} />
                    <Route path="/tools" element={isAuthenticated ? <Tools /> : <Navigate to="/login" state={{ from: '/tools' }} />} />
                    <Route path="/subjects" element={isAuthenticated ? <Subjects /> : <Navigate to="/login" state={{ from: '/subjects' }} />} />
                    <Route path="/studyrooms" element={isAuthenticated ? <StudyRoom /> : <Navigate to="/login" state={{ from: '/studyrooms' }} />} />
                    <Route path="/login" element={<Login setIsAuthenticated={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/chat-room/:roomId" element={isAuthenticated ? <ChatRoom /> : <Navigate to="/login" state={{ from: window.location.pathname }} />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
