require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database natively modularly
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Modules
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running dynamically on port ${PORT}`);
});
