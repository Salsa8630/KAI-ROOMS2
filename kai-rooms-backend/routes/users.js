const express = require('express');
const router = express.Router();
const User = require('../models/users');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // ✅ pakai client ID dari .env

// === Setup multer untuk upload foto ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { nama, email, telepon, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email sudah terdaftar.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const newUser = new User({
      nama,
      email,
      telepon,
      password: hashedPassword,
      verificationCode,
      verified: false,
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Kode Verifikasi KAI ROOMS',
      html: `<p>Halo ${nama},</p><p>Berikut kode verifikasi akun kamu:</p><h2>${verificationCode}</h2>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'User terdaftar. Kode verifikasi dikirim ke email.',
      userId: newUser._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mendaftar user.' });
  }
});

// === VERIFIKASI KODE ===
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: 'Kode verifikasi salah.' });

    user.verified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: '✅ Verifikasi berhasil! Kamu bisa login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal verifikasi akun.' });
  }
});

// === LOGIN MANUAL ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan.' });

    // ❗ Tambahan agar akun Google tidak bisa login manual
    if (user.isGoogleUser) {
      return res.status(403).json({ message: 'Akun ini dibuat dengan Google. Silakan login dengan Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah.' });

    if (!user.verified) {
      return res.status(403).json({ message: 'Akun belum diverifikasi. Silakan cek email Anda.' });
    }

    res.json({ message: '✅ Login berhasil!', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat login.' });
  }
});

// === LOGIN VIA GOOGLE ===
router.post('/google-login', async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("🔑 ENV CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        nama: name,
        email,
        password: null,
        avatar: picture,
        verified: true,
        isGoogleUser: true,
      });
      await user.save();
    }

    res.json({ message: '✅ Login Google berhasil!', user });
  } catch (err) {
    console.error('❌ Error Google login:', err);
    res.status(500).json({ message: 'Login Google gagal.' });
  }
});

// === UPDATE PROFIL ===
router.put('/update-profile/:id', async (req, res) => {
  const { nama, email, telepon, departemen } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { nama, email, telepon, departemen },
      { new: true }
    );
    res.json({ message: 'Profil berhasil diperbarui.', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui profil.' });
  }
});

// === UPLOAD FOTO AVATAR ===
router.post('/upload-avatar/:id', upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: req.file.filename },
      { new: true }
    );
    res.json({ message: 'Foto profil berhasil diunggah.', avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal upload foto profil.' });
  }
});

module.exports = router;
