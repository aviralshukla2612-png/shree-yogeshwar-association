import React, { useState } from 'react';
import { FaPalette, FaBell, FaShieldAlt, FaGlobe, FaSave, FaMoon, FaSun, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './SettingsPage.css';

const SettingsPage = ({ isDark, onToggleDark }) => {
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <h2>Settings</h2>
        <p>Manage your application preferences</p>
      </div>

      <div className="settings-sections">
        {/* Appearance */}
        <div className="settings-section">
          <div className="settings-section-title"><FaPalette /> Appearance</div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Dark Mode</span>
              <span className="settings-row-desc">Switch between light and dark theme</span>
            </div>
            <button className="toggle-btn" onClick={onToggleDark}>
              {isDark ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-section-title"><FaBell /> Notifications</div>
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive alerts via email' },
            { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
            { key: 'sms', label: 'SMS Notifications', desc: 'Receive alerts via SMS' },
          ].map(({ key, label, desc }) => (
            <div className="settings-row" key={key}>
              <div className="settings-row-info">
                <span className="settings-row-label">{label}</span>
                <span className="settings-row-desc">{desc}</span>
              </div>
              <button
                className={`icon-toggle ${notifications[key] ? 'on' : 'off'}`}
                onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
              >
                {notifications[key] ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
          ))}
        </div>

        {/* Language */}
        <div className="settings-section">
          <div className="settings-section-title"><FaGlobe /> Language & Region</div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Language</span>
              <span className="settings-row-desc">Select your preferred language</span>
            </div>
            <select className="settings-select" value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>

        {/* Security */}
        <div className="settings-section">
          <div className="settings-section-title"><FaShieldAlt /> Security</div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Change Password</span>
              <span className="settings-row-desc">Update your account password</span>
            </div>
            <button className="settings-action-btn">Change</button>
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Two-Factor Authentication</span>
              <span className="settings-row-desc">Add an extra layer of security</span>
            </div>
            <button className="settings-action-btn">Enable</button>
          </div>
        </div>
      </div>

      <button className={`settings-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
        <FaSave /> {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
};

export default SettingsPage;
