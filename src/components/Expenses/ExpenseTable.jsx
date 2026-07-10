import React, { useState, useMemo } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilePdf, 
  FaFileExcel, 
  FaPrint,
  FaBuilding,
  FaBolt,
  FaUsers,
  FaWrench,
  FaBox,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaSave,
  FaTimes,
  FaCreditCard,
  FaUserCheck
} from 'react-icons/fa';
import AddExpenseModal from './AddExpenseModal';
import { exportExpensePDF, exportExpenseExcel } from '../../utils/exportUtils';
import './ExpenseTable.css';

const ExpenseTable = ({ data, onAdd, onUpdate, onDelete, loading }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const categories = ['all', ...new Set(data.map(item => item.category))];

  const months = useMemo(() => {
    const monthSet = new Set();
    data.forEach(item => {
      if (item.date) {
        const date = new Date(item.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        monthSet.add(monthYear);
      }
    });
    return ['all', ...Array.from(monthSet)];
  }, [data]);

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

  const getPaymentMethod = (id) => {
    const methods = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'];
    return methods[id % methods.length];
  };

  const getApprovedBy = (id) => {
    const names = ['Rajesh Kumar', 'Suresh Patel', 'Amit Singh', 'Priya Sharma'];
    return names[id % names.length];
  };

  const filteredData = useMemo(() => {
    let result = data;
    if (searchTerm) {
      result = result.filter(item =>
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    if (monthFilter !== 'all') {
      result = result.filter(item => {
        if (!item.date) return false;
        const date = new Date(item.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        return monthYear === monthFilter;
      });
    }
    result = [...result].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'amount') { aVal = Number(aVal); bVal = Number(bVal); }
      else if (sortField === 'date') { aVal = new Date(aVal); bVal = new Date(bVal); }
      else { aVal = String(aVal || '').toLowerCase(); bVal = String(bVal || '').toLowerCase(); }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [data, searchTerm, categoryFilter, monthFilter, sortField, sortDirection]);

  const summaryStats = useMemo(() => {
    const total = filteredData.reduce((sum, item) => sum + Number(item.amount), 0);
    const now = new Date();
    const thisMonth = filteredData.filter(item => {
      if (!item.date) return false;
      const date = new Date(item.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const thisMonthTotal = thisMonth.reduce((sum, item) => sum + Number(item.amount), 0);
    const categoryTotals = {};
    filteredData.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + Number(item.amount);
    });
    let highestCategory = 'N/A';
    let highestAmount = 0;
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > highestAmount) { highestAmount = amount; highestCategory = category; }
    });
    return { total, thisMonth: thisMonthTotal, highestCategory, transactions: filteredData.length };
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const startEdit = (item) => { setEditingId(item.id); setEditData(item); };
  const saveEdit = () => { onUpdate(editingId, editData); setEditingId(null); setEditData({}); };
  const cancelEdit = () => { setEditingId(null); setEditData({}); };
  const handleAddExpense = (newExpense) => onAdd(newExpense);
  const handleDeleteExpense = (id) => onDelete(id);
  const handleExport = (type) => {
    if (type === 'PDF') { exportExpensePDF(filteredData); return; }
    if (type === 'Excel') { exportExpenseExcel(filteredData); return; }
    window.print();
  };

  const isHighExpense = (amount) => {
    const sorted = [...filteredData].sort((a, b) => Number(b.amount) - Number(a.amount));
    const threshold = sorted.length > 0 ? Number(sorted[Math.floor(sorted.length * 0.2)]?.amount || 0) : 0;
    return Number(amount) >= threshold && threshold > 0;
  };

  return (
    <div className="expense-table-container">
      {/* Header */}
      <div className="expense-header">
        <h2><FaMoneyBillWave /> Expense Management</h2>
        <div className="expense-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select className="filter-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="all">All Months</option>
            {months.filter(m => m !== 'all').map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <button className="add-expense-btn" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Expense
          </button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="expense-stats-compact">
        <div className="stat-item">
          <FaMoneyBillWave className="stat-icon-compact" />
          <div>
            <span className="stat-value-compact">₹{summaryStats.total.toLocaleString()}</span>
            <span className="stat-label-compact">Total Expenses</span>
          </div>
        </div>
        <div className="stat-item">
          <FaCalendarAlt className="stat-icon-compact" />
          <div>
            <span className="stat-value-compact">₹{summaryStats.thisMonth.toLocaleString()}</span>
            <span className="stat-label-compact">This Month</span>
          </div>
        </div>
        <div className="stat-item">
          <FaBuilding className="stat-icon-compact" />
          <div>
            <span className="stat-value-compact">{summaryStats.highestCategory}</span>
            <span className="stat-label-compact">Highest Category</span>
          </div>
        </div>
        <div className="stat-item">
          <FaBox className="stat-icon-compact" />
          <div>
            <span className="stat-value-compact">{summaryStats.transactions}</span>
            <span className="stat-label-compact">Transactions</span>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="expense-actions">
        <button className="export-btn pdf" onClick={() => handleExport('PDF')}><FaFilePdf /> PDF</button>
        <button className="export-btn excel" onClick={() => handleExport('Excel')}><FaFileExcel /> Excel</button>
        <button className="export-btn print" onClick={() => window.print()}><FaPrint /> Print</button>
        <span className="record-count">{paginatedData.length} of {filteredData.length} records</span>
      </div>

      {/* Desktop Table */}
      <div className="table-wrapper desktop-view">
        {loading ? (
          <div className="loading-state"><div className="spinner" /><p>Loading expenses...</p></div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <FaMoneyBillWave className="empty-icon" />
            <p>No expenses found</p>
            <small>Add your first expense</small>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('category')} className="sortable">Category {getSortIcon('category')}</th>
                <th onClick={() => handleSort('amount')} className="sortable amount-header">Amount {getSortIcon('amount')}</th>
                <th onClick={() => handleSort('date')} className="sortable">Date {getSortIcon('date')}</th>
                <th>Payment</th>
                <th>Approved</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((expense) => (
                <tr key={expense.id} className={editingId === expense.id ? 'editing' : ''}>
                  <td data-label="Category">
                    {editingId === expense.id ? (
                      <select className="edit-select" value={editData.category || ''} onChange={(e) => setEditData({...editData, category: e.target.value})}>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Staff Salary">Staff Salary</option>
                        <option value="Repairs">Repairs</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span className="category-badge" style={{ backgroundColor: getCategoryColor(expense.category) }}>
                        {getCategoryIcon(expense.category)} {expense.category}
                      </span>
                    )}
                  </td>
                  <td className="amount-cell" data-label="Amount">
                    {editingId === expense.id ? (
                      <input type="number" className="edit-input" value={editData.amount || ''} onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})} />
                    ) : (
                      <div className="amount-wrapper">
                        <span className={`amount-value ${isHighExpense(expense.amount) ? 'high' : ''}`}>₹{Number(expense.amount).toLocaleString()}</span>
                        {isHighExpense(expense.amount) && <span className="high-badge"><FaExclamationTriangle /> High</span>}
                      </div>
                    )}
                  </td>
                  <td data-label="Date">
                    {editingId === expense.id ? (
                      <input type="date" className="edit-input" value={editData.date || ''} onChange={(e) => setEditData({...editData, date: e.target.value})} />
                    ) : expense.date}
                  </td>
                  <td data-label="Payment"><span className="payment-method"><FaCreditCard /> {getPaymentMethod(expense.id)}</span></td>
                  <td data-label="Approved"><span className="approved-by"><FaUserCheck /> {getApprovedBy(expense.id)}</span></td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      {editingId === expense.id ? (
                        <>
                          <button className="action-btn save" onClick={saveEdit}><FaSave /> Save</button>
                          <button className="action-btn cancel" onClick={cancelEdit}><FaTimes /> Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn edit" onClick={() => startEdit(expense)}><FaEdit /> Edit</button>
                          <button className="action-btn delete" onClick={() => handleDeleteExpense(expense.id)}><FaTrash /> Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="expense-mobile-list mobile-view">
        {loading ? (
          <div className="loading-state"><div className="spinner" /><p>Loading expenses...</p></div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <FaMoneyBillWave className="empty-icon" />
            <p>No expenses found</p>
            <small>Add your first expense</small>
          </div>
        ) : (
          paginatedData.map((expense) => (
            <div key={expense.id} className="kv-card">
              <div className="kv-row">
                <span className="kv-label">Category</span>
                <span className="kv-value">
                  <span className="category-badge" style={{ backgroundColor: getCategoryColor(expense.category) }}>
                    {getCategoryIcon(expense.category)} {expense.category}
                  </span>
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Amount</span>
                <span className="kv-value kv-amount">₹{Number(expense.amount).toLocaleString()}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Date</span>
                <span className="kv-value">{expense.date}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Payment</span>
                <span className="kv-value">
                  <span className="payment-method"><FaCreditCard /> {getPaymentMethod(expense.id)}</span>
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Approved</span>
                <span className="kv-value">
                  <span className="approved-by"><FaUserCheck /> {getApprovedBy(expense.id)}</span>
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Description</span>
                <span className="kv-value kv-desc">{expense.description || '-'}</span>
              </div>
              <div className="kv-actions">
                <button className="action-btn edit" onClick={() => startEdit(expense)}><FaEdit /> Edit</button>
                <button className="action-btn delete" onClick={() => handleDeleteExpense(expense.id)}><FaTrash /> Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Edit Bottom Sheet */}
      {editingId && (
        <div className="mobile-edit-overlay" onClick={cancelEdit}>
          <div className="mobile-edit-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Expense</h3>
            <div className="mobile-edit-field">
              <label>Category</label>
              <select value={editData.category || ''} onChange={(e) => setEditData({...editData, category: e.target.value})}>
                <option value="Maintenance">Maintenance</option>
                <option value="Utilities">Utilities</option>
                <option value="Staff Salary">Staff Salary</option>
                <option value="Repairs">Repairs</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mobile-edit-field">
              <label>Amount</label>
              <input type="number" value={editData.amount || ''} onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})} />
            </div>
            <div className="mobile-edit-field">
              <label>Date</label>
              <input type="date" value={editData.date || ''} onChange={(e) => setEditData({...editData, date: e.target.value})} />
            </div>
            <div className="mobile-edit-actions">
              <button className="btn-save" onClick={saveEdit}><FaSave /> Save</button>
              <button className="btn-cancel" onClick={cancelEdit}><FaTimes /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Compact Pagination */}
      {filteredData.length > 0 && (
        <div className="pagination-compact">
          <span className="pagination-info">
            {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <div className="pagination-controls">
            <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`pagination-page ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <AddExpenseModal onClose={() => setShowModal(false)} onAdd={handleAddExpense} />
      )}
    </div>
  );
};

export default ExpenseTable;
