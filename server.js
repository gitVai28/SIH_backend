require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const keywordsRoutes = require('./routes/keywords');
const smsRoutes = require('./routes/sms');

// Use routes
app.use('/keywords', keywordsRoutes);
app.use('/sms', smsRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
