# Búsqueda binaria y bisección

**Grupo A — viernes 28 de agosto de 2026.**

La clase pasada dejó el molde de dividir, conquistar y combinar, con el
máximo y el ordenamiento por mezcla. Hoy el molde se aplica a un caso
donde la cuenta sale todavía mejor: cuando el espacio de búsqueda viene
ordenado, cada división descarta una mitad **y no hay que combinar
nada**, porque sobrevive un solo subproblema.

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

Es el mismo problema de la búsqueda lineal de la clase de invariantes,
con un dato nuevo en la precondición: el arreglo viene ordenado. La
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
Como en el máximo y en el ordenamiento de la clase pasada, cada llamado
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

## Bisección: el mismo algoritmo sin arreglo

**Especificación.** Entrada: una función $f$ monótona creciente en un
intervalo $[a, b]$ y un valor $v$ con $f(a) \leq v \leq f(b)$. Salida:
$x \in [a, b]$ tal que $f(x) = v$.

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
- **Tolerancia mal escogida.** Un $\varepsilon$ más fino que la
  precisión del `float` deja el ciclo dando vueltas sin que $b - a$
  baje.

## Ejercicios

1. Escriba la recurrencia de la búsqueda binaria y justifique la cota
   $\Theta(\lg n)$ del peor caso (CLRS, Ejercicio 2.3-5, p. 39).
2. Modifique `buscar` para que devuelva la *posición* de $v$, o $-1$ si
   no está. ¿Qué cambia en la función objetivo y en el caso base?
3. Para el ciclo de `biseccion`: proponga el invariante que garantiza
   que la respuesta nunca se sale de $[a, b]$ y úselo para argumentar
   la correctitud.
4. *Copying Books* (UVa 714): $K$ escribas copian libros contiguos;
   minimice las páginas del escriba más cargado. Plantee $f(t)$, su
   monotonía y el rango, y aplique el patrón de la leche.
5. *Athletics Track* (UVa 11646): halle el largo $l$ de una pista con
   proporción dada cuyo perímetro sea 400. La función $f(l)$ es
   creciente: bisección continua.

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

```bash
python3 busquedaBinaria.py
python3 biseccion.py
python3 contenedores.py
```

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein. *Introduction
  to Algorithms*, 3.ª ed., MIT Press, 2009. Sección 2.3 y Ejercicio
  2.3-5, p. 39.
- S. Halim, F. Halim, S. Effendy. *Competitive Programming 4*, 2018.
  Capítulo 3: búsqueda binaria sobre la respuesta.
- C. Rocha. *Diseño y Análisis de Algoritmos*.
