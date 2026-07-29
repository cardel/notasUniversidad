Una relación permite asociar dos elementos dentro del producto cartesiano de dos conjuntos.

$A = \{1,2,3\}$ $B=\{a,b\}$
$A \times B = \{(1,a),(1,b),(2,a),(2,b),(3,a),(3,b)\}$

Cuatro tipos

1. Reflexiva, $\forall a \in A, (a,a) \in R$
2. Simetrica, $\forall (a,b) \in R, (b,a) \in R$
3. Transitiva, $\forall (a,b) \wedge (b,c) \in R \therefore (a,c) \in R$
4. Antisimetrica $\forall (a,b) \in R, \therefore (b,a) \not \in R, a != b$

Tipos de relaciones

1. Equivalencia: Reflexiva, simetrica y transitiva
2. Orden parcial: Reflexiva, antisimetrica y transitiva

# Composición de relaciones

La composición de una relación $R o S$ va tomar cada elemento $(a,b) \in R \wedge (b,c) \in S \therefore (a,c) \in RoS$

# Potencia de las relaciones

La potencia de una relación está definida como

$$
R^n = \begin{cases}
R & \text{si } n = 1 \\
R^{n-1} \circ R & \text{en otro caso}
\end{cases}
$$


## Ejemplo de composición de relaciones

Sean los conjuntos:
- $A = \{1, 2, 3\}$
- $B = \{a, b, c\}$
- $C = \{x, y, z\}$

Y las relaciones:
- $R \subseteq A \times B = \{(1,a), (2,b), (3,c)\}$
- $S \subseteq B \times C = \{(a,x), (b,y), (c,z)\}$

La composición $S \circ R$ (o $R \circ S$ dependiendo de la convención) sería:
- $(1,a) \in R$ y $(a,x) \in S$ → $(1,x) \in S \circ R$
- $(2,b) \in R$ y $(b,y) \in S$ → $(2,y) \in S \circ R$
- $(3,c) \in R$ y $(c,z) \in S$ → $(3,z) \in S \circ R$

Por lo tanto: $S \circ R = \{(1,x), (2,y), (3,z)\}$

## Ejemplo de potencia de relaciones

Sea $A = \{1, 2, 3\}$ y la relación $R \subseteq A \times A = \{(1,2), (2,3)\}$

Calculamos las potencias:

**$R^1 = R = \{(1,2), (2,3)\}$**

**$R^2 = R^1 \circ R$:**
- $(1,2) \in R$ y $(2,3) \in R$ → $(1,3) \in R^2$
- $(2,3) \in R$ pero no hay $(3,?) \in R$ → no produce nuevo par
- Por lo tanto: $R^2 = \{(1,3)\}$

**$R^3 = R^2 \circ R$:**
- $(1,3) \in R^2$ pero no hay $(3,?) \in R$ → no produce nuevo par
- Por lo tanto: $R^3 = \emptyset$ (relación vacía)

**$R^4 = R^3 \circ R = \emptyset \circ R = \emptyset$**

Y así sucesivamente: $R^n = \emptyset$ para $n \geq 3$

## Ejemplo con relación reflexiva

Sea $A = \{1, 2\}$ y $R = \{(1,1), (1,2), (2,2)\}$ (relación reflexiva)

**$R^1 = R$**

**$R^2 = R \circ R$:**
- $(1,1) \circ (1,1)$ → $(1,1)$
- $(1,1) \circ (1,2)$ → $(1,2)$
- $(1,2) \circ (2,2)$ → $(1,2)$
- $(2,2) \circ (2,2)$ → $(2,2)$
- Resultado: $R^2 = \{(1,1), (1,2), (2,2)\} = R$

En este caso, $R^n = R$ para todo $n \geq 1$ porque $R$ es transitiva y contiene todos los pares necesarios para la composición.