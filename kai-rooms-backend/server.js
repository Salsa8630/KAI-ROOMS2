// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const bookingRoutes = require('./routes/booking'); // 👈 ini rutenya kita import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routing
app.use('/api/booking', bookingRoutes); // 👈 gunakan prefix /api/booking

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

app.use('/api/users', require('./routes/users'));

app.use('/uploads', express.static('uploads'));