import React from 'react';
import './SplashScreen.css';
import logo from './KAI_ROOMS_logo.png'; // Logo baru

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src={logo} alt="KAI_ROOMS_logo" className="logo" />
      <h1>KAI ROOMS</h1>
      <p>Optimizing Collaboration, Enhancing Productivity</p>
    </div>
  );
}

export default SplashScreen;
