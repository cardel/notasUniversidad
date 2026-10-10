# Clase 18. El TAD Cola por dentro

Viernes 9 de octubre de 2026, de 14:00 a 17:00.

La cola que el curso viene usando vive en un arreglo que da la vuelta: al
desencolar no mueve nada, adelanta `inicio`, y al encolar escribe en
`(inicio + n) % CAPACIDAD`, de modo que las casillas que quedan atrás se
reutilizan. Las dos operaciones son $\Theta(1)$ y el precio es el techo fijo.
Esta sesión la construye sobre el TAD Lista, y ahí aparece lo que la pila no
mostraba: una cola entra por un extremo y sale por el otro, así que necesita
los dos baratos a la vez. De las cuatro combinaciones de lista y extremo, solo
una lo logra, y es la que guarda un puntero al último.

Al terminar, el objetivo es poder explicar por qué el residuo hace circular al
arreglo, mostrar que ninguna lista de un solo extremo barato sirve para una
cola, construirla sobre la lista con puntero al último y directamente sobre
nodos con las tres operaciones en $\Theta(1)$, escribir el invariante de
representación de cada versión, y decidir cuál implementación conviene según
se conozca o no el número máximo de elementos.

## Diapositivas

![](./clase18.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## La cola que ya tienen

### Una fila honesta

La cola es la fila del restaurante: quien llega se pone detrás del último y se
atiende al primero. Nadie se cuela y nadie sale por la mitad. El contrato lo
dice en una línea: lo primero que entra es lo primero que sale. A diferencia de
la pila, que atiende por un solo extremo, la cola usa dos, uno para entrar y
otro para salir, y ese detalle es el que decide todo lo que sigue.

### El arreglo que da la vuelta

La implementación con la que se viene trabajando guarda los elementos en un
arreglo, con un entero que marca dónde está el frente y otro que cuenta cuántos
hay.

```cpp
class Cola {
private:
  Elemento datos[CAPACIDAD];
  int inicio;   // posicion del frente
  int n;
public:
  void encolar(Elemento e) {
    assert(n < CAPACIDAD);
    datos[(inicio + n) % CAPACIDAD] = e;
    n = n + 1;
  }
```

```cpp
  // exige !vacia()
  void desencolar() {
    assert(n > 0);
    inicio = (inicio + 1) % CAPACIDAD;
    n = n - 1;
  }

  // exige !vacia()
  Elemento frente() {
    assert(n > 0);
    return datos[inicio];
  }
```

El frente está en `datos[inicio]` y el final en la casilla
$(\texttt{inicio} + n - 1) \bmod \texttt{CAPACIDAD}$. `desencolar` no mueve ni un elemento: adelanta `inicio` una
casilla y baja el contador. El elemento que salió sigue escrito en el arreglo,
pero ya no cuenta, y la casilla queda libre para el que llegue.

`encolar` escribe en la casilla que sigue al final, y ahí entra el residuo. Sin
el `% CAPACIDAD`, después de unas cuantas vueltas de encolar y desencolar la
cola llegaría al borde derecho del arreglo con las casillas de la izquierda
vacías y sin forma de usarlas. Con el residuo, la posición que sigue a la
última es la 0. Un arreglo no es circular, pero el residuo hace que trabaje como
si lo fuera.

### Con seis casillas

Con `CAPACIDAD` igual a 6, después de encolar seis elementos y desencolar tres,
quedan `inicio = 3` y `n = 3`: los elementos `d`, `e` y `f` están en las
casillas 3, 4 y 5, y las casillas 0, 1 y 2 están libres.

| casilla | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| contenido | | | | `d` | `e` | `f` |
| | | | | frente | | final |

El siguiente `encolar` escribe en $(3 + 3) \bmod 6 = 0$. La cola sigue en la
casilla 0 aunque empiece en la 3: el final quedó a la izquierda del frente, y la
cola se lee desde `inicio` hacia la derecha y vuelve a entrar por la izquierda.
Desencolar ahora deja `inicio` en 4, y cuando `inicio` llega a 5, el siguiente
`desencolar` lo devuelve a $(5 + 1) \bmod 6 = 0$.

### El invariante de representación

!!! note "Invariante de representación: la cola sobre arreglo circular"

    Sea $C = \texttt{CAPACIDAD}$ y sea $Q = \langle Q[0], \ldots, Q[n-1]
    \rangle$ la sucesión que el contrato de la cola nombra, escrita del frente
    hacia el final. Sea $\tau(x)$ el número de la llamada a `encolar` que metió
    el elemento $x$. Sea $\mathrm{Ocup}$ el conjunto de casillas ocupadas,

    $$
    \mathrm{Ocup} = \{\, (\texttt{inicio} + i) \bmod C \;:\; 0 \leq i < n \,\}.
    $$

    $$
    \begin{aligned}
      A_1:&\quad 0 \leq \texttt{inicio} < C\\
      A_2:&\quad 0 \leq n \leq C\\
      A_3:&\quad \forall i,\ 0 \leq i < n:\ Q[i] = \texttt{datos}[(\texttt{inicio} + i) \bmod C]\\
      A_4:&\quad \forall i, j,\ 0 \leq i < j < n:\ \tau(Q[i]) < \tau(Q[j])
    \end{aligned}
    $$

$A_3$ es el que liga `inicio`, `n` y las casillas ocupadas. Como los $n$ valores
$(\texttt{inicio} + i) \bmod C$ con $0 \leq i < n$ son distintos cuando
$n \leq C$, $A_2$ y $A_3$ juntos dan $|\mathrm{Ocup}| = n$: cada elemento de la
cola tiene su casilla y ninguna casilla guarda dos.

De ahí sale por qué `encolar` no pisa nada. Escribe en
$(\texttt{inicio} + n) \bmod C$, y la precondición $n < C$ hace que los $n + 1$
valores $(\texttt{inicio} + i) \bmod C$ con $0 \leq i \leq n$ sigan siendo
distintos, así que la casilla nueva no pertenece a $\mathrm{Ocup}$. Después de
la escritura, $n$ sube en uno y $A_3$ vale para el nuevo último índice, $n$, que
es justo la casilla escrita.

`desencolar` deja $\texttt{inicio}' = (\texttt{inicio} + 1) \bmod C$ y
$n' = n - 1$, y la cola nueva es $Q'[i] = Q[i + 1]$. $A_3$ exige
$Q'[i] = \texttt{datos}[(\texttt{inicio}' + i) \bmod C]$ para
$0 \leq i < n'$, y se cumple porque
$((\texttt{inicio} + 1) \bmod C + i) \bmod C = (\texttt{inicio} + 1 + i) \bmod C$,
que es la casilla de $Q[i + 1]$ según $A_3$ antes de la operación. $A_1$ se
mantiene porque un residuo módulo $C$ siempre cae entre 0 y $C - 1$.

