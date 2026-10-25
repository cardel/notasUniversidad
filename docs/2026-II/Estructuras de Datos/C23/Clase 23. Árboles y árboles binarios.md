# Estructuras de Datos · Clase 23. Árboles y árboles binarios

Miércoles 28 de octubre de 2026, de 17:00 a 19:00.

El `map` busca en $O(\log n)$ y recorre sus claves en orden, y para lograrlo
guarda un árbol por dentro. Esta sesión arma la primera pieza de esa
estructura. Empieza por el vocabulario de un árbol con raíz y pasa al árbol
binario, cuya definición recursiva dicta cómo se escriben las funciones que
trabajan sobre él: un caso base para el árbol vacío y un caso recursivo que
combina lo que devuelven los dos subárboles. Con esa idea salen el tamaño, la
altura y los tres recorridos en profundidad, primero con recursión y después
con una pila explícita, que es la que sobrevive a un árbol degenerado de
doscientos mil nodos.

Al terminar, el objetivo es poder describir un árbol concreto con su
vocabulario (raíz, padre, hijo, hermano, hoja, grado, profundidad, nivel y
altura); escribir una función recursiva sobre un árbol binario a partir de su
definición y seguir a mano su pila de llamadas; recorrer un árbol en preorden,
inorden y posorden con recursión y con pila; dar el costo en tiempo y en
espacio de cada función, con la razón por la que un árbol degenerado desborda
la pila de llamadas; y resolver problemas de juez que piden recorrer, medir o
reconstruir un árbol binario.

## Diapositivas

