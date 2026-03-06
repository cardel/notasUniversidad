# Punto 2 - Grafos Bipartitos [15 pts.]

## 2. (15 puntos) Un grafo bipartito es un grafo no dirigido en el que se puede colorear cada nodo usando dos colores de tal forma que ningún nodo está conectado a un nodo del mismo color.

Es posible determinar si un grafo es bipartito modificando los recorridos primero en profundidad (DFS) o primero en amplitud (BFS). Implemente una función que reciba un grafo y determine si es bipartito. Indique la complejidad de su solución. Explique.

## Estrategia

Modificar la búsqueda por amplitud (BFS), tomando como inicio todos los vértices del grafo y parando en la primera iteración. Se utiliza una cola y un conjunto de visitados.

Por ejemplo, si tenemos el siguiente grafo:
```
(0,1), (0,2), (0,6), (0,7), (1,4), (2,3), (2,4), (5,6), (5,7)
```

Voy a iniciar BFS con el vértice 0:

Iniciando con 0:
- cola = [0]
- visitados = []
- cola = [1, 2, 6, 7] ← Cola
- visitados = [0]

Iniciando con 1:
- cola = [1]
- visitados = []
- cola = [0, 4]
- visitados = [1]

Iniciando con 2:
- cola = [0, 3, 4]
- visitados = [2]

Con 3:
- cola = [2]
- visitados = [3]

Con 4:
- cola = [1, 2]
- visitados = [4]

Con 5:
- cola = [6, 7]
- visitados = [5]

Con 6:
- cola = [5, 0]
- visitados = [6]

Con 7:
- cola = [0, 5]
- visitados = [7]

Los dos conjuntos se arman a partir de observar los elementos que tengan elementos en común en la cola. El conjunto A tiene elementos en común en la cola y en los visitados son diferentes.

## Idea

Vamos a usar BFS dado que me permite mirar los vértices vecinos (DFS no permite saber esto directamente). Dado un grafo $G(V,E)$, vamos a transformar la cola en un conjunto, voy a detener el algoritmo en la primera iteración. Tomamos arbitrariamente uno de los vértices, entonces de este tengo los visitados (el mismo) y la cola (vecinos). Itero sobre los demás vértices y tomo los que tienen vecinos en común. De estos, uno el conjunto de vértices visitados $v$ (obtengo el primer conjunto) y uno las colas $c$ (obtengo el segundo conjunto).

1. $v \cap u = \emptyset$ (conjuntos disjuntos)
2. $v \cup u = V$ (cubren todos los vértices)

La idea en general es buscar los dos conjuntos, cumpliendo la regla de que sean conjuntos disjuntos.

## Conceptos teóricos clave

### 1. Grafo bipartito
Un grafo $G = (V, E)$ es **bipartito** si existe una partición de $V$ en dos conjuntos disjuntos $U$ y $W$ tal que toda arista en $E$ conecta un vértice de $U$ con un vértice de $W$. Equivalentemente, es un grafo 2-coloreable.

### 2. Propiedades de grafos bipartitos
- No contienen ciclos de longitud impar
- Todo árbol es bipartito
- Los grafos bipartitos completos $K_{m,n}$ tienen $m$ vértices en un conjunto y $n$ en el otro

### 3. Algoritmo de detección
Se puede determinar si un grafo es bipartito mediante BFS o DFS asignando colores alternados a los vértices:
- Iniciar con un vértice, asignarle color 0
- Para cada vecino, asignar color 1
- Si se encuentra un vecino con el mismo color que el actual, el grafo no es bipartito

### 4. Complejidad algorítmica
- BFS/DFS tienen complejidad $O(|V| + |E|)$
- La verificación de bipartitud añade solo operaciones constantes por arista

## Código implementado con comentarios

```python
from collections import deque

def buscar_vecinos(G, source):
    """
    Encuentra todos los vecinos de un vértice en un grafo no dirigido.
    
    Args:
        G: lista de aristas (tuplas) que representan el grafo
        source: vértice del cual buscar vecinos
    
    Returns:
        Conjunto de vértices vecinos
    """
    sal = []
    for i, j in G:
        if i == source:
            sal.append(j)
        if j == source:
            sal.append(i)
    return set(sal)

def BFS(G, source):
    """
    Realiza una iteración de BFS desde un vértice fuente.
    Retorna el vértice fuente y sus vecinos directos.
    
    Args:
        G: lista de aristas del grafo
        source: vértice de inicio
    
    Returns:
        Tupla (vértice_fuente, conjunto_de_vecinos)
    """
    Q = deque()  # Cola para BFS
    V = set()    # Conjunto de visitados
    
    Q.append(source)
    V.add(source)
    
    nodo = Q.popleft()  # Extraer el nodo más antiguo de la cola (FIFO)
    
    vecinos = buscar_vecinos(G, nodo)
    
    for vecino in vecinos:
        if not (vecino in V):
            Q.append(vecino)  # Encolar el vecino para explorarlo después
    
    return V.pop(), set(Q)

if __name__ == "__main__":
    # Grafo de ejemplo
    G = [(0, 1), (0, 2), (0, 6), (0, 7), (1, 4), (2, 3), (2, 4), (5, 6), (5, 7)]
    V = [0, 1, 2, 3, 4, 5, 6, 7]
    
    # Diccionario para almacenar vecindades
    vecindad = dict()
    
    # Calcular vecindad para cada vértice
    for v in V:
        k, l = BFS(G, v)
        vecindad[k] = l
    
    # Construir los dos conjuntos bipartitos
    setA = set()
    setB = set()
    
    for k, v in vecindad.items():
        print(v, setA, v.intersection(setA))
        
        # Si k no está en setA y no comparte vecinos con setA
        if not (k in setA) and v.intersection(setA) == set():
            setA.add(k)
        else:
            setB.add(k)
        
        print(setA, setB)
    
    # Condición de bipartito
    print("Conjunto A:", setA)
    print("Conjunto B:", setB)
    
    # Verificar condiciones de grafo bipartito
    condicion = (setA.intersection(setB) == set()) and (setA.union(setB) == set(V))
    print("¿Es bipartito?:", condicion)
```

