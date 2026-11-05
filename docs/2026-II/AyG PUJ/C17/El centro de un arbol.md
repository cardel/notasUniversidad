# El centro de un árbol · AyG C17

El centro de un grafo es el conjunto de vértices de menor excentricidad, y
encontrarlo parecería pedir las $n$ excentricidades, una amplitud por vértice.
En un árbol no hace falta ninguna: el centro es lo que queda al quitar las
hojas una y otra vez. Esta nota desarrolla ese resultado, el algoritmo que sale
de él y la cuenta que traduce lo que el algoritmo devuelve en el radio y el
diámetro.

El punto de partida es lo que ya quedó de la sesión anterior: la excentricidad
$\varepsilon(v)$ es la distancia de $v$ al vértice más lejano, el radio es la
menor de todas, el diámetro la mayor, y los centros son los vértices que
alcanzan el radio. También quedó que en un árbol el diámetro se calcula con dos
recorridos, y que de ahí sale el radio como $(\mathit{diam}+1)/2$.

## Una hoja nunca es el centro

Sea $\ell$ una hoja y $p$ su único vecino. Todo camino que sale de $\ell$ pasa
por $p$, de modo que para todo $w \neq \ell$ se tiene
$\delta(\ell, w) = 1 + \delta(p, w)$. Tomando el máximo sobre $w$,

$$\varepsilon(\ell) = 1 + \varepsilon(p).$$

Con tres vértices o más eso basta para descartar a $\ell$: su excentricidad es
estrictamente mayor que la de alguien, así que no puede ser el mínimo. Y el
descarte no costó recorrer nada.

La pregunta que sigue es si el descarte se puede repetir. Quitadas las hojas,
¿el centro del árbol que queda es el mismo?

## El teorema del centro

**Teorema (Jordan, 1869).** Sea $T = (V, E)$ un árbol y sea $L \subseteq V$ su
conjunto de hojas.

- Si $|V| \leq 2$, entonces $\mathcal{C}(T) = V$.
- Si $|V| > 2$, entonces $\mathcal{C}(T) = \mathcal{C}(T \setminus L)$.

**Demostración.** Se procede de forma directa, mostrando que todas las
excentricidades de los sobrevivientes bajan en la misma cantidad.

