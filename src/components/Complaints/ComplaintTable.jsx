import React, { useState } from 'react';
import { 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaClock, 
  FaExclamationTriangle, 
  FaCalendarAlt, 
  FaUserCheck,
  FaTimes,
  FaCheckCircle,
  FaPhone,
  FaHome,
  FaComment,
  FaPaperclip,
  FaCircle,
  FaUserCircle,
  FaHistory,
  FaBuilding,
  FaFileAlt,
  FaImage,
  FaFilePdf,
  FaArrowRight
} from 'react-icons/fa';
import './ComplaintTable.css';

const ComplaintTable = ({ data, onUpdate, loading: _loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'High': return <FaExclamationTriangle />;
      case 'Medium': return <FaClock />;
      case 'Low': return <FaCheck />;
      default: return <FaClock />;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return '#27ae60';
      case 'In Progress': return '#f39c12';
      case 'Pending': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <FaCheckCircle />;
      case 'In Progress': return <FaClock />;
      case 'Pending': return <FaExclamationTriangle />;
      default: return <FaClock />;
    }
  };

  // Get staff name based on priority
  const getAssignedStaff = (priority) => {
    const staff = {
      'High': { name: 'Rajesh Kumar', role: 'Senior Technician', phone: '+91 98765 43210' },
      'Medium': { name: 'Suresh Patel', role: 'Technician', phone: '+91 98765 43211' },
      'Low': { name: 'Amit Singh', role: 'Junior Technician', phone: '+91 98765 43212' }
    };
    return staff[priority] || { name: 'Unassigned', role: '', phone: '' };
  };

  // Get resident details
  const getResidentDetails = (residentName) => {
    const residents = {
      'John Doe': { phone: '+91 98765 12345', flat: 'A-302', tower: 'Tower A', floor: '3rd Floor' },
      'Jane Smith': { phone: '+91 98765 12346', flat: 'B-205', tower: 'Tower B', floor: '2nd Floor' },
      'Mike Johnson': { phone: '+91 98765 12347', flat: 'C-108', tower: 'Tower C', floor: '1st Floor' }
    };
    return residents[residentName] || { phone: 'N/A', flat: 'N/A', tower: 'N/A', floor: 'N/A' };
  };

  // Get complaint category
  const getComplaintCategory = (issue) => {
    const categories = {
      'Water leakage': 'Plumbing',
      'Power outage': 'Electrical',
      'Noise complaint': 'Noise',
      'Lift issue': 'Maintenance',
      'Pest control': 'Hygiene',
      'Parking issue': 'Security'
    };
    return categories[issue] || 'General';
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Plumbing': <FaFileAlt />,
      'Electrical': <FaFileAlt />,
      'Noise': <FaFileAlt />,
      'Maintenance': <FaFileAlt />,
      'Hygiene': <FaFileAlt />,
      'Security': <FaFileAlt />,
      'General': <FaFileAlt />
    };
    return icons[category] || <FaFileAlt />;
  };

  // Format date with time
  const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = d.getHours() % 12 || 12;
    return `${day} ${month} ${year} ${hours12}:${minutes} ${ampm}`;
  };

  // Format time only
  const formatTimeOnly = (date) => {
    const d = new Date(date);
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = d.getHours() % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
  };

  // Generate complaint ID
  const generateComplaintId = (id) => {
    return `CMP-${String(id).padStart(3, '0')}`;
  };

  // Get timeline for complaint
  const getTimeline = (_complaintId) => {
    return [
      {
        id: 1,
        action: 'Complaint Created',
        user: 'Resident',
        date: '2026-07-08T10:45:00',
        icon: <FaCircle style={{ color: '#27ae60' }} />
      },
      {
        id: 2,
        action: `Assigned to ${getAssignedStaff('High').name}`,
        user: 'System',
        date: '2026-07-08T11:10:00',
        icon: <FaUserCheck style={{ color: '#3498db' }} />
      },
      {
        id: 3,
        action: 'Status Changed to In Progress',
        user: 'Rajesh Kumar',
        date: '2026-07-08T14:30:00',
        icon: <FaClock style={{ color: '#f39c12' }} />
      }
    ];
  };

  // Get comments for complaint
  const getComments = (_complaintId) => {
    return [
      {
        id: 1,
        user: 'Rajesh Kumar',
        role: 'Senior Technician',
        text: 'Checked the leakage. Need plumber assistance.',
        date: '2026-07-08T14:35:00',
        avatar: 'RK'
      },
      {
        id: 2,
        user: 'John Doe',
        role: 'Resident',
        text: 'Leakage is becoming worse. Please send someone urgently.',
        date: '2026-07-08T12:15:00',
        avatar: 'JD'
      }
    ];
  };

  // Get attachments
  const getAttachments = (_complaintId) => {
    return [
      { name: 'leakage_photo.jpg', size: '2.4 MB', type: 'image', icon: <FaImage /> },
      { name: 'water_damage_report.pdf', size: '1.2 MB', type: 'pdf', icon: <FaFilePdf /> }
    ];
  };

  // Filter complaints
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      generateComplaintId(item.id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || getComplaintCategory(item.issue) === filterCategory;
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(data.map(item => getComplaintCategory(item.issue)))];

  // Stats
  const stats = {
    total: data.length,
    resolved: data.filter(item => item.status === 'Resolved').length,
    inProgress: data.filter(item => item.status === 'In Progress').length,
    pending: data.filter(item => item.status === 'Pending').length
  };

  // Handle status update
  const handleStatusUpdate = (id, newStatus) => {
    if (onUpdate) {
      onUpdate(id, newStatus);
    }
  };

  // Handle view details
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetails(true);
  };

  // Handle edit
  const handleEdit = (complaint) => {
    alert(`Edit complaint: ${generateComplaintId(complaint.id)}`);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      alert(`Complaint ${generateComplaintId(id)} deleted`);
    }
  };

  // Handle add comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      alert(`Comment added: ${newComment}`);
      setNewComment('');
    }
  };

  return (
    <div className="complaint-table-container">
      {/* Header */}
      <div className="complaint-header">
        <h2><FaExclamationTriangle /> Complaint Management</h2>
        <div className="complaint-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="complaint-stats">
        <div className="stat-card total">
          <FaFileAlt className="stat-icon" />
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
        </div>
        <div className="stat-card resolved">
          <FaCheckCircle className="stat-icon" />
          <div>
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card in-progress">
          <FaClock className="stat-icon" />
          <div>
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card pending">
          <FaExclamationTriangle className="stat-icon" />
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper desktop-view">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <FaCheckCircle className="empty-icon" />
            <p>No complaints found</p>
            <small>Everything looks good today!</small>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Resident</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((complaint) => (
                <tr 
                  key={complaint.id} 
                  className={`priority-${complaint.priority.toLowerCase()}`}
                  onClick={() => handleViewDetails(complaint)}
                >
                  <td data-label="ID">
                    <span className="complaint-id">{generateComplaintId(complaint.id)}</span>
                  </td>
                  <td data-label="Resident">
                    <div className="resident-info">
                      <span className="resident-avatar">
                        {complaint.resident.charAt(0).toUpperCase()}
                      </span>
                      <span className="resident-name">{complaint.resident}</span>
                    </div>
                  </td>
                  <td data-label="Issue">
                    <div className="issue-info">
                      <span className="issue-text">{complaint.issue}</span>
                    </div>
                  </td>
                  <td data-label="Category">
                    <span className="category-badge">
                      {getCategoryIcon(getComplaintCategory(complaint.issue))}
                      {getComplaintCategory(complaint.issue)}
                    </span>
                  </td>
                  <td data-label="Priority">
                    <span className="priority-badge-compact">
                      {getPriorityIcon(complaint.priority)} {complaint.priority}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(complaint.status) }}
                    >
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </span>
                  </td>
                  <td data-label="Assigned To">
                    <div className="assigned-info">
                      <FaUserCheck />
                      <span>{getAssignedStaff(complaint.priority).name}</span>
                    </div>
                  </td>
                  <td data-label="Submitted">
                    <div className="date-info">
                      <FaCalendarAlt />
                      <span>{formatDateTime('2026-07-08T10:45:00')}</span>
                    </div>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewDetails(complaint)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEdit(complaint)}
                        title="Edit"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(complaint.id)}
                        title="Delete"
                      >
                        <FaTrash /> Delete
                      </button>
                      <select
                        className="status-select"
                        value={complaint.status}
                        onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="complaint-mobile-list mobile-view">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <FaCheckCircle className="empty-icon" />
            <p>No complaints found</p>
            <small>Everything looks good today!</small>
          </div>
        ) : (
          filteredData.map((complaint) => (
            <div
              key={complaint.id}
              className={`complaint-mobile-card priority-${complaint.priority.toLowerCase()}`}
              onClick={() => handleViewDetails(complaint)}
            >
              <div className="mobile-card-head">
                <span className="complaint-id">{generateComplaintId(complaint.id)}</span>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(complaint.status) }}
                >
                  {getStatusIcon(complaint.status)}
                  {complaint.status}
                </span>
              </div>

              <div className="complaint-mobile-title">
                <div className="resident-info">
                  <span className="resident-avatar">
                    {complaint.resident.charAt(0).toUpperCase()}
                  </span>
                  <span className="resident-name">{complaint.resident}</span>
                </div>
                <strong>{complaint.issue}</strong>
              </div>

              <div className="mobile-card-grid">
                <div>
                  <small>Category</small>
                  <span className="category-badge">
                    {getCategoryIcon(getComplaintCategory(complaint.issue))}
                    {getComplaintCategory(complaint.issue)}
                  </span>
                </div>
                <div>
                  <small>Priority</small>
                  <span className="priority-badge-compact">
                    {getPriorityIcon(complaint.priority)} {complaint.priority}
                  </span>
                </div>
                <div>
                  <small>Assigned To</small>
                  <span className="assigned-info">
                    <FaUserCheck />
                    {getAssignedStaff(complaint.priority).name}
                  </span>
                </div>
                <div>
                  <small>Submitted</small>
                  <span className="date-info">
                    <FaCalendarAlt />
                    {formatDateTime('2026-07-08T10:45:00')}
                  </span>
                </div>
              </div>

              <div className="mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="action-btn view"
                  onClick={() => handleViewDetails(complaint)}
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => handleEdit(complaint)}
                  title="Edit"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(complaint.id)}
                  title="Delete"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal - FINAL ENTERPRISE EDITION */}
      {showDetails && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>
              <FaTimes />
            </button>
            
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="complaint-id-large">{generateComplaintId(selectedComplaint.id)}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(selectedComplaint.status) }}
                >
                  {getStatusIcon(selectedComplaint.status)}
                  {selectedComplaint.status}
                </span>
              </div>
              <div className="priority-badge-compact">
                {getPriorityIcon(selectedComplaint.priority)} {selectedComplaint.priority} Priority
              </div>
            </div>

            {/* Modal Body - Three Column Layout for Better Space Usage */}
            <div className="modal-body-final">
              {/* Left Column - Complaint Details */}
              <div className="modal-left-final">
                {/* Description Card */}
                <div className="detail-card description-card">
                  <label>Description</label>
                  <p>{selectedComplaint.issue}</p>
                  <div className="description-meta">
                    <span>Water is leaking continuously since yesterday evening.</span>
                    <span>Resident requests urgent repair.</span>
                  </div>
                </div>

                {/* Category & Location Card */}
                <div className="detail-card category-card">
                  <div className="category-row">
                    <div className="category-item">
                      <label>Category</label>
                      <span className="category-value">
                        {getCategoryIcon(getComplaintCategory(selectedComplaint.issue))}
                        {getComplaintCategory(selectedComplaint.issue)}
                      </span>
                    </div>
                    <div className="category-item">
                      <label>Location</label>
                      <span className="location-value">
                        <FaBuilding /> {getResidentDetails(selectedComplaint.resident).tower}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resident Info Card - Enhanced */}
                <div className="detail-card resident-card-final">
                  <label>Resident</label>
                  <div className="resident-detail-final">
                    <div className="resident-avatar-large">
                      {selectedComplaint.resident.charAt(0).toUpperCase()}
                    </div>
                    <div className="resident-detail-info-final">
                      <div className="resident-name-large">{selectedComplaint.resident}</div>
                      <div className="resident-address">
                        <span><FaBuilding /> {getResidentDetails(selectedComplaint.resident).tower}</span>
                        <span><FaHome /> Flat {getResidentDetails(selectedComplaint.resident).flat}</span>
                        <span>{getResidentDetails(selectedComplaint.resident).floor}</span>
                      </div>
                      <div className="resident-contact-final">
                        <span><FaPhone /> {getResidentDetails(selectedComplaint.resident).phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="detail-card attachments-card">
                  <label><FaPaperclip /> Attachments</label>
                  {getAttachments(selectedComplaint.id).length > 0 ? (
                    <div className="attachments-list">
                      {getAttachments(selectedComplaint.id).map((file, index) => (
                        <div key={index} className="attachment-item">
                          <span className="attachment-icon">{file.icon}</span>
                          <span className="attachment-name">{file.name}</span>
                          <span className="attachment-size">{file.size}</span>
                          <button className="attachment-download">
                            <FaArrowRight />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-attachments">
                      <FaPaperclip />
                      <span>No attachments uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Assignment, Timeline & Comments */}
              <div className="modal-right-final">
                {/* Assignment Card */}
                <div className="detail-card assignment-card">
                  <label>Assigned To</label>
                  <div className="assignment-info">
                    <FaUserCircle className="assignment-icon" />
                    <div>
                      <div className="assigned-name">{getAssignedStaff(selectedComplaint.priority).name}</div>
                      <div className="assigned-role">{getAssignedStaff(selectedComplaint.priority).role}</div>
                      <div className="assigned-phone">
                        <FaPhone /> {getAssignedStaff(selectedComplaint.priority).phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="detail-card timeline-card">
                  <label><FaHistory /> Timeline</label>
                  <div className="timeline">
                    {getTimeline(selectedComplaint.id).map((event) => (
                      <div key={event.id} className="timeline-item">
                        <div className="timeline-icon">{event.icon}</div>
                        <div className="timeline-content">
                          <div className="timeline-action">{event.action}</div>
                          <div className="timeline-user">by {event.user}</div>
                          <div className="timeline-date">{formatDateTime(event.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments Section - With History */}
                <div className="detail-card comments-card">
                  <label><FaComment /> Comments</label>
                  
                  {/* Existing Comments */}
                  <div className="comments-history">
                    {getComments(selectedComplaint.id).map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-avatar">
                          {comment.avatar}
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-user">{comment.user}</span>
                            <span className="comment-role">{comment.role}</span>
                            <span className="comment-time">{formatTimeOnly(comment.date)}</span>
                          </div>
                          <div className="comment-text">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="comment-input-wrapper">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="comment-input-final"
                    />
                    <button className="btn-comment-final" onClick={handleAddComment}>
                      <FaComment /> Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Actions Aligned Right */}
            <div className="modal-footer-final">
              <div className="action-buttons-footer-final">
                <button className="btn btn-secondary" onClick={() => setShowDetails(false)}>
                  Close
                </button>
                {selectedComplaint.status === 'Pending' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      handleStatusUpdate(selectedComplaint.id, 'In Progress');
                      setShowDetails(false);
                    }}
                  >
                    <FaClock /> Start Progress
                  </button>
                )}
                {selectedComplaint.status === 'In Progress' && (
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      handleStatusUpdate(selectedComplaint.id, 'Resolved');
                      setShowDetails(false);
                    }}
                  >
                    <FaCheckCircle /> Mark Resolved
                  </button>
                )}
                {selectedComplaint.status === 'Resolved' && (
                  <button className="btn btn-resolved" disabled>
                    <FaCheckCircle /> Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTable;
