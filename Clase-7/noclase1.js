const mongoose = require('mongoose');
const axios = require('axios');
const readline = require('readline-sync');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ==== CONEXIÓN MONGODB ====
mongoose.connect('mongodb://localhost:27017/fakeapiMenu', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ==== CONEXIÓN SQLITE ====
const dbPath = path.resolve(__dirname, 'compras.db');
const sqlite = new sqlite3.Database(dbPath);

// Crear tabla si no existe
sqlite.serialize(() => {
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS compras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT,
      producto TEXT,
      precio REAL,
      fecha TEXT
    )
  `);
});

// ==== MODELOS MONGOOSE ====
const UsuarioSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  rol: { type: String, default: 'usuario' }
});

const ProductoSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: String,
  description: String,
  image: String
});

const CompraSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  fecha: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Producto = mongoose.model('Producto', ProductoSchema);
const Compra = mongoose.model('Compra', CompraSchema);

// ==== FUNCIÓN PRINCIPAL ====
mongoose.connection.once('open', async () => {
  // CARGAR DATOS SI LA BD ESTÁ VACÍA
  const usuariosCount = await Usuario.countDocuments();
  if (usuariosCount === 0) {
    console.log("⬇️ Cargando datos iniciales...");
    const usuariosAPI = await axios.get('https://fakestoreapi.com/users');
    const productosAPI = await axios.get('https://fakestoreapi.com/products');

    for (const u of usuariosAPI.data) {
      await Usuario.create({
        email: u.email,
        username: u.username,
        password: u.password,
        rol: u.username === 'johnd' ? 'admin' : 'usuario'
      });
    }

    for (const p of productosAPI.data) {
      await Producto.create({
        title: p.title,
        price: p.price,
        category: p.category,
        description: p.description,
        image: p.image
      });
    }

    console.log("✅ Datos cargados en MongoDB.");
  }

  // === LOGIN DE USUARIO ===
  const usuarios = await Usuario.find();
  console.log("=== Lista de usuarios ===");
  usuarios.forEach((u, i) => {
    console.log(`${i + 1}. ${u.username} (${u.rol})`);
  });

  const idx = readline.questionInt("\nElegí un usuario por número: ") - 1;
  const usuario = usuarios[idx];
  console.log(`\n👤 Bienvenido, ${usuario.username}\n`);

  // === MENÚ PRINCIPAL ===
  let salir = false;

  while (!salir) {
    console.log("\n=== Menú Principal ===");
    console.log("1. Ver productos");
    console.log("2. Comprar productos");
    console.log("3. Ver mis compras");
    if (usuario.rol === 'admin') console.log("4. Ver todas las compras (Admin)");
    console.log("0. Cerrar sesión");

    const opcion = readline.question("Elegí una opción: ");

    switch (opcion) {
      case '1': {
        let back = false;
        while (!back) {
          const productos = await Producto.find();
          console.log("\n📦 Productos disponibles:");
          productos.forEach((p, i) => {
            console.log(`${i + 1}. ${p.title} - $${p.price}`);
          });
          console.log("0. Volver al menú principal");
          const input = readline.question("Presioná 0 para volver: ");
          if (input === '0') back = true;
        }
        break;
      }

      case '2': {
        let back = false;
        while (!back) {
          const productos = await Producto.find();
          console.log("\n🛍 Productos disponibles:");
          productos.forEach((p, i) => {
            console.log(`${i + 1}. ${p.title} - $${p.price}`);
          });
          console.log("0. Volver al menú principal");
          const prodInput = readline.question("Elegí producto por número o 0 para volver: ");
          if (prodInput === '0') {
            back = true;
          } else {
            const prodIdx = parseInt(prodInput) - 1;
            if (prodIdx >= 0 && prodIdx < productos.length) {
              const prodElegido = productos[prodIdx];
              await Compra.create({
                usuario_id: usuario._id,
                producto_id: prodElegido._id
              });

              // Guardar también en SQLite
              sqlite.run(`
                INSERT INTO compras (usuario, producto, precio, fecha)
                VALUES (?, ?, ?, datetime('now'))
              `, [usuario.username, prodElegido.title, prodElegido.price]);

              console.log(`✅ Compra registrada y guardada: ${prodElegido.title}`);
            } else {
              console.log("❌ Producto no válido.");
            }
          }
        }
        break;
      }

      case '3': {
        const compras = await Compra.find({ usuario_id: usuario._id }).populate('producto_id');
        console.log("\n🧾 Tus compras:");
        if (compras.length === 0) {
          console.log("🔍 No hiciste ninguna compra.");
        } else {
          compras.forEach(c => {
            console.log(`- ${c.producto_id.title} - $${c.producto_id.price}`);
          });
        }
        readline.question("\n🔙 ENTER para volver al menú...");
        break;
      }

      case '4': {
        if (usuario.rol !== 'admin') {
          console.log("❌ No tenés permisos.");
          break;
        }
        const allCompras = await Compra.find().populate('usuario_id').populate('producto_id');
        if (allCompras.length === 0) {
          console.log("📭 No hay compras registradas.");
        } else {
          console.log("\n📋 TODAS LAS COMPRAS:");
          allCompras.forEach(c => {
            console.log(`🧑 ${c.usuario_id.username} compró ${c.producto_id.title} - $${c.producto_id.price}`);
          });
        }
        readline.question("\n🔙 ENTER para volver al menú...");
        break;
      }

      case '0':
        salir = true;
        console.log("👋 Cerrando sesipn. ¡Hasta la próxima!");
        break;

      default:
        console.log("❌ Opción invalida.");
    }
  }

  mongoose.connection.close();
  sqlite.close();
});
