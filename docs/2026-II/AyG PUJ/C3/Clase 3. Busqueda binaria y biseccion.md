# Clase 3. Búsqueda binaria y bisección

**Viernes 28 de agosto de 2026.**

Los dos grupos siguen en puntos distintos del tema. El grupo A ya
trabajó divide y vencerás con el máximo y el ordenamiento por mezcla,
así que avanza a los dos algoritmos donde esa idea rinde más; el grupo B
recorre esa clase de divide y vencerás.

<div class="grid cards" markdown>

-   :material-magnify:{ .lg .middle } **Búsqueda binaria y bisección**

    ---

    **Grupo A.** Dividir cuando el espacio de búsqueda está ordenado: la
    función objetivo $\varphi(l,r)$, por qué descartar la mitad es
    seguro, la recurrencia $T(n) = T(n/2) + \Theta(1)$, la bisección
    sobre funciones continuas y el patrón de búsqueda sobre la
    respuesta.

    [:octicons-arrow-right-24: Entrar](Busqueda%20binaria%20y%20biseccion.md)

-   :material-call-split:{ .lg .middle } **Divide y vencerás**

    ---

    **Grupo B.** Dividir, conquistar y combinar, con el
    máximo, el ordenamiento por mezcla y la recurrencia
    $T(n) = 2 \cdot T(n/2) + \Theta(n)$.

    [:octicons-arrow-right-24: Entrar](../C2/Divide%20y%20vencerás.md)

</div>

## Ejercicios interactivos

Los dos algoritmos y un problema de juez, para recorrer paso a paso en el
navegador: la [página de ejercicios](Ejercicios.md) trae `buscar`,
`bisección` y el recorrido guiado sobre UVa 10341.

## Antes de entrar

[Divide y vencerás](../C2/Divide%20y%20vencerás.md) y su
[apéndice](../C2/Apéndice.md) son el punto de partida: los dos
algoritmos de esta sesión dividen igual, pero descartan una de las dos
mitades y eso cambia la cuenta.
