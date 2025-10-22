// npm init -y
// npm install axios mongodb
// node index.js

import axios from "axios";
import { MongoClient } from "mongodb";

const urlAPI = "https://jsonplaceholder.typicode.com/users";

// URL de conexión a MongoDB (local)
// const mongoURL = "mongodb://127.0.0.1:27017";
const mongoURL = "mongodb+srv://user:user@clusterbasededatosii.mjjsejj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBaseDeDatosII";
const dbName = "332JSATLAS";
const collectionName = "usuarios";

async function main() {
  try {
    // 1. Traer usuarios desde la fake API
    const response = await axios.get(urlAPI);
    const usuarios = response.data;
    console.log(`Se descargaron ${usuarios.length} usuarios`);

    // 2. Conectar a MongoDB
    const client = new MongoClient(mongoURL);
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db(dbName);
    const coleccion = db.collection(collectionName);

    // 3. Insertar usuarios en la colección
    await coleccion.insertMany(usuarios);
    console.log("Usuarios guardados en MongoDB");

    // 4. Cerrar conexión
    await client.close();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
