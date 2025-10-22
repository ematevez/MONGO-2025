// datos.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/martes');

const esquemaGenerico = new mongoose.Schema({}, { strict: false });

const colecciones = {
  animales: [
    { nombre: 'León', especie: 'Panthera leo', habitat: 'Sabana', alimentacion: 'Carnívoro', edad: 8 },
    { nombre: 'Elefante', especie: 'Loxodonta africana', habitat: 'Sabana', alimentacion: 'Herbívoro', edad: 25 },
    { nombre: 'Tigre', especie: 'Panthera tigris', habitat: 'Selva', alimentacion: 'Carnívoro', edad: 10 }
  ],
  plantas: [
    { nombre: 'Rosa', especie: 'Rosa rubiginosa', tipo: 'Flor', color: 'Rojo', clima: 'Templado' },
    { nombre: 'Cactus', especie: 'Echinopsis', tipo: 'Suculenta', color: 'Verde', clima: 'Árido' },
    { nombre: 'Helecho', especie: 'Pteridium aquilinum', tipo: 'Follaje', color: 'Verde', clima: 'Húmedo' }
  ],
  vehiculos: [
    { marca: 'Toyota', modelo: 'Corolla', tipo: 'Auto', año: 2020, combustible: 'Nafta' },
    { marca: 'Honda', modelo: 'CBR 500R', tipo: 'Moto', año: 2019, combustible: 'Nafta' },
    { marca: 'Mercedes-Benz', modelo: 'Sprinter', tipo: 'Camioneta', año: 2018, combustible: 'Diésel' }
  ]
};

async function cargarDatos() {
  for (const [nombreColeccion, documentos] of Object.entries(colecciones)) {
    const Modelo = mongoose.model(nombreColeccion, esquemaGenerico, nombreColeccion);
    await Modelo.deleteMany(); // Limpiar primero
    await Modelo.insertMany(documentos);
    console.log(`✔ Datos cargados en ${nombreColeccion}`);
  }
  mongoose.disconnect();
}

cargarDatos();
