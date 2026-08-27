# Búsqueda binaria y bisección

**Grupo A — viernes 28 de agosto de 2026.**

Divide y vencerás dejó la idea de dividir, conquistar y combinar, con el
máximo y el ordenamiento por mezcla. Aquí la cuenta sale todavía mejor:
cuando el espacio de búsqueda viene ordenado, cada división descarta una
mitad **y no hay que combinar nada**, porque sobrevive un solo
subproblema.

## Diapositivas

![](clase03-busqueda.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El juego de adivinar el número

Piense un número entre 1 y 100. Yo solo puedo preguntar «¿es mayor que
$x$?». ¿Cuántas preguntas necesito, en el peor caso?

Siete. Cada respuesta descarta la mitad de los candidatos:
$100 \to 50 \to 25 \to 13 \to 7 \to 4 \to 2 \to 1$, y $2^7 = 128 \geq
100$. Para un número entre 1 y un millón alcanzan veinte, porque
$2^{20} > 10^6$.

Lo que hace funcionar el juego es que «mayor que $x$» parte los
candidatos en dos bloques ordenados. Esa propiedad es la que se explota
el resto de la clase.

## Buscar en un arreglo ordenado

**Especificación.** Entrada: un arreglo $A[0..N)$ de números ordenado
ascendentemente, con $N \geq 1$, y un número $v$. Salida:
$\exists\, p \in [0..N).\; A[p] = v$.

Es el mismo problema de la búsqueda lineal, con un dato nuevo en la precondición: el arreglo viene ordenado. La
búsqueda lineal lo resuelve en $O(n)$ sin usar ese dato.

### La función objetivo

El planteamiento del curso arranca nombrando lo que se busca. Para
$0 \leq l < r \leq N$:

$$\varphi(l, r): \text{ determina si } v \text{ está en } A[l..r).$$

El intervalo es **medio abierto**: incluye $l$, excluye $r$, y su
tamaño es $r - l$. Con esa notación, la salida pedida se reformula sin
rodeos: es $\varphi(0, N)$. El problema completo pasa a ser un caso
particular de la función objetivo, y lo que queda es resolver $\varphi$.

### El planteamiento recurrente

Con $mid = \lfloor (l + r)/2 \rfloor$:

$$\varphi(l, r) =
\begin{cases}
A[l] = v & \text{si } r - l = 1 \\
\varphi(l, mid) & \text{si } r - l > 1 \text{ y } v < A[mid] \\
\varphi(mid, r) & \text{si } r - l > 1 \text{ y } v \geq A[mid]
\end{cases}$$

Los tres momentos de divide y vencerás, leídos aquí: dividir es
calcular $mid$; conquistar es **un solo** subproblema, la mitad que
sobrevive; combinar no existe, porque la respuesta del subproblema ya es
la respuesta; y el caso base es el intervalo de un elemento.

### Por qué descartar la mitad es seguro

Esta es la parte que no se puede dar por obvia, porque es donde el
algoritmo podría perder la respuesta.

Si $v < A[mid]$, todo $p \in [mid..r)$ cumple $A[p] \geq A[mid]$ porque
el arreglo está ordenado, y $A[mid] > v$: en la mitad derecha no puede
haber un testigo. Todos los testigos posibles quedan en $[l..mid)$.

Si $v \geq A[mid]$, el valor podría estar en las dos mitades, pero no
hace falta revisar la izquierda: si hubiera un testigo $p < mid$, el
orden daría $v = A[p] \leq A[mid] \leq v$, o sea $A[mid] = v$, y
entonces el propio $mid$ —que sí queda en $[mid..r)$— es testigo.
Buscar solo a la derecha no pierde ninguna respuesta.

Los dos argumentos usan la monotonía del arreglo. Sobre un arreglo sin
ordenar, botar una mitad puede botar la única aparición de $v$.

### La implementación

```python
def buscar(lista, v, ini, fin):
    # Determina si v esta en lista[ini..fin), que viene ordenado
    if fin - ini == 1:
        resultado = lista[ini] == v
    else:
        mitad = (ini + fin) // 2
        if v < lista[mitad]:
            resultado = buscar(lista, v, ini, mitad)
        else:
            resultado = buscar(lista, v, mitad, fin)
    return resultado
```

El arreglo completo se consulta con `buscar(lista, v, 0, len(lista))`.
Como en el máximo y en el ordenamiento por mezcla, cada llamado
recibe de dónde a dónde trabaja: dividir cuesta $\Theta(1)$ y nadie
copia nada.

La traza con $A = [1, 4, 6, 8, 10, 13, 20, 22]$ y $v = 13$:

| $[ini..fin)$ | $mitad$ | $A[mitad]$ | Comparación | Decisión |
|:---:|:---:|:---:|:---:|---|
| $[0..8)$ | 4 | 10 | $13 \geq 10$ | mitad derecha |
| $[4..8)$ | 6 | 20 | $13 < 20$ | mitad izquierda |
| $[4..6)$ | 5 | 13 | $13 \geq 13$ | mitad derecha |
| $[5..6)$ | — | — | $A[5] = 13$ | `True` |

De ocho posiciones a una en tres divisiones.

### El costo

Sobrevive una sola mitad y decidir cuál cuesta una comparación:

$$T(n) = T\!\left(\frac{n}{2}\right) + \Theta(1), \qquad T(1) = \Theta(1).$$

Expandiendo: cada nivel aporta una constante $c$, y los niveles se
acaban cuando $n/2^k = 1$, o sea $k = \lg n$. El total es
$c\,(\lg n + 1)$, es decir $T(n) \in O(\lg n)$. CLRS la propone en el
Ejercicio 2.3-5 (p. 39) con esta misma cota.

| $n$ | Búsqueda lineal | Búsqueda binaria |
|---:|---:|---:|
| $10^3$ | 1 000 | 10 |
| $10^6$ | 1 000 000 | 20 |
| $10^9$ | 1 000 000 000 | 30 |

### Correctitud

**Teorema.** Si `lista[ini..fin)` está ordenado y $fin - ini \geq 1$,
entonces `buscar(lista, v, ini, fin)` produce el valor de
$\exists\, p \in [ini..fin).\; \mathtt{lista}[p] = v$.

*Demostración.* Se procede por inducción estructural sobre el tamaño
del intervalo, $n = fin - ini$.

**Caso base** ($n = 1$). El algoritmo devuelve $\mathtt{lista}[ini] = v$,
y la única posición del intervalo es $ini$: la salida coincide con la
especificación. ✓

**Caso inductivo** ($n > 1$). Primero, la partición separa y reduce: de
$fin - ini \geq 2$ sale $ini < mitad < fin$, así que $[ini..mitad)$ y
$[mitad..fin)$ son no vacíos y de tamaño menor que $n$. Por hipótesis de
inducción, el llamado recursivo responde correctamente por su intervalo.
Falta ver que esa respuesta es la del intervalo completo, y ese es justo
el argumento del descarte de arriba: si $v < A[mitad]$, la mitad derecha
no puede tener testigos; si $v \geq A[mitad]$, todo testigo de la
izquierda obliga a que $mitad$ mismo sea testigo derecho. En ambos
casos, la mitad que sobrevive tiene la misma respuesta que el todo. ✓

**Conclusión.** Por inducción estructural, la invocación es correcta
para todo intervalo; en particular $\varphi(0, N)$, que es la salida
pedida. $\blacksquare$

### La versión iterativa y sus invariantes

La recursión se certificó por inducción estructural. El mismo algoritmo
escrito con un ciclo pide la otra herramienta del curso: la pareja de
invariantes.

```python
def buscar(lista, v):
    ini = 0
    fin = len(lista)
    while fin - ini > 1:
        mitad = (ini + fin) // 2
        if v < lista[mitad]:
            fin = mitad
        else:
            ini = mitad
    return lista[ini] == v
```

Aquí no hay acumulador: lo que cambia es la **ventana** $[ini..fin)$. $I_0$
acota sus extremos e $I_1$ dice qué conserva:

$$I_0:\; 0 \leq ini < fin \leq N$$

$$I_1:\; \bigl(\exists\, p \in [0..N).\; A[p] = v\bigr) \;\Longleftrightarrow\; \bigl(\exists\, p \in [ini..fin).\; A[p] = v\bigr)$$

En palabras: la respuesta del arreglo completo es la misma que la de la
ventana. Ese es el trabajo de la búsqueda binaria — encoger la ventana sin
cambiar la respuesta.

**Teorema 1.** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

**Inicialización.** Las líneas 1--2 dejan $ini = 0$ y $fin = N$. Para
$I_0$ se pide $0 \leq 0 < N \leq N$: la desigualdad estricta $0 < N$ vale
por la precondición $N \geq 1$ y las otras dos son igualdades. ✓ Para
$I_1$, sustituyendo $ini = 0$ y $fin = N$ el lado derecho queda
$\exists\, p \in [0..N).\; A[p] = v$, que es literalmente el lado
izquierdo; una equivalencia entre una fórmula y ella misma es verdadera. ✓

**Estabilidad.** Se considera una iteración arbitraria con $ini = a$ y
$fin = b$, diferente a la última; como el cuerpo se ejecuta, $b - a > 1$,
o sea $b \geq a + 2$. Se asumen $0 \leq a < b \leq N$ y la equivalencia de
$I_1$ para la ventana $[a..b)$.

Primero hay que verificar que $a < mitad < b$, porque de eso dependen las
cotas y el progreso. De $b \geq a+2$ sale $a + b \geq 2a + 2$, luego
$mitad \geq \lfloor (2a{+}2)/2 \rfloor = a+1 > a$; y de $a \leq b-2$ sale
$a + b \leq 2b - 2$, luego $mitad \leq \lfloor (2b{-}2)/2 \rfloor = b-1 <
b$. Con eso $mitad$ es una posición válida y las dos ventanas candidatas
son no vacías.

La comparación de la línea 5 abre dos casos:

- **$v < A[mitad]$**, y la línea 6 deja $fin = mitad$. $I_0$ evaluado en
  los nuevos valores exige $0 \leq a < mitad \leq N$: la primera vale por
  lo asumido, $a < mitad$ se acaba de probar y $mitad < b \leq N$. ✓
  $I_1$ exige que la respuesta total equivalga a la de $[a..mitad)$; por
  lo asumido equivale a la de $[a..b)$, así que basta ver que $[mitad..b)$
  no aporta testigos: para todo $p$ en ese rango, $A[p] \geq A[mitad]$
  porque el arreglo está ordenado, y $A[mitad] > v$, luego $A[p] \neq v$. ✓
- **$v \geq A[mitad]$**, y la línea 8 deja $ini = mitad$. $I_0$ exige
  $0 \leq mitad < b \leq N$: $mitad \geq a+1 \geq 1 > 0$ y $mitad < b$ ya
  están probados. ✓ $I_1$ exige que la respuesta de $[a..b)$ equivalga a
  la de $[mitad..b)$. De derecha a izquierda es inmediato, porque
  $[mitad..b) \subseteq [a..b)$. De izquierda a derecha: si hubiera un
  testigo $p \in [a..mitad)$, de $p < mitad$ y el orden sale
  $v = A[p] \leq A[mitad]$, que junto con $v \geq A[mitad]$ da
  $A[mitad] = v$; entonces $mitad$ —que sí pertenece a $[mitad..b)$—
  también es testigo. ✓

En los dos casos valen $I_0$ e $I_1$ con los valores nuevos. Por lo tanto,
los invariantes son estables.

**Terminación.** El ancho $fin - ini$ es un entero positivo por $I_0$. En
el primer caso pasa a valer $mitad - a$ y en el segundo $b - mitad$; como
$a < mitad < b$, los dos son al menos 1 y estrictamente menores que
$b - a$. Un entero positivo que decrece estrictamente no puede hacerlo
para siempre, así que el ciclo termina.

Al salir, la condición $fin - ini > 1$ es falsa, o sea $fin - ini \leq 1$;
e $I_0$ da $ini < fin$, o sea $fin - ini \geq 1$. El único valor que
cumple las dos cosas es $fin - ini = 1$, es decir $fin = ini + 1$: la
ventana quedó en una sola posición. Sustituyendo en $I_1$, el lado derecho
es $\exists\, p \in [ini..ini{+}1).\; A[p] = v$, un rango de una posición,
que vale exactamente $A[ini] = v$. Entonces la respuesta del arreglo
completo es $A[ini] = v$. Por lo tanto, los invariantes son correctos.
$\blacksquare$

**Teorema 2.** La invocación `buscar(lista, v)` sobre un arreglo ordenado
de tamaño $N \geq 1$ produce el valor de
$\exists\, p \in [0..N).\; \mathtt{lista}[p] = v$.

*Demostración*: es trivial a partir de la correctitud de $I_0$ e $I_1$
(Teorema 1): la terminación deja $fin = ini + 1$, y sustituir ese valor en
$I_1$ dice que la respuesta pedida es $A[ini] = v$, que es justo lo que
retorna la línea 9. $\blacksquare$

De paso, esta versión no apila llamadas: sobreviven `ini`, `fin` y
`mitad`, así que el costo en espacio baja de $O(\lg n)$ a $O(1)$ sin tocar
la lógica.

## Bisección: el mismo algoritmo sin arreglo

**Especificación.** Entrada: una función $f$ continua y monótona creciente
en un intervalo $[a, b]$ y un valor $v$ con $f(a) \leq v \leq f(b)$.
Salida: $x \in [a, b]$ tal que $f(x) = v$.

La continuidad no es un adorno: es la que garantiza, por el teorema del
valor intermedio, que ese $x$ existe. La monotonía es la que permite
descartar media.

La jugada es idéntica: se evalúa $f$ en la mitad del intervalo, y si
$f(mid) < v$ la monotonía garantiza que $x$ está a la derecha; si no, a
la izquierda. Una mitad se descarta con certeza.

### El puente entre los dos mundos

Grafique $A = [1, 4, 6, 8, 10, 13, 20, 22]$ contra sus posiciones: lo
que aparece es una función $f: \{0, \ldots, 7\} \to \mathbb{Z}$ con
$f(i) = A[i]$, creciente. La búsqueda binaria **es** bisección sobre un
dominio discreto, y la bisección es búsqueda binaria sobre un dominio
continuo. Un solo algoritmo, dos presentaciones.

### El dominio continuo pide tolerancia

Sobre los reales no se puede esperar $f(mid) = v$ al pie de la letra:
los `float` redondean y el intervalo nunca queda de «un elemento». La
salida pasa a ser una **aproximación**: un $x$ cuyo intervalo de
incertidumbre mide menos que una tolerancia $\varepsilon$ fijada de
antemano.

```python
def f(x):
    # La funcion monotona del problema
    return x * x * x + x

def biseccion(v, a, b, eps):
    # Aproxima x en [a, b] con f(x) = v, para f creciente
    while b - a > eps:
        mitad = (a + b) / 2
        if f(mitad) < v:
            a = mitad
        else:
            b = mitad
    return (a + b) / 2
```

Con $f(x) = x^3 + x$, que es creciente, y $f(0) = 0 \leq 10 \leq f(3) =
30$, las primeras vueltas de `biseccion(10, 0, 3, 1e-6)`:

| $[a, b]$ | $mitad$ | $f(mitad)$ | Decisión |
|:---:|:---:|:---:|---|
| $[0,\ 3]$ | 1.5 | 4.875 | $< 10$: sube $a$ |
| $[1.5,\ 3]$ | 2.25 | 13.64 | $\geq 10$: baja $b$ |
| $[1.5,\ 2.25]$ | 1.875 | 8.47 | $< 10$: sube $a$ |
| $[1.875,\ 2.25]$ | 2.0625 | 10.83 | $\geq 10$: baja $b$ |

El intervalo se cierra alrededor de $x = 2$, donde $2^3 + 2 = 10$.

¿Cuántas vueltas? Cada una parte el intervalo en dos, así que tras $k$
vueltas mide $(b-a)/2^k$. Se necesita $(b-a)/2^k \leq \varepsilon$, es
decir

$$k = \left\lceil \log_2 \frac{b - a}{\varepsilon} \right\rceil,
\qquad \text{aquí } \left\lceil \log_2 \frac{3}{10^{-6}} \right\rceil = 22.$$

### Los invariantes de la bisección

Se escriben $a'$ y $b'$ para los valores originales de $a$ y $b$,
congelados antes de la primera vuelta.

$$I_0:\; a' \leq a \leq b \leq b' \qquad\qquad I_1:\; f(a) \leq v \leq f(b)$$

$I_0$ dice que el intervalo vivo nunca se sale del original ni se da
vuelta; $I_1$, que $v$ sigue **encerrado** entre los dos extremos. Ese
encierro es lo que la bisección nunca puede perder.

**Teorema 1.** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

**Inicialización.** Antes de la primera vuelta $a = a'$ y $b = b'$. Para
$I_0$: $a' \leq a' \leq b' \leq b'$, donde la del medio vale porque
$[a', b']$ es un intervalo. ✓ Para $I_1$, sustituyendo queda
$f(a') \leq v \leq f(b')$, que es exactamente la precondición. ✓

**Estabilidad.** Iteración arbitraria, diferente a la última: como el
cuerpo se ejecuta, $b - a > \varepsilon > 0$, luego $a < b$ y por lo tanto
$a < mitad < b$, con $mitad = (a+b)/2$. Se asumen $I_0$ e $I_1$. La
comparación de la línea 3 abre dos casos:

- **$f(mitad) < v$**, y la línea 4 deja $a = mitad$. $I_0$ evaluado ahí
  exige $a' \leq mitad \leq b \leq b'$: la primera sale de
  $a' \leq a < mitad$ y las otras de $mitad < b \leq b'$. ✓ $I_1$ exige
  $f(mitad) \leq v \leq f(b)$: la izquierda es el caso mismo y la derecha
  es la que se asumió, porque $b$ no cambió. ✓
- **$f(mitad) \geq v$**, y la línea 6 deja $b = mitad$. $I_0$ exige
  $a' \leq a \leq mitad \leq b'$: sale de $a < mitad < b \leq b'$. ✓
  $I_1$ exige $f(a) \leq v \leq f(mitad)$: la izquierda es la que se
  asumió, porque $a$ no cambió, y la derecha es el caso mismo. ✓

Por lo tanto, los invariantes son estables.

**Terminación.** Cada vuelta deja el ancho en exactamente la mitad: de
$b - a$ pasa a $mitad - a = (b-a)/2$ o a $b - mitad = (b-a)/2$. Tras $k$
vueltas vale $(b' - a')/2^k$, que baja de cualquier $\varepsilon > 0$; el
ciclo termina, y lo hace en $\lceil \log_2((b'-a')/\varepsilon) \rceil$
vueltas.

Al salir, la condición $b - a > \varepsilon$ es falsa, o sea
$b - a \leq \varepsilon$; e $I_0$ da $a \leq b$, o sea $b - a \geq 0$.
Intersectando: $0 \leq b - a \leq \varepsilon$. Y $I_1$ dice
$f(a) \leq v \leq f(b)$, así que por el teorema del valor intermedio
existe una solución $x \in [a, b]$ de $f(x) = v$. El valor retornado,
$\hat{x} = (a+b)/2$, también está en $[a, b]$, y midiendo desde el centro
de un intervalo de ancho a lo sumo $\varepsilon$ queda
$|\hat{x} - x| \leq \varepsilon/2$. Por lo tanto, los invariantes son
correctos. $\blacksquare$

**Teorema 2.** La invocación `biseccion(v, a, b, eps)` sobre una $f$
continua y creciente con $f(a) \leq v \leq f(b)$ produce un $\hat{x}$ que
dista a lo sumo $\varepsilon/2$ de una solución de $f(x) = v$.

*Demostración*: es trivial a partir de la correctitud de $I_0$ e $I_1$
(Teorema 1): la terminación deja un intervalo de ancho a lo sumo
$\varepsilon$ que sigue encerrando a $v$, y de ahí sale la cota del error
del valor que retorna la línea 7. $\blacksquare$

Vale la pena marcar la diferencia con el caso discreto: en el arreglo la
terminación entrega la respuesta **exacta**; aquí entrega una con error
acotado, y esa cota es parte del enunciado del teorema. Sobre los reales
no hay otra cosa que prometer.

## Búsqueda sobre la respuesta

**Especificación.** Entrada: un arreglo $A[0..N)$ de enteros positivos
—los envases de leche y su contenido— y un número $M \geq 1$ de
contenedores disponibles. Los envases se vierten *en orden*, uno tras
otro. Salida: la capacidad mínima de contenedor con la que basta con $M$
contenedores.

Con $A = [5, 2, 2, 3, 2]$ y $M = 3$: si los contenedores fueran de
capacidad 9, el primero recibe $5 + 2 + 2 = 9$, el segundo $3 + 2 = 5$,
y sobra uno. ¿Se puede con contenedores más pequeños? ¿Hasta dónde?

Aquí no hay arreglo ordenado ni función dada. La pregunta es dónde está
lo monótono.

### La función objetivo del problema

Nombrarla es la mitad del trabajo:

$$f(cap): \text{ contenedores que se necesitan si cada uno tiene capacidad } cap.$$

Calcularla es directo: se vierte envase por envase y, cuando el
contenedor actual no da más, se abre otro. Y es **decreciente**: más
capacidad nunca exige más contenedores. Para el ejemplo, $f(5) = 3$,
$f(7) = 2$, $f(14) = 1$.

Con eso, la salida se reformula: se busca el menor $cap$ con
$f(cap) \leq M$. El rango donde vive la respuesta va de $\max(A)$ —el
envase más grande tiene que caber— a $\mathrm{sum}(A)$ —con todo en un
contenedor sobra capacidad—. Para el ejemplo, $[5..14]$.

### De optimización a decisión

La pregunta difícil «¿cuál es la capacidad óptima?» se cambia por la
pregunta fácil «¿alcanza con capacidad $cap$?». La segunda se responde
con un recorrido lineal, y como $f$ es monótona, las respuestas forman
dos bloques: primero los $cap$ que no alcanzan, después los que sí. El
borde entre bloques es el óptimo, y un borde entre dos bloques ordenados
se encuentra con búsqueda binaria.

El patrón general: siempre que un problema de optimización admita una
pregunta de decisión monótona en el parámetro que se optimiza, la
respuesta se puede buscar binariamente sobre ese parámetro.

```python
def contenedores(envases, cap):
    # Contenedores de capacidad cap que exigen los envases, en orden
    cuenta = 1
    acumulado = 0
    i = 0
    while i < len(envases):
        if acumulado + envases[i] <= cap:
            acumulado = acumulado + envases[i]
        else:
            cuenta = cuenta + 1
            acumulado = envases[i]
        i = i + 1
    return cuenta

def capacidad_minima(envases, m):
    # Menor capacidad de contenedor con la que bastan m contenedores
    a = max(envases)
    b = sum(envases)
    while a < b:
        mitad = (a + b) // 2
        if contenedores(envases, mitad) <= m:
            b = mitad
        else:
            a = mitad + 1
    return a
```

`contenedores` es la función objetivo hecha código: un recorrido
$\Theta(n)$. `capacidad_minima` busca el borde: si con `mitad` alcanza,
la respuesta es `mitad` o algo menor (baja $b$); si no alcanza, es
estrictamente mayor (sube $a$ hasta `mitad + 1`). Al cerrarse el
intervalo, $a$ es el menor valor que alcanza. Cada chequeo cuesta
$\Theta(n)$ y hay $O(\lg(\mathrm{sum}(A)))$ chequeos.

La traza de `capacidad_minima([5, 2, 2, 3, 2], 3)`:

| $[a..b]$ | $mitad$ | $f(mitad)$ | ¿$\leq 3$? | Decisión |
|:---:|:---:|:---:|:---:|---|
| $[5..14]$ | 9 | 2 | sí | $b = 9$ |
| $[5..9]$ | 7 | 2 | sí | $b = 7$ |
| $[5..7]$ | 6 | 3 | sí | $b = 6$ |
| $[5..6]$ | 5 | 3 | sí | $b = 5$ |

El intervalo se cierra en $a = b = 5$: con capacidad 5 alcanza, y menos
no se puede porque el envase de 5 tiene que caber. Con $M = 2$ la
primera diferencia aparece en $mitad = 6$, donde $f(6) = 3 > 2$: el
algoritmo sube $a$ a 7 y esa es la respuesta.

### Los invariantes de la búsqueda sobre la respuesta

Sea $R = \{\, cap : f(cap) \leq M \,\}$ el conjunto de capacidades
viables y $cap^{*} = \min R$ la respuesta pedida. Como $f$ es
decreciente, $R$ es **cerrado hacia arriba**: si una capacidad alcanza,
cualquiera mayor también. De ahí que su complemento sea cerrado hacia
abajo, hecho que se usa en la estabilidad.

Lo que cambia es la ventana de candidatos $[a..b]$, y lo que hay que
conservar es que el óptimo siga adentro:

$$I_0:\; \max(A) \leq a \leq b \leq \mathrm{sum}(A) \qquad\qquad I_1:\; a \leq cap^{*} \leq b$$

**Teorema 1.** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

**Inicialización.** Las líneas 1--2 dejan $a = \max(A)$ y
$b = \mathrm{sum}(A)$. Para $I_0$ se pide
$\max(A) \leq \max(A) \leq \mathrm{sum}(A) \leq \mathrm{sum}(A)$; la del
medio vale porque los envases son enteros positivos, así que la suma de
todos no baja del mayor. ✓

Para $I_1$ hay que ver que $cap^{*}$ arranca dentro del rango, y son dos
cosas distintas. Que $cap^{*} \leq \mathrm{sum}(A)$: con esa capacidad
todo cabe en un contenedor, $f(\mathrm{sum}(A)) = 1 \leq M$, luego
$\mathrm{sum}(A) \in R$ y el mínimo de $R$ no lo supera. Que
$cap^{*} \geq \max(A)$: una capacidad menor que el envase más grande no
puede recibirlo en ningún contenedor, así que ninguna está en $R$. ✓

**Estabilidad.** Iteración arbitraria, diferente a la última: como el
cuerpo se ejecuta, $a < b$. Se asumen $I_0$ e $I_1$.

Primero, $a \leq mitad < b$. Con $mitad = \lfloor (a+b)/2 \rfloor$ y
$b \geq a+1$: de $a + b \geq 2a + 1$ sale
$mitad \geq \lfloor (2a{+}1)/2 \rfloor = a$; de $a + b \leq 2b - 1$ sale
$mitad \leq \lfloor (2b{-}1)/2 \rfloor = b - 1 < b$.

La comparación de la línea 6 abre dos casos:

- **$f(mitad) \leq M$**, y la línea 7 deja $b = mitad$. Aquí
  $mitad \in R$, luego $cap^{*} \leq mitad$ por ser el mínimo. $I_0$
  exige $\max(A) \leq a \leq mitad \leq \mathrm{sum}(A)$, que sale de
  $a \leq mitad < b \leq \mathrm{sum}(A)$. ✓ $I_1$ exige
  $a \leq cap^{*} \leq mitad$: la izquierda es la asumida y la derecha se
  acaba de probar. ✓
- **$f(mitad) > M$**, y la línea 9 deja $a = mitad + 1$. Aquí
  $mitad \notin R$, y como el complemento de $R$ es cerrado hacia abajo,
  ninguna capacidad $\leq mitad$ está en $R$; en particular
  $cap^{*} > mitad$, o sea $cap^{*} \geq mitad + 1$. $I_0$ exige
  $\max(A) \leq mitad + 1 \leq b \leq \mathrm{sum}(A)$: la izquierda sale
  de $mitad + 1 > a \geq \max(A)$ y la del medio de $mitad < b$. ✓ $I_1$
  exige $mitad + 1 \leq cap^{*} \leq b$: la izquierda se acaba de probar
  y la derecha es la asumida. ✓

Por lo tanto, los invariantes son estables.

**Terminación.** El ancho $b - a$ es un entero no negativo por $I_0$. En
el primer caso pasa a $mitad - a$, que es $\leq b - 1 - a < b - a$; en el
segundo, a $b - mitad - 1$, que es $\leq b - a - 1 < b - a$. Un entero no
negativo que decrece estrictamente no puede hacerlo para siempre.

Al salir, la condición $a < b$ es falsa, o sea $a \geq b$; e $I_0$ da
$a \leq b$. El único valor que cumple las dos cosas es $a = b$.
Sustituyendo en $I_1$ queda $a \leq cap^{*} \leq a$, es decir
$cap^{*} = a$: la ventana se cerró exactamente sobre el óptimo. Por lo
tanto, los invariantes son correctos. $\blacksquare$

**Teorema 2.** La invocación `capacidad_minima(envases, m)` sobre un
arreglo de enteros positivos y $M \geq 1$ produce la menor capacidad con
la que bastan $M$ contenedores.

*Demostración*: es trivial a partir de la correctitud de $I_0$ e $I_1$
(Teorema 1): la terminación deja $a = b$ y sustituir en $I_1$ da
$a = cap^{*}$, que es lo que retorna la línea 10. $\blacksquare$

Los tres ciclos de esta clase tienen el mismo $I_1$ con distinto disfraz:
*lo que se busca sigue dentro de la ventana*. En el arreglo era la
respuesta al existencial, en la bisección el valor $v$ encerrado entre
$f(a)$ y $f(b)$, y aquí el óptimo $cap^{*}$. Al resolver un problema
nuevo, ese es el invariante que hay que escribir.

## Cómo atacar un problema con bisección

La metodología, en tres pasos:

1. **Identificar el parámetro.** ¿Qué número es el que hay que hallar?
   En la leche, la capacidad; en el arreglo ordenado, la posición. Ese
   número, y no otro, es sobre el que se va a buscar.
2. **Definir la función y comprobar que es monótona.** Se escribe $f$ del
   parámetro y se dice *qué significa*. Casi siempre responde una
   pregunta de viabilidad: dado un valor, ¿alcanza? Y se argumenta por
   qué crece o decrece: si $f$ no es monótona, la bisección no aplica y
   hay que buscar otra formulación.
3. **Acotar el rango y buscar.** Se justifican las dos cotas: un valor
   que seguro no alcanza y uno que seguro sí. Entre ellos, la bisección
   encuentra el borde en $O(\lg(\text{ancho del rango}))$ evaluaciones
   de $f$.

La señal que hay que aprender a ver: cuando el enunciado pide *el
mínimo* o *el máximo* de algo y verificar un valor concreto es fácil,
casi siempre hay una bisección escondida.

### Detalles de implementación que cuestan puntos

- **Entero o continuo son dos plantillas distintas.** Con enteros, el
  ciclo es `while a < b` y la rama que descarta debe escribir
  `a = mitad + 1`; con `a = mitad` el intervalo puede quedarse quieto y
  el programa se cuelga. Con reales, el ciclo es `while b - a > eps` y
  las dos ramas asignan `mitad` sin sumar nada.
- **Cuánto vale $\varepsilon$** lo dice el enunciado: si pide cuatro
  decimales, $\varepsilon = 10^{-6}$ sobra y cuesta apenas unas vueltas
  más. Un $\varepsilon$ más fino que la precisión del `double` deja el
  ciclo girando sin avanzar.
- **El costo total** es el de evaluar $f$ multiplicado por el número de
  vueltas. Si $f$ cuesta $\Theta(n)$ y el rango tiene ancho $R$, el total
  es $O(n \lg R)$: por eso conviene que la verificación sea barata.
- **Antes de enviar**, corra el ejemplo del enunciado a mano y pruebe los
  extremos: el rango de tamaño 1, el caso donde la respuesta es la cota
  inferior y aquel donde es la superior.

## Errores comunes

- **Un intervalo que no progresa.** Con división entera, actualizar con
  $a = mitad$ en vez de $a = mitad + 1$ puede dejar el intervalo
  idéntico y el ciclo no termina. La terminación exige que *cada* rama
  reduzca.
- **Descartar sin monotonía.** Sobre un arreglo sin ordenar o una
  función que sube y baja, el descarte puede botar la única solución.
  La monotonía no se asume: se argumenta, como se hizo con $f(cap)$.
- **Un rango inicial que no contiene la respuesta.** Si la respuesta
  puede ser $\max(A)$ y el rango arranca en $\max(A) + 1$, ninguna
  búsqueda la encuentra. Las cotas del rango se justifican.
- **Suponer que la respuesta existe.** Si $v$ queda fuera de
  $[f(a), f(b)]$, el algoritmo no avisa: converge al extremo del
  intervalo cuyo valor de $f$ es el más cercano a $v$. Al terminar hay
  que comprobar que el candidato de verdad cumple lo pedido.
- **Tolerancia mal escogida.** Un $\varepsilon$ más fino que la
  precisión del `float` deja el ciclo dando vueltas sin que $b - a$
  baje.

## Ejercicios

### Sobre lo visto en la clase

1. Escriba la recurrencia de la búsqueda binaria y justifique la cota
   $\Theta(\lg n)$ del peor caso (CLRS, Ejercicio 2.3-5, p. 39).
2. Modifique `buscar` para que devuelva la *posición* de $v$, o $-1$ si
   no está. ¿Qué cambia en la función objetivo y en el caso base?
3. Reescriba `buscar` con un `while` en vez de recursión, sin cambiar la
   lógica, y compare el consumo de pila de las dos versiones.
4. Halle la raíz de $f(x) = x^3 - 2x - 5$ en $[2, 3]$ con
   $\varepsilon = 10^{-3}$. Antes de programar, prediga el número de
   vueltas con la fórmula del logaritmo: deberían ser 10. La raíz anda
   cerca de $2{,}0946$.
5. Adapte los invariantes de `capacidad_minima` al ejercicio 2: escriba
   $I_0$ e $I_1$ para la versión que devuelve la posición y complete los
   tres pasos.

### Problemas de juez en línea

**UVa 11909 — Soya Milk.**
<https://onlinejudge.org/external/119/11909.pdf>

Una caja de leche de dimensiones $l \times w \times h$ se inclina un
ángulo $\theta$; hay que hallar el volumen que queda adentro.

*Consejo*: la geometría da dos casos según el líquido toque o no el borde
superior, y en cada uno el volumen sale de una longitud desconocida. Esa
longitud es el parámetro: la función que la relaciona con el dato
conocido es creciente, así que se halla con bisección continua. Dibuje
los dos casos antes de escribir una línea de código.

**UVa 11646 — Athletics Track.**
<https://onlinejudge.org/external/116/11646.pdf>

Una pista de dos rectas y dos arcos, con proporción largo : ancho dada,
debe medir 400 metros.

*Consejo*: el parámetro es el largo $l$; el ancho sale de la proporción y
el perímetro $f(l)$ crece con $l$. Se busca $l$ con $f(l) = 400$:
bisección continua sobre un rango generoso. Verifique la monotonía antes
de confiar en el descarte.

**UVa 714 — Copying Books.**
<https://onlinejudge.org/external/7/714.pdf>

$K$ escribas copian libros consecutivos; hay que minimizar las páginas
del escriba más cargado.

*Consejo*: es el problema de la leche con otro disfraz. $f(t)$ = escribas
necesarios si cada uno copia a lo sumo $t$ páginas, decreciente, y el
rango va de $\max(A)$ a $\mathrm{sum}(A)$. Cuidado con la salida: el juez
pide además la partición, y entre varias válidas exige la que carga más
a los últimos escribas.

## Ejercicios interactivos

Los tres se trabajan en el navegador, en la
[página de ejercicios](Ejercicios.md):

- [buscar](widgets/buscar.html){ target=_blank rel=noopener } — la ventana
  que se encoge, con la traza división por división, los dos invariantes y
  la demostración completa.
- [bisección](widgets/biseccion.html){ target=_blank rel=noopener } — el
  intervalo que encierra la respuesta, sobre tres funciones distintas, con
  la cuenta de vueltas y la cota del error.
- [resolver un problema de juez](widgets/resolver.html){ target=_blank rel=noopener }
  — el método completo aplicado a UVa 10341, un problema que no aparece en
  estas notas: entrada, función objetivo, monotonía demostrada término a
  término, rango, existencia, tolerancia y código.

## Código de la clase

Los tres programas imprimen las trazas de arriba y se comprueban solos:

- [busquedaBinaria.py](codigo/busquedaBinaria.py) — la búsqueda por
  índices, contrastada contra el operador `in` sobre 1 254 casos
  sistemáticos.
- [biseccion.py](codigo/biseccion.py) — la bisección continua, con la
  cuenta de vueltas y una comprobación de que el error nunca supera la
  tolerancia.
- [contenedores.py](codigo/contenedores.py) — la búsqueda sobre la
  respuesta, contrastada contra una fuerza bruta que revisa todos los
  repartos en bloques consecutivos: 6 015 casos.
- [invariantes.py](codigo/invariantes.py) — los tres ciclos con $I_0$ e
  $I_1$ escritos como `assert` junto a la condición, más los del último
  chequeo y el de la terminación. Corre sobre familias completas de
  entradas: si alguna fórmula fuera falsa, reventaría diciendo en qué
  chequeo.

```bash
python3 busquedaBinaria.py
python3 biseccion.py
python3 contenedores.py
python3 invariantes.py
```

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein. *Introduction
  to Algorithms*, 3.ª ed., MIT Press, 2009. Sección 2.3 y Ejercicio
  2.3-5, p. 39.
- S. Halim, F. Halim, S. Effendy. *Competitive Programming 4*, 2018.
  Capítulo 3: búsqueda binaria sobre la respuesta.
- C. Rocha. *Diseño y Análisis de Algoritmos*.
