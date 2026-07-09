import React, { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSave, FaTimes, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa';
import './MyProfilePage.css';

const MyProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'admin@society.com',
    phone: '+91 98765 00000',
    society: 'Shree Yogeshwar Association',
    role: 'Society Administrator',
    joined: 'January 2023',
  });
  const [form, setForm] = useState({ ...profile });

  const handleSave = () => {
    setProfile({ ...form });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <h2>My Profile</h2>
        <p>View and manage your account information</p>
      </div>

      <div className="profile-page-body">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-page-avatar"><FaUserCircle /></div>
          <div className="profile-avatar-info">
            <div className="profile-page-name">{profile.name}</div>
            <div className="profile-page-role">{profile.role}</div>
            <div className="profile-page-badge"><FaShieldAlt /> Administrator</div>
          </div>
        </div>

        {/* Info Section */}
        <div className="profile-info-section">
          <div className="profile-info-header">
            <span>Personal Information</span>
            {!editing ? (
              <button className="profile-edit-action" onClick={() => setEditing(true)}>
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="profile-edit-actions">
                <button className="profile-save-action" onClick={handleSave}><FaSave /> Save</button>
                <button className="profile-cancel-action" onClick={handleCancel}><FaTimes /> Cancel</button>
              </div>
            )}
          </div>

          <div className="profile-fields">
            {[
              { icon: <FaUserCircle />, label: 'Full Name', key: 'name' },
              { icon: <FaEnvelope />, label: 'Email Address', key: 'email' },
              { icon: <FaPhone />, label: 'Phone Number', key: 'phone' },
              { icon: <FaBuilding />, label: 'Society', key: 'society' },
            ].map(({ icon, label, key }) => (
              <div className="profile-field" key={key}>
                <div className="profile-field-label">{icon} {label}</div>
                {editing ? (
                  <input
                    className="profile-field-input"
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  />
                ) : (
                  <div className="profile-field-value">{profile[key]}</div>
                )}
              </div>
            ))}

            <div className="profile-field">
              <div className="profile-field-label"><FaCalendarAlt /> Member Since</div>
              <div className="profile-field-value">{profile.joined}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
