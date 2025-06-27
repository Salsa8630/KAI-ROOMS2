import React, { useState, useRef } from 'react';
import './Pengaturan.css';

const Pengaturan = () => {
  const [activeTab, setActiveTab] = useState('profil');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    namaLengkap: 'Salsabilla',
    email: 'Salsa.billa@kai.id',
    departemen: 'Unit Operasi',
    telepon: '+62 812-3456-7890'
  });

  const [notifikasi, setNotifikasi] = useState({
    emailNotifikasi: true,
    pengingatRapat: true,
    updateStatusRuang: false
  });

  const [pengaturanRuang, setPengaturanRuang] = useState({
    kapasitasDefault: '20 orang',
    batalOtomatisKosong: true,
    batasWaktuBooking: '4 jam'
  });

  const [pengaturanSistem, setPengaturanSistem] = useState({
    bahasa: 'Bahasa Indonesia',
    zonaWaktu: 'WIB (UTC+7)',
    modeGelap: false
  });

  const handleUploadAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Harap pilih file gambar');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleKlikAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleHapusAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggle = (kategori, key) => {
    if (kategori === 'notifikasi') {
      setNotifikasi(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (kategori === 'pengaturanRuang') {
      setPengaturanRuang(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (kategori === 'pengaturanSistem') {
      setPengaturanSistem(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleUbahInput = (kategori, key, value) => {
    if (kategori === 'profil') {
      setProfileData(prev => ({ ...prev, [key]: value }));
    } else if (kategori === 'pengaturanRuang') {
      setPengaturanRuang(prev => ({ ...prev, [key]: value }));
    } else if (kategori === 'pengaturanSistem') {
      setPengaturanSistem(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSimpan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Pengaturan berhasil disimpan!');
    }, 1500);
  };

  const handleKembali = () => {
    window.history.back();
  };

  const ToggleSwitch = ({ aktif, onToggle }) => (
    <div
      className={`toggle-switch ${aktif ? 'aktif' : ''}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onToggle(); }}
    >
      <div className="toggle-slider"></div>
    </div>
  );

  const renderKontenTab = () => {
    switch (activeTab) {
      case 'profil':
        return (
          <div className="bagian-pengaturan">
            <h2 className="judul-bagian">👤 Informasi Profil</h2>

            <div className="avatar-container" onClick={handleKlikAvatar}>
              {!avatarPreview ? (
                <div className="avatar-placeholder">
                  📷<div className="teks-unggah">Klik untuk unggah</div>
                </div>
              ) : (
                <img src={avatarPreview} alt="Preview Avatar" className="avatar-preview" />
              )}
            </div>

            <div className="tombol-aksi-avatar">
              <button onClick={handleKlikAvatar} className="btn btn-utama">
                {avatarPreview ? 'Ganti Foto' : 'Unggah Foto'}
              </button>
              {avatarPreview && (
                <button onClick={handleHapusAvatar} className="btn btn-danger">
                  Hapus
                </button>
              )}
            </div>

            <div className="ket-avatar">
              Format yang didukung: JPG, PNG, GIF (maks 5MB)
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadAvatar}
              className="input-file-avatar"
            />

            {[
              { key: 'namaLengkap', label: 'Nama Lengkap', description: 'Nama tampilan Anda', type: 'text', placeholder: 'Masukkan nama lengkap' },
              { key: 'email', label: 'Alamat Email', description: 'Email kerja Anda', type: 'email', placeholder: 'contoh@kai.id' },
              { key: 'departemen', label: 'Departemen / Unit', description: 'Departemen Anda bekerja', type: 'text', placeholder: 'Misal: Unit Operasi' },
              { key: 'telepon', label: 'Nomor Telepon', description: 'Nomor telepon yang aktif', type: 'tel', placeholder: '+62...' }
            ].map(({ key, label, description, type, placeholder }) => (
              <div key={key} className="form-group">
                <label htmlFor={key} className="label-input">{label}</label>
                <div className="desc-input">{description}</div>
                <input
                  id={key}
                  type={type}
                  placeholder={placeholder}
                  value={profileData[key]}
                  onChange={(e) => handleUbahInput('profil', key, e.target.value)}
                  className="input-text"
                />
              </div>
            ))}
          </div>
        );

      case 'notifikasi':
        return (
          <div className="bagian-pengaturan">
            <h2 className="judul-bagian">Notifikasi</h2>
            {Object.entries(notifikasi).map(([key, value]) => {
              const labelMap = {
                emailNotifikasi: 'Notifikasi Email',
                pengingatRapat: 'Pengingat Rapat',
                updateStatusRuang: 'Update Status Ruang'
              };
              const deskripsiMap = {
                emailNotifikasi: 'Terima pemberitahuan melalui email',
                pengingatRapat: 'Dapatkan pengingat sebelum rapat dimulai',
                updateStatusRuang: 'Dapatkan update status ketersediaan ruang'
              };
              return (
                <div key={key} className="toggle-item">
                  <div>
                    <div className="label-toggle">{labelMap[key]}</div>
                    <div className="desc-toggle">{deskripsiMap[key]}</div>
                  </div>
                  <ToggleSwitch
                    aktif={value}
                    onToggle={() => handleToggle('notifikasi', key)}
                  />
                </div>
              );
            })}
          </div>
        );

      case 'pengaturanRuang':
        return (
          <div className="bagian-pengaturan">
            <h2 className="judul-bagian">Pengaturan Ruang</h2>

            <div className="form-group">
              <label htmlFor="kapasitasDefault" className="label-input">Kapasitas Default</label>
              <select
                id="kapasitasDefault"
                value={pengaturanRuang.kapasitasDefault}
                onChange={(e) => handleUbahInput('pengaturanRuang', 'kapasitasDefault', e.target.value)}
                className="select-input"
              >
                {[5, 10, 15, 20, 25, 30].map(n => (
                  <option key={n}>{n} orang</option>
                ))}
              </select>
            </div>

            <div className="toggle-item">
              <div>
                <div className="label-toggle">Batal Otomatis Jika Kosong</div>
                <div className="desc-toggle">Ruang dibatalkan jika tidak ada peserta</div>
              </div>
              <ToggleSwitch
                aktif={pengaturanRuang.batalOtomatisKosong}
                onToggle={() => handleToggle('pengaturanRuang', 'batalOtomatisKosong')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="batasWaktuBooking" className="label-input">Batas Waktu Booking</label>
              <select
                id="batasWaktuBooking"
                value={pengaturanRuang.batasWaktuBooking}
                onChange={(e) => handleUbahInput('pengaturanRuang', 'batasWaktuBooking', e.target.value)}
                className="select-input"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n}>{n} jam</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'pengaturanSistem':
        return (
          <div className="bagian-pengaturan">
            <h2 className="judul-bagian">Pengaturan Sistem</h2>

            <div className="form-group">
              <label htmlFor="bahasa" className="label-input">Bahasa</label>
              <select
                id="bahasa"
                value={pengaturanSistem.bahasa}
                onChange={(e) => handleUbahInput('pengaturanSistem', 'bahasa', e.target.value)}
                className="select-input"
              >
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="zonaWaktu" className="label-input">Zona Waktu</label>
              <select
                id="zonaWaktu"
                value={pengaturanSistem.zonaWaktu}
                onChange={(e) => handleUbahInput('pengaturanSistem', 'zonaWaktu', e.target.value)}
                className="select-input"
              >
                <option>WIB (UTC+7)</option>
                <option>WITA (UTC+8)</option>
                <option>WIT (UTC+9)</option>
              </select>
            </div>

            <div className="toggle-item">
              <div>
                <div className="label-toggle">Mode Gelap</div>
                <div className="desc-toggle">Aktifkan tema gelap</div>
              </div>
              <ToggleSwitch
                aktif={pengaturanSistem.modeGelap}
                onToggle={() => handleToggle('pengaturanSistem', 'modeGelap')}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pengaturan-container">
      <div className="sidebar-pengaturan">
        {['profil', 'notifikasi', 'pengaturanRuang', 'pengaturanSistem'].map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      <div className="konten-pengaturan">
        {renderKontenTab()}

        <div className="tombol-aksi-bawah">
          <button className="btn btn-secondary" onClick={handleKembali}>Kembali</button>
          <button className="btn btn-utama" onClick={handleSimpan} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
