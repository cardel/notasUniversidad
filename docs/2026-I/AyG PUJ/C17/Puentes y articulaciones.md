# Problema de puentes y articulaciones

Dado un grafo $G(V,E)$, queremos identificar los elementos críticos cuya eliminación desconecta el grafo. Este problema tiene diferentes aplicaciones en la vida real: comunicaciones, infraestructura, etc.

- **Punto de articulación**: Un vértice cuya eliminación desconecta el grafo.
- **Puente**: Una arista cuya remoción desconecta el grafo.

## Punto de articulación

Sea $G=(V,E)$ un grafo no dirigido. Un vértice $v \in V$ es un **punto de articulación** si el grafo $G - v$ tiene más componentes conexas que $G$.

## Puente

Sea $G = (V,E)$ un grafo no dirigido conexo. Una arista $e = (u,v) \in E$ es un **puente** si el grafo $G - e$ tiene más componentes conexas que $G$. Una arista $e$ es un puente **si y solo si** no pertenece a ningún ciclo simple de $G$.

# Recordando DFS

En el caso de grafos no dirigidos, cada arista se clasifica como:

1. **Tree Edge (Arista de árbol)**: Arista $(u,v)$ donde $v$ fue descubierto por primera vez al explorar $(u,v)$.
2. **Back edge (Arista de retroceso)**: Arista $(u,v)$ donde $v$ es un ancestro de $u$ en el árbol DFS, esto significa que el tiempo de descubrimiento de $v$ es menor que el tiempo de descubrimiento de $u$.
3. **Tiempo de descubrimiento**: Para cada vértice es el orden (marca de tiempo) en el que $v$ fue descubierto, lo denotamos $v.d$.
4. **$v.low$** para cada vértice lo definimos así:
   $$
   v.low = \texttt{min}\begin{cases}
   v.d, \\
   w.d \texttt{ para toda arista de retroceso (u,w) donde u es descendiente de v} \\
   u.low \texttt{ para todo hijo u de v en el árbol DFS}
   \end{cases}
   $$
5. $v.low$ representa el ancestro más antiguo (con menor $d$) alcanzable desde el subárbol de $v$ usando a lo sumo un *back edge*.
6. Si $(u,v)$ es un puente, entonces $u$ o $v$ son puntos de articulación, a menos que tengan grado 1. Sin embargo, un punto de articulación no necesariamente tiene un puente incidente. La eliminación de un vértice puede arrastrar a una o más aristas incidentes, y estas pueden ser los puntos de conexión con el otro componente.

## Conceptos Teóricos Relevantes

- **Componente conexa**: Subgrafo maximal donde existe un camino entre cualquier par de vértices.
- **Ciclo simple**: Camino cerrado que no repite vértices excepto el inicial y final.
- **Grado de un vértice**: Número de aristas incidentes a él.
- **Propiedad de puente**: Una arista es puente si y solo si no está en ningún ciclo, ya que un ciclo proporciona un camino alternativo.
- **Propiedad de punto de articulación**: Un vértice $v$ es punto de articulación si existe un hijo $u$ en el árbol DFS tal que $u.low \geq v.d$, lo que indica que $u$ no puede alcanzar un ancestro de $v$ sin pasar por $v$.

## Tabla de Resumen

| Concepto | Descripción |
|----------|-------------|
| Punto de articulación | Vértice cuya eliminación aumenta el número de componentes conexas del grafo. |
| Puente | Arista cuya eliminación aumenta el número de componentes conexas del grafo. |
| Condición de puente | Una arista es puente si y solo si no pertenece a ningún ciclo simple. |
| Tree Edge (Arista de árbol) | Arista que forma parte del árbol DFS, descubriendo un nuevo vértice. |
| Back Edge (Arista de retroceso) | Arista que conecta un vértice con un ancestro en el árbol DFS. |
| Tiempo de descubrimiento (v.d) | Orden en que un vértice es visitado por primera vez en DFS. |
| Low-link (v.low) | Menor tiempo de descubrimiento alcanzable desde el subárbol de v usando aristas de árbol y una de retroceso. |
| Relación puente-articulación | Si (u,v) es puente, u o v son puntos de articulación (a menos que grado=1). |

## Comentarios Adicionales

- La detección de puentes y puntos de articulación se puede realizar en $O(|V| + |E|)$ usando una variación de DFS que calcula $v.d$ y $v.low$.
- Para un vértice raíz del árbol DFS, es punto de articulación si tiene al menos dos hijos en el árbol DFS.
- Para un vértice no raíz $v$, es punto de articulación si existe un hijo $u$ tal que $u.low \geq v.d$.
- Una arista $(u,v)$ es puente si y solo si $v.low > u.d$ (asumiendo $u$ es padre de $v$ en el árbol DFS).
- Estos conceptos son fundamentales en el diseño de redes robustas, donde se busca minimizar puntos únicos de falla.
- En grafos dirigidos, los conceptos análogos son vértices y aristas fuertemente críticos, pero su detección es más compleja.|