import React, { useEffect, useState } from 'react';
import { FaBuilding } from 'react-icons/fa';
import './SplashScreen.css';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('LOADING');
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const fullText = 'SHREE YOGESHWAR ASSOCIATION';

  useEffect(() => {
    // Typing effect
    let charIndex = 0;
    let cursorInterval;

    const typeText = () => {
      if (charIndex <= fullText.length) {
        setTypedText(fullText.slice(0, charIndex));
        charIndex++;
        setTimeout(typeText, 100 + Math.random() * 50);
      } else {
        setIsTypingComplete(true);
      }
    };

    const typingTimeout = setTimeout(typeText, 500);

    // Cursor blink effect
    cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Update progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1.2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Loading dots animation
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setLoadingText('LOADING' + '.'.repeat(dotCount));
    }, 400);

    return () => {
      clearTimeout(typingTimeout);
      clearInterval(progressInterval);
      clearInterval(dotInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* Logo with Rotating Dotted Circle */}
        <div className="splash-logo-wrapper">
          <div className="splash-logo-ring">
            {/* Rotating Dotted Circle - Tyre Effect */}
            <svg className="splash-dotted-circle" viewBox="0 0 120 120">
              {/* Main rotating dotted circle - rotates 360° continuously */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeDasharray="6 8"
                className="splash-dotted-path"
              />
              {/* Second dotted circle - opposite rotation for tyre effect */}
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="rgba(212, 175, 55, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 10"
                className="splash-dotted-path-inner"
              />
              {/* Third dotted circle - same direction for depth */}
              <circle
                cx="60"
                cy="60"
                r="62"
                fill="none"
                stroke="rgba(212, 175, 55, 0.08)"
                strokeWidth="1"
                strokeDasharray="2 12"
                className="splash-dotted-path-outer"
              />
            </svg>
            
            {/* Building Logo */}
            <div className="splash-logo-icon">
              <FaBuilding />
            </div>
          </div>
        </div>

        {/* Title with Typing Effect */}
        <div className="splash-title-wrapper">
          <h1 className="splash-title">
            {typedText}
            <span className={`splash-cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
          </h1>
          <p className="splash-subtitle">Residential Welfare Association</p>
        </div>

        {/* Loading Text */}
        <div className="splash-loading-wrapper">
          <span className="splash-loading-text">{loadingText}</span>
        </div>

        {/* Progress Bar */}
        <div className="splash-progress-wrapper">
          <div className="splash-progress-bar">
            <div 
              className="splash-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;