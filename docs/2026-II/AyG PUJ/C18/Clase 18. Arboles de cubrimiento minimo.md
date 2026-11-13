# Clase 18. Árboles de cubrimiento mínimo · AyG C18

**Viernes 13 de noviembre de 2026, de 7:00 a 9:00 el grupo B y de 9:00 a 11:00
el grupo A, con el mismo contenido en las dos sesiones.**

La sesión toma la estructura de conjuntos disjuntos que quedó vista y la pone a
trabajar. El problema es el de conectar siete barrios con fibra gastando lo
menos posible, y la primera respuesta sale antes de cualquier algoritmo: si la
selección deja un ciclo se puede quitar una arista sin perder conexión, así que
lo que se busca es un árbol de $|V|-1$ aristas. Enumerarlos queda descartado,
porque un grafo completo de veinte vértices ya tiene $20^{18}$. En el medio
está la propiedad de corte, el teorema 23.1 de CLRS, que dice cuándo una arista
se puede aceptar sin arriesgarse a tener que devolverla: su demostración es un
intercambio, se agrega la arista ligera al árbol óptimo, se mira el ciclo que
se cierra y se saca la arista del ciclo que cruza el mismo corte. De ahí salen
los dos algoritmos, que son el mismo teorema aplicado a cortes distintos:
Kruskal recorre las aristas en orden de precio y pregunta con `find_set` si
cierran ciclo, y Prim hace crecer un solo árbol desde una raíz con el corte
fijo en su borde. Los dos corren sobre el mismo grafo de siete vértices y los
dos dan $39$. El cierre es UVa 11631, *Dark roads*, cuyo caso de ejemplo es ese
mismo grafo: la respuesta es la suma de las once calles menos el árbol,
$90 - 39 = 51$.

<div class="grid cards" markdown>

-   :material-graph-outline:{ .lg .middle } **Árboles de cubrimiento mínimo**

    ---

    El problema y dónde aparece, la propiedad de corte con su demostración y el
    corolario de unicidad, Kruskal con su traza y el corte detrás de cada
    arista aceptada, Prim con búsqueda lineal y con cola de prioridad, lo que
    no cambia el árbol mínimo, lo que sí garantiza, y tres problemas de juez
    con sus enunciados.

    [:octicons-arrow-right-24: Entrar](./Arboles%20de%20cubrimiento%20minimo.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión. Abre con el bosque de conjuntos disjuntos dibujado,
    con los rangos anotados y el antes y el después de una búsqueda que aplana
    el camino. Cada algoritmo va con su tabla y, al lado, los seis dibujos del
    grafo con lo que lleva aceptado en cada paso: en Kruskal se ven los pedazos
    sueltos que después se pegan, y en Prim una sola pieza que se estira. Además, el corte detrás de un paso de cada uno, el código, y el
    triángulo donde el árbol de caminos más cortos sale más caro que el
    mínimo.

    [:octicons-arrow-right-24: Abrir](./clase18-arboles-cubrimiento-minimo.pdf)

</div>

## Apuntes de la sesión

- El rango de una raíz acota la altura de su árbol, no cuántos elementos
  cuelgan de ella. Con cuatro hijos directos el rango sigue siendo 1.
- La compresión de caminos no va en una pasada aparte: ocurre mientras se
  busca la raíz, y por eso una unión también deja el bosque más plano.
- La respuesta nunca tiene ciclos: de un ciclo se puede quitar cualquier arista
  y los dos extremos se siguen alcanzando por el otro lado. Por eso es un árbol
  y tiene $|V|-1$ aristas.
- Una arista es segura para $A$ si $A$ más esa arista todavía cabe dentro de
  algún árbol mínimo. El teorema del corte es lo que permite reconocerla
  mirando solo una parte del grafo.
- La arista ligera es del corte y no del grafo. Sobre el mismo grafo, con
  $S=\{0,1,3\}$ la ligera pesa $6$ y con $S=\{0\}$ pesa $5$.
- Kruskal no dibuja ningún corte, pero cada arista que acepta es ligera de uno:
  el que separa el pedazo de uno de sus extremos del resto.
- En Prim el corte no hay que buscarlo, es siempre el borde del árbol que va
  creciendo.
- Prim con cola de prioridad es Dijkstra con la comparación cambiada: allá
  $d_u + w(u,v) < \mathit{dist}[v]$ y aquí $w < \mathit{clave}[v]$. Lo demás es
  igual, incluidas las parejas viejas que salen de la cola y se descartan: en
  el grafo de la sesión son cuatro de las once que salieron.
- El corolario de unicidad pide pesos todos distintos, y es una condición
  suficiente. Este grafo tiene cuatro pesos repetidos y su árbol mínimo es
  único de todos modos, cosa que se comprobó enumerando sus $141$ árboles de
  cubrimiento.
- Sumarle una constante a todos los pesos, o multiplicarlos por una constante
  positiva, no cambia el árbol. Los pesos negativos tampoco lo rompen, porque
  la propiedad de corte compara pesos y nunca los suma.
- El camino del árbol mínimo entre dos vértices minimiza la arista más pesada
  del recorrido, pero no la suma. El triángulo de pesos $4$, $3$ y $6$ es el
  caso más pequeño donde el árbol de caminos más cortos sale más caro.
- En *Dark roads* lo que se ahorra es todo lo que no entra al árbol, así que el
  programa suma los pesos antes de correr Kruskal y después resta.

## Ejercicios

Las actividades interactivas del tema están en la
[página de ejercicios](../../../actividades/ayg-puj/arboles-cubrimiento-minimo/index.md){ target=_blank rel=noopener },
y las de la estructura sobre la que se apoya Kruskal, en la
[página de conjuntos disjuntos](../../../actividades/ayg-puj/union-find/index.md){ target=_blank rel=noopener }.
Los ejercicios de la sesión, con sus pistas y los tres problemas de juez con
enunciado completo, están al final de la
[nota](./Arboles%20de%20cubrimiento%20minimo.md#ejercicios), y ahí mismo quedó
la [solución de *Dark roads*](./Arboles%20de%20cubrimiento%20minimo.md#la-solucion)
en Python y en C++, con lo que tarda cada una.

## Antes de entrar

La estructura de conjuntos disjuntos, con sus tres operaciones y las dos
heurísticas, está en la
[nota de Union-Find del semestre anterior](../../../2026-I/AyG%20PUJ/C29/Clase%2029%20Union%20Find.md).
La cola de prioridad y la forma de descartar las parejas viejas son las mismas
de la [nota de Dijkstra](../C15/DAG%20y%20Dijkstra.md). Que un árbol de $n$
vértices tenga $n-1$ aristas, y que todas sean puentes, está en la
[nota de generalidades de los árboles](../C16/Generalidades%20de%20arboles.md).
