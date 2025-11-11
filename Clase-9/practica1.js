// npm init -y
// npm install mongodb fs

// Extrae hasta 5 películas anteriores a 1925 con los campos requeridos.
// Guarda los datos en .txt y .json.
// Inserta:
// 3 películas y 3 directores en modelo uno a uno.
// 3 películas con actores embebidos (uno a muchos).
// 4 géneros únicos y 3 películas referenciando varios géneros (muchos a muchos).

const { MongoClient } = require("mongodb");
const fs = require("fs");

// Clusters
const uriLectura = "mongodb+srv://lee:lee@parcial.645ugzk.mongodb.net/?retryWrites=true&w=majority&appName=Parcial";
const uriEscritura = "mongodb+srv://write:write@cluster0.lxfra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clienteLectura = new MongoClient(uriLectura);
const clienteEscritura = new MongoClient(uriEscritura);

async function modeladoPeliculas() {
  try {
    await clienteLectura.connect();
    const dbOrigen = clienteLectura.db("sample_mflix");
    const movies = dbOrigen.collection("movies");

    const peliculasAntiguas = await movies
      .find({ year: { $lt: 1925 } })
      .project({
        title: 1,
        year: 1,
        directors: 1,
        cast: 1,
        genres: 1,
        plot: 1,
        languages: 1,
        _id: 0
      })
      .limit(5)
      .toArray();

    // Agregar campo opcional
    const peliculasProcesadas = peliculasAntiguas.map((p, i) => ({
      _id: `pel${i + 1}`,
      ...p,
      chequeado: true
    }));

    // Guardar archivos locales
    fs.writeFileSync("peliculas_anticuas.txt", peliculasProcesadas.map(p => JSON.stringify(p, null, 2)).join("\n\n"));
    fs.writeFileSync("peliculas_antiguas.json", JSON.stringify(peliculasProcesadas, null, 2));
    console.log("📁 Archivos exportados correctamente.");

    // Ahora conexión al cluster de escritura
    await clienteEscritura.connect();
    const dbDestino = clienteEscritura.db("modelado_cine"); //

    // Limpiar por si se reejecuta
    await dbDestino.collection("modelo_uno_a_uno").deleteMany({});
    await dbDestino.collection("directores").deleteMany({});
    await dbDestino.collection("modelo_uno_a_muchos").deleteMany({});
    await dbDestino.collection("modelo_muchos_a_muchos").deleteMany({});
    await dbDestino.collection("generos").deleteMany({});

    // Modelo 1: Uno a Uno
    for (let i = 0; i < 3; i++) {
      const p = peliculasProcesadas[i];
      const directorNombre = p.directors?.[0] || "Desconocido";
      const director = {
        _id: `dir${i + 1}`,
        nombre: directorNombre,
        nacionalidad: "EE.UU" // Dato de ejemplo
      };
      const pelicula = {
        _id: p._id,
        title: p.title,
        year: p.year,
        director_id: director._id
      };
      await dbDestino.collection("directores").insertOne(director);
      await dbDestino.collection("modelo_uno_a_uno").insertOne(pelicula);
    }

    // Modelo 2: Uno a Muchos (actores embebidos)
    for (let i = 0; i < 3; i++) {
      const p = peliculasProcesadas[i];
      const actores = (p.cast || []).slice(0, 2).map((actor, j) => ({
        nombre: actor,
        edad: 20 + j * 5 // Edad ficticia
      }));
      const pelicula = {
        _id: `pelUM${i + 1}`,
        title: p.title,
        year: p.year,
        actores
      };
      await dbDestino.collection("modelo_uno_a_muchos").insertOne(pelicula);
    }

    // Modelo 3: Muchos a Muchos (películas y géneros)
    const generosUnicos = new Set();
    peliculasProcesadas.forEach(p => (p.genres || []).forEach(g => generosUnicos.add(g)));

    const generosArray = [...generosUnicos].slice(0, 4).map((g, i) => ({
      _id: `gen${i + 1}`,
      nombre: g
    }));

    await dbDestino.collection("generos").insertMany(generosArray);

    for (let i = 0; i < 3; i++) {
      const p = peliculasProcesadas[i];
      const genero_ids = (p.genres || []).map(
        g => generosArray.find(gen => gen.nombre === g)?._id
      ).filter(Boolean);

      await dbDestino.collection("modelo_muchos_a_muchos").insertOne({
        _id: `pelMM${i + 1}`,
        title: p.title,
        year: p.year,
        genero_ids
      });
    }

    console.log("✅ Modelado completo y datos insertados en 'modelado_cine'");

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await clienteLectura.close();
    await clienteEscritura.close();
  }
}
//AGREGAR CONSULTAS Y MOSTRAR POR CONSOLA

modeladoPeliculas();

// Extrae hasta 5 películas anteriores a 1925 con los campos requeridos.
// Guarda los datos en .txt y .json.
// Inserta:
// 3 películas y 3 directores en modelo uno a uno.
// 3 películas con actores embebidos (uno a muchos).
// 4 géneros únicos y 3 películas referenciando varios géneros (muchos a muchos).