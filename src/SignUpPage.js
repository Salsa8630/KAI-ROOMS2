import React from 'react';
import './SignUpPage.css';
import illustration from './signupkai.png'; 

function SignUpPage() {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={illustration} alt="Illustration" className="signup-illustration" />
      </div>
      <div className="signup-right">
        <h2>Buat Akun Baru</h2>
        <p className="subtitle">Gabung dengan KAI ROOMS dan mulai kelola rapat online dengan mudah.</p>
        <form className="signup-form">
          <label>Nama</label>
          <input type="text" placeholder="Masukkan Nama" />

          <label>Email</label>
          <input type="email" placeholder="Masukkan Email" />

          <label>Nomor Telepon</label>
          <input type="tel" placeholder="Masukkan Nomor Telepon" />

          <label>Password</label>
          <input type="password" placeholder="Masukkan Password" />

          <div className="terms">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">Saya menyetujui Syarat & Ketentuan</label>
          </div>

          <button type="submit" className="signup-button">Daftar</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;