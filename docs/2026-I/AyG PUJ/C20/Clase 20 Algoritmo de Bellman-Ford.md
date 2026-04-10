
# Problematica

BFS permite encontrar el camino más corto desde un vértice fuente $s$ a los demás en número de aristas, es decir en grafos que no son ponderados o cuyos pesos son iguales.

Por lo tanto, la métrica el número de aristas no es la mejor para el caso de los caminos más cortos

# Recordar

El algoritmo relax

1. Colocar todo v.d en $\infty$ y v.s = 0, $v.\pi = NIL$ inicialmente ningún nodo tiene padre
2. $\forall (u,v) \in E$ Si $v.d < u.d + w(u,v)$
	1. $v.d = u.d + w(u,v)$
	2. $v.\pi = u$

# Temas

1. [Descripcion del algoritmo de Bellman-Ford](Descripcion%20del%20algoritmo%20de%20Bellman-Ford.md)
2. [Correctitud y complejidad](Correctitud%20y%20complejidad.md)
