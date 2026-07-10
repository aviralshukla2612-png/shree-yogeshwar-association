import React, { useState } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import './AddMaintenanceModal.css';

const AddMaintenanceModal = ({ onClose, onAdd, showDialog }) => {
  const [formData, setFormData] = useState({
    name: '',
    flatNo: '',
    amount: '',
    dueDate: '',
    status: 'pending',
    paymentMode: 'cash'
  });

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate date - prevent future dates
    const selectedDate = new Date(formData.dueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to midnight
    
    if (selectedDate > currentDate) {
      showDialog('Due date cannot be in the future. Please select today or a past date.', 'alert', 'Invalid Date');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      showDialog('Amount must be greater than 0.', 'alert', 'Invalid Amount');
      return;
    }

    onAdd(formData);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h2>Add Maintenance Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Resident Name *</label>
            <input
              type="text"
              required
              placeholder="Enter resident name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Flat No *</label>
            <input
              type="text"
              required
              placeholder="e.g., A-101"
              value={formData.flatNo}
              onChange={(e) => setFormData({...formData, flatNo: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Amount (INR) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Due Date *</label>
            <input
              type="date"
              required
              max={today} // Prevents future dates
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
            <small className="date-hint">Future dates are not allowed.</small>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="form-group">
            <label>Payment Mode</label>
            <select
              value={formData.paymentMode}
              onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
            >
              <option value="cash">Cash</option>
              <option value="gpay">Google Pay</option>
              <option value="phonepay">PhonePe</option>
              <option value="paytm">Paytm</option>
              <option value="bank">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Record
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddMaintenanceModal;
