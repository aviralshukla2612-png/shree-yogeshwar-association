import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3500, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const titles = {
    success: 'Success!',
    error: 'Error!',
    warning: 'Warning!',
    info: 'Info'
  };

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-content">
        <div className="toast-icon-wrapper">
          <span className="toast-icon">{icons[type]}</span>
        </div>
        <div className="toast-body">
          <h4 className="toast-title">{titles[type]}</h4>
          <p className="toast-message">{message}</p>
        </div>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ 
            width: `${progress}%`,
            background: type === 'success' ? '#27ae60' :
                       type === 'error' ? '#e74c3c' :
                       type === 'warning' ? '#f39c12' : '#3498db'
          }}
        />
      </div>
    </div>
  );
};

export default Toast;