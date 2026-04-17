La garantia (poscondicion) de floyd warshall es el hecho de que $d_{ij}^{(n)} =\delta(i,j)$ que al final me va calcular el camino más corto

Inducción matematica, bajo la precondición sin ciclos negativos

Por hipotesis inductiva

1. $d_{ii}^{(n)} = 0$ esto es correcto porque por definición en un grafo pondrado sin ciclos negativos la distancia más corta entre un vertices y si mismo es 0
2. P(k-1) -> P(k), asumimos que P(k-1) es cierto, eso quiere $d_{ij}^{(k-1)} = \delta(i,j)$ 
	1. Si k está en el camino $p$ entonces $d_{ij}^{(k)} = d_{ik}^{(k-1)}+d_{kj}^{(k-1)}$ la subestructura optima de un camino más corto nos dice que si entre $i$ y $j$ hay un camino más corto que pasa por $k$ se tiene $\delta(i,j) = \delta(i,k)+\delta(k,j)$ lo que comprueba la hipotesis
	2. SI k no está en el camino entonces $d_{ij}^{(k)} = d_{ij}^{(k-1)}$ dado que el camino más corto no puede pasar por $k$

# Complejidad

## Temporal

Iteramos $n$ veces sobre la matriz adyacencia $n.n$ tomando en cuenta que $n = |V|$ , por lo tanto tenemos $\Theta(|V|^3)$

## Especial

Necesitamos una matriz adyancencia $O(|V|^2)$

Ahora si usamos una estructura de datos para almacenar los caminos está tambien tendra complejidad $O(|V|^2)$ 