import requests
from pymongo import MongoClient, UpdateOne

# 🔗 Conexión a tu cluster Atlas
# client = MongoClient("mongodb+srv://user:user@casa.tgh4en9.mongodb.net/?retryWrites=true&w=majority&appName=Casa")
client = MongoClient("mongodb://localhost:27017/")
db = client["333practica"]

# ============================================
# 1) Colección LIBROS desde OpenLibrary API
# ============================================
url = "https://openlibrary.org/subjects/fantasy.json?limit=250"
data = requests.get(url).json()

libros = []
autores = []

for libro in data.get("works", []):
    lista_autores = [a["name"] for a in libro.get("authors", [])]
    libros.append({
        "titulo": libro["title"],
        "autores": lista_autores,
        "anio": libro.get("first_publish_year"),
        "temas": libro.get("subject", []),
        "editorial": {
            "ciudad": "Londres",   # valor de ejemplo
            "nombre": "Editorial Fantasía"
        }
    })

    # Autores para colección separada
    for a in libro.get("authors", []):
        autores.append({
            "nombre": a["name"],
            "id": a["key"],
            # campo extra para practicar
            "nacionalidad": "Desconocida"
        })

if libros:
    db.libros.drop()
    db.libros.insert_many(libros)
    print(f"✅ Insertados {len(libros)} libros en MongoDB")

if autores:
    db.autores.drop()
    ops = []
    for autor in autores:
        ops.append(UpdateOne({"id": autor["id"]}, {"$set": autor}, upsert=True))
    db.autores.bulk_write(ops)
    print(f"✅ Insertados/actualizados {len(autores)} autores en MongoDB")

# ============================================
# 2) Colección PELICULAS (datos fijos de práctica)
# ============================================
peliculas = [
    {
        "titulo": "Inception",
        "director": "Christopher Nolan",
        "estreno": "2010-07-16",
        "criticas": [
            {"autor": "Juan Perez", "comentario": "Brillante"},
            {"autor": "Lucía Gómez", "comentario": "Un poco confusa"}
        ]
    },
    {
        "titulo": "Titanic",
        "director": "James Cameron",
        "estreno": "1997-12-19",
        "criticas": [
            {"autor": "Lucía Gómez", "comentario": "Emotiva"},
            {"autor": "Martín Díaz", "comentario": "Muy larga"}
        ]
    },
    {
        "titulo": "El Padrino",
        "director": "Francis Ford Coppola",
        "estreno": "1972-03-24",
        "criticas": [
            {"autor": "Carlos", "comentario": "Una obra maestra"},
            {"autor": "Juan Perez", "comentario": "Clásico absoluto"}
        ]
    }
]

db.peliculas.drop()
db.peliculas.insert_many(peliculas)
print(f"✅ Insertadas {len(peliculas)} películas en MongoDB")

# ============================================
# 3) Colección EMPLEADOS (datos fijos de práctica)
# ============================================
empleados = [
    {
        "nombre": "Juan Perez",
        "legajo": 10001,
        "ciudadTrabajo": "Bogotá",
        "tareas": ["planillas", "reportes"],
        "activo": True
    },
    {
        "nombre": "Lucía Gómez",
        "legajo": 10002,
        "ciudadTrabajo": "Londres",
        "tareas": ["atención al cliente"],
        "activo": True
    },
    {
        "nombre": "Martín Díaz",
        "legajo": 10003,
        "ciudadTrabajo": "Buenos Aires",
        "tareas": ["reuniones", "soporte técnico"],
        "activo": False
    },
    {
        "nombre": "Carla Ruiz",
        "legajo": 10004,
        "ciudadTrabajo": "Mar del Plata",
        "tareas": ["reportes", "reuniones"],
        "activo": True
    }
]

db.empleados.drop()
db.empleados.insert_many(empleados)
print(f"✅ Insertados {len(empleados)} empleados en MongoDB")

print("🚀 Base de datos lista con colecciones: libros, autores, peliculas, empleados")
