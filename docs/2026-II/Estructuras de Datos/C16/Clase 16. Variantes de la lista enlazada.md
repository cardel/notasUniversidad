# Clase 16. Variantes de la lista enlazada

Viernes 2 de octubre de 2026, de 14:00 a 17:00.

La lista enlazada con la que se construyó el TAD guarda en cada nodo el dato y
la dirección del siguiente. Con eso insertar al frente cuesta dos escrituras,
pero borrar un nodo que ya se tiene localizado obliga a recorrer la lista
entera buscando quién lo apunta, y llegar a la posición $p$ cuesta $p$ pasos
sin excepción. Esta sesión agrega un campo, cierra la cadena sobre sí misma y
guarda un contador, y mide qué compra cada una de las tres decisiones y qué
cobra a cambio. Después usa la estructura para lo que mejor hace: ordenar
partiendo, ordenando cada mitad y mezclando.

Al terminar, el objetivo es poder construir la lista doblemente enlazada y la
circular diciendo qué operación baja de costo en cada una; explicar por qué
caminar por el lado más corto parte el trabajo a la mitad sin mover la cota
$\Theta(n)$; ordenar una lista enlazada con merge sort y escribir la
recurrencia $T(n) = 2T(n/2) + \Theta(n)$ que da $\Theta(n \log n)$; y decir
por qué la mezcla sobre nodos ocupa $\Theta(1)$ de espacio aparte mientras
sobre un arreglo ocupa $\Theta(n)$.

## Diapositivas

