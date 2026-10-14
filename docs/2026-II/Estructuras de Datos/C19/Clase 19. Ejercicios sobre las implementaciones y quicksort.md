# Estructuras de Datos · Clase 19. Ejercicios sobre las implementaciones y quicksort

Miércoles 14 de octubre de 2026, de 17:00 a 19:00.

La lista, la pila y la cola ya están construidas sobre nodos, y la sesión
arranca resolviendo problemas con ellas: una cola que entra y sale por los dos
extremos, una cola que no guarda su contador y una cola que se invierte con una
pila. Después cambia de tema. Merge sort parte el arreglo sin mirar los datos y
paga todo al mezclar; quicksort hace lo contrario: paga al partir, dejando a la
izquierda lo pequeño y a la derecha lo grande, y al final no hay nada que
combinar. El costo de esa decisión es que el tamaño de las partes depende de
los datos, y con el pivote en el último lugar un arreglo ya ordenado es el
peor caso.

Al terminar, el objetivo es poder resolver problemas sobre la lista, la pila y
la cola enlazadas dando el costo en tiempo y en espacio de cada solución;
explicar cómo `particionar` deja el pivote en su lugar definitivo, siguiendo
las zonas del arreglo; construir quicksort sobre `particionar` y justificar su costo
en el caso balanceado y en el peor caso; y comparar insertion sort, merge sort y
quicksort con comparaciones contadas sobre la misma entrada.

## Diapositivas

