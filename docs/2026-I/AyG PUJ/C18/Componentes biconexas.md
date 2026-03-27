# Componentes biconexas

Las componentes biconexas permiten responder: al eliminar los puntos de articulación, ¿qué partes se desconectan?  
Estas componentes nos dan una idea de la descomposición estructural del grafo.

## Definiciones

CLRS 22-2

Un grafo conexo no dirigido $G=(V,E)$ con $|V| \geq 3$ es **biconexo** si no tiene puntos de articulación. Es decir, al eliminar cualquier vértice, el grafo sigue siendo conexo.

Una **componente biconexa** dentro de un grafo $G=(V,E)$ es un subgrafo biconexo maximal; esto quiere decir que no está contenido dentro de otro subgrafo biconexo más grande.  
Un puente (arista) forma por sí solo una componente biconexa con sus dos extremos; se considera una componente biconexa degenerada con una sola arista.

Una relación de equivalencia se define sobre las aristas: dos aristas $e_1$ y $e_2$ pertenecen a la misma componente biconexa si y solo si $e_1 = e_2$ (reflexiva) o existe un ciclo simple en $G$ que contiene a $e_1$ y $e_2$ (simétrica y transitiva).

## Teoremas

**CLRS 22-2a**  
Cada arista de un grafo conexo no dirigido $G$ pertenece exactamente a una componente biconexa.  
Las componentes biconexas particionan el conjunto de aristas, pero no el conjunto de vértices, porque los puntos de articulación se comparten entre las componentes.

**CLRS 22-2b**  
Dos componentes biconexas distintas comparten a lo sumo un vértice (un punto de articulación).

**Teorema del árbol de bloques**  
Sea $G$ un grafo conexo. Definimos el **árbol de bloques** $T$ donde:
- Los nodos de $T$ son las componentes biconexas (bloques) y los puntos de articulación.
- Cada componente biconexa está conectada a un punto de articulación si este pertenece a ella.
Este grafo resultante es un árbol (o un DAG con raíz, si se considera una estructura dirigida).

**CLRS 22-2c**  
Sea $G$ un grafo conexo no dirigido. Para cualesquiera dos vértices $u$, $v$ en la misma componente biconexa $B$, existen al menos dos caminos internamente disjuntos entre $u$ y $v$; es decir, que no comparten vértices intermedios. La existencia de un ciclo entre $u$ y $v$ garantiza que hay al menos un camino adicional diferente para ir de uno al otro.

## Tabla de resumen

| Concepto | Definición | Propiedad clave | Observaciones |
|----------|------------|-----------------|---------------|
| **Grafo biconexo** | Grafo conexo no dirigido con $|V| \geq 3$ que no tiene puntos de articulación. | Al eliminar cualquier vértice, el grafo permanece conexo. | Requiere al menos 3 vértices; con 2 vértices se considera degenerado. |
| **Componente biconexa** | Subgrafo biconexo maximal (no contenido en otro más grande). | Particiona las aristas del grafo, no los vértices. | Los puntos de articulación pueden pertenecer a múltiples componentes. |
| **Puente como componente** | Arista que es puente forma una componente biconexa degenerada con sus dos extremos. | Es una componente con una sola arista. | Corresponde a un caso límite en la descomposición. |
| **Relación de equivalencia** | Dos aristas están en la misma componente si son iguales o hay un ciclo simple que las contiene. | Reflexiva, simétrica y transitiva. | Base teórica para agrupar aristas en componentes. |
| **Árbol de bloques** | Grafo donde los nodos son componentes biconexas y puntos de articulación, conectados según pertenencia. | Es un árbol (o DAG con raíz). | Muestra la estructura jerárquica de la descomposición en componentes. |
| **Caminos disjuntos** | En una componente biconexa, entre cualquier par de vértices hay al menos dos caminos internamente disjuntos. | Implica redundancia de conectividad. | Consecuencia directa de la ausencia de puntos de articulación dentro de la componente. |

## Comentarios adicionales

- La descomposición en componentes biconexas es una herramienta fundamental para analizar la robustez de redes (como redes de comunicación, circuitos eléctricos o redes sociales), ya que identifica las regiones que permanecen conectadas ante fallos de nodos individuales.
- El algoritmo para encontrar componentes biconexas suele basarse en una modificación del DFS de Tarjan, apilando aristas durante la exploración y vaciando la pila al detectar un punto de articulación o la raíz del DFS.
- En aplicaciones prácticas, el árbol de bloques permite simplificar un grafo complejo en una estructura arbórea más manejable, sobre la cual se pueden resolver problemas de routing, flujos o planificación de manera más eficiente.
- La condición de "al menos dos caminos internamente disjuntos" en una componente biconexa es equivalente a que el grafo sea **2-vértice-conexo**, una propiedad clave en diseño de redes tolerantes a fallos.