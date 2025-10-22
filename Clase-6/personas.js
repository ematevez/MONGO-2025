db = db.getSiblingDB("miercoles"); // para usar la bdd que querramos
db.personas.drop(); // borra por si existia algo
db.personas.insertMany([
// { "id": "1", "nombre": "Francisco", "edad": 63, "acceso": true, "id": "100", "edad": 100},
// Si se repite toma el ultimo valor
{ "id": "1", "nombre": "Francisco", "edad": 63, "acceso": true, "_id": "1" },
{ "id": "2", "nombre": "Lola", "edad": 48, "acceso": false, "_id": "2" },
{ "id": "3", "nombre": "Karina", "edad": 94, "acceso": true, "_id": "3" },
{ "id": "4", "nombre": "Sandra", "edad": 12, "acceso": false, "_id": "4" },
{ "id": "5", "nombre": "Anibal", "edad": 70, "acceso": false, "_id": "5" },
{ "id": "6", "nombre": "Roberto", "edad": 59, "acceso": false, "_id": "6" },
{ "id": "7", "nombre": "Salvador", "edad": 70, "acceso": false, "_id": "7" },
{ "id": "8", "nombre": "Irene", "edad": 84, "acceso": false, "_id": "8" },
{ "id": "9", "nombre": "Miguel", "edad": 93, "acceso": false, "_id": "9" },
{ "id": "10","nombre": "Veronica", "edad": 64, "acceso": false, "_id": "10" },
{ "id": "11","nombre": "Cristian", "edad": 80, "acceso": false, "_id": "11" },
{ "id": "12", "nombre": "Sara", "edad": 76, "acceso": false, "_id": "12" },
{ "id": "13", "nombre": "Giuliano", "edad": 16, "acceso": false, "_id": "13" },
{ "id": "14", "nombre": "Tiziano", "edad": 18, "acceso": false, "_id": "14" },
{ "id": "15", "nombre": "Jose", "edad": 94, "acceso": false, "_id": "15" },
{ "id": "16", "nombre": "Juan Pablo", "edad": 30, "acceso": false, "_id": "16" },
{ "id": "17", "nombre": "Liliana", "edad": 65, "acceso": false, "_id": "17" },
{ "id": "18", "nombre": "Alejandro", "edad": 91, "acceso": false, "_id": "18" },
{ "id": "19", "nombre": "Sol", "edad": 3, "acceso": false, "_id": "19" }
])
console.log("============DESORDENADO=====================")
print('find query projection ')
var cursor = db.personas.find({ edad: {$gt:50} }, // filtro query
{ _id:0, nombre: 1, edad: 1 } // projection -> 1: sale, 0: no sale
)
// Imprimir la información devuelta por el cursor
while(cursor.hasNext())
{
    print(cursor.next())
}
console.log("=============ORDENADO====================")
console.log('find query projection con sort')
var cursor = db.personas.find(
{ edad: {$gt:50} }, // filtro query
{ nombre: 1, edad: 1, _id:0 } // projection -> 1: sale, 0: no sale
).sort({edad: -1, nombre: 1})
// Imprimir la información devuelta por el cursor
while(cursor.hasNext())
{
console.log(cursor.next())
}



