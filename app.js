const path = require('path');
const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/UserRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');
const reportRoutes = require('./routes/ReportRoutes');
const groupRoutes = require('./routes/GroupRoutes');
const accountRoutes = require('./routes/AccountRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const app = express();

// Routes and Parsing
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);

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