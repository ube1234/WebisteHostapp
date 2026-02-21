import React from 'react';
import '../styles/Hero.css';
import RazorpayButton from './RazorpayButton';

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content container">
        <div>
          <h1>🚀 Get Your Business Online — Zero Development Cost</h1>
          <p>We provide <strong>professional websites for all business needs</strong> — fast, modern, and affordable.</p>
          <div className="hero-buttons">
            <a href="https://wa.me/9087123723" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Contact Now</a>
            <a href="#offer" className="btn btn-secondary">See Offer</a>
            {/* -   <RazorpayButton>Pay ₹399</RazorpayButton> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
