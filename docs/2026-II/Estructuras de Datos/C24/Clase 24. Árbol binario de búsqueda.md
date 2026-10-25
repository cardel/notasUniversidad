# Estructuras de Datos · Clase 24. Árbol binario de búsqueda

Viernes 30 de octubre de 2026, de 14:00 a 17:00.

El inorden del árbol de ejemplo del tema anterior salió ordenado, y no por
casualidad: en cada nodo, lo de la izquierda era menor y lo de la derecha
mayor. Esa regla define el árbol binario de búsqueda, y con ella buscar,
insertar y borrar dejan de visitar los $n$ nodos para bajar por un solo camino.
La sesión escribe las tres operaciones en forma recursiva respondiendo
siempre las mismas tres preguntas, pasa buscar e insertar a un ciclo y sigue
a mano los tres casos de borrar. El costo de todas es $O(h)$, y un experimento
muestra cuánto vale $h$ según el orden en que llegan las claves: con mil claves
en orden, 999; desordenadas, 20.

Al terminar, el objetivo es poder decidir si un árbol binario es de búsqueda
mirando cada subárbol completo y explicar por qué su inorden sale ordenado;
escribir buscar, insertar y borrar en forma recursiva a partir de su caso
base, el subárbol al que bajan y lo que hacen con lo que devuelve la llamada;
pasar buscar e insertar a un ciclo y comparar el espacio de las dos versiones;
seguir a mano cada operación, incluidos los tres casos de borrar; dar el costo
$O(h)$ de cada una con la razón por la que la altura depende del orden de
inserción; y resolver con recursión ejercicios y problemas de juez sobre el
árbol.

## Diapositivas

