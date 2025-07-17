import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import illustration from "./KAI_ROOMS_illustration.png";
import googleLogo from "./google-logo.png";
import microsoftLogo from "./microsoft-logo.png";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("🔵 Response dari login:", data);

    if (!res.ok) {
      setPopupMessage(data.message || "❌ Gagal login. Coba lagi.");
      setShowPopup(true);
      return;
    }

    if (!data.user?.verified) {
      setPopupMessage("⚠️ Akun kamu belum diverifikasi.");
      setShowPopup(true);
      return;
    }

    // ✅ Simpan user & trigger manual storage event
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Trigger event agar App.js detect perubahan
    window.dispatchEvent(new Event("storage"));

    console.log("✅ Navigating to dashboard...");
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    setPopupMessage("❌ Terjadi kesalahan saat login.");
    setShowPopup(true);
  }
};

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

        <input
          type="email"
          placeholder="Masukkan Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Masukkan Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="options">
          <label className="remember">
            <input type="checkbox" />
            Ingat Saya
          </label>
          <a href="#" className="forgot">Forgot password</a>
        </div>

        <button className="btn-login" onClick={handleLogin}>Masuk</button>

        <div className="btn-google">
          <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setPopupMessage(data.message || "❌ Gagal login via Google.");
        setShowPopup(true);
      }
    } catch (err) {
      console.error(err);
      setPopupMessage("❌ Terjadi kesalahan login Google.");
      setShowPopup(true);
    }
  }}
  onError={() => {
    console.log("❌ Login Google gagal");
    setPopupMessage("❌ Login Google gagal.");
    setShowPopup(true);
  }}
  useOneTap={false} // opsional, biar nggak muncul login pop-up otomatis
  theme="outline"
  text="signin_with"
  shape="rectangular"
/>
</div>

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

        {showPopup && (
          <div className="popup-verifikasi-signup">
            <h3>Login Gagal</h3>
            <p>{popupMessage}</p>
            <button className="signup-button" onClick={() => setShowPopup(false)}>Tutup</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
