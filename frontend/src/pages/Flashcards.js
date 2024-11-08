import React, { useState } from 'react';
import './Flashcards.css';
import 'font-awesome/css/font-awesome.min.css';

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

    const nextCard = () => {
        setFlipped(false);
        setCurrentCard((prevCard) => (prevCard + 1) % flashcardData.length);
    };

    const prevCard = () => {
        setFlipped(false);
        setCurrentCard((prevCard) => (prevCard - 1 + flashcardData.length) % flashcardData.length);
    };

    const flipCard = () => {
        setFlipped(!flipped);
    };

    return (
        <div className="flashcards">
            <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={flipCard}>
                <div className="flashcard-front">
                    <p className="flashcard-text">{flashcardData[currentCard].question}</p>
                </div>
                <div className="flashcard-back">
                    <p className="flashcard-text">{flashcardData[currentCard].answer}</p>
                </div>
            </div>
            <p className="flip-tip">Click to flip</p>
            <div className="flashcard-controls">
                <button
                    className="control-button control-button-left"
                    onClick={prevCard}
                    title="Previous"
                >
                    <i className="fas fa-arrow-left"></i> {/* Font Awesome left arrow */}
                </button>
                <span className="progress">
                    Card {currentCard + 1} of {flashcardData.length}
                </span>
                <button
                    className="control-button control-button-right"
                    onClick={nextCard}
                    title="Next"
                >
                    <i className="fas fa-arrow-right"></i> {/* Font Awesome right arrow */}
                </button>
            </div>
        </div>
    );
};

export default Flashcards;