$A_4$ es el contrato de la cola escrito en fórmula: si $Q[i]$ está más cerca del
frente que $Q[j]$, entró antes. Encolar pone al final al que acaba de entrar, que
tiene el $\tau$ más grande, y desencolar quita el primero; ninguna de las dos
desordena lo que queda.

### Lo que arrastra

Igual que la pila sobre arreglo: `CAPACIDAD` se fija al compilar, así que el
máximo hay que saberlo antes de correr el programa. Con capacidad 1000, el
elemento 1001 no se rechaza, detiene el programa en el `assert`. Y las casillas
vacías quedan reservadas aunque la cola tenga dos elementos.

## La cola necesita los dos extremos

### ¿Sirve lo que funcionó con la pila?

La pila se construyó sobre la lista usando un solo extremo, y con la enlazada
quedó en $\Theta(1)$ porque insertar y eliminar al frente son dos escrituras de
puntero. El extremo caro se dejaba sin usar. Con la cola eso ya no se puede: un
extremo es la entrada y el otro la salida, y los dos se usan en cada vuelta.

Sobre la lista hay dos decisiones: por cuál extremo entra y por cuál sale. Y hay
dos listas de abajo, la de arreglo y la enlazada. Lo que importa es que los dos
extremos sean baratos a la vez, no uno.

### Las cuatro combinaciones, con cuarenta

Con $n = 40$, encolando los cuarenta y después desencolándolos, la cuenta se
hace a mano. Se cuentan los elementos que se corren en el arreglo y los nodos
que se visitan en la enlazada.

**Arreglo, entrando por el final.** Encolar escribe en la casilla `n`, que ya
está libre: 0 corrimientos en las cuarenta llamadas. El costo aparece al salir.
Desencolar es `eliminar(0)`, y con $m$ elementos adentro cerrar el hueco de la
posición 0 corre los $m - 1$ que siguen. El primer `desencolar` encuentra 40 y
corre 39, el segundo corre 38, y el último encuentra uno solo y no corre nada:

$$
39 + 38 + \cdots + 1 + 0 = \sum_{k=0}^{39} k = \frac{39 \cdot 40}{2} = 780.
$$

**Arreglo, entrando por el frente.** Es la misma cuenta al revés. Encolar es
`insertar(0, e)`, y con $m$ elementos adentro abrir hueco en la posición 0 corre
los $m$. El primero entra a un arreglo vacío y no corre nada, el segundo corre
1, y el cuadragésimo corre 39: otra vez $0 + 1 + \cdots + 39 = 780$. Desencolar
quita el último, que no obliga a correr nada.

**Lista enlazada simple.** Salir por el frente es gratis: la cabeza pasa al
siguiente. Entrar por el final exige caminar hasta el último nodo, y la única
dirección guardada es la de la cabeza. Con $m$ nodos, el recorrido arranca en la
cabeza y da $m - 1$ pasos hasta el último, que es al que se engancha el nuevo.
El primer `encolar` encuentra la lista vacía y el nodo pasa a ser la cabeza: 0
pasos. El segundo encuentra un nodo, que ya es el último: 0 pasos. El tercero da
1, y el cuadragésimo encuentra 39 nodos y da 38:

$$
0 + 0 + 1 + 2 + \cdots + 38 = \sum_{k=0}^{38} k = \frac{38 \cdot 39}{2} = 741.
$$

La diferencia con el arreglo es 39, uno por cada inserción a partir de la
segunda: el recorrido se detiene en el último nodo y no tiene que pasar por
encima de él, mientras el corrimiento del arreglo mueve todo lo que hay.

**Lista enlazada con puntero al último.** Encolar se engancha a `ultimo` sin
caminar y desencolar mueve la cabeza. Ninguna de las dos visita un nodo: 0.

`extremos_cola.cpp` repite la cuenta, contando los elementos que se corren y los
nodos que se visitan:

| $n$ | arreglo, entra al final | arreglo, entra al frente | enlazada simple | enlazada con último |
|---:|---:|---:|---:|---:|
| 40 | 780 | 780 | 741 | 0 |
| 100 | 4950 | 4950 | 4851 | 0 |
| 1000 | 499 500 | 499 500 | 498 501 | 0 |
| 10000 | 49 995 000 | 49 995 000 | 49 985 001 | 0 |

Las dos columnas del arreglo son $\frac{(n-1)\,n}{2}$ y la de la enlazada simple
es $\frac{(n-2)(n-1)}{2}$; con $n = 100$ dan $\frac{99 \cdot 100}{2} = 4950$ y
$\frac{98 \cdot 99}{2} = 4851$. Multiplicar $n$ por diez multiplica por cien
esas tres columnas, que es la firma de $\Theta(n^2)$ sobre $2n$ operaciones, o
sea $\Theta(n)$ por operación. La última columna es cero exacto.

### Por qué solo una sirve

En el arreglo, se escoja lo que se escoja, uno de los dos extremos es la
posición 0, y por ahí entrar o salir obliga a correr todo. La enlazada simple
sale gratis por el frente pero entra caro por el final, porque hay que caminar.
La lista con puntero al último pone en $\Theta(1)$ por el final y quita en
$\Theta(1)$ por el frente: es la única de las cuatro donde los dos extremos de
la cola caen sobre las dos operaciones baratas.

Con un solo extremo barato, el costo total de encolar y desencolar $n$ veces es
cuadrático. Con la pila bastaba escoger bien el extremo; con la cola hay que
escoger bien la lista.

## La cola sobre la lista enlazada

### Cinco llamadas

