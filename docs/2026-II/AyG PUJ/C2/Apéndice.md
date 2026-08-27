# Apéndice. El arreglo en el invariante y la inducción estructural

Este apéndice nace de una pregunta que salió en la clase del grupo A: si cada
variable que cambia lleva su invariante, ¿no debería haber un invariante para
el arreglo? La respuesta corta: depende de si el arreglo cambia. En los
ejemplos de la clase (`sumarArreglo`, `fact`, la búsqueda) el arreglo solo se
lee, así que pertenece a la precondición y no al estado. Pero cuando el
algoritmo escribe sobre el arreglo, el arreglo entra al estado y el invariante
tiene que hablar de él.

Aquí está lo que quedó pendiente de esa conversación: dos ejercicios
resueltos donde el arreglo se modifica y hace parte del invariante, un
tercero que además tiene dos ciclos anidados, cada uno con su propia pareja
de invariantes, y la demostración por inducción estructural de un algoritmo
de divide y vencerás, escrita completa.

## Cuando el arreglo cambia

Primero, una pieza de notación, tomada del material del profesor titular.
Cuando una entrada se modifica dentro del ciclo, su valor original se congela
con una prima: en uno de sus ejemplos, donde el parámetro $N$ va cambiando,
la demostración introduce $N'$ leyendo la línea de inicialización como si
además ejecutara $N' = N$. Para un arreglo es la misma idea: $A'$ es la copia
de $A$ tomada antes de la primera iteración. No es una variable del programa;
es un valor fijo, y por eso los invariantes pueden mencionarlo sin que nada
lo altere.

Con esa notación, el invariante del arreglo casi siempre tiene la misma forma,
en dos cláusulas:

1. **La zona ya transformada**: qué relación guardan con $A'$ las posiciones
   por las que el ciclo ya pasó.
2. **La zona intacta**: las posiciones que el ciclo no ha tocado todavía
   conservan su valor original, $A[k] = A'[k]$.

La segunda cláusula parece un trámite y es la que hace el trabajo. En la
estabilidad, cuando el cuerpo lee una posición no visitada, la única forma de
saber qué contiene es que el invariante afirme que ahí sigue el valor
original. Sin esa cláusula la demostración se queda sin piso, como se ve en
los dos ejemplos.

## Ejemplo 1: acumular las sumas en el mismo arreglo

En la clase, `sumarArreglo` guardaba la suma del prefijo en la variable `ans`.
Este algoritmo guarda esa misma información dentro del arreglo: al terminar,
cada posición debe contener la suma de los elementos originales hasta ella.

**Especificación.** Entrada: un arreglo $A[0..N)$ de números, $N \geq 1$.
Salida: el mismo arreglo, donde para todo $k \in [0..N)$:

$$A[k] = \sum_{t=0}^{k} A'[t]$$

```python
def acumular(A):
    i = 1
    while i < len(A):
        A[i] = A[i - 1] + A[i]
        i = i + 1
    return A
```

La cadena de estados con el arreglo de la clase, $A = [9, 4, -5, 1, 8, 3]$.
Como el arreglo cambia, el estado ya no es una pareja de números: es la tupla
$(i, A)$.

| Chequeo | $i$ | $A$ |
|:---:|:---:|---|
| 1 | 1 | `[9, 4, -5, 1, 8, 3]` |
| 2 | 2 | `[9, 13, -5, 1, 8, 3]` |
| 3 | 3 | `[9, 13, 8, 1, 8, 3]` |
| 4 | 4 | `[9, 13, 8, 9, 8, 3]` |
| 5 | 5 | `[9, 13, 8, 9, 17, 3]` |
| 6 | 6 | `[9, 13, 8, 9, 17, 20]` |

El arreglo final es `[9, 13, 8, 9, 17, 20]`: exactamente la columna `ans` de
la traza de la clase, solo que ahora vive dentro del arreglo. Y en cada fila
se ve el patrón de las dos zonas: a la izquierda de $i$, sumas de prefijos; de
$i$ en adelante, los valores originales sin tocar.

