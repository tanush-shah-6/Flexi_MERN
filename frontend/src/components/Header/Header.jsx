// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">StudySpark</div>
            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/tools">Study Tools</Link> {/* Link to Tools page */}
                <Link to="/subjects">Subjects</Link>
            </nav>
            <div className="search-bar">
                <input type="text" placeholder="Type or upload your homework question" />
                <span className="shortcut">Ctrl+/</span>
            </div>
            <button className="get-started">Get Started</button>
        </header>
    );
};

export default Header;
