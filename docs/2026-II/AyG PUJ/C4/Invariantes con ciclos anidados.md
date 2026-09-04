# Invariantes: acumuladores, listas y ciclos anidados

**Viernes 4 de septiembre de 2026.**

Los cuatro ciclos que ya quedaron demostrados —la suma de un arreglo, el
factorial, la búsqueda de un valor y la búsqueda binaria— tienen todos la
misma forma de estado: un índice y un acumulador numérico, con $I_1$
escrito como una ecuación entre los dos. Esta sesión sale de ese molde por
tres lados. El estado puede ser varias variables amarradas entre sí, la
salida puede ser una lista que crece, y puede haber un ciclo dentro de
otro.

## Diapositivas

![](clase04-invariantes.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El método, en corto

Un ciclo se demuestra con dos invariantes y tres pasos:

- $I_0$ acota el índice: dice por dónde puede ir.
- $I_1$ describe el estado: dice qué lleva calculado, en función del índice.

**Inicialización**: valen antes de la primera vuelta. **Estabilidad**: una
vuelta cualquiera los conserva. **Terminación**: el ciclo para, y ahí los
invariantes entregan la poscondición.

El paso que más se salta es el tercero. El valor final del índice no se
declara: sale de intersectar la condición rota con $I_0$. Si el ciclo se
detuvo, $i < N$ es falsa, o sea $i \geq N$; junto con $I_0: 0 \leq i \leq N$
eso da $i = N$, y no otra cosa.

## Varias variables a la vez

### El $n$-ésimo número de Fibonacci

La sucesión se define por $F(0) = 0$, $F(1) = 1$ y $F(k) = F(k-1) + F(k-2)$
para $k \geq 2$ (CLRS, Ecuación 3.21, p. 59).

Escribir esa definición como función recursiva funciona, pero recalcula:
$F(5)$ pide $F(4)$ y $F(3)$, y $F(4)$ vuelve a pedir $F(3)$. El árbol de
llamadas crece de forma exponencial. Con un ciclo basta cargar los dos
últimos valores y correrlos una posición en cada vuelta.

```python
def fibonacci(n):
    a = 0
    b = 1
    i = 0
    while i < n:
        siguiente = a + b
        a = b
        b = siguiente
        i = i + 1
    return a
```

La variable `siguiente` no sobra. La asignación `a = b` destruye el valor
viejo de `a`; si la siguiente línea tuviera que volver a sumarlo, ya no lo
encontraría.

### Los invariantes

$$I_0:\ 0 \leq i \leq n \qquad\qquad I_1:\ a = F(i) \ \wedge\ b = F(i+1)$$

$I_1$ no es una ecuación sino una conjunción: fija de un golpe qué guarda
cada variable, las dos referidas al mismo índice. Esa es la forma general;
el caso de un solo acumulador es la conjunción de un término.

Con solo la mitad $a = F(i)$ la estabilidad se atasca: para calcular el
nuevo valor de `a` hace falta saber qué había en `b`, y el invariante no lo
dice. El estado que el ciclo arrastra tiene que quedar descrito completo.

### La demostración

**Teorema 1.** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

**Inicialización.** Inicialmente $a = 0$, $b = 1$ e $i = 0$. Para $I_0$:
$0 \leq 0 \leq n$, cierto porque la especificación pide $n \geq 0$. Para
$I_1$: $a = 0 = F(0) = F(i)$ y $b = 1 = F(1) = F(i+1)$, ambos por
definición de la sucesión.

**Estabilidad.** Se considera una iteración arbitraria $i = j$ que ejecuta
el cuerpo, o sea con $j < n$, y se asume que antes de ella valen
$0 \leq j \leq n$, $a = F(j)$ y $b = F(j+1)$. Nombrando $a'$, $b'$ e $i'$ a
los valores nuevos:

$$\texttt{siguiente} = a + b = F(j) + F(j+1) = F(j+2)$$
$$a' = b = F(j+1) \qquad b' = F(j+2) = F\big((j+1)+1\big) \qquad i' = j+1$$

La tercera igualdad de la primera línea es la definición de $F$ aplicada a
$k = j+2$, que exige $j + 2 \geq 2$ y se cumple porque $j \geq 0$. Entonces
$a' = F(i')$ y $b' = F(i'+1)$, que es $I_1$ evaluado en $j+1$. Para $I_0$:
de $j < n$ sale $j + 1 \leq n$, y de $j \geq 0$ sale $j + 1 \geq 0$, luego
$0 \leq j+1 \leq n$. Por lo tanto, los invariantes son estables.