El frente es la posición 0 y el final es el último. La lista con puntero al
último ya tiene las dos operaciones en $\Theta(1)$, y la cola queda en cinco
llamadas.

```cpp
class Cola {
private:
  Lista l;

public:
  void encolar(Elemento e) {
    l.agregar(e);
  }

  // exige !vacia()
  void desencolar() {
    assert(!vacia());
    l.eliminar(0);
  }
```

```cpp
  // exige !vacia()
  Elemento frente() {
    assert(!vacia());
    return l.obtener(0);
  }

  int tamano() {
    return l.tamano();
  }

  bool vacia() {
    return l.vacia();
  }
};
```

Las tres operaciones son $\Theta(1)$ por lo que hace la lista debajo. `agregar`
se engancha al nodo que apunta `ultimo` sin recorrer. `eliminar(0)` mueve la
cabeza al siguiente. `obtener(0)` llama a `nodoEn(0)`, que devuelve la cabeza
sin dar un paso. La cola no escribe un solo `new`, un `delete` ni un puntero, y
tampoco destructor: el de la lista libera los nodos.

La lista que queda debajo es [lista_cola.h](codigo/lista_cola.h), la lista
enlazada con el campo `ultimo` además de `cabeza`. Ese campo cobra en una sola
parte del código: cuando `eliminar(0)` saca el único nodo, `ultimo` tiene que
volver a `NULL`.

```cpp
if (p == 0) {
  muerto = cabeza;
  cabeza = cabeza->siguiente;
  if (cabeza == NULL) {
    ultimo = NULL;          // la lista quedo vacia
  }
}
```

### La traza

Encolando 5, 8 y 2, desencolando una vez, encolando 9, vaciando la cola y
encolando 1:

| Operación | La cadena, del frente al final | `frente()` | `tamano()` |
|---|---|---:|---:|
| `encolar(5)` | 5 | 5 | 1 |
| `encolar(8)` | 5, 8 | 5 | 2 |
| `encolar(2)` | 5, 8, 2 | 5 | 3 |
| `desencolar()` | 8, 2 | 8 | 2 |
| `encolar(9)` | 8, 2, 9 | 8 | 3 |
| tres `desencolar()` | vacía | | 0 |
| `encolar(1)` | 1 | 1 | 1 |

El 5 entró primero y sale primero; el 9, que entró último, espera detrás del 2.
La última fila es la cola que se vació y volvió a servir, y es el caso donde la
implementación se rompe si `ultimo` no vuelve a `NULL`: el `encolar(1)` se
engancharía a un nodo que ya se liberó. `cola_uso.cpp` corre ese programa e
imprime `5 3`, `8 2`, `8 2 9` y `1 1 0`: frente y tamaño tras los tres primeros
`encolar`, lo mismo tras el `desencolar`, el orden en que salen los tres que
quedan, y frente, tamaño y `vacia()` después de volver a encolar.

Sobre la enlazada simple, la misma traza cuesta otra cosa. Cada `encolar` camina
desde la cabeza hasta el último nodo antes de engancharse: para poner el 2 hay
que pasar por el 5 y llegar al 8, y para poner el 9 hay que pasar por el 8 y
llegar al 2. Con la simple, insertar al final es recorrer, y el puntero al
último es lo que quita ese recorrido.

### El invariante de representación

!!! note "Invariante de representación: la cola sobre la lista"

    $Q$, $n$ y $\tau$ son los de la cola sobre arreglo. Sea
    $L = \langle L[0], \ldots, L[m-1] \rangle$ la sucesión que el contrato de
    la lista nombra, con $m = \texttt{l.tamano}()$, y sea
    $\mathrm{Inv}_L(\texttt{l})$ la conjunción de los invariantes de la lista
    enlazada con puntero al último.

    $$
    \begin{aligned}
      K_1:&\quad n = m\\
      K_2:&\quad \forall i,\ 0 \leq i < n:\ Q[i] = L[i]\\
      K_3:&\quad \forall i, j,\ 0 \leq i < j < n:\ \tau(Q[i]) < \tau(Q[j])\\
      K_4:&\quad \mathrm{Inv}_L(\texttt{l})
    \end{aligned}
    $$

$K_1$ y $K_2$ dicen que la cola no guarda estado propio: la sucesión de la cola
es la de la lista leída desde la posición 0. $K_3$ es el contrato, y frente al
de la pila cambia el sentido de la desigualdad: en la pila el que está arriba
entró después, en la cola el que está adelante entró antes. `agregar` mantiene
$K_3$ porque pone al final el elemento con el $\tau$ más grande. $K_4$ queda a
cargo de la lista, y la única forma de romperlo desde la cola es llamarla fuera
de su precondición. Por eso el `assert(!vacia())` va en la cola: sin él, un
`desencolar` sobre la cola vacía haría saltar el `assert` de `eliminar`, con un
mensaje que habla de una posición `p` que quien usa la cola nunca escribió.

### Por qué al revés no funciona

La otra decisión parece simétrica: que la cola entre por el frente y salga por
el final, sobre la misma lista con puntero al último. Entrar sí es barato:
insertar en la posición 0 son dos escrituras de puntero, $\Theta(1)$. Salir no.
Eliminar el último exige reescribir el campo `siguiente` del penúltimo, y
guardar el último no dice quién es el penúltimo.

Con la cadena 5, 8, 2 y `ultimo` en el 2, quitar el 2 obliga a dejar el campo
`siguiente` del 8 en `NULL`. Desde el 2 no se llega al 8, porque los enlaces van
hacia adelante; hay que salir de la cabeza y recorrer hasta él. Es
$\Theta(n)$, y después hay que mover `ultimo` al 8.

Guardar un puntero a un extremo sirve para poner ahí, no para quitar de ahí.
Quitar necesita llegar al anterior, y eso solo lo da el campo `anterior` de la
lista doblemente enlazada.

## Sin la lista de por medio

### La cadena con los dos extremos

La cola solo toca los dos extremos de la lista. Nunca pide una posición del
medio, así que `nodoEn` no camina, y `insertar`, `asignar` y la mitad de
`eliminar` no se ejecutan. La cadena se puede escribir directamente, guardando
los dos extremos.

