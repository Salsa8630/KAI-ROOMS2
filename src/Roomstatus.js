import React, { useEffect, useState } from 'react';
import './Roomstatus.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone } from 'lucide-react';

function RoomStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [meetingStatus, setMeetingStatus] =useState('');

  // Mock upcoming meetings data
  const upcomingMeetings = [
    { time: "11:00-12:00", title: "Rapat Koordinasi", subtitle: "Perubahan GAPEKA", unit: "Unit Operasi" },
    { time: "13:00-14:30", title: "Rapat Tim IT", subtitle: "Posko KAI Lebaran Idul Fitri", unit: "Unit SDM" },
    { time: "15:00-16:00", title: "Meeting Evaluasi", subtitle: "Rapat Evaluasi Sistem", unit: "Unit System Information" },
    { time: "16:30-17:30", title: "Koordinasi Harian", subtitle: "Rapat Tim IT", unit: "Unit System Information" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (bookingData.waktuMulai && bookingData.waktuSelesai) {
      const now = new Date();
      const [startHour, startMinute] = bookingData.waktuMulai.split(':');
      const [endHour, endMinute] = bookingData.waktuSelesai.split(':');

      const startTime = new Date();
      startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endTime = new Date();
      endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const total = (endTime - startTime) / (1000 * 60);
      setTotalMinutes(total);

      let displayMinutes = 0;
      let progress = 0;

      if (now < startTime) {
        displayMinutes = (startTime - now) / (1000 * 60);
        progress = 0;
        setMeetingStatus(`Meeting will start in ${Math.ceil(displayMinutes)} min`);
      } else if (now >= startTime && now < endTime) {
        displayMinutes = (endTime - now) / (1000 * 60);
        progress = ((now - startTime) / (endTime - startTime)) * 100;
        setMeetingStatus('Meeting in progress');
      } else {
        displayMinutes = 0;
        progress = 100;
        setMeetingStatus('Meeting has ended');
      }

      setTimeRemaining(Math.max(0, Math.floor(displayMinutes)));
      setProgressPercentage(progress);
    }
  }, [bookingData, currentTime]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${formatTime(date)} ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTimer = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="room-status-container">
      <div className="status-sidebar">
        <div className="kai-rooms-header">
          <div className="kai-icon">
            <div className="icon-grid">
              <div className="grid-item"></div>
              <div className="grid-item"></div>
              <div className="grid-item"></div>
              <div className="grid-item"></div>
            </div>
          </div>
          <span className="kai-text">KAI ROOMS</span>
        </div>
        
        <div className="status-badge-roomstatus">Offline</div>
        
        <div className="datetime-display">
          {formatDate(currentTime)}
        </div>
        
        <div className="room-info">
          <div className="unavailable-text">UNAVAILABLE</div>
          <div className="room-busy-text">ROOM IS BUSY</div>
          
          <div className="timer-container">
            <div className="circular-progress">
              <svg className="progress-ring" width="200" height="200">
                <circle
                  className="progress-ring-circle-bg"
                  cx="100"
                  cy="100"
                  r="85"
                />
                <circle
                  className="progress-ring-circle"
                  cx="100"
                  cy="100"
                  r="85"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 85}`,
                    strokeDashoffset: `${2 * Math.PI * 85 * (1 - progressPercentage / 100)}`
                  }}
                />
              </svg>
              <div className="timer-text">
                {formatTimer(timeRemaining)}
              </div>
              <div className="meeting-status-label">
                {meetingStatus}
              </div>
            </div>
          </div>
          
          <div className="room-details">
            <div className="room-name">
              DAOP 1, {bookingData.ruangan || 'BATAVIA'}
            </div>
            
            <div className="capacity">
              Capacity: {bookingData.kapasitas || '20'} people
            </div>
            <div className="meeting-name">
                {bookingData.namaRapat || 'Rapat Koordinasi'}
            </div>
            <div className="booking-time">
              BOOKED {bookingData.waktuMulai || '10:00'}AM-{bookingData.waktuSelesai || '11:00'}AM
            </div>
            <div className="organizer">
              Organizer: {bookingData.penyelenggara || 'Unit Operasi'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="upcoming-sidebar">
        <div className="upcoming-header">
          <h3>Upcoming Meeting List</h3>
        </div>
        
        <div className="meeting-list">
          {upcomingMeetings.map((meeting, index) => (
            <div key={index} className="meeting-item">
              <div className="meeting-time">{meeting.time}</div>
              <div className="meeting-title">{meeting.title}</div>
              <div className="meeting-subtitle">{meeting.subtitle}</div>
              <div className="meeting-unit">{meeting.unit}</div>
            </div>
          ))}
        </div>
        
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default RoomStatus;
