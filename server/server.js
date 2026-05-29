const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Smart Timetable API');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/constraints', require('./routes/constraints'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/rooms', require('./routes/rooms'));

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`❌ Server startup failed: ${error.message}`);
  process.exit(1);
});