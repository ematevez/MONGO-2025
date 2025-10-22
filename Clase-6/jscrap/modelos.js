// modelos.js
import mongoose from "mongoose";

// 🛒 Supermercado
const supermercadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  web: String,
});

// 🏷️ Producto
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: Number,
  link: String,
  imagen: String,

  // Relación 1 a 1 (un producto pertenece a un supermercado)
  supermercado: { type: mongoose.Schema.Types.ObjectId, ref: "Supermercado" },

  // Relación 1 a muchos (un producto puede tener muchos comentarios)
  comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comentario" }],

  // Relación muchos a muchos (productos en muchas categorías)
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Categoria" }],
});

// 💬 Comentarios (1 a muchos)
const comentarioSchema = new mongoose.Schema({
  texto: String,
  usuario: String,
  fecha: { type: Date, default: Date.now },
});

// 🏷️ Categorías (muchos a muchos)
const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
});

export const Supermercado = mongoose.model("Supermercado", supermercadoSchema);
export const Producto = mongoose.model("Producto", productoSchema);
export const Comentario = mongoose.model("Comentario", comentarioSchema);
export const Categoria = mongoose.model("Categoria", categoriaSchema);
