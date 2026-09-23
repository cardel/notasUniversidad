# Clase 3. Profiling en Python e instrucciones AVX

**Semana del 22 de septiembre de 2026.**

Antes de repartir trabajo entre hilos hay que saber dónde se va el tiempo, y
en Python eso se mide con cuatro herramientas que responden preguntas
distintas: `time` y `timeit` dicen cuánto, `cProfile` y Pyinstrument dicen
dónde. La sesión las usa sobre los mismos programas, mira lo que cada una
deforma, y termina en el lugar donde el ciclo de Python ya no alcanza: las
instrucciones vectoriales del procesador, lo que NumPy hace con ellas y a
partir de qué cuenta compensa llevar el cálculo a la GPU.

<div class="grid cards" markdown>

-   :material-speedometer:{ .lg .middle } **Profiling en Python e instrucciones AVX**

    ---

    Las tres preguntas antes de optimizar y el techo que pone Amdahl, el
    ambiente virtual y el archivo de dependencias, los dos relojes de
    `time`, por qué `timeit` devuelve el total, `fib(35)` bajo `cProfile`
    con y sin memoización, el árbol de Pyinstrument sobre Monte Carlo, lo
    que cuesta cada perfilador, qué guarda una lista frente a un arreglo de
    NumPy, las cuatro condiciones de SIMD con cinco patrones medidos y
    cuándo compensa llevar el cálculo a la GPU.

    [:octicons-arrow-right-24: Entrar](./Profiling%20en%20Python%20e%20instrucciones%20AVX.md)

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Ocho actividades en el navegador, una por tema de la sesión: el techo
    de una optimización, los dos relojes, lo que devuelve `timeit`, el árbol
    de llamadas de `fib`, cuántas muestras hacen falta, cuál herramienta
    responde qué, los carriles de un registro AVX y cuándo compensa la GPU.

    [:octicons-arrow-right-24: Entrar](./Ejercicios.md)

-   :material-console:{ .lg .middle } **Código**

    ---

    Los siete programas de la sesión, con su archivo de dependencias: las
    dos formas de llenar una matriz, los dos relojes, `fib` bajo
    `cProfile`, Monte Carlo con Pyinstrument, los cinco patrones SIMD, las
    cuatro formas de sumar lo mismo y el arreglo en C.

    [:octicons-arrow-right-24: Entrar](./codigo/README.md)

</div>

## Antes de entrar

De la sesión de introducción se usa la ley de Amdahl, que aquí fija el techo
de una optimización en vez del de una paralelización, y la idea de que la
memoria manda cuando el cálculo por dato es poco. De la de estrategias, la
recursión que se parte en dos: `fib` es la misma forma, con la diferencia de
que aquí los subproblemas se repiten y eso es lo que el perfilador delata.

## Lo que quedó pendiente

El ejercicio del repositorio es el de profiling en Python, y desde este
semestre tiene cuatro partes con un job del flujo por cada una: medir
`suma_primos(10000)` con las cuatro herramientas, leer el perfil y escribir
la versión rápida, el producto punto en tres formas para ver qué le hace la
indexación a NumPy, y el mismo producto punto con instrucciones AVX escritas
a mano en C++. Está en la pestaña de ejercicios prácticos del Campus Virtual
y no lleva nota.

Las ocho actividades del navegador de [Ejercicios](./Ejercicios.md) siguen el
orden de la sesión. Las dos que más conviene tocar primero son la del techo
de una optimización, que es la cuenta de Amdahl aplicada a un programa
concreto, y la de los carriles de un registro, que deja ver cuántas
instrucciones se ahorra un recorrido vectorizado.
