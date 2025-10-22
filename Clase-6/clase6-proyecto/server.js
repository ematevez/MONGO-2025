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
mongoose.connect('mongodb://localhost:27017/martes'); //<- cambiar la bddd


// Modelo de Animal
const Animal = mongoose.model('Animal', new mongoose.Schema({
  nombre: String,
  especie: String,
  habitat: String,
  alimentacion: String,
  edad: Number,
}));

// Obtener todos los animales
app.get('/animales', async (req, res) => {
  const animales = await Animal.find();
  res.json(animales);
});

// Agregar nuevo animal
app.post('/animales', async (req, res) => {
  const nuevo = new Animal(req.body);
  await nuevo.save();
  res.json({ mensaje: 'Animal agregado' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
