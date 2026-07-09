import React from 'react';
import './ExpenseCard.css';

const ExpenseCard = ({ data }) => {
  const { total, monthly, trend, categories } = data;

  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <div className="expense-icon">💸</div>
        <div className="expense-title">
          <h3>Expenses</h3>
          <span className={`expense-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </span>
        </div>
      </div>
      <div className="expense-card-body">
        <div className="expense-total">
          <span className="expense-label">Total Expenses</span>
          <span className="expense-amount">₹{total.toLocaleString()}</span>
        </div>
        <div className="expense-monthly">
          <span className="expense-label">This Month</span>
          <span className="expense-amount">₹{monthly.toLocaleString()}</span>
        </div>
      </div>
      <div className="expense-card-footer">
        <div className="expense-categories">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-amount">₹{category.amount.toLocaleString()}</span>
              </div>
              <div className="category-bar">
                <div 
                  className="category-fill"
                  style={{ 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;