![](clase16.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Lo que compró el puntero al último

La cadena arranca en `cabeza` y termina en el nodo cuyo campo `siguiente` vale
`NULL`. Insertar al frente son dos escrituras de puntero, `nuevo->siguiente =
cabeza` y `cabeza = nuevo`, y ningún nodo que ya estaba se mueve. Llegar a la
posición $p$ son $p$ pasos, porque la dirección del nodo $p$ no se calcula: se
sigue la cadena.

Los números de insertar al frente diez veces quedaron medidos: el arreglo hace
45 corrimientos, $0 + 1 + \cdots + 9$, y la enlazada hace 20 escrituras de
puntero, dos por inserción. Con mil elementos son 499 500 contra 2000. Esa es
la operación que la enlazada regala.

Guardar aparte la dirección del último nodo bajó `agregar` de $\Theta(n)$ a
$\Theta(1)$ y cobró su precio en `eliminar`, que ganó dos casos: borrar el
único elemento, que devuelve `ultimo` a `NULL`, y borrar el último, que mueve
`ultimo` al anterior y obliga a buscarlo.

Queda una operación sin arreglar, y es la que abre la sesión. Supongamos que
el programa ya tiene en la mano un puntero al nodo que quiere borrar, porque
venía recorriendo la lista o porque lo guardó antes. ¿Cuánto cuesta sacarlo?

Cuesta toda la lista. Para desenlazar un nodo hay que reescribir el campo
`siguiente` **del anterior**, y un nodo sabe cuál es el que sigue y no cuál es
el que lo apunta. Hay que buscar al anterior desde la cabeza: $\Theta(n)$,
aunque el empalme en sí sean dos asignaciones. Tener el nodo no sirve de nada
si el nodo no sabe de dónde viene.

Esa es la operación que paga la primera variante.

## El nodo que mira atrás

### Un campo más

```cpp
struct Nodo {
  Elemento dato;
  Nodo *anterior;
  Nodo *siguiente;
};
```

Sobre $\langle 5, 2, 7 \rangle$ el dibujo tiene dos juegos de flechas. Las de
arriba van hacia adelante, del 5 al 2 y del 2 al 7; las de abajo van hacia
atrás, del 7 al 2 y del 2 al 5. En los extremos los dos campos que no tienen a
quién apuntar valen `NULL`: el `anterior` del primer nodo y el `siguiente` del
último. La cadena sigue teniendo puntas, y las puntas se reconocen por ese
`NULL`.

La clase guarda `cabeza`, `ultimo` y `n`. Mantener `ultimo` ya no cuesta nada
extra: los enlaces van en los dos sentidos, así que el último se alcanza desde
el anterior sin recorrer.

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
      I_3:&\quad n > 0 \implies v_{n-1}\texttt{->siguiente} = \texttt{NULL}\\
      I_4:&\quad n > 0 \implies v_0\texttt{->anterior} = \texttt{NULL}\\
      I_5:&\quad \forall i,\ 0 \leq i < n-1:\
             v_i\texttt{->siguiente} = v_{i+1}\ \wedge\
             v_{i+1}\texttt{->anterior} = v_i\\
      I_6:&\quad (n > 0 \implies \texttt{ultimo} = v_{n-1}) \;\wedge\;
             (n = 0 \implies \texttt{cabeza} = \texttt{ultimo} = \texttt{NULL})
    \end{aligned}
    $$

    La sucesión de elementos que el contrato nombra es
    $L = \langle v_0\texttt{->dato}, \ldots, v_{n-1}\texttt{->dato} \rangle$.

Los tres primeros son los de la lista simple. Los que llegan con el campo
nuevo son $I_4$ y $I_5$, y $I_5$ es el que hay que vigilar en cada
modificación: dice que las dos direcciones cuentan la misma historia. Si
`insertar` escribe el enlace hacia adelante y olvida el de vuelta, el recorrido
de ida sale bien y el de regreso se salta un nodo o se cae. Es el error que no
aparece hasta que alguien recorre al revés.

### Desenlazar sin recorrer

```cpp
// Saca el nodo de la cadena. No recorre nada: por eso se guarda anterior.
void desenlazar(Nodo *x) {
  if (x->anterior == NULL) {
    cabeza = x->siguiente;
  } else {
    x->anterior->siguiente = x->siguiente;
  }
  if (x->siguiente == NULL) {
    ultimo = x->anterior;
  } else {
    x->siguiente->anterior = x->anterior;
  }
}
```

Con `a`, `x` y `b` consecutivos, lo que pasa es que el `siguiente` de `a` pasa
a ser `b` y el `anterior` de `b` pasa a ser `a`. El nodo `x` queda desacoplado
de la cadena sin que nadie haya caminado hasta él: ya estaba en la mano.
Cuatro escrituras de puntero en el peor caso, $\Theta(1)$.

Los dos `if` son los extremos. Cuando `x` es el primero no hay un `a` a quien
reescribirle el `siguiente`, y lo que cambia es `cabeza`; cuando es el último
no hay un `b`, y lo que cambia es `ultimo`. Vale la pena mirar la línea
`x->siguiente->anterior = x->anterior` con esa guarda puesta: `x->siguiente`
tiene que ser un nodo para que escribir en su campo `anterior` signifique algo.
Sin el `if`, cuando `x` es el último se escribe sobre `NULL`.

```cpp
void eliminar(int p) {
  assert(0 <= p && p < n);
  Nodo *muerto = nodoEn(p);
  desenlazar(muerto);
  delete muerto;
  n = n - 1;
}
```

`eliminar(p)` sigue costando $\Theta(p)$, y el costo está entero en `nodoEn`,
que camina. Lo que bajó a $\Theta(1)$ es borrar un nodo que ya se tiene, y eso
es justo lo que pasa al recorrer la lista borrando, o al guardar punteros a
elementos para quitarlos después. El campo `anterior` compra esa operación y
no la otra.

### Lo que cobra el campo nuevo

`insertar` mantiene ahora dos enlaces por nodo, y los extremos le abren cuatro
casos: lista vacía, al frente, al final y en medio.

```cpp
if (n == 0) {
  nuevo->anterior = NULL;
  nuevo->siguiente = NULL;
  cabeza = nuevo;
  ultimo = nuevo;
} else if (p == 0) {
  nuevo->anterior = NULL;
  nuevo->siguiente = cabeza;
  cabeza->anterior = nuevo;
  cabeza = nuevo;
} else if (p == n) {
  nuevo->anterior = ultimo;
  nuevo->siguiente = NULL;
  ultimo->siguiente = nuevo;
  ultimo = nuevo;
} else {
  Nodo *x = nodoEn(p);
  nuevo->anterior = x->anterior;
  nuevo->siguiente = x;
  x->anterior->siguiente = nuevo;
  x->anterior = nuevo;
}
```

| Caso | Tiempo | Por qué |
|---|---|---|
| lista vacía | $\Theta(1)$ | el nodo nuevo es cabeza y último a la vez |
| $p = 0$ | $\Theta(1)$ | `cabeza` está guardada |
| $p = n$ | $\Theta(1)$ | `ultimo` está guardado |
| $0 < p < n$ | $\Theta(p)$ | `nodoEn(p)` camina hasta el nodo que va a quedar detrás |

Los cuatro casos tienen la misma causa: en algún extremo falta un vecino. El
caso de la lista vacía existe porque no hay ni `cabeza` ni `ultimo` a los que
engancharse; el de $p = 0$ existe porque el nodo nuevo no tiene anterior; el de
$p = n$ existe porque no tiene siguiente. Solo el caso de en medio tiene
vecinos a los dos lados, y es el único donde las cuatro líneas del empalme
salen sin condicionales.

El orden de esas cuatro líneas no es libre. Primero se escriben los dos enlaces
del nodo nuevo, `anterior` y `siguiente`, y solo después se reescriben los de
los vecinos. Al revés, `x->anterior` ya vale `nuevo` cuando se lee, y la
dirección del nodo que estaba antes de `x` se pierde para siempre: la mitad de
la lista queda inalcanzable, con $I_1$ e $I_5$ rotos de un golpe.

Lo que se compró con el campo: desenlazar en $\Theta(1)$, llegar al último en
un paso y recorrer hacia atrás. Lo que se paga: un puntero más por nodo, dos
enlaces que mantener en cada modificación y los cuatro casos de `insertar`.
Esos casos son el problema que resuelve la variante siguiente.

## La cadena que se cierra

### Sin `NULL` no hay extremos

Si el último apunta al primero y el primero al último, la cadena deja de tener
puntas. Desaparece `NULL` de todos los enlaces y con él desaparecen los casos
que existían solo porque a un nodo le faltaba un vecino.

La clase guarda `cabeza` y `n`, y nada más. El último ya no hay que guardarlo:
`cabeza->anterior` es el último nodo y se llega en un paso.

!!! note "Invariante de representación"

    Para $n > 0$, sea $v_0 = \texttt{cabeza}$ y
    $v_{i+1} = v_i\texttt{->siguiente}$, y sea $\mathrm{Alc}$ el conjunto de
    nodos alcanzables desde `cabeza` por el campo `siguiente`.

    $$
    \begin{aligned}
      J_1:&\quad |\mathrm{Alc}| = n\\
      J_2:&\quad \forall i, j,\ 0 \leq i < j < n:\ v_i \neq v_j\\
      J_3:&\quad n > 0 \implies \forall i,\ 0 \leq i < n:\
             v_i\texttt{->siguiente} = v_{(i+1) \bmod n}\ \wedge\
             v_{(i+1) \bmod n}\texttt{->anterior} = v_i\\
      J_4:&\quad n = 0 \iff \texttt{cabeza} = \texttt{NULL}
    \end{aligned}
    $$

$J_3$ es todo el cambio, y está en el $\bmod n$. En la lista doble el enlace
hacia adelante se acababa en el último nodo; aquí da la vuelta. Evaluado en
$i = n-1$ dice $v_{n-1}\texttt{->siguiente} = v_0$ y
$v_0\texttt{->anterior} = v_{n-1}$, que es exactamente la afirmación de que
`cabeza->anterior` es el último.

$J_1$ pasa a ser indispensable. En las variantes anteriores el recorrido se
detenía al encontrar `NULL`, así que el contador podía mentir sin colgar el
programa. Aquí no hay `NULL` en ningún enlace: lo único que detiene un
recorrido es haber dado $n$ pasos. El destructor lo deja a la vista, porque
cuenta en vez de comparar contra `NULL`:

```cpp
~Lista() {
  int i = 0;
  while (i < n) {
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    delete muerto;
    i = i + 1;
  }
  cabeza = NULL;
}
```

!!! warning "La autorreferencia"

    Un ciclo que recorra la circular con la condición de siempre,
    `actual != NULL`, no termina nunca: ningún nodo vale `NULL` y el recorrido
    da vueltas hasta que alguien lo mate. La condición de parada de esta
    estructura es el contador, y por eso $J_1$ dejó de ser un detalle de
    contabilidad y pasó a ser lo que impide el ciclo infinito.

### Insertar, con dos casos en vez de cuatro

```cpp
void insertar(int p, Elemento e) {
  assert(0 <= p && p <= n);
  Nodo *nuevo = new Nodo;
  nuevo->dato = e;
  if (n == 0) {
    nuevo->siguiente = nuevo;
    nuevo->anterior = nuevo;
    cabeza = nuevo;
  } else {
    // se empalma antes de x; con p == n, x es la cabeza y queda al final
    Nodo *x = cabeza;
    if (p < n) {
      x = nodoEn(p);
    }
    nuevo->siguiente = x;
    nuevo->anterior = x->anterior;
    x->anterior->siguiente = nuevo;
    x->anterior = nuevo;
    if (p == 0) {
      cabeza = nuevo;
    }
  }
  n = n + 1;
}
```

Las cuatro líneas del empalme sirven para cualquier posición, porque
`x->anterior` siempre existe. Insertar al final es insertar antes de la cabeza:
en un círculo son el mismo lugar, y el código lo dice con
`Nodo *x = cabeza;` cuando $p = n$. Sobre $\langle 5, 2, 7 \rangle$, insertar
el 9 en la posición 3 lo deja entre el 7 y el 5, que es el final de la
sucesión y el vecino de la cabeza al mismo tiempo.

Con la lista vacía el nodo nuevo cierra el círculo consigo mismo: es su propio
siguiente y su propio anterior. Ese es el único caso aparte que queda, y
reaparece al borrar. Cuando $n = 1$ no hay a quién reenlazar, así que `cabeza`
vuelve a `NULL` y la lista queda vacía.

Las dos circulares, la de este código y la que llega enseguida, responden
igual al contrato: `circular_uso.cpp` se compila una vez con cada cabecera y
las dos imprimen las mismas cuatro líneas.

## La mitad del camino

### Una pregunta de pasos

La lista circular doble tiene $n = 10$ elementos y se pide la posición 8.
Caminando desde la cabeza hacia adelante son 8 pasos. Con los enlaces hacia
atrás y sabiendo que hay 10 elementos, hacen falta dos: `cabeza->anterior` es
la posición 9 y `cabeza->anterior->anterior` es la 8.

Las dos cosas que vuelven posible esa cuenta son el enlace `anterior` y el
contador `n`. Sin el enlace no hay camino de regreso; sin el contador no se
sabe cuál de los dos caminos es el corto, porque para saber que la 8 está a dos
pasos del final hay que saber que el final es la 9.

### Caminar por el lado más corto

```cpp
Nodo *nodoEn(int p) {
  Nodo *actual = cabeza;
  if (p <= n / 2) {
    int i = 0;
    while (i < p) {
      actual = actual->siguiente;
      i = i + 1;
    }
  } else {
    int i = n;
    while (i > p) {
      actual = actual->anterior;
      i = i - 1;
    }
  }
  return actual;
}
```

La rama de abajo arranca en $i = n$ con `actual` en la cabeza, y eso no es un
descuido de índices: en el círculo la cabeza ocupa a la vez la posición 0 y la
posición $n$, así que empezar a contar desde $n$ y retroceder hasta $p$ da
$n - p$ pasos y aterriza en el nodo correcto.

Con $n = 10$, los pasos que cuesta cada posición por los dos caminos, medidos
por `pasos.cpp`:

| $p$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| de frente | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| por el lado corto | 0 | 1 | 2 | 3 | 4 | 5 | 4 | 3 | 2 | 1 |

La segunda fila sube hasta la mitad y baja. El empate está en la posición 5,
que queda a cinco pasos por los dos lados, y de ahí en adelante conviene ir al
revés. Recorriendo todas las posiciones una vez:

| $n$ | de frente | por el lado corto |
|---:|---:|---:|
| 10 | 45 | 25 |
| 100 | 4950 | 2500 |
| 1000 | 499 500 | 250 000 |

### La cota no se movió

!!! note "Teorema"

    Sea $\mathit{pasos}(p)$ el número de pasos que da `nodoEn(p)` en la lista
    circular doble, con $0 \leq p < n$. Entonces
    $\mathit{pasos}(p) \leq \lceil n/2 \rceil$ para todo $p$.

**Demostración.** Se procede de forma directa, separando los dos caminos que
toma el código.

*Desarrollo.* Si $p \leq \lfloor n/2 \rfloor$, el ciclo de la primera rama
avanza desde $i = 0$ hasta $i = p$ y da exactamente $p$ pasos, de modo que
$\mathit{pasos}(p) = p \leq \lfloor n/2 \rfloor \leq \lceil n/2 \rceil$.

Si $p > \lfloor n/2 \rfloor$, el ciclo de la segunda rama retrocede desde
$i = n$ hasta $i = p$ y da $n - p$ pasos. Como $p$ es entero y
$p > \lfloor n/2 \rfloor$, se sigue $p \geq \lfloor n/2 \rfloor + 1$, y por lo
tanto

$$n - p \;\leq\; n - \lfloor n/2 \rfloor - 1 \;=\; \lceil n/2 \rceil - 1
\;<\; \lceil n/2 \rceil$$

donde la igualdad del medio usa $n - \lfloor n/2 \rfloor = \lceil n/2 \rceil$,
que vale para todo entero $n$.

*Conclusión.* En los dos casos $\mathit{pasos}(p) \leq \lceil n/2 \rceil$, de
donde $\mathit{pasos}(p) \in O(n)$ con testigos $c = 1$ y $k = 1$.

El peor caso pasó de $n - 1$ pasos a $\lceil n/2 \rceil$. Es la mitad del
trabajo, y la cota siguió siendo $\Theta(n)$.

### Por qué $\Theta(n/2) = \Theta(n)$

Las dos afirmaciones del párrafo anterior conviven, y conviene ver por qué sin
quedarse en que «la notación ignora las constantes».

$\Theta(g)$ no es un número: es el conjunto de funciones que crecen como $g$.
Una función $f$ está en $\Theta(g)$ cuando existen $c_1, c_2 > 0$ y $k$ tales
que $c_1 \, g(n) \leq f(n) \leq c_2 \, g(n)$ para todo $n \geq k$. Con
$f(n) = n/2$ y $g(n) = n$ los testigos salen de inmediato:
$c_1 = c_2 = 1/2$ y $k = 1$, porque $\tfrac{1}{2}n \leq n/2 \leq \tfrac{1}{2}n$
para todo $n$. Entonces $n/2 \in \Theta(n)$, y por el mismo argumento
$n \in \Theta(n/2)$. Los dos conjuntos tienen exactamente los mismos elementos,
y escribir $\Theta(n/2)$ o escribir $\Theta(n)$ es escribir el mismo conjunto.

Visto desde los números medidos, dos funciones están en el mismo $\Theta$
cuando el cociente entre ellas se queda entre dos constantes positivas por
grandes que se hagan. La tabla de arriba lo muestra: el cociente entre las dos
columnas es $45/25 = 1{,}8$ con $n = 10$, $4950/2500 = 1{,}98$ con $n = 100$ y
$499\,500/250\,000 = 1{,}998$ con $n = 1000$. Se acerca a 2 y se queda ahí.

El contraste está en la comparación entre las dos implementaciones del TAD
Lista, insertar al frente en el arreglo y en la enlazada. Ahí los cocientes
eran $45/20 = 2{,}25$, $4950/200 = 24{,}75$ y $499\,500/2000 = 249{,}75$: no se
acercan a nada, crecen con $n$. Eso es $\Theta(n^2)$ contra $\Theta(n)$, y es
una diferencia de otra clase. Duplicar $n$ duplica el trabajo de las dos
versiones de `nodoEn`; lo que cambió fue cuánto trabajo hay para cada $n$, no
cómo crece.

La consecuencia práctica aparece cuando dos algoritmos comparten la cota. La
cota ya no distingue, así que hay que mirar dos cosas más: el factor constante,
que es la mitad en este caso, y el espacio que pide cada uno. El factor es lo
que acaba de medirse. El espacio aparece en la sección siguiente, con dos
formas de ordenar que corren en $\Theta(n \log n)$ y no ocupan lo mismo.

## Ordenar partiendo y mezclando

### Lo que frenaba a insertion sort

Insertion sort acomoda un elemento a la vez contra el trozo que ya quedó
ordenado. Sobre la lista enlazada el corrimiento desaparece, porque meter un
nodo en su lugar es un empalme y ningún dato se mueve, pero encontrar ese lugar
exige caminar desde la cabeza. La vuelta $j$ puede recorrer $j$ nodos, así que
el peor caso sigue siendo $\Theta(n^2)$. Se cambió mover datos por seguir
punteros, y son la misma cantidad de pasos.

La otra idea es no acomodar un elemento contra todos los anteriores. Se parte
la lista en dos, se ordena cada mitad y se combinan las dos mitades ya
ordenadas. Combinar dos listas ordenadas es barato: se comparan las dos cabezas
y se toma la menor, porque en una lista ordenada la cabeza es el mínimo.

Son tres pasos: dividir la lista en dos mitades, conquistar ordenando cada una
con el mismo procedimiento, y combinar mezclando las dos
(CLRS, 4.ª edición, sección 2.3).

### Dividir con dos punteros a distinta velocidad

La lista no tiene índices, así que la mitad no se calcula: se encuentra. Un
puntero avanza de a un nodo y otro de a dos; cuando el rápido llega al final, el
lento va por la mitad. Es la carrera de dos motos, una a 30 y otra a 60: cuando
la rápida llega, la lenta va por la mitad del camino.

```cpp
Nodo *partir(Nodo *cabeza) {
  Nodo *lento = cabeza;
  Nodo *rapido = cabeza->siguiente;
  while (rapido != NULL && rapido->siguiente != NULL) {
    lento = lento->siguiente;
    rapido = rapido->siguiente->siguiente;
  }
  Nodo *segunda = lento->siguiente;
  lento->siguiente = NULL;
  return segunda;
}
```

Sobre $\langle 6, 2, 9, 4, 1, 7 \rangle$:

| vuelta | lento señala | rápido señala |
|---|---|---|
| inicio | 6 | 2 |
| 1 | 2 | 4 |
| 2 | 9 | 7 |
| fin | 9 | `NULL` tras 7 |

Se corta después del 9 y quedan $\langle 6, 2, 9 \rangle$ y
$\langle 4, 1, 7 \rangle$. La línea `lento->siguiente = NULL` es la que
convierte una cadena en dos: sin ella las dos mitades siguen siendo la misma
lista y la recursión no termina.

Un solo recorrido y ningún nodo nuevo: $\Theta(n)$ en tiempo y $\Theta(1)$ en
espacio. Con un número impar de nodos la primera mitad queda con uno más.

### Combinar: empalmar, no copiar

```cpp
Nodo *mezclar(Nodo *a, Nodo *b) {
  Nodo guia;
  guia.dato = 0;
  guia.siguiente = NULL;
  Nodo *cola = &guia;
  while (a != NULL && b != NULL) {
    if (a->dato <= b->dato) {
      cola->siguiente = a;
      a = a->siguiente;
    } else {
      cola->siguiente = b;
      b = b->siguiente;
    }
    cola = cola->siguiente;
  }
  if (a != NULL) {
    cola->siguiente = a;
  } else {
    cola->siguiente = b;
  }
  return guia.siguiente;
}
```

El nodo `guia` vive en la pila y su campo `dato` no se usa. Está para que la
primera vuelta escriba `cola->siguiente` igual que todas las demás, sin un caso
aparte para la mezcla todavía vacía. Al final se devuelve lo que quedó colgando
de él, no él.

Cuando una de las dos cadenas se acaba, lo que queda de la otra ya está
ordenado y es mayor o igual que todo lo que salió, así que se cuelga entero de
una sola asignación. Esa es la razón de que mezclar no tenga que volver atrás:
al comparar el 3 con el 7 y tomar el 3, lo que viene después del 7 en su cadena
es mayor que 7, y por lo tanto mayor que 3.

No se reserva ni un nodo y no se copia ni un dato: solo se reescribe el campo
`siguiente`. Los nodos de la salida son los mismos de la entrada, en otro
orden. Por eso la mezcla ocupa $\Theta(1)$ de espacio aparte.

!!! note "Lo que sostiene el ciclo"

    Sean $A$ y $B$ los multiconjuntos de los datos que traen las cadenas $a$ y
    $b$ al entrar. Al empezar una vuelta cualquiera, sea
    $M = \langle M[0], \ldots, M[|M|-1] \rangle$ la cadena que cuelga de
    `guia`, y sean $R_a$ y $R_b$ los multiconjuntos de los datos que quedan en
    $a$ y en $b$.

    $$
    \begin{aligned}
      I_1:&\quad \forall i, j,\ 0 \leq i < j < |M|:\ M[i] \leq M[j]\\
      I_2:&\quad |M| > 0 \wedge a \neq \texttt{NULL} \implies
             M[|M|-1] \leq a\texttt{->dato}, \text{ y lo mismo con } b\\
      I_3:&\quad \{\!\{M[0], \ldots, M[|M|-1]\}\!\} \uplus R_a \uplus R_b
             = A \uplus B
    \end{aligned}
    $$

$I_1$ dice que lo mezclado está en orden. $I_2$ dice que lo que falta no es
menor que lo último que se puso, y es el que permite agregar al final sin
revisar hacia atrás. $I_3$ dice que no se perdió ni se inventó ningún dato,
contados con repetición. Cuando el ciclo termina, una de las dos cadenas se
vació, y $I_2$ es lo que autoriza a colgar el resto de la otra sin comparar
nada más.

### El algoritmo completo

```cpp
// Una lista de cero o un nodo ya esta ordenada.
Nodo *ordenar(Nodo *cabeza) {
  if (cabeza != NULL && cabeza->siguiente != NULL) {
    Nodo *segunda = partir(cabeza);
    cabeza = mezclar(ordenar(cabeza), ordenar(segunda));
  }
  return cabeza;
}
```

El caso base es la lista de cero o un nodo, que ya está ordenada por tener un
solo elemento, y es donde la recursión se detiene. El caso recursivo parte,
manda cada mitad al mismo procedimiento y mezcla lo que vuelve. Las dos
llamadas a `ordenar` están adentro de la llamada a `mezclar`, así que las dos
mitades llegan ordenadas y `mezclar` puede suponer lo que $I_1$ exige.

### Las ocho, paso a paso

Sobre $\langle 6, 2, 9, 4, 1, 7, 3, 8 \rangle$, bajando hasta listas de un nodo
y subiendo mezclando:

| Nivel | Al bajar, `partir` deja | Al subir, `mezclar` devuelve |
|---:|---|---|
| 0 | $\langle 6\,2\,9\,4\,1\,7\,3\,8 \rangle$ | $\langle 1\,2\,3\,4\,6\,7\,8\,9 \rangle$ |
| 1 | $\langle 6\,2\,9\,4 \rangle$ $\langle 1\,7\,3\,8 \rangle$ | $\langle 2\,4\,6\,9 \rangle$ $\langle 1\,3\,7\,8 \rangle$ |
| 2 | $\langle 6\,2 \rangle$ $\langle 9\,4 \rangle$ $\langle 1\,7 \rangle$ $\langle 3\,8 \rangle$ | $\langle 2\,6 \rangle$ $\langle 4\,9 \rangle$ $\langle 1\,7 \rangle$ $\langle 3\,8 \rangle$ |
| 3 | $\langle 6 \rangle \langle 2 \rangle \langle 9 \rangle \langle 4 \rangle \langle 1 \rangle \langle 7 \rangle \langle 3 \rangle \langle 8 \rangle$ | ya están ordenadas |

Las comparaciones que cuesta subir, por nivel:

| Nivel | Comparaciones | De dónde salen |
|---:|---:|---|
| 2 | 4 | cuatro mezclas de uno contra uno |
| 1 | 6 | dos mezclas de dos contra dos |
| 0 | 7 | una mezcla de cuatro contra cuatro |
| | 17 | |

El programa cuenta 17 sobre esa entrada. Cada nivel toca los 8 nodos y hay
$\log_2 8 = 3$ niveles de mezcla, y ahí está el $n \log n$: no en una vuelta
larga, sino en pocas vueltas sobre todo.

### Otra vez, con ocho valores distintos

Vale la pena seguir el árbol completo una segunda vez, ahora sobre
$\langle 2, 3, 1, 5, 7, 0, 9, 8 \rangle$, para ver que la forma del árbol no
depende de los datos.

Bajando, `partir` corta siempre por la mitad:

| Nivel | Las cadenas |
|---:|---|
| 0 | $\langle 2\,3\,1\,5\,7\,0\,9\,8 \rangle$ |
| 1 | $\langle 2\,3\,1\,5 \rangle$ $\langle 7\,0\,9\,8 \rangle$ |
| 2 | $\langle 2\,3 \rangle$ $\langle 1\,5 \rangle$ $\langle 7\,0 \rangle$ $\langle 9\,8 \rangle$ |
| 3 | $\langle 2 \rangle \langle 3 \rangle \langle 1 \rangle \langle 5 \rangle \langle 7 \rangle \langle 0 \rangle \langle 9 \rangle \langle 8 \rangle$ |

Subiendo, cada mezcla compara cabeza con cabeza:

| Nivel | Lo que devuelve `mezclar` | Comparaciones |
|---:|---|---:|
| 2 | $\langle 2\,3 \rangle$ $\langle 1\,5 \rangle$ $\langle 0\,7 \rangle$ $\langle 8\,9 \rangle$ | 4 |
| 1 | $\langle 1\,2\,3\,5 \rangle$ $\langle 0\,7\,8\,9 \rangle$ | 5 |
| 0 | $\langle 0\,1\,2\,3\,5\,7\,8\,9 \rangle$ | 5 |
| | | 14 |

La mezcla de $\langle 2\,3 \rangle$ con $\langle 1\,5 \rangle$ compara 2 con 1
y saca el 1; compara 2 con 5 y saca el 2; compara 3 con 5 y saca el 3; ahí se
vació la primera cadena y el 5 se cuelga sin comparar. Tres comparaciones para
cuatro nodos. La final, entre $\langle 1\,2\,3\,5 \rangle$ y
$\langle 0\,7\,8\,9 \rangle$, saca el 0, después el 1, el 2, el 3 y el 5, y
cuando la primera cadena se vacía cuelga $\langle 7\,8\,9 \rangle$ entero: cinco
comparaciones para ocho nodos.

Son 14 comparaciones contra las 17 de la entrada anterior, y el programa lo
confirma. El árbol es el mismo y el total cambia, porque una cadena que se
vacía temprano deja a la otra colgarse sin comparar. Mezclar dos cadenas con
$n$ nodos entre las dos cuesta a lo sumo $n - 1$ comparaciones y puede costar
bastante menos; lo que no cambia con los datos es que son $\Theta(n)$ y que los
niveles son $\log_2 n$.

### Lo que cuesta

Partir recorre la lista una vez y mezclar también, así que el trabajo fuera de
las llamadas recursivas es $\Theta(n)$. Cada llamada se parte en dos de tamaño
$n/2$:

$$T(n) = 2\,T(n/2) + \Theta(n), \qquad T(1) = \Theta(1)$$

El árbol de llamadas tiene $\log_2 n$ niveles, cada nivel reparte los $n$ nodos
entre sus llamadas y hace $\Theta(n)$ de trabajo en total, de donde
$T(n) = \Theta(n \log n)$ (CLRS, 4.ª edición, sección 2.3). No hay mejor ni
peor caso: la lista se parte por la mitad sin mirar los datos, así que el árbol
tiene la misma altura para cualquier entrada. Lo único que varía con los datos
es el número exacto de comparaciones dentro de cada mezcla, como se acaba de
ver con 17 y con 14.

| Función | Tiempo | Espacio aparte de la lista | Por qué |
|---|---|---|---|
| `partir` | $\Theta(n)$ | $\Theta(1)$ | un recorrido con dos punteros; no reserva nodos |
| `mezclar` | $\Theta(n_a + n_b)$ | $\Theta(1)$ | cada nodo se cuelga una vez; solo se reescribe `siguiente` |
| `ordenar` | $\Theta(n \log n)$ | $\Theta(\log n)$ | $\log_2 n$ niveles de $\Theta(n)$; la pila guarda un marco por nivel |

El $\Theta(\log n)$ de `ordenar` es la pila de llamadas, no datos: cada llamada
anidada deja su marco mientras espera a las dos de adentro, y la profundidad de
ese anidamiento es la altura del árbol.

### Sobre el arreglo cuesta más espacio

La mezcla sobre un arreglo no puede empalmar. Para intercalar dos mitades en el
sitio habría que correr elementos, que es justo lo que se quería evitar, así
que se escribe el resultado en un arreglo auxiliar y después se copia de
vuelta. Eso es $\Theta(n)$ de espacio extra y dos escrituras por elemento en
cada nivel.

| | Sobre la enlazada | Sobre el arreglo |
|---|---|---|
| tiempo | $\Theta(n \log n)$ | $\Theta(n \log n)$ |
| espacio de la mezcla | $\Theta(1)$ | $\Theta(n)$ |
| qué se mueve | un puntero por nodo | cada elemento, dos veces por nivel |

Aquí cierra la cuenta que quedó abierta en la sección de los pasos. Las dos
versiones tienen la misma cota de tiempo, y la cota no las distingue; lo que
las distingue es el espacio. Es el único punto del curso donde la enlazada le
gana al arreglo en un algoritmo completo, y gana justo por lo que la hacía
cara: que los elementos no están pegados, y moverlos es reescribir una
dirección.

### Los dos algoritmos sobre la misma entrada

Comparaciones contadas por `comparar.cpp` sobre la misma permutación:

| $n$ | insertion sort | merge sort | veces más |
|---:|---:|---:|---:|
| 16 | 82 | 46 | 1 |
| 128 | 4066 | 748 | 5 |
| 1024 | 258 018 | 8181 | 31 |
| 4096 | 4 088 802 | 37 214 | 109 |

Con 16 elementos merge sort hace 46 comparaciones contra 82, ni la mitad de
trabajo ahorrada; con 4096 hace 109 veces menos. La ventaja aparece al crecer
$n$, que es exactamente lo que una cota asintótica afirma y lo único que
afirma. Para un tamaño fijo y pequeño el algoritmo simple compite, y encima no
paga la pila de llamadas.

Cómo crecen las comparaciones de merge sort sobre permutaciones mezcladas,
contadas por `merge.cpp`, contra el valor de $n \log_2 n$:

| $n$ | comparaciones | $n \log_2 n$ |
|---:|---:|---:|
| 8 | 16 | 24 |
| 64 | 317 | 384 |
| 512 | 3775 | 4608 |
| 1024 | 8181 | 10 240 |

La cuenta medida se queda por debajo de $n \log_2 n$ y se le acerca. La cota
superior no promete que el algoritmo llegue a ella, promete que no la pasa.

## Lo que cobra cada implementación

$n$ es el número de elementos y $p$ la posición sobre la que se opera.

| Operación | Simple | Doble | Circular | Circular, lado corto | Por qué |
|---|---|---|---|---|---|
| `obtener(p)`, `asignar(p, e)` | $\Theta(p)$ | $\Theta(p)$ | $\Theta(p)$ | $\Theta(\min(p, n-p))$ | ninguna calcula direcciones: hay que caminar, y el contador deja escoger el lado |
| `insertar(0, e)` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | `cabeza` está guardada en todas |
| `insertar(p, e)`, `eliminar(p)` | $\Theta(p)$ | $\Theta(p)$ | $\Theta(p)$ | $\Theta(\min(p, n-p))$ | el empalme es $\Theta(1)$; lo caro es llegar al nodo |
| `agregar(e)` | $\Theta(n)$, o $\Theta(1)$ con `ultimo` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | el final está guardado, o se alcanza por `cabeza->anterior` |
| desenlazar un nodo que ya se tiene | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | sin el campo `anterior` hay que buscar quién apunta al nodo |
| llegar al último | $\Theta(n)$, o $\Theta(1)$ con `ultimo` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | en el círculo el último es el vecino de atrás de la cabeza |
| recorrer hacia atrás | no se puede | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | el camino de vuelta existe solo con el campo `anterior` |
| `tamano()`, `vacia()` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | el contador está guardado |
| liberar la estructura | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | un `delete` por nodo |
| casos de `insertar` | 2 | 4 | 2 | 2 | cada caso aparte existe porque en un extremo falta un vecino |
| espacio por nodo | dato y 1 puntero | dato y 2 | dato y 2 | dato y 2 | el camino de vuelta se paga en memoria |
| espacio de la estructura | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | un nodo por elemento en las cuatro |
| espacio aparte por operación | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | punteros y contadores sueltos |

Cuatro frases resumen la tabla. Todas caminan para llegar a una posición,
porque ninguna calcula direcciones, y ese es el precio de no estar en casillas
consecutivas. El campo `anterior` convierte el desenlace en cuatro escrituras
fijas, y a cambio cada modificación mantiene dos enlaces en vez de uno. Cerrar
el círculo borra los extremos y con ellos los casos que existían solo porque
faltaba un vecino. El contador deja escoger el lado: la cota sigue siendo
$\Theta(n)$ y el peor caso baja de $n-1$ pasos a $\lceil n/2 \rceil$.

Ninguna de las cuatro gana en todo, y la columna que más se repite es la del
espacio por nodo, que es donde se paga lo que las otras compran. La estructura
se escoge por las operaciones que el programa repite, no por cuál se ve más
completa, y esa cuenta se hace con la tabla a la vista antes de escribir el
código. Para el [proyecto del curso](../Proyecto/Proyecto%20del%20curso.md),
el enunciado publicado es el documento que manda.

## Ejercicios

### Rotar la circular

Escriba `rotar(int k)` sobre la lista circular doble: la posición $k$ pasa a
ser la cabeza y el orden circular no cambia. Con $\langle 5, 2, 7, 4 \rangle$
y $k = 2$ queda $\langle 7, 4, 5, 2 \rangle$.

1. ¿Cuántos nodos hay que mover de sitio?
2. ¿Cuánto cuesta con $k = 1$? ¿Y con $k = n - 1$?
3. Escríbalo de modo que nunca dé más de $\lceil n/2 \rceil$ pasos.
4. ¿Se puede hacer lo mismo sobre la lista estática? ¿Qué costaría?

No se mueve ningún nodo. Lo único que cambia es a cuál apunta `cabeza`, porque
en un círculo todos los elementos ya están en su lugar relativo y rotar es
mirar el mismo círculo desde otro punto. Con $k = 1$ es un paso hacia adelante
y con $k = n - 1$ es un paso hacia atrás, así que escogiendo el sentido queda
$\Theta(\min(k, n-k))$, y $\lceil n/2 \rceil$ en el peor caso. Sobre el arreglo
hay que correr los $n$ elementos, $\Theta(n)$, y no hay manera de evitarlo:
allí la posición 0 es una casilla fija y no un nodo al que se pueda apuntar.

### Quitar repetidos de una lista ordenada

La lista enlazada simple viene ordenada y trae repetidos:
$\langle 1, 1, 3, 5, 5, 5, 8 \rangle$. Deje una sola copia de cada valor,
liberando los nodos que sobran.

1. ¿Cuántos recorridos hacen falta?
2. ¿Qué puntero hay que guardar antes de cada `delete`, y por qué?
3. ¿Cuántos nodos se liberan en el ejemplo?
4. ¿Cuánto cuesta en tiempo y en espacio aparte de la lista?

Un solo recorrido. Estando ordenada, los repetidos quedan consecutivos, así que
basta comparar cada nodo con el siguiente y, cuando son iguales, empalmar sobre
el siguiente del siguiente y liberar el de en medio. Antes del `delete` hay que
guardar el `siguiente` del nodo que se borra, que es a donde hay que enlazar;
leerlo después es leer memoria ya devuelta. Se liberan tres nodos y queda
$\langle 1, 3, 5, 8 \rangle$. Es $\Theta(n)$ en tiempo y $\Theta(1)$ en
espacio, porque los nodos no se copian: se sueltan.

Si la lista no estuviera ordenada, los repetidos no serían consecutivos y
habría que comparar cada nodo con todos los anteriores, $\Theta(n^2)$. Ordenar
primero con merge sort y después quitar repetidos cuesta
$\Theta(n \log n) + \Theta(n) = \Theta(n \log n)$, que es menos.

## Para el juez

**UVa 11462 — Age Sort**,
<https://onlinejudge.org/external/114/11462.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2457>.

Varios casos. Cada uno trae $n$ edades de los habitantes de un país y hay que
imprimirlas en orden ascendente, separadas por espacio, una línea por caso. El
archivo termina con $n = 0$. Los límites son $0 < n \leq 2\,000\,000$, y el
enunciado dice que todos tienen al menos un año y que nadie llega a los 100,
de modo que las edades van de 1 a 99.

Merge sort ordena en $\Theta(n \log n)$: con dos millones de edades son unos
$2 \cdot 10^6 \times 21 \approx 4{,}2 \cdot 10^7$ comparaciones, que entran en
el tiempo. Hay tres trampas. El cuello de botella no es ordenar sino leer: el
enunciado avisa que la entrada pesa unos 25 MB y pide usar entrada y salida
rápidas, y dos millones de enteros con `cin` sin desacoplar de `stdio` se
tardan más que el ordenamiento entero. Una lista enlazada de dos millones de
nodos pide dos millones de `new`, y el tiempo de reservar y el puntero por nodo
pesan: aquí gana el arreglo. Y el rango 1 a 99 es una cota sobre los valores,
no sobre la cantidad, y eso permite ordenar sin comparar y en $\Theta(n)$.
Averiguar cómo es el ejercicio que deja planteado la sesión de tablas hash.

**UVa 10810 — Ultra-QuickSort**,
<https://onlinejudge.org/external/108/10810.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1751>.

Varios casos, cada uno con $n < 500\,000$ enteros entre 0 y 999 999 999, uno
por línea, y el archivo termina con $n = 0$. Para cada caso hay que imprimir
cuántos intercambios de elementos vecinos hacen falta para dejar la sucesión en
orden ascendente. Con la entrada `9 1 0 5 4` la respuesta es 6.

El número que pide es la cantidad de pares en desorden, y es exactamente el
número de corrimientos que haría insertion sort, así que contarlos con
insertion sort es $\Theta(n^2)$ y con medio millón de elementos no entra. La
cuenta se puede llevar dentro de `mezclar` sin tocar su costo: cuando se toma
un elemento de la segunda cadena, ese elemento se adelanta a todos los que
quedan en la primera, y hay que sumarlos. La trampa es el tipo. Con medio
millón de elementos la respuesta puede llegar a $n(n-1)/2$, del orden de
$1{,}2 \cdot 10^{11}$, y eso no cabe en 32 bits.

## Para practicar en casa

### Propuesto 1

Escriba `buscar(Elemento x)` sobre la circular doble recorriendo desde los dos
extremos a la vez, uno hacia adelante y otro hacia atrás. ¿Cuántas
comparaciones hace en el peor caso, y cuándo conviene frente a recorrer de
frente?

### Propuesto 2

¿Qué pasa si se le pasa una lista circular a `partir`? Siga el ciclo del
puntero rápido con la condición `rapido != NULL && rapido->siguiente != NULL` y
diga en qué queda.

### Propuesto 3

Con tres listas ordenadas de $n$ nodos cada una, compare mezclarlas de a dos
contra escribir una mezcla que compare las tres cabezas. ¿Cuántas comparaciones
hace cada una?

### Propuesto 4

Merge sort sobre la lista doblemente enlazada. ¿Qué hay que arreglar al
terminar la mezcla para que los enlaces `anterior` queden bien, y cambia el
costo?

### Propuesto 5

Un nodo centinela es un nodo fijo que no guarda elementos y que siempre está al
frente de la cadena. ¿Cuáles de los casos de `insertar` y de `eliminar`
desaparecen con él, y qué invariante hay que reescribir?

### Propuesto 6

Sobre la circular doble con $n = 7$, escriba la fila de pasos por el lado corto
para $p = 0, \ldots, 6$ y compruebe que ninguno pasa de $\lceil 7/2 \rceil = 4$.

## Ejercicios interactivos

Cinco actividades que se trabajan en el navegador, una por tema de la sesión,
en la [página de ejercicios interactivos](./Ejercicios.md): qué punteros se
reescriben al sacar un nodo de la cadena doble; insertar al frente y al final
sobre la circular prediciendo cada resultado; los pasos por los dos caminos con
doce elementos; dónde corta `partir` y cuántas comparaciones hace cada mezcla;
y qué variante conviene a cuatro perfiles de uso distintos. Los programas no
son los de la sesión: mismo tema, valores nuevos.

## Lo que sigue

Pila y cola por dentro. Qué implementación le conviene a cada una cuando todas
las operaciones ocurren por los extremos, cuál de las cuatro variantes sobra
para ese perfil, y por qué una cola montada sobre arreglo necesita dar la
vuelta al llegar al final en vez de correr los elementos.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

**El nodo que mira atrás**

- [doble.h](codigo/doble.h) — la lista doblemente enlazada, con el `desenlazar`
  que saca un nodo en $\Theta(1)$ porque no necesita buscar al anterior, y los
  cuatro casos de `insertar`.
- [doble_uso.cpp](codigo/doble_uso.cpp) — el mismo contrato corriendo sobre
  ella: imprime `2 5 7 8 4`, después `5 8 4` y cierra con `3 0`.

**La cadena que se cierra**

- [circular.h](codigo/circular.h) — la circular doble: sin `NULL` en ningún
  enlace, `cabeza->anterior` es el último e `insertar` pasa de cuatro casos a
  dos.
- [circular_rapida.h](codigo/circular_rapida.h) — la misma, con el `nodoEn`
  que usa el contador para llegar a la posición por el lado más corto.
- [circular_uso.cpp](codigo/circular_uso.cpp) — se compila una vez con cada
  cabecera y las dos responden igual.

Los dos de la lista circular se compilan escogiendo la cabecera:

```bash
g++ -Wall -Wextra -DCABECERA='"circular.h"' circular_uso.cpp -o circular
g++ -Wall -Wextra -DCABECERA='"circular_rapida.h"' circular_uso.cpp -o rapida
```

**La mitad del camino**

- [pasos.cpp](codigo/pasos.cpp) — cuántos pasos cuesta llegar a cada posición
  por los dos caminos, con los totales para 10, 100 y 1000 elementos.

**Ordenar partiendo y mezclando**

- [merge.cpp](codigo/merge.cpp) — merge sort sobre la lista: `partir` con el
  puntero lento y el rápido, `mezclar` empalmando nodos y `ordenar`, con el
  contador de comparaciones.
- [comparar.cpp](codigo/comparar.cpp) — insertion sort y merge sort sobre la
  misma entrada, contando comparaciones para $n$ entre 16 y 4096.

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 6, listas enlazadas: circulares, doblemente enlazadas y circulares
  doblemente enlazadas.
- N. Kalicharan. *Data Structures in C*, 2008. Capítulo de listas enlazadas:
  variantes y manejo de los nodos con `malloc` y `free`.
- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Sección 2.3, merge sort y el análisis
  de la recurrencia; sección 10.2, listas enlazadas.
