No podemos hacer faciltamente orquestación, varios contenedores y servicios trabajando en conjunto

# Ejemplo

Se han construido esta estructura

```bash
.
├── adminer
│   └── Dockerfile
├── mysql
│   └── Dockerfile
└── postgres
    └── Dockerfile
```

- adminier es una app en Php para conectarse a multiples bases de datos, se expone puerto 8080
- mysql utiliza una imagen de mariadb, se expone 3306 y MARIADB_ROOT_PASSWORD=rootpassword
- postgres utiliza una imagen de postgres expone 5306  ENV OSTGRES_PASSWORD=rootpassword ENV POSTGRES_DB=mydatabase ENV POSTGRES_USER=myuser
Se ejecutan estos comandos

```bash
 #Construir las imagenes
 docker build -t adminer adminer
 docker build -t mysql mysql/
 docker build -t postgres postgres/
 
 
 #LAnzar contenedores
 8729* docker run -d -p 8080:8080 adminer:latest
 8733* docker run -d -p 3306:3306 mysql:latest
 8734* docker run -d -p 5432:5432 postgres:latest}
 
 #Revisar
 docker ps
```

Localmente con un programa se pueden acceder las bases de datos

![](attachments/Pasted%20image%2020251104153405.png)

Pero al ingresar al adminer localhost:8080 este no puede ver los otros contenedores

# Docker compose

Docker compose permite orquestar contendedores de tal forma se puedan ver entre ellos, además permite configurar los tipos de redes que van a usarse entre, por ejemplo, si por alguna razón quiero que un contenedor tenga acceso a internet.

Se crea el archivo docker-compose.yaml

```yaml
services:
  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080

  mariadb:
    image: mariadb
    restart: always
    ports:
      - 3306:3306
    environment:
      MARIADB_ROOT_PASSWORD: rootpassword

  postgres:
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: rootpassword
      POSTGRES_DB: mydb
    ports:
      - 5432:5432

```

Para levantar los servicios

```bash
docker compose up -d
```

Para bajar los servicios

```bash
docker compose down
```