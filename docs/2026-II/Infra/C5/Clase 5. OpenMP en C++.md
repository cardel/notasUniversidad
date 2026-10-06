# Clase 5. OpenMP en C++

**Semana del 6 de octubre de 2026.**

Repartir un ciclo entre hilos con `std::thread` cuesta catorce líneas; con
OpenMP cuesta una, y se quita volviendo a compilar sin la bandera. La sesión
recorre las directivas que hacen ese trabajo, qué protege cada una y qué cobra,
y termina en lo que rara vez se cuenta: cómo saber si el programa usó de verdad
los hilos que uno pidió, y hasta dónde sube la aceleración antes de aplanarse.

<div class="grid cards" markdown>

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Nueve actividades en el navegador, una por tema de la sesión: el orden del
    recorrido, cuántos hilos arrancan, la suma que se pierde, qué entra y qué
    sale de la región, cómo se reparten las iteraciones, tres escrituras de la
    misma reducción, el mismo ciclo en tres bibliotecas, el codo de la curva y
    cómo comprobar que hubo paralelismo.

    [:octicons-arrow-right-24: Entrar](Ejercicios.md)

</div>

## Antes de entrar

De la sesión de introducción vuelve la línea de caché, que aquí explica por qué
un recorrido mal ordenado no lo arregla ningún número de hilos. De la de hilos
y procesos, la carrera de datos: la misma forma, ahora en C++ y sin el GIL de
por medio, así que dos hilos sí escriben a la vez. Y de las estrategias de
paralelización, el reparto por bloques y por demanda, que aquí son dos valores
de una cláusula.

Los apuntes y el código de la sesión se publican después de las dos clases de
la semana.
