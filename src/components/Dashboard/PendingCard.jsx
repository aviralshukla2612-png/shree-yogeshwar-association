import React from 'react';
import './PendingCard.css';

const PendingCard = ({ data }) => {
  const { total, overdue, upcoming, list } = data;

  return (
    <div className="pending-card">
      <div className="pending-card-header">
        <div className="pending-icon">⏳</div>
        <div className="pending-title">
          <h3>Pending Payments</h3>
          <span className="pending-count">{total} pending</span>
        </div>
      </div>
      <div className="pending-card-body">
        <div className="pending-stats">
          <div className="stat-item">
            <span className="stat-label">Overdue</span>
            <span className="stat-value overdue">{overdue}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Upcoming</span>
            <span className="stat-value upcoming">{upcoming}</span>
          </div>
        </div>
        <div className="pending-list">
          {list.map((item, index) => (
            <div key={index} className="pending-item">
              <div className="pending-item-info">
                <span className="pending-name">{item.name}</span>
                <span className="pending-flat">{item.flat}</span>
              </div>
              <div className="pending-item-details">
                <span className="pending-amount">₹{item.amount}</span>
                <span className={`pending-date ${item.status}`}>
                  {item.status === 'overdue' ? '⚠️ ' : ''}{item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pending-card-footer">
        <button className="pending-action-btn">Send Reminders</button>
        <button className="pending-action-btn secondary">View All</button>
      </div>
    </div>
  );
};

export default PendingCard;