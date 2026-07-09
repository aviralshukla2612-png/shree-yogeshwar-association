import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch(type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton skeleton-icon" />
            <div className="skeleton-content">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-value" />
              <div className="skeleton skeleton-subtitle" />
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton skeleton-header" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-row">
                <div className="skeleton skeleton-cell" />
                <div className="skeleton skeleton-cell" />
                <div className="skeleton skeleton-cell" />
                <div className="skeleton skeleton-cell" />
              </div>
            ))}
          </div>
        );
      case 'chart':
        return (
          <div className="skeleton-chart">
            <div className="skeleton skeleton-chart-title" />
            <div className="skeleton skeleton-chart-body" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="skeleton-wrapper">
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;