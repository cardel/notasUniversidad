
# requirements.txt
```
flask==3.0.3
```

# app.py

```python
from flask import Flask, jsonify
import os
import socket

app = Flask(__name__)


@app.route("/")
def hola():
    return jsonify(
        mensaje="Hola desde el contenedor",
        host=socket.gethostname(),
        version=os.environ.get("APP_VERSION", "0.1.0"),
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

```

# Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENV APP_VERSION=0.1.0
EXPOSE 5000

CMD ["python", "app.py"]

```


# Comando

Los archivos deben en la misma carpeta

```bash
# Construir la imagen (el . es el contexto de build)
docker build -t hola-mundo .
# Ejecutar mapeando el puerto 5000 del contenedor al 8080 del host
docker run -d -p 8080:5000 --name hola hola-mundo
# Probar
curl http://localhost:8080
docker logs hola
docker exec -it hola sh
# Limpiar
docker rm -f hola
```