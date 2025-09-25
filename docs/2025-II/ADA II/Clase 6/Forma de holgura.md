Para poder resolver los problemas de programación lineal, tenemos que enteder

1. Es un problema maximizar una función sujeta a restricciones
2. Para aplicar un algoritmo de solución como simplex, debo transformar el problema a algo conocido como forma de holgura
3. Esto nos permite estandarizar el problema como una **maximización de funciones lineal sujeto a desigualdades lineales**

Cuando los problemas tienen dos variables se establece un espacio 2D, es decir que la región factible es un plano entre x e y. Pero cuando tenemos más de 2 variables sucede que tenemos un espacio n-dimensional

![](attachments/Pasted%20image%2020250925115602.png)

El algoritmo simplex toma un problema de programación lineal y retorna lo valores de las variables de decisión que maximización la función objetivo

# Forma estandar

La forma estandar es la maximización de una función objetivo sujeto a desigualdades de menor o igual, las variables de decisión deben ser estrictamente positivas

$$
\begin{align}
\texttt{ maximize } & \sum \limits_{i=1}^{n}
 c_i * x_i \\
 \texttt{ subject to } \sum \limits_{i=1}^{m} \sum \limits_{j=1}^{n} a_{ij} x_j <= b_{i} \\
 x_i >=0 && 1 \leq i \leq n
 \end{align}
 $$
 Ejemplo
$$
\begin{align}
\texttt{maximize }  x_1 + 2x_2 \\
x_1 + x_2 \leq 10000 \\
x_1 + 3x_2 \leq 15000 \\
x_1 \geq 0, x_2 \geq 0
\end{align}
$$
En minizinc

```minizinc
var int: x1;
var int: x2;
var int: f;

constraint f=x1+2*x2;
constraint x1 + x2 <= 10000;
constraint x1 + 3*x2 <= 15000;

constraint x1 >= 0;
constraint x2 >= 0;

solve maximize f;
```