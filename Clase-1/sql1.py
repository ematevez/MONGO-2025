#Script de Creación de Base de Datos y Carga de Datos
"""
"""
import sqlite3

# Conectar a SQLite (crea el archivo si no existe)
conn = sqlite3.connect("empresa.db")
cursor = conn.cursor()

# Crear tabla departamentos
cursor.execute("""
    CREATE TABLE IF NOT EXISTS departamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
    )
""")
# Insertar datos en departamentos
cursor.executemany("""
    INSERT INTO departamentos (nombre) VALUES (?)
""", [('Ventas',), ('Recursos Humanos',), ('IT',)])

# Crear tabla empleados
cursor.execute("""
    CREATE TABLE IF NOT EXISTS empleados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        salario REAL NOT NULL,
        fecha_contratacion TEXT NOT NULL,
        id_departamento INTEGER,
        FOREIGN KEY (id_departamento) REFERENCES departamentos(id)
    )
""")


# Confirmar inserción
conn.commit()

# Insertar datos en empleados
empleados = [
    ('Juan Perez', 55000, '2022-06-15', 1), 
    ('Ana Gomez', 48000, '2021-09-20', 2), 
    ('Carlos Lopez', 65000, '2020-03-10', 3),
    ('Maria Ruiz', 70000, '2019-08-01', 1),
    ('Pedro Sanchez', 72000, '2018-05-12', 2),
    ('Laura Fernandez', 68000, '2023-01-25', 3),
    ('Miguel Torres', 50000, '2022-10-10', 1),
    ('Lucia Ramirez', 47000, '2021-12-05', 2),
    ('Jose Martinez', 62000, '2020-07-19', 3),
    ('Elena Rios', 53000, '2023-02-14', 1)
]

cursor.executemany("""
    INSERT INTO empleados (nombre, salario, fecha_contratacion, id_departamento)
    VALUES (?, ?, ?, ?)
""", empleados)

# Confirmar inserción
conn.commit()

print("Base de datos creada con éxito. Datos insertados correctamente en SQLite.")

# Cerrar conexión
cursor.close()
conn.close()