**Terminación.** El ciclo termina porque $i$ crece de 1 en 1 desde 0 e
$I_0$ lo acota por $n$. Al salir, la condición $i < n$ es falsa, o sea
$i \geq n$; junto con $I_0$ eso da $i = n$. Sustituyendo en $I_1$:
$a = F(n)$.

**Teorema 2.** La invocación `fibonacci(n)` para cualquier entero
$n \geq 0$ produce como resultado $F(n)$.

*Demostración*: se procede de forma directa a partir del Teorema 1. La
terminación deja $i = n$, y el primer término de $I_1$ evaluado en $n$ dice
$a = F(n)$, que es justamente lo que retorna la última línea.

### El orden de las asignaciones

Esta versión parece la misma:

```python
        a = b
        b = a + b
```

La primera línea deja $a = F(j+1)$, correcto. Pero la segunda ya no
encuentra el $a$ viejo: calcula $b' = F(j+1) + F(j+1) = 2F(j+1)$, y para
que $I_1$ valga en $j+1$ haría falta $F(j+2) = F(j+1) + F(j)$. Las dos
coinciden solo si $F(j) = F(j+1)$, que pasa únicamente en $j = 1$.

El error no se descubre corriendo el programa con $n = 2$, donde por
casualidad acierta. Se descubre en la estabilidad, que es donde el
argumento no cierra.

## Cuando la salida es una lista

El invariante de una lista que crece tiene que fijar dos cosas: cuántos
elementos lleva, en función del índice, y qué hay en cada posición ya
escrita. Las dos con fórmula: un cuantificador sobre las posiciones y,
dentro, una igualdad o una pertenencia.

Si falta lo primero, en la terminación se sabría qué hay en cada posición
de `res` pero no cuántas posiciones hay. Una lista vacía cumpliría de
forma trivial que todo lo escrito está bien, y la poscondición no
saldría.

Y no siempre es $\texttt{len(res)} = i$. Si la lista crece en todas las
vueltas, sí. Si crece solo cuando se cumple una condición, el largo va por
su cuenta y el invariante tiene que decir de qué depende.

### La lista crece a veces

```python
def posiciones_pares(A):
    N = len(A)
    res = []
    i = 0
    while i < N:
        if A[i] % 2 == 0:
            res.append(i)
        i = i + 1
    return res
```

Antes de los invariantes conviene nombrar el conjunto que el ciclo va
enumerando:

$$P_i = \{\, j \in \mathbb{Z} \;:\; 0 \leq j < i \;\wedge\; A[j] \bmod 2 = 0 \,\}$$

Son las posiciones pares de la parte ya revisada, y la poscondición pide
entregar $P_N$ en orden creciente. Con ese nombre los invariantes quedan
así:

$$I_0:\ 0 \leq i \leq N$$
$$I_1:\ \texttt{len(res)} = |P_i|$$
$$I_2:\ \forall k,\ 0 \leq k < \texttt{len(res)}:\ \texttt{res}[k] \in P_i$$
$$I_3:\ \forall k,\ 0 \leq k < \texttt{len(res)} - 1:\ \texttt{res}[k] < \texttt{res}[k+1]$$

