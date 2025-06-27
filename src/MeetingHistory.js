import React from 'react';
import './MeetingHistory.css';

const meetings = [
  { title: 'Rapat Evaluasi Tim IT', date: '12 Februari 2025 13:00-14:45', room: 'Lantai 4', status: 'Done' },
  { title: 'Perubahan GAPEKA', date: '12 Februari 2025 13:00-14:30', room: 'Lantai 2', status: 'Done' },
  { title: 'Posko KAI Lebaran Idul Fitri', date: '1 April 2025 08:00-09:30', room: 'Lantai 3', status: 'Done' },
  { title: 'Rapat Tim Pemasaran', date: '1 April 2025 12:30-14:30', room: 'Lantai 1', status: 'Done' },
  { title: 'Posko Idul Adha', date: '12 Juni 2025 09:30-10:30', room: 'Lantai 2', status: 'Done' },
];

const MeetingHistory = () => {
  return (
    <div className="container">
      <h1>RIWAYAT RAPAT SAYA</h1>
      <div className="search-bar">
        <input type="text" placeholder="Cari judul rapat" />
        <select>
          <option>Tanggal</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Judul Rapat</th>
            <th>Tanggal & Waktu</th>
            <th>Ruangan</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting, index) => (
            <tr key={index}>
              <td>{meeting.title}</td>
              <td>{meeting.date}</td>
              <td>{meeting.room}</td>
              <td><span className="status">{meeting.status}</span></td>
              <td><button className="detail-btn">Detail</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="back-btn">Back</button>
    </div>
  );
};

export default MeetingHistory;