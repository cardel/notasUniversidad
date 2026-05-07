# Docker Compose

## Estructura

- **services**: Contenedores
- **volumes**: Volúmenes
- **networks**: Redes
- **configs**: Configuraciones
- **secrets**: Contraseñas / API Keys

Docker Compose provee la forma de crear toda la infraestructura mediante una sola especificación basada en un archivo en formato YAML. Este archivo define y ejecuta aplicaciones multi-contenedor, permitiendo gestionar dependencias, redes y volúmenes de forma declarativa.

```bash
├── app
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── compose.yml
```

### 1. Archivo `app.py`

```python
from flask import Flask, jsonify
import os
import psycopg2
import redis

app = Flask(__name__)

# Variables de entorno con valores por defecto
DB_HOST = os.environ.get("DB_HOST", "db")          # Nombre del servicio de base de datos
DB_USER = os.environ.get("DB_USER", "postgres")    # Usuario de PostgreSQL
DB_PASSWORD = os.environ.get("DB_PASSWORD", "ejemplo")  # Contraseña
DB_NAME = os.environ.get("DB_NAME", "demo")        # Nombre de la base de datos

# Conexión a Redis (servicio "cache" definido en compose.yml)
cache = redis.Redis(host="cache", port=6379, decode_responses=True)

@app.route("/")
def raiz():
    # Incrementa el contador de visitas en Redis
    visitas = cache.incr("visitas")
    
    # Conexión a PostgreSQL usando context manager
    with psycopg2.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, dbname=DB_NAME
    ) as conn, conn.cursor() as cur:
        cur.execute("SELECT 1;")  # Consulta simple para verificar conexión
        ok = cur.fetchone()[0]    # Obtiene el resultado (debería ser 1)
    
    return jsonify(visitas=visitas, db_ok=ok == 1)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # Escucha en todas las interfaces
```

### 2. Archivo `Dockerfile`

```dockerfile
# Imagen base ligera de Python 3.12
FROM python:3.12-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia primero requirements.txt para aprovechar caché de Docker
COPY requirements.txt .

# Instala dependencias sin caché para reducir tamaño
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código de la aplicación
COPY app.py .

# Puerto que expone la aplicación Flask
EXPOSE 5000

# Comando de inicio
CMD ["python", "app.py"]
```

### 3. Archivo `compose.yaml`

```yaml
services:
  web:
    build: ./app                    # Construye la imagen desde el Dockerfile en ./app
    ports:
      - "8080:5000"                 # Mapea puerto host:contenedor
    environment:
      DB_HOST: db                   # Nombre del servicio de base de datos
      DB_PASSWORD: ejemplo
      DB_NAME: demo
    depends_on:
      - db                          # Espera que db esté disponible
      - cache                       # Espera que cache esté disponible
    networks:
      - app-net                     # Conecta a la red personalizada

  db:
    image: postgres:16              # Imagen oficial de PostgreSQL 16
    environment:
      POSTGRES_DB: demo
      POSTGRES_PASSWORD: ejemplo
    volumes:
      - pgdata:/var/lib/postgresql/data  # Volumen persistente para datos
    networks:
      - app-net

  cache:
    image: redis:7-alpine           # Imagen ligera de Redis 7
    networks:
      - app-net

volumes:
  pgdata:                           # Declara el volumen persistente

networks:
  app-net:                          # Declara la red personalizada
```

## Comandos para gestionar la aplicación

Para montar la aplicación, se debe ejecutar desde el directorio donde se encuentra el archivo `compose.yaml`:

```bash
# Inicia todos los servicios en segundo plano
docker compose up -d
```

Para detener y eliminar los contenedores, redes y volúmenes creados por `up`:

```bash
# Detiene y elimina contenedores, redes y volúmenes
docker compose down
```

## Tabla de conceptos

| Concepto | Descripción | Comentarios adicionales |
|----------|-------------|-------------------------|
| **services** | Define los contenedores que forman parte de la aplicación | Cada servicio puede usar una imagen existente o construirse desde un Dockerfile |
| **volumes** | Persisten datos más allá del ciclo de vida del contenedor | Se declaran a nivel superior y se referencian en los servicios que los usan |
| **networks** | Redes personalizadas para la comunicación entre servicios | Por defecto, Compose crea una red por proyecto; declarar redes explícitas da más control |
| **build** | Especifica la ruta al Dockerfile para construir una imagen personalizada | Acepta opciones adicionales como `context`, `dockerfile` y `args` |
| **ports** | Mapea puertos del host al contenedor (formato `host:contenedor`) | Si se omite el puerto host, se asigna uno aleatorio |
| **environment** | Variables de entorno inyectadas en el contenedor | Se pueden definir en el archivo o en un archivo `.env` externo |
| **depends_on** | Define dependencias entre servicios para el orden de inicio | No espera a que el servicio esté "listo", solo a que el contenedor se inicie |
| **image** | Especifica la imagen base a utilizar desde un registro (Docker Hub, etc.) | Se puede combinar con `build` para etiquetar la imagen construida |
| **docker compose up -d** | Inicia todos los servicios en modo detached (segundo plano) | Es el comando principal para levantar el entorno completo |
| **docker compose down** | Detiene y elimina contenedores, redes y volúmenes anónimos | Usar `-v` para eliminar también volúmenes nombrados |

### Comentarios adicionales sobre Docker Compose

- **Versiones del formato**: Aunque el ejemplo usa la sintaxis moderna sin `version:`, versiones anteriores requerían declarar `version: '3'` o similar. La sintaxis actual (V2) es la recomendada.
- **Orden de inicio**: `depends_on` solo controla el orden de creación de contenedores, no la disponibilidad real del servicio. Para esperar a que un servicio esté listo, se recomienda usar scripts de healthcheck o herramientas como `wait-for-it.sh`.
- **Redes**: Todos los servicios en la misma red pueden comunicarse usando el nombre del servicio como hostname. En el ejemplo, `web` se conecta a `db` y `cache` usando los nombres de servicio.
- **Persistencia de datos**: El volumen `pgdata` asegura que los datos de PostgreSQL sobrevivan a reinicios del contenedor. Sin volúmenes, los datos se perderían al ejecutar `docker compose down`.
- **Variables de entorno**: Es buena práctica no hardcodear contraseñas en el archivo YAML. Se pueden usar archivos `.env` o la sección `secrets` para mayor seguridad.
- **Escalabilidad**: Docker Compose permite escalar servicios con `docker compose up -d --scale web=3`, aunque para entornos de producción se recomienda usar orquestadores como Kubernetes o Docker Swarm.