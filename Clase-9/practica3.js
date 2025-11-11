/**
 * PRÁCTICA 3 – Modelado de Datos Avanzado en MongoDB

 */

const { MongoClient } = require("mongodb");

// 🔗 Clusters de lectura y escritura
const uriLectura = "mongodb+srv://lee:lee@parcial.645ugzk.mongodb.net/?retryWrites=true&w=majority&appName=Parcial";
const uriEscritura = "mongodb+srv://write:write@cluster0.lxfra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Bases y colecciones
const dbLectura = {
  guides: "sample_guides",
  mfix: "sample_mfix",
  supplies: "sample_supplies",
};
const dbDestino = "modelo_integrado";

// Función principal
async function main() {
  const clienteLectura = new MongoClient(uriLectura);
  const clienteEscritura = new MongoClient(uriEscritura);

  try {
    await clienteLectura.connect();
    await clienteEscritura.connect();

    console.log("✅ Conectado a ambos clusters");

    // === PARTE 1: Extracción y Limpieza ===
    const planets = await clienteLectura.db(dbLectura.guides)
      .collection("planets")
      .find({}, { projection: { name: 1, hasRings: 1, mainAtmosphere: 1 } })
      .limit(5)
      .toArray();

    const movies = await clienteLectura.db(dbLectura.mfix)
      .collection("movies")
      .find({}, { projection: { title: 1, year: 1, directors: 1 } })
      .limit(5)
      .toArray();

    const sales = await clienteLectura.db(dbLectura.supplies)
      .collection("sales")
      .find({}, { projection: { storeLocation: 1, purchaseMethod: 1, saleDate: 1 } })
      .limit(5)
      .toArray();

    // Agregar campo procesado
    const procesados = [...planets, ...movies, ...sales].map(doc => ({ ...doc, procesado: true }));

    const dbW = clienteEscritura.db(dbDestino);
    await dbW.collection("origen_integrado").insertMany(procesados);
    console.log("📤 Insertados documentos procesados en 'origen_integrado'");

    // === PARTE 2: Modelado ===

    // A. Modelo Uno a Uno – Planetas y Atmósferas
    const planetas = [
      { _id: "pla1", name: "Earth", hasRings: false, atm_id: "atm1" },
      { _id: "pla2", name: "Saturn", hasRings: true, atm_id: "atm2" },
      { _id: "pla3", name: "Mars", hasRings: false, atm_id: "atm3" },
    ];

    const atmosferas = [
      { _id: "atm1", mainAtmosphere: ["Nitrogen", "Oxygen"] },
      { _id: "atm2", mainAtmosphere: ["Hydrogen", "Helium"] },
      { _id: "atm3", mainAtmosphere: ["Carbon Dioxide"] },
    ];

    await dbW.collection("UU1_planetas").insertMany(planetas);
    await dbW.collection("UU2_atmosferas").insertMany(atmosferas);
    console.log("🌍 Modelo Uno a Uno insertado correctamente");

    // B. Modelo Uno a Muchos – Películas y Directores
    const peliculas = [
      {
        _id: "pel1",
        title: "Metropolis",
        year: 1927,
        directores: [
          { nombre: "Fritz Lang", nacionalidad: "Alemán" },
          { nombre: "Thea von Harbou", nacionalidad: "Alemana" },
        ],
      },
      {
        _id: "pel2",
        title: "The Kid",
        year: 1921,
        directores: [
          { nombre: "Charles Chaplin", nacionalidad: "Británico" },
          { nombre: "Roland Totheroh", nacionalidad: "Estadounidense" },
        ],
      },
      {
        _id: "pel3",
        title: "Nosferatu",
        year: 1922,
        directores: [
          { nombre: "F.W. Murnau", nacionalidad: "Alemán" },
          { nombre: "Albin Grau", nacionalidad: "Alemán" },
        ],
      },
    ];

    await dbW.collection("UM_peliculas").insertMany(peliculas);
    console.log("🎬 Modelo Uno a Muchos insertado correctamente");

    // C. Modelo Muchos a Muchos – Ventas y Métodos de Compra
    const metodos = [
      { _id: "met1", metodo: "Online" },
      { _id: "met2", metodo: "In Store" },
      { _id: "met3", metodo: "Phone" },
      { _id: "met4", metodo: "Mail" },
    ];

    const ventas = [
      { _id: "ven1", storeLocation: "London", saleDate: "2017-05-10", metodos_ids: ["met1", "met2"] },
      { _id: "ven2", storeLocation: "Denver", saleDate: "2016-11-22", metodos_ids: ["met2", "met3"] },
      { _id: "ven3", storeLocation: "New York", saleDate: "2018-01-12", metodos_ids: ["met1"] },
      { _id: "ven4", storeLocation: "Seattle", saleDate: "2019-04-03", metodos_ids: ["met1", "met3"] },
      { _id: "ven5", storeLocation: "London", saleDate: "2020-09-15", metodos_ids: ["met4", "met2"] },
    ];

    await dbW.collection("MM1_metodos").insertMany(metodos);
    await dbW.collection("MM2_ventas").insertMany(ventas);
    console.log("💰 Modelo Muchos a Muchos insertado correctamente");

    // === PARTE 3: Consultas ===
    console.log("\n📊 RESULTADOS DE CONSULTAS:\n");

    const planetasConAnillos = await dbW.collection("UU1_planetas").find({ hasRings: true }).toArray();
    console.log("🪐 Planetas con anillos:", planetasConAnillos);

    const peliculasConVariosDirectores = await dbW.collection("UM_peliculas").find({ "directores.1": { $exists: true } }).toArray();
    console.log("🎥 Películas con más de un director:", peliculasConVariosDirectores);

    const ventasEnLondresODenver = await dbW.collection("MM2_ventas").find({ storeLocation: { $in: ["London", "Denver"] } }).toArray();
    console.log("🏬 Ventas en Londres o Denver:", ventasEnLondresODenver);

    const metodosMasUsados = await dbW.collection("MM1_metodos").aggregate([
      {
        $lookup: {
          from: "MM2_ventas",
          localField: "_id",
          foreignField: "metodos_ids",
          as: "ventas_rel"
        }
      },
      { $project: { metodo: 1, totalUsos: { $size: "$ventas_rel" } } }
    ]).toArray();
    console.log("📈 Métodos de compra más utilizados:", metodosMasUsados);

    const atmosferasOxigeno = await dbW.collection("UU2_atmosferas").find({ mainAtmosphere: { $in: ["Oxygen"] } }).toArray();
    console.log("🌬️ Atmósferas con Oxígeno:", atmosferasOxigeno);

  } catch (err) {
    console.error("❌ Error general:", err);
  } finally {
    await clienteLectura.close();
    await clienteEscritura.close();
    console.log("\n🔚 Conexiones cerradas.");
  }
}

main();
