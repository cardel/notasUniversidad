Tabla de Contenido

# Caminos y Distancia


---

Tabla de Contenido


---

Definiciones: Paseo, Camino, Ciclo


> 📋 **Definición --- Paseo (*Walk*) Un **paseo** en $G = (V, E)$ es una secuencia $\langle v_0, v_1, \ldots, v_k \rangle$ donde $\{v_{i-1}, v_i\} \in E$ para todo $1 \le i \le k$. Se permite repetir vértices y aristas.**


> 📋 **Definición --- Camino (*Path*) Un **camino** es un paseo donde **no se repite ningún vértice**. Su **longitud** es el número de aristas: $k$.**


> 📋 **Definición --- Ciclo (*Cycle*) Un **ciclo** es un camino $\langle v_0, v_1, \ldots, v_k \rangle$ con $k \ge 3$ donde $v_0 = v_k$ y los vértices intermedios son todos distintos.**


> 📌 **Ejemplo práctico**
>
> Grafo con $V = \{a, b, c, d, e\}$ y aristas $\{a,b\}, \{b,c\}, \{c,d\}, \{b,d\}, \{d,e\}$:
>
> ```mermaid
> flowchart TD
> a["a"]
> b["b"]
> c["c"]
> d["d"]
> e["e"]
> a --> b
> b --> c
> c --> d
> b --> d
> d --> e
> ```
>
> -   **Paseo:** $\langle a, b, c, d, b, d, e \rangle$ --- repite $b$ y $d$.
>
> -   **Camino:** $\langle a, b, d, e \rangle$ --- longitud 3.
>
> -   **Ciclo:** $\langle b, c, d, b \rangle$ --- longitud 3.


---

Distancia entre Vértices


> 📋 **Definición --- Distancia $\delta(u, v)$ (Cormen, Cap. 22) $$\delta(u, v) =**
> \begin{cases}
> \min\{k : \text{existe camino de } u \text{ a } v \text{ de longitud } k\} & \text{si existe camino,}\\
> \infty & \text{en otro caso.}
> \end{cases}$$


> 📋 **Propiedades de la distancia (métrica en grafos no dirigidos)**
>
> 1.  $\delta(u, v) \ge 0$ y $\delta(u, v) = 0 \iff u = v$.
>
> 2.  $\delta(u, v) = \delta(v, u)$ (**simetrı́a**).
>
> 3.  $\delta(u, v) \le \delta(u, w) + \delta(w, v)$ (**desigualdad triangular**).


> 📌 **Ejemplo práctico --- distancias en el grafo anterior**
>
> ```mermaid
> flowchart TD
> a["a"]
> b["b"]
> c["c"]
> d["d"]
> e["e"]
> a --> b
> b --> c
> c --> d
> b --> d
> d --> e
> ```
>
> -------------------- -- -------------------------------------
> $\delta(a, b) = 1$      camino $\langle a, b \rangle$
> $\delta(a, d) = 2$      camino $\langle a, b, d \rangle$
> $\delta(a, e) = 3$      camino $\langle a, b, d, e \rangle$
> $\delta(c, e) = 2$      camino $\langle c, d, e \rangle$
> -------------------- -- -------------------------------------
>
> Desigualdad triangular: $\delta(a, e) = 3 \le \delta(a, c) + \delta(c, e) = 2 + 2 = 4$.


---

Lema del Subcamino (Cormen, Lema 24.1)


> 📋 **Lema --- Subestructura óptima de caminos más cortos Sea $p = \langle v_0, v_1, \ldots, v_k \rangle$ un camino más corto de $v_0$ a $v_k$. Para todo $0 \le i \le j \le k$, el subcamino $p_{ij} = \langle v_i, \ldots, v_j \rangle$ es un camino más corto de $v_i$ a $v_j$.**


**Demostración (por contradicción):** Suponga que existe $p'_{ij}$ de $v_i$ a $v_j$ con longitud menor que $p_{ij}$. Reemplazando $p_{ij}$ por $p'_{ij}$ en $p$, obtenemos un camino de $v_0$ a $v_k$ más corto que $p$. Contradicción. $\qed$


