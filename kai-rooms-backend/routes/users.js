const express = require("express");
const router = express.Router();
const User = require("../models/users");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const { generateToken, verifyToken } = require("../middleware/auth");

// === Setup multer untuk upload foto ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// === REGISTER ===
router.post("/register", async (req, res) => {
  const { nama, email, telepon, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email sudah terdaftar." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    const newUser = new User({
      nama,
      email,
      telepon,
      password: hashedPassword,
      verificationCode,
      verified: false,
    });

    await newUser.save();

    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Kode Verifikasi KAI ROOMS",
      html: `<p>Halo ${nama},</p><p>Berikut kode verifikasi akun kamu:</p><h2>${verificationCode}</h2>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User terdaftar. Kode verifikasi dikirim ke email.",
      userId: newUser._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mendaftar user." });
  }
});

// === VERIFIKASI KODE ===
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan." });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Kode verifikasi salah." });

    user.verified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: "✅ Verifikasi berhasil! Kamu bisa login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal verifikasi akun." });
  }
});

// === LOGIN MANUAL ===
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email tidak ditemukan." });

    // ❗ Tambahan agar akun Google tidak bisa login manual
    if (user.isGoogleUser) {
      return res.status(403).json({
        message: "Akun ini dibuat dengan Google. Silakan login dengan Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah." });

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Akun belum diverifikasi. Silakan cek email Anda." });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: "✅ Login berhasil!",
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        telepon: user.telepon,
        avatar: user.avatar,
        departemen: user.departemen,
        verified: user.verified,
        isGoogleUser: user.isGoogleUser,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat login." });
  }
});

// === GET USER PROFILE (Protected) ===
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil profil user." });
  }
});

// === UPDATE PROFIL ===
router.put("/update-profile/:id", verifyToken, async (req, res) => {
  const { nama, email, telepon, departemen } = req.body;
  try {
    // Pastikan user hanya bisa update profil sendiri
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { nama, email, telepon, departemen },
      { new: true }
    ).select("-password");

    res.json({ message: "Profil berhasil diperbarui.", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui profil." });
  }
});

// === UPLOAD FOTO AVATAR ===
router.post(
  "/upload-avatar/:id",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // Pastikan user hanya bisa upload avatar sendiri
      if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { avatar: req.file.filename },
        { new: true }
      ).select("-password");

      res.json({
        message: "Foto profil berhasil diunggah.",
        avatar: user.avatar,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal upload foto profil." });
    }
  }
);

module.exports = router;
