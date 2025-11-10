// npm init -y
// npm install mongodb
// npm install mongodb fs

const { MongoClient } = require("mongodb");

// Conexiones
const uriOrigen = "mongodb+srv://lectura:lectura@lectura.k0ihs9e.mongodb.net/?appName=Lectura" ;
const uriDestino = "mongodb+srv://escribi:escribi@cluster0.k9ruj1d.mongodb.net/?appName=Cluster0";

const clienteOrigen = new MongoClient(uriOrigen);
const clienteDestino = new MongoClient(uriDestino);

async function transferirDatos() {
  try {
    // Conexión al cluster de origen
    await clienteOrigen.connect();
    const dbOrigen = clienteOrigen.db("sample_mflix");
    const coleccionOrigen = dbOrigen.collection("movies");

    // Buscar el documento por título exacto
    const pelicula = await coleccionOrigen.findOne({ title: "Wild and Woolly" });

    if (!pelicula) {
      console.log("Película no encontrada.");
      return;
    }

    // Crear nuevo documento con solo los campos requeridos
    const documentoNuevo = {
      title: pelicula.title,
      year: pelicula.year,
      genres: pelicula.genres,
      plot: pelicula.plot,
      directors: pelicula.directors,
      chequeado: true,
    };

    // Conexión al cluster de destino
    await clienteDestino.connect();
    const dbDestino = clienteDestino.db("ejemplo_legajo");
    const coleccionDestino = dbDestino.collection("trabajo_test");

    // Insertar el nuevo documento
    const resultado = await coleccionDestino.insertOne(documentoNuevo);
    console.log("Documento insertado con _id:", resultado.insertedId);
  } catch (error) {
    console.error("Error durante la transferencia:", error);
  } finally {
    // Cerrar conexiones
    await clienteOrigen.close();
    await clienteDestino.close();
  }
}

transferirDatos();