Las tres últimas juntas dicen que `res` es $P_i$ en orden. $I_3$ obliga a
que las entradas sean distintas dos a dos, así que `res` tiene
$\texttt{len(res)}$ valores distintos; $I_2$ los mete a todos en $P_i$; e
$I_1$ dice que son tantos como $|P_i|$. Un subconjunto de $P_i$ con $|P_i|$
elementos distintos es $P_i$ completo.

Escrito en prosa —«`res` tiene las posiciones pares en orden»— quedan
tres preguntas abiertas: si el orden es estricto, si pueden faltar
posiciones y sobre qué rango. Cada una es un invariante que la estabilidad
usa por separado, y ninguna se puede sustituir en $j+1$ mientras no sea una
fórmula.

**Cómo crece $P_i$.** Separando de $P_{j+1}$ la posición $j$:

$$P_{j+1} = \begin{cases} P_j \cup \{j\} & \text{si } A[j] \bmod 2 = 0, \\ P_j & \text{si } A[j] \bmod 2 = 1. \end{cases}$$

Y por la definición de $P_j$, todo $t \in P_j$ cumple $t < j$; en
particular $j \notin P_j$, así que en el primer caso
$|P_{j+1}| = |P_j| + 1$.

**Inicialización.** $\texttt{res} = []$ e $i = 0$, luego
$\texttt{len(res)} = 0$. Para $I_0$: $0 \leq 0 \leq N$, cierto porque
$N \geq 0$. Para $I_1$: la condición $0 \leq j < 0$ es falsa para todo $j$,
luego $P_0 = \emptyset$ y $|P_0| = 0 = \texttt{len(res)}$. Para $I_2$ e
$I_3$: cuantifican sobre $0 \leq k < 0$ y sobre $0 \leq k < -1$, ambos
vacíos, y una afirmación universal sobre el vacío es cierta.

**Estabilidad.** Se considera una iteración arbitraria $i = j$ que ejecuta
el cuerpo, o sea con $j < N$, y se asumen $I_0$ a $I_3$ evaluados en $j$.
Sea $L = \texttt{len(res)}$ el largo antes de la vuelta y $\texttt{res}'$
el valor después del cuerpo.