> 📌 **Ejemplo práctico**
>
> En el grafo anterior, $p = \langle a, b, d, e \rangle$ es camino más corto de $a$ a $e$ (longitud 3).
>
> El subcamino $p_{1,2} = \langle b, d \rangle$ tiene longitud 1. Efectivamente $\delta(b, d) = 1$ (arista directa).
>
> Si existiera un camino de $b$ a $d$ de longitud 0, podrı́amos acortar $p$, lo cual es imposible.


# Alcanzabilidad y Conexidad


---

Tabla de Contenido


---

Alcanzabilidad como Relación de Equivalencia


> 📋 **Definición --- Alcanzabilidad $v$ es **alcanzable** desde $u$ si existe un camino de $u$ a $v$. Se denota $u \leadsto v$.**


> 📋 **Lema (Cormen, Apéndice B.4) En un grafo no dirigido, "$\leadsto$" es una **relación de equivalencia**:**
>
> 1.  **Reflexiva**: $u \leadsto u$ (camino de longitud 0).
>
> 2.  **Simétrica**: $u \leadsto v \implies v \leadsto u$ (camino inverso).
>
> 3.  **Transitiva**: $u \leadsto v \land v \leadsto w \implies u \leadsto w$ (concatenación).


> ⚠️ **Consecuencia**
>
> La relación $\leadsto$ particiona $V$ en **clases de equivalencia** $=$ **componentes conexas**.


> 📌 **Ejemplo práctico**
>
> ```mermaid
> flowchart TD
> 0["0"]
> 1["1"]
> 2["2"]
> 3["3"]
> 4["4"]
> 0 --> 1
> 1 --> 2
> 2 --> 0
> 3 --> 4
> ```
>
> -   Reflexiva: $0 \leadsto 0$ (camino vacı́o).
>
> -   Simétrica: $0 \leadsto 2$ por $\langle 0, 2 \rangle$, y $2 \leadsto 0$ por $\langle 2, 0 \rangle$.
>
> -   Transitiva: $0 \leadsto 1$ y $1 \leadsto 2$, luego $0 \leadsto 2$.
>
> -   $0 \not\leadsto 3$: no hay camino $\Rightarrow$ componentes distintas.
>
> Clases: $\{0,1,2\}$ y $\{3,4\}$.


---

Grafo Conexo y Condición de Aristas


> 📋 **Definición --- Grafo Conexo $G = (V, E)$ es **conexo** si $\forall\, u, v \in V$: $u \leadsto v$. Equivale a tener una sola componente conexa ($k = 1$).**


> 📋 **Teorema --- Condición necesaria de aristas Si $G$ es conexo con $|V| = n$, entonces $|E| \ge n - 1$.**


**Demostración (inducción sobre $n$):**

*Base* ($n=1$): $0 \ge 0$.

*Paso*: eliminamos un vértice $v$ con sus aristas. $G - v$ tiene $\le c$ componentes, cada $C_i$ con $n_i$ vértices ($\sum n_i = n - 1$). Por H.I., cada $C_i$ tiene $\ge n_i - 1$ aristas. Además $v$ tenı́a $\ge c$ aristas (una por componente, pues $G$ era conexo): $$|E| \ge \sum_{i=1}^{c}(n_i - 1) + c = \sum_{i=1}^{c} n_i = n - 1. \qed$$


> 📌 **Ejemplo práctico**
>
> 0.48
>
> ```mermaid
> flowchart TD
> 1["1"]
> 2["2"]
> 3["3"]
> 4["4"]
> 1 --> 2
> 1 --> 3
> 2 --> 3
> 3 --> 4
> ```
>
> $n = 4$, $|E| = 4 \ge 3$.
>
> Conexo.
>
> 0.48
>
> ```mermaid
> flowchart TD
> 1["1"]
> 2["2"]
> 3["3"]
> 4["4"]
> 1 --> 2
> 3 --> 4
> ```
>
> $n = 4$, $|E| = 2 < 3$.
>
> No conexo.


# Componentes Conexas


---

Tabla de Contenido


---

Definición, Propiedades y Aristas entre Componentes


