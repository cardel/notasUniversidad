# Búsqueda por Profundidad (DFS)

En el caso de la **búsqueda por profundidad** (Depth-First Search, DFS), el algoritmo funciona de forma análoga a la BFS, pero cambiando la estructura de datos de una cola (FIFO) por una pila (LIFO). Esta diferencia fundamental altera el orden de exploración: mientras BFS explora por niveles de distancia, DFS explora tan profundo como sea posible a lo largo de cada rama antes de retroceder.

## Algoritmo paso a paso

1. **Inicialización**: Se crea una pila (LIFO) y un conjunto para registrar nodos visitados.
2. **Inicio**: Se agrega el nodo fuente a la pila y al conjunto de visitados.
3. **Bucle principal**: Mientras la pila no esté vacía:
   - Extraer el último nodo agregado a la pila (operación pop).
   - Procesar el nodo.
   - Para cada vecino del nodo actual:
     - Si el vecino no ha sido visitado:
       - Marcarlo como visitado.
       - Agregarlo a la pila.
4. **Terminación**: El algoritmo finaliza cuando la pila queda vacía, habiendo visitado todos los nodos alcanzables desde la fuente.

## Implementación en Python

```python
"""
Implementación del algoritmo de búsqueda por profundidad (DFS) para grafos representados como matriz de adyacencia.
"""

import numpy as np

def encontrarVecinos(grafo, nodo, visitados):
    """
    Generador que devuelve los vecinos no visitados de un nodo en un grafo representado por matriz de adyacencia.
    
    Args:
        grafo (np.array): Matriz de adyacencia del grafo.
        nodo (int): Índice del nodo actual.
        visitados (set): Conjunto de nodos ya visitados.
    
    Yields:
        int: Índice de cada vecino no visitado.
    """
    for i in range(len(grafo)):
        # Verifica si hay una arista (valor 1) y si el nodo i no ha sido visitado
        if not (i in visitados) and grafo[nodo][i] == 1:
            yield i

def DFS(grafo, fuente):
    """
    Ejecuta el algoritmo DFS sobre un grafo desde un nodo fuente.
    
    Args:
        grafo (np.array): Matriz de adyacencia que representa el grafo.
        fuente (int): Índice del nodo inicial para la búsqueda.
    
    Returns:
        None: La función imprime el orden de procesamiento de los nodos.
    """
    S = []  # Pila implementada como lista (último en entrar, primero en salir - LIFO)
    visitado = set()  # Conjunto de nodos visitados
    
    S.append(fuente)  # Apilar la fuente
    visitado.add(fuente)  # Marcar la fuente como visitada

    while len(S) > 0:
        nodo = S.pop()  # Desapilar el nodo (extrae el último elemento agregado)
        print("Procesado  ", nodo)  # Procesar el nodo (en este caso, solo se imprime)
        
        # Obtener todos los vecinos no visitados del nodo actual
        vecinos = encontrarVecinos(grafo, nodo, visitado)
        for vecino in vecinos:
            S.append(vecino)  # Apilar el vecino para explorarlo después
            visitado.add(vecino)  # Marcarlo como visitado para evitar ciclos

if __name__ == "__main__":
    # Ejemplo de grafo no dirigido representado como matriz de adyacencia
    grafo = np.array(
        [
            [0, 1, 1, 0, 0],
            [1, 0, 1, 0, 0],
            [1, 1, 0, 1, 0],
            [0, 0, 1, 0, 1],
            [0, 0, 0, 1, 0],
        ]
    )
    # Ejecutar DFS comenzando desde el nodo 0
    DFS(grafo, 0)
```

## Conceptos teóricos importantes

- **DFS iterativo vs recursivo**: La implementación mostrada es iterativa (usa pila explícita). DFS también puede implementarse recursivamente usando la pila de llamadas del sistema.
- **Orden de exploración**: DFS no garantiza un orden específico de visita; depende del orden en que se generen los vecinos.
- **Camino más corto**: A diferencia de BFS, DFS **no garantiza** encontrar el camino más corto en grafos no ponderados.
- **Complejidad temporal**: $O(V + E)$ donde $V$ es el número de vértices y $E$ el de aristas, igual que BFS.
- **Complejidad espacial**: $O(V)$ en el peor caso para la pila iterativa, pero puede ser $O(d)$ donde $d$ es la profundidad máxima si se usa recursión con optimizaciones.
- **Aplicaciones comunes**:
  - Detección de ciclos en grafos.
  - Ordenamiento topológico en grafos dirigidos acíclicos (DAG).
  - Componentes fuertemente conexas (algoritmo de Kosaraju o Tarjan).
  - Resolución de laberintos y puzzles.
  - Backtracking en problemas de satisfacción de restricciones.

