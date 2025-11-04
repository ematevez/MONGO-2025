// models/Usuario.js
const mongoose = require('mongoose');
const UsuarioSchema = new mongoose.Schema({
  email: String,
  password: String,
  rol: { type: String, default: 'admin' }
});
module.exports = mongoose.model('Usuario', UsuarioSchema);