> 📋 **Definición --- Componente Conexa (Cormen, Sec. 22.1) Las **componentes conexas** de $G = (V, E)$ no dirigido son las clases de equivalencia de $V$ bajo $\leadsto$. Cada componente $C \subseteq V$ induce un subgrafo conexo maximal $G[C]$.**


> 📋 **Propiedades**
>
> Si $C_1, C_2, \ldots, C_k$ son las componentes conexas de $G$:
>
> 1.  $C_i \cap C_j = \emptyset$ para $i \neq j$ (disjuntas).
>
> 2.  $C_1 \cup C_2 \cup \cdots \cup C_k = V$ (cobertura).
>
> 3.  $G[C_i]$ es conexo para todo $i$ (maximalidad).
>
> 4.  $G$ es conexo $\iff$ $k = 1$.


> 📋 **Lema --- No hay aristas entre componentes distintas Si $C_1$ y $C_2$ son componentes distintas, entonces $\nexists\; \{u,v\} \in E$ con $u \in C_1$, $v \in C_2$.**


**Dem.:** Si existiera $\{u,v\} \in E$, entonces $u \leadsto v$. Para todo $w \in C_1$: $w \leadsto u \leadsto v$, y para todo $x \in C_2$: $v \leadsto x$. Por transitividad $w \leadsto x$, luego $C_1$ y $C_2$ serı́an la misma clase. Contradicción. $\qed$


> 📌 **Ejemplo práctico**
>
> ```mermaid
> flowchart TD
> 0["0"]
> 1["1"]
> 2["2"]
> 3["3"]
> 4["4"]
> 5["5"]
> 6["6"]
> 7["7"]
> 0 --> 1
> 1 --> 2
> 2 --> 0
> 3 --> 4
> 5 --> 6
> 6 --> 7
> 7 --> 5
> ```
>
> $C_1 = \{0,1,2\}$, $C_2 = \{3,4\}$, $C_3 = \{5,6,7\}$. $k = 3$.
>
> No existe arista entre $C_1$ y $C_2$ (verificable en la lista de adyacencia).


---

Efecto de Agregar y Eliminar Aristas


> 📋 **Teorema**
>
> Sea $G = (V, E)$ con $k$ componentes conexas.
>
> 1.  Añadir $\{u,v\}$ con $u, v$ en componentes **distintas** $\Rightarrow$ $k$ disminuye a $k-1$.
>
> 2.  Eliminar una arista **puente** $\Rightarrow$ $k$ aumenta a $k+1$.


> ⚠️ **Definición --- Puente (*Bridge*) $e \in E$ es puente si $G - e$ tiene más componentes que $G$.**


> 📌 **Ejemplo práctico**
>
> ```mermaid
> flowchart TD
> a["a"]
> b["b"]
> c["c"]
> d["d"]
> a --> b
> b --> c
> c --> d
> ```
>
> La arista $\{b, c\}$ (en rojo) es un **puente**: al eliminarla, $\{a,b\}$ y $\{c,d\}$ quedan desconectados ($k: 1 \to 2$).
>
> La arista $\{a, b\}$ **no** es puente si añadimos $\{a, c\}$:
>
> ```mermaid
> flowchart TD
> a["a"]
> b["b"]
> c["c"]
> d["d"]
> a --> b
> b --> c
> c --> d
> a --> c
> ```
>
> Eliminar $\{a,b\}$: $a$ sigue conectado vı́a $\langle a, c, b \rangle$. Sigue conexo.


# Algoritmo: Componentes Conexas con BFS/DFS


---

Tabla de Contenido


---

Teorema de Correctitud de BFS


> 📋 **Teorema (Cormen, Teorema 22.5 adaptado) Sea $G = (V, E)$ no dirigido y $s \in V$. Tras ejecutar $\text{BFS}(G, s)$, un vértice $v$ es visitado $\iff$ $v$ es alcanzable desde $s$.**


**Dem. (esbozo):**

$(\Rightarrow)$ Si $v$ fue visitado, fue descubierto por una cadena de aristas desde $s$: existe camino $s \leadsto v$.

