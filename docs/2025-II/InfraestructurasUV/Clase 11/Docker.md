**Docker**

Es una utilidad para virtualización de contenedores que permite aislar aplicaciones.

**Componentes principales**
1. **Docker Engine**: Motor que ejecuta los contenedores
2. **Docker Daemon (dockerd)**: Gestiona los contenedores
3. **Docker CLI / Docker Desktop**: Permite administrar los contenedores (construirlos, compilarlos, lanzarlos y destruirlos)
4. **Docker Hub**: Repositorio para almacenar contenedores

**Partes de Docker**
1. **Imágenes**: Son plantillas inmutables para crear contenedores
2. **Contenedores**: Son instancias de imágenes que se crean a partir de las imágenes
3. **Volúmenes**: Carpetas compartidas entre el sistema host y el contenedor

Las aplicaciones dentro de los contenedores están aisladas. Docker usa capas del sistema de archivos para garantizar eficiencia.

**Configuración del sistema**
```bash
ls /var/run/docker.pid -rtla
ls /var/run/docker.sock -rtla
groups
```

1. **docker.pid**: Es el proceso de Docker, debe estar corriendo
2. **docker.sock**: Es el acceso al demonio de Docker (proceso). Observar que tiene acceso el grupo docker
3. El usuario debe pertenecer al grupo docker para poder ejecutar Docker sin privilegios de administrador (sudo)

**Comandos del CLI**
```bash
docker ps
docker build -t <nombre> .
docker run -d -p puerto_origen:puerto_destino
```

1. **docker ps**: Muestra los contenedores que están corriendo
2. **docker build**: Construye un contenedor a partir de un Dockerfile
3. **docker run**: Ejecuta un contenedor

**Dockerfile**
Un Dockerfile permite especificar cómo se construye un contenedor

```dockerfile
FROM postgres:18.0-alpine3.22

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=example_db

# start.sql
COPY start.sql /docker-entrypoint-initdb.d/

# volumen
VOLUME /db_data

EXPOSE 5432
```

Permite especificar qué imagen vamos a usar, configuraciones, volúmenes y el puerto en que va a trabajar.

**Ejemplo de archivo SQL (start.sql)**
```sql
CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE
);

CREATE TABLE libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor_id INT REFERENCES autores(id),
    genero VARCHAR(50),
    anio_publicacion INT,
    disponible BOOLEAN DEFAULT TRUE
);

INSERT INTO autores (nombre, nacionalidad, fecha_nacimiento) VALUES
('Gabriel Garcia Marquez', 'Colombiano', '1927-03-06'),
('Isabel Allende', 'Chilena', '1942-08-02'),
('J.K. Rowling', 'Britanica', '1965-07-31');

INSERT INTO libros (titulo, autor_id, genero, anio_publicacion, disponible) VALUES
('Cien Años de Soledad', 1, 'Realismo Magico', 1967, TRUE),
('La Casa de los Espíritus', 2, 'Realismo Magico', 1982, TRUE),
('Harry Potter y la Piedra Filosofal', 3, 'Fantasia', 1997, TRUE);
```

**Ejecución de comandos**
```bash
docker build -t basesita .
docker run -d -p 5432:5432 basesita:latest
docker run -d -p 5430:5432 basesita:latest
docker ps
```

**Para detener contenedores**
```bash
docker stop youthful_snyder
docker stop amazing_archimedes
docker ps
```

**Ejemplos adicionales de uso**
- **Desarrollo web**: Contenedores con Nginx, Apache, Node.js
- **Bases de datos**: MySQL, MongoDB, Redis en contenedores aislados
- **Microservicios**: Arquitecturas distribuidas con múltiples contenedores
- **CI/CD**: Entornos de testing reproducibles

**Comandos útiles adicionales**
```bash
docker images          # Listar imágenes
docker rm <container>  # Eliminar contenedor
docker rmi <image>     # Eliminar imagen
docker logs <container> # Ver logs del contenedor
docker exec -it <container> bash # Acceder al contenedor
```

**Resumen de comandos Docker**

| Comando | Función | Ejemplo |
|---------|---------|---------|
| docker ps | Listar contenedores activos | docker ps |
| docker build | Construir imagen | docker build -t mi-app . |
| docker run | Ejecutar contenedor | docker run -d -p 8080:80 mi-app |
| docker stop | Detener contenedor | docker stop nombre_contenedor |
| docker images | Listar imágenes | docker images |
| docker rm | Eliminar contenedor | docker rm contenedor_id |
| docker rmi | Eliminar imagen | docker rmi imagen_id |
| docker logs | Ver logs | docker logs contenedor |