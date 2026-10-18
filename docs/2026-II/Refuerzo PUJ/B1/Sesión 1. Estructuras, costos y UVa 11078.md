# Estructuras, costos y UVa 11078 · Refuerzo PUJ B1

La sesión empezó por lo que trae un archivo de entrada y cómo se lee, y siguió
con lo que cuesta cada operación sobre las estructuras de la biblioteca
estándar. Cada estructura se abrió por dentro: dónde quedan sus elementos en
memoria, qué guarda un puntero o un iterador y qué operación paga el precio
oculto. Varias cosas se comprobaron compilando en vivo: el vector que se muda
de bloque, la aritmética de punteros, la matriz de Python con filas repetidas,
la lista enlazada recorrida por índice y la pila de llamadas de un factorial
vista en `gdb`. La segunda parte cambió dos ciclos anidados por un recorrido
que arrastra el máximo, y con esa idea se resolvió UVa 11078 en C++ hasta
dejarlo listo para enviar.

Al terminar la sesión se espera poder:

- Leer una entrada por palabras en Python y en C++, sin depender de cómo
  vienen partidas las líneas.
- Dar el costo de leer, escribir, buscar y recorrer en cada estructura, y
  escoger la que hace barata la operación que se repite.
- Explicar por qué un `vector` que crece invalida sus iteradores y por qué
  recorrer una lista enlazada por índice cuesta $\Theta(n^2)$.
- Calcular a mano los índices de los hijos y del padre en un montículo
  guardado en arreglo, e insertar y extraer en él.
- Reconocer dos ciclos anidados donde el de adentro vuelve sobre lo que ya
  recorrió el de afuera, y reemplazarlos por un recorrido.
- Resolver UVa 11078 en $\Theta(n)$ por caso, con la respuesta negativa bien
  inicializada.

## Diapositivas y tablero

[programacion-anotada.pdf](./programacion-anotada.pdf){ target=_blank rel=noopener },
135 páginas: las 132 del deck de programación del bloque con lo escrito encima
durante la sesión, y tres hojas de tablero insertadas. La página 25 tiene el
factorial con el árbol de llamadas y la pila de marcos dibujada sobre `main`;
la 26, la salida de `backtrace` en `gdb`; la 38, la inserción del 11 y la
extracción del tope en el montículo. Lo escrito a mano está sobre todo entre
las páginas 11 y 55: el borrado que corre elementos, las direcciones de un
arreglo de 4 en 4 bytes, el índice dentro del `deque`, la tabla hash con su
factor de carga y la traza del máximo de atrás.