$(\Leftarrow)$ Suponga $v$ alcanzable pero no visitado. Sea $\langle s = u_0, \ldots, u_k = v \rangle$ camino más corto y $u_j$ el primer no visitado. Como $u_{j-1}$ fue visitado, BFS examinó todos sus vecinos, incluyendo $u_j$. Contradicción. $\qed$


> 📌 **Ejemplo práctico**
>
> ```mermaid
> flowchart TD
> 0["0"]
> 1["1"]
> 2["2"]
> 3["3"]
> 4["4"]
> 0 --> 1
> 0 --> 2
> 1 --> 3
> 2 --> 3
> ```
>
> BFS desde $s = 0$: visita $\{0, 1, 2, 3\}$ (azul). El vértice $4$ **no** es visitado porque $4 \not\leadsto 0$.
>
> Esto confirma: BFS visita **exactamente** la componente conexa de $s$.


---

Pseudocódigo, Complejidad e Invariante


> 📋 **Algoritmo [Connected-Components]{.smallcaps}$(G)$ **Entrada**: $G = (V, E)$ no dirigido. **Salida**: $cc[v]$ para cada $v$.**


**Pseudocódigo:**

1.  Para cada $v \in V$: $cc[v] \gets -1$

2.  $\text{etiqueta} \gets 0$

3.  Para cada $v \in V$:

    1.  Si $cc[v] = -1$:

        1.  Ejecutar BFS o DFS desde $v$

        2.  Asignar $cc[u] \gets \text{etiqueta}$ a cada $u$ visitado

        3.  $\text{etiqueta} \gets \text{etiqueta} + 1$


> 📋 **Complejidad: $\Theta(V + E)$ Cada vértice se visita una vez: $O(V)$. Cada arista se examina dos veces: $O(E)$.**


> 📋 **Invariante de ciclo**
>
> Al inicio de cada iteración, todo vértice $u$ con $cc[u] \neq -1$ tiene su componente correctamente identificada, y todos los alcanzables desde fuentes ya procesadas están etiquetados.


**Inicialización:** $cc[v] = -1$ para todo $v$. Se cumple vacuamente.

**Mantenimiento:** si $cc[v] = -1$, BFS/DFS desde $v$ visita toda su componente (por Teorema 22.5) y la etiqueta correctamente.

**Terminación:** todo $v \in V$ queda con $cc[v] \neq -1$.

**Función de cota:** $f = |\{v : cc[v] = -1\}|$ decrece estrictamente, acotada por $0$. $\qed$

# Implementación en Python


---

Tabla de Contenido


---

Componentes Conexas con BFS --- Python

``` {.python fontsize="\\scriptsize" bgcolor="grisclaro" linenos=""}
from collections import deque

def bfs_componente(adj, fuente, cc, etiqueta):
    cola = deque()
    cola.append(fuente)
    cc[fuente] = etiqueta
    while len(cola) > 0:
        nodo = cola.popleft()
        i = 0
        while i < len(adj[nodo]):
            vecino = adj[nodo][i]
            if cc[vecino] == -1:
                cc[vecino] = etiqueta
                cola.append(vecino)
            i = i + 1

def componentes_conexas(n, adj):
    cc = [-1] * n
    etiqueta = 0
    v = 0
    while v < n:
        if cc[v] == -1:
            bfs_componente(adj, v, cc, etiqueta)
            etiqueta = etiqueta + 1
        v = v + 1
    return cc, etiqueta
```

``` {.python fontsize="\\scriptsize" bgcolor="grisclaro" linenos=""}
# Ejemplo de uso
n = 8
adj = [[] for _ in range(n)]
aristas = [(0,1),(1,2),(2,0),(3,4),(5,6),(6,7),(7,5)]
k = 0
while k < len(aristas):
    u, v = aristas[k]
    adj[u].append(v)
    adj[v].append(u)
    k = k + 1

cc, num = componentes_conexas(n, adj)
print("Etiquetas:", cc)       # [0, 0, 0, 1, 1, 2, 2, 2]
print("Componentes:", num)    # 3
```


---

Componentes Conexas con DFS Iterativo --- Python

