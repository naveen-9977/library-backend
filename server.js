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
app.use('/api/books', require('./routes/books.api'));
app.use('/api/issues', require('./routes/issues.api'));
app.use('/api/communications', require('./routes/communications.api'));
app.use('/api/notifications', require('./routes/notifications.api')); // This line is new

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;