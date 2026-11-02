# Estructuras de Datos · Clase 25. Árboles rojinegros y el contenedor set

Miércoles 4 de noviembre de 2026, de 17:00 a 19:00.

El árbol binario de búsqueda cuesta $O(h)$ por operación, y $h$ depende del
orden en que llegan las claves. Cuando llegan ya ordenadas, como los números
de un contador, el árbol degenera en lista: con 32 000 claves, altura 31 999.
Los árboles rojinegros resuelven eso pintando cada nodo de rojo o de negro y
reparando el árbol con recoloreos y rotaciones cerca del nodo que entró. La
sesión los explica con dibujos, sin implementarlos: las cinco reglas, por qué
la altura queda por debajo de $2 \log_2(n + 1)$, las rotaciones y los tres
casos de la inserción, seguidos en una traza completa. El rojinegro es el árbol que hay
dentro de `map` y de `set`, y la segunda parte presenta `set`, el contenedor
de claves sin repetir y en orden.

Al terminar, el objetivo es poder explicar por qué un ABB que recibe claves en
orden pierde su costo logarítmico y cuánto costaría reconstruirlo tras cada
inserción; decidir si un árbol coloreado cumple las cinco reglas y explicar en
palabras la cota de su altura; seguir a mano una rotación y una inserción, con
el caso que corresponde en cada paso; usar `set` con `insert`, `erase`,
`find`, `count`, `lower_bound` y `upper_bound` y dar el costo de cada
operación; y escoger entre `set`, `map` y `unordered_map` según lo que pide el
problema.

## Diapositivas

