# Conectividad II - Revisión y Ampliación

## Componentes Conexas en Grafos No Dirigidos

Las **componentes conexas** de un grafo no dirigido G forman una **relación de equivalencia** sobre el conjunto de vértices V(G), con las siguientes propiedades:

1. **Intersección vacía**: La intersección entre dos componentes conexas distintas es el conjunto vacío.
2. **Unión completa**: La unión de todas las componentes conexas es igual al conjunto total de vértices V(G).
3. **Conectividad interna**: Cada componente conexa es un subgrafo conexo maximal (totalmente conexo).
4. **Grafo conexo**: Un grafo G es conexo si y solo si tiene exactamente una componente conexa.

**Observación importante**: No existen aristas que conecten vértices pertenecientes a componentes conexas diferentes.

## Aristas Puente

Una **arista puente** (o arista de corte) es aquella cuya eliminación incrementa en 1 el número de componentes conexas del grafo. Formalmente, si e = (u, v) es una arista puente, entonces el grafo G' = (V, E \ {e}) tiene una componente conexa más que G.

## Teorema Fundamental de Búsqueda en Grafos

**Teorema 22.5 (Cormen)**: Si ejecutamos BFS (Breadth-First Search) o DFS (Depth-First Search) desde un nodo origen $s$ en un grafo no dirigido, entonces:
- Todos los vértices $v$ para los cuales existe un camino entre $s$ y $v$ serán visitados por el algoritmo.
- El conjunto de vértices visitados corresponde exactamente a la componente conexa que contiene a $s$.

## Conceptos Teóricos Adicionales

### Puntos de Articulación
Un **vértice de articulación** (o punto de corte) es un vértice cuya eliminación (junto con sus aristas incidentes) incrementa el número de componentes conexas del grafo. Este concepto es análogo al de arista puente pero aplicado a vértices.

### Grafos 2-Convexos
Un grafo se dice **2-conexo** si no tiene vértices de articulación. Equivalentemente, para cualquier par de vértices, existen al menos dos caminos internamente disjuntos que los conectan.

### Algoritmos para Componentes Conexas
Tanto BFS como DFS pueden utilizarse para encontrar todas las componentes conexas de un grafo no dirigido en tiempo O(V + E), donde V es el número de vértices y E el número de aristas.

## Tabla Resumen de Conceptos

| Concepto | Definición | Propiedad Clave | Algoritmo Relacionado |
|----------|------------|-----------------|----------------------|
| Componente Conexa | Subgrafo conexo maximal | Relación de equivalencia sobre V(G) | BFS/DFS para identificación |
| Grafo Conexo | Grafo con una sola componente conexa | Existe camino entre cualquier par de vértices | BFS/DFS desde cualquier vértice |
| Arista Puente | Arista cuya eliminación incrementa #CC en 1 | Conecta dos componentes en un árbol de expansión | Algoritmo basado en DFS con números de descubrimiento |
| Vértice de Articulación | Vértice cuya eliminación incrementa #CC | Punto crítico para conectividad | Algoritmo de Tarjan (DFS modificado) |
| BFS/DFS Cobertura | Algoritmo visita todos los vértices alcanzables desde el origen | Teorema 22.5 Cormen | Complejidad O(V + E) |

## Comentarios Adicionales

1. **Importancia práctica**: Las componentes conexas son fundamentales en análisis de redes sociales (comunidades), sistemas de recomendación, y detección de clusters en datos.

2. **Relación con árboles de expansión**: En un grafo conexo, cualquier árbol de expansión contiene exactamente V-1 aristas, y la eliminación de cualquier arista del árbol lo desconecta.

3. **Aplicaciones de aristas puente**: En diseño de redes, las aristas puente representan puntos únicos de falla. Su identificación permite fortalecer la robustez de la red.

4. **Extensión a grafos dirigidos**: Para grafos dirigidos, el concepto análogo es el de **componentes fuertemente conexas** (SCC), donde se requiere camino en ambas direcciones entre cualquier par de vértices.

5. **Complejidad algorítmica**: Encontrar todas las componentes conexas en un grafo no dirigido es computacionalmente eficiente (O(V+E)), lo que permite aplicaciones a grafos de gran escala.

6. **Propiedad de maximalidad**: La condición de "maximalidad" en la definición de componente conexa asegura que no se puede agregar ningún vértice adicional manteniendo la conectividad.d