*Caso $A[j] \bmod 2 = 0$.* El `append` deja $\texttt{res}'[k] =
\texttt{res}[k]$ para $k < L$ y $\texttt{res}'[L] = j$, con
$\texttt{len(res}') = L + 1$. Para $I_1$: $L + 1 = |P_j| + 1 = |P_{j+1}|$,
la última igualdad porque $j \notin P_j$. Para $I_2$: si $k < L$,
$\texttt{res}'[k] = \texttt{res}[k] \in P_j \subseteq P_{j+1}$; y
$\texttt{res}'[L] = j \in P_{j+1}$ por la condición del caso. Para $I_3$:
las parejas con $k+1 < L$ valen por hipótesis, y la nueva es
$\texttt{res}'[L-1] < \texttt{res}'[L] = j$, cierta porque
$\texttt{res}[L-1] \in P_j$ y todo elemento de $P_j$ es menor que $j$; con
$L = 0$ no hay pareja nueva.

*Caso $A[j] \bmod 2 = 1$.* El `append` no se ejecuta, luego
$\texttt{res}' = \texttt{res}$, y $P_{j+1} = P_j$. Los tres invariantes
evaluados en $j+1$ son las mismas afirmaciones sobre los mismos objetos que
la hipótesis.

Para $I_0$: de $j < N$ sale $j+1 \leq N$, y de $j \geq 0$ sale
$j+1 \geq 0$.

**Terminación.** Al salir, $i \geq N$; con $I_0$ eso da $i = N$.
Sustituyendo, $\texttt{len(res)} = |P_N|$, cada $\texttt{res}[k]$ está en
$P_N$ y la lista es estrictamente creciente. El orden estricto hace
distintas las $|P_N|$ entradas, así que el conjunto de valores de `res`
tiene $|P_N|$ elementos y está contenido en $P_N$, que tiene ese mismo
cardinal; entonces es $P_N$ completo, listado de menor a mayor.

### La lista crece siempre

**Especificación.** Entrada: un arreglo $A[0..N)$ con $N \geq 1$. Salida:
la lista $R[0..N)$ donde $R[j] = \max A[0..j]$. Con $A = [4, 2, 9, 9, 1]$
la respuesta es $[4, 4, 9, 9, 9]$.

```python
def maximos_parciales(A):
    N = len(A)
    m = A[0]
    res = [A[0]]
    i = 1
    while i < N:
        if A[i] > m:
            m = A[i]
        res.append(m)
        i = i + 1
    return res
```

El estado tiene tres partes y cada una necesita su línea:

$$I_0:\ 1 \leq i \leq N$$
$$I_1:\ m = \max A[0..i)$$
$$I_2:\ \texttt{len(res)} = i \ \wedge\ \forall j,\ 0 \leq j < i:\ \texttt{res}[j] = \max A[0..j]$$

El índice arranca en 1 porque las tres primeras líneas ya resolvieron la
posición 0. Si el ciclo empezara en $i = 0$, $I_1$ pediría el máximo del
rango vacío $A[0..0)$, que no existe. Mover el arranque a 1 elimina el caso
especial en vez de tener que arrastrarlo.

**Inicialización.** $m = A[0]$, $\texttt{res} = [A[0]]$ e $i = 1$. Para
$I_0$: $1 \leq 1 \leq N$, cierto por la precondición. Para $I_1$:
$\max A[0..1) = A[0] = m$. Para $I_2$: $\texttt{len(res)} = 1 = i$, y el
único $j$ con $0 \leq j < 1$ es $j = 0$, donde
$\texttt{res}[0] = A[0] = \max A[0..0]$.

**Estabilidad.** Se considera $i = j$ con $j < N$, y se asumen
$1 \leq j \leq N$, $m = \max A[0..j)$, $\texttt{len(res)} = j$ y
$\texttt{res}[k] = \max A[0..k]$ para todo $k < j$.

Si $A[j] > m$ el nuevo valor es $m' = A[j]$; si no, $m' = m$. En los dos
casos $m' = \max\{m, A[j]\}$, y sustituyendo $m$ por lo que promete $I_1$:

$$m' = \max\big\{\max A[0..j),\ A[j]\big\} = \max A[0..j] = \max A[0..j+1)$$

que es $I_1$ evaluado en $j+1$. El `append` deja $\texttt{len(res)} = j+1$,
escribe en la posición $j$ el valor $m' = \max A[0..j]$, que es lo que $I_2$
pide para $k = j$, y no toca las posiciones $k < j$, que seguían valiendo
por hipótesis. Para $I_0$: de $j < N$ sale $1 \leq j+1 \leq N$.

**Terminación.** Al salir, $i = N$. Sustituyendo en $I_2$:
$\texttt{len(res)} = N$ y $\texttt{res}[j] = \max A[0..j]$ para todo
$j < N$, que es la poscondición completa: el largo y el contenido.

$I_1$ no aparece en el teorema del algoritmo. La variable `m` es de
trabajo: su invariante existe para que la estabilidad de $I_2$ pueda
apoyarse en él. No todo invariante termina en la poscondición; algunos solo
sostienen a otros.

## Ciclos anidados

El trabajo va en dos etapas:

1. Se escriben los invariantes del **ciclo interno**, con el índice del
   externo *fijo*, y se demuestran con los tres pasos. La conclusión se
   guarda como un **lema**.
2. Se escriben los invariantes del **ciclo externo**. En su estabilidad, el
   ciclo interno entero se resume en una línea: la del lema.

El error que hay que evitar es volver a abrir el ciclo interno dentro de la
estabilidad del externo. Si el lema ya está demostrado, el externo lo cita.
Si no se cita, la demostración del externo se convierte en la del interno
otra vez, y no cierra.

Y escribir el invariante interno sin decir que $i$ está fijo lo deja sin
sentido: $i$ es un parámetro del lema, no una variable que se mueva.

### Ordenamiento por selección

Buscar el menor de todo el arreglo y ponerlo de primero. Buscar el menor de
lo que queda y ponerlo de segundo. Repetir. Al llegar al último elemento no
hay nada que buscar: ya es el mayor.

```python
def ordenar_por_seleccion(A):
    N = len(A)
    i = 0
    while i < N - 1:
        p = i
        j = i + 1
        while j < N:
            if A[j] < A[p]:
                p = j
            j = j + 1
        temporal = A[i]
        A[i] = A[p]
        A[p] = temporal
        i = i + 1
    return A
```

Sobre $[5, 2, 9, 1, 6]$:

| $i$ | $p$ al salir del interno | intercambio | $A$ después |
|:---:|:---:|:---:|:---|
| 0 | 3 | $A[0] \leftrightarrow A[3]$ | $[\mathbf{1}, 2, 9, 5, 6]$ |
| 1 | 1 | $A[1] \leftrightarrow A[1]$ | $[\mathbf{1}, \mathbf{2}, 9, 5, 6]$ |
| 2 | 3 | $A[2] \leftrightarrow A[3]$ | $[\mathbf{1}, \mathbf{2}, \mathbf{5}, 9, 6]$ |
| 3 | 4 | $A[3] \leftrightarrow A[4]$ | $[\mathbf{1}, \mathbf{2}, \mathbf{5}, \mathbf{6}, 9]$ |

El prefijo en negrita crece de a uno y nunca se vuelve a tocar. El último
elemento queda en su sitio sin que nadie lo mueva: cuando $i = N-1$ el ciclo
ya paró.

### El ciclo interno

Con $i$ fijo:

$$J_0:\ i+1 \leq j \leq N \ \wedge\ i \leq p < j \qquad\qquad J_1:\ A[p] = \min A[i..j)$$

**Lema 1.** Si al entrar al cuerpo del ciclo externo vale
$0 \leq i < N-1$, entonces al salir del ciclo interno se cumple
$A[p] = \min A[i..N)$ con $i \leq p < N$.

**Inicialización.** $p = i$ y $j = i+1$. Para $J_0$: la primera parte es
$i+1 \leq i+1 \leq N$, y $i+1 \leq N$ sale de la condición del externo
$i < N-1$, que da $i \leq N-2$; la segunda es $i \leq i < i+1$. Para $J_1$:
el rango $A[i..i+1)$ tiene un solo elemento, $A[i]$, así que su mínimo es
$A[i] = A[p]$.

**Estabilidad.** Se considera $j = q$ con $q < N$, y se asume
$A[p] = \min A[i..q)$ con $i \leq p < q$. Sea $p'$ el valor de $p$ después
del cuerpo.

Si $A[q] < A[p]$, entonces $p' = q$. Como $A[q] < A[p] = \min A[i..q)$, ese
valor es menor que todos los de $A[i..q)$; por lo tanto es el mínimo de
$A[i..q) \cup \{A[q]\} = A[i..q+1)$. Además $i \leq q < q+1$.

Si $A[q] \geq A[p]$, entonces $p' = p$. $A[p']$ sigue siendo menor o igual
que todos los de $A[i..q)$ por hipótesis, y también menor o igual que $A[q]$
por la condición de este caso; luego es el mínimo de $A[i..q+1)$. Y
$i \leq p < q < q+1$.

