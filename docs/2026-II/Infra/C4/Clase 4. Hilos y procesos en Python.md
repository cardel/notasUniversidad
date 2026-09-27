# Clase 4. Hilos y procesos en Python

**Semana del 29 de septiembre de 2026.**

Sumar cien millones de números con dieciséis hilos tarda lo mismo que con uno,
y con dos tarda más. La sesión arranca de esa medición y va a buscar el freno:
el GIL, que deja ejecutar bytecode a un hilo a la vez. De ahí salen las dos
salidas del curso: los hilos sirven cuando el programa espera, y cuando el
programa calcula hay que cambiar de herramienta y usar procesos, que traen su
propio problema, porque cada uno tiene su memoria y hay que decidir cómo se
pasan los datos.

<div class="grid cards" markdown>

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Nueve actividades en el navegador, una por tema de la sesión: el turno del
    GIL, dónde va el `join`, el barrido de hilos con listas y con NumPy, la
    actualización perdida, las cinco herramientas de sincronización, hilos
    contra procesos medidos con `perf`, la memoria que no se hereda, la cola
    que bloquea y lo que cuesta serializar.

    [:octicons-arrow-right-24: Entrar](Ejercicios.md)

</div>

## Antes de entrar

De la sesión de profiling se usa la diferencia entre reloj de pared y tiempo
de CPU, que aquí vuelve como núcleos ocupados, y la idea de que una rutina de
NumPy no ejecuta bytecode. De las estrategias de paralelización, el reparto en
trozos disjuntos y el costo fijo de crear un hilo: con procesos ese costo sube
a milisegundos y decide a partir de qué tamaño vale la pena repartir.

Los apuntes y el código de la sesión se publican después de las dos clases de
la semana.
