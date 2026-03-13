# Idea

Estudiar la conectividad nos permite determinar de antemano si los vértices son accesibles o no en un grafo (dirigido o no dirigido) y trabajar con los ciclos.

# Cómo vamos

1. **Grafos: Terminología**: $G(V,E)$ Vértices y aristas.
2. **Grafos: Tipos**:
	1. **No dirigidos**: Las aristas no tienen dirección $(u,v) = (v,u)$.
		1. **Grafo simple**: No tiene bucles ni aristas múltiples.
		2. **Multigrafo**: Tiene aristas múltiples.
		3. **Pseudografo**: Tiene aristas múltiples y bucles.
	2. **Dirigidos**: Las aristas tienen dirección $(u,v) \neq (v,u)$.
		1. **Grafo dirigido**: No tiene aristas múltiples (permite bucles).
		2. **Multigrafo dirigido**: Tiene aristas múltiples (permite bucles).
3. **Conceptos adicionales**:
	1. **Grafo trivial**: Grafo con un solo vértice o vacío.
	2. **Adyacencia**: $u$ y $v$ son adyacentes si y solo si $(u,v) \in E$.
	3. **Incidencia**: $e_1$ es incidente a $u$ o $v$ si y solo si $e_1 = (u,v)$.
	4. **Grado en grafos no dirigidos**: Cantidad de aristas que inciden en un vértice.
	5. **Grado en grafos dirigidos**:
		1. **Grado de entrada ($\delta^+(u)$)**: Número de aristas que tienen como destino a $u$.
		2. **Grado de salida ($\delta^-(u)$)**: Número de aristas que tienen como fuente a $u$.
	6. **Teorema de Handshaking**:
		1. **No dirigidos**: $2e = \sum \limits_{v_i  \in V} \delta(v_i)$.
		2. **Dirigidos**: $e = \sum \limits_{v_i  \in V} \delta^+(v_i) = \sum \limits_{v_i  \in V} \delta^-(v_i)$.
	7. **Familias de grafos simples**:
		1. **$K_n$ (Grafo completo)**: Cada vértice está conectado con todos los demás.
		2. **$C_n$ (Ciclo)**: Grafo que forma un ciclo simple con $n$ vértices.
		3. **$W_n$ (Rueda)**: Ciclo $C_n$ con un vértice adicional conectado a todos los vértices del ciclo.
		4. **$K_{n,m}$ (Grafo bipartito completo)**: Dos conjuntos de vértices con aristas conectando todos los vértices de un conjunto con todos los del otro, sin aristas dentro del mismo conjunto.
	8. **Búsqueda por amplitud (BFS) y búsqueda por profundidad (DFS)**:
		1. **BFS (Breadth-First Search)**: Búsqueda por anchura, explora los vértices por niveles de distancia desde el origen, utilizando una cola.
		2. **DFS (Depth-First Search)**: Búsqueda por profundidad, explora tan lejos como sea posible a lo largo de cada rama antes de retroceder, utilizando una pila o recursión.
	9. **Propiedades de BFS y DFS**:
		- **BFS**: Encuentra el camino más corto en grafos no ponderados, complejidad $O(V+E)$.
		- **DFS**: Útil para detectar ciclos, ordenamiento topológico y componentes conexas, complejidad $O(V+E)$.

# Tabla de Resumen

| Concepto | Definición | Aplicación/Propiedad |
|----------|------------|----------------------|
| Grafo no dirigido | Aristas sin dirección, $(u,v) = (v,u)$. | Modela relaciones simétricas (ej: amistades). |
| Grafo dirigido | Aristas con dirección, $(u,v) \neq (v,u)$. | Modela relaciones asimétricas (ej: seguidores). |
| Adyacencia | Dos vértices unidos por una arista. | Base para recorridos y conectividad. |
| Grado ($\delta(v)$) | Número de aristas incidentes en un vértice. | Handshaking: suma de grados = $2e$. |
| Grado entrada/salida | En dirigidos: aristas que entran/salen. | Conservación: suma de entradas = suma de salidas = $e$. |
| Grafo completo ($K_n$) | Todos los vértices conectados entre sí. | Máxima conectividad, $\delta(v)=n-1$. |
| Grafo bipartito ($K_{n,m}$) | Dos conjuntos, aristas solo entre conjuntos. | Modela relaciones entre dos tipos de entidades. |
| BFS | Búsqueda por niveles, usa cola. | Camino más corto en grafos no ponderados. |
| DFS | Búsqueda en profundidad, usa pila/recursión. | Detección de ciclos, componentes conexas. |

# Comentarios Adicionales

- La **conectividad** es fundamental para determinar si un grafo es "de una sola pieza" (conexo) o está dividido en componentes.
- En grafos dirigidos, la conectividad puede ser **débil** (ignorando direcciones) o **fuerte** (respetando direcciones).
- Los algoritmos BFS y DFS son la base para muchos otros algoritmos en grafos (Dijkstra, detección de puentes, etc.).
- El **teorema de Handshaking** garantiza que la suma de grados es par, lo que implica que en cualquier grafo, el número de vértices con grado impar es par.

# Temas

1. [Conectividad](Conectividad.md)
2. [Diapositivas](Diapositivas.md)

