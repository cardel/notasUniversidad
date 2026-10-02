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

-   :material-sitemap:{ .lg .middle } **Hilos y procesos en Python**

    ---

    Qué comparten un hilo y un proceso, el GIL con sus dos imágenes, dónde
    va el `join`, el barrido de 2 a 16 hilos con listas y con NumPy y por
    qué solo el segundo escala, los doscientos hilos que dejan los cupos en
    negativo, la actualización perdida con su desensamblado, los procesos
    con su propio intérprete, los tres métodos de arranque, `Array`, `Value`,
    `shared_memory` y `Manager`, y lo que cuesta `Queue` frente a `Pipe`.

    [:octicons-arrow-right-24: Entrar](./Hilos%20y%20procesos%20en%20Python.md)

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Nueve actividades en el navegador, una por tema de la sesión: el turno del
    GIL, dónde va el `join`, el barrido de hilos con listas y con NumPy, la
    actualización perdida, las cinco herramientas de sincronización, hilos
    contra procesos medidos con `perf`, la memoria que no se hereda, la cola
    que bloquea y lo que cuesta serializar.

    [:octicons-arrow-right-24: Entrar](./Ejercicios.md)

-   :material-console:{ .lg .middle } **Código**

    ---

    Los seis programas de la sesión, corridos y con sus tiempos: las dos
    versiones de la suma con hilos, la carrera por los cupos, la
    actualización perdida, los cuadrados con memoria compartida y los tres
    mecanismos cronometrados.

    [:octicons-arrow-right-24: Entrar](./codigo/README.md)

</div>

## Antes de entrar

De la sesión de profiling se usa la diferencia entre reloj de pared y tiempo
de CPU, que aquí vuelve como núcleos ocupados, y la idea de que una rutina de
NumPy no ejecuta bytecode. De las estrategias de paralelización, el reparto en
trozos disjuntos y el costo fijo de crear un hilo: con procesos ese costo sube
a milisegundos y decide a partir de qué tamaño compensa repartir.

## Lo que quedó pendiente

El ejercicio del repositorio quedó para la casa: la práctica se intentó en la
sesión del martes y resultó más pesada de lo que cabía en el tiempo. Tiene
cuatro partes con un job del flujo por cada una: las tres formas de ejecutar
una lista de tareas, la actualización perdida con su cerrojo, la memoria
compartida entre procesos y el grupo de procesos con una cola. Está en la
pestaña de ejercicios prácticos del Campus Virtual y no lleva nota.

Las nueve actividades del navegador de [Ejercicios](./Ejercicios.md) siguen el
orden de la sesión. Las dos que más conviene tocar primero son la del turno
del GIL, que deja ver por qué dos hilos de cálculo no avanzan a la vez, y la
de la actualización perdida, que arma la traza de los tres pasos de un abono.

El parcial de este corte combina teoría y práctica de programación.
