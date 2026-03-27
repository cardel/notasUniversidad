# Algoritmo de Pila de Aristas

El algoritmo de pila de aristas es una modificación del algoritmo de Tarjan para puntos de articulación (PA) que utiliza una pila auxiliar para almacenar las aristas durante la exploración DFS.

**¿Por qué almacenar aristas y no vértices?**  
Porque los puntos de articulación pueden pertenecer a varios componentes biconexos. Al almacenar aristas, podemos extraer exactamente las que conforman cada componente biconexa sin duplicar vértices compartidos.

## Idea del algoritmo

1. Se utiliza DFS para calcular $v.d$ (tiempo de descubrimiento) y $low(v)$ (mínimo ancestro alcanzable), añadiendo una pila de aristas como estructura auxiliar.
2. Al explorar una arista $(u,v)$ en el DFS, esta se apila.
3. Cuando se detecta que $low[v] \geq u.d$ (es decir, $u$ es un punto de articulación con respecto a $v$, o $u$ es la raíz con más de un hijo), se desapilan aristas hasta extraer $(u,v)$ inclusive.
4. El conjunto de aristas extraídas forma una componente biconexa.

## Complejidad del algoritmo

- **Temporal:** $O(V+E)$ debido al DFS.
- **Espacial:** $O(V+E)$; la pila almacena a lo sumo $|E|$ aristas, y las demás estructuras (arrays de descubrimiento, low, padres) son $O(V)$.

## Tabla de resumen

| Concepto | Descripción | Propósito en el algoritmo | Observaciones |
|----------|-------------|---------------------------|---------------|
| **Pila de aristas** | Estructura auxiliar LIFO que almacena aristas durante el DFS. | Agrupar aristas que pertenecen a la misma componente biconexa. | Permite extraer componentes completas al detectar un punto de articulación. |
| **Condición de extracción** | $low[v] \geq u.d$ (para arista $(u,v)$ donde $u$ es padre de $v$ en DFS). | Señala que $u$ es punto de articulación; las aristas apiladas desde $(u,v)$ hacia arriba forman una componente. | Incluye el caso especial de la raíz con múltiples hijos. |
| **Almacenamiento de aristas** | Se apila cada arista al ser explorada en el DFS (tree edges y back edges). | Garantiza que todas las aristas de una componente estén contiguas en la pila. | Los vértices (puntos de articulación) pueden aparecer en múltiples componentes; las aristas no. |
| **Complejidad temporal** | $O(V+E)$ | Determinada por el recorrido DFS sobre todos los vértices y aristas. | Igual que el algoritmo de Tarjan para PA/puentes. |
| **Complejidad espacial** | $O(V+E)$ | Pila de aristas: $O(E)$; arrays de apoyo: $O(V)$. | En el peor caso (grafo completo), la pila almacena todas las aristas. |

## Comentarios adicionales

- Este algoritmo es una implementación eficiente y elegante para descomponer un grafo en sus componentes biconexas, ya que combina la detección de puntos de articulación con la construcción explícita de los bloques.
- La pila de aristas asegura que cada componente biconexa se extrae exactamente una vez, en el momento en que se identifica su "punto de articulación superior".
- En la práctica, este método es preferible cuando se necesita listar las aristas de cada componente (por ejemplo, para visualización o análisis estructural), mientras que el árbol de bloques se construye fácilmente a partir de la salida del algoritmo.
- Una variante común es apilar vértices en lugar de aristas, pero esto requiere manejo especial para los puntos de articulación compartidos; la versión con aristas es más directa conceptualmente.
- La condición $low[v] \geq u.d$ es la misma que se usa para detectar puntos de articulación en el algoritmo de Tarjan, lo que muestra la estrecha relación entre ambos problemas.