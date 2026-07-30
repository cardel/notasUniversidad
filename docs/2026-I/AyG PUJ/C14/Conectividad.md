# Conectividad en grafos

## Paseo

Es una secuencia de vértices conectados por aristas, donde estos se pueden repetir.

## Camino

Es un paseo que no permite repetir vértices.

## Ciclo

Es un camino cuyo vértice inicial es igual al final.

# Distancia

La distancia entre $u$ y $v$ es el número de aristas en el camino más corto que los conecta. Si no existe tal camino, la distancia es $\infty$.

# Lema del subcamino

Propiedad de subestructura óptima: en el camino más corto entre $u$ y $v$, hay una secuencia de vértices $(u, a_1, a_2, \ldots, a_n, v)$. Cualquier subcamino entre dos vértices de este camino también es óptimo (es decir, es el camino más corto entre esos dos vértices).

# Alcanzabilidad

$v$ es alcanzable desde $u$ si existe un camino de $u$ a $v$.

La relación de alcanzabilidad cumple las propiedades de relación de equivalencia en grafos no dirigidos:
- **Reflexiva**: Todo vértice es alcanzable desde sí mismo (camino de tamaño 0).
- **Simétrica**: Si $v$ es alcanzable desde $u$, entonces $u$ es alcanzable desde $v$.
- **Transitiva**: Si $w$ es alcanzable desde $u$ y $v$ es alcanzable desde $w$, entonces $v$ es alcanzable desde $u$.

**Nota**: En grafos dirigidos, la relación de alcanzabilidad no necesariamente es simétrica.

# Grafo conexo

Un grafo no dirigido $G(V,E)$ es conexo si para todo par de vértices $u,v \in V$, existe un camino entre ellos.

**Condición necesaria (pero no suficiente)**: Para que un grafo no dirigido sea conexo, debe cumplir $|E| \geq |V| - 1$.

# Conceptos adicionales

## Componente conexa

Subgrafo conexo maximal de un grafo no dirigido. Es decir, un subconjunto de vértices donde:
1. Existe un camino entre cualquier par de vértices en el subconjunto.
2. No se puede agregar ningún vértice adicional del grafo sin perder la propiedad de conexidad.

## Punto de articulación (vértice de corte)

Vértice cuya eliminación (junto con sus aristas incidentes) desconecta el grafo o aumenta el número de componentes conexas.

## Puente (arista de corte)

Arista cuya eliminación desconecta el grafo o aumenta el número de componentes conexas.

## Conectividad en grafos dirigidos

- **Conectividad fuerte**: Un grafo dirigido es fuertemente conexo si para todo par de vértices $u,v$, existe un camino dirigido de $u$ a $v$ y de $v$ a $u$.
- **Conectividad débil**: Un grafo dirigido es débilmente conexo si al ignorar la dirección de las aristas, el grafo subyacente no dirigido es conexo.

# Tabla de Resumen

| Concepto | Definición | Propiedades/Notas |
|----------|------------|-------------------|
| Paseo | Secuencia de vértices conectados por aristas, permitiendo repeticiones. | No restringe repetición de vértices o aristas. |
| Camino | Paseo sin vértices repetidos. | También llamado "camino simple". |
| Ciclo | Camino que comienza y termina en el mismo vértice. | Longitud mínima: 3 (en grafos simples). |
| Distancia | Número de aristas en el camino más corto entre dos vértices. | Si no hay camino: $\infty$. Métrica en grafos no dirigidos. |
| Lema del subcamino | Cualquier subcamino de un camino más corto es también un camino más corto. | Propiedad fundamental para algoritmos como Dijkstra. |
| Alcanzabilidad | Existencia de un camino dirigido de $u$ a $v$. | Relación de equivalencia en no dirigidos; en dirigidos no es simétrica. |
| Grafo conexo | Grafo no dirigido con camino entre todo par de vértices. | Condición necesaria: $\lvert E \rvert \geq \lvert V \rvert-1$. |
| Componente conexa | Subgrafo conexo maximal. | Particiona el grafo en subgrafos disjuntos conexos. |
| Punto de articulación | Vértice cuya eliminación desconecta el grafo. | Importante en análisis de redes vulnerables. |
| Puente | Arista cuya eliminación desconecta el grafo. | También llamada "arista de corte". |
| Conectividad fuerte | En dirigidos: camino bidireccional entre todo par de vértices. | Más restrictiva que la conexidad en no dirigidos. |
| Conectividad débil | En dirigidos: conexo al ignorar direcciones. | Menos informativa que la conectividad fuerte. |

# Comentarios Adicionales

- La **conectividad** es una propiedad fundamental que determina la "robustez" de una red. Un grafo con alta conectividad (muchos caminos alternativos) es más resistente a fallos.
- El **número de componentes conexas** es un invariante importante: un grafo es conexo si y solo si tiene exactamente una componente conexa.
- En aplicaciones prácticas (redes de comunicación, redes sociales, circuitos), identificar **puntos de articulación** y **puentes** es crucial para fortalecer sistemas críticos.
- Para grafos dirigidos, los **componentes fuertemente conexos** pueden encontrarse usando algoritmos como el de Kosaraju o Tarjan, y son útiles en análisis de dependencias (compiladores, scheduling).
- La **distancia** define una métrica en grafos no dirigidos conexos, cumpliendo: no negatividad, identidad de indiscernibles, simetría y desigualdad triangular.
- La **condición $|E| \geq |V|-1$** para conexidad es necesaria pero no suficiente: un grafo puede tener suficientes aristas pero estar mal conectado (ej: dos componentes grandes con una arista extra).