// datos.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/miercoles');

const Animal = mongoose.model('Animal', new mongoose.Schema({
  nombre: String,
  especie: String,
  habitat: String,
  alimentacion: String,
  edad: Number,
}));

const animales = [
  { nombre: 'León', especie: 'Panthera leo', habitat: 'Sabana', alimentacion: 'Carnívoro', edad: 8 },
  { nombre: 'Elefante', especie: 'Loxodonta africana', habitat: 'Sabana', alimentacion: 'Herbívoro', edad: 25 },
  { nombre: 'Pingüino', especie: 'Aptenodytes forsteri', habitat: 'Antártida', alimentacion: 'Carnívoro', edad: 10 },
  { nombre: 'Tigre', especie: 'Panthera tigris', habitat: 'Selva', alimentacion: 'Carnívoro', edad: 12 },
  { nombre: 'Cebra', especie: 'Equus quagga', habitat: 'Sabana', alimentacion: 'Herbívoro', edad: 6 },
  { nombre: 'Oso Polar', especie: 'Ursus maritimus', habitat: 'Ártico', alimentacion: 'Carnívoro', edad: 14 },
  { nombre: 'Ornitorrinco', especie: 'Ornithorhynchus anatinus', habitat: 'Ríos australianos', alimentacion: 'Carnívoro', edad: 5 },
  { nombre: 'Cóndor', especie: 'Vultur gryphus', habitat: 'Montañas', alimentacion: 'Carroñero', edad: 50 },
  { nombre: 'Koala', especie: 'Phascolarctos cinereus', habitat: 'Bosques de eucalipto', alimentacion: 'Herbívoro', edad: 13 },
  { nombre: 'Tortuga', especie: 'Chelonia mydas', habitat: 'Océano', alimentacion: 'Omnívoro', edad: 80 },
];

Animal.insertMany(animales).then(() => {
  console.log('Animales insertados');
  mongoose.disconnect();
});
