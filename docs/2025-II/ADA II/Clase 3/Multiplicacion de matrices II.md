# Caracterización de la Subestructura Óptima

## Formulación Matemática

$$
M[i,j] = 
\begin{cases} 
0 & \text{si } i = j \\
\min\limits_{i \leq k < j} \left\{ M[i,k] + M[k+1,j] + p_{i-1} \cdot p_k \cdot p_j \right\} & \text{si } i < j 
\end{cases}
$$

## Análisis de la Subestructura Óptima

### Ejemplo concreto:
- $M_1 = 50 \times 100$
- $M_2 = 100 \times 5$
- $M_3 = 5 \times 20$
- $M_4 = 20 \times 10$

### Matriz de subproblemas:

| i\j | 1 | 2 | 3 | 4 |
|-----|---|---|---|---|
| 1 | M[1,1] | M[1,2] | M[1,3] | **M[1,4]** |
| 2 | X | M[2,2] | M[2,3] | M[2,4] |
| 3 | X | X | M[3,3] | M[3,4] |
| 4 | X | X | X | M[4,4] |

## Dependencias Computacionales

### Problema principal: M[1,4]
Depende de:
- k=1: M[1,1] + M[2,4] + costo(50,100,10)
- k=2: M[1,2] + M[3,4] + costo(50,5,10)
- k=3: M[1,3] + M[4,4] + costo(50,20,10)

### Subproblemas y sus dependencias:

**M[1,2]**: 
- k=1: M[1,1] + M[2,2] + costo(50,100,5)

**M[1,3]**:
- k=1: M[1,1] + M[2,3] + costo(50,100,20)
- k=2: M[1,2] + M[3,3] + costo(50,5,20)

**M[2,3]**:
- k=2: M[2,2] + M[3,3] + costo(100,5,20)

**M[2,4]**:
- k=2: M[2,2] + M[3,4] + costo(100,5,10)
- k=3: M[2,3] + M[4,4] + costo(100,20,10)

**M[3,4]**:
- k=3: M[3,3] + M[4,4] + costo(5,20,10)

## Estrategia de Llenado por Diagonales

### Orden de computación:
1. **Diagonal principal**: Casos base (M[i,i] = 0)
2. **Primera diagonal**: Subproblemas de longitud 2 (M[i,i+1])
3. **Segunda diagonal**: Subproblemas de longitud 3 (M[i,i+2])
4. **Tercera diagonal**: Problema principal (M[1,4])

### Propiedades de la subestructura óptima:
- Cada solución óptima contiene soluciones óptimas de subproblemas
- Los subproblemas se superponen (propiedad de programación dinámica)
- El orden de computación garantiza que al calcular M[i,j], todos los M[i,k] y M[k+1,j] ya han sido calculados
- La complejidad es $O(n^3)$ debido a los tres niveles de anidamiento

Esta estructura garantiza que la solución encontrada para M[1,4] será globalmente óptima, aprovechando las soluciones óptimas de todos los subproblemas intermedios.


# Solución Detallada del Problema MCM

## Datos de Entrada
- $M_1 = 50 \times 100$ (dimensiones: $p_0=50$, $p_1=100$)
- $M_2 = 100 \times 5$ (dimensiones: $p_1=100$, $p_2=5$)
- $M_3 = 5 \times 20$ (dimensiones: $p_2=5$, $p_3=20$)
- $M_4 = 20 \times 10$ (dimensiones: $p_3=20$, $p_4=10$)
- Vector de dimensiones: $P = [50, 100, 5, 20, 10]$

## Cálculo Detallado de Subproblemas

### Casos Base (Diagonal Principal)
- $M[1,1] = 0$ (matriz única)
- $M[2,2] = 0$ (matriz única)  
- $M[3,3] = 0$ (matriz única)
- $M[4,4] = 0$ (matriz única)

### Subproblemas de Longitud 2

**M[1,2]** (Multiplicar $M_1 \times M_2$):
- $k=1$: $M[1,1] + M[2,2] + p_0 \cdot p_1 \cdot p_2 = 0 + 0 + 50 \cdot 100 \cdot 5 = 25,000$
- **Resultado: 25,000**

**M[2,3]** (Multiplicar $M_2 \times M_3$):
- $k=2$: $M[2,2] + M[3,3] + p_1 \cdot p_2 \cdot p_3 = 0 + 0 + 100 \cdot 5 \cdot 20 = 10,000$
- **Resultado: 10,000**

**M[3,4]** (Multiplicar $M_3 \times M_4$):
- $k=3$: $M[3,3] + M[4,4] + p_2 \cdot p_3 \cdot p_4 = 0 + 0 + 5 \cdot 20 \cdot 10 = 1,000$
- **Resultado: 1,000**

