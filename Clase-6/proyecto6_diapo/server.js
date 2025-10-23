const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(express.json());
// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/333practica', {
useNewUrlParser: true,
useUnifiedTopology: true,
});

// Definición del modelo
const Libro = mongoose.model('Libro', new mongoose.Schema({
titulo: String,
autor: String,
editorial: [String],
precio: Number,
cantidad: Number,
}));
// Ruta para obtener libros
app.get('/libros', async (req, res) => {
const libros = await Libro.find();
res.json(libros);
});
app.listen(port, () => {
console.log(`Servidor corriendo en http://localhost:${port}`);
});