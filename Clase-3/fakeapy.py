import requests
from pymongo import MongoClient

# 1. Conectarse a la fake API
url = "https://jsonplaceholder.typicode.com/users"
response = requests.get(url)
print("response: ")
print(type(response))

if response.status_code == 200:
    usuarios = response.json()
    print("usuario: ")
    print(type(usuarios))
    print(f"Se descargaron {len(usuarios)} usuarios")
else:
    print("Error al conectar con la API")
    usuarios = []

# 2. Conectarse a MongoDB (local en este ejemplo)
# cliente = MongoClient("mongodb://localhost:27017/")
# cliente = MongoClient("mongodb+srv://user:user@clusterbasededatosii.mjjsejj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBaseDeDatosII")
cliente = MongoClient("mongodb+srv://user:user@casa.tgh4en9.mongodb.net/?retryWrites=true&w=majority&appName=Casa")
db = cliente["333PY"]          # nombre de la base
coleccion = db["usuarios_fake"]       # colección

# 3. Insertar usuarios en Mongopy
if usuarios:
    coleccion.insert_many(usuarios)
    print("Usuarios guardados en MongoDB")
