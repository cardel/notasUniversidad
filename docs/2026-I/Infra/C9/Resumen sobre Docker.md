
# Estructura Dockerfile

```dockerfile
FROM imagen:tag #imagen base
WORKDIR /ruta # dentro del contenedor carpeta de trabajo
COPY origin destino #Copiar del host al contenedor
RUN comando # Ejecutar una orden
ENV CLAVE=valor #Variables de enterono
EXPOSE puerto #Puerto abierto en el contenedor
USER nbombre #Cambia el usuario (root por defecto)
CMD ["bin","arg"] #comando por defecto
ENTRYPOINT ["bin"] # ejecutable
```

Los CMD despues de entrypoint son los parametros de entrada

```dockerfile
ENTRYPOINT ["python", "app.py"]
CMD ["--puerto", "5000"]
CMD ["--output", "salida.log"]
```

Por preferencia Entrypoint porque nos permite conocer el estado actual del comando

## Buenas practicas

1. From evitar latest
2. Evitar Correr el app como root
3. Evitar USar ENV para contraseñas o tokens
4. Evitar COPY . /app antes de instalar depenencias
5. Evitar Mezclar app-get update y apt-get install (usarlos de forma separada)
6. No limpiar caches de paquetes
7. Usar .dockerignore permite excluir archivos del comando COPY
8. Usar imagenes pequeñas pequeña como alpine (pero entender que tienen limitaciones)

# ARG vs ENV

Arg solo usa en el build y ENV es permanente para el contendedor


# Limites al contenedor

Se recomienda

1. --cpu=N fraccion de CPU del host utilizad
2. --memory=N limite para la RAM
3. --memory-swap limite para el SWAP


# Almacenamiento

Cuando se borra un contenedor se pierde todo lo que tiene, para eso contamos con 3 mecanismos:

1. bind mount: Es un directorio host (usar solo en desarrollo)
2. volumen nombrado Administrado por docker (carpeta logica), podemos gestionarlos como si fuera un disco extraible para los contenedores y el host
3. tempfs (secrets)

## Volumenes

Los pdoemos gestionar docker volume, ahora tambien en el dockerfile podemos utilizar la instrucciones VOLUME por crear o conectarnos a volumenes disponibles.

Por ejemplo en una base de datos es altamente recomendable que la BD (archivos) estén en un volumen.

# Limitaciones

Las redes de docker nos permiten manejar como se ven los contenderos, pero cuando son muchos, ya se torna complicado. Cuando necesitamos que varios contenedores interactuen entre sí, a esto se le conoce como orquestación.

- Docker compose
- Kubernetes