// src/pages/Tools.js
import React, { useState } from 'react';
import Flashcards from './Flashcards';
import Quiz from './Quiz';
import FAQ from './FAQ';
// src/pages/Tools.js
import './Tools.css';


const Tools = () => {
    const [activeTab, setActiveTab] = useState("flashcards");

    return (
        <div>
            <h1>Study Tools</h1>
            <div className="tab-buttons">
                <button onClick={() => setActiveTab("flashcards")}>Flashcards</button>
                <button onClick={() => setActiveTab("quiz")}>Quiz</button>
                <button onClick={() => setActiveTab("faq")}>FAQ</button>
            </div>
            <div className="tab-content">
                {activeTab === "flashcards" && <Flashcards />}
                {activeTab === "quiz" && <Quiz />}
                {activeTab === "faq" && <FAQ />}
            </div>
        </div>
    );
};

export default Tools;
