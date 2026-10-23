# Estructuras de Datos · Clase 20. Contenedores list, deque, stack y queue

Viernes 16 de octubre de 2026, de 14:00 a 17:00.

La lista doblemente enlazada, la cola doble, la pila y la cola ya están
construidas a mano, cada una con sus costos. La biblioteca de C++ trae las
mismas estructuras con otros nombres: `list` es la lista doble, `deque` es una
cola doble que además se lee por índice, y `stack` y `queue` son contratos
puestos encima de otro contenedor. Esta sesión las reconoce una por una, da lo
que cuesta cada operación y de dónde sale, y termina midiendo tiempos para
contrastar las tablas con lo que pasa al correr el programa.

Al terminar, el objetivo es poder usar `list` y `deque` con sus iteradores y
reconocer en cada operación la lista doble o los bloques que la respaldan; dar
el costo en tiempo y en espacio de cada operación de los cuatro contenedores y
explicar de dónde sale; explicar qué contenedor guardan por dentro `stack` y
`queue` y cuándo se puede cambiar; y escoger el contenedor de un programa a
partir de las operaciones que hace, contrastando la elección con tiempos
medidos.

## Diapositivas

![](./clase20.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Lo que ya está construido

| Construida | Qué la hace rápida | Qué le cuesta |
|---|---|---|
| Lista doble | `anterior` en cada nodo: desenlazar en $\Theta(1)$ | llegar a la posición $p$, $\Theta(p)$ |
| Cola doble | lista doble con cabeza y `ultimo`: los cuatro extremos en $\Theta(1)$ | leer el elemento $i$, $\Theta(i)$ |
| Pila sobre nodos | la cima es la cabeza | nada: todo $\Theta(1)$ |
| Cola sobre nodos | entra por `ultimo`, sale por la cabeza | nada: todo $\Theta(1)$ |
| Cola sobre arreglo circular | dos índices que dan la vuelta | capacidad fija |

Quicksort cerró el tema de ordenamiento: `particionar` deja el pivote en su
casilla en $\Theta(n)$, y el algoritmo cuesta $\Theta(n \log n)$ con
particiones balanceadas y $\Theta(n^2)$ en el peor caso.

La biblioteca trae `list`, `deque`, `stack` y `queue`. La pregunta que ordena
la sesión es cuál de las cinco de la tabla es cada una.

## `list`: la lista doblemente enlazada

### Un reproductor con cursor

Un reproductor guarda una lista de canciones y un cursor. Llegan 100 000
órdenes: insertar una canción donde está el cursor, borrar la del cursor, mover
el cursor una canción adelante o atrás. Con un `vector`, `insert` y `erase` en
la posición $p$ corren los $n - p$ elementos que siguen. Si el cursor anda cerca
del comienzo, cada orden cuesta del orden de $n$, y las 100 000 órdenes suman
del orden de $n^2$.

Lo que pide el problema es insertar y borrar donde ya se está parado, sin
correr a nadie, y moverse un paso en cualquier dirección. Eso lo hace la lista
doblemente enlazada: con el nodo en la mano, insertar y desenlazar tocan cuatro
punteros, y `anterior` permite retroceder.

Para borrar la canción del cursor, sea `actual` su nodo. Desenlazarlo son dos
asignaciones:

1. `actual->anterior->siguiente = actual->siguiente`: el de antes salta al de
   después.
2. `actual->siguiente->anterior = actual->anterior`: el de después vuelve al de
   antes.

Después va el `delete actual`. Con la lista `1 9 4 7` y el cursor en el 4, el
9 pasa a señalar al 7 y el 7 regresa al 9; queda `1 9 7` y nadie se corrió.
Con el nodo en la mano son dos asignaciones, $\Theta(1)$. Llegar a él desde el
comienzo cuesta $\Theta(p)$, y $\Theta(n)$ en el peor caso. El `vector`, para
quitar la casilla $p$, corre los $n - p$ que siguen.

### `list<T>`: la lista doble con nombres nuevos

| Lista doble del curso | `list<T>` |
|---|---|
| `insertar(0, e)`, `agregar(e)` | `push_front(e)`, `push_back(e)` |
| `eliminar(0)`, `eliminar(n-1)` | `pop_front()`, `pop_back()` |
| insertar antes de un nodo | `insert(it, e)` |
| `desenlazar(x)` y `delete` | `erase(it)` |
| `tamano`, `vacia` | `size()`, `empty()` |

El iterador de `list` hace lo que hacía el puntero al nodo: `++it` sigue a
`siguiente` y `--it` sigue a `anterior`. No hay `l[i]` ni `it + 3`.

### Insertar y borrar con el iterador

De [list_uso.cpp](./codigo/list_uso.cpp):

```cpp
int main() {
  list<int> l;
  l.push_back(4);
  l.push_back(7);
  l.push_front(1);
  imprimir(l);                     // 1 4 7
  conIterador(l);
  l.pop_front();
  l.pop_back();
  imprimir(l);                     // 9
  printf("size: %d\n", (int) l.size());
  return 0;
}
```

```cpp
// insertar y borrar donde senala el iterador
void conIterador(list<int> &l) {
  list<int>::iterator it = l.begin();
  ++it;                            // senala el 4
  l.insert(it, 9);                 // entra antes del 4
  imprimir(l);                     // 1 9 4 7
  printf("*it = %d\n", *it);       // sigue en el 4
  it = l.erase(it);                // devuelve el siguiente: el 7
  printf("*it = %d\n", *it);
  --it;                            // retrocede al 9
  printf("*it = %d\n", *it);
}
```

Tras `l.insert(it, 9)`, ¿a quién señala `it`? En el `vector`, un iterador
guardado antes de `insert` dejaba de valer. Aquí la salida es `1 4 7`, después
`1 9 4 7`, y `*it = 4`: `it` sigue en el 4. Tras `erase` la lista es `1 9 7`
y `*it = 7`; tras `--it`, `*it = 9`. Con los dos `pop` queda `9` y `size: 1`.

- El 4 sigue en su nodo: insertar creó un nodo nuevo y reescribió dos punteros
  de los vecinos, sin mover a nadie. Por eso `insert` no invalida ningún
  iterador de `list`.
- `erase(it)` invalida solo los iteradores al nodo borrado, y devuelve el que
  sigue, igual que en `vector`.

### `splice`: mover nodos sin copiarlos

Se tiene `a = <8 1 6>` y `b = <5 3>`. Hay que dejar los elementos de `b` dentro
de `a`, antes del 1. Con `insert` se copian uno por uno y `b` sigue llena. No
hace falta copiar: basta reemplazar el enlace del 8 al 1 por dos enlaces, del 8
al 5 y del 3 al 1, con sus dos `anterior`. Son cuatro punteros, sin importar
cuántos nodos traiga `b`.

De [list_splice_sort.cpp](./codigo/list_splice_sort.cpp):

```cpp
int main() {
  list<int> a = {8, 1, 6};
  list<int> b = {5, 3};
  list<int>::iterator it = a.begin();
  ++it;                            // senala el 1
  a.splice(it, b);                 // b entra antes del 1
  imprimir("a", a);                // 8 5 3 1 6
  imprimir("b", b);                // vacia
  printf("*it = %d\n", *it);       // sigue en el 1

  a.sort();
  imprimir("a", a);                // 1 3 5 6 8
  printf("*it = %d\n", *it);       // el 1, ahora al frente
  return 0;
}
```

La salida es `a: 8 5 3 1 6`, `b:` vacía y `*it = 1`. Después de `sort`,
`a: 1 3 5 6 8` y `*it = 1`: el iterador sigue en el mismo nodo, que ahora está
al frente. `splice(it, b)` con la lista entera cuesta $\Theta(1)$ y deja `b`
vacía.

¿Qué pasa con la dirección de `b` y con la de sus elementos? Nada: `splice`
no copia ni muda nodos, solo los reengancha. El objeto `b` sigue donde estaba,
ahora con cero elementos, y cada nodo que pasó a `a` conserva su dirección.
Por eso un iterador a un elemento de `b` sigue valiendo después del `splice`:
señala el mismo nodo, que ahora se recorre dentro de `a`.

De [splice_direcciones.cpp](./codigo/splice_direcciones.cpp):

```cpp
int main() {
  list<int> a = {1, 2, 3};
  list<int> b = {4, 5};
  list<int>::iterator it = a.begin();
  ++it;                            // senala el 2
  list<int>::iterator cuatro = b.begin();
  printf("antes:   &b = %p, el 4 en %p\n", (void *) &b, (void *) &*cuatro);
  a.splice(it, b);                 // b entra antes del 2
  imprimir("a", a);                // 1 4 5 2 3
  imprimir("b", b);                // vacia
  printf("despues: &b = %p, el 4 en %p\n", (void *) &b, (void *) &*cuatro);
  --it;                            // del 2 retrocede al 5
  --it;                            // y al 4
  printf("*cuatro = %d, it en el 4: %d\n", *cuatro, (int) (it == cuatro));
  return 0;
}
```

Las direcciones cambian de una corrida a otra, pero en cada corrida la línea
de antes y la de después muestran la misma dirección de `b` y la misma del 4.
La salida sigue con `a: 1 4 5 2 3`, `b:` vacía y `*cuatro = 4, it en el 4: 1`:
desde el 2, dos `--it` llegan al nodo que antes estaba en `b`, y es el mismo
que señala `cuatro`.

### Ordenar una `list`

Con un `vector` se ordenaba con `sort(v.begin(), v.end())`. Con una `list`:

```cpp
list<int> l = {8, 1, 6};
std::sort(l.begin(), l.end());
```

no compila. g++ responde
`error: no match for 'operator-' (operand types are 'std::_List_iterator<int>' and 'std::_List_iterator<int>')`.

- `sort` calcula distancias y salta posiciones: `fin - ini`, `ini + k`. En el
  arreglo eso es aritmética; en la lista, llegar a la posición $k$ es caminar
  $k$ nodos, y la biblioteca no ofrece el salto.
- La lista trae su propio `l.sort()`: el merge sort sobre la lista enlazada, el
  que divide con dos punteros a distinta velocidad y combina empalmando nodos.
  Hace del orden de $n \log n$ comparaciones y no copia datos: reescribe
  enlaces. Por eso el `it` del ejemplo anterior seguía valiendo.

### Lo que cobra `list`

| Operación | Tiempo | Por qué |
|---|---|---|
| `push_front`, `push_back` | $\Theta(1)$ | se cuelga el nodo de la cabeza o del último y se reescribe el `anterior` o el `siguiente` del vecino |
| `pop_front`, `pop_back` | $\Theta(1)$ | el vecino pasa a ser el extremo |
| `insert(it, e)` | $\Theta(1)$ | dos punteros del nodo nuevo, el `siguiente` del de antes y el `anterior` del de `it` |
| `erase(it)` | $\Theta(1)$ | el `siguiente` del anterior y el `anterior` del siguiente |
| `splice(it, b)`, `b` entera | $\Theta(1)$ | dos enlaces de ida y dos de vuelta |
| `front`, `back`, `size`, `empty` | $\Theta(1)$ | se leen la cabeza, el último y el contador |
| llegar al elemento $p$ | $\Theta(p)$ | `++it` de nodo en nodo |
| `l.sort()` | $\Theta(n \log n)$ | merge sort que empalma nodos |

La lista ocupa $\Theta(n)$: dato y dos punteros por nodo, más lo que pide cada
`new`. Con enteros, los campos suman $4 + 8 + 8 = 20$ bytes, y 40 nodos darían
800. El compilador da otra cifra; de
[tamano_nodo.cpp](./codigo/tamano_nodo.cpp), con g++ 16.2:

| Nodo de `list<int>` | Bytes | 40 nodos |
|---|---:|---:|
| suma de los campos | 20 | 800 |
| `sizeof(Nodo)` | 24 | 960 |

En la biblioteca de GCC el nodo guarda primero los dos punteros, en los bytes
0 a 15, y el entero en los bytes 16 a 19. El tamaño del nodo se redondea a un
múltiplo de 8, para que en cualquier nodo los punteros queden en una dirección
múltiplo de 8, que es como el procesador los lee de una vez. Del byte 20 al 23
queda un relleno. El `NodoDoble` de
[la cola doble sobre nodos](../C19/Clase%2019.%20Ejercicios%20sobre%20las%20implementaciones%20y%20quicksort.md)
mide lo mismo, 20 bytes de campos y 24 de `sizeof`; allí el entero va primero
y el hueco queda entre él y el primer puntero. Sigue siendo $\Theta(n)$:
cambia la constante.

Ninguna operación de la tabla pide memoria aparte que crezca con $n$;
`l.sort()` en la biblioteca de GCC usa 64 listas auxiliares vacías,
$\Theta(1)$.

!!! warning "Lo que `list` no tiene"

    - Ni `l[i]` ni `it + k`: el acceso por posición es $\Theta(p)$, y la
      biblioteca no lo disfraza de operador. En el `vector` los elementos son
      vecinos de cuadra, y sumar $k$ a la dirección lleva a la casa $k$; en la
      `list` cada nodo vive en otra parte de la ciudad, y la única forma de
      llegar es seguir los punteros. Sumar a mano un número a la dirección de un
      nodo lleva a
      memoria ajena, y el programa puede terminar en un fallo de segmentación.
    - Ni `sort`, `binary_search` ni `lower_bound` de la biblioteca de
      algoritmos sirven como en el `vector`: los dos últimos compilan, pero
      cada salto a la mitad camina nodo a nodo.

## `deque`: la cola doble que se lee por índice

### Lo que le faltaba a la cola doble

La cola doble sobre la lista doble entra y sale por los dos extremos en
$\Theta(1)$. Si además se pide leer el elemento $i$, hay que caminar. Y el
`vector`, que lee por índice, paga por entrar por el frente.

| | Entrar por el frente | Leer el elemento $i$ |
|---|---|---|
| Cola doble sobre nodos | $\Theta(1)$ | $\Theta(i)$: se camina |
| `vector` | $\Theta(n)$: se corre todo | $\Theta(1)$: se calcula |
| `deque` | $O(1)$ | $O(1)$ |

La idea del `deque` no es un solo arreglo ni un nodo por elemento: son bloques
de tamaño fijo, cada uno un arreglo pequeño, y un arreglo corto de punteros a
los bloques, el *mapa*. Dentro de un bloque se calcula la casilla; entre
bloques, el mapa dice dónde está cada uno.

### Bloques y mapa

El `deque` `<3 1 4 7 9 2 6>` con bloques de $B = 4$ casillas ocupa tres
bloques: el bloque 0 tiene dos casillas vacías y luego 3 y 1; el bloque 1 tiene
4, 7, 9 y 2; el bloque 2 tiene el 6 y tres casillas vacías. El primer elemento
está en la casilla 2 del bloque 0; sea $\mathit{ini} = 2$.

El elemento $i$ está en el bloque $(\mathit{ini} + i) / B$, en la casilla
$(\mathit{ini} + i) \bmod B$. Para $d[5]$: $(2 + 5) / 4 = 1$ y
$(2 + 5) \bmod 4 = 3$, el 2. Son dos cuentas y dos accesos, el del mapa y el del
bloque, sin importar $i$.

`push_front(8)` escribe en la casilla 1 del bloque 0 y deja $\mathit{ini} = 1$.
Cuando el primer bloque se llena, se pide uno nuevo y su puntero va en la
casilla libre del mapa que está antes. Ningún elemento se corre.

- Si el mapa se queda sin casillas libres, se copia a uno más grande, como el
  `vector`. Se copian punteros a bloques, $n / B$ de ellos, no los elementos.
- En la biblioteca de GCC cada bloque ocupa 512 bytes: 128 enteros.

Otro `deque`, con los valores 1 a 10, bloques de $B = 4$ y
$\mathit{ini} = 3$. El mapa tiene seis casillas; las cuatro primeras señalan
bloques y las otras dos quedan libres para los que vengan:

| Mapa | Bloque | Casilla 0 | Casilla 1 | Casilla 2 | Casilla 3 |
|---:|---:|---:|---:|---:|---:|
| 0 | 0 | | | | 1 |
| 1 | 1 | 2 | 3 | 4 | 5 |
| 2 | 2 | 6 | 7 | 8 | 9 |
| 3 | 3 | 10 | | | |
| 4 | libre | | | | |
| 5 | libre | | | | |

¿Dónde está $d[3]$? $(3 + 3) / 4 = 6 / 4 = 1$: el bloque 1, el segundo.
$(3 + 3) \bmod 4 = 2$: la casilla 2, la tercera. Ahí está el 4, que es $d[3]$
porque los índices empiezan en 0. Se leyó la casilla 1 del mapa, que lleva al
bloque, y la casilla 2 del bloque; nada se recorrió.

Los dos extremos salen de la misma cuenta:

- `push_front(0)` escribe en la posición $\mathit{ini} - 1 = 2$: la casilla 2
  del bloque 0. Después $\mathit{ini} = 2$, y el 0 pasa a ser $d[0]$.
- `push_back(11)`, sobre el `deque` de la tabla, escribe en la posición
  $\mathit{ini} + n = 3 + 10 = 13$: bloque $13 / 4 = 3$, casilla
  $13 \bmod 4 = 1$, justo detrás del 10.

Tras `push_front(0)`, dos `push_front` más llenan el bloque 0 y dejan
$\mathit{ini} = 0$. El siguiente pide un bloque nuevo antes del bloque 0, pero
el bloque 0 está en la casilla 0 del mapa y antes no hay casilla. El mapa se
copia a uno más grande: se copian los cuatro punteros a bloques, no los 13
elementos, y cada elemento sigue en la dirección que tenía.

### `deque<T>`: la cola doble de la biblioteca

| Cola doble del curso | `deque<T>` |
|---|---|
| `insertarFrente`, `insertarFinal` | `push_front`, `push_back` |
| `eliminarFrente`, `eliminarFinal` | `pop_front`, `pop_back` |
| `frente`, `final` | `front`, `back` |
| no estaba | `d[i]`, `d.begin() + i` |

De [deque_uso.cpp](./codigo/deque_uso.cpp):

```cpp
int main() {
  deque<int> d;
  d.push_back(4);
  d.push_back(7);
  d.push_front(1);
  d.push_front(3);
  imprimir(d);                     // 3 1 4 7
  printf("d[2] = %d\n", d[2]);
  printf("front %d, back %d\n", d.front(), d.back());

  d.pop_front();
  d.pop_back();
  imprimir(d);                     // 1 4
  d.insert(d.begin() + 1, 9);      // corre el lado corto
  imprimir(d);                     // 1 9 4
  printf("size: %d\n", (int) d.size());
  return 0;
}
```

La salida es `3 1 4 7`, `d[2] = 4`, `front 3, back 7`; tras los dos `pop`,
`1 4`; tras el `insert`, `1 9 4` y `size: 3`.

### Lo que cobra `deque`

| Operación | Tiempo | Por qué |
|---|---|---|
| `d[i]`, `front`, `back` | $O(1)$ | bloque y casilla se calculan |
| `push_front`, `push_back` | $O(1)$ | se escribe una casilla libre o se pide un bloque |
| `pop_front`, `pop_back` | $O(1)$ | se mueve el extremo; un bloque vacío se libera |
| `insert`, `erase` en la posición $p$ | $O(\min(p, n - p))$ | se corre el lado más corto |
| `size`, `empty` | $O(1)$ | se lee el contador |

El espacio es $\Theta(n)$ más el mapa, con $n / B$ punteros, y a lo sumo dos
bloques a medio llenar. Un `deque` con un solo elemento ya reserva un bloque
entero.

!!! warning "Iteradores que dejan de valer"

    - `push_front` y `push_back` invalidan todos los iteradores, porque el mapa
      pudo mudarse. Los punteros y referencias a los elementos siguen valiendo:
      los bloques no se mueven.
    - `insert` y `erase` en medio invalidan todo: se corrieron elementos.
    - Tras cualquiera de ellas, el iterador se toma de nuevo, como en el
      `vector`.

### `vector`, `deque` y `list`, lado a lado

| Operación | `vector` | `deque` | `list` |
|---|---|---|---|
| acceso por índice | $O(1)$ | $O(1)$ | no hay; caminar, $\Theta(p)$ |
| entrar o salir por el final | $O(1)$ amortizado | $O(1)$ | $\Theta(1)$ |
| entrar o salir por el frente | $\Theta(n)$ | $O(1)$ | $\Theta(1)$ |
| insertar o borrar en $p$ | $O(n - p)$ | $O(\min(p, n - p))$ | $\Theta(1)$ con el iterador |
| `sort` de la biblioteca | sí | sí | no; `l.sort()` |
| `insert` invalida iteradores | sí | sí | no |
| memoria por elemento | el dato | el dato | dato y dos punteros |

- La `list` es la única que inserta en medio sin correr a nadie, pero paga con
  no tener índice.
- El `deque` gana al `vector` por el frente y pierde poco en el índice: dos
  accesos en vez de uno.

## `stack` y `queue`: adaptadores

### Un contrato encima de otro contenedor

`stack` y `queue` ya se usaron con `push`, `pop`, `top` y `front`. ¿Dónde
guardan los elementos? Y si por dentro hay un contenedor con índice, ¿por qué
no hay `s[2]`?

La cola sobre el TAD Lista ya hizo esto: una clase con una `Lista` adentro que
solo deja pasar `encolar`, `desencolar` y `frente`. La biblioteca llama a eso
un *adaptador*.

| Adaptador | Por defecto | Se puede cambiar por | Lo que pide del de abajo |
|---|---|---|---|
| `stack<T>` | `deque<T>` | `vector<T>`, `list<T>` | `back`, `push_back`, `pop_back` |
| `queue<T>` | `deque<T>` | `list<T>` | `front`, `back`, `push_back`, `pop_front` |

El contrato es lo que limita: la pila promete el último y nada más. Si dejara
leer `s[2]`, ya no sería una pila, y el código que la usa podría depender de
cómo está guardada por dentro.

### Escoger lo que va debajo

De [adaptadores.cpp](./codigo/adaptadores.cpp):

```cpp
int main() {
  stack<int> a;                    // por debajo, un deque
  stack<int, vector<int> > b;      // por debajo, un vector
  queue<int, list<int> > c;        // por debajo, una list
  int x = 1;
  while (x <= 3) {
    a.push(x);
    b.push(10 * x);
    c.push(100 * x);
    x = x + 1;
  }
  printf("%d %d %d\n", a.top(), b.top(), c.front());
  a.pop();
  b.pop();
  c.pop();
  printf("%d %d %d\n", a.top(), b.top(), c.front());
  return 0;
}
```

La salida es `3 30 100` y, tras los tres `pop`, `2 20 200`. Las pilas sacaron
el último que entró y la cola el primero, sin importar qué contenedor guarda
los datos.

¿Y una `queue<int, vector<int> >`? Compila hasta el primer `pop`, donde g++
responde `error: 'class std::vector<int>' has no member named 'pop_front'`.

- El `vector` no trae `pop_front` porque le costaría $\Theta(n)$: correr todo
  un puesto. La biblioteca prefiere no ofrecer la operación a ofrecerla cara.
- Para la `stack`, el `vector` sí sirve: todo pasa por el final.

### Lo que cobran los adaptadores

| Operación | Sobre `deque` o `list` | Sobre `vector` | Por qué |
|---|---|---|---|
| `push` | $O(1)$ | $O(1)$ amortizado | un `push_back` del de abajo |
| `pop` | $O(1)$ | $O(1)$ | `pop_back` o `pop_front` |
| `top`, `front`, `back` | $O(1)$ | $O(1)$ | se lee un extremo |
| `size`, `empty` | $O(1)$ | $O(1)$ | se pregunta al de abajo |

El espacio es el del contenedor de abajo: $\Theta(n)$. El adaptador no agrega
nada.

| | Construida a mano | Biblioteca |
|---|---|---|
| Pila | `Pila` de `pila_nodos.h`: la cima es la cabeza | `stack<T>` |
| Cola | `Cola` de `cola_nodos.h`: entra por `ultimo` | `queue<T>` |

Las dos construidas a mano guardan un nodo por elemento; las de la biblioteca,
por defecto, bloques de un `deque`. Mismo contrato, mismos costos asintóticos,
distinta memoria.

El tercer adaptador, `priority_queue`, sale por el mayor, no por el más viejo.
Va sobre un `vector` y llega con los montículos.

## Cuál escoger

### Escoger por las operaciones

| Si el programa … | Contenedor |
|---|---|
| lee por índice y crece por el final | `vector` |
| entra o sale por los dos extremos y lee por índice | `deque` |
| inserta y borra en medio con un cursor que se mueve paso a paso | `list` |
| mueve trozos enteros de una secuencia a otra | `list` con `splice` |
| solo usa el último que entró | `stack` |
| solo usa el más viejo | `queue` |

Cuando dos sirven, se escoge el de contrato más estrecho: una `stack` dice al
que lee el código lo que el programa hace, y un `deque` no lo dice.

### Decidir

Para cada programa, escojan el contenedor y digan qué cuesta la operación que
más se repite.

1. Un navegador guarda las 50 últimas páginas visitadas. Cada visita entra al
   final; si ya hay 50, sale la más vieja. El botón *historial* muestra la
   página número $i$.
2. En una fila de espera, cualquiera puede retirarse desde la mitad. El
   programa guarda, por cada persona, dónde está en la fila, y la saca de ahí
   cuando se retira.
3. El botón *deshacer* de un editor de texto.
4. Se leen $n$ notas y después se responden $q$ consultas: ¿cuál es la nota del
   estudiante $i$?
5. Una impresora atiende los trabajos en el orden en que llegaron.
6. Dos filas de un banco se fusionan cuando cierra una caja: la segunda fila
   entera pasa detrás de la persona número 3 de la primera.

Lo que debe salir:

1. `deque`: `push_back` y `pop_front` en $O(1)$ y la página $i$ en $O(1)$. El
   `vector` pagaría $\Theta(n)$ en cada salida por el frente; la `list`,
   $\Theta(i)$ en cada consulta.
2. `list`: se guarda un iterador por persona, y `erase` la saca en
   $\Theta(1)$. Es la única de las tres en la que los iteradores guardados de
   los demás siguen valiendo tras borrar.
3. `stack`: solo se mira y se quita la última acción; todo $O(1)$.
4. `vector`: se llena una vez con `push_back` y cada consulta es $O(1)$.
5. `queue`: el más viejo sale primero; todo $O(1)$.
6. `list`: llegar a la persona 3 cuesta tres pasos y `splice` pega la otra fila
   en $\Theta(1)$, sin importar cuántos haya en ella.

## Medir

### Lo que se midió

`push_front` cuesta $O(1)$ en `deque` y en `list`, e `insert` al frente cuesta
$\Theta(n)$ en `vector`. Si $n$ se duplica, ¿cuánto debería crecer el tiempo de
insertar $n$ veces al frente en cada uno?

De [medir.cpp](./codigo/medir.cpp):

```cpp
void alFrenteVector(int n) {
  vector<int> v;
  int i = 0;
  while (i < n) {
    v.insert(v.begin(), i);
    i = i + 1;
  }
}

void alFrenteDeque(int n) {
  deque<int> d;
  int i = 0;
  while (i < n) {
    d.push_front(i);
    i = i + 1;
  }
}
```

`alFrenteList` es la misma, con `list<int>`. Para leer, `sumarDeque` suma
`d[i]` con `i` de 0 a $n - 1$. La `list` se suma de dos formas:

```cpp
// el elemento i se alcanza caminando i pasos desde el comienzo
long sumarListPorIndice(list<int> &l) {
  long s = 0;
  int i = 0;
  while (i < (int) l.size()) {
    list<int>::iterator it = l.begin();
    int pasos = 0;
    while (pasos < i) {
      ++it;
      pasos = pasos + 1;
    }
    s = s + *it;
    i = i + 1;
  }
  return s;
}
```

```cpp
long sumarListRecorrido(list<int> &l) {
  long s = 0;
  list<int>::iterator it = l.begin();
  while (it != l.end()) {
    s = s + *it;
    ++it;
  }
  return s;
}
```

El programa lee el reloj del procesador antes y después de cada llamada con
`clock()`, de `<ctime>`, y divide la diferencia entre `CLOCKS_PER_SEC` para
pasarla a segundos. Se compiló con `g++ -Wall -Wextra`, sin optimizar, en un
AMD Ryzen 5 3600. Tres corridas difirieron en menos del 10 % en las cifras de
más de una centésima.

### Insertar $n$ veces al frente

Tiempos en segundos:

| $n$ | `vector` | `deque` | `list` |
|---:|---:|---:|---:|
| 25 000 | 0,0184 | 0,0002 | 0,0027 |
| 50 000 | 0,0723 | 0,0004 | 0,0052 |
| 100 000 | 0,2931 | 0,0008 | 0,0101 |
| 200 000 | 1,2893 | 0,0016 | 0,0199 |

- Al duplicar $n$, el `vector` multiplica su tiempo por cerca de 4: son $n$
  inserciones que corren hasta $n$ elementos, del orden de $n^2$.
- `deque` y `list` lo multiplican por 2: $n$ operaciones de $O(1)$.
- Las dos son $O(1)$ por operación, pero con $n = 200\,000$ la `list` tarda
  unas 12 veces más que el `deque`: hace un `new` por elemento, y el `deque`
  uno cada 128 enteros. Además, los nodos de la `list` quedan repartidos por
  la memoria, mientras que el `deque` escribe casillas vecinas de un mismo
  bloque, y la caché del procesador trae casillas vecinas de una sola vez. Ir
  a memoria cuesta más
  que hacer la cuenta de bloque y casilla. En un juez, esa constante puede
  separar un aceptado de un tiempo límite excedido.

### Sumar los $n$ elementos

Tiempos en segundos:

| $n$ | `deque`, `d[i]` | `list`, por posición | `list`, iterador |
|---:|---:|---:|---:|
| 5 000 | 0,0003 | 0,0384 | 0,0001 |
| 10 000 | 0,0005 | 0,1579 | 0,0003 |
| 20 000 | 0,0010 | 0,6366 | 0,0005 |
| 40 000 | 0,0020 | 2,5887 | 0,0006 |

- Leer la posición $i$ de la `list` caminando desde el comienzo suma
  $0 + 1 + \cdots + (n - 1)$ pasos: al duplicar $n$, el tiempo se multiplica
  por 4. Con 40 000 elementos ya pasa de dos segundos.
- Recorrer la misma `list` con un iterador que avanza es $\Theta(n)$, y tarda
  menos que el `deque` con `d[i]`. El costo no está en la lista: está en volver
  a empezar desde `begin()` por cada elemento.

## Para el juez

### UVa 11988 — Broken Keyboard (a.k.a. Beiju Text)

*UVa 11988 — Broken Keyboard (a.k.a. Beiju Text)*,
<https://onlinejudge.org/external/119/11988.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3139>.

El texto es una `list<char>` y el cursor un iterador: cada letra entra con
`insert(cursor, c)` en $\Theta(1)$.

Cada línea es lo que se tecleó: entre 1 y 100 000 letras y guiones bajos, con
dos caracteres especiales. `[` manda el cursor al inicio del texto (*Home*) y
`]` al final (*End*). Hay que imprimir el texto que quedó en la pantalla. La
entrada termina con el fin de archivo. `This_is_a_[Beiju]_text` deja
`BeijuThis_is_a__text`, y `[[]][][]Happy_Birthday_to_Tsinghua_University` deja
el texto sin corchetes.

`[` pone el cursor en `begin()`, `]` en `end()`, y cada letra entra con
`insert(cursor, c)`. `insert` pone la letra antes del cursor y el cursor no se
mueve, así que la siguiente letra queda detrás de la anterior. Cada carácter
cuesta $\Theta(1)$: $\Theta(n)$ por línea.

!!! warning "Las trampas"

    - Con `push_front` por cada letra después de un `[`, `[Beiju` sale
      `ujieB`: las letras tecleadas tras *Home* quedan en el orden en que se
      tecleó.
    - Con un `vector`, cada letra corre lo que está detrás del cursor: del
      orden de $n^2$ en una línea de 100 000.
    - Pueden venir corchetes seguidos y una línea que no deja letras.

### UVa 12207 — That is Your Queue

*UVa 12207 — That is Your Queue*, <https://onlinejudge.org/external/122/12207.pdf>.
Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3359>.

Un `deque<int>` con solo los primeros $\min(P, C)$ ciudadanos: `N` rota el
frente al final y `E x` lo saca de su puesto y lo pone al frente.

Los ciudadanos $1, 2, \ldots, P$ hacen fila para el único hospital, con
$1 \leq P \leq 10^9$. Llegan $C \leq 1000$ órdenes: `N` atiende al del frente,
que vuelve a entrar al final, y `E x` pasa al ciudadano $x$ al frente sin
cambiar el orden de los demás. Por cada `N` se imprime a quién se atendió. Hay
a lo sumo diez casos y la entrada termina con `0 0`. Con $P = 3$ y las órdenes
`N N E 1 N N N`, salen `1 2 1 3 2`. Con $P = 10$ y dos `N`, salen `1 2`.

`N` es `front`, `pop_front` y `push_back`, todo $O(1)$. `E x` busca a $x$ con
un iterador, lo borra si está y lo mete con `push_front`. Con a lo sumo $C$
atenciones, solo pueden llegar al frente los primeros $\min(P, C)$ y los que se
adelanten. Cada caso cuesta $O(C \cdot \min(P, C))$, a lo sumo del orden de
$10^6$ pasos.

!!! warning "Las trampas"

    - Llenar la fila con los $P$ ciudadanos: con $P = 10^9$ no cabe en memoria
      ni en tiempo.
    - `E x` con $x$ ya en la fila no lo duplica: sale de su puesto antes de
      pasar al frente.
    - $x$ puede ser mayor que $C$ y no estar en lo guardado. Entonces solo se
      pone al frente.

### Soluciones

Cada una lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uvaNNNN.in`.

- UVa 11988 — Broken Keyboard: [uva11988.cpp](./codigo/uva11988.cpp),
  [entrada](./codigo/uva11988.in), [salida](./codigo/uva11988.out)
- UVa 12207 — That is Your Queue: [uva12207.cpp](./codigo/uva12207.cpp),
  [entrada](./codigo/uva12207.in), [salida](./codigo/uva12207.out)

## Lo que se vio

- `list<T>` es la lista doblemente enlazada: `push_front`, `push_back`,
  `insert(it, e)` y `erase(it)` cuestan $\Theta(1)$, y llegar a la posición
  $p$ cuesta $\Theta(p)$, sin `l[i]` ni `it + k`.
- `insert` no invalida ningún iterador de `list`, y `erase(it)` solo invalida
  los del nodo borrado. `splice(it, b)` con `b` entera reescribe cuatro
  punteros: $\Theta(1)$. Ni `b` ni sus nodos cambian de dirección, y los
  iteradores a esos nodos siguen valiendo, ahora dentro de `a`.
- Con enteros, el nodo de `list` suma 20 bytes de campos y `sizeof` da 24 por
  el relleno que alinea los punteros: 960 bytes para 40 nodos.
- `sort(l.begin(), l.end())` no compila sobre una `list`; `l.sort()` es merge
  sort empalmando nodos, $\Theta(n \log n)$.
- `deque` guarda bloques de tamaño fijo y un mapa de punteros: el elemento $i$
  está en el bloque $(\mathit{ini} + i) / B$, casilla
  $(\mathit{ini} + i) \bmod B$. `d[i]` y los cuatro extremos cuestan $O(1)$ e
  `insert` en $p$, $O(\min(p, n - p))$.
- En un `deque`, `push_front` y `push_back` invalidan los iteradores, porque
  el mapa pudo mudarse, pero no los punteros a los elementos.
- `stack` y `queue` son adaptadores sobre `deque` por defecto, con todas sus
  operaciones en $O(1)$. `queue<int, vector<int> >` no compila porque `vector`
  no trae `pop_front`.
- Se escoge por la operación que más se repite y, si dos sirven, por el
  contrato más estrecho.
- Con $n = 200\,000$ inserciones al frente, el `vector` tardó 1,2893 s, la
  `list` 0,0199 s y el `deque` 0,0016 s. Sumar una `list` por posición
  cuadruplica el tiempo al duplicar $n$; con un iterador es $\Theta(n)$.

## Ejercicios

### Los dos extremos

Escriban `bool palindromo(const char *s)` con un `deque<char>`: la palabra se
lee igual al derecho y al revés. ¿Qué se compara en cada vuelta y qué se saca?
¿Cuándo se detiene, con longitud par y con longitud impar? ¿Cuánto cuesta en
tiempo y en espacio aparte? ¿Serviría una `queue`?

De [palindromo.cpp](./codigo/palindromo.cpp):

```cpp
bool palindromo(const char *s) {
  deque<char> d;
  int i = 0;
  while (s[i] != '\0') {
    d.push_back(s[i]);
    i = i + 1;
  }
  bool iguales = true;
  while (iguales && d.size() >= 2) {
    if (d.front() == d.back()) {
      d.pop_front();
      d.pop_back();
    } else {
      iguales = false;
    }
  }
  return iguales;
}
```

Se comparan `front` y `back` y, si coinciden, se sacan los dos. Se detiene al
quedar cero o un carácter, o en el primer par distinto: `reconocer`, `radar`,
`a` y `abba` dan `si`; `lista` y `abca`, `no`. Cuesta $\Theta(n)$ en tiempo y
$\Theta(n)$ en espacio aparte, el `deque`. Una `queue` no sirve: no deja sacar
por el final.

### El máximo de cada ventana

Dado un arreglo $a[0..n-1]$ y $k \leq n$, imprimir el máximo de cada ventana de
$k$ casillas seguidas: $a[0..k-1]$, $a[1..k]$, y así hasta $a[n-k..n-1]$.

1. Con $a = \langle 4, 2, 12, 3, 8, 7, 1, 5 \rangle$ y $k = 3$, ¿qué se
   imprime?
2. Escriban la versión directa. ¿Cuánto cuesta?
3. Si $a[i] \leq a[j]$ con $i < j$, ¿puede $a[i]$ volver a ser el máximo de una
   ventana que contenga a $j$? ¿Qué se puede botar entonces?

De [ventana.cpp](./codigo/ventana.cpp), la versión directa:

```cpp
// Theta((n - k + 1) k): cada ventana se recorre entera
void maximosDirecto(int a[], int n, int k) {
  int j = k - 1;
  while (j < n) {
    int m = a[j - k + 1];
    int i = j - k + 2;
    while (i <= j) {
      if (a[i] > m) {
        m = a[i];
      }
      i = i + 1;
    }
    printf(" %d", m);
    j = j + 1;
  }
  printf("\n");
}
```

Imprime `12 12 12 8 8 7`. Hay $n - k + 1$ ventanas y cada una se recorre
entera: $\Theta((n - k + 1)\,k)$, que con $k = n/2$ es del orden de $n^2$.
Espacio aparte $\Theta(1)$.

La versión con `deque`:

```cpp
void maximosDeque(int a[], int n, int k) {
  deque<int> d;          // indices; valores decrecientes
  int j = 0;
  while (j < n) {
    while (!d.empty() && a[d.back()] <= a[j]) {
      d.pop_back();            // ya no puede ser maximo
    }
    d.push_back(j);
    if (d.front() <= j - k) {
      d.pop_front();           // salio de la ventana
    }
    if (j >= k - 1) {
      printf(" %d", a[d.front()]);
    }
    j = j + 1;
  }
  printf("\n");
}
```

!!! note "Lo que guarda el `deque`"

    Índices de la ventana actual, de izquierda a derecha, con valores que
    bajan: el del frente es el máximo de la ventana.

Paso a paso con $a = \langle 4, 2, 12, 3, 8, 7, 1, 5 \rangle$ y $k = 3$. La
columna `d` muestra cada índice con su valor, como `índice:valor`.

| `j` | $a[j]$ | Sale por el final | Sale por el frente | `d` al terminar | Imprime |
|---:|---:|---|---|---|---:|
| 0 | 4 | | | 0:4 | |
| 1 | 2 | | | 0:4, 1:2 | |
| 2 | 12 | 1:2, 0:4 | | 2:12 | 12 |
| 3 | 3 | | | 2:12, 3:3 | 12 |
| 4 | 8 | 3:3 | | 2:12, 4:8 | 12 |
| 5 | 7 | | 2:12 | 4:8, 5:7 | 8 |
| 6 | 1 | | | 4:8, 5:7, 6:1 | 8 |
| 7 | 5 | 6:1 | 4:8 | 5:7, 7:5 | 7 |

- En $j = 2$ el 12 bota al 2 y al 4: ninguno de los dos vuelve a ser máximo
  mientras el 12 siga en la ventana.
- En $j = 5$ el índice 2 ya quedó fuera de $a[3..5]$ y sale por el frente.

- La respuesta a la pregunta 3 es no: $a[j]$ le gana a $a[i]$ y se queda más
  tiempo en la ventana. Por eso el `while` bota del final a los que no superan
  a $a[j]$.
- Cada índice entra una vez con `push_back` y sale a lo sumo una vez:
  $\Theta(n)$ en total. Espacio aparte $O(k)$, el `deque`. La salida coincide
  con la directa.

## Para practicar en casa

### Propuesto 1: rotar

Escriba `rotar(d, k)`, que pasa los $k$ primeros elementos de un `deque` al
final, en el mismo orden. ¿Cuánto cuesta? ¿Y si fuera un `vector`?

Pista: cada paso es `push_back(front())` y `pop_front()`: $O(k)$. Con `vector`,
cada salida por el frente corre todo.

### Propuesto 2: intercalar

Dadas dos `list<int>` `a` y `b`, deje en `a` un elemento de cada una,
alternando, sin crear nodos nuevos. ¿Qué operación de la lista mueve un solo
nodo?

Pista: `splice` tiene una versión que recibe un iterador a un solo nodo de la
otra lista y lo mueve en $\Theta(1)$. Guarde el iterador al siguiente antes de
moverlo.

### Propuesto 3: una pila sobre `list`

Declare `stack<int, list<int> >` y repita los paréntesis balanceados. ¿Cambia
algún costo? ¿Cambia la memoria?

Pista: los costos asintóticos son los mismos; la memoria pasa de bloques a un
nodo con dos punteros por elemento.

### Propuesto 4: el historial con `vector`

Resuelva el primer programa del ejercicio de decidir con un `vector` y mida con
$10^5$ visitas. Compare con el `deque`.

Pista: tome el reloj antes y después, como en la medición de insertar al
frente, y duplique el número de visitas para ver cómo crece.

### Propuesto 5: ventana mínima

Cambie `maximosDeque` para que imprima el mínimo de cada ventana, y haga su
tabla paso a paso con el mismo arreglo.

Pista: solo cambia la comparación del `while`: ahora los valores del `deque`
suben, y el del frente es el mínimo.

## Ejercicios interactivos

Diez actividades que se trabajan en el navegador, ordenadas por los temas de la
sesión, en la [página de ejercicios interactivos](../../../actividades/estructuras-de-datos/contenedores-list-deque-stack-queue/index.md): un programa
con los TAD construidos a mano pasado a `deque`, `stack` y `queue`; un iterador
de `list` a través de `insert`, `erase`, `splice` y `sort`; dónde cae cada
elemento de un `deque` de bloques y cuándo crece el mapa; cuántos elementos
corre `insert` en un `deque` y en un `vector`; qué punteros e iteradores siguen
valiendo; qué va debajo de cada adaptador; seis programas nuevos para escoger
contenedor; y dos mediciones nuevas, vaciar por el frente e insertar en la
mitad, para predecir antes de ver las cifras. Los programas no son los de la
sesión: mismo tema, valores nuevos.

## Lo que sigue

Se terminan los contenedores con lo que falta de ellos y se abre la tabla de
direccionamiento directo: guardar cada elemento en la casilla que dice su
clave, para buscar en $O(1)$ sin recorrer.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

**`list`**

- [list_uso.cpp](./codigo/list_uso.cpp) — insertar y borrar con el iterador.
  Imprime ` 1 4 7`, ` 1 9 4 7`, `*it = 4`, `*it = 7`, `*it = 9`, ` 9` y
  `size: 1`.
- [list_splice_sort.cpp](./codigo/list_splice_sort.cpp) — `splice` y
  `l.sort()`. Imprime `a: 8 5 3 1 6`, `b:`, `*it = 1`, `a: 1 3 5 6 8` y
  `*it = 1`.
- [splice_direcciones.cpp](./codigo/splice_direcciones.cpp): la dirección de
  `b` y la del 4 antes y después del `splice`, que salen iguales; después
  `a: 1 4 5 2 3`, `b:` y `*cuatro = 4, it en el 4: 1`.
- [tamano_nodo.cpp](./codigo/tamano_nodo.cpp): el nodo de `list<int>`.
  Imprime `int 4, puntero 8`, `suma de los campos: 20`, `sizeof(Nodo): 24` y
  `40 nodos: 800 bytes por campos, 960 por sizeof`.

**`deque` y adaptadores**

- [deque_uso.cpp](./codigo/deque_uso.cpp) — los dos extremos y el índice.
  Imprime ` 3 1 4 7`, `d[2] = 4`, `front 3, back 7`, ` 1 4`, ` 1 9 4` y
  `size: 3`.
- [adaptadores.cpp](./codigo/adaptadores.cpp) — `stack` sobre `deque` y sobre
  `vector`, `queue` sobre `list`. Imprime `3 30 100` y `2 20 200`.

**Medir**

- [medir.cpp](./codigo/medir.cpp) — insertar al frente y sumar, con
  `clock()`; imprime las dos tablas de la sección «Medir».

**Ejercicios**

- [palindromo.cpp](./codigo/palindromo.cpp) con
  [palindromo.in](./codigo/palindromo.in) — `./palindromo < palindromo.in`
  marca `si` o `no` en cada palabra.
- [ventana.cpp](./codigo/ventana.cpp) — el máximo de cada ventana, directo y
  con `deque`; las dos imprimen ` 12 12 12 8 8 7`.

Las soluciones de los problemas de juez están en la sección «Para el juez», con
su entrada y su salida.

## Referencias

- cppreference.com. Containers library, con la complejidad de cada operación:
  <https://en.cppreference.com/w/cpp/container/list>,
  <https://en.cppreference.com/w/cpp/container/deque>,
  <https://en.cppreference.com/w/cpp/container/stack>,
  <https://en.cppreference.com/w/cpp/container/queue>,
  <https://en.cppreference.com/w/cpp/container/priority_queue>.
- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 10, estructuras de datos
  elementales: §10.1 arreglos, matrices, pilas y colas; §10.2 listas
  enlazadas.
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulos 6, listas enlazadas; 7, pilas; y 8, colas, incluida la cola doble.
