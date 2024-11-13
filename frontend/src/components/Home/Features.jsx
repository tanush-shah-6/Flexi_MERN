import React from 'react';
import './Features.css';
import Carousel from 'react-multi-carousel'; 
import 'react-multi-carousel/lib/styles.css';


const FeatureSection = () => {
  const carouselItems = [
    { id: 1, src: `${process.env.PUBLIC_URL}/images/quiz.png`, label: 'Quizzes' },
    { id: 2, src: `${process.env.PUBLIC_URL}/images/flashcards.png`, label: 'Flashcards' },
    { id: 3, src: `${process.env.PUBLIC_URL}/images/createroom.png`, label: 'Study Rooms' },
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="feature-section">
      <div className="feature-carousel">
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
          {carouselItems.map((item) => (
            <div key={item.id} className="carousel-item">
              <img src={item.src} alt={item.label} />
              <p>{item.label}</p>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="feature-details">
        <h2>Boost Your Learning with StudySpark AI</h2>
        <p>Achieve academic excellence with StudySpark, your all-in-one AI learning companion.</p>
        <ul>
          <li>
            <h3>AI Models</h3>
            <p>Access models like ChatGPT and Gemini for comprehensive support.</p>
          </li>
          <li>
            <h3>Study Tools</h3>
            <p>Generate Flashcards or Quizzes on a desired topic to aid you further in your learning journey.</p>
          </li>
          <li>
            <h3>Collaborative Learning</h3>
            <p>Create or Join Study Rooms and Chat with other learners!</p>
          </li>
          <li>
            <h3>24/7 AI ChatBot</h3>
            <p>Round-the-clock AI assistance for your study needs.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureSection;