![](./clase19.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Las tres implementaciones enlazadas

Las tres estructuras viven sobre una cadena de nodos, y cada una tiene a mano
los extremos que su contrato usa.

| TAD | Operación | Tiempo | Por qué |
|---|---|---|---|
| Lista | `insertar(0, e)` | $\Theta(1)$ | se escribe la cabeza |
| | `agregar(e)` | $\Theta(1)$ | se cuelga de `ultimo` |
| | `obtener(p)` y similares | $\Theta(p)$ | se camina hasta $p$ |
| Pila | `apilar`, `desapilar`, `tope` | $\Theta(1)$ | la cima es la cabeza |
| Cola | `encolar` | $\Theta(1)$ | se cuelga de `ultimo` |
| | `desencolar`, `frente` | $\Theta(1)$ | se sale por la cabeza |
| Las tres | `tamano`, `vacia` | $\Theta(1)$ | se lee `n` |
| | espacio | $\Theta(n)$ | dato y puntero por nodo |

Ninguna tiene techo: cada elemento reserva su nodo al entrar y lo libera al
salir. A cambio, llegar a una posición del medio exige caminar.

## Ejercicios sobre las implementaciones

Los tres se escriben sobre los TAD que ya están construidos, la cola y la pila
sobre nodos.

### La cola doble

Una cola que deja entrar y salir por los dos extremos: `insertarFrente`,
`insertarFinal`, `eliminarFrente` y `eliminarFinal`. ¿Qué lista hace falta
debajo para que las cuatro sean $\Theta(1)$, y cuál de las cuatro falla con la
lista simple que guarda `ultimo`?

Con la simple y `ultimo`, tres de las cuatro son $\Theta(1)$:

| Operación | Simple con `ultimo` | Por qué |
|---|---|---|
| `insertarFrente` | $\Theta(1)$ | se escribe la cabeza |
| `insertarFinal` | $\Theta(1)$ | se cuelga de `ultimo` |
| `eliminarFrente` | $\Theta(1)$ | la cabeza pasa al siguiente |
| `eliminarFinal` | $\Theta(n)$ | hay que llegar al penúltimo |

Quitar el último deja al penúltimo como nuevo último, y el penúltimo solo se
alcanza caminando desde la cabeza. `ultimo` sirve para poner al final, no para
quitar de ahí. La lista doblemente enlazada con cabeza y `ultimo` resuelve la
cuarta, porque el penúltimo es `ultimo->anterior`
([cola_doble.h](./codigo/cola_doble.h)):

```cpp
  // exige !vacia()
  void eliminarFinal() {
    assert(!vacia());
    NodoDoble *muerto = ultimo;
    ultimo = ultimo->anterior;
    if (ultimo == NULL) {
      cabeza = NULL;
    } else {
      ultimo->siguiente = NULL;
    }
    delete muerto;
    n = n - 1;
  }
```

```cpp
  void insertarFrente(Elemento e) {
    NodoDoble *nuevo = new NodoDoble;
    nuevo->dato = e;
    nuevo->anterior = NULL;
    nuevo->siguiente = cabeza;
    if (cabeza == NULL) {
      ultimo = nuevo;
    } else {
      cabeza->anterior = nuevo;
    }
    cabeza = nuevo;
    n = n + 1;
  }
```

Las otras dos son el espejo de estas: se cambia `cabeza` por `ultimo` y
`siguiente` por `anterior`.

Una corrida, la de [cola_doble_uso.cpp](./codigo/cola_doble_uso.cpp):
`insertarFinal(4)`, `insertarFinal(7)` e `insertarFrente(1)` dejan
`frente 1, final 7, tamano 3`. `eliminarFinal()` deja `frente 1, final 4`.
`eliminarFrente()` y `eliminarFinal()` vacían la cola, e `insertarFrente(9)`
deja `frente 9, final 9`.

| Operación | Doble con `ultimo` | Por qué |
|---|---|---|
| las cuatro de los extremos | $\Theta(1)$ | a lo sumo cuatro punteros |
| `frente`, `final` | $\Theta(1)$ | se lee `cabeza` o `ultimo` |
| espacio | $\Theta(n)$ | dato y dos punteros por nodo |

!!! warning "El caso que rompe la cola doble"

    Al sacar el único nodo por cualquiera de los dos lados, el otro extremo
    también debe quedar en `NULL`. Si no, apunta a un nodo liberado.

### La cola sin contador

Si la cola de nodos no guardara `n`, ¿cómo responde `vacia()`? ¿Y `tamano()`?
Sin el contador, la cadena misma dice si hay elementos: la cola está vacía
cuando no hay cabeza. Contarlos exige recorrerla
([cola_sin_n.h](./codigo/cola_sin_n.h)):

```cpp
  bool vacia() {
    return cabeza == NULL;
  }

  int tamano() {
    int cuenta = 0;
    Nodo *actual = cabeza;
    while (actual != NULL) {
      cuenta = cuenta + 1;
      actual = actual->siguiente;
    }
    return cuenta;
  }
```

| Operación | Sin `n` | Por qué |
|---|---|---|
| `vacia()` | $\Theta(1)$ | compara un puntero |
| `tamano()` | $\Theta(n)$ | visita cada nodo una vez |
| `encolar`, `desencolar`, `frente` | $\Theta(1)$ | no usaban `n` |
| espacio de la clase | dos punteros | uno menos que antes |

!!! warning "Lo que cuesta ahorrar un entero"

    Un ciclo que pregunte `tamano()` en cada vuelta, como el que imprime la
    cola dándole la vuelta, pasa de $\Theta(n)$ a $\Theta(n^2)$. Con el
    contador, la cola gasta un entero y responde en $\Theta(1)$.

### Invertir una cola con una pila

Déle la vuelta a una cola usando solo una pila auxiliar y las operaciones de
los dos contratos. La pila devuelve al revés lo que recibe: si se le pasa la
cola en orden y después se vuelca en la cola, sale invertida
([invertir.cpp](./codigo/invertir.cpp)).

```cpp
void invertir(Cola &c) {
  Pila p;
  while (!c.vacia()) {
    p.apilar(c.frente());
    c.desencolar();
  }
  while (!p.vacia()) {
    c.encolar(p.tope());
    p.desapilar();
  }
}
```

Con $\langle 3, 1, 4, 1, 5 \rangle$:

| Momento | Cola, del frente al final | Pila, del tope al fondo |
|---|---|---|
| al empezar | $\langle 3, 1, 4, 1, 5 \rangle$ | vacía |
| tras el primer ciclo | vacía | $\langle 5, 1, 4, 1, 3 \rangle$ |
| tras el segundo ciclo | $\langle 5, 1, 4, 1, 3 \rangle$ | vacía |

El programa imprime `antes:   3 1 4 1 5` y `despues: 5 1 4 1 3`.

| | Costo | Por qué |
|---|---|---|
| tiempo | $\Theta(n)$ | cada elemento sale y entra una vez en cada TAD, a $\Theta(1)$ |
| espacio aparte | $\Theta(n)$ | la pila guarda los $n$ elementos a la vez |

## Pagar al partir: quicksort

### Merge sort paga al combinar

Merge sort parte la lista por la mitad sin mirar los datos, y todo el trabajo
queda para el final: mezclar dos mitades ordenadas recorre las dos. ¿Y si se
paga al partir? Si al dividir se deja a la izquierda todo lo pequeño y a la
derecha todo lo grande, después de ordenar cada lado no queda nada por hacer:
cada elemento de la izquierda es menor o igual que cada elemento de la derecha,
y el arreglo completo ya está ordenado.

Quicksort sigue los tres pasos de dividir, conquistar y combinar sobre un
arreglo $a[\mathit{ini}..\mathit{fin}]$ (CLRS, §7.1):

- **Dividir**: escoger un pivote $x$ y reordenar de modo que queden primero los
  menores o iguales que $x$, después $x$ y al final los mayores. El pivote
  queda en una posición $q$.
- **Conquistar**: ordenar $a[\mathit{ini}..q-1]$ y $a[q+1..\mathit{fin}]$ con
  el mismo procedimiento.
- **Combinar**: no hay nada que hacer.

### Partir alrededor de un valor, sin auxiliar

Partir una cola alrededor de un valor pide una cola auxiliar. Sobre el arreglo
se puede hacer en el sitio: el ciclo mantiene cuatro zonas y las hace crecer
moviendo dos índices.

| $a[\mathit{ini}..i]$ | $a[i+1..j-1]$ | $a[j..\mathit{fin}-1]$ | $a[\mathit{fin}]$ |
|:---:|:---:|:---:|:---:|
| $\leq x$ | $> x$ | sin revisar | $x$ |

- El pivote es el último: $x = a[\mathit{fin}]$.
- `j` recorre de izquierda a derecha y revisa un elemento por vuelta.
- `i` marca el final de la zona de los menores o iguales.
- Al terminar, el pivote se cambia con el primero de los mayores y queda entre
  las dos zonas.

### `particionar` (CLRS, §7.1)

De [quicksort.cpp](./codigo/quicksort.cpp):

```cpp
void intercambiar(Elemento a[], int p, int q) {
  Elemento temp = a[p];
  a[p] = a[q];
  a[q] = temp;
}
```

```cpp
// Parte a[ini..fin] alrededor de x = a[fin] y
// devuelve la posicion final del pivote. Exige ini <= fin.
int particionar(Elemento a[], int ini, int fin) {
  Elemento x = a[fin];
  int i = ini - 1;
  int j = ini;
  while (j < fin) {
    if (a[j] <= x) {
      i = i + 1;
      intercambiar(a, i, j);
    }
    j = j + 1;
  }
  intercambiar(a, i + 1, fin);
  return i + 1;
}
```

Un elemento mayor que $x$ no se mueve: la zona de los mayores crece sola cuando
avanza `j`. Un elemento menor o igual se cambia con el primero de los mayores,
y las dos zonas avanzan una casilla.

### La traza con $\langle 7, 2, 9, 4, 1, 5 \rangle$

$\mathit{ini} = 0$, $\mathit{fin} = 5$, $x = 5$. Cada fila es el estado al
evaluar la condición del `while`.

| `i` | `j` | $a[0..5]$ | $a[j] \leq 5$ | Qué pasa |
|---:|---:|---|---|---|
| $-1$ | 0 | 7 2 9 4 1 5 | no | solo avanza `j` |
| $-1$ | 1 | 7 2 9 4 1 5 | sí | `i` pasa a 0; cambia $a[0]$ y $a[1]$ |
| 0 | 2 | 2 7 9 4 1 5 | no | solo avanza `j` |
| 0 | 3 | 2 7 9 4 1 5 | sí | `i` pasa a 1; cambia $a[1]$ y $a[3]$ |
| 1 | 4 | 2 4 9 7 1 5 | sí | `i` pasa a 2; cambia $a[2]$ y $a[4]$ |
| 2 | 5 | 2 4 1 7 9 5 | | la condición falla: $j = \mathit{fin}$ |

Al salir se cambia $a[3]$ con $a[5]$: queda
$\langle 2, 4, 1, \mathbf{5}, 9, 7 \rangle$ y la función devuelve $q = 3$. Los
dos lados no están ordenados, pero el 5 ya está en la casilla que ocupará al
final. Es la salida de `quicksort.cpp`: `particionar: 2 4 1 5 9 7` y
`el pivote quedo en 3`.

### Lo que mantiene el ciclo

Cada vez que se revisa la condición del `while`, el arreglo está repartido en
las cuatro zonas de la tabla:

- de `ini` a `i`, los menores o iguales que $x$;
- de `i+1` a `j-1`, los mayores que $x$;
- de `j` a `fin-1`, los que faltan por revisar;
- en `fin`, el pivote, que no se mueve durante el ciclo.

Una vuelta revisa $a[j]$. Si es mayor que $x$, ya está al final de la zona de
los mayores y basta avanzar `j`. Si es menor o igual, `i` avanza y el cambio lo
lleva al final de los menores; el primero de los mayores pasa al final de su
zona.

En la traza con $\langle 7, 2, 9, 4, 1, 5 \rangle$, en la fila $i = 1$, $j = 4$
el arreglo es $2\ 4 \mid 9\ 7 \mid 1 \mid 5$: los menores o iguales, los
mayores, lo que falta y el pivote.

!!! note "Al salir"

    Cuando `j` llega a `fin` ya no queda nada sin revisar. El cambio de
    $a[i+1]$ con $a[\mathit{fin}]$ pone el pivote entre las dos zonas: a su
    izquierda todo es menor o igual, a su derecha todo es mayor, y esa casilla
    es la que ocupará en el arreglo ordenado.

### Paso a paso sobre el arreglo

La misma partición, con las zonas marcadas: entre corchetes los menores o
iguales que $x = 5$, en negrita los mayores, sin marca lo que falta por revisar
y al final el pivote, separado con una barra.

| Momento | `i` | `j` | $a[0..5]$ | Qué pasa |
|---|---:|---:|---|---|
| al empezar | $-1$ | 0 | 7 2 9 4 1 \| 5 | todo sin revisar; $a[0] = 7 > 5$, solo avanza `j` |
| tras 1 vuelta | $-1$ | 1 | **7** 2 9 4 1 \| 5 | el 7 forma la zona de mayores; $a[1] = 2 \leq 5$, `i` pasa a 0 y se cambian $a[0]$ y $a[1]$ |
| tras 2 vueltas | 0 | 2 | [2] **7** 9 4 1 \| 5 | el 2 entró a los menores; $a[2] = 9 > 5$, solo avanza `j` |
| tras 3 vueltas | 0 | 3 | [2] **7 9** 4 1 \| 5 | los mayores son 7 y 9; $a[3] = 4 \leq 5$, `i` pasa a 1 y se cambian $a[1]$ y $a[3]$ |
| tras 4 vueltas | 1 | 4 | [2 4] **9 7** 1 \| 5 | el 4 se unió al 2 y el 7 pasó al final de los mayores; $a[4] = 1 \leq 5$, `i` pasa a 2 y se cambian $a[2]$ y $a[4]$ |
| tras 5 vueltas | 2 | 5 | [2 4 1] **7 9** \| 5 | `j` llegó a `fin`: no queda nada sin revisar; se cambian $a[3]$ y $a[5]$ |
| al salir | | | [2 4 1] 5 **9 7** | el pivote quedó en la casilla 3, entre las dos zonas, y `particionar` devuelve $q = 3$ |

### `quicksort`

```cpp
void quicksort(Elemento a[], int ini, int fin) {
  if (ini < fin) {
    int q = particionar(a, ini, fin);
    quicksort(a, ini, q - 1);
    quicksort(a, q + 1, fin);
  }
}
```

La llamada inicial es `quicksort(a, 0, n - 1)`. Un rango de cero o un elemento
no entra al `if`: ya está ordenado. Sobre
$\langle 6, 2, 9, 4, 1, 7, 3, 8 \rangle$, `quicksort.cpp` imprime
`quicksort:   1 2 3 4 6 7 8 9`.

!!! note "Por qué queda ordenado"

    Cada llamada a `particionar` deja su pivote en la casilla que ocupará al
    final. Las dos llamadas siguientes trabajan cada una de su lado y no lo
    cruzan: nada de la izquierda tiene que pasar a la derecha. Cuando los
    rangos llegan a cero o un elemento, todos los valores ya fueron pivote o
    quedaron solos en su casilla.

## Lo que cuesta quicksort

### El costo de `particionar`

El ciclo da exactamente $\mathit{fin} - \mathit{ini}$ vueltas, con una
comparación $a[j] \leq x$ y a lo sumo un intercambio en cada una.

| | Costo con $n = \mathit{fin} - \mathit{ini} + 1$ | Por qué |
|---|---|---|
| comparaciones | $n - 1$ | una por vuelta |
| tiempo | $\Theta(n)$ | cada vuelta es $\Theta(1)$ |
| espacio aparte | $\Theta(1)$ | `x`, `i`, `j` y `temp` |

El costo de quicksort entonces lo decide un solo dato: dónde queda $q$, porque
eso fija el tamaño de las dos llamadas.

### El caso balanceado

Si el pivote cae siempre cerca de la mitad, cada llamada se parte en dos de
tamaño $n/2$:

$$
T(n) = 2\,T(n/2) + \Theta(n), \qquad T(1) = \Theta(1).
$$

Es la recurrencia de merge sort: el árbol de llamadas tiene $\log_2 n$ niveles
y cada nivel hace $\Theta(n)$ de trabajo en total, así que
$T(n) = \Theta(n \log n)$.

No hace falta la mitad exacta. Si cada partición dejara un décimo de un lado y
nueve décimos del otro, el árbol tendría $\log_{10/9} n$ niveles, que sigue
siendo $\Theta(\log n)$, y cada nivel costaría a lo sumo $\Theta(n)$: el total
sigue en $\Theta(n \log n)$ (CLRS, §7.2).

### El peor caso: ya ordenado

¿Qué pasa si el arreglo ya viene ordenado? Con $\langle 1, 2, 3, 4, 5 \rangle$
el pivote es el 5, el mayor. Todos los $a[j]$ cumplen $a[j] \leq 5$, así que
`i` avanza con `j` y cada intercambio es de una casilla consigo misma. Queda
$q = 4$: la izquierda tiene cuatro elementos, todavía ordenados, y la derecha
ninguno.

| Llamada | Elementos | $q$ | Comparaciones |
|---|---:|---:|---:|
| $a[0..4]$ | 5 | 4 | 4 |
| $a[0..3]$ | 4 | 3 | 3 |
| $a[0..2]$ | 3 | 2 | 2 |
| $a[0..1]$ | 2 | 1 | 1 |
| | | | 10 |

Cada llamada quita un solo elemento: el pivote.

!!! note "Teorema"

    Sobre un arreglo de $n \geq 1$ elementos distintos en orden creciente,
    quicksort hace $C(n) = n(n-1)/2$ comparaciones, y $C(n) \in \Theta(n^2)$.

**Demostración.** Se procede de forma directa: primero se plantea la
recurrencia de $C$ y se resuelve, y después se acota con testigos.

**Desarrollo.** En un rango ordenado de $n \geq 2$ elementos el pivote es el
máximo, `particionar` hace $n - 1$ comparaciones, devuelve $q = \mathit{fin}$ y
deja la izquierda igual, ordenada, con $n - 1$ elementos. La derecha está
vacía. Entonces

$$
C(n) = (n - 1) + C(n - 1), \qquad C(1) = 0,
$$

y desplegando, $C(n) = (n-1) + (n-2) + \cdots + 1 + 0 = \dfrac{n(n-1)}{2}$.

Cota superior: para $n \geq 1$,
$\dfrac{n(n-1)}{2} \leq \dfrac{n^2}{2}$, así que $C(n) \leq c\,n^2$ con
$c = 1/2$ y $k = 1$.

Cota inferior: para $n \geq 2$ se tiene $n^2 \geq 2n$, es decir,
$2n^2 - 2n \geq n^2$, y dividiendo entre 4,
$\dfrac{n(n-1)}{2} \geq \dfrac{n^2}{4}$, así que $C(n) \geq c\,n^2$ con
$c = 1/4$ y $k = 2$.

**Conclusión.** Por lo tanto, se puede concluir que $C(n) \in O(n^2)$ con
testigos $c = 1/2$ y $k = 1$, y $C(n) \in \Omega(n^2)$ con testigos $c = 1/4$ y
$k = 2$: $C(n) \in \Theta(n^2)$.

!!! warning "La entrada más fácil para insertion sort"

    Un arreglo ya ordenado le cuesta a insertion sort $n - 1$ comparaciones y a
    quicksort $n(n-1)/2$. Con el pivote en el último lugar, ordenar algo que ya
    está ordenado es el peor caso. Al revés pasa lo mismo: el pivote es el
    mínimo y cada llamada vuelve a quitar uno solo.

### La pila de llamadas

Quicksort no pide arreglo auxiliar, pero cada llamada pendiente ocupa un
registro en la pila de llamadas, con `a`, `ini`, `fin` y `q`. El espacio aparte
es la profundidad máxima de la recursión.

| Caso | Profundidad | Por qué |
|---|---|---|
| balanceado | $\Theta(\log n)$ | cada nivel parte el rango por la mitad |
| ya ordenado | $\Theta(n)$ | cada nivel quita un elemento |

!!! warning "Lo que se ve al correrlo"

    Sobre un arreglo ya ordenado queda una llamada pendiente por elemento. Con
    la pila de llamadas de 8 MB que da Linux por omisión, el programa ordena
    100 000 elementos y se cae con 300 000, por desbordar la pila antes de
    terminar.

### Escoger otro pivote

El peor caso aparece porque $a[\mathit{fin}]$ es el máximo o el mínimo del
rango. El pivote no tiene que ser el último: basta escoger otra casilla e
intercambiarla con $a[\mathit{fin}]$ antes de partir, y `particionar` queda
igual.

- **El del medio**: intercambiar $a[(\mathit{ini} + \mathit{fin})/2]$ con
  $a[\mathit{fin}]$. Sobre un arreglo ya ordenado el pivote es la mediana y las
  particiones quedan balanceadas. Existen otras entradas que lo hacen
  cuadrático, pero no son las que aparecen solas.
- **Al azar**: escoger la casilla con un número aleatorio entre $\mathit{ini}$
  y $\mathit{fin}$. Ninguna entrada fija provoca siempre el peor caso, y el
  tiempo esperado es $\Theta(n \log n)$ sobre cualquier entrada (CLRS, §7.3 y
  §7.4). El peor caso sigue siendo $\Theta(n^2)$, pero depende de la suerte y
  no de los datos.

### Los tres algoritmos sobre la misma entrada

[comparar.cpp](./codigo/comparar.cpp) cuenta las comparaciones con un mismo
programa: insertion sort y quicksort sobre el arreglo, merge sort sobre la
lista enlazada. El mezclado toma valores entre 0 y 10 006 sin orden.

| Entrada | $n$ | insertion sort | merge sort | quicksort |
|---|---:|---:|---:|---:|
| mezclado | 16 | 78 | 48 | 59 |
| | 128 | 4 166 | 740 | 811 |
| | 1024 | 268 112 | 8 584 | 11 414 |
| | 4096 | 4 162 689 | 43 220 | 54 266 |
| ordenado | 16 | 15 | 32 | 120 |
| | 128 | 127 | 448 | 8 128 |
| | 1024 | 1 023 | 5 120 | 523 776 |
| | 4096 | 4 095 | 24 576 | 8 386 560 |
| al revés | 16 | 135 | 32 | 120 |
| | 128 | 8 255 | 448 | 8 128 |
| | 1024 | 524 799 | 5 120 | 523 776 |
| | 4096 | 8 390 655 | 24 576 | 8 386 560 |

- Sobre el mezclado, quicksort hace 54 266 comparaciones con 4096 elementos,
  1,26 veces las de merge sort, y unas 77 veces menos que insertion sort.
- Sobre el ordenado los papeles se invierten: insertion sort hace 4 095 y
  quicksort 8 386 560, que es $4096 \cdot 4095 / 2$, la cifra del teorema.
- Merge sort no cambia de orden de magnitud con la entrada: parte sin mirar los
  datos.

Quicksort hace más comparaciones que merge sort sobre el mezclado, y aun así
CLRS (cap. 7) lo presenta como la opción práctica más común para ordenar: sobre
un arreglo no reserva nodos, no sigue punteros y recorre casillas vecinas.
Contar comparaciones compara algoritmos, no programas.

### Los tres, lado a lado

| Algoritmo | Mejor | Peor | Espacio aparte | En el sitio | Por qué |
|---|---|---|---|---|---|
| insertion, arreglo | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(1)$ | sí | corre lo anterior; si ya está ordenado, nada |
| merge, lista | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(\log n)$ | sí | parte por la mitad sin mirar los datos |
| merge, arreglo | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n)$ | no | mezcla en un arreglo auxiliar |
| quicksort, arreglo | $\Theta(n \log n)$ | $\Theta(n^2)$ | $\Theta(\log n)$ a $\Theta(n)$ | sí | las partes dependen del pivote |

