# Relajación

Para representar una solución del problema SSSP (Single-Source Shortest Path) necesitamos dos atributos para cada vértice:

1. **v.d**: estimación del peso del camino más corto desde la fuente $s$ hasta $v$.
2. **v.π**: predecesor de $v$ en el camino más corto estimado (permite reconstruir el camino).

## Inicialización

Inicialmente, para todo vértice $v \in V$:

1. $v.d = \infty$ (desconocemos la distancia).
2. $v.\pi = \text{NIL}$ (no tiene predecesor).
3. $s.d = 0$ (la distancia de la fuente a sí misma es cero).

## Idea de la relajación

Relajar una arista $(u, v)$ significa verificar si podemos mejorar la estimación actual de $v.d$ usando el camino que pasa por $u$. Formalmente, si $u.d + w(u,v) < v.d$, entonces:

1. $v.d = u.d + w(u,v)$ (mejoramos la estimación de la distancia).
2. $v.\pi = u$ (actualizamos el predecesor).

Todos los algoritmos clásicos de SSSP consisten en aplicar repetidamente la operación RELAX a las aristas del grafo, pero con estrategias diferentes:

1. **Bellman‑Ford**: relaja todas las aristas $|V| - 1$ veces (garantiza convergencia si no hay ciclos negativos alcanzables).
2. **Dijkstra**: relaja las aristas salientes del vértice con la menor estimación $d$ (requiere pesos no negativos).
3. **Para DAGs (Grafos Acíclicos Dirigidos)**: relaja los vértices en orden topológico (una sola pasada es suficiente).

## Propiedades formales de la relajación

### Cota superior

En todo momento, $v.d \geq \delta(s,v)$. Es decir, $v.d$ es una **cota superior** de la distancia real, que solo puede mejorar (disminuir) durante la ejecución del algoritmo.

### No camino

Si no existe un camino de $s$ a $v$, entonces $\delta(s,v) = \infty$ y la estimación $v.d$ permanecerá en $\infty$.

### Convergencia

Si tenemos un camino más corto $s \leadsto u \rightarrow v$, y en algún momento se cumple que $u.d = \delta(s,u)$ (es decir, hemos encontrado la distancia mínima a $u$), entonces al relajar la arista $(u, v)$ obtendremos $v.d = \delta(s,v)$.

### Relajación de un camino

Sea $p = (v_0, v_1, \ldots, v_k)$ un camino más corto de $s = v_0$ a $v = v_k$. Si relajamos las aristas $(v_0, v_1), (v_1, v_2), \ldots, (v_{k-1}, v_k)$ **en ese orden**, entonces después de la última relajación tendremos $v_k.d = \delta(s, v_k)$. Esta propiedad garantiza que, si un algoritmo logra relajar las aristas de un camino más corto en el orden correcto, encontrará la distancia mínima.

## Subgrafo de predecesores

El conjunto de aristas $\{(v.\pi, v) \mid v \in V \setminus \{s\} \text{ y } v.\pi \neq \text{NIL}\}$ forma un **subgrafo de predecesores** $G_\pi$. Si al finalizar el algoritmo se cumplen las condiciones de optimalidad, $G_\pi$ es un **árbol de caminos más cortos con raíz en $s$**, que contiene un camino más corto de $s$ a cada vértice alcanzable.

---

## Tabla de resumen

Concepto | Descripción | Observaciones |
| --- | --- | --- |
Atributos para SSSP | $v.d$ (estimación de distancia), $v.\pi$ (predecesor en el camino). | Permiten representar la solución y reconstruir los caminos. |
Inicialización | $v.d = \infty$, $v.\pi = \text{NIL}$, $s.d = 0$. | Estado inicial que refleja la ausencia de conocimiento sobre los caminos. |
Operación RELAX | Si $u.d + w(u,v) < v.d$, actualiza $v.d$ y $v.\pi$. | Operación fundamental en todos los algoritmos de caminos más cortos. |
Estrategias de aplicación | Bellman‑Ford (todas las aristas, $|V|-1$ veces), Dijkstra (vértice con menor $d$), DAG (orden topológico). | La estrategia define el algoritmo y sus condiciones de aplicabilidad. |
Cota superior | $v.d \geq \delta(s,v)$ en todo momento. | La estimación nunca subestima la distancia real, solo puede mejorar. |
Convergencia | Si $u.d = \delta(s,u)$ y se relaja $(u,v)$, entonces $v.d = \delta(s,v)$. | Base para demostrar la corrección de los algoritmos. |
Relajación de un camino | Relajar las aristas de un camino más corto en orden garantiza obtener la distancia mínima al final. | Explica por qué múltiples relajaciones pueden conducir a la solución. |
Subgrafo de predecesores ($G_\pi$) | Grafo dirigido formado por las aristas $(v.\pi, v)$. | Si el algoritmo es correcto, $G_\pi$ es un árbol de caminos más cortos con raíz $s$. |

**Comentarios adicionales:**

- La operación RELAX es un **principio de optimalidad local**: si podemos mejorar la distancia a un vecino usando la arista actual, lo hacemos. La estrategia global (en qué orden aplicar RELAX) determina la eficiencia y corrección del algoritmo.
- La propiedad de **convergencia** es clave para demostrar que, tras un número suficiente de relajaciones (por ejemplo, $|V|-1$ en Bellman‑Ford), todas las estimaciones $v.d$ serán iguales a $\delta(s,v)$, asumiendo que no hay ciclos negativos alcanzables.
- El **subgrafo de predecesores** $G_\pi$ no solo almacena las distancias, sino también la estructura de los caminos. Si el grafo tiene pesos negativos y ciclos negativos alcanzables, $G_\pi$ puede contener ciclos y no ser un árbol.
- La **inicialización** con $s.d = 0$ y $v.d = \infty$ establece una **invariante de bucle**: al inicio, solo la fuente tiene distancia finita, y las relajaciones propagan esta información a través del grafo.
- En la práctica, la relajación se implementa como una comparación y actualización simple, lo que la hace muy eficiente. La complejidad de los algoritmos depende del número de veces que se realiza esta operación.