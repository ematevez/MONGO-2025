/*Previamente creadas la Base de Datos y la colección, se hace use de la base de datos en la teminal
y se realiza el load("ejercicio1.js"), eso realiza los insert */
db.articulos.drop()
db.articulos.insertOne({
    codigo: "A123",        // ID único del artículo
    precio: 29.99,         // Precio del artículo
    cantidad: 100,         // Cantidad disponible
    descripcion: "Mouse", // Descripción del artículo
    rubro: "Electrónica"  // Rubro al que pertenece el artículo
});
db.articulos.insertOne({
    codigo: "B456",        // ID único del artículo
    precio: 45.75,         // Precio del artículo
    cantidad: 50,          // Cantidad disponible
    descripcion: "Auriculares inalámbricos", // Descripción del artículo
    rubro: "Electrónica"  // Rubro al que pertenece el artículo
});
db.articulos.insertOne({
    codigo: "C789",        // ID único del artículo
    precio: 120.00,        // Precio del artículo
    cantidad: 30,          // Cantidad disponible
    descripcion: "Smartwatch", // Descripción del artículo
    rubro: "Tecnología"   // Rubro al que pertenece el artículo
});
db.articulos.insertOne({
    codigo: "D012",        // ID único del artículo
    precio: 75.50,         // Precio del artículo
    cantidad: 20,          // Cantidad disponible
    descripcion: "Cámara de seguridad", // Descripción del artículo
    rubro: "Seguridad"    // Rubro al que pertenece el artículo
});
db.articulos.insertOne({
    codigo: "E345",        // ID único del artículo
    precio: 30.00,         // Precio del artículo
    cantidad: 100,         // Cantidad disponible
    descripcion: "Cargador rápido para USB-C", // Descripción del artículo
    rubro: "Accesorios"    // Rubro al que pertenece el artículo
});
db.articulos.insertOne({
    codigo: "F678",        // ID único del artículo
    precio: 85.90,         // Precio del artículo
    cantidad: 15,          // Cantidad disponible
    descripcion: "Teclado mecánico", // Descripción del artículo
    rubro: "Computación"   // Rubro al que pertenece el artículo
});