```cpp
class Cola {
private:
  Nodo *cabeza;
  Nodo *ultimo;
  int n;

public:
  Cola() {
    cabeza = NULL;
    ultimo = NULL;
    n = 0;
  }
```

```cpp
  void encolar(Elemento e) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    nuevo->siguiente = NULL;
    if (ultimo == NULL) {
      cabeza = nuevo;
    } else {
      ultimo->siguiente = nuevo;
    }
    ultimo = nuevo;
    n = n + 1;
  }
```

`encolar` reserva el nodo, lo deja apuntando a `NULL` porque va a ser el último,
y lo engancha. Con la cola vacía no hay último al que colgarse, así que el nodo
nuevo es a la vez cabeza y último. Con elementos, son dos escrituras: el
`siguiente` del último deja de ser `NULL` y apunta al nuevo, y `ultimo` pasa al
nuevo.

La pregunta se hace sobre `ultimo`, que es el extremo por el que se entra, y eso
obliga a que `ultimo` diga la verdad siempre:

$$
\texttt{cabeza} = \texttt{NULL} \iff \texttt{ultimo} = \texttt{NULL}.
$$

```cpp
  // exige !vacia()
  void desencolar() {
    assert(!vacia());
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    if (cabeza == NULL) {
      ultimo = NULL;
    }
    delete muerto;
    n = n - 1;
  }
```

`desencolar` es la eliminación al frente de la pila sobre nodos, con una línea
más. Primero se guarda la dirección del nodo que sale, después se mueve `cabeza`
al siguiente y solo al final se libera, porque leer `cabeza->siguiente` de un
nodo ya liberado es leer un puntero colgante.

!!! warning "El caso que rompe la cola"

    Al sacar el único elemento, `cabeza` queda en `NULL` pero `ultimo` seguiría
    apuntando al nodo que acaba de liberarse. El siguiente `encolar` vería
    `ultimo` distinto de `NULL` y escribiría `ultimo->siguiente` sobre memoria
    devuelta, y el nodo nuevo quedaría colgado de un nodo que ya no existe, con
    `cabeza` en `NULL`. Por eso `ultimo` vuelve a `NULL` en el mismo paso.
    Cuando se hace `delete`, se actualizan los punteros que apuntaban a ese nodo.

Con más de un elemento, `desencolar` escribe un solo puntero de la clase,
`cabeza`. Con uno solo escribe dos, `cabeza` y `ultimo`. El destructor recorre
la cadena con el mismo par de líneas, guardar y avanzar antes de liberar, hasta
que `cabeza` vale `NULL`. El archivo completo es
[cola_nodos.h](codigo/cola_nodos.h).

### La traza

`encolar(5)`, `encolar(8)`, `desencolar()` y `desencolar()`:

| Operación | La cadena | `cabeza` | `ultimo` | `n` |
|---|---|---|---|---:|
| `encolar(5)` | 5 | 5 | 5 | 1 |
| `encolar(8)` | 5 → 8 | 5 | 8 | 2 |
| `desencolar()` | 8 | 8 | 8 | 1 |
| `desencolar()` | vacía | `NULL` | `NULL` | 0 |

Sale por donde está `cabeza` y entra por donde está `ultimo`. Los dos extremos
se tocan sin recorrer nada. En la tercera fila `cabeza` y `ultimo` apuntan al
mismo nodo; en la cuarta, el `if` del `desencolar` es el que deja `ultimo` en
`NULL`.

### El invariante de representación

!!! note "Invariante de representación: la cola sobre nodos"

    Sea $\mathrm{Alc}$ el conjunto de nodos que se alcanzan desde `cabeza`
    siguiendo el campo `siguiente` un número finito de veces, y sea
    $v_0, v_1, \ldots$ la sucesión definida por $v_0 = \texttt{cabeza}$ y
    $v_{i+1} = v_i\texttt{->siguiente}$ mientras $v_i \neq \texttt{NULL}$.
    $Q$ y $\tau$ son los de la cola sobre arreglo.

    $$
    \begin{aligned}
      N_1:&\quad |\mathrm{Alc}| = n\\
      N_2:&\quad \forall i, j,\ 0 \leq i < j < n:\ v_i \neq v_j\\
      N_3:&\quad n > 0 \implies \big(\texttt{ultimo} = v_{n-1} \,\wedge\, v_{n-1}\texttt{->siguiente} = \texttt{NULL}\big)\\
      N_4:&\quad n = 0 \iff \big(\texttt{cabeza} = \texttt{NULL} \,\wedge\, \texttt{ultimo} = \texttt{NULL}\big)\\
      N_5:&\quad \forall i,\ 0 \leq i < n:\ Q[i] = v_i\texttt{->dato}\\
      N_6:&\quad \forall i, j,\ 0 \leq i < j < n:\ \tau(Q[i]) < \tau(Q[j])
    \end{aligned}
    $$

$N_1$ y $N_2$ son los de la pila sobre nodos con `cabeza` en el papel de la
cima. $N_3$ es lo que agrega la cola: `ultimo` no es un nodo cualquiera, es el
$v_{n-1}$ de la cadena. `encolar` lo mantiene porque el nodo nuevo, que apunta a
`NULL`, queda enganchado detrás de $v_{n-1}$ y pasa a ser $v_n$, y en la línea
siguiente `ultimo` se mueve a él.

$N_4$ es la equivalencia que `encolar` necesita para preguntar por `ultimo` en
vez de por `cabeza`. El `desencolar` sin el `if` la rompe al sacar el único
nodo: deja $n = 0$ y `cabeza` en `NULL` con `ultimo` distinto de `NULL`. El
programa no aborta ahí; el error aparece en el `encolar` siguiente, lejos de la
línea que lo causó.

### Cuál de las dos escribir

Las dos versiones imprimen lo mismo con `cola_uso.cpp`, que se compila una vez
con cada cabecera. La comparación es la misma de la pila: la cola sobre la lista
son cinco llamadas sin un puntero a la vista y hereda el destructor, pero su
costo depende de que la lista de abajo guarde el último; la directa sobre nodos
son unas setenta líneas con `new` y `delete`, el costo está a la vista en el
código y no arrastra operaciones de la lista que la cola no usa.

## Lo que cobra cada operación

