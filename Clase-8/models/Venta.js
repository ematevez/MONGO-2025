// models/Venta.js
const mongoose = require('mongoose');
const VentaSchema = new mongoose.Schema({
  usuario: String,
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      cantidad: Number
    }
  ],
  total: Number,
  fecha: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Venta', VentaSchema);
