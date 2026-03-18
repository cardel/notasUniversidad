# Como vamos

1. Paseo en grafos, es una secuencia de aristas entre $u$ y $v$ donde se pueden repetir vértices y aristas
2. Camino, es un paseo donde no se repite ningún vértice
3. Ciclo: Es un camino en el que el vertice inicial y final son iguales
4. Distancia, $\delta(u,v)$ esta sujeta a:
	1. Si es 0 significa que es la distancia del vértice consigo mismo
	2. La distancia $u$ y $v$ es la misma que de $v$ a $u$
	3. Desilguadad triangular $\delta(u,v) \leq \delta(u,v)+\delta(w,v)$
5. Camino mas corto, dado un camino entre $v_0$ y $v_k$ compuesto por un conjunto de vertices $v_0,v_1,\ldots,v_k$ cualquier subcamino en esta camino en esta secuencia es el mas corto, un camino mas corto entre un par de vertices esta compuesto por caminos mas cortos entre los vertices que pertenecen a esto camino.
6. Lo caminos cumple con ser relaciones de equivalencia
	1. Camino de u hasta u vale 0. Reflexivo
	2. El camino de u hasta v es el mismo de v hasta u. Simetrica
	3. Transitica, el camino u hasta v, y de v hasta w es el mismo que de u hasta w. Transtivo.

# Temas

1. [Conectividad II](Conectividad%20II.md)
2. [Orden topologico](Orden%20topologico.md)