Sea $v$ un vértice que no es hoja y sea $w$ un vértice con
$\delta(v, w) = \varepsilon(v)$. Ese $w$ es una hoja: si no lo fuera, tendría
un vecino $w'$ distinto del penúltimo vértice del camino, y como en un árbol
hay un solo camino entre cada pareja, $\delta(v, w') = \delta(v, w) + 1$, lo
que contradice que $w$ fuera el más lejano.

Al quitar $L$ completo, el camino que realizaba $\varepsilon(v)$ pierde
exactamente su último paso y lo que queda sigue siendo un camino del árbol
podado. Por lo tanto

$$\varepsilon_{T \setminus L}(v) = \varepsilon_T(v) - 1$$

para todo vértice interno $v$. Si todas las excentricidades bajan en uno, el
mínimo baja en uno, pero el conjunto de vértices donde se alcanza no cambia.
Por lo tanto, se puede concluir que $\mathcal{C}(T) = \mathcal{C}(T \setminus L)$,
con el radio como única cantidad que se movió. $\blacksquare$

El caso $|V| \leq 2$ es el cierre: en un árbol de un vértice ese vértice tiene
excentricidad $0$, y en uno de dos los dos tienen excentricidad $1$.

### Comprobado en el camino de cinco

Sobre $a - b - c - d - e$:

| | $a$ | $b$ | $c$ | $d$ | $e$ | radio | centro |
|---|---|---|---|---|---|---|---|
| árbol completo | 4 | 3 | **2** | 3 | 4 | 2 | $\{c\}$ |
| sin $\{a, e\}$ | | 2 | **1** | 2 | | 1 | $\{c\}$ |
| sin $\{b, d\}$ | | | **0** | | | 0 | $\{c\}$ |

Cada fila baja uno en todas las columnas vivas y la columna del mínimo nunca
se mueve.

## El algoritmo

El teorema deja el mismo problema sobre un árbol más pequeño, así que se
aplica otra vez. Cada vuelta quita por lo menos dos vértices, de modo que el
proceso termina, y termina con uno o dos vértices que son el centro.

```
Centro(T):
  1. L ← las hojas de T
  2. mientras |V(T)| > 2:
  2.1     V(T) ← V(T) \ L
  2.2     L ← las hojas de lo que quedó
  3. devolver V(T)
```

Para programarlo hay dos cosas que resolver. Quién es hoja cambia en cada
vuelta, y borrar vértices de verdad costaría más que el propio algoritmo. Las
dos se resuelven igual: **no se borra nada, se baja el grado**. Quitar una hoja
es restarle uno al grado de su vecino; el que queda en grado uno pasa a ser
hoja de la capa siguiente, y el que ya se fue se marca con grado cero para no
volver a tocarlo. Es el mismo mecanismo del orden topológico de Kahn, donde se
iban sacando los vértices de grado de entrada cero.

El detalle que decide si el algoritmo funciona es que **la capa se quita
completa antes de mirar la siguiente**. Si los vértices nuevos entran a la misma
lista que se está recorriendo, un vértice interno se pela en la misma vuelta en
que se pelaron sus hijos, el árbol se consume de un lado y el centro sale
corrido.

```python
def capaDeHojas(arbol, grado):
    # Los vertices vivos que tienen un solo vecino vivo.
    capa = []
    for v in arbol:
        if grado[v] <= 1:
            capa.append(v)
    return capa


def pelarCapa(arbol, grado, capa):
    # Quita la capa entera y devuelve las hojas que quedan al hacerlo.
    siguiente = []
    for v in capa:
        for u in arbol[v]:
            if grado[u] > 0:
                grado[u] = grado[u] - 1
                if grado[u] == 1:
                    siguiente.append(u)
        # el vertice no se borra: se marca con grado cero
        grado[v] = 0
    return siguiente


def centroArbol(arbol):
    # Devuelve el centro y cuantas capas se quitaron para llegar a el.
    grado = {}
    for v in arbol:
        grado[v] = len(arbol[v])
    capa = capaDeHojas(arbol, grado)
    vivos = len(arbol)
    vueltas = 0
    while vivos > 2:
        vivos = vivos - len(capa)
        capa = pelarCapa(arbol, grado, capa)
        vueltas = vueltas + 1
    return capa, vueltas
```

Cada vértice entra a una capa a lo sumo una vez y cada arista se mira dos
veces, una por cada punta, de modo que el costo es $\Theta(n)$. Contra los
$\Theta(n^2)$ de una amplitud por vértice, la diferencia se nota rápido: con
$100\,000$ vértices son $10^{10}$ pasos contra $100\,000$.

## La traza

Sobre el árbol de once vértices de la sesión, el mismo grafo de la
excentricidad sin la arista que cerraba su único ciclo:

| vuelta | capa que se va | vivos al terminar |
|---|---|---|
| 1 | $3$, $4$, $5$, $7$, $9$, $10$ | 5 |
| 2 | $2$, $6$ | 3 |
| 3 | $1$, $8$ | 1 |

Queda el vértice $0$, que es el mismo centro que da la cuenta de las once
excentricidades. En la segunda vuelta se ve lo que hace el grado: el $2$ perdió
a $3$ y a $4$ y pasó de tres a uno, el $6$ perdió a $10$ y quedó en uno, y el
$8$ perdió a $7$ y a $9$ pero bajó de cuatro a dos, así que todavía no era
hoja.

## De las vueltas al radio y al diámetro

El algoritmo devuelve dos cosas: el centro y cuántas vueltas dio. La tentación
es leer las vueltas como el radio, y en el árbol de arriba funciona: tres
vueltas y radio tres. En el camino de cuatro no. Ahí se van $a$ y $d$ en la
primera vuelta, quedan $b$ y $c$, el algoritmo para con una sola vuelta, y el
radio es $2$.

La regla completa es esta. Cada vuelta acerca el borde un paso por los dos
lados, así que

$$\text{vueltas} = \left\lfloor \frac{\mathit{diam}}{2} \right\rfloor,$$

y lo que falta lo dice cuántos vértices quedaron:

| | un centro | dos centros |
|---|---|---|
| radio | vueltas | vueltas $+\ 1$ |
| diámetro | $2 \cdot$ vueltas | $2 \cdot$ vueltas $+\ 1$ |

Son dos casos porque con diámetro par la mitad del camino más largo cae en un
vértice y con diámetro impar cae entre dos. Nunca hay más de dos centros.

Los caminos lo muestran uno por uno:

| $n$ | vueltas | centro | radio | diámetro |
|---|---|---|---|---|
| 1 | 0 | $\{a\}$ | 0 | 0 |
| 2 | 0 | $\{a, b\}$ | 1 | 1 |
| 3 | 1 | $\{b\}$ | 1 | 2 |
| 4 | 1 | $\{b, c\}$ | 2 | 3 |
| 5 | 2 | $\{c\}$ | 2 | 4 |
| 6 | 2 | $\{c, d\}$ | 3 | 5 |
| 7 | 3 | $\{d\}$ | 3 | 6 |

Las vueltas coinciden con el radio solo en las filas de un centro, que son las
de diámetro par; en las otras se quedan cortas por uno.

```python
def radioDiametro(arbol):
    # El radio y el diametro salen de las vueltas y de cuantos centros quedan.
    (centro, vueltas) = centroArbol(arbol)
    if len(centro) == 1:
        radio = vueltas
        diametro = 2 * vueltas
    else:
        radio = vueltas + 1
        diametro = 2 * vueltas + 1
    return radio, diametro, centro
```

Con eso, el centro, el radio y el diámetro de un árbol salen en $\Theta(n)$ sin
calcular ninguna excentricidad y sin escoger raíz.

## Errores comunes

- **Usarlo en un grafo con ciclos.** Un ciclo no tiene hojas: la capa siguiente
  queda vacía, el conteo de vivos no baja y lo que se devuelve no es el centro.
  El radio y el centro de un grafo cualquiera piden las distancias de todos
  contra todos.
- **Parar cuando queda uno.** La condición es $|V| > 2$. Si se exige llegar a un
  solo vértice, los árboles de diámetro impar pelan a sus dos centros a la vez
  y devuelven una lista vacía.
- **Quitar hojas de a una.** Hay que quitar la capa completa. De lo contrario un
  vértice interno se vuelve hoja antes de tiempo y el centro sale corrido.
- **Tomar las vueltas por el radio.** Son el radio solo cuando queda un centro.

## Ejercicios

### A mano

Nueve vértices y estas aristas: $a\!-\!b$, $b\!-\!c$, $c\!-\!d$, $d\!-\!e$,
$c\!-\!f$, $f\!-\!g$, $b\!-\!h$, $h\!-\!i$. Pele las capas anotando cuál se va
en cada vuelta, diga el centro, el radio y el diámetro, y compruebe el diámetro
con los dos recorridos de la sesión anterior.

### En parejas

Construya el árbol que se pide en cada caso y después intercámbielo con la
pareja de al lado para que verifique el centro pelando hojas.

1. Un árbol de diez vértices con dos centros.
2. Un árbol de diez vértices cuyo centro sea una sola hoja del árbol que queda
   tras la primera vuelta.
3. Un árbol donde el algoritmo dé exactamente cuatro vueltas.

### UVa 10308 — Roads in the North

Pueblos unidos por caminos, con una sola ruta entre cada par y con longitudes.
Se pide la distancia entre los dos pueblos más alejados.

Es el diámetro de un árbol con pesos. Pelar hojas no sirve aquí, porque cuenta
pasos y no kilómetros; los dos recorridos sí, cambiando el conteo de aristas
por la suma de pesos. La entrada viene en bloques separados por una línea en
blanco y no dice cuántos pueblos hay.

Enunciado: <https://onlinejudge.org/external/103/10308.pdf>

Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1249>

### UVa 11695 — Flight Planning

Hay $n$ ciudades y $n-1$ vuelos que las conectan, de modo que entre dos
cualesquiera hay una sola ruta. Se quita un vuelo y se pone otro, buscando que
el mayor número de trasbordos entre dos ciudades quede lo más pequeño posible.
Se piden ese número y los dos vuelos.

Quitar una arista parte el árbol en dos. Volver a unirlos por sus centros es lo
mejor que se puede hacer, y entonces el diámetro queda en el mayor entre $d_1$,
$d_2$ y $\lceil d_1/2 \rceil + \lceil d_2/2 \rceil + 1$. Con $n \leq 2500$
alcanza con probar las $n-1$ aristas y resolver cada mitad en tiempo lineal.

Enunciado: <https://onlinejudge.org/external/116/11695.pdf>

Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2742>

## Referencias

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., Stein, C. *Introduction to
  Algorithms*, 3rd ed. MIT Press, 2009. Apéndice B.5, páginas 1173 a 1177.
- Jordan, C. *Sur les assemblages de lignes*. Journal für die reine und
  angewandte Mathematik, 70, 1869, páginas 185 a 190.
- Halim, S., Halim, F., Effendy, S. *Competitive Programming 4*. Lulu, 2020.
  Capítulo 4: propiedades de los árboles, diámetro y centro.
- van Steen, M. *Graph Theory and Complex Networks*. 2010. Capítulo 5: árboles,
  excentricidad y centro.
