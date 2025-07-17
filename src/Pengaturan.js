import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Pengaturan.css';

const Pengaturan = () => {
  const [activeTab, setActiveTab] = useState('profil');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null); 
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [profileData, setProfileData] = useState({
  namaLengkap: '',
  email: '',
  departemen: '',
  telepon: '',
  avatar: null
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
// 2. Saat pertama kali buka halaman → ambil dari localStorage
useEffect(() => {
  const savedMode = localStorage.getItem("modeGelap") === "true";
  setPengaturanSistem(prev => ({
    ...prev,
    modeGelap: savedMode
  }));
}, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("bahasa");
    if (savedLang === 'en' || savedLang === 'id') {
      i18n.changeLanguage(savedLang);
    }
  }, []);

// 3. Setel dark-mode ke body dan simpan lagi ke localStorage
useEffect(() => {
  const savedMode = localStorage.getItem("modeGelap") === "true";
  
  // ✅ Update state jika berbeda
  setPengaturanSistem(prev => ({
    ...prev,
    modeGelap: savedMode
  }));

  // ✅ Atur class body
  if (savedMode) {
    document.body.classList.add("dark-mode-warna");
  } else {
    document.body.classList.remove("dark-mode-warna");
  }
}, [location.pathname]);

  
  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    setProfileData({
      namaLengkap: storedUser.nama || '',
      email: storedUser.email || '',
      departemen: storedUser.departemen || '',
      telepon: storedUser.telepon || '',
      avatar: storedUser.avatar || null
    });

    // 👇 Ini untuk langsung preview avatar dari backend
    if (storedUser.avatar) {
      setAvatarPreview(`${process.env.REACT_APP_API_URL}/uploads/${storedUser.avatar}`);
    }
  }
}, []);


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

      setAvatarFile(file);
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
    const newValue = !pengaturanSistem[key];

    setPengaturanSistem(prev => ({ ...prev, [key]: newValue }));

    // ✅ Tambahkan logika dark mode langsung
    if (key === 'modeGelap') {
      if (newValue) {
        document.body.classList.add('dark-mode-warna');
        localStorage.setItem('modeGelap', 'true');
      } else {
        document.body.classList.remove('dark-mode-warna');
        localStorage.setItem('modeGelap', 'false');
      }
    }
  }
};


 const handleUbahInput = (kategori, key, value) => {
  if (kategori === 'profil') {
    setProfileData(prev => ({ ...prev, [key]: value }));
  } else if (kategori === 'pengaturanRuang') {
    setPengaturanRuang(prev => ({ ...prev, [key]: value }));
  } else if (kategori === 'pengaturanSistem') {
    setPengaturanSistem(prev => ({ ...prev, [key]: value }));

    // ✅ Tambahan: ubah bahasa saat dropdown bahasa dipilih
    if (key === 'bahasa') {
      const selectedLang = value === 'English' ? 'en' : 'id';
      i18n.changeLanguage(selectedLang);
      localStorage.setItem('bahasa', selectedLang);
    }
  }
};


 const handleSimpan = async () => {
  setIsLoading(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  let updatedUser = null;

  try {
    // 1. Simpan data profil ke backend
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update-profile/${storedUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: profileData.namaLengkap,
        email: profileData.email,
        telepon: profileData.telepon,
        departemen: profileData.departemen
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || '❌ Gagal menyimpan pengaturan.');
      setIsLoading(false);
      return;
    }

    // Simpan hasil update sementara
    updatedUser = data.user;

    // 2. Upload avatar jika ada
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const avatarRes = await fetch(`${process.env.REACT_APP_API_URL}/api/users/upload-avatar/${storedUser._id}`, {
        method: 'POST',
        body: formData
      });

      const avatarData = await avatarRes.json();

      if (avatarRes.ok && avatarData.avatar) {
        updatedUser.avatar = avatarData.avatar;
      } else {
        alert(avatarData.message || '❌ Gagal upload foto profil.');
      }
    }

    // 3. Update localStorage dengan data terbaru (termasuk avatar & departemen)
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // 4. Update state di form
    setProfileData(prev => ({
      ...prev,
      namaLengkap: updatedUser.nama || '',
      email: updatedUser.email || '',
      telepon: updatedUser.telepon || '',
      departemen: updatedUser.departemen || '',
      avatar: updatedUser.avatar || prev.avatar
    }));

    alert('✅ Pengaturan berhasil disimpan!');
  } catch (err) {
    console.error(err);
    alert('❌ Terjadi kesalahan saat menyimpan.');
  } finally {
    setIsLoading(false);
  }
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
  if (activeTab === 'profil') {
    return (
      <div className="bagian-pengaturan">
        <h2 className="judul-bagian">👤 Informasi Profil</h2>
        <div className="avatar-container" onClick={handleKlikAvatar}>
          {!avatarPreview ? (
            <div className="avatar-placeholder">📷<div className="teks-unggah">Klik untuk unggah</div></div>
          ) : (
            <img src={avatarPreview} alt="Preview Avatar" className="avatar-preview" />
          )}
        </div>
        <div className="tombol-aksi-avatar">
          <button onClick={handleKlikAvatar} className="btn btn-utama">
            {avatarPreview ? 'Ganti Foto' : 'Unggah Foto'}
          </button>
          {avatarPreview && (
            <button onClick={handleHapusAvatar} className="btn btn-danger">Hapus</button>
          )}
        </div>
        <div className="ket-avatar">Format yang didukung: JPG, PNG, GIF (maks 5MB)</div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadAvatar} className="input-file-avatar" />
        {[{ key: 'namaLengkap', label: 'Nama Lengkap', description: 'Nama tampilan Anda', type: 'text', placeholder: 'Masukkan nama lengkap' },
          { key: 'email', label: 'Alamat Email', description: 'Email kerja Anda', type: 'email', placeholder: 'contoh@kai.id' },
          { key: 'departemen', label: 'Departemen / Unit', description: 'Departemen Anda bekerja', type: 'text', placeholder: 'Misal: Unit Operasi' },
          { key: 'telepon', label: 'Nomor Telepon', description: 'Nomor telepon yang aktif', type: 'tel', placeholder: '+62...' }].map(({ key, label, description, type, placeholder }) => (
          <div key={key} className="form-group">
            <label htmlFor={key} className="label-input">{label}</label>
            <div className="desc-input">{description}</div>
            <input id={key} type={type} placeholder={placeholder} value={profileData[key]} onChange={(e) => handleUbahInput('profil', key, e.target.value)} className="input-text" />
          </div>
        ))}
      </div>
    );
  }
  return null;
};


  return (
    <div className="pengaturan-container">
      <div className="sidebar-pengaturan">
            <button className={`tab-button ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')}>
              Profil
          </button>
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
