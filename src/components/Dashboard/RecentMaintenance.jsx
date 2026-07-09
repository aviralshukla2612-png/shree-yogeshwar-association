import React from 'react';
import { FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import './RecentMaintenance.css';

const STATUS_COLORS = {
  paid: '#27ae60',
  pending: '#f39c12',
  overdue: '#e74c3c'
};

const STATUS_ICONS = {
  paid: <FaCheck />,
  pending: <FaClock />,
  overdue: <FaExclamationTriangle />
};

const RecentMaintenance = ({ data, loading }) => {
  const getStatusColor = (status) => STATUS_COLORS[status] || '#95a5a6';
  const getStatusIcon = (status) => STATUS_ICONS[status] || <FaClock />;

  if (loading) {
    return (
      <div className="recent-maintenance">
        <div className="recent-maintenance-loading" role="status" aria-live="polite">
          <div className="recent-maintenance-spinner" aria-hidden="true" />
          <p>Loading maintenance...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="recent-maintenance">
        <div className="recent-maintenance-empty">
          <span className="recent-maintenance-empty-icon" aria-hidden="true">M</span>
          <p>No maintenance records</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-maintenance">
      <table className="recent-maintenance-table">
        <caption className="recent-maintenance-caption">Recent maintenance records</caption>
        <thead>
          <tr>
            <th>Resident</th>
            <th>Flat</th>
            <th className="recent-maintenance-amount-header">Amount</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td data-label="Resident">{item.name}</td>
              <td data-label="Flat">{item.flatNo}</td>
              <td className="recent-maintenance-amount" data-label="Amount">
                ₹{Number(item.amount).toLocaleString()}
              </td>
              <td data-label="Due Date">{item.dueDate}</td>
              <td data-label="Status">
                <span
                  className={`recent-status-badge ${item.status}`}
                  style={{ backgroundColor: getStatusColor(item.status) }}
                >
                  {getStatusIcon(item.status)}
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentMaintenance;
