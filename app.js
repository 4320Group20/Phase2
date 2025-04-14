const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
