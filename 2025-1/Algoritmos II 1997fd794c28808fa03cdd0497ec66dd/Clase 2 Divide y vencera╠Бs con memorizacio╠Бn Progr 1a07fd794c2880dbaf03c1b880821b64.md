# Clase 2: Divide y vencerás con memorización. Programación dinamica

```
max(LCS[i-1,j], LCS[i,j-1]) si X[i] ≠ Y[j]

```

Divide y vencerás con memorización

1. Se tienen subproblemas repetidos
2. Se utiliza una estructura de datos para almacenar la solución
3. Se deben tener en cuenta que los subproblemas deben ser **independientes**

---

Recursión

- Computacionalmente es más costosa
- Memorización es más complicada de implementar

---

Enfoque top-down

1. Se calcula desde la general hasta la trivial
2. Requiere recursión

```jsx
def fib(n, memo={}):
	if n <= 1:
		return n
	else:
		if n is memo:
			return memo[n]
		else:
			memo[n] = fib(n-1)+fib(n-2)
			return memo[n]
```

El tiempo de complejidad es más inestable por los llamados recursivos

---

Enfoque bottom-up

- Se calcula de las triviales a la general
- No requiere recursión

```jsx
memo[0] = 0
memo[1] = 1
for i in range(2,n+1):
	memo[i] = memo[i-1]+memo[i-2]
```

## Tener en cuenta

La estructura de datos almacena las **soluciones a los subproblemas**

# Programación dinámica

Caracteristicas

- Subproblemas repetidos
- Problema de optimización
- Se debe aplicar divide y vencerás

---

Subestructura optima

- Estructura de datos
- Almacena las soluciones optimas a los subproblemas
- La vamos a llenar bajo el enfoque bottom-up (triviales y poco a poco hasta llegar a la general)
- La subestructura optima se llena de acuerdo a cómo se resuelve el problema

# LCS (Subsecuencia común más larga)

Problema

El problema de la subsecuencia común más larga (LCS - Longest Common Subsequence) consiste en encontrar la secuencia más larga que es común entre dos secuencias dadas.

Por ejemplo:

X = ACDEDEF

Y = ACEDEDDF

La subsecuencia común más larga sería: ACDEDF

Este es un problema que se resuelve usando programación dinámica ya que tiene las siguientes características:

- Tiene subproblemas repetidos
- Es un problema de optimización
- Se debe aplicar divide y vencerás

Para resolverlo se utiliza una subestructura óptima que:

- Es una estructura de datos que almacena las soluciones óptimas a los subproblemas
- Se llena bajo el enfoque bottom-up, empezando desde los casos triviales hasta llegar a la solución general
- En el caso específico del LCS, la subestructura se llena comenzando con los casos donde i = 0 o j = 0, y luego se procede columna por columna de izquierda a derecha, y fila por fila de arriba hacia abajo

---

Caracterización

La fórmula de caracterización para LCS (Longest Common Subsequence) es:

```python
LCS[i,j] = {
    0                           si i = 0 o j = 0
    LCS[i-1,j-1] + 1           si X[i] = Y[j]
    max(LCS[i-1,j], LCS[i,j-1]) si X[i] ≠ Y[j]
}

```

Donde:

- i y j son las posiciones en las secuencias X e Y respectivamente
- LCS[i,j] representa la longitud de la subsecuencia común más larga hasta las posiciones i y j

Esta fórmula se utiliza para llenar la subestructura óptima bajo el enfoque bottom-up, comenzando desde los casos triviales (i=0 o j=0) y avanzando columna por columna de izquierda a derecha, y fila por fila de arriba hacia abajo.

### Ejemplo

Aquí está la subestructura óptima para calcular el LCS entre LDEFEA y LCADEA:

```
      L  C  A  D  E  A
   0  0  0  0  0  0  0
L  0  1  1  1  1  1  1
D  0  1  1  1  2  2  2
E  0  1  1  1  2  3  3
F  0  1  1  1  2  3  3
E  0  1  1  1  2  3  3
A  0  1  1  2  2  3  4
```

Esta matriz se construye siguiendo la caracterización del LCS:

- Si i=0 o j=0, el valor es 0
- Si los caracteres son iguales (X[i] = Y[j]), se suma 1 al valor de la diagonal superior izquierda
- Si los caracteres son diferentes, se toma el máximo entre el valor de arriba y el de la izquierda

La matriz se llena de izquierda a derecha y de arriba hacia abajo.

La subsecuencia común más larga tendrá longitud 4 (el valor en la última celda de la matriz) y es "LDEA".

# Resumen

Aquí está un resumen de los conceptos principales:

**Divide y Vencerás con Memorización:**

- Utiliza estructura de datos para almacenar soluciones de subproblemas independientes

**Enfoques:**

- Top-down: usa recursión, va de lo general a lo trivial
- Bottom-up: no usa recursión, va de lo trivial a lo general

**Programación Dinámica:**

- Requiere subproblemas repetidos, optimización y divide y vencerás

**LCS (Longest Common Subsequence):**

- Encuentra la secuencia más larga común entre dos secuencias
- Usa una estructura óptima que se llena bottom-up
- Se resuelve siguiendo una fórmula de caracterización específica que considera casos base y recursivos