import React, { useState } from 'react';
import './Quiz.css';

const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Rome", "Berlin"],
        answer: "Paris",
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4",
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
    },
    {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
        answer: "Blue Whale",
    },
];

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswer = (option) => {
        setSelectedAnswer(option);
        setShowAnswer(true);
        if (option === quizData[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        setSelectedAnswer(null);
        setShowAnswer(false);
        setCurrentQuestion(currentQuestion + 1);
    };

    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowAnswer(false);
    };

    return (
        <div className="quiz">
            {currentQuestion < quizData.length ? (
                <>
                    <h2>
                        <i className="fas fa-question-circle"></i> {quizData[currentQuestion].question}
                    </h2>
                    <div className="options">
                        {quizData[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-button ${
                                    showAnswer
                                        ? option === quizData[currentQuestion].answer
                                            ? "correct"
                                            : selectedAnswer === option
                                            ? "incorrect"
                                            : ""
                                        : ""
                                }`}
                                onClick={() => handleAnswer(option)}
                                disabled={showAnswer}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {showAnswer && (
                        <div className="feedback">
                            {selectedAnswer === quizData[currentQuestion].answer ? (
                                <p className="correct-text">
                                    <i className="fas fa-check-circle"></i> Correct!
                                </p>
                            ) : (
                                <p className="incorrect-text">
                                    <i className="fas fa-times-circle"></i> Incorrect. The correct answer is "{quizData[currentQuestion].answer}".
                                </p>
                            )}
                        </div>
                    )}
                    <button className="next-button" onClick={nextQuestion} disabled={!showAnswer}>
                        Next Question <i className="fas fa-arrow-right"></i>
                    </button>
                </>
            ) : (
                <div className="quiz-end">
                    <h2>Quiz Completed!</h2>
                    <p>Your Score: {score} / {quizData.length}</p>
                    <button className="restart-button" onClick={restartQuiz}>
                        Restart Quiz <i className="fas fa-redo-alt"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
