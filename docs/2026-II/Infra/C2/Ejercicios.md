# Ejercicios

Clase 2 — estrategias de paralelización: descomposición, granularidad y
balanceo (15 y 17 de septiembre). Los apartados van en el orden de la clase y
todos se resuelven en el navegador, sin instalar nada. Cada uno reproduce el
código que se midió en la sesión: lo que cambia es que aquí el reparto se ve
tarea por tarea, y antes de ver un número toca escribirlo.

## La pregunta antes del código

### [Qué cambió entre las dos filas](widgets/pregunta.html){ target=_blank rel=noopener }

La misma tabla con que abrió la clase: el mismo programa, los mismos cuatro
hilos, y en una fila repartir deja la ejecución dieciséis veces más lenta
mientras en la otra la deja casi cuatro veces más rápida. Tres preguntas sobre
esa tabla, cada una con cuatro respuestas, y cada respuesta equivocada dice
por qué no.

La tercera es la que más se ve en la práctica: un ciclo envuelto en hilos que
tarda lo mismo, y la conclusión apresurada que suele salir de ahí.

## Descomposición de datos

### [Cortar el vector en trozos](widgets/reparto.html){ target=_blank rel=noopener }

El reparto exacto de `con_hilos`: `paso = n / k`, cada hilo recibe
`[i·paso, (i+1)·paso)` y el último se lleva además el residuo. Antes de ver la
barra, escriba cuántos elementos recibe el último hilo con diez elementos y
cuatro hilos. El reparto que parecía parejo no lo es, y el hilo que más recibe
es el que marca cuándo termina todo.

Al final está la tabla de los 200 millones de enteros (98, 51, 38 y 38 ms) y
una pregunta: por qué ocho hilos no mejoran a cuatro. Las tres respuestas
equivocadas son las que más se oyen.

## Descomposición de tareas

### [Tres recorridos, tres hilos](widgets/tareas.html){ target=_blank rel=noopener }

El máximo, la suma y los pares de un vector de 50 millones, cada uno en su
hilo. Antes de ver la medida, decida cuánto acelera: la respuesta no es tres, y
las dos razones por las que no llega están en la retroalimentación. Después,
qué hace un cuarto hilo cuando solo hay tres trabajos, y cuándo esta forma de
repartir le gana a partir los datos.

### [El árbol del mergesort](widgets/mergesort.html){ target=_blank rel=noopener }

La recursión de `ordenar_par` sobre 20 millones de enteros, dibujada por
niveles. Antes de mover la profundidad de corte, prediga cuántos hilos se crean
con profundidad tres: se lanza un hilo por división y no dos, porque la mitad
derecha la resuelve el hilo que ya venía. El botón *Siguiente* recorre los
pasos en el orden en que el código los ejecuta: dividir, lanzar, resolver,
`join`, mezclar. En cada mezcla se ve cuántas corren al tiempo, y la de arriba
siempre corre sola.

Queda una pregunta sobre la tabla medida con cuatro núcleos: por qué ocho
hilos todavía ganan sobre cuatro, si núcleos hay los mismos.

## Granularidad

### [El costo fijo de repartir](widgets/granularidad.html){ target=_blank rel=noopener }

Las 400 tareas en tandas de cuatro hilos, con la columna de la relación
tapada. Escriba en qué fila cruza el uno y después destápela: al lado aparece
lo que da un modelo de dos perillas, el costo de crear y unir un hilo y el
costo de cada iteración. Con 16 µs por hilo el modelo reproduce la tabla;
suba el costo a 160 µs y el cruce se corre una fila. El cruce no es del
algoritmo; es de la máquina donde se midió, y en otra se mide otra vez.

## Balanceo de carga

### [Sesenta y cuatro tareas que no cuestan lo mismo](widgets/balanceo.html){ target=_blank rel=noopener }

Las 64 tareas de `balanceo.cpp`, donde la tarea `i` cuesta `i²`, y los cuatro
hilos. Antes de correr nada, escriba qué porcentaje del trabajo carga el hilo
que termina último con bloques contiguos. Después el reparto se ve tarea por
tarea en un Gantt por hilo, en tres versiones: bloques contiguos, por turnos y
por demanda con `fetch_add`. Las tareas que hizo cada hilo y el tiempo que
esperó se cuentan aparte.

La segunda predicción es cuántas veces más tarda el reparto contiguo que el
reparto por demanda; en la máquina de la sesión dio 824 contra 379 ms. Por
turnos casi lo arregla, hasta que la casilla de costos erráticos baraja los
costos.

## Delegar el reparto

### [Lo que parte blocked_range](widgets/rango.html){ target=_blank rel=noopener }

`tbb::blocked_range<int>(0, n, grano)` se parte en dos mientras el tamaño
supere el grano. Prediga en cuántos subrangos queda un rango de mil con grano
cien y después mire el árbol. Con grano uno salen mil hojas, y ahí está la
razón de que el particionador automático deje de partir por su cuenta.

En la segunda parte, un programa imprime 2×10⁸ en paralelo y 10⁷ en
secuencia. Cuál de los dos está bien, y qué se hace antes de mirar el reloj.

## Dependencias

### [La suma de prefijos en dos pasadas](widgets/prefijos.html){ target=_blank rel=noopener }

Doce valores en tres bloques y las dos pasadas de `scan.cpp`. La primera
pasada reporta el total de cada bloque; los tres desplazamientos los escribe
usted, y la segunda pasada arranca de lo que haya escrito. Si un
desplazamiento quedó mal, la fila sale con números plausibles y la
comparación elemento a elemento contra la versión secuencial marca en rojo
dónde se rompió. El selector de máximo es el ejercicio del saldo máximo
acumulado.

La medida de los 20 millones, 2.731 contra 1.636 ms, va al final, con una
pregunta: qué pasa si la operación por elemento fuera una suma pelada.

## Pipeline

### [Tres etapas y una cola entre cada par](widgets/pipeline.html){ target=_blank rel=noopener }

Leer 10 ms, calcular 20, escribir 10, y 24 lotes. Escriba en cuántos
milisegundos terminan antes de verlo; la tabla de quién trabaja en cada
intervalo es la de la clase, con los huecos de la etapa de escribir. Dos
encargos en la misma pantalla: bajar leer a 5 ms y ver que el total casi no
se mueve, y poner dos réplicas en calcular y ver que baja a 270. La pregunta
final es cuál etapa manda después de replicar.

## Cómo elegir

### [Ocho situaciones](widgets/elegir.html){ target=_blank rel=noopener }

Ocho problemas de tres líneas y las mismas siete opciones para todos: las seis
estrategias de la tabla de la clase y dejarlo secuencial. Cada respuesta
equivocada dice por qué no y nombra el tema donde está la razón. Dos son
trampas: un ciclo con `s[i-1]` donde lo único que se hace es sumar, y una
ventana que parece una cadena de dependencias pero solo lee la entrada. El
marcador cuenta los aciertos a la primera.

## Ejercicios de la sesión

Los seis ejercicios que se entregan están en las diapositivas, en el Campus
Virtual: la descomposición para el archivo de ventas, las 10.000 imágenes, el
saldo máximo, las mediciones sobre la carpeta `codigo`, el producto de Hadamard
en dos versiones y el algoritmo que se parte en dos.
