// ===== MODELOS (models/) =====
// models/Producto.js
const mongoose = require('mongoose');
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  imagen: String,
  activo: { type: Boolean, default: true }
});
module.exports = mongoose.model('Producto', ProductoSchema);