### Las tres colas que sirven

$n$ es el número de elementos en la cola.

| Operación | Arreglo circular | Sobre la lista con último | Directa sobre nodos | Por qué |
|---|---|---|---|---|
| `encolar(e)` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | se escribe la casilla $(\texttt{inicio} + n) \bmod C$ / `agregar` se engancha a `ultimo` / lo mismo sin el salto de llamada |
| `desencolar()` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | se adelanta `inicio` con el residuo / `eliminar(0)` mueve la cabeza / se mueve `cabeza` y se libera un nodo |
| `frente()` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | se lee `datos[inicio]` / `obtener(0)` no camina / se lee `cabeza->dato` |
| `tamano()`, `vacia()` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | el contador está guardado en las tres |
| construir la cola vacía | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | contadores en 0 y punteros en `NULL` |
| liberar la estructura | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | el arreglo se va solo / un `delete` por nodo |
| espacio de la estructura | $\Theta(\texttt{CAPACIDAD})$ | $\Theta(n)$ | $\Theta(n)$ | casillas reservadas de antemano / un nodo por elemento |
| espacio por elemento | el dato | 16 bytes | 16 bytes | el entero, el puntero `siguiente` y el relleno que la alineación del puntero obliga a dejar |
| espacio aparte por operación | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | índices y punteros sueltos |
| techo de elementos | `CAPACIDAD`, fijado al compilar | la memoria | la memoria | el arreglo se dimensiona antes de correr |

El arreglo circular no mueve nada: adelanta `inicio` y calcula el residuo. Es
$\Theta(1)$ en las dos operaciones y paga con un techo fijo. Las dos enlazadas
son $\Theta(1)$ sin techo y pagan un puntero por elemento: `sizeof(Nodo)` da 16
bytes, de los cuales el dato ocupa 4.

### Las dos que no sirven

| Operación | Lista sobre arreglo | Lista enlazada simple | Por qué |
|---|---|---|---|
| `encolar(e)` | $\Theta(1)$ | $\Theta(n)$ | el arreglo escribe en la casilla `n` / la simple camina hasta el último |
| `desencolar()` | $\Theta(n)$ | $\Theta(1)$ | sacar el primero corre todo lo demás / la cabeza pasa al siguiente |
| `frente()` | $\Theta(1)$ | $\Theta(1)$ | el frente es la posición 0 en las dos |
| espacio de la estructura | $\Theta(\texttt{CAPACIDAD})$ | $\Theta(n)$ | casillas reservadas / un nodo por elemento |

La lista sobre arreglo entra barato por el final y sale caro por el frente. La
enlazada simple es lo contrario. Guardar el último arregla justo la mitad que le
falta a la simple y deja las dos operaciones en $\Theta(1)$. Si la lista sobre
arreglo entra por el frente, las columnas se cambian y el resultado no mejora:
siempre uno de los dos extremos es la posición 0.

### Cuál escoger

Entre las tres que sirven, las cotas de tiempo son las mismas y la decisión
está en las filas de espacio y de techo. Si se sabe de antemano cuántos
elementos van a estar en la cola al mismo tiempo, el arreglo circular gana: con
ese máximo como `CAPACIDAD` el techo no estorba, y cada elemento ocupa solo su
dato, sin el puntero. Si el máximo no se conoce, o los picos son mucho mayores
que el uso normal, la enlazada con puntero al último es la única que da las dos
operaciones baratas sin límite, a cambio de los 16 bytes por elemento. La
enlazada simple no entra en la discusión: encolar le cuesta $\Theta(n)$.

## Para el juez

*UVa 540 — Team Queue*, <https://onlinejudge.org/external/5/540.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=481>.

Una fila donde cada quien se pone detrás del último de su equipo. Con 200 000
órdenes, una cola que cueste $\Theta(n)$ por operación no entra en el tiempo:
las dos tienen que ser $\Theta(1)$.

### Qué pide

Cada persona pertenece a un equipo. Quien llega se pone detrás del último de su
equipo si ya hay alguien de su equipo en la fila, y si no, al final de todo.
`ENQUEUE x` mete a la persona `x`, `DEQUEUE` saca a quien esté al frente e
imprime su número, y `STOP` cierra el escenario. Hay hasta 1000 equipos por caso
y hasta 200 000 órdenes; el archivo termina con un escenario de cero equipos, y
cada escenario lleva el encabezado `Scenario #k` y una línea en blanco después.

Es la fila del restaurante organizada por carreras. Si en la fila hay
estudiantes de Ingeniería de Sistemas y llega uno de Industrial sin compañeros
en la fila, se pone al final; el siguiente de Industrial que llegue ya no va al
final, se pone detrás de su compañero. Las carreras quedan en el orden en que
llegó su primer estudiante, y dentro de cada carrera se atiende en orden de
llegada.

### El segundo escenario del ejemplo, trazado

El equipo A es {259001, …, 259005} y el equipo B es {260001, …, 260006}. La
columna de la derecha es la fila completa, con los equipos separados por `|`:

| Orden | Cola de equipos | Fila |
|---|---|---|
| `ENQUEUE 259001` | A | 259001 |
| `ENQUEUE 260001` | A, B | 259001 \| 260001 |
| `ENQUEUE 259002` … `259005` | A, B | 259001 259002 259003 259004 259005 \| 260001 |
| `DEQUEUE`, `DEQUEUE` | A, B | 259003 259004 259005 \| 260001 |
| `ENQUEUE 260002`, `260003` | A, B | 259003 259004 259005 \| 260001 260002 260003 |
| cuatro `DEQUEUE` | B | 260002 260003 |

Los seis `DEQUEUE` imprimen 259001, 259002, 259003, 259004, 259005 y 260001,
que es la salida del enunciado. Los cuatro que llegaron del equipo A después del
260001 salen antes que él, porque se pusieron detrás del 259001.

### Cómo atacarlo con la cola

Una cola de equipos y una cola por equipo: $t + 1$ colas para $t$ equipos. Al
encolar a alguien se mira si su equipo ya tiene gente en su cola. Si la tiene,
la persona entra ahí. Si no, el equipo entra al final de la cola de equipos y la
persona a la cola de su equipo. Al desencolar sale el frente de la cola del
equipo que está al frente de la cola de equipos, y si ese equipo queda vacío,
sale de la cola de equipos.

