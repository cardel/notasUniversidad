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
explicar cómo `particionar` deja el pivote en su lugar definitivo, con las dos
colas que viven dentro del arreglo; construir quicksort sobre `particionar`, con
recursión y con una pila de rangos, y justificar su costo en tiempo y en
espacio; y comparar insertion sort, merge sort y
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

### ¿En qué casilla queda el 5?

!!! question "Pregunta"

    En $\langle 7, 2, 9, 4, 1, 5 \rangle$, ¿en qué casilla queda el 5 cuando
    el arreglo esté ordenado? ¿Hace falta ordenarlo para saberlo?

??? success "Respuesta"

    Se cuentan los valores menores o iguales que 5, sin contarlo a él: son
    tres, el 2, el 4 y el 1. Con el arreglo ordenado el 5 tiene tres valores a
    su izquierda, así que queda en la casilla 3.

    | 0 | 1 | 2 | 3 | 4 | 5 |
    |:---:|:---:|:---:|:---:|:---:|:---:|
    | 2 | 4 | 1 | **5** | 9 | 7 |

    No hace falta ordenar. Basta separar: los menores o iguales a la
    izquierda, en cualquier orden, después el 5 y al final los mayores. Con
    eso el 5 ya está en la casilla que ocupará en el arreglo ordenado.

### Pagar al partir

Merge sort parte por la mitad sin mirar los datos y paga al final: mezclar dos
mitades ordenadas las recorre enteras. Si al partir ya quedan a la izquierda
los menores o iguales y a la derecha los mayores, ordenar cada lado deja todo
el arreglo ordenado y combinar no cuesta nada.

Quicksort sigue los tres pasos de dividir, conquistar y combinar sobre un
arreglo $a[\mathit{ini}..\mathit{fin}]$ (CLRS, §7.1):

- **Dividir**: escoger un pivote $x$ y reordenar para que queden primero los
  menores o iguales que $x$, después $x$ y al final los mayores. El pivote
  queda en una posición $q$.
- **Conquistar**: ordenar $a[\mathit{ini}..q-1]$ y $a[q+1..\mathit{fin}]$ con
  el mismo procedimiento.
- **Combinar**: no hay nada que hacer.

### ¿Entendimos el problema?

Partir es el paso que hace todo el trabajo. Se llama `particionar`.

- **Entradas**: el arreglo `a` y dos índices `ini` $\leq$ `fin`. El pivote es
  el último del rango: $x = a[\mathit{fin}]$.
- **Salida**: una posición $q$ y el arreglo reordenado: de `ini` a $q-1$ los
  menores o iguales que $x$, en $q$ el pivote y de $q+1$ a `fin` los mayores.
  Dentro de cada lado no se pide orden.

!!! example "Ejemplo"

    Con $\langle 7, 2, 9, 4, 1, 5 \rangle$, $\mathit{ini} = 0$ y
    $\mathit{fin} = 5$: $x = 5$ y $q = 3$. Sirven $\langle 2, 4, 1, 5, 9, 7 \rangle$ y también
    $\langle 1, 4, 2, 5, 7, 9 \rangle$. Lo único que no puede pasar es que un
    mayor que 5 quede a la izquierda del pivote.

### Primera idea: dos colas

Con las colas de nodos ya construidas, partir es repartir:

- Recorrer $a[\mathit{ini}..\mathit{fin}-1]$ y encolar cada valor en
  `menores` si es $\leq x$, o en `mayores` si no.
- Reescribir el arreglo desde `ini`: primero lo que sale de `menores`, después
  $x$ y al final lo que sale de `mayores`. El pivote queda en
  $q = \mathit{ini} + {}$`menores.tamano()`.

Sobre $\langle 7, 2, 9, 4, 1, 5 \rangle$, con $x = 5$, el arreglo no cambia
mientras se reparte; solo crecen las colas, con el frente a la izquierda:

| Llega | Va a | `menores` | `mayores` |
|:---:|---|---|---|
| 7 | `mayores`, porque es mayor que 5 | vacía | 7 |
| 2 | `menores` | 2 | 7 |
| 9 | `mayores`, detrás del 7 | 2 | 7 9 |
| 4 | `menores` | 2 4 | 7 9 |
| 1 | `menores`; `j` llegó a `fin` | 2 4 1 | 7 9 |

