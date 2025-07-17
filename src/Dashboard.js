import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import kaiLogo from './KAI_ROOMS_logo.png';




const meetingsToday = [
  {
    title: "Rapat Koordinasi Tim GAPEKA",
    time: "17:10",
    endTime: "18:00",
    lokasi: "Lantai 2",
    room: "Batavia",
    unit: "Unit Operasi",
    status: "in_use"
  },
  {
    title: "Perubahan GAPEKA",
    time: "13:00",
    endTime: "14:45",
    lokasi: "Lantai 3",
    room: "Borneo",
    unit: "Unit Operasi",
    status: "reserved"
  },
  {
    title: "Posko KAI Lebaran Idul Fitri",
    time: "16:00",
    endTime: "16:30",
    lokasi: "Lantai 1",
    room: "Sumatera",
    unit: "Unit SDM",
    status: "reserved"
  },
  {
    title: "Rapat A",
    time: "",
    endTime: "",
    lokasi: "Lantai 4",
    room: "Kalimantan",
    unit: "",
    status: "available"
  }
];

function Dashboard({ setIsAuthenticated }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reminder, setReminder] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [remindedMeetings, setRemindedMeetings] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [showBookingOptionPopup, setShowBookingOptionPopup] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [reminderMeeting, setReminderMeeting] = useState(null);
  


  
  const [formData, setFormData] = useState({
    penyelenggara: 'Unit Operasi',
    namaRapat: '',
    tanggal: '',
    waktuMulai: '',
    waktuSelesai: '',
    lokasi: '',
    ruangan: '',
    jenisRapat: 'Online',
    kapasitas: '',
    catatan: ''
  });


useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/booking`)
    .then((res) => res.json())
    .then((data) => {
      setBookingList(data); // Karena backend udah kirim array
    })
    .catch((err) => {
      console.error("Gagal ambil data booking:", err);
      setBookingList([]); // fallback kosong
    });
}, []);


    useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
  const timer = setInterval(() => {
    const now = new Date();

    meetingsToday.forEach((meeting, index) => {
      if (!meeting.time) return;

      const [hour, minute] = meeting.time.split(':').map(Number);
      const meetingTime = new Date();
      meetingTime.setHours(hour, minute, 0, 0);

      const diffMinutes = Math.floor((meetingTime - now) / (1000 * 60));

      // Kasih reminder kalau belum pernah dikasih reminder untuk rapat ini
      if (diffMinutes >= 1 && diffMinutes <= 10 && !remindedMeetings.includes(index)) {
        setReminder(`🔔 Anda mempunyai rapat "${meeting.title}" dalam ${diffMinutes} menit!`);
        setRemindedMeetings(prev => [...prev, index]); // tambahkan index ke list reminder
      }
    });

    setCurrentTime(now); // update waktu sekarang juga
  }, 1000);

  return () => clearInterval(timer);
}, [remindedMeetings]);

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/booking`)
    .then(res => res.json())
    .then(data => {
      const now = new Date();
      const todayString = now.toISOString().split("T")[0];

      const results = data
        .filter(item => item.tanggal === todayString)
        .map(item => {
          const start = new Date(`${item.tanggal}T${item.waktuMulai}`);
          const end = new Date(`${item.tanggal}T${item.waktuSelesai}`);

          let status = "available";

          if (now >= start && now <= end) {
            status = "in_use";
          } else if (start > now && (start - now) / 60000 <= 60) {
            status = "reserved";
          } else if (now > end && (now - end) / 60000 <= 5) {
            status = "done";
          } else {
            return null;
          }

          return {
            title: item.namaRapat,
            lokasi: item.lokasi,
            ruangan: item.ruangan,
            unit: item.penyelenggara,
            status,
            endTime: item.waktuSelesai,
            startTime: item.waktuMulai,
            tanggal: item.tanggal,
            kapasitas: item.kapasitas,
            catatan: item.catatan,
            linkMeet: item.linkMeet,
            jenisRapat: item.jenisRapat        
          };
        })
        .filter(item => item !== null);

      setRealtimeStatus(results);
    })
    .catch(err => {
      console.error("Gagal ambil status realtime:", err);
      setRealtimeStatus([]);
    });
}, []);

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/booking`)
    .then(res => res.json())
    .then(data => {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      const upcoming = data
        .filter(item => item.tanggal > todayStr)
        .sort((a, b) => {
          const dateA = new Date(`${a.tanggal}T${a.waktuMulai}`);
          const dateB = new Date(`${b.tanggal}T${b.waktuMulai}`);
          return dateA - dateB;
        });

      setUpcomingMeetings(upcoming);
    })
    .catch(err => {
      console.error("Gagal ambil upcoming meetings:", err);
      setUpcomingMeetings([]);
    });
}, []);


useEffect(() => {
  const interval = setInterval(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/booking`)
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];

        const soon = data
          .filter(item => item.tanggal === todayStr)
          .filter(item => {
            const start = new Date(`${item.tanggal}T${item.waktuMulai}`);
            const diff = (start - now) / 60000;
            return diff >= 0 && diff <= 10;
          })
          .sort((a, b) => new Date(`${a.tanggal}T${a.waktuMulai}`) - new Date(`${b.tanggal}T${b.waktuMulai}`));

        setReminderMeeting(soon[0] || null);
      })
      .catch(err => {
        console.error("Gagal ambil reminder:", err);
        setReminderMeeting(null);
      });
  }, 10000); // tiap 10 detik cukup

  return () => clearInterval(interval);
}, []);





 const formatIndoDate = (dateStr) => {
  const date = new Date(dateStr);
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]}`;
};


  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };





  const user = JSON.parse(localStorage.getItem("user"));
  const namaUser = user?.nama || "User";

  // Tambahkan sebelum return
const handleShowDetail = (meeting) => {
  setSelectedMeeting(meeting);
  setShowDetailPopup(true);
};

const handleSubmit = (e) => {
  e.preventDefault();
  setShowPopup(false);

  if (formData.jenisRapat === "Online") {
    setShowLinkPopup(true); // 👉 tampilkan popup link gmeet DULU
  } else {
    setShowBookingOptionPopup(true); // langsung ke instant/later
  }
};


useEffect(() => {
  if (formData.jenisRapat === 'Online' && showBookingOptionPopup) {
    setShowLinkPopup(true);
  }
}, [formData.jenisRapat, showBookingOptionPopup]);

const navigate = useNavigate();

const keRiwayatRapat = () => {
  navigate('/riwayat-rapat');
};

const goToAktivitas = () => {
  navigate('/aktivitas');
};

const goTonotifikasi = () => {
  navigate('/notifikasi');
};

const goToPengaturan = () => {
  navigate('/pengaturan');
};

// ✅ Fungsi logout
const handleLogout = () => {
  localStorage.clear();
  setIsAuthenticated(false);
  navigate('/login');
};


// ✅ Fungsi status meeting
const renderStatus = (status, endTime) => {
  if (status === 'in_use') {
    return <span className="status red">🔴 In Use until {endTime}</span>;
  } else if (status === 'reserved') {
    return <span className="status yellow">🟡 Reserved Soon</span>;
  } else if (status === 'done') {
    return <span className="status green">🟢 Done Meeting</span>;
  } else {
    return <span className="status gray">Unknown</span>;
  }
};

const handleConfirmLink = () => {
  if (!meetingLink.trim()) {
    alert("Link Google Meet tidak boleh kosong.");
    return;
  }

  // ✅ Simpan ke formData
  setFormData(prev => ({ ...prev, linkMeet: meetingLink }));

  // ✅ Tutup popup masukan link
  setShowLinkPopup(false);

  // ✅ Tampilkan popup pilihan Instant / Later
  setShowBookingOptionPopup(true);
};



const handleSearch = () => {
  fetch(`${process.env.REACT_APP_API_URL}/api/booking`)
    .then((res) => res.json())
    .then((data) => {
      const results = Array.isArray(data)
        ? data.filter(item =>
            item.namaRapat?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      setSearchResults(results);
      setShowSearchPopup(true);
    })
    .catch((err) => {
      console.error("Gagal mengambil data pencarian:", err);
      setSearchResults([]);
    });
};

// ⬇️ Bagian return
return (
  <div className="dashboard-container">
    <aside className="sidebar">
      <div className="brand-complete">
        <div className="brand-row">
          <img src={kaiLogo} alt="KAI ROOMS Logo" className="logo-img" />
          <h2>KAI ROOMS</h2>
        </div>
        <p className="desc">
          Optimizing Collaboration,<br />Enhancing Productivity
        </p>
      </div>
      <nav>
        <ul>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="white" />
            </svg>
            Beranda
          </li>
          <li onClick={goToAktivitas} style={{ cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="white" />
            </svg>
            Kegiatan
          </li>
          <li onClick={goTonotifikasi} style={{ cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5S10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="white" />
            </svg>
            Notifikasi
          </li>
          <li onClick={goToPengaturan} style={{ cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12S13.933 8.5 12 8.5 8.5 10.067 8.5 12 10.067 15.5 12 15.5ZM19.43 12.97C19.47 12.65 19.5 12.33 19.5 12S19.47 11.35 19.43 11.03L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.03C4.53 11.35 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z" fill="white" />
            </svg>
            Pengaturan
          </li>
          <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 5.59L9 12.17L13.17 16.34L11.76 17.76L9 15L17 7ZM4 12C4 16.97 7.58 21 12 21C13.95 21 15.74 20.38 17.25 19.34L15.97 18.06C14.74 18.95 13.42 19.5 12 19.5C8.41 19.5 5.5 16.59 5.5 13C5.5 9.41 8.41 6.5 12 6.5C15.59 6.5 18.5 9.41 18.5 13C18.5 14.42 17.95 15.74 17.06 16.97L18.34 18.25C19.38 16.74 20 14.95 20 13C20 7.03 16.42 3 12 3S4 7.03 4 12Z" fill="white" />
            </svg>
            Log out
          </li>
        </ul>
      </nav>
    </aside>


      <main className="main-dashboard">
        <div className="header-bar">
          <div>{formatIndoDate(currentTime)}</div>
          <div>{formatTime(currentTime)}</div>
        </div>

        <div className="greeting">
        <h3>Halo, selamat datang, {namaUser}!</h3>
        <p><i>Lihat jadwal rapatmu hari ini dan kelola meeting dengan mudah.</i></p>
{realtimeStatus.some(m => m.status === 'in_use') && (
    <div className="info-box-blue">
      📢 Ada rapat yang sedang berlangsung di ruangan lain. Silakan cek jadwal!
    </div>
  )}
  {reminderMeeting ? (
  <p>
    <b>{reminderMeeting.namaRapat}</b><br />
    {reminderMeeting.waktuMulai} - {reminderMeeting.waktuSelesai} WIB<br />
    <span className="upcoming">Upcoming</span>
    {reminderMeeting.jenis?.toLowerCase() !== "offline" && reminderMeeting.linkMeet && (
      <>
        {" "}
        <a
          href={reminderMeeting.linkMeet}
          target="_blank"
          rel="noopener noreferrer"
        >
          [Gabung Sekarang]
        </a>
      </>
    )}
  </p>
) : (
  <p>Tidak ada meeting dalam waktu dekat.</p>
)}

{reminder && <p className="reminder">{reminder}</p>}
</div>

        <div className="room-status-wrapper">
          <div className="room-status">
            <table>
              <thead>
                <tr>
                  <th>Judul Rapat</th>
                  <th>Lokasi</th>
                  <th>Ruangan</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {realtimeStatus.map((m, i) => (
                  <tr key={i}>
                    <td
  onClick={() => {
  if (m.jenisRapat === "Online" && m.linkMeet) {
    window.open(m.linkMeet, "_blank");
  } else {
    navigate('/room-status', {
      state: {
        penyelenggara: m.unit,
        namaRapat: m.title,
        tanggal: m.tanggal,
        waktuMulai: m.startTime,
        waktuSelesai: m.endTime,
        lokasi: m.lokasi,
        ruangan: m.ruangan,
        jenisRapat: m.jenisRapat,
        kapasitas: m.kapasitas || 0,
        catatan: m.catatan || '',
        linkMeet: m.linkMeet || ''
      }
    });
  }
}}
  style={{ cursor: 'pointer' }}
>
  {m.title}
</td>

                    <td>{m.lokasi}</td>
                    <td>{m.ruangan}</td>
                    <td>{m.unit || '-'}</td>
                    <td>{renderStatus(m.status, m.endTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="book-btn" onClick={() => setShowPopup(true)}>Book a Room</button>
          </div>
        </div>

        <div className="actions">
  <button className="action-btn" onClick={() => setShowSearchPopup(true)}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6B35" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 
      6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 
      4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 
      9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"/>
  </svg>
  Search Meet
</button>

<button className="action-btn" onClick={() => navigate('/riwayat-rapat')}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6B35" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 
      1.1.9 2 2 2h12c1.1 0 2-.9 
      2-2V8l-6-6zm2 18H6V4h7v5h5v11z"/>
  </svg>
  Riwayat Rapat
</button>

</div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h2>BOOK A ROOM</h2>
              <form onSubmit={handleSubmit}>
                <label>Penyelenggara</label>
                <select name="penyelenggara" value={formData.penyelenggara} onChange={handleChange}>
                  <option>Unit Operasi</option>
                  <option>Sistem Informasi</option>
                  <option>Jalan Rel dan Jembatan</option>
                  <option>Unit SDM</option>
                   <option>Keuangan</option>
                    <option>Hukum</option>
                     <option>Listrik Aliran Atas</option>
                      <option>Sarana</option>
                       <option>Sintelis</option>
                       <option>KNA</option>
                        <option>Humas</option>
                         <option>Angkutan Penumpang</option>
                          <option>Bangunan</option>
                           <option>Pengamanan</option>
                            <option>Kesehatan</option>
                             <option>Fasilitas Penumpang</option>
                              <option>Penjagaan Aset</option>
                               <option>PBJ</option>
                </select>

                <label>Nama Rapat</label>
                <input type="text" name="namaRapat" value={formData.namaRapat} onChange={handleChange} />

                <div className="row">
                  <div>
                    <label>Tanggal</label>
                    <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Waktu Mulai</label>
                    <input type="time" name="waktuMulai" value={formData.waktuMulai} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Waktu Selesai</label>
                    <input type="time" name="waktuSelesai" value={formData.waktuSelesai} onChange={handleChange} />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Lokasi</label>
                    <select name="lokasi" value={formData.lokasi} onChange={handleChange}>
                      <option value="1">Lantai 1</option>
                      <option value="2">Lantai 2</option>
                      </select>
                  </div>

                  
                <div className="form-group">
                <label>Ruangan</label>
                <select name="ruangan" value={formData.ruangan} onChange={handleChange}>
                  <option>Batavia</option>
                  <option>Jayakarta</option>
                  <option>Nusantara</option>
                  <option>Sriwijaya</option>
                  <option>Gajah Mada</option>
                  <option>Borneo</option>
                </select>
                </div>
                </div>
                <label>Jenis Rapat</label>
                <div className="row radio">
                  <label><input type="radio" name="jenisRapat" value="Online" checked={formData.jenisRapat === 'Online'} onChange={handleChange} /> Online</label>
                  <label><input type="radio" name="jenisRapat" value="Offline" checked={formData.jenisRapat === 'Offline'} onChange={handleChange} /> Offline</label>
                  <label><input type="radio" name="jenisRapat" value="Hybrid" checked={formData.jenisRapat === 'Hybrid'} onChange={handleChange} /> Hybrid</label>
                </div>
                <label>Jumlah Kapasitas</label>
                <input type="number" name="kapasitas" value={formData.kapasitas} onChange={handleChange} />

                <label>Catatan Tambahan</label>
                <textarea name="catatan" value={formData.catatan} onChange={handleChange}></textarea>

                <div className="row btns">
                  <button type="button" className="email-btn">📩 Sent Via Email</button>
                  <button type="button" onClick={() => setShowPopup(false)}>Batal</button>
                  <button type="submit" className="buat-btn">Buat</button>
                </div>
              </form>
            </div>
          </div>
        )}
          {showBookingOptionPopup && (
          <div className="popup-overlay-option">
            <div className="popup-choice-option">
              <h2>Pilih Jenis Meeting</h2>
              <p>Apakah kamu ingin memulai rapat sekarang atau menjadwalkannya untuk nanti?</p>
              <div className="btns">
                <button
                  onClick={async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, linkMeet: meetingLink })
    });

    if (!response.ok) throw new Error("Gagal menyimpan ke backend");

    console.log("✅ Data disimpan, membuka Google Meet...");
    window.open(meetingLink, "_blank"); // langsung buka Google Meet
    setShowBookingOptionPopup(false);
  } catch (err) {
    console.error("❌ Error saat instant online:", err);
    alert("Gagal menyimpan data online meeting.");
  }
}}


                >
                  Start an Instant Meeting
                </button>
                <button
  onClick={() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      if (!res.ok) {
        // ✅ Tangani error 409: Jadwal bentrok
        if (res.status === 409) {
          return res.json().then(data => {
            alert(data.message); // tampilkan pesan dari backend
            throw new Error(data.message);
          });
        }

        // ❌ Error lainnya
        throw new Error("Gagal booking");
      }
      return res.json();
    })
    .then((data) => {
      alert("✅ Meeting berhasil dijadwalkan!");
      setShowBookingOptionPopup(false);
      navigate("/aktivitas");
    })
    .catch((err) => {
      console.error("❌ Gagal menyimpan ke backend:", err);
      alert("Gagal menyimpan booking: " + err.message);
    });
}}
>
  Create Meeting for Later
</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <aside className="meeting-list">
  <h4>Upcoming Meeting List</h4>
  <div className="list-section">
    {upcomingMeetings.length === 0 ? (
      <p>Tidak ada meeting yang akan datang.</p>
    ) : (
      upcomingMeetings.map((m, i) => (
        <p key={i}>
  <strong>{formatIndoDate(m.tanggal)}, {m.waktuMulai} - {m.waktuSelesai}</strong><br />
  {m.namaRapat}<br />
  {m.penyelenggara}<br />
  Ruangan: {m.ruangan}<br />
  Lokasi: Lantai {m.lokasi}
</p>
      ))
    )}
  </div>

  {/* ✅ POPUP LINK INI HARUS DI LUAR MAP() */}
  {showLinkPopup && (
    <div className="popup-overlay">
      <div className="popup-link-form">
        <h2>Masukkan Link Google Meet</h2>
        <input
          type="text"
          placeholder="https://meet.google.com/abc-defg-hij"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
        />
        <div className="btns">
          <button className="confirm-btn" onClick={handleConfirmLink}>
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  )}
   </aside>
 {showSearchPopup && (
  <div className="popup-overlay">
    <div className="popup-search">
      <button className="close-btn" onClick={() => setShowSearchPopup(false)}>✕</button>
      <div className="popup-header">
        <h2><span className="bold-purple">LET’S FIND</span> YOUR MEETING!</h2>
      </div>

      <h3 className="popup-subtitle">Type The Meeting Name Here!</h3>

      <input 
        type="text" 
        placeholder="Enter meeting name..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button className="search-now-btn" onClick={handleSearch}>Search Now</button>

      {searchResults.length > 0 ? (
        <ul className="search-result-list">
          {searchResults.map((meeting, index) => (
            <li key={index} className="search-result-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{meeting.namaRapat}</strong><br />
                Waktu: {meeting.waktuMulai} - {meeting.waktuSelesai}<br />
                Ruangan: {meeting.ruangan}<br />
                Unit: {meeting.penyelenggara}<br />
                Jenis: {meeting.jenis}<br />
              </div>
              <button className="detail-btn" onClick={() => handleShowDetail(meeting)}>DETAIL</button>
            </li>
          ))}
        </ul> 
      ) : null}
    </div>

  
    {showDetailPopup && selectedMeeting && (
      <div className="popup-detail">
        <div className="popup-card">
          <h2>MEETING INFORMATION</h2>
          <p><strong>Meeting Name:</strong> {selectedMeeting.namaRapat}</p>
          <p><strong>Date:</strong> {selectedMeeting.tanggal}</p>
          <p><strong>Time:</strong> {selectedMeeting.waktuMulai} - {selectedMeeting.waktuSelesai} WIB</p>
          <p><strong>Organizer:</strong> {selectedMeeting.penyelenggara}</p>
          <p><strong>Room:</strong> {selectedMeeting.ruangan}</p>
          <p><strong>Mode:</strong> {selectedMeeting.jenisRapat}</p>
          {selectedMeeting.jenis?.toLowerCase() !== "offline" && selectedMeeting.linkMeet && (
            <a href={selectedMeeting.linkMeet} target="_blank" rel="noopener noreferrer" className="join-link">[Gabung Sekarang]</a>
          )}
          <button className="close-btn-search" onClick={() => setShowDetailPopup(false)}>Find Another Meeting</button>
        </div>
      </div>
      )}
    </div>
  )}
</div>
);
}

export default Dashboard;
