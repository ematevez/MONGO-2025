//1-Ver las Base de Datos (show dbs - adminCommand('listDatabases'))
printjson(db.adminCommand('listDatabases'))
//2-Posicionarse en una Base de datos (use - getSiblingDB)
db = db.getSiblingDB('miercoles')
//3-Ver las colecciones para esa Base de Datos (show collections -
// getCollectionNames()
print(db.getCollectionNames())
//4-Cargar un find a un cursor para recorrer y mostrar
cursor = db.articulos.find()


cursor.forEach(function(d) { printjson(d) });