En merge sort sobre la lista y en quicksort, el espacio aparte es la pila de
llamadas. Sobre la lista, merge sort no copia datos: empalma nodos.

Cuál escoger:

- Pocos datos, o datos casi ordenados: insertion sort.
- Datos en una lista enlazada, o un peor caso garantizado: merge sort.
- Un arreglo sin orden previo y sin memoria de sobra: quicksort con un pivote
  que no sea siempre el último.

## Para el juez

### UVa 10041 — Vito's Family

*UVa 10041 — Vito's Family*, <https://onlinejudge.org/external/100/10041.pdf>.
Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=982>.

La casa de Vito va en la mediana de las direcciones: se ordena con quicksort y
se suman las distancias a $s[r/2]$.

Vito tiene $r$ parientes en una misma avenida, con $0 < r < 500$, y cada uno
vive en un número $s_i$ con $0 < s_i < 30\,000$. Hay que escoger el número de
su casa para que la suma de las distancias $|s_i - s_j|$ a todos sea mínima, e
imprimir esa suma. La primera línea trae el número de casos. Con
$\langle 2, 4 \rangle$ la respuesta es 2: cualquier casa entre 2 y 4 suma 2.
Con $\langle 2, 4, 6 \rangle$ es 4: la casa en el 4 suma $2 + 0 + 2$, y en el 3
sumaría $1 + 1 + 3 = 5$.