**Los invariantes.**

$$I_0: 1 \leq i \leq N$$

$$I_1: \underbrace{\forall k < i:\; A[k] = \sum_{t=0}^{k} A'[t]}_{\text{zona ya transformada}} \qquad \wedge \qquad \underbrace{\forall k \in [i..N):\; A[k] = A'[k]}_{\text{zona intacta}}$$

**Teorema 1.** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

**Inicialización.** La línea 1 deja $i = 1$ y el ciclo aún no ha escrito nada,
así que $A = A'$. Para $I_0$: $1 \leq 1 \leq N$, que vale por la precondición
$N \geq 1$. ✓ Para $I_1$: la zona transformada es solo $k = 0$, y
$A[0] = A'[0] = \sum_{t=0}^{0} A'[t]$; la zona intacta cumple
$A[k] = A'[k]$ porque nada ha cambiado. ✓

**Estabilidad.** Se considera una iteración arbitraria $i = j$, diferente a la
última (con $j < N$), y se asumen $1 \leq j \leq N$ y las dos cláusulas de
$I_1$. La línea 3 ejecuta $A[j] = A[j-1] + A[j]$, y aquí trabajan las dos
cláusulas a la vez:

- $A[j-1]$ está en la zona transformada ($j - 1 < j$), así que vale
  $\sum_{t=0}^{j-1} A'[t]$;
- $A[j]$ está en la zona intacta ($j \in [j..N)$), así que todavía vale
  $A'[j]$.

El nuevo valor es entonces
$\sum_{t=0}^{j-1} A'[t] + A'[j] = \sum_{t=0}^{j} A'[t]$: la primera
cláusula ahora vale para $k = j$. Las posiciones de $[j+1..N)$ no se tocaron,
así que la segunda cláusula vale para el nuevo rango. Tras la línea 4,
$i = j+1$, y de $j < N$ sale $1 \leq j+1 \leq N$: vale $I_0$. Por lo tanto,
los invariantes son estables. ✓

**Terminación.** Se puede garantizar que el ciclo termina ya que $i$ se
incrementa de 1 en 1 e $I_0$ lo acota por $N$. Finalmente, al salir, la
condición $i < N$ es falsa, o sea $i \geq N$; junto con $I_0$ esto da
exactamente $i = N$. Sustituyendo ese valor en $I_1$: la zona transformada es
todo $[0..N)$ y la zona intacta queda vacía, es decir, para todo $k$,
$A[k] = \sum_{t=0}^{k} A'[t]$: la poscondición. Por lo tanto, los invariantes
son correctos. $\blacksquare$

**Teorema 2.** La invocación `acumular(A)` para cualquier arreglo de números
$A[0..N)$ con $N \geq 1$ deja en cada posición $k$ la suma de los elementos
originales hasta $k$.

*Demostración*: es trivial a partir de la correctitud de los invariantes $I_0$
e $I_1$ (Teorema 1): la terminación deja $i = N$, y sustituir ese valor en
$I_1$ da la poscondición, que es lo que retorna la línea 5. $\blacksquare$

!!! note "Dónde se usó la zona intacta"

    En la estabilidad, el cuerpo lee $A[j]$, una posición que el ciclo no
    había visitado. Si $I_1$ no afirmara que ahí sigue $A'[j]$, no habría
    manera de saber qué se está sumando y la cadena de igualdades se
    rompería en el primer paso. Cada vez que un algoritmo lee posiciones
    todavía no procesadas de un arreglo que él mismo modifica, esa cláusula
    es la que sostiene la prueba.

## Ejemplo 2: invertir el arreglo en sitio

El segundo ejemplo mueve más piezas: dos índices que avanzan uno hacia el
otro intercambiando extremos, sin arreglo auxiliar.

**Especificación.** Entrada: un arreglo $A[0..N)$ de números, $N \geq 0$.
Salida: el mismo arreglo, donde para todo $k \in [0..N)$:
$A[k] = A'[N-1-k]$.

