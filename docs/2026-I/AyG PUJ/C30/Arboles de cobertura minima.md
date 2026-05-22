# Árboles de cobertura mínima

## Idea

Dado un grafo ponderado $G$, se desea encontrar un árbol $T$, denominado **MST** (Minimum Spanning Tree o árbol de cobertura mínima), tal que la sumatoria de los pesos de sus aristas sea mínima. Un MST conecta todos los vértices del grafo sin formar ciclos y con el costo total más bajo posible.

## Propiedad de corte (Cut Property)

1. Un **corte** $(S, V \setminus S)$ es una partición del conjunto de vértices $V$ en dos subconjuntos **no vacíos** $S$ y $V \setminus S$.
2. Una **arista** $(u, v)$ **cruza el corte** si $u \in S$ y $v \in V \setminus S$ (o viceversa).
3. El **corte respeta** a un conjunto de aristas $A$ si **ninguna arista de $A$ cruza el corte**.
4. Una **arista ligera** del corte es aquella de **peso mínimo** entre todas las aristas que cruzan el corte.

Si $A$ es un subconjunto de aristas que pertenece a algún MST (es decir, aristas ya seleccionadas de forma segura) y $e$ es una arista ligera que cruza un corte que respeta a $A$, entonces $e$ es **segura** para añadir a $A$, lo que significa que existe un MST que contiene a $A \cup \{e\}$.

**Justificación**:
- $e$ es la arista de menor peso entre las que cruzan el corte, por lo que no conviene reemplazarla por otra más pesada.
- $e$ no genera un ciclo con $A$ porque, al respetar el corte, $A$ no tiene aristas que conecten $S$ con $V \setminus S$; $e$ es la primera en hacerlo, por lo que la conectividad aumenta sin crear ciclos.

Esta propiedad es fundamental para demostrar la corrección de los algoritmos de MST.

## Aplicación de la propiedad de corte

1. **Algoritmo de Kruskal**: En cada paso, el corte se define como la separación entre la componente conectada que contiene un extremo de la arista más ligera considerada y el resto del grafo. La arista más ligera que une dos componentes diferentes es una arista ligera del corte y, por tanto, segura.
2. **Algoritmo de Prim**: El corte es siempre $(V_T, V \setminus V_T)$, donde $V_T$ es el conjunto de vértices ya incluidos en el árbol en construcción. La arista de peso mínimo que conecta un vértice en $V_T$ con uno fuera de $V_T$ es la arista ligera del corte, y es segura.

## Ejemplos concretos de la propiedad de corte

### Ejemplo 1: Corte simple con 4 vértices

Considera un grafo con vértices $A, B, C, D$ y las siguientes aristas con pesos:
- $A-B$: 2
- $A-C$: 1
- $B-C$: 3
- $C-D$: 4

Sea $S = \{A\}$ y $V \setminus S = \{B, C, D\}$. Las aristas que cruzan el corte son $A-B$ (peso 2) y $A-C$ (peso 1). La arista ligera es $A-C$ con peso 1. Si $A$ es el conjunto vacío (no hay aristas seleccionadas), el corte respeta a $A$. Entonces $A-C$ es segura y forma parte de cualquier MST (el MST tendrá aristas $A-C$, $A-B$ y $C-D$ con peso total 7, o $A-C$, $B-C$ y $C-D$ con peso total 8; la primera opción es la mínima y $A-C$ está en ambos).

### Ejemplo 2: Corte en el algoritmo de Kruskal

Grafo con vértices $1,2,3,4$ y aristas:
- $1-2$: 5
- $1-3$: 4
- $2-3$: 2
- $3-4$: 3
- $2-4$: 6

Ordenando por peso: $2-3$ (2), $3-4$ (3), $1-3$ (4), $1-2$ (5), $2-4$ (6). Al inicio, cada vértice es su propia componente. Cuando se considera $2-3$ (peso 2), el corte que separa la componente de $2$ (que solo contiene a $2$) del resto ($\{1,3,4\}$). Las aristas que cruzan este corte son $1-2$ (5), $2-3$ (2) y $2-4$ (6). La arista ligera es $2-3$ (peso 2). Como ninguna arista de $A$ (vacío) cruza el corte, $2-3$ es segura y se añade. Luego, al considerar $3-4$ (peso 3), el corte separa la componente que contiene a $2$ y $3$ de $\{1,4\}$. Las aristas que cruzan son $1-3$ (4), $1-2$ (5), $2-4$ (6) y $3-4$ (3). La arista ligera es $3-4$, y es segura.

### Ejemplo 3: Corte en el algoritmo de Prim

Usando el mismo grafo del ejemplo 2. Iniciamos Prim desde el vértice $1$. $V_T = \{1\}$. El corte es $(\{1\}, \{2,3,4\})$. Las aristas que cruzan: $1-2$ (5) y $1-3$ (4). La arista ligera es $1-3$ (peso 4). $A$ está vacío, el corte la respeta, así que $1-3$ se añade. Ahora $V_T = \{1,3\}$. El nuevo corte es $(\{1,3\}, \{2,4\})$. Aristas que cruzan: $1-2$ (5), $3-2$ (2), $3-4$ (3). La ligera es $3-2$ (peso 2), segura. Luego $V_T = \{1,2,3\}$, corte $(\{1,2,3\}, \{4\})$, aristas que cruzan: $2-4$ (6) y $3-4$ (3). La ligera es $3-4$ (peso 3). El MST obtenido tiene aristas $1-3$, $2-3$, $3-4$ con peso total $4+2+3=9$.

## Tabla resumen de conceptos

| Concepto | Definición | Comentarios adicionales |
|----------|------------|-------------------------|
| **Árbol de cobertura mínima (MST)** | Subconjunto de aristas de un grafo conexo y ponderado que conecta todos los vértices sin ciclos y con el peso total mínimo. | Existen varios algoritmos para encontrarlo: Kruskal, Prim, Borůvka. La unicidad del MST no está garantizada si hay aristas con pesos iguales. |
| **Corte** | Partición de los vértices en dos conjuntos no vacíos $S$ y $V \setminus S$. | El concepto de corte es central en teoría de grafos; también se usa en flujo máximo y particionamiento. |
| **Arista que cruza el corte** | Arista $(u,v)$ con $u \in S$ y $v \in V \setminus S$. | Estas aristas son candidatas a conectar las dos partes del grafo. |
| **Arista ligera** | Arista de peso mínimo entre las que cruzan un corte dado. | Puede haber varias aristas ligeras si hay empates en el peso mínimo. |
| **Propiedad de corte** | Si $A$ es un subconjunto de aristas de algún MST y $e$ es una arista ligera de un corte que respeta $A$, entonces $e$ es segura para $A$. | Esta propiedad garantiza que añadir aristas ligeras de forma iterativa lleva a un MST. Es la base de la corrección de Kruskal y Prim. |
| **Algoritmo de Kruskal** | Ordena todas las aristas por peso y las añade si conectan componentes diferentes (evitando ciclos). | Usa la estructura de conjuntos disjuntos (Union-Find) para eficiencia. Complejidad $O(E \log E)$ o $O(E \log V)$. |
| **Algoritmo de Prim** | Comienza desde un vértice y en cada paso añade la arista más liviana que conecta el árbol actual con un vértice externo. | Similar al algoritmo de Dijkstra para caminos mínimos. Se implementa con cola de prioridad. Complejidad $O(E \log V)$. |