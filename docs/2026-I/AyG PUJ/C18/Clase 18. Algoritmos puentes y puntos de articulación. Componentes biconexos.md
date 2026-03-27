# Como vamos

- Puentes y articulaciones: Tienen aplicaciones para el analisis de vulnerabilidades en diferentes contextos como las comunicaciones y las redes electricas
- Puente: Es una ariste $e$ es un grafo $G(V,E)$ tal que al eliminarla incrementa el número componentes conexos del grafo
- Punto de articulación: Vértice que al eliminarlo se incrementan el número de componentes conexos
- Si existe un puente, al menos uno de sus vértices es punto de articulación, excepto si tiene grado 1
- Un vértice de articulación no necesariamente implica que un aristas incidentes sea un puente
- Para detectar vertices de articulación, tenemos el algoritmo de la fuerza bruta el cual consiste en eliminar vértices paulatinamente (uno a la vez) y determinar si se incrementan los componentes conexos (DFS) $|V|*O(|V|+|E|)$ es impractico para grafos grandes


# Temas.

1. [Algoritmo Tarjan para puentes y puntos articulación](Algoritmo%20Tarjan%20para%20puentes%20y%20puntos%20articulación.md)
2. [Componentes biconexas](Componentes%20biconexas.md)
3. [Algoritmo de Pila de Aristas](Algoritmo%20de%20Pila%20de%20Aristas.md)
4. [Resumen](Resumen.md)