import React, { useState, useEffect } from 'react';
import './Aktivitas.css';
import { useNavigate } from 'react-router-dom';
import logo from './KAI_ROOMS_logo.png';
import { ref, onValue } from "firebase/database";
import database from "./firebase"; // pastikan path-nya sesuai

const Aktivitas = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1)); // February 2025
  const [selectedDate, setSelectedDate] = useState(12);

  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [eventDates, setEventDates] = useState([]); // DITAMBAH

  useEffect(() => {
    const scheduledRef = ref(database, "scheduledMeetings");
    onValue(scheduledRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = [];
      const dates = new Set();

      for (let id in data) {
        loaded.push({ id, ...data[id] });
        dates.add(data[id].tanggal);
      }

      setScheduledMeetings(loaded);
      setEventDates([...dates]);
    });
  }, []);

  const today = new Date().toISOString().slice(0, 10); // format: yyyy-mm-dd
  const todayEvents = scheduledMeetings.filter(item => item.tanggal === today);
  const laterEvents = scheduledMeetings.filter(item => item.tanggal > today);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  // DITAMBAH: Format tanggal yyyy-mm-dd
  const formatDate = (year, month, day) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };


  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="aktivitas-container">
      <div className="aktivitas-header">
        <button className="back-button-aktivitas" onClick={handleBackToDashboard}>←</button>
        <div className="aktivitas-title">
          <h1>BOARD SCHEDULE CALENDER MEETING</h1>
        </div>
        <div className="kai-rooms-logo">
          <img src={logo} alt="KAI ROOMS Logo" className="logo-icon" />
          <span className="logo-text">KAI ROOMS</span>
        </div>
      </div>

      <div className="aktivitas-content">
        <div className="calendar-section">
          <div className="calendar-header">
            <button className="nav-button" onClick={handlePrevMonth}>‹</button>
            <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <button className="nav-button" onClick={handleNextMonth}>›</button>
          </div>

          <div className="calendar-grid">
            <div className="day-headers">
              {dayNames.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
            </div>

            <div className="calendar-days">
              {days.map((day, index) => (
                <div
  key={index}
  className={`calendar-day ${day ? 'valid-day' : 'empty-day'} 
    ${day === selectedDate ? 'selected' : ''}
    ${day && eventDates.includes(formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day)) ? 'has-event' : ''}
  `}
  onClick={() => handleDateClick(day)}
>
  {day}
</div>

              ))}
            </div>
          </div>
        </div>

<div className="events-section">
  <h3 className="sticky-header">Events</h3>
  <div className="event-list">
    <h4 className="sticky-subheader">Today</h4>
          {todayEvents.length > 0 ? todayEvents.map((event, index) => (
            <div key={index} className="event-item">
              <div className="event-time">{event.tanggal}, {event.waktuMulai}–{event.waktuSelesai}</div>
              <div className="event-title">{event.namaRapat}</div>
              <div className="event-unit">{event.penyelenggara}</div>
              <div className="event-location">Lokasi: {event.lokasi}</div> {/* ✅ lokasi */}
              <div className="event-room">Ruangan: {event.ruangan}</div>   {/* ✅ ruangan */}
              <div className="event-type">Jenis: {event.jenisRapat}</div>  {/* ✅ jenis rapat */}
            </div>
          )) : <p style={{ fontStyle: 'italic', color: '#aaa' }}>No events today.</p>}

          <h4 className="sticky-subheader">Later</h4>
          {laterEvents.length > 0 ? laterEvents.map((event, index) => (
            <div key={index} className="event-item">
              <div className="event-time">{event.tanggal}, {event.waktuMulai}–{event.waktuSelesai}</div>
              <div className="event-title">{event.namaRapat}</div>
              <div className="event-unit">{event.penyelenggara}</div>
              <div className="event-location">Lokasi: {event.lokasi}</div> {/* ✅ lokasi */}
              <div className="event-room">Ruangan: {event.ruangan}</div>   {/* ✅ ruangan */}
              <div className="event-type">Jenis: {event.jenisRapat}</div>  {/* ✅ jenis rapat */}
            </div>
          )) : <p style={{ fontStyle: 'italic', color: '#aaa' }}>No events later.</p>}

  </div> 
      </div> 
    </div> 
  </div> 
  );
};

export default Aktivitas;