``` {.python fontsize="\\scriptsize" bgcolor="grisclaro" linenos=""}
def dfs_componente(adj, fuente, cc, etiqueta):
    pila = []
    pila.append(fuente)
    cc[fuente] = etiqueta
    while len(pila) > 0:
        nodo = pila.pop()
        i = 0
        while i < len(adj[nodo]):
            vecino = adj[nodo][i]
            if cc[vecino] == -1:
                cc[vecino] = etiqueta
                pila.append(vecino)
            i = i + 1
```


> ⚠️ **Observación**
>
> La única diferencia con BFS es `pila.pop()` (LIFO) en lugar de `cola.popleft()` (FIFO). El resultado (la partición en componentes) es idéntico.


# Implementación en C++


---

Tabla de Contenido


---

Componentes Conexas con BFS --- C++

``` {.cpp fontsize="\\scriptsize" bgcolor="grisclaro" linenos=""}
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs_componente(vector<vector<int>>& adj,
                    int fuente, vector<int>& cc, int etiqueta) {
    queue<int> cola;
    cola.push(fuente);
    cc[fuente] = etiqueta;
    while (!cola.empty()) {
        int nodo = cola.front();
        cola.pop();
        int i = 0;
        while (i < (int)adj[nodo].size()) {
            int vecino = adj[nodo][i];
            if (cc[vecino] == -1) {
                cc[vecino] = etiqueta;
                cola.push(vecino);
            }
            i = i + 1;
        }
    }
}
```

``` {.cpp fontsize="\\scriptsize" bgcolor="grisclaro" linenos=""}
int componentes_conexas(int n, vector<vector<int>>& adj,
                        vector<int>& cc) {
    int etiqueta = 0;
    int v = 0;
    while (v < n) {
        if (cc[v] == -1) {
            bfs_componente(adj, v, cc, etiqueta);
            etiqueta = etiqueta + 1;
        }
        v = v + 1;
    }
    return etiqueta;
}

int main() {
    int n = 8;
    vector<vector<int>> adj(n);
    int aristas[][2] = {{0,1},{1,2},{2,0},{3,4},
                        {5,6},{6,7},{7,5}};
    int m = 7, k = 0;
    while (k < m) {
        adj[aristas[k][0]].push_back(aristas[k][1]);
        adj[aristas[k][1]].push_back(aristas[k][0]);
        k = k + 1;
    }
    vector<int> cc(n, -1);
    int num = componentes_conexas(n, adj, cc);
    cout << "Componentes: " << num << endl;  // 3
}
```

# Traza Detallada


---

Tabla de Contenido


---

Traza Paso a Paso


> 📌 **Grafo de entrada ($n=8$) Aristas: $(0,1), (1,2), (2,0), (3,4), (5,6), (6,7), (7,5)$.**
>
> ```mermaid
> flowchart TD
> 0["0"]
> 1["1"]
> 2["2"]
> 3["3"]
> 4["4"]
> 5["5"]
> 6["6"]
> 7["7"]
> 0 --> 1
> 1 --> 2
> 2 --> 0
> 3 --> 4
> 5 --> 6
> 6 --> 7
> 7 --> 5
> ```


**BFS desde $v=0$** (etiqueta 0):

   **Paso**   **Cola**  **Acción**
  ---------- ---------- --------------------------------------
      0        $[0]$    Encolar 0, $cc[0] \gets 0$
      1       $[1,2]$   Desencolar 0, encolar 1 y 2
      2        $[2]$    Desencolar 1, vecinos ya etiquetados
      3         $[]$    Desencolar 2, vecinos ya etiquetados

$cc = [0, 0, 0, -1, -1, -1, -1, -1]$

**BFS desde $v=3$** (etiqueta 1):

   **Paso**   **Cola**  **Acción**
  ---------- ---------- ----------------------------------
      0        $[3]$    Encolar 3, $cc[3] \gets 1$
      1        $[4]$    Desencolar 3, encolar 4
      2         $[]$    Desencolar 4, sin vecinos nuevos

$cc = [0, 0, 0, 1, 1, -1, -1, -1]$

