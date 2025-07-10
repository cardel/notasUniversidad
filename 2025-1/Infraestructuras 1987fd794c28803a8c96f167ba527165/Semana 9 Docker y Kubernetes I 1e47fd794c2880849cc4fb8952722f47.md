# Semana 9: Docker y Kubernetes I

# Docker

Dockerfile

```docker
FROM nginx:1.27.5-alpine

EXPOSE 80
```

Comandos

```bash
docker login #Autenticarse en el docker hub, tienen que tener una cuenta
#En caso de problemas rm ~/.docker/config.json
docker build -t servidorimage . #En la misma carpeta del docker file
docker image ls
docker run 
docker run --name servidorcontenedor -p 8080:80 servidorimage
#Meterse a la url localhost:8080
#En caso de problemas
docker rm servidorcontenedor
#servidorimagen y servidorcontenido son nombre arbitrarios
docker run --name servidorcontenedor -p 8080:80 -d servidorimage
#Con esto nos queda corriendo en segundo plano
docker ps #Puedo ver los contenedores que están corriendo
docker ps -a #Puedo ver todos lo contendores (encendido y apagados)
docker stop servidorcontendor #Parar el contedor
docker restart servidorcontenedor #Reiniciar el contenedor
```

## ¿Que es docker?

Es un servicio de virtualización basado en contenedores, es decir estos utilizan el sistema operativo para administrar recursos, como una aplicación aislada que utiliza los recursos del sistema

### Partes de Docker

1. **Docker Engine**: Es el núcleo de Docker. Se encarga de construir, ejecutar y gestionar contenedores. Incluye el servidor (daemon), la API REST y la interfaz de línea de comandos (CLI).
2. **Docker Images**: Son plantillas de solo lectura utilizadas para crear contenedores. Contienen el sistema operativo base, las aplicaciones y las dependencias necesarias.
3. **Docker Containers**: Son instancias ejecutables de imágenes de Docker. Funcionan como entornos aislados donde se ejecutan aplicaciones.
4. **Docker Hub**: Es un repositorio en la nube donde los usuarios pueden compartir y almacenar imágenes de Docker. También es posible descargar imágenes públicas.
5. **Dockerfile**: Es un archivo de configuración que define cómo se debe construir una imagen de Docker, especificando instrucciones como el sistema operativo base y las dependencias.
6. **Docker Compose**: Es una herramienta que permite definir y ejecutar aplicaciones de múltiples contenedores mediante un archivo YAML.
7. **Docker Networking**: Proporciona la capacidad de conectar contenedores entre sí y con el mundo exterior, asegurando la comunicación necesaria.
8. **Docker Volumes**: Se utilizan para gestionar el almacenamiento persistente de datos, permitiendo que los contenedores compartan información o guarden datos incluso después de ser eliminados.

# Ejercicio

Se agregan imagenes y un archivo HTML, por ejemplo

```docker
FROM nginx:1.27.5-alpine

# Copiar index.html to the default nginx directory
COPY index.html /usr/share/nginx/html/index.html
COPY principito.png /usr/share/nginx/html/principito.png
#Esto es un ejemplo pilas

EXPOSE 80
```

```bash
#Borrar si es necesario
#docker stop servidorcontainer
#docker rm servidorcontainer
docker build -t servidorimagen .
docker run --name servidorcontainer -p 8080:80 -d servidorimagen
```

# Docker compose

Docker Compose es una herramienta que permite definir y gestionar aplicaciones de múltiples contenedores de manera sencilla utilizando un archivo YAML. En este archivo, los desarrolladores pueden especificar los servicios necesarios, las redes, los volúmenes y las configuraciones específicas para cada contenedor. Docker Compose facilita la creación y ejecución de entornos complejos al automatizar la configuración y puesta en marcha de varios contenedores relacionados entre sí.

Usar Docker Compose es importante para la orquestación porque permite coordinar y gestionar múltiples contenedores que trabajan juntos como una unidad. Esto es especialmente útil en aplicaciones modernas que suelen estar compuestas por diversos servicios como bases de datos, servidores web y servicios de backend. Con Docker Compose, se puede garantizar que todos los componentes se inicien en el orden correcto y con las configuraciones necesarias.

La orquestación, en este contexto, se refiere al proceso de gestionar y coordinar múltiples contenedores para que trabajen juntos de manera eficiente y escalable. Por ejemplo, en una aplicación web, podrías tener un contenedor para el frontend, otro para el backend y un tercero para la base de datos. Con Docker Compose, puedes definir cómo se conectan estos servicios, cómo comparten datos y cómo se inician juntos, facilitando el desarrollo y despliegue de la aplicación.

