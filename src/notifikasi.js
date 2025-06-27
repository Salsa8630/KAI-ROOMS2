import React, { useState } from 'react';
import './notifikasi.css';
import { useNavigate } from 'react-router-dom';

const dummyNotifications = [
  { id: 1, type: 'meeting', title: "Your meeting 'Rapat Evaluasi' starts in 10 minutes.", time: '10:50', action: 'join' },
  { id: 2, type: 'room', title: 'Room Lantai 2 is now available.', time: '10:40' },
  { id: 3, type: 'meeting', title: 'Rapat Tim IT has been rescheduled to 15:00', time: '09:15', status: 'rescheduled' },
  { id: 4, type: 'meeting', title: 'Rapat A has been cancelled', time: 'Yesterday', status: 'cancelled' },
  { id: 5, type: 'confirmation', title: "Please confirm your presence for 'Perubahan GAPEKA'.", time: 'Yesterday', action: 'confirm' },
  { id: 6, type: 'system', title: 'System maintenance scheduled tonight 22:00–23:00', time: '1 Apr' },
];

function Notifikasi() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const navigate = useNavigate();

  const clearAll = () => {
    setNotifications([]);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  

  return (
    <div style={{ position: 'relative' }}>
      <button className="back-btn-notifikasi" onClick={handleBackToDashboard}>←</button>
    <div className="notifikasi-container">
      <div className="notifikasi-header">
        <h2>Notifications</h2>
        <button className="clear-btn" onClick={clearAll}>Clear all</button>
      </div>
      <div className="notifikasi-list">
        {notifications.map((notif) => (
          <div key={notif.id} className={`notifikasi-item ${notif.status || ''}`}>
            <div className="notif-icon">
              {notif.type === 'meeting' && '📅'}
              {notif.type === 'room' && '🏢'}
              {notif.type === 'system' && '⚙️'}
              {notif.type === 'confirmation' && '✅'}
            </div>
            <div className="notif-content">
              <div className="notif-title">{notif.title}</div>
              <div className="notif-time">{notif.time}</div>
              {notif.action === 'join' && <button className="notif-action">Join Now</button>}
              {notif.action === 'confirm' && (
                <div className="confirm-buttons">
                  <button className="yes-btn">Yes</button>
                  <button className="no-btn">No</button>
                </div>
              )}
              {notif.status === 'rescheduled' && (
  <div className="status-wrapper">
    <span className="status-badge rescheduled">Rescheduled</span>
  </div>
)}
              {notif.status === 'cancelled' && (
  <div className="status-wrapper">
    <span className="status-badge cancelled">Cancelled</span>
  </div>
)}
            </div>
          </div>
        ))}
        {notifications.length === 0 && <div className="no-notif">No notifications</div>}
      </div>
    </div>
    </div>
  );
}

export default Notifikasi;