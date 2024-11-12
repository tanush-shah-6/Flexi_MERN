import React, { useState } from 'react';
import Flashcards from './Flashcards';
import Quiz from './Quiz';
import FAQ from './FAQ';
import StudyMaterial from './StudyMaterial';
import './Tools.css';
import 'font-awesome/css/font-awesome.min.css';

const Tools = () => {
    const [activeTab, setActiveTab] = useState("flashcards");

    return (
        <div>
            <div className='header-row'>
                <h1>Study Tools</h1>
                <br />
                <div className="tab-buttons">
                    <button onClick={() => setActiveTab("flashcards")} className={activeTab === "flashcards" ? "active" : ""}>
                        Flashcards
                    </button>
                    <button onClick={() => setActiveTab("quiz")} className={activeTab === "quiz" ? "active" : ""}>
                        Quiz
                    </button>
                    <button onClick={() => setActiveTab("faq")} className={activeTab === "faq" ? "active" : ""}>
                        FAQ
                    </button>
                    <button onClick={() => setActiveTab("study-material")} className={activeTab === "study-material" ? "active" : ""}>
                        Study Material
                    </button>
                </div>
            </div>
            <div className="tab-content">
                {activeTab === "flashcards" && <Flashcards />}
                {activeTab === "quiz" && <Quiz />}
                {activeTab === "faq" && <FAQ />}
                {activeTab === "study-material" && <StudyMaterial />}
            </div>
        </div>
    );
};

export default Tools;