En ambos casos vale $J_1$ evaluado en $q+1$. Para el resto de $J_0$: de
$q < N$ sale $i+1 \leq q+1 \leq N$.

**Terminación.** El ciclo interno termina porque $j$ crece de 1 en 1 desde
$i+1$ y $J_0$ lo acota por $N$. Al salir, $j \geq N$; junto con $J_0$ eso da
$j = N$. Sustituyendo en $J_1$: $A[p] = \min A[i..N)$, y de $J_0$ queda
$i \leq p < N$.

Eso es todo lo que el ciclo externo va a usar. Cómo lo consiguió el interno
deja de importar a partir de aquí.

### El ciclo externo

$$I_0:\ 0 \leq i \leq N-1$$
$$I_1:\ \forall a, b,\ 0 \leq a < b < i:\ A[a] \leq A[b]$$
$$I_2:\ \forall a, b,\ 0 \leq a < i \leq b < N:\ A[a] \leq A[b]$$
$$I_3:\ \{\!\{\, A[t] : 0 \leq t < N \,\}\!\} = \{\!\{\, A_0[t] : 0 \leq t < N \,\}\!\}$$

con $A_0$ el arreglo que recibió la función y $\{\!\{\cdot\}\!\}$ el
multiconjunto: los mismos valores, con las mismas repeticiones.

