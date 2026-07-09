import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBuilding, 
  FaUserTie, 
  FaCalendarAlt, 
  FaBell, 
  FaCog, 
  FaUserCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaChartBar,
  FaClipboardList,
  FaMoneyBillWave,
  FaUsers,
  FaHome,
  FaExclamationTriangle,
  FaFileAlt,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import './Header.css';

const Header = ({ activeTab, onNavigate, isDark, onToggleDark }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 992);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'overdue', icon: <FaExclamationTriangle />, color: '#e74c3c', title: 'Overdue Maintenance', message: 'Priya Sharma (B-205) payment is overdue', time: '2 hours ago', read: false },
    { id: 2, type: 'complaint', icon: <FaFileAlt />, color: '#f39c12', title: 'New Complaint', message: 'Water leakage reported by John Doe (A-302)', time: '4 hours ago', read: false },
    { id: 3, type: 'payment', icon: <FaCheckCircle />, color: '#27ae60', title: 'Payment Received', message: 'Rajesh Kumar paid ₹5,000 maintenance', time: '1 day ago', read: true },
  ]);

  const notifRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationCount = notifications.filter(n => !n.read).length;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth > 992) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleNavigation = (tab) => {
    if (onNavigate) onNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'maintenance', label: 'Maintenance', icon: <FaClipboardList /> },
    { id: 'expenses', label: 'Expenses', icon: <FaMoneyBillWave /> },
    { id: 'staff', label: 'Staff', icon: <FaUsers /> },
    { id: 'residents', label: 'Residents', icon: <FaHome /> },
    { id: 'complaints', label: 'Complaints', icon: <FaExclamationTriangle /> },
    { id: 'reports', label: 'Reports', icon: <FaFileAlt /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
    { id: 'profile', label: 'My Profile', icon: <FaUserCircle /> },
  ];

  return (
    <header className="header">
      <div className="header-content">
        {/* Left Section - Logo */}
        <div className="header-left">
          <div className="logo">
            <FaBuilding className="logo-icon" />
            <div>
              <h1>Shree Yogeshwar Association</h1>
              <span className="society-subtitle">Residential Welfare Association</span>
            </div>
          </div>
        </div>
        
        {/* Center Section - Society Info (Hidden on mobile) */}
        <div className={`header-center ${isMobile ? 'mobile-hidden' : ''}`}>
          <div className="society-info">
            <span className="info-item">
              <FaCalendarAlt />
              {currentDate}
            </span>
            <span className="info-item">
              <FaUserTie />
              Chairman: Mr. Patel
            </span>
          </div>
        </div>

        {/* Right Section - Actions & Hamburger */}
        <div className="header-right">
          {/* Desktop Actions */}
          <div className={`desktop-actions ${isMobile ? 'mobile-hidden' : ''}`}>
            <button className="header-btn" onClick={onToggleDark} title="Toggle Dark Mode">
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            {/* Notification Button + Panel */}            <div className="header-panel-wrapper" ref={notifRef}>
              <button
                className="header-btn notification-btn"
                title="Notifications"
                onClick={() => { setShowNotifications(!showNotifications); setIsDropdownOpen(false); }}
              >
                <FaBell />
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </button>
              {showNotifications && (
                <div className="header-panel notif-panel">
                  <div className="panel-header">
                    <span>Notifications</span>
                    {notificationCount > 0 && (
                      <button className="panel-action-link" onClick={markAllRead}>Mark all read</button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`notif-item ${n.read ? 'read' : 'unread'}`}
                        onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      >
                        <span className="notif-icon" style={{ color: n.color }}>{n.icon}</span>
                        <div className="notif-body">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-msg">{n.message}</div>
                          <div className="notif-time"><FaClock /> {n.time}</div>
                        </div>
                        {!n.read && <span className="notif-dot" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Button - navigates to settings page */}
            <button
              className="header-btn"
              title="Settings"
              onClick={() => { if (onNavigate) onNavigate('settings'); setShowNotifications(false); setIsDropdownOpen(false); }}
            >
              <FaCog />
            </button>

            {/* Profile Dropdown */}
            <div className="profile-dropdown" ref={dropdownRef}>
              <button 
                className="profile-btn"
                onClick={() => { setIsDropdownOpen(!isDropdownOpen); setShowNotifications(false); }}
              >
                <FaUserCircle className="profile-avatar" />
                <span className="profile-name">Admin</span>
                <FaChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <FaUserCircle className="dropdown-avatar" />
                    <div>
                      <div className="dropdown-name">Admin</div>
                      <div className="dropdown-email">admin@society.com</div>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { if (onNavigate) onNavigate('profile'); setIsDropdownOpen(false); }}>
                    <FaUserCircle /> My Profile
                  </button>
                  <button className="dropdown-item" onClick={() => { if (onNavigate) onNavigate('settings'); setIsDropdownOpen(false); }}>
                    <FaCog /> Settings
                  </button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={() => alert('Logout clicked')}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Menu Button - Always visible on mobile */}
          <button 
            className={`hamburger-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Menu - Slides from right */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-user-info">
            <FaUserCircle className="mobile-user-avatar" />
            <div>
              <div className="mobile-user-name">Admin</div>
              <div className="mobile-user-email">admin@society.com</div>
            </div>
          </div>
        </div>

        <div className="mobile-menu-divider" />

        {/* Navigation Section */}
        <div className="mobile-menu-section">
          <div className="mobile-menu-section-title">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`mobile-menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeTab === item.id && (
                <span className="mobile-menu-active-indicator">●</span>
              )}
            </button>
          ))}
        </div>

        <div className="mobile-menu-divider" />

        {/* Society Info Section */}
        <div className="mobile-menu-section">
          <div className="mobile-menu-section-title">Society Info</div>
          <div className="mobile-menu-item disabled">
            <FaCalendarAlt />
            <span>{currentDate}</span>
          </div>
          <div className="mobile-menu-item disabled">
            <FaUserTie />
            <span>Chairman: Mr. Patel</span>
          </div>
        </div>

        <div className="mobile-menu-divider" />

        {/* Actions Section */}
        <div className="mobile-menu-section">
          <div className="mobile-menu-section-title">Actions</div>
          <button className="mobile-menu-item" onClick={onToggleDark}>
            {isDark ? <FaSun /> : <FaMoon />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button className="mobile-menu-item" onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => setShowNotifications(true), 300); }}>
            <FaBell />
            <span>Notifications {notificationCount > 0 && `(${notificationCount})`}</span>
          </button>

          <button className="mobile-menu-item" onClick={() => { handleNavigation('settings'); }}>
            <FaCog />
            <span>Settings</span>
          </button>
        </div>

        <div className="mobile-menu-divider" />

        {/* Profile Section */}
        <div className="mobile-menu-section">
          <button className="mobile-menu-item" onClick={() => { handleNavigation('profile'); }}>
            <FaUserCircle />
            <span>My Profile</span>
          </button>

          <button className="mobile-menu-item logout" onClick={() => alert('Logout clicked')}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Notification Panel */}
      {showNotifications && (
        <div className="mobile-panel-backdrop" onClick={() => setShowNotifications(false)}>
          <div className="mobile-panel-sheet" onClick={e => e.stopPropagation()}>
            <div className="mobile-panel-header">
              <span>Notifications</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {notificationCount > 0 && <button className="panel-action-link" onClick={markAllRead}>Mark all read</button>}
                <button className="mobile-panel-close" onClick={() => setShowNotifications(false)}><FaTimes /></button>
              </div>
            </div>
            <div className="notif-list">
              {notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}
                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                  <span className="notif-icon" style={{ color: n.color }}>{n.icon}</span>
                  <div className="notif-body">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-time"><FaClock /> {n.time}</div>
                  </div>
                  {!n.read && <span className="notif-dot" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
