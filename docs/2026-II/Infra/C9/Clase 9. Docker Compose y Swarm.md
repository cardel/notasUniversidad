# Clase 9. Docker Compose y Swarm

**Semana del 17 de noviembre de 2026.**

Una aplicación de verdad no es un contenedor: es el servicio web, su base de
datos y su caché, que tienen que levantarse juntos, encontrarse por nombre y
conservar lo que escriben. Hacer eso con `docker run` a mano son tres órdenes
largas y un orden que nadie recuerda al día siguiente. La sesión pasa esas tres
órdenes a un solo archivo, lo opera, y después lleva ese mismo archivo a un
clúster de varias máquinas, donde aparece lo que una sola no puede dar:
réplicas repartidas, un puerto que responde en todos los nodos y una
actualización que se hace por lotes sin tumbar el servicio.

<div class="grid cards" markdown>

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Ocho actividades en el navegador, en el orden de la sesión, más las dos de
    volúmenes y redes que vuelven de la sesión anterior: qué clave del archivo
    reemplaza a cada bandera y por qué solo un servicio publica puerto, las
    cuatro secciones de raíz y la referencia que se quedó sin definición, las
    tres condiciones de `depends_on` y el tiempo que tarda un `healthcheck` en
    dar por caída a la base, cuántas filas sobreviven a `down` y qué se lleva
    `down -v`, los contenedores que deja `--scale web=3` y el puerto contra el
    que choca, el reparto de responsabilidades entre manager y worker, el
    `3/3` con las tres tareas en tres nodos, y los lotes de una actualización
    progresiva sobre seis réplicas.

    [:octicons-arrow-right-24: Entrar](../../../actividades/infra/docker-compose/index.md)

</div>

## Antes de entrar

De [Docker: imágenes y contenedores](../C8/Clase%208.%20Docker,%20imagenes%20y%20contenedores.md)
vuelven las tres piezas sobre las que se arma todo esto: la imagen que se
construye una vez y el contenedor que se tira, el volumen que le sobrevive, y
la red creada a mano, cuyo servicio de nombres deja que un contenedor encuentre
a otro sin saberse su dirección. Aquí dejan de ser órdenes sueltas y pasan a
ser claves de un archivo.

## Lo que cubre la sesión

**Volúmenes y redes, otra vez y en serio.** El sistema de archivos del
contenedor es efímero y hay tres mecanismos para que algo dure, vistos en una
sola corrida. La red por defecto frente a una creada por el usuario, qué
alcanza a quién entre dos redes, y el mapeo de puertos con `-p` al lado del
modo `host`.

**Fundamentos de Compose.** La aplicación web con su base y su caché, primero
con `docker run` a mano para ver el problema y después en un `compose.yml`. Lo
que muestra `docker compose ps`, donde la base y la caché exponen su puerto
dentro de la red y solo el servicio web lo publica hacia fuera, y las dos
peticiones que prueban que cada pieza está donde se la espera. Las cuatro
secciones de raíz del archivo, y `depends_on` con condición, que es lo que
separa ordenar el arranque de esperar a que el servicio atienda.

**Operación.** El ciclo del día a día, de `up -d` a `logs`, `exec` y `down`.
Qué sobrevive a bajar el sistema y qué se lleva `down -v`. El nombre del
proyecto, que Compose toma de la carpeta. Y el escalado con `--scale`, con su
techo: Compose levanta varias réplicas y no reparte el tráfico entre ellas.

**Swarm.** Lo que empieza donde Compose plano se queda corto. Managers y
workers, `docker swarm init` y lo que informa un nodo solo. Servicios y
réplicas, con el `3/3` y el reparto de las tareas entre los nodos sin que nadie
lo indique, y el puerto que es del servicio y no de la réplica. Los stacks, que
son el mismo archivo con una sección `deploy`. Y la actualización progresiva
por lotes, con su espera, su orden de arranque y el regreso a la versión
anterior cuando un lote no sirve.

## Material

Las diapositivas, el material de lectura previa y el chequeo del tema están en
el Campus Virtual, junto con el código de los ejemplos que se levantan en
clase.
