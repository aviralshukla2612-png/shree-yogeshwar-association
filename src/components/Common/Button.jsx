import React from 'react';
import './Common.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;