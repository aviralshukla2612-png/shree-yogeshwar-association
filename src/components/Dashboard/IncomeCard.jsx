import React from 'react';
import './IncomeCard.css';

const IncomeCard = ({ data }) => {
  const { total, monthly, trend, sourceBreakdown } = data;

  return (
    <div className="income-card">
      <div className="income-card-header">
        <div className="income-icon">💰</div>
        <div className="income-title">
          <h3>Income</h3>
          <span className="income-trend trend-up">
            ↑ {trend}% from last month
          </span>
        </div>
      </div>
      <div className="income-card-body">
        <div className="income-total">
          <span className="income-label">Total Income</span>
          <span className="income-amount">₹{total.toLocaleString()}</span>
        </div>
        <div className="income-monthly">
          <span className="income-label">This Month</span>
          <span className="income-amount">₹{monthly.toLocaleString()}</span>
        </div>
      </div>
      <div className="income-card-footer">
        <div className="income-breakdown">
          {sourceBreakdown.map((source, index) => (
            <div key={index} className="breakdown-item">
              <span className="breakdown-label">{source.name}</span>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill"
                  style={{ 
                    width: `${source.percentage}%`,
                    backgroundColor: source.color
                  }}
                />
              </div>
              <span className="breakdown-value">{source.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncomeCard;