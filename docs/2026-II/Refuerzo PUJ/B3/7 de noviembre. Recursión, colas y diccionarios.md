# 7 de noviembre · Refuerzo PUJ

**Recursión, colas y diccionarios.** Tres horas de programación: la recursión
sobre un árbol con UVa 839, una simulación con cola en UVa 12100 y un
diccionario con una clave por grupo de palabras en UVa 156. En la hora de
lógica se plantean los invariantes de ciclo de UVa 11078 y queda en papel el
ejercicio de UVa 507.

La sesión empieza con la revisión de la
[tarea del 24 de octubre](../B2/24%20de%20octubre.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md#tarea).

## Diapositivas

### Programación

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de programación

Las soluciones de UVa 839, UVa 12100 y UVa 156.

![](./Soluciones-programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de lógica

La traza, los invariantes y los tres pasos del ejercicio de UVa 507.

![](./Soluciones-logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Archivos de lectura

Cada problema de clase tiene un programa que lee la entrada e imprime lo que
leyó, sin resolver nada. Están en la carpeta
[codigo](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/Refuerzo%20PUJ/B3/codigo)
de esta sesión:

| Problema | Python | C++ |
|---|---|---|
| UVa 839 | [lectura_839.py](./codigo/lectura_839.py) | [lectura_839.cpp](./codigo/lectura_839.cpp) |
| UVa 12100 | [lectura_12100.py](./codigo/lectura_12100.py) | [lectura_12100.cpp](./codigo/lectura_12100.cpp) |
| UVa 156 | [lectura_156.py](./codigo/lectura_156.py) | [lectura_156.cpp](./codigo/lectura_156.cpp) |

Se copia la muestra del enunciado en `1.in` y su salida en `1.out`, y se corre
el archivo de lectura para ver en qué orden llega la entrada. Después se
cambian sus impresiones por la solución y se compara contra la muestra:

```text
g++ -std=c++17 -Wall -Wextra lectura_12100.cpp -o solucion
./solucion < 1.in > salida.out
diff salida.out 1.out

python3 lectura_12100.py < 1.in > salida.out
diff salida.out 1.out
```

Si `diff` no imprime nada, las dos salidas coinciden y el programa ya se puede
enviar al juez. El juez corre una versión antigua de Python 3, así que la
salida se arma con `print` y `%`, como en los archivos de lectura.

## Problemas en clase

Cada problema cierra con su costo: de qué depende el tamaño de la entrada,
cuántas veces corre cada ciclo o cuántas llamadas hay, y el total en $O$
frente a los límites del enunciado.

### Hora 1. UVa 839, Not so Mobile

- Enunciado: <https://onlinejudge.org/external/8/839.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=780>

Un móvil es una barra con un objeto en cada extremo, y está en equilibrio si
$W_l \times D_l = W_r \times D_r$. Un peso 0 dice que de ese extremo cuelga
un submóvil, descrito en las líneas que siguen: primero el izquierdo y después
el derecho. El parámetro de la recursión es la barra que se está leyendo. El
extremo con objeto es el caso base y el de peso 0 el caso recursivo; la
función devuelve el peso del submóvil y si está en equilibrio, y el árbol de
llamadas tiene la forma del móvil. La trampa está en la lectura: aunque un
submóvil ya haya dado `NO`, la función lee todas sus líneas, porque las que
queden sin leer se tomarían como el caso siguiente. Tampoco basta revisar la
barra de arriba: puede estar en equilibrio con sus submóviles desequilibrados.

Costo: el tamaño es el número $n$ de barras, que el enunciado no acota. Hay
una llamada por barra, cada una con un trabajo fijo (leer cuatro números,
comparar dos productos y sumar dos pesos), así que el total es $\Theta(n)$ por
caso, lo mismo que leer la entrada. La pila llega a la altura del móvil, unos
$\log_2 n$ marcos si el árbol está lleno y $n$ si es una cadena; por eso la
solución en Python sube el límite de recursión.

### Hora 2. UVa 12100, Printer Queue

- Enunciado: <https://onlinejudge.org/external/121/12100.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3252>

La impresora saca el primer trabajo: si en la cola queda alguno de prioridad
mayor, lo manda al final, y si no, lo imprime. El parámetro es $n$, el tamaño
de la cola, con $m$ señalando el trabajo propio. Las prioridades solo van de 1
a 9, así que nueve contadores dicen en tiempo constante si queda alguna mayor,
sin recorrer la cola. La trampa está en $m$, que deja de servir en cuanto la
cola rota. Varios trabajos pueden tener la misma prioridad, de modo que la
marca del trabajo propio viaja con él en un par. El tiempo también engaña:
imprimir toma un minuto y rotar no toma ninguno.

Costo: el tamaño es $n$, con $n \le 100$ y hasta 100 casos. Cada impresión deja
a lo más $n$ rotaciones por delante, así que hay a lo más $n^2$ pasos con
trabajo fijo: $O(n^2)$ por caso y $\Theta(n)$ de memoria. Con una lista de
Python sacando del frente, cada paso paga $\Theta(n)$ y el total sube a
$O(n^3)$.

### Hora 3. UVa 156, Ananagrams

- Enunciado: <https://onlinejudge.org/external/1/156.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=92>

Dos palabras son anagramas exactamente cuando sus letras, en minúscula y
ordenadas, dan la misma cadena. Esa cadena es la clave de un diccionario, y
basta contar cuántas palabras caen en cada una. El parámetro es $n$, el número
de palabras. La trampa es que la clave ignora las mayúsculas y la salida no:
se imprime la palabra como venía, y el orden es el de los códigos de carácter,
con las mayúsculas antes que las minúsculas. La lectura va por palabras, porque
una línea trae varias y puede empezar con espacios.

Costo: el tamaño es $n \le 1000$, con $L \le 20$ letras por palabra. Las claves
cuestan $O(n\,L \log L)$ y ordenar la salida $O(n \log n)$ comparaciones. Con
el diccionario cada palabra se cuenta en $O(1)$ promedio; comparar cada palabra
con todas las demás pagaría $\Theta(n^2)$ comparaciones de claves.

## Lógica

El ciclo de partida es el de
UVa 11078, Open Credit System (<https://onlinejudge.org/external/110/11078.pdf>).
Recibe $a[0..n-1]$ con $n \geq 2$ y devuelve
$\max\{a[s] - a[t] : 0 \leq s < t < n\}$:

```python
def mayor_diferencia(a):
    mayor = a[0]
    mejor = a[0] - a[1]
    j = 1
    while j < len(a):
        if mayor - a[j] > mejor:
            mejor = mayor - a[j]
        if a[j] > mayor:
            mayor = a[j]
        j = j + 1
    return mejor
```

Un invariante es una fórmula sobre las variables del ciclo, verdadera cada vez
que se evalúa la condición del `while`. Se escribe con cuantificador, índices y
rango, y se demuestra en tres pasos. La inicialización pide que valga en el
primer chequeo; la estabilidad, que si vale en un chequeo y la condición se
cumple, valga en el siguiente; la terminación, que el ciclo acabe y que el
invariante con la condición falsa dé lo que se quería. Los dos primeros son una
inducción sobre el número de chequeos.

El invariante de `mayor` dice que su valor está en el tramo $a[0..j)$ y que
nadie del tramo lo supera:

$$
\begin{aligned}
I_0 &:\; 1 \leq j \leq n \\
I_1 &:\; \exists t\, (0 \leq t < j \wedge a[t] = \mathit{mayor}) \wedge \forall t\, (0 \leq t < j \to a[t] \leq \mathit{mayor})
\end{aligned}
$$

Para `mejor`, el primer candidato es la mayor diferencia entre las parejas del
tramo, y falla en la inicialización: con $j = 1$ el tramo no tiene ninguna
pareja. Las parejas que `mejor` ya tuvo en cuenta incluyen la de su valor
inicial:

$$
P_j = \{(0, 1)\} \cup \{(s, t) : 0 \leq s < t < j\}
$$

$$
I_2 :\; \exists (s, t) \in P_j\, (a[s] - a[t] = \mathit{mejor}) \wedge \forall (s, t) \in P_j\, (a[s] - a[t] \leq \mathit{mejor})
$$

La estabilidad de $I_2$ usa $I_1$. En la vuelta $j$, las parejas nuevas son las
que terminan en $t = j$, y la mayor de ellas vale `mayor - a[j]` porque `mayor`
todavía es el máximo de $a[0..j)$; por eso el `if` de `mejor` va antes que el de
`mayor`. Al salir, $j = n$ y, como $n \geq 2$, la pareja $(0, 1)$ ya está en el
rango $0 \leq s < t < n$, así que $P_n$ son todas las parejas y `mejor` es la
salida pedida.

### Ejercicio en papel: UVa 507 sin el desempate

UVa 507, Jill Rides Again (<https://onlinejudge.org/external/5/507.pdf>), sin
el desempate por longitud y por inicio. La entrada es $v[0..n-1]$, las calles
de la ruta, y la salida es la mayor suma de un tramo de calles seguidas, o 0 si
ninguno es positivo:

```python
def mejor_tramo(v):
    suma = 0
    mejor = 0
    k = 0
    while k < len(v):
        suma = suma + v[k]
        if suma > mejor:
            mejor = suma
        if suma < 0:
            suma = 0
        k = k + 1
    return mejor
```

Sea $S(i, j) = \sum_{t=i}^{j-1} v[t]$, con $S(i, i) = 0$, e
$I_0 :\; 0 \leq k \leq n$. Se pide:

1. Llenar la traza con $v = [2, -3, 4, -1, 2, -6]$. Cada fila es un chequeo del
   `while`, antes de ejecutar la vuelta; en la primera, con $k = 0$, las dos
   variables valen 0.
2. Escribir $I_1$, sobre `suma`, con $\exists$, $\forall$ y rango.
3. Escribir $I_2$, sobre `mejor`, de la misma forma.
4. Demostrar inicialización, estabilidad y terminación.

Donde las dos columnas de la traza difieren, `suma` no es lo mejor de lo
recorrido: conviene mirar dónde terminan sus tramos. Cada fórmula se prueba
primero con $k = 0$, el chequeo donde cayó el candidato de UVa 11078. En la
estabilidad cada `if` va por casos, y uno usa el invariante del otro.

La solución está en
[Soluciones-logica.pdf](./Soluciones-logica.pdf){ target=_blank rel=noopener }.

## Tarea

Se resuelve antes del 14 de noviembre y se envía al juez; la revisión abre
esa sesión. Cada solución va con su costo.

### Base. UVa 10935, Throwing cards away I

- Enunciado: <https://onlinejudge.org/external/109/10935.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1876>

Mientras queden al menos dos cartas, se bota la de arriba y la siguiente pasa
al fondo. El parámetro es $n$, el número de cartas. Cada ronda solo toca los
dos extremos del mazo, y una cola saca arriba y pone abajo en tiempo constante.
Las cartas botadas van separadas por coma y espacio, así que la primera se
escribe distinto de las demás. La trampa es $n = 1$: no se bota ninguna carta,
y la primera línea es `Discarded cards:` sin espacio después de los dos puntos.

### Intermedio. UVa 11286, Conformity

- Enunciado: <https://onlinejudge.org/external/112/11286.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2261>

El parámetro es $n$, el número de estudiantes, con $n \le 10\,000$ y cinco
cursos cada uno. Una combinación no depende del orden: al ordenar los cinco
cursos, dos estudiantes con la misma combinación producen la misma clave de un
diccionario. La trampa está en la pregunta, que pide el total de estudiantes:
si varias combinaciones empatan en la mayor popularidad, se suman todas.

### Exigente. UVa 699, The Falling Leaves

- Enunciado: <https://onlinejudge.org/external/6/699.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=640>

El parámetro es $t$, el número de nodos. La entrada ya viene en preorden, y la
columna de un hijo solo depende de la de su padre: la función lee el subárbol
mientras suma en la columna $x$ y baja a $x - 1$ y $x + 1$, sin construir el
árbol. Las columnas pueden ser negativas. La trampa es de formato: un árbol
puede seguir en la línea siguiente, como el segundo de la muestra, y la línea
en blanco va también después del último caso.

## Para seguir

- [Soluciones](./Soluciones.md) de UVa 12100, UVa 156 y los tres problemas de la
  tarea, con la idea, la complejidad y el código en Python y C++. Las de UVa 839
  están en las [soluciones del 24 de octubre](../B2/Soluciones.md#hora-3-uva-839-not-so-mobile).
- [Ejercicios interactivos](./Ejercicios.md) sobre recursión, colas y pilas,
  diccionarios, costo e invariantes.
