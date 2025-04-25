const mongoose = require('mongoose');

const uri = "mongodb+srv://Group20User:u4paFqOu5IlLKfhP@group20project2.5c7ahvg.mongodb.net/?retryWrites=true&w=majority&appName=Group20Project2";

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