Saber que $A[0..i)$ está ordenado no dice nada sobre lo que viene después.
El arreglo $[1, 2 \mid 0, 7]$ cumple $I_1$ con $i = 2$ y no está en camino
de quedar ordenado: el 0 de la derecha debería haber ido de primero. $I_1$
ordena hacia adentro del prefijo; $I_2$ lo separa del resto, y garantiza que
nada de la derecha tiene que volver a la izquierda.

$I_3$ tampoco sobra. Ordenar no es solo entregar algo ordenado: es entregar
*los mismos elementos* ordenados. Un ciclo que llenara el arreglo de ceros
cumpliría $I_1$ e $I_2$ sin ser un ordenamiento.

**Inicialización.** $i = 0$. Para $I_0$: $0 \leq 0 \leq N-1$, cierto
siempre que $N \geq 1$; con $N = 0$ el ciclo no corre y no hay nada que
probar. Para $I_1$: no hay $a$, $b$ con $0 \leq a < b < 0$, luego el
universal es cierto sobre el vacío. Para $I_2$: tampoco hay $a$ con
$0 \leq a < 0$, mismo argumento. Para $I_3$: nada se ha tocado todavía, así
que $A[t] = A_0[t]$ para todo $t$ y los dos multiconjuntos coinciden.

**Estabilidad.** Se considera $i = k$ con $k < N-1$, y se asumen $I_0$ a
$I_3$ para $k$. Por el **Lema 1**, al salir del ciclo interno vale
$A[p] = \min A[k..N)$ con $k \leq p < N$. El cuerpo intercambia $A[k]$ con
$A[p]$; sea $B$ el arreglo después del intercambio.

*$I_3$*: el intercambio permuta dos posiciones, así que el multiconjunto de
$B$ es el mismo de $A$, y por hipótesis el de $A_0$.

*$I_2$ sobrevive al intercambio*: las dos posiciones tocadas, $k$ y $p$,
están ambas en $[k..N)$. El multiconjunto $A[0..k)$ no cambió y el
multiconjunto $A[k..N)$ tampoco: sus elementos solo se reacomodaron.

*$I_1$ en $k+1$*: $B[0..k) = A[0..k)$ está ordenado por hipótesis. Falta ver
que $B[k]$ no rompe el orden al final: $B[k] \in A[k..N)$, y por $I_2$ todo
elemento de $A[0..k)$ es $\leq$ todo elemento de $A[k..N)$, en particular
$\leq B[k]$. Luego $B[0..k+1)$ está ordenado.

*$I_2$ en $k+1$*: para los elementos de $B[0..k)$ vale por lo ya dicho,
porque $B[k+1..N) \subseteq B[k..N)$. Para $B[k]$: es $\min A[k..N)$ por el
Lema 1, y $B[k+1..N)$ son elementos de ese mismo rango, luego $B[k] \leq$
todos ellos.