```python
def invertir(A):
    i = 0
    j = len(A) - 1
    while i < j:
        t = A[i]
        A[i] = A[j]
        A[j] = t
        i = i + 1
        j = j - 1
    return A
```

La cadena de estados $(i, j, A)$ con $A = [9, 4, -5, 1, 8, 3]$:

| Chequeo | $(i, j)$ | $A$ |
|:---:|:---:|---|
| 1 | $(0, 5)$ | `[9, 4, -5, 1, 8, 3]` |
| 2 | $(1, 4)$ | `[3, 4, -5, 1, 8, 9]` |
| 3 | $(2, 3)$ | `[3, 8, -5, 1, 4, 9]` |
| 4 | $(3, 2)$ | `[3, 8, 1, -5, 4, 9]` |

En cada fila, los extremos ya están intercambiados y el centro sigue intacto.
Y hay un patrón escondido en la pareja de índices: $0+5$, $1+4$, $2+3$,
$3+2$… la suma $i + j$ vale $5 = N - 1$ en todas las filas. Esa ecuación es
parte del invariante, igual que en los ejercicios donde dos variables
numéricas se mueven acopladas.

**Los invariantes.**

$$I_0: 0 \leq i \;\wedge\; j \leq N-1 \;\wedge\; i + j = N - 1$$

$$I_1: \forall k < i:\; A[k] = A'[N-1-k] \,\wedge\, A[N-1-k] = A'[k] \qquad \wedge \qquad \forall k \in [i..j]:\; A[k] = A'[k]$$

La primera cláusula dice que las $i$ primeras posiciones y sus espejos ya
quedaron intercambiados; la segunda, que el bloque central $[i..j]$ no se ha
tocado. Gracias a la ecuación $i + j = N-1$, esas dos zonas cubren juntas todo
el arreglo.

**Teorema 1.** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

**Inicialización.** Las líneas 1--2 dejan $i = 0$ y $j = N-1$. Para $I_0$:
$0 \leq 0$, $N-1 \leq N-1$ y $0 + (N-1) = N-1$. ✓ Para $I_1$: la primera
cláusula es vacía y la segunda pide $A[k] = A'[k]$ en $[0..N-1]$, que vale
porque nada ha corrido. ✓

**Estabilidad.** Se considera una iteración arbitraria con $i = a$ y $j = b$,
diferente a la última (con $a < b$), y se asume $I_0$ e $I_1$; en particular
$b = N-1-a$. Las líneas 4--6 intercambian $A[a]$ y $A[b]$. Como $a$ y $b$
están en el bloque central $[a..b]$, la segunda cláusula dice que antes del
intercambio $A[a] = A'[a]$ y $A[b] = A'[b]$. Después del intercambio:

$$A[a] = A'[b] = A'[N-1-a] \qquad \text{y} \qquad A[b] = A'[a] = A'[N-1-b],$$

que es exactamente lo que la primera cláusula exige para la posición $a$ (la
segunda igualdad usa $a = N-1-b$, que sale de la ecuación de $I_0$). El bloque
central pasa a ser $[a+1..b-1]$, que no se tocó. Tras las líneas 7--8,
$i = a+1$ y $j = b-1$: la suma se conserva,
$(a+1) + (b-1) = a + b = N-1$, y las cotas de $I_0$ se mantienen. Por lo
tanto, los invariantes son estables. ✓

**Terminación.** En cada iteración la distancia $j - i$ baja exactamente en 2,
así que el ciclo termina: una cantidad entera que decrece estrictamente no
puede cumplir $i < j$ para siempre. Finalmente, al salir, $i \geq j$, y la
ecuación $i + j = N-1$ deja solo dos formas de salir:

- **$N$ par.** La distancia $j - i$ arranca impar y baja de 2 en 2, así que
  nunca vale 0: el ciclo sale con $i = j + 1 = N/2$. El bloque central
  $[i..j]$ queda vacío y la primera cláusula, evaluada en $i = N/2$, cubre
  cada posición y su espejo: todo el arreglo quedó invertido.
