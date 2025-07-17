import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './notifikasi.css';

function Notifikasi() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/booking');
        const data = await response.json();

        const now = new Date();
        const notifList = [];

        data.forEach((booking) => {
          const tanggal = booking.tanggal; // Format harus YYYY-MM-DD
          const waktuMulai = booking.waktuMulai;
          const waktuSelesai = booking.waktuSelesai;

          const startDateTime = new Date(`${tanggal}T${waktuMulai}:00`);
          const endDateTime = new Date(`${tanggal}T${waktuSelesai}:00`);
          const selisihMenit = (startDateTime - now) / 60000;

          // Rapat telah selesai
          if (now > endDateTime) {
            notifList.push({
              id: Date.now() + Math.random(),
              type: 'meeting',
              title: `Rapat '${booking.namaRapat}' telah selesai.`,
              time: endDateTime.toLocaleString('id-ID', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }),
              sortTime: endDateTime.getTime()
            });
          }
          // Rapat akan dimulai dalam 10 menit
          else if (selisihMenit <= 10 && selisihMenit >= 0) {
            notifList.push({
              id: Date.now() + Math.random(),
              type: 'meeting',
              title: `Rapat '${booking.namaRapat}' akan dimulai dalam ${Math.ceil(selisihMenit)} menit.`,
              time: startDateTime.toLocaleString('id-ID', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }),
              action: 'join',
              sortTime: startDateTime.getTime()
            });
          }
          // Rapat sedang berlangsung
          else if (now >= startDateTime && now <= endDateTime) {
            notifList.push({
              id: Date.now() + Math.random(),
              type: 'meeting',
              title: `Rapat '${booking.namaRapat}' sedang berlangsung.`,
              time: startDateTime.toLocaleString('id-ID', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }),
              status: 'ongoing',
              sortTime: startDateTime.getTime()
            });
          }
        });

        // Filter notifikasi yang sudah dihapus user sebelumnya
        const dismissed = JSON.parse(localStorage.getItem('dismissedNotifs')) || [];
        const filteredNotif = notifList.filter(n => !dismissed.includes(n.title));

        // ✅ Urutkan dari yang terbaru ke lama berdasarkan sortTime
        filteredNotif.sort((a, b) => b.sortTime - a.sortTime);

        setNotifications(filteredNotif);
      } catch (err) {
        console.error("Gagal fetch booking:", err);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 60000); // refresh tiap 1 menit
    return () => clearInterval(interval);
  }, []);

  const clearAll = () => {
    const dismissedTitles = notifications.map(n => n.title);
    localStorage.setItem('dismissedNotifs', JSON.stringify(dismissedTitles));
    setNotifications([]);
  };

  const resetDismissed = () => {
    localStorage.removeItem('dismissedNotifs');
    window.location.reload();
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
          <div className="notifikasi-actions">
            <button className="btn-clear" onClick={clearAll}>🗑 Clear All</button>
            <button className="btn-reset" onClick={resetDismissed}>🔁 Reset</button>
          </div>
        </div>
        <div className="notifikasi-list">
          {notifications.map((notif) => (
            <div key={notif.id} className={`notifikasi-item ${notif.status || ''}`}>
              <div className="notif-icon">📅</div>
              <div className="notif-content">
                <div className="notif-title">{notif.title}</div>
                <div className="notif-time">{notif.time}</div>

                {notif.action === 'join' && (
                  <button className="notif-action">Join Now</button>
                )}

                {notif.status === 'ongoing' && (
                  <div className="status-wrapper">
                    <span className="status-badge ongoing">Sedang berlangsung</span>
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
