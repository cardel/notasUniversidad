
Docker es muy util cuando las aplicaciones solo tienen un contenedor, pero usualmente necesitamos orquestar (varias aplicaciones trabajando en conjunto) para presentar un servicio

Aplicacion Web:
- Frontend expuesto al usuario
- Backend que se comunica con el frontend tiene la logica de negocio
- Base de datos: Persistencia

Podriamos tener todo esto en un solo contenedor, es dificil de mantener, cualquier cambio implica redesplegar todo. Por ejemplo un cambio en el backend haria que tambien toque desplegar el front.

Es mejor tener orquestacion

1. Contenedor para el backend
2. Contenedor para el fronted
3. Contenedor/Servicio para la base de datos

Pero esto requiere que estos se puedan comunicar y esto implica ciertos desafios

1. Configurar volumenes
2. Configurar REDES
3. Configurar parametros como el CORS (Origines permitidos cuando se comunican aplicaciones)


# Temas

1. [Docker compose](Docker%20compose.md)
2. [Docker Swarm](Docker%20Swarm.md)