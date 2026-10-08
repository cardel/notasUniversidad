# Clase 11 · AyG

**Viernes 9 de octubre de 2026.**

Los puentes y los puntos de articulación salen de una sola búsqueda en
profundidad, pero casi ningún enunciado de juez pide la lista y se va. Pide
orientar las calles de una ciudad para que se pueda ir de cualquier
intersección a cualquier otra, contar en cuántos pedazos queda una red al
bombardear una estación, medir cuántos puentes hay que cruzar entre dos
puntos. La herramienta que convierte esas preguntas en recorridos es el árbol
de puentes: se contraen los pedazos que quedan al quitar los puentes, cada uno
se vuelve un nodo, y lo que resulta no tiene ciclos. Sobre un árbol casi todo
es una pasada más.

<div class="grid cards" markdown>

-   :material-call-split:{ .lg .middle } **Problemas de cortes**

    ---

    Los componentes 2-arista-conexos con la demostración de que lo contraído
    es un árbol, las tres pasadas lineales que lo construyen, el teorema de
    Robbins con la orientación que sale de la profundidad, la cuenta de
    pedazos por los hijos con $w.low \geq v.d$, y los cinco pasos para
    decidir, leyendo un enunciado, si el corte es por vértice o por arista.

    [:octicons-arrow-right-24: Entrar](./Problemas%20de%20cortes.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con los dos problemas de juez resueltos y el código
    de cada pieza en sus dos formas, la recursiva y la de pila explícita.

    [:octicons-arrow-right-24: Abrir](./clase11-problemas-cortes.pdf)

</div>

## Ejercicios

Seis interactivos, por los temas de la sesión y en su mismo orden: leer los
$low$ y marcar cortes y puentes, construir el árbol de puentes paso a paso,
orientar las calles de Street Directions, calcular el valor de cada estación
en Doves and Bombs, decidir si el corte va por vértice o por arista en tres
enunciados, y encontrar cuál de tres versiones del código falla. Después, los
de papel y los de juez. Están en la [página de ejercicios](./Ejercicios.md).

## Antes de entrar

Conviene repasar el [valor low](../C10/Orden%20topologico%20y%20Tarjan.md):
cómo se calcula en la misma recursión, el criterio de la raíz por número de
hijos, el de los demás vértices con $w.low \geq v.d$ y el de los puentes con
la desigualdad estricta. De ahí arranca la sesión, y lo único que cambia es
que la arista de entrada se excluye por su identificador y no por quién es el
padre.
