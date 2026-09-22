# Clase 3. Profiling en Python e instrucciones AVX

**Semana del 22 de septiembre de 2026.**

Antes de repartir trabajo entre hilos hay que saber dónde se va el tiempo, y
en Python eso se mide con cuatro herramientas que responden preguntas
distintas: `time` y `timeit` dicen cuánto, `cProfile` y Pyinstrument dicen
dónde. La sesión las usa sobre los mismos programas, mira lo que cada una
deforma, y termina en el lugar donde el ciclo de Python ya no alcanza: las
instrucciones vectoriales del procesador, lo que NumPy hace con ellas y
cuándo vale la pena llevar el cálculo a la GPU.

<div class="grid cards" markdown>

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Ocho actividades en el navegador, una por tema de la sesión: el techo
    de una optimización, los dos relojes, lo que devuelve `timeit`, el árbol
    de llamadas de `fib`, cuántas muestras hacen falta, cuál herramienta
    responde qué, los carriles de un registro AVX y cuándo compensa la GPU.

    [:octicons-arrow-right-24: Entrar](Ejercicios.md)

</div>

## Antes de entrar

De la sesión de introducción se usa la ley de Amdahl, que aquí fija el techo
de una optimización en vez del de una paralelización, y la idea de que la
memoria manda cuando el cálculo por dato es poco. De la de estrategias, la
recursión que se parte en dos: `fib` es la misma forma, con la diferencia de
que aquí los subproblemas se repiten y eso es lo que el perfilador delata.

Los apuntes y el código de la sesión se publican después de las dos clases de
la semana.
