# pip install pymongo

from pymongo import MongoClient

# =============================
# CONEXIÓN Y DATOS INICIALES
# =============================

def conectar():
    client = MongoClient("mongodb://localhost:27017/")
    return client["mi_base"]


def cargar_datos_iniciales(db):
    if db.usuarios.count_documents({}) == 0:
        usuarios = [{"nombre": f"Usuario{i}", "email": f"usuario{i}@mail.com"} for i in range(1, 11)]
        db.usuarios.insert_many(usuarios)

    if db.productos.count_documents({}) == 0:
        productos = [{"nombre": f"Producto{i}", "precio": i * 10.5} for i in range(1, 11)]
        db.productos.insert_many(productos)

    if db.pedidos.count_documents({}) == 0:
        pedidos = [{"usuario_id": i, "producto_id": i, "cantidad": i * 2} for i in range(1, 11)]
        db.pedidos.insert_many(pedidos)


# =============================
# CRUD
# =============================

def mostrar_coleccion(db, coleccion):
    for doc in db[coleccion].find():
        print(doc)

def insertar(db, coleccion, documento):
    db[coleccion].insert_one(documento)

def actualizar(db, coleccion, filtro, nuevos_valores):
    db[coleccion].update_one(filtro, {"$set": nuevos_valores})

def eliminar(db, coleccion, filtro):
    db[coleccion].delete_one(filtro)


# =============================
# MENÚ
# =============================

def menu(db):
    while True:
        print("\n===== MENU CRUD (MongoDB) =====")
        print("1. Ver colección")
        print("2. Insertar documento")
        print("3. Actualizar documento")
        print("4. Eliminar documento")
        print("5. Salir")

        opcion = input("Elige una opción: ")

        if opcion == "1":
            col = input("Colección (usuarios/productos/pedidos): ")
            mostrar_coleccion(db, col)

        elif opcion == "2":
            col = input("Colección (usuarios/productos/pedidos): ")
            if col == "usuarios":
                nombre = input("Nombre: ")
                email = input("Email: ")
                insertar(db, col, {"nombre": nombre, "email": email})
            elif col == "productos":
                nombre = input("Nombre: ")
                precio = float(input("Precio: "))
                insertar(db, col, {"nombre": nombre, "precio": precio})
            elif col == "pedidos":
                uid = int(input("Usuario ID: "))
                pid = int(input("Producto ID: "))
                cant = int(input("Cantidad: "))
                insertar(db, col, {"usuario_id": uid, "producto_id": pid, "cantidad": cant})

        elif opcion == "3":
            col = input("Colección (usuarios/productos/pedidos): ")
            _id = input("ID (Mongo genera _id, usa otro campo como filtro, ej: nombre): ")
            if col == "usuarios":
                nombre = input("Nuevo nombre: ")
                email = input("Nuevo email: ")
                actualizar(db, col, {"nombre": _id}, {"nombre": nombre, "email": email})
            elif col == "productos":
                nombre = input("Nuevo nombre: ")
                precio = float(input("Nuevo precio: "))
                actualizar(db, col, {"nombre": _id}, {"nombre": nombre, "precio": precio})
            elif col == "pedidos":
                uid = int(input("Nuevo Usuario ID: "))
                pid = int(input("Nuevo Producto ID: "))
                cant = int(input("Nueva cantidad: "))
                actualizar(db, col, {"usuario_id": int(_id)}, {"usuario_id": uid, "producto_id": pid, "cantidad": cant})

        elif opcion == "4":
            col = input("Colección (usuarios/productos/pedidos): ")
            _id = input("Filtro por nombre o id: ")
            if col in ["usuarios", "productos"]:
                eliminar(db, col, {"nombre": _id})
            elif col == "pedidos":
                eliminar(db, col, {"usuario_id": int(_id)})

        elif opcion == "5":
            print("Saliendo...")
            break
        else:
            print("Opción no válida")


# =============================
# PROGRAMA PRINCIPAL
# =============================

if __name__ == "__main__":
    db = conectar()
    cargar_datos_iniciales(db)
    menu(db)
