# Grafos con estado I

Los grafos usualmente vienen explícitos desde la entrada (por ejemplo, como lista de aristas o matriz de adyacencia), pero no siempre es así. En aplicaciones como Waze, el grafo y sus pesos pueden recalcularse dinámicamente.

- **Estado del sistema**: Actúa como vértice.
- **Acciones permitidas**: Son aristas.

El grafo existe, pero es **implícito**; lo generamos a medida que lo recorremos.

## Definición formal

Un **grafo de estado** asociado a un problema es una tupla $(V, E, w, s, M)$ donde:

- $V$ es el conjunto de configuraciones posibles del sistema (estados).
- $E \subseteq V \times V$: $(s, s') \in E$ si y solo si existe una acción válida que transforma el estado $s$ en $s'$.
- $w : E \to \mathbb{R}_{\geq 0}$ asigna el costo de cada acción (peso de la arista).
- $s \in V$ es el estado inicial.
- $M \subseteq V$ es el conjunto de estados meta (objetivo).

## Enfoque de modelado

El enfoque principal consiste en:

1. **Definir el estado correctamente**: Identificar qué información es necesaria para representar completamente una configuración del sistema.
2. **Enumerar las transiciones**: Especificar todas las acciones posibles desde un estado dado y los estados resultantes.

Una vez modelado el problema como un grafo de estado, podemos aplicar algoritmos de búsqueda de caminos:
- **BFS** (Breadth-First Search): Para grafos sin peso o con pesos uniformes.
- **Dijkstra**: Si los pesos son no negativos.
- **Bellman-Ford**: Para pesos arbitrarios (incluyendo negativos, si no hay ciclos negativos alcanzables).

## Consideraciones importantes

1. **Definir qué es un estado**: Debe capturar toda la información relevante para el problema.
2. **Identificar el estado inicial**: La configuración desde la cual comienza el sistema.
3. **Determinar los estados meta**: Las configuraciones que representan la solución del problema.
4. **Especificar las acciones disponibles**: Las operaciones que permiten transitar entre estados.
5. **Decidir si el grafo es explícito o implícito**:
   - **Grafo explícito**: Se construye completamente antes de la búsqueda.
   - **Grafo implícito (o generado dinámicamente)**: Se construye a medida que se explora, lo que es crucial para espacios de estado muy grandes.

## Tabla de resumen

Concepto | Descripción |
--- | --- |
**Grafo de estado** | Representación de un problema donde los vértices son estados y las aristas son acciones. |
**Estado** | Configuración completa del sistema en un momento dado. |
**Acción** | Operación válida que transforma un estado en otro. |
**Estado inicial** | Configuración desde la cual comienza la búsqueda. |
**Estado(s) meta** | Configuración(es) que representan la solución del problema. |
**Grafo implícito** | Grafo que se genera dinámicamente durante la exploración, no se almacena completamente. |
**Grafo explícito** | Grafo que se construye por completo antes de ejecutar el algoritmo de búsqueda. |
**Algoritmos aplicables** | BFS (pesos uniformes), Dijkstra (pesos no negativos), Bellman-Ford (pesos arbitrarios). |
**Costo de acción** | Peso $w(e)$ asociado a una arista, que representa el costo de realizar esa acción. |

## Comentarios adicionales

- La modelación de problemas mediante grafos de estado es fundamental en inteligencia artificial, planificación, robótica y sistemas de recomendación.
- La eficiencia de la búsqueda en un grafo implícito depende críticamente de una buena definición del estado. Un estado sobredimensionado (con información redundante) generará un espacio de búsqueda innecesariamente grande.
- La **podadura** (pruning) de estados equivalentes o ya visitados es esencial para evitar explosión combinatoria. Técnicas como **memoización** o el uso de tablas de transposición son comunes.
- En problemas de optimización, el costo de las acciones puede no ser constante; puede depender del estado actual o de recursos consumidos, lo que requiere extensiones del modelo básico.
- La elección entre construir el grafo explícitamente o generarlo dinámicamente es un trade-off entre memoria y tiempo de cómputo. Para espacios de estado enormes (como en el juego de ajedrez), la generación implícita es la única opción viable.