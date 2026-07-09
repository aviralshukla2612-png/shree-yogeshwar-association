import React, { useState } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaBuilding,
  FaBolt,
  FaUsers,
  FaWrench,
  FaBox
} from 'react-icons/fa';
import './ExpenseRow.css';

const ExpenseRow = ({ expense, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState(expense);

  const handleSave = () => {
    onEdit(expense.id, editedExpense);
    setIsEditing(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Maintenance': '#3498db',
      'Utilities': '#f39c12',
      'Staff Salary': '#9b59b6',
      'Repairs': '#e74c3c',
      'Other': '#95a5a6'
    };
    return colors[category] || '#95a5a6';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Maintenance': <FaBuilding />,
      'Utilities': <FaBolt />,
      'Staff Salary': <FaUsers />,
      'Repairs': <FaWrench />,
      'Other': <FaBox />
    };
    return icons[category] || <FaBox />;
  };

  return (
    <tr className={`expense-row ${isEditing ? 'editing' : ''}`}>
      <td data-label="Category">
        {isEditing ? (
          <select
            className="category-select"
            value={editedExpense.category}
            onChange={(e) => setEditedExpense({...editedExpense, category: e.target.value})}
          >
            <option value="Maintenance">Maintenance</option>
            <option value="Utilities">Utilities</option>
            <option value="Staff Salary">Staff Salary</option>
            <option value="Repairs">Repairs</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <span 
            className="category-badge"
            style={{ backgroundColor: getCategoryColor(expense.category) }}
          >
            {getCategoryIcon(expense.category)}
            {expense.category}
          </span>
        )}
      </td>
      <td className="amount-cell" data-label="Amount">
        {isEditing ? (
          <input
            type="number"
            className="edit-input amount-input"
            value={editedExpense.amount}
            onChange={(e) => setEditedExpense({...editedExpense, amount: parseFloat(e.target.value)})}
          />
        ) : (
          `₹${expense.amount.toLocaleString()}`
        )}
      </td>
      <td data-label="Date">
        {isEditing ? (
          <input
            type="date"
            className="edit-input date-input"
            value={editedExpense.date}
            onChange={(e) => setEditedExpense({...editedExpense, date: e.target.value})}
          />
        ) : (
          expense.date
        )}
      </td>
      <td className="description-cell" data-label="Description">
        {isEditing ? (
          <input
            type="text"
            className="edit-input description-input"
            value={editedExpense.description}
            onChange={(e) => setEditedExpense({...editedExpense, description: e.target.value})}
          />
        ) : (
          expense.description || '—'
        )}
      </td>
      <td data-label="Actions">
        <div className="action-buttons">
          {isEditing ? (
            <>
              <button className="action-btn save" onClick={handleSave} title="Save">
                <FaSave /> Save
              </button>
              <button className="action-btn cancel" onClick={() => setIsEditing(false)} title="Cancel">
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <>
              <button className="action-btn edit" onClick={() => setIsEditing(true)} title="Edit">
                <FaEdit />
              </button>
              <button className="action-btn delete" onClick={() => onDelete(expense.id)} title="Delete">
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ExpenseRow;