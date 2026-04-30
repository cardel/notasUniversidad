# Comandos importantes de Docker

Docker es una plataforma de contenedores que permite empaquetar aplicaciones con sus dependencias en unidades ligeras y portátiles. A continuación se presentan los comandos fundamentales para la gestión de contenedores e imágenes.

```bash
# Muestra los contenedores que están actualmente en ejecución
docker ps

# Arranca un contenedor en segundo plano (modo detached)
# -d: ejecuta el contenedor en segundo plano
# --name <nombre>: asigna un nombre personalizado al contenedor
# -p <host>:<contenedor>: mapea un puerto del host a un puerto del contenedor
# <imagen>: especifica la imagen base a utilizar
docker run -d --name <nombre> -p <host>:<contenedor> <imagen>

# Detiene un contenedor en ejecución identificado por su nombre o ID
docker stop <nombre>

# Elimina un contenedor detenido del sistema
docker rm <nombre>

# Muestra todas las imágenes disponibles localmente en el host
docker images

# Ingresa a un contenedor de forma interactiva y lo elimina al salir
# --rm: elimina el contenedor automáticamente al finalizar la sesión
# -it: modo interactivo con terminal
# <image>: imagen base del contenedor
# <comando>: comando a ejecutar al iniciar (por ejemplo, /bin/bash)
docker run --rm -it <image> <comando>
```

---
# Ejemplos


```bash
# 1. Ver contenedores en ejecución
docker ps

# 2. Ejecutar un contenedor de Nginx en segundo plano
# -d: modo detached (segundo plano)
# --name mi-nginx: nombre del contenedor
# -p 8080:80: mapea el puerto 8080 del host al puerto 80 del contenedor
# nginx:latest: imagen oficial de Nginx
docker run -d --name mi-nginx -p 8080:80 nginx:latest

# 3. Detener el contenedor llamado "mi-nginx"
docker stop mi-nginx

# 4. Eliminar el contenedor "mi-nginx" (debe estar detenido)
docker rm mi-nginx

# 5. Ver todas las imágenes disponibles localmente
docker images

# 6. Ingresar a un contenedor interactivo de Ubuntu y eliminarlo al salir
# --rm: elimina el contenedor al salir
# -it: modo interactivo con terminal
# ubuntu:latest: imagen base de Ubuntu
# /bin/bash: comando para abrir una shell bash
docker run --rm -it ubuntu:latest /bin/bash

# 7. Ejecutar un contenedor de Alpine Linux y ejecutar un comando simple
# alpine:latest: imagen ligera de Alpine Linux
# echo "Hola desde Alpine": comando a ejecutar
docker run --rm alpine:latest echo "Hola desde Alpine"

# 8. Listar todos los contenedores (incluyendo los detenidos)
docker ps -a

# 9. Forzar la eliminación de un contenedor en ejecución
docker rm -f mi-nginx

# 10. Descargar una imagen sin ejecutarla
docker pull python:3.9-slim
```

**Explicación de los ejemplos:**

- **Ejemplo 2**: Crea un servidor web Nginx accesible desde `http://localhost:8080`.
- **Ejemplo 6**: Abre una terminal interactiva dentro de un contenedor Ubuntu; al escribir `exit` el contenedor se elimina automáticamente.
- **Ejemplo 7**: Ejecuta un comando simple y el contenedor termina inmediatamente después.
- **Ejemplo 10**: Descarga la imagen de Python 3.9 slim para usarla posteriormente sin ejecutarla de inmediato.

## Tabla de resumen de conceptos

| Comando | Función | Comentarios adicionales |
| :--- | :--- | :--- |
| `docker ps` | Lista los contenedores en ejecución. | Usar `docker ps -a` para ver también contenedores detenidos. |
| `docker run -d --name <nombre> -p <host>:<contenedor> <imagen>` | Crea e inicia un contenedor en segundo plano con mapeo de puertos. | El flag `-d` permite que el contenedor corra en segundo plano sin bloquear la terminal. |
| `docker stop <nombre>` | Detiene un contenedor en ejecución de forma graceful. | Envía señal SIGTERM primero; si no responde, envía SIGKILL tras un tiempo de espera. |
| `docker rm <nombre>` | Elimina un contenedor detenido del sistema. | No se puede eliminar un contenedor en ejecución sin antes detenerlo o usar `-f`. |
| `docker images` | Muestra las imágenes descargadas localmente. | Las imágenes son plantillas de solo lectura que se usan para crear contenedores. |
| `docker run --rm -it <image> <comando>` | Inicia un contenedor interactivo que se elimina al salir. | El flag `--rm` evita la acumulación de contenedores temporales; útil para pruebas rápidas. |
| Concepto: Contenedor | Unidad ejecutable ligera que encapsula una aplicación y sus dependencias. | Aísla procesos del host anfitrión, pero comparte el kernel del sistema operativo. |
| Concepto: Imagen | Plantilla inmutable que define el sistema de archivos y la configuración de un contenedor. | Se construye a partir de un `Dockerfile` y se almacena en un registro como Docker Hub. |
| Concepto: Mapeo de puertos (-p) | Redirige el tráfico de un puerto del host a un puerto del contenedor. | Permite acceder a servicios dentro del contenedor desde el exterior. |
| Concepto: Modo interactivo (-it) | Conecta la terminal del host con la entrada/salida estándar del contenedor. | Necesario para ejecutar shells o comandos que requieren interacción del usuario. |
# Recursos

1. [Aplicacion básico](Aplicacion%20básico.md)