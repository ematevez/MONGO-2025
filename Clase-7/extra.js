// npm init -y
// npm install mongoose axios

const mongoose = require('mongoose');
const axios = require('axios');

// Conexión a MongoDB local
mongoose.connect('mongodb://localhost:27017/Noviembre_sinti', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// mongoose.connect('mongodb+srv://user:user@noviembre.ur7s9iw.mongodb.net/?appName=Noviembre', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// Esquema para usuario fake
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  username: String,
  email: String,
  telefono: String,
  direccion: {
    ciudad: String,
    calle: String,
    numero: Number,
    codigoPostal: String
  }
});

const Usuario = mongoose.model('UsuarioFakeAPI', UsuarioSchema);

async function cargarUsuarios() {
  try {
    // Obtener usuarios desde la FakeStore API
    const response = await axios.get('https://fakestoreapi.com/users');
    const usuarios = response.data;

    // Limpiar la colección antes de insertar
    await Usuario.deleteMany({});

    // Insertar en MongoDB
    for (const u of usuarios) {
      await Usuario.create({
        nombre: `${u.name.firstname} ${u.name.lastname}`,
        username: u.username,
        email: u.email,
        telefono: u.phone,
        direccion: {
          ciudad: u.address.city,
          calle: u.address.street,
          numero: u.address.number,
          codigoPostal: u.address.zipcode
        }
      });
    }

    console.log("✅ Usuarios cargados desde Fake Store API a MongoDB local.");
  } catch (error) {
    console.error("❌ Error al cargar usuarios:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

cargarUsuarios();
