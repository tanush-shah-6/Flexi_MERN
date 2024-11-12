import React from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register'); 
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Study smarter with StudySpark AI!</h1>
        <h2>Get instant answers, flashcards, quizzes, and join study rooms to connect with learners worldwide.</h2>
        
          <span>100% free!</span>
            
        <button className="cta-button" onClick={handleRegister}>Start Studying</button>
        
      </div>
    </section>
  );
};

export default Hero;
