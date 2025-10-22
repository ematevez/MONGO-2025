/*
1-Ver las Base de Datos (show dbs - adminCommand('listDatabases'))
2-Posicionarse en una Base de datos (use - getSiblingDB)
3-Ver las colecciones para esa Base de Datos (show collections - getCollectionNames())
4-Cargar un find a un cursor para recorrer y mostrar
5-Recorrer el cursor para ver la coleccion
*/

//1-Ver las Base de Datos (show dbs - adminCommand('listDatabases'))
printjson(db.adminCommand('listDatabases'))

//2-Posicionarse en una Base de datos (use - getSiblingDB)
db = db.getSiblingDB('miercoles')

//3-Ver las colecciones para esa Base de Datos (show collections - getCollectionNames())
print(db.getCollectionNames())

//4-Cargar un find a un cursor para recorrer y mostrar
cursor = db.articulos.find({precio : {$gte : 50 } })

//5-TRES FORMAS DE Recorrer el cursor para ver la coleccion

/*Cada vez que se llama al método find de una colección, retorna un objeto de la clase Cursor.
UNO-Mediante el método forEach del Cursor es posible recorrer todo el contenido del 
cursor en forma secuencial hasta agotarlo 
function(d) { printjson(d) }: Esta es una función de callback que se ejecuta para cada documento
en el cursor. Aquí, d representa cada documento individualmente a medida que se itera sobre el cursor.
*/
cursor.forEach(function(d) { printjson(d) });

/*DOS-Mediante los métodos hasNext y Next: Se usan en forma combinada para acceder al contenido de un cursor en forma secuencial hasta agotarlo.*/
while (cursor.hasNext()) {
    print(cursor.next())}


/*TRES-Acceder en forma aleatoria al contenido de un cursor, através del método toArray de los cursores.
 */

var documentArray = cursor.toArray()
var count = documentArray.length

var document = documentArray[1]
print("Muestro el elemento en la posicion 1 /n")
printjson(document)

print("Recorro el array")
for (i = 0; i<count; i++)
{
    document = documentArray[i]
    printjson(document)
}
