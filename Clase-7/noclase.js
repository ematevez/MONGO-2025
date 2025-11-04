// npm init -y
// npm install mongoose axios readline-sync
// npm install sqlite3

const mongoose = require('mongoose');
const axios = require('axios');
const readline = require('readline-sync');

// 📦 MODELOS
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

// 🚀 FUNCIÓN PRINCIPAL
mongoose.connect('mongodb://localhost:27017/NoviembreCompra', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => iniciarApp());

async function iniciarApp() {
  // CARGA INICIAL
  await Usuario.deleteMany();
  await Producto.deleteMany();
  await Compra.deleteMany();

  const usuariosAPI = await axios.get('https://fakestoreapi.com/users');
  const productosAPI = await axios.get('https://fakestoreapi.com/products');

  for (const u of usuariosAPI.data) {
    await Usuario.create({
      email: u.email,
      username: u.username,
      password: u.password,
      rol: u.username === 'johnd' ? 'admin' : 'usuario' // solo uno es admin
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

  console.log("\n✅ Datos cargados correctamente.\n");

  // LOGIN DE USUARIO
  const usuarios = await Usuario.find();
  console.log("=== Lista de usuarios ===");
  usuarios.forEach((u, i) => {
    console.log(`${i + 1}. ${u.username} (${u.rol})`);
  });

  const idx = readline.questionInt("\nSeleccionar un usuario: ") - 1;
  const usuario = usuarios[idx];
  console.log(`\n👤 Bienvenido, ${usuario.username}\n`);

  // MENÚ INTERACTIVO
  let salir = false;

while (!salir) {
  console.log("\n=== MenU ===");
  console.log("1. Ver productos");
  console.log("2. Comprar un producto");
  console.log("3. Ver mis compras");
  if (usuario.rol === 'admin') console.log("4. Ver todas las compras");
  console.log("0. Salir");

  const opcion = readline.question("Selecciona una: ");

  switch (opcion) {
    case '1': {
      const productos = await Producto.find();
      console.log("\n📦 Productos disponibles:");
      productos.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - $${p.price}`);
      });
      break;
    }

    case '2': {
      const productos = await Producto.find();
      console.log("\n🛍 Productos disponibles:");
      productos.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - $${p.price}`);
      });

      const prodIdx = readline.questionInt("Elegir producto por numero: ") - 1;

      if (prodIdx >= 0 && prodIdx < productos.length) {
        const prodElegido = productos[prodIdx];
        await Compra.create({
          usuario_id: usuario._id,
          producto_id: prodElegido._id
        });
        console.log(`✅ Compra registrada: ${prodElegido.title}`);
      } else {
        console.log("❌ Producto no volido.");
      }
      break;
    }

    case '3': {
      const compras = await Compra.find({ usuario_id: usuario._id }).populate('producto_id');
      if (compras.length === 0) {
        console.log("\n🔍 No hiciste ninguna compra.");
      } else {
        console.log("\n🧾 Tus compras:");
        compras.forEach(c => {
          console.log(`- ${c.producto_id.title} - $${c.producto_id.price}`);
        });
      }
      break;
    }

    case '4': {
      if (usuario.rol !== 'admin') {
        console.log("❌ Sin permisos para ver esto.");
        break;
      }

      const allCompras = await Compra.find().populate('usuario_id').populate('producto_id');
      if (allCompras.length === 0) {
        console.log("\n📭 No hay compras registradas.");
      } else {
        console.log("\n📋 TODAS LAS COMPRAS:");
        allCompras.forEach(c => {
          console.log(`🧑 ${c.usuario_id.username} compro ${c.producto_id.title} - $${c.producto_id.price}`);
        });
      }
      readline.question("\n🔙 ENTER para volver...");
      break;
    }

    case '0':
      salir = true;
      console.log("👋 Cerrando sesion.");
      break;

    default:
      console.log("❌ Erraste.");
  }
}


  mongoose.connection.close();
}
