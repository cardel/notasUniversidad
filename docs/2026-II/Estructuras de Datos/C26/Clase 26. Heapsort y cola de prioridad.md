# Estructuras de Datos · Clase 26. Heapsort y cola de prioridad

Miércoles 11 de noviembre de 2026, de 17:00 a 19:00.

El montículo de máximos guarda un árbol binario completo en un arreglo y deja
insertar y extraer el máximo en $O(\log n)$. La sesión lo lleva a tres usos.
El primero es construirlo a partir de un arreglo cualquiera: insertando las
claves una por una cuesta $O(n \log n)$, y bajando cada casilla con hijos, de
la última a la raíz, cuesta $\Theta(n)$. El segundo es ordenar con él dentro
del mismo arreglo, y ese algoritmo se llama heapsort. La STL trae las dos
cosas como funciones de `<algorithm>`, `make_heap` y `sort_heap`, junto con
`push_heap` y `pop_heap`. El tercero es el TAD cola de prioridad, que atiende
siempre la clave más urgente, y su versión de la STL, `priority_queue`, hecha
sobre esas funciones.

Al terminar, el objetivo es poder seguir a mano `construir` y `heapsort` con
el árbol y el arreglo en cada paso, demostrar que `construir` cuesta
$\Theta(n)$, usar las funciones de montículo de `<algorithm>` en el orden que
piden, dar el contrato de la cola de prioridad con el costo de cada
operación en tres implementaciones, y usar `priority_queue` con enteros, con
un comparador que deja el menor arriba y con registros que definen
`operator<`.

## Diapositivas