Después se reescribe desde `ini`: se vacía `menores`, va el pivote y se vacía
`mayores`. El arreglo queda $\langle 2, 4, 1, \mathbf{5}, 7, 9 \rangle$, las
dos colas vacías y $q = 3$.

| | Costo con $n = \mathit{fin} - \mathit{ini} + 1$ | Por qué |
|---|---|---|
| tiempo | $\Theta(n)$ | cada valor se encola y se desencola una vez |
| espacio aparte | $\Theta(n)$ | un nodo por valor, repartidos en las dos colas |

El tiempo no se puede bajar: hay que mirar cada valor. El espacio sí molesta,
porque los valores ya caben en el arreglo.

!!! question "Pregunta"

    ¿Se puede partir sin pedir memoria, moviendo los valores dentro del mismo
    arreglo?

??? success "Respuesta"

    Sí. Las dos colas caben en el mismo arreglo, una al lado de la otra, y dos
    índices marcan dónde termina cada una.

### Las dos colas dentro del arreglo

| $a[\mathit{ini}..i]$ | $a[i+1..j-1]$ | $a[j..\mathit{fin}-1]$ | $a[\mathit{fin}]$ |
|:---:|:---:|:---:|:---:|
| $\leq x$ | $> x$ | sin revisar | $x$ |
| menores: crece por su final | cola de mayores: frente en `i+1`, final en `j-1` | | pivote |

- `j` recorre de izquierda a derecha y revisa un valor por vuelta.
- Llega un mayor que $x$: ya está pegado al final de la cola de mayores. Entra
  solo con avanzar `j`.
- Llega un menor o igual: el frente de los mayores, $a[i+1]$, sale y pasa al
  final, a la casilla `j`; el menor ocupa su puesto, que ahora es el final de
  los menores. Ese movimiento es `intercambiar(a, i + 1, j)`.

Con $x = 5$ en $\langle 2, 1, 8, 6, 7, 3, 5 \rangle$, ya revisados el 2, el 1,
el 8 y el 6. Entre corchetes los menores o iguales, en negrita la cola de
mayores y después de la barra el pivote:

| `i` | `j` | $a[0..6]$ | Qué pasa |
|---:|---:|---|---|
| 1 | 4 | [2 1] **8 6** 7 3 \| 5 | llega el 7, mayor: avanza `j` |
| 1 | 5 | [2 1] **8 6 7** 3 \| 5 | llega el 3, menor: sale el 8 del frente y el 3 toma su puesto |
| 2 | 6 | [2 1 3] **6 7 8** \| 5 | los mayores quedan 6, 7, 8 |

Al terminar, el pivote entra como un menor más: `intercambiar(a, i + 1, fin)`
lo pone en el puesto del frente de los mayores, y ese frente pasa a la última
casilla.

### El ejemplo más pequeño: $\langle 3, 1, 2 \rangle$

$\mathit{ini} = 0$, $\mathit{fin} = 2$ y el pivote es $x = 2$.

| `i` | `j` | $a[0..2]$ | Qué pasa |
|---:|---:|---|---|
| $-1$ | 0 | 3 1 \| 2 | al empezar las dos colas están vacías |
| $-1$ | 1 | **3** 1 \| 2 | llega el 3, mayor que 2: entra a la cola de mayores y solo avanza `j` |
| 0 | 2 | [1] **3** \| 2 | llega el 1: el 3 sale del frente y pasa al final; el 1 toma su puesto con `intercambiar(a, 0, 1)` |
| | | [1] 2 **3** | `j` llegó a `fin`: el pivote entra como un menor con `intercambiar(a, 1, 2)` y $q = 1$ |

### Paso a paso con $\langle 7, 2, 9, 4, 1, 5 \rangle$

$\mathit{ini} = 0$, $\mathit{fin} = 5$, $x = 5$. Cada fila de la tabla es una
vuelta del ciclo, y la última columna muestra el arreglo después de esa vuelta,
con las mismas marcas: corchetes para los menores o iguales, negrita para la
cola de mayores y la barra antes del pivote.

