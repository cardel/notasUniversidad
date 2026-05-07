
Proveer la forma de crear toda la infraestructura mediante una sola especificación basada en un archivo en formato YAML

```bash
├── app
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── compose.yml
```

1. Archivo app.py

```python
from flask import Flask, jsonify
import os
import psycopg2
import redis

app = Flask(__name__)

DB_HOST = os.environ.get("DB_HOST", "db")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "ejemplo")
DB_NAME = os.environ.get("DB_NAME", "demo")

cache = redis.Redis(host="cache", port=6379, decode_responses=True)


@app.route("/")
def raiz():
    visitas = cache.incr("visitas")
    with psycopg2.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, dbname=DB_NAME
    ) as conn, conn.cursor() as cur:
        cur.execute("SELECT 1;")
        ok = cur.fetchone()[0]
    return jsonify(visitas=visitas, db_ok=ok == 1)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

2. Archivo Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
```

3. Archivo compose.yaml

```yaml
services:
  web:
    build: ./app
    ports:
      - "8080:5000"
    environment:
      DB_HOST: db
      DB_PASSWORD: ejemplo
      DB_NAME: demo
    depends_on:
      - db
      - cache
    networks:
      - app-net

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: demo
      POSTGRES_PASSWORD: ejemplo
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - app-net

  cache:
    image: redis:7-alpine
    networks:
      - app-net

volumes:
  pgdata:

networks:
  app-net:
```


Montar la app

Deben estar en en el directorio donde esta el archivo compose.yaml
```bash
docker compose up -d
```

Pararla

```bash
docker compose down
```