///npm install mongodb


const { MongoClient, ObjectId } = require("mongodb");

// URI de conexión a MongoDB Atlas
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@cluster0-jxeqq.mongodb.net/?retryWrites=true&w=majority";

async function findMovieById() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Conexión exitosa a MongoDB Atlas");

        // Seleccionar la base de datos y la colección
        const db = client.db("video");
        const collection = db.collection("movies"); // Asegúrate de que el nombre de la colección es correcto

        // Buscar el documento por _id
        const movie = await collection.findOne({ _id: new ObjectId("58c59c6a99d4ee0af9e0c34e") });

        if (movie) {
            console.log("🎬 Película encontrada:", movie);
        } else {
            console.log("⚠️ No se encontró ninguna película con ese ID");
        }
    } catch (err) {
        console.error("❌ Error al conectar o buscar el documento:", err);
    } finally {
        await client.close();
        console.log("🔌 Conexión cerrada");
    }
}

// Ejecutar la función
findMovieById();
