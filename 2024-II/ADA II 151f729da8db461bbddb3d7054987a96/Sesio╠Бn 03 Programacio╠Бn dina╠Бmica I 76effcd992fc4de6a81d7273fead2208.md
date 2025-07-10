# Sesión 03: Programación dinámica I

# Recursos

- [https://www.cs.usfca.edu/~galles/visualization/DPLCS.html](https://www.cs.usfca.edu/~galles/visualization/DPLCS.html)

# Aspectos de la programación dinámica

¿Cual es la diferencia con divide y vencerás con memorización?

Pensada para problemas de OPTIMIZACIÓN. Encontrar la MEJOR solución (MIN o MAX)

Divide y vencerás

Problemas que se repiten y se pueden reutilizar.

---

Metodologia de la programación dinámica

- Subestructura optima: Es una estructura de datos que nos almacena los costos/ganancias/resultado parcial de los subproblemas, esta estructura mapea TODOS los posibles subproblemas.
- Esta subestructura la vamos a llenar bajo el enfoque bottom-up: Triviales hacia la general → costos
- El numero de dimensiones de la subestructura optima depende de las variables que determina el divide y vencerás.

---

# Ejemplos

Subsecuencia común más larga

X = ACDEDEF  Y = ACEDEDDF
res = ACDEDF

subestructura optima

$$
m[i,j] = \begin{cases} 0 & i = 0 \vee j = 0 \\ m[i-1,j-1] + 1 & x_i = y_j \\ max(m[i-1,j],m[i,j-1]) & \texttt{en otro caso}  \end{cases}
$$

Se llena desde los casos i = 0 o j = 0, columnas de izquierda a derecha y luego filas de arriba hacia abajo

Multiplicación de matrices

M1, M2, M3

(10 x 5) (5 x 50) (50 x 100)

Resultado 10 x 100

(M1 M2) M3 = 10*5*50 + 10*50*100 = 52500

M1 (M2 M3) =   10*5*100 + 5*50*100 = 30000