# Sesión 04: Programación dinámica II

# Problema la mochila

Descripción del problema

1. Se tiene una mochila de capacidad M
2. Se tienen un conjunto de elementos, representados por la tupla peso y ganancia $(w_i, b_i)$
3. Se busca maximizar la ganancia
4. La salida es un x binario, donde 0 indica que el elemento no va y 1 el elemento

---

$$
\{(1,3),(2,6),(4,5),(3,1),(2,6)\}
$$

M = 8

Objetivo es buscar la solución que tenga mayor beneficio respetando la capacidad de la mochila

1. {1,1,1,0,0} = 14
2. {0,1,1,0,1} = 17
3. {0,0,1,0,1} = 11

Empezamos a dividir el problema general M(8,5), y tomamos la decisión de llevar o no llevar el elemento 

$$
x_5
$$

---

Subestructura optima

Hay dos variables que se mueven, la capacidad y el elemento

$$
M[i,j] = \begin{cases} 0 && j = 0 \\ 0 && j = 1 \wedge i < w_j \\ b_i && i \geq w_j \wedge j = 1  \\ \texttt{max}(M[i-w_j, j-1]), M[i,j-1]) && \texttt{En otro caso} \end{cases}
$$

![image.png](Sesio%CC%81n%2004%20Programacio%CC%81n%20dina%CC%81mica%20II%203dec0d2f128541b1b513852bb1ee85e4/image.png)