## Algoritmo alternativo más eficiente

```python
from collections import deque

def es_bipartito_bfs(grafo, n):
    """
    Determina si un grafo no dirigido es bipartito usando BFS.
    
    Args:
        grafo: lista de adyacencia del grafo
        n: número de vértices
    
    Returns:
        True si el grafo es bipartito, False en caso contrario
    """
    color = [-1] * n  # -1: no coloreado, 0: color A, 1: color B
    
    for i in range(n):
        if color[i] == -1:  # Vértice no visitado
            color[i] = 0
            cola = deque([i])
            
            while cola:
                u = cola.popleft()
                
                for v in grafo[u]:
                    if color[v] == -1:
                        # Asignar color alterno al vecino
                        color[v] = 1 - color[u]
                        cola.append(v)
                    elif color[v] == color[u]:
                        # Dos vértices adyacentes tienen el mismo color
                        return False
    
    return True
```

## Tabla de resumen de conceptos

| Concepto | Descripción | Aplicación en el problema |
|----------|-------------|---------------------------|
| **Grafo bipartito** | Grafo cuyos vértices pueden dividirse en dos conjuntos disjuntos donde las aristas solo conectan vértices de conjuntos diferentes | Problema central a resolver |
| **2-coloración** | Asignación de dos colores a vértices tal que vértices adyacentes tengan colores diferentes | Formulación alternativa del problema |
| **BFS (Breadth-First Search)** | Recorrido por niveles que explora todos los vecinos antes de pasar al siguiente nivel | Algoritmo base para detección |
| **DFS (Depth-First Search)** | Recorrido en profundidad que explora ramas completas antes de retroceder | Alternativa a BFS para detección |
| **Ciclos de longitud impar** | Propiedad clave: un grafo es bipartito si y solo si no contiene ciclos de longitud impar | Criterio teórico importante |
| **Complejidad $O(V+E)$** | Tiempo lineal en vértices y aristas para BFS/DFS | Complejidad óptima para el problema |
| **Partición de vértices** | División de $V$ en dos subconjuntos disjuntos $U$ y $W$ | Objetivo del algoritmo |

## Comentarios adicionales

1. **Limitaciones del algoritmo presentado:** La implementación actual realiza BFS desde cada vértice por separado, resultando en complejidad $O(|V| \times (|V| + |E|))$ en el peor caso, que es ineficiente. El algoritmo estándar realiza un solo BFS/DFS desde cada componente conexa no visitada, con complejidad $O(|V| + |E|)$.

2. **Algoritmo óptimo:** El método correcto es:
   - Inicializar todos los vértices como no coloreados (-1)
   - Para cada componente conexa no visitada:
     - Asignar color 0 al vértice inicial
     - Realizar BFS/DFS, asignando color alterno (1-color_actual) a los vecinos
     - Si se encuentra un vecino con el mismo color, retornar False
   - Si termina sin conflictos, retornar True

3. **Aplicaciones prácticas:**
   - **Sistemas de emparejamiento:** Asignación de trabajos a trabajadores, estudiantes a proyectos
   - **Redes sociales:** Detección de comunidades con interacciones solo entre grupos
   - **Scheduling:** Asignación de recursos sin conflictos
   - **Circuitos electrónicos:** Diseño de placas de circuito impreso (PCB routing)

4. **Teorema fundamental:** Un grafo es bipartito si y solo si no contiene ciclos de longitud impar. Esta propiedad proporciona una forma alternativa de verificar bipartitud.

5. **Extensión a k-partitos:** El concepto se generaliza a grafos k-partitos, donde los vértices se dividen en k conjuntos disjuntos y las aristas solo conectan vértices de conjuntos diferentes.

6. **Grafos bipartitos completos ($K_{m,n}$):** Caso especial donde todo vértice de un conjunto está conectado con todos los vértices del otro conjunto. Tienen $m \times n$ aristas.

7. **Implementación con matrices de adyacencia:** Para grafos densos, se puede usar una matriz de adyacencia, aunque la complejidad sería $O(|V|^2)$.

8. **Grafos dirigidos:** El concepto de bipartitud generalmente se aplica a grafos no dirigidos, pero existen análogos para grafos dirigidos (grafos bipartitos dirigidos).