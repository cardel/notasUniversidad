# Clase 09: Introducción sistemas distribuidos

# Docker

## Apuntes de permisos

```bash
#Solo problemas de permisos de docker en su PC personal
sudo usermod -G docker <su-usuario>
#Reiniciar
```

## Ejercicio levantar una base de datos

```docker
#Levantar un servicio de bd con mysql

#Imagen base
FROM mysql:9.1.0

#Variables de entorno
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=prueba
ENV MYSQL_USER=prueba
ENV MYSQL_PASSWORD=prueba

#Puerto 
EXPOSE 3306
```

1. Debe crear un cuenta en el Docker hub [https://hub.docker.com/](https://hub.docker.com/) 
2. Luego 

```bash
docker login
```

1. Ubicar en el terminal la carpeta que tiene el Dockerfile
2. Construir la imagen 

```bash
docker image build -t my-mysql .
```

1. Verificar que la imagen ha sido construida 

```bash
docker image ls
```

1. Ejecutamos la imagen

```bash
docker run -p 3306:3306 my-mysql:latest 
```

1. Verificamos la imagen

```bash
docker ps
```

## Adminer

```bash
docker build -t my-adminer .
docker run -p 8080:8080 my-adminer:latest
```

## Problema

- Los contenedores no se puede ver entre sí
- Para resolver este problema tenemos una herramientas llamada docker-compose

# Docker compose

Nos permite orquestar contenedores de forma unificada, pero tiene limitaciones, una de ellas es que para bajar los contenedores es necesario hacerlo desde la ublicación docker-compose.yml

```yaml
#Este docker-compose va a levantar dos contenedores
#Adminer/Dockerfile que levanta el servicio adminer en el puerto 8080
#ejemploBD/Dockerfile que levanta un servicio mysql en el puerto 3306

services:
  bd-mysql:
    build: ./ejemploBD    
    ports:
      - "3306:3306"

  postgres:
    image: postgres
    ports:
      - "5432:5432"
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres

  service-adminer:
    build: ./Adminer
    ports:
      - "8080:8080"

```

## Uso

```yaml
docker-compose up
docker-compose down
```

# Recomendación final

```yaml
docker logout
```