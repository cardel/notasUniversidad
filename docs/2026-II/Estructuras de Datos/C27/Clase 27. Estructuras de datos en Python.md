# Estructuras de Datos · Clase 27. Estructuras de datos en Python

Viernes 13 de noviembre de 2026, de 14:00 a 17:00.

Las estructuras del curso existen también en Python, con otros nombres y los
mismos costos. La `list` es el `vector`; `collections.deque` es la cola doble;
`dict` y `set` son tablas hash, como `unordered_map`; `heapq` es un montículo,
pero de mínimos. La lista enlazada y la pila se escriben con una clase `Nodo`,
igual que en C++, salvo que en Python no hay punteros ni `delete`: cada variable
ya es una referencia. Al final, la sesión repasa cómo elegir la estructura por
las operaciones que el problema repite.

Al terminar, el objetivo es poder dar para cada contenedor de Python su par en
C++ y el costo de cada operación; explicar por qué `append` cuesta $O(1)$
amortizado y `pop(0)` $\Theta(n)$; predecir el orden en que salen las claves de
un `dict`, de un `set` y de un `heapq`; escribir la pila y la lista enlazada con
una clase `Nodo`; y escoger la estructura de un problema a partir de las
operaciones que pide.

## Diapositivas

![](./clase27.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: heapsort y la cola de prioridad

Heapsort ordena en dos fases (CLRS, §6.3 y §6.4). Primero construye el
montículo de máximos bajando cada casilla con hijos, de
$\lfloor n/2 \rfloor - 1$ hasta la raíz, en $\Theta(n)$. Después, $n - 1$
veces, cambia la raíz con la última casilla del montículo y baja la nueva raíz:
$\Theta(n \log n)$ sin arreglo auxiliar. Con `4 9 2 7 5` la construcción deja
`9 7 2 4 5`, y la primera ronda deja `7 5 2 4 | 9`.

`priority_queue` es ese montículo de máximos sobre un `vector` (CLRS, §6.5):
`push` y `pop` cuestan $O(\log n)$ y `top`, $\Theta(1)$. Con `greater<int>`
como comparador, arriba queda el menor.

## list: el vector de Python

Python no declara tipos: `notas = [38, 45, 29]` y nada más. Una `list` es un
arreglo contiguo de referencias, con su tamaño y su capacidad al lado, y cada
casilla apunta a un objeto que vive en otra parte de la memoria. Por eso una
lista puede guardar cualquier tipo, y `notas[i]` cuesta $\Theta(1)$, como en el
`vector`.

En Python todo valor es un objeto, también los enteros y los booleanos.
`sys.getsizeof(8)` da 28 bytes en una máquina de 64 bits, contra los 4 de un
`int` de C++: el objeto lleva su tipo y su cuenta de referencias. A cambio, un
entero no se desborda; crece con su valor, y `(2**100)**2` se calcula exacto.
Cada casilla de la lista es una referencia de 8 bytes, y el objeto al que
apunta vive aparte. De ahí que Python gaste más memoria y tiempo que C++ en
las mismas operaciones, aunque los costos asintóticos sean los mismos.

### Cuando el arreglo se llena

Si queda casilla libre, `append` escribe ahí. Si no, pide un arreglo más grande
y puede tener que copiar todas las referencias: esa llamada cuesta $O(n)$.
CPython le da al arreglo nuevo un octavo más de lo que necesita, redondeado a
múltiplo de 4, de modo que las copias son cada vez más raras y $n$ llamadas a
`append` cuestan $O(n)$ en total: $O(1)$ amortizado (CLRS, §16.4).

La capacidad se puede medir. `sys.getsizeof` da los bytes de la lista, y cada
referencia ocupa 8:

```python
import sys

def capacidad(lista):
    vacia = sys.getsizeof([])
    return (sys.getsizeof(lista) - vacia) // 8

lista = []
anterior = -1
i = 0
while i < 20:
    c = capacidad(lista)
    if c != anterior:
        print("len", len(lista), "cap", c)
        anterior = c
    lista.append(i)
    i = i + 1
```

Con CPython 3.14 la salida es esta: en 20 llamadas el arreglo cambió 4 veces.

```text
len 0 cap 0
len 1 cap 4
len 5 cap 8
len 9 cap 16
len 17 cap 24
```

### Las operaciones del vector, en Python

| C++ (`vector<int> v`) | Python (`l = []`) |
|---|---|
| `v.push_back(x)` | `l.append(x)` |
| `v[i]`, `v[i] = x` | `l[i]`, `l[i] = x` |
| `v.back()`; `v.pop_back()` | `x = l.pop()` |
| `v.insert(v.begin() + i, x)` | `l.insert(i, x)` |
| `v.erase(v.begin() + i)` | `l.pop(i)` |
| `v.size()` | `len(l)` |
| `find(v.begin(), v.end(), x) != v.end()` | `x in l` |
| `sort(v.begin(), v.end())` | `l.sort()` |

`l.pop()` quita el último y además lo devuelve; en la STL son dos pasos.

```python
notas = [38, 45, 29]
notas.append(41)        # como push_back
print(notas, len(notas))
print(notas[2])         # como v[2]
notas[0] = 40
notas.insert(1, 33)     # corre lo que sigue
print(notas)
ultima = notas.pop()    # quita el ultimo
print(ultima, notas)
primera = notas.pop(0)  # corre todos
print(primera, notas)
print(45 in notas, 50 in notas)
```

```text
[38, 45, 29, 41] 4
29
[40, 33, 45, 29, 41]
41 [40, 33, 45, 29]
40 [33, 45, 29]
True False
```

### Lo que cuesta pop(0)

`l.pop()` quita la última casilla y no mueve nada: $\Theta(1)$. `l.pop(0)` corre
todas las demás una casilla a la izquierda: $n - 1$ movimientos, $\Theta(n)$.
Lo mismo pasa con `insert(0, x)` y con `erase(v.begin())` en el `vector`.

| Operación | Tiempo | Por qué |
|---|---|---|
| `l[i]`, `l[i] = x` | $\Theta(1)$ | la dirección de la casilla se calcula |
| `append(x)` | $O(1)$ amortizado | casi siempre cabe; al crecer copia todo |
| `pop()` | $\Theta(1)$ | quita la última, nada se corre |
| `insert(k, x)`, `pop(k)` | $O(n - k)$ | se corren las casillas de la derecha |
| `x in l` | $O(n)$ | compara de una en una |
| `len(l)` | $\Theta(1)$ | el tamaño está guardado |
| `l.sort()` | $O(n \log n)$ | ordenamiento por comparaciones |
| espacio de la estructura | $\Theta(n)$ | un arreglo de referencias con capacidad $\ge n$, más los objetos |
| espacio aparte | $O(1)$; hasta $O(n)$ en `sort` | las operaciones trabajan en el mismo arreglo |

## deque: colas y pilas

Una ventanilla atiende $n$ personas en orden de llegada. Con una `list`,
`append` al llegar y `pop(0)` al atender, cada atención corre lo que queda:
$(n - 1) + (n - 2) + \cdots + 0 = n(n - 1)/2$ movimientos, $\Theta(n^2)$. La
cola necesita sacar por la izquierda en $\Theta(1)$, y eso lo da
`collections.deque`, la cola doble de Python.

CPython guarda el `deque` en bloques de casillas enlazados en una lista doble.
Entrar o salir por un extremo toca solo el bloque de ese extremo, y cuando se
llena se enlaza uno nuevo: $\Theta(1)$ por la izquierda y por la derecha.

```python
from collections import deque

turnos = deque()
turnos.append("Ana")      # por la derecha
turnos.append("Luis")
turnos.append("Sara")
print(turnos[0], len(turnos))
atendido = turnos.popleft()
print("atiende a", atendido)
turnos.append("Juan")
turnos.appendleft("Eva")  # tiene cita
print(turnos)
```

```text
Ana 3
atiende a Ana
deque(['Eva', 'Luis', 'Sara', 'Juan'])
```

La versión con el `deque` de la STL está en
[uso_cola.cpp](./codigo/uso_cola.cpp): `push_back`, `push_front`, `pop_front`
y `front` hacen lo mismo que `append`, `appendleft`, `popleft` y `d[0]`.

### La pila: una list con la cima al final

`append` apila y `pop` desapila; las dos trabajan en el final de la lista y
cuestan $\Theta(1)$, amortizado al apilar. `acciones[-1]` es la última casilla,
el tope. Con la cima al principio, `insert(0, x)` y `pop(0)` harían la misma
pila a $\Theta(n)$ por operación.

```python
acciones = []
acciones.append("escribir")
acciones.append("borrar")
acciones.append("pegar")
print("tope:", acciones[-1])
while len(acciones) > 0:
    print("deshace", acciones.pop())
```

```text
tope: pegar
deshace pegar
deshace borrar
deshace escribir
```

| Operación | Tiempo | Por qué |
|---|---|---|
| `append`, `appendleft` | $\Theta(1)$ | toca el bloque del extremo |
| `pop`, `popleft` | $\Theta(1)$ | igual, por el otro lado |
| `d[0]`, `d[-1]` | $\Theta(1)$ | los extremos están a mano |
| `d[i]` en el medio | $O(n)$ | recorre bloques hasta llegar |
| `x in d` | $O(n)$ | compara de una en una |
| `len(d)` | $\Theta(1)$ | el tamaño está guardado |
| espacio | $\Theta(n)$ en bloques; $O(1)$ aparte por operación | |

Para acceder por posición en el medio conviene una `list`.

## dict y set: tablas hash

Con la entrada `sol mar sol luna mar sol`, el `map` de C++ de
[palabras.cpp](./codigo/palabras.cpp) imprime `luna 1`, `mar 2`, `sol 3`. La
versión con `dict`:

```python
import sys

veces = {}
for linea in sys.stdin:
    for pal in linea.split():
        if pal in veces:
            veces[pal] = veces[pal] + 1
        else:
            veces[pal] = 1
for clave in veces:          # orden de llegada
    print(clave, veces[clave])
print("--- en orden de clave")
for clave in sorted(veces):
    print(clave, veces[clave])
```

```text
sol 3
mar 2
luna 1
--- en orden de clave
luna 1
mar 2
sol 3
```

Las palabras salen en el orden en que llegaron. El `dict` es una tabla hash,
como `unordered_map`, y no un árbol como `map`. Para recorrer en orden de clave,
`sorted(veces)` copia las claves y las ordena en $\Theta(n \log n)$.

### El dict por dentro

La casilla sale del *hash* de la clave; con enteros pequeños, `hash(k)` es `k`.
Con 8 casillas, las claves 12, 7 y 17 caen en las casillas 4, 7 y 1. La casilla
no guarda la pareja: guarda el número de la entrada, y las entradas quedan en
otro arreglo en orden de llegada. Por eso el recorrido sale en ese orden.

Cuando dos claves caen en la misma casilla, CPython no encadena como la tabla
hash con encadenamiento, que cuelga una lista de cada casilla: prueba otra
casilla de la misma tabla según una secuencia fija, hasta encontrar la clave o
una casilla vacía. Es el direccionamiento abierto de CLRS, §11.4. Y cuando la
tabla se llena hasta dos tercios, CPython arma una más grande y reubica las
claves; igual que con `append`, el costo de crecer se reparte, e insertar cuesta
$O(1)$ en promedio.

```python
precios = {"pan": 1800, "leche": 4200}
precios["queso"] = 9500        # inserta
precios["pan"] = 2000          # ya estaba: cambia
print(precios)
print(precios["leche"], precios.get("cafe", 0))
print("queso" in precios, "cafe" in precios)
del precios["leche"]
print(precios, len(precios))
```

```text
{'pan': 2000, 'leche': 4200, 'queso': 9500}
4200 0
True False
{'pan': 2000, 'queso': 9500} 2
```

`precios["cafe"]` con una clave que no está lanza `KeyError`; el corchete de
`map` la habría creado con 0. `get` devuelve el valor por omisión sin insertar.

### La lista de asistencia

Con los códigos `42 17 88 17 5 63 42 30`, el `set` de C++ imprime
`5 17 30 42 63 88`. En Python:

```python
llegan = [42, 17, 88, 17, 5, 63, 42, 30]
vinieron = set()
for codigo in llegan:
    vinieron.add(codigo)
print(vinieron, len(vinieron))
print(17 in vinieron, 18 in vinieron)
vinieron.discard(17)
print(sorted(vinieron))
```

```text
{5, 42, 17, 88, 30, 63} 6
True False
[5, 30, 42, 63, 88]
```

Los repetidos no entran, y el orden es el de las casillas de la tabla: el `set`
de Python es una tabla hash sin valores, no un árbol. No tiene `lower_bound`; el
orden sale de `sorted`, en $\Theta(n \log n)$.

| Operación | Tiempo | Por qué |
|---|---|---|
| `d[k]`, `d[k] = v`, `del d[k]` | $O(1)$ en promedio | se calcula la casilla y se prueban pocas |
| `k in d`, `s.add(x)`, `x in s` | $O(1)$ en promedio | lo mismo |
| las anteriores, en el peor caso | $O(n)$ | todas las claves en la misma casilla |
| recorrer | $\Theta(n)$ | pasa por todas las entradas |
| `sorted(d)` | $\Theta(n \log n)$ | copia las claves y las ordena |
| espacio | $\Theta(n)$ entre casillas y entradas; `sorted` pide $\Theta(n)$ aparte | |

!!! warning "Las claves no cambian"

    Una `list` no puede ser clave de un `dict` ni elemento de un `set`: Python
    lanza `TypeError` con el aviso `unhashable type: 'list'`. Si la clave
    cambiara después de entrar, su hash ya no apuntaría a su casilla. Una tupla
    sí puede ser clave.

Un `set` también hace las operaciones de conjuntos. Con `a = {1, 2, 3, 4}` y
`b = {1, 2, 4, 5}`, la unión `a | b` es `{1, 2, 3, 4, 5}`, la intersección
`a & b` es `{1, 2, 4}` y la diferencia `a - b` es `{3}`. Con $n$ y $m$
elementos y cada búsqueda en $O(1)$ promedio, la unión recorre los dos,
$O(n + m)$; la intersección recorre el menor y busca en el otro,
$O(\min(n, m))$; la diferencia recorre `a`, $O(n)$.
`x in a` pregunta por un elemento, pero `a[0]` da error: un `set` no tiene
posiciones.

## heapq: el montículo de Python

`heapq` no es una clase: son funciones que trabajan sobre una `list`
cualquiera. La lista `h` es un montículo de mínimos si `h[k] <= h[2*k+1]` y
`h[k] <= h[2*k+2]` para toda $k$ con hijos, y el menor queda en `h[0]`.

| `priority_queue<int> pq` | `h = []` |
|---|---|
| `pq.push(x)` | `heapq.heappush(h, x)` |
| `pq.top()` | `h[0]` |
| `pq.top()`; `pq.pop()` | `x = heapq.heappop(h)` |

La diferencia que importa: `priority_queue` da el mayor y `heapq`, el menor.

```python
import heapq

h = []
for k in [30, 12, 45, 7, 21]:
    heapq.heappush(h, k)
    print(h)
print("menor:", h[0])
x = heapq.heappop(h)
print("sale", x, "queda", h)
```

```text
[30]
[12, 30]
[12, 30, 45]
[7, 12, 45, 30]
[7, 12, 45, 30, 21]
menor: 7
sale 7 queda [12, 21, 45, 30]
```

`heappush(h, 7)` pone el 7 en `h[3]`, la primera casilla libre. Su padre es
`h[1] = 30`, y como $7 < 30$ se intercambian; en `h[1]` su padre es
`h[0] = 12`, y otra vez $7 < 12$: el 7 llega a la raíz con dos intercambios, uno
por nivel. El 21 entra en `h[4]`, su padre es el 12 y no sube. `heappop` es el
espejo de `extraerMax`: sale el 7, el 21 pasa a la raíz y baja hacia el menor de
sus hijos, el 12; en `h[1]` su hijo es el 30, mayor, y se detiene.

### El mayor primero

Si $a > b$, entonces $-a < -b$: el menor de los negados es el mayor de los
originales. Se apila $-k$ y se lee `-m[0]`.

```python
m = []
for k in [30, 12, 45, 7, 21]:
    heapq.heappush(m, -k)
print("mayor:", -m[0])
```

```text
mayor: 45
```

!!! warning "Un error común"

    Apilar las claves sin negar y esperar el mayor en `h[0]`: ahí queda el
    menor.

### Pedidos con urgencia

Las tuplas se comparan campo por campo. Con `(urgencia negada, turno, nombre)`
sale primero la urgencia mayor y, entre iguales, el que llegó primero:

```python
pedidos = []
heapq.heappush(pedidos, (-2, 1, "cafe"))
heapq.heappush(pedidos, (-5, 2, "almuerzo"))
heapq.heappush(pedidos, (-5, 3, "postre"))
heapq.heappush(pedidos, (-1, 4, "agua"))
while len(pedidos) > 0:
    urgencia, turno, nombre = heapq.heappop(pedidos)
    print(-urgencia, turno, nombre)
```

```text
5 2 almuerzo
5 3 postre
2 1 cafe
1 4 agua
```

[pedidos.cpp](./codigo/pedidos.cpp) hace lo mismo con `priority_queue` y un
`operator<` en el `struct Pedido`, y su salida coincide línea por línea. En C++
el orden lo dice `operator<`; en Python, la tupla.

### De un arreglo cualquiera a montículo

`heapq.heapify` baja cada casilla con hijos, de `h[n // 2 - 1]` a `h[0]`: la
construcción de abajo arriba de heapsort, en $\Theta(n)$ (CLRS, §6.3). Con
`[9, 4, 7, 1, 8, 2]` deja `[1, 4, 2, 9, 8, 7]`.

| Operación | Tiempo | Por qué |
|---|---|---|
| `heappush(h, x)` | $O(\log n)$ | entra al final y sube por un camino |
| `heappop(h)` | $O(\log n)$ | la última pasa a la raíz y baja |
| `h[0]` | $\Theta(1)$ | el menor está en la raíz |
| `heapify(l)` | $\Theta(n)$ | baja cada casilla con hijos; casi todas están cerca de las hojas |
| $n$ veces `heappop` | $\Theta(n \log n)$ | heapsort con el menor primero |
| espacio | $\Theta(n)$ en la misma `list`; $O(1)$ aparte por operación | |

## Nodos en Python: la pila y la lista enlazada

En C++ un nodo guarda `Nodo *siguiente`, se crea con `new` y se libera con
`delete`. Python no tiene ninguna de las tres cosas, y no le hacen falta: toda
variable es ya una referencia, como lo era cada casilla de la `list`. El campo
`siguiente` guarda la referencia al otro nodo, `None` hace de `NULL`, y el
intérprete libera el nodo al que ya nadie apunta.

```python
class Nodo:
    def __init__(self, dato, siguiente):
        self.dato = dato
        self.siguiente = siguiente
```

`__init__` es el constructor y `self` es el objeto que se construye, como
`this`. Los campos se crean al asignarlos, y `Nodo(6, None)` hace lo que
`new Nodo` con sus dos asignaciones.

### La pila

```python
class Pila:
    def __init__(self):
        self.cima = None
        self.n = 0

    def apilar(self, e):
        nuevo = Nodo(e, self.cima)
        self.cima = nuevo
        self.n = self.n + 1

    # exige not vacia()
    def desapilar(self):
        assert not self.vacia()
        self.cima = self.cima.siguiente
        self.n = self.n - 1
```

`desapilar` solo mueve `cima`: el nodo viejo queda sin referencias y el
intérprete lo libera. En C++, [pila_nodos.h](./codigo/pila_nodos.h) lo guarda
en `muerto` y lo borra con `delete`. Apilar 8, 3 y 6 deja `cima → 6 → 3 → 8 →
None`; desapilar deja `cima → 3 → 8 → None`.

### La lista enlazada

`nodo_en(p)` camina $p$ nodos desde la cabeza; `insertar` y `eliminar` caminan
hasta el anterior y reenlazan:

```python
    # exige 0 <= p <= tamano()
    def insertar(self, p, e):
        assert 0 <= p and p <= self.n
        if p == 0:
            self.cabeza = Nodo(e, self.cabeza)
        else:
            anterior = self.nodo_en(p - 1)
            anterior.siguiente = Nodo(e, anterior.siguiente)
        self.n = self.n + 1

    # exige 0 <= p < tamano()
    def eliminar(self, p):
        assert 0 <= p and p < self.n
        if p == 0:
            self.cabeza = self.cabeza.siguiente
        else:
            anterior = self.nodo_en(p - 1)
            anterior.siguiente = anterior.siguiente.siguiente
        self.n = self.n - 1
```

En `insertar(1, 35)` sobre `20 50`, primero se crea el nodo del 35 apuntando a
lo que seguía del 20, el 50, y después el 20 pasa a apuntar al 35. El orden
importa: si el 20 apuntara primero al nuevo, se perdería la referencia al 50.

```python
p = Pila()
p.apilar(8)
p.apilar(3)
p.apilar(6)
print("tope:", p.tope(), " tamano:", p.tamano())
p.desapilar()
print("tope:", p.tope(), " tamano:", p.tamano())

lista = Lista()
lista.insertar(0, 20)
lista.insertar(1, 50)
lista.insertar(1, 35)
lista.insertar(0, 10)
lista.imprimir()
lista.eliminar(2)
lista.imprimir()
print("obtener(1):", lista.obtener(1))
```

```text
tope: 6  tamano: 3
tope: 3  tamano: 2
 10 20 35 50   n = 4
 10 20 50   n = 3
obtener(1): 20
```

| Operación | Tiempo | Por qué |
|---|---|---|
| `apilar`, `desapilar`, `tope` | $\Theta(1)$ | solo se toca la cima |
| `tamano`, `vacia` | $\Theta(1)$ | `n` está guardado |
| `nodo_en(p)` | $\Theta(p)$ | camina $p$ nodos desde la cabeza |
| `insertar(p, e)`, `eliminar(p)` | $O(p)$ | camina hasta el anterior y reenlaza en $\Theta(1)$ |
| `obtener(p)` | $O(p)$ | lo mismo que `nodo_en` |
| espacio | $\Theta(n)$, un nodo por elemento con su dato y una referencia; $O(1)$ aparte | |

Las cotas son las de la lista enlazada de CLRS, §10.2.

## Qué estructura elegir

Cada problema pide unas operaciones, y esas operaciones deciden la estructura.
Cajones numerados son acceso por posición: `list` o `vector`. Una pila de
platos saca el último que llegó. Una carpeta con pestañas busca por clave:
`dict` o `map`. Una banda transportadora saca el primero que llegó: `deque` o
`queue`. Una pirámide de naranjas deja arriba el mejor: `heapq` o
`priority_queue`.

Las preguntas, en el orden en que se hacen:

1. ¿Se busca por clave? Si además hace falta el orden de clave, `map` o `set`
   en C++, y en Python `dict` con `sorted`; si no, `unordered_map`, o `dict` y
   `set` en Python.
2. Si no se busca por clave: ¿sale siempre el mayor o el menor? Un montículo,
   `priority_queue` o `heapq`.
3. ¿Sale el último que entró? Una pila: `stack`, o una `list` con la cima al
   final.
4. ¿Se saca por el otro extremo? Una cola: `queue` o `deque`.
5. Si no, el acceso es por posición: `vector` o `list`.

| C++ | Python | Lo barato y su costo |
|---|---|---|
| `vector` | `list` | posición, $\Theta(1)$; el final, $O(1)$ amortizado |
| `deque`, `queue` | `deque` | los dos extremos, $\Theta(1)$ |
| `stack` | `list` | el final, $O(1)$ amortizado |
| `unordered_map` | `dict` | buscar por clave, $O(1)$ en promedio |
| `map`, `set` | `dict`, `set` y `sorted` | clave en orden; Python ordena aparte |
| `priority_queue` | `heapq` | mayor en C++, menor en Python, $O(\log n)$ |
| lista sobre nodos | clase `Nodo` | insertar tras un nodo dado, $\Theta(1)$ |

La biblioteca estándar de Python no trae un árbol binario de búsqueda
balanceado: el orden de clave sale de `sorted`.

La elección cambia el orden del costo, no una constante. Buscar en un arreglo
ordenado con búsqueda binaria cuesta $O(\log n)$ y recorriéndolo, $O(n)$. En
los grafos, que vienen después, el camino más corto de Dijkstra cuesta
$O(V^2)$ si el siguiente vértice se busca en una lista y
$O((V + E) \log V)$ con una cola de prioridad.

### El botón atrás

Un navegador guarda las páginas visitadas; *atrás* vuelve a la última, y abrir
una página nueva la agrega. Se saca la última que entró: una pila, una `list`
con `append` al abrir y `pop()` al ir atrás, las dos en $\Theta(1)$, la primera
amortizada. Si además se quiere saber al instante si una página ya se visitó,
`x in l` es $O(n)$, y se agrega un `set` al lado, con `in` en $O(1)$ promedio.

### La votación

Un millón de votos, cada uno con el nombre de un candidato, y al cerrar cada
candidato con sus votos en orden alfabético. Se busca por clave y se suma: un
`dict` de candidato a votos, $O(1)$ en promedio por voto, $O(n)$ para los $n$
votos. Al cerrar, `sorted` sobre los $c$ candidatos: $\Theta(c \log c)$. En
total, $O(n + c \log c)$. En C++, un `map<string, int>` ya entrega el orden,
pero cada voto cuesta $O(\log c)$: $O(n \log c)$ en total.

## Para practicar en casa

### Propuesto 1: la cola con dos pilas

Implementen una cola con dos `list` usadas como pilas, sin `pop(0)`. Una pila
recibe y la otra entrega; cuando la que entrega está vacía, se pasan todos de
la una a la otra. Cada persona se mueve una sola vez: $\Theta(n)$ en total,
$O(1)$ amortizado por operación.

### Propuesto 2: los k menores

Dada una `list` de $n$ números, impriman los $k$ menores en orden con
`heapify` y `heappop`. `heapify` cuesta $\Theta(n)$ y cada `heappop`,
$O(\log n)$: $O(n + k \log n)$.

### Propuesto 3: la cola sobre nodos

Escriban en Python la cola de la implementación enlazada, con `frente` y
`final`, y comparen su costo con el de `deque`. `encolar` enlaza después de
`final` y `desencolar` mueve `frente`: las dos en $\Theta(1)$.

## Lo que se vio

- `list` es el `vector`: un arreglo de referencias que crece solo, con acceso y
  `append` baratos y `pop(0)` en $\Theta(n)$. Como pila, con la cima al final.
- `deque` da los dos extremos en $\Theta(1)$: es la cola.
- `dict` y `set` son tablas hash: $O(1)$ en promedio, sin orden de clave; el
  `dict` recorre en orden de llegada, y el orden de clave sale de `sorted`.
- `heapq` es un montículo de mínimos sobre una `list`; para el mayor se niegan
  las claves, y con tuplas manda el primer campo.
- Los nodos se enlazan con referencias, `None` hace de `NULL` y el intérprete
  libera el nodo que nadie referencia.

## Ejercicios interactivos

Las actividades para trabajar en el navegador, ordenadas por los temas de la
sesión, están en [Ejercicios interactivos](./Ejercicios.md). Los programas y los
valores no son los de la sesión: mismo tema, ronda nueva.

## Código de la sesión

Ejecución:

```bash
python3 archivo.py
python3 frecuencias.py < palabras.in
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [capacidad.py](./codigo/capacidad.py): la capacidad de una lista mientras
  crece, con [salida](./codigo/capacidad.out).
- [uso_list.py](./codigo/uso_list.py), con [salida](./codigo/uso_list.out), y
  su par [uso_vector.cpp](./codigo/uso_vector.cpp), con
  [salida](./codigo/uso_vector.out).
- [uso_deque.py](./codigo/uso_deque.py): la cola de turnos y la pila de
  acciones, con [salida](./codigo/uso_deque.out); el par en C++ es
  [uso_cola.cpp](./codigo/uso_cola.cpp), con [salida](./codigo/uso_cola.out).
- [frecuencias.py](./codigo/frecuencias.py), con
  [salida](./codigo/frecuencias.out), y [palabras.cpp](./codigo/palabras.cpp),
  con [salida](./codigo/palabras.out); los dos leen
  [palabras.in](./codigo/palabras.in).
- [uso_dict_set.py](./codigo/uso_dict_set.py): `dict` y `set`, con
  [salida](./codigo/uso_dict_set.out); el `set` de C++ de la lista de
  asistencia es [uso_set.cpp](./codigo/uso_set.cpp), con
  [salida](./codigo/uso_set.out).
- [uso_heapq.py](./codigo/uso_heapq.py), con [salida](./codigo/uso_heapq.out),
  y [pedidos.cpp](./codigo/pedidos.cpp), con [salida](./codigo/pedidos.out).
- [pila_nodos.py](./codigo/pila_nodos.py) y
  [lista_nodos.py](./codigo/lista_nodos.py): la pila y la lista sobre nodos;
  [uso_nodos.py](./codigo/uso_nodos.py) las usa, con
  [salida](./codigo/uso_nodos.out). En C++,
  [pila_nodos.h](./codigo/pila_nodos.h) y
  [uso_pila_nodos.cpp](./codigo/uso_pila_nodos.cpp), con
  [salida](./codigo/uso_pila_nodos.out).

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 6: §6.3 a §6.5. Capítulo 10:
  §10.1, pilas y colas; §10.2, listas enlazadas. Capítulo 11, tablas hash:
  §11.4, direccionamiento abierto. Capítulo 12, árboles binarios de búsqueda.
  Capítulo 16: §16.4, tablas dinámicas.
- Python. *Data Structures*, sección 5 del tutorial:
  <https://docs.python.org/3/tutorial/datastructures.html>.
- Python. *collections*: <https://docs.python.org/3/library/collections.html>.
- Python. *heapq*: <https://docs.python.org/3/library/heapq.html>.
- Python. *Time complexity of operations on built-in types*:
  <https://docs.python.org/3/builtins/time-complexity.html>. La página
  TimeComplexity de la wiki, <https://wiki.python.org/moin/TimeComplexity>,
  remite ahí.
- Python. *Design and History FAQ*, sobre cómo están hechas la `list` y el
  `dict` en CPython: <https://docs.python.org/3/faq/design.html>.
