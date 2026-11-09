# Clase 8. Docker: imágenes y contenedores

**Semana del 10 de noviembre de 2026.**

Un contenedor no es una máquina pequeña: es un proceso del anfitrión al que el
núcleo le cambió lo que ve y cuánto puede consumir. La sesión arranca por ahí,
leyendo los identificadores de namespace a los dos lados y los límites del
cgroup, y de ahí pasa a lo que se hace todos los días: escribir un
`Dockerfile` que no repita la instalación en cada cambio, levantar el
contenedor y publicarle un puerto, averiguar por qué no responde, y guardar lo
que tiene que sobrevivir cuando el contenedor se borre.

<div class="grid cards" markdown>

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Once actividades en el navegador, en el orden de la sesión: el disco que
    cuesta el tercer contenedor de una imagen y lo que informa `nproc` dentro
    de un cgroup de 1,5 núcleos, los cinco identificadores de namespace
    comparados con los del anfitrión, las ocho instrucciones del `Dockerfile`
    en el orden que les toca y los seis problemas de uno mal escrito, el mapeo
    de puertos y el servicio que escucha donde no debe, lo que sobrevive a
    `docker rm` y los siete `ping` que separan los dos modos de fallar de una
    red.

    [:octicons-arrow-right-24: Entrar](../../../actividades/infra/docker-imagenes/index.md)

</div>

## Antes de entrar

De la [introducción a los sistemas distribuidos](../C7/Clase%207.%20Introduccion%20a%20los%20sistemas%20distribuidos.md)
vuelve la idea de repartir el trabajo entre máquinas, y con ella la pregunta de
cómo se empaca un servicio para que corra igual en todas. De hilos y procesos
vuelve el proceso como unidad: un contenedor es un proceso más en la tabla del
anfitrión, con su PID visto desde fuera y otro distinto visto desde dentro.

## Lo que cubre la sesión

**Fundamentos.** Máquina virtual frente a contenedor, el mismo proceso medido
desde los dos lados, y los dos mecanismos del núcleo que lo hacen posible: los
namespaces deciden qué ve el proceso y los cgroups cuánto consume. Del
contenedor levantado con `--cpus=1.5 --memory=256m`, `cpu.max` dice 1,5
núcleos y `nproc` adentro responde 12, que son los del anfitrión.

**Construcción de imágenes.** La imagen como pila de capas, dónde se rompe la
caché y lo que cuesta: la misma edición de código tarda 2,374 s con las
dependencias arriba y 7,274 s con `COPY . /app` en el paso tres. Las
instrucciones del `Dockerfile`, la diferencia entre `CMD` y `ENTRYPOINT`, y los
errores que se pagan después: el tag móvil, la contraseña en `ENV`, la forma
del `CMD` que deja al intérprete de órdenes como proceso número uno.

**Ejecución y operación.** El ciclo de vida de un contenedor y la parada
ordenada, con los diez segundos de plazo que agota el proceso que no atiende
la señal. El mapeo de puertos, `docker ps`, `docker logs` y `docker port` para
saber qué pasó, los volúmenes para lo que tiene que sobrevivir al contenedor, y
las redes, donde el nombre de un contenedor solo se resuelve dentro de una red
creada a mano.

**Distribución.** El nombre de una imagen, `registro/usuario/imagen:tag`, lo
que Docker completa cuando falta, y por qué `latest` no sirve para desplegar.

## Material

Las diapositivas, las lecturas previas y el chequeo del tema están en el Campus
Virtual. El chequeo de Docker Compose y Swarm, que es el tema siguiente, cierra
el domingo 15 de noviembre.