| `i` | `j` | $a[j]$ | $\leq 5$ | Qué pasa | $a[0..5]$ después |
|---:|---:|---:|:---:|---|---|
| $-1$ | 0 | 7 | no | el 7 entra al final de los mayores | **7** 2 9 4 1 \| 5 |

!!! question "Pregunta"

    Llega el 2, menor o igual que 5. ¿Quién sale del frente de los mayores y a
    qué casilla va?

??? success "Respuesta"

    Sale el 7, el único de la cola, y pasa a la casilla 1; el 2 queda en la 0,
    al final de los menores.

| `i` | `j` | $a[j]$ | $\leq 5$ | Qué pasa | $a[0..5]$ después |
|---:|---:|---:|:---:|---|---|
| $-1$ | 1 | 2 | sí | sale el 7: `intercambiar(a, 0, 1)` | [2] **7** 9 4 1 \| 5 |
| 0 | 2 | 9 | no | el 9 entra al final de los mayores | [2] **7 9** 4 1 \| 5 |
| 0 | 3 | 4 | sí | sale el 7: `intercambiar(a, 1, 3)` | [2 4] **9 7** 1 \| 5 |
| 1 | 4 | 1 | sí | sale el 9: `intercambiar(a, 2, 4)` | [2 4 1] **7 9** \| 5 |

En la fila de $j = 3$ la cola de mayores era 7, 9: el 7 salió del frente y
quedó detrás del 9.

!!! question "Pregunta"

    `j` llegó a `fin` y no queda nada sin revisar. ¿En qué casilla va el pivote
    y a dónde va el valor que estaba ahí?

??? success "Respuesta"

    En la casilla $i + 1 = 3$, el frente de los mayores. El 7 sale y pasa a la
    casilla 5: el pivote entró como un menor más.

    | `i` | `j` | $a[j]$ | $\leq 5$ | Qué pasa | $a[0..5]$ después |
    |---:|---:|---:|:---:|---|---|
    | 2 | 5 | | | $j = \mathit{fin}$: `intercambiar(a, 3, 5)`, $q = 3$ | [2 4 1] 5 **9 7** |

Los dos lados no quedan ordenados, pero el 5 ya está en la casilla que ocupará
al final. Es la salida de `quicksort.cpp`: `particionar: 2 4 1 5 9 7` y
`el pivote quedo en 3`.

### El diseño en pseudocódigo

```text
particionar(a, ini, fin):
  x <- a[fin]
  i <- ini - 1               // final de los menores
  para j desde ini hasta fin - 1:
    si a[j] <= x:
      i <- i + 1
      intercambiar a[i] y a[j]    // sale el frente
  intercambiar a[i + 1] y a[fin]  // entra el pivote
  devolver i + 1
```

Un mayor no se mueve: entra a su cola cuando avanza `j`. El pseudocódigo hace
un intercambio por cada menor o igual, y uno más al final para el pivote.

### `particionar` en C++ (CLRS, §7.1)

De [quicksort.cpp](./codigo/quicksort.cpp):

```cpp
void intercambiar(Elemento a[], int p, int q) {
  Elemento temp = a[p];
  a[p] = a[q];
  a[q] = temp;
}
```

`intercambiar` hace tres asignaciones y usa una variable: cuesta $\Theta(1)$ en
tiempo y en espacio.

`particionar` es el pseudocódigo línea por línea, con el `para` escrito como
`while`. Las colas de la primera idea ya no aparecen como objetos: viven en el
arreglo, entre `ini` e `i` y entre `i+1` y `j-1`.

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

### El árbol de llamadas sobre $\langle 7, 2, 9, 4, 1, 5 \rangle$

Cada nivel del árbol reúne las llamadas de la misma profundidad. La última
columna es el arreglo al terminar el nivel; en negrita, los valores que ya
quedaron fijos en su casilla.

