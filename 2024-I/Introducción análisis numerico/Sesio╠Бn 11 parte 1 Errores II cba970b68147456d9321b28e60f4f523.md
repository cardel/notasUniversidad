# Sesión 11: parte 1: Errores II

# Calculo de derivadas numéricas

¿Que problemas tenemos con las derivadas numéricas?

La formula de la derivada nace de la serie de taylor de orden

$$
f'(x_i) = \frac{f(x_{i+1})-f(x_i)}{x_{i+1}-x_i} + \textrm{O}(x_{i+1}-x_i)
$$

La diferencial debe ser muy cercana a 0, dado que si no lo es entonces hay error, pero si la diferencia es muy cercana a 0, el problema es el error de redondeo, y se nos puede volver 0 el diferencial

## Tipos de errores

---

¿Cuales tenemos?

1. Errores humanos: Dificiles de controlar y detectar
2. Errores del modelo: Una ecuación mal estimada
3. Incertidumbre en los datos: No podemos estar totalmente seguros que los datos no contienen ruido.

---

## Consideraciones

- Evitar calculos con números muy cercanos entre sí, la diferencia entre ellos podria ser cero, por el error de redondeo
- Todo proceso que requiera calculo infinito de términos, debe truncarse
- Repita los experimentos siempre que sea posible para reducir la incertidumbre de los datos.

## Reducción gaussiana

¿Como afecta el error de redondeo a la reducción?

Cuando tenemos términos muy pequeños, se nos introduce de redondeo

Cuando seleccionamos un número dado de cifras significativa, introducimos el error de truncamiento

Determinante es la multiplicación de la diagonal antes del pivoteo (normalización)

## Matrices tridiagonales

¿Que es?

Es una matriz cuya digonal y sus diagonales vecinas son diferentes de cero

| 4 | 3 | 0 | 0 |
| --- | --- | --- | --- |
| 4 | 3 | 2 | 0 |
| 0 | 3 | 2 | 3 |
| 0 | 0 | 2 | 8 |

Las operaciones se reducen a dos pasos, de arriba hacia abajo para eliminar digonal inferior y de abajo hacia arriba para eliminar diagnonal superior

f2’ = f2 + cf1

f3’ = f3 + cf2’

f4’ = f4 + cf3’

Paso hacia arriba

f3’’ = f3’ + cf4’

f2’’ = f2’ + cf3’’

f1’ = f1 + cf2’’

¿Que gano?

Reducir las operaciones en PUNTO FLOTANTE buscando reducir el error de redondeo

# Resumen

1. Errores de truncamiento en calculos infinitos, se analizo el caso de la derivada con respecto al tamaño del h, h pequeño mete error de redondeo y h grande de truncamiento
2. Sistemas lineales. Tenemos gauss-jordan, ¿Cual es el problema? Tenemos errores de redonde en las operaciones SOBRETODO cuando tenemos datos con decimales pequeños, y tenemos errores de truncamiento por la selección de las cifras significativas, este ultimo pueder PREOCUPANTE darnos un resultado ERRONEO
3. Un sistema tiene solución SII el det ≠ 0 , cuando tenemos el sistema en la forma gauss jordan es multiplicar la diagonal
4. Se aplican ciertas estrategias para reducir el error de redondeo, como es el caso de las matrices tridiagonales que se busca en dos pasadas llevarlo a la forma de gauss-jordan