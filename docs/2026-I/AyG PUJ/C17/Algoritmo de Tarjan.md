# Algoritmo de Tarjan

- **Complejidad**: $O(|V| + |E|)$.
- Utiliza una sola pasada de DFS.
- Se basa en la propiedad de que los SCC (Componentes Fuertemente Conexos) forman subárboles en el árbol DFS, debido a que existe un orden topológico entre ellos.

## Funcionamiento

Para cada vértice se mantienen dos valores:

1. **v.d**: Tiempo de descubrimiento en DFS.
2. **v.low**: El menor $d$ alcanzable desde el subárbol de $v$ usando a lo sumo una arista de retroceso (que puede cerrar un ciclo).
3. El vértice $v$ es la raíz de su SCC si es el primer nodo del componente descubierto por DFS, es decir, cuando $v.low = v.d$.
4. **Proceso**:
    1. Inicializar $t = 0$, $P = []$ (pila), marcar todos los vértices como no visitados.
    2. Para cada vértice $v$ en $G$, si $v$ no ha sido visitado, ejecutar `TarjanDFS(v)`.
    3. `TarjanDFS(v)`:
        ```python
        # Asignar tiempo de descubrimiento y low inicial
        v.d = t
        v.low = t
        t = t + 1
        
        # Apilar v y marcarlo como en pila
        P.apilar(v)
        v.enPila = True
        
        # Explorar vecinos
        for w in vecinos(v):
            if w no visitado:
                TarjanDFS(w)
                v.low = min(v.low, w.low)  # Propagación de low hacia arriba
            elif w en pila:
                v.low = min(v.low, w.d)    # Arista de retroceso a ancestro
        
        # Si v es raíz de un SCC
        if v.low == v.d:
            SCC = []
            while True:
                u = P.desapilar()
                u.enPila = False
                SCC.agregar(u)
                if u == v:
                    break
            # SCC contiene todos los nodos del componente
        ```

## Conceptos Teóricos Relevantes

- **Componente Fuertemente Conexo (SCC)**: Subconjunto máximo de vértices donde cada par de vértices es mutuamente alcanzable.
- **Aristas de retroceso**: En DFS, aristas que van de un nodo a un ancestro en el árbol de búsqueda, indicando ciclos.
- **Propiedad de subárbol**: Los SCC forman subárboles en el árbol DFS porque el primer vértice descubierto (raíz) tiene el menor tiempo de descubrimiento dentro del componente, y todos los demás son descendientes en el árbol DFS.
- **Condición de raíz**: Un vértice es raíz de su SCC si su `low` es igual a su tiempo de descubrimiento, lo que significa que no puede alcanzar un ancestro más antiguo, definiendo así la base del componente.

## Tabla de Resumen

| Concepto                            | Descripción                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Complejidad                         | O(V+E)                                                                                         |
| SCC (Componente Fuertemente Conexo) | Subgrafo donde cada vértice es alcanzable desde cualquier otro.                                |
| Tiempo de descubrimiento (v.d)      | Momento en que un vértice es visitado por primera vez en DFS.                                  |
| Low-link (v.low)                    | Menor tiempo de descubrimiento alcanzable desde v usando aristas del árbol y una de retroceso. |
| Condición de raíz                   | v.low == v.d identifica la raíz de un SCC.                                                     |
| Pila de activos                     | Mantiene vértices del SCC actual durante DFS.                                                  |
| Arista de retroceso                 | Conecta un nodo con un ancestro, clave para detectar ciclos.                                   |

## Comentarios Adicionales

- El algoritmo de Tarjan es eficiente y elegante, resolviendo el problema de SCC en una sola pasada de DFS.
- Es fundamental en aplicaciones como análisis de dependencias, optimización de compiladores y detección de ciclos en grafos dirigidos.
- La propiedad de que los SCC forman subárboles en el árbol DFS permite una identificación natural y eficiente mediante `low` y `d`.
- La pila asegura que los vértices de un SCC se extraigan juntos cuando se encuentra la raíz, manteniendo el orden de descubrimiento.
- En grafos no dirigidos, los SCC se reducen a componentes conexos, y el algoritmo se simplifica notablemente.