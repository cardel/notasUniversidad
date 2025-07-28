# Algoritmos de ordenamiento
- Son algoritmos que realizan la tarea de ordenar estructuras de datos
- Ordenar es colocar los elementos en las posiciones de la estructura de datos de acuerdo a algún criterio
	- Criterios numéricos: Orden ascendente 1,2,3,4,5,6,.. Orden descendente 10,9,8,...
	- Criterio lexicografico: a,b,c,d,e, a es menor que b, a es menor que c, b es menor que c y así. Las mayúsculas son menores que las minúsculas por código ASCII https://elcodigoascii.com.ar/
		- Primero evaluamos la primera letra
		- Si son iguales evaluamos la siguiente, y así sucesivamente
		- En caso de dos palabras una es **prefijo** de otra, asumimos que la palabra más corta es la menor, mar y marea, mar es menor que es mas corto que marea, y mar es prefijo de marea
- Ordenar es una tarea que tiene aplicaciones en muchas areas de la programación: bases de datos, búsqueda eficiente, procesamiento de datos, etc
## Algunas aplicaciones
Determinar si un arreglo tiene elementos únicos
1. Fuerza bruta: Comparar un elemento contra los demás, esto se hace n veces (número de elementos), por lo tanto la complejidad es $O(n²)$ 
2. Por ordenamiento
	1. Ordenar nos cuenta $O(nlog(n))$
	2. Buscar nos cuesta $O(n)$ porque si hay dos o más elementos iguales van a quedar contiguos, basta con mirar un elemento y su siguiente, esto se hace n veces. 
	3. Tenemos dos tareas 1) ordenar que cuesta $O(nlog(n))$ y 2) buscar que cuesta $O(n)$ , en este caso tomamos la cota mayor, lo que nos queda $O(nlog(n))$ 