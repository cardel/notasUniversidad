# Clase 15. La lista enlazada

Miércoles 30 de septiembre de 2026, de 17:00 a 19:00.

La lista que el curso viene usando guarda los elementos en casillas
consecutivas de un arreglo. Eso hace que `obtener` sea una suma, y que
`insertar(0, e)` mueva todos los elementos que ya están: con cien adentro,
cien asignaciones. Encima, `CAPACIDAD` se fija al compilar y el elemento que
no cabe detiene el programa. Esta sesión construye la otra implementación del
mismo contrato: cada elemento en su propio nodo, con la dirección del
siguiente, reservado con `new` y devuelto con `delete`. Insertar al frente
pasa a ser dos escrituras de puntero, y llegar a la posición `p` pasa a costar
`p` pasos. Con el arreglo que ya se tenía aparece además el primer algoritmo
de ordenamiento del curso, insertion sort.

Al terminar, el objetivo es poder construir el TAD Lista con nodos enlazados y
escribir el invariante de representación que toda operación debe dejar cierto;
explicar por qué `insertar` al frente baja a $\Theta(1)$ mientras `obtener`
sube a $\Theta(p)$; reconocer los dos errores que destruyen una lista
enlazada, empalmar en el orden equivocado y liberar un nodo todavía enlazado;
escoger entre las dos implementaciones con la tabla de costos y el perfil de
operaciones del programa; y ordenar un arreglo con insertion sort, escribir el
invariante que sostiene su ciclo y acotar lo que cuesta en tiempo y en espacio
en el mejor y en el peor caso.

## Diapositivas

