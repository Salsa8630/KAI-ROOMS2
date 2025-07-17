import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./riwayatrapat.css";
import logo from './KAI_ROOMS_logo.png';

export default function RiwayatRapat() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [doneMeetings, setDoneMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/booking`)
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const filtered = data.filter(item => {
          const endTime = new Date(`${item.tanggal}T${item.waktuSelesai}`);
          return endTime < now; // hanya rapat yang sudah selesai
        });
        setDoneMeetings(filtered);
      })
      .catch((err) => {
        console.error("Gagal mengambil riwayat:", err);
        setDoneMeetings([]);
      });
  }, []);

const [upcomingMeetings, setUpcomingMeetings] = useState([]);

useEffect(() => {
  const fetchUpcomingMeetings = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/booking`);
      const data = await res.json();

      const now = new Date();
      const today = now.toISOString().slice(0, 10);

      const filtered = data.filter(item => {
        const meetingDate = item.tanggal?.trim() === today;
        const [hour, minute] = item.waktuMulai.split(":").map(Number);
        const meetingStart = new Date(`${item.tanggal}T${item.waktuMulai}`);
        return meetingDate && meetingStart > now;
      });

      // Urutkan dari waktu paling awal ke paling akhir
      filtered.sort((a, b) => {
        const aStart = new Date(`${a.tanggal}T${a.waktuMulai}`);
        const bStart = new Date(`${b.tanggal}T${b.waktuMulai}`);
        return aStart - bStart;
      });

      setUpcomingMeetings(filtered);
    } catch (err) {
      console.error("❌ Gagal fetch upcoming meetings:", err);
    }
  };

  fetchUpcomingMeetings();
}, []);


  const filteredMeetings = doneMeetings
    .filter((meeting) =>
      meeting.namaRapat.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.tanggal) - new Date(b.tanggal)
        : new Date(b.tanggal) - new Date(a.tanggal)
    );

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  const formatDateForDisplay = (isoDate, timeRange) => {
    const date = new Date(isoDate);
    const day = date.getDate();
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
                  <div className="td judul-rapat">{meeting.namaRapat}</div>
                  <div className="td tanggal-waktu">
                    {formatDateForDisplay(meeting.tanggal, `${meeting.waktuMulai} - ${meeting.waktuSelesai}`)}
                  </div>
                  <div className="td ruangan">{meeting.ruangan}</div>
                  <div className="td status">
                    <div className="status-badge-riwayat">
                      <span className="status-icon">✓</span> 
                      <span className="status-text">Done</span>
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
