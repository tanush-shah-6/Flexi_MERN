import React, { useState } from 'react';
import './Flashcards.css';

const flashcardData = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
    { question: "What is the square root of 64?", answer: "8" },
    { question: "What element does 'O' represent on the periodic table?", answer: "Oxygen" },
    { question: "What is the boiling point of water?", answer: "100°C" },
    { question: "What is the fastest land animal?", answer: "Cheetah" },
    { question: "What is 3 + 5?", answer: "8" },
    { question: "What is the capital of Japan?", answer: "Tokyo" },
    { question: "What is the largest mammal?", answer: "Blue Whale" },
    { question: "How many continents are there?", answer: "7" }
];

const Flashcards = () => {
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const flipCard = () => {
        if (isAnimating) return; // Prevent flipping while animating
        setIsAnimating(true);
        setFlipped(!flipped);
        setTimeout(() => {
            setIsAnimating(false); // Re-enable after animation
        }, 600); // Match this duration with your CSS transition time
    };

    const nextCard = () => {
        if (isAnimating) return; // Prevent card transition while animating
        setFlipped(false);
        setCurrentCard((prevCard) => (prevCard + 1) % flashcardData.length);
    };

    const prevCard = () => {
        if (isAnimating) return; // Prevent card transition while animating
        setFlipped(false);
        setCurrentCard((prevCard) => (prevCard - 1 + flashcardData.length) % flashcardData.length);
    };

    return (
        <div className="flashcards">
            <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={flipCard}>
                <div className="flashcard-front">
                    <p className="flashcard-text">{flashcardData[currentCard].question}</p>
                    <p className="flip-tip">Click to flip</p>
                </div>
                <div className="flashcard-back">
                    <p className="flashcard-text">{flashcardData[currentCard].answer}</p>
                    <p className="flip-tip">Click to flip back</p>
                </div>
            </div>
            <div className="flashcard-controls">
                <button className="control-button" onClick={prevCard} title="Previous">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <span className="progress">
                    Card {currentCard + 1} of {flashcardData.length}
                </span>
                <button className="control-button" onClick={nextCard} title="Next">
                    <i className="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );
};

export default Flashcards;