![](./clase24.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: árbol binario y recursión

Un árbol binario es vacío (`NULL`) o es un nodo con un dato, un subárbol
izquierdo y un subárbol derecho. En el árbol de raíz 8 con hijos 3 y 10, donde
el 3 tiene a 1 y 6, el 6 tiene a 4 y 7 y el 10 tiene a 14 por la derecha, el
preorden es `8 3 1 6 4 7 10 14`, el inorden `1 3 4 6 7 8 10 14` y el posorden
`1 4 7 6 3 14 10 8`. Los tres cuestan $\Theta(n)$ y piden $O(h)$ de espacio
aparte, en marcos de la pila de llamadas o en la pila explícita de
`inordenPila`.

Cada función recursiva sobre un árbol responde tres preguntas:

| Función | Caso base | ¿A qué subárbol baja? | ¿Qué hace con lo que vuelve? |
|---|---|---|---|
| `tamano` | vacío: 0 | a los dos | $1 +$ la suma |
| `altura` | vacío: $-1$ | a los dos | $1 +$ el mayor |
| `inorden` | vacío: nada | a los dos | nada; imprime en medio |

Las tres bajan a los dos subárboles, y por eso visitan los $n$ nodos. En el
árbol de esta sesión casi siempre basta con bajar a uno.

## Buscar rápido sin perder el orden

La biblioteca anota los carnés de quienes tienen un libro prestado. Llegan
órdenes de cuatro tipos: agregar un carné, preguntar si está, quitarlo e
imprimir todos de menor a mayor. Hay decenas de miles de carnés y las órdenes
llegan en cualquier orden. Con `agregar 8`, `agregar 3`, `agregar 10` y
`esta 3` la respuesta es `si`; tras `quitar 3`, `esta 3` responde `no`, y
`listar` imprime `8 10`.

Con una lista enlazada ordenada, enlazar cuesta $\Theta(1)$ pero antes hay que
caminar hasta el lugar, así que agregar, buscar y quitar cuestan $\Theta(n)$.
Con un arreglo ordenado, la búsqueda binaria encuentra en $\Theta(\log n)$,
pero agregar y quitar corren los elementos que siguen.

| | Buscar | Agregar | Quitar | Listar en orden |
|---|---|---|---|---|
| Lista ordenada | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |
| Arreglo ordenado | $\Theta(\log n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |
| Tabla hash | $\Theta(1 + \alpha)$ prom. | $\Theta(1 + \alpha)$ prom. | $\Theta(1 + \alpha)$ prom. | ordenar: $\Theta(n \log n)$ |
| Lo que se quiere | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $\Theta(n)$ |

### La búsqueda binaria ya dibuja un árbol

Sobre el arreglo `1 2 3 4 5 6 7`, la búsqueda binaria mira primero el 4;
después el 2 o el 6; después uno de 1, 3, 5 o 7. Las comparaciones posibles
forman un árbol con el 4 en la raíz. Si cada casilla del medio fuera un nodo
con punteros a sus dos mitades, agregar el 8 no correría nada: el 8 se compara
con 4, con 6 y con 7, y se cuelga como hijo derecho del 7. Con nodos y
punteros, insertar es seguir el camino de la búsqueda y enlazar un nodo nuevo
al final. Esa estructura es el árbol binario de búsqueda.

## El árbol binario de búsqueda

Un árbol binario de búsqueda (ABB; CLRS, §12.1; Thareja, §10.1) es un árbol
binario donde, para cada nodo $x$, toda clave del subárbol izquierdo de $x$ es
menor que la clave de $x$, y toda clave del subárbol derecho es mayor. CLRS
admite claves repetidas con $\le$ y $\ge$; aquí las claves son distintas, e
insertar una clave que ya está deja el árbol igual.

Las trazas usan el árbol que deja insertar `8 3 10 1 6 14 4 7 13`: el de
arriba con el 13 como hijo izquierdo del 14. En el 8, a la izquierda quedan 1,
3, 4, 6 y 7, todos menores, y a la derecha 10, 13 y 14, todos mayores. En el 3,
a la izquierda está el 1 y a la derecha 4, 6 y 7. Lo mismo pasa en cada nodo.

### ¿Cuáles son ABB?

Tres árboles: A es 5 con hijos 3 (que tiene a 2 y 4) y 8 (que tiene a 9 por la
derecha); B es 8 con hijos 3 (que tiene a 1 y 9) y 10; C es 7 con hijos 4 (que
tiene a 5 y 6) y 9. Un compañero revisa cada nodo contra sus dos hijos: el
izquierdo debe ser menor y el derecho mayor. A es ABB, y acierta. C no lo es,
porque el 5 es hijo izquierdo del 4, y también lo detecta. B lo engaña: cada
nodo cumple con sus hijos, ya que el 9 es mayor que su padre 3, pero el 9 está
en el subárbol izquierdo del 8 y es mayor que 8.

!!! warning "El error de mirar solo a los hijos"

    La definición habla de todo el subárbol, no de los hijos inmediatos. En los
    ejercicios aparece la función que lo revisa bien, con el rango de valores
    que le toca a cada nodo.

### El inorden de un ABB sale ordenado

El inorden imprime primero todo el subárbol izquierdo, después la raíz y
después todo el subárbol derecho. En un ABB eso es: primero las claves menores
que la raíz, luego la raíz, luego las mayores. Dentro de cada subárbol pasa lo
mismo, así que nadie sale de su lugar, y el árbol de las trazas imprime
`1 3 4 6 7 8 10 13 14`. El árbol del repaso era un ABB. El `map` recorre sus
claves en orden por la misma razón: por dentro guarda un árbol de búsqueda.

### El ABB en C++

El nodo es el del árbol binario, un dato y dos punteros, y `abb.h` incluye
`arbol_binario.h` y le agrega las operaciones de búsqueda:

| Función | Devuelve |
|---|---|
| `buscar(r, k)`, `buscarIterativa(r, k)` | el nodo con la clave `k`, o `NULL` |
| `minimo(r)`, `maximo(r)` | el nodo con la menor o la mayor clave |
| `insertar(r, k)`, `insertarIterativa(r, k)` | la raíz del árbol con `k` adentro |
| `borrar(r, k)` | la raíz del árbol sin `k` |

## Buscar

En cada nodo se compara la clave buscada con el dato y se baja a un solo lado:
a la izquierda si es menor, a la derecha si es mayor. Buscar el 6 compara
$6 < 8$, $6 > 3$ y $6 = 6$, y lo encuentra en el tercer nodo. Buscar el 5
compara $5 < 8$, $5 > 3$, $5 < 6$ y $5 > 4$; el hijo derecho de 4 es `NULL`, y
el 5 no está.

Las tres preguntas para `buscar(r, k)` tienen respuesta corta. Hay dos casos
base: si `r` es `NULL`, la clave no está y se devuelve `NULL`; si `r->dato` es
`k`, se devuelve `r`. Se baja a uno solo de los subárboles, al izquierdo si
`k < r->dato` y al derecho si no, porque el otro no puede tener a `k`. Con lo
que devuelve la llamada no se hace nada: lo que encuentra el subárbol es la
respuesta de todo el árbol.

```cpp
// Devuelve el nodo con la clave k, o NULL si no esta.
Nodo *buscar(Nodo *r, int k) {
  Nodo *res = r;
  if (r != NULL && k != r->dato) {
    if (k < r->dato) {
      res = buscar(r->izq, k);
    } else {
      res = buscar(r->der, k);
    }
  }
  return res;
}
```

`res = r` cubre los dos casos base de una vez (CLRS, §12.2). En cada nodo se
ejecuta solo una de las dos llamadas, y ahí está la diferencia con `tamano`,
que baja a los dos lados.

### La pila de llamadas de buscar(raiz, 5)

| Marco | `r->dato` | Comparación | Hace |
|---|---|---|---|
| 1 | 8 | $5 < 8$ | `res = buscar(r->izq, 5)` |
| 2 | 3 | $5 > 3$ | `res = buscar(r->der, 5)` |
| 3 | 6 | $5 < 6$ | `res = buscar(r->izq, 5)` |
| 4 | 4 | $5 > 4$ | `res = buscar(r->der, 5)` |
| 5 | `NULL` | caso base | devuelve `NULL` |

En el momento más hondo hay cinco marcos vivos, uno por nivel recorrido.
Después el `NULL` sube: el marco 4 lo guarda en `res` y lo devuelve, el 3 hace
lo mismo, y así hasta el primero. Ningún marco cambia lo que recibe, de modo que
guardarlos sobra. La llamada `buscar(r->izq, k)` se puede cambiar por la
asignación `r = r->izq` dentro de un ciclo, y la búsqueda baja igual sin apilar
nada.

### De la recursión al ciclo

```cpp
// La misma busqueda con un ciclo: baja un nivel por vuelta.
Nodo *buscarIterativa(Nodo *r, int k) {
  while (r != NULL && k != r->dato) {
    if (k < r->dato) {
      r = r->izq;
    } else {
      r = r->der;
    }
  }
  return r;
}
```

La condición del `while` es la negación de los dos casos base. Con
`buscarIterativa(raiz, 13)`, `r` pasa por 8 ($13 > 8$, a la derecha), 10
($13 > 10$, a la derecha) y 14 ($13 < 14$, a la izquierda), y en la tercera
vuelta queda en el 13 y el ciclo termina. En `uso_abb.cpp` las dos versiones
responden lo mismo para 6, 13, 5 y 15.

### Mínimo y máximo

La menor clave está al fondo de la izquierda (CLRS, §12.2): todo lo que está a
la izquierda de un nodo es menor que él, así que se baja por `izq` mientras se
pueda. No siempre es una hoja; si se inserta el 2 en el árbol de las trazas,
queda como hijo derecho del 1, y el 1 sigue siendo el mínimo. `minimo` pasa por
8, 3 y 1, y `maximo` por 8, 10 y 14.

```cpp
// exige r != NULL; el menor esta al fondo a la izquierda
Nodo *minimo(Nodo *r) {
  assert(r != NULL);
  while (r->izq != NULL) {
    r = r->izq;
  }
  return r;
}
```

!!! warning "Caso límite"

    En un árbol vacío no hay mínimo. `minimo` y `maximo` exigen `r != NULL` y
    lo revisan con `assert`: llamarlas sobre `NULL` detiene el programa en vez
    de desreferenciar un puntero nulo.

### Lo que cuesta buscar

Sea $h$ la altura del árbol. Cada vuelta o cada llamada baja un nivel, y un
camino desde la raíz pasa por a lo sumo $h + 1$ nodos.

| Función | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| `buscar` | $O(h)$ | $O(h)$ | una comparación por nivel; un marco por cada nivel que baja |
| `buscarIterativa` | $O(h)$ | $O(1)$ | el mismo camino, con una sola variable `r` |
| `minimo`, `maximo` | $O(h)$ | $O(1)$ | bajan por un lado hasta el fondo |

Ninguna de las tres recorre el árbol entero. Cuánto vale $h$ depende de la
forma, y se mide al final.

## Insertar

Para insertar el 5 sin mover ningún nodo que ya esté, se cuelga donde su
búsqueda se cae: en el hijo derecho del 4, que era `NULL`. Nada más cambia.

`insertar(r, k)` devuelve la raíz del subárbol que queda con `k` adentro. Su
caso base es `r` igual a `NULL`: se crea el nodo de `k`, y ese nodo es la raíz
del subárbol nuevo. Se baja como en `buscar`, y si `k` ya está, no se baja. Lo
que devuelve la llamada se guarda en el mismo hijo por el que se bajó, y se
devuelve `r`.

```cpp
// Devuelve la raiz del subarbol con k ya insertada.
Nodo *insertar(Nodo *r, int k) {
  if (r == NULL) {
    r = crearNodo(k, NULL, NULL);
  } else if (k < r->dato) {
    r->izq = insertar(r->izq, k);
  } else if (k > r->dato) {
    r->der = insertar(r->der, k);
  }
  return r;
}
```

Si `k == r->dato`, ninguna rama se ejecuta y se devuelve `r` sin cambios: un
repetido se ignora. La primera llamada también asigna,
`raiz = insertar(raiz, k)`, y con el árbol vacío esa es la única forma de que
`raiz` deje de ser `NULL` (CLRS, §12.3).

### Por qué r->izq = insertar(r->izq, k) reengancha el árbol

Al insertar el 5, cada marco del camino queda esperando para asignar lo que le
devuelvan: de arriba abajo, `main` espera `raiz`, el 8 su `r->izq`, el 3 su
`r->der`, el 6 su `r->izq` y el 4 su `r->der`. El caso base,
`insertar(NULL, 5)`, crea el 5 y devuelve su dirección, y el marco del 4 la
guarda en `r->der`: esa asignación es la que engancha el nodo. Al subir, cada
marco devuelve su `r` y el de arriba lo guarda en el hijo por el que bajó; el
6 recibe el nodo 4 en `r->izq`, el 3 recibe el 6, el 8 recibe el 3 y `main`
recibe el 8. Esos punteros ya valían eso y se reescriben con el mismo valor.

Solo cambia el puntero donde estaba el `NULL`. El mismo código sirve para el
árbol vacío: en `raiz = insertar(NULL, 8)` el caso base devuelve el nodo del 8
y la asignación que cambia es la de `raiz`. No hace falta preguntar por el
padre ni tratar aparte la raíz.

!!! warning "Si la llamada no se asigna"

    Si la línea se escribe `insertar(r->der, k);`, sin `r->der =` delante, el
    nodo se crea igual, pero nadie guarda su dirección. El parámetro `r` de la
    llamada es una copia del puntero, y asignarle el nodo nuevo no toca el
    `r->der` del padre. El 5 no aparece en el árbol y su memoria queda
    reservada sin forma de liberarla: una fuga.

### El árbol de las trazas, clave por clave

`uso_abb.cpp` inserta `8 3 10 1 6 14 4 7 13` en un árbol vacío. El 8 queda en
la raíz, el 3 y el 10 a sus lados, y después llegan 1 y 6 bajo el 3 y 14 bajo
el 10. El 13 hace el camino más largo, $13 > 8$, $13 > 10$, $13 < 14$, y entra
como hijo izquierdo del 14. Después el programa inserta otra vez el 6, y el
árbol no cambia. El preorden que imprime es `8 3 1 6 4 7 10 14 13`.

### Ejercicio en parejas: otro árbol

Al insertar `15 9 20 4 12 17 25 11` en un ABB vacío, el 15 queda en la raíz con
9 y 20 como hijos; el 9 tiene a 4 y 12, el 20 tiene a 17 y 25, y el 11 entra
como hijo izquierdo del 12. El preorden es `15 9 4 12 11 20 17 25`, el inorden
`4 9 11 12 15 17 20 25`, ordenado, y la altura 3, por el camino 15, 9, 12, 11.
En el momento en que se crea el 11 hay cinco marcos en la pila: el de `main`
en el fondo, los de 15, 9 y 12, y el de `insertar(NULL, 11)` encima.

### insertarIterativa

Sin recursión no hay quién reenganche al subir, así que el ciclo recuerda al
`padre` del nodo actual y al final cuelga ahí el nodo nuevo. Si `padre` queda en
`NULL`, el árbol estaba vacío y el nodo nuevo es la raíz.

```cpp
// Baja hasta el NULL donde va k, recordando el padre, y cuelga ahi el nodo.
Nodo *insertarIterativa(Nodo *r, int k) {
  Nodo *padre = NULL;
  Nodo *actual = r;
  while (actual != NULL && k != actual->dato) {
    padre = actual;
    if (k < actual->dato) {
      actual = actual->izq;
    } else {
      actual = actual->der;
    }
  }
  if (actual == NULL) {
    Nodo *nuevo = crearNodo(k, NULL, NULL);
    if (padre == NULL) {
      r = nuevo;
    } else if (k < padre->dato) {
      padre->izq = nuevo;
    } else {
      padre->der = nuevo;
    }
  }
  return r;
}
```

| Momento | `padre` | `actual` | Comparación |
|---|---|---|---|
| antes del ciclo | `NULL` | 8 | $5 < 8$: a la izquierda |
| después de la vuelta 1 | 8 | 3 | $5 > 3$: a la derecha |
| después de la vuelta 2 | 3 | 6 | $5 < 6$: a la izquierda |
| después de la vuelta 3 | 6 | 4 | $5 > 4$: a la derecha |
| después de la vuelta 4 | 4 | `NULL` | el ciclo termina |

`actual` quedó en `NULL`, así que el 5 no estaba. Se crea el nodo y, como
$5 > 4$, se cuelga en `padre->der`: el mismo árbol que deja la versión
recursiva. Con el árbol vacío el ciclo no da ninguna vuelta, `padre` sigue en
`NULL` y el nodo nuevo pasa a ser la raíz; con una clave repetida, el ciclo
termina con `actual` en el nodo que la tiene y no se crea nada.

### Lo que cuesta insertar

| Función | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| `insertar` | $O(h)$ | $O(h)$ | baja un camino; un marco por nivel, que espera para reenganchar |
| `insertarIterativa` | $O(h)$ | $O(1)$ | el mismo camino con dos punteros, `padre` y `actual` |

Ninguna de las dos corre nodos: enlazar el nuevo cuesta $\Theta(1)$. Esa es la
ganancia frente al arreglo ordenado, que para insertar corre hasta $n$
elementos. La salida de `uso_abb.cpp`, hasta las búsquedas:

```text
tras insertar 8 3 10 1 6 14 4 7 13 (y 6 otra vez):
  inorden:  1 3 4 6 7 8 10 13 14 
  preorden: 8 3 1 6 4 7 10 14 13 
tamano: 9, altura: 3
minimo: 1, maximo: 14
buscar(6): esta, buscarIterativa(6): esta
buscar(13): esta, buscarIterativa(13): esta
buscar(5): no esta, buscarIterativa(5): no esta
buscar(15): no esta, buscarIterativa(15): no esta
```

## Borrar

`uso_abb.cpp` borra el 13, después el 10 y después el 3, y cada uno está en una
situación distinta en el momento de borrarlo (CLRS, §12.3; Thareja, §10.2).

**Caso 1: una hoja.** El 13 no tiene hijos. Se quita, el hijo izquierdo del 14
pasa a ser `NULL` y nadie más se mueve. El inorden queda `1 3 4 6 7 8 10 14` y
el preorden `8 3 1 6 4 7 10 14`.

**Caso 2: un solo hijo.** Sin el 13, el 10 tiene un solo hijo, el 14, que sube a
su lugar con todo lo que cuelga de él: el 8 pasa a apuntar al 14. Sigue siendo
ABB, porque todo lo que estaba debajo del 10 ya era mayor que 8. El inorden
queda `1 3 4 6 7 8 14` y el preorden `8 3 1 6 4 7 14`.

**Caso 3: dos hijos.** El 3 tiene a 1 y a 6, y un solo puntero del 8 no alcanza
para los dos: hay que poner otra clave en el lugar del 3. Tiene que ser mayor
que todo lo que quede a la izquierda y menor que todo lo que quede a la
derecha, y esa clave es el sucesor del 3, la que le sigue en el inorden: el
mínimo de su subárbol derecho, aquí el 4. El sucesor nunca tiene hijo
izquierdo, porque ese hijo sería menor que él, así que quitarlo de abajo es el
caso 1 o el caso 2. Se busca con `minimo(r->der)`, que pasa por 6 y 4; se copia
su clave, `r->dato = 4`; y se borra el 4 de abajo, que era una hoja. El
inorden queda `1 4 6 7 8 14` y el preorden `8 4 1 6 7 14`: el inorden solo
perdió el 3.

`borrar(r, k)` devuelve la raíz del subárbol que queda sin `k`. Tiene dos casos
base: `r` es `NULL`, y la clave no está; o `r` tiene la clave y le falta un
hijo, y entonces se devuelve el otro hijo, que puede ser `NULL`, y se libera
`r`. Se baja como en `buscar`, y con dos hijos se baja una vez más, al derecho,
a borrar el sucesor. Lo que devuelve la llamada se guarda en el hijo por el que
se bajó, como en `insertar`.

```cpp
// Devuelve la raiz del subarbol sin k. Si k no esta, nada cambia.
Nodo *borrar(Nodo *r, int k) {
  Nodo *res = r;
  if (r != NULL) {
    if (k < r->dato) {
      r->izq = borrar(r->izq, k);
    } else if (k > r->dato) {
      r->der = borrar(r->der, k);
    } else if (r->izq == NULL) {   // hoja o solo hijo derecho
      res = r->der;
      delete r;
    } else if (r->der == NULL) {   // solo hijo izquierdo
      res = r->izq;
      delete r;
    } else {                       // dos hijos: sube el sucesor
      Nodo *suc = minimo(r->der);
      r->dato = suc->dato;
      r->der = borrar(r->der, suc->dato);
    }
  }
  return res;
}
```

La hoja no tiene rama propia: entra por `r->izq == NULL` y devuelve `r->der`,
que también es `NULL`. CLRS mueve el nodo del sucesor con TRANSPLANT; aquí se
copia la clave, que deja el mismo conjunto de claves con menos punteros que
cambiar.

### borrar(raiz, 3), marco por marco

Sobre el árbol que quedó tras borrar 13 y 10:

| Marco | `r->dato` | Qué hace | Devuelve |
|---|---|---|---|
| 1 | 8 | $3 < 8$: `r->izq = borrar(r->izq, 3)` | el nodo del 8 |
| 2 | 3 | la tiene y hay dos hijos: `suc` es el 4, `r->dato = 4`, `r->der = borrar(r->der, 4)` | el mismo nodo, ya con 4 |
| 3 | 6 | $4 < 6$: `r->izq = borrar(r->izq, 4)` | el nodo del 6 |
| 4 | 4 | la tiene y `r->izq` es `NULL`: `res = r->der`, `delete r` | `NULL` |

Se baja de arriba abajo y se devuelve de abajo arriba. Al subir, el 6 guarda
`NULL` en su izquierdo, el único puntero que cambió de valor además del dato
copiado, y los demás marcos reescriben lo que ya tenían.

!!! warning "Casos límite al borrar"

    - Si se borra la raíz y tiene a lo sumo un hijo, la raíz cambia; por eso la
      llamada se escribe `raiz = borrar(raiz, k)`. Sin la asignación, `raiz`
      queda apuntando a memoria liberada: un puntero colgante.
    - En un árbol de un solo nodo, `borrar` devuelve `NULL` y el árbol queda
      vacío. Con una clave que no está, la búsqueda llega a `NULL` y nada
      cambia; `uso_abb.cpp` lo prueba con el 5.
    - Con dos hijos se puede usar el predecesor, el máximo del subárbol
      izquierdo. Queda otro ABB válido, con el mismo inorden y otro preorden,
      y un juez que compara el preorden acepta solo uno de los dos.

### La clase ABB

Las funciones reciben y devuelven raíces. La clase `ABB` de `abb.h` guarda la
raíz, hace cada asignación `raiz = ...` en un solo sitio y libera todo en el
destructor. Sus métodos se llaman `contiene`, `agregar`, `quitar`, `alto` e
`imprimir`, y no `buscar` ni `insertar`: un método con ese nombre taparía,
dentro de la clase, la función libre que llama.

## Lo que cuesta: la forma del árbol

Las claves del 1 al 7 insertadas en el orden `1 2 3 4 5 6 7` dejan una cadena
que baja siempre por la derecha, de altura 6, y buscar el 7 compara 7 veces.
En el orden `4 2 6 1 3 5 7` dejan el árbol lleno de altura 2, y buscar el 7
compara 3 veces. `forma.cpp` imprime:

```text
1 2 3 4 5 6 7 -> altura 6, inorden 1 2 3 4 5 6 7 
4 2 6 1 3 5 7 -> altura 2, inorden 1 2 3 4 5 6 7 
```

El inorden es el mismo y la forma no. Insertar en orden creciente arma una
lista enlazada con un puntero inútil por nodo.

### Cuánto puede medir h

**Teorema.** Todo árbol binario con $n \ge 1$ nodos tiene altura $h$ con
$\lfloor \log_2 n \rfloor \le h \le n - 1$.

**Demostración.** Se procede de forma directa: se cuenta cuántos nodos caben en
cada nivel para la cota de abajo, y cuántos nodos tiene un camino para la de
arriba.

**Desarrollo.** El nivel 0 tiene un nodo, la raíz. Cada nodo del nivel $d - 1$
tiene a lo sumo dos hijos, así que el nivel $d$ tiene a lo sumo $2^d$ nodos. Un
árbol de altura $h$ ocupa los niveles $0$ a $h$; entonces

$$
n \le 1 + 2 + \cdots + 2^h = 2^{h+1} - 1 < 2^{h+1}.
$$

El logaritmo en base 2 es creciente, de modo que $\log_2 n < h + 1$. Como
$\lfloor \log_2 n \rfloor \le \log_2 n$, también
$\lfloor \log_2 n \rfloor < h + 1$, y como los dos lados son enteros,
$\lfloor \log_2 n \rfloor \le h$. Para la otra cota, un camino de la raíz a una
hoja con $h$ aristas pasa por $h + 1$ nodos distintos, y no hay más de $n$;
luego $h + 1 \le n$.

**Conclusión.** Por lo tanto, se puede concluir que
$\lfloor \log_2 n \rfloor \le h \le n - 1$. Las dos cotas se alcanzan:
`4 2 6 1 3 5 7` da $h = 2 = \lfloor \log_2 7 \rfloor$ y `1 2 3 4 5 6 7` da
$h = 6 = n - 1$.

### El experimento: en orden o desordenadas

`medir_altura.cpp` inserta $n$ claves en un ABB vacío de dos maneras:
$1, 2, \ldots, n$ en orden, y $n$ claves distintas desordenadas con una
permutación multiplicativa. Para cada una mide la altura y el tiempo de
procesador.

```cpp
// Con P primo mayor que n y 0 < A < P, (i * A) % P da claves distintas
// para i = 1..n; con A = 623820, cerca de 0,62 P, salen desordenadas.
const int P = 1000003;
const int A = 623820;

// a[i] = ((i + 1) * A) % P, para i = 0..n-1.
void desordenar(int a[], int n) {
  int i = 0;
  while (i < n) {
    a[i] = (int) ((long long) (i + 1) * A % P);
    i = i + 1;
  }
}
```

Como $P$ es primo y $A$ no es múltiplo de $P$, dos valores de $i$ menores que
$P$ nunca dan el mismo residuo. Para el ABB solo importa el orden relativo de
las claves, no cuáles son.

| $n$ | $h$ en orden | s en orden | $h$ desordenado | s desordenado | $\lfloor \log_2 n \rfloor$ | $h / \lfloor \log_2 n \rfloor$ |
|---|---|---|---|---|---|---|
| 1 000 | 999 | 0,0008 | 20 | 0,0001 | 9 | 2,22 |
| 2 000 | 1 999 | 0,0032 | 22 | 0,0002 | 10 | 2,20 |
| 4 000 | 3 999 | 0,0132 | 26 | 0,0004 | 11 | 2,36 |
| 8 000 | 7 999 | 0,0513 | 28 | 0,0008 | 12 | 2,33 |
| 16 000 | 15 999 | 0,2543 | 30 | 0,0016 | 13 | 2,31 |

En orden, $h = n - 1$, y el tiempo se multiplica por unos 4 cada vez que $n$ se
dobla: las $n$ inserciones cuestan $1 + 2 + \cdots + (n - 1) = \Theta(n^2)$
comparaciones. Desordenadas, $h$ queda entre 2 y 3 veces
$\lfloor \log_2 n \rfloor$ y el tiempo apenas se dobla, con un total que va
como $\Theta(n \log n)$. Con 16 000 claves el árbol en orden es 160 veces más
lento. Los tiempos cambian de un equipo a otro; las alturas no.

### Lo que cobra el ABB

| Operación | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| `buscar`, `insertar`, `borrar` | $O(h)$ | $O(h)$ | un camino desde la raíz; un marco por nivel |
| `buscarIterativa`, `insertarIterativa` | $O(h)$ | $O(1)$ | el mismo camino con uno o dos punteros |
| `minimo`, `maximo` | $O(h)$ | $O(1)$ | bajan por un solo lado |
| `borrar` con dos hijos | $O(h)$ | $O(h)$ | del nodo al sucesor se sigue bajando: es un solo camino |
| recorridos, `tamano`, `altura` | $\Theta(n)$ | $O(h)$ | visitan cada nodo una vez |
| `liberar`, destructor | $\Theta(n)$ | $O(h)$ | posorden: los hijos antes que el padre |
| $n$ inserciones en un árbol vacío | de $\Theta(n \log n)$ a $\Theta(n^2)$ | $O(h)$ | $n$ caminos, cada uno de largo $O(h)$ |

La estructura ocupa $\Theta(n)$: un nodo por clave, con la clave y dos
punteros. Con $\lfloor \log_2 n \rfloor \le h \le n - 1$, cada $O(h)$ es
$\Theta(\log n)$ cuando el árbol está balanceado y $\Theta(n)$ cuando degeneró
en lista. Frente al registro de carnés:

| | Buscar | Agregar | Quitar | Listar en orden |
|---|---|---|---|---|
| Arreglo ordenado | $\Theta(\log n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |
| ABB | $O(h)$ | $O(h)$ | $O(h)$ | $\Theta(n)$ |

!!! warning "El peor caso llega con los datos más comunes"

    Carnés que llegan ya ordenados, fechas crecientes, consecutivos de una base
    de datos: todos arman la lista. Además, la recursión sobre una lista de $n$
    nodos apila $n$ marcos, y con unos 175 000 nodos desborda la pila de
    llamadas de 8 MB que Linux da por omisión.

Contra eso están los árboles que se reacomodan al insertar y al borrar para
que $h$ quede en $O(\log n)$.

## Ejercicios con recursión

### ¿Es ABB?

Un primer intento revisa cada nodo contra sus hijos:

```cpp
// Compara cada nodo solo con sus hijos inmediatos: el arbol falso la engana.
bool esABBHijos(Nodo *r) {
  bool res = true;
  if (r != NULL) {
    if (r->izq != NULL && r->izq->dato >= r->dato) {
      res = false;
    } else if (r->der != NULL && r->der->dato <= r->dato) {
      res = false;
    } else {
      res = esABBHijos(r->izq) && esABBHijos(r->der);
    }
  }
  return res;
}
```

Con el árbol B de la definición (8; 3 con hijos 1 y 9; 10) responde `si`, y se
equivoca: el 9 solo se compara con su padre, el 3, y nadie lo compara con el
8. La versión correcta hace heredar a cada nodo un rango abierto
$(\min, \max)$. Al bajar a la izquierda, el dato del padre pasa a ser el nuevo
$\max$; a la derecha, el nuevo $\min$. El 8 recibe $(-\infty, +\infty)$, el 3
recibe $(-\infty, 8)$ y el 9 recibe $(3, 8)$, donde falla.

```cpp
// Cada clave de r debe quedar estrictamente entre min y max. Al bajar a
// la izquierda el dato pasa a ser el nuevo max; a la derecha, el nuevo min.
bool esABB(Nodo *r, long long min, long long max) {
  bool res = true;
  if (r != NULL) {
    res = min < r->dato && r->dato < max
          && esABB(r->izq, min, r->dato) && esABB(r->der, r->dato, max);
  }
  return res;
}
```

La primera llamada usa un rango que deja entrar cualquier `int`, de
`INT_MIN - 1` a `INT_MAX + 1` en `long long`. El programa imprime
`esABB(abb): si` y `esABB(falso): no`. El `&&` corta en cuanto algo falla, y
si el dato está fuera de su rango no se baja a los hijos. Cuesta $\Theta(n)$
cuando el árbol sí es ABB, porque revisa cada nodo, y $O(h)$ de pila.

### El k-ésimo menor

`kEsimo(r, k, vistos)` es el inorden con un contador `vistos`, pasado por
referencia para que todas las llamadas cuenten sobre la misma variable, sin
armar el inorden completo en un arreglo. En el árbol de las trazas, con
$k = 4$ cuenta 1, 3, 4 y 6: la cuarta clave más pequeña es el 6. Cuando el 6
llega a 4, `res` deja de ser `NULL` y las llamadas de arriba ya no cuentan ni
bajan; el 8 se visitó pero no se contó, y 7, 10, 14 y 13 ni se tocaron. Para
$k = 1, \ldots, 10$ la salida es `1 3 4 6 7 8 10 13 14 ninguno`.

`kEsimoPila` hace el mismo recorrido con la pila de `inordenPila`: cuenta cada
nodo al sacarlo de la pila, y la condición del ciclo pide además que `res`
siga en `NULL`. Con $k = 4$ da nueve vueltas; en la novena saca el 6, `vistos`
llega a 4 y el ciclo termina con el 8 todavía en la pila, que el destructor de
`Pila` libera.

### Contar en un rango

`contarRango(r, a, b)` cuenta las claves en $[a, b]$. Si el dato es menor que
$a$, todo su subárbol izquierdo también lo es y solo se baja a la derecha; si es
mayor que $b$, solo a la izquierda. El vacío cuenta 0.

```cpp
// Claves en [a, b]. Si el dato es menor que a, a la izquierda no hay
// nada que contar; si es mayor que b, a la derecha tampoco.
int contarRango(Nodo *r, int a, int b) {
  int res = 0;
  if (r != NULL) {
    if (r->dato < a) {
      res = contarRango(r->der, a, b);
    } else if (r->dato > b) {
      res = contarRango(r->izq, a, b);
    } else {
      res = 1 + contarRango(r->izq, a, b) + contarRango(r->der, a, b);
    }
  }
  return res;
}
```

Con $[4, 10]$ cuenta 5 (8, 6, 4, 7 y 10) y nunca visita el 1. Con $[11, 12]$
cuenta 0 y visita solo 8, 10, 14 y 13, 4 de los 9 nodos. Cuesta $O(h + m)$, con
$m$ el número de claves en el rango: se visitan las $m$ y, fuera de ellas, solo
los nodos de los caminos que buscan $a$ y $b$.

### Un ABB balanceado desde un arreglo

Con el arreglo ordenado `1 3 4 6 7 8 10 13 14`, el ABB de menor altura lleva en
la raíz la clave del medio, que deja la mitad de las claves a cada lado, y cada
mitad se arma igual con su propio rango de índices. El rango vacío,
$\mathit{ini} > \mathit{fin}$, es el caso base.

```cpp
// ABB de altura minima con a[ini..fin], que viene ordenado:
// el del medio es la raiz y cada mitad, un subarbol.
Nodo *construirBalanceado(int a[], int ini, int fin) {
  Nodo *res = NULL;
  if (ini <= fin) {
    int medio = (ini + fin) / 2;
    res = crearNodo(a[medio], construirBalanceado(a, ini, medio - 1),
                    construirBalanceado(a, medio + 1, fin));
  }
  return res;
}
```

| $[\mathit{ini}, \mathit{fin}]$ | `medio` | clave |
|---|---|---|
| $[0, 8]$ | 4 | 7 |
| $[0, 3]$ | 1 | 3 |
| $[0, 0]$ | 0 | 1 |
| $[2, 3]$ | 2 | 4 |
| $[3, 3]$ | 3 | 6 |
| $[5, 8]$ | 6 | 10 |
| $[5, 5]$ | 5 | 8 |
| $[7, 8]$ | 7 | 13 |
| $[8, 8]$ | 8 | 14 |

El programa imprime `balanceado: preorden 7 3 1 4 6 10 8 13 14 | altura 3, esABB: si`.
La altura es $3 = \lfloor \log_2 9 \rfloor$, la mínima posible. Cuesta
$\Theta(n)$, una llamada con nodo por clave, y $O(\log n)$ de pila; insertar el
mismo arreglo en orden con `insertar` daría una lista de altura 8.

### Piso y techo

El piso de $x$ es la mayor clave $\le x$, y el techo, la menor clave $\ge x$. Si
$x$ es menor que el dato, el piso está a la izquierda. Si es mayor, el dato es
un candidato: se busca algo mejor a la derecha y, si allá no hay nada, la
respuesta es el propio dato.

```cpp
// Nodo con la mayor clave <= x, o NULL si no hay.
Nodo *piso(Nodo *r, int x) {
  Nodo *res = NULL;
  if (r != NULL) {
    if (r->dato == x) {
      res = r;
    } else if (x < r->dato) {
      res = piso(r->izq, x);
    } else {
      res = piso(r->der, x);   // algo mayor que r->dato y <= x
      if (res == NULL) {
        res = r;
      }
    }
  }
  return res;
}
```

`piso(raiz, 12)` pasa por 8 y 10 buscando a la derecha, y por 14 y 13 buscando
a la izquierda, hasta un `NULL`. Al volver, el 13 y el 14 devuelven `NULL`; el
10 recibe `NULL` y se devuelve a sí mismo, y el 8 devuelve el 10 que le llegó.
El programa imprime `x = 5: piso 4, techo 6`, `x = 12: piso 10, techo 13` y
`x = 0: piso ninguno, techo 1`. `techo` es la misma función con los lados
cambiados.

### Lo que cuestan los ejercicios

| Función | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| `esABB` | $O(n)$ | $O(h)$ | visita cada nodo a lo sumo una vez; para en la primera falla |
| `kEsimo`, `kEsimoPila` | $O(h + k)$ | $O(h)$ | el inorden hasta la $k$-ésima, más el camino de bajada; marcos o pila |
| `contarRango` | $O(h + m)$ | $O(h)$ | las $m$ claves del rango y los caminos hacia $a$ y $b$ |
| `construirBalanceado` | $\Theta(n)$ | $O(\log n)$ | una llamada con nodo por clave; la pila llega a la altura del árbol que arma |
| `piso`, `techo` | $O(h)$ | $O(h)$ | un solo camino, como `buscar` |

`construirBalanceado` reserva además $\Theta(n)$ para los nodos del árbol que
devuelve.

## Para practicar en casa

### Propuesto 1: techo

`techo(r, x)`, la menor clave $\ge x$, de forma recursiva y después con un
ciclo. *Pista:* es `piso` con los lados cambiados. Si $x$ es mayor que el dato
se va a la derecha; si es menor, el dato es candidato y se busca algo mejor a
la izquierda. El ciclo guarda el mejor candidato en una variable.

### Propuesto 2: sucesor

`sucesor(r, k)` devuelve la menor clave estrictamente mayor que `k`, que puede
no estar en el árbol; los nodos no tienen puntero al padre. *Pista:* como
`techo`, pero el dato es candidato solo si es estrictamente mayor que `k`; si
es igual o menor, se va a la derecha. $O(h)$.

### Propuesto 3: un solo hijo

Contar los nodos que tienen exactamente un hijo, y decir cuántos tiene el árbol
que deja `1 2 3 4 5 6 7`. *Pista:* el vacío da 0, y se suma 1 si el nodo tiene
un hijo y no el otro. Ese árbol tiene 6.

### Propuesto 4: de mayor a menor

Imprimir las claves de mayor a menor, de forma recursiva y después con una pila
explícita. *Pista:* es el inorden con los lados cambiados (derecho, raíz,
izquierdo), y en la versión con pila se baja por la derecha apilando.

### Propuesto 5: con el predecesor

Una versión de `borrar` que, con dos hijos, use el máximo del subárbol
izquierdo. Se insertan `8 2 3 7 22 1`, se borra el 8 con las dos versiones y se
comparan los preórdenes. *Pista:* con el sucesor sale `22 2 1 3 7`; con el
predecesor, `7 2 1 3 22`. El inorden es el mismo, `1 2 3 7 22`.

### Propuesto 6: ¿balanceado?

Un árbol está balanceado por alturas si en cada nodo las alturas de sus dos
subárboles difieren en a lo sumo 1. Se pide `esBalanceado(r)` llamando a
`altura`, y después una versión que calcule la altura en el mismo recorrido.
*Pista:* la primera llama a `altura` en cada nodo, que recorre todo su
subárbol: $O(nh)$, y $\Theta(n \log n)$ si el árbol sí está balanceado. La
segunda devuelve la altura, o un valor especial como $-2$ cuando algo abajo ya
falló, en $\Theta(n)$.

### Propuesto 7: orden de inserción

Imprimir un orden de $1, \ldots, n$ que, insertado con `insertar`, deje un ABB
de altura $\lfloor \log_2 n \rfloor$, sin crear ningún nodo. *Pista:* es el
preorden de `construirBalanceado`. Se imprime el del medio de
$[\mathit{ini}, \mathit{fin}]$ y después las dos mitades; cada clave entra
después de su padre, y por eso la inserción reconstruye ese mismo árbol.

### Ejercicio de cierre

En un ABB vacío se insertan `50 30 70 20 40 60 80`. Después se borra el 50, se
inserta el 55 y se borra el 30, con `borrar` tal como está escrito. ¿Qué
preorden y qué altura tiene al final, y qué caso de borrar se usa en cada
borrado, incluido el del sucesor?

Al borrar el 50, que tiene dos hijos, sube su sucesor, el 60, que era hoja
(caso 1 abajo); la raíz pasa a ser 60 y el 70 queda sin hijo izquierdo. El 55
compara $55 < 60$, $55 > 30$ y $55 > 40$, y entra como hijo derecho del 40. El
30 también tiene dos hijos; su sucesor es el 40, que no tiene hijo izquierdo
pero sí derecho, así que abajo es el caso 2 y el 55 sube. Queda el preorden
`60 40 20 55 70 80`, con altura 2.

## Para el juez

Los problemas se envían desde vjudge, que reenvía la solución al juez original.
Cada solución lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < aizu_alds1_8_a.in`. Las tres de Aizu se resuelven con un mismo
programa que crece: insertar, después buscar, después borrar.

### Aizu ALDS1_8_A, Binary Search Tree I

*Aizu ALDS1_8_A, Binary Search Tree I*:
<https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_8_A>. Envío en
<https://vjudge.net/problem/Aizu-ALDS1_8_A>.

`insertar` para cada `insert` y los recorridos para cada `print`.

Llegan $m \le 500\,000$ órdenes, `insert k` o `print`, y cada `print` imprime
dos líneas: el inorden y el preorden del ABB. Las claves son distintas, entre
$-2 \cdot 10^9$ y $2 \cdot 10^9$; hay a lo sumo 10 `print`, y el enunciado
garantiza que la altura no pasa de 100. Con `insert` de 30, 88, 12, 1, 20, 17 y
25, el `print` da ` 1 12 17 20 25 30 88` y ` 30 12 1 20 17 25 88`; el preorden
empieza en 30 porque la raíz es la primera clave insertada. Con altura a lo
sumo 100, cada inserción hace unas 100 comparaciones y la recursión apila pocos
marcos: $O(m \cdot h)$ para las inserciones y $\Theta(n)$ por `print`, con
$\Theta(n)$ de espacio.

!!! warning "Las trampas"

    - Cada clave va precedida de un espacio, y la línea no termina en espacio.
      El `inorden` de `arbol_binario.h` imprime cada clave seguida de un
      espacio: hace falta otro con `printf(" %d", r->dato)`.
    - Las claves caben en `int`, pero quedan cerca del borde
      ($2^{31} - 1 \approx 2{,}1 \cdot 10^9$).
    - La orden se lee con `scanf("%s", orden)` y se compara con `strcmp`. La
      garantía de altura es lo que vuelve viable un ABB sin balancear con medio
      millón de órdenes.

Solución: [aizu_alds1_8_a.cpp](./codigo/aizu_alds1_8_a.cpp),
[entrada](./codigo/aizu_alds1_8_a.in), [salida](./codigo/aizu_alds1_8_a.out).

### Aizu ALDS1_8_B, Binary Search Tree II

*Aizu ALDS1_8_B, Binary Search Tree II*:
<https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_8_B>. Envío en
<https://vjudge.net/problem/Aizu-ALDS1_8_B>.

La solución de ALDS1_8_A con `buscar` para la orden `find`.

Es lo mismo que ALDS1_8_A más `find k`, que imprime `yes` o `no`, con los mismos
límites. En el ejemplo, `find 12` llega después de insertar 30, 88, 12, 1 y 20
y responde `yes`; `find 16` responde `no`, y su búsqueda se cae en el hijo
izquierdo del 17: $16 < 30$, $16 > 12$, $16 < 20$, $16 < 17$. Con la versión
iterativa, cada `find` cuesta $O(h)$ en tiempo y $O(1)$ en espacio.

!!! warning "Las trampas"

    - No trae una nueva respecto de ALDS1_8_A. Las respuestas de `find` se
      imprimen en el momento, mezcladas con las líneas de `print`, en el orden
      en que llegan las órdenes.

Solución: [aizu_alds1_8_b.cpp](./codigo/aizu_alds1_8_b.cpp),
[entrada](./codigo/aizu_alds1_8_b.in), [salida](./codigo/aizu_alds1_8_b.out).

### UVa 12347, Binary Search Tree

*UVa 12347, Binary Search Tree*: <https://onlinejudge.org/external/123/12347.pdf>.
Envío en <https://vjudge.net/problem/UVA-12347>.

Insertar las claves en el orden del preorden reconstruye el mismo ABB, y basta
imprimir su posorden.

Llega el preorden de un ABB, una clave por línea, hasta el fin de la entrada.
Las claves son enteros positivos distintos, menores que $10^6$, y hay a lo sumo
10 000; se imprime el posorden, una clave por línea, con 1 segundo de límite.
La entrada `50 30 24 5 28 45 98 52 60` da `5 28 24 45 30 60 52 98 50`. En el
preorden cada clave aparece después de todos sus antepasados; al insertarla, la
búsqueda recorre esos antepasados y la cuelga en el mismo lugar que tenía.
Cuesta $O(n \cdot h)$: con un árbol balanceado, $\Theta(n \log n)$; con uno
degenerado, unas $n^2/2 = 5 \cdot 10^7$ comparaciones, que caben en el
segundo. La solución publicada usa `insertarIterativa`.

!!! warning "Las trampas"

    - No se da la cantidad de claves: se lee con
      `while (scanf("%d", &x) == 1)`.
    - Un preorden ordenado arma una lista de altura 9 999, el ejemplo concreto
      de que el costo es $O(h)$ y no $O(\log n)$.
    - En esa lista, `insertar` y `posorden` apilan 10 000 marcos. Caben en la
      pila, y `insertarIterativa` se ahorra la mitad de ellos.

Solución: [uva12347.cpp](./codigo/uva12347.cpp), [entrada](./codigo/uva12347.in),
[salida](./codigo/uva12347.out).

### Aizu ALDS1_8_C, Binary Search Tree III

*Aizu ALDS1_8_C, Binary Search Tree III*:
<https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_8_C>. Envío en
<https://vjudge.net/problem/Aizu-ALDS1_8_C>.

La solución de ALDS1_8_B con `borrar` de la sesión, que devuelve la nueva raíz
del subárbol.

Es lo de ALDS1_8_B más `delete k`, que borra la clave con los tres casos y no
imprime nada, con los mismos límites. En el ejemplo se insertan 8, 2, 3, 7, 22 y
1, y luego se borran el 3 y el 7; el último `print` da ` 1 2 8 22` y
` 8 2 1 22`. El 3 tiene un solo hijo, el 7, que sube a su lugar (caso 2), y
después el 7 es una hoja (caso 1). La llamada es `raiz = borrar(raiz, k)` y
cada orden cuesta $O(h)$.

!!! warning "Las trampas"

    - Con dos hijos hay que subir el sucesor, el mínimo del subárbol derecho,
      como pide el enunciado, y el ejemplo no tiene ese caso. Uno propio:
      insertar 8, 2, 3, 7, 22 y 1, y borrar el 8. Con el sucesor, el preorden
      es ` 22 2 1 3 7`; con el predecesor, ` 7 2 1 3 22`. El inorden coincide y
      el juez marca respuesta incorrecta.
    - Al borrar la raíz, la raíz cambia. Sin la asignación `raiz = ...`, el
      árbol queda colgando de un nodo liberado.
    - El enunciado no dice qué pasa con una clave ausente, y la solución no debe
      fallar en ese caso.

Solución: [aizu_alds1_8_c.cpp](./codigo/aizu_alds1_8_c.cpp),
[entrada](./codigo/aizu_alds1_8_c.in), [salida](./codigo/aizu_alds1_8_c.out).

### Reto: UVa 10821, Constructing BST

*UVa 10821, Constructing BST*: <https://onlinejudge.org/external/108/10821.pdf>.
Envío en <https://vjudge.net/problem/UVA-10821>.

La raíz es la menor clave que deja caber al subárbol derecho en la altura que
queda, y el orden de impresión es un preorden.

Para cada par $N$, $H$, con $1 \le N \le 10\,000$ y $1 \le H \le 30$, se pide el
orden de inserción de $1, \ldots, N$ que deja un ABB de altura a lo sumo $H$ y
que es el menor en orden lexicográfico. La entrada termina con `0 0`, y si el
orden no existe se imprime `Impossible.`. `4 3` da `Case 1: 1 3 2 4`, `4 1` da
`Case 2: Impossible.` y `6 3` da `Case 3: 3 1 2 5 4 6`. En este problema un
nodo solo tiene altura 1, así que con $H = 3$ cada subárbol de la raíz tiene
altura 2 y caben 3 claves: con raíz 1, a la derecha quedan 2, 3 y 4, y caben.
La recursión trabaja sobre un rango $[\mathit{ini}, \mathit{fin}]$ con la
altura que le queda, como `construirBalanceado`; en un árbol de altura $H$
caben $2^H - 1$ claves. $\Theta(N)$ por caso. Es el reto de la sesión y no
tiene solución publicada.

!!! warning "Las trampas"

    - Aquí el árbol vacío tiene altura 0 y una hoja, altura 1: uno más que en
      la sesión.
    - $2^{30} - 1$ cabe en `int`; $2^{31}$ no.
    - `Impossible.` lleva punto, y la línea no termina en espacio.

## Lo que se vio

- En un ABB, para cada nodo, el subárbol izquierdo tiene claves menores y el
  derecho, mayores. Revisar solo los hijos inmediatos no basta; hace falta el
  rango permitido. El inorden de un ABB sale ordenado.
- Buscar, insertar y borrar bajan por un solo lado. Insertar y borrar devuelven
  la raíz del subárbol, y quien llama la guarda en el hijo por el que bajó: así
  se reengancha el árbol sin preguntar por el padre.
- Borrar tiene tres casos: hoja, un hijo, que sube, y dos hijos, donde sube la
  clave del sucesor y el sucesor se borra abajo.
- Todas cuestan $O(h)$; las recursivas piden $O(h)$ de pila y las iterativas
  $O(1)$. Como $\lfloor \log_2 n \rfloor \le h \le n - 1$, el mismo conjunto de
  claves va de $\Theta(\log n)$ a $\Theta(n)$ según el orden de inserción: con
  16 000 claves, altura 30 desordenadas y 15 999 en orden.

## Ejercicios interactivos

Las actividades para trabajar en el navegador, ordenadas por los temas de la
sesión, están en la [página de ejercicios](./Ejercicios.md). Las claves y los
árboles no son los de la sesión: mismo tema, ronda nueva.

## Lo que sigue

Los árboles rojinegros (CLRS, cap. 13): cada nodo lleva un color, y al insertar
y borrar se recolorea y se rota para que la altura nunca pase de
$2 \log_2(n + 1)$. Con ellos, buscar, insertar y borrar cuestan $O(\log n)$ en
cualquier orden de llegada. Es lo que hay dentro de `map` y `set`.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [arbol_binario.h](./codigo/arbol_binario.h) y
  [pila_arbol.h](./codigo/pila_arbol.h): el árbol binario y la pila de nodos
  del tema anterior, que `abb.h` incluye.
- [abb.h](./codigo/abb.h): `buscar`, `buscarIterativa`, `minimo`, `maximo`,
  `insertar`, `insertarIterativa`, `borrar` y la clase `ABB`.
- [uso_abb.cpp](./codigo/uso_abb.cpp): inserta, busca y borra los tres casos
  sobre el árbol de las trazas, con [salida](./codigo/uso_abb.out).
- [forma.cpp](./codigo/forma.cpp): las claves del 1 al 7 en dos órdenes de
  inserción, con [salida](./codigo/forma.out).
- [medir_altura.cpp](./codigo/medir_altura.cpp): el experimento de la altura y
  el tiempo, con [salida](./codigo/medir_altura.out).
- [ejercicios24.cpp](./codigo/ejercicios24.cpp): `esABBHijos`, `esABB`,
  `kEsimo`, `kEsimoPila`, `contarRango`, `construirBalanceado`, `piso` y
  `techo`, con [salida](./codigo/ejercicios24.out).

Las soluciones de los problemas de juez están en la sección *Para el juez*, con
su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Apéndice B.5, árboles; §10.3,
  representación de árboles con raíz; capítulo 12, árboles binarios de búsqueda
  (§12.1, definición y recorridos; §12.2, buscar, mínimo, máximo y sucesor;
  §12.3, insertar y borrar); capítulo 13, árboles rojinegros.
- R. Thareja. *Data Structures Using C*, 2.ª ed. Oxford University Press, 2014.
  Capítulo 9, *Trees*; capítulo 10, *Efficient Binary Trees*: §10.1, árboles
  binarios de búsqueda, y §10.2, sus operaciones.
- Aizu Online Judge. ALDS1_8_A, ALDS1_8_B y ALDS1_8_C, *Binary Search Tree I,
  II, III*: <https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_8_A>,
  <https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_8_B> y
  <https://onlinejudge.u-aizu.ac.jp/problems/ALDS1_8_C>.
- UVa Online Judge. Problema 12347, *Binary Search Tree*:
  <https://onlinejudge.org/external/123/12347.pdf>.
- UVa Online Judge. Problema 10821, *Constructing BST*:
  <https://onlinejudge.org/external/108/10821.pdf>.
