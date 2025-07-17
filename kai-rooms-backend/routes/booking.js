const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const nodemailer = require('nodemailer');

// 🔥 Fungsi bantu untuk ubah jam ke menit
const toMinutes = (timeStr) => {
  const [hour, minute] = timeStr.split(':').map(Number);
  return hour * 60 + minute;
};

// POST /api/booking
router.post('/', async (req, res) => {
  try {
    const {
      penyelenggara,
      namaRapat,
      tanggal,
      waktuMulai,
      waktuSelesai,
      lokasi,
      ruangan,
      jenisRapat,
      kapasitas,
      catatan,
      linkMeet
    } = req.body;

    const startNew = toMinutes(waktuMulai);
    const endNew = toMinutes(waktuSelesai);

    // 🔍 Logging awal
    console.log("=== DEBUG BOOKING ===");
    console.log("Tanggal:", tanggal);
    console.log("Ruangan:", ruangan);
    console.log("Waktu baru:", waktuMulai, "-", waktuSelesai);

    // Ambil semua booking di tanggal dan ruangan yang sama (case-insensitive)
    const existing = await Booking.find({
      tanggal: tanggal.trim(),
      ruangan: new RegExp(`^${ruangan.trim()}$`, 'i')
    });

    console.log("Jumlah booking yang ditemukan:", existing.length);

    // Cek apakah ada bentrok waktu
   // Cek apakah ada bentrok waktu
const bentrok = existing.some(booking => {
  // ✅ Skip validasi bentrok kalau salah satu meeting adalah Online
  if (jenisRapat === "Online" || booking.jenisRapat === "Online") {
    console.log("✅ Lewat karena Online meeting");
    return false;
  }

  const startOld = toMinutes(booking.waktuMulai);
  const endOld = toMinutes(booking.waktuSelesai);
  const isOverlap = startNew < endOld && startOld < endNew;

  console.log("→ Cek bentrok:");
  console.log(`   Booking lama: ${booking.waktuMulai}-${booking.waktuSelesai} (${startOld}-${endOld})`);
  console.log(`   Booking baru: ${waktuMulai}-${waktuSelesai} (${startNew}-${endNew})`);
  console.log(`   Overlap: ${isOverlap}`);

  return isOverlap;
});


    if (bentrok) {
      console.log("❌ BENTROK TERDETEKSI");
      return res.status(409).json({
        message: '❌ Jadwal bentrok. Ruangan sudah dibooking pada waktu tersebut.'
      });
    }

    // Jika tidak bentrok → simpan
    const newBooking = new Booking({
      penyelenggara,
      namaRapat,
      tanggal,
      waktuMulai,
      waktuSelesai,
      lokasi,
      ruangan,
      jenisRapat,
      kapasitas,
      catatan,
      linkMeet
    });

    await newBooking.save();
    console.log("✅ Booking berhasil disimpan!");
    res.status(201).json({ message: '✅ Booking berhasil disimpan!', data: newBooking });

  } catch (error) {
    console.error('🔥 ERROR booking:', error);
    res.status(500).json({ message: 'Gagal menyimpan booking' });
  }
});

// GET /api/booking
router.get('/', async (req, res) => {
  try {
    const allBooking = await Booking.find();
    res.json(allBooking);
  } catch (error) {
    console.error("🔥 ERROR get bookings:", error);
    res.status(500).json({ message: 'Gagal mengambil data booking' });
  }
});
// POST /api/send-invite
router.post('/send-invite', async (req, res) => {
  const {
    namaRapat,
    tanggal,
    waktuMulai,
    waktuSelesai,
    linkMeet,
    emailUndangan
  } = req.body;

  const recipients = emailUndangan.split(',').map(email => email.trim());

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"KAI ROOMS" <${process.env.EMAIL_SENDER}>`,
    to: recipients,
    subject: `Undangan Rapat: ${namaRapat}`,
    html: `
      <h3>Undangan Rapat</h3>
      <p><strong>Judul:</strong> ${namaRapat}</p>
      <p><strong>Tanggal:</strong> ${tanggal}</p>
      <p><strong>Waktu:</strong> ${waktuMulai} - ${waktuSelesai}</p>
      <p><strong>Link Google Meet:</strong> <a href="${linkMeet}">${linkMeet}</a></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email undangan berhasil dikirim ke:", recipients);
    res.status(200).json({ message: "Email terkirim!" });
  } catch (error) {
    console.error("❌ Gagal kirim email:", error);
    res.status(500).json({ message: "Gagal kirim email." });
  }
});

module.exports = router;
