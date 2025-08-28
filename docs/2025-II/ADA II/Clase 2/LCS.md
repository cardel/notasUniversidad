Subsecuencia común más larga
Dadas dos subsecuencias
X = ABCAAABC
Y = ABCBAAAC

¿Cual es la subsecuencia común más larga entre X e Y?

¿Que es una subsecuencia común?
Es un conjunto de letras que es común en ambas secuencias en el mismo orden no necesariamente tienen que ser contiguas

Subsecuencias comunes entre X e Y
1) A
2) AB
3) ABC
4) ABCA
5) ABCAA
6) ABCB
7) ABCBC
8) ABCAAA
9) ABCAAAC <-- La mas larga

# Solución ingenua

Explorar todas las soluciones y encontrar la mejor,

¿Como sería la solución ingenua de LCS?

X = ABCAAABC
Y = ABCBAAAC

$$\epsilon, A, AB, ABC, ABCA, \ldots, B, BC, BCA, \ldots$$
Conjunto potencia de X, ¿Cuanto cuesta hacerlo?

$$O(2^n)$$
Complejidad exponencia :(

# Estrategias para mejorar la complejidad

Para que un problema pueda resolverse por programación dinámica debe cumplir.

1. Ser de optimización. Si, porque busco la subsecuencia más larga
2. Divide y vencerás: Tomar una subsecuencia de la solución es optima tambien

X = ABCAAABC
Y = ABCBAAAC
ABCAAAC

Es ABCAAA solución optima de ABCAAAB y ABCBAAA --> Si
ES ABCAA solucion optima de ABCAA y ABCBAA --> Si

Esto evidencia que
- P(ABCAAAB,ABCBAAA) es un subproblema de **P(ABCAAABC,ABCBAAAC)**
- P(ABCAA,ABCBAA)  es un subproblema de **P(ABCAAABC,ABCBAAAC)**

Cuando vemos que una parte de la solución optima es solución de los subproblemas, es evidencia de que estos se han combinado para resolver el problema **general**

# EJEMPLO

BCCAAA
ABBBCC

Respuesta BCC

- BCC es solucion de P(BCCAA y ABBCC)
- BC es solucion de P(BC, ABBC)
- B es solucion P(B, ABB)
- vacio es solucion P(e, AB)

# Solución dinámica

Hemos evidenciado que el problema se puede resolver por divide y vencerás.

1. Caracterizar la subestructura optima
2. Definir recursivamente la solución optima: Subproblemas de calculan a partir de otros subproblemas
3. Calcular el valor (costo) solución optima: Trivial hacia la general: Calcular la longitud de la subsecuencia común más larga
4. Construir la solución  optima: Obtener la subsecuencia común más larga.
5. Divide y vencerás depende de una decisión,, en el caso de LCS si las dos ultimas son iguales el subproblema queda con ambas cadenas menos el último carácter agregando el caracter comun. En otro caso, se generan dos subproblemas uno con X sin el ultimo y el otro con el Y sin el ultimo, nos quedamos con el mas grande. Es decisión indica **como llenamos la subestructura optima**
![](attachments/2025-08-28-Note-11-11_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

## Caracterizar la subestructura optima

La subestructura optima depende de los subproblemas, podemos observar que son X e Y, como son dos variables vamos usar una matriz, en las filas vamos a tener a X y en las columna a Y. Vamos a incluir la solución trivial --> cuando tenemos la cadena vacia


| X / Y |          | A        | B        | C          |
| ----- | -------- | -------- | -------- | ---------- |
|       | P(e,e)   | P(e,A)   | P(e,AB)  | P(e,ABC)   |
| C     | P(C,e)   |          |          |            |
| A     | P(CA,e)  |          | P(CA,AB) |            |
| A     | P(CAA,e) | P(CAA,A) |          | P(CAA,ABC) |
La solución general del problema está el ultima fila y ultima columna.

Es de entender que la subestructura optima tiene mapeados todos los subproblemas.

## Como calculamos la subestructura optima

- Triviales: Vacio con otra cadena, da 0
- No triviales: 
	- Si son iguales: Tomo la solución quitando el ultimo caracter en las dos cadenas y le sumo 1
	- Si son diferentes: Tomo el maximo de quitarle 1 a X o quitarle 1 a Y

1. Estructura de costos: Almacena el costo de la solución
2. Estructura de solución: Almacena la solución
$$
m[i,j] = 
\begin{cases} 
0 & \text{si } i = 0 \vee j = 0 \\
m[i-1,j-1] + 1 & \text{si } X[i] = Y[j] \\
\max(m[i-1,j], m[i,j-1]) & \text{si } X[i] \neq Y[j]
\end{cases}
$$

3. Se llena de la siguiente forma
	1. Calcule $m[0,j] \texttt{ y } m[i,0]$
	2. Calcule toda la fila 1, luego 2, 3, y hasta n de izquierda a derecha
	3. La solución está en ultima fila y ultima columna