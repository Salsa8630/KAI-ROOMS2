import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Dengarkan perubahan localStorage → update state auth
  useEffect(() => {
    const checkAuthChange = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    window.addEventListener("storage", checkAuthChange);
    return () => window.removeEventListener("storage", checkAuthChange);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        <Route path="/riwayat-rapat" element={isAuthenticated ? <RiwayatRapat /> : <Navigate to="/login" />} />
        <Route path="/aktivitas" element={isAuthenticated ? <Aktivitas /> : <Navigate to="/login" />} />
        <Route path="/room-status" element={isAuthenticated ? <Roomstatus /> : <Navigate to="/login" />} />
        <Route path="/notifikasi" element={isAuthenticated ? <Notifikasi /> : <Navigate to="/login" />} />
        <Route path="/pengaturan" element={isAuthenticated ? <Pengaturan /> : <Navigate to="/login" />} />
        <Route path="/HybridMeet" element={isAuthenticated ? <HybridMeetingStatus /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
