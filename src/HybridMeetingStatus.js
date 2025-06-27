import React, { useState, useEffect } from 'react';
import './HybridMeetingStatus.css';
import { useLocation } from 'react-router-dom';

const HybridMeetingStatus = () => {
  const location = useLocation();
  const bookingData = location.state || {};

  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusText, setStatusText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  const offlineCount = Number(bookingData.pesertaOffline) || 0;
  const onlineCount = Number(bookingData.pesertaOnline) || 0;
  const maxOffline = Number(bookingData.maxOffline) || 12;
  const maxOnline = Number(bookingData.maxOnline) || 8;

  const totalCount = offlineCount + onlineCount;
  const maxTotal = maxOffline + maxOnline;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
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

      if (now < startTime) {
        const diff = Math.ceil((startTime - now) / (1000 * 60));
        setStatusText(`Meeting will start in ${diff} min`);
        setTimeRemaining(diff * 60);
      } else if (now >= startTime && now < endTime) {
        setStatusText('Meeting in progress');
        const diff = Math.ceil((endTime - now) / (1000 * 60));
        setTimeRemaining(diff * 60);
      } else {
        setStatusText('Meeting has ended');
        setTimeRemaining(0);
      }
    }
  }, [bookingData, currentTime]);

  const formatTime = (num) => num.toString().padStart(2, '0');

  return (
    <div className="body">
      <div className="mainContent">
        <div className="connectionIndicator">
          <div className="connectionDot"></div>
          <span>Online Connected</span>
        </div>

        <div className="statusHeader-hybrid">UNAVAILABLE</div>
        <div className="roomStatus-hybrid">ROOM IS BUSY</div>

        <div className="timerContainer-hybrid">
          <div className="timerCircle-hybrid">
            <div className="timerText">
              {formatTime(Math.floor(timeRemaining / 60))}:
              {formatTime(timeRemaining % 60)}
            </div>
          </div>
        </div>

        <div className="meetingInfo-hybrid">
          <div className="meetingCountdown-hybrid">{statusText}</div>

          <div className="meetingTitle-hybrid">
            DAOP 1, {bookingData.ruangan || 'Gajah Mada'}
          </div>

          <div className="meetingType-hybrid">
            <div className="hybridIcon">🔗</div>
            <span>HYBRID MEETING</span>
          </div>

          <div className="participantsInfo">
            <div className="participantGroup">
              <div className="participantIcon">👥</div>
              <div className="participantCount">{offlineCount}</div>
              <div className="participantLabel">Peserta Offline</div>
              <div className="participantCapacity">
                Max: {maxOffline}
              </div>
            </div>
            <div className="participantGroup">
              <div className="participantIcon">💻</div>
              <div className="participantCount">{onlineCount}</div>
              <div className="participantLabel">Peserta Online</div>
              <div className="participantCapacity">
                Max: {maxOnline}
              </div>
            </div>
          </div>

          <div className="meetingDetails-hybrid">
            Total: {totalCount} / {maxTotal} people
          </div>
          <div className="meetingDetails">
            {bookingData.namaRapat || 'Rapat angkutan lebaran idul adha'}
          </div>

          <div className="bookingTime">
            BOOKED {bookingData.waktuMulai || '08:40'} - {bookingData.waktuSelesai || '09:00'}
          </div>

          <div className="organizer">
            Organizer: {bookingData.penyelenggara || 'Unit Operasi'}
          </div>
        </div>
      </div>

      <div className="sidebar-hybrid">
        <div className="scheduleItem">
          <div className="scheduleTime">11:00-12:00</div>
          <div className="scheduleTitle">Rapat Koordinasi</div>
          <div className="scheduleDetails">
            Perubahan GAPEKA<br />Unit Operasi
          </div>
        </div>

        <div className="scheduleItem">
          <div className="scheduleTime">13:00-14:30</div>
          <div className="scheduleTitle">Rapat Tim IT</div>
          <div className="scheduleDetails">
            Posko KAI Lebaran Idul Fitri<br />Unit SDM
          </div>
        </div>

        <div className="scheduleItem">
          <div className="scheduleTime">15:00-16:00</div>
          <div className="scheduleTitle">Meeting Evaluasi</div>
          <div className="scheduleDetails">
            Rapat Evaluasi Sistem<br />Unit System Information
          </div>
        </div>

        <div className="scheduleItem">
          <div className="scheduleTime">16:30-17:30</div>
          <div className="scheduleTitle">Koordinasi Harian</div>
          <div className="scheduleDetails">
            Rapat Tim IT<br />Unit System Information
          </div>
        </div>
      </div>
    </div>
  );
};

export default HybridMeetingStatus;
