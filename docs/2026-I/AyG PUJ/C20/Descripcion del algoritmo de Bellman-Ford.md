# Descripción del algoritmo de Bellman-Ford

## Introducción

El algoritmo de Bellman-Ford es un algoritmo de búsqueda de caminos más cortos en grafos dirigidos con pesos, que puede manejar aristas con pesos negativos. A diferencia del algoritmo de Dijkstra, que solo funciona con pesos no negativos, Bellman-Ford es más versátil pero tiene una complejidad temporal mayor.

## Pseudocódigo del algoritmo

```pseudocode
BELLMAN-FORD(G, w, s)
1  INITIALIZE-SINGLE-SOURCE(G, s)  // Inicializa distancias y predecesores
2  para i = 1 hasta |V| - 1:       // Realiza |V|-1 iteraciones
3      para cada arista (u, v) ∈ E: // Relaja todas las aristas
4          RELAX(u, v, w)           // Actualiza distancia si se encuentra un camino más corto
5  para cada arista (u, v) ∈ E:     // Verifica ciclos de peso negativo
6      si v.d > u.d + w(u, v):      // Si aún se puede relajar
7          retornar FALSO           // Hay ciclo de peso negativo
8  retornar VERDADERO               // No hay ciclos de peso negativo
```

## Funciones auxiliares

```pseudocode
INITIALIZE-SINGLE-SOURCE(G, s)
1  para cada vértice v ∈ V:         // Para todos los vértices del grafo
2      v.d = ∞                      // Distancia inicial infinita
3      v.π = NIL                    // Predecesor inicial nulo
4  s.d = 0                          // Distancia del origen es 0

RELAX(u, v, w)
1  si v.d > u.d + w(u, v):          // Si se encuentra un camino más corto
2      v.d = u.d + w(u, v)          // Actualiza distancia del vértice v
3      v.π = u                      // Establece u como predecesor de v
```

## Explicación detallada

### Inicialización (Línea 1)
El algoritmo comienza inicializando las distancias de todos los vértices a infinito (∞), excepto el vértice origen `s` cuya distancia se establece en 0. También se inicializan los predecesores de todos los vértices como nulos (NIL).

### Relajación iterativa (Líneas 2-4)
El núcleo del algoritmo realiza `|V|-1` iteraciones sobre todas las aristas del grafo. En cada iteración, se aplica la operación de relajación a cada arista. Esta propiedad garantiza que después de `|V|-1` iteraciones, las distancias calculadas serán las distancias mínimas desde el origen a todos los vértices alcanzables, siempre que no existan ciclos de peso negativo alcanzables.

### Detección de ciclos de peso negativo (Líneas 5-8)
Después de las `|V|-1` iteraciones, el algoritmo verifica si aún es posible relajar alguna arista. Si se encuentra una arista `(u, v)` tal que `v.d > u.d + w(u, v)`, significa que existe un ciclo de peso negativo alcanzable desde el origen. En este caso, el algoritmo retorna FALSO. De lo contrario, retorna VERDADERO, indicando que se han encontrado las distancias mínimas correctas.

## Propiedades importantes

1. **Complejidad temporal**: O(|V|·|E|) en el peor caso
2. **Complejidad espacial**: O(|V|) para almacenar distancias y predecesores
3. **Correctitud**: Después de `|V|-1` iteraciones, el algoritmo encuentra los caminos más cortos si no hay ciclos de peso negativo alcanzables
4. **Ventaja sobre Dijkstra**: Puede manejar aristas con pesos negativos
5. **Limitación**: No puede manejar grafos con ciclos de peso negativo alcanzables desde el origen

## Tabla de resumen

| Concepto | Descripción | Importancia |
|----------|-------------|-------------|
| Inicialización | Establece distancia del origen en 0 y las demás en ∞ | Prepara el grafo para el proceso de relajación |
| Relajación | Operación que actualiza la distancia de un vértice si se encuentra un camino más corto | Core del algoritmo para encontrar distancias mínimas |
| Iteraciones | Se realizan \|V\|-1 iteraciones sobre todas las aristas | Garantiza que las distancias se propaguen a través de todo el grafo |
| Detección de ciclos negativos | Verificación final para identificar ciclos de peso negativo | Asegura la correctitud del algoritmo |
| Complejidad temporal | O(\|V\|·\|E\|) | Más costoso que Dijkstra pero más versátil |
| Peso negativo | El algoritmo puede manejar aristas con pesos negativos | Ventaja principal sobre otros algoritmos de caminos más cortos |
| Predecesores | Almacenan el camino desde el origen hasta cada vértice | Permite reconstruir los caminos más cortos |

## Comentarios adicionales

El algoritmo de Bellman-Ford es fundamental en aplicaciones donde los pesos de las aristas pueden ser negativos, como en sistemas de arbitraje de divisas o en la detección de ciclos negativos en redes. Su capacidad para detectar ciclos de peso negativo lo hace invaluable en aplicaciones financieras y de optimización.

Una optimización común es detener el algoritmo previamente si en una iteración completa no se realiza ninguna actualización de distancia, ya que en ese punto las distancias ya son óptimas. Esta optimización puede mejorar significativamente el rendimiento en la práctica.

El algoritmo también sirve como base para otros algoritmos más eficientes en casos específicos, como el algoritmo de Bellman-Ford en cola (queue-based Bellman-Ford), que es más eficiente para grafos dispersos.