Para saber en qué equipo está cada persona sin recorrer, se usa un arreglo
indexado por el número de la persona, que va de 0 a 999 999: `equipo[x]` da el
equipo de `x` en $\Theta(1)$. Son un millón de enteros, unos 4 MB, reservados
aunque el caso tenga seis personas; es el precio de no recorrer, y es la idea de
las tablas de direccionamiento directo, un tema que el curso trata más adelante.
Las colas de los equipos van en un arreglo de mil colas indexado por el número del
equipo, así que llegar a la cola de un equipo también es $\Theta(1)$.

Cada orden hace un número fijo de operaciones de cola y de accesos a arreglo.
Con colas $\Theta(1)$, el escenario cuesta $\Theta(p + o)$ en tiempo, con $p$
personas leídas y $o$ órdenes, y el espacio es el del arreglo de equipos más un
nodo por persona en la fila.

!!! warning "Las trampas"

    Con 200 000 órdenes, una cola que cueste $\Theta(n)$ por operación da
    $\Theta(n^2)$: del orden de $200\,000^2 = 4 \cdot 10^{10}$ pasos, cuando una
    referencia práctica de los jueces es que unos $10^8$ pasos simples ya
    llegan al límite de tiempo. Las dos operaciones tienen que ser
    $\Theta(1)$, y por eso la cola de la sesión es la de nodos con puntero al
    último.

    Hay que saber en qué equipo está cada persona sin recorrer la lista de
    equipos: para eso es el arreglo `equipo`.

    Un equipo que se vacía y vuelve a recibir gente entra otra vez al final de
    la cola de equipos, no a su puesto anterior: la carrera que se quedó sin
    nadie en la fila y vuelve hace la fila de nuevo.

En el juez se envía un solo archivo, así que la clase `Cola` de
`cola_nodos.h` se pega dentro del fuente en lugar del `#include`, sin las
líneas `#ifndef`, `#define` y `#endif`.

### Más problemas de cola

De más accesible a más exigente. Las diapositivas traen, para cada uno, qué pide, cómo atacarlo y la trampa del enunciado.

- *UVa 10935 — Throwing cards away I*, <https://onlinejudge.org/external/109/10935.pdf>. Envío en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1876>. Una sola cola: se descarta el frente y el siguiente pasa al final.
- *UVa 11034 — Ferry Loading IV*, <https://onlinejudge.org/external/110/11034.pdf>. Envío en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1975>. Dos colas, una por orilla; el ferri mide en metros y los carros en centímetros.
- *UVa 12100 — Printer Queue*, <https://onlinejudge.org/external/121/12100.pdf>. Envío en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3252>. Una cola de posiciones y un arreglo de prioridades; solo una mayor manda al final.
- *UVa 10901 — Ferry Loading III*, <https://onlinejudge.org/external/109/10901.pdf>. Envío en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1842>. Dos colas con tiempo de llegada; la salida va en el orden de la entrada.
- *UVa 11995 — I Can Guess the Data Structure!*, <https://onlinejudge.org/external/119/11995.pdf>. Envío en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3146>. Pila, cola y cola de prioridad simuladas a la vez; puede no ser ninguna o ser varias.

### UVa 10935 — Throwing cards away I

Un mazo de $n \leq 50$ cartas, de la 1 arriba a la $n$ abajo. Mientras queden
dos o más, se bota la de arriba y la siguiente pasa al fondo. Hay que imprimir
las cartas botadas, en orden, y la que queda. La entrada termina con un 0.

El mazo es una cola: el frente es la carta de arriba y el final, la de abajo.
Botar es desencolar; pasar al fondo es leer el frente, encolarlo y desencolarlo.
Con $n = 7$, que es el primer caso del ejemplo, la cola del frente al final en
cada vuelta:

| Vuelta | Mazo antes | Se bota | Pasa al fondo | Mazo después |
|---:|---|---:|---:|---|
| 1 | 1 2 3 4 5 6 7 | 1 | 2 | 3 4 5 6 7 2 |
| 2 | 3 4 5 6 7 2 | 3 | 4 | 5 6 7 2 4 |
| 3 | 5 6 7 2 4 | 5 | 6 | 7 2 4 6 |
| 4 | 7 2 4 6 | 7 | 2 | 4 6 2 |
| 5 | 4 6 2 | 4 | 6 | 2 6 |
| 6 | 2 6 | 2 | 6 | 6 |

Se botan 1, 3, 5, 7, 4 y 2, y queda el 6, que es la salida del enunciado:

```
Discarded cards: 1, 3, 5, 7, 4, 2
Remaining card: 6
```

En la primera pasada por el mazo se botan las impares, porque cada par viene
detrás de una impar y pasa al fondo. Como 7 es impar, la carta que sigue al 7 es
el 2, que pasa al fondo, y la segunda pasada corre sobre 4, 6 y 2: se bota el 4,
el 6 se va al fondo, se bota el 2 y queda el 6. Cada vuelta cuesta $\Theta(1)$ y hay $n - 1$ vueltas, así que el caso
cuesta $\Theta(n)$ en tiempo y en espacio.

!!! warning "La trampa"

    La salida exige `Discarded cards:` seguido de las cartas separadas por coma
    y espacio, y ninguna línea puede terminar en espacio. La primera carta no
    lleva coma antes, y la solución lleva una bandera para saber si ya imprimió
    alguna. Con $n = 1$ no se bota nada: la primera línea queda en
    `Discarded cards:`, sin espacio después de los dos puntos, y la segunda es
    `Remaining card: 1`.

### UVa 11034 — Ferry Loading IV

Un ferri de $l$ metros arranca en la orilla izquierda. Cada carro llega a una
orilla con su longitud. En cada orilla el ferri carga, en orden de llegada, los
carros que caben en una sola fila, y hay que decir cuántas veces cruza el río
hasta llevarlos a todos.

Una cola por orilla, con las longitudes en orden de llegada. En la orilla donde
está el ferri se desencola mientras el frente quepa en lo que queda de cubierta,
y luego se cruza. Cada carro entra y sale una vez en $\Theta(1)$, así que el
caso cuesta $\Theta(m)$ con $m$ carros, más los cruces.

