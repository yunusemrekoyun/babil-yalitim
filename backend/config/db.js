// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Hatası: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;