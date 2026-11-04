# Estructuras de Datos · Clase 25. El contenedor set y los montículos

Miércoles 4 de noviembre de 2026, de 17:00 a 19:00.

El árbol binario de búsqueda cuesta $O(h)$ por operación, y cuando las claves
llegan en orden degenera en lista: con $n$ claves, altura $n - 1$. `map` y
`set` guardan sus claves en un árbol binario de búsqueda que la biblioteca
mantiene balanceado, y por eso cuestan $O(\log n)$ con cualquier orden de
llegada. La primera parte de la sesión presenta `set`, el contenedor de claves
sin repetir y en orden. La segunda parte abre con otro problema: atender
siempre el pedido más urgente entre muchos que llegan. Para eso no hace falta
el orden completo, solo saber cuál es el mayor, y el montículo lo resuelve con
un árbol binario completo guardado en un arreglo, sin punteros.

Al terminar, el objetivo es poder usar `set` con `insert`, `erase`, `find`,
`count`, `lower_bound` y `upper_bound`, dar el costo de cada operación y
escoger entre `set`, `map` y `unordered_map`; decidir si un árbol o un arreglo
es un montículo de máximos y pasar de un árbol binario completo a su arreglo y
de vuelta; seguir a mano insertar y extraer el máximo, con el árbol y el
arreglo en cada paso, y dar su costo $O(\log n)$; e implementar un montículo de
máximos en C++ sobre un `vector`.

## Diapositivas

