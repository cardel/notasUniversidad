# Clase 6. Herramientas de profiling en Linux

**Semana del 13 de octubre de 2026.**

Dos programas suman la misma matriz, ejecutan las mismas instrucciones y uno
tarda el doble. Leer el código no lo explica: hay que medir. La sesión recorre
las tres capas desde las que se mira un programa en Linux: el proceso visto
desde afuera con `top` y `ps`, la caché simulada con Valgrind y los contadores
del procesador con `perf`. Al final, la misma diferencia se ve de 1,4 o de 415
veces según con qué se mida, y entender por qué es parte del trabajo.

<div class="grid cards" markdown>

-   :material-magnify:{ .lg .middle } **Herramientas de profiling en Linux**

    ---

    Las cuatro familias de perfiladores, el proceso visto con `top`, `htop` y
    `ps` con sus doce hilos y su columna de núcleo, lo que cuenta
    `/usr/bin/time -v`, las llamadas al sistema con `strace -c`, los
    contadores de fallos de Valgrind con la función culpable señalada, los
    contadores del procesador con `perf` y el visor del perfil en el
    navegador.

    [:octicons-arrow-right-24: Entrar](./Herramientas%20de%20profiling%20en%20Linux.md)

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Seis actividades en el navegador, una por tema de la sesión: los dos
    programas que hacen la misma cuenta, el programa paralelo visto desde
    afuera, las llamadas al sistema contadas una por una, los fallos de caché
    de Valgrind, los contadores del procesador y la misma diferencia medida de
    cuatro formas.

    [:octicons-arrow-right-24: Entrar](../../../actividades/infra/profiling-linux/index.md)

-   :material-console:{ .lg .middle } **Código**

    ---

    Los siete programas de la sesión: las dos versiones que recorren la matriz
    por filas y por columnas, la que se perfila por porciones, la paralela que
    dura lo suficiente para verla en `top`, y las dos que escriben las mismas
    doscientas mil líneas con una llamada al sistema por línea o con un búfer.

    [:octicons-arrow-right-24: Entrar](./codigo/README.md)

</div>

## Antes de entrar

De la sesión de introducción vuelve la línea de caché de 64 bytes, que aquí se
cuenta con un simulador en vez de deducirse. De la de profiling en Python, la
diferencia entre medir cuánto y medir dónde, que reaparece con otras
herramientas y sobre otro lenguaje. Y de OpenMP, el programa paralelo con sus
doce hilos: ahora se mira desde afuera, para comprobar cuántos arrancaron de
verdad y cuánta máquina ocupan.
