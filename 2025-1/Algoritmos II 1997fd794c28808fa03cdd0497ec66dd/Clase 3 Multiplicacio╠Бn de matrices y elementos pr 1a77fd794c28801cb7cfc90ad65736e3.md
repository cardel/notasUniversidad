# Clase 3: Multiplicación de matrices y elementos programación dinámica

# Multiplicación de matrices

[Notas1_annotated.pdf](Clase%203%20Multiplicacio%CC%81n%20de%20matrices%20y%20elementos%20pr%201a77fd794c28801cb7cfc90ad65736e3/Notas1_annotated.pdf)

# Estructura de programación dinámica

Subestructura optima

- Estructura que almacena la solución a los subproblemas
- Permite obtener calculos si estos han sido resueltos
- Se llama subestructura óptima porque tiene las **soluciones optimas a cada subproblema**

---

Diseño de la subestructura optima

- Propiedad de escogencia: por el k en el problema de matrices por el minimo del número de multiplicaciones, no es igual me voy por el máximo entre Xm y Yn-1 o Xm-1 o Yn
- El criterio de la propiedad de escogencia es del optimización
- Debe contener la solución optima a los subproblemas
- Usualmente existen dos estructuras: estructura de costos y la estructura escogencia (que se eligio para un subproblema dado)
- El tamaño del espacio de los subproblema depende que se mueve en el problema.
    - LCS: El ultimo de x y el ultimo y: 2 dimensiones
    - MCM: i..k, k+1..j   2 dimensiones un problema va desde i hasta k y el otro k+1 hasta j

---

# 

El Problema de Multiplicación de Matrices en Programación Dinámica es un problema clásico de optimización donde buscamos minimizar el número de operaciones necesarias para multiplicar una cadena de matrices.

## Fundamentos del problema

La multiplicación de matrices no es conmutativa, pero es asociativa. Esto significa que el orden en que agrupamos las multiplicaciones afecta al número total de operaciones, aunque el resultado final sea el mismo.

Por ejemplo, si tenemos matrices M₁, M₂, M₃ con dimensiones:

- M₁: 10×5
- M₂: 5×50
- M₃: 50×100

Podemos multiplicarlas de dos formas:

- (M₁×M₂)×M₃ = 10×5×50 + 10×50×100 = 2,500 + 50,000 = 52,500 operaciones
- M₁×(M₂×M₃) = 5×50×100 + 10×5×100 = 25,000 + 5,000 = 30,000 operaciones

La segunda opción requiere significativamente menos operaciones.

## Estructura de la solución

Este problema se resuelve usando programación dinámica con las siguientes características:

- **Subestructura óptima:** Almacena las soluciones óptimas a los subproblemas, lo que nos permite reutilizar cálculos ya resueltos.
- **Dimensionalidad:** Es un problema de 2 dimensiones donde los subproblemas van desde i hasta k y desde k+1 hasta j.
- **Propiedad de escogencia:** Se basa en seleccionar el valor de k que minimiza el número de multiplicaciones.

Generalmente se utilizan dos estructuras:

- Estructura de costos: Almacena el número mínimo de operaciones para cada subproblema
- Estructura de escogencia: Almacena la mejor división (valor k) para cada subproblema

## Algoritmo

```python
# Pseudocódigo para multiplicación óptima de matrices
def matrix_chain_order(p):
    n = len(p) - 1
    # m[i,j] = costo mínimo para multiplicar matrices i hasta j
    m = [[0 for x in range(n)] for x in range(n)]
    # s[i,j] = valor k óptimo para dividir el problema en i..k y k+1..j
    s = [[0 for x in range(n)] for x in range(n)]
    
    # Longitud de la cadena
    for l in range(2, n+1):
        # i es el inicio de la subcadena
        for i in range(0, n-l+1):
            # j es el final de la subcadena
            j = i + l - 1
            m[i][j] = float('inf')
            # Probar todas las posibles divisiones k
            for k in range(i, j):
                # Costo = costo de multiplicar i..k + costo de multiplicar k+1..j + 
                #         costo de multiplicar los resultados
                cost = m[i][k] + m[k+1][j] + p[i]*p[k+1]*p[j+1]
                if cost < m[i][j]:
                    m[i][j] = cost
                    s[i][j] = k
                    
    return m, s

```

La complejidad temporal de este algoritmo es O(n³) y la espacial es O(n²), donde n es el número de matrices.

## Conclusión

El problema de multiplicación de matrices muestra la eficacia de la programación dinámica para problemas de optimización, donde descomponemos el problema en subproblemas y construimos la solución óptima utilizando las soluciones de estos subproblemas.

Basado en la página, aquí está un resumen de los elementos principales de la programación dinámica:

## Elementos de Programación Dinámica

**1. Subestructura óptima:**

- Es una estructura que almacena la solución a los subproblemas
- Permite obtener cálculos que ya han sido resueltos
- Contiene las soluciones óptimas a cada subproblema

**2. Diseño de la subestructura óptima:**

- Incluye la propiedad de escogencia, que determina el criterio de optimización
- Debe contener la solución óptima a los subproblemas
- Usualmente existen dos estructuras: estructura de costos y estructura de escogencia
- El tamaño del espacio de los subproblemas depende de lo que se mueve en el problema

**3. Dimensionalidad:**

- Por ejemplo, LCS (Subsecuencia Común más Larga) tiene 2 dimensiones
- MCM (Multiplicación de Cadena de Matrices) también tiene 2 dimensiones donde los subproblemas van desde i hasta k y k+1 hasta j

Este enfoque permite resolver problemas complejos de optimización descomponiéndolos en subproblemas y construyendo la solución óptima a partir de las soluciones de esos subproblemas.

# Ejercicios

[notas2_annotated.pdf](Clase%203%20Multiplicacio%CC%81n%20de%20matrices%20y%20elementos%20pr%201a77fd794c28801cb7cfc90ad65736e3/notas2_annotated.pdf)