| Nivel | Llamadas | Qué queda fijo | Arreglo |
|---:|---|---|---|
| 0 | $[0..5]$ `7 2 9 4 1 5`, $q = 3$ | el 5, en la casilla 3 | 2 4 1 **5** 9 7 |
| 1 | $[0..2]$ `2 4 1`, $q = 0$; $[4..5]$ `9 7`, $q = 4$ | el 1 y el 7 | **1** 4 2 **5 7** 9 |
| 2 | $[0..-1]$ vacío; $[1..2]$ `4 2`, $q = 1$; $[4..3]$ vacío; $[5..5]$ `9`, un elemento | el 2; el 9 queda solo en su casilla | **1 2** 4 **5 7 9** |
| 3 | $[1..0]$ vacío; $[2..2]$ `4`, un elemento | el 4, solo en su casilla | **1 2 4 5 7 9** |

Los rangos vacíos y los de un elemento no entran al `if`. Al terminar el nivel 3
todo el arreglo está ordenado.

### Las llamadas pendientes forman una pila

Mientras se ordena la izquierda, la derecha espera como un rango
$[\mathit{ini}, \mathit{fin}]$, y el último que entra es el primero que se
atiende: una pila. Cada fila saca un rango; si tiene dos o más elementos, lo
parte y apila los dos lados, el izquierdo encima.

| Saca | $q$ | Arreglo | Pila después (tope a la izquierda) |
|---|---|---|---|
| | | 7 2 9 4 1 5 | $[0,5]$ |
| $[0,5]$ | 3 | 2 4 1 5 9 7 | $[0,2]\ [4,5]$ |
| $[0,2]$ | 0 | 1 4 2 5 9 7 | $[0,-1]\ [1,2]\ [4,5]$ |
| $[0,-1]$ | vacío | | $[1,2]\ [4,5]$ |
| $[1,2]$ | 1 | 1 2 4 5 9 7 | $[1,0]\ [2,2]\ [4,5]$ |
| $[1,0]$ | vacío | | $[2,2]\ [4,5]$ |
| $[2,2]$ | uno | | $[4,5]$ |
| $[4,5]$ | 4 | 1 2 4 5 7 9 | $[4,3]\ [5,5]$ |
| $[4,3]$ | vacío | | $[5,5]$ |
| $[5,5]$ | uno | | vacía |

Los rangos salen en el orden de las llamadas de `quicksort`, y la pila nunca
guarda más de tres.

### `quicksortPila`: la misma pila, escrita a mano

De [quicksort_pila.cpp](./codigo/quicksort_pila.cpp):

```cpp
// Cada rango pendiente [p, r] ocupa dos enteros en la pila:
// se apila r y despues p, asi que p sale primero.
void quicksortPila(Elemento a[], int ini, int fin) {
  Pila pendientes;
  pendientes.apilar(fin);
  pendientes.apilar(ini);
  while (!pendientes.vacia()) {
    int p = pendientes.tope();
    pendientes.desapilar();
    int r = pendientes.tope();
    pendientes.desapilar();
    if (p < r) {
      int q = particionar(a, p, r);
      pendientes.apilar(r);
      pendientes.apilar(q + 1);
      pendientes.apilar(q - 1);
      pendientes.apilar(p);
    }
  }
}
```

Usa la pila de nodos de la sesión (`#include "pila_nodos.h"`) y guarda cada
rango como dos enteros: se apila `fin` y después `ini`, así que `ini` sale
primero. El `if` es el mismo de `quicksort`; las dos llamadas recursivas se
cambiaron por dos rangos apilados. El lado derecho se apila primero para que el
izquierdo quede encima y se atienda antes, como en la versión recursiva.

Sobre los mismos arreglos, `quicksort_pila.cpp` imprime
`quicksortPila: 1 2 4 5 7 9` y `quicksortPila: 1 2 3 4 6 7 8 9`.

La diferencia está en dónde vive la pila: los nodos se piden con `new` y no
ocupan registros en la pila de llamadas del programa.

### Lo que cuesta cada pieza