!!! warning "Las trampas"

    El ferri mide $l$ en metros y los carros vienen en centímetros: la
    capacidad es $100\,l$. Se carga en orden de llegada, así que si el frente
    no cabe no se salta a uno más pequeño de atrás. Si la orilla actual está
    vacía y la otra tiene carros, el ferri cruza vacío, y ese cruce también
    cuenta.

### UVa 12100 — Printer Queue

Una cola de $n \leq 100$ trabajos con prioridad de 1 a 9. Se saca el primero; si
queda alguno de prioridad mayor, vuelve al final sin imprimirse, y si no, se
imprime en un minuto. Dada la posición $m$ del trabajo propio, contada desde 0,
hay que decir en qué minuto termina de imprimirse.

La cola guarda la posición original de cada trabajo, y un arreglo aparte guarda
su prioridad: así el trabajo propio no se pierde de vista cuando da vueltas.
Sacar y reencolar cuesta $\Theta(1)$. Para saber si hay uno de prioridad mayor
sin recorrer la cola basta un arreglo de nueve contadores, uno por prioridad,
que se descuenta al imprimir.

!!! warning "Las trampas"

    Dos trabajos con la misma prioridad que el propio no se distinguen por el
    valor; hay que seguir la posición original. Solo una prioridad
    estrictamente mayor manda al final, una igual no. Los minutos cuentan solo
    trabajos impresos, incluido el propio; reencolar no gasta tiempo.

### UVa 10901 — Ferry Loading III

Un ferri lleva hasta $n$ carros y tarda $t$ minutos en cruzar. Arranca en la
orilla izquierda. Llegan $m$ carros, cada uno con su minuto de llegada y su
orilla, con los tiempos en orden no decreciente, y hay que decir a qué hora
llega cada carro a la otra orilla. Los tres valores van hasta 10 000.

Una cola por orilla, con el índice del carro en la entrada, y un arreglo de
respuestas indexado por ese mismo índice. En cada paso se cargan hasta $n$
carros que ya llegaron a la orilla del ferri. Cada carro entra y sale una vez
en $\Theta(1)$: el caso cuesta $\Theta(m)$ en tiempo y en espacio.

!!! warning "Las trampas"

    Se carga solo a quien ya llegó; si nadie espera en ninguna orilla, el reloj
    salta a la siguiente llegada. Si los que esperan están en la otra orilla,
    el ferri cruza vacío y gasta $t$ minutos. La salida va en el orden de la
    entrada, no en el orden en que cruzan, y por eso el índice viaja en la
    cola. Entre casos va una línea en blanco, y después del último no.

### UVa 11995 — I Can Guess the Data Structure!

Una bolsa con dos órdenes: `1 x` mete `x` y `2 x` saca un elemento y dice que
salió `x`. Con $n \leq 1000$ órdenes por caso, hay que decidir si la bolsa es
una pila, una cola o una cola de prioridad que saca el mayor. La entrada termina
en fin de archivo.

Se simulan las tres a la vez, con una bandera por estructura. Cada orden se
aplica a las tres, y la que no devuelve el `x` anunciado se descarta. La pila y
la cola sacan en $\Theta(1)$. La cola de prioridad todavía no se ha construido,
y con $n \leq 1000$ basta buscar el máximo recorriendo, en $\Theta(n)$ por
extracción, lo que da $O(n^2)$ por caso.

!!! warning "Las trampas"

    Pueden quedar varias estructuras posibles a la vez, y la respuesta es
    `not sure`; si no queda ninguna, es `impossible`. Una orden `2 x` puede
    llegar con la bolsa vacía: sacar de una estructura vacía la descarta, y el
    programa no puede leer fuera de ella. Una vez descartada una estructura,
    las órdenes siguientes del caso se siguen leyendo hasta el final.

### Soluciones

Cada una lee la entrada de ejemplo del enunciado y reproduce su salida: `./sol < uvaNNNN.in`. Se apoyan en la cola de la sesión, [cola_nodos.h](codigo/cola_nodos.h); la del 11995 usa además la pila de nodos, [pila_nodos.h](codigo/pila_nodos.h).

- UVa 540 — Team Queue: [uva540.cpp](codigo/uva540.cpp), [entrada](codigo/uva540.in), [salida](codigo/uva540.out)
- UVa 10935 — Throwing cards away I: [uva10935.cpp](codigo/uva10935.cpp), [entrada](codigo/uva10935.in), [salida](codigo/uva10935.out)
- UVa 11034 — Ferry Loading IV: [uva11034.cpp](codigo/uva11034.cpp), [entrada](codigo/uva11034.in), [salida](codigo/uva11034.out)
- UVa 12100 — Printer Queue: [uva12100.cpp](codigo/uva12100.cpp), [entrada](codigo/uva12100.in), [salida](codigo/uva12100.out)
- UVa 10901 — Ferry Loading III: [uva10901.cpp](codigo/uva10901.cpp), [entrada](codigo/uva10901.in), [salida](codigo/uva10901.out)
- UVa 11995 — I Can Guess the Data Structure!: [uva11995.cpp](codigo/uva11995.cpp), [entrada](codigo/uva11995.in), [salida](codigo/uva11995.out)

## Ejercicios

### La cola circular de nodos

Cierre la cadena de la cola sobre sí misma, como la lista circular, y guarde
solo un puntero al último.

1. Con `ultimo` guardado y la cadena circular, ¿cómo se llega al frente?
2. Escriba `encolar` y `desencolar`. ¿Cuánto cuestan?
3. ¿Cuántos punteros guarda la clase, contra los dos de la cola sobre nodos?
4. ¿Qué caso especial queda?

El frente es `ultimo->siguiente`: un paso, porque en la cadena circular el
último apunta al primero. `encolar` empalma el nodo nuevo entre `ultimo` y el
frente, es decir, el nuevo apunta a `ultimo->siguiente`, `ultimo->siguiente`
pasa a apuntar al nuevo, y `ultimo` se mueve al nuevo. `desencolar` empalma
`ultimo->siguiente` sobre el nodo que sigue al frente y libera el frente. Las
dos son $\Theta(1)$ y la clase guarda un puntero en vez de dos.

