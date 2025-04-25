const path = require('path');
const express = require('express');
const userRoutes = require('./routes/UserRoutes');
const db = require('./db');
const app = express();

// Connect to database
db();

// Routes and Parsing
app.use('/api/users', userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});