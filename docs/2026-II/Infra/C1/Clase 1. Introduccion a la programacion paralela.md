# Clase 1. Introducción a la programación paralela

**Semana del 8 de septiembre de 2026.**

La primera sesión con contenido del semestre. Arranca donde termina un curso de
programación secuencial: la máquina ya trae seis u ocho núcleos y el programa
usa uno. Lo que sigue es por qué repartir el trabajo no es gratis, qué lo
frena, y por qué a la industria no le quedó otra que trasladarle el problema al
programador.

<div class="grid cards" markdown>

-   :material-chip:{ .lg .middle } **Introducción a la programación paralela**

    ---

    La trampa serial y el *span*, la jerarquía de memoria de una máquina
    real, las dos localidades, el recorrido por filas contra el recorrido
    por columnas medido con cachegrind, la ley de Amdahl con su techo, el
    false sharing y los tres muros que estancaron el reloj.

    [:octicons-arrow-right-24: Entrar](Introduccion%20a%20la%20programacion%20paralela.md)

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Tres actividades en el navegador —la ley de Amdahl, las dos
    localidades y el false sharing— y ejercicios en papel sobre speedup,
    dependencias, localidad y líneas de caché.

    [:octicons-arrow-right-24: Entrar](Ejercicios.md)

-   :material-console:{ .lg .middle } **Código**

    ---

    Los dos programas que se corrieron en clase, con los comandos de
    `valgrind` y `cg_annotate` y las cifras que devuelven.

    [:octicons-arrow-right-24: Entrar](codigo/README.md)

</div>

## Antes de entrar

Conviene tener presente lo que quedó de sistemas operativos sobre jerarquía de
memoria y mapeo, porque la sesión se apoya ahí sin volver a explicarlo: qué es
una caché, por qué existe, y qué significa que un dato esté o no esté.

También ayuda recordar cómo se reserva memoria en C con `malloc` y cómo se
calcula la dirección de un elemento dentro de un arreglo, porque la
demostración central de la clase depende de esa aritmética.

## Lo que quedó pendiente

La sesión fue virtual y el ejercicio del repositorio se dejó para resolver por
fuera. Está en la pestaña de ejercicios prácticos del Campus Virtual: se hace
un fork, se resuelve, y al hacer push el flujo de GitHub Actions dice si la
solución quedó bien. No lleva nota.

Las tres actividades del navegador que están en [Ejercicios](Ejercicios.md) sí
se alcanzaron a mostrar en clase, y son las que conviene tocar primero: la de
localidad deja ver la espacial y la temporal por separado, cosa que midiendo un
programa real es difícil de conseguir.
