# Clase 4. Invariantes: acumuladores, listas y ciclos anidados

**Viernes 4 de septiembre de 2026.**

Los dos grupos llegan al mismo punto: ambos vieron ya el repaso de dividir y
conquistar, la búsqueda binaria y la bisección. Esta sesión vuelve sobre los
invariantes con las tres formas de ciclo que faltaban, y cierra con las
variantes de la búsqueda binaria.

<div class="grid cards" markdown>

-   :material-repeat:{ .lg .middle } **Invariantes con estado compuesto**

    ---

    Cuando el estado son varias variables que se actualizan juntas, cuando
    la salida es una lista que crece, y cuando hay un ciclo dentro de otro:
    el interno como lema, el externo sobre esa conclusión.

    [:octicons-arrow-right-24: Entrar](Invariantes%20con%20ciclos%20anidados.md)

-   :material-magnify:{ .lg .middle } **Variantes de la búsqueda binaria**

    ---

    Los dos bordes, `lower` y `upper`: dónde empieza y dónde termina un
    bloque de repetidos, cuántas copias hay, y el mayor elemento que no
    supera a $x$ cuando $x$ no está.

    [:octicons-arrow-right-24: Entrar](Invariantes%20con%20ciclos%20anidados.md#variantes-de-la-busqueda-binaria)

</div>

## Ejercicios

Cuatro para trabajar en el navegador, uno por cada forma de ciclo, con
algoritmos que no aparecen en las diapositivas: el mayor y el segundo mayor a
la vez, comprimir repeticiones consecutivas, el ordenamiento burbuja y el
mínimo de un arreglo rotado. En todos hay que proponer el invariante antes de
que se abra la demostración, y hay que escribirlo con $N$ y el índice: entre
las respuestas posibles siempre está la que describe los datos de la corrida,
y elegirla lleva al caso donde se cae.

Después, nueve para resolver en papel. Todos están en la
[página de ejercicios](Ejercicios.md).

## Antes de entrar

Conviene tener a mano los invariantes de
[la suma, el factorial y la búsqueda](../C2/Invariantes%20de%20ciclo.md), que
son los cuatro ciclos ya demostrados, y el
[método de la búsqueda binaria](../C3/Busqueda%20binaria%20y%20biseccion.md),
porque las variantes del cierre salen de ahí.