- **$N$ impar.** La distancia arranca par y el ciclo sale con
  $i = j = (N-1)/2$. El bloque central es una sola posición, el centro
  $k = (N-1)/2$, y ahí la segunda cláusula da $A[k] = A'[k]$, que es lo que
  pide la poscondición porque el centro es su propio espejo: $k = N-1-k$.

En ambos casos, para todo $k$: $A[k] = A'[N-1-k]$, la poscondición. Por lo
tanto, los invariantes son correctos. $\blacksquare$

**Teorema 2.** La invocación `invertir(A)` para cualquier arreglo de números
$A[0..N)$ deja el arreglo invertido.

*Demostración*: es trivial a partir de la correctitud de los invariantes $I_0$
e $I_1$ (Teorema 1): la terminación cubre los casos $N$ par e impar y en ambos
entrega la poscondición, que es lo que retorna la línea 9. $\blacksquare$

!!! note "El caso límite del centro"

    Con $N$ impar hay una posición que ningún intercambio toca: el centro. La
    demostración no la pasa por alto; la segunda cláusula de $I_1$ la cubre y
    la terminación explica por qué quedarse quieta es justo lo correcto para
    ella. Si al escribir una demostración aparece una posición que el
    algoritmo nunca visita, la pregunta no es si la prueba está mal: es qué
    cláusula del invariante responde por esa posición.

## Ejemplo 3: dos ciclos anidados

Hasta aquí cada algoritmo tenía un solo `while`. Cuando hay un ciclo adentro
de otro, **cada ciclo lleva su propia pareja de invariantes**, y la
estabilidad del externo usa la terminación del interno como un resultado ya
probado. Así está hecho el
ordenamiento por inserción en el material del profesor titular: el ciclo
externo lleva $I_0$ e $I_1$, el interno continúa la numeración con $I_2$ e
$I_3$, y el teorema del interno se demuestra primero. El ordenamiento por
selección repite esa estructura con otro algoritmo, y junta el ingrediente de los
ciclos anidados con el de los dos ejemplos anteriores, porque también
modifica el arreglo.

**Especificación.** Entrada: un arreglo $A[0..N)$ de números, $N \geq 1$.
Salida: el mismo arreglo, ordenado ascendentemente y con los mismos elementos
de $A'$.

Esa segunda condición no es adorno. Un algoritmo que escribiera ceros en todas
las posiciones también dejaría el arreglo *ordenado*; lo que convierte esto en
un ordenamiento es que el resultado sea una **permutación** del contenido
original.

```python
def seleccion(A):
    i = 0
    while i < len(A) - 1:
        m = i
        k = i + 1
        while k < len(A):
            if A[k] < A[m]:
                m = k
            k = k + 1
        t = A[i]
        A[i] = A[m]
        A[m] = t
        i = i + 1
    return A
```

La idea: en cada vuelta del ciclo externo, el ciclo interno busca la posición
$m$ del menor elemento del tramo $A[i..N)$ y el intercambio lo deja en la
posición $i$. El prefijo ordenado crece de a una posición por vuelta.

**Los invariantes del ciclo externo.** Las parejas se numeran de corrido,
como en el material del titular: $I_0$ e $I_1$ para el externo, $I_2$ e $I_3$
para el interno.

$$I_0: 0 \leq i \leq N - 1$$

$I_1$, en tres cláusulas:

1. $A[0..i)$ está ordenado ascendentemente;
2. todo elemento de $A[0..i)$ es $\leq$ que todo elemento de $A[i..N)$;
3. $A$ es una permutación de $A'$.

La cláusula 2 es la que suele olvidarse. Sin ella, el prefijo podría estar
ordenado pero contener elementos grandes que el sufijo todavía guarda más
pequeños, y el ordenamiento final no saldría. Con ella, cada elemento que el
prefijo ya tiene está en su posición definitiva.

**Los invariantes del ciclo interno.** Valen para el $i$ fijo de la vuelta en
curso:

$$I_2: i + 1 \leq k \leq N \;\wedge\; i \leq m < k \qquad\qquad I_3: A[m] \leq A[t] \text{ para todo } t \in [i..k)$$

