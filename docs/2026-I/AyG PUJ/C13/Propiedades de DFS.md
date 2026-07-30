# Idea

DFS (Depth-First Search) puede manejarse tomando en cuenta lo siguiente:

*   **$d[v]$**: Tiempo de descubrimiento cuando DFS visita $v$ por primera vez. El nodo se marca como **GRIS**.
*   **$f[v]$**: Tiempo de finalización cuando DFS termina de explorar todos los descendientes de $v$. El nodo se marca como **NEGRO**.

Los tiempos son enteros de 1 a $2|V|$.

**Estados (colores) de un vértice:**
1.  **BLANCO**: Cuando no ha sido descubierto.
2.  **GRIS**: En proceso (está en la pila de recursión).
3.  **NEGRO**: Completamente procesado (todos sus adyacentes han sido explorados).

Un vértice está en estado GRIS durante todo su intervalo $[d[v], f[v]]$. Si al explorar una arista $(u, v)$ encontramos que $v$ está en GRIS, entonces $v$ es ancestro de $u$ en el árbol DFS (esto indica un **ciclo** en grafos dirigidos).

# Teorema del paréntesis

**Teorema 22.7 de Cormen**

Para cualquier par de vértices $(u, v)$ en un recorrido DFS, se va a cumplir exactamente una de las siguientes condiciones:

1.  Los intervalos $(d[u], f[u])$ y $(d[v], f[v])$ son **disjuntos**. Esto significa que ninguno es descendiente del otro en el bosque DFS.
2.  $(d[u], f[u]) \subseteq (d[v], f[v])$. Esto significa que $u$ es descendiente de $v$ en el bosque DFS.
3.  $(d[v], f[v]) \subseteq (d[u], f[u])$. Esto significa que $v$ es descendiente de $u$ en el bosque DFS.

**Ejemplo:**
*   $u$ fue descubierto en el momento 8 y finalizó en el momento 13. Rango: $(8, 13)$.
*   $v$ fue descubierto en el instante 4 y finalizó en el instante 16. Rango: $(4, 16)$.

¿Qué se cumple?
$(8, 13) \subset (4, 16)$ → $u$ es descendiente de $v$.

# Teorema del paréntesis (Explicación alternativa)

Cuando ejecutamos DFS, obtenemos un **anidamiento de paréntesis** de acuerdo a cómo fue descubierto un nodo y cómo se accede a sus descendientes.

Por ejemplo: `(u (v (x (y (z)))) a)`
Esto indica que los descendientes de `v` son `x, y, z`, y los descendientes de `u` son `v, x, y, z, a`.

**Análisis de casos:**
Supongamos $d[u] < d[v]$ (u fue descubierto antes que v).

*   **Subcaso 1:** $d[v] < f[u]$
    Se descubre $v$ antes de finalizar $u$. Esto implica que $v$ es descendiente de $u$.
*   **Subcaso 2:** $f[u] < d[v]$
    Se finaliza $u$ antes de descubrir $v$. Los intervalos son disjuntos, por lo que no hay relación de descendencia.

**Observación crucial:** No puede pasar que los rangos estén "cruzados". Por ejemplo:
*   $(10, 20)$ para $u$
*   $(15, 30)$ para $v$
Esto no es posible. Si $d[v] < f[u]$ (v se descubrió antes de que u finalizara), entonces v es descendiente de u, y por lo tanto $f[v] < f[u]$ debe cumplirse. La situación planteada es una contradicción.

---

## Tabla de Resumen de Conceptos

Concepto | Descripción | Teorema/Propiedad Relacionado
--- | --- | ---
Tiempo de descubrimiento ($d[v]$) | Instante en el que el vértice $v$ es visitado por primera vez y se marca como GRIS. | Entero entre 1 y $2\lvert V \rvert$.
Tiempo de finalización ($f[v]$) | Instante en el que se termina de explorar recursivamente todos los vértices alcanzables desde $v$ y se marca como NEGRO. | Entero entre 1 y $2\lvert V \rvert$. Siempre $d[v] < f[v]$.
Estados (Colores) | BLANCO (no visitado), GRIS (en proceso/ en la pila), NEGRO (procesado). | Un nodo es GRIS durante el intervalo $[d[v], f[v]]$. Encontrar una arista a un nodo GRIS indica un ciclo en grafos dirigidos.
Teorema del Paréntesis | Describe la relación de anidamiento de los intervalos $[d[v], f[v]]$ para cualquier par de vértices. | **Teorema 22.7 (Cormen):** Para dos vértices $u$ y $v$, sus intervalos son disjuntos o uno está contenido en el otro, definiendo la relación de descendencia en el bosque DFS.
Descendencia en el bosque DFS | $u$ es descendiente de $v$ **si y solo si** $d[v] < d[u] < f[u] < f[v]$. | Corolario directo del Teorema del Paréntesis.

## Comentarios Adicionales

*   **Complejidad:** Al igual que BFS, la complejidad temporal de DFS es $O(V + E)$ para un grafo representado con lista de adyacencia.
*   **Estructuras resultantes:** DFS produce un **bosque DFS** (conjunto de árboles), no un solo árbol, especialmente si el grafo no es conexo. También clasifica las aristas del grafo en:
    *   **Arbol (Tree):** Aristas que pertenecen al bosque DFS.
    *   **Retroceso (Back):** Aristas que van de un nodo a un ancestro en el árbol DFS (indicadoras de ciclo en dirigidos).
    *   **Avance (Forward):** Aristas que van de un nodo a un descendiente no directo.
    *   **Cruzada (Cross):** Aristas entre nodos sin relación de ancestro-descendiente, o entre diferentes árboles del bosque.
*   **Aplicaciones clave:** DFS es fundamental para:
    *   Detectar ciclos en grafos dirigidos.
    *   Ordenamiento topológico de un DAG (Grafo Acíclico Dirigido).
    *   Encontrar componentes fuertemente conexas (con el algoritmo de Kosaraju o Tarjan).
    *   Resolver problemas que requieren exploración exhaustiva o backtracking.
*   **DFS vs. BFS:** DFS usa una pila (implícita en la recursión o explícita), explorando a profundidad una rama antes de retroceder. Es ideal para detectar ciclos y relaciones de dependencia. BFS, que usa una cola, es mejor para encontrar caminos más cortos en grafos no ponderados.