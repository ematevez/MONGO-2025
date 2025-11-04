const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Noviembre_sinti');
    console.log("✔ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error de conexión", err);
    process.exit(1);
  }
};

module.exports = connectDB;
