import React from 'react';
import './RecentExpenses.css';

const CATEGORY_COLORS = {
  Maintenance: '#3498db',
  Utilities: '#f39c12',
  'Staff Salary': '#9b59b6',
  Repairs: '#e74c3c',
  Other: '#95a5a6'
};

const RecentExpenses = ({ data, loading }) => {
  const getCategoryColor = (category) => CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  if (loading) {
    return (
      <div className="re-list">
        <div className="re-state"><div className="re-spinner" /><p>Loading...</p></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="re-list">
        <div className="re-state"><p>No expense records</p></div>
      </div>
    );
  }

  return (
    <div className="re-list">
      {data.map((item) => (
        <div key={item.id} className="re-card">
          <div className="re-row">
            <span className="re-label">Category</span>
            <span className="re-value">
              <span
                className="re-badge"
                style={{ backgroundColor: getCategoryColor(item.category) }}
              >
                {item.category}
              </span>
            </span>
          </div>
          <div className="re-row">
            <span className="re-label">Amount</span>
            <span className="re-value re-amount">₹{Number(item.amount).toLocaleString()}</span>
          </div>
          <div className="re-row">
            <span className="re-label">Date</span>
            <span className="re-value">{item.date}</span>
          </div>
          <div className="re-row">
            <span className="re-label">Description</span>
            <span className="re-value re-desc">{item.description || '-'}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentExpenses;
