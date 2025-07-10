# Clase 9: Tablero Simplex y Branch and Bound

# Tablero Simplex

Recordando, el metodo

1. Variables holgura
2. Selecciona el función objetivo la que tiene mayor coeficiente y se saca de la base aquella cuyo valor de la variable a entrar es el menor positivo

![image.png](Academico/Universidad/2025-1/Algoritmos%20II%201997fd794c28808fa03cdd0497ec66dd/Clase%209%20Tablero%20Simplex%20y%20Branch%20and%20Bound%201d17fd794c28800a9f72e7a9c06ace18/image.png)

El tablero Simplex es una herramienta clave en el algoritmo Simplex para resolver problemas de programación lineal. Este tablero organiza las restricciones, variables y la función objetivo en una matriz que permite realizar cálculos sistemáticos. El proceso de pivoteo, basado en la estrategia gaussiana, se utiliza para iterar hacia la solución óptima.

En cada iteración, se selecciona una variable de entrada (la que tiene el coeficiente más negativo en la fila de la función objetivo) y una variable de salida (determinada por la prueba de razón mínima, es decir, el menor valor positivo de la relación entre el término independiente y el coeficiente de la columna de la variable entrante). Luego, se realiza el pivoteo: la fila pivote se divide por el elemento pivote (el coeficiente correspondiente en la intersección de la variable entrante y saliente) para que el pivote se convierta en 1. Posteriormente, las demás filas se ajustan restando múltiplos de la fila pivote, asegurando que todos los valores en la columna de la variable entrante, excepto el pivote, se conviertan en 0.

Este procedimiento se repite hasta que no existan coeficientes negativos en la fila de la función objetivo, indicando que se ha alcanzado la solución óptima.

### Ejemplo de Tablero Simplex Sencillo

Supongamos el siguiente problema de maximización:

Maximizar:

Z = 3x1 + 5x2

Sujeto a:

x1 + 2x2 ≤ 6

3x1 + 2x2 ≤ 12

x1, x2 ≥ 0

### Paso 1: Convertir restricciones a igualdades añadiendo variables de holgura

Agregamos variables de holgura (s1 y s2) para convertir las desigualdades en igualdades:

x1 + 2x2 + s1 = 6

3x1 + 2x2 + s2 = 12

La función objetivo en su forma estándar es:

Z - 3x1 - 5x2 = 0

Ahora, el tablero inicial queda así:

| Básicas | x1 | x2 | s1 | s2 | Términos independientes |
| --- | --- | --- | --- | --- | --- |
| s1 | 1 | 2 | 1 | 0 | 6 |
| s2 | 3 | 2 | 0 | 1 | 12 |
| Z | -3 | -5 | 0 | 0 | 0 |

### Paso 2: Identificar la variable entrante

Buscamos el coeficiente más negativo en la fila de Z. En este caso, -5 (correspondiente a x2). Por lo tanto, x2 será la variable entrante.

### Paso 3: Identificar la variable saliente

Calculamos la prueba de razón mínima dividiendo los términos independientes entre los valores positivos de la columna de x2:

- Para s1: 6 / 2 = 3
- Para s2: 12 / 2 = 6

El menor valor positivo es 3 (correspondiente a s1). Por lo tanto, s1 será la variable saliente.

### Paso 4: Realizar el pivoteo

El pivote es el elemento en la intersección de la fila de s1 y la columna de x2, que es 2. Dividimos toda la fila de s1 entre 2 para hacer que el pivote sea 1:

| Básicas | x1 | x2 | s1 | s2 | Términos independientes |
| --- | --- | --- | --- | --- | --- |
| x2 | 0.5 | 1 | 0.5 | 0 | 3 |
| s2 | 2 | 0 | -1 | 1 | 6 |
| Z | -0.5 | 0 | 2.5 | 0 | 15 |

### Paso 5: Repetir el proceso

Ahora repetimos los pasos para comprobar si hemos alcanzado la solución óptima. En este caso, ya no hay coeficientes negativos en la fila de Z, lo que indica que hemos llegado a la solución óptima.

### Solución óptima

De la tabla final obtenemos:

x1 = 0

x2 = 3

Z = 15

Por lo tanto, la solución óptima es x1 = 0, x2 = 3, con Z = 15.

## Método de las dos fases

[2025-04-10-Note-14-08_annotated.pdf](2025-04-10-Note-14-08_annotated.pdf)

# Branch and bound

![Mind map.png](Mind_map.png)

[2025-04-10-Note-15-31_annotated.pdf](2025-04-10-Note-15-31_annotated.pdf)

### Ejemplo de Branch and Bound con el Método Simplex

Supongamos que queremos resolver el siguiente problema de programación lineal entera (PLE):

Maximizar:

Z = 5x1 + 4x2

Sujeto a:

2x1 + 3x2 ≤ 8

x1 + x2 ≤ 4

x1, x2 ≥ 0 y enteros.

---

### Paso 1: Resolver el problema relajado

Primero resolvemos el problema relajado (permitiendo que x1 y x2 sean números fraccionarios) usando el método Simplex.

| Básicas | x1 | x2 | s1 | s2 | Términos independientes |
| --- | --- | --- | --- | --- | --- |
| s1 | 2 | 3 | 1 | 0 | 8 |
| s2 | 1 | 1 | 0 | 1 | 4 |
| Z | -5 | -4 | 0 | 0 | 0 |

Después de aplicar el método Simplex, obtenemos la solución relajada óptima:

x1 = 2.4, x2 = 1.6, Z = 20.8

---

### Paso 2: Verificar la enteridad de las variables

Dado que x1 y x2 no son valores enteros, procedemos a ramificar el problema, utilizando restricciones adicionales para forzar enteridad en una de las variables.

---

### Paso 3: Ramificación

Dividimos el problema en dos subproblemas, agregando una restricción para x1:

**Rama 1:** Agregar la restricción x1 ≤ 2

**Rama 2:** Agregar la restricción x1 ≥ 3

---

**Rama 1: Resolver con x1 ≤ 2**

Con la nueva restricción, resolvemos el problema usando Simplex. La solución es:

x1 = 2, x2 = 2, Z = 18.

**Rama 2: Resolver con x1 ≥ 3**

Con esta restricción, resolvemos nuevamente usando Simplex. La solución es:

x1 = 3, x2 = 1, Z = 19.

---

### Paso 4: Selección de la mejor solución

Entre las soluciones de ambas ramas, seleccionamos la que tiene el mayor valor de Z. En este caso, la solución óptima es:

x1 = 3, x2 = 1, Z = 19.

---

### Resumen del proceso

1. Resolvimos el problema relajado con Simplex y detectamos que la solución no era entera.
2. Ramificamos el problema en dos subproblemas basados en restricciones adicionales para x1.
3. Resolvimos ambas ramas y seleccionamos la solución con el mayor valor de Z, asegurándonos de que todas las variables sean enteras.

De esta manera, utilizamos el método de Branch and Bound con Simplex para encontrar la solución óptima del problema de programación lineal entera.