![](./clase23.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: la tabla hash y el map

| | Buscar, insertar | Recorrer en orden de clave |
|---|---|---|
| Tabla hash | $\Theta(1 + \alpha)$ en promedio | no: hay que ordenar al final |
| `map` | $O(\log n)$ | sí, en $\Theta(n)$ |

La tabla hash gana en velocidad promedio y pierde el orden. El `map` paga un
$\log n$ y entrega las claves de menor a mayor sin ordenarlas al final. Queda
la pregunta de qué estructura guarda por dentro para conseguir las dos cosas.
La respuesta tiene varias piezas, y la primera es el árbol binario.

## Datos que se contienen unos a otros

Una carpeta contiene archivos y otras carpetas: la raíz `/` contiene `docs`,
`fotos` y `src`; `docs` contiene `tesis.tex` y `notas.md`; `src` contiene
`main.cpp` y la carpeta `lib`, que a su vez guarda `pila.h`. En
$(3 + 4) * (5 - 2)$ pasa algo parecido: la multiplicación contiene dos
operaciones y cada una contiene dos números.

Si los nueve nombres se guardan en una lista enlazada, en el orden en que
aparecen al recorrer el disco
(`/ docs tesis.tex notas.md fotos src main.cpp lib pila.h`), la lista no
dice si `main.cpp` está en `src` o en la raíz. Guarda un orden, no quién
contiene a quién. Si cada elemento anotara además su carpeta, preguntar qué
hay en `src` obligaría a recorrer la lista completa: $\Theta(n)$ por pregunta.
Lo que se quiere es que cada carpeta apunte a lo que contiene, para bajar
desde `src` a `main.cpp` y a `lib` sin mirar lo demás. En la expresión, el
dibujo deja cada operador encima de sus dos operandos, y lo que está más
abajo se calcula antes.

## El TAD árbol

En un árbol con raíz (CLRS, §B.5.2; Thareja, §9.1.1) un nodo se distingue como
*raíz*. Todo nodo distinto de la raíz tiene un único *padre*; los nodos que lo
tienen como padre son sus *hijos*, y dos nodos con el mismo padre son
*hermanos*. Una *hoja* no tiene hijos y un *nodo interno* tiene al menos uno.
El *grado* de un nodo es su número de hijos, y el *subárbol* de $x$ es $x$
con todo lo que cuelga de él.

Las medidas cuentan aristas. La *profundidad* de $x$ es el número de aristas
del camino de la raíz a $x$, y la raíz tiene profundidad 0; el *nivel* $k$
son los nodos de profundidad $k$. La *altura* de $x$ es el número de aristas
del camino más largo que baja de $x$ hasta una hoja: una hoja tiene altura 0,
y la altura del árbol es la de su raíz. La profundidad se cuenta desde arriba
y la altura desde abajo.

### Un árbol concreto

A es la raíz, con hijos B, C y D. B tiene a E y F; D tiene a G, y G tiene a H.

| Nodo | Padre | Hijos | Grado | Profundidad | Altura | Tipo |
|---|---|---|---|---|---|---|
| A | ninguno | B, C, D | 3 | 0 | 3 | raíz |
| B | A | E, F | 2 | 1 | 1 | interno |
| C | A | ninguno | 0 | 1 | 0 | hoja |
| D | A | G | 1 | 1 | 2 | interno |
| E | B | ninguno | 0 | 2 | 0 | hoja |
| F | B | ninguno | 0 | 2 | 0 | hoja |
| G | D | H | 1 | 2 | 1 | interno |
| H | G | ninguno | 0 | 3 | 0 | hoja |

Los hermanos de C son B y D. El nivel 2 es $\{E, F, G\}$, y la altura del
árbol es 3, la de A, por el camino A, D, G, H.

!!! warning "Aristas, no nodos"

    D tiene profundidad 1 y altura 2: son medidas distintas. Algunos
    enunciados cuentan nodos en lugar de aristas, y entonces una hoja tiene
    altura 1. Antes de programar se lee cuál usa.

### Hijo izquierdo, hermano derecho

Un nodo puede tener cualquier número de hijos, y un arreglo de hijos de tamaño
fijo se queda corto o desperdicia casillas. CLRS (§10.3) guarda cualquier árbol
con raíz con dos punteros por nodo: uno a su primer hijo y otro a su hermano
siguiente. En el árbol de arriba, A apunta a B; B apunta a E como primer hijo y
a C como hermano; C apunta a D. Así cualquier árbol con raíz se guarda como un
árbol binario, y listar los hijos de $x$ cuesta $\Theta(\text{grado de } x)$:
se baja al primero y se avanza por los hermanos. Desde aquí la sesión trabaja
con árboles binarios.

## El árbol binario

Un árbol binario (CLRS, §B.5.3; Thareja, §9.2.3) es una de dos cosas: el
*árbol vacío*, que no tiene nodos, o un nodo raíz junto con dos árboles
binarios disjuntos, el *subárbol izquierdo* y el *subárbol derecho*. La
definición usa la palabra que define. Un árbol binario se arma con árboles
binarios más pequeños, y el vacío es donde se acaba.

Izquierdo y derecho cuentan. Un 1 con un 2 colgado a la izquierda y un 1 con
un 2 colgado a la derecha son el mismo árbol con raíz, pero dos árboles
binarios distintos.

### El árbol de ejemplo

Todas las trazas de la sesión usan este árbol: raíz 8, con hijos 3 y 10; el 3
tiene hijos 1 y 6; el 6 tiene hijos 4 y 7; el 10 solo tiene hijo derecho, el
14. Son ocho nodos. Cada hijo que falta es un subárbol vacío, y hay nueve: dos
bajo cada hoja (1, 4, 7 y 14) y el izquierdo del 10.

### El nodo en C++

```cpp
struct Nodo {
  int dato;
  Nodo *izq;  // raiz del subarbol izquierdo
  Nodo *der;  // raiz del subarbol derecho
};

Nodo *crearNodo(int dato, Nodo *izq, Nodo *der) {
  Nodo *nuevo = new Nodo;
  nuevo->dato = dato;
  nuevo->izq = izq;
  nuevo->der = der;
  return nuevo;
}
```

Un árbol se maneja con el puntero a su raíz, y el árbol vacío es `NULL`.
`crearNodo` cuesta $\Theta(1)$ en tiempo y en espacio: un `new` y tres
asignaciones. La estructura ocupa $\Theta(n)$, un nodo por dato con el dato y
dos punteros.

### Armar el árbol a mano

```cpp
Nodo *seis = crearNodo(6, crearNodo(4, NULL, NULL), crearNodo(7, NULL, NULL));
Nodo *tres = crearNodo(3, crearNodo(1, NULL, NULL), seis);
Nodo *diez = crearNodo(10, NULL, crearNodo(14, NULL, NULL));
Nodo *raiz = crearNodo(8, tres, diez);
```

El código empieza por el 6 y deja el 8 para el final porque `crearNodo` recibe
los dos hijos ya hechos. Para crear el 8 hacen falta el 3 y el 10, y para
crear el 3 hace falta el 6: el árbol se arma de abajo hacia arriba, y las
hojas llevan `NULL` en los dos punteros.

## La recursión, desde el árbol

La definición del árbol binario tiene dos casos, y una función sobre árboles
binarios tiene los mismos dos. El *caso base* es el árbol vacío, que responde
sin llamar a nadie. El *caso recursivo* es un nodo con dos subárboles: la
función se llama sobre cada uno, que es más pequeño, y combina lo que
devuelven con el dato de la raíz.

### De la definición a la función

El vacío tiene 0 nodos. Un árbol con raíz tiene la raíz más los nodos de sus
dos subárboles:

$$
\mathit{tamano}(T) =
\begin{cases}
  0 & \text{si } T \text{ es vacío} \\
  1 + \mathit{tamano}(I) + \mathit{tamano}(D) & \text{si no}
\end{cases}
$$

```cpp
// Numero de nodos. El arbol vacio tiene 0.
int tamano(Nodo *r) {
  int res = 0;
  if (r != NULL) {
    res = 1 + tamano(r->izq) + tamano(r->der);
  }
  return res;
}
```

Cada línea de la fórmula es una línea del código; `res = 0` es el caso base,
porque si `r` es `NULL` el `if` no entra. En el árbol de ejemplo, `tamano(3)`
recibe 1 de `tamano(1)` y 3 de `tamano(6)`, y devuelve $1 + 1 + 3 = 5$.
`tamano(raiz)` devuelve 8. Para escribir la función no hizo falta seguir todas
las llamadas: bastó suponer que la llamada sobre un subárbol, que tiene menos
nodos, devuelve su tamaño, y ocuparse solo de combinar. Las llamadas se
acaban porque cada una baja un nivel y tarde o temprano llega a un vacío.

### La pila de llamadas de tamano(6)

Cada llamada abre un marco en la pila de llamadas con su `r` y lo que lleva
sumado. Solo trabaja el marco de arriba; los de abajo esperan una respuesta.
Sobre el subárbol de 6, el más pequeño con dos hijos:

| Paso | Qué pasa | Marcos de `tamano`, del fondo al tope |
|---|---|---|
| 1 | `main` llama `tamano(6)`; es caso recursivo y necesita primero `tamano(4)` | 6: $1 + ? + ?$ |
| 2 | entra el marco de 4, que también necesita a sus hijos | 6, 4 |
| 3 | el hijo izquierdo de 4 es `NULL`: caso base, devuelve 0 y su marco sale | 6, 4, vacío |
| 4 | el 0 llena el primer hueco de 4, que llama con su derecho, otro vacío: 0 | 6, 4: $1 + 0 + ?$, vacío |
| 5 | 4 suma $1 + 0 + 0$, devuelve 1 y sale | 6: $1 + 1 + ?$ |
| 6 | 6 llama con su derecho, `tamano(7)` | 6, 7 |
| 7 | 7 repite lo de 4 con sus dos vacíos y devuelve 1 | 6, 7: $1 + 0 + 0$ |
| 8 | 6 completa $1 + 1 + 1$ y devuelve 3 a `main` | 6: $1 + 1 + 1$ |

Hubo siete llamadas, tres sobre nodos y cuatro sobre vacíos. La pila llegó a
tener tres marcos de `tamano` a la vez, los de un camino que baja desde la
raíz. La llamada más honda siempre cae en un vacío colgado del nodo más
profundo, así que sobre un árbol de altura $h$ la pila tiene a lo sumo
$h + 2$ marcos de `tamano`: el espacio aparte es $O(h)$. En tiempo, cada nodo
y cada vacío reciben una llamada que trabaja $\Theta(1)$ sin contar las que
hace; con $n$ nodos eso da $\Theta(n)$.

### altura

Una hoja tiene altura 0, y la altura de un nodo es 1 más la mayor de las
alturas de sus subárboles. Para que esa regla dé 0 en una hoja, el vacío
tiene que valer $-1$, porque $1 + \max(-1, -1) = 0$:

$$
\mathit{altura}(T) =
\begin{cases}
  -1 & \text{si } T \text{ es vacío} \\
  1 + \max(\mathit{altura}(I), \mathit{altura}(D)) & \text{si no}
\end{cases}
$$

En el árbol de ejemplo, `altura(raiz)` da 3, por el camino 8, 3, 6, 4. Cuesta
lo mismo que `tamano`: $\Theta(n)$ en tiempo y $O(h)$ de pila.

### Un caso base en el lugar equivocado

Parece natural detenerse en la hoja, que tiene tamaño 1:

```cpp
// Caso base en la hoja. Exige r != NULL.
int tamanoHoja(Nodo *r) {
  int res = 1;
  if (r->izq != NULL || r->der != NULL) {
    res = 1 + tamanoHoja(r->izq) + tamanoHoja(r->der);
  }
  return res;
}
```

Sobre el subárbol de 6 da 3 y sobre el de 3 da 5: ahí cada nodo tiene cero o
dos hijos. Con la raíz, el programa termina con `Segmentation fault`. El 10
tiene un solo hijo, así que el `if` entra y llama `tamanoHoja(NULL)` por la
izquierda, y esa llamada lee `r->izq` con `r` nulo.

!!! warning "Sin caso base"

    Si a `tamano` se le quita el `if`, pasa lo mismo en la primera hoja:
    `tamano(NULL)` lee `NULL->izq`. El caso base de una función sobre árboles
    binarios es el vacío, y antes de leer `r->izq` o `r->dato` la función
    tiene que saber que `r` no es `NULL`.

### Un árbol que es una lista

`degenerado(n)` cuelga $1, 2, \ldots, n$, cada uno a la derecha del anterior.
La altura es $n - 1$, y `altura` abre un marco por nodo antes de que el
primero responda:

| $n$ | `altura(raiz)` |
|---|---|
| 1 000 | 999 |
| 100 000 | 99 999 |
| 174 218 | 174 217 |
| 175 000 | `Segmentation fault` |

Linux da al programa una pila de llamadas de 8 MB (`ulimit -s` muestra 8192).
Compilado con `g++ -Wall -Wextra`, cada marco de `altura` ocupa unos 48 bytes,
y caben unos 174 mil. Con 175 000 nodos el programa no se pone lento: se cae.
Los nodos caben de sobra en memoria, porque se piden con `new`; lo que se
acaba es la pila de llamadas, que es mucho más pequeña. La salida es guardar
lo pendiente en una pila propia, también hecha con nodos pedidos con `new`.
Para probarlo:

```bash
g++ -Wall -Wextra desborde.cpp -o desborde
echo 175000 | ./desborde
```

## Recorridos: preorden, inorden y posorden

Los tres recorridos en profundidad (CLRS, §12.1; Thareja, §9.4) tienen el mismo
caso base, el vacío, donde no se hace nada. El *preorden* visita la raíz,
después el subárbol izquierdo y después el derecho; el *inorden*, el
izquierdo, la raíz y el derecho; el *posorden*, el izquierdo, el derecho y al
final la raíz. Cambia una sola cosa: el momento en que se imprime la raíz.

```cpp
// Subarbol izquierdo, raiz, subarbol derecho.
void inorden(Nodo *r) {
  if (r != NULL) {
    inorden(r->izq);
    printf("%d ", r->dato);
    inorden(r->der);
  }
}
```

`preorden` y `posorden` son la misma función con el `printf` antes de las dos
llamadas o después de ellas. Sobre el árbol de ejemplo:

| Recorrido | Salida | Lo que se nota |
|---|---|---|
| Preorden | `8 3 1 6 4 7 10 14` | la raíz sale primero; el subárbol izquierdo de 8 termina antes de pasar al 10 |
| Inorden | `1 3 4 6 7 8 10 14` | sale primero el nodo de más a la izquierda; el 10 va antes que el 14 porque su izquierdo es vacío |
| Posorden | `1 4 7 6 3 14 10 8` | un nodo sale después de todo su subárbol: la raíz va de última |

El inorden quedó ordenado de menor a mayor, y al final de la sesión se vuelve
sobre eso. Hay una forma de leer los tres sin seguir llamadas: se camina por
fuera del árbol, pegado a él, desde la izquierda de la raíz. El preorden anota
cada nodo al pasar por su izquierda, el inorden al pasar por debajo y el
posorden al pasar por su derecha. Los tres cuestan $\Theta(n)$ en tiempo, con
un `printf` por nodo, y $O(h)$ de pila de llamadas.

### Un árbol para (3 + 4) * (5 - 2)

En un árbol de expresión (Thareja, §9.2.5) las hojas son números y cada nodo
interno es un operador con sus dos operandos como hijos. Se usa el mismo
`Nodo`, y un operador se guarda como su carácter en el `int dato`:

```cpp
Nodo *suma = crearNodo('+', crearNodo(3, NULL, NULL), crearNodo(4, NULL, NULL));
Nodo *resta = crearNodo('-', crearNodo(5, NULL, NULL), crearNodo(2, NULL, NULL));
Nodo *raiz = crearNodo('*', suma, resta);
```

`expresion.cpp` imprime:

```text
prefija:  * + 3 4 - 5 2 
infija:   ((3 + 4) * (5 - 2))
postfija: 3 4 + 5 2 - * 
valor:    21
```

El preorden da la notación prefija, el inorden la infija y el posorden la
postfija, la que evalúa una pila de operandos. La prefija y la postfija no
necesitan paréntesis; la infija sí, porque sin ellos `3 + 4 * 5 - 2` se
agruparía de otra manera, y por eso `infija` abre un paréntesis antes de bajar
a la izquierda y lo cierra al volver de la derecha.

`evaluar` es un posorden: primero los dos operandos, después el operador. El
`+` devuelve 7, el `-` devuelve 3 y el `*` devuelve 21, en $\Theta(n)$ de
tiempo y $O(h)$ de pila.

```cpp
// Posorden: se evaluan los dos operandos y despues se opera. Exige r != NULL.
int evaluar(Nodo *r) {
  int res = r->dato;
  if (!esHoja(r)) {
    int a = evaluar(r->izq);
    int b = evaluar(r->der);
    if (r->dato == '+') {
      res = a + b;
    } else if (r->dato == '-') {
      res = a - b;
    } else if (r->dato == '*') {
      res = a * b;
    } else {
      res = a / b;
    }
  }
  return res;
}
```

!!! warning "Lo que evaluar da por hecho"

    - Que `r` no es `NULL` y que cada operador tiene sus dos hijos. Un árbol
      de expresión no tiene nodos internos con un solo hijo, y por eso aquí el
      caso base es la hoja y no el vacío.
    - Que no hay división por cero: con `/` y un divisor que vale 0, el
      programa se cae.
    - Un nodo se reconoce como operador por tener hijos, no por su valor. Una
      hoja con el número 42, que es el código de `*`, se imprime y se evalúa
      como 42.

## Recorridos con pila explícita

### preordenPila

La pila guarda los subárboles que faltan por visitar. Se saca un nodo, se
imprime y se apilan sus hijos, el derecho antes que el izquierdo para que el
izquierdo salga primero, como en la recursiva. Con el tope a la izquierda:

| Vuelta | Saca e imprime | Apila | Pila después | Salida |
|---|---|---|---|---|
| inicio | | 8 | 8 | |
| 1 | 8 | 10, 3 | 3 10 | 8 |
| 2 | 3 | 6, 1 | 1 6 10 | 8 3 |
| 3 | 1 | | 6 10 | 8 3 1 |
| 4 | 6 | 7, 4 | 4 7 10 | 8 3 1 6 |
| 5 | 4 | | 7 10 | 8 3 1 6 4 |
| 6 | 7 | | 10 | 8 3 1 6 4 7 |
| 7 | 10 | 14 | 14 | 8 3 1 6 4 7 10 |
| 8 | 14 | | vacía | 8 3 1 6 4 7 10 14 |

La salida es la del preorden recursivo, con una vuelta por nodo:
$\Theta(n)$. La pila guarda a lo sumo un hijo derecho pendiente por nivel más
el nodo actual, $O(h)$.

### inordenPila

```cpp
// Se baja por la izquierda apilando; al llegar a NULL se saca
// el tope, se imprime y se sigue por su subarbol derecho.
void inordenPila(Nodo *r) {
  Pila p;
  Nodo *actual = r;
  while (actual != NULL || !p.vacia()) {
    if (actual != NULL) {
      p.apilar(actual);
      actual = actual->izq;
    } else {
      actual = p.tope();
      p.desapilar();
      printf("%d ", actual->dato);
      actual = actual->der;
    }
  }
}
```

Cada vuelta hace una de dos cosas. Si `actual` es un nodo, lo apila y baja a
la izquierda. Si es `NULL`, el tope es un nodo cuyo subárbol izquierdo ya se
imprimió: se saca, se imprime y se sigue por su derecho. Sobre el árbol de
ejemplo son 16 vueltas. Las tres primeras apilan 8, 3 y 1; la cuarta saca e
imprime el 1, y la quinta saca el 3 y sigue por el 6. En la vuelta 12 se saca
el 8 y la pila queda vacía, pero `actual` pasa a ser el 10: por eso la
condición del `while` lleva un `||`. Cada nodo entra y sale una vez, $2n$
vueltas en total, $\Theta(n)$; la pila guarda el camino de nodos que esperan su
turno, $O(h)$.

### posordenPila

La primera pila visita raíz, derecho e izquierdo y pasa cada nodo a una
segunda pila. Sobre el árbol de ejemplo, `p2` recibe `8 10 14 3 6 7 4 1`, y al
vaciarla sale al revés: `1 4 7 6 3 14 10 8`, el posorden.

!!! warning "El precio de la segunda pila"

    `p2` guarda los $n$ nodos antes de imprimir el primero. El espacio aparte
    es $\Theta(n)$, contra $O(h)$ de la recursiva; el tiempo sigue en
    $\Theta(n)$.

### De vuelta al árbol degenerado

`alturaPila`, en `desborde.cpp`, es un posorden con una sola pila. Un nodo sale
de la pila cuando su derecho ya se recorrió, y la variable `ultimo` recuerda
cuál salió para no bajar dos veces por la misma rama. La pila guarda el camino
de la raíz al nodo actual, como los marcos de `altura`, y su tamaño menos uno
es la profundidad del nodo. Con $n = 200\,000$ imprime `alturaPila: 199999`, y
después `altura`, la recursiva, termina con `Segmentation fault`. La pila
propia guarda los mismos 200 000 nodos del camino, pero en memoria pedida con
`new`. Tampoco se libera con `liberar`, que es recursiva y se caería con ese
árbol: `desborde.cpp` usa `liberarPila`, que apila los hijos de un nodo antes de
borrarlo.

## Liberar el árbol

`liberar(r)` hace `delete` de cada nodo, y lo hace en posorden: los hijos antes
que el padre.

```cpp
// Libera en posorden: los hijos antes que el padre.
void liberar(Nodo *r) {
  if (r != NULL) {
    liberar(r->izq);
    liberar(r->der);
    delete r;
  }
}
```

Un `delete` por nodo, $\Theta(n)$ en tiempo y $O(h)$ de pila.

!!! warning "Borrar primero"

    En preorden, `delete r` va antes de `liberar(r->izq)`, y esa llamada lee un
    campo de memoria ya devuelta. El resultado no está definido: puede
    funcionar en una prueba y fallar en la siguiente. Para borrar primero hay
    que guardar `r->izq` y `r->der` en variables antes del `delete`, que es lo
    que hace `liberarPila` con su pila.

## Ejercicios en parejas

Los ejercicios usan otro árbol, de siete nodos: raíz 5, con hijo izquierdo 9 e
hijo derecho 4; el 9 tiene hijos 2 y 7; el 6 es hijo derecho del 4, y el 3 es
hijo izquierdo del 6. Su preorden es `5 9 2 7 4 6 3` y su inorden,
`2 9 7 5 4 3 6`. Cada ejercicio se ataca con dos preguntas antes de escribir
código: cuál es el caso base y qué se hace con lo que devuelven los hijos.

### Contar hojas

Hay dos casos base: el vacío no tiene hojas y una hoja cuenta 1. En un nodo
interno se suman las hojas de los dos subárboles, y el nodo mismo no suma. Da 3
en el árbol de los ejercicios (2, 7 y 3) y 4 en el de ejemplo.

```cpp
// Una hoja cuenta 1; un nodo interno, lo que cuenten sus dos subarboles.
int contarHojas(Nodo *r) {
  int res = 0;
  if (r != NULL) {
    if (r->izq == NULL && r->der == NULL) {
      res = 1;
    } else {
      res = contarHojas(r->izq) + contarHojas(r->der);
    }
  }
  return res;
}
```

### Sumar los datos

El vacío suma 0, y un nodo suma su dato más lo que devuelven sus dos
subárboles: es `tamano` con `r->dato` en el lugar del 1. Da 36 en el árbol de
los ejercicios y 53 en el de ejemplo.

### El máximo

El vacío no tiene máximo, y devolver 0 fallaría si todos los datos fueran
negativos. Por eso `maximo` exige `r != NULL` y baja solo a los subárboles que
no son vacíos; su caso base es el nodo sin hijos, que devuelve su dato. Da 9
en el árbol de los ejercicios, que no es la raíz, ni una hoja, ni el nodo de
más a la derecha, y 14 en el de ejemplo.

### Nodos del nivel k

El nivel $k$ de `r` es el nivel $k - 1$ de cada hijo, así que aquí la
información baja por el parámetro. El vacío da 0 y, con $k = 0$, el nodo mismo
cuenta 1. Para $k = 0, 1, 2, 3, 4$ el árbol de los ejercicios da 1, 2, 3, 1 y 0.
Como no baja más allá del nivel $k$, cuesta $O(n)$ en tiempo y $O(\min(k, h))$
de pila.

### El espejo

`espejo` intercambia el izquierdo y el derecho en cada nodo sin crear nodos. El
vacío no se toca; en un nodo se intercambian los dos punteros y se aplica
`espejo` a cada hijo.

```cpp
// Intercambia los hijos de cada nodo, sin crear nodos nuevos.
void espejo(Nodo *r) {
  if (r != NULL) {
    Nodo *temp = r->izq;
    r->izq = r->der;
    r->der = temp;
    espejo(r->izq);
    espejo(r->der);
  }
}
```

El espejo del árbol de los ejercicios tiene preorden `5 4 6 3 9 7 2` e inorden
`6 3 4 5 7 9 2`, el inorden original al revés. Aplicado dos veces, deja el
árbol como estaba.

### Dos árboles iguales

`iguales(a, b)` recibe dos árboles y tiene dos casos base: dos vacíos son
iguales, y un vacío y un nodo no lo son. Con dos nodos se pide el mismo dato,
izquierdos iguales y derechos iguales, y el `&&` deja de comparar en la primera
diferencia. Si en el árbol de los ejercicios el 3 pasa a ser hijo derecho del
6, el preorden sigue siendo `5 9 2 7 4 6 3`, pero `iguales` devuelve falso y el
inorden lo delata: `2 9 7 5 4 6 3`. Un solo recorrido no determina el árbol.

Los seis ejercicios cuestan $O(n)$ en tiempo y $O(h)$ de pila. Las soluciones
están en [ejercicios23.cpp](./codigo/ejercicios23.cpp), probadas sobre el árbol
de ejemplo.

## Para practicar en casa

### Propuesto 1: un solo hijo

`contarUnHijo(r)` cuenta los nodos con exactamente un hijo. *Pista:* como
`contarHojas`, sumando 1 cuando el nodo tiene un hijo y no el otro. Da 1 en el
árbol de ejemplo (el 10) y 2 en el de los ejercicios (el 4 y el 6).

### Propuesto 2: ¿dónde está?

`profundidad(r, x)` devuelve la profundidad del nodo con dato `x`, o $-1$ si no
está. *Pista:* el vacío da $-1$ y el nodo con `x` da 0. Si un subárbol devuelve
$d \geq 0$, la respuesta es $d + 1$.

### Propuesto 3: el camino más pesado

La mayor suma de los datos de un camino que va de la raíz a una hoja. *Pista:*
el caso base es la hoja, como en `maximo`. Da 32 en el árbol de ejemplo (8, 10
y 14) y 21 en el de los ejercicios (5, 9 y 7).

### Propuesto 4: árbol lleno

`esLleno(r)` dice si cada nodo tiene cero o dos hijos. *Pista:* el vacío es
lleno y un nodo con un solo hijo no lo es. Son los árboles donde `tamanoHoja`
no se cae.

### Propuesto 5: por niveles

`imprimirNivel(r, k)`, con la idea de `contarNivel`, usada en un `while` con $k$
de 0 a `altura(r)`. *Pista:* el caso base con $k = 0$ imprime en vez de contar,
y cada nivel vuelve a bajar desde la raíz. Para el costo en un árbol
degenerado, sume lo que cuesta cada vuelta del `while` cuando la altura es
$n - 1$.

## Para el juez

Los problemas se envían desde vjudge, que reenvía la solución al juez original.
Cada solución lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < aizu_alds1_7_c.in`.

### Aizu ALDS1_7_C, Tree Walk

*Aizu ALDS1_7_C, Tree Walk*:
<https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_7_C>. Envío en
<https://vjudge.net/problem/Aizu-ALDS1_7_C>.

Los tres recorridos de la sesión sobre el árbol que describe una tabla de
hijos.

El árbol tiene $n \le 25$ nodos con ID de 0 a $n - 1$, y cada una de las $n$
líneas trae `id left right`, con $-1$ donde falta un hijo. Se imprimen el
preorden, el inorden y el posorden, cada uno bajo una línea con su nombre. En
el ejemplo el preorden es `0 1 2 3 4 5 6 7 8`; el inorden empieza por 2 porque
baja por 0 y 1 hasta un vacío antes de imprimir, y el posorden termina en la
raíz, 0. Con dos arreglos `izq` y `der` indexados por ID, $-1$ hace el papel de
`NULL` y los recorridos bajan a `izq[u]` y `der[u]`. La solución publicada crea
un nodo por ID con `crearNodo`, los enlaza según la tabla y busca la raíz como
el único ID que no aparece como hijo. $\Theta(n)$ por recorrido y $O(h)$ de
pila.

!!! warning "Las trampas"

    - Cada ID va precedido de un espacio: la línea empieza con espacio y no
      termina con uno. El `printf("%d ", ...)` de la sesión no sirve tal cual.
    - El enunciado no dice que la raíz sea 0 ni que las líneas lleguen en
      orden de ID. Hay que buscar la raíz.

Solución: [aizu_alds1_7_c.cpp](./codigo/aizu_alds1_7_c.cpp),
[entrada](./codigo/aizu_alds1_7_c.in), [salida](./codigo/aizu_alds1_7_c.out).

### Aizu ALDS1_7_B, Binary Tree

*Aizu ALDS1_7_B, Binary Tree*:
<https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_7_B>. Envío en
<https://vjudge.net/problem/Aizu-ALDS1_7_B>.

La profundidad baja de la raíz a los hijos y la altura sube de los hijos al
padre.

La entrada es la de ALDS1_7_C. Para cada nodo, en orden de ID, se imprime una
línea con su padre, su hermano, su número de hijos, su profundidad, su altura
y su tipo (`root`, `internal node` o `leaf`), con $-1$ para un dato que falta.
En el ejemplo, la línea del nodo 4 es
`node 4: parent = 0, sibling = 1, degree = 2, depth = 1, height = 2, internal node`:
los nodos 1 y 4 tienen profundidad 1, pero bajo el 4 está el camino 4, 5, 6,
de dos aristas, y bajo el 1 solo hay hojas. Al leer se guarda también el padre
de cada ID. Una función recibe el nodo y su profundidad $d$, la anota y llama
a los hijos con $d + 1$, como `contarNivel`; la altura es la `altura` de la
sesión, con $-1$ en el vacío, y el hermano es el otro hijo del padre. La
solución publicada calcula la altura de cada nodo por separado, $O(n^2)$ con
$n \le 25$.

!!! warning "Las trampas"

    - La raíz se imprime como `root` aunque sea hoja, con `parent = -1` y
      `sibling = -1`.
    - El hermano es $-1$ cuando el padre tiene un solo hijo.
    - La altura cuenta aristas: una hoja tiene altura 0, como en la sesión.

Solución: [aizu_alds1_7_b.cpp](./codigo/aizu_alds1_7_b.cpp),
[entrada](./codigo/aizu_alds1_7_b.in), [salida](./codigo/aizu_alds1_7_b.out).

### Aizu ALDS1_7_D, Reconstruction of a Tree

*Aizu ALDS1_7_D, Reconstruction of a Tree*:
<https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_7_D>. Envío en
<https://vjudge.net/problem/Aizu-ALDS1_7_D>.

El siguiente ID del preorden es la raíz de un rango del inorden, y lo que
queda a cada lado son sus dos subárboles.

Llegan $n \le 40$ nodos con ID distintos de 1 a $n$, el preorden en una línea
y el inorden en la siguiente (Thareja, §9.4.5); se imprime el posorden. Con
preorden `1 2 3 4 5` e inorden `3 2 4 1 5`, la raíz es 1; en el inorden, lo
que está antes de 1 (`3 2 4`) es el subárbol izquierdo y lo que está después
(`5`), el derecho. El posorden es `3 4 2 5 1`.

| Rango del inorden | Raíz | Posición | Izquierdo | Derecho |
|---|---|---|---|---|
| $[0, 4]$ | 1 | 3 | $[0, 2]$ | $[4, 4]$ |
| $[0, 2]$ | 2 | 1 | $[0, 0]$ | $[2, 2]$ |
| $[0, 0]$ | 3 | 0 | vacío | vacío |
| $[2, 2]$ | 4 | 2 | vacío | vacío |
| $[4, 4]$ | 5 | 4 | vacío | vacío |

`reconstruir(ini, fin)` trabaja sobre el rango del inorden con un índice que
avanza por el preorden, compartido por todas las llamadas. El rango vacío,
`ini > fin`, es el caso base. En el recursivo, la raíz es el siguiente del
preorden; se halla su posición $m$ en el inorden, se resuelve
$[\mathit{ini}, m - 1]$, después $[m + 1, \mathit{fin}]$, y al volver se
imprime la raíz. Solo viajan índices, sin copiar subarreglos. Buscar $m$
recorriendo el rango da $O(n^2)$; un arreglo con la posición de cada ID lo
baja a $\Theta(n)$, que es lo que usa la solución publicada, que además arma
los nodos y los imprime con un posorden aparte.

!!! warning "Las trampas"

    - El izquierdo se resuelve antes que el derecho porque el preorden lista
      todo el subárbol izquierdo antes del derecho.
    - Un solo espacio entre ID, sin espacio inicial: al revés de ALDS1_7_C.
    - La raíz no siempre es 1. En el segundo ejemplo los dos recorridos son
      `1 2 3 4`, un árbol degenerado hacia la derecha con posorden `4 3 2 1`.

Solución: [aizu_alds1_7_d.cpp](./codigo/aizu_alds1_7_d.cpp), con los dos
ejemplos del enunciado: [entrada 1](./codigo/aizu_alds1_7_d.in) y
[salida 1](./codigo/aizu_alds1_7_d.out), [entrada 2](./codigo/aizu_alds1_7_d_2.in)
y [salida 2](./codigo/aizu_alds1_7_d_2.out).

El mismo problema llega con letras en *UVa 536, Tree Recovery*:
<https://onlinejudge.org/external/5/536.pdf>, con envío en
<https://vjudge.net/problem/UVA-536>. Cada línea trae el preorden y el inorden
como dos palabras de letras mayúsculas distintas, y se imprime el posorden sin
espacios. No se da el número de casos, así que se lee hasta el fin de la
entrada, y la posición de cada letra en el inorden cabe en un arreglo de 26.

### UVa 699, The Falling Leaves

*UVa 699, The Falling Leaves*: <https://onlinejudge.org/external/6/699.pdf>.
Envío en <https://vjudge.net/problem/UVA-699>.

La lectura misma es el recorrido: cada número se suma en su columna mientras
se lee en preorden.

Cada hijo está una columna a la izquierda o a la derecha de su padre, y cada
nodo deja caer tantas hojas como su dato. Se imprimen las sumas por columna, de
izquierda a derecha. Cada árbol llega en preorden con $-1$ para el vacío, y un
$-1$ solo termina la entrada. `5 7 -1 6 -1 -1 3 -1 -1` es un 5 con un 7 a la
izquierda y un 3 a la derecha, y el 6 es hijo derecho del 7; la salida es
`Case 1:` y, en la línea siguiente, `7 11 3`. El 6 suma en la columna del 5
porque una columna a la izquierda y una a la derecha lo devuelven a la columna
0, y $5 + 6 = 11$. `leer(col)` lee un número: si es $-1$ no hace nada; si no,
lo suma en la columna `col` y llama `leer(col - 1)` y después `leer(col + 1)`.
Como la entrada viene en preorden, las llamadas piden los números en el orden
en que llegan, sin crear nodos. La solución publicada arma el árbol con esa
misma lectura recursiva y después suma por columnas. $\Theta(n)$ por árbol y
$O(h)$ de pila.

!!! warning "Las trampas"

    - Las columnas pueden ser negativas: el arreglo de sumas se indexa con
      `col` más un centro.
    - Un árbol puede ocupar varias líneas. Leer número por número con
      `scanf("%d", ...)` lo resuelve sin pensar en líneas.
    - Después de cada caso va una línea en blanco, también después del último.

Solución: [uva699.cpp](./codigo/uva699.cpp), [entrada](./codigo/uva699.in),
[salida](./codigo/uva699.out).

## Lo que cuesta

### ¿Cuántas llamadas hace tamano?

`tamano(raiz)` sobre el árbol de ejemplo, de 8 nodos, se llama 17 veces: una
por cada nodo y una por cada uno de los 9 vacíos. Con $n$ nodos siempre hay
$n + 1$ vacíos. Los $n$ nodos tienen $2n$ punteros, y cada nodo distinto de la
raíz recibe exactamente uno, el de su padre; así, $n - 1$ punteros son aristas
y los $2n - (n - 1) = n + 1$ restantes valen `NULL`. Son $2n + 1$ llamadas, cada
una con trabajo $\Theta(1)$ fuera de sus llamadas: $\Theta(n)$. La misma cuenta
vale para `altura`, los tres recorridos, `liberar` y los ejercicios.

### ¿Cuánto vale h?

El nivel $k$ tiene a lo sumo $2^k$ nodos, así que con altura $h$ caben a lo
sumo $1 + 2 + \cdots + 2^h = 2^{h+1} - 1$. Con $n$ nodos,
$h \geq \lfloor \log_2 n \rfloor$, y como cada nivel tiene al menos un nodo,
$h \leq n - 1$. El árbol lleno de 7 nodos tiene $h = 2 = \lfloor \log_2 7 \rfloor$;
la cadena de 7 nodos, $h = 6 = n - 1$. El $O(h)$ de la pila va de $O(\log n)$ a
$\Theta(n)$ según la forma, y el segundo extremo es el que desbordó la pila de
llamadas.

### Lo que cobra el árbol binario

| Operación | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| `crearNodo` | $\Theta(1)$ | $\Theta(1)$ | un `new` y tres asignaciones |
| `tamano`, `altura` | $\Theta(n)$ | $O(h)$ | una llamada por nodo y por vacío; la pila guarda un camino desde la raíz |
| los tres recorridos | $\Theta(n)$ | $O(h)$ | lo mismo, con un `printf` por nodo |
| `liberar` | $\Theta(n)$ | $O(h)$ | un `delete` por nodo, en posorden |
| `evaluar` | $\Theta(n)$ | $O(h)$ | un posorden con una operación por nodo interno |
| `preordenPila` | $\Theta(n)$ | $O(h)$ | cada nodo entra y sale una vez; a lo sumo un derecho pendiente por nivel |
| `inordenPila` | $\Theta(n)$ | $O(h)$ | $2n$ vueltas; la pila es el camino de nodos que esperan |
| `posordenPila` | $\Theta(n)$ | $\Theta(n)$ | `p2` guarda los $n$ nodos antes de imprimir |
| `alturaPila` | $\Theta(n)$ | $O(h)$ | la pila es el camino de la raíz al nodo actual |
| ejercicios en parejas | $O(n)$ | $O(h)$ | a lo sumo una llamada por nodo y por vacío |

La estructura ocupa $\Theta(n)$: un nodo por dato, con el dato y dos punteros.
Las versiones recursivas piden aparte la pila de llamadas, y las de pila
explícita, nodos de `NodoPila`; en los dos casos el espacio aparte es $O(h)$,
salvo en `posordenPila`.

## Lo que se vio

- Un árbol con raíz se describe con padre, hijos, hermanos, hojas, grado,
  profundidad (desde arriba) y altura (desde abajo), contadas en aristas. Con
  hijo izquierdo y hermano derecho, cualquier árbol se guarda con dos punteros
  por nodo.
- Un árbol binario es vacío, o una raíz con un subárbol izquierdo y uno
  derecho. Una función sobre él tiene esos mismos dos casos: el vacío responde
  sin llamar y un nodo combina lo que devuelven sus subárboles.
- Cada llamada ocupa un marco, y la pila de llamadas guarda un camino desde la
  raíz: $O(h)$. Un árbol degenerado de 175 000 nodos desborda los 8 MB de la
  pila, y la versión con pila explícita sigue funcionando.
- Preorden, inorden y posorden solo difieren en cuándo se imprime la raíz.
  Sobre un árbol de expresión dan las notaciones prefija, infija y postfija, y
  todos cuestan $\Theta(n)$: $2n + 1$ llamadas, una por nodo y una por vacío.

## Ejercicios interactivos

Las actividades para trabajar en el navegador, ordenadas por los temas de la
sesión, están en la [página de ejercicios](./Ejercicios.md). Los árboles y los
valores no son los de la sesión: mismo tema, ronda nueva.

## Lo que sigue

El árbol binario de búsqueda. El inorden del árbol de ejemplo salió
`1 3 4 6 7 8 10 14`, ordenado, y el del árbol de los ejercicios,
`2 9 7 5 4 3 6`, no. ¿Qué cumple cada nodo del primero, respecto de los datos
de sus dos subárboles, que el segundo no cumple? ¿Cómo se buscaría el 7 en el
primero sin recorrerlo entero?

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [arbol_binario.h](./codigo/arbol_binario.h): el nodo, `crearNodo`, `tamano`,
  `altura`, los tres recorridos recursivos, `liberar` y `preordenPila`,
  `inordenPila` y `posordenPila`.
- [pila_arbol.h](./codigo/pila_arbol.h): la pila enlazada que guardan las
  versiones con pila explícita, con punteros a nodos del árbol como dato.
- [uso_arbol.cpp](./codigo/uso_arbol.cpp): el árbol de ejemplo armado a mano,
  con `tamano`, `altura` y los seis recorridos; su
  [salida](./codigo/uso_arbol.out).
- [caso_base.cpp](./codigo/caso_base.cpp): `tamanoHoja`, con lo que alcanza a
  imprimir antes de caerse en su [salida](./codigo/caso_base.out).
- [desborde.cpp](./codigo/desborde.cpp): el árbol degenerado, `alturaPila` y
  `liberarPila`; lee $n$ de la entrada (`echo 1000 | ./desborde`). Su
  [salida](./codigo/desborde.out) trae las corridas con 1000 y 100 000 nodos.
- [expresion.cpp](./codigo/expresion.cpp): el árbol de $(3 + 4) * (5 - 2)$, sus
  tres notaciones y su valor, con [salida](./codigo/expresion.out).
- [ejercicios23.cpp](./codigo/ejercicios23.cpp): los ejercicios en parejas sobre
  el árbol de ejemplo, con [salida](./codigo/ejercicios23.out).

Las soluciones de los problemas de juez están en la sección *Para el juez*, con
su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Apéndice B.5, árboles: §B.5.2 árboles
  con raíz y ordenados, §B.5.3 árboles binarios y posicionales; §10.3,
  representar árboles con raíz; §12.1, recorridos inorden, preorden y posorden.
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 9, *Trees*: §9.1.1 terminología, §9.2.3 árboles binarios, §9.2.5
  árboles de expresión, §9.4 recorridos, §9.4.5 reconstruir un árbol desde sus
  recorridos. Capítulo 10, *Efficient Binary Trees*: §10.2.4 a §10.2.6, altura,
  número de nodos y espejo.
- Aizu Online Judge. ALDS1_7_C, *Tree Walk*:
  <https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_7_C>.
- Aizu Online Judge. ALDS1_7_B, *Binary Tree*:
  <https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_7_B>.
- Aizu Online Judge. ALDS1_7_D, *Reconstruction of a Tree*:
  <https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_7_D>.
- UVa Online Judge. Problema 699, *The Falling Leaves*:
  <https://onlinejudge.org/external/6/699.pdf>.
- UVa Online Judge. Problema 536, *Tree Recovery*:
  <https://onlinejudge.org/external/5/536.pdf>.
