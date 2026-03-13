# Solución — Primer Parcial Árboles y Grafos 2026-1

---

## Pregunta — Dividir y Conquistar [16 pts.]

**(Tipo 1: Pregunta 1 | Tipo 2: Pregunta 6)**

### Contexto del problema

Zlatan recorre una ruta dividida en $n$ segmentos consecutivos con distancias conocidas $s_1, s_2, \ldots, s_n$. Debe hacer exactamente $K$ paradas nocturnas, dividiendo el viaje en $K+1$ días. Se quiere **minimizar la distancia máxima** recorrida en un solo día.

### (a) Función monótona para la búsqueda binaria [6 pts.]

Definimos la función:

$$f(D) = \text{número mínimo de paradas nocturnas necesarias si la distancia máxima diaria es } D$$

Para calcular $f(D)$, recorremos los segmentos con una estrategia greedy: acumulamos distancia en el día actual y, cuando agregar el siguiente segmento superaría $D$, contamos una parada y comenzamos un nuevo día.

Esta función es **monótona decreciente**:

- Si $D$ aumenta (más distancia permitida por día), se necesitan **menos paradas**, pues cada día puede cubrir más segmentos.
- Si $D$ disminuye (menos distancia permitida por día), se necesitan **más paradas**, pues hay que fraccionar más el recorrido.
- Si $D < \max(s_i)$, la función no está definida (algún segmento no cabe en un día).
- Si $D = \sum s_i$, entonces $f(D) = 0$ (todo en un solo día, cero paradas).

Dado que $f$ es monótona decreciente, buscamos el menor $D^*$ tal que $f(D^*) \leq K$. Como $f$ es decreciente, para todo $D \geq D^*$ también se cumple $f(D) \leq K$, y para todo $D < D^*$ se tiene $f(D) > K$. La búsqueda binaria encuentra ese $D^*$.

> **Relación con el curso:** Este problema aplica directamente el *Algoritmo de Bisección* (Clase 8) en su versión discreta. La función $f(D)$ es monótona decreciente, lo que garantiza que al evaluar $f(\text{mid})$ podemos descartar una mitad del intervalo. Además, combina el paradigma de *Divide y Vencerás* (Clase 7): la búsqueda binaria divide el espacio de soluciones a la mitad en cada paso, obteniendo complejidad logarítmica. Según CLRS (Cap. 4), este tipo de búsqueda binaria sobre la respuesta es una aplicación del paradigma *binary search on the answer*.

### (b) Implementación en Python [7 pts.]

```python
def count_stops(segments, max_dist):
    """
    Calcula el número mínimo de paradas nocturnas necesarias
    si la distancia máxima diaria es max_dist.
    Estrategia greedy: acumula segmentos hasta que excedería max_dist.
    Retorna -1 si algún segmento excede max_dist (infactible).
    """
    stops = 0
    current = 0
    i = 0

    while i < len(segments):
        if segments[i] > max_dist:
            stops = -1
            i = len(segments)      # terminar: infactible
        elif current + segments[i] > max_dist:
            stops = stops + 1      # nueva parada: empieza nuevo día
            current = segments[i]
            i = i + 1
        else:
            current = current + segments[i]
            i = i + 1

    return stops


def solve(segments, K):
    """
    Búsqueda binaria sobre la respuesta D*.
    f(D) = count_stops(segments, D) es monótona decreciente.
    Buscamos el menor D tal que f(D) <= K.
    """
    lo = max(segments)
    hi = sum(segments)

    while lo < hi:
        mid = (lo + hi) // 2
        paradas = count_stops(segments, mid)
        if paradas <= K:
            hi = mid        # mid es factible, intentamos algo menor
        else:
            lo = mid + 1    # mid no es factible, necesitamos más

    return lo  # lo == hi == D* óptimo


# --- Verificación con el ejemplo del enunciado ---
segments = [5, 2, 4, 6]
K = 1
print(solve(segments, K))  # Salida: 10
```

**Traza del ejemplo:** $\text{segments} = [5, 2, 4, 6]$, $K = 1$.

