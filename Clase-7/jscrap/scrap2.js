// -----------------------------------------------------------
// Clase 10 — MongoDB Relaciones (1 a 1, 1 a muchos, muchos a muchos)
// Ejemplo práctico completo con Mongoose
// -----------------------------------------------------------

// 1️⃣ IMPORTAMOS DEPENDENCIAS
import mongoose from "mongoose";

// -----------------------------------------------------------
// 2️⃣ CONEXIÓN A MONGODB LOCAL
// -----------------------------------------------------------
const conectarDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/clase10_mongo", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB local");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
  }
};

// -----------------------------------------------------------
// 3️⃣ DEFINIMOS LOS ESQUEMAS (MODELOS)
// -----------------------------------------------------------

// 🧱 Supermercado (1 a 1 con producto)
const supermercadoSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
});

// 💬 Comentario (1 a muchos con producto)
const comentarioSchema = new mongoose.Schema({
  autor: String,
  texto: String,
  fecha: { type: Date, default: Date.now },
});

// 🏷️ Categoría (muchos a muchos con producto)
const categoriaSchema = new mongoose.Schema({
  nombre: String,
});

// 🛒 Producto (tiene 1 supermercado, muchos comentarios y muchas categorías)
const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  supermercado: { type: mongoose.Schema.Types.ObjectId, ref: "Supermercado" }, // 1️⃣ a 1
  comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comentario" }], // 1️⃣ a muchos
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Categoria" }], // muchos a muchos
});

// -----------------------------------------------------------
// 4️⃣ CREAMOS LOS MODELOS
// -----------------------------------------------------------
const Supermercado = mongoose.model("Supermercado", supermercadoSchema);
const Comentario = mongoose.model("Comentario", comentarioSchema);
const Categoria = mongoose.model("Categoria", categoriaSchema);
const Producto = mongoose.model("Producto", productoSchema);

// -----------------------------------------------------------
// 5️⃣ FUNCIÓN PRINCIPAL DE PRUEBA
// -----------------------------------------------------------
const main = async () => {
  await conectarDB();

  // 🔄 Limpiamos colecciones anteriores (para pruebas)
  await Supermercado.deleteMany({});
  await Comentario.deleteMany({});
  await Categoria.deleteMany({});
  await Producto.deleteMany({});

  console.log("🧹 Base de datos limpia para nueva prueba.");

  // 🏪 Creamos un supermercado
  const super1 = await Supermercado.create({
    nombre: "Supermercado Verde",
    direccion: "Av. Siempre Viva 123",
  });

  // 💬 Creamos algunos comentarios
  const com1 = await Comentario.create({
    autor: "Juan",
    texto: "Excelente calidad y frescura!",
  });
  const com2 = await Comentario.create({
    autor: "María",
    texto: "Un poco caro, pero vale la pena.",
  });

  // 🏷️ Creamos categorías
  const cat1 = await Categoria.create({ nombre: "Verduras" });
  const cat2 = await Categoria.create({ nombre: "Orgánicos" });

  // 🛒 Creamos un producto con relaciones
  const producto = await Producto.create({
    nombre: "Lechuga",
    precio: 150,
    supermercado: super1._id, // 1 a 1
    comentarios: [com1._id, com2._id], // 1 a muchos
    categorias: [cat1._id, cat2._id], // muchos a muchos
  });

  console.log("✅ Producto guardado correctamente.");

  // -----------------------------------------------------------
  // 6️⃣ CONSULTAMOS USANDO populate()
  // -----------------------------------------------------------
  const productos = await Producto.find()
    .populate("supermercado") // trae los datos del supermercado
    .populate("comentarios") // trae los datos de los comentarios
    .populate("categorias"); // trae los datos de las categorías

  console.log("\n📦 Resultado completo con populate():");
  console.log(JSON.stringify(productos, null, 2));

  // -----------------------------------------------------------
  // 7️⃣ CERRAMOS CONEXIÓN
  // -----------------------------------------------------------
  await mongoose.connection.close();
  console.log("\n🔒 Conexión a MongoDB cerrada.");
};

// -----------------------------------------------------------
// 8️⃣ EJECUTAMOS EL SCRIPT
// -----------------------------------------------------------
main();
