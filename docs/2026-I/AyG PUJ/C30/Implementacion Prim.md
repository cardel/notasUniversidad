## Introducción teórica

El **algoritmo de Prim** construye un **árbol de cobertura mínimo (MST)** para un grafo conexo y ponderado. En cada paso, mantiene un corte fijo: el conjunto $V_T$ de vértices ya incluidos en el árbol y su complemento $V \setminus V_T$. La arista de peso mínimo que cruza este corte (arista ligera) es siempre segura, según la **propiedad de corte**, y se añade al MST.

**Propiedad de corte (cut property)**:  
Sea $A$ un subconjunto de aristas de algún MST y sea $(S, V \setminus S)$ un corte que respeta a $A$ (ninguna arista de $A$ cruza el corte). Si $e$ es la arista de peso mínimo entre todas las que cruzan el corte, entonces $e$ también pertenece a algún MST.

En Prim, al inicio $V_T = \{r\}$ (raíz) y $A = \emptyset$. El corte $(V_T, V \setminus V_T)$ respeta a $A$. La arista ligera se añade, extendiendo $V_T$ y manteniendo la propiedad. Esto se repite hasta que $V_T$ contiene todos los vértices.

El algoritmo utiliza una estructura de **clave** (distancia mínima desde $V_T$ a cada vértice externo) y **padre** para reconstruir las aristas.

---

## Código original comentado

```python
    INFTY = float('inf')   # Representa distancia infinita

def extraer_minimo(clave, en_mst):
    """Retorna el vértice no incluido en MST con la clave mínima."""
    minimo = None
    mejor = INFTY
    for v in clave:
        if not en_mst[v] and clave[v] < mejor:
            mejor = clave[v]
            minimo = v
    return minimo

def prim(grafo, raiz):
    """Ejecuta el algoritmo de Prim sobre 'grafo' (lista de adyacencia) iniciando en 'raiz'."""
    clave = {}      # distancia mínima desde el árbol actual a cada vértice
    padre = {}      # vértice predecesor en el MST
    en_mst = {}     # marca si el vértice ya fue incluido en el árbol

    # Inicialización: todas las claves a infinito, padre a None, no incluidos
    for v in grafo:
        clave[v] = INFTY
        padre[v] = None
        en_mst[v] = False
    clave[raiz] = 0   # la raíz tiene distancia 0

    peso = 0
    restantes = len(grafo)
    while restantes > 0:
        u = extraer_minimo(clave, en_mst)   # vértice con clave mínima fuera del MST
        if u is None:
            restantes = 0   # grafo no conexo, no hay más vértices alcanzables
        else:
            en_mst[u] = True
            if padre[u] is not None:        # saltamos la raíz (sin arista entrante)
                peso = peso + clave[u]

            # Recorremos los vecinos de u
            i = 0
            while i < len(grafo[u]):
                v, w = grafo[u][i]
                # Si v no está en el MST y el peso w es menor que su clave actual, actualizamos
                if not en_mst[v] and w < clave[v]:
                    clave[v] = w
                    padre[v] = u
                i = i + 1
            restantes = restantes - 1
    return padre, peso

if __name__ == '__main__':
    # Grafo de ejemplo: lista de adyacencia (vértice: [(vecino, peso), ...])
    G = {
        0: [(1, 7), (3, 5)],
        1: [(0, 7), (2, 8), (3, 9), (4, 7)],
        2: [(1, 8), (4, 5)],
        3: [(0, 5), (1, 9), (4, 15), (5, 6)],
        4: [(1, 7), (2, 5), (3, 15), (5, 8), (6, 9)],
        5: [(3, 6), (4, 8), (6, 11)],
        6: [(4, 9), (5, 11)],
    }
    padre, peso = prim(G, 0)
    print('peso del MST =', peso)
    print('aristas del MST (padre[v], v):')
    for v in padre:
        if padre[v] is not None:
            print('  (', padre[v], ',', v, ')')
```

---

## Tres ejemplos paso a paso que explican la propiedad de corte en Prim

### Ejemplo 1: Grafo pequeño con 3 vértices
**Grafo:**  
- Vértices: $A, B, C$  
- Aristas: $A-B$ (2), $A-C$ (4), $B-C$ (3)

**Proceso:**  
- Inicio: $V_T = \{A\}$, corte $(\{A\}, \{B,C\})$, aristas que cruzan: $A-B$ (2), $A-C$ (4). La arista ligera es $A-B$ (peso 2). $A$ respeta el corte ($A = \emptyset$). Se añade $A-B$.  
- Ahora $V_T = \{A, B\}$, corte $(\{A,B\}, \{C\})$, aristas que cruzan: $A-C$ (4), $B-C$ (3). La arista ligera es $B-C$ (peso 3). Se añade $B-C$.  
- $V_T = \{A, B, C\}$, MST completo. Peso total: $2 + 3 = 5$.

**Observación:** En cada paso, la arista ligera del corte actual es exactamente la que Prim selecciona.

---

