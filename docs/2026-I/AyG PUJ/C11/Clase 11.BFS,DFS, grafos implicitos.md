# Como vas

1. Invariantes de ciclo: Es una herramienta matematica para la corrección asegurarse que un algoritmo dada precondición cumple una poscondicación.
	1. Estado ¿Es lo que se modifica a medida a que el algoritmo avance?
	2. Estado inicial: El valor del estado al momento de arrancar el algoritmo
	3. Transformación de estados: Es como evoluciona el estado a medida que el algoritmo se ejecuta
	4. Estado final: Cuando el algoritmo termina que valores tiene el estado, entre estos esta la salida
	5. Invariante: Es la condición que cumple SIEMPRE que el algoritmo avanza. Si usted toma una fotografia cuando el algoritmo avanza, va a observar que la invariante se cumple.
		1. La invariante cumple estado inicial
		2. La invariante cumple estado final
		3. La invariante cumpla la tranformación (inducción) estado $S_n \implies S_{n+1}$
2. Divide y vencerás
	1. Dividir el problema hasta que llegamos al caso trivial (base)
	2. Combinan las soluciones de forma recursiva
3. Grafos
	1. Introducción: Vertice, adyacencia, incidencia, arista, grado, teorema de Handshaking, tipos de grafos
		1. No dirigidos: Simples, multigrafo, pseudografo
		2. Dirigidos: Dirigido, multigrafo dirigido
	2. Familias de grafos simples
		1. $K_n$ Grafo completo
		2. $C_n$ Ciclo
		3. $W_n$ Rueda
		4. $K_{n,m}$ Bipartito
	3. Representaciones de grafos
		1. Matriz de adyacencia: Es una matriz de tamaño $|V|x|V|$ en la cual si existe una arista entre $i$ y $j$ la matriz en esa posición vale 1.
		2. Matriz incidencia: $|V|x|E|$ en la posición $i,j$ hay un 1 si el vertice $i$ es incidente a la arista $j$. 
# Temas

1. [BFS](BFS.md)
2. [Grafo implicito](Grafo%20implicito.md)