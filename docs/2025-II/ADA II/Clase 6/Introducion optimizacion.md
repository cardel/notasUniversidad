
Un problema de optimizacion es aquel que busco una salida la cual cumpla un criterio, un criterio maximización o minimización de una función que me indique tan buena o que tan costosa es una solución

- Mochila: Buscamos maximización la ganancia
- Secuencia mas larga: Maximizar el tamaño de la secuencia encontrada
- Multiplicacion de matrices: Minimizar el número de multiplicaciones

Un problema optimización se trata de buscar la mejor solución de acuerdo a una función que nos estima que tan buena es.

# Fases

1. Formulación matemática
2. Construcción del modelo matematico
3. Solución a través de un algoritmo (solver)
4. Verificación de la solución
5. Decisión a tomar de acuerdo a la solución


Este tipo de problema son llamado NLP, problemas de programación lineal

```
minimizar f(x)
subject to
	g1(x) <= a ; menor o igual
	g2(x) > b ; mayor
	g3(x) >= c ; mayor o igual
	g4(x) = d ; igual
	g5(x) < e ; menor
	m <= x <= n ; Las variables son acotadas
```
Es de anotar que $f(x)$ y $g(x)$ son funciones lineales en terminos x

# Region factible

Es una region en el plano acotada (finita) que contiene las soluciones validas para un problema

```minizinc
x,y
maximize f(x) = x+y
subject to:
	x >= 0
	y >= 0
	x + y <= 1
```
![](attachments/Pasted%20image%2020250925113200.png)

Aquí tienes la versión corregida:

```mermaid
---
config:
  themeVariables:
    xyChart:
      plotColorPalette: "#FF0000"
---
xychart-beta
    title "Area factible"
    x-axis "x" [0,1]
    y-axis "y" 
    line [1,0]
```

Esto en minizinc se ve como

```minizinc
var int: x;
var int: y;
 
constraint x >= 0;
constraint y >= 0;
constraint x+y <= 1;

solve maximize x+y;

output[
  "x =",show(x), " y=", show(y)]
```

# Teorema de Wierstraas

Este teorema que si f es una función continua (optimización) si la evaluo en un conjunto cerrado (región acotada) voy a encontrar el maximo y el minimo es sus puntos borde

Este teormema se cumple sii la región es cerrada y acotada es finita, pero si la región no lo es, no podemos aplicar este problema dado que tenemos una región que no se encuentra limitada

# Maximizar o minimizar

Si se tiene una función $f(x)$ a maximizar es lo mismo que minimizar $-f(x)$ 

# Tipos de variables

Los tipos de variables:
- Constantes. Que tienen un valor especifico en el modelo o se calculan
- Decisión: Son aquellas que vamos a buscar con el solver
En general que tipos de datos tenemos:

1. Continua (real)
2. Binaria (0 o 1)
3. Entera (1,2,3,4,)
4. Discreta (10m, 20m, 30m)

# Tipos de problemas NLP

1. Programación lineal (LP)
2. Programación Entera (IP)
3. Programación binaria
4. Programación entera mixta (MIP): Algunas son enteras y otras son continuas
5. MINLP funciones no lineales
6. QP Cuadratica

Este esta parte del curso nos vamos enfocar a 1,2,3 y 4


# Forma general de problemas

1. Funcion a maximizar o minimizar que es lineal
2. Restriccion LE menor o igual
3. Restricciones GE mayores o iguales
4. Restricciones EQ igualdad
5. Restricciones no negatividad (todas las variables deben ser positivas)