### Subproblemas de Longitud 3

**M[1,3]** (Multiplicar $M_1 \times M_2 \times M_3$):
- $k=1$: $M[1,1] + M[2,3] + p_0 \cdot p_1 \cdot p_3 = 0 + 10,000 + 50 \cdot 100 \cdot 20 = 110,000$
- $k=2$: $M[1,2] + M[3,3] + p_0 \cdot p_2 \cdot p_3 = 25,000 + 0 + 50 \cdot 5 \cdot 20 = 30,000$
- **Mínimo: 30,000** (con $k=2$)

**M[2,4]** (Multiplicar $M_2 \times M_3 \times M_4$):
- $k=2$: $M[2,2] + M[3,4] + p_1 \cdot p_2 \cdot p_4 = 0 + 1,000 + 100 \cdot 5 \cdot 10 = 6,000$
- $k=3$: $M[2,3] + M[4,4] + p_1 \cdot p_3 \cdot p_4 = 10,000 + 0 + 100 \cdot 20 \cdot 10 = 30,000$
- **Mínimo: 6,000** (con $k=2$)

### Problema Principal (Longitud 4)

**M[1,4]** (Multiplicar $M_1 \times M_2 \times M_3 \times M_4$):
- $k=1$: $M[1,1] + M[2,4] + p_0 \cdot p_1 \cdot p_4 = 0 + 6,000 + 50 \cdot 100 \cdot 10 = 56,000$
- $k=2$: $M[1,2] + M[3,4] + p_0 \cdot p_2 \cdot p_4 = 25,000 + 1,000 + 50 \cdot 5 \cdot 10 = 28,500$
- $k=3$: $M[1,3] + M[4,4] + p_0 \cdot p_3 \cdot p_4 = 30,000 + 0 + 50 \cdot 20 \cdot 10 = 40,000$
- **Mínimo: 28,500** (con $k=2$)

## Matriz de Costos Final

| i\j | 1     | 2      | 3      | 4      |
|-----|-------|--------|--------|--------|
| 1   | 0     | 25,000 | 30,000 | 28,500 |
| 2   | -     | 0      | 10,000 | 6,000  |
| 3   | -     | -      | 0      | 1,000  |
| 4   | -     | -      | -      | 0      |

## Reconstrucción de la Solución

1. **M[1,4]**: $k=2$ → $(M_1 \times M_2) \times (M_3 \times M_4)$
2. **M[1,2]**: $k=1$ → $M_1 \times M_2$ (costo: 25,000)
3. **M[3,4]**: $k=3$ → $M_3 \times M_4$ (costo: 1,000)
4. **Multiplicación final**: $(50 \times 5) \times (5 \times 10)$ → $50 \times 5 \times 10 = 2,500$

**Costo total**: $25,000 + 1,000 + 2,500 = 28,500$ multiplicaciones

## Matriz de Solución (Puntos de División Óptimos)

| i\j | 1 | 2 | 3 | 4 |
|-----|---|---|---|---|
| 1   | 1 | 1 | 2 | 2 |
| 2   | - | 2 | 2 | 2 |
| 3   | - | - | 3 | 3 |
| 4   | - | - | - | 4 |

## Cálculo de la Solución General M[1,4]

**Fórmula aplicada:**

$$M[1,4] = \min\limits_{1 \leq k < 4} \left\{ M[1,k] + M[k+1,4] + p_0 \cdot p_k \cdot p_4 \right\}$$

**Evaluación de las tres opciones:**

1. **k=1:** $M[1,1] + M[2,4] + 50 \cdot 100 \cdot 10 = 0 + 6000 + 50000 = 56000$
2. **k=2:** $M[1,2] + M[3,4] + 50 \cdot 5 \cdot 10 = 25000 + 1000 + 2500 = 28500$ ✓
3. **k=3:** $M[1,3] + M[4,4] + 50 \cdot 20 \cdot 10 = 30000 + 0 + 10000 = 40000$

**Solución óptima:** k=2 (valor mínimo: 28500)

**Decisión:** Dividir en $M[1,2]$ y $M[3,4]$

La agrupación óptima es: $((M_1 \times M_2) \times (M_3 \times M_4))$
Explica este codigo siguiendo el contexto que llevamos, ten en cuenta explicar donde esta la subestructura optima, como se modela y como se llena

# Implementación

