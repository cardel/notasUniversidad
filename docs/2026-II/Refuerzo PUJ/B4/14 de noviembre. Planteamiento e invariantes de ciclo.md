# 14 de noviembre · Refuerzo PUJ

**Planteamiento e invariantes de ciclo.** Las tres horas de programación muestran
cómo se plantea la solución de un problema antes de escribir código: la bisección
sobre la respuesta para repartir textos entre empleados, el recorrido en amplitud
sobre una rejilla con zonas prohibidas y el recorrido en profundidad que pinta un
grafo con dos colores. La hora de lógica trabaja los invariantes de ciclo de
UVa 11078 y el ejercicio en papel de UVa 507.

## Diapositivas

### Programación

![](./Planteamiento.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de programación

Cada uno de los tres problemas resuelto paso a paso, con su traza y su costo.

![](./Soluciones-planteamiento.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de lógica

Los invariantes del ejercicio de UVa 507 con su traza y sus tres pasos.

![](./Soluciones-logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Problemas en clase

El código de los tres, en Python y en C++, está en la carpeta `codigo/`. Cada
problema cierra con su costo.

### Hora 1. Bisección sobre la respuesta: transcribir textos

Hay que repartir textos en orden entre *k* empleados, cada uno con un tramo seguido
de textos, de modo que el más cargado lleve el menor número posible de páginas. En
vez de buscar el reparto óptimo se pregunta si alcanza con un tope de *t* páginas
por empleado, y una pasada por los textos lo responde: el empleado actual recibe el
texto siguiente mientras quepa, y si no cabe entra otro empleado. Si *t* alcanza,
cualquier tope mayor también, y esa monotonía permite bisecar entre el texto más
largo y la suma de todos. La trampa está en la cota inferior: si `lo` arranca por
debajo del texto más largo, el programa responde un tope que ningún reparto cumple.

- Actividad: [repartir textos entre empleados](../../../actividades/ayg-puj/busqueda-binaria/turnos.html){ target=_blank rel=noopener }
- Código: [transcribir.py](./codigo/transcribir.py) y [transcribir.cpp](./codigo/transcribir.cpp)

Costo: con $n$ textos que suman $S$ páginas, cada comprobación da $n$ pasos y la
bisección corre $O(\log S)$ veces, así que el total es $O(n \log S)$.

### Hora 2. Amplitud sobre una rejilla con zonas prohibidas: el bosque

Se pide el menor número de pasos para cruzar una rejilla de la esquina superior
izquierda a la inferior derecha. Hay casillas bloqueadas y criaturas, cada una con
una posición y un radio, y no se puede pisar ninguna casilla dentro del radio de
una criatura. El peligro depende solo de las criaturas y no del camino, así que se
marca una vez antes del recorrido, y el recorrido en amplitud queda igual al de un
tablero con paredes. La trampa está en la zona: el enunciado dice *en cualquier
dirección*, y medir la distancia de una forma o de otra cambia qué casillas quedan
prohibidas y, con ellas, la respuesta.

- Actividad: [una rejilla con zonas prohibidas](../../../actividades/ayg-puj/grafos-implicitos/zonas.html){ target=_blank rel=noopener }
- Código: [bosque.py](./codigo/bosque.py) y [bosque.cpp](./codigo/bosque.cpp)

Costo: con una rejilla de $R \times C$, el recorrido visita cada casilla una vez y
mira cuatro vecinas, $O(RC)$. Marcar una criatura de radio $r$ revisa a lo más
$(2r + 1)^2$ casillas.

### Hora 3. Profundidad modificada: dos colores

Se decide si los nodos de un grafo se pueden pintar con dos colores de modo que
ninguna arista una dos nodos del mismo color. El recorrido en profundidad lleva el
color además de la marca de visitado: pintado el primer nodo, el color de cada
vecino queda forzado, y basta recorrer una vez y anotar si alguna arista une dos
nodos iguales. La trampa es que el grafo puede venir en varios pedazos, así que el
recorrido arranca desde cada nodo que siga sin color.

- Actividad: [dos colores](../../../actividades/ayg-puj/representaciones-y-recorridos/colores.html){ target=_blank rel=noopener }
- Código: [bipartito.py](./codigo/bipartito.py) y [bipartito.cpp](./codigo/bipartito.cpp)

Costo: con $V$ nodos y $A$ aristas, cada nodo se pinta una vez y cada lista de
vecinos se revisa una vez, $O(V + A)$.

## Lógica

Invariantes de ciclo escritos como fórmula y demostrados en tres pasos:
inicialización, estabilidad y terminación. El ciclo de partida es el de UVa 11078,
con las variables `mayor` y `mejor`, y el ejercicio en papel es el ciclo de UVa 507
sin el desempate. Las diapositivas y sus soluciones están arriba.

## Para seguir

Problemas propuestos para trabajar por cuenta propia. Cada solución va con su
costo y se envía al juez.

### Archivos de lectura

UVa 1203, UVa 10341, UVa 11413 y UVa 10810 tienen un fragmento con la lectura
de la entrada y un comentario donde va el algoritmo. Están en la carpeta
[codigo](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/Refuerzo%20PUJ/B4/codigo)
de esta sesión:

| Problema | Python | C++ |
|---|---|---|
| UVa 1203 | [lectura_1203.py](./codigo/lectura_1203.py) | [lectura_1203.cpp](./codigo/lectura_1203.cpp) |
| UVa 10341 | [lectura_10341.py](./codigo/lectura_10341.py) | [lectura_10341.cpp](./codigo/lectura_10341.cpp) |
| UVa 11413 | [lectura_11413.py](./codigo/lectura_11413.py) | [lectura_11413.cpp](./codigo/lectura_11413.cpp) |
| UVa 10810 | [lectura_10810.py](./codigo/lectura_10810.py) | [lectura_10810.cpp](./codigo/lectura_10810.cpp) |

El fragmento se copia dentro de un programa con sus `#include` y su `main` en C++,
o con `import sys` en Python, y se completa con la solución. La muestra del
enunciado va en `1.in` y su salida en `1.out`, y `diff` compara:

```text
g++ -std=c++17 -Wall -Wextra solucion.cpp -o solucion
./solucion < 1.in > salida.out
diff salida.out 1.out
```

### Propuesto. UVa 1203, Argus

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-1203>

Cada consulta registrada responde a los $P$ segundos de registrarse y después
cada $P$ segundos, y se piden las primeras $K$ respuestas. La cola de prioridad
guarda un par por consulta, el instante de su próxima respuesta y su número. Sale
el menor par, y la consulta vuelve a entrar con el instante aumentado en su
periodo. El orden de los pares resuelve el desempate que pide el enunciado: si
dos consultas responden en el mismo instante, sale primero la de número menor.
Las trampas son de lectura. La primera respuesta llega a los $P$ segundos y no en
el instante 0, el registro termina en una línea con `#`, y $K$ llega a 10 000 con
a lo más 1000 consultas.

La entrada se lee así en C++:

```cpp
char palabra[10];
int num, p;
while (scanf("%s", palabra) == 1 && palabra[0] != '#') {
  scanf("%d %d", &num, &p);
  /* aquí va la inserción en la cola de prioridad */
}
int k;
scanf("%d", &k);
```

Costo: con $q$ consultas la cola nunca pasa de $q$ pares. Llenarla son $q$
inserciones, y el ciclo de salida corre $K$ veces con una extracción y una
inserción, de modo que el total es $O((q + K) \log q)$.

### Propuesto. UVa 10341, Solve It

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-10341>
- Actividad: [resolver un problema de juez](../../../actividades/ayg-puj/busqueda-binaria/resolver.html){ target=_blank rel=noopener }

Dados seis enteros con $0 \leq p, r \leq 20$ y $-20 \leq q, s, t \leq 0$, se
busca $x$ en $[0,1]$ con
$p e^{-x} + q \sin x + r \cos x + s \tan x + t x^2 + u = 0$, con cuatro
decimales, o `No solution` si no hay.

Aquí la función viene dada y lo que queda es comprobarle dos cosas. La monotonía
sale de derivar: cada sumando de
$f'(x) = -p e^{-x} + q \cos x - r \sin x + s \sec^2 x + 2tx$ es menor o igual
que cero en $[0,1]$ por los rangos del enunciado, así que $f$ no crece y hay a
lo sumo una raíz. Y los extremos deciden si existe: hay raíz exactamente cuando
$f(0) \geq 0 \geq f(1)$. Esa es la trampa, porque sin esa comprobación el ciclo
igual termina y devuelve un número que no es raíz de nada. Cien vueltas dejan el
intervalo en $2^{-100}$ del original.

La entrada se lee así en C++, y comparar contra seis detecta el fin del archivo:

```cpp
int p, q, r, s, t, u;
while (scanf("%d %d %d %d %d %d", &p, &q, &r, &s, &t, &u) == 6) {
  /* resolver este caso */
}
```

Costo: cien evaluaciones por caso, o sea constante; con hasta 2100 líneas de
entrada el total es lineal en la cantidad de casos.

### Propuesto. UVa 11413, Fill the Containers

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-11413>

Los recipientes de la banda se vacían en orden en $m$ contenedores, cada
recipiente entero en uno solo, y se pide la menor capacidad posible del contenedor
más grande. Aquí la función hay que encontrarla: en vez de buscar el óptimo se
pregunta si alcanza con capacidad $t$. Un recorrido voraz lo responde. Llena el
contenedor actual mientras quepa el recipiente siguiente, abre otro cuando no cabe,
y $t$ alcanza si usa a lo más $m$. Si $t$ alcanza, cualquier capacidad mayor
también, y esa monotonía permite bisecar entre el recipiente más grande y la suma
de todos. La trampa está en los rangos: $m$ llega a $10^6$ con a lo más 1000
recipientes, así que pueden sobrar contenedores, y la cota inferior es el recipiente
más grande porque ninguno se divide.

La entrada trae varios casos hasta el fin del archivo:

```cpp
int n, m;
while (scanf("%d %d", &n, &m) == 2) {
  vector<int> c(n);
  for (int i = 0; i < n; i++) {
    scanf("%d", &c[i]);
  }
  /* aquí va la bisección */
}
```

Costo: con $n$ recipientes que suman $S$, el recorrido voraz da $n$ pasos y la
bisección sobre $[\max, S]$ corre $O(\log S)$ veces, así que el total es
$O(n \log S)$ y no depende de $m$.

### Propuesto. UVa 10810, Ultra-QuickSort

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-10810>
- Actividad: [contar parejas fuera de orden](../../../actividades/ayg-puj/recursion/inversiones.html){ target=_blank rel=noopener }

Dada una lista de $n < 500\,000$ enteros distintos, se pide cuántos
intercambios de elementos vecinos hacen falta para dejarla ordenada. Como cada
intercambio arregla exactamente una pareja fuera de orden, lo que se pide es el
número de parejas $(i,j)$ con $i<j$ y $a_i > a_j$, y contarlas una por una
cuesta $\Theta(n^2)$.

Las parejas de un tramo se reparten en tres clases: las dos puntas en la mitad
izquierda, las dos en la derecha, y una en cada mitad. Las dos primeras son el
mismo problema sobre la mitad del tamaño, y ahí está la recursión; el caso base
es un tramo de un elemento. La tercera se cuenta mientras se mezclan las dos
mitades ya ordenadas: cuando sale un elemento de la derecha, todos los que
siguen pendientes en la izquierda son mayores que él. Que las mitades queden
ordenadas es lo que permite contar esa clase en una sola pasada.

La entrada se lee así en C++, con el auxiliar reservado una vez por caso:

```cpp
int n;
while (scanf("%d", &n) == 1 && n != 0) {
  vector<int> a(n), aux(n);
  for (int i = 0; i < n; i++) {
    scanf("%d", &a[i]);
  }
}
```

Costo: hay $\log_2 n$ niveles de llamadas y en cada uno la mezcla mueve los $n$
elementos una vez, de modo que el total es $\Theta(n \log n)$. El contador va
en `long long`, porque en el peor caso la respuesta llega al orden de $10^{11}$.
Medido con $n = 499\,999$, la versión de C++ tarda 0,20 s y la de Python 5,1 s,
así que al juez se envía la de C++.

### Propuesto. UVa 10954, Add All

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-10954>

Cada suma cuesta lo que suman sus dos operandos, así que conviene sumar siempre
los dos menores. La cola de prioridad entrega esos dos en tiempo logarítmico y
recibe de vuelta el resultado, que vuelve a competir con los demás; por eso ordenar
una vez y sumar en fila no alcanza. La trampa es el acumulado: con $N = 5000$
números iguales a 99 999 el costo mínimo pasa de $6 \times 10^9$, más de lo que
cabe en 32 bits.

```cpp
int n;
while (scanf("%d", &n) == 1 && n != 0) {
  for (int i = 0; i < n; i++) {
    int x;
    scanf("%d", &x);
  }
}
```

Costo: el ciclo corre $N - 1$ veces, con dos extracciones y una inserción en
$O(\log N)$ cada una, $O(N \log N)$.

### Propuesto. UVa 10611, The Playboy Chimp

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-10611>

Las $N$ alturas llegan en orden no decreciente, y para cada consulta $q$ se pide la
más alta menor que $q$ y la más baja mayor que $q$. Dos búsquedas binarias dan los
bordes: la primera posición con altura $\geq q$ y la primera con altura $> q$. Cada
condición es falsa en un prefijo del arreglo y verdadera en el resto, y eso es lo
que permite buscar así. La trampa son los repetidos y los bordes: una altura igual
a $q$ no sirve para ninguna de las dos, y cuando una de las dos no existe se imprime
una `X` mayúscula en su lugar. La entrada trae un solo caso.

```cpp
int n, q;
scanf("%d", &n);
vector<int> h(n);
for (int i = 0; i < n; i++) {
  scanf("%d", &h[i]);
}
scanf("%d", &q);
for (int i = 0; i < q; i++) {
  int consulta;
  scanf("%d", &consulta);
}
```

Costo: cada búsqueda parte el rango a la mitad en cada vuelta, $O(N + Q \log N)$ con
la lectura. Recorrer el arreglo en cada consulta es $O(NQ)$, unos
$1{,}25 \times 10^9$ pasos con $N = 50\,000$ y $Q = 25\,000$.

### Propuesto. UVa 11624, Fire!

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-11624>

Joe y el fuego avanzan una casilla por minuto, en vertical o en horizontal, y Joe
sale por cualquier casilla del borde. El parámetro son las $R \times C$ casillas,
con $R, C \leq 1000$. Lo resuelven dos recorridos en amplitud. El primero arranca
con todas las casillas `F` en la cola, con distancia 0, y da el minuto en que el
fuego llega a cada casilla. El segundo parte de `J` y solo entra a una casilla si
llega antes que el fuego. La trampa principal es esa comparación, que es estricta:
en la segunda muestra Joe y el fuego llegan a la vez a las dos casillas libres, y
con $\leq$ saldría 2 en lugar de `IMPOSSIBLE`. El enunciado no asegura que haya
alguna `F`, y una casilla a la que el fuego nunca llega sigue libre para Joe, así
que la distancia $-1$ no puede entrar a la comparación sin más. La respuesta cuenta
el minuto de salir: es la distancia a la casilla del borde más uno, y Joe parado en
el borde responde 1.

```cpp
int casos;
scanf("%d", &casos);
for (int caso = 0; caso < casos; caso++) {
  int r, c;
  scanf("%d %d", &r, &c);
  vector<vector<char> > mapa(r, vector<char>(c));
  for (int i = 0; i < r; i++) {
    for (int j = 0; j < c; j++) {
      scanf(" %c", &mapa[i][j]);
    }
  }
}
```

El espacio antes de `%c` se salta el salto de línea.

Costo: cada recorrido visita cada casilla una vez y mira cuatro vecinas, $O(RC)$
por caso, con hasta $10^6$ casillas.

### Propuesto. UVa 924, Spreading the News

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-924>

Cada empleado cuenta la noticia a sus amigos al día siguiente de enterarse, y se
pide el día en que más empleados se enteran por primera vez y cuántos son. El día
en que un empleado se entera es su distancia a la fuente en el grafo de amistades,
y el recorrido en amplitud asigna esas distancias por niveles: basta contar cuántos
quedan en cada nivel. La red se lee una vez y sirve para todos los casos, así que
las distancias se reinician con cada fuente. Las trampas son tres: los amigos de la
fuente se enteran el día 1, ante un empate en el tamaño gana el primer día, y si
nadie más que la fuente se entera la salida es un solo `0`.

```cpp
int e;
scanf("%d", &e);
vector<vector<int> > amigos(e);
for (int i = 0; i < e; i++) {
  int n;
  scanf("%d", &n);
  for (int j = 0; j < n; j++) {
    int a;
    scanf("%d", &a);
    amigos[i].push_back(a);
  }
}
int t;
scanf("%d", &t);
for (int caso = 0; caso < t; caso++) {
  int fuente;
  scanf("%d", &fuente);
  /* aquí va el recorrido en amplitud */
}
```

Costo: con $V$ empleados y $A$ amistades, el recorrido saca de la cola a cada
empleado una vez y revisa una vez los amigos de cada uno, $O(V + A)$ por fuente y
$O(T\,(V + A))$ con $T$ fuentes.

### Material de la sesión

- [Soluciones](./Soluciones.md) de UVa 1203, UVa 10341, UVa 11413 y UVa 10810, con
  la idea, la complejidad y el código en Python y C++.
- [Ejercicios interactivos](./Ejercicios.md) sobre bisección, recorridos en
  rejillas y en grafos, colas de prioridad y dividir y vencerás.
