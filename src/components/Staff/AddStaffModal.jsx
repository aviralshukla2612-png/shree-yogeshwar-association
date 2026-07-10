import React, { useState } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import './AddStaffModal.css';

const AddStaffModal = ({ onClose, onAdd, showDialog }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    salary: '',
    phone: '',
    paymentMode: 'cash'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showDialog('Please enter staff name', 'alert', 'Validation Error');
      return;
    }
    if (!formData.role) {
      showDialog('Please select a role', 'alert', 'Validation Error');
      return;
    }
    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      showDialog('Please enter a valid salary', 'alert', 'Validation Error');
      return;
    }

    onAdd({ ...formData, salary: parseFloat(formData.salary) });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h2>Add Staff Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" required placeholder="Enter staff name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Role *</label>
            <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="">Select Role</option>
              <option value="Security">Security</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Gardener">Gardener</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Salary (₹) *</label>
            <input type="number" required min="1" placeholder="Enter salary amount" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" placeholder="Enter phone number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Payment Mode</label>
            <select value={formData.paymentMode} onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}>
              <option value="cash">Cash</option>
              <option value="gpay">Google Pay</option>
              <option value="phonepay">PhonePe</option>
              <option value="paytm">Paytm</option>
              <option value="bank">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Add Staff</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddStaffModal;
