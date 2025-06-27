import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./riwayatrapat.css";
import logo from './KAI_ROOMS_logo.png';

const initialMeetings = [
  {
    title: "Rapat Evaluasi Tim IT",
    date: "2025-02-12",
    time: "13:00-14:45",
    room: "Lantai 4",
    status: "Done",
  },
  {
    title: "Perubahan GAPEKA",
    date: "2025-02-12",
    time: "13:00-14:45",
    room: "Lantai 2",
    status: "Done",
  },
  {
    title: "Posko KAI Lebaran Idul Fitri",
    date: "2025-04-01",
    time: "08:20-09:30",
    room: "Lantai 3",
    status: "Done",
  },
  {
    title: "Rapat Tim Pemasaran",
    date: "2025-04-01",
    time: "12:30-14:30",
    room: "Lantai 1",
    status: "Done",
  },
  {
    title: "Posko Idul Adha",
    date: "2025-06-12",
    time: "09:30-10:30",
    room: "Lantai 2",
    status: "Done",
  },
];

export default function RiwayatRapat() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  const filteredMeetings = initialMeetings
    .filter((meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  // Format for displaying tanggal & waktu according to Figma design
  const formatDateForDisplay = (isoDate, timeRange) => {
    const date = new Date(isoDate);
    
    // Get day, month and year
    const day = date.getDate();
    
    // Convert month to text in Indonesian
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}\n${timeRange}`;
  };

  return (
    <div className="app-container">
      <div className="riwayatrapat-body">
        <div className="kai-header">
          <div className="kai-logo">
            <img src={logo} alt="KAI ROOMS Logo" />
            <span>KAI ROOMS</span>
          </div>
        </div>

        <div className="content-area">
          <div className="page-title">
            <h1>RIWAYAT RAPAT SAYA</h1>
          </div>

          <div className="search-section">
            <div className="search-input-container">
              <svg
  className="search-icon"
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
>
  <path
    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 
    6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 
    4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 
    9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"
    fill="#7B61FF"
  />
</svg>
              <input
                type="text"
                placeholder="Cari judul rapat"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="sort-button" onClick={toggleSort}>
              Tanggal {sortAsc ? "▾" : "▴"}
            </button>
          </div>

          <div className="meeting-table">
            <div className="table-header">
              <div className="th judul-rapat">Judul Rapat</div>
              <div className="th tanggal-waktu">Tanggal & Waktu</div>
              <div className="th ruangan">Ruangan</div>
              <div className="th status">Status</div>
              <div className="th actions">Actions</div>
            </div>

            <div className="table-body">
              {filteredMeetings.map((meeting, index) => (
                <div className="table-row" key={index}>
                  <div className="td judul-rapat">{meeting.title}</div>
                  <div className="td tanggal-waktu">
                    {formatDateForDisplay(meeting.date, meeting.time)}
                  </div>
                  <div className="td ruangan">{meeting.room}</div>
                  <div className="td status">
                    <div className="status-badge-riwayat">
                      <span className="status-icon">✓</span> 
                      <span className="status-text">{meeting.status}</span>
                    </div>
                  </div>
                  <div className="td actions">
                    <button className="detail-button">Detail</button>
                  </div>
                </div>
              ))}
              {filteredMeetings.length === 0 && (
                <div className="empty-state">
                  Tidak ada rapat ditemukan.
                </div>
              )}
            </div>
          </div>

          <div className="button-container">
            <button className="back-button-riwayat" onClick={() => navigate("/dashboard")}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}