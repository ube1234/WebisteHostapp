import React, { useState } from 'react';
import '../styles/Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>WebDev Pro</h1>
          </div>
          <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#home">Home</a>
            <a href="#offer">Offer</a>
            <a href="#portfolio">Demos</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
