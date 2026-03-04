# Búsqueda por Amplitud (BFS)

La **búsqueda por amplitud** (Breadth-First Search, BFS) es un algoritmo de búsqueda en grafos que permite explorar el grafo desde un vértice inicial, visitando los nodos en orden de distancia creciente desde el origen. Primero se exploran todos los nodos a distancia 1, luego todos a distancia 2, y así sucesivamente, garantizando que se encuentre el camino más corto en grafos no ponderados.

## Algoritmo paso a paso

1. **Inicialización**: Se crea una cola (FIFO) y un conjunto para registrar nodos visitados.
2. **Inicio**: Se agrega el nodo fuente a la cola y al conjunto de visitados.
3. **Bucle principal**: Mientras la cola no esté vacía:
   - Extraer el primer nodo de la cola.
   - Procesar el nodo (por ejemplo, imprimirlo, evaluarlo, etc.).
   - Para cada vecino del nodo actual:
     - Si el vecino no ha sido visitado:
       - Marcarlo como visitado.
       - Agregarlo al final de la cola.
4. **Terminación**: El algoritmo finaliza cuando la cola queda vacía, habiendo visitado todos los nodos alcanzables desde la fuente.

## Implementación en Python

```python
"""
Implementación del algoritmo de búsqueda por amplitud (BFS) para grafos representados como matriz de adyacencia.
"""

from collections import deque
import numpy as np

"""
Pseudocódigo BFS:
BFS(grafo, fuente):
    crear cola Q
    crear conjunto visitado
    encolar(Q, fuente)
    marcar fuente como visitado
    mientras Q no esté vacía:
        nodo = desencolar(Q)
        procesar(nodo)
        para cada vecino de nodo:
            si vecino no está visitado:
                marcar vecino como visitado
                encolar(Q, vecino)
"""

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

def BFS(grafo, fuente):
    """
    Ejecuta el algoritmo BFS sobre un grafo desde un nodo fuente.
    
    Args:
        grafo (np.array): Matriz de adyacencia que representa el grafo.
        fuente (int): Índice del nodo inicial para la búsqueda.
    
    Returns:
        None: La función imprime el orden de procesamiento de los nodos.
    """
    Q = deque()          # Cola para manejar el orden FIFO de exploración
    visitado = set()     # Conjunto para evitar reprocesar nodos
    
    Q.append(fuente)     # Encolar el nodo fuente
    visitado.add(fuente) # Marcarlo como visitado inmediatamente

    while len(Q) > 0:
        nodo = Q.popleft()  # Extraer el nodo más antiguo de la cola (FIFO)
        print("Procesado  ", nodo)  # Procesar el nodo (en este caso, solo se imprime)
        
        # Obtener todos los vecinos no visitados del nodo actual
        vecinos = encontrarVecinos(grafo, nodo, visitado)
        for vecino in vecinos:
            Q.append(vecino)      # Encolar el vecino para explorarlo después
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
    # Ejecutar BFS comenzando desde el nodo 0
    BFS(grafo, 0)
```

## Conceptos teóricos importantes

- **Grafo**: Conjunto de vértices (nodos) conectados por aristas (edges). Puede ser dirigido o no dirigido.
- **Matriz de adyacencia**: Representación de un grafo donde una matriz cuadrada indica, con 1 o 0, si existe una arista entre dos nodos.
- **BFS garantiza el camino más corto** en grafos no ponderados porque explora por niveles de distancia.
- **Complejidad temporal**: $O(V + E)$ donde $V$ es el número de vértices y $E$ el de aristas, ya que cada nodo y arista se procesa una vez.
- **Complejidad espacial**: $O(V)$ en el peor caso, debido al almacenamiento de la cola y el conjunto de visitados.
- **Aplicaciones comunes**:
  - Búsqueda del camino más corto en grafos no ponderados.
  - Prueba de conectividad entre nodos.
  - Componentes conexas en grafos no dirigidos.
  - Niveles de separación en redes sociales.

## Tabla de resumen de conceptos

| Concepto | Descripción |
|----------|-------------|
| **BFS** | Algoritmo de búsqueda en grafos que explora por niveles de distancia desde un nodo fuente. |
| **Cola (FIFO)** | Estructura de datos utilizada para gestionar el orden de exploración (primero en entrar, primero en salir). |
| **Conjunto de visitados** | Estructura que almacena nodos ya procesados para evitar ciclos y reprocesamiento. |
| **Matriz de adyacencia** | Representación de un grafo mediante una matriz donde el valor en la posición (i, j) indica la existencia de una arista. |
| **Camino más corto** | BFS garantiza encontrar el camino con menor número de aristas en grafos no ponderados. |
| **Complejidad temporal** | $O(V + E)$, lineal respecto al tamaño del grafo. |
| **Complejidad espacial** | $O(V)$ en el peor caso, debido al almacenamiento de la cola y visitados. |
| **Aplicaciones** | Conectividad, componentes conexas, redes sociales, puzzles, broadcasting en redes. |

## Comentarios adicionales

- **Grafos ponderados**: BFS no es adecuado para grafos con pesos en las aristas; en ese caso se usan algoritmos como Dijkstra o A*.
- **Variantes**: BFS puede adaptarse para grafos dirigidos, árboles y hasta para problemas en grillas (como laberintos).
- **Implementaciones alternativas**: Además de matriz de adyacencia, BFS puede implementarse sobre listas de adyacencia, que suelen ser más eficientes en espacio para grafos dispersos.
- **BFS vs DFS**: Mientras BFS explora por amplitud (niveles), la búsqueda en profundidad (DFS) explora tan lejos como sea posible antes de retroceder. La elección depende del problema.
- **Optimizaciones**: En problemas de búsqueda bidireccional, se puede ejecutar BFS desde el origen y el destino simultáneamente para reducir el tiempo de búsqueda.
- **Limitaciones**: BFS requiere almacenar todos los nodos de un nivel en memoria, lo que puede ser costoso en grafos con gran factor de ramificación.