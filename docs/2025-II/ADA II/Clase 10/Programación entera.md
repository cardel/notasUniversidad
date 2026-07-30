Es un problema en el cual se tiene:

1. Un conjunto de variables enteras
2. Una función a maximizar
3. Un conjunto de desigualdades
4. Un entero B para limitar la función a maximizar

Problema de decisión: ¿Existe alguna asignación de los enteros de tal forma que se cumplan las desigualdades y se cumpla $f(v) \geq B$?

$$
\begin{aligned}
v_1 \geq 1 \\
v_2 \geq 0 \\
v_1 + v_2 \leq 3 \\
f(v) = 2v_2 \\
B = 3
\end{aligned}
$$

Soluciones:

1. $v_1 = 1, v_2 = 0$, $f(v) = 0$ No cumple por $0 \geq 3$
2. $v_1 = 1, v_2 = 1$, $f(v) = 2$ No cumple por $2 \geq 3$
3. $v_1 = 1, v_2 = 2$, $f(v) = 4$ Cumple $4 \geq 3$
4. $v_1 = 2, v_2 = 0$, $f(v) = 0$ No cumple
5. $v_1 = 2, v_2 = 1$, $f(v) = 2$ No cumple

Modelo en MiniZinc sería:

```text
var int: v1;

var int: v2;

int: B = 3;

  

constraint v1 >= 1;

constraint v2 >= 0;

constraint v1+v2 <= 3;

constraint 2*v2 >= B;

  

solve maximize 2*v2;
```

# Demostración de que IP es NP-Completo

1. Probar que $IP \in NP$ 
2. Probar que $IP \in NP-Hard$ 
	1. Seleccionar un problema A NP-Completo conocido
	2. Describir cómo una instancia de A se transforma en B, es decir, $A \leq_{p} IP$
	3. Probar que este algoritmo se ejecuta en tiempo polinomial (reducción)
	4. Probar que el algoritmo es correcto
		1. Instancias positivas de A son instancias positivas de B
		2. Instancias negativas de A son instancias negativas de B

## Demostrar que IP es NP

Debemos certificar que una solución de IP se puede **verificar en tiempo polinomial**.

Dado que se tienen $n$ variables y $m$ restricciones, las cuales pueden tener un máximo de $n$ variables: $O(nm)$.

¿Cuánto tiempo toma verificar $f(v) \geq B$? Es $O(n)$.

En total $O(nm)+O(n) = O(nm)$. Por lo tanto, este problema es NP.

## Demostrar que es NP-Completo

1. $3-SAT \leq_p IP$ Partimos de este supuesto.
2. Para cada variable del 3-SAT vamos a crear dos variables $x$ y $\bar{x}$.
3. Vamos a generar las restricciones:
	1. $0 \leq x \leq 1$ y $0 \leq \bar{x} \leq 1$
	2. $1 \leq x + \bar{x} \leq 1$ 
4. Tenemos las cláusulas de tamaño 3 $(l_1 \vee l_2  \vee l_3)$ y vamos a crear la restricción $l_1 + l_2 + l_3 \geq 1$.
5. La función objetivo no es importante dado que solo se busca asignar variables: $f(v) = v_1$, $B = 0$.

## Ejemplo

Tenemos un 3-SAT con 4 variables $(v_1,v_2,v_3,v_4)$.
Tenemos las cláusulas:

$$
(v_1,v_2,v_3),(\bar{v_3},\bar{v_2},v_4)
$$

Transformar a IP:

$$
x_1,x_2,x_3,x_4,\bar{x_1},\bar{x_2},\bar{x_3},\bar{x_4}
$$

Restricciones:

$$
\begin{aligned}
0 \leq x_1 \leq 1 \\
0 \leq x_2 \leq 1 \\
0 \leq x_3 \leq 1 \\
0 \leq x_4 \leq 1 \\
0 \leq \bar{x_1} \leq 1 \\
0 \leq \bar{x_2} \leq 1 \\
0 \leq \bar{x_3} \leq 1 \\
0 \leq \bar{x_4} \leq 1 \\
1 \leq x_1 + \bar{x_1} \leq 1 \\
1 \leq x_2 + \bar{x_2} \leq 1 \\
1 \leq x_3 + \bar{x_3} \leq 1 \\
1 \leq x_4 + \bar{x_4} \leq 1 \\
x_1 + x_2 + x_3 \geq 1 \\
\bar{x_3}+\bar{x_2}+x_4 \geq 1
\end{aligned}
$$

Función objetivo:

$$
B = 0, f(x) = x_1
$$

## Estudio de la reducción

### ¿Se realiza en tiempo polinomial?
Asumiendo un 3-SAT con $n$ variables y $m$ cláusulas.

1. ¿Cuántas variables se crean en IP? $2*n = O(n)$
2. ¿Cuántas restricciones se crean?
	1. 2 por el número de variables: $O(n)$
	2. 1 por la suma de las variables (variable y su negativa): $O(n)$
	3. Por el número de cláusulas: $O(m)$
3. Función objetivo: $O(1)$
En total la reducción se realiza en tiempo $O(n+m)$, polinomial.

## Instancias positivas de 3-SAT son instancias positivas en IP

Para que una instancia sea positiva en 3-SAT debe cumplir que todos los literales deben dar **verdadero**, al menos una variable en cada literal debe dar verdadero, o 1 en la transformación.

1. Las restricciones $0 \leq x_i \leq 1$ SIEMPRE SE CUMPLEN.
2. Las restricciones $1 \leq x_i + \bar{x_i} \leq 1$ fuerzan a que una sea cero y la otra 1.
3. Si los literales se cumplen, debe existir en cada uno de ellos una variable que dé VERDADERO o 1, eso quiere decir que la suma TIENE que ser mayor o igual que 1, satisfaciendo las restricciones de los literales.

## Instancias negativas de 3SAT son instancias negativas en IP

Para que el 3-SAT no se satisfaga, debe pasar que al menos una cláusula dé siempre FALSO, eso significa que todas sus variables son FALSO, por ende su suma será igual a 0, lo que no satisface $0 \geq 1$.

## Ejemplo adicional

Supongamos el 3-SAT con variables $(a,b,c)$ y cláusulas $(a \vee b \vee c)$, $(\bar{a} \vee \bar{b} \vee c)$.

Transformación a IP:
- Variables: $x_a, x_b, x_c, \bar{x_a}, \bar{x_b}, \bar{x_c}$
- Restricciones:
  - $0 \leq x_a \leq 1$, $0 \leq x_b \leq 1$, $0 \leq x_c \leq 1$
  - $0 \leq \bar{x_a} \leq 1$, $0 \leq \bar{x_b} \leq 1$, $0 \leq \bar{x_c} \leq 1$
  - $x_a + \bar{x_a} = 1$, $x_b + \bar{x_b} = 1$, $x_c + \bar{x_c} = 1$
  - $x_a + x_b + x_c \geq 1$
  - $\bar{x_a} + \bar{x_b} + x_c \geq 1$
- Función objetivo: $f(x) = x_a$, $B = 0$