## Versión recursiva de DFS

```python
def DFS_recursivo(grafo, nodo, visitado=None):
    """
    Implementación recursiva de DFS.
    
    Args:
        grafo (np.array): Matriz de adyacencia.
        nodo (int): Nodo actual.
        visitado (set, optional): Conjunto de nodos visitados. Se inicializa si es None.
    
    Returns:
        None
    """
    if visitado is None:
        visitado = set()
    
    # Marcar el nodo actual como visitado y procesarlo
    visitado.add(nodo)
    print("Procesado  ", nodo)
    
    # Recursivamente visitar todos los vecinos no visitados
    for i in range(len(grafo)):
        if grafo[nodo][i] == 1 and i not in visitado:
            DFS_recursivo(grafo, i, visitado)
```

## Tabla de resumen de conceptos

| Concepto | Descripción |
|----------|-------------|
| **DFS** | Algoritmo de búsqueda en grafos que explora tan profundo como sea posible a lo largo de cada rama antes de retroceder. |
| **Pila (LIFO)** | Estructura de datos utilizada en la implementación iterativa (último en entrar, primero en salir). |
| **Recursión** | Alternativa a la pila explícita que usa la pila de llamadas del sistema para gestionar el orden de exploración. |
| **Orden de visita** | No garantizado ni único; depende del orden de generación de vecinos y de la implementación. |
| **Camino más corto** | DFS **no garantiza** encontrar el camino más corto en grafos no ponderados. |
| **Complejidad temporal** | $O(V + E)$, igual que BFS. |
| **Complejidad espacial** | $O(V)$ para pila iterativa; $O(d)$ para recursión (donde $d$ es la profundidad máxima). |
| **Aplicaciones** | Detección de ciclos, ordenamiento topológico, componentes conexas, backtracking, puzzles. |

## Comparación BFS vs DFS

| Característica | BFS | DFS |
|----------------|-----|-----|
| **Estructura de datos** | Cola (FIFO) | Pila (LIFO) |
| **Orden de exploración** | Por niveles (amplitud) | Por profundidad |
| **Camino más corto** | Garantizado en grafos no ponderados | No garantizado |
| **Complejidad espacial** | $O(V)$ (peor caso) | $O(V)$ (iterativo) o $O(d)$ (recursivo) |
| **Aplicaciones típicas** | Camino más corto, conectividad | Ciclos, ordenamiento topológico, backtracking |
| **Implementación** | Siempre iterativa (con cola) | Iterativa (con pila) o recursiva |

## Comentarios adicionales

- **DFS en grafos implícitos**: Al igual que BFS, DFS puede aplicarse a grafos implícitos (como grillas 2D) simplemente cambiando la estructura de datos.
- **Backtracking**: DFS es la base natural de algoritmos de backtracking, donde se explora sistemáticamente todas las posibilidades y se retrocede cuando una rama no lleva a solución.
- **Variantes importantes**:
  - **DFS con marcas de tiempo**: Utilizado en algoritmos como el de Kosaraju para componentes fuertemente conexas.
  - **DFS limitado en profundidad**: Útil cuando se conoce una profundidad máxima o para evitar recursión infinita.
  - **DFS iterativo en profundidad**: Combina las ventajas de BFS y DFS, explorando gradualmente mayores profundidades.
- **Optimizaciones**:
  - **Podas**: En problemas de búsqueda, eliminar ramas que no pueden contener soluciones.
  - **Memoización**: Almacenar resultados de subproblemas para evitar recomputación.
  - **Heurísticas**: Ordenar los vecinos para explorar primero los más prometedores.
- **Limitaciones**:
  - Puede quedar atrapado en ramas infinitas si el grafo tiene ciclos y no se usa conjunto de visitados.
  - No es adecuado para encontrar el camino más corto en grafos no ponderados.
  - La versión recursiva puede causar desbordamiento de pila en grafos muy profundos.
- **Recomendaciones prácticas**:
  - Usar BFS cuando se necesite el camino más corto en grafos no ponderados.
  - Usar DFS para detectar ciclos, hacer ordenamiento topológico o cuando la memoria sea limitada (versión recursiva).
  - Considerar DFS iterativo en profundidad cuando se desconozca la profundidad de la solución.