```python
import numpy as np


def mcm(p):
    """
    p: es el arreglo que contiene los tamaño de las matrices
    mi = p[i-1]*p[i]
    """
    n = p.shape[0] - 1
    costos = np.zeros((n, n))
    decisiones = np.zeros((n, n))

    # Llenar soluciones triviales
    for i in range(0, n):
        costos[i, i] = 0
        decisiones[i, i] = i

    # Llenar soluciones no triviales
    for c in range(1, n):
        for i in range(0, n):
            j = i + c
            if j >= n:
                break

            # Decisiones k = i,..j-1
            val_min = float("inf")
            decision = 0
            for k in range(i, j):
                costo = costos[i, k] + costos[k + 1, j] + p[i] * p[k + 1] * p[j + 1]
                decision = k if costo < val_min else decision
                val_min = costo if costo < val_min else val_min

            costos[i, j] = val_min
            decisiones[i, j] = decision

    return costos, decisiones


if __name__ == "__main__":
    p = np.array([50, 100, 5, 20, 10])
    print(mcm(p), sep="\n")
```

Respuesta

```python
(array([[    0., 25000., 30000., 28500.],
       [    0.,     0., 10000.,  6000.],
       [    0.,     0.,     0.,  1000.],
       [    0.,     0.,     0.,     0.]]), 
       
       
array([[0., 0., 1., 1.],
       [0., 1., 1., 1.],
       [0., 0., 2., 2.],
       [0., 0., 0., 3.]]))
```

# Análisis del Código de Multiplicación de Matrices

## Estructura de la Implementación

### Parámetros y Inicialización
```python
n = p.shape[0] - 1  # Número de matrices (4 en nuestro ejemplo)
costos = np.zeros((n, n))      # Matriz M[i,j] de costos mínimos
decisiones = np.zeros((n, n))  # Matriz de puntos de división óptimos
```

### Subestructura Óptima Implementada
La **subestructura óptima** se modela mediante la relación de recurrencia:
```python
costo = costos[i, k] + costos[k+1, j] + p[i] * p[k+1] * p[j+1]
```
Esto corresponde exactamente a:

$$M[i,j] = M[i,k] + M[k+1,j] + p_{i} \cdot p_{k+1} \cdot p_{j+1}$$

### Estrategia de Llenado por Diagonales
```python
for c in range(1, n):      # c = longitud de la cadena - 1
    for i in range(0, n):  # i = índice inicial
        j = i + c          # j = índice final
```
Este doble bucle garantiza que se llenen las diagonales en el orden correcto:
1. **Diagonal 0**: Casos base (c=0)
2. **Diagonal 1**: Subproblemas de longitud 2 (c=1)
3. **Diagonal 2**: Subproblemas de longitud 3 (c=2)
4. **Diagonal 3**: Problema principal (c=3)

### Búsqueda del Óptimo
```python
for k in range(i, j):  # Evaluar todos los puntos de división posibles
    costo = costos[i, k] + costos[k+1, j] + p[i] * p[k+1] * p[j+1]
    decision = k if costo < val_min else decision
    val_min = costo if costo < val_min else val_min
```
Aquí se implementa la **decisión óptima**: encontrar el k que minimice el costo total.

## Resultados Obtenidos

### Matriz de Costos
```
[[    0. 25000. 30000. 28500.]
 [    0.     0. 10000.  6000.]
 [    0.     0.     0.  1000.]
 [    0.     0.     0.     0.]]
```
- **M[0,3] = 28500**: Costo mínimo para multiplicar M₁×M₂×M₃×M₄
- Coincide exactamente con nuestros cálculos manuales

### Matriz de Decisiones
```
[[0. 0. 1. 1.]
 [0. 1. 1. 1.]
 [0. 0. 2. 2.]
 [0. 0. 0. 3.]]
```
- **decisiones[0,3] = 1**: Dividir en k=1 → (M₁×M₂) × (M₃×M₄)
- **decisiones[0,2] = 1**: M[1,3] se divide en k=1 → M₁ × (M₂×M₃)
- **decisiones[1,3] = 1**: M[2,4] se divide en k=1 → M₂ × (M₃×M₄)

## Corrección en los Índices
Nota: Los índices en Python comienzan en 0, por lo que:
- `p[i]` corresponde a $p_i$ (dimensión de fila de Mᵢ₊₁)
- `p[k+1]` corresponde a $p_{k+1}$ (dimensión de columna de Mₖ₊₁)
- `p[j+1]` corresponde a $p_{j+1}$ (dimensión de columna de Mⱼ₊₁)

La implementación captura perfectamente la **subestructura óptima** del problema y el **orden de llenado** garantiza que cada subproblema se resuelve antes de que sea needed por problemas más grandes.