# Sesión 12: Descomposición de matrices

¿Para que la usamos?

Para multiplicar matrices más eficientemente, dado que multiplicar matrices triagulares es más económico computacionalmente

¿En que nos sirve? Recordar el algoritmo de propagación hacia atrás de las redes neuronales

---

¿Que es la factorización LU?

$Ax = b \implies LUx = d$

A = LU, b = Ld

Por ejemplo, consideremos la matriz A de 3x3:

$$
A =

\begin{bmatrix}
1 & 2 & 3 \\
2 & 5 & 7 \\
1 & 0 & 1
\end{bmatrix}

$$

Podemos descomponerla en una matriz L (triangular inferior) y una matriz U (triangular superior) de la siguiente manera:

$$
L =

\begin{bmatrix}
1 & 0 & 0 \\
2 & 1 & 0 \\
1 & -2 & 1
\end{bmatrix}

$$

$$
U =

\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 1 \\
0 & 0 & -1
\end{bmatrix}

$$

Por lo tanto, la factorización LU de la matriz A es LU.

---

Factorización de cholesky

Por supuesto, aquí te dejo un ejemplo sencillo de la factorización de Cholesky.

Consideremos la matriz A:

$$

A =
\begin{bmatrix}
4 & 12 & -16 \\
12 & 37 & -43 \\
-16 & -43 & 98
\end{bmatrix}
$$

Queremos descomponer esta matriz en la forma A = LL*, donde L es una matriz triangular inferior. Para hacerlo, usamos las fórmulas de la factorización de Cholesky:

$$

L_{ii} = \sqrt{A_{ii} - \sum_{k=1}^{i-1}L_{ik}^2} \quad (1)

$$

$$

L_{ij} = \frac{1}{L_{jj}} \left( A_{ij} - \sum_{k=1}^{j-1}L_{ik}L_{jk} \right) \quad (2)

$$

Donde  es el elemento de la matriz L en la fila i y la columna j, y es el elemento correspondiente de la matriz A.

Usando estas fórmulas, obtenemos:

$$
L = \begin{bmatrix}
2 & 0 & 0 \\
6 & 1 & 0 \\
-8 & 5 & 3
\end{bmatrix}
$$

Por lo tanto, la factorización de Cholesky de A es LL*.

# Inversa

¿Para que calculamos la inversa?

La inversa ofrece una solucíón directa (sin necesidad de aplicar Gauss-Jordan totalmente) al sistema

$$
Ax = b \rightarrow x = A^{-1}b
$$

---

¿Como calculamos la inversa?

Aplicamos factorización LU y luego tomamos los vectores pivote b

[1,0,0,…], [0,1,0,..], [0,0,1,….]

Esto para calcular las columnas de la matriz inversa

Por supuesto, utilicemos una matriz 3x3 A específica como ejemplo:

$$
A =\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 10
\end{bmatrix}
$$

Imaginemos que hemos aplicado la factorización LU a esta matriz y obtenemos L y U.

Ahora, queremos encontrar la inversa de A. Para ello, tomamos los vectores pivote b [1,0,0], [0,1,0], [0,0,1] y resolvemos el sistema LY = B y UX = Y.

1. Tomamos el primer vector pivote b [1,0,0] y resolvemos LY = b para obtener el primer vector Y. Luego, resolvemos UX = Y para obtener la primera columna de la matriz inversa A^-1.
2. A continuación, tomamos el segundo vector pivote b [0,1,0] y resolvemos LY = b para obtener el segundo vector Y. Luego, resolvemos UX = Y para obtener la segunda columna de la matriz inversa A^-1.
3. Finalmente, tomamos el tercer vector pivote b [0,0,1] y resolvemos LY = b para obtener el tercer vector Y. Luego, resolvemos UX = Y para obtener la tercera columna de la matriz inversa A^-1.

Este método nos proporciona la matriz inversa de A sin tener que aplicar el método de Gauss-Jordan completo.

# Resumen

¿Para que aplicamos descomposición y calculo de matriz inversa en computación numérica?

Buscamos mayor eficiencia en el las multiplicaciones de las matrices

---

¿Que aplicaciones tiene?

- Machine learning
- Procesamiento gráfico
- Procesamiento de datos en n dimensiones
- Solución de problemas en ingenieria donde se relacionan sistemas de ecuaciones

---

¿Para que sirve la factorización LU?

El vector U es el resultante de aplicar Gauss-Jordan

El vector L los coeficientes

Ambas son matrices triangulares, se pueden multiplicar más eficientemente

---

¿Para que sirve calcular la inversa?

Resolver directamente los sitemas Ax = b, esta la solución mas rapida, no requiere aplicar operaciones como gauss-jordan

---

¿Que diferencia hay entre la factorización den Cholesky y la factorización LU?

Ambas toman el sistema

$$
Ax = b
$$

LU lo transforma:

$$
LU x = d
$$

Donde L y U son matrices triangulares

El sistema de Cholesky transforma el sistema a:

$$
LL^T x = d
$$

El cual es más rapido de resolver.