Es decir: $m$ apunta siempre al mínimo del tramo ya examinado $[i..k)$.

**Teorema (invariantes $I_2$ e $I_3$).** Para cada vuelta del ciclo externo
con $i$ fijo, los invariantes $I_2$ e $I_3$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

*Inicialización.* Las líneas 3--4 dejan $m = i$ y $k = i+1$. Para $I_2$:
$i+1 \leq i+1 \leq N$ (hay vuelta del externo solo si $i < N-1$) e
$i \leq i < i+1$. ✓ Para $I_3$: el tramo $[i..i+1)$ tiene un solo elemento y
$A[m] = A[i]$ es su mínimo. ✓

*Estabilidad.* Iteración arbitraria $k = c$, diferente a la última (con
$c < N$), asumiendo $I_2$ y $I_3$. La comparación de la línea 6 abre dos
casos: si $A[c] < A[m]$, la línea 7 mueve $m$ a $c$, y el nuevo $A[m]$ es
menor que el mínimo anterior y que $A[c]$, así que es el mínimo de
$[i..c{+}1)$; si $A[c] \geq A[m]$, $m$ no cambia y el mínimo tampoco. En ambos
casos $I_3$ vale para el tramo extendido, la línea 8 deja $k = c+1$ y las
cotas de $I_2$ se mantienen. ✓

*Terminación.* $k$ sube de 1 en 1 y $I_2$ lo acota por $N$. Finalmente, al
salir, $k = N$ y $I_3$ dice que $A[m]$ es el mínimo de todo el tramo
$A[i..N)$. $\blacksquare$

**Teorema (invariantes $I_0$ e $I_1$).** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

*Inicialización.* La línea 1 deja $i = 0$. Para $I_0$: $0 \leq 0 \leq N-1$
por la precondición $N \geq 1$. ✓ Para $I_1$: el prefijo $[0..0)$ es vacío,
así que las cláusulas 1 y 2 se cumplen sin pedir nada, y $A = A'$ es una
permutación de sí mismo. ✓

*Estabilidad.* Iteración arbitraria $i = j$, diferente a la última (con
$j < N-1$), asumiendo $I_0$ e $I_1$. Aquí es donde los dos ciclos se
encadenan: el cuerpo ejecuta el ciclo interno completo, y **por la
terminación del teorema de $I_2$ e $I_3$** sale con $m$ apuntando al mínimo
de $A[j..N)$. No
hay que volver a analizar el ciclo interno línea a línea; su teorema ya está
probado y se usa como un hecho. Las líneas 9--11 intercambian $A[j]$ con
$A[m]$, y las tres cláusulas se conservan:

1. El intercambio solo toca posiciones del sufijo ($j \leq m$), así que
   $A[0..j)$ sigue ordenado; y el nuevo $A[j]$, por ser un elemento del
   sufijo, es $\geq$ que $A[j-1]$ por la cláusula 2 asumida. El prefijo
   extendido $A[0..j{+}1)$ queda ordenado. ✓
2. El nuevo $A[j]$ es el mínimo del sufijo, así que es $\leq$ que todo lo que
   queda en $A[j{+}1..N)$; y los elementos de $A[0..j)$ ya eran $\leq$ que
   todo el sufijo, que solo se reorganizó internamente. ✓
3. Un intercambio no agrega ni quita elementos: sigue siendo permutación de
   $A'$. ✓

La línea 12 deja $i = j+1$, con $0 \leq j+1 \leq N-1$: vale $I_0$. Por lo
tanto, los invariantes son estables. ✓

*Terminación.* $i$ sube de 1 en 1 e $I_0$ lo acota por $N-1$. Finalmente, al
salir, $i = N-1$, y $I_1$ dice: $A[0..N{-}1)$ está ordenado, cada uno de sus
elementos es $\leq A[N-1]$, y $A$ es permutación de $A'$. Las dos primeras
cláusulas juntas dan el arreglo completo ordenado; la tercera, que es el
mismo contenido de siempre: la poscondición. Por lo tanto, los invariantes
son correctos. $\blacksquare$