El caso especial es el de siempre. Con un solo nodo, ese nodo se apunta a sí
mismo: es el último y es el frente. Al encolar sobre la cola vacía el nodo nuevo
se apunta a sí mismo, y al sacarlo `ultimo` vuelve a `NULL`.

### La cola con dos pilas

Implemente una cola usando únicamente dos pilas y sus operaciones. `encolar`
apila en la primera; `desencolar` saca de la segunda, y cuando la segunda está
vacía, vuelca toda la primera en ella antes de sacar.

1. ¿Por qué volcar una pila en otra deja los elementos en el orden de la cola?
2. ¿Cuánto cuesta un `desencolar` que encuentra la segunda vacía? ¿Y uno que la
   encuentra con elementos?
3. Encolando $n$ y desencolando $n$, ¿cuántas operaciones de pila se hacen en
   total?
4. ¿Cuánto cuesta entonces cada operación en promedio?

En la primera pila el tope es el que llegó último, así que la pila guarda el
orden invertido respecto de la llegada. Volcar la invierte otra vez, y dos
inversiones dejan el orden original: en la segunda pila el tope es el que llegó
primero. Con 1, 2 y 3 encolados, la primera tiene el 3 arriba; volcada, la
segunda tiene el 1 arriba, que es el frente.

Un `desencolar` que vuelca cuesta $\Theta(k)$ con $k$ elementos en la primera
pila; uno que no vuelca, $\Theta(1)$. Pero cada elemento se apila dos veces y se
desapila dos veces en toda su vida, una en cada pila, así que $n$ `encolar` y
$n$ `desencolar` hacen $4n$ operaciones de pila. Repartidas entre las $2n$
llamadas, salen dos por llamada: el costo amortizado es $\Theta(1)$, aunque una
llamada suelta pueda costar $\Theta(n)$.

El peor caso de una operación y el costo de una serie de operaciones son dos
cosas distintas. Aquí el peor caso es $\Theta(n)$ y la serie completa es
lineal. Repartir el costo total de una serie entre sus operaciones es el
análisis agregado de CLRS, sección 16.1.

## Para practicar en casa

### Propuesto 1: el residuo al revés

En la cola de arreglo, ¿qué pasa si `encolar` escribe en `datos[n]` en vez de
`datos[(inicio + n) % CAPACIDAD]`? Dé una secuencia de operaciones que falle y
diga cuál de los invariantes $A_1$ a $A_4$ se rompe primero.

### Propuesto 2: la cola doble

Una cola que deje entrar y salir por los dos extremos. ¿Qué lista hace falta
para que las cuatro operaciones sean $\Theta(1)$?

### Propuesto 3: sin contador

Si la cola de nodos no guardara `n`, ¿cómo se sabe si está vacía? ¿Y cuántos
elementos tiene? Diga qué cuesta cada respuesta.

### Propuesto 4: la cola de prioridad, a mano

Una cola donde sale siempre el menor. Implementada sobre la lista enlazada,
¿cuánto cuesta encolar y cuánto desencolar? ¿Y si la lista se guarda ordenada?

### Propuesto 5: invertir una cola

Déle la vuelta a una cola usando solo una pila auxiliar y las operaciones de
los dos contratos. ¿Cuánto cuesta en tiempo y en espacio?

## Ejercicios interactivos

Cinco actividades que se trabajan en el navegador, una por tema de la sesión,
en la [página de ejercicios interactivos](./Ejercicios.md): en qué casilla cae
cada `encolar` sobre un arreglo de cinco y dónde da la vuelta; los elementos que
se mueven en las cuatro combinaciones de lista y extremo; la cadena con `cabeza`
y `ultimo` paso a paso hasta vaciarla y volver a usarla; qué pasa si
`desencolar` no devuelve `ultimo` a `NULL`; y qué cola conviene a tres programas
con restricciones distintas. Los programas no son los de la sesión: mismo tema,
valores nuevos.

## Lo que sigue

Los ejercicios sobre las implementaciones de lista, pila y cola, y quicksort,
que ordena partiendo el arreglo alrededor de un elemento en vez de partirlo por
la mitad.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

**La cola sobre la lista y la cola sobre nodos**

- [cola.h](codigo/cola.h) — la cola sobre el TAD Lista, con el frente en la
  posición 0 y el final en el último.
- [cola_nodos.h](codigo/cola_nodos.h) — la cola directa sobre nodos, guardando
  cabeza y último.
- [lista_cola.h](codigo/lista_cola.h) — la lista enlazada con puntero al
  último que queda debajo de `cola.h`.
- [cola_uso.cpp](codigo/cola_uso.cpp) — el mismo programa sobre las dos,
  incluido el caso de vaciarse y volver a servir.

`cola_uso.cpp` escribe `#include CABECERA` y deja que la línea de órdenes diga
cuál cabecera entra:

```bash
g++ -Wall -Wextra -DCABECERA='"cola.h"' cola_uso.cpp -o sobre_lista
g++ -Wall -Wextra -DCABECERA='"cola_nodos.h"' cola_uso.cpp -o sobre_nodos
./sobre_lista
./sobre_nodos
```

Los dos ejecutables imprimen las mismas cuatro líneas, `5 3`, `8 2`, `8 2 9` y
`1 1 0`. El programa es el mismo y lo único que cambia es qué clase `Cola`
entra.

**Los extremos**

- [extremos_cola.cpp](codigo/extremos_cola.cpp) — las cuatro combinaciones de
  lista y extremo, encolando y desencolando $n$ veces y contando los elementos
  que se corren en el arreglo y los nodos que se visitan en la enlazada, para
  $n = 100$, 1000 y 10 000.

Las soluciones de los problemas de juez están en la sección «Para el juez», con
su entrada y su salida.

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 8, colas: la cola sobre arreglo, la cola circular, la cola con
  listas enlazadas y sus variantes.
- N. Kalicharan. *Data Structures in C*, 2008. Capítulo 4, pilas y colas: la
  cola sobre arreglo y sobre nodos.
- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Sección 10.1, pilas y colas sobre
  arreglos; sección 10.2, listas enlazadas; sección 16.1, análisis agregado.
