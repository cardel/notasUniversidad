
# Como vamos

1. Que es un grafo: Un conjunto de vertices y aristas, formalmente $G(V,E)$, $E \in V^2$ 
2. Tipos grafos
	1. No Dirigidos (a,b) = (b,a)
		1. Simples
		2. Multigrafo: Aristas multiples
		3. Pseudografo: Permite bucles
	2. Dirigidos (a,b) != (b,a)
		1. Grafo dirigido
		2. Multigrafo dirigido: Se permiten aristas multiples
3. Adyacencia: Si existe una arista (u,v), u es adyacente v (viceversa)
4. Incidencia se dice la arista (u,v) es incidente a u y a v
5. Grado de un grafo |V|, que un grafo de grado 0 o 1 trivial
6. Grado de un vértice: Es el número de aristas que son incidentes a el
7. Teorema de Handshaking
	1. No dirigidos $2e = \sum \limits_{vi \in V} \delta(v_i)$
	2. Dirigidos
		1. Grado de entrada: Son aquellas aristas donde el u es destino (x,u), $\delta^+$ 
		2. Grado de salida: Son aquellas aristas donde u es inicio $(u,v)$ se denota como $\delta^-$ 
		3. $\sum \limits_{v\in V} \delta^+(v) = \sum \limits_{v\in V} \delta^-(v) = e$
8. Familias de grafos simples
	1. $K_n$ Grafo completo, cada vértice está conectado con los demás.
	2. $C_n$ Ciclo con $n$ vértices, cada vértice tiene grado 2 (Grafo regular de grado 2)
	3. Rosen: $W_n$ Grafo rueda: Es un ciclo $C_n$ al cual le agrego un vértice en el centro que conecta con los demás.

# Temas.

1. [Grafos bipartito](Grafos%20bipartito.md)
2. [Grafo complementario](Grafo%20complementario.md)