| Iteración | lo | hi | mid | $f(\text{mid})$ = paradas | ¿$f \leq K$? | Acción |
|-----------|----|----|-----|---------------------------|--------------|--------|
| 1 | 6 | 17 | 11 | 1 ([5,2,4]=11, [6]=6) | Sí | hi = 11 |
| 2 | 6 | 11 | 8 | 2 ([5,2]=7, [4]=4, [6]=6) | No | lo = 9 |
| 3 | 9 | 11 | 10 | 1 ([5,2]=7, [4,6]=10) | Sí | hi = 10 |
| 4 | 9 | 10 | 9 | 2 ([5,2]=7, [4]=4, [6]=6) | No | lo = 10 |

Resultado: $D^* = 10$ (parar después del segmento 2: días de 7 y 10). ✓

### (c) Complejidad [3 pts.]

- **Espacio de búsqueda:** $[\max(s_i),\; \sum s_i]$. Si $S = \sum s_i$, la búsqueda binaria hace $O(\log S)$ iteraciones.
- **Función de verificación:** `count_stops` recorre los $n$ segmentos en $O(n)$.
- **Complejidad total:** $O(n \log S)$.

> **Relación con el curso:** La complejidad $O(\log S)$ de la búsqueda binaria sigue la recurrencia $T(S) = T(S/2) + O(n)$, análoga al análisis de complejidad de la bisección discreta (Clase 8). Cada iteración reduce el intervalo a la mitad, y dentro de cada iteración el costo es $O(n)$ por el recorrido greedy.

---

## Pregunta — Grafos: Autómatas [15 pts.]

**(Tipo 1: Pregunta 2 | Tipo 2: Pregunta 1)**

### (a) Representación con listas de adyacencia [4 pts.]

Para representar un autómata, además de la estructura estándar de un grafo (listas de adyacencia), necesitamos:

1. **Estado inicial:** una variable que indique cuál es el estado de partida.
2. **Estados finales:** un conjunto (`set`) con los estados de aceptación.
3. **Etiquetas en las aristas:** cada entrada en la lista de adyacencia asocia un símbolo con el estado destino.

```python
# Estado inicial
initial = "q0"

# Estados finales
finals = {"q2"}

# Lista de adyacencia: diccionario de diccionarios
# adj[estado][simbolo] = estado_destino
adj = {
    "q0": {"a": "q1", "b": "q3"},
    "q1": {"a": "q1", "b": "q2"},
    "q2": {},
    "q3": {"a": "q3", "b": "q3"},
}
```

> **Relación con el curso:** Esta representación extiende las *listas de adyacencia* vistas en Clase 10 (Representaciones de grafos). En el curso se vieron grafos donde `adj[u]` contiene solo los vecinos de $u$. Aquí se usa un diccionario anidado: `adj[estado][símbolo] = destino`, lo que permite consultar transiciones en $O(1)$. Según CLRS (Sec. 22.1), las listas de adyacencia son preferibles para grafos dispersos por su eficiencia espacial $O(V + E)$.

### (b) Función para aceptar cadenas [11 pts.]

```python
def accepts(initial, finals, adj, word):
    """
    Determina si el autómata acepta la cadena 'word'.
    Simulación directa: desde el estado inicial, seguir transiciones
    según cada símbolo. Al terminar, verificar si estamos en un estado final.

    Precondición: el autómata es determinista (DFA).
    """
    current = initial
    accepted = True
    i = 0

    while i < len(word) and accepted:
        c = word[i]
        transitions = adj.get(current, {})
        if c in transitions:
            current = transitions[c]
        else:
            accepted = False    # no hay transición válida → rechaza
        i = i + 1

    if accepted:
        accepted = current in finals

    return accepted


# Verificación
print(accepts(initial, finals, adj, "aaab"))  # True:  q0 →a→ q1 →a→ q1 →a→ q1 →b→ q2
print(accepts(initial, finals, adj, "aba"))   # False: q0 →a→ q1 →b→ q2 →a→ ? (sin transición)
```