### Ejemplo 2: Grafo con empate de pesos
**Grafo:**  
- Vértices: $X, Y, Z, W$  
- Aristas: $X-Y$ (1), $X-Z$ (1), $Y-Z$ (2), $Z-W$ (3), $Y-W$ (4)

**Proceso:**  
- Inicio: $V_T = \{X\}$, corte $(\{X\}, \{Y,Z,W\})$, aristas que cruzan: $X-Y$ (1), $X-Z$ (1). Hay dos aristas ligeras (peso 1). Cualquiera es segura. Supongamos que se elige $X-Y$.  
- $V_T = \{X, Y\}$, corte $(\{X,Y\}, \{Z,W\})$, aristas que cruzan: $X-Z$ (1), $Y-Z$ (2), $Y-W$ (4). La ligera es $X-Z$ (peso 1). Se añade.  
- $V_T = \{X, Y, Z\}$, corte $(\{X,Y,Z\}, \{W\})$, aristas que cruzan: $Z-W$ (3), $Y-W$ (4). La ligera es $Z-W$ (peso 3). Se añade.  
- MST: aristas $\{(X-Y,1), (X-Z,1), (Z-W,3)\}$, peso total 5.

**Observación:** Aunque hubo empate en el primer corte, la propiedad de corte sigue garantizando que ambas aristas ligeras son seguras.

---

### Ejemplo 3: Grafo más grande (el del código de ejemplo, paso a paso)
**Grafo:**  
(Vértices 0 a 6, aristas según el código $G$)

**Proceso detallado (raíz = 0):**

1. $V_T = \{0\}$, corte $(\{0\}, \{1,\dots,6\})$. Aristas que cruzan: $0-1$ (7), $0-3$ (5). Ligera: $0-3$ (5). Se añade, $V_T = \{0,3\}$.
2. Corte $(\{0,3\}, \{1,2,4,5,6\})$. Aristas: $0-1$ (7), $3-1$ (9), $3-4$ (15), $3-5$ (6), $1$ desde $0$ también. La más ligera es $3-5$ (6). Se añade, $V_T = \{0,3,5\}$.
3. Corte $(\{0,3,5\}, \{1,2,4,6\})$. Aristas: $0-1$ (7), $3-1$ (9), $5-4$ (8), $5-6$ (11), $3-4$ (15). Ligera: $0-1$ (7) o $5-4$ (8) – en realidad $0-1$=7 es más ligera que $5-4$=8. Se añade $0-1$, $V_T = \{0,1,3,5\}$.
4. Corte $(\{0,1,3,5\}, \{2,4,6\})$. Aristas: $1-2$ (8), $1-4$ (7), $5-4$ (8), $5-6$ (11), $3-4$ (15). Ligera: $1-4$ (7). Se añade, $V_T = \{0,1,3,4,5\}$.
5. Corte $(\{0,1,3,4,5\}, \{2,6\})$. Aristas: $1-2$ (8), $4-2$ (5), $4-6$ (9), $5-6$ (11). Ligera: $4-2$ (5). Se añade, $V_T = \{0,1,2,3,4,5\}$.
6. Corte $(\{0,1,2,3,4,5\}, \{6\})$. Aristas: $4-6$ (9), $5-6$ (11). Ligera: $4-6$ (9). Se añade, $V_T = \{0,1,2,3,4,5,6\}$.

**MST obtenido:** aristas $(0,3,5)$, $(3,5,6)$, $(0,1,7)$, $(1,4,7)$, $(4,2,5)$, $(4,6,9)$ – peso total $5+6+7+7+5+9 = 39$.  
(Nota: el resultado del código es el mismo que se calcula manualmente; el orden de selección puede variar si hay empates, pero el conjunto final es un MST.)

---

## Tabla resumen de conceptos

| Concepto | Definición | Comentarios adicionales |
|----------|------------|--------------------------|
| **Algoritmo de Prim** | Construye el MST comenzando desde un vértice y añadiendo siempre la arista más ligera del corte $(V_T, V \setminus V_T)$. | Complejidad $O(V^2)$ con búsqueda lineal; $O(E \log V)$ con cola de prioridad. |
| **Propiedad de corte** | Si $A$ está contenido en algún MST y $e$ es la arista más ligera que cruza un corte que respeta $A$, entonces $e$ es segura. | Garantiza la corrección de Prim (y de Kruskal). |
| **Corte en Prim** | Siempre es $(V_T, V \setminus V_T)$. Responde a $A$ automáticamente porque $A$ son aristas internas a $V_T$, nunca lo cruzan. | La raíz inicial es un vértice cualquiera; el resultado es independiente de la raíz. |
| **Clave** | Distancia mínima conocida desde un vértice fuera de $V_T$ hasta cualquier vértice en $V_T$. | Se actualiza al añadir un nuevo vértice al MST. |
| **Función extraer_minimo** | Busca linealmente el vértice no incluido con clave más pequeña. | Implementación simple; puede optimizarse con un heap. |
| **MST** | Árbol de cobertura mínimo: subconjunto de aristas que conecta todo el grafo con peso total mínimo y sin ciclos. | Puede haber varios si hay pesos repetidos. |