**Ejemplo de orquestación con Docker Compose:**

Archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: nginx:1.27.5-alpine
    ports:
      - "8080:80"
    volumes:
      - ./frontend:/usr/share/nginx/html
    depends_on:
      - backend

  backend:
    image: python:3.9
    working_dir: /app
    volumes:
      - ./backend:/app
    command: python app.py
    depends_on:
      - database

  database:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase

```

Este archivo define una aplicación con tres servicios: un servidor web (frontend), un backend en Python y una base de datos PostgreSQL. Docker Compose asegura que la base de datos se levante antes que el backend, y que el backend esté operativo antes de que el frontend se conecte, garantizando una orquestación adecuada. Esto simplifica la gestión de aplicaciones complejas y mejora la productividad del desarrollo.

# Ejemplo mysql, postgres y adminer

```bash
#Rutas
.
├── adminer
│   └── Dockerfile
├── docker-compose.yml
├── mysql
│   └── Dockerfile
└── postgres
    └── Dockerfile
```

## Dockerfile mysql

```docker
FROM mysql:9.3

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=mydb

#Port
EXPOSE 3306

#inject sql script
#COPY ./init.sql /docker-entrypoint-initdb.d/
```

## Docker postgres

```bash
FROM postgres:17

#Environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=postgres

#postgres configuration
EXPOSE 5432
```

## Docker adminer

```bash
FROM adminer:latest

EXPOSE 8080
```

## Docker compose

docker-compose.xml

```bash
services:
  postgres:
    build: ./postgres/
    ports:
      - 5432:5432
    container_name: postgres
    hostname: pg

  mysql:
    build: ./mysql/
    ports:
      - 3306:3306
    container_name: mysql
    hostname: my

  adminer:
    build: ./adminer/
    ports:
      - 8080:8080
    container_name: adminer

```

## Comandos para levantarlo

```bash
# hacer docker image y docker run en cada carpeta o bien
docker compose up -d #Levantar los servers
docker compose down #Bajar los servers
```

# Resumen

Docker es una herramienta de virtualización basada en contenedores que permite a los desarrolladores crear, implementar y ejecutar aplicaciones de manera eficiente. Los contenedores son entornos aislados que incluyen todo lo necesario para ejecutar una aplicación, como el sistema operativo, bibliotecas y dependencias. Esto hace que las aplicaciones sean portables y fáciles de gestionar.

### Componentes importantes de Docker

1. **Docker Engine**: El núcleo que gestiona la construcción y ejecución de contenedores.
2. **Docker Images**: Plantillas de solo lectura usadas para crear contenedores.
3. **Docker Containers**: Instancias ejecutables de las imágenes.
4. **Docker Hub**: Repositorio en la nube para compartir y descargar imágenes.
5. **Docker Compose**: Herramienta para orquestar múltiples contenedores usando un archivo YAML.
6. **Docker Networking**: Facilita la comunicación entre contenedores.
7. **Docker Volumes**: Maneja el almacenamiento persistente de datos.

### Uso práctico: Docker Compose

Docker Compose facilita la orquestación de aplicaciones complejas al coordinar múltiples contenedores. Un ejemplo típico es una aplicación web que incluye:

- Un servidor web como Nginx (frontend).
- Un servicio backend en Python.
- Una base de datos PostgreSQL.

**Ejemplo real:** Una startup de e-commerce podría usar Docker Compose para levantar su entorno de desarrollo. Con un solo comando (`docker-compose up`), podrían iniciar un servidor web para la tienda, un backend que gestione las compras y una base de datos para almacenar información del inventario y clientes. Esto ahorra tiempo y asegura consistencia entre los desarrolladores.

```yaml
version: '3.8'
services:
  frontend:
    image: nginx:1.27.5-alpine
    ports:
      - "8080:80"
  backend:
    image: python:3.9
    command: python app.py
  database:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase

```

### Motivación para los estudiantes

Docker no solo simplifica el desarrollo al garantizar que las aplicaciones funcionen en cualquier entorno, sino que también es una herramienta clave en la industria tecnológica moderna. Por ejemplo, empresas como Netflix y Spotify usan Docker para escalar sus servicios y garantizar disponibilidad global. Aprender a usar Docker y Docker Compose les dará a los estudiantes una ventaja competitiva en el mercado laboral.

Además, al dominar Docker, podrán replicar entornos complejos en sus proyectos personales o colaborativos, reduciendo los tiempos de configuración y aumentando su productividad. ¡Empieza a experimentar con Docker hoy y prepárate para el futuro de la tecnología!