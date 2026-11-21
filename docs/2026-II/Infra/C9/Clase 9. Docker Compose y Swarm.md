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

-   :material-docker:{ .lg .middle } **Docker Compose y Swarm**

    ---

    Lo que se vio en la sesión, con las trazas que devolvieron las órdenes: el
    archivo que desaparece con el contenedor y los tres sitios donde algo
    puede durar, el nombre que nadie traduce en la red por defecto, las cinco
    órdenes manuales que pasan a un `compose.yml`, la columna de puertos donde
    la base y la caché aparecen sin dirección delante, el contador que sube de
    1 a 2 y vuelve a 1 cuando el servicio no declaró volumen, las dos filas
    que sobreviven en el volumen de PostgreSQL, los 30 segundos que tarda un
    sondeo en dar por caída a la base, los cinco contenedores de `--scale
    web=3`, el nodo solitario que ya aparece como líder, las tres tareas
    repartidas entre tres nodos y los tres lotes de una actualización
    progresiva.

    [:octicons-arrow-right-24: Entrar](./Docker%20Compose%20y%20Swarm.md)

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

-   :material-console:{ .lg .middle } **Código**

    ---

    Los cinco ejemplos que se levantaron: los tres servicios con su red y su
    volumen en un solo archivo, la cadena de dependencias con el sondeo de
    salud y la migración que corre una vez, el clúster de un nodo con sus dos
    tokens de unión, el stack con réplicas restringidas a los workers, y la
    actualización por lotes de dos con su vuelta a la versión anterior.

    [:octicons-arrow-right-24: Entrar](./codigo/README.md)

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
