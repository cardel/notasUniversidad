# Familias de Grafos

Las familias de grafos simples (no dirigidos) son:

## Grafo Completo $K_n$

Un grafo completo es aquel que tiene $n$ vértices donde cada vértice está conectado con todos los demás. Es decir, cada vértice tiene grado $n-1$.

El número de aristas es:

$$e = \frac{n(n-1)}{2}$$

**Demostración**: Hay $\binom{n}{2} = \frac{n(n-1)}{2}$ pares de vértices distintos, y cada par está conectado por exactamente una arista.

## Grafo Ciclo $C_n$

Un grafo ciclo consiste en $n$ vértices ($n \geq 3$) conectados formando un ciclo simple. Cada vértice tiene grado 2 y está conectado exactamente a dos vértices adyacentes.

El número de aristas es $n$, ya que cada vértice contribuye con una arista al ciclo.

## Grafo Rueda $W_n$

Se forma tomando un ciclo $C_n$ y añadiendo un vértice central que se conecta con todos los vértices del ciclo.

En este caso tenemos:
- $n$ vértices del ciclo, cada uno con grado 3 (2 conexiones al ciclo + 1 al centro)
- 1 vértice central con grado $n$

Aplicando el teorema de Handshaking:

$$2e = \sum \delta(v_i) = n \cdot 3 + 1 \cdot n = 3n + n = 4n$$

Por lo tanto:

$$e = 2n$$

**Nota sobre notación**: Estamos tomando la definición de Rosen, donde $W_n$ tiene $n+1$ vértices (ciclo $C_n$ más vértice central). Otros autores definen $W_n$ con $n$ vértices totales, lo que implica trabajar con el ciclo $C_{n-1}$ más el vértice central.

## Otras Familias Importantes de Grafos

### Grafo Camino $P_n$
Consiste en $n$ vértices conectados en una secuencia lineal. Tiene $n-1$ aristas. Los vértices extremos tienen grado 1, y los internos tienen grado 2.

### Grafo Bipartito Completo $K_{m,n}$
Los vértices se dividen en dos conjuntos disjuntos de tamaños $m$ y $n$. Cada vértice del primer conjunto está conectado con todos los vértices del segundo conjunto, pero no hay aristas dentro de cada conjunto.

Número de aristas: $e = m \cdot n$

### Grafo Regular
Todos los vértices tienen el mismo grado $r$. Si es $r$-regular con $n$ vértices, entonces:

$$2e = n \cdot r$$

### Grafo Nulo o Vacío
Grafo sin aristas. Cada vértice tiene grado 0.

## Tabla de Resumen de Familias de Grafos

| Familia | Notación | Número de vértices | Número de aristas | Grado de vértices | Propiedades clave |
|---------|----------|-------------------|-------------------|-------------------|-------------------|
| **Completo** | $K_n$ | $n$ | $\frac{n(n-1)}{2}$ | $n-1$ (todos) | Máxima conectividad; clique máximo. |
| **Ciclo** | $C_n$ ($n \geq 3$) | $n$ | $n$ | 2 (todos) | Grafo 2-regular; conexo; Euleriano. |
| **Rueda** | $W_n$ (Rosen) | $n+1$ | $2n$ | Centro: $n$; Ciclo: 3 | Planar para $n \geq 3$; Hamiltonian. |
| **Camino** | $P_n$ | $n$ | $n-1$ | Extremos: 1; Internos: 2 | Árbol con dos hojas; acíclico. |
| **Bipartito completo** | $K_{m,n}$ | $m+n$ | $m \cdot n$ | Conjunto 1: $n$; Conjunto 2: $m$ | No contiene ciclos impares. |
| **$r$-Regular** | - | $n$ | $\frac{nr}{2}$ | $r$ (todos) | Simétrico; ejemplos: $C_n$ (2-regular), $K_n$ ($(n-1)$-regular). |
| **Nulo/Vacío** | $\overline{K_n}$ | $n$ | 0 | 0 (todos) | Complemento de $K_n$; sin conexiones. |

## Comentarios Adicionales

- **Importancia de las familias**: Estas familias sirven como bloques de construcción en teoría de grafos y aparecen frecuentemente en demostraciones, ejemplos y contraejemplos.

- **Relaciones entre familias**:
  - $C_n$ es un caso especial de grafo 2-regular.
  - $K_n$ es $(n-1)$-regular.
  - $W_n$ contiene a $C_n$ como subgrafo.
  - $P_n$ es un subgrafo de $C_{n+1}$.

- **Propiedades estructurales**:
  - $K_n$ es Hamiltonian para $n \geq 3$ y Euleriano para $n$ impar.
  - $C_n$ es Euleriano y Hamiltonian para todo $n \geq 3$.
  - $W_n$ es siempre Hamiltonian y Euleriano solo cuando $n$ es impar.

- **Aplicaciones**:
  - $K_n$: Modela redes completamente conectadas (cliques en redes sociales).
  - $C_n$: Anillos de comunicación, redes token-ring.
  - $W_n$: Redes con nodo central (estrellas con anillo periférico).
  - $K_{m,n}$: Sistemas de recomendación, matching problems.

- **Notación alternativa**: Es importante verificar la definición de $W_n$ en cada texto, ya que existen convenciones diferentes. En algunos textos, $W_n$ denota una rueda con $n$ vértices totales (incluyendo el centro), lo que corresponde a $W_{n-1}$ en la notación de Rosen.

- **Generalizaciones**: Estas familias pueden extenderse a grafos dirigidos (ej: torneos como $K_n$ dirigido), ponderados, o multigrafos.