![](./clase25.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El problema: claves que llegan en orden

En un ABB, buscar, insertar y borrar bajan por un solo camino y cuestan
$O(h)$, con $\lfloor \log_2 n \rfloor \le h \le n - 1$. Las claves del 10 al
70 insertadas como `40 20 60 10 30 50 70` dan altura 2; insertadas como
`10 20 30 40 50 60 70`, una lista de altura 6.

Una tienda en línea numera sus pedidos con un contador, así que cada pedido
nuevo recibe un número mayor que todos los anteriores, y los guarda en un ABB
para responder si un pedido existe, anularlo y listar los pendientes en orden.
Con los pedidos `10 20 30 40 50 60 70 80`, cada número baja por la derecha
hasta el fondo: queda una lista de altura 7, y preguntar por el 80 compara 8
veces. Con $n$ pedidos el $i$-ésimo compara $i - 1$ veces al entrar, y en total
son $n(n - 1)/2 = \Theta(n^2)$ comparaciones.

`medir_set.cpp` inserta `1, 2, ..., n` en el ABB de la sesión anterior con
`insertarIterativa` y mide la altura y el tiempo de procesador, sin optimizar,
en el equipo donde se preparó la sesión:

| $n$ | Altura del ABB | Segundos |
|---|---|---|
| 1 000 | 999 | 0,0008 |
| 2 000 | 1 999 | 0,0034 |
| 4 000 | 3 999 | 0,0128 |
| 8 000 | 7 999 | 0,0512 |
| 16 000 | 15 999 | 0,2021 |
| 32 000 | 31 999 | 0,7989 |

Cada vez que $n$ se dobla, el tiempo se multiplica por cerca de 4, como manda
el $\Theta(n^2)$. A ese ritmo, un día con 500 000 pedidos tomaría más de tres
minutos solo en insertar.

### Primera idea: reconstruir el árbol balanceado

`construirBalanceado(a, ini, fin)` arma el ABB de menor altura a partir de un
arreglo ordenado. Si después de cada inserción se saca el inorden a un arreglo
y se reconstruye el árbol, la altura queda siempre en
$\lfloor \log_2 n \rfloor$ y buscar cuesta $\Theta(\log n)$. Pero cada
inserción paga el inorden, $\Theta(n)$, y la reconstrucción, otro $\Theta(n)$.

| | Una inserción | $n$ inserciones |
|---|---|---|
| ABB con claves en orden | $\Theta(n)$ | $\Theta(n^2)$ |
| ABB reconstruido cada vez | $\Theta(n)$ | $\Theta(n^2)$ |
| Lo que se quiere | $O(\log n)$ | $O(n \log n)$ |

Se arregló la búsqueda y la inserción quedó igual de cara: reconstruir mueve
los $n$ nodos para acomodar uno solo.

La segunda idea renuncia a la altura mínima. Acepta un margen, que ningún
camino de la raíz hacia abajo sea más del doble de largo que otro, y lo repara
con cambios locales sobre el camino por donde bajó la inserción: cambiar
colores y girar unos pocos nodos, cada cosa en $O(1)$. El árbol
rojinegro (CLRS, cap. 13; Thareja, §10.5) se construye sobre esa idea.

## Las cinco reglas

Un árbol rojinegro (CLRS, §13.1; Thareja, §10.5.1) es un ABB donde cada nodo
lleva un color, rojo o negro, y que cumple:

1. Todo nodo es rojo o negro.
2. La raíz es negra.
3. Toda hoja (`NIL`) es negra.
4. Si un nodo es rojo, sus dos hijos son negros.
5. Para cada nodo, todos los caminos desde él hasta las hojas `NIL` de abajo
   tienen la misma cantidad de nodos negros.

Las hojas `NIL` son los punteros `NULL` del ABB, vistos como hojas negras sin
clave; las claves viven en los nodos internos. En el texto los árboles se
escriben en preorden, con N para negro y R para rojo detrás de cada clave. El
árbol de la definición es `26N 17R 14N 10R 21N 41N 30R 47R`: el 26 en la raíz,
el 17 y el 41 como hijos, el 14 y el 21 bajo el 17, el 10 como hijo izquierdo
del 14, y el 30 y el 47 bajo el 41.

La *altura negra* de un nodo $x$, $\mathit{bh}(x)$, es la cantidad de nodos
negros en un camino desde $x$, sin contar $x$, hasta una hoja `NIL`, contándola.
Por la regla 5 no depende del camino. En el árbol anterior el 26 tiene altura
negra 2, por ejemplo por 17, 14, 10 y `NIL`, donde solo cuentan el 14 y el
`NIL`; el 17 también tiene 2, y el 41, el 14 y el 10 tienen 1.

### ¿Cuáles cumplen?

| Árbol | Preorden | ¿Cumple? |
|---|---|---|
| A | `15N 8N 5R 20N` | sí: desde el 15, todo camino pasa por 2 negros |
| B | `15R 8N 20N` | no, rompe la regla 2: la raíz es roja |
| C | `15N 8R 5R 20R` | no, rompe la regla 4: el 8 es rojo y su hijo 5 también |
| D | `15N 8N 20N 25N` | no, rompe la regla 5: por el 8 hay 2 negros y por 20 y 25, 3 |

En C las alturas negras sí coinciden, porque todos los caminos pasan por un
solo negro, el `NIL`. D está todo en negro y se arregla de una sola forma,
pintando el 25 de rojo. Pintar todo de negro solo funciona si todas las hojas
están al mismo nivel; los rojos son el margen que deja tener caminos de
distinto largo.

### Cuánto puede medir

Si desde la raíz todo camino hasta un `NIL` pasa por $b$ nodos negros
internos, el camino más corto posible es todo negro y tiene $b$ nodos. El más
largo intercala un rojo después de cada negro, porque dos rojos seguidos
romperían la regla 4, y tiene $2b$. Ningún camino es más del doble de largo
que otro.

Además, ningún camino llega a un `NIL` antes de pasar por $b$ nodos internos,
así que los niveles $0, 1, \ldots, b - 1$ están completos:

$$
n \ge 1 + 2 + \cdots + 2^{b-1} = 2^b - 1
\quad\Longrightarrow\quad b \le \log_2(n + 1).
$$

Como el camino más largo tiene a lo sumo $2b$ nodos,
$h < 2b \le 2 \log_2(n + 1)$. CLRS lo demuestra en el lema 13.1.

| $n$ | $\lfloor \log_2 n \rfloor$ | $2 \log_2(n + 1)$ | ABB, peor caso |
|---|---|---|---|
| 15 | 3 | 8 | 14 |
| 1 000 | 9 | 19,9 | 999 |
| 1 000 000 | 19 | 39,9 | 999 999 |
| $10^9$ | 29 | 59,8 | $10^9 - 1$ |

Con mil millones de claves, buscar en un rojinegro baja a lo sumo 60 niveles,
llegue en el orden que llegue cada clave.

## Rotaciones

El ABB `10 20 30` es una lista hacia la derecha. Para dejar el 20 en la raíz,
con el 10 y el 30 como hijos, basta cambiar punteros: el 20 sube y el 10 baja a
ser su hijo izquierdo. El inorden sigue siendo `10 20 30` y la altura pasa de
2 a 1. El giro se llama *rotación* (CLRS, §13.2).

En general, $x$ tiene a la izquierda un subárbol $\alpha$ y a la derecha a
$y$, cuyos subárboles son $\beta$ y $\gamma$. Rotar a la izquierda en $x$ deja
a $y$ arriba, con $x$ a su izquierda y $\gamma$ a su derecha, y $\alpha$ y
$\beta$ quedan colgando de $x$. En los dos árboles el inorden es
$\alpha\ x\ \beta\ y\ \gamma$. Cambian tres enlaces:

1. El hijo derecho de $x$ deja de ser $y$ y pasa a ser $\beta$.
2. El hijo izquierdo de $y$ deja de ser $\beta$ y pasa a ser $x$.
3. El padre de $x$, o la raíz si $x$ era la raíz, apunta ahora a $y$.

Son tres enlaces sin importar cuántos nodos tengan los subárboles, así que
rotar cuesta $O(1)$ en tiempo y en espacio. La rotación a la derecha en $y$ es
la misma figura leída al revés. $\beta$ cambia de padre: sus claves son
mayores que $x$ y menores que $y$, y en las dos posiciones respeta el orden.
Olvidar moverla deja un subárbol colgando de dos padres o de ninguno.

Con el árbol `50 25 70 60 85 90` (el 50 en la raíz con hijos 25 y 70, el 70
con hijos 60 y 85, y el 90 a la derecha del 85), rotar a la izquierda en el 50
sube el 70 a la raíz. El 60 era el $\beta$: pasa de hijo izquierdo del 70 a
hijo derecho del 50. Queda `70 50 25 60 85 90`, con el inorden intacto,
`25 50 60 70 85 90`, y la altura baja de 3 a 2. Rotar a la derecha en el 70
devuelve el árbol original.

| Operación | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| rotar a la izquierda | $O(1)$ | $O(1)$ | cambian tres enlaces |
| rotar a la derecha | $O(1)$ | $O(1)$ | la misma figura al revés |

## Insertar y borrar

Insertar (CLRS, §13.3) empieza como en el ABB: se baja hasta el `NIL` donde
termina la búsqueda y ahí se cuelga el nodo nuevo, $z$, pintado de rojo y con
dos hojas `NIL` negras. Un nodo negro nuevo le sumaría un negro a los caminos
que pasan por él y a ningún otro, y rompería la regla 5 en todos sus
antepasados. Uno rojo no cambia ninguna altura negra y solo puede romper la
regla 2, si $z$ es la raíz, y entonces se pinta de negro; o la regla 4, si su
padre también es rojo.

Cuando el padre es rojo, el abuelo es negro, porque el árbol cumplía antes, y
lo que decide qué hacer es el *tío*, el otro hijo del abuelo. Con el padre a
la izquierda del abuelo:

| Situación | Qué se hace | Después |
|---|---|---|
| Tío rojo (caso 1) | padre y tío a negro, abuelo a rojo | $z$ sube al abuelo; puede repetirse |
| Tío negro, en ángulo (caso 2) | rotar en el padre, hacia afuera | queda en línea: caso 3 |
| Tío negro, en línea (caso 3) | padre a negro, abuelo a rojo, rotar en el abuelo hacia el otro lado | termina |
| $z$ es la raíz | pintarla de negro | termina |

Si el padre está a la derecha del abuelo, todo se refleja: donde dice rotar a
la derecha, se rota a la izquierda.

Tres ejemplos pequeños, cada uno con un caso:

- **Tío rojo.** En `50N 30R 70R` entra el 60, rojo, bajo el 70, rojo. El tío
  30 es rojo: 30 y 70 pasan a negro y 50 a rojo, sin cambiar ninguna altura
  negra. Ahora $z$ es el 50, que es la raíz y es rojo: se pinta de negro y
  queda `50N 30N 70N 60R`.
- **Tío negro, en línea.** En `50N 30R` entra el 20. El tío es un `NIL`, negro,
  y 20, 30 y 50 están en línea a la izquierda. Pintar solo el 30 de negro le
  sumaría un negro a los caminos de la izquierda. El 30 pasa a negro, el 50 a
  rojo, y se rota a la derecha en el 50: `30N 20R 50R`.
- **Tío negro, en ángulo.** En `50N 30R` entra el 40, hijo derecho de un hijo
  izquierdo. Rotar en el 50 dejaría el 40 colgando del 30, otra vez rojo bajo
  rojo. Primero se rota a la izquierda en el 30, que los pone en línea con el
  30 abajo, y se sigue como en el caso anterior: 40 a negro, 50 a rojo y
  rotación a la derecha en el 50. Queda `40N 30R 50R`, con dos rotaciones.

### Traza: los pedidos en un rojinegro

Los mismos pedidos `10 20 30 40 50 60 70 80`, uno por uno:

| Entra | Qué se rompe | Caso | Árbol después |
|---|---|---|---|
| 10 | regla 2: es la raíz y es roja | pintar la raíz | `10N` |
| 20 | nada: su padre 10 es negro | | `10N 20R` |
| 30 | padre 20 rojo, tío `NIL` negro, en línea | caso 3: 20 a negro, 10 a rojo, rotar a la izquierda en el 10 | `20N 10R 30R` |
| 40 | padre 30 rojo, tío 10 rojo | caso 1, y la raíz 20 queda roja: se pinta de negro | `20N 10N 30N 40R` |
| 50 | padre 40 rojo, tío `NIL` (el hijo izquierdo del 30), en línea | caso 3: 40 a negro, 30 a rojo, rotar a la izquierda en el 30 | `20N 10N 40N 30R 50R` |
| 60 | padre 50 rojo, tío 30 rojo | caso 1: $z$ sube al 40, cuyo padre 20 es negro | `20N 10N 40R 30N 50N 60R` |
| 70 | padre 60 rojo, tío `NIL`, en línea | caso 3: 60 a negro, 50 a rojo, rotar a la izquierda en el 50 | `20N 10N 40R 30N 60N 50R 70R` |
| 80 | padre 70 rojo, tío 50 rojo | caso 1: $z$ sube al 60, cuyo padre 40 es rojo; su tío 10 es negro y 20, 40 y 60 están en línea: caso 3, 40 a negro, 20 a rojo, rotar a la izquierda en el 20 | `40N 20R 10N 30N 60R 50N 70N 80R` |

En la última rotación el 30 cambia de padre: era el $\beta$, hijo izquierdo
del 40, y termina como hijo derecho del 20. El árbol final tiene altura 3,
frente a la altura 7 del ABB con la misma secuencia; buscar el 80 compara 4
veces en lugar de 8. Hubo cuatro rotaciones en ocho inserciones, una como
máximo en cada una.

Siguiendo la misma inserción de CLRS con `1, 2, ..., n` en orden:

| $n$ | Altura del ABB | Altura del rojinegro | $2 \log_2(n + 1)$ |
|---|---|---|---|
| 1 000 | 999 | 16 | 19,9 |
| 32 000 | 31 999 | 26 | 29,9 |
| 1 000 000 | 999 999 | 36 | 39,9 |

### Lo que cuesta insertar

| Paso | Tiempo | Espacio aparte | Por qué |
|---|---|---|---|
| bajar hasta el `NIL` | $O(\log n)$ | $O(1)$ | un camino de largo $h \le 2 \log_2(n + 1)$ |
| recolorear (caso 1) | $O(\log n)$ | $O(1)$ | cada vez $z$ sube dos niveles y no pasa de la raíz |
| rotaciones (casos 2 y 3) | $O(1)$ | $O(1)$ | a lo sumo dos, y después del caso 3 se termina |
| insertar, en total | $O(\log n)$ | $O(1)$ | la suma de los tres |

El espacio aparte es $O(1)$ porque la versión de CLRS sube con un puntero al
padre en cada nodo, sin recursión. La estructura ocupa $\Theta(n)$: cada nodo
guarda la clave, tres punteros y el color. Los recoloreos y las rotaciones
ocurren en el camino que la búsqueda ya recorrió, de $z$ hacia la raíz, y el
resto del árbol no se toca.

### Borrar

Borrar (CLRS, §13.4) empieza como en el ABB: hoja, un hijo o dos hijos con el
sucesor. Quitar un nodo rojo no cambia ninguna altura negra. Quitar uno negro
deja a los caminos que pasaban por él con un negro de menos y rompe la regla
5; se repara mirando al *hermano* del nodo que ocupó su lugar, en cuatro casos
con recoloreos y rotaciones. Son las mismas herramientas de la inserción, con
más casos, a lo sumo tres rotaciones y $O(\log n)$ en total.

| Operación | Tiempo | Rotaciones | Por qué |
|---|---|---|---|
| buscar, mínimo, máximo | $O(\log n)$ | 0 | un camino de largo $O(\log n)$ |
| insertar | $O(\log n)$ | a lo sumo 2 | bajar y reparar hacia arriba |
| borrar | $O(\log n)$ | a lo sumo 3 | bajar y reparar hacia arriba |
| recorrer en inorden | $\Theta(n)$ | 0 | cada nodo una vez |

## Lo que hay dentro de map

En la biblioteca de `g++` (libstdc++), `map` y `set` guardan sus claves en la
misma clase, `_Rb_tree`, que el archivo `bits/stl_tree.h` presenta así:

```text
// Red-black tree class, designed for use in implementing STL
// associative containers (set, multiset, map, and multimap). The
// insertion and deletion algorithms are based on those in Cormen,
// Leiserson, and Rivest, Introduction to Algorithms (MIT Press,
// 1990), except that
//
// (1) the header cell is maintained with links not only to the root
// but also to the leftmost node of the tree, to enable constant
// time begin(), ...
```

De ahí salen los costos que se usaron con `map`. `m[k]`, `find`, `count` y
`erase` cuestan $O(\log n)$ también en el peor caso, porque son buscar,
insertar y borrar en un rojinegro. El recorrido con el iterador sale en orden
de clave porque es el inorden del árbol: avanzar el iterador va al sucesor,
bajando al mínimo del subárbol derecho o subiendo hasta el primer antepasado
por la izquierda. `begin()` cuesta $\Theta(1)$ porque el encabezado guarda un
enlace al nodo de más a la izquierda, el menor. En el `map` cada nodo guarda
la pareja y el árbol se ordena por la clave.

`medir_set.cpp` repite el experimento de los pedidos con un `set`. Del `set`
solo se mide el tiempo, porque la biblioteca no deja ver su árbol:

| $n$ | Altura del ABB | Segundos ABB | Segundos `set` |
|---|---|---|---|
| 1 000 | 999 | 0,0008 | 0,0003 |
| 4 000 | 3 999 | 0,0128 | 0,0016 |
| 16 000 | 15 999 | 0,2021 | 0,0069 |
| 32 000 | 31 999 | 0,7989 | 0,0142 |

El `set` dobla su tiempo cuando $n$ se dobla, $n$ inserciones de
$O(\log n)$, mientras el ABB lo multiplica por 4. Con 32 000 pedidos el `set`
es 56 veces más rápido, y un millón de pedidos en orden le toman 0,58 segundos.

| | ABB sin balancear | `map`, `set` (rojinegro) | `unordered_map` (tabla hash) |
|---|---|---|---|
| Buscar, insertar, borrar | $O(h)$: de $\Theta(\log n)$ a $\Theta(n)$ | $O(\log n)$, también en el peor caso | $O(1)$ en promedio; $\Theta(n)$ en el peor caso |
| Recorrer en orden de clave | $\Theta(n)$ | $\Theta(n)$ | copiar y ordenar: $\Theta(n \log n)$ |
| La menor clave | $O(h)$ | $\Theta(1)$ con `begin()` | $\Theta(n)$, revisando todas |
| La primera clave $\ge x$ | $O(h)$ | $O(\log n)$ con `lower_bound` | no la tiene |
| Lo que pide de la clave | `<` | `<` | una función hash y `==` |

El ABB del curso sirve para entender lo que hay dentro, pero no para datos que
pueden llegar en orden. El rojinegro cobra un color por nodo y unas pocas
rotaciones a cambio de la garantía.

## El contenedor set

Una lista de asistencia trae el código de cada estudiante cada vez que entra
al aula: `42 17 88 17 5 63 42 30`. Vinieron `5 17 30 42 63 88`. Con un `map`
habría que inventar un valor que nadie consulta; lo que hace falta es un
conjunto, con claves sin repetir, en orden y sin nada al lado.

`set<T>` guarda claves distintas de tipo `T`, ordenadas con `<`. Por dentro es
el mismo árbol rojinegro del `map`, con un nodo por clave y sin valor. Se
incluye con `#include <set>`.

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
| `insert(k)` | $O(\log n)$ | se baja hasta el `NIL`; a lo sumo dos rotaciones |
| `erase(k)` | $O(\log n)$ | se busca y se borra; a lo sumo tres rotaciones |
| `find(k)`, `count(k)` | $O(\log n)$ | un camino desde la raíz |
| `lower_bound`, `upper_bound` | $O(\log n)$ | un camino desde la raíz, guardando el mejor candidato |
| `size()`, `empty()` | $\Theta(1)$ | el `set` lleva la cuenta |
| `begin()` | $\Theta(1)$ | el encabezado apunta al menor |
| `++it`, `--it` | $O(\log n)$ | ir al sucesor puede subir o bajar toda la altura |
| recorrido completo | $\Theta(n)$ | cada arista se baja una vez y se sube una vez |
| `erase(desde, hasta)` de $m$ claves | $O(\log n + m)$ | se quitan de a una, sin volver a buscar |
| destructor | $\Theta(n)$ | se libera un nodo por clave |
| espacio de la estructura | $\Theta(n)$ | un nodo por clave, con tres punteros y el color |

### Los distintos, de tres maneras

`distintos.cpp` imprime los códigos distintos de
`31 12 50 12 7 31 31 64 7 50`, de menor a mayor, con un `set`, con `sort` y
`unique` sobre un `vector`, y con un `map<int, bool>`. Las tres dan
`7 12 31 50 64`, 5 distintos.

```cpp
// se copian los n, se ordenan y unique deja al frente los distintos
void conVector() {
  vector<int> v(codigos, codigos + N);
  sort(v.begin(), v.end());
  vector<int>::iterator fin = unique(v.begin(), v.end());
  v.erase(fin, v.end());
  printf("sort + unique:");
  int i = 0;
  while (i < (int) v.size()) {
    printf(" %d", v[i]);
    i = i + 1;
  }
  printf("   (%d distintos)\n", (int) v.size());
}
```

`unique` deja al frente un representante de cada grupo de iguales *seguidos*
y devuelve dónde terminan; por eso va después de `sort`. El `erase` del
`vector` corta lo que sobra. Con $n$ códigos y $d$ distintos:

| Forma | Tiempo | Espacio | Por qué |
|---|---|---|---|
| `set` | $O(n \log d)$ | $\Theta(d)$ | $n$ inserciones en un árbol de a lo sumo $d$ claves |
| `sort` + `unique` | $\Theta(n \log n)$ | $\Theta(n)$ | copia los $n$, ordena y recorre una vez |
| `map<int, bool>` | $O(n \log d)$ | $\Theta(d)$ | el mismo árbol, con un `bool` de más en cada nodo |

Si todos los códigos llegan juntos y no cambian, `sort` y `unique` bastan. Si
llegan de a uno y entre llegada y llegada se pregunta si un código ya está, el
`set` responde en $O(\log d)$ sin reordenar nada.

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

## Ejercicios

### Colorear

El árbol de forma `30 15 10 20 45 40 35 50` (el 30 en la raíz con hijos 15 y
45; el 15 con hijos 10 y 20; el 45 con hijos 40 y 50; el 35 como hijo
izquierdo del 40) se pinta de tres formas: 15 y 45 rojos; 10, 20 y 45 rojos;
o solo el 35 rojo. En las tres, 30, 40 y 50 son negros y el 35 es rojo: el
camino `30 45 40 35` es el más largo y necesita un rojo, y el 40 no puede
serlo si su hijo 35 ya lo es.

### Insertar

En un rojinegro vacío se insertan `40 20 10 30 35`. El 40 y el 20 entran sin
arreglo. El 10 tiene tío `NIL` y está en línea a la izquierda: caso 3, rotar a
la derecha en el 40, y queda `20N 10R 40R`. El 30 tiene tío 10 rojo: caso 1,
el 20 queda rojo en la raíz y se pinta de negro. El 35 es hijo derecho del 30,
que es hijo izquierdo del 40, con tío `NIL`: en ángulo, caso 2. Se rota a la
izquierda en el 30 y, como caso 3, 35 a negro, 40 a rojo y rotación a la
derecha en el 40. Queda `20N 10N 35N 30R 40R`.

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

### El más cercano

`masCercano(s, x)` devuelve la clave más cercana a $x$ y, si dos empatan, la
menor. Es `lower_bound(x)`, la primera $\ge x$, o la que está justo antes.

```cpp
// La clave mas cercana a x; si empatan dos, la menor. s no vacio.
int masCercano(set<int> &s, int x) {
  assert(!s.empty());
  set<int>::iterator techo = s.lower_bound(x);   // la primera >= x
  set<int>::iterator piso = techo;               // la de antes
  int res;
  if (techo == s.begin()) {
    res = *techo;
  } else {
    --piso;
    if (techo == s.end() || x - *piso <= *techo - x) {
      res = *piso;
    } else {
      res = *techo;
    }
  }
  return res;
}
```

Si la primera $\ge x$ es la menor de todas, no hay anterior; si no hay ninguna
$\ge x$, gana la anterior, que es la mayor. El `||` deja de evaluar en cuanto
`techo` es `end()`, antes de leer `*techo`. Con el mismo `s` da 22 para 26
(el 22 y el 30 quedan a 4 y gana el menor), 9 para 12, 4 para 1 y 57 para 99.
$O(\log n)$: una bajada y un retroceso del iterador.

## Para practicar en casa

### Propuesto 1: seguir la traza

Continuar la traza de los pedidos con 90 y 100: cuántas rotaciones pide cada
uno y qué altura queda. *Pista:* el 90 cae en el caso 3, con una rotación. El
100 cae dos veces seguidas en el caso 1, que sube hasta la raíz sin rotar. La
altura queda en 4.

### Propuesto 2: de mayor a menor

Insertar `80 70 60 50 40 30 20 10` en un rojinegro vacío y comparar con la
traza creciente. *Pista:* es la misma traza reflejada; cada rotación a la
izquierda se vuelve a la derecha, y la forma final es el espejo.

### Propuesto 3: ¿rojinegro o no?

Dibujar un ABB de cuatro nodos que no se pueda colorear como rojinegro y decir
por qué. *Pista:* con cuatro nodos en lista no hay forma. El camino más largo
tiene 4 nodos y el más corto, 1, y $4 > 2 \cdot 1$ sin importar los colores.

### Propuesto 4: altura negra

Encontrar el rojinegro con menos nodos cuya raíz tiene altura negra 3, y el
que tiene más. *Pista:* el más chico es el árbol perfecto todo negro de 7
nodos. El más grande alterna niveles negros y rojos bajo una raíz negra: seis
niveles llenos, 63 nodos.

### Propuesto 5: borrar los menores

Con un `set`, quitar de una vez todas las claves menores que $x$, sin un
ciclo. *Pista:* `erase(desde, hasta)` con `begin()` y `lower_bound(x)`,
$O(\log n + m)$.

### Propuesto 6: solo en uno

Dadas dos listas de códigos, imprimir en orden los que están en una sola de
las dos. *Pista:* se recorren los dos `set` y se imprime cada clave cuyo
`count` en el otro es 0, o se cuenta en un `map` cuántas listas la traen.
$O((n_1 + n_2) \log n)$.

### Propuesto 7: los k menores

Imprimir los $k$ valores distintos más pequeños de una lista, con el ciclo
detenido por su condición. *Pista:* se insertan todos en un `set` y se recorre
con un contador; la condición del `while` pide que el iterador no sea `end()`
y que el contador no llegue a $k$.

### Propuesto 8: siguiente libre

Un `set` guarda los casilleros ocupados; para un $x$ dado, imprimir el menor
casillero libre $\ge x$. *Pista:* se empieza en $x$ y se avanza mientras el
casillero esté. Con `lower_bound(x)` y el iterador se camina por las claves
seguidas $x, x + 1, \ldots$ sin volver a buscar.

### Ejercicio de cierre

Construir, con la menor cantidad de nodos posible, un rojinegro donde un
camino de la raíz a un `NIL` tenga el doble de nodos internos que otro, y dar
una secuencia de inserciones que lo produzca.

## Para el juez

Cada solución lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uva10815.in`.

### UVa 10815, Andy's First Dictionary

*UVa 10815, Andy's First Dictionary*:
<https://onlinejudge.org/external/108/10815.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1756>.

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

### UVa 11849, CD

*UVa 11849, CD*: <https://onlinejudge.org/external/118/11849.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2949>.

Los discos de Jack entran a un `set<int>` y cada uno de Jill suma su `count`.

Jack tiene $N$ discos y Jill $M$, con $N, M \le 10^6$ y a lo sumo una copia de
cada título. Llegan los números de catálogo de Jack en orden creciente y
después los de Jill, también en orden, enteros positivos hasta $10^9$, y se
imprime cuántos títulos tienen los dos. La entrada trae varios casos y termina
con `0 0`. Con Jack `1 2 3` y Jill `1 2 4` la salida es `2`. Cuesta
$O((N + M) \log N)$ y $\Theta(N)$ de espacio; con $10^6$ y $10^6$ tardó 1,19
segundos sin optimizar, en el equipo donde se preparó la sesión.

!!! warning "Las trampas"

    - $N$ y $M$ pueden ser 0 por separado, y la entrada termina solo cuando los
      dos lo son: `while (n != 0 || m != 0)`. Un caso `0 2` imprime 0 y no es
      el final.
    - Hasta dos millones de números por caso: se leen con `scanf`.
    - Las dos listas llegan ordenadas. Dos índices que avanzan a la vez, como
      al mezclar, cuentan los comunes en $\Theta(N + M)$ sin guardar nada; el
      `set` funciona, pero no aprovecha ese orden.

Solución: [uva11849.cpp](./codigo/uva11849.cpp), [entrada](./codigo/uva11849.in),
[salida](./codigo/uva11849.out).

## Lo que se vio

- Un ABB que recibe claves en orden degenera en lista, y reconstruirlo
  balanceado tras cada inserción cuesta $\Theta(n)$.
- Un árbol rojinegro pinta cada nodo de rojo o de negro con cinco reglas: raíz
  y hojas `NIL` negras, ningún rojo con hijo rojo y la misma cantidad de negros
  en todo camino hacia abajo, y así la altura queda en
  $h \le 2 \log_2(n + 1)$.
- Una rotación sube un nodo cambiando tres enlaces, en $O(1)$, y conserva el
  inorden.
- Insertar baja como en el ABB, pinta de rojo y repara hacia arriba según el
  tío: si es rojo, se recolorea y se sube; si es negro, una o dos rotaciones.
  Borrar usa las mismas herramientas, y todo cuesta $O(\log n)$.
- `map` y `set` son un rojinegro, y por eso cuestan $O(\log n)$ y su recorrido
  es el inorden. `set` guarda claves distintas en orden, y `lower_bound` y
  `upper_bound` encuentran la primera clave $\ge x$ o $> x$ en $O(\log n)$.

## Ejercicios interactivos

Las actividades para trabajar en el navegador, ordenadas por los temas de la
sesión, están en la [página de ejercicios](./Ejercicios.md). Las claves y los
árboles no son los de la sesión: mismo tema, ronda nueva.

## Lo que sigue

Los montículos (CLRS, cap. 6) y la cola de prioridad: sacar siempre el mayor,
o el menor, en $O(\log n)$ con un árbol guardado en un arreglo.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [arbol_binario.h](./codigo/arbol_binario.h),
  [pila_arbol.h](./codigo/pila_arbol.h) y [abb.h](./codigo/abb.h): el árbol
  binario y el ABB de los temas anteriores, que `medir_set.cpp` incluye.
- [uso_set.cpp](./codigo/uso_set.cpp): `insert`, `count`, `find`, `erase`,
  `begin`, `lower_bound` y `upper_bound` sobre la lista de asistencia, con
  [salida](./codigo/uso_set.out).
- [distintos.cpp](./codigo/distintos.cpp): los códigos distintos con `set`,
  con `sort` y `unique` y con `map<int, bool>`, con
  [salida](./codigo/distintos.out).
- [medir_set.cpp](./codigo/medir_set.cpp): claves en orden en el ABB y en el
  `set`, con [salida](./codigo/medir_set.out).
- [ejercicios25.cpp](./codigo/ejercicios25.cpp): `contarRango`, `masCercano` y
  `borrarMenores`, con [salida](./codigo/ejercicios25.out).

Las soluciones de los problemas de juez están en la sección *Para el juez*, con
su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 13, árboles rojinegros: §13.1,
  propiedades y lema 13.1; §13.2, rotaciones; §13.3, inserción; §13.4, borrado.
- R. Thareja. *Data Structures Using C*, 2.ª ed. Oxford University Press, 2014.
  §10.5, *Red-Black Trees*, pp. 327-337; §10.5.1, propiedades, p. 328.
- GNU Project. *The GNU C++ Library* (libstdc++), archivo `bits/stl_tree.h`,
  clase `_Rb_tree`.
- UVa Online Judge. Problema 10815, *Andy's First Dictionary*:
  <https://onlinejudge.org/external/108/10815.pdf>.
- UVa Online Judge. Problema 11849, *CD*:
  <https://onlinejudge.org/external/118/11849.pdf>.
