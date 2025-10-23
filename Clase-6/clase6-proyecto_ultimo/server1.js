// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/miercoles');

// Esquema flexible (dinámico)
const esquemaGenerico = new mongoose.Schema({}, { strict: false });

// Ruta para obtener datos de cualquier colección
app.get('/api/coleccion/:nombre', async (req, res) => {
  const { nombre } = req.params;
  const Modelo = mongoose.model(nombre, esquemaGenerico, nombre);
  const datos = await Modelo.find();
  res.json(datos);
});

// Ruta para insertar en cualquier colección
app.post('/api/coleccion/:nombre', async (req, res) => {
  const { nombre } = req.params;
  const Modelo = mongoose.model(nombre, esquemaGenerico, nombre);
  const nuevo = new Modelo(req.body);
  await nuevo.save();
  res.json({ mensaje: `Registro agregado a ${nombre}` });
});

// Página principal (index1.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index1.html'));
});

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