| Pieza | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| `intercambiar` | $\Theta(1)$ | $\Theta(1)$ | tres asignaciones y `temp` |
| partir con dos colas | $\Theta(n)$ | $\Theta(n)$ | cada valor entra y sale de una cola; un nodo por valor |
| `particionar` | $\Theta(n)$ | $\Theta(1)$ | una vuelta por casilla; las colas viven en el arreglo |
| `apilar`, `desapilar` | $\Theta(1)$ | un nodo | se trabaja solo en la cima |
| `quicksort` | $\Theta(n \log n)$ a $\Theta(n^2)$ | $\Theta(\log n)$ a $\Theta(n)$ | depende de dónde caiga $q$; el espacio es la pila de llamadas |
| `quicksortPila` | $\Theta(n \log n)$ a $\Theta(n^2)$ | $\Theta(\log n)$ a $\Theta(n)$ | las mismas particiones; el espacio son los rangos pendientes |

Los dos extremos de `quicksort` salen de dónde cae el pivote, y la sección
siguiente los calcula. La profundidad de la pila, de llamadas o de rangos, es
la de [La pila de llamadas](#la-pila-de-llamadas).

### Partir otros arreglos

!!! question "Pregunta"

    `particionar` sobre $\langle 6, 8, 2, 9, 3 \rangle$ con $\mathit{ini} = 0$
    y $\mathit{fin} = 4$: ¿qué $q$ devuelve y cómo queda el arreglo?

??? success "Respuesta"

    Con $x = 3$, $q = 1$ y queda $\langle 2, 3, 6, 9, 8 \rangle$. Solo el 2 es
    menor o igual que 3. La cola de mayores pasa por 6, 8; luego 8, 6; luego
    8, 6, 9. Al final el pivote saca al 8 del frente.

!!! question "Pregunta"

    `particionar` sobre $\langle 1, 9, 6, 2, 7 \rangle$ con $\mathit{ini} = 0$
    y $\mathit{fin} = 4$: ¿qué $q$ devuelve y cómo queda el arreglo?

??? success "Respuesta"

    Con $x = 7$, $q = 3$ y queda $\langle 1, 6, 2, 7, 9 \rangle$. El 1 llega
    con la cola de mayores vacía y se intercambia consigo mismo. Después el 9
    sale del frente dos veces: con el 6 y con el 2.

!!! question "Pregunta"

    `particionar` sobre $\langle 5, 3, 8, 1 \rangle$ con $\mathit{ini} = 0$ y
    $\mathit{fin} = 3$: ¿qué $q$ devuelve y cómo queda el arreglo?

??? success "Respuesta"

    Con $x = 1$, $q = 0$ y queda $\langle 1, 3, 8, 5 \rangle$. Nadie es menor
    o igual que 1: `i` se queda en $-1$ y el pivote toma la casilla 0. Los
    mayores 5, 3, 8 quedan 3, 8, 5.

### Por qué queda ordenado

Cada llamada a `particionar` deja su pivote en la casilla que ocupará en el
arreglo ordenado. Las dos llamadas que siguen trabajan cada una de su lado y
nunca se cruzan: nada de la izquierda tiene que pasar a la derecha. Cuando los
rangos llegan a cero o un elemento, cada valor ya fue pivote o quedó solo en su
casilla.

En el árbol de $\langle 7, 2, 9, 4, 1, 5 \rangle$ se ve igual: cada nivel fija
sus pivotes, y ninguno se vuelve a mover.

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
| `quicksortPila` | la misma | los rangos van en nodos pedidos con `new` |

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
- Partir con dos colas de nodos funciona, pero pide $\Theta(n)$ de
  memoria aparte. Las dos colas caben dentro del arreglo: cuando llega un
  menor o igual al pivote, el frente de la cola de mayores, $a[i+1]$,
  pasa al final con `intercambiar(a, i + 1, j)`.
- Las llamadas pendientes de quicksort forman una pila de rangos.
  `quicksortPila` la escribe con la pila de nodos y da el mismo
  resultado; su altura es el espacio aparte del algoritmo.
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
- [quicksort_pila.cpp](./codigo/quicksort_pila.cpp): `quicksortPila`, con los
  rangos pendientes en la pila de nodos. Imprime `quicksortPila: 1 2 4 5 7 9`
  y `quicksortPila: 1 2 3 4 6 7 8 9`.
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
