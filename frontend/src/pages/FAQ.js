import React, { useState } from 'react';
import './FAQ.css';
const faqData = [
    { question: "How do I use the flashcards?", answer: "Click 'the Flashcard to see the answer, and 'Next' to move to the next flashcard." },
    { question: "How is my quiz score calculated?", answer: "Your score is based on the number of correct answers." },
    { question: "Can I save my progress?", answer: "Currently, there is no save feature, but it may be added in the future." },
    { question: "How to attempt the Quiz?", answer: "The generated quiz has 4 options out of which only one is correct." },
    { question: "Can I reselect the options on my quiz?", answer: "No, the quiz is designed in such a way that the option you select will be considered as the final answer." }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <br />
            {faqData.map((faq, index) => (
                <div key={index} className="faq-item">
                    <p onClick={() => toggleAnswer(index)} className="faq-question">
                        {faq.question}
                    </p>
                    {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
                </div>
            ))}
        </div>
    );
};

export default FAQ;