La grabación de la sesión, partida en videos cortos por tema, está en la
[lista de reproducción del refuerzo](https://www.youtube.com/playlist?list=PLKsjj1jEesqU){ target=_blank rel=noopener }.

## Código de la sesión

Los programas, limpios y probados, están en
[codigo/sesion1](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/Refuerzo%20PUJ/B1/codigo/sesion1):

| Archivo | Qué muestra |
|---|---|
| `punteros.cpp` | `a[i]` es `*(a + i)` y las direcciones avanzan de `sizeof(int)` en `sizeof(int)` |
| `iteradores_vector.cpp` | el `vector` que se queda sin capacidad se muda y deja colgando lo que apuntaba al bloque viejo |
| `matriz_referencias.py` | `[[0] * m] * n` repite la misma fila $n$ veces |
| `lista_por_indice.cpp` | sumar una lista enlazada por índice contra seguir los `next` |
| `factorial.cpp` | la pila de llamadas, para mirarla en `gdb` |
| `uva11078.cpp`, `uva11078.py` | UVa 11078 en un recorrido |
| `uva11078.in` | la muestra del enunciado |

Todos se compilan con

```bash
g++ -std=c++17 -Wall -Wextra -g -o programa programa.cpp
```

`-Wall -Wextra` avisa de variables sin inicializar, de formatos de `printf`
que no casan con el argumento y de otros errores que de otro modo aparecen
como un fallo en el juez. `-g` deja la información que necesita el depurador.
La entrada llega desde un archivo con `<`, la salida va a otro con `>`, y
`diff` compara la salida con la esperada:

```bash
./uva11078 < uva11078.in > salida.txt
diff salida.txt esperado.txt
```

Si `diff` no imprime nada, las dos coinciden.

## Lo que trae la entrada

Dos archivos con los mismos números, partidos distinto:

| Archivo A | Archivo B |
|---|---|
| `5` | `5` |
| `3 -1 4 1 5` | `3 -1` |
| | `4 1` |
| | `5` |

Un programa que lee la segunda línea con `input().split()` funciona con A y
se queda con `3 -1` en B. Lo que no depende de las líneas es leer por
palabras:

- En Python, `datos = sys.stdin.read().split()` trae toda la entrada partida
  en espacios y saltos de línea por igual, y un índice `pos` avanza sobre esa
  lista.
- En C++, `scanf("%d", &x)` salta todo el espacio en blanco antes del número,
  saltos de línea incluidos.

`scanf` recibe la dirección de cada variable, `&a` y `&b`: C pasa por valor
esa dirección, y con ella `scanf` escribe en la variable. Devuelve cuántos
valores leyó, y al llegar al final del archivo devuelve `EOF`. Por eso la
lectura de pares hasta que se acabe la entrada es

```cpp
int a, b;
while (scanf("%d %d", &a, &b) == 2) {
  printf("%d\n", a + b);
}
```

La entrada y la salida de C++ se escriben con `scanf` y `printf`. `cin` y
`cout`, con la configuración por defecto, se mantienen sincronizados
con la entrada estándar de C y suelen ser más lentos, lo que en un archivo de
cientos de miles de números se nota frente al límite de tiempo.

## Lo que cuesta cada operación

| Operación | Python (`list`) | C++ (`vector`) | Costo |
|---|---|---|---|
| Acceder por posición | `a[i]` | `a[i]` | $O(1)$ |
| Tamaño | `len(a)` | `a.size()` | $O(1)$ |
| Agregar al final | `a.append(x)` | `a.push_back(x)` | $O(1)$ amortizado |
| Quitar el último | `a.pop()` | `a.pop_back()` | $O(1)$ |
| Insertar en $p$ | `a.insert(p, x)` | `a.insert(a.begin() + p, x)` | $O(n - p)$ |
| Borrar en $p$ | `del a[p]` | `a.erase(a.begin() + p)` | $O(n - p)$ |
| Buscar un valor | `x in a` | recorrido con `for` | $O(n)$ |
| Máximo | `max(a)` | recorrido con `for` | $O(n)$ |

Insertar o borrar en la posición $p$ cuesta $O(n - p)$ porque los elementos
de la derecha se corren. Borrar el 2 de $[1, 2, 3, 4]$ deja un hueco en la
casilla 1, y el 3 y el 4 pasan una casilla a la izquierda: queda $[1, 3, 4]$.
Borrar el primero corre a todos.

`x in a`, `max(a)` y `a.insert(0, x)` caben en una línea y recorren la lista
entera. Dentro de un ciclo de $n$ vueltas, el programa cuesta $O(n^2)$. La
`list` de Python es un arreglo, no una lista enlazada.

## Las estructuras y cómo están hechas

| Estructura | C++ | Python | Cómo está hecha |
|---|---|---|---|
| Arreglo dinámico | `vector` | `list` | un bloque contiguo que se muda cuando se llena |
| Lista enlazada | `list` | | nodos con punteros al siguiente y al anterior |
| Doble extremo | `deque` | `collections.deque` | un mapa de bloques de tamaño fijo |
| Pila | `stack` | `list` | un arreglo o un `deque`, usado solo por el tope |
| Cola | `queue` | `collections.deque` | un `deque`, usado por los dos extremos |
| Tabla hash | `unordered_map`, `unordered_set` | `dict`, `set` | un arreglo de casillas y una función hash |
| Árbol balanceado | `map`, `set` | | un árbol rojo-negro |
| Montículo | `priority_queue` | `heapq` | un árbol binario completo guardado en un arreglo |

### Punteros, iteradores y memoria

Un puntero guarda una dirección. Un iterador generaliza esa idea a cualquier
contenedor: `begin()` apunta al primer elemento, `end()` a la casilla que
sigue al último, `++` avanza uno y `--` retrocede uno. En un `vector`,
`it + k` salta $k$ casillas en $O(1)$; en una `list` el iterador solo avanza
o retrocede de a un nodo.

Cada programa usa tres zonas de memoria. Las variables locales y los
parámetros viven en la pila de llamadas, que es pequeña. Los elementos de los
contenedores van en el heap, que es donde caben los vectores grandes. Las
variables globales tienen su propia zona, que existe durante todo el
programa.

### Arreglo dinámico: `vector` y `list`

Un `vector` guarda tres datos: el puntero al bloque, el tamaño y la
capacidad. Acceder a `a[i]` es calcular `a + i`, una suma, y por eso cuesta
$O(1)$. Esa suma cuenta casillas, no bytes: si el bloque empieza en la
dirección 180 y cada `int` ocupa 4 bytes, la casilla 0 está en 180 y la 1 en
184. El salto lo decide el tipo del elemento, no el tamaño del arreglo.

```cpp
int arreglo[100];
for (int i = 0; i < 100; i++) {
  arreglo[i] = 10 * i;
}
for (int k = 0; k < 4; k++) {
  printf("arreglo + %d esta en %p y guarda %d (arreglo[%d] = %d)\n", k,
         (void *)(arreglo + k), *(arreglo + k), k, arreglo[k]);
}
```

En una corrida de `punteros.cpp`:

```text
sizeof(int) = 4 bytes
arreglo + 0 esta en 0x7ffebd3f8300 y guarda 0 (arreglo[0] = 0)
arreglo + 1 esta en 0x7ffebd3f8304 y guarda 10 (arreglo[1] = 10)
arreglo + 2 esta en 0x7ffebd3f8308 y guarda 20 (arreglo[2] = 20)
arreglo + 3 esta en 0x7ffebd3f830c y guarda 30 (arreglo[3] = 30)
```

Las direcciones cambian de una corrida a otra; la distancia de 4 bytes entre
casillas, no. Escribir `*(arreglo + k)` en lugar de `arreglo[k]` no aporta
nada en un programa, pero muestra qué hace el corchete.

Cuando el tamaño alcanza la capacidad, el siguiente `push_back` pide un
bloque más grande, copia los elementos y libera el viejo. Esa mudanza cuesta
$O(n)$; como la capacidad crece por un factor constante (GCC la duplica), las
mudanzas son pocas y `push_back` cuesta $O(1)$ amortizado. Si se sabe cuántos
elementos van a llegar, `a.reserve(n)` pide el bloque de una vez, sin
inicializar nada, y el vector no se muda en el camino.

La mudanza tiene otra consecuencia: todo puntero o iterador al bloque viejo
queda colgando. `iteradores_vector.cpp` guarda la dirección del primer
elemento, borra uno y agrega dos:

```cpp
vector<int> cosita = {1, 2, 3, 4};
vector<int>::iterator it = cosita.begin();
const int *antes = &*it;

cosita.erase(cosita.begin() + 2); // queda 1, 2, 4
cosita.push_back(20);
cosita.push_back(10); // el quinto elemento no cabe en la capacidad 4

if (antes == cosita.data()) {
  printf("el bloque es el mismo\n");
} else {
  printf("el vector se mudo: it y antes apuntan al bloque viejo\n");
}
```

```text
inicio:      tamano 4, capacidad 4, datos en 0x5578df139020
tras erase:  tamano 3, capacidad 4, datos en 0x5578df139020
tras 2 push: tamano 5, capacidad 8, datos en 0x5578df13a050
el vector se mudo: it y antes apuntan al bloque viejo
```

Con el `erase` y el primer `push_back` el bloque sigue siendo el mismo. El
segundo `push_back` necesita una quinta casilla, el vector pasa a capacidad 8
en otra dirección, y desde ahí leer `*it` o `*antes` es comportamiento
indefinido: se toca memoria que ya se devolvió. Después de insertar en un
vector, los iteradores anteriores no se usan.

La `list` de Python también es un arreglo dinámico, pero de referencias: cada
casilla apunta a un objeto. De ahí la trampa de la matriz.

```python
compartida = [[0] * m] * n
separadas = [[0] * m for _ in range(n)]
compartida[0][0] = 1
separadas[0][0] = 1
```

Con $n = 3$ y $m = 4$, `matriz_referencias.py` imprime

```text
compartida tras compartida[0][0] = 1:
[1, 0, 0, 0]
[1, 0, 0, 0]
[1, 0, 0, 0]
separadas tras separadas[0][0] = 1:
[1, 0, 0, 0]
[0, 0, 0, 0]
[0, 0, 0, 0]
misma fila en compartida: True
misma fila en separadas: False
```

`* n` copia $n$ veces la referencia a una sola fila, así que cambiar una
casilla las cambia todas. La comprensión crea una fila nueva en cada vuelta.

### Lista enlazada: `list` de C++

Cada nodo guarda el dato y un puntero al siguiente; la `list` de C++ es
doblemente enlazada y guarda también un puntero al anterior. Con un iterador
puesto en una posición, insertar o borrar ahí cuesta $O(1)$: se crea el nodo
y se cambian dos o cuatro punteros, sin correr a nadie. El precio está en la
memoria y en el acceso. Cada `insert` hace un `new`, y en una máquina de 64
bits cada nodo de `list` carga 16 bytes de punteros además del `int` de 4,
más lo que agregue el asignador; una lista simple carga 8.

No hay `a[i]` en una `list`. Para llegar a la posición $i$ hay que salir de
la cabeza y avanzar $i$ nodos, y un `for` que pide cada posición vuelve a la
cabeza en cada vuelta: $0 + 1 + \cdots + (n-1) = n(n-1)/2$ pasos,
$\Theta(n^2)$. `lista_por_indice.cpp` escribe la lista a mano y suma sus
$n = 10\,000$ elementos de las dos formas.

```cpp
// Vuelve a la cabeza y avanza i nodos: Theta(i).
int get(int i) {
  Nodo *actual = head;
  for (int j = 0; j < i; j++) {
    actual = actual->next;
  }
  return actual->dato;
}
```

```cpp
for (int i = 0; i < n; i++) {    // por índice: Theta(n^2)
  suma += lst.get(i);
}

Nodo *actual = lst.head;          // por iterador: Theta(n)
while (actual != nullptr) {
  suma += actual->dato;
  actual = actual->next;
}
```

En tres corridas sin optimizar en un Ryzen 7 7435HS, por índice tardó entre
0,10 y 0,11 segundos y por iterador entre 19 y 28 microsegundos, miles de
veces menos. Las dos sumas dan 49 995 000. El archivo libera los nodos en
el destructor de `Lista`.

### Doble extremo: `deque`

Un `deque` es un arreglo de punteros, el mapa, a bloques de tamaño fijo.
Insertar por cualquiera de los dos extremos escribe en la casilla libre del
bloque de la punta, y cuando ese bloque se llena se pide otro sin copiar los
demás. En libstdc++, la biblioteca de GCC, cada bloque ocupa 512 bytes; en el
`collections.deque` de Python, 64 elementos.

En el tablero el bloque es de $B = 4$ casillas y el frente está en la
casilla 2 del bloque 0, así que $\mathit{ini} = 2$. La posición $s$ del
`deque` cae en

$$
\text{bloque} = \left\lfloor \frac{\mathit{ini} + s}{B} \right\rfloor,
\qquad
\text{casilla} = (\mathit{ini} + s) \bmod B .
$$

| Bloque | Casilla 0 | Casilla 1 | Casilla 2 | Casilla 3 |
|---|---|---|---|---|
| 0 | | | $3$ ($s = 0$) | $1$ ($s = 1$) |
| 1 | $4$ ($s = 2$) | $1$ ($s = 3$) | $5$ ($s = 4$) | $9$ ($s = 5$) |
| 2 | $2$ ($s = 6$) | $6$ ($s = 7$) | | |

Para $s = 5$: $(2 + 5) / 4 = 1$ y $7 \bmod 4 = 3$, la casilla 3 del bloque 1,
que guarda el 9. Una división y un módulo: `d[s]` es $O(1)$ en C++. El
iterador del `deque` guarda el bloque y la casilla. El `deque` de Python no
calcula así: `d[i]` es $O(1)$ cerca de los extremos y $O(n)$ en la mitad, y
para leer por posición se usa `list`.

### Pila: `stack` y la `list` de Python

El último que entra es el primero que sale. `std::stack` usa por defecto un
`deque` por debajo, y se le puede pedir un `vector`; en Python la pila es una
`list` con `append`, `pop` y `a[-1]`, todos $O(1)$. `top` y `pop` sobre una
pila vacía son comportamiento indefinido en C++, así que antes se pregunta
`empty()`.

La pila de llamadas es una pila implícita. Cada llamada a una función empuja
un marco con sus parámetros y sus variables locales, y al terminar lo saca.

```cpp
long factorial(int n) {
  long resultado;
  if (n == 0) {
    resultado = 1;
  } else {
    resultado = n * factorial(n - 1);
  }
  return resultado;
}
```

`factorial(5)` llama a `factorial(4)`, que llama a `factorial(3)`, y así
hasta `factorial(0)`, que devuelve 1 sin llamar a nadie. En ese momento hay
seis marcos de `factorial` sobre el de `main`. Después se resuelven en orden
inverso: $1 \cdot 1$, $2 \cdot 1$, $3 \cdot 2$, $4 \cdot 6$ y $5 \cdot 24 =
120$.

| Marco | `n` | Espera | Devuelve |
|---|---|---|---|
| `factorial(0)` | 0 | | 1 |
| `factorial(1)` | 1 | `factorial(0)` | 1 |
| `factorial(2)` | 2 | `factorial(1)` | 2 |
| `factorial(3)` | 3 | `factorial(2)` | 6 |
| `factorial(4)` | 4 | `factorial(3)` | 24 |
| `factorial(5)` | 5 | `factorial(4)` | 120 |
| `main` | | `factorial(5)` | |

Para verlo en el depurador se compila con `-g`, se pone un punto de
interrupción en la línea del caso base y se pide la pila con `backtrace`:

```text
$ g++ -std=c++17 -Wall -Wextra -g -o factorial factorial.cpp
$ gdb ./factorial
(gdb) break 8
(gdb) run
Breakpoint 1, factorial (n=0) at factorial.cpp:8
(gdb) backtrace
#0  factorial (n=0) at factorial.cpp:8
#1  0x0000555555555168 in factorial (n=1) at factorial.cpp:10
#2  0x0000555555555168 in factorial (n=2) at factorial.cpp:10
#3  0x0000555555555168 in factorial (n=3) at factorial.cpp:10
#4  0x0000555555555168 in factorial (n=4) at factorial.cpp:10
#5  0x0000555555555168 in factorial (n=5) at factorial.cpp:10
#6  0x0000555555555193 in main () at factorial.cpp:17
```

Cada marco tiene su propio `n`. Con `next` se avanza línea a línea y los
marcos desaparecen a medida que cada llamada devuelve su valor.

Esa pila tiene un tamaño fijo, típicamente 8 MB en Linux, y una recursión de
un millón de niveles suele desbordarla. Lo que se pasa por valor se copia en
cada marco: un `vector` pasado por valor a una función recursiva se copia
entero en cada llamada, y se pasa por referencia para no copiarlo. Python
corta antes, con un límite de 1000 niveles por defecto que se consulta con
`sys.getrecursionlimit()`.

### Cola: `queue` y `collections.deque`

El primero que entra es el primero que sale. `std::queue` envuelve un
`deque`: `push` agrega al final y `pop` quita del frente. En Python la cola es
`collections.deque` con `append` y `popleft`. Las dos operaciones son $O(1)$,
porque el frente avanza sin correr a los demás. `a.pop(0)` sobre una `list`
corre todos los elementos una casilla, $O(n)$, y una cola de $n$ elementos
atendida así cuesta $O(n^2)$.

### Direccionamiento directo y tabla hash

Si las claves posibles son pocas, como las 26 letras, un arreglo de $U$
casillas indexado por la clave responde todo en $O(1)$: el direccionamiento
directo. Cuando las claves posibles son muchas más que las que llegan, la
tabla hash usa $m$ casillas y una función $h$ que lleva cada clave a una de
ellas.

En el tablero, $m = 5$ y $h(k) = k \bmod 5$, con las claves 15, 12, 7, 22 y
4:

| Casilla | Claves |
|---|---|
| 0 | $15$ |
| 1 | |
| 2 | $12 \to 7 \to 22$ |
| 3 | |
| 4 | $4$ |

12, 7 y 22 chocan en la casilla 2: es una colisión, y con encadenamiento cada
casilla guarda una lista con las claves que caen ahí. El factor de carga es
$\alpha = n/m$, el largo promedio de esas listas. Si la función reparte las
claves de manera uniforme e independiente, buscar cuesta $\Theta(1 + \alpha)$
en promedio: el 1 por calcular $h(k)$ y $\alpha$ por recorrer la lista (CLRS,
3.ª ed., sección 11.2). La tabla crece cuando $\alpha$ pasa de un umbral, de
modo que $\alpha$ se mantiene acotado y la búsqueda queda en $O(1)$ en
promedio.

`unordered_map` encadena, con un nodo por par. El `dict` de Python no usa
listas: si la casilla está ocupada, busca otra libre. Un `set` es una tabla
de claves sin valor, y por eso no guarda repetidos. Dos cuidados: cuando la
tabla crece, los iteradores de C++ dejan de valer, y en Python modificar un
`dict` mientras se recorre lanza `RuntimeError`. El orden en que se recorre
una tabla hash de C++ no tiene relación con el orden de las claves.

### Árbol balanceado: `map` y `set`

En un árbol binario de búsqueda, lo menor que un nodo va a su izquierda y lo
mayor a su derecha; `map` y `set` no admiten claves repetidas. Buscar,
insertar y borrar cuestan $O(h)$, con $h$ la altura. Si las claves llegan
ordenadas, como 1, 2, 3, 4, 5, cada nodo cuelga a la derecha del anterior, el
árbol es una cadena de altura $n$ y todo cuesta $O(n)$: una lista enlazada es
el caso del árbol en que cada nodo tiene a lo sumo un hijo.

`map` y `set` de C++ son árboles rojo-negro: la raíz es negra, un nodo rojo no
tiene hijos rojos y todos los caminos de un nodo a sus hojas pasan por la
misma cantidad de nodos negros. Al insertar o borrar, rotaciones y cambios de
color restauran esas propiedades, y con ellas la altura queda en
$O(\log n)$. El árbol del tablero, con raíz 8, hijos 4 y 12 y hojas 2, 6, 10
y 14, tiene altura 2 con siete nodos.

### Montículo: `priority_queue` y `heapq`

Un montículo máximo es un árbol binario completo, con todos los niveles
llenos salvo quizá el último, que se llena de izquierda a derecha, y en el
que cada padre es mayor o igual que sus hijos. Por la forma, se guarda en un
arreglo por niveles, sin punteros. Con la raíz en la posición 0:

$$
\mathrm{hiz}(i) = 2i + 1, \qquad
\mathrm{hder}(i) = 2i + 2, \qquad
P(i) = \left\lfloor \frac{i - 1}{2} \right\rfloor = \left\lceil \frac{i}{2}
\right\rceil - 1 .
$$

| Posición | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Valor | 9 | 7 | 8 | 3 | 5 | 6 |

$\mathrm{hiz}(0) = 1$ y $\mathrm{hder}(0) = 2$: el 7 y el 8 son hijos del 9.
$\mathrm{hiz}(2) = 5$, el 6. $P(2) = 0$ y $P(4) = 1$: el 5 es hijo del 7.

#### Insertar el 11

Entra en la primera casilla libre, la 6, como hijo
derecho del 8, y sube mientras sea mayor que su padre.

| Paso | Arreglo | Compara |
|---|---|---|
| Entra en la posición 6 | $9, 7, 8, 3, 5, 6, \mathbf{11}$ | $11 > 8 = P(6)$, sube |
| Pasa a la posición 2 | $9, 7, \mathbf{11}, 3, 5, 6, 8$ | $11 > 9 = P(2)$, sube |
| Llega a la raíz | $\mathbf{11}, 7, 9, 3, 5, 6, 8$ | |

#### Extraer el tope

Se parte del montículo original $9, 7, 8, 3, 5, 6$. El 9 sale, el
último, 6, pasa a la raíz y baja intercambiándose con el mayor de sus hijos
mientras alguno lo supere.

| Paso | Arreglo | Compara |
|---|---|---|
| El 6 pasa a la raíz | $\mathbf{6}, 7, 8, 3, 5$ | hijos 7 y 8, el mayor es 8 |
| Baja a la posición 2 | $8, 7, \mathbf{6}, 3, 5$ | $\mathrm{hiz}(2) = 5$ no existe, para |

Las dos operaciones hacen a lo sumo un intercambio por nivel, y un árbol
completo de $n$ nodos tiene altura $\lfloor \log_2 n \rfloor$: $O(\log n)$.
Leer el tope es $O(1)$. Buscar un valor cualquiera es $O(n)$, porque el
montículo solo garantiza que el padre supera a los hijos, no dónde está cada
valor.

`priority_queue` de C++ guarda el arreglo en un `vector`, no tiene
iteradores y deja arriba el mayor. `heapq` de Python trabaja sobre una `list`
y deja en `h[0]` el menor. Para el menor en C++ se declara
`priority_queue<int, vector<int>, greater<int>>`; para el mayor en Python se
guardan los valores con el signo cambiado.

## Las tablas de costos

*Leer* es consultar un elemento sin quitarlo; *escribir*, insertarlo;
*buscar*, preguntar si un valor está; *recorrer*, visitar todos una vez.
Recorrer cuesta $O(n)$; lo que cuesta $O(1)$ es avanzar un paso.

| Estructura | Leer | Escribir | Buscar | Recorrer |
|---|---|---|---|---|
| Arreglo dinámico | $O(1)$ en $i$ | $O(1)$ al final, $O(n-p)$ en $p$ | $O(n)$ | $O(n)$ |
| Lista enlazada | $O(i)$ en $i$ | $O(1)$ en el iterador | $O(n)$ | $O(n)$ |
| Doble extremo | $O(1)$ en los extremos | $O(1)$ en los extremos | $O(n)$ | $O(n)$ |
| Pila | $O(1)$ el tope | $O(1)$ en el tope | no se busca | no se recorre |
| Cola | $O(1)$ el frente | $O(1)$ al final | no se busca | no se recorre |

| Estructura | Leer | Escribir | Buscar | Recorrer |
|---|---|---|---|---|
| Direccionamiento directo | $O(1)$ | $O(1)$ | $O(1)$ | $O(U)$ |
| Tabla hash | $O(1)$ promedio | $O(1)$ promedio | $O(1)$ promedio | $O(n)$, sin orden |
| Árbol balanceado | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$, en orden |
| Árbol binario de búsqueda | $O(h)$ | $O(h)$ | $O(h)$ | $O(n)$, en orden |
| Montículo | $O(1)$ el tope | $O(\log n)$ | $O(n)$ | no en orden |

En un arreglo ordenado, la búsqueda binaria mira la mitad y descarta la otra:
$T(n) = T(n/2) + O(1)$, que da $O(\log n)$. Sin orden, buscar es $O(n)$.
Ordenar cuesta $O(n \log n)$ y se paga una vez. El $O(1)$ de la tabla hash es
el caso promedio: si muchas claves caen en la misma casilla, buscar se vuelve
$O(n)$, mientras que `map` cuesta $O(\log n)$ siempre y además recorre las
claves en orden.

Para escoger, se escribe qué operación se repite dentro del ciclo principal y
se busca la estructura donde esa operación es $O(1)$ u $O(\log n)$:

| El programa necesita | Estructura |
|---|---|
| Guardar la entrada y leerla por posición | arreglo dinámico |
| Deshacer: el último que entró sale primero | pila |
| Atender en orden de llegada | cola |
| Insertar en medio sin correr nada | lista enlazada |
| Contar cuántas veces aparece cada clave | tabla hash o `map` |
| Saber si un valor ya apareció | conjunto |
| Sacar siempre el menor o el mayor | montículo |
| El vecino de un valor en orden | `set` o arreglo ordenado |
| Visitar por capas desde un origen | cola |

## Un recorrido en vez de dos

Si lo que se necesita de las casillas anteriores se puede actualizar con la
que acaba de entrar, el segundo recorrido sobra: ese dato se guarda en una
variable y se actualiza en la misma vuelta. El máximo, el mínimo, la suma, el
conteo de los que cumplen algo y el mejor resultado visto se actualizan así
en $O(1)$. El caso se reconoce por dos ciclos anidados donde el de adentro
vuelve a mirar lo que el de afuera ya recorrió.

Con $v = [4, 7, 2, 9, 5]$, para cada posición $j$ se busca el mayor valor que
quedó atrás, entre $v[0]$ y $v[j-1]$:

| $j$ | Lo de atrás | Mayor atrás |
|---|---|---|
| 0 | nada | |
| 1 | $v[0..0] = 4$ | 4 |
| 2 | $v[0..1] = 4, 7$ | 7 |
| 3 | $v[0..2] = 4, 7, 2$ | 7 |
| 4 | $v[0..3] = 4, 7, 2, 9$ | 9 |

La fila de abajo, 4, 7, 7, 9, nunca baja, y cambia solo cuando el que acaba
de pasar supera a todos los anteriores.

La forma directa vuelve a recorrer lo de atrás para cada $j$:

```python
def maximos_dos_ciclos(v):
    res = [None] * len(v)
    for j in range(1, len(v)):
        mayor = v[0]
        for i in range(1, j):
            if v[i] > mayor:
                mayor = v[i]
        res[j] = mayor
    return res
```

Para $j = 1$ mira una casilla, para $j = 2$ dos, y para $j = n - 1$ mira
$n - 1$:

$$
\sum_{j=1}^{n-1} j = \frac{n(n-1)}{2},
$$

del orden de $n^2$. Con $n = 100\,000$ son unos $5 \cdot 10^9$ pasos.

Lo de atrás de $j = 3$ es $4, 7, 2$ y lo de atrás de $j = 2$ es $4, 7$: se
diferencian en una sola casilla, la que acaba de entrar. El mayor de atrás de
$j + 1$ es el mayor entre el que ya se tenía para $j$ y $v[j]$.

```python
def maximos_un_recorrido(v):
    res = [None] * len(v)
    mayor = v[0]
    for j in range(1, len(v)):
        res[j] = mayor
        if v[j] > mayor:
            mayor = v[j]
    return res
```

Una comparación por posición, $n - 1$ en total: $\Theta(n)$.

| $j$ | $v[j]$ | `mayor` al entrar | `mayor` al salir |
|---|---|---|---|
| 1 | 7 | 4 | 7 |
| 2 | 2 | 7 | 7 |
| 3 | 9 | 7 | 9 |
| 4 | 5 | 9 | 9 |

Dentro de la vuelta, primero se usa `mayor` y después entra $v[j]$. Al revés,
en $j = 3$ se leería 9 como lo de atrás y la casilla se estaría comparando
consigo misma.

## UVa 11078: Open Credit System

- Enunciado: <https://onlinejudge.org/external/110/11078.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2019>

Un curso tiene $n$ estudiantes numerados por antigüedad: si $i < j$, el
estudiante $i$ es más antiguo que el $j$. Todos presentaron una prueba de
nivel, y el profesor quiere la mayor diferencia que un antiguo le saca a uno
más nuevo, el máximo de $a[i] - a[j]$ con $i < j$, sin valor absoluto. Si un
antiguo saca 80 y un nuevo 70, la diferencia es 10. Llegan menos de 20 casos;
en cada uno, $2 \le n \le 100\,000$, un puntaje por línea y
$|a[i]| < 150\,000$. Sale un número por caso.

### La muestra

| Caso | Puntajes | Respuesta |
|---|---|---|
| 1 | $100, 20$ | $100 - 20 = 80$ |
| 2 | $4, 3, 2, 1$ | $4 - 1 = 3$ |
| 3 | $1, 2, 3, 4$ | $1 - 2 = -1$ |

En el tercer caso la respuesta no es $4 - 1 = 3$, porque el 4 es el último:
es el más nuevo y tiene que ir a la derecha de la resta. Con $i < j$, las
parejas son $1 - 2$, $1 - 3$, $1 - 4$, $2 - 3$, $2 - 4$ y $3 - 4$, todas
negativas, y la mayor es $-1$. La respuesta puede ser negativa, y un programa
que imprime 0 cuando ningún antiguo supera a uno nuevo falla este caso.

### Todas las parejas

```cpp
for (int i = 0; i < npts - 1; i++) {
  for (int j = i + 1; j < npts; j++) {
    if (pts[i] - pts[j] > diferencia) {
      diferencia = pts[i] - pts[j];
    }
  }
}
```

El ciclo de adentro da $n - 1 - i$ vueltas, $n(n-1)/2$ parejas en total: con
$n = 100\,000$, unos $5 \cdot 10^9$ por caso. Medido en Python para las
diapositivas, en un Ryzen 7 7435HS, la versión de dos ciclos tarda 2,84 s con
$n = 10\,000$ y 11,32 s con $n = 20\,000$: al duplicar $n$ el tiempo se
multiplica por 4, y con $n = 100\,000$ serían unos 280 segundos por caso.

### Fijar al más nuevo

Fijado el estudiante nuevo $j$, el antiguo que le saca más es el de mayor
puntaje entre $a[0], \ldots, a[j-1]$, porque se resta siempre el mismo
$a[j]$. Ese mayor es el máximo de atrás de la sección anterior: al pasar de
$j$ a $j + 1$ entra un solo candidato, $a[j]$, y el máximo se actualiza con
una comparación. La respuesta es el mejor $\mathit{mayor} - a[j]$ que aparezca
en el camino. Solo importa el máximo de los anteriores: el mínimo daría
$a[j] - a[i]$, que es otra resta.

Con $a = [1, 9, 2, 8, 3]$, `mayor` arranca en $a[0] = 1$ y `diferencia` en
$a[0] - a[1] = -8$:

| $j$ | $a[j]$ | $\mathit{mayor} - a[j]$ | `diferencia` | `mayor` al salir |
|---|---|---|---|---|
| inicio | | | $-8$ | 1 |
| 1 | 9 | $1 - 9 = -8$ | $-8$ | 9 |
| 2 | 2 | $9 - 2 = 7$ | 7 | 9 |
| 3 | 8 | $9 - 8 = 1$ | 7 | 9 |
| 4 | 3 | $9 - 3 = 6$ | 7 | 9 |

La respuesta es 7. Un recorrido con dos comparaciones por vuelta,
$\Theta(n)$ por caso.

### La solución

```cpp
vector<int> pts(100000);

int main() {
  int casos;
  scanf("%d", &casos);
  for (int c = 0; c < casos; c++) {
    int npts;
    scanf("%d", &npts);
    for (int p = 0; p < npts; p++) {
      scanf("%d", &pts[p]);
    }

    int mayor = pts[0];
    int diferencia = pts[0] - pts[1];
    for (int i = 1; i < npts; i++) {
      if (mayor - pts[i] > diferencia) {
        diferencia = mayor - pts[i];
      }
      if (pts[i] > mayor) {
        mayor = pts[i];
      }
    }
    printf("%d\n", diferencia);
  }
  return 0;
}
```

El vector global tiene el tamaño máximo del enunciado, $100\,000$, y se
reutiliza en cada caso. La diferencia está entre $-300\,000$ y $300\,000$, y
cabe en un `int`.

```python
def mayor_diferencia(pts):
    mayor = pts[0]
    diferencia = pts[0] - pts[1]
    for i in range(1, len(pts)):
        if mayor - pts[i] > diferencia:
            diferencia = mayor - pts[i]
        if pts[i] > mayor:
            mayor = pts[i]
    return diferencia


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    pos = 1
    for c in range(casos):
        npts = int(datos[pos])
        pts = []
        for p in range(npts):
            pts.append(int(datos[pos + 1 + p]))
        pos = pos + 1 + npts
        print(mayor_diferencia(pts))
```

Las dos versiones imprimen 80, 3 y $-1$ con `uva11078.in`.

### Dónde arranca el ciclo

La primera versión del recorrido tenía el ciclo desde `i = 0` e imprimió 80,
3 y 0. En la vuelta $i = 0$, `mayor` todavía es `pts[0]`, así que
$\mathit{mayor} - \mathit{pts}[0] = 0$: la pareja del primer estudiante
consigo mismo. En los dos primeros casos la respuesta es positiva y ese 0 no
estorba; en el tercero sí:

| $i$ | $\mathit{pts}[i]$ | $\mathit{mayor} - \mathit{pts}[i]$ | `diferencia` | `mayor` al salir |
|---|---|---|---|---|
| inicio | | | $-1$ | 1 |
| 0 | 1 | $1 - 1 = 0$ | 0 | 1 |
| 1 | 2 | $1 - 2 = -1$ | 0 | 2 |
| 2 | 3 | $2 - 3 = -1$ | 0 | 3 |
| 3 | 4 | $3 - 4 = -1$ | 0 | 4 |

El ciclo empieza en `i = 1`, y `diferencia` arranca con una pareja que
existe, `pts[0] - pts[1]`. Arrancarla en 0 produce el mismo error por otro
camino: pasa los dos primeros casos e imprime 0 en el tercero. Escribir
`max(a[:j])` dentro del ciclo, en Python, también falla: devuelve el programa
a $O(n^2)$.

La actividad
[maximo-acumulado](../../../actividades/estructuras-de-datos/recorridos-arreglos/maximo-acumulado.html){ target=_blank rel=noopener }
recorre el problema paso a paso.

## Lo que sigue

Del bloque quedan UVa 507, *Jill Rides Again*, con el mejor tramo de un
arreglo, y UVa 108, *Maximum Sum*, con las matrices y sus acumulados, además
de la hora de lógica sobre proposiciones y predicados. Los enunciados, los
enlaces de envío y las soluciones están en la
[página del bloque](./Bloque%201.%20Arreglos%20y%20matrices.md) y en las
[soluciones](./Soluciones.md). El bloque 2 abre con el conteo de operaciones
línea a línea, que es lo que permite pasar de un programa a su costo en $O$.
