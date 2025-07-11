# Clase 5: Algoritmos voraces y algoritmos sobre grafos

# Arbol de recubrimiento minimo

Problema

Dado un grafo G poderado (positivas) y conexo, extraer un arbol de tal manera la sumatoria de las ponderaciones sea minima (optimización)

---

Algoritmo de PRIM

- Escoja un vértice aleatorio
- Luego escoja la arista de menor peso que es adyancente al vertice
- En el arbol generado escoja la arista de menor que **no genere un ciclo**  que sea adyacente al árbol

---

Algoritmo de Kruskal

- Escoja la arista de menor pesos
- Posteriormente escoja las aristas de menor **siempre y cuando no genere un ciclo**
- Repita hasta que no se puedan elegir más aristas

---

# Cambio de monedas

Problema

- Conjunto de denominaciones, en la cual obligatoriamente tiene que estar 1
- Tenemos una cantidad M a cambiar

---

Propiedad de escogencia voraz

1. **Propiedad de escogencia voraz:** Escojo por la denominación mayor, una vez que no pueda continuo cn la siguiente en orden descendente
2. En cada denominación va existir un ciclo que repite con las monedas de menor valor

![image.png](Academico/2025-1/Algoritmos%20II%201997fd794c28808fa03cdd0497ec66dd/Clase%205%20Algoritmos%20voraces%20y%20algoritmos%20sobre%20graf%201b57fd794c288050800dedc0a8bf1053/image.png)

# Algoritjo Dijsktra

El algoritmo de Dijkstra se utiliza para encontrar la ruta más corta desde un vértice inicial a todos los demás vértices en un grafo dirigido con pesos no negativos.

### Pasos del Algoritmo:

1. Asigna una distancia inicial de infinito a todos los vértices excepto al vértice inicial, que tendrá una distancia de 0.
2. Marca todos los vértices como no visitados. Elige el vértice no visitado con la menor distancia (inicialmente el vértice inicial).
3. Para cada vecino de este vértice, calcula la distancia desde el vértice inicial y actualiza su distancia si el nuevo cálculo es menor que la distancia almacenada.
4. Marca el vértice actual como visitado y repite el proceso para el siguiente vértice no visitado con la menor distancia.
5. Continúa hasta que todos los vértices hayan sido visitados o no se pueda mejorar más la distancia.

---

### Ejemplo Sencillo

Supongamos un grafo con 4 vértices: A, B, C, D. Las aristas tienen los siguientes pesos:

- A → B: 1
- A → C: 4
- B → C: 2
- B → D: 6
- C → D: 3

Queremos encontrar la ruta más corta desde A a todos los demás vértices.

1. Inicialización:
    - Distancias: A = 0, B = ∞, C = ∞, D = ∞
    - Vértices visitados: Ninguno
2. Primer paso:
    - Seleccionamos A (distancia 0).
    - Actualizamos las distancias de sus vecinos:
        - B = 1 (0 + 1)
        - C = 4 (0 + 4)
3. Segundo paso:
    - Seleccionamos B (distancia 1).
    - Actualizamos las distancias de sus vecinos:
        - C = 3 (1 + 2, mejora respecto al 4 anterior)
        - D = 7 (1 + 6)
4. Tercer paso:
    - Seleccionamos C (distancia 3).
    - Actualizamos la distancia de su vecino:
        - D = 6 (3 + 3, mejora respecto al 7 anterior)
5. Cuarto paso:
    - Seleccionamos D (distancia 6). No hay más vecinos para actualizar.

Resultado final:

- A → A: 0
- A → B: 1
- A → C: 3
- A → D: 6

# Ejemplo Dijkstra

[2025-03-13-Note-15-44_annotated.pdf](2025-03-13-Note-15-44_annotated.pdf)

1. **Algoritmo de Prim**
    
    Complejidad: \( O(E + V \log V) \)
    
    - **\( V \):** Número de vértices en el grafo.
    - **\( E \):** Número de aristas en el grafo.
    El uso de una cola de prioridad para seleccionar las aristas de menor peso contribuye al término \( V \log V \), mientras que procesar todas las aristas toma \( O(E) \).
2. **Algoritmo de Kruskal**
    
    Complejidad: \( O(E \log E) \)
    
    - **\( E \):** Número de aristas en el grafo.
    - **\( V \):** Número de vértices en el grafo (implícito en la estructura de conjuntos disjuntos).
    Ordenar las aristas toma \( O(E \log E) \), y la operación de unión y búsqueda (union-find) es eficiente, ejecutándose en tiempo casi constante por operación.
3. **Cambio de monedas**
    
    Complejidad: \( O(D) \)
    
    - **\( D \):** Número de denominaciones de monedas disponibles.
    Este algoritmo voraz solo itera a través de las denominaciones en orden descendente, lo que lo hace lineal respecto al número de denominaciones.
4. **Algoritmo de Dijkstra**
    
    Complejidad: \( O(V^2) \) (sin cola de prioridad) o \( O(E + V \log V) \) (con cola de prioridad).
    
    - **\( V \):** Número de vértices en el grafo.
    - **\( E \):** Número de aristas en el grafo.
    En el caso más eficiente, el uso de una cola de prioridad reduce el costo de seleccionar el siguiente vértice de menor distancia, contribuyendo al término \( V \log V \), mientras que explorar todas las aristas toma \( O(E) \).

# Resumen

Los algoritmos voraces presentados son:

**1. Árbol de Recubrimiento Mínimo**

- Problema: Extraer un árbol de un grafo ponderado y conexo minimizando la suma de pesos
- Soluciones:
- Algoritmo de Prim: Selecciona vértice aleatorio y escoge aristas de menor peso adyacentes sin formar ciclos
- Algoritmo de Kruskal: Selecciona globalmente aristas de menor peso que no generen ciclos
- Complejidad: Prim O(E + V log V), Kruskal O(E log E)

**2. Cambio de Monedas**

- Problema: Dado un conjunto de denominaciones (incluyendo 1) y una cantidad M a cambiar
- Propiedad voraz: Seleccionar la denominación mayor y continuar en orden descendente
- Complejidad: O(D) donde D es el número de denominaciones

**3. Algoritmo de Dijkstra**

- Problema: Encontrar el camino más corto entre nodos en un grafo
- Complejidad: O(V²) sin cola de prioridad, O(E + V log V) con cola de prioridad

Los algoritmos voraces se caracterizan por:

- Toman decisiones locales óptimas en cada paso
- No garantizan una solución óptima global pero encuentran una "buena" solución
- Son efectivos cuando hay pocos problemas repetidos

*¡Los algoritmos voraces nos enseñan que a veces la mejor estrategia es dar pequeños pasos óptimos para alcanzar grandes soluciones!*