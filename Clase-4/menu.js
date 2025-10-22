// instalar node
//npm init -y
//npm install mongodb readline-sync
//TODO Solo a para ver como se realizan las consultas en mongo desde un lenguaje de programacion no me meto en otra materia


const readline = require('readline-sync');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://user:user@cluster0.zirxpbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const uri = 'mongodb://localhost:27017'; // conexión local
const dbName = 'MenuC333'; // nombre de su base de datos local 

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const libros = db.collection('libros');

  let opcion;
  do {
    console.log('\n📚 Menú Librería');
    console.log('1. Cargar libro');
    console.log('2. Buscar libro por título');
    console.log('3. Borrar libro por título');
    console.log('4. Mostrar todos los libros');
    console.log('5. Mostrar ordenados');
    console.log('6. Salir');
    opcion = readline.question('Elegi una opcion: ');

    switch (opcion) {
      case '1':
        const genero = readline.question('Genero: ');
        const titulo = readline.question('Titulo: ');
        const paginas = parseInt(readline.question('Paginas: '));
        const precioEf = parseInt(readline.question('Precio efectivo: '));
        const precioTar = parseInt(readline.question('Precio tarjeta: '));
        const bestseller = readline.question('¿Es bestseller? (s/n): ') === 's';
        const ciudad = readline.question('Ciudad editorial: ');
        const editorial = readline.question('Nombre editorial: ');
        const cuit = readline.question('CUIT: ');

        await libros.insertOne({
          genero,
          titulos: [titulo],
          publicacion: new Date(),
          paginas,
          precios: [
            { tipo: 'efectivo', precio: precioEf },
            { tipo: 'tarjeta', precio: precioTar }
          ],
          bestseller,
          editorial: { ciudad, nombre: editorial, cuit }
        });
        console.log('📘 Libro cargado exitosamente.');
        break;

      case '2':
        const buscar = readline.question('Titulo a buscar: ');
        //! Estos es lo que tienen que ver ===============================
        const resultados = await libros.find({ titulos: buscar }).toArray();
        //!===========================================================
        if (resultados.length > 0) {
          console.log('📚 Resultados:');
          resultados.forEach(libro => console.log(libro));
        } else {
          console.log('❌ No se encontraron libros con ese titulo.');
        }
        break;

      case '3':
        const borrar = readline.question('Titulo a borrar: ');
         //! Estos es lo que tienen que ver ==========================
        const result = await libros.deleteMany({ titulos: borrar });
        //!===========================================================
        console.log(`🗑 Se eliminaron ${result.deletedCount} libro(s).`);
        break;

      case '4':
        const todos = await libros.find({}).toArray();
        if (todos.length > 0) {
          console.log('📖 Todos los libros:');
          todos.forEach(libro => console.log(libro));
        } else {
          console.log('❗ No hay libros cargados.');
        }
        break;
        
      case "5":
        const campo = readline
          .question("Campo para ordenar (ej: genero, paginas, publicacion): ")
          .trim();
        const orden = parseInt(
          readline.question("Orden ascendente (1) o descendente (-1): ").trim()
        );

        const sortSpec = { [campo]: orden === -1 ? -1 : 1 };

        const librosOrdenados = await libros
          .find({})
          .sort(sortSpec)
          .collation({ locale: "es", strength: 1 })
          .toArray();

        if (librosOrdenados.length > 0) {
          console.log("Todos los libros ordenados:");
          librosOrdenados.forEach((libro) => console.log(libro));
        } else {
          console.log("No hay libros cargados.");
        }
        break;

      case '6':
        console.log('👋 ¡Hasta luego!');
        break;

      default:
        console.log('⚠️ Opcion no valida.');
    }

  } while (opcion !== '6');

  await client.close();
}

main().catch(console.error);