![](./clase26.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: el montículo de máximos

Un montículo de máximos es un árbol binario completo guardado en un arreglo,
con cada nodo mayor o igual que sus hijos (CLRS, §6.1). Con índices desde 0,
el padre de $i$ está en $\lfloor (i-1)/2 \rfloor$ y sus hijos en $2i+1$ y
$2i+2$. Insertar pone la clave en la primera casilla libre y la sube mientras
su padre sea menor; extraer el máximo pasa la última clave a la raíz y la baja
hacia el mayor de sus hijos. Las dos cuestan $O(\log n)$, y consultar el
máximo es leer `a[0]`.

## Construir un montículo

Llega el arreglo `16 44 13 58 37 92 75 11 64`, sin ningún orden, y hay que
volverlo un montículo de máximos dentro del mismo arreglo.

### Primera idea: insertar una por una

Cada casilla, de la 1 en adelante, se sube como si acabara de llegar. Cuando le
toca a `a[i]`, el prefijo `a[0..i-1]` ya es un montículo.

```cpp
// Versión ingenua: inserta las claves una por una.
void construirSubiendo(vector<int> &a) {
  int i = 1;
  while (i < (int) a.size()) {
    subir(a, i);
    i = i + 1;
  }
}
```

Son $n - 1$ llamados a `subir`, cada uno de $O(\log n)$: $O(n \log n)$. El peor
caso llega con las claves en orden creciente, porque cada una es la mayor
hasta ese momento y sube hasta la raíz. En un árbol de 15 claves, las 8 del
último nivel suben tres niveles cada una: casi la mitad de las claves hace el
recorrido más largo.

### Bajar de abajo arriba

Las casillas sin hijos ya son montículos de una clave. Con $n$ claves, la
última casilla con hijos es la $\lfloor n/2 \rfloor - 1$: con $n = 9$ es la 3,
cuyo hijo izquierdo es la 7, mientras que el de la casilla 4 sería la 9, fuera
del arreglo. `construir` baja cada casilla desde ahí hasta la raíz (CLRS,
§6.3). Usa el `bajar` de `monticulo.h`, ahora como función sobre cualquier
`vector` y con el tamaño como parámetro: las casillas de `n` en adelante no se
miran.

```cpp
// Baja la clave de i dentro de a[0..n-1].
void bajar(vector<int> &a, int n, int i) {
  bool sigue = true;
  while (sigue) {
    int izq = 2 * i + 1;
    int der = 2 * i + 2;
    int mayor = i;
    if (izq < n && a[izq] > a[mayor]) {
      mayor = izq;
    }
    if (der < n && a[der] > a[mayor]) {
      mayor = der;
    }
    if (mayor != i) {
      intercambiar(a, i, mayor);
      i = mayor;
    } else {
      sigue = false;
    }
  }
}
```

```cpp
// Convierte un arreglo cualquiera en montículo de máximos.
void construir(vector<int> &a) {
  int n = (int) a.size();
  int i = n / 2 - 1;
  while (i >= 0) {
    bajar(a, n, i);
    i = i - 1;
  }
}
```

Cuando le toca a la casilla $i$, toda casilla mayor que $i$ ya es la raíz de
un montículo. Los dos hijos de $i$ lo son, y con eso `bajar` deja un montículo
con raíz en $i$. La traza sobre el arreglo del ejemplo:

| llamado | clave | cambia con | intercambios | queda |
|---|---:|---|---:|---|
| `bajar(3)` | 58 | 64 | 1 | `16 44 13 64 37 92 75 11 58` |
| `bajar(2)` | 13 | 92 | 1 | `16 44 92 64 37 13 75 11 58` |
| `bajar(1)` | 44 | 64, luego 58 | 2 | `16 64 92 58 37 13 75 11 44` |
| `bajar(0)` | 16 | 92, luego 75 | 2 | `92 64 75 58 37 13 16 11 44` |

Con `construirSubiendo` el mismo arreglo queda `92 64 75 44 37 13 58 11 16`,
con 8 intercambios en vez de 6. Los dos arreglos son montículos de máximos:
la propiedad no fija un único orden, y la raíz es el 92 en los dos.

### Por qué cuesta $\Theta(n)$

En un árbol de 15 claves, las 8 hojas no bajan, las 4 del nivel 2 bajan a lo
sumo uno, las 2 del nivel 1 a lo sumo dos y la raíz a lo sumo tres:
$4 \cdot 1 + 2 \cdot 2 + 1 \cdot 3 = 11$ intercambios. Subiendo, una clave del
nivel $d$ sube $d$: $2 \cdot 1 + 4 \cdot 2 + 8 \cdot 3 = 34$. Bajando, las
claves que hacen el recorrido largo son pocas.

**Teorema** (CLRS, §6.3). Sobre un arreglo de $n \ge 1$ claves, `construir`
hace a lo sumo $2n$ intercambios.

**Demostración.** Se procede de forma directa, contando los intercambios por
niveles del árbol.

**Desarrollo.** Sea $h = \lfloor \log_2 n \rfloor$ la altura. El nivel $d$
tiene a lo sumo $2^d$ casillas, y una clave que empieza en el nivel $d$ baja a
lo sumo $h - d$ niveles, con un intercambio por nivel. Cambiando $d$ por
$j = h - d$, que recorre los mismos valores de 0 a $h$:

$$
I(n) \;\le\; \sum_{d=0}^{h} 2^d (h - d) \;=\; \sum_{j=0}^{h} 2^{h-j}\, j
\;=\; 2^h \sum_{j=0}^{h} \frac{j}{2^j}
$$

Sea $S = \sum_{j \ge 1} j/2^j$. Restando la mitad de $S$ término a término:

$$
S - \frac{S}{2} = \sum_{j \ge 1} \frac{j}{2^j} - \sum_{j \ge 2} \frac{j-1}{2^j}
= \frac{1}{2} + \sum_{j \ge 2} \frac{1}{2^j} = \sum_{j \ge 1} \frac{1}{2^j} = 1
$$

Entonces $S = 2$. La suma hasta $h$ tiene solo términos positivos y no pasa de
2, y como $2^h \le n$, queda $I(n) \le 2^h \cdot 2 \le 2n$.

**Conclusión.** Por lo tanto, se puede concluir que $I(n) \le 2n$ para todo
$n \ge 1$, es decir, $I(n) \in O(n)$ con testigos $c = 2$ y $k = 1$.

Cada vuelta de `bajar` hace dos comparaciones, y hay una vuelta por
intercambio más la última de cada llamado, así que las comparaciones son a lo
sumo $2(2n + n/2) = 5n$: tiempo $O(n)$ con $c = 5$ y $k = 1$. El ciclo visita
$\lfloor n/2 \rfloor$ casillas, y por eso tampoco baja de lineal: $\Theta(n)$.
Con 31 claves en orden creciente la cota da exactamente lo medido:
$2^4 (1/2 + 2/4 + 3/8 + 4/16) = 26$ intercambios.

### Medido

`heapsort.cpp` cuenta los intercambios de los dos caminos con las claves
$1, 2, \ldots, n$ en orden creciente, el peor caso de los dos:

| $n$ | `construir` | `construirSubiendo` |
|---:|---:|---:|
| 31 | 26 | 98 |
| 1 048 575 | 1 048 555 | 18 874 370 |

Con un millón de claves, subiendo hace 18 veces más intercambios.

| Operación | Costo | Por qué |
|---|---|---|
| `construirSubiendo` | $O(n \log n)$ | cada clave sube hasta $\lfloor \log_2 n \rfloor$ niveles, y la mitad está en el último |
| `construir` | $\Theta(n)$ | la mitad son hojas y no bajan; las que bajan mucho son pocas (teorema) |
| espacio aparte, los dos | $\Theta(1)$ | trabajan dentro del mismo arreglo, con unas pocas variables |

## Heapsort

Para ordenar `24 57 34 68 15 46` con el montículo, la primera idea es
`construir` y extraer el máximo seis veces, poniendo cada uno en otro arreglo
desde el final. Cuesta $O(n \log n)$ y pide un segundo arreglo de $n$
casillas.

Al extraer el máximo, el montículo pierde su última casilla, `a[fin]`. En el
arreglo ordenado, a esa casilla le corresponde justo el máximo de lo que queda
en el montículo, el mayor de las $\mathit{fin} + 1$ claves por ordenar. No
hace falta otro arreglo: se cambia `a[0]` con `a[fin]`, el montículo se acorta
en una casilla y la clave que llegó a la raíz baja (CLRS, §6.4).

```cpp
// Ordena de menor a mayor sin arreglo auxiliar.
void heapsort(vector<int> &a) {
  construir(a);
  int fin = (int) a.size() - 1;
  while (fin > 0) {
    intercambiar(a, 0, fin);
    bajar(a, fin, 0);
    fin = fin - 1;
  }
}
```

En cada vuelta, `a[0..fin]` es un montículo con las claves menores y
`a[fin+1..n-1]` tiene las mayores, ya en orden. `bajar` recibe `fin` como
tamaño y no toca la parte ordenada. `construir` deja `68 57 46 24 15 34`, y
las rondas quedan así:

| ronda | sale a `a[fin]` | nueva raíz | baja por | montículo | ordenado |
|---|---:|---:|---|---|---|
| $\mathit{fin} = 5$ | 68 | 34 | 57 | `57 34 46 24 15` | `68` |
| $\mathit{fin} = 4$ | 57 | 15 | 46 | `46 34 15 24` | `57 68` |
| $\mathit{fin} = 3$ | 46 | 24 | 34 | `34 24 15` | `46 57 68` |
| $\mathit{fin} = 2$ | 34 | 15 | 24 | `24 15` | `34 46 57 68` |
| $\mathit{fin} = 1$ | 24 | 15 | | `15` | `24 34 46 57 68` |

Fueron cinco rondas para seis claves, y la menor quedó en `a[0]` sin moverla.

!!! warning "Bajar sin acortar el montículo"

    Si `heapsort` llama `bajar(a, n, 0)` con el tamaño completo, la parte
    ordenada sigue a la vista. Sobre el mismo arreglo, en la segunda ronda el
    15 llega a la raíz y baja por el 46 hasta `a[2]`; ahí `bajar` ve a
    `a[5]`, el 68 que ya estaba en su lugar, y lo sube. El arreglo termina en
    `68 57 24 46 34 15`.

| Parte | Costo | Por qué |
|---|---|---|
| `construir` | $\Theta(n)$ | el teorema de la sección anterior |
| una ronda | $O(\log n)$ | un intercambio y una bajada de a lo sumo $\lfloor \log_2 n \rfloor$ niveles |
| las $n - 1$ rondas | $O(n \log n)$ | también en el peor caso: la cota de cada ronda vale para cualquier orden de llegada |
| espacio aparte | $\Theta(1)$ | ordena dentro del mismo arreglo, y `bajar` es un ciclo, sin recursión |
| estable | no | el cambio de `a[0]` con `a[fin]` salta por encima de lo que hay en medio, y dos claves iguales pueden quedar invertidas |

Frente a los otros dos algoritmos que ordenan un arreglo:

| Algoritmo | Peor caso | Espacio aparte | Por qué |
|---|---|---|---|
| quicksort | $\Theta(n^2)$ | $\Theta(\log n)$ a $\Theta(n)$ | depende del pivote; el espacio es la pila de llamadas |
| merge sort sobre un arreglo | $\Theta(n \log n)$ | $\Theta(n)$ | mezclar copia las mitades (CLRS, §2.3) |
| heapsort | $\Theta(n \log n)$ | $\Theta(1)$ | `construir` y $n - 1$ bajadas en el mismo arreglo |

## El montículo en la STL

`<algorithm>` trae cinco funciones que trabajan sobre un rango de un `vector`,
dado por dos iteradores, y lo mantienen en orden de montículo de máximos. No
guardan nada aparte: reordenan las casillas del rango, y cada una corresponde a
algo que ya se construyó en la sesión.

| Función | Lo que hace, con lo que se vio en clase |
|---|---|
| `make_heap(b, e)` | `construir`: baja cada casilla con hijos, desde $\lfloor n/2 \rfloor - 1$ hasta la raíz |
| `push_heap(b, e)` | `subir` la última casilla del rango |
| `pop_heap(b, e)` | una ronda de heapsort: cambia la raíz con la última casilla y baja la nueva raíz en un rango una casilla más corto |
| `sort_heap(b, e)` | el ciclo de heapsort, sobre un rango que ya es montículo |
| `is_heap(b, e)` | revisa cada casilla contra su padre |

Ninguna cambia el tamaño del `vector`; eso lo hacen `push_back` y `pop_back`, y
el orden de las llamadas importa. Para agregar va primero `push_back` y después
`push_heap`, que sube la clave que quedó al final. Para sacar va primero
`pop_heap`, que deja el máximo al final, y después `pop_back`, que lo quita.

```cpp
// Arma el montículo y agrega una clave.
void armarYAgregar(vector<int> &v) {
  imprimir("arreglo:", v);
  printf("is_heap: %d\n", (int) is_heap(v.begin(), v.end()));
  make_heap(v.begin(), v.end());
  imprimir("make_heap:", v);
  printf("is_heap: %d\n", (int) is_heap(v.begin(), v.end()));
  v.push_back(88);
  imprimir("push_back(88):", v);
  push_heap(v.begin(), v.end());
  imprimir("push_heap:", v);
}

// Saca el máximo y ordena lo que queda.
void sacarYOrdenar(vector<int> &v) {
  pop_heap(v.begin(), v.end());
  imprimir("pop_heap:", v);
  printf("back() = %d\n", v.back());
  v.pop_back();
  imprimir("pop_back:", v);
  sort_heap(v.begin(), v.end());
  imprimir("sort_heap:", v);
  printf("is_heap: %d\n", (int) is_heap(v.begin(), v.end()));
}
```

Con las claves `36 81 49 95 53 77 91`:

```text
arreglo:       36 81 49 95 53 77 91
is_heap: 0
make_heap:     95 81 91 36 53 77 49
is_heap: 1
push_back(88): 95 81 91 36 53 77 49 88
push_heap:     95 88 91 81 53 77 49 36
pop_heap:      91 88 77 81 53 36 49 95
back() = 95
pop_back:      91 88 77 81 53 36 49
sort_heap:     36 49 53 77 81 88 91
is_heap: 0
```

`make_heap` deja el mismo arreglo que `construir`. `push_heap` sube el 88 por
encima del 36 y del 81, como `subir`. `pop_heap` cambia el 95 con el 36, baja
el 36 en las siete primeras casillas y deja el 95 en `v[7]`, donde `back()` lo
lee antes del `pop_back`. `sort_heap` ordena las siete que quedan, y el
resultado ya no es un montículo de máximos. La norma de C++ no fija el arreglo
exacto que dejan estas funciones; con g++ y claves distintas coincide con el de
las funciones de la sesión, y con claves repetidas el desempate puede ser otro.

!!! warning "El orden de las llamadas"

    Con el vector en `95 88 91 81 53 77 49 36`, un `pop_back` antes de
    `pop_heap` saca el 36, la última casilla, y el 95 se queda. Quitar una hoja
    no rompe el montículo, así que nada lo delata. Y un `push_heap` antes del
    `push_back` deja la clave nueva fuera del rango, sin subir.

### El de mínimos con greater<int>()

`greater<int>()`, de `<functional>`, compara con `a > b`, como `MenorArriba`, y
deja el menor arriba. Cada llamada sobre ese rango lleva el mismo comparador.

```cpp
// Con greater<int>() el menor queda en w[0].
void minimos() {
  int claves[7] = {36, 81, 49, 95, 53, 77, 91};
  vector<int> w(claves, claves + 7);
  make_heap(w.begin(), w.end(), greater<int>());
  imprimir("min make_heap:", w);
  pop_heap(w.begin(), w.end(), greater<int>());
  printf("sale el menor: %d\n", w.back());
  w.pop_back();
  imprimir("min pop_back:", w);
}
```

Queda `36 53 49 95 81 77 91`, con el 36 en `w[0]`; `pop_heap` lo lleva al
final, y tras el `pop_back` quedan `49 53 77 95 81 91`.

| Función | Costo | Por qué |
|---|---|---|
| `make_heap` | $\Theta(n)$ | a lo sumo $3n$ comparaciones, por el mismo argumento de `construir` |
| `push_heap` | $O(\log n)$ | la última clave sube por un camino de largo $\lfloor \log_2 n \rfloor$ |
| `pop_heap` | $O(\log n)$ | un intercambio y una bajada |
| `sort_heap` | $O(n \log n)$ | $n - 1$ veces lo de `pop_heap` |
| `is_heap` | $O(n)$ | cada casilla contra su padre, hasta la primera que falle |
| espacio aparte | $\Theta(1)$ | todo pasa dentro del mismo `vector` |

## El TAD cola de prioridad

En una sala de urgencias cada paciente recibe al llegar una gravedad de 1 a 5.
Una cola que atiende por orden de llegada haría esperar al paciente grave que
llegó último detrás de todos los leves. Se atiende primero al de mayor
gravedad, sin importar cuándo llegó: hace falta una cola de prioridad, en la
que sale primero la clave de mayor prioridad (CLRS, §6.5). Por dentro las
claves no tienen un orden visible; el contrato solo promete cuál sale.

| Operación | Precondición | Resultado |
|---|---|---|
| `insertar(k)` | ninguna | `k` queda en la cola, aunque ya haya otra igual |
| `maximo()` | la cola no está vacía | devuelve la clave mayor, sin quitarla |
| `extraerMax()` | la cola no está vacía | quita la clave mayor y la devuelve |
| `vacio()`, `tamano()` | ninguna | si hay claves y cuántas |

Una cola de prioridad de mínimos es igual con la clave menor: `minimo()` y
`extraerMin()`. La clase `Monticulo` de la sesión anterior cumple el contrato
de máximos:

```cpp
// Las operaciones del TAD sobre el montículo de máximos.
void conMonticulo() {
  Monticulo cola;
  cola.insertar(61);
  cola.insertar(27);
  printf("maximo() = %d\n", cola.maximo());
  cola.insertar(88);
  cola.insertar(43);
  printf("extraerMax() = %d\n", cola.extraerMax());
  printf("extraerMax() = %d\n", cola.extraerMax());
  cola.insertar(70);
  printf("tamano() = %d, maximo() = %d\n", cola.tamano(), cola.maximo());
}
```

```text
maximo() = 61
extraerMax() = 88
extraerMax() = 61
tamano() = 3, maximo() = 70
```

`maximo()` consulta y no quita: después de él, el 61 sigue en la cola. El 88
entró de tercero y sale primero.

| Estructura | `insertar` | `maximo` | `extraerMax` | espacio | Por qué |
|---|---|---|---|---|---|
| arreglo sin orden | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | hay que buscar el mayor |
| arreglo ordenado | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(n)$ | hay que correr las claves para abrir espacio |
| montículo | $O(\log n)$ | $\Theta(1)$ | $O(\log n)$ | $\Theta(n)$ | la clave sube o baja por un camino de largo $\lfloor \log_2 n \rfloor$ |

Con $n$ inserciones y $n$ extracciones, los dos arreglos cuestan $\Theta(n^2)$
en el peor caso y el montículo $O(n \log n)$.

## El contenedor priority_queue

`priority_queue<T>` se incluye con `#include <queue>` y está hecha sobre las
funciones de la sección anterior: guarda un `vector`, `push` es `push_back` y
`push_heap`, y `pop` es `pop_heap` y `pop_back`.

```cpp
// push, top, pop, size y empty: sale siempre el mayor.
void enteros() {
  priority_queue<int> pq;
  int llegan[5] = {64, 15, 90, 37, 52};
  int i = 0;
  while (i < 5) {
    pq.push(llegan[i]);
    i = i + 1;
  }
  printf("top() = %d, size() = %d\n", pq.top(), (int) pq.size());
  pq.pop();
  printf("tras pop(): top() = %d\n", pq.top());
  printf("salen:");
  while (!pq.empty()) {
    printf(" %d", pq.top());
    pq.pop();
  }
  printf("\n");
}
```

```text
top() = 90, size() = 5
tras pop(): top() = 64
salen: 64 52 37 15
```

!!! warning "pop() no devuelve nada"

    `int x = pq.pop();` no compila: `pop` es `void`. Primero se lee con
    `top()` y después se saca con `pop()`, y las dos exigen que la cola no
    esté vacía.

### El menor arriba

El tercer parámetro de la plantilla es un `struct` comparador, como los que se
usaron con `map`. Dice cuándo `a` va detrás de `b`: con `a > b`, el mayor va
detrás y arriba queda el menor.

```cpp
// a va detrás de b cuando a es mayor: arriba queda el menor.
struct MenorArriba {
  bool operator()(int a, int b) const {
    return a > b;
  }
};
```

Con `priority_queue<int, vector<int>, MenorArriba>` y las claves
`71 55 83 9 55`, salen `9 55 55 71 83`: un montículo de mínimos, que guarda el
55 dos veces.

### Registros con operator<

```cpp
// Un paciente: más gravedad se atiende antes y,
// con la misma gravedad, el que llegó primero.
struct Paciente {
  int llegada;
  int gravedad;

  bool operator<(const Paciente &o) const {
    bool menos;
    if (gravedad != o.gravedad) {
      menos = gravedad < o.gravedad;
    } else {
      menos = llegada > o.llegada;
    }
    return menos;
  }
};
```

`a < b` quiere decir que `a` es menos urgente y sale después. Con cinco
pacientes de gravedades `3 1 4 3 4`, en ese orden de llegada:

```text
atender: llegada 3, gravedad 4
atender: llegada 5, gravedad 4
atender: llegada 1, gravedad 3
atender: llegada 4, gravedad 3
atender: llegada 2, gravedad 1
```

Entre los de gravedad 4 sale primero el 3, que llegó antes. Sin el desempate
por llegada, el orden entre iguales lo decidiría la biblioteca.

| Operación | Costo | Por qué |
|---|---|---|
| `push(k)` | $O(\log n)$ | `push_back` y `push_heap` |
| `pop()` | $O(\log n)$ | `pop_heap` y `pop_back` |
| `top()`, `size()`, `empty()` | $\Theta(1)$ | `top` lee la casilla 0 |
| `priority_queue<int> pq(v.begin(), v.end())` | $\Theta(n)$ | copia el rango y llama `make_heap` |
| espacio | $\Theta(n)$ | las claves en el `vector`, sin punteros |

`priority_queue` no tiene iteradores: para ver todas las claves hay que
sacarlas.

## Para practicar en casa

### Propuesto 1: construir a mano

Apliquen `construir` a `21 6 39 14 52 30 47 9` y dibujen el árbol después de
cada llamado a `bajar`. Empieza en $i = 3$ y queda `52 21 47 14 6 30 39 9`.

### Propuesto 2: heapsort a mano

Sigan `heapsort` sobre `5 13 2 25 7 17 20 8 4`, el arreglo de los ejercicios
de CLRS, §6.4. El montículo inicial es `25 13 20 8 7 17 2 5 4`, y tras la
primera ronda queda `20 13 17 8 7 4 2 5 | 25`.

### Propuesto 3: de mayor a menor

Cambien `heapsort` para que ordene de mayor a menor. Hace falta un montículo de
mínimos, así que cambian las dos comparaciones de `bajar`.

### Propuesto 4: UVa 10954, Add All

Una cola de mínimos con `monticulo.h` cambiado a mínimos, o `priority_queue`
con el comparador de la sesión. El enunciado, las trampas y la lectura están
en [Para el juez](#uva-10954-add-all).

### Propuesto 5: un paciente empeora

Mientras espera, la gravedad de un paciente sube. ¿Qué operación le falta al
montículo para reflejarlo, y cuánto costaría si se supiera en qué casilla está?
Piensen en cuál de las dos, `subir` o `bajar`, sirve cuando una clave crece
(CLRS, §6.5).

## Para el juez

La solución lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uva10954.in`.

### UVa 10954, Add All

*UVa 10954, Add All*: <https://vjudge.net/problem/UVA-10954>, donde también se
envía. La página pide cuenta.

Sumar dos números cuesta su suma. Cada caso trae $N$ enteros positivos, con
$2 \le N \le 5000$, todos menores que 100 000, y hay que sumarlos todos, de a
dos, con el menor costo total. Los casos terminan con $N = 0$, que no se
procesa. Para `1 2 3`, sumar $1 + 2$ cuesta 3 y luego $3 + 3$ cuesta 6, en
total 9; empezando por $2 + 3$ el total es 11.

Se suman siempre los dos menores que quedan, y la suma vuelve al grupo. Para
`1 2 3 4`: $1 + 2 = 3$, después $3 + 3 = 6$ y al final $6 + 4 = 10$, en total
19. Una cola de prioridad de mínimos da los dos menores en $O(\log N)$: dos
`extraerMin` y un `insertar` por suma, $O(N \log N)$ por caso y $\Theta(N)$ de
espacio.

!!! warning "Las trampas"

    - Ordenar una vez y sumar de izquierda a derecha no basta: con `5 5 5 5`
      da $10 + 15 + 20 = 45$, y la cola da $10 + 10 + 20 = 40$. La suma nueva
      puede ser mayor que las que quedan, y tiene que volver al grupo.
    - Con 5000 números de 99 999 el total pasa de 6 000 millones, más de lo que
      cabe en un `int`: se acumula en `long long` y se imprime con `%lld`. Las
      sumas parciales sí caben en un `int`, porque ninguna pasa de
      $5000 \cdot 99\,999$.

La lectura: el ciclo de afuera lee $N$ y para en el 0 final o si la entrada se
acaba antes; el de adentro lee los $N$ números.

```cpp
int n;
while (scanf("%d", &n) == 1 && n != 0) {
  int i = 0;
  while (i < n) {
    int x;
    scanf("%d", &x);
    // la clave x entra a la cola de minimos
    i = i + 1;
  }
  // sumar los dos menores mientras quede mas de uno
  // e imprimir el costo con printf("%lld\n", costo)
}
```

Solución: [uva10954.cpp](./codigo/uva10954.cpp), con el montículo de mínimos
[monticulo_min.h](./codigo/monticulo_min.h), [entrada](./codigo/uva10954.in)
y [salida](./codigo/uva10954.out).

## Lo que se vio

- `construir` baja cada casilla con hijos, desde $\lfloor n/2 \rfloor - 1$
  hasta la raíz, y cuesta $\Theta(n)$; insertar una por una cuesta
  $O(n \log n)$.
- Heapsort cambia el máximo con `a[fin]` y baja la nueva raíz en un montículo
  una casilla más corto: $O(n \log n)$ en el peor caso y $\Theta(1)$ de espacio
  aparte, sin ser estable.
- `make_heap`, `push_heap`, `pop_heap` y `sort_heap` hacen sobre un `vector`
  lo de `construir`, `subir`, una ronda de heapsort y heapsort; el tamaño lo
  cambian `push_back` antes de `push_heap` y `pop_back` después de `pop_heap`.
- La cola de prioridad promete insertar, consultar y extraer la clave mayor;
  con un montículo cuestan $O(\log n)$, $\Theta(1)$ y $O(\log n)$, y eso es
  `priority_queue`, que con un comparador deja el menor arriba.

## Ejercicios interactivos

Las actividades para trabajar en el navegador, ordenadas por los temas de la
sesión, están en [Ejercicios interactivos](./Ejercicios.md). Los arreglos y
los programas no son los de la sesión: mismo tema, ronda nueva.

## Lo que sigue

Las estructuras de datos que trae Python y lo que cuesta cada operación,
frente a los contenedores de C++ que ya se vieron.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [monticulo.h](./codigo/monticulo.h): la clase `Monticulo` de la sesión
  anterior, que `uso_cola.cpp` usa como cola de prioridad.
- [heapsort.cpp](./codigo/heapsort.cpp): `bajar` con el tamaño aparte,
  `construirSubiendo`, `construir`, `heapsort` y la versión que no acorta el
  montículo, con las trazas y el conteo del peor caso, y su
  [salida](./codigo/heapsort.out).
- [uso_cola.cpp](./codigo/uso_cola.cpp): el TAD sobre `Monticulo` y
  `priority_queue` con enteros, con `MenorArriba` y con `Paciente`, con
  [salida](./codigo/uso_cola.out).
- [stl_heap.cpp](./codigo/stl_heap.cpp): `make_heap`, `push_heap`,
  `pop_heap`, `sort_heap` e `is_heap` sobre un `vector`, y el de mínimos con
  `greater<int>()`, con [salida](./codigo/stl_heap.out).
- [monticulo_min.h](./codigo/monticulo_min.h): el montículo de mínimos,
  `monticulo.h` con las comparaciones al revés.

La solución del problema de juez está en la sección *Para el juez*, con su
entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 6, *Heapsort*: §6.1,
  montículos; §6.3, construir un montículo; §6.4, el algoritmo heapsort; §6.5,
  colas de prioridad. §2.3, merge sort.
- cppreference. *std::make_heap*, *std::push_heap*, *std::pop_heap*,
  *std::sort_heap* y *std::priority_queue*: <https://en.cppreference.com/w/cpp/algorithm/make_heap>.
- UVa, en Virtual Judge. Problema 10954, *Add All*:
  <https://vjudge.net/problem/UVA-10954>.
