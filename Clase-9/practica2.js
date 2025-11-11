// SCRIPT 2 – Inserción de modelos: uno a uno, uno a muchos y muchos a muchos
// Este script:
// Inserta datos ya transformados en la base modelo_ventas.
// Crea tres modelos: uno_a_uno, uno_a_muchos, muchos_a_muchos.


const { MongoClient } = require("mongodb");

const uriLectura = "mongodb+srv://lee:lee@parcial.645ugzk.mongodb.net/?retryWrites=true&w=majority&appName=Parcial";
const uriEscritura = "mongodb+srv://write:write@cluster0.lxfra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clienteLectura = new MongoClient(uriLectura);
const clienteEscritura = new MongoClient(uriEscritura);

async function transferirYModelar() {
  try {
    // Conectar a ambos clusters
    await clienteLectura.connect();
    await clienteEscritura.connect();

    const origen = clienteLectura.db("sample_supplies").collection("sales");
    const db = clienteEscritura.db("practica2");

    // Limpiar colecciones de destino por si se reejecuta
    await Promise.all([
      db.collection("clientes").deleteMany({}),
      db.collection("modelo_ventas_uno_a_uno").deleteMany({}),
      db.collection("modelo_ventas_uno_a_muchos").deleteMany({}),
      db.collection("modelo_ventas_muchos_a_muchos").deleteMany({}),
      db.collection("metodos").deleteMany({})
    ]);

    // Leer 3 ventas reales
    const ventas = await origen.find().limit(3).toArray();

    // 1. Modelo Uno a Uno
    const clientes = db.collection("clientes");
    const ventasUnoAUno = db.collection("modelo_ventas_uno_a_uno");

    for (let i = 0; i < ventas.length; i++) {
      const v = ventas[i];
      const cliente = {
        _id: `cli${i + 1}`,
        nombre: v.customer?.name || "Sin nombre",
        edad: v.customer?.age || null,
        email: v.customer?.email || "sinemail@mail.com"
      };
      const venta = {
        _id: `ven${i + 1}`,
        saleDate: v.saleDate,
        storeLocation: v.storeLocation,
        couponUsed: v.couponUsed,
        purchaseMethod: v.purchaseMethod,
        cliente_id: cliente._id
      };
      await clientes.insertOne(cliente);
      await ventasUnoAUno.insertOne(venta);
    }

    // 2. Modelo Uno a Muchos
    const ventasUnoAMuchos = db.collection("modelo_ventas_uno_a_muchos");
    for (const v of ventas) {
      const totalItems = v.items.reduce((acc, item) => acc + item.quantity, 0);
      await ventasUnoAMuchos.insertOne({
        saleDate: v.saleDate,
        storeLocation: v.storeLocation,
        items: v.items,
        totalItems
      });
    }

    // 3. Modelo Muchos a Muchos
    const metodos = db.collection("metodos");
    const ventasMuchosAMuchos = db.collection("modelo_ventas_muchos_a_muchos");

    const metodosUnicos = [...new Set(ventas.map(v => v.purchaseMethod))];
    const metodoDocs = metodosUnicos.map((m, i) => ({ _id: `m${i + 1}`, metodo: m }));
    await metodos.insertMany(metodoDocs);

    for (let i = 0; i < ventas.length; i++) {
      const metodo = ventas[i].purchaseMethod;
      const metodo_id = metodoDocs.find(m => m.metodo === metodo)?._id;
      await ventasMuchosAMuchos.insertOne({
        _id: `venM${i + 1}`,
        saleDate: ventas[i].saleDate,
        metodo_ids: [metodo_id]
      });
    }

    console.log("✅ Datos leídos, transformados y guardados correctamente en 'practica2'");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await clienteLectura.close();
    await clienteEscritura.close();
  }
}

//AGREGAR CONSULTAS Y MOSTRAR POR CONSOLA
transferirYModelar();
