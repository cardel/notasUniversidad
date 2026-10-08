# Ejercicios · Infra C4

Clase 4 — hilos y procesos en Python (29 de septiembre y 1 de octubre). Los
apartados van en el orden de la clase y todos se resuelven en el navegador.
Cada uno parte de una medición de la sesión y la deja mover: antes de ver un
número hay que escribirlo, y cada respuesta equivocada dice por qué no.

## Conceptos fundamentales

### [Quién tiene el GIL](widgets/gil.html){ target=_blank rel=noopener }

Ocho tareas repartidas entre hilos, y un solo permiso para ejecutar. Escriba
cuánto tarda el programa de esperas con cuatro hilos, que sale de la tabla, y
compárelo con lo que hace el de cálculo puro: ahí la cuenta da más que con un
solo hilo, y eso fue lo que midió la clase. El paso a paso muestra el turno
del GIL, con los tramos de cálculo en fila india y los de espera solapados.
Termina en la pregunta que separa los dos mundos: dónde ayudan los hilos y
dónde solo estorban.

## Threading en Python

### [Dónde va el join](widgets/unir.html){ target=_blank rel=noopener }

Los mismos dos hilos con los `join` en dos lugares distintos. Prediga el total
de cada versión y después recorra las cuatro operaciones una por una, con la
línea de código resaltada y el Gantt de los dos hilos y del principal. Un
`join` pegado al `start` deja el programa secuencial sin que nada en el texto
lo anuncie.

### [El barrido de 2 a 16 hilos](widgets/barrido.html){ target=_blank rel=noopener }

Sumar cien millones de números, primero con una lista de Python y después con
NumPy. Escriba los dos tiempos antes de verlos: con cuatro hilos el programa
tarda más que con uno, y el cambio a NumPy divide el tiempo secuencial por
ciento doce sin usar un solo hilo. Las dos últimas preguntas son por qué NumPy
sí escala y por qué se detiene en 24 milisegundos.

### [La actualización perdida](widgets/carrera.html){ target=_blank rel=noopener }

Dos hilos abonando sobre el mismo saldo. El abono son tres pasos, y entre el
primero y el tercero cabe el otro hilo: la traza lo muestra fila por fila, con
el registro de cada uno y el saldo. Después, cinco corridas del mismo programa
que dan cinco resultados distintos y ninguno correcto, contra la tabla que se
midió en clase.

### [Cinco herramientas de sincronización](widgets/sincronizacion.html){ target=_blank rel=noopener }

Ocho situaciones y `Lock`, `RLock`, `Semaphore`, `Event` y `Condition` como
respuesta, con retroalimentación por cada una y marcador de aciertos a la
primera. Al final, la cuenta que explica por qué un cerrojo mal puesto deja
ocho hilos corriendo como si fuera uno.

## Multiprocessing en Python

### [Hilos contra procesos](widgets/procesos.html){ target=_blank rel=noopener }

Lo que midió `perf`: cuatro hilos ocupando un núcleo y cuatro procesos
ocupando tres. Prediga los núcleos a partir del tiempo de CPU y del reloj, y
después mueva el costo de arrancar un proceso y el trabajo por elemento para
ver dónde queda el punto en que repartir empieza a pagar.

### [Memoria que no se comparte](widgets/memoria.html){ target=_blank rel=noopener }

El hijo imprime la lista llena y el padre la imprime vacía. Qué ve cada
proceso con una variable global, con un argumento, con un `Array` y con un
`Manager`, y qué cambia entre `fork`, `forkserver` y `spawn` al crear el hijo.
La última pregunta es la que aparece cuando un programa funciona en Linux y
falla en Windows.

## Comunicación entre procesos

### [La cola que bloquea](widgets/cola.html){ target=_blank rel=noopener }

`put` y `get` sobre una `Queue` con capacidad. Prediga cuántos `put` alcanzan
a completarse antes de que el productor se frene, y siga la cola paso a paso
con los dos procesos y sus bloqueos. Que `get` bloquee en vez de devolver
`None` es lo que sincroniza al consumidor sin escribir una sola espera.

### [Lo que cuesta serializar](widgets/traspaso.html){ target=_blank rel=noopener }

Los mismos datos por memoria compartida, por `Pipe` y por `Queue`: 0,10 s
contra 1,38 y 1,68. Prediga el factor, siga el viaje de un dato empaquetado
con pickle frente al que solo se escribe en memoria, y decida qué mecanismo
pide cada una de seis situaciones.

## Ejercicio práctico

El ejercicio de esta semana, con sus verificaciones en GitHub Actions, es
[infra-hilos-y-procesos-en-python](https://github.com/EjerciciosClasesCardel/infra-hilos-y-procesos-en-python){ target=_blank rel=noopener }:
la misma tarea en secuencia, con hilos y con procesos; la actualización
perdida y el cerrojo; procesos que no comparten memoria; y un grupo de
procesos que toma trabajos de una cola.
