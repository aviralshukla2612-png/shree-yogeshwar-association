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
      <div className="recent-expenses">
        <div className="recent-expenses-loading" role="status" aria-live="polite">
          <div className="recent-expenses-spinner" aria-hidden="true" />
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="recent-expenses">
        <div className="recent-expenses-empty">
          <span className="recent-expenses-empty-icon" aria-hidden="true">₹</span>
          <p>No expense records</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-expenses">
      <table className="recent-expenses-table">
        <caption className="recent-expenses-caption">Recent expense records</caption>
        <thead>
          <tr>
            <th>Category</th>
            <th className="recent-expenses-amount-header">Amount</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td data-label="Category">
                <span
                  className="recent-category-badge"
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                >
                  {item.category}
                </span>
              </td>
              <td className="recent-amount" data-label="Amount">
                ₹{Number(item.amount).toLocaleString()}
              </td>
              <td data-label="Date">{item.date}</td>
              <td className="recent-description" data-label="Description">
                {item.description || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentExpenses;
