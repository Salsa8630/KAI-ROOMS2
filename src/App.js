import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SplashScreen from './SplashScreen';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Dashboard from './Dashboard'; 
import RiwayatRapat from './riwayatrapat';
import Aktivitas from './Aktivitas';
import Roomstatus from './Roomstatus';
import Notifikasi from './notifikasi';
import HybridMeetingStatus from './HybridMeetingStatus';
import Pengaturan from './Pengaturan';


function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/riwayat-rapat" element={<RiwayatRapat />} />
        <Route path="aktivitas" element={<Aktivitas />} />
        <Route path="/room-status" element={<Roomstatus />} />
        <Route path="/notifikasi" element={<Notifikasi />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
        <Route path="/HybridMeet" element={<HybridMeetingStatus />} />
      </Routes>
    </Router>
  );
}

export default App;
