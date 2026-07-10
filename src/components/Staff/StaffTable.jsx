import React, { useState } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaShieldAlt,
  FaBroom,
  FaLeaf,
  FaLightbulb,
  FaWrench,
  FaUser,
  FaPhone,
  FaCreditCard,
  FaCashRegister,
  FaGooglePay,
  FaPhoneAlt,
  FaUniversity
} from 'react-icons/fa';
import AddStaffModal from './AddStaffModal';
import './StaffTable.css';

const StaffTable = ({ data, onAdd, onUpdate, onDelete, loading: _loading, showDialog }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const getRoleIcon = (role) => {
    const icons = {
      'Security': <FaShieldAlt />,
      'Cleaner': <FaBroom />,
      'Gardener': <FaLeaf />,
      'Electrician': <FaLightbulb />,
      'Plumber': <FaWrench />,
      'Other': <FaUser />
    };
    return icons[role] || <FaUser />;
  };

  const getRoleColor = (role) => {
    const colors = {
      'Security': '#3498db',
      'Cleaner': '#27ae60',
      'Gardener': '#2ecc71',
      'Electrician': '#f39c12',
      'Plumber': '#e74c3c',
      'Other': '#95a5a6'
    };
    return colors[role] || '#95a5a6';
  };

  const getPaymentModeIcon = (mode) => {
    const icons = {
      'cash': <FaCashRegister />,
      'gpay': <FaGooglePay />,
      'phonepay': <FaPhoneAlt />,
      'paytm': <FaCreditCard />,
      'bank': <FaUniversity />,
      'other': <FaCreditCard />
    };
    return icons[mode] || <FaCreditCard />;
  };

  const getPaymentModeLabel = (mode) => {
    const labels = {
      'cash': 'Cash',
      'gpay': 'GPay',
      'phonepay': 'PhonePe',
      'paytm': 'Paytm',
      'bank': 'Bank',
      'other': 'Other'
    };
    return labels[mode] || mode;
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const saveEdit = () => {
    if (editData.salary && parseFloat(editData.salary) <= 0) {
      showDialog('Salary must be greater than 0.', 'alert', 'Validation Error');
      return;
    }

    onUpdate(editingId, {
      ...editData,
      salary: parseFloat(editData.salary)
    });
    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Stats
  const totalSalary = data.reduce((sum, item) => sum + Number(item.salary), 0);

  return (
    <div className="staff-table-container">
      {/* Header */}
      <div className="staff-header">
        <h2><FaUsers /> Staff Management</h2>
        <div className="staff-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-staff-btn" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats - Compact */}
      <div className="staff-stats-compact">
        <div className="stat-item">
          <FaUsers className="stat-icon-compact" />
          <div>
            <span className="stat-value-compact">{data.length}</span>
            <span className="stat-label-compact">Total Staff</span>
          </div>
        </div>
        <div className="stat-item">
          <FaMoneyBillWave className="stat-icon-compact" />
          <div>
            <span className="stat-value-compact">₹{totalSalary.toLocaleString()}</span>
            <span className="stat-label-compact">Total Salary</span>
          </div>
        </div>
        <div className="stat-item">
          <FaChartBar className="stat-icon-compact" />
          <div>
            <span className="stat-value-compact">{data.length}</span>
            <span className="stat-label-compact">Active Staff</span>
          </div>
        </div>
      </div>

      {/* Staff Grid - Compact */}
      {filteredData.length === 0 ? (
        <div className="staff-empty-state">
          <FaUsers className="empty-icon" />
          <p>No staff members found</p>
          <button className="add-staff-btn" onClick={() => setShowModal(true)}>
            <FaPlus /> Add First Staff
          </button>
        </div>
      ) : (
        <div className="staff-grid-compact">
          {filteredData.map((staff) => (
            <div key={staff.id} className="staff-card-compact">
              <div className="staff-card-header-compact">
                <div className="staff-avatar-compact" style={{ backgroundColor: getRoleColor(staff.role) }}>
                  {getRoleIcon(staff.role)}
                </div>
                <div className="staff-info-compact">
                  {editingId === staff.id ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="edit-input name-input"
                      placeholder="Name"
                    />
                  ) : (
                    <span className="staff-name-compact">{staff.name}</span>
                  )}
                  <span className="staff-role-compact" style={{ color: getRoleColor(staff.role) }}>
                    {staff.role}
                  </span>
                </div>
                <span className="staff-role-badge-compact" style={{ backgroundColor: getRoleColor(staff.role) }}>
                  {staff.role}
                </span>
              </div>

              <div className="staff-card-body-compact">
                <div className="staff-details-compact">
                  <div className="detail-item-compact">
                    <FaPhone className="detail-icon" />
                    {editingId === staff.id ? (
                      <input
                        type="text"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="edit-input detail-input"
                        placeholder="Phone"
                      />
                    ) : (
                      <span>{staff.phone || '-'}</span>
                    )}
                  </div>

                  <div className="detail-item-compact">
                    <FaMoneyBillWave className="detail-icon" />
                    {editingId === staff.id ? (
                      <input
                        type="number"
                        min="0"
                        value={editData.salary || ''}
                        onChange={(e) => setEditData({...editData, salary: parseFloat(e.target.value)})}
                        className="edit-input detail-input"
                        placeholder="Salary"
                      />
                    ) : (
                      <span className="salary-text">₹{Number(staff.salary).toLocaleString()}</span>
                    )}
                  </div>

                  <div className="detail-item-compact">
                    <FaCreditCard className="detail-icon" />
                    {editingId === staff.id ? (
                      <select
                        value={editData.paymentMode || 'cash'}
                        onChange={(e) => setEditData({...editData, paymentMode: e.target.value})}
                        className="edit-input detail-input"
                      >
                        <option value="cash">Cash</option>
                        <option value="gpay">GPay</option>
                        <option value="phonepay">PhonePe</option>
                        <option value="paytm">Paytm</option>
                        <option value="bank">Bank</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <span className="payment-mode-compact">
                        {getPaymentModeIcon(staff.paymentMode || 'cash')}
                        {getPaymentModeLabel(staff.paymentMode || 'cash')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="staff-card-footer-compact">
                {editingId === staff.id ? (
                  <>
                    <button className="action-btn save-btn" onClick={saveEdit}>
                      <FaSave /> Save
                    </button>
                    <button className="action-btn cancel-btn" onClick={cancelEdit}>
                      <FaTimes /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="action-btn edit-btn" onClick={() => startEdit(staff)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="action-btn delete-btn" onClick={() => onDelete(staff.id)}>
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddStaffModal
          onClose={() => setShowModal(false)}
          onAdd={onAdd}
          showDialog={showDialog}
        />
      )}
    </div>
  );
};

export default StaffTable;
