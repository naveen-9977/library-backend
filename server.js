const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Export for Vercel
module.exports = app;