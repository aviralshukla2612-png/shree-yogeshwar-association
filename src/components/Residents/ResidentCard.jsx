import React, { useState } from 'react';
import './ResidentCard.css';

const ResidentCard = ({ resident }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'overdue': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <>
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          {resident.name.charAt(0).toUpperCase()}
        </div>
        <div className="resident-name">
          <h4>{resident.name}</h4>
          <span className="resident-flat">Flat: {resident.flat}</span>
        </div>
      </div>
      <div className="resident-card-body">
        <div className="resident-info">
          <span className="info-label">Phone:</span>
          <span className="info-value">{resident.phone}</span>
        </div>
        <div className="resident-info">
          <span className="info-label">Status:</span>
          <span 
            className="resident-status"
            style={{ backgroundColor: getStatusColor(resident.maintenanceStatus) }}
          >
            {resident.maintenanceStatus}
          </span>
        </div>
      </div>
      <div className="resident-card-footer">
        <button className="resident-action-btn" onClick={() => setShowDetails(true)}>View Details</button>
        <button className="resident-action-btn secondary" onClick={() => alert(`Reminder sent to ${resident.name}`)}>Send Reminder</button>
      </div>
    </div>

    {showDetails && (
      <div className="resident-detail-overlay" onClick={() => setShowDetails(false)}>
        <div className="resident-detail-modal" onClick={(event) => event.stopPropagation()}>
          <button className="resident-detail-close" onClick={() => setShowDetails(false)}>×</button>
          <div className="resident-detail-header">
            <div className="resident-avatar large">
              {resident.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>{resident.name}</h3>
              <span>Flat {resident.flat}</span>
            </div>
          </div>

          <div className="resident-detail-grid">
            <div>
              <small>Phone</small>
              <strong>{resident.phone}</strong>
            </div>
            <div>
              <small>Maintenance</small>
              <span
                className="resident-status"
                style={{ backgroundColor: getStatusColor(resident.maintenanceStatus) }}
              >
                {resident.maintenanceStatus}
              </span>
            </div>
            <div>
              <small>Wing</small>
              <strong>{resident.flat?.charAt(0) || '-'}</strong>
            </div>
            <div>
              <small>Last Reminder</small>
              <strong>Not sent</strong>
            </div>
          </div>

          <div className="resident-detail-actions">
            <button className="resident-action-btn secondary" onClick={() => setShowDetails(false)}>
              Close
            </button>
            <button className="resident-action-btn" onClick={() => alert(`Reminder sent to ${resident.name}`)}>
              Send Reminder
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ResidentCard;
