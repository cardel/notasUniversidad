# Problema de la mochila 0/1

Este problema consiste en colocar un conjunto de elementos en una mochila de capacidad M, de tal forma se maximize la ganancia.

## Propiedad de escogencia voraz

1. Quiero maximizar la ganancia
2. Quiero que me quepan los elementos, minimizar el peso

Por ende el criterio es dividir el ganancia sobre el peso, porque un elemento que potencialmente permite que metamos mas elemento y da una gran ganancia tiene una buena relación entre la ganancia y peso.


1. $M=20$ la capacidad es 20
2. $w = \{6,8,4,7\}$ los pesos de los elementos
3. $b = \{5,4,6,3\}$ los beneficios de los elementos
4. $\frac{b}{w} = \{\frac{5}{6}, \frac{1}{2}, \frac{3}{2},\frac{3}{7}\}$
5. Vamos a organizar de mayor a menor  $\frac{b}{w} = \{ \frac{3}{2},\frac{5}{6}, \frac{1}{2},\frac{3}{7}\}$
6. Ingresamos los elementos siempre y cuando no excedamos la capacidad
	1. Elemento 3, capacidad queda 16, ganancia 6
	2. Elemento 1, capacidad queda 10, ganancia 11
	3. Elemento 2, capacidad queda 2, ganancia 15
	4. Elemento 4, no cabe
## Complejidad de las soluciones

### Solución ingenua

Hacer todas las combinaciones llevando a 0 elementos, 1 elemento, 2 elementos, 3, ... n, conjunto potencia complejidad $O(2^n)$ exponencial

### Solucion dinamica

1. Subestructura optima: $(M+1)(N+1)$ donde $M$ es el capacidad y $N$ el número de elementos
2. Recorremos toda la matriz por columnas
3. Por lo tanto la complejidad computacional $O(M*N)$ usualmente $M > N$
4. La complejidad especial es igual por la estructura de datos.
5. Podemos asumir que $M$ es estadisticamente $N^2$ por ello la solución tiende $O(N^3)$

### Solución voraz

1. Calculamos $\frac{b}{w}$ nos cuesta $O(N)$
2. Ordenar $\frac{b}{w}$ nos cuesta $O(Nlog(N))$

Por lo tanto es $O(Nlog(N))$




