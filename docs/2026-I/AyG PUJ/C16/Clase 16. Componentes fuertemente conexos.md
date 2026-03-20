# Como vamos

1. Definiciones de grafos: Dirigido y no dirigido
	1. No dirigido: Aristas no tienen dirección, simple, pseudografo (bucles), pseudografo (aristas multiples)
	2. Dirigido: Multigrafo dirigido (aristas multiples), grafo dirigido
2. Definiciones
	1. Adyacencia, $u$ es adyacente a $v$ sii que existe una arista $(u,v)$f
	2. Incidencia, la arista $(u,v)$ es incidente vértice $u$ y $v$
	3. Grado: EL numero de aristas que son incidentes a un vértice
	4. Grado de entrada: En grafos dirigidos, son aquellas cuyo destino es el vértice, por ejemplo $(v,u)$ es un vertice de entrada a $u$
	5. Grado de salida: En grafos dirigidos, son aquellas cuyo origen es el vértice, por ejemplo $(u,v)$ es un vertice de salida de $u$
	6. Teorema de Handshaking
		1. No dirigidos $2e = \sum \limits_{v_i \in V} \delta(v_i)$ 
		2. Dirigidos $e = \sum \limits_{v_i \in V} \delta⁺(v_i) = \sum \limits_{v_i \in V} \delta⁻(v_i)$
	7. Familias de grafos simples
		1. Completo $K_n$ cada vertice es adyacente a los demás
		2. Ciclo $C_n$ Cada vertice conecta exactamente con otros dos
		3. Rueda $W_n$ (Rosen) un ciclo $C_n$ con un vertice más que conecta con todos
		4. Bipartito $K_{n,m}$ es un grafo don dos conjuntos de vertices de tamaño $n$ y $m$ los cuales no se conectan entre sí, pero con los vértices con los del otro conjunto
	8. BFS: Busqueda por amplitud (Cola) Es como una ola que se propaga a lo largo del grafo
	9. DFS: Busqueda por profundidad (Pila) Explora todos los vertices considerando una eleccion. Es como estar en una cueve que tiene exactamente dos salidas en cada cuarto, elijo por ejemplo siempre a la izquierda y si no puedo avanzar mas, escojo el lado de derecho.
	10. Propiedades BFS y DFS. BFS para componentes conexos, DFS encontrar ciclos
	11. Paseo: Es una secuencia de aristas en las que se puede repetir vértices
	12. Camino: Es un paseo donde no se pueden repetir vertices
	13. Ciclo: Es un camino donde el vertice inicial y final son el mismo
	14. DAG: Es un grafo acicliclo dirigido
	15. Orden Topologico: En un DAG, van a existir unos nodos fuente los cuales su grado de entrada es cero, y otros de destino que tienen grado de salida cero
# Temas

1. [Componentes fuertemente conexos](Componentes%20fuertemente%20conexos.md)
2. [Algoritmos para detección de SCC](Algoritmos%20para%20detección%20de%20SCC.md)