**Teorema (el algoritmo).** La invocación `seleccion(A)` para cualquier arreglo de números
$A[0..N)$ con $N \geq 1$ deja el arreglo ordenado ascendentemente con los
elementos de $A'$.

*Demostración*: es trivial a partir de la correctitud de los invariantes
$I_0$, $I_1$, $I_2$ e $I_3$ (los dos teoremas anteriores): la terminación del externo
entrega la poscondición, que es lo que retorna la línea 13. $\blacksquare$

!!! note "La jerarquía de los dos ciclos"

    La estructura de la prueba copia la estructura del programa. El ciclo
    interno se demuestra primero y por separado, con su propia pareja $I_2$,
    $I_3$ y sus tres pasos; el externo lo consume como lema en su
    estabilidad. Si un tercer ciclo envolviera a estos dos, el patrón se
    repetiría con $I_4$ e $I_5$: cada nivel prueba el suyo y usa el teorema
    del nivel de adentro. En los ejercicios con ciclos anidados, proponga siempre las dos
    parejas antes de escribir cualquier demostración.

## Comprobar estos invariantes con el computador

Los tres ejemplos están en la carpeta de código con los `assert` puestos
sobre todas las cláusulas, contra la foto $A'$:

- [acumular.py](codigo/acumular.py) imprime la cadena de estados de arriba y
  prueba los 363 arreglos de largo 1 a 5 sobre $\{-1, 0, 2\}$.
- [invertir.py](codigo/invertir.py) hace lo propio con los 1 093 arreglos de
  largo 0 a 6 sobre $\{0, 1, 2\}$, que cubren largos pares e impares.
- [seleccion.py](codigo/seleccion.py) verifica las dos parejas a la vez: los
  `assert` de $I_2$ y $I_3$ corren en cada chequeo del ciclo interno y los de
  $I_0$ e $I_1$ en cada chequeo del externo, sobre 1 092 arreglos.

```bash
python3 acumular.py
python3 invertir.py
python3 seleccion.py
```

Aplica la advertencia de la clase: que ningún `assert` falle no demuestra
nada, pero un `assert` que falla refuta el invariante de inmediato y dice en
qué chequeo. Es la forma barata de descartar una fórmula falsa antes de gastar
media hora demostrándola.

## La inducción estructural del máximo

La clase de divide y vencerás dejó enunciada la técnica para los algoritmos
recursivos: el caso base se verifica directo y el caso recursivo asume que las
llamadas sobre problemas más pequeños son correctas. Aquí está esa prueba
escrita completa para el máximo recursivo, en las mismas cuatro partes:
teorema, estrategia, desarrollo y conclusión.

```python
def maximo(lista, ini, fin):
    # Maximo de lista[ini..fin] partiendo el rango en dos
    if ini == fin:
        resultado = lista[ini]
    else:
        mitad = (ini + fin) // 2
        max_izq = maximo(lista, ini, mitad)
        max_der = maximo(lista, mitad + 1, fin)
        if max_izq >= max_der:
            resultado = max_izq
        else:
            resultado = max_der
    return resultado
```

**Especificación.** Entrada: un arreglo `lista`$[0..N)$ de números con
$N \geq 1$, e índices $0 \leq ini \leq fin \leq N-1$. Salida:
$\max(\mathtt{lista}[ini..fin])$, el mayor valor del rango.

En los iterativos la demostración avanza sobre las iteraciones; aquí avanza
sobre el **tamaño del rango**, $n = fin - ini + 1$. Esa es la medida que
decrece con cada llamada, y jugará el papel que en los ciclos jugaba el
índice.

**Teorema.** Para todo rango con $0 \leq ini \leq fin \leq N-1$, la invocación
`maximo(lista, ini, fin)` produce $\max(\mathtt{lista}[ini..fin])$.

**Demostración.** Se procede por inducción estructural sobre el tamaño del
rango, $n = fin - ini + 1$.