![](clase15.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El proyecto del curso

Quedó publicado. El enunciado, los escenarios entre los que se escoge, las dos
entregas y la forma de trabajar el repositorio están en
[Proyecto del curso](../Proyecto/Proyecto%20del%20curso.md), que es el
documento que manda.

## Lo que cuesta correr elementos

La implementación sobre arreglo guarda los elementos en casillas consecutivas
y lleva aparte cuántas están ocupadas:

```cpp
class Lista {
private:
  Elemento datos[CAPACIDAD];
  int n;
```

`obtener(2)` sobre $\langle 5, 8, 7, 4 \rangle$ no recorre nada. La dirección
de la casilla 2 sale de una suma, base más dos veces el tamaño del tipo, y la
misma cuenta sirve para la casilla 2 y para la 900 de un arreglo grande:
$\Theta(1)$.

Insertar es otra historia.

```cpp
void insertar(int p, Elemento e) {
  assert(0 <= p && p <= n && n < CAPACIDAD);
  int i = n;
  while (i > p) {
    datos[i] = datos[i - 1];
    i = i - 1;
  }
  datos[p] = e;
  n = n + 1;
}
```

Con $p = 0$ el ciclo va de $i = n$ hasta $i = 1$ y hace $n$ asignaciones. Vale
la pena seguirlo con los índices a la vista. En una lista de 100 elementos las
casillas ocupadas son la 0 hasta la 99: el de la 99 se copia a la 100, el de
la 98 a la 99, y así hasta que el de la 0 se copia a la 1, que es cuando queda
el hueco para `e`. Son 100 copias, y el arreglo necesita al menos 101 casillas
para que la primera de ellas tenga a dónde ir. Con un millón de elementos, un
millón de copias.

Sobre $\langle 5, 8, 7 \rangle$, `insertar(0, 2)` deja $\langle 2, 5, 8, 7
\rangle$ y movió los tres que ya estaban. El elemento nuevo se escribe una
vez; el trabajo está en todo lo demás.

El techo es el segundo problema. `CAPACIDAD` se fija al compilar, y el
elemento que no cabe detiene el programa en el `assert`. El `vector` de la
biblioteca estándar resuelve esa parte: cuando se queda sin espacio pide un
bloque más grande y se muda con todo lo que tiene, que es exactamente lo que
invalidaba los iteradores en la sesión de iteradores y algoritmos. La mudanza
cuesta $\Theta(n)$ y no toca la otra mitad del problema: insertar al frente de
un `vector` sigue corriendo todos los elementos.

Quedan dos cosas por arreglar, insertar al frente sin tocar a los demás y
crecer sin techo fijo, y las dos salen de la misma decisión: dejar de exigir
que los elementos estén en casillas consecutivas.

## Un dato y una dirección

Si los elementos no van uno al lado del otro, cada uno tiene que decir dónde
está el siguiente. Eso es un nodo.

```cpp
struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};
```

!!! note "Definición (Thareja, capítulo 6)"

    Una **lista enlazada** es una cadena de nodos. Cada nodo guarda un
    elemento y la dirección del nodo que sigue. La cadena empieza en un
    puntero `cabeza` y termina en el nodo cuyo campo `siguiente` vale `NULL`.

Con tres nodos de datos 7, 3 y 9 el dibujo es `cabeza` apuntando al primero,
el primero al segundo, el segundo al tercero y el tercero a `NULL`. Las
direcciones no tienen por qué estar cerca: los tres nodos pueden haber caído
en zonas distintas de la memoria y la cadena funciona igual, porque lo que une
a los elementos ya no es la vecindad sino el puntero.

Lo que ocupa: el nodo son los bytes del dato más los del puntero, así que la
lista de $n$ elementos ocupa $\Theta(n)$, igual que el arreglo. La diferencia
está en el detalle. Con `Elemento = int` en una máquina de 64 bits, cada nodo
paga ocho bytes de puntero por cada cuatro de dato, y a cambio no reserva ni
una casilla que no se esté usando. El arreglo no paga punteros y reserva
`CAPACIDAD` casillas desde el primer día.

### `new` y `delete`

Reservar en tiempo de ejecución ya se hizo con `malloc` y `free` en la sesión
de manejo de memoria. En C++ el par se escribe distinto:

| C | C++ |
|---|---|
| `(Nodo *) malloc(sizeof(Nodo))` | `new Nodo` |
| `free(p)` | `delete p` |

`new Nodo` devuelve un puntero del tipo pedido, sin el molde que exigía
`malloc` y sin `sizeof`, porque el compilador ya sabe cuánto ocupa un `Nodo`.
La regla es la misma de antes: cada `new` lleva su `delete`, y lo que se
reserva y no se libera queda ocupado hasta que el programa termina.

### Tres nodos a mano

```cpp
Nodo *a = new Nodo;
Nodo *b = new Nodo;
Nodo *c = new Nodo;

a->dato = 7;
b->dato = 3;
c->dato = 9;

a->siguiente = b;
b->siguiente = c;
c->siguiente = NULL;   // el ultimo no apunta a nada
```

El recorrido no usa índices. Se arranca en el primero y se sigue la cadena
hasta encontrar `NULL`:

```cpp
Nodo *actual = a;
while (actual != NULL) {
  std::cout << actual->dato << " ";
  actual = actual->siguiente;
}
```

Imprime `7 3 9` y cuesta $\Theta(n)$ en tiempo, con $\Theta(1)$ de espacio
aparte: lo único que se guarda es el puntero `actual`.

Liberar tiene un orden obligatorio. Se guarda el siguiente **antes** de
borrar, porque después del `delete` el nodo ya no se puede leer:

```cpp
actual = a;
while (actual != NULL) {
  Nodo *muerto = actual;
  actual = actual->siguiente;
  delete muerto;
}
```

Escrito al revés, con el `delete` antes del avance, `actual->siguiente` lee un
nodo que acaba de devolverse al sistema. Es el puntero colgante de la sesión
de manejo de memoria, y aquí se lleva por delante el resto de la lista.

## La lista enlazada

### El estado

La clase guarda dos cosas: dónde empieza la cadena y cuántos elementos tiene.

```cpp
class Lista {
private:
  Nodo *cabeza;
  int n;
public:
  Lista() {
    cabeza = NULL;
    n = 0;
  }
```

!!! note "Invariante de representación"

    Sea $\mathrm{Alc}$ el conjunto de nodos que se alcanzan desde `cabeza`
    siguiendo el campo `siguiente` un número finito de veces, sea
    $m = |\mathrm{Alc}|$, y sea $v_0, v_1, \ldots$ la sucesión definida por
    $v_0 = \texttt{cabeza}$ y $v_{i+1} = v_i\texttt{->siguiente}$ mientras
    $v_i \neq \texttt{NULL}$.

    $$
    \begin{aligned}
      I_1:&\quad m = n\\
      I_2:&\quad \forall i, j,\ 0 \leq i < j < n:\ v_i \neq v_j\\
      I_3:&\quad n > 0 \implies v_{n-1}\texttt{->siguiente} = \texttt{NULL}
    \end{aligned}
    $$

    La sucesión de elementos que el contrato nombra es
    $L = \langle v_0\texttt{->dato}, \ldots, v_{n-1}\texttt{->dato} \rangle$,
    de modo que $\texttt{obtener}(p) = v_p\texttt{->dato}$ y
    $\texttt{tamano}() = n$.

Cada fórmula tapa un desastre distinto. Si se rompe $I_1$, el contador miente:
`tamano()` dice un número y la cadena tiene otro, así que el ciclo que recorre
hasta `n` se sale de la lista o se queda corto. $I_1$ con $n = 0$ obliga a que
`cabeza` valga `NULL`, que es como se reconoce la lista vacía. Si se rompe
$I_2$, un nodo aparece dos veces, la cadena se cierra sobre sí misma y el
recorrido no termina. Si se rompe $I_3$, el último nodo apunta a cualquier
cosa y el recorrido sigue leyendo memoria que no es de la lista. Y un nodo que
sale de $\mathrm{Alc}$ sin pasar por `delete` queda reservado y sin dueño:
nadie puede volver a alcanzarlo para liberarlo.

### Llegar a la posición `p`

En el arreglo la posición se calculaba. Aquí se camina: para llegar a $v_p$
hay que pasar por $v_0, \ldots, v_{p-1}$.

```cpp
// Devuelve el nodo de la posicion p. Exige 0 <= p < n.
Nodo *nodoEn(int p) {
  Nodo *actual = cabeza;
  int i = 0;
  while (i < p) {
    actual = actual->siguiente;
    i = i + 1;
  }
  return actual;
}

Elemento obtener(int p) {
  assert(0 <= p && p < n);
  return nodoEn(p)->dato;
}

void asignar(int p, Elemento e) {
  assert(0 <= p && p < n);
  nodoEn(p)->dato = e;
}
```

`nodoEn(p)` da $p$ pasos, así que es $\Theta(p)$ y en el peor caso
$\Theta(n)$. Para acceder a un elemento hay que recorrer los anteriores, y no
hay atajo: `obtener(10)` camina diez nodos aunque el décimo esté a unos pocos
bytes del primero.

Eso tiene una consecuencia que va más allá de `obtener`. Saltar al elemento
del medio en $\Theta(1)$ es lo que hace funcionar la búsqueda binaria, y sobre
una lista enlazada ese salto cuesta $\Theta(n)$: `lower_bound` y
`binary_search` pierden su ventaja aunque la lista esté ordenada. Las dos
implementaciones cumplen el mismo contrato y no sirven para las mismas cosas.

### Insertar al frente

Con $p = 0$ no hay nada que correr. El nodo nuevo toma la cabeza vieja y la
cabeza pasa a ser el nodo nuevo:

```cpp
nuevo->siguiente = cabeza;
cabeza = nuevo;
```

Sobre $\langle 5, 8 \rangle$ con el valor 2, la lista queda $\langle 2, 5, 8
\rangle$ y los nodos del 5 y del 8 no se tocaron: siguen donde estaban, con
los mismos bytes adentro. Dos escrituras de puntero, sin importar cuántos
elementos haya: $\Theta(1)$. En el arreglo esta era la operación cara.

### Insertar en la posición `p`

Para $p > 0$ hay que llegar al nodo **anterior**, porque es el que tiene que
apuntar al nuevo.

```cpp
void insertar(int p, Elemento e) {
  assert(0 <= p && p <= n);
  Nodo *nuevo = new Nodo;
  nuevo->dato = e;
  if (p == 0) {
    nuevo->siguiente = cabeza;
    cabeza = nuevo;
  } else {
    Nodo *anterior = nodoEn(p - 1);
    nuevo->siguiente = anterior->siguiente;
    anterior->siguiente = nuevo;
  }
  n = n + 1;
}
```

Meter a alguien en una fila entre dos personas es el mismo trámite: quien
estaba antes pasa a señalar al que llega, y el que llega señala a quien
estaba después. Los demás no se mueven, y da igual que la fila tenga diez
personas o mil. Lo que sí hay que hacer es caminar hasta el puesto $p-1$ para
encontrar a quien va a señalar al nuevo.

El orden de las dos líneas del empalme no es libre. Primero el nodo nuevo toma
el resto de la cadena, y solo después el anterior lo toma a él. Invertidas,
`anterior->siguiente` ya vale `nuevo` cuando se lee, así que `nuevo` termina
apuntándose a sí mismo: el recorrido entra en un ciclo que no termina, la cola
de la lista queda inalcanzable y sus nodos siguen reservados sin que nadie
pueda llegar a liberarlos. Son $I_2$ e $I_3$ rotos de un solo golpe, con dos
líneas en el orden equivocado.

El costo se reparte así: `nodoEn(p - 1)` da $p-1$ pasos, $\Theta(p)$, y el
empalme son dos asignaciones de puntero, $\Theta(1)$. El total es $\Theta(p)$
y baja a $\Theta(1)$ cuando $p = 0$. Mover punteros no cuesta nada que dependa
de $n$; lo caro es buscar el nodo.

Con $p = n$ el código funciona sin un caso aparte: el anterior es el último
nodo, su campo `siguiente` vale `NULL`, y el nodo nuevo lo hereda y queda de
último. Por eso `agregar(e)` se escribe como `insertar(n, e)`.

### Eliminar

```cpp
void eliminar(int p) {
  assert(0 <= p && p < n);
  Nodo *muerto;
  if (p == 0) {
    muerto = cabeza;
    cabeza = cabeza->siguiente;
  } else {
    Nodo *anterior = nodoEn(p - 1);
    muerto = anterior->siguiente;
    anterior->siguiente = muerto->siguiente;
  }
  delete muerto;
  n = n - 1;
}
```

Borrar el primero es $\Theta(1)$: `cabeza = cabeza->siguiente` y el nodo que
salió se libera. Borrar uno de más adentro cuesta lo que cuesta llegar al
anterior, $O(n)$ en el peor caso; lo que sigue es $O(1)$, porque desenlazar es
leer un puntero y escribir otro. Quien responde que eliminar es $O(n)$ por el
cambio de punteros está mirando la parte barata: el $O(n)$ viene de la
búsqueda.

!!! warning "Los dos errores que destruyen la lista"

    - `delete` antes de desenlazar: `anterior` queda apuntando a memoria
      liberada, un puntero colgante. El siguiente recorrido lee lo que ya no
      es suyo.
    - Desenlazar sin `delete`: el nodo queda reservado y sin dueño hasta que
      el programa termina. Es la fuga.

    Los dos salen del mismo descuido, así que la regla se memoriza una vez:
    guardar antes de cambiar punteros, y liberar solo cuando el nodo ya está
    fuera de la cadena.

### Liberar la lista entera

El arreglo se iba solo cuando la lista salía de alcance. Los nodos no: cada
uno se pidió con `new` y hay que devolverlo. De eso se encarga el destructor,
que se llama como la clase con una virgulilla adelante y corre cuando el
objeto muere.

```cpp
~Lista() {
  while (cabeza != NULL) {
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    delete muerto;
  }
}
```

Es el recorrido que libera de la sección anterior, con `cabeza` haciendo de
`actual`. Cuesta $\Theta(n)$ en tiempo, un `delete` por nodo, y $\Theta(1)$ de
espacio aparte.

### El mismo programa, la otra implementación

El código que usa la lista no cambió ni una línea. El contrato es el mismo y
lo que cambió está debajo:

```cpp
Lista l;
l.agregar(5);
l.agregar(8);
imprimir(l);              // 5 8
l.insertar(1, 7);
imprimir(l);              // 5 7 8
l.insertar(0, 2);
imprimir(l);              // 2 5 7 8
l.eliminar(2);
imprimir(l);              // 2 5 8
l.asignar(0, 9);
std::cout << l.obtener(0) << " " << l.tamano() << " " << l.vacia() << std::endl;
```

La última línea imprime `9 3 0`: el 9 que quedó en la posición 0, los tres
elementos y el `false` de `vacia()`.

Fuera del curso las dos implementaciones tienen nombre propio. En Java,
`ArrayList` es la de arreglo y `LinkedList` la de nodos enlazados; las dos
cumplen la misma interfaz y se escoge entre ellas por el perfil de
operaciones, no por el contrato, que es idéntico.

## Agregar sin recorrer

`agregar(e)` es `insertar(n, e)`, y eso llama a `nodoEn(n - 1)`, que recorre
la lista entera. Agregar al final cuesta $\Theta(n)$, justo la operación que
en el arreglo costaba $\Theta(1)$, porque la casilla $n$ ya estaba ahí.

¿Qué haría falta guardar para que agregar no recorra nada? La dirección del
último nodo.

```cpp
Nodo *cabeza;
Nodo *ultimo;
int n;
```

```cpp
void agregar(Elemento e) {
  Nodo *nuevo = new Nodo;
  nuevo->dato = e;
  nuevo->siguiente = NULL;
  if (cabeza == NULL) {
    cabeza = nuevo;
  } else {
    ultimo->siguiente = nuevo;
  }
  ultimo = nuevo;
  n = n + 1;
}
```

Un dato nuevo en la representación es un invariante nuevo que mantener, que se
suma a los tres de antes:

$$I_4:\quad (n > 0 \implies \texttt{ultimo} = v_{n-1}) \;\wedge\;
(n = 0 \implies \texttt{ultimo} = \texttt{NULL})$$

Y quien lo paga es `eliminar`, que gana dos casos:

```cpp
// dentro de eliminar
if (p == 0) {
  muerto = cabeza;
  cabeza = cabeza->siguiente;
  if (cabeza == NULL) {
    ultimo = NULL;          // la lista quedo vacia
  }
} else {
  Nodo *anterior = nodoEn(p - 1);
  muerto = anterior->siguiente;
  anterior->siguiente = muerto->siguiente;
  if (muerto == ultimo) {
    ultimo = anterior;      // se borro el ultimo
  }
}
```

`insertar` también se acomoda: cuando $p = n$ delega en `agregar`, para que el
mantenimiento de `ultimo` viva en un solo sitio. Los casos que hay que probar
son los bordes, y son los que corre `lista_cola_uso.cpp`: insertar en la
posición $n$, que pasa por `agregar` y deja `5 8 4`; borrar el último, que
devuelve `ultimo` al anterior y permite seguir agregando, `5 8 6`; y vaciar la
lista entera, que devuelve `ultimo` a `NULL` y deja la estructura lista para
recibir otra vez, `1`.

Las dos versiones quedan. La primera es más corta y agrega en $\Theta(n)$; la
segunda agrega en $\Theta(1)$ y cobra el precio en los dos casos nuevos de
`eliminar`, que es donde aparecen los errores.

Lo que el puntero al último no compra es borrar el último. Para sacarlo de la
cadena hay que llegar al anterior, y un nodo sabe cuál es el siguiente y no
cuál es el que lo apunta: `eliminar(n - 1)` sigue costando $\Theta(n)$ aunque
`ultimo` esté guardado.

## Lo que cobra cada operación

$n$ es el número de elementos y $p$ la posición sobre la que se opera.

| Operación | Estática | Enlazada | Por qué |
|---|---|---|---|
| `obtener(p)`, `asignar(p, e)` | $\Theta(1)$ | $\Theta(p)$ | se calcula la dirección con una suma / se camina hasta el nodo |
| `insertar(0, e)` | $\Theta(n)$ | $\Theta(1)$ | se corre todo para abrir el hueco / se escriben dos punteros |
| `insertar(p, e)` | $\Theta(n - p)$ | $\Theta(p)$ | se corre lo que sigue / se camina hasta el anterior |
| `eliminar(p)` | $\Theta(n - p)$ | $\Theta(p)$ | se cierra el hueco corriendo lo que sigue / se camina hasta el anterior |
| `agregar(e)` | $\Theta(1)$ | $\Theta(n)$ | la casilla $n$ ya está / hay que llegar al último |
| `agregar(e)` con `ultimo` | $\Theta(1)$ | $\Theta(1)$ | está guardado dónde termina la cadena |
| `tamano()`, `vacia()` | $\Theta(1)$ | $\Theta(1)$ | el contador está guardado |
| liberar la estructura | $\Theta(1)$ | $\Theta(n)$ | el arreglo se va solo / un `delete` por nodo |
| espacio de la estructura | $\Theta(\texttt{CAPACIDAD})$ | $\Theta(n)$ | casillas reservadas de antemano / un nodo por elemento, con su puntero |
| espacio aparte por operación | $\Theta(1)$ | $\Theta(1)$ | punteros y contadores sueltos |

Ninguna gana en todo. El arreglo cobra al modificar y regala el acceso; la
enlazada cobra el acceso y regala la modificación en el frente. La estructura
se escoge por las operaciones que el programa hace más veces, y esa cuenta se
hace antes de escribir el código, no después.

### La diferencia, medida

Insertar al frente $n$ veces y contar lo que mueve cada estructura. El arreglo
corre todo lo que ya tiene:

```cpp
int i = usados;
while (i > 0) {
  datos[i] = datos[i - 1];
  i = i - 1;
  movidas = movidas + 1;
}
```

La enlazada escribe dos punteros:

```cpp
nuevo->siguiente = cabeza;
cabeza = nuevo;
escrituras = escrituras + 2;
```

| $n$ | arreglo | enlazada |
|---:|---:|---:|
| 10 | 45 | 20 |
| 100 | 4950 | 200 |
| 1000 | 499 500 | 2000 |

El arreglo hace $0 + 1 + \cdots + (n-1) = \frac{n(n-1)}{2}$ movidas; con
$n = 1000$ son 499 500. La enlazada hace $2n$. Multiplicar $n$ por diez
multiplica por cien el trabajo de una y por diez el de la otra, que es la
diferencia entre $\Theta(n^2)$ y $\Theta(n)$ vista en números.

## Ordenar insertando

Quien reparte cartas las va acomodando: toma la que llega y la mete en su
lugar entre las que ya tiene ordenadas, corriendo las mayores una posición a
la derecha. Eso es insertion sort (CLRS, 4.ª edición, sección 2.1).

En $\langle 5, 2, 9, 1, 7, 3 \rangle$, al llegar al 1 hay tres elementos ya
ordenados a su izquierda, $\langle 2, 5, 9 \rangle$. El 9, el 5 y el 2 son
mayores que 1, así que los tres se corren y el 1 queda al principio.

```cpp
// Ordena a[0..n) y devuelve cuantas veces corrio un elemento.
long insertionSort(Elemento a[], int n) {
  long corrimientos = 0;
  int j = 1;
  while (j < n) {
    Elemento clave = a[j];
    int i = j - 1;
    while (i >= 0 && a[i] > clave) {
      a[i + 1] = a[i];
      i = i - 1;
      corrimientos = corrimientos + 1;
    }
    a[i + 1] = clave;
    j = j + 1;
  }
  return corrimientos;
}
```

La clave se guarda aparte porque su casilla se va a sobrescribir con el primer
corrimiento. El ciclo interno para cuando encuentra un elemento que no es
mayor, y ahí mismo está el hueco donde va la clave.

### El invariante

!!! note "Al empezar cada vuelta del ciclo externo, con índice $j$"

    Sea $A$ el arreglo en ese momento y $E$ el arreglo de entrada, y sean

    $$
    M_j = \{\!\{A[0], \ldots, A[j-1]\}\!\}, \qquad
    N_j = \{\!\{E[0], \ldots, E[j-1]\}\!\}
    $$

    los multiconjuntos de los valores que ocupan las primeras $j$ casillas de
    cada arreglo, donde un valor repetido cuenta tantas veces como aparece.

    $$
    \begin{aligned}
      I_1:&\quad \forall a, b,\ 0 \leq a < b < j:\ A[a] \leq A[b]\\
      I_2:&\quad M_j = N_j\\
      I_3:&\quad \forall i,\ j \leq i < n:\ A[i] = E[i]
    \end{aligned}
    $$

$I_1$ dice que el trozo $A[0..j)$ está en orden; $I_2$, que son los mismos
valores de la entrada y no otros, contados con repetición; $I_3$, que lo que
falta no se ha tocado.

Cuando el ciclo termina, $j = n$, y $I_1$ con $I_2$ evaluados ahí dicen
exactamente lo que se quería: el arreglo completo quedó ordenado y con los
mismos valores de la entrada.

El ciclo interno es el que sostiene $I_1$ para la vuelta siguiente. Corre a la
derecha todos los mayores que la clave y deja el hueco en `i + 1`, que es la
primera posición donde la clave no rompe el orden.

### La traza

Sobre $\langle 5, 2, 9, 1, 7, 3 \rangle$:

| $j$ | clave | corrimientos | el arreglo al terminar la vuelta |
|---:|---:|---:|---|
| 1 | 2 | 1 | $\langle 2, 5, 9, 1, 7, 3 \rangle$ |
| 2 | 9 | 0 | $\langle 2, 5, 9, 1, 7, 3 \rangle$ |
| 3 | 1 | 3 | $\langle 1, 2, 5, 9, 7, 3 \rangle$ |
| 4 | 7 | 1 | $\langle 1, 2, 5, 7, 9, 3 \rangle$ |
| 5 | 3 | 3 | $\langle 1, 2, 3, 5, 7, 9 \rangle$ |
| | total | 8 | |

En $j = 2$ la clave es 9 y el ciclo interno no entra, porque 9 ya es mayor que
todo lo que tiene a la izquierda. Esa vuelta cuesta una comparación y nada
más, y de ahí sale el mejor caso.

### Lo que cuesta

| Caso | Tiempo | Por qué |
|---|---|---|
| entrada ya ordenada | $\Theta(n)$ | el ciclo interno nunca entra: una comparación por vuelta |
| entrada al revés | $\Theta(n^2)$ | la vuelta $j$ corre los $j$ elementos de su izquierda |
| cualquier entrada | $O(n^2)$ y $\Omega(n)$ | queda entre esos dos extremos |
| espacio aparte | $\Theta(1)$ | `clave`, `i` y `j`; se ordena en el sitio |

En el peor caso los corrimientos suman $1 + 2 + \cdots + (n-1) =
\frac{n(n-1)}{2}$, la misma suma de insertar al frente de un arreglo $n$
veces. Con $n = 6$ el programa cuenta 8 corrimientos sobre
$\langle 5, 2, 9, 1, 7, 3 \rangle$, 0 sobre
$\langle 1, 2, 3, 5, 7, 9 \rangle$ y 15 sobre
$\langle 9, 7, 5, 3, 2, 1 \rangle$. Y $\frac{6 \cdot 5}{2} = 15$.

El espacio es lo que hay que subrayar: ordena en el sitio, sin pedir un
arreglo auxiliar, $\Theta(1)$ aparte de la entrada.

### Insertion sort sobre la enlazada

En la lista enlazada el corrimiento desaparece. Meter un nodo en su lugar es
un empalme, $\Theta(1)$, y ningún dato se mueve. La cuenta no cambia, de
todos modos: encontrar dónde va exige caminar desde la cabeza, y la vuelta $j$
puede recorrer $j$ nodos, así que el peor caso sigue siendo $\Theta(n^2)$. Se
cambió mover datos por seguir punteros, y son la misma cantidad de pasos.

Hay además algo que la enlazada no deja hacer. El ciclo interno va hacia
atrás, de `a[i]` a `a[i - 1]`, y un nodo sabe cuál es el siguiente y no cuál
es el anterior: ese recorrido no existe y hay que buscar desde el principio.
Bajar de $\Theta(n^2)$ pide otra idea, y no es acomodar un elemento a la vez.

## Ejercicios

### Contar los mayores

Una función que recibe una `Lista` enlazada y un `Elemento x`, y devuelve
cuántos elementos son mayores que `x`:

```cpp
int contarMayores(Lista &l, Elemento x) {
  int cuantos = 0;
  int i = 0;
  while (i < l.tamano()) {
    if (l.obtener(i) > x) {
      cuantos = cuantos + 1;
    }
    i = i + 1;
  }
  return cuantos;
}
```

Sobre $\langle 4, 9, 2, 7 \rangle$ responde 3 para $x = 3$ y 0 para $x = 9$.
La respuesta es correcta y el costo es el problema. `obtener(i)` camina $i$
pasos, y el ciclo lo llama con $i = 0, 1, \ldots, n-1$: en total
$0 + 1 + \cdots + (n-1) = \frac{n(n-1)}{2}$ pasos, $\Theta(n^2)$.

El mismo código sobre la lista estática es $\Theta(n)$, porque allí `obtener`
es $\Theta(1)$. Un recorrido que no cambió de forma cambió de orden de
crecimiento al cambiar lo que tiene debajo, y ese es el motivo por el que la
tabla de costos se mira antes de escribir el ciclo.

La segunda parte del ejercicio es escribir la versión que recorre con un
puntero, un solo paso por nodo, $\Theta(n)$ en tiempo y $\Theta(1)$ de espacio
aparte. Esa versión necesita el campo `cabeza`, así que vive dentro de la
clase: el contrato público no la deja escribir desde afuera.

### Dar vuelta la lista

Invertir la lista dando vuelta a los punteros, sin reservar nodos nuevos y sin
mover datos. Al terminar, la cabeza debe ser el que era último:
$\langle 5, 8, 4 \rangle$ queda $\langle 4, 8, 5 \rangle$.

Se necesitan tres punteros a la vez: el nodo actual, el que ya quedó dado
vuelta detrás de él y el siguiente, que hay que guardar antes de reescribir
`actual->siguiente`. Perder ese tercero es perder el resto de la lista. Una
sola pasada: $\Theta(n)$ en tiempo y $\Theta(1)$ aparte de la lista.

Vale la pena compararla con darla vuelta llamando `insertar(0, e)` sobre una
lista nueva. Recorriendo la original con un puntero, esa versión también es
$\Theta(n)$ en tiempo, pero reserva $n$ nodos y pide $\Theta(n)$ de espacio,
más la liberación de la lista vieja. Recorriéndola con `obtener(i)` sube a
$\Theta(n^2)$.

## Para practicar en casa

### Propuesto 1

Escriba `int buscar(Lista &l, Elemento x)` que devuelva la posición de la
primera aparición de `x`, o $-1$ si no está. ¿Cuánto cuesta en el mejor y en
el peor caso?

### Propuesto 2

Si la clase no guardara `n`, ¿cómo se obtiene `tamano()`? ¿En cuánto pasa a
costar, y qué otras operaciones se encarecen con ella?

### Propuesto 3

Agregue a cada nodo un campo `anterior`. ¿Qué operaciones bajan de costo y qué
tiene que mantener `insertar` que antes no mantenía?

### Propuesto 4

Escriba `insertarOrdenado(Lista &l, Elemento e)`, que deje la lista en orden si
ya lo estaba. ¿Qué cuesta ordenar $n$ elementos llamándola $n$ veces?

### Propuesto 5

Para $\langle 4, 3, 2, 1 \rangle$, ¿cuántos corrimientos hace insertion sort?
Compruébelo con la fórmula $\frac{n(n-1)}{2}$.

## Ejercicios interactivos

Seis actividades, una por tema de la sesión: los corrimientos que hace cada
`insertar` sobre la lista estática; el recorrido de nodos cuya condición es
`actual->siguiente != NULL` y las dos formas de liberar la cadena; `insertar`
paso a paso siguiendo `cabeza`, `anterior` y `nuevo`, con lo que queda si se
invierten las dos líneas del empalme; cuántos nodos visita `agregar` con y sin
puntero al último; qué implementación conviene a tres perfiles de uso
distintos; y la traza de insertion sort vuelta por vuelta. Están en la
[página de ejercicios interactivos](./Ejercicios.md). Los programas no son los
de la sesión: mismo tema, ronda nueva.

## Lo que sigue

Las variantes de la cadena. Qué compra un nodo que además guarde la dirección
del anterior, qué compra cerrar la cadena sobre sí misma, y qué cobra cada una
de las dos. Con eso llega la forma de ordenar que la lista enlazada hace
barata: partir en dos, ordenar cada mitad y mezclar las dos mitades ordenadas,
que baja el peor caso de $\Theta(n^2)$ a $\Theta(n \log n)$.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

**El nodo**

- [nodo.cpp](codigo/nodo.cpp) — tres nodos enlazados a mano, el recorrido que
  sigue la cadena hasta `NULL` y la liberación que guarda el siguiente antes
  de borrar.

**La lista enlazada**

- [lista.h](codigo/lista.h) — el TAD Lista con nodos: `insertar`, `eliminar`,
  `obtener`, `asignar`, `agregar`, el destructor y el `nodoEn` privado que
  comparten las operaciones.
- [lista_uso.cpp](codigo/lista_uso.cpp) — el mismo programa que corría sobre
  la implementación con arreglo, sin cambiar una línea.

**Agregar sin recorrer**

- [lista_cola.h](codigo/lista_cola.h) — la misma lista con un puntero al
  último nodo: `agregar` en $\Theta(1)$ y los dos casos que gana `eliminar`.
- [lista_cola_uso.cpp](codigo/lista_cola_uso.cpp) — las comprobaciones de los
  bordes: insertar al final, borrar el último y vaciar la lista.

**Los costos**

- [frente.cpp](codigo/frente.cpp) — insertar al frente $n$ veces en cada
  estructura, contando lo que mueve cada una.
- [contar_mayores.cpp](codigo/contar_mayores.cpp) — el recorrido con
  `obtener`, el que cuesta $\Theta(n^2)$ sobre la enlazada.

**Ordenar insertando**

- [insertion.cpp](codigo/insertion.cpp) — insertion sort con el contador de
  corrimientos, sobre una entrada mezclada, una ordenada y una al revés.

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 6, listas enlazadas.
- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Sección 2.1, insertion sort; sección
  10.2, listas enlazadas.
- N. Kalicharan. *Data Structures in C*, 2008. Listas enlazadas y sus
  operaciones con `malloc` y `free`.
- cppreference: `new` y `delete`.
  <https://en.cppreference.com/w/cpp/language/new>,
  <https://en.cppreference.com/w/cpp/language/delete>
