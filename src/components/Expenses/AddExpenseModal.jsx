import React, { useState } from 'react';
import { 
  FaTimes, 
  FaPlus, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaComment,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBuilding
} from 'react-icons/fa';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import './AddExpenseModal.css';

const AddExpenseModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Validate amount
    if (!formData.amount) {
      newErrors.amount = 'Please enter an amount';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > currentDate) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <div className="modal-header">
          <h2><FaPlus /> Add New Expense</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaBuilding /> Category <span className="required">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select Category</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Utilities">Utilities</option>
              <option value="Staff Salary">Staff Salary</option>
              <option value="Repairs">Repairs</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>
              <FaMoneyBillWave /> Amount (INR) <span className="required">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              step="1"
              placeholder="Enter expense amount"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={errors.amount ? 'error' : ''}
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label>
              <FaCalendarAlt /> Date <span className="required">*</span>
            </label>
            <input
              type="date"
              required
              max={today}
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
            <small className="date-hint">
              <FaExclamationTriangle /> Future dates are not allowed.
            </small>
          </div>

          <div className="form-group">
            <label>
              <FaComment /> Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="3"
              placeholder="Enter expense description (optional)"
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              <FaTimes /> Cancel
            </Button>
            <Button type="submit" variant="primary">
              <FaCheckCircle /> Add Expense
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddExpenseModal;