![](./clase25.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: el árbol binario de búsqueda

En un ABB, buscar, insertar y borrar bajan por un solo camino y cuestan $O(h)$,
y todo árbol binario de $n$ nodos cumple
$\lfloor \log_2 n \rfloor \le h \le n - 1$. Las claves del 10 al 70 insertadas
como `40 20 60 10 30 50 70` dan altura 2; insertadas en orden, una lista de
altura 6.

### Lo que hay dentro de map y set

`map` y `set` guardan sus claves en un árbol binario de búsqueda. Al insertar y
al borrar, la biblioteca reacomoda unos pocos nodos cerca del camino por donde
bajó, de modo que la altura queda en $O(\log n)$ sin importar el orden de
llegada. De ahí salen sus costos: `find`, `count`, `insert` y `erase` cuestan
$O(\log n)$ también en el peor caso, y el recorrido con el iterador sale en
orden porque es el inorden del árbol. En el `map` el nodo guarda la pareja; en
el `set`, solo la clave.

| | ABB del curso | `map`, `set` (ABB balanceado) | `unordered_map` (tabla hash) |
|---|---|---|---|
| buscar, insertar, borrar | $O(h)$: de $\Theta(\log n)$ a $\Theta(n)$ | $O(\log n)$, también en el peor caso | $O(1)$ en promedio; $\Theta(n)$ en el peor caso |
| recorrer en orden de clave | $\Theta(n)$ | $\Theta(n)$ | copiar y ordenar: $\Theta(n \log n)$ |
| la primera clave $\ge x$ | $O(h)$ | $O(\log n)$ con `lower_bound` | no la tiene |
| lo que pide de la clave | `<` | `<` | una función hash y `==` |

## El contenedor set

Una lista de asistencia trae el código de cada estudiante cada vez que entra
al aula: `42 17 88 17 5 63 42 30`. Vinieron `5 17 30 42 63 88`. Con un `map`
habría que inventar un valor que nadie consulta; lo que hace falta es un
conjunto, con claves sin repetir, en orden y sin nada al lado.

`set<T>` guarda claves distintas de tipo `T`, ordenadas con `<`. Por dentro es
el mismo árbol del `map`, con un nodo por clave y sin valor. Se incluye con
`#include <set>`.

```cpp
int main() {
  set<int> s;
  int llegan[8] = {42, 17, 88, 17, 5, 63, 42, 30};
  int i = 0;
  while (i < 8) {
    s.insert(llegan[i]);     // los segundos 17 y 42 no entran
    i = i + 1;
  }
  imprimir(s);
  consultar(s);
  imprimir(s);
  bordes(s);
  return 0;
}
```

`imprimir` recorre el `set` con su iterador, como se recorría un `map`.
`consultar` y `bordes` hacen las preguntas:

```cpp
// count, find y erase sobre la lista de asistencia
void consultar(set<int> &s) {
  printf("count(17) = %d, count(18) = %d\n", (int) s.count(17),
         (int) s.count(18));
  printf("find(63) == end(): %d\n", (int) (s.find(63) == s.end()));
  printf("erase(17) = %d\n", (int) s.erase(17));
  printf("erase(17) = %d\n", (int) s.erase(17));
}

// la menor, la mayor y las primeras claves >= x y > x
void bordes(set<int> &s) {
  printf("menor: %d\n", *s.begin());
  set<int>::iterator ult = s.end();
  --ult;                     // end() queda despues del mayor
  printf("mayor: %d\n", *ult);
  printf("lower_bound(42) = %d\n", *s.lower_bound(42));
  printf("upper_bound(42) = %d\n", *s.upper_bound(42));
  printf("lower_bound(50) = %d\n", *s.lower_bound(50));
  printf("lower_bound(90) == end(): %d\n",
         (int) (s.lower_bound(90) == s.end()));
}
```

La salida:

```text
 5 17 30 42 63 88   size = 6
count(17) = 1, count(18) = 0
find(63) == end(): 0
erase(17) = 1
erase(17) = 0
 5 30 42 63 88   size = 5
menor: 5
mayor: 88
lower_bound(42) = 42
upper_bound(42) = 63
lower_bound(50) = 63
lower_bound(90) == end(): 1
```

El segundo 17 y el segundo 42 no entran, porque `insert` busca la clave y, si
ya está, no hace nada. `count` devuelve 0 o 1, y `erase(k)` devuelve cuántas
claves quitó: 1 la primera vez, 0 la segunda. `end()` queda después del mayor,
y retrocederlo una vez da el mayor.

### lower_bound y upper_bound

`lower_bound(x)` devuelve un iterador a la primera clave $\ge x$, y
`upper_bound(x)`, a la primera clave $> x$; si no hay ninguna, devuelven
`end()`. Con `5 30 42 63 88`, `lower_bound(42)` apunta al 42,
`upper_bound(42)` al 63, `lower_bound(50)` al 63 y `lower_bound(90)` a
`end()`. Es el `lower_bound` de `<algorithm>`, pero en $O(\log n)$ bajando por
el árbol, sin un arreglo ordenado, y entre los dos queda el rango de las
claves que están en $[a, b]$.

!!! warning "No sirve el de <algorithm>"

    `lower_bound(s.begin(), s.end(), x)` compila, pero sobre un `set` avanza el
    iterador de uno en uno: $\Theta(n)$. Se usa el del contenedor,
    `s.lower_bound(x)`.

### Lo que cuesta cada operación de set

| Operación | Tiempo | Por qué |
|---|---|---|
| `insert(k)` | $O(\log n)$ | se baja por un camino de largo $O(\log n)$ y se reacomodan pocos nodos cerca de él |
| `erase(k)` | $O(\log n)$ | se busca, se quita y se reacomodan pocos nodos |
| `find(k)`, `count(k)` | $O(\log n)$ | un camino desde la raíz |
| `lower_bound`, `upper_bound` | $O(\log n)$ | un camino desde la raíz, guardando el mejor candidato |
| `size()`, `empty()` | $\Theta(1)$ | el `set` lleva la cuenta |
| `begin()` | $\Theta(1)$ | el `set` guarda dónde está el menor |
| `++it`, `--it` | $O(\log n)$ | ir al sucesor puede subir o bajar toda la altura |
| recorrido completo | $\Theta(n)$ | cada arista se baja una vez y se sube una vez |
| `erase(desde, hasta)` de $m$ claves | $O(\log n + m)$ | se quitan de a una, sin volver a buscar |
| espacio de la estructura | $\Theta(n)$ | un nodo por clave, con punteros al padre y a los dos hijos |

### ¿set, map o unordered_map?

| Lo que se guarda y se pregunta | Contenedor |
|---|---|
| solo claves; si están, en orden, la menor, la siguiente a $x$ | `set` |
| una clave con un valor, y el orden de las claves aparece en la salida o se pregunta por rangos | `map` |
| una clave con un valor, y solo se busca, se suma o se cuenta por clave | `unordered_map` |
| cuántas veces aparece cada clave | `map<T, int>` o `unordered_map<T, int>`, según haga falta el orden |

!!! warning "El set no guarda repetidos, y sus claves no se modifican"

    Con `3 3 7`, el `set` queda con `3 7` y `size()` vale 2; si las
    repeticiones importan, cada clave lleva su cuenta en un `map`. `*it` se
    puede leer pero no asignar, porque cambiar la clave en su sitio rompería el
    orden del árbol: se borra la vieja y se inserta la nueva, $O(\log n)$ cada
    una.

## Montículos

### El pedido más urgente

Una central de domicilios recibe pedidos todo el día, cada uno con un número
de urgencia: entre más alto, más urgente. Cada vez que un repartidor queda
libre, se le asigna el pedido pendiente más urgente. Dos pedidos pueden tener
la misma urgencia, y llegan cientos de miles de pedidos y de asignaciones.

Las entradas son órdenes en secuencia, `llega u` con la urgencia `u` o
`atender`; la salida, para cada `atender`, la urgencia del pedido que se
asigna. Si llegan 15, 40, 27 y 8, después un `atender`, después otro 27 y
después tres `atender`, se imprime `40 27 27 15` y queda pendiente el 8. Los
dos 27 se atienden: la urgencia repetida es otro pedido, no el mismo.

| Estructura | `llega` | `atender` | Por qué |
|---|---|---|---|
| arreglo sin orden | $\Theta(1)$ | $\Theta(n)$ | se agrega al final; para atender se recorre buscando el mayor |
| arreglo ordenado de menor a mayor | $\Theta(n)$ | $\Theta(1)$ | al llegar se corren los mayores; el más urgente es el último |
| `set` | $O(\log n)$ | $O(\log n)$ | el mayor es el anterior a `end()`, y se borra |
| lo que se quiere | $O(\log n)$ | $O(\log n)$ | y que acepte urgencias repetidas |

El `set` tiene los costos, pero el segundo 27 no entra y uno de los dos pedidos
nunca se atiende. Además, nadie pide la lista ordenada: solo cuál es el mayor.
Basta un orden parcial. Un árbol donde cada nodo es mayor o igual que sus hijos
tiene el mayor en la raíz, y si el árbol no tiene huecos, cabe en un arreglo
sin punteros y su altura es $\lfloor \log_2 n \rfloor$. Esas dos ideas forman
el montículo (*heap*; CLRS, cap. 6; Thareja, cap. 12).

### Árbol binario completo

Un árbol binario es completo (CLRS, §6.1; Thareja, §12.1) cuando todos sus
niveles están llenos, salvo quizá el último, y el último se llena de izquierda
a derecha, sin huecos. El árbol de raíz 8 con hijos 6 y 7, donde el 6 tiene a 2
y 5, es completo. Si al 6 le falta el primer hijo y tiene el segundo, ya no lo
es; tampoco si el último nivel tiene nodos bajo el 7 y ninguno bajo el 6. Un
árbol con todos los niveles llenos sí es completo.

En un árbol completo la forma depende solo de $n$, así que los nodos se
numeran por niveles, de izquierda a derecha, y se guardan en un arreglo. La
raíz va en `a[0]`, sus hijos en `a[1]` y `a[2]`, los nietos en `a[3]` a
`a[6]`. Con índices desde 0, para la casilla $i$:

$$
\mathit{padre}(i) = \left\lfloor \frac{i - 1}{2} \right\rfloor
\qquad \mathit{izq}(i) = 2i + 1 \qquad \mathit{der}(i) = 2i + 2
$$

En C++, `(i - 1) / 2` con enteros ya redondea hacia abajo para $i \ge 1$. CLRS
y Thareja ponen la raíz en la casilla 1, y entonces el padre es
$\lfloor i/2 \rfloor$ y los hijos $2i$ y $2i + 1$; aquí se cuenta desde 0, como
en un `vector`.

En el arreglo `45 31 40 12 25 18 7 5 9`, con $n = 9$, la casilla 1 (el 31)
tiene hijos en 3 y 4 (12 y 25) y su padre es la casilla 0. La casilla 4 (el 25)
tendría hijos en 9 y 10, fuera del arreglo: es una hoja. El 40 está en la
casilla 2 y sus hijos en 5 y 6, el 18 y el 7. Una décima clave entraría en la
casilla 9, cuyo padre es $\lfloor 8/2 \rfloor = 4$, el 25.

### La altura de un árbol completo

Un árbol completo de altura $h$ tiene los niveles $0, \ldots, h - 1$ llenos y
al menos un nodo en el nivel $h$, así que

$$
2^h = (1 + 2 + \cdots + 2^{h-1}) + 1 \;\le\; n \;\le\; 1 + 2 + \cdots + 2^h = 2^{h+1} - 1 .
$$

De $2^h \le n < 2^{h+1}$, tomando $\log_2$, sale $h \le \log_2 n < h + 1$, es
decir, $h = \lfloor \log_2 n \rfloor$. Con 9 claves la altura es 3; con mil, 9;
con un millón, 19. Un camino de la raíz a una hoja tiene a lo sumo
$\lfloor \log_2 n \rfloor$ aristas sin importar el orden en que llegaron las
claves, una garantía que el ABB no da.

### Montículo de máximos

Un montículo de máximos (CLRS, §6.1; Thareja, §12.1) es un árbol binario
completo, guardado en un arreglo, en el que cada nodo es mayor o igual que sus
hijos: para toda casilla $i \ge 1$, $a[\mathit{padre}(i)] \ge a[i]$. Siguiendo
cualquier camino hacia arriba las claves no bajan, y el mayor de todos queda en
la raíz, `a[0]`. Entre hermanos, y entre un subárbol y el otro, no hay ningún
orden: en `45 31 40 12 25 18 7 5 9` el 12 está a la izquierda del 40 y es menor
que el 18, que está a la derecha. Un montículo de mínimos es lo mismo con
$\le$, y el menor queda en la raíz, como en `5 9 7 12 30 8`.

!!! warning "No es un ABB"

    El inorden de `45 31 40 12 25 18 7 5 9` es `5 12 9 31 25 45 18 40 7`: no
    sale ordenado. Buscar una clave cualquiera no puede descartar un subárbol y
    cuesta $\Theta(n)$.

### ¿Cuáles son montículos de máximos?

Cuatro árboles: A es `50 30 45 10 20 40`; B es `50 30 45 10 35 40`; C tiene 50
en la raíz, 30 y 45 como hijos, el 10 bajo el 30 por la izquierda y el 40 bajo
el 45 por la derecha; D es `50 50 20 50 10`. A es montículo. B no: el 35 es hijo
del 30, y que sea menor que la raíz no basta, porque se compara con su padre. C
cumple el orden pero no es completo. D sí lo es: con claves iguales, *mayor o
igual* se cumple. Revisar un arreglo cuesta $\Theta(n)$, porque cada casilla
$i \ge 1$ se compara una vez con su padre.

### Insertar: la clave sube

En `45 31 40 12 25 18 7 5 9` llega el 42. Solo puede entrar en la casilla 9, la
primera libre, para que el árbol siga completo, pero ahí queda bajo el 25, que
es menor. La clave nueva se compara con su padre; si es mayor, se intercambian
y se repite desde la casilla del padre, hasta llegar a la raíz o a un padre
mayor o igual (CLRS, §6.5; Thareja, §12.1.1).

| $i$ | $\mathit{padre}(i)$ | comparación | acción |
|---:|---:|---|---|
| 9 | 4 | $42 > 25$ | intercambiar, $i = 4$ |
| 4 | 1 | $42 > 31$ | intercambiar, $i = 1$ |
| 1 | 0 | $42 < 45$ | detenerse |

Queda `45 42 40 12 31 18 7 5 9 25`. Se hace a lo sumo un
intercambio por nivel: $\lfloor \log_2 (n + 1) \rfloor$ con la clave nueva
contada, y los hace todos una clave mayor que todas, como un 46. Un 3, en
cambio, entra bajo el 25 y no hace ninguno.

`monticulo.h` guarda las claves en un `vector<int> a`. `subir`, `bajar` e
`intercambiar` son privados: quien usa el montículo solo ve `insertar`,
`maximo`, `extraerMax`, `vacio` y `tamano`.

```cpp
class Monticulo {
private:
  vector<int> a;

  void intercambiar(int i, int j) {
    int aux = a[i];
    a[i] = a[j];
    a[j] = aux;
  }

  // Sube la clave de i mientras sea mayor que la de su padre.
  void subir(int i) {
    while (i > 0 && a[(i - 1) / 2] < a[i]) {
      intercambiar(i, (i - 1) / 2);
      i = (i - 1) / 2;
    }
  }
```

```cpp
public:
  // La clave entra en la primera casilla libre y sube.
  void insertar(int k) {
    a.push_back(k);
    subir((int) a.size() - 1);
  }
```

`push_back` pone la clave en la primera casilla libre y la forma sigue
completa. El `while` se detiene en la raíz o cuando el padre ya no es menor.

### Extraer el máximo: la clave baja

Consultar el máximo es leer `a[0]`, en $\Theta(1)$. Para extraerlo, en
`45 42 40 12 31 18 7 5 9 25` sale el 45 y la raíz queda vacía. La única casilla
que se puede quitar sin dejar un hueco es la última, `a[9]`: su clave, el 25,
pasa a la raíz. La forma queda completa, pero el 25 está encima del 42 y del
40. La clave de la raíz se compara con sus dos hijos; si el mayor de ellos es
mayor que ella, se intercambian y se repite desde la casilla de ese hijo,
hasta una hoja o hasta que ningún hijo sea mayor (CLRS, §6.2, donde el paso se
llama `MAX-HEAPIFY`; Thareja, §12.1.2).

| $i$ | hijos | el mayor | acción |
|---:|---|---:|---|
| 0 | 1 y 2: 42 y 40 | 42 | $42 > 25$, intercambiar, $i = 1$ |
| 1 | 3 y 4: 12 y 31 | 31 | $31 > 25$, intercambiar, $i = 4$ |
| 4 | 9 y 10: fuera | | hoja, detenerse |

Queda `42 31 40 12 25 18 7 5 9`.

```cpp
  // Baja la clave de i, cambiandola por el mayor de sus hijos.
  void bajar(int i) {
    int n = (int) a.size();
    bool sigue = true;
    while (sigue) {
      int izq = 2 * i + 1;
      int der = 2 * i + 2;
      int mayor = i;
      if (izq < n && a[izq] > a[mayor]) {
        mayor = izq;
      }
      if (der < n && a[der] > a[mayor]) {
        mayor = der;
      }
      if (mayor != i) {
        intercambiar(i, mayor);
        i = mayor;
      } else {
        sigue = false;
      }
    }
  }
```

```cpp
  // La ultima clave pasa a la raiz y baja hasta su lugar.
  int extraerMax() {
    assert(!a.empty());
    int res = a[0];
    a[0] = a[a.size() - 1];
    a.pop_back();
    if (!a.empty()) {
      bajar(0);
    }
    return res;
  }
```

`mayor` empieza en `i` y se queda con la casilla de la clave más grande entre
la de $i$ y las de sus hijos que existan. Si sigue siendo `i`, ningún hijo es
mayor y `sigue` pasa a `false`, así que el ciclo termina por su condición. Con
una sola clave, `pop_back` deja el vector vacío y no hay nada que bajar.

### Un error al bajar

Esta versión baja comparando solo con el hijo izquierdo:

```cpp
// Error: baja mirando solo el hijo izquierdo.
void bajarSoloIzq(vector<int> &a, int i) {
  int n = (int) a.size();
  while (2 * i + 1 < n && a[2 * i + 1] > a[i]) {
    int aux = a[i];
    a[i] = a[2 * i + 1];
    a[2 * i + 1] = aux;
    i = 2 * i + 1;
  }
}
```

Sobre `25 42 40 12 31 18 7 5 9` acierta en la raíz por suerte, porque el
izquierdo, 42, es el mayor. En `a[1]` el izquierdo es 12, menor que 25, y se
detiene, pero el derecho es 31. Queda `42 25 40 12 31 18 7 5 9`, con el 31 bajo
el 25, y `esMonticulo` responde 0. Otra versión mira los dos hijos pero
intercambia con el primero que sea mayor que la clave: con `25 40 42` sube el
40 y queda `40 25 42`, con el 42 bajo el 40. Tiene que subir el mayor de los
dos hijos, porque queda como padre del otro.

### El montículo en uso

`uso_monticulo.cpp` inserta `45 31 40 12 25 18 7 5 9`, que ya están en orden de
montículo, repite las dos trazas, extrae todo y después atiende los pedidos
del problema, con 0 para `atender`:

```text
inicial:          45 31 40 12 25 18 7 5 9
insertar(42):     45 42 40 12 31 18 7 5 9 25
maximo() = 45
extraerMax() = 45: 42 31 40 12 25 18 7 5 9
salen en orden:   42 40 31 25 18 12 9 7 5
atender: 40
atender: 27
atender: 27
atender: 15
pendientes (1): 8
```

Extraer una y otra vez saca las claves de mayor a menor, y los dos 27 se
atienden porque el montículo guarda repetidos.

### Lo que cuesta cada operación del montículo

| Operación | Tiempo | Por qué |
|---|---|---|
| `insertar(k)` | $O(\log n)$ | sube a lo sumo $\lfloor \log_2 n \rfloor$ niveles, con una comparación y un intercambio por nivel; el `push_back` es $\Theta(1)$ salvo cuando el vector crece |
| `extraerMax()` | $O(\log n)$ | baja a lo sumo $\lfloor \log_2 n \rfloor$ niveles, con dos comparaciones y un intercambio por nivel |
| `maximo()` | $\Theta(1)$ | está en `a[0]` |
| `vacio()`, `tamano()` | $\Theta(1)$ | el `vector` lleva la cuenta |
| buscar una clave cualquiera | $\Theta(n)$ | entre hermanos no hay orden: no se puede descartar un subárbol |
| espacio de la estructura | $\Theta(n)$ | solo las claves en el `vector`, sin punteros |
| espacio aparte | $\Theta(1)$ | `subir` y `bajar` son ciclos con unas pocas variables |

De vuelta a los pedidos:

| Estructura | `llega` | `atender` | repetidos | espacio |
|---|---|---|---|---|
| arreglo sin orden | $\Theta(1)$ | $\Theta(n)$ | sí | $\Theta(n)$ |
| arreglo ordenado | $\Theta(n)$ | $\Theta(1)$ | sí | $\Theta(n)$ |
| `set` | $O(\log n)$ | $O(\log n)$ | no | $\Theta(n)$, con tres punteros por clave |
| montículo | $O(\log n)$ | $O(\log n)$ | sí | $\Theta(n)$, solo las claves |

Con $n$ pedidos que llegan y se atienden, el montículo hace todo en
$O(n \log n)$; el arreglo sin orden, en $\Theta(n^2)$ en el peor caso.

## Ejercicios

### Contar en un rango

Con un `set<int>` y sin recorrerlo entero, `contarRango(s, a, b)` cuenta las
claves en $[a, b]$:

```cpp
// Claves en [a, b]: se baja hasta a y se camina hasta pasar b.
int contarRango(set<int> &s, int a, int b) {
  int cuenta = 0;
  set<int>::iterator it = s.lower_bound(a);
  set<int>::iterator fin = s.upper_bound(b);
  while (it != fin) {
    cuenta = cuenta + 1;
    ++it;
  }
  return cuenta;
}
```

Con `s = {4, 9, 15, 22, 30, 41, 57}`, en $[10, 40]$ hay 3: 15, 22 y 30. En
$[42, 56]$ no hay ninguna: los dos iteradores apuntan al 57 y el ciclo no da
ninguna vuelta. Cuesta $O(\log n + m)$, con $m$ las claves del rango: dos
bajadas por el árbol y $m$ avances.

### ¿Es un montículo?

`esMonticulo(a)` dice si un `vector<int>` es un montículo de máximos:

```cpp
// Cada casilla desde la 1 se compara con su padre, una sola vez.
bool esMonticulo(vector<int> &a) {
  bool res = true;
  int i = 1;
  while (i < (int) a.size() && res) {
    if (a[(i - 1) / 2] < a[i]) {
      res = false;
    }
    i = i + 1;
  }
  return res;
}
```

Con `60 35 50 20 30 50 10` responde que sí: el 50 de la casilla 5 es igual a su
padre, y eso se permite. Con `60 35 50 20 38 45 10` responde que no, porque la
casilla 4 tiene el 38 y su padre, la casilla 1, el 35. Con `60 50 40 30 20 10`
responde que sí: un arreglo de mayor a menor siempre es un montículo. Cuesta
$\Theta(n)$ en el peor caso y $O(1)$ de espacio aparte.

## Para practicar en casa

### Propuesto 1: el más cercano

Con un `set`, escriban la clave más cercana a $x$; si dos empatan, la menor.
`lower_bound(x)` da la primera $\ge x$, y la anterior es la otra candidata. Hay
que cuidar `begin()` y `end()`. $O(\log n)$.

### Propuesto 2: borrar los menores

Con un `set`, quiten de una vez todas las claves menores que $x$, sin un
ciclo. `erase(desde, hasta)` con `begin()` y `lower_bound(x)`:
$O(\log n + m)$.

### Propuesto 3: extraer a mano

Sobre el montículo `70 40 60 10 30 20 50`, extraigan el máximo tres veces y
dibujen el árbol y el arreglo después de cada una. La primera extracción deja
`60 40 50 10 30 20`.

### Propuesto 4: montículo de mínimos

Cambien `monticulo.h` para que la raíz sea el menor. Cambian las dos
comparaciones de `subir` y las dos de `bajar`, y `maximo` pasa a ser `minimo`.

### Ejercicio de cierre

Llegan números uno por uno y, después de cada uno, hay que imprimir la mediana
de los que han llegado. ¿Cómo se haría con dos montículos, uno de máximos y
otro de mínimos? ¿Cuánto cuesta cada llegada?

## Para el juez

Cada solución lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uva10815.in`.

### UVa 10815, Andy's First Dictionary

*UVa 10815, Andy's First Dictionary*:
<https://vjudge.net/problem/UVA-10815>, donde también se envía.

Cada palabra, en minúscula, entra a un `set<string>`, y el recorrido final sale
en orden alfabético.

Llega un texto de a lo sumo 5 000 líneas, de hasta 200 caracteres cada una,
hasta el fin de la entrada. Una palabra es una racha seguida de letras,
mayúsculas o minúsculas, y `Apple`, `apple` y `APPLE` son la misma. Se
imprimen las palabras distintas en minúscula, una por línea y en orden
alfabético; hay a lo sumo 5 000 distintas. La línea del ejemplo que termina en
`read: "Disneyland Left."` aporta `read`, `disneyland` y `left`, y
`disneyland`, que aparece tres veces, sale una sola. Con $W$ palabras en total,
$d$ distintas y $L$ letras por palabra cuesta $O(W \cdot L \log d)$, porque
cada comparación de dos palabras mira hasta $L$ letras.

!!! warning "Las trampas"

    - `scanf("%s")` lee trozos separados por espacios, no palabras: `Left."`
      trae un punto y unas comillas, y `don't` son dos palabras, `don` y `t`.
      Cada trozo se parte en sus rachas de letras.
    - Los dígitos y los guiones también separan: `stop-me` da `stop` y `me`.
    - Las mayúsculas se pasan a minúscula antes de insertar. Sin eso, `The` y
      `the` salen dos veces, y en desorden, porque las mayúsculas van antes que
      todas las minúsculas.
    - Un trozo puede medir 200 caracteres, así que el arreglo lleva 201.

Solución: [uva10815.cpp](./codigo/uva10815.cpp), [entrada](./codigo/uva10815.in),
[salida](./codigo/uva10815.out).

## Lo que se vio

- `map` y `set` guardan las claves en un ABB que la biblioteca mantiene
  balanceado: cuestan $O(\log n)$ con cualquier orden de llegada, y su
  recorrido es el inorden.
- `set` guarda claves distintas en orden, y `lower_bound` y `upper_bound`
  encuentran la primera clave $\ge x$ o $> x$ en $O(\log n)$.
- Un montículo de máximos es un árbol binario completo en un arreglo, con cada
  nodo mayor o igual que sus hijos. Con índices desde 0, el padre de $i$ es
  $\lfloor (i - 1)/2 \rfloor$ y sus hijos, $2i + 1$ y $2i + 2$. Su altura es
  $\lfloor \log_2 n \rfloor$.
- Insertar pone la clave en la primera casilla libre y la sube; extraer el
  máximo pasa la última clave a la raíz y la baja hacia el mayor de sus hijos.
  Las dos cuestan $O(\log n)$, y consultar el máximo, $\Theta(1)$.

## Ejercicios interactivos

Las actividades para trabajar en el navegador, ordenadas por los temas de la
sesión, están en [Ejercicios interactivos](./Ejercicios.md). Las claves y los
árboles no son los de la sesión: mismo tema, ronda nueva.

## Lo que sigue

Construir un montículo a partir de un arreglo cualquiera en $\Theta(n)$,
ordenar con un montículo (*heapsort*) y la cola de prioridad con el contenedor
`priority_queue` (CLRS, §6.3 a §6.5).

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [arbol_binario.h](./codigo/arbol_binario.h),
  [pila_arbol.h](./codigo/pila_arbol.h) y [abb.h](./codigo/abb.h): el árbol
  binario y el ABB de los temas anteriores.
- [uso_set.cpp](./codigo/uso_set.cpp): `insert`, `count`, `find`, `erase`,
  `begin`, `lower_bound` y `upper_bound` sobre la lista de asistencia, con
  [salida](./codigo/uso_set.out).
- [monticulo.h](./codigo/monticulo.h): la clase `Monticulo` sobre un
  `vector<int>`, con `insertar`, `maximo`, `extraerMax`, `vacio`, `tamano` e
  `imprimir`.
- [uso_monticulo.cpp](./codigo/uso_monticulo.cpp): las trazas de insertar y
  extraer y los pedidos del problema, con [salida](./codigo/uso_monticulo.out).
- [ejercicios25.cpp](./codigo/ejercicios25.cpp): `contarRango`, `esMonticulo`,
  las claves en orden y `bajarSoloIzq`, con
  [salida](./codigo/ejercicios25.out).

Las soluciones de los problemas de juez están en la sección *Para el juez*, con
su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 6, *Heapsort*: §6.1,
  montículos; §6.2, mantener la propiedad de montículo; §6.5, colas de
  prioridad. Capítulo 12, árboles binarios de búsqueda.
- R. Thareja. *Data Structures Using C*, 2.ª ed. Oxford University Press, 2014.
  Capítulo 12, *Heaps*: §12.1, *Binary Heaps*, p. 361; §12.1.1, insertar,
  p. 362; §12.1.2, borrar, p. 364.
- UVa, en Virtual Judge. Problema 10815, *Andy's First Dictionary*:
  <https://vjudge.net/problem/UVA-10815>.
