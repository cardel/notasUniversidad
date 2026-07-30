# Correctitud del algoritmo de Dijkstra

Sea $G(V,E,w)$ un grafo ponderado con $w(u,v) \geq 0$ para toda $(u,v) \in E$ y una fuente $s$. Al terminar `DIJKSTRA(G,w,s)`, se cumple que $u.d = \delta(s,u)$ para todo $u \in V$. Se garantiza que se han encontrado todos los caminos mínimos entre $s$ y los demás vértices. Es crucial tener en cuenta que **no deben existir pesos negativos** en las aristas.

## Invariante del algoritmo

1. **Invariante principal**: Todo vértice $v \in S$ cumple que $v.d = \delta(s,v)$. Es decir, todo vértice procesado ya tiene su distancia mínima definitiva desde el origen $s$.
2. **Inicio**: $S = \emptyset$. La invariante se cumple trivialmente para el conjunto vacío.
3. **Terminación**: Cuando $Q = \emptyset$ y $S = V$, se obtiene la invariante deseada para todos los vértices del grafo.
4. **Demostración por contradicción**: Supongamos que $u$ es el primer vértice extraído de $Q$ (es decir, añadido a $S$) tal que $u.d \neq \delta(s,u)$. Para el primer vértice extraído, que es el origen $s$, se tiene $s.d = 0 = \delta(s,s)$. Si $s.d \neq 0$, entonces $s \neq s$, lo cual es una contradicción.
5. **Existencia de un camino**: Existe un camino más corto de $s$ a $u$. Si no hubiera camino, entonces $u.d = \delta(s,u) = \infty$, lo que ya cumpliría la igualdad.
6. **Análisis del camino más corto**: Sea $p$ un camino más corto de $s$ a $u$. Dado que $s \in S$ y $u \notin S$ en el momento de extraer $u$, el camino $p$ debe cruzar la frontera de $S$. Sea $(x,y)$ la primera arista en $p$ tal que $x \in S$ y $y \notin S$.
    1. Al añadir $x$ a $S$, se tiene $x.d = \delta(s,x)$. Por la propiedad de convergencia, al relajar la arista $(x,y)$ obtenemos $y.d = \delta(s,y)$, ya que $(x,y)$ pertenece al camino más corto $p$.
    2. El vértice $y$ está en el camino más corto $p$ de $s$ a $u$, por lo que $\delta(s,y)$ es la distancia del prefijo de $p$ hasta $y$. Dado que todos los pesos son no negativos, se cumple que $\delta(s,y) \leq \delta(s,y) + w(\text{resto del camino hasta } u) = \delta(s,u)$. En otras palabras, la distancia más corta entre $s$ y $u$ incluye la distancia entre $s$ e $y$.
    3. Si existieran pesos negativos, el resto del camino $p$ después de $y$ podría tener un peso total negativo, lo que implicaría que $\delta(s,y) > \delta(s,u)$, rompiendo el argumento.
    4. Además, si $\delta(s,y) \leq \delta(s,u)$ y $y$ aún no ha sido procesado, entonces $y.d = \delta(s,y) \leq \delta(s,u) \leq u.d$. Esto significaría que $y$ debería haber sido extraído de la cola antes que $u$, lo cual es una contradicción con la suposición de que $u$ es el primer vértice con distancia incorrecta.

Por lo tanto, no existe tal vértice $u$, y el algoritmo calcula correctamente las distancias mínimas.

# Complejidad computacional

Los costos dependen de la implementación de la cola de prioridad:

1. **Número de operaciones**: Se realizan $|V|$ operaciones `EXTRACT-MIN` y hasta $|E|$ operaciones `RELAX` (que pueden implicar `DECREASE-KEY`).
2. **Arreglo no ordenado**: $O(|V|^2 + |E|)$. Adecuado para grafos densos.
3. **Heap binario**: $O((|V| + |E|) \log |V|)$. Equilibrado para grafos dispersos.
4. **Heap de Fibonacci**: $O(|V| \log |V| + |E|)$. Mejor complejidad teórica, pero más difícil de implementar.

## Tabla de resumen

Concepto | Descripción |
--- | --- |
**Objetivo de la demostración** | Probar que al finalizar el algoritmo, $u.d = \delta(s,u)$ para todo vértice $u$. |
**Condición necesaria** | Todos los pesos de las aristas deben ser no negativos. |
**Invariante clave** | Para todo $v \in S$, $v.d = \delta(s,v)$. |
**Método de demostración** | Demostración por contradicción, analizando el primer vértice que violaría la igualdad. |
**Papel del camino más corto** | Se analiza un camino más corto $s \leadsto u$ y la primera arista que cruza la frontera de $S$. |
**Argumento de no negatividad** | Garantiza que $\delta(s,y) \leq \delta(s,u)$, crucial para la contradicción. |
**Complejidades** | Depende de la estructura de datos: desde $O(\lvert V \rvert^2)$ (arreglo) hasta $O(\lvert V \rvert\log\lvert V \rvert+\lvert E \rvert)$ (Fibonacci heap). |

## Comentarios adicionales

- La demostración de correctitud del algoritmo de Dijkstra es un ejemplo clásico del uso de invariantes y demostración por contradicción en algoritmos voraces.
- La condición de pesos no negativos es esencial no solo para la eficiencia, sino para la correctitud misma del algoritmo. Si hay pesos negativos, la propiedad de que el primer vértice extraído de la cola tiene su distancia mínima definitiva deja de ser cierta.
- El paso clave de la demostración es mostrar que el vértice $y$ (el sucesor de $x$ en el camino más corto) tendría una distancia estimada menor o igual que la de $u$, y por lo tanto debería haber sido procesado antes, lo que lleva a una contradicción.
- En la práctica, la implementación con heap binario es la más común debido a su buen equilibrio entre eficiencia y simplicidad. El heap de Fibonacci ofrece mejor complejidad teórica amortizada, pero su overhead constante es mayor, por lo que solo es beneficioso para grafos muy grandes y dispersos.
- La demostración también ilustra la importancia de la **propiedad de relajación** y la **propiedad de convergencia** en los algoritmos de caminos más cortos.