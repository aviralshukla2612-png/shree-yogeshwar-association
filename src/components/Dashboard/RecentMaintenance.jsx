import React from 'react';
import { FaCheck, FaClock, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
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

const PAYMENT_LABELS = {
  gpay: 'Google Pay',
  phonepay: 'PhonePe',
  paytm: 'Paytm',
  bank: 'Bank Transfer',
  cash: 'Cash',
  other: 'Other'
};

const RecentMaintenance = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="rm-list">
        <div className="rm-state"><div className="rm-spinner" /><p>Loading...</p></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rm-list">
        <div className="rm-state"><p>No maintenance records</p></div>
      </div>
    );
  }

  return (
    <div className="rm-list">
      {data.map((item) => (
        <div key={item.id} className="rm-card">
          <div className="rm-row">
            <span className="rm-label">Resident</span>
            <span className="rm-value">{item.name}</span>
          </div>
          <div className="rm-row">
            <span className="rm-label">Flat</span>
            <span className="rm-value">{item.flatNo}</span>
          </div>
          <div className="rm-row">
            <span className="rm-label">Amount</span>
            <span className="rm-value rm-amount">₹{Number(item.amount).toLocaleString()}</span>
          </div>
          <div className="rm-row">
            <span className="rm-label">Payment</span>
            <span className="rm-value">
              <span className="rm-payment">
                <FaMoneyBillWave />
                {PAYMENT_LABELS[item.paymentMode] || 'Cash'}
              </span>
            </span>
          </div>
          <div className="rm-row">
            <span className="rm-label">Status</span>
            <span className="rm-value">
              <span
                className={`rm-status ${item.status}`}
                style={{ backgroundColor: STATUS_COLORS[item.status] || '#95a5a6' }}
              >
                {STATUS_ICONS[item.status] || <FaClock />}
                {item.status}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentMaintenance;
