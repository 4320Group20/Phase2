const mongoose = require('mongoose');

const uri = "";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`Successfully connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