La casa óptima es la mediana: si hay más parientes a la derecha que a la
izquierda, correrse un paso a la derecha baja la suma. Cuesta
$\Theta(r \log r)$ esperado y $\Theta(r^2)$ en el peor caso, que con $r < 500$
entra igual.

!!! warning "Las trampas"

    - Los números no vienen ordenados.
    - El promedio no sirve: con $\langle 1, 1, 1, 1, 1, 1000 \rangle$ el
      promedio es 167,5 y la mediana en 1, que suma 999.
    - Varios parientes pueden vivir en el mismo número, y la casa puede
      coincidir con la de uno de ellos.

### UVa 10905 — Children's Game

*UVa 10905 — Children's Game*, <https://onlinejudge.org/external/109/10905.pdf>.
Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1846>.

Quicksort con otra comparación: $p$ va antes que $q$ si $p$ seguido de $q$
forma un número mayor que $q$ seguido de $p$.

Cada caso trae $N \leq 50$ enteros positivos. Hay que pegarlos uno detrás de
otro, en algún orden, para formar el entero más grande posible, e imprimirlo.
La entrada termina con $N = 0$. Con 123, 124, 56 y 90 la respuesta es
`9056124123`. Si se agrega un 9, es `99056124123`: el 9 va antes que el 90. Con
cinco nueves es `99999`.