> **Relación con el curso:** Este algoritmo es esencialmente un recorrido dirigido sobre el grafo del autómata, similar a un BFS/DFS de un solo camino (Clase 11). La diferencia es que en lugar de explorar todos los vecinos, solo seguimos la arista cuya etiqueta coincide con el siguiente símbolo de la cadena. En CLRS (Sec. 22.3), esto corresponde a un recorrido guiado sobre un grafo dirigido.

---

## Pregunta — Campamento Supremo [15 pts.]

**(Tipo 1: Pregunta 3 | Tipo 2: Pregunta 2)**

### Especificación del problema

**Entrada:**

- Un grafo no dirigido $G = (V, E)$ donde $V$ son los campamentos y $E$ las colaboraciones.
- Una función $\text{skill}: V \rightarrow \mathbb{Z}$ que asigna el nivel de habilidad de cada campamento.

**Salida:**

- Para cada grupo de campamentos conectados directa o indirectamente, el nivel de habilidad máximo.

**Precondición:** $|V| \geq 1$.

**Postcondición:** Se retorna una lista con el máximo nivel de habilidad de cada grupo de nodos conectados.

### Algoritmo

El problema se reduce a encontrar los **grupos de nodos conectados** (nodos alcanzables entre sí por caminos) y, para cada grupo, obtener el máximo nivel de habilidad. Usamos BFS para recorrer cada grupo.

```python
from collections import deque

def supreme_camps(n, adj, skill):
    """
    Encuentra el máximo nivel de habilidad por grupo de nodos conectados.

    Args:
        n: número de campamentos (0..n-1)
        adj: lista de adyacencia (adj[u] = [v1, v2, ...])
        skill: lista donde skill[i] es el nivel de habilidad del campamento i

    Returns:
        Lista con el máximo skill de cada grupo conectado.
    """
    visited = [False] * n
    results = []

    for i in range(n):
        if not visited[i]:
            # BFS para explorar el grupo de nodos conectados
            queue = deque([i])
            visited[i] = True
            max_skill = skill[i]

            while queue:
                u = queue.popleft()
                for v in adj[u]:
                    if not visited[v]:
                        visited[v] = True
                        if skill[v] > max_skill:
                            max_skill = skill[v]
                        queue.append(v)

            results.append(max_skill)

    return results


# --- Ejemplo ---
# 6 campamentos, 2 grupos: {0,1,2} y {3,4,5}
adj = {0: [1], 1: [0, 2], 2: [1], 3: [4], 4: [3, 5], 5: [4]}
skill = [3, 7, 2, 10, 1, 5]
print(supreme_camps(6, adj, skill))  # [7, 10]
```

### Complejidad

- BFS visita cada nodo exactamente una vez y cada arista dos veces (una por cada extremo).
- **Temporal:** $O(V + E)$ — óptima, pues se debe inspeccionar al menos todo el grafo.
- **Espacial:** $O(V)$ para el arreglo de visitados y la cola.

> **Relación con el curso:** Este problema aplica directamente BFS (Clase 10-11) para encontrar todos los nodos alcanzables desde un nodo fuente. Iterando sobre todos los nodos y lanzando BFS desde los no visitados, se descubren todos los grupos de nodos conectados. Según CLRS (Sec. 22.2), BFS puede adaptarse para calcular propiedades agregadas (como el máximo) durante el recorrido.

---

## Pregunta — Análisis de Correctitud [16 pts.]

**(Tipo 1: Pregunta 4 | Tipo 2: Pregunta 3)**

### Algoritmo a analizar

```python
def algoritmo(N):
    ans = []
    d = 2
    while N >= 1:       # Corrección indicada: N >= 1
        if N % d == 0:
            ans.append(d)
            N = N // d
        else:
            d += 1
    return ans
```

### ¿Qué calcula?

**El algoritmo calcula la descomposición en factores primos de $N$,** retornando una lista con los factores primos (con repeticiones, en orden no decreciente).

**Ejemplo:** `algoritmo(12)` → `[2, 2, 3]` ya que $12 = 2 \times 2 \times 3$.

### Análisis de correctitud (método visto en clase)

Siguiendo el método de la Clase 4 y 7:

