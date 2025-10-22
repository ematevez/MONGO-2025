"""
pip install pymongo
"""

from pymongo import MongoClient
from bson import ObjectId

# URI de conexión a MongoDB Atlas
# uri = "mongodb+srv://m001-student:m001-mongodb-basics@cluster0-jxeqq.mongodb.net/?retryWrites=true&w=majority"
        # "mongodb+srv://user:user@cluster0.zirxpbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" 
uri = "mongodb://localhost:27017"
# Conectar a MongoDB
client = MongoClient(uri)

# Seleccionar la base de datos y la colección
db = client["video"]  # Asegúrate de que la base de datos es correcta
collection = db["movies"]  # Asegúrate de que la colección es correcta

# Buscar el documento por _id
document_id = ObjectId("58c59c6a99d4ee0af9e0c34e")
movie = collection.find_one({"_id": document_id})

# Mostrar el resultado
if movie:
    print("🎬 Película encontrada:")
    for key, value in movie.items():
        print(f"{key}: {value}")
else:
    print("⚠️ No se encontró ninguna película con ese ID")

# Cerrar la conexión
client.close()
