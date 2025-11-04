// -----------------------------------------------------------
// Clase 10 — MongoDB Relaciones + Entrada por consola
// -----------------------------------------------------------

import mongoose from "mongoose";
import readline from "readline";

// -----------------------------------------------------------
// 1️⃣ CONEXIÓN A MONGODB LOCAL
// -----------------------------------------------------------
const conectarDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mercado", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB local");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
  }
};

// -----------------------------------------------------------
// 2️⃣ DEFINICIÓN DE ESQUEMAS
// -----------------------------------------------------------
const supermercadoSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
});

const comentarioSchema = new mongoose.Schema({
  autor: String,
  texto: String,
  fecha: { type: Date, default: Date.now },
});

const categoriaSchema = new mongoose.Schema({
  nombre: String,
});

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  supermercado: { type: mongoose.Schema.Types.ObjectId, ref: "Supermercado" },
  comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comentario" }],
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Categoria" }],
});

// -----------------------------------------------------------
// 3️⃣ CREAMOS LOS MODELOS
// -----------------------------------------------------------
const Supermercado = mongoose.model("Supermercado", supermercadoSchema);
const Comentario = mongoose.model("Comentario", comentarioSchema);
const Categoria = mongoose.model("Categoria", categoriaSchema);
const Producto = mongoose.model("Producto", productoSchema);

// -----------------------------------------------------------
// 4️⃣ FUNCIÓN PARA LEER DESDE CONSOLA
// -----------------------------------------------------------
const preguntar = (texto) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(texto, (respuesta) => {
      rl.close();
      resolve(respuesta.trim());
    })
  );
};

// -----------------------------------------------------------
// 5️⃣ FUNCIÓN PRINCIPAL
// -----------------------------------------------------------
const main = async () => {
  await conectarDB();

  const nombreProducto = await preguntar("🛒 ¿Qué producto buscás?: ");
  const precioRandom = Math.floor(Math.random() * 1000) + 100; // precio simulado

  // 🧹 Limpiamos colecciones previas
  await Supermercado.deleteMany({});
  await Comentario.deleteMany({});
  await Categoria.deleteMany({});
  await Producto.deleteMany({});

  // 🏪 Creamos supermercado
  const super1 = await Supermercado.create({
    nombre: "Coto Digital",
    direccion: "Av. Cabildo 999",
  });

  // 💬 Creamos comentarios
  const com1 = await Comentario.create({
    autor: "Juan",
    texto: "Producto con buena relación precio-calidad.",
  });
  const com2 = await Comentario.create({
    autor: "Ana",
    texto: "A veces está en oferta, conviene.",
  });

  // 🏷️ Creamos categorías
  const cat1 = await Categoria.create({ nombre: "Alimentos" });
  const cat2 = await Categoria.create({ nombre: "Granos" });

  // 🛍️ Creamos producto con relaciones
  const producto = await Producto.create({
    nombre: nombreProducto,
    precio: precioRandom,
    supermercado: super1._id,
    comentarios: [com1._id, com2._id],
    categorias: [cat1._id, cat2._id],
  });

  console.log(`✅ Producto "${nombreProducto}" guardado correctamente.\n`);

  // 🔍 Consultamos con populate
  const resultado = await Producto.find()
    .populate("supermercado")
    .populate("comentarios")
    .populate("categorias");

  console.log("📦 Resultado completo:");
  console.log(JSON.stringify(resultado, null, 2));

  await mongoose.connection.close();
  console.log("🔒 Conexión cerrada.");
};

// -----------------------------------------------------------
// 6️⃣ EJECUTAMOS
// -----------------------------------------------------------
main();
