# Clase 5. OpenMP en C++

**Semana del 6 de octubre de 2026.**

Repartir un ciclo entre hilos con `std::thread` cuesta catorce líneas; con
OpenMP cuesta una, y se quita volviendo a compilar sin la bandera. La sesión
recorre las directivas que hacen ese trabajo, qué protege cada una y qué cobra,
y termina en lo que rara vez se cuenta: cómo saber si el programa usó de verdad
los hilos que uno pidió, y hasta dónde sube la aceleración antes de aplanarse.

<div class="grid cards" markdown>

-   :material-sitemap:{ .lg .middle } **OpenMP en C++**

    ---

    La cuenta de la línea de caché, la falsa compartición, qué hace cada
    directiva y qué cobra, las tres cláusulas de variables, las políticas de
    reparto medidas, los dos errores que dejan el programa mudo, el trío
    `std::thread`, TBB y OpenMP con sus tiempos, el barrido de uno a doce
    hilos con su eficiencia y su codo, y cómo mirar los hilos por dentro con
    el depurador, ThreadSanitizer y los contadores del procesador.

    [:octicons-arrow-right-24: Entrar](./OpenMP%20en%20C++.md)

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Nueve actividades en el navegador, una por tema de la sesión: el orden del
    recorrido, cuántos hilos arrancan, la suma que se pierde, qué entra y qué
    sale de la región, cómo se reparten las iteraciones, tres escrituras de la
    misma reducción, el mismo ciclo en tres bibliotecas, el codo de la curva y
    cómo comprobar que hubo paralelismo.

    [:octicons-arrow-right-24: Entrar](./Ejercicios.md)

-   :material-console:{ .lg .middle } **Código**

    ---

    Los siete programas de la sesión, compilados y corridos: el saludo por
    hilo con la bandera y sin ella, las dos preguntas sobre el número de
    hilos, lo que dicen las variables de entorno, la región anidada, la suma
    sin `reduction` que ThreadSanitizer señala, la suma que cambia de
    resultado al repartirla y la integral del barrido, con la secuencia del
    depurador.

    [:octicons-arrow-right-24: Entrar](./codigo/README.md)

</div>

## Antes de entrar

De la sesión de introducción vuelve la línea de caché, que aquí explica por qué
un recorrido mal ordenado no lo arregla ningún número de hilos. De la de hilos
y procesos, la carrera de datos: la misma forma, ahora en C++ y sin el GIL de
por medio, así que dos hilos sí escriben a la vez. Y de las estrategias de
paralelización, el reparto por bloques y por demanda, que aquí son dos valores
de una cláusula.
