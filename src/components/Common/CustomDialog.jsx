import React from 'react';
import './CustomDialog.css';

const CustomDialog = ({ dialog, onConfirm, onCancel }) => {
  if (!dialog) return null;

  const { type, message, title } = dialog;

  return (
    <div className="dialog-overlay" onClick={type === 'alert' ? onConfirm : onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon">
          {type === 'confirm' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
        </div>
        {title && <h3 className="dialog-title">{title}</h3>}
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          {type === 'confirm' ? (
            <>
              <button className="dialog-btn dialog-btn-cancel" onClick={onCancel}>Cancel</button>
              <button className="dialog-btn dialog-btn-confirm" onClick={onConfirm}>Confirm</button>
            </>
          ) : (
            <button className="dialog-btn dialog-btn-ok" onClick={onConfirm}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
