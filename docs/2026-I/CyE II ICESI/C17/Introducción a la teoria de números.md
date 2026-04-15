# Introducción a la teoría de números

La teoría de números estudia los números enteros y sus propiedades, con énfasis en la operación de división.

## Definición de divisibilidad

Se dice que un entero $a$ divide a un entero $b$ (denotado $a \mid b$) si y solo si existe un entero $c$ tal que:

$$
b = a \cdot c
$$

## Número de múltiplos

El número de múltiplos de un valor $d$ entre $1$ y $n$ está dado por:

$$
\left\lfloor \frac{n}{d} \right\rfloor
$$

**Comentario sobre la fórmula:** La función piso $\lfloor \cdot \rfloor$ cuenta correctamente los múltiplos enteros de $d$ que no exceden $n$. Por ejemplo, para $n=10$ y $d=3$, $\lfloor 10/3 \rfloor = 3$ (múltiplos: 3, 6, 9).

## Propiedades de la divisibilidad

1. **Propiedad aditiva:** Si $a \mid b$ y $a \mid c$, entonces $a \mid (b + c)$.
2. **Propiedad multiplicativa:** Si $a \mid b$, entonces $a \mid (b \cdot c)$ para cualquier entero $c$.
3. **Propiedad transitiva:** Si $a \mid b$ y $b \mid c$, entonces $a \mid c$.
4. **Combinación lineal:** Si $a \mid b$ y $a \mid c$, entonces $a \mid (m \cdot b + n \cdot c)$ para cualesquiera enteros $m$ y $n$.

## Conceptos teóricos adicionales

- **Número primo:** Entero mayor que 1 que solo es divisible por 1 y por sí mismo.
- **Máximo común divisor (MCD):** El mayor entero positivo que divide a dos o más números sin dejar residuo.
- **Mínimo común múltiplo (MCM):** El menor entero positivo que es múltiplo de dos o más números.
- **Teorema fundamental de la aritmética:** Todo entero mayor que 1 puede representarse de manera única como producto de números primos (salvo el orden de los factores).

## Tabla de resumen

| Concepto | Definición | Ejemplo | Observaciones |
|----------|------------|---------|---------------|
| Divisibilidad ($a \mid b$) | Existe $c \in \mathbb{Z}$ tal que $b = a \cdot c$ | $3 \mid 12$ porque $12 = 3 \cdot 4$ | Relación fundamental en teoría de números |
| Múltiplos hasta $n$ | Cantidad de múltiplos de $d$ en $[1, n]$: $\lfloor n/d \rfloor$ | Para $d=3, n=10$: $\lfloor 10/3 \rfloor = 3$ | Usar función piso, no techo |
| Propiedad aditiva | Si $a \mid b$ y $a \mid c$ entonces $a \mid (b+c)$ | $3 \mid 6$ y $3 \mid 9$ ⇒ $3 \mid 15$ | Base para combinaciones lineales |
| Propiedad multiplicativa | Si $a \mid b$ entonces $a \mid (b \cdot c)$ | $3 \mid 6$ ⇒ $3 \mid (6 \cdot 5 = 30)$ | Se mantiene con cualquier multiplicador entero |
| Transitividad | Si $a \mid b$ y $b \mid c$ entonces $a \mid c$ | $2 \mid 4$ y $4 \mid 12$ ⇒ $2 \mid 12$ | Relación de orden parcial |
| Combinación lineal | Si $a \mid b$ y $a \mid c$ entonces $a \mid (mb+nc)$ | $3 \mid 6$ y $3 \mid 9$ ⇒ $3 \mid (2\cdot6 + 1\cdot9 = 21)$ | Generalización de propiedades anteriores |

## Comentarios adicionales

- La teoría de números es fundamental en criptografía, algoritmos y ciencias de la computación.
- Las propiedades de divisibilidad son la base para algoritmos como el de Euclides para calcular el MCD.
- La corrección de $\lceil n/d \rceil$ a $\lfloor n/d \rfloor$ es importante: el techo sobreestimaría el conteo cuando $n$ no es múltiplo exacto de $d$.
- La propiedad 4 es particularmente útil en demostraciones y en el estudio de ecuaciones diofánticas lineales.
- Se recomienda explorar conceptos como congruencias módulo $n$ y el algoritmo de división como extensiones naturales de esta introducción.