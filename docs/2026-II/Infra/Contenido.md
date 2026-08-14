# Infraestructuras Paralelas y Distribuidas

Universidad del Valle, sede Tuluá · Escuela de Ingeniería de Sistemas y
Computación · Agosto – Diciembre de 2026

Este sitio guarda **lo que se hizo en clase**: notas, mediciones, ejemplos y
código. La programación del curso, el material de lectura previa, las entregas
y las notas están en el Campus Virtual. Los dos grupos ven el mismo temario,
así que estas notas sirven para ambos.

## Horario

| Grupo | Día | Hora | Salón |
|---|---|---|---|
| 50 | Jueves | 10:00 a. m. – 1:00 p. m. | Sala de Sistemas 2, sede Príncipe |
| 51 | Martes | 2:00 p. m. – 5:00 p. m. | Sala de Sistemas 1, sede Príncipe |

El grupo 51 va dos días adelante del 50 dentro de la misma semana, de modo que
lo que aparece aquí un martes es lo que el otro grupo verá el jueves.

## Notas de clase

Se publican después de cada sesión.

### Corte 1

*Aún no hay clases publicadas.*

### Corte 2

*Aún no hay clases publicadas.*

## De qué se trata el curso

El recorrido va de una máquina con un solo hilo de ejecución a muchas máquinas
coordinadas. Primero se mide, para saber dónde se pierde el tiempo. Después se
paraleliza dentro de una máquina, con hilos, procesos, OpenMP y vectorización.
Al final el trabajo se reparte entre máquinas, con contenedores, orquestación
y despliegue continuo.

Casi todo se comprueba corriendo. Cada técnica que se ve en clase viene con su
medición de tiempos, de *speedup* y de eficiencia: una paralelización que no se
mide no se sabe si sirvió.

## Herramientas

Python (`threading`, `multiprocessing`, `cProfile`, `pyinstrument`), C++17 con
OpenMP e Intel TBB, instrucciones AVX, `perf`, Valgrind, `htop`, Docker, Docker
Compose, Swarm, Kubernetes y GitHub Actions.

## Referencias

- Tanenbaum, A. S., y van Steen, M. *Distributed Systems*. Van Haren, 2017.
- McCool, M., Reinders, J., y Robison, A. *Structured Parallel Programming*.
  Morgan Kaufmann, 2012.
- Rauber, T., y Rünger, G. *Parallel Programming for Multicore and Cluster
  Systems*, 2.ª edición. Springer, 2013.
- Documentación de [OpenMP](https://www.openmp.org/specifications/),
  [Docker](https://docs.docker.com/) y
  [Kubernetes](https://kubernetes.io/docs/home/).
