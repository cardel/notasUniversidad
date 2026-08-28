# Clase 2. Invariantes de ciclo y divide y vencerás

**Viernes 21 de agosto de 2026.**

Esta semana los dos grupos van en puntos distintos del tema: el grupo A ya
trabajó invariantes de ciclo en la sesión del miércoles con el profesor
titular, y el grupo B no tuvo esa sesión por el festivo. La clase del
viernes atiende esa diferencia con dos rutas, así que esta nota se divide
en dos páginas: entre por la de su grupo.

<div class="grid cards" markdown>

-   :material-autorenew:{ .lg .middle } **Invariantes de ciclo**

    ---

    **Grupo B.** El tema desde el comienzo: la especificación de un
    problema (entrada y salida), la pareja de invariantes I₀ e I₁ de un
    ciclo, y la demostración de correctitud por inicialización,
    estabilidad y terminación.

    [:octicons-arrow-right-24: Entrar](Invariantes%20de%20ciclo.md)

-   :material-call-split:{ .lg .middle } **Divide y vencerás**

    ---

    **Grupo A.** Un repaso corto de los invariantes I₀ e I₁ y la
    primera técnica de diseño recursivo: dividir, conquistar y combinar,
    con el máximo, el ordenamiento por mezcla y la recurrencia
    T(n) = 2·T(n/2) + Θ(n).

    [:octicons-arrow-right-24: Entrar](Divide%20y%20vencerás.md)

</div>

## Apéndices

Dos páginas que sirven a los dos grupos y que quedaron de preguntas de
clase:

- [El arreglo en el invariante y la inducción estructural](Apéndice.md) —
  qué pasa con el invariante cuando el algoritmo modifica el arreglo (tres
  ejercicios resueltos, uno con dos ciclos anidados y sus dos parejas de
  invariantes) y la demostración por inducción estructural del máximo
  recursivo, escrita completa.
- [Resolver recurrencias por expansión](Recurrencias%20por%20expansión.md) —
  el álgebra que hay detrás del árbol de llamadas, con
  $T(n) = 2\,T(n/2) + \Theta(1)$ y $T(n) = 2\,T(n/2) + \Theta(n)$
  desarrolladas paso a paso: las sustituciones, el patrón, la sumatoria y
  el aterrizaje en el caso base.

## Ejercicios interactivos

Las dos rutas comparten la [página de ejercicios
interactivos](Ejercicios.md): dos ejercicios de invariantes (`sumar` y
`factorial`) y dos de divide y vencerás (`mezclar` y `ordenar`). Cada uno
sigue el mismo camino de la clase: ver el patrón primero, generalizarlo
después y cerrar con la demostración o el análisis paso a paso.
