// db.js
import mongoose from "mongoose";

export async function conectarDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/miercoles");
    console.log("✅ Conectado a MongoDB local");
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
  }
}
