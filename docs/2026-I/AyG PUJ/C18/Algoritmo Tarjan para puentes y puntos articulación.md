# Algoritmo de Tarjan para puentes y puntos de articulación

PA: Punto de articulación.

El algoritmo de Tarjan permite detectar puentes y puntos de articulación en un grafo no dirigido con una sola pasada de DFS (Depth-First Search).

## Variables utilizadas en el algoritmo

- **v.d**: Tiempo de descubrimiento (orden en el DFS).
- **$v.\pi$**: Padre de $v$ en el árbol DFS; NIL si es raíz.
- **v.low**: Mínimo $d$ alcanzable desde el subárbol de $v$ usando una arista de retroceso (back edge).

## Detección de puntos de articulación

Un vértice $v$ es un punto de articulación si, al eliminarlo, el número de componentes conexas del grafo aumenta.

### Criterio para vértices no raíz

Si desde el subárbol de un hijo $w$ de $v$ no hay una arista de retroceso a un ancestro de $v$ (es decir, $w$ es descendiente de $v$ y la única manera de llegar a $w$ es pasando por $v$), entonces $v$ es un punto de articulación.

**Teorema 1 (CLRS 22-2a) – Caso raíz:**  
Sea $G(V,E)$ un grafo no dirigido, $T$ el árbol DFS y $r$ la raíz de $T$. Entonces, $r$ es un punto de articulación si y solo si tiene al menos dos hijos en $T$.  
*Explicación:* Si $r$ tiene solo un hijo, este vértice tiene grado 1; al eliminar $r$, el número de componentes conexas no aumenta.

**Teorema 2 (CLRS 22-2b) – Caso no raíz:**  
Sea $v$ un vértice que no es raíz en el árbol DFS. $v$ es un punto de articulación si y solo si tiene al menos un hijo $w$ en $T$ tal que ningún descendiente de $w$ tiene una arista de retroceso hacia un ancestro propio de $v$. Esto es equivalente a que $v$ es PA si existe un hijo $w$ de $v$ con $w.low \geq v.d$.

### Regla de actualización de `low`

Durante el DFS, al visitar $v$:

1. Inicializar $v.low = v.d$.
2. Para cada hijo $w$ de $v$ en el árbol DFS, después de la llamada recursiva:  
   $v.low = \min(v.low, w.low)$.
3. Para cada vecino $w$ de $v$ que sea ancestro de $v$ (back edge):  
   $v.low = \min(v.low, w.d)$.

La ventaja del algoritmo es que realiza una sola pasada de DFS, identificando los puntos de articulación mediante la comparación entre $w.low$ y $v.d$, distinguiendo los casos de raíz (al menos dos hijos) y no raíz.

## Detección de puentes

El procedimiento es similar al de puntos de articulación, pero el criterio es más estricto: una arista $(v, w)$ es un puente si $w.low > v.d$.  
En el caso de igualdad ($w.low = v.d$), existe un ciclo en el componente, lo que implica que hay otro camino que conecta el grafo al eliminar la arista $(v, w)$.  
A diferencia de los puntos de articulación, la raíz no es un caso especial para la detección de puentes.

## Tabla de resumen

| Concepto | Definición | Criterio de detección (Tarjan) | Observaciones |
|----------|------------|--------------------------------|---------------|
| **Punto de articulación** | Vértice cuya eliminación aumenta el número de componentes conexas. | - **Raíz:** al menos dos hijos en el árbol DFS.<br>- **No raíz:** existe un hijo $w$ con $w.low \geq v.d$. | Se actualiza $v.low$ con mínimos entre $v.d$, $w.low$ de hijos y $w.d$ de back edges. |
| **Puente** | Arista cuya eliminación aumenta el número de componentes conexas. | Para arista $(v, w)$ (donde $v$ es padre de $w$ en DFS): $w.low > v.d$. | Si $w.low = v.d$, hay un ciclo y la arista no es puente. La raíz no requiere tratamiento especial. |
| **$v.d$ (tiempo de descubrimiento)** | Orden en que se visita $v$ en el DFS. | Se incrementa con cada nuevo vértice visitado. | Usado para comparar con $v.low$ en los criterios. |
| **$v.low$ (lowest reachable ancestor)** | Mínimo $d$ alcanzable desde el subárbol de $v$ mediante back edges. | Se actualiza como $\min(v.d, w.low \text{ (hijos)}, w.d \text{ (back edges)})$. | Fundamental para determinar conectividad de los subárboles. |
| **Arista de retroceso (back edge)** | Arista que conecta un vértice con un ancestro en el árbol DFS (excepto el padre directo). | Detectada cuando se explora un vecino ya visitado que no es el padre. | Permite "saltar" hacia arriba en el árbol, reduciendo $v.low$. |

## Comentarios adicionales

- El algoritmo de Tarjan para puentes y puntos de articulación es eficiente, con complejidad $O(V + E)$, ya que se basa en una sola pasada de DFS.
- Es crucial distinguir entre back edges y tree edges (aristas del árbol DFS) durante la exploración para actualizar correctamente los valores de `low`.
- En grafos no dirigidos, cada arista no dirigida se considera como dos aristas dirigidas opuestas; el algoritmo debe evitar revisar la arista hacia el padre inmediato al buscar back edges.
- La detección de puentes es un caso más restrictivo que el de puntos de articulación, lo que se refleja en la desigualdad estricta ($>$ en lugar de $\geq$).
- Este algoritmo es fundamental en aplicaciones de redes, análisis de conectividad y diseño de sistemas tolerantes a fallos.