**BFS desde $v=5$** (etiqueta 2):

   **Paso**   **Cola**  **Acción**
  ---------- ---------- --------------------------------------
      0        $[5]$    Encolar 5, $cc[5] \gets 2$
      1       $[6,7]$   Desencolar 5, encolar 6 y 7
      2        $[7]$    Desencolar 6, vecinos ya etiquetados
      3         $[]$    Desencolar 7, vecinos ya etiquetados

$cc = [0, 0, 0, 1, 1, 2, 2, 2]$. **3 componentes.**

# Aplicación: Conteo de Islas


---

Tabla de Contenido


---

Islas como Componentes Conexas


> 📋 **Problema**
>
> Dada una grilla binaria $m \times n$ (`1` $=$ tierra, `0` $=$ agua), contar las **islas** (grupos de `1` conectados en 4-conectividad).


> ⚠️ **Modelado**
>
> Cada celda `1` es un vértice. Celdas adyacentes ambas con `1` comparten arista. Las islas $=$ componentes conexas del grafo implı́cito.


> 📌 **Ejemplo $$\begin{bmatrix}**
> 1 & 1 & 0 & 0 & 0 \\
> 1 & 1 & 0 & 0 & 0 \\
> 0 & 0 & 1 & 0 & 0 \\
> 0 & 0 & 0 & 1 & 1
> \end{bmatrix}
> \quad \Rightarrow \quad 3 \text{ islas.}$$


``` {.python fontsize="\\scriptsize" bgcolor="grisclaro" linenos=""}
from collections import deque

def contar_islas(grilla):
    filas = len(grilla)
    cols = len(grilla[0])
    visitado = [[False] * cols for _ in range(filas)]
    islas = 0
    dx = [-1, 1, 0, 0]
    dy = [0, 0, -1, 1]
    r = 0
    while r < filas:
        c = 0
        while c < cols:
            if grilla[r][c] == 1 and not visitado[r][c]:
                cola = deque()
                cola.append((r, c))
                visitado[r][c] = True
                while len(cola) > 0:
                    x, y = cola.popleft()
                    d = 0
                    while d < 4:
                        nx, ny = x + dx[d], y + dy[d]
                        if (0 <= nx and nx < filas and
                            0 <= ny and ny < cols and
                            grilla[nx][ny] == 1 and
                            not visitado[nx][ny]):
                            visitado[nx][ny] = True
                            cola.append((nx, ny))
                        d = d + 1
                islas = islas + 1
            c = c + 1
        r = r + 1
    return islas
```


> 📋 **Complejidad**
>
> -   **Temporal**: $\Theta(m \cdot n)$ --- cada celda se visita una vez.
>
> -   **Espacial**: $\Theta(m \cdot n)$ --- matriz de visitados.


# Conjuntos Disjuntos (Union-Find)


---

Tabla de Contenido


---

Union-Find para Componentes Conexas (Cormen, Cap. 21)


> 📋 **Operaciones fundamentales**
>
> 1.  [Make-Set]{.smallcaps}$(x)$: crear conjunto $\{x\}$.
>
> 2.  [Find-Set]{.smallcaps}$(x)$: representante del conjunto de $x$.
>
> 3.  [Union]{.smallcaps}$(x, y)$: fusionar conjuntos de $x$ e $y$.


> 📋 **Algoritmo (Cormen, Sec. 21.1)**
>
> 4.  Para cada $v \in V$: [Make-Set]{.smallcaps}$(v)$.
>
> 5.  Para cada $\{u,v\} \in E$: si [Find-Set]{.smallcaps}$(u) \neq$ [Find-Set]{.smallcaps}$(v)$, hacer [Union]{.smallcaps}$(u,v)$.
>
> 6.  $u$ y $v$ misma componente $\iff$ [Find-Set]{.smallcaps}$(u) =$ [Find-Set]{.smallcaps}$(v)$.


> 📋 **Teorema de complejidad (Cormen, Teorema 21.14) Con **unión por rango** y **compresión de caminos**, $m$ operaciones sobre $n$ elementos se ejecutan en $O(m \cdot \alpha(n))$, donde $\alpha$ es la inversa de Ackermann ($\alpha(n) \le 4$ para todo $n$ práctico).**


