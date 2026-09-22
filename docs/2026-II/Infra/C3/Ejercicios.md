# Ejercicios

Clase 3 — profiling en Python e instrucciones AVX (22 y 24 de septiembre). Los
apartados van en el orden de la clase y todos se resuelven en el navegador.
Cada uno toma las cifras que se midieron en la sesión y las deja mover: antes
de ver un número toca escribirlo, y cada respuesta equivocada dice por qué no.

## Introducción al perfilado

### [El techo de una optimización](widgets/techo.html){ target=_blank rel=noopener }

Un programa de 20 segundos repartido en cuatro funciones. Antes de mover nada,
escriba cuánto se gana si la función que pesa el 70 % queda al doble de
velocidad: la respuesta no es dos. Después dos perillas, la fracción que se
toca y cuánto se acelera, para ver el techo que fija lo que no se toca. Cierra
con la decisión que el perfil obliga a tomar: cuál función optimizar, y cuándo
no optimizar ninguna.

## Librería time

### [Reloj de pared y tiempo de CPU](widgets/relojes.html){ target=_blank rel=noopener }

Un programa por tramos: lee un archivo, calcula, consulta un servicio y
procesa con cuatro hilos. Escriba qué va a marcar `perf_counter` y qué va a
marcar `process_time` al final, y luego véalos avanzar tramo por tramo. Las
esperas suman reloj y no CPU; el tramo de cuatro hilos suma cuatro veces más
CPU que reloj. Hay tres programas para escoger, entre ellos el `sleeper` y el
`spinlock` de la clase.

## Librería timeit

### [Lo que devuelve timeit](widgets/repeticiones.html){ target=_blank rel=noopener }

Tres cosas que se prestan a confusión, con números. El total de cien
repeticiones no es el promedio; el `setup` que queda dentro del fragmento
infla la medida veintiséis veces; y una sola medición con `time` cae donde
el ruido del sistema la deje, mientras la media de veinte se queda quieta.
Cada medición individual se saca con un botón y se ve dónde cae.

## Librería cProfile

### [Cuántas veces se llama fib](widgets/llamadas.html){ target=_blank rel=noopener }

El árbol de llamadas de `fib(n)`, nivel por nivel, con las repetidas
marcadas. Prediga cuántas llamadas hace `fib(6)` y después cuántas ejecutan
el cuerpo con `@lru_cache`; al comprobar aparecen las cifras de `fib(35)` de
la clase: casi treinta millones contra treinta y seis. La última parte es
leer una tabla de `cProfile`: con `ncalls`, `tottime` y `cumtime` a la vista,
decidir qué función se toca primero y qué número va en el informe.

## Librería Pyinstrument

### [Cuántas muestras hacen falta](widgets/muestreo.html){ target=_blank rel=noopener }

Un perfilador estadístico solo ve lo que dura más que su intervalo. Prediga
cuántas muestras toma en los 4,64 s de `fib(35)` y qué intervalo pide un
programa de una décima de segundo. Después la simulación: el reparto real
del Monte Carlo de la clase contra lo que estima el muestreo con 5, 13, 46,
132 o 1.000 muestras. Con pocas, las funciones pequeñas desaparecen del
reporte; con muchas, el error baja de dos puntos.

## Comparativa y conclusiones

### [Cuál herramienta responde qué](widgets/herramientas.html){ target=_blank rel=noopener }

Ocho preguntas sobre `ruta.py`, el programa que la clase midió con las
cuatro herramientas, y las cuatro herramientas como respuesta. Cuántas veces
se llamó `distancia`, quién llamó a quién, dónde está el medio segundo de
espera, qué tiempo va en el informe, cuál se puede dejar en producción. La
última es la que sorprende: por qué aquí Pyinstrument costó lo mismo que
`cProfile`.

## Instrucciones AVX y NumPy

### [Carriles de un registro](widgets/carriles.html){ target=_blank rel=noopener }

Cuántas instrucciones recorren cinco millones de `float64` con un registro
de 256 bits, y cuántas con 512. Después los cinco patrones que la clase
midió sobre el mismo arreglo, uno por uno: para cada uno se decide qué
condición rompe, y la respuesta destapa su tiempo. El `if` dentro de un
bucle de Python y la recurrencia cuestan casi lo mismo, ciento treinta veces
lo contiguo, aunque solo uno de los dos se pueda vectorizar; por qué, es la
pregunta final.

### [Cuándo compensa la GPU](widgets/gpu.html){ target=_blank rel=noopener }

Operaciones divididas entre bytes que viajan. Prediga cuánto tarda el
arreglo de cinco millones en ir y volver por PCIe y compárelo con los 11,8 ms
en que la CPU ya lo había resuelto; después las operaciones por byte del
producto de matrices de 4.000 × 4.000. Una perilla encadena operaciones
sobre los mismos datos para ver en qué punto el viaje deja de mandar. Cierra
con la medición que engaña: la llamada que retorna antes de que la GPU
termine.

## Ejercicio práctico

El ejercicio de esta semana, con sus verificaciones en GitHub Actions, es
[infra-profiling-en-python](https://github.com/EjerciciosClasesCardel/infra-profiling-en-python){ target=_blank rel=noopener }:
las cuatro herramientas sobre la misma función, el perfil que decide qué
cambiar, el producto punto en tres formas y AVX a mano.
