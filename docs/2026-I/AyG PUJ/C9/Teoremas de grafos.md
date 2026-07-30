# Teorema de Handshaking (Apretón de Manos)

## Grafos No Dirigidos

1. **Definición de grado de un vértice ($\delta(v)$)**: Número de aristas incidentes a un vértice. En un grafo simple, cada arista contribuye con 1 al grado de cada uno de sus dos vértices extremos.

2. **Teorema de Handshaking para grafos no dirigidos**:

    $$
    2e = \sum_{v_i \in V} \delta(v_i)
    $$

    **Explicación**: Cada arista conecta dos vértices, por lo que contribuye exactamente 2 a la suma total de grados. Por lo tanto, la suma de los grados de todos los vértices es igual al doble del número de aristas.

    **Corolario**: La suma de los grados de todos los vértices es siempre un número par. Esto implica que el número de vértices con grado impar debe ser par.

## Grafos Dirigidos

1. **Grado de entrada ($\delta^-(v)$)**: Número de aristas que tienen al vértice $v$ como destino (aristas que "entran" al nodo).

2. **Grado de salida ($\delta^+(v)$)**: Número de aristas que tienen al vértice $v$ como origen (aristas que "salen" del nodo).

3. **Teorema para grafos dirigidos**:

    $$
    e = \sum_{v_i \in V} \delta^-(v_i) = \sum_{v_i \in V} \delta^+(v_i)
    $$

    **Explicación**: Cada arista dirigida tiene exactamente un vértice de origen y un vértice de destino. Por lo tanto, la suma total de grados de entrada de todos los vértices es igual al número total de aristas, y lo mismo ocurre con la suma total de grados de salida.

## Conceptos Teóricos Adicionales

- **Grado total en grafos dirigidos**: Para un vértice $v$ en un grafo dirigido, el grado total es $\delta(v) = \delta^-(v) + \delta^+(v)$.
- **Aplicaciones del teorema**: 
  - Verificar la consistencia de representaciones de grafos.
  - Demostrar propiedades sobre la existencia de vértices con ciertos grados.
  - En problemas de redes, modelar flujos de entrada/salida.
- **Relación con caminos y ciclos**: En un grafo no dirigido, todos los vértices en un camino de Euler tienen grado par, excepto posiblemente los dos extremos.

## Tabla de Resumen de Conceptos

| Concepto | Definición | Fórmula/Propiedad | Aplicación |
|----------|------------|-------------------|------------|
| **Grado en grafo no dirigido ($\delta(v)$)** | Número de aristas incidentes al vértice $v$. | $\delta(v) = \|\{e \in E : v \in e\}\|$ | Medir conectividad local. |
| **Teorema de Handshaking (no dirigido)** | La suma de grados es el doble del número de aristas. | $2\|E\| = \sum_{v \in V} \delta(v)$ | Verificar consistencia; demostrar existencia de vértices de grado impar. |
| **Grado de entrada ($\delta^-(v)$)** | Número de aristas que llegan al vértice $v$. | $\delta^-(v) = \|\{e=(u,v) \in E\}\|$ | Análisis de redes de influencia o dependencia. |
| **Grado de salida ($\delta^+(v)$)** | Número de aristas que salen del vértice $v$. | $\delta^+(v) = \|\{e=(v,u) \in E\}\|$ | Análisis de procesos de difusión o flujos. |
| **Teorema para grafos dirigidos** | La suma de grados de entrada = suma de grados de salida = número de aristas. | $\|E\| = \sum_{v \in V} \delta^-(v) = \sum_{v \in V} \delta^+(v)$ | Validar representaciones de digrafos; balance de flujos. |
| **Vértices de grado impar** | En grafos no dirigidos, el número de vértices con grado impar es par. | Corolario del teorema de Handshaking. | Problemas de recorridos (Eulerian paths). |

## Comentarios Adicionales

- **Importancia del teorema**: El Teorema de Handshaking es fundamental en teoría de grafos, proporcionando una relación simple pero poderosa entre la suma de grados y el número de aristas. Sirve como herramienta básica para demostraciones y verificaciones.

- **Analogía del nombre**: El nombre "apretón de manos" proviene de la analogía donde cada arista representa un apretón de manos entre dos personas (vértices), y cada apretón contribuye 1 al "recuento de apretones" de cada participante.

- **Extensión a multigrafos y pseudografos**: El teorema también se aplica a multigrafos y pseudografos, donde los bucles contribuyen con 2 al grado del vértice (ya que ambos extremos de la arista son el mismo vértice).

- **Aplicaciones algorítmicas**: En análisis de redes sociales, los grados de entrada/salida corresponden a métricas como "seguidores" y "seguidos". En circuitos eléctricos, representan conservación de corriente (Ley de Kirchhoff).

- **Relación con otros teoremas**: Este teorema es la base para resultados más avanzados como el Lema del Apretón de Manos para árboles ($\sum \delta(v) = 2(n-1)$ para árboles con $n$ vértices) y teoremas sobre la existencia de ciclos Eulerianos.

- **Verificación práctica**: Al construir o analizar un grafo, se puede usar este teorema para verificar rápidamente si los grados reportados son consistentes con el número de aristas.