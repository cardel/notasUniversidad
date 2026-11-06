# 7 de noviembre · Refuerzo PUJ

**Bisección y recorridos en grafos.** La primera hora de programación es cómo se
encuentra la función de decisión, con UVa 12032; la segunda, el recorrido en
amplitud con tope de pasos, con UVa 336; la tercera, el recorrido en profundidad
y los ciclos en un grafo dirigido, con UVa 11686. En la hora de lógica se plantean
los invariantes de ciclo de UVa 11078 y queda en papel el ejercicio de UVa 507.

La sesión empieza con la revisión de la
[tarea del 24 de octubre](../B2/24%20de%20octubre.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md#tarea).

## Diapositivas

### Programación

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de programación

Las soluciones de UVa 12032, UVa 336 y UVa 11686.

![](./Soluciones-programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de lógica

La traza, los invariantes y los tres pasos del ejercicio de UVa 507.

![](./Soluciones-logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Archivos de lectura

Cada problema de clase tiene un fragmento con la lectura de la entrada y un
comentario donde va el algoritmo. Están en la carpeta
[codigo](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/Refuerzo%20PUJ/B3/codigo)
de esta sesión:

| Problema | Python | C++ |
|---|---|---|
| UVa 12032 | [lectura_12032.py](./codigo/lectura_12032.py) | [lectura_12032.cpp](./codigo/lectura_12032.cpp) |
| UVa 336 | [lectura_336.py](./codigo/lectura_336.py) | [lectura_336.cpp](./codigo/lectura_336.cpp) |
| UVa 11686 | [lectura_11686.py](./codigo/lectura_11686.py) | [lectura_11686.cpp](./codigo/lectura_11686.cpp) |

El fragmento se copia dentro de un programa con sus `#include` y su `main` en C++,
o con `import sys` en Python, y se completa con la solución. Después se copia la
muestra del enunciado en `1.in` y su salida en `1.out`, y se compara:

```text
g++ -std=c++17 -Wall -Wextra solucion.cpp -o solucion
./solucion < 1.in > salida.out
diff salida.out 1.out

python3 solucion.py < 1.in > salida.out
diff salida.out 1.out
```

Si `diff` no imprime nada, las dos salidas coinciden y el programa ya se puede
enviar al juez. El juez corre una versión antigua de Python 3, así que la
salida se arma con `print` y `%`.

## Problemas en clase

Cada problema cierra con su costo: de qué depende el tamaño de la entrada,
cuántas veces corre cada ciclo y el total en $O$ frente a los límites del
enunciado.

### Hora 1. UVa 12032, The Monkey and the Oiled Bamboo

- Enunciado y envío: <https://vjudge.net/problem/UVA-12032>
- Actividad: [la escalera y el factor de fuerza](../../../actividades/ayg-puj/busqueda-binaria/escalera.html){ target=_blank rel=noopener }

Una escalera tiene $n$ peldaños a alturas $r_1 < \dots < r_n$ y se sube de uno
en uno. Se arranca con un factor de fuerza $k$: ningún salto puede medir más de
$k$, y el salto que mide exactamente $k$ baja el factor en uno. Se pide el menor
$k$ con el que se llega arriba.

Buscar el mínimo directamente obliga a razonar sobre todos los saltos a la vez.
La pregunta que sí se contesta de una pasada es la otra, *¿se llega arriba
empezando con fuerza $k$?*, y se responde simulando la subida. Es monótona,
porque con $k+1$ ningún salto que cabía deja de caber, así que los candidatos
quedan partidos en dos tramos y lo que se busca es el borde. Los límites son el
salto más grande, que hay que dar, y ese mismo más $n$, porque cada salto baja
la fuerza a lo sumo en uno.

La entrada se lee así en C++:

```cpp
int casos;
scanf("%d", &casos);
for (int caso = 1; caso <= casos; caso++) {
  int n;
  scanf("%d", &n);
  vector<int> alturas(n);
  for (int i = 0; i < n; i++) {
    scanf("%d", &alturas[i]);
  }
}
```

Costo: cada vuelta de la bisección recorre los saltos una vez, y hay
logarítmicas vueltas en el rango de $k$, de modo que es
$\Theta(n \log(\max s_i + n))$ por caso.

### Hora 2. UVa 336, A Node Too Far

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-336>
- Actividad: [el recorrido con tope de pasos](../../../actividades/ayg-puj/representaciones-y-recorridos/tope.html){ target=_blank rel=noopener }

Cada mensaje de una red lleva un campo TTL. La estación que lo recibe le resta
uno y lo reenvía solo si el resultado no es cero, de modo que el mensaje llega a
los nodos a distancia menor o igual al TTL. Cada red trae sus conexiones y
después consultas `nodo TTL`, y por cada una se imprime cuántos nodos quedan por
fuera.

El parámetro es el TTL, un tope de pasos sobre una red de $V \le 30$ nodos. El
recorrido en amplitud visita los nodos por distancia creciente: la primera vez
que toca un nodo, `dist` ya es la distancia mínima, así que basta con no expandir
los que llegaron a distancia TTL. El nodo de partida cuenta como alcanzado,
incluso con TTL 0. La trampa está en los números de los nodos. Pueden ser
cualquier entero positivo, y por eso hace falta un diccionario de número a
índice. Además, el PDF no descarta que una consulta nombre un nodo ausente de la
red; en ese caso ningún nodo es alcanzable y la respuesta es el total de la red.
El contador de casos sigue de una red a la siguiente, y la frase de salida
escribe `1 nodes`.

La entrada se lee así en C++:

```cpp
int conexiones;
int caso = 0;
while (scanf("%d", &conexiones) == 1 && conexiones != 0) {
  for (int i = 0; i < conexiones; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    /* aquí va el diccionario de número a índice */
  }
  int nodo, ttl;
  while (scanf("%d %d", &nodo, &ttl) == 2 && (nodo != 0 || ttl != 0)) {
    caso = caso + 1;
    /* aquí va el recorrido en amplitud */
  }
}
```

Los pares vienen varios por línea, y `scanf("%d", ...)` se salta los espacios y
los saltos de línea por igual. El ciclo de consultas se detiene cuando los dos
valores son cero: `35 0` es una consulta válida.

Costo: $O(V + E)$ por consulta, con $V \le 30$ y $E \le 435$.

### Hora 3. UVa 11686, Pick up sticks

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-11686>
- Actividad: [los tres estados y los ciclos](../../../actividades/ayg-puj/orden-topologico-dfs-low/palitos.html){ target=_blank rel=noopener }

Hay $n$ palitos numerados de 1 a $n$ y $m$ pares `a b`, cada uno con el significado
de que `a` está encima de `b`, con $1 \le n, m \le 1\,000\,000$. Un palito se
recoge cuando ya se recogieron todos los que tiene encima. Por caso se imprime un
orden de recogida, un palito por línea, o `IMPOSSIBLE`. El enunciado acepta
cualquier orden correcto.

El parámetro es $n + m$, y la profundidad de la recursión puede llegar a $n$. Cada
nodo pasa por tres estados: sin visitar, en el camino actual y terminado. Hay ciclo
exactamente cuando una arista llega a un nodo del camino actual. Y cuando un nodo
termina, todo lo que sale de él ya terminó, de modo que el inverso del orden de
terminación respeta todas las aristas. La trampa es doble: con solo dos estados, un
nodo ya terminado parece un ciclo, y una cadena de un millón de palitos revienta la
pila de llamadas de la versión recursiva.

La entrada se lee así en C++:

```cpp
int n, m;
while (scanf("%d %d", &n, &m) == 2 && (n != 0 || m != 0)) {
  vector<vector<int> > adj(n + 1);
  for (int i = 0; i < m; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    adj[a].push_back(b);
  }
  /* aquí va el recorrido en profundidad */
}
```

Las aristas se leen todas antes de recorrer, incluso si ya se ve un ciclo en las
primeras: las que queden sin leer se tomarían como el caso siguiente. Los palitos se
numeran desde 1, y por eso `adj` tiene $n + 1$ listas.

Costo: $\Theta(n + m)$ por caso. Medida con `ulimit -s` de 8192 KB, la recursiva de
C++ revienta con 87 826 nodos de profundidad y el enunciado admite un millón, así que
al juez se envía la versión con pila, `pick-up-sticks-pila.cpp`.

## Lógica

El ciclo de partida es el de
UVa 11078, Open Credit System (<https://vjudge.net/problem/UVA-11078>).
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

UVa 507, Jill Rides Again (<https://vjudge.net/problem/UVA-507>), sin
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

- Enunciado y envío: <https://vjudge.net/problem/UVA-10935>

Mientras queden al menos dos cartas, se bota la de arriba y la siguiente pasa
al fondo. El parámetro es $n$, el número de cartas. Cada ronda solo toca los
dos extremos del mazo, y una cola saca arriba y pone abajo en tiempo constante.
Las cartas botadas van separadas por coma y espacio, así que la primera se
escribe distinto de las demás. La trampa es $n = 1$: no se bota ninguna carta,
y la primera línea es `Discarded cards:` sin espacio después de los dos puntos.

### Intermedio. UVa 11286, Conformity

- Enunciado y envío: <https://vjudge.net/problem/UVA-11286>

El parámetro es $n$, el número de estudiantes, con $n \le 10\,000$ y cinco
cursos cada uno. Una combinación no depende del orden: al ordenar los cinco
cursos, dos estudiantes con la misma combinación producen la misma clave de un
diccionario. La trampa está en la pregunta, que pide el total de estudiantes:
si varias combinaciones empatan en la mayor popularidad, se suman todas.

### Exigente. UVa 699, The Falling Leaves

- Enunciado y envío: <https://vjudge.net/problem/UVA-699>

El parámetro es $t$, el número de nodos. La entrada ya viene en preorden, y la
columna de un hijo solo depende de la de su padre: la función lee el subárbol
mientras suma en la columna $x$ y baja a $x - 1$ y $x + 1$, sin construir el
árbol. Las columnas pueden ser negativas. La trampa es de formato: un árbol
puede seguir en la línea siguiente, como el segundo de la muestra, y la línea
en blanco va también después del último caso.

## Para seguir

- [Soluciones](./Soluciones.md) de UVa 12032, UVa 336 y UVa 11686 y de los tres
  problemas de la tarea, con la idea, la complejidad y el código en Python y C++.
- [Ejercicios interactivos](./Ejercicios.md) sobre recorridos, bisección, costo e
  invariantes.