**Caso base** ($n = 1$). Entonces $ini = fin$, la condición de la línea 2 es
verdadera y el algoritmo devuelve `lista[ini]`. El máximo de un rango con un
solo elemento es ese elemento, así que la salida coincide con la
especificación. ✓

**Caso inductivo** ($n > 1$). La hipótesis de inducción: la invocación es
correcta para **todo** rango de tamaño menor que $n$. Como $n > 1$ se tiene
$ini < fin$, y hay que verificar dos cosas antes de usar la hipótesis.

*Primero, la partición separa y reduce.* La línea 5 calcula
$mitad = \lfloor (ini + fin)/2 \rfloor$. De $ini < fin$ sale
$ini \leq mitad < fin$: la cota izquierda porque el piso del promedio de dos
enteros no baja del menor, y la estricta porque
$mitad \leq \lfloor (fin - 1 + fin)/2 \rfloor < fin$. En consecuencia los dos
subrangos $[ini..mitad]$ y $[mitad{+}1..fin]$ son no vacíos, y sus tamaños,
$mitad - ini + 1$ y $fin - mitad$, son ambos menores que $n$. Sin esta
verificación la hipótesis de inducción no se puede invocar; es el equivalente
recursivo de comprobar que un ciclo avanza.

*Segundo, combinar es correcto.* Por la hipótesis de inducción,
$\mathtt{max\_izq} = \max(\mathtt{lista}[ini..mitad])$ y
$\mathtt{max\_der} = \max(\mathtt{lista}[mitad{+}1..fin])$. Todo elemento del
rango $[ini..fin]$ está en exactamente una de las dos partes, así que el
máximo del rango completo es $\max(\mathtt{max\_izq}, \mathtt{max\_der})$, y
eso es lo que las líneas 8--11 devuelven. ✓

**Conclusión.** Por inducción estructural, la invocación es correcta para
todo rango; en particular, `maximo(lista, 0, N-1)` produce el máximo del
arreglo completo. $\blacksquare$

!!! note "Los errores comunes, leídos desde la prueba"

    Los dos tropiezos de la clase son exactamente las dos obligaciones del
    caso inductivo. Un caso base ausente o mal puesto rompe el arranque de la
    inducción: no hay $n = 1$ desde donde crecer. Y una partición que no
    reduce rompe la hipótesis: si una de las partes puede quedar del tamaño
    original, la inducción no tiene sobre qué apoyarse, y el programa, en
    espejo, se cuelga en una recursión sin fondo. La prueba y el programa
    fallan en el mismo sitio.

El archivo [maximo_recursivo.py](codigo/maximo_recursivo.py) comprueba las dos
obligaciones por computador: un `assert` verifica en cada llamada que la
partición separa y reduce, y el resultado se contrasta contra la versión
iterativa para 18 356 rangos de arreglos cortos.

### Las dos técnicas, juntas

`ordenar` es el cierre natural de este apéndice, y queda como ejercicio. Su
demostración es la misma inducción estructural del máximo, sobre el tamaño
del rango: el caso base es el rango de cero o un elemento, ya ordenado; el
caso inductivo parte el rango con `mitad`, y la hipótesis de inducción
entrega los dos tramos ordenados. El paso de combinar no hay que probarlo
de cero: la clase ya demostró con invariantes que `mezclar` deja
`lista[ini..fin]` ordenado cuando recibe los dos tramos ordenados. Ese
Teorema 2 se usa aquí como lema, y así es como conviven las dos técnicas del
curso: los invariantes certifican los ciclos y la inducción estructural arma
con ellos la correctitud de la recursión.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein. *Introduction to
  Algorithms*, 3.ª ed., MIT Press, 2009. Sección 2.1, pp. 18--20 (invariantes
  de ciclo) y Sección 2.3.1, pp. 30--34 (divide y vencerás; la correctitud de
  Merge, pp. 31--33, con un invariante cuya estabilidad va por casos).
- C. Rocha. *Diseño y Análisis de Algoritmos*.
