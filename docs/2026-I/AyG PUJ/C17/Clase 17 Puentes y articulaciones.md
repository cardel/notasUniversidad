
# Temas

1. Componenente fuertemente conexas, dado un grafo dirigido se considera que es fuertemente conexo sii hay una camino de $u$ a $v$ y de $v$ a $u$ es decir mutuamente alcanzables
2. No puede agregar ningun vertice adicional sin romper la propiedad de alcanzabilidad mutua.
3. Los componentes fuertemente conexos se mantienen en el $G^T$ es el mismo grafo, pero cambiando la dirección de las aristas
4. Los grafos de componentes $G^{SCC}$ es un grafo compuesto por los diferentes componentes fuertemente conexos y este grafo es un DAG
5. Algoritmo de Kosaraju: Este algoritmo permite detectar los componentes fuertemente conexos
	1. Requiere dos pasadas de DFS $G$ y $G^T$ 
	2. Tomamos los tiempos finalización de cada vértice en la primera pasada
	3. Ejecutar en el $G^T$ DFS en el orden de los tiempo de finalización (decreciente), como el $G^T$ tiene el orden invertido de las aristas, desde un componente de tiempo de finalización superior no podemos acceder a uno de finalización inferior. Por que el grafo DFS de $G$ este componente es ancestro de este componente.