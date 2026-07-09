import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCheck, FaClock, FaExclamationTriangle, FaSave, FaTimes, FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
import AddMaintenanceModal from './AddMaintenanceModal';
import { exportMaintenancePDF, exportMaintenanceExcel } from '../../utils/exportUtils';
import './MaintenanceTable.css';

const MaintenanceTable = ({ data, onAdd, onUpdate, onDelete, loading: _loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.flatNo.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const startEdit = (item) => { setEditingId(item.id); setEditData(item); };

  const saveEdit = () => {
    if (editData.dueDate) {
      const selectedDate = new Date(editData.dueDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (selectedDate > currentDate) { alert('Due date cannot be in the future.'); return; }
    }
    if (editData.amount && parseFloat(editData.amount) <= 0) { alert('Amount must be greater than 0.'); return; }
    onUpdate(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => { setEditingId(null); setEditData({}); };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'overdue': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <FaCheck />;
      case 'pending': return <FaClock />;
      case 'overdue': return <FaExclamationTriangle />;
      default: return <FaClock />;
    }
  };

  const getPaymentModeLabel = (mode) => {
    switch(mode) {
      case 'gpay': return 'Google Pay';
      case 'phonepay': return 'PhonePe';
      case 'paytm': return 'Paytm';
      case 'bank': return 'Bank Transfer';
      case 'cash': return 'Cash';
      case 'other': return 'Other';
      default: return 'Cash';
    }
  };

  return (
    <div className="maintenance-table-container">
      <div className="table-header">
        <h2>Maintenance Collection</h2>
        <div className="table-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search resident..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Maintenance
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="maintenance-export-actions">
        <button className="export-btn pdf" onClick={() => exportMaintenancePDF(filteredData)}><FaFilePdf /> PDF</button>
        <button className="export-btn excel" onClick={() => exportMaintenanceExcel(filteredData)}><FaFileExcel /> Excel</button>
        <button className="export-btn print" onClick={() => window.print()}><FaPrint /> Print</button>
        <span className="record-count">{filteredData.length} records</span>
      </div>

      {/* Desktop Table */}
      <div className="table-wrapper desktop-view">
        <table>
          <thead>
            <tr>
              <th>Resident Name</th>
              <th>Flat No</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Payment Mode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  <div className="empty-state-content">
                    <FaExclamationTriangle className="empty-state-icon" />
                    <p>No maintenance records found</p>
                    <button className="add-btn" onClick={() => setShowModal(true)}><FaPlus /> Add First Record</button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className={editingId === item.id ? 'editing' : ''}>
                  <td data-label="Resident">
                    {editingId === item.id ? (
                      <input type="text" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} className="edit-input" />
                    ) : item.name}
                  </td>
                  <td data-label="Flat No">
                    {editingId === item.id ? (
                      <input type="text" value={editData.flatNo || ''} onChange={(e) => setEditData({...editData, flatNo: e.target.value})} className="edit-input" />
                    ) : item.flatNo}
                  </td>
                  <td data-label="Amount">
                    {editingId === item.id ? (
                      <input type="number" min="1" value={editData.amount || ''} onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})} className="edit-input" />
                    ) : `₹${item.amount.toLocaleString()}`}
                  </td>
                  <td data-label="Due Date">
                    {editingId === item.id ? (
                      <input type="date" max={today} value={editData.dueDate || ''} onChange={(e) => setEditData({...editData, dueDate: e.target.value})} className="edit-input" />
                    ) : (
                      <span className={new Date(item.dueDate) < new Date() && item.status !== 'paid' ? 'overdue-date' : ''}>
                        {item.dueDate}
                        {new Date(item.dueDate) < new Date() && item.status !== 'paid' && (
                          <FaExclamationTriangle className="overdue-badge" title="Overdue" />
                        )}
                      </span>
                    )}
                  </td>
                  <td data-label="Status">
                    {editingId === item.id ? (
                      <select className="status-select" value={editData.status || 'pending'} onChange={(e) => setEditData({...editData, status: e.target.value})}>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${item.status}`} style={{ backgroundColor: getStatusColor(item.status) }}>
                        {getStatusIcon(item.status)} {item.status}
                      </span>
                    )}
                  </td>
                  <td data-label="Payment Mode">
                    {editingId === item.id ? (
                      <select className="payment-mode-select" value={editData.paymentMode || 'cash'} onChange={(e) => setEditData({...editData, paymentMode: e.target.value})}>
                        <option value="cash">Cash</option>
                        <option value="gpay">Google Pay</option>
                        <option value="phonepay">PhonePe</option>
                        <option value="paytm">Paytm</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <span className="payment-mode-badge">{getPaymentModeLabel(item.paymentMode || 'cash')}</span>
                    )}
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      {editingId === item.id ? (
                        <>
                          <button className="action-btn save" onClick={saveEdit}><FaSave /> Save</button>
                          <button className="action-btn cancel" onClick={cancelEdit}><FaTimes /> Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn edit" onClick={() => startEdit(item)}><FaEdit /> Edit</button>
                          <button className="action-btn delete" onClick={() => onDelete(item.id)}><FaTrash /> Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="maintenance-mobile-list mobile-view">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <FaExclamationTriangle className="empty-state-icon" />
              <p>No maintenance records found</p>
              <button className="add-btn" onClick={() => setShowModal(true)}><FaPlus /> Add First Record</button>
            </div>
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="maintenance-mobile-card">
              <div className="mobile-card-head">
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.flatNo}</span>
                </div>
                <span className={`status-badge ${item.status}`} style={{ backgroundColor: getStatusColor(item.status) }}>
                  {getStatusIcon(item.status)} {item.status}
                </span>
              </div>
              <div className="mobile-card-grid">
                <div><small>Amount</small><strong>₹{item.amount.toLocaleString()}</strong></div>
                <div><small>Due Date</small><strong>{item.dueDate}</strong></div>
                <div><small>Payment Mode</small><span className="payment-mode-badge">{getPaymentModeLabel(item.paymentMode || 'cash')}</span></div>
              </div>
              <div className="mobile-card-actions">
                <button className="action-btn edit" onClick={() => startEdit(item)}><FaEdit /> Edit</button>
                <button className="action-btn delete" onClick={() => onDelete(item.id)}><FaTrash /> Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Edit Bottom Sheet */}
      {editingId && (
        <div className="mobile-edit-overlay" onClick={cancelEdit}>
          <div className="mobile-edit-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Record</h3>
            <div className="mobile-edit-field">
              <label>Resident Name</label>
              <input type="text" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} />
            </div>
            <div className="mobile-edit-field">
              <label>Flat No</label>
              <input type="text" value={editData.flatNo || ''} onChange={(e) => setEditData({...editData, flatNo: e.target.value})} />
            </div>
            <div className="mobile-edit-field">
              <label>Amount</label>
              <input type="number" min="1" value={editData.amount || ''} onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})} />
            </div>
            <div className="mobile-edit-field">
              <label>Due Date</label>
              <input type="date" max={today} value={editData.dueDate || ''} onChange={(e) => setEditData({...editData, dueDate: e.target.value})} />
            </div>
            <div className="mobile-edit-field">
              <label>Status</label>
              <select value={editData.status || 'pending'} onChange={(e) => setEditData({...editData, status: e.target.value})}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="mobile-edit-field">
              <label>Payment Mode</label>
              <select value={editData.paymentMode || 'cash'} onChange={(e) => setEditData({...editData, paymentMode: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="gpay">Google Pay</option>
                <option value="phonepay">PhonePe</option>
                <option value="paytm">Paytm</option>
                <option value="bank">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mobile-edit-actions">
              <button className="btn-save" onClick={saveEdit}><FaSave /> Save</button>
              <button className="btn-cancel" onClick={cancelEdit}><FaTimes /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddMaintenanceModal onClose={() => setShowModal(false)} onAdd={onAdd} />
      )}
    </div>
  );
};

export default MaintenanceTable;
