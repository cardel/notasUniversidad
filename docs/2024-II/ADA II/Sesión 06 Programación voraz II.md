# Sesión 06: Programación voraz II

# Algoritmo de Dijkstra

¿Que es?

- Es un algoritmo voraz
- Encontrar el camino más corto entre dos nodos en un Grafo

---

¿Cual es la decisión voraz?

Dado un nodo arbitrario $n_i$ y un costo acumulado $c_i$ escojo el camino con menor costo, es una decisión local

¿Porque es una decisión local? Tomo la decisión sin importarme las decisiones que se tomen adelante

---

Arbol recubridor

Es un arbol que extraemos de un grafo

Un arbol arbol recubridor minimo es que el cumple que la sumatoria de los pesos de sus aristas es MINIMO

---

Algoritmo PRIM

1. Escogemos arista de menor peso
2. Escogemos la arista de menor peso ADYACENTE que uno genere un circuito
3. Itere hasta que haya escogido n-1 aristas

---

Algoritmo KRUSKAL

1. Escogemos la arista de menor peso
2. Escogemos la arista de menor peso GLOBAL que no genere un circuito
3. Itere hasta que haya escogido n-1 aristas

---

¿Prim y Kruskal dan siempre el mismo RESULTADO? 

No, sii existe más de una solución optima

¿Prim y Krustral dan siempre la solución OPTIMIZA?

El criterio de escogencia voraz es global