import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./LoginPage.css";
import illustration from "./KAI_ROOMS_illustration.png";
import googleLogo from "./google-logo.png";
import microsoftLogo from "./microsoft-logo.png";

function LoginPage() {
  const navigate = useNavigate(); 

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={illustration} alt="KAI ROOMS" className="illustration" />
        <p className="tagline">
          Kelola dan ikuti rapat online dengan mudah di platform meeting resmi dari KAI.
        </p>
      </div>

      <div className="login-right">
        <h2>Masuk ke Akun Anda</h2>
        <p className="subtitle">
          Kelola rapat online dengan mudah dan tetap produktif bersama KAI ROOMS.
        </p>
        <input type="email" placeholder="Masukkan Email" className="input" />
        <input type="password" placeholder="Masukkan Password" className="input" />

        <div className="options">
          <label className="remember">
            <input type="checkbox" />
            Ingat Saya
          </label>
          <a href="#" className="forgot">Forgot password</a>
        </div>

        <button className="btn-login" onClick={() => navigate("/dashboard")}>Masuk</button>
        <button className="btn-google">
          <img src={googleLogo} alt="Google Logo" style={{ width: '20px', marginRight: '10px' }} />
          Sign in with Google
        </button>
        <button className="btn-microsoft">
          <img src={microsoftLogo} alt="Microsoft Logo" style={{ width: '20px', marginRight: '10px' }} />
          Sign in with Microsoft
        </button>

        <p className="register">
          Belum punya akun?{" "}
          <Link to="/signup" className="link" style={{ color: 'blue' }}>
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
