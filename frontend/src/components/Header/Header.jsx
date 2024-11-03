// src/components/Header.js
import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">StudySpark</div>
            <nav className="nav">
                <a href="#home">Home</a>
                <a href="#tools">Study Tools</a>
                <a href="#subjects">Subjects</a>
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
