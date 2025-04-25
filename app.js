const path = require('path');
const express = require('express');
const userRoutes = require('./routes/UserRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');
const app = express();

// Routes and Parsing
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve React app
app.all('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});