#### 1. Forma del estado

El estado del programa en cada iteración es la tupla $(N, d, \text{ans})$.

#### 2. Estado inicial

$(N_0, 2, [\;])$0: [1], 1: [0, 2], 2: [1 donde $N_0$ es el valor original de entrada.

#### 3. Transformación de estados

En cada iteración:

- **Si $N \% d = 0$:** $\text{ans} \leftarrow \text{ans} + [d]$, $N \leftarrow N // d$, $d$ no cambia.
- **Si $N \% d \neq 0$:** $d \leftarrow d + 1$, $N$ y $\text{ans}$ no cambian.

#### 4. Estado final

Cuando $N = 0$ (con la guarda $N \geq 1$, el ciclo termina cuando $N$ deja de ser $\geq 1$).

#### 5. Invariante de ciclo

Al inicio de cada iteración del `while`, se cumple:

$$\boxed{(\text{INV}): \quad N \cdot \prod_{p \in \text{ans}} p = N_0 \;\;\land\;\; d \geq 2 \;\;\land\;\; N \text{ no tiene factores primos menores que } d}$$

#### 6. Demostración

**Teorema 1.** *La invariante se preserva en cada iteración del ciclo.*

**Demostración.**

*Inicialización:* Antes del ciclo: $\text{ans} = [\;]$, $d = 2$, $N = N_0$.

- $N_0 \cdot 1 = N_0$ ✓ (producto vacío es 1).
- $d = 2 \geq 2$ ✓.
- $N_0$ no tiene factores primos $< 2$ ✓ (el menor primo es 2).

*Mantenimiento:* Asumimos que la invariante se cumple al inicio de una iteración.

*Caso 1: $N \% d = 0$*

- Se agrega $d$ a `ans` y $N \leftarrow N/d$.
- (i) $(N/d) \cdot d \cdot \prod_{p \in \text{ans\_prev}} p = N \cdot \prod_{p \in \text{ans\_prev}} p = N_0$ ✓.
- (ii) $d$ no cambia, sigue $\geq 2$ ✓.
- (iii) $d$ divide a $N$ y $N$ no tiene factores primos $< d$, entonces **$d$ es primo** (si fuera compuesto, tendría un factor primo $< d$ que también dividiría a $N$, contradicción). $N/d$ tampoco tiene factores primos $< d$ ✓.

*Caso 2: $N \% d \neq 0$*

- $d \leftarrow d + 1$; `ans` y $N$ no cambian.
- (i) Sin cambios ✓.
- (ii) $d + 1 > d \geq 2$ ✓.
- (iii) $N$ no tenía factores primos $< d$, y $d$ no divide a $N$. Entonces $N$ no tiene factores primos $< d+1$ ✓.

$\blacksquare$

**Teorema 2.** *Toda invocación de `algoritmo(N)` con $N \geq 1$ produce la factorización prima de $N$.*

**Demostración.**

*Terminación:* Con la guarda `N >= 1`, analicemos la terminación:

- Cuando el último factor primo se extrae, $N$ llega a 1.
- Luego $1 \% d \neq 0$ para todo $d \geq 2$, así que $d$ crece indefinidamente.
- **Problema:** con guarda `N >= 1`, cuando $N = 1$ el ciclo no termina ($d$ crece sin fin).
- **La guarda correcta debería ser `N > 1`** (o `N >= 2`). Con `N > 1`, el ciclo termina cuando $N = 1$.

*Función de cota (variante):* Con la guarda corregida `N > 1`, definimos $\text{bound} = N - 1 + (\sqrt{N_0} - d)$. Decrece en cada iteración: en el Caso 1, $N$ decrece estrictamente (se divide por $d \geq 2$); en el Caso 2, $d$ crece. Como ambas cantidades son enteras y acotadas inferiormente, el ciclo termina.

*Postcondición:* Asumiendo guarda `N > 1`, al salir $N = 1$, y por la invariante (Teorema 1):

$$1 \cdot \prod_{p \in \text{ans}} p = N_0 \implies \prod_{p \in \text{ans}} p = N_0$$

Y todos los elementos en `ans` son primos (por la parte iii de la invariante). Por tanto, `ans` contiene la factorización prima de $N_0$. $\blacksquare$

> **Relación con el curso:** Este análisis sigue exactamente el método de verificación con invariantes de ciclo (Clases 3, 4 y 7): identificar estado, estado inicial, transformación, estado final, invariante y demostración formal mediante dos teoremas (preservación de invariante y correctitud del resultado). Según CLRS (Sec. 2.1), las invariantes de ciclo se usan análogamente para demostrar la correctitud de Insertion Sort.

---

## Pregunta — Complejidad Asintótica [10 pts.]

Hay dos versiones según el tipo de examen:

### Tipo 1 (Pregunta 5): Demostrar o refutar $6n^2 + 19n \in O(4n^2 \log n)$

**Teorema.** $6n^2 + 19n \in O(4n^2 \log n)$.

**Demostración.** Debemos encontrar $c > 0$ y $n_0 \geq 1$ tales que:

$$6n^2 + 19n \leq c \cdot 4n^2 \log n \quad \forall\, n \geq n_0$$

Para $n \geq 2$, $\log_2 n \geq 1$ y $19n \leq 19n^2$, por lo que:

$$6n^2 + 19n \leq 25n^2$$

Necesitamos $25n^2 \leq 4c \cdot n^2 \log n$, es decir $25 \leq 4c \log n$.

Con $c = 7$ y $n_0 = 2$: $4 \cdot 7 \cdot \log_2 2 = 28 \geq 25$ ✓.

Como $\log n$ es creciente, para todo $n \geq 2$:

$$6n^2 + 19n \leq 25n^2 \leq 28n^2 \leq 4 \cdot 7 \cdot n^2 \log n$$

Por definición, $6n^2 + 19n \in O(4n^2 \log n)$. $\blacksquare$

### Tipo 2 (Pregunta 4): Demostrar o refutar $7n^2 + 6n \in O(5n^2 \log n)$

**Teorema.** $7n^2 + 6n \in O(5n^2 \log n)$.

**Demostración.** Debemos encontrar $c > 0$ y $n_0 \geq 1$ tales que:

$$7n^2 + 6n \leq c \cdot 5n^2 \log n \quad \forall\, n \geq n_0$$

Para $n \geq 1$, $6n \leq 6n^2$, por lo que:

$$7n^2 + 6n \leq 13n^2$$

Necesitamos $13n^2 \leq 5c \cdot n^2 \log n$, es decir $13 \leq 5c \log n$.

Con $c = 3$ y $n_0 = 2$: $5 \cdot 3 \cdot \log_2 2 = 15 \geq 13$ ✓.

Como $\log n$ es creciente, para todo $n \geq 2$:

$$7n^2 + 6n \leq 13n^2 \leq 15n^2 \leq 5 \cdot 3 \cdot n^2 \log n$$

Por definición, $7n^2 + 6n \in O(5n^2 \log n)$. $\blacksquare$

> **Relación con el curso:** Ambas demostraciones usan la definición formal de $O$ vista en Clase 2 y 3: encontrar $c$ y $n_0$ tales que $f(n) \leq c \cdot g(n)$ para todo $n \geq n_0$. La intuición es que $n^2$ crece más lento que $n^2 \log n$, como se discutió en la jerarquía de funciones de CLRS (Cap. 3).

---

## Pregunta — Bonus [10 pts.]

Hay dos versiones según el tipo de examen:

### Tipo 1 (Pregunta 6): Demostrar $f_1 \in O(f) \land g_1 \in O(g) \Rightarrow f_1 \cdot g_1 \in O(f \cdot g)$

**Teorema.** *Si $f_1 \in O(f)$ y $g_1 \in O(g)$, entonces $f_1 \cdot g_1 \in O(f \cdot g)$.*

**Demostración.**

*Hipótesis:*

- $f_1 \in O(f)$: existen $c_1 > 0$, $n_1 \geq 1$ tales que $|f_1(n)| \leq c_1 |f(n)|$ para todo $n \geq n_1$.
- $g_1 \in O(g)$: existen $c_2 > 0$, $n_2 \geq 1$ tales que $|g_1(n)| \leq c_2 |g(n)|$ para todo $n \geq n_2$.

*Tesis:* Existen $c > 0$, $n_0 \geq 1$ tales que $|f_1(n) \cdot g_1(n)| \leq c \cdot |f(n) \cdot g(n)|$ para todo $n \geq n_0$.

*Prueba:*

Sea $n_0 = \max(n_1, n_2)$. Para todo $n \geq n_0$:

$$|f_1(n) \cdot g_1(n)| = |f_1(n)| \cdot |g_1(n)| \leq c_1 |f(n)| \cdot c_2 |g(n)| = (c_1 c_2) \cdot |f(n) \cdot g(n)|$$

Tomando $c = c_1 \cdot c_2 > 0$ y $n_0 = \max(n_1, n_2)$:

$$|f_1(n) \cdot g_1(n)| \leq c \cdot |f(n) \cdot g(n)| \quad \forall\, n \geq n_0$$

Por definición, $f_1 \cdot g_1 \in O(f \cdot g)$. $\blacksquare$

### Tipo 2 (Pregunta 5): Demostrar $h \in O(g) \land g \in O(f) \Rightarrow h \in O(f)$ (Transitividad)

**Teorema.** *Si $h \in O(g)$ y $g \in O(f)$, entonces $h \in O(f)$.*

**Demostración.**

*Hipótesis:*

- $h \in O(g)$: existen $c_1 > 0$, $n_1 \geq 1$ tales que $|h(n)| \leq c_1 |g(n)|$ para todo $n \geq n_1$.
- $g \in O(f)$: existen $c_2 > 0$, $n_2 \geq 1$ tales que $|g(n)| \leq c_2 |f(n)|$ para todo $n \geq n_2$.

*Tesis:* Existen $c > 0$, $n_0 \geq 1$ tales que $|h(n)| \leq c \cdot |f(n)|$ para todo $n \geq n_0$.

*Prueba:*

Sea $n_0 = \max(n_1, n_2)$. Para todo $n \geq n_0$:

$$|h(n)| \leq c_1 |g(n)| \leq c_1 \cdot c_2 |f(n)|$$

La primera desigualdad vale porque $n \geq n_1$; la segunda porque $n \geq n_2$.

Tomando $c = c_1 \cdot c_2 > 0$ y $n_0 = \max(n_1, n_2)$:

$$|h(n)| \leq c \cdot |f(n)| \quad \forall\, n \geq n_0$$

Por definición, $h \in O(f)$. $\blacksquare$

> **Relación con el curso:** Ambas propiedades son propiedades algebraicas de la notación $O$, vistas en Clase 2. La propiedad del producto y la transitividad se usan frecuentemente para simplificar análisis de complejidad. En CLRS (Cap. 3, Ejercicio 3.1-5), se establece que $O$ es transitiva, y la propiedad del producto se deduce directamente de la definición.

---

## Resumen de temas del curso aplicados

| Pregunta | Tema del curso | Clase(s) | Referencia CLRS |
|----------|---------------|----------|-----------------|
| Búsqueda binaria/bisección | Algoritmo de la bisección + Divide y Vencerás | C7, C8 | Cap. 4.1, binary search on answer |
| Autómatas (representación) | Representaciones de grafos (listas de adyacencia) | C10 | Sec. 22.1 |
| Autómatas (aceptar cadena) | Recorrido dirigido en grafos | C10, C11 | Sec. 22.3 |
| Campamento Supremo | BFS + grupos de nodos conectados | C10, C11 | Sec. 22.2 |
| Correctitud del algoritmo | Invariantes de ciclo (Teorema 1 y 2) | C3, C4, C7 | Sec. 2.1 |
| Notación asintótica | Definición formal de $O$ (Teorema) | C2, C3 | Cap. 3 |
| Bonus (propiedades de $O$) | Propiedades algebraicas de la notación asintótica (Teorema) | C2 | Cap. 3, Ej. 3.1-5 |
