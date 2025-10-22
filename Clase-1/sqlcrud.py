import sqlite3

# =============================
# CREAR BASE DE DATOS Y TABLAS
# =============================

def crear_bd():
    conn = sqlite3.connect("333.db")
    cursor = conn.cursor()

    # Tabla usuarios
    cursor.execute('''CREATE TABLE IF NOT EXISTS usuarios (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nombre TEXT,
                        email TEXT)''')

    # Tabla productos
    cursor.execute('''CREATE TABLE IF NOT EXISTS productos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nombre TEXT,
                        precio REAL)''')

    # Tabla pedidos
    cursor.execute('''CREATE TABLE IF NOT EXISTS pedidos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        usuario_id INTEGER,
                        producto_id INTEGER,
                        cantidad INTEGER,
                        FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                        FOREIGN KEY(producto_id) REFERENCES productos(id))''')

    conn.commit()
    conn.close()


def cargar_datos_iniciales():
    conn = sqlite3.connect("333.db")
    cursor = conn.cursor()

    # Insertar solo si está vacío
    if cursor.execute("SELECT COUNT(*) FROM usuarios").fetchone()[0] == 0:
        usuarios = [(f"Usuario{i}", f"usuario{i}@mail.com") for i in range(1, 11)]
        cursor.executemany("INSERT INTO usuarios (nombre, email) VALUES (?, ?)", usuarios)

    if cursor.execute("SELECT COUNT(*) FROM productos").fetchone()[0] == 0:
        productos = [(f"Producto{i}", i * 10.5) for i in range(1, 11)]
        cursor.executemany("INSERT INTO productos (nombre, precio) VALUES (?, ?)", productos)

    if cursor.execute("SELECT COUNT(*) FROM pedidos").fetchone()[0] == 0:
        pedidos = [(i, i, i * 2) for i in range(1, 11)]
        cursor.executemany("INSERT INTO pedidos (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)", pedidos)

    conn.commit()
    conn.close()

# =============================
# CRUD GENÉRICO
# =============================

def mostrar_tabla(tabla):
    conn = sqlite3.connect("333.db")
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {tabla}")
    for fila in cursor.fetchall():
        print(fila)
    conn.close()

def insertar(tabla, valores):
    conn = sqlite3.connect("333.db")
    cursor = conn.cursor()
    if tabla == "usuarios":
        cursor.execute("INSERT INTO usuarios (nombre, email) VALUES (?, ?)", valores)
    elif tabla == "productos":
        cursor.execute("INSERT INTO productos (nombre, precio) VALUES (?, ?)", valores)
    elif tabla == "pedidos":
        cursor.execute("INSERT INTO pedidos (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)", valores)
    conn.commit()
    conn.close()

def actualizar(tabla, id_, nuevos_valores):
    conn = sqlite3.connect("333.db")
    cursor = conn.cursor()
    if tabla == "usuarios":
        cursor.execute("UPDATE usuarios SET nombre=?, email=? WHERE id=?", (*nuevos_valores, id_))
    elif tabla == "productos":
        cursor.execute("UPDATE productos SET nombre=?, precio=? WHERE id=?", (*nuevos_valores, id_))
    elif tabla == "pedidos":
        cursor.execute("UPDATE pedidos SET usuario_id=?, producto_id=?, cantidad=? WHERE id=?", (*nuevos_valores, id_))
    conn.commit()
    conn.close()

def eliminar(tabla, id_):
    conn = sqlite3.connect("333.db")
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM {tabla} WHERE id=?", (id_,))
    conn.commit()
    conn.close()

# =============================
# MENÚ
# =============================

def menu():
    while True:
        print("\n===== MENU CRUD =====")
        print("1. Ver tabla")
        print("2. Insertar dato")
        print("3. Actualizar dato")
        print("4. Eliminar dato")
        print("5. Salir")

        opcion = input("Elige una opción: ")

        if opcion == "1":
            tabla = input("Tabla (usuarios/productos/pedidos): ")
            mostrar_tabla(tabla)
        elif opcion == "2":
            tabla = input("Tabla (usuarios/productos/pedidos): ")
            if tabla == "usuarios":
                nombre = input("Nombre: ")
                email = input("Email: ")
                insertar(tabla, (nombre, email))
            elif tabla == "productos":
                nombre = input("Nombre: ")
                precio = float(input("Precio: "))
                insertar(tabla, (nombre, precio))
            elif tabla == "pedidos":
                uid = int(input("Usuario ID: "))
                pid = int(input("Producto ID: "))
                cant = int(input("Cantidad: "))
                insertar(tabla, (uid, pid, cant))
        elif opcion == "3":
            tabla = input("Tabla (usuarios/productos/pedidos): ")
            id_ = int(input("ID a actualizar: "))
            if tabla == "usuarios":
                nombre = input("Nuevo nombre: ")
                email = input("Nuevo email: ")
                actualizar(tabla, id_, (nombre, email))
            elif tabla == "productos":
                nombre = input("Nuevo nombre: ")
                precio = float(input("Nuevo precio: "))
                actualizar(tabla, id_, (nombre, precio))
            elif tabla == "pedidos":
                uid = int(input("Nuevo Usuario ID: "))
                pid = int(input("Nuevo Producto ID: "))
                cant = int(input("Nueva cantidad: "))
                actualizar(tabla, id_, (uid, pid, cant))
        elif opcion == "4":
            tabla = input("Tabla (usuarios/productos/pedidos): ")
            id_ = int(input("ID a eliminar: "))
            eliminar(tabla, id_)
        elif opcion == "5":
            print("Saliendo...")
            break
        else:
            print("Opción no válida")

# =============================
# PROGRAMA PRINCIPAL
# =============================

if __name__ == "__main__":
    crear_bd()
    cargar_datos_iniciales()
    menu()
