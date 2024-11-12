import React, { useState } from 'react';
import './Flashcards.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 

const Flashcards = () => {
    const [flashcardData, setFlashcardData] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [numQuestions, setNumQuestions] = useState(5); 
    const [topic, setTopic] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTopicChange = (event) => {
        setTopic(event.target.value);
    };

    const handleQuestionChange = (event) => {
        setNumQuestions(event.target.value);
    };

    const fetchTriviaData = async () => {
        if (!topic) {
            setError('Please enter a topic to generate trivia.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/generate-flashcard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, numQuestions }),
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const data = await response.json();
            setFlashcardData(data.flashcards); 
            setCurrentCard(0); 
        } catch (err) {
            console.error('Error fetching trivia data:', err);
            setError('Failed to load trivia data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
            <h2>Flashcard Generator</h2>
            <div className="controls">
                <label htmlFor="topic">Enter Topic:</label>
                <br /><br />
                <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={handleTopicChange}
                    placeholder="e.g., Science, Geography"
                    disabled={loading}
                />
            </div>

            <div className="controls">
                <label htmlFor="numQuestions">Number of questions:</label>
                <br /><br />
                <input
                    type="number"
                    id="numQuestions"
                    value={numQuestions}
                    min="1"
                    max="20"
                    onChange={handleQuestionChange}
                    disabled={loading}
                />
            </div>

            <div className="controls">
                <button
                    onClick={fetchTriviaData}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Trivia'}
                </button>
                <p>{error}</p>
            </div>

            {flashcardData.length > 0 ? (
                <div className='box'>
                    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={flipCard}>
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
                            <FaArrowLeft />
                        </button>
                        <span className="progress">
                            Card {currentCard + 1} of {flashcardData.length}
                        </span>
                        <button
                            className="control-button control-button-right"
                            onClick={nextCard}
                            title="Next"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            ) : (
                <p>No trivia data available</p>
            )}
        </div>
    );
};

export default Flashcards;
