import React, { useState } from 'react';
import './MaintenanceRow.css';

const MaintenanceRow = ({ item, onStatusChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = () => {
    onStatusChange(item.id, editedItem.status);
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'overdue': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  return (
    <tr className={`maintenance-row ${isEditing ? 'editing' : ''}`}>
      <td>{item.name}</td>
      <td><span className="flat-badge">{item.flatNo}</span></td>
      <td className="amount-cell">₹{item.amount.toLocaleString()}</td>
      <td className={`due-date ${isOverdue(item.dueDate) && item.status !== 'paid' ? 'overdue' : ''}`}>
        {item.dueDate}
        {isOverdue(item.dueDate) && item.status !== 'paid' && (
          <span className="overdue-badge">Overdue!</span>
        )}
      </td>
      <td>
        {isEditing ? (
          <select
            className="status-select"
            value={editedItem.status}
            onChange={(e) => setEditedItem({...editedItem, status: e.target.value})}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        ) : (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status}
          </span>
        )}
      </td>
      <td>
        <div className="action-buttons">
          {isEditing ? (
            <>
              <button className="action-btn save" onClick={handleSave}>Save</button>
              <button className="action-btn cancel" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="action-btn edit" onClick={() => setIsEditing(true)}>✏️</button>
              <button className="action-btn delete" onClick={() => onDelete(item.id)}>🗑️</button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default MaintenanceRow;