`particionar` solo pregunta si un elemento va antes que el pivote. Los números
se leen como texto con `scanf("%s")`, y `vaAntes(p, q)` pega $p$ con $q$ y $q$
con $p$ y compara los dos resultados con `strcmp`. La condición
$a[j] \leq x$ se cambia por `!vaAntes(x, a[j])`, y se ordena un arreglo de
índices para no copiar cadenas al intercambiar. Con $N \leq 50$, aun el peor
caso de quicksort son 1225 comparaciones por caso.

!!! warning "Las trampas"

    - Ordenar por valor no sirve: 90 es mayor que 9, pero `990` gana a `909`.
    - Ordenar el texto de mayor a menor tampoco: 121 va después de 12 en ese
      orden, y `12121` gana a `12112`, así que el 12 va primero.
    - El enunciado no acota los dígitos: el resultado no cabe en un entero y se
      arma como texto.

### Soluciones

Cada una lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uvaNNNN.in`. Las dos ordenan con el `particionar` y el `quicksort` de
la sesión.

- UVa 10041 — Vito's Family: [uva10041.cpp](./codigo/uva10041.cpp),
  [entrada](./codigo/uva10041.in), [salida](./codigo/uva10041.out)
- UVa 10905 — Children's Game: [uva10905.cpp](./codigo/uva10905.cpp),
  [entrada](./codigo/uva10905.in), [salida](./codigo/uva10905.out)

## Lo que se vio

- La cola doble necesita la lista doblemente enlazada con `ultimo`: con la
  simple, `eliminarFinal` cuesta $\Theta(n)$ porque hay que llegar al
  penúltimo, y con la doble las cuatro operaciones de los extremos son
  $\Theta(1)$.
- Sin el contador, `vacia()` sigue en $\Theta(1)$ y `tamano()` pasa a
  $\Theta(n)$. Un ciclo que pregunte `tamano()` en cada vuelta sube de
  $\Theta(n)$ a $\Theta(n^2)$.
- Invertir una cola con una pila auxiliar cuesta $\Theta(n)$ en tiempo y
  $\Theta(n)$ de espacio aparte.
- `particionar` toma $x = a[\mathit{fin}]$ y reparte el arreglo en cuatro
  zonas: los menores o iguales que $x$, los mayores, lo que falta por revisar y
  el pivote. Al salir, el pivote queda entre las dos primeras. Hace $n - 1$
  comparaciones, $\Theta(n)$ en tiempo y $\Theta(1)$ de espacio aparte.
- Quicksort paga al partir y no combina nada. Con particiones balanceadas,
  $T(n) = 2\,T(n/2) + \Theta(n) = \Theta(n \log n)$.
- Con el pivote en el último lugar, la entrada ya ordenada es el peor caso:
  $C(n) = n(n-1)/2 \in \Theta(n^2)$, con testigos $c = 1/2$, $k = 1$ para la
  cota superior y $c = 1/4$, $k = 2$ para la inferior.
- El espacio aparte es la pila de llamadas: $\Theta(\log n)$ balanceado y
  $\Theta(n)$ con la entrada ordenada, que desborda la pila de 8 MB con
  300 000 elementos. El pivote del medio o al azar evita esa entrada.
- Con 4096 elementos mezclados, quicksort hizo 54 266 comparaciones, merge sort
  43 220 e insertion sort 4 162 689.

## Ejercicios

### Todos iguales

Ejecute `quicksort` sobre $\langle 4, 4, 4, 4, 4 \rangle$. ¿Qué devuelve la
primera llamada a `particionar`? ¿De qué tamaño son las dos llamadas que
siguen? ¿Cuántas comparaciones hace en total con $n$ elementos iguales? ¿Ayuda
tomar el pivote del medio?

Todos cumplen $a[j] \leq 4$, así que `i` avanza con `j` y `particionar`
devuelve $q = \mathit{fin}$: la izquierda tiene $n - 1$ elementos y la derecha
ninguno. Es el mismo caso del arreglo ordenado, $n(n-1)/2$ comparaciones,
$\Theta(n^2)$.

El pivote del medio no ayuda: todos los candidatos valen lo mismo. El problema
está en la condición $a[j] \leq x$, que manda a todos los iguales al mismo
lado.

### Solo un lado

Se quiere el $k$-ésimo menor de un arreglo, contando desde 0, sin ordenarlo
entero. Después de `particionar`, el pivote ya está en la casilla $q$ que
ocuparía con el arreglo ordenado.

1. Si $k = q$, ¿cuál es la respuesta? ¿Y si $k < q$, o si $k > q$, en qué
   rango hay que seguir buscando?
2. Escriba `seleccionar(a, ini, fin, k)` con un `while`, sin recursión.
3. ¿Cuánto cuesta si cada partición deja la mitad? ¿Y en el peor caso?

Si $k = q$, la respuesta es $a[q]$. Si $k < q$, el $k$-ésimo está en
$a[\mathit{ini}..q-1]$, y si $k > q$ en $a[q+1..\mathit{fin}]$. A diferencia de
quicksort, se sigue por un solo lado: el ciclo mueve `fin` a $q - 1$ o `ini` a
$q + 1$ y vuelve a particionar, hasta que $q = k$.

Con particiones a la mitad el trabajo es
$n + n/2 + n/4 + \cdots \leq 2n$: $\Theta(n)$, menos que ordenar. En el peor
caso cada partición quita un solo elemento y vuelve a ser $\Theta(n^2)$. El
espacio aparte es $\Theta(1)$, porque no hay recursión.

## Para practicar en casa

### Propuesto 1: de mayor a menor

¿Qué línea de `particionar` se cambia para que quicksort ordene de mayor a
menor? ¿Cómo quedan las zonas?

Pista: solo cambia la comparación, $a[j] \geq x$. Las zonas se voltean: a la
izquierda quedan los mayores o iguales y a la derecha los menores.

### Propuesto 2: la traza al revés

Siga quicksort sobre $\langle 5, 4, 3, 2, 1 \rangle$. ¿Dónde queda cada pivote
y cuántas comparaciones hace en total?

Pista: el primer pivote es el 1, el mínimo: queda en la casilla 0 y la derecha
tiene cuatro elementos, ya no en orden decreciente. Siga la traza: el total
coincide con el del arreglo ordenado.

### Propuesto 3: menos pila

Cambie la segunda llamada recursiva por un `while` que siga con el rango más
grande y llame recursivamente solo con el más pequeño. ¿Qué profundidad alcanza
la pila en el peor caso?

Pista: siempre se llama con el rango pequeño, que tiene a lo sumo la mitad de
los elementos. Piense cuántas veces se puede partir $n$ por la mitad antes de
llegar a 1.

### Propuesto 4: quicksort sobre la lista enlazada

`i` y `j` solo avanzan. ¿Se puede escribir `particionar` sobre una lista
simple, con punteros en lugar de índices? ¿Qué pivote es barato de tomar?

Pista: sí, los dos punteros avanzan de a un nodo, como `i` y `j`. El pivote
barato es el primer nodo; los intercambios pueden cambiar datos sin tocar los
enlaces.

### Propuesto 5: tres zonas

Escriba un `particionar` que deje los menores, después los iguales al pivote y
al final los mayores, y que devuelva dónde empiezan y terminan los iguales.
Este queda abierto: cuatro zonas en vez de tres, con un índice más para marcar
dónde empieza cada una.

## Ejercicios interactivos

Ocho actividades que se trabajan en el navegador, ordenadas por los temas de la
sesión, en la [página de ejercicios interactivos](./Ejercicios.md): cuánto
camina cada TAD al sumar sus elementos con el contrato; rotar una cola y
concatenar dos cambiando punteros, con su costo y sus casos límite;
`particionar` paso a paso con las zonas de cada casilla; qué quedó mal en cada
uno de seis estados anotados; un arreglo propio partido y ordenado llamada por
llamada; las comparaciones y la profundidad de quicksort en entradas pequeñas;
y cuál de cuatro órdenes de los mismos valores es el peor caso. Los programas
no son los de la sesión: mismo tema, valores nuevos.

## Lo que sigue

Los contenedores `list`, `deque`, `stack` y `queue` de la biblioteca: qué
implementación tiene cada uno por dentro y qué cuestan sus operaciones,
comparados con los TAD construidos a mano.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

**Los TAD sobre nodos**

- [cola_nodos.h](./codigo/cola_nodos.h) — la cola directa sobre nodos, con
  cabeza y último.
- [pila_nodos.h](./codigo/pila_nodos.h) — la pila directa sobre nodos, con la
  cima en la cabeza.

**Ejercicios sobre las implementaciones**

- [cola_doble.h](./codigo/cola_doble.h) y
  [cola_doble_uso.cpp](./codigo/cola_doble_uso.cpp) — la cola doble sobre la
  lista doblemente enlazada. Imprime `frente 1, final 7, tamano 3`,
  `sin el final: frente 1, final 4`, `vacia: 1` y `de nuevo: frente 9, final 9`.
- [cola_sin_n.h](./codigo/cola_sin_n.h) y
  [cola_sin_n_uso.cpp](./codigo/cola_sin_n_uso.cpp) — la cola sin contador.
  Imprime `vacia 1, tamano 0`, `vacia 0, tamano 3, frente 3` y
  `tamano 2, frente 8`.
- [invertir.cpp](./codigo/invertir.cpp) — invertir una cola con una pila.
  Imprime `antes:   3 1 4 1 5` y `despues: 5 1 4 1 3`.

**Quicksort**

- [quicksort.cpp](./codigo/quicksort.cpp) — `particionar` y `quicksort`.
  Imprime `particionar: 2 4 1 5 9 7`, `el pivote quedo en 3` y
  `quicksort:   1 2 3 4 6 7 8 9`.
- [comparar.cpp](./codigo/comparar.cpp) — comparaciones de insertion sort,
  merge sort y quicksort sobre el mezclado, el ordenado y el al revés; imprime
  la tabla de la sección «Los tres algoritmos sobre la misma entrada».

Las soluciones de los problemas de juez están en la sección «Para el juez», con
su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 7, quicksort: §7.1 descripción
  y `PARTITION`, §7.2 desempeño, §7.3 versión aleatoria, §7.4 análisis.
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 14, búsqueda y ordenamiento.
- N. Kalicharan. *Data Structures in C*, 2008. Capítulo 4, pilas y colas.