``` {.python fontsize="\\scriptsize" bgcolor="grisclaro" linenos=""}
class UnionFind:
    def __init__(self, n):
        self.padre = list(range(n))
        self.rango = [0] * n
        self.num_conjuntos = n

    def find(self, x):
        raiz = x
        while self.padre[raiz] != raiz:
            raiz = self.padre[raiz]
        while self.padre[x] != raiz:
            siguiente = self.padre[x]
            self.padre[x] = raiz
            x = siguiente
        return raiz

    def union(self, x, y):
        rx = self.find(x)
        ry = self.find(y)
        if rx != ry:
            if self.rango[rx] < self.rango[ry]:
                self.padre[rx] = ry
            elif self.rango[rx] > self.rango[ry]:
                self.padre[ry] = rx
            else:
                self.padre[ry] = rx
                self.rango[rx] = self.rango[rx] + 1
            self.num_conjuntos = self.num_conjuntos - 1
```


> 📌 **Ejemplo práctico --- traza con 5 vértices Aristas procesadas en orden: $\{0,1\}, \{1,2\}, \{3,4\}$.**
>
> **Arista**  **Estado de los conjuntos**        **$k$**
> ------------ --------------------------------- ---------
> ---      $\{0\},\{1\},\{2\},\{3\},\{4\}$       5
> $\{0,1\}$   $\{0,1\},\{2\},\{3\},\{4\}$           4
> $\{1,2\}$   $\{0,1,2\},\{3\},\{4\}$               3
> $\{3,4\}$   $\{0,1,2\},\{3,4\}$                   2
>
> [Find-Set]{.smallcaps}$(0) =$ [Find-Set]{.smallcaps}$(2)$? Sı́ $\Rightarrow$ misma componente.
>
> [Find-Set]{.smallcaps}$(0) =$ [Find-Set]{.smallcaps}$(3)$? No $\Rightarrow$ componentes distintas.


> 📋 **Comparación**
>
> BFS/DFS vs Union-Find
>
> **Criterio**                **BFS/DFS**         **Union-Find**
> ----------------------- -------------------- ---------------------
> Complejidad                $\Theta(V+E)$      $O((V+E)\alpha(V))$
> Aristas dinámicas                No                   Sı́
> Consulta conectividad    Requiere recorrido     $O(\alpha(n))$


# Resumen y Conexiones


---

Tabla de Contenido


---

Resumen de la Sesión


> 📋 **Conceptos esenciales**
>
> 1.  **Camino, ciclo, distancia**: definiciones formales y propiedades métricas.
>
> 2.  **Lema del subcamino**: subestructura óptima (Cormen, Lema 24.1).
>
> 3.  **Alcanzabilidad**: relación de equivalencia $\leadsto$ en grafos no dirigidos.
>
> 4.  **Componentes conexas**: partición de $V$, sin aristas entre componentes.
>
> 5.  **Algoritmo BFS/DFS**: $\Theta(V+E)$, correctitud por invariante de ciclo.
>
> 6.  **Union-Find**: $O(m \cdot \alpha(n))$, ideal para aristas dinámicas.
>
> 7.  **Aplicaciones**: islas en grillas, redes sociales, verificación de conectividad.


---

Qué Sigue: Semana 17


> 📋 **Componentes**
>
> Fuertemente Conexas (grafos dirigidos) En digrafos, $u \leadsto v$ **no implica** $v \leadsto u$. Se requiere alcanzabilidad mutua.


> 📋 **Algoritmos**
>
> 1.  **Kosaraju**: dos pasadas de DFS, $\Theta(V+E)$.
>
> 2.  **Tarjan**: una pasada de DFS con *low-link*, $\Theta(V+E)$.


> ⚠️ **Lectura recomendada**
>
> Cormen et al., Cap. 22 (Secciones 22.1--22.3, 22.5) y Cap. 21 (Conjuntos disjuntos).


---

**?'Preguntas?**

Árboles y Grafos --- 2026-I

Carlos A Delgado S --- Pontificia Universidad Javeriana Cali