*$I_0$*: de $k < N-1$ sale $0 \leq k+1 \leq N-1$.

**Terminación.** Al salir, $i \geq N-1$; junto con $I_0$ eso da $i = N-1$.
$I_1$ da $A[a] \leq A[b]$ para $0 \leq a < b < N-1$, e $I_2$ da
$A[a] \leq A[b]$ para $0 \leq a < N-1 \leq b < N$, donde el único $b$ del
rango es $b = N-1$. Sea ahora una pareja cualquiera con
$0 \leq a < b < N$: si $b < N-1$ la cubre $I_1$, y si $b = N-1$ la cubre
$I_2$. Entonces $A[a] \leq A[b]$ para toda pareja, que es la definición de
orden no decreciente sobre $A[0..N)$. Con $I_3$, además, son los elementos
originales.

### El costo

Para cada $i$, el ciclo interno recorre $A[i+1..N)$, o sea $N - i - 1$
comparaciones. Sumando:

$$\sum_{i=0}^{N-2} (N - i - 1) = \sum_{t=1}^{N-1} t = \frac{N(N-1)}{2}$$

Ese conteo no depende del contenido del arreglo: el interno recorre todo el
sufijo aunque el mínimo aparezca de primero. Peor caso y mejor caso
coinciden en $\Theta(N^2)$.

Mezcla cuesta $\Theta(N \lg N)$ y este $\Theta(N^2)$. Con $N = 10^6$ la
diferencia es de unas 25 000 veces. Lo que selección tiene a favor es que
ordena sobre el mismo arreglo, sin pedir memoria extra, y que hace a lo sumo
$N-1$ intercambios.

Ordenamiento por selección es el Ejercicio 2.2-2 de CLRS (p. 29), que pide
justamente el invariante del ciclo externo.

## Variantes de la búsqueda binaria

Sobre $A = [1, 3, 3, 3, 7, 9]$ hay preguntas que la versión de siempre no
responde:

- ¿Dónde *empieza* el bloque de treses? ¿Dónde termina?
- ¿Cuántas veces aparece el 3?
- El 5 no está. ¿Cuál es el mayor elemento que no lo supera?
- ¿En qué posición habría que insertar el 5 para conservar el orden?

La versión que devuelve la posición de $x$, o $-1$ si no está, no contesta
ninguna de las cuatro: con repetidos entrega *alguna* posición, sin decir cuál, y
cuando $x$ no está tira el trabajo hecho.

### Buscar un borde, no un elemento

Sobre un arreglo ordenado, el predicado $P(j): A[j] \geq x$ recorre las
posiciones así, con $x = 3$:

| $A[j]$ | 1 | 3 | 3 | 3 | 7 | 9 |
|:---|:-:|:-:|:-:|:-:|:-:|:-:|
| $P(j)$ | F | V | V | V | V | V |

El orden del arreglo obliga a que los falsos vayan todos primero y los
verdaderos todos después. Ese es el mismo terreno de la bisección: una
función monótona y un borde que encontrar partiendo el intervalo. Cambiar la
pregunta es cambiar el predicado, no el algoritmo.

```python
def primera_posicion_mayor_o_igual(A, x):
    l = 0
    r = len(A)
    while l < r:
        mitad = (l + r) // 2
        if A[mitad] < x:
            l = mitad + 1
        else:
            r = mitad
    return l
```

$$I_0:\ 0 \leq l \leq r \leq N \qquad I_1:\ \forall j < l:\ A[j] < x \qquad I_2:\ \forall j \geq r:\ A[j] \geq x$$

Al terminar, $l = r$, y las dos afirmaciones se tocan: todo lo anterior a
$l$ es menor que $x$ y todo lo que sigue desde $l$ no lo es. Eso es
exactamente el borde, exista $x$ o no.

Tres detalles que cuestan puntos:

- Se escribe `r = mitad`, no `mitad - 1`. La posición `mitad` cumple el
  predicado y podría ser el borde: descartarla es perderlo.
- $r$ arranca en `len(A)`, no en `len(A) - 1`. Ese valor de más es el que
  permite responder que ninguna posición cumple, devolviendo $N$, en lugar
  de tener que inventar un caso especial.
- La condición es `l < r`. Con `l <= r` el ciclo no termina: cuando $l = r$
  se tiene $\texttt{mitad} = l$, y la rama del `else` vuelve a poner
  $r = l$ sin mover nada.

### Las otras tres preguntas

```python
def primera_posicion_mayor(A, x):
    l = 0
    r = len(A)
    while l < r:
        mitad = (l + r) // 2
        if A[mitad] <= x:
            l = mitad + 1
        else:
            r = mitad
    return l
```

Lo único que cambió es el `<` de la comparación, que pasó a `<=`. El
predicado ahora es $A[j] > x$, y el borde se corre al final del bloque de
copias de $x$. Con los dos bordes se responde todo:

```python
def esta(A, x):
    p = primera_posicion_mayor_o_igual(A, x)
    return p < len(A) and A[p] == x


def cuantas_veces(A, x):
    return primera_posicion_mayor(A, x) - primera_posicion_mayor_o_igual(A, x)


def mayor_menor_o_igual(A, x):
    return primera_posicion_mayor(A, x) - 1
```

Sobre $A = [1, 3, 3, 3, 7, 9]$ los dos bordes del 3 son 1 y 4: el bloque
ocupa las posiciones 1, 2 y 3, y $4 - 1 = 3$ copias. Para $x = 5$,
`primera_posicion_mayor` devuelve 4, y $4 - 1 = 3$ es la posición del 3, el
mayor elemento que no supera al 5. Cuando todos son mayores que $x$, el
borde vale 0 y la resta devuelve $-1$, que es la señal de que no hay.

## Errores comunes

Con varias variables:

- Describir solo una parte del estado. Si la estabilidad necesita un valor
  que ningún invariante menciona, el argumento se atasca.
- Usar el valor nuevo de una variable donde el código todavía lee el viejo.
  En la estabilidad conviene nombrarlos aparte: $a$ y $a'$.

Con la lista que crece:

- Decir qué hay en cada posición y no cuántas posiciones hay. La
  terminación entrega media poscondición.
- Suponer $\texttt{len(res)} = i$ cuando la lista crece bajo condición.

Con ciclos anidados:

- Escribir el invariante del interno sin fijar el índice del externo.
- Repetir la demostración del interno dentro de la estabilidad del externo,
  en vez de citar el lema.
- Olvidar que el cuerpo del externo modifica el arreglo, y dar por hecho que
  los invariantes valen sobre el arreglo de antes.

## El código

Los cuatro programas traen los invariantes escritos como `assert` al entrar
y al salir del cuerpo del ciclo, que es donde se ve si la estabilidad
aguanta. Correrlos no demuestra nada, pero un `assert` que revienta señala
exactamente dónde está mal el invariante.

- [fibonacci.py](codigo/fibonacci.py)
- [listas.py](codigo/listas.py)
- [seleccion.py](codigo/seleccion.py)
- [variantes.py](codigo/variantes.py)

```
python3 seleccion.py
```

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, tercera edición, MIT Press, 2009. Sección 2.1 (invariantes de
  ciclo, pp. 18–20), Ejercicio 2.2-2 (ordenamiento por selección, p. 29) y
  Ecuación 3.21 (Fibonacci, p. 59).
- C. Rocha. *Diseño y Análisis de Algoritmos*.
- J. Kleinberg y É. Tardos. *Algorithm Design*, Addison-Wesley, 2005.
- S. Halim, F. Halim y S. Effendy. *Competitive Programming 4*, 2018.
  Capítulo 2: las variantes de la búsqueda binaria.
