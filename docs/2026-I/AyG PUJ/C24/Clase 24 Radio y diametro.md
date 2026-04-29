# Medidas en los grafos

1. Excentricidad $\epsilon$ Es la distancia máxima de un vértices $u$ a los demás.
	1. V pasadas de BFS $\Theta(|V|(|V|+|E|))$
	2. Floyd Warshall $\Theta(O(V^3))$
2. Radio: Excentricidad minima en todo el grafo
3. Diametro: Excentricidad máxima en todo el grafo
4. $R(G) \leq D(G) \leq 2*R(G)$

Para que sirve, esto ayuda a estudiar problemas que son modelados a través de grafos como es el caso de las redes complejas.


# Calculo del diametro en un arbol

En un arbol libre existe la propiedad de que hay un solo camino entre cada par de vértices.

Para calcular, aplicamos el siguiente algoritmo.

1. Seleccion un vértice $v$ cualquiera, y tome el vértice en el cual se tiene distancia $\epsilon(v)$ este vértice $u$ es uno de los extremos del camino más largo
2. Al calcular $\epsilon(u)$ obtenemos el diametro del arbol.

¿Porque funciona?

Al calcula $\epsilon(v)$ llegamos a un vértice $u$ ese camino Q, se va intersectar con el camino $P$ e los extremos, dado que si no es asi (hay una distancia entre ellos) se llega a una contradicción dado que seria un camino aun más largo, y esto va en contra de la definición de DIAMETRO.

# Implementaciones

[Codigos](Codigos.md)