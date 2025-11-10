// npm init -y
// npm install mongodb fs

const { MongoClient } = require("mongodb");
const fs = require("fs");

const uri = "mongodb+srv://lectura:lectura@lectura.k0ihs9e.mongodb.net/?appName=Lectura"; 
// "mongodb+srv://user:user@334.cj6j7mg.mongodb.net/?retryWrites=true&w=majority&appName=334";
const cliente = new MongoClient(uri);

async function exportarPeliculas() {
  try {
    await cliente.connect();
    const db = cliente.db("sample_mflix");
    const movies = db.collection("movies");

    // Obtener todos los documentos
    const cursor = movies.find({});
    const todosLosDocumentos = await cursor.toArray();

    // Convertir a JSON con formato legible
    const datosTexto = todosLosDocumentos.map(doc => JSON.stringify(doc, null, 2)).join("\n\n");

    // Guardar en archivo
    fs.writeFileSync("peliculas_exportadas_parcial.txt", datosTexto);
    console.log("✅ Exportación completada: peliculas_exportadas_parcial.txt");
  } catch (error) {
    console.error("❌ Error al exportar:", error);
  } finally {
    await cliente.close();
  }
}

exportarPeliculas();
