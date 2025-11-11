// PRACTICA 1 – NOMBRE: Emanuel Tevez – LEGAJO: 12345
// Script para extracción, modelado e inserciones en MongoDB con consultas.
// Modelos: Uno a Uno, Uno a Muchos, Muchos a Muchos.
// Base de datos destino: modelado_cine

const { MongoClient } = require("mongodb");
const fs = require("fs");

// URIs de conexión
const uriLectura = "mongodb+srv://user:user@334.cj6j7mg.mongodb.net/?retryWrites=true&w=majority&appName=334";
const uriEscritura = "mongodb+srv://user:user@escribi.svby4vm.mongodb.net/?retryWrites=true&w=majority&appName=Escribi";

const clienteLectura = new MongoClient(uriLectura);
const clienteEscritura = new MongoClient(uriEscritura);

async function modeladoPeliculas() {
  try {
    await clienteLectura.connect();
    const dbOrigen = clienteLectura.db("sample_mflix");
    const movies = dbOrigen.collection("movies");

    // Extracción de películas antiguas
    const peliculasAntiguas = await movies
      .find({ year: { $lt: 1950 } })
      .project({ title: 1, year: 1, directors: 1, cast: 1, genres: 1, plot: 1, languages: 1, _id: 0 })
      .limit(5)
      .toArray();

    const peliculasProcesadas = peliculasAntiguas.map((p, i) => ({
      _id: `pel${i + 1}`,
      ...p,
      chequeado: true
    }));

    // Guardado local
    fs.writeFileSync("peliculas_anticuas.txt", peliculasProcesadas.map(p => JSON.stringify(p, null, 2)).join("\n\n"));
    fs.writeFileSync("peliculas_antiguas.json", JSON.stringify(peliculasProcesadas, null, 2));
    console.log("📁 Archivos exportados correctamente.");

    await clienteEscritura.connect();
    const dbDestino = clienteEscritura.db("modelado_cine");

    // Limpiar colecciones
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
        nombre: directorNombre
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

    // Modelo 2: Uno a Muchos
    for (let i = 0; i < 3; i++) {
      const p = peliculasProcesadas[i];
      const actores = (p.cast || []).slice(0, 2).map((actor, j) => ({
        nombre: actor,
        edad: 20 + j * 5
      }));
      const pelicula = {
        _id: `pelUM${i + 1}`,
        title: p.title,
        year: p.year,
        actores
      };
      await dbDestino.collection("modelo_uno_a_muchos").insertOne(pelicula);
    }

    // Modelo 3: Muchos a Muchos
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

    console.log("✅ Datos insertados correctamente.");

    // CONSULTAS 📊
    console.log("\n🔍 Consultas:");

    // 1. Películas con sus directores
    const pelisDirectores = await dbDestino.collection("modelo_uno_a_uno").aggregate([
      {
        $lookup: {
          from: "directores",
          localField: "director_id",
          foreignField: "_id",
          as: "director"
        }
      },
      { $unwind: "$director" }
    ]).toArray();
    console.log("🎬 Películas con directores:", pelisDirectores);

    // 2. Películas con más de un actor
    const pelisConActores = await dbDestino.collection("modelo_uno_a_muchos").find({
      "actores.1": { $exists: true }
    }).toArray();
    console.log("👨‍🎤 Películas con más de un actor:", pelisConActores);

    // 3. Películas del género “Drama”
    const dramaID = generosArray.find(g => g.nombre === "Drama")?._id;
    const pelisDrama = await dbDestino.collection("modelo_muchos_a_muchos").find({
      genero_ids: dramaID
    }).toArray();
    console.log("🎭 Películas del género Drama:", pelisDrama);

    // 4. Películas que comparten género
    const pelisMismoGenero = await dbDestino.collection("modelo_muchos_a_muchos").aggregate([
      { $unwind: "$genero_ids" },
      {
        $group: {
          _id: "$genero_ids",
          peliculas: { $addToSet: "$title" }
        }
      },
      { $match: { "peliculas.1": { $exists: true } } }
    ]).toArray();
    console.log("🔗 Películas que comparten géneros:", pelisMismoGenero);

    // 5. Promedio de actores por película
    const promedioActores = await dbDestino.collection("modelo_uno_a_muchos").aggregate([
      {
        $project: {
          numActores: { $size: "$actores" }
        }
      },
      {
        $group: {
          _id: null,
          promedio: { $avg: "$numActores" }
        }
      }
    ]).toArray();
    console.log("📈 Promedio de actores por película:", promedioActores[0]?.promedio ?? 0);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await clienteLectura.close();
    await clienteEscritura.close();
  }
}

modeladoPeliculas();
