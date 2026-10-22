# Grafos de estado: The New Villa · AyG C14

**Viernes 23 de octubre de 2026, de 7:00 a 9:00, grupo B.**

Cuando todas las aristas cuestan $1$, la búsqueda en amplitud desde la fuente
da la distancia a cada vértice (CLRS, Sección 22.2, Teorema 22.5). Para usarla
hace falta saber, desde cada vértice, a cuáles se llega en un paso. En
*The New Villa* la entrada trae habitaciones y puertas, y eso parece un grafo.
¿Es ese el grafo sobre el que se busca? Y si no lo es, ¿cuáles son sus
vértices? La sesión responde con un grafo cuyos vértices son estados, lo
dibuja por capas sobre la villa del enunciado y lo recorre con una
implementación en C++ que guarda las luces en un entero.

Al terminar la sesión se espera poder:

- Decir qué guarda un estado de *The New Villa* y por qué la habitación sola
  no alcanza.
- Escribir cada transición con la condición que la permite y el estado al
  que lleva.
- Dibujar las primeras capas de un grafo de estados desde el estado inicial.
- Guardar un conjunto de luces en un entero y operar con él usando `1 << i`,
  `&` y `^`.
- Leer una implementación en C++ con `struct`, `map` con comparador y
  búsqueda en amplitud, y seguirla en una tabla.

## Diapositivas

[clase14-grafos-de-estado.pdf](./clase14-grafos-de-estado.pdf){ target=_blank rel=noopener },
76 páginas. La villa del enunciado aparece dibujada con sus puertas y sus
interruptores, y su grafo de estados se construye capa por capa, primero con
los conjuntos de luces y después con las máscaras.

## El problema

### UVa 321, The New Villa

El enunciado está en <https://onlinejudge.org/external/3/321.pdf> y el envío
se hace en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=257>.

Una casa tiene $r \leq 10$ habitaciones: la $1$ es el hall y la $r$ el
dormitorio. Hay puertas entre habitaciones e interruptores mal conectados,
de modo que un interruptor de la habitación $k$ prende o apaga la luz de la
habitación $l$. Al llegar, solo la luz del hall está prendida. El señor Black
nunca entra a una habitación oscura ni apaga la luz de la habitación donde
está. Tiene que llegar al dormitorio y dejar prendida solo esa luz, en el
menor número de pasos; moverse, prender y apagar cuentan uno cada uno.

La entrada trae varias villas. Cada una empieza con $r$, $d$ y $s$, y siguen
$d$ líneas con una puerta `i j` y $s$ líneas con un interruptor `k l`. La
entrada termina con `0 0 0`. Por cada villa se imprime `Villa #k` y, si hay
solución, el número de pasos y los pasos, uno por línea; si no la hay,
`The problem cannot be solved.`

La villa 1 del enunciado tiene $r = 3$, puertas entre $1$ y $2$, entre $1$ y
$3$ y entre $3$ y $2$, e interruptores $1 \to 2$, $1 \to 3$, $2 \to 1$ y
$3 \to 2$. Cada interruptor se escribe de la habitación donde está a la luz
que controla.

### La solución del enunciado, paso a paso

| Paso | Acción | Está en | Luces |
|---|---|---|---|
| $0$ | | $1$ | $\{1\}$ |
| $1$ | prende 2 | $1$ | $\{1,2\}$ |
| $2$ | prende 3 | $1$ | $\{1,2,3\}$ |
| $3$ | a 2 | $2$ | $\{1,2,3\}$ |
| $4$ | apaga 1 | $2$ | $\{2,3\}$ |
| $5$ | a 3 | $3$ | $\{2,3\}$ |
| $6$ | apaga 2 | $3$ | $\{3\}$ |

La puerta entre $1$ y $3$ lleva al dormitorio en un paso, y aun así la
solución tarda seis. Al empezar, la habitación $3$ está oscura y no se puede
entrar. Además hay que apagar la luz $1$, cuyo único interruptor está en la
habitación $2$: el camino pasa por $2$ antes de terminar en $3$, y para entrar
a $2$ hay que prender su luz.

¿Y por qué no se apaga la luz $1$ en el paso $1$? En la habitación $1$ no hay
interruptor de la luz $1$, y aunque lo hubiera, el señor Black no apaga la luz
del cuarto donde está.

## Por qué el grafo de habitaciones no basta

Las puertas forman un grafo de tres vértices. Una búsqueda en amplitud desde
$1$ sobre ese grafo responde que el dormitorio está a un paso, y es falso: la
habitación $3$ está oscura. Tampoco puede expresar *prender una luz*, porque
ese paso no cambia de habitación.

En la solución, el señor Black pasa los pasos $0$, $1$ y $2$ en la habitación
$1$. Con solo la luz $1$ no tiene a dónde ir; con las luces $1$ y $2$ puede
pasar a $2$; con las tres, a $2$ o a $3$. Una búsqueda que marca la
habitación $1$ como visitada no vuelve a mirarla con otras luces. Lo que se
puede hacer depende de la habitación *y* de las luces, así que los vértices
del grafo tienen que guardar las dos cosas.

## Los estados

**Definición.** Un estado es un par $(h, L)$: la habitación $h$ donde está el
señor Black y el conjunto $L$ de luces prendidas. El grafo de estados tiene
una arista de un estado a otro si un paso permitido lleva del primero al
segundo. El inicio es $(1, \{1\})$ y la meta $(r, \{r\})$.

¿Cuántos estados hay? Son $r$ habitaciones por $2^r$ conjuntos de luces. En la
villa 1, $3 \cdot 2^3 = 24$; con $r = 10$, $10 \cdot 1024 = 10\,240$. La
búsqueda solo visita los que se alcanzan desde el inicio, y en la villa 1 son
$12$.

En todo estado $(h, L)$ al que se llega desde el inicio se cumple $h \in L$.
Se empieza con $1 \in \{1\}$, solo se entra a habitaciones con luz y nunca se
apaga la propia. La demostración es el ejercicio 4.

## Las transiciones

| Transición | Condición | Estado nuevo |
|---|---|---|
| Moverse a $j$ | hay una puerta entre $h$ y $j$, y $j \in L$ | $(j, L)$ |
| Prender $l$ | hay un interruptor en $h$ que controla $l$, y $l \notin L$ | $(h, L \cup \{l\})$ |
| Apagar $l$ | hay un interruptor en $h$ que controla $l$, $l \in L$ y $l \neq h$ | $(h, L \setminus \{l\})$ |

Las tres cuestan un paso. Moverse cambia la habitación y deja las luces;
prender y apagar dejan la habitación y cambian una sola luz. Como $h \in L$,
prender $h$ nunca es posible y apagarla está prohibido, de modo que en las dos
se exige $l \neq h$.

### Los sucesores de un estado

En la villa 1, ¿a qué estados se llega en un paso desde $(1, \{1,2\})$? Hay
tres:

- Moverse a $2$, porque hay puerta entre $1$ y $2$ y $2 \in \{1,2\}$. Lleva a
  $(2, \{1,2\})$.
- Prender $3$ con el interruptor $1 \to 3$, porque $3 \notin \{1,2\}$. Lleva
  a $(1, \{1,2,3\})$.
- Apagar $2$ con el interruptor $1 \to 2$, porque $2 \in \{1,2\}$ y
  $2 \neq 1$. Lleva a $(1, \{1\})$, el inicio.

Moverse a $3$ no se puede, porque $3 \notin \{1,2\}$.

Apagar $2$ deshace el *prender 2* que llevó del inicio a $(1,\{1,2\})$, y eso
pasa con toda transición. Un interruptor se acciona otra vez desde la misma
habitación, y para devolverse por una puerta basta que la habitación de
origen tenga luz, cosa que se cumple porque $h \in L$.

## Una parte del grafo de estados

El grafo se dibuja por capas. Primero van los estados a un paso del inicio,
después los nuevos a dos pasos, y así. Cada arista lleva la acción, y un
estado que ya está dibujado no se dibuja otra vez: la arista llega al que ya
está. Es lo que se pide en el parcial sobre grafos de estado.

En la villa 1, desde A solo hay interruptores, prender $2$ y prender $3$,
porque las dos puertas de $1$ dan a habitaciones oscuras. De B salen D y E, y
vuelve a A. De C sale F, y prender $2$ desde C lleva a E, que ya estaba. De D
sale G al apagar la luz $1$ en la habitación $2$; de E salen H e I por las dos
puertas, y F no descubre nada: vuelve a C y llega a I, que ya estaba. Ninguno
de la capa 3 es la meta $(3, \{3\})$.

La tabla trae los $12$ estados que se alcanzan desde A, con las letras en el
orden en que la búsqueda los descubre, y la arista por la que se dibuja cada
uno.

| $d$ | Estado | $(h, L)$ | Máscara | Llega desde | Acción |
|---|---|---|---|---|---|
| $0$ | A | $(1,\{1\})$ | `001` | | |
| $1$ | B | $(1,\{1,2\})$ | `011` | A | prende 2 |
| $1$ | C | $(1,\{1,3\})$ | `101` | A | prende 3 |
| $2$ | D | $(2,\{1,2\})$ | `011` | B | a 2 |
| $2$ | E | $(1,\{1,2,3\})$ | `111` | B | prende 3 |
| $2$ | F | $(3,\{1,3\})$ | `101` | C | a 3 |
| $3$ | G | $(2,\{2\})$ | `010` | D | apaga 1 |
| $3$ | H | $(2,\{1,2,3\})$ | `111` | E | a 2 |
| $3$ | I | $(3,\{1,2,3\})$ | `111` | E | a 3 |
| $4$ | J | $(2,\{2,3\})$ | `110` | H | apaga 1 |
| $5$ | K | $(3,\{2,3\})$ | `110` | J | a 3 |
| $6$ | L | $(3,\{3\})$ | `100` | K | apaga 2 |

Hay tres aristas más que llegan a un estado que ya estaba dibujado: de C a E
por prender $2$, de F a I por prender $2$ y de H a I por moverse a $3$. Las
aristas de vuelta, como de B a A, no se dibujan. El camino A, B, E, H, J, K,
L tiene $6$ pasos y es el mismo del enunciado.

Todos los pasos cuestan $1$, así que la búsqueda en amplitud desde A da el
camino con menos pasos.

## Máscaras de bits

### Un conjunto de luces como un entero

Con $r$ luces, el conjunto $L$ se escribe con $r$ bits: el bit $i-1$ vale $1$
si la luz de la habitación $i$ está prendida.

| | Habitación $3$ | Habitación $2$ | Habitación $1$ | Entero |
|---|---|---|---|---|
| Bit | $2$ | $1$ | $0$ | |
| Vale | $4$ | $2$ | $1$ | |
| $\{1\}$ | $0$ | $0$ | $1$ | $1$ |
| $\{1,3\}$ | $1$ | $0$ | $1$ | $4 + 1 = 5$ |
| $\{2,3\}$ | $1$ | $1$ | $0$ | $4 + 2 = 6$ |
| $\{3\}$ | $1$ | $0$ | $0$ | $4$ |

¿Qué conjunto es el entero $3$? Es `011`, el conjunto $\{1, 2\}$. Con $r = 3$
hay $2^3 = 8$ conjuntos, del $0$ = `000`, todo apagado, al $7$ = `111`, todo
prendido.

Así un estado queda como dos enteros, la habitación y la máscara. El inicio de
la villa 1 es $(1, 1)$ y la meta $(3, 4)$, y comparar dos estados es comparar
dos enteros.

### Crear la máscara de una luz: `1 << i`

`1 << i` corre el $1$ `i` posiciones a la izquierda y deja un entero con un
solo bit prendido, el bit `i`.

| `i` | `1 << i` | Decimal | Máscara de la luz |
|---|---|---|---|
| $0$ | `001` | $1$ | $1$ |
| $1$ | `010` | $2$ | $2$ |
| $2$ | `100` | $4$ | $3$ |

La luz de la habitación $i$ está en el bit $i - 1$, y su máscara es
`1 << (i - 1)`. La meta, con solo la luz $r$, es `1 << (r - 1)`; con $r = 3$
vale $4$. En C++ la resta va antes que `<<`, así que `1 << i - 1` es
`1 << (i - 1)`, y el código de la clase lo escribe sin paréntesis.

### ¿Está prendida? El `&`

| $a$ | $b$ | $a$ `&` $b$ |
|---|---|---|
| $0$ | $0$ | $0$ |
| $0$ | $1$ | $0$ |
| $1$ | $0$ | $0$ |
| $1$ | $1$ | $1$ |

`L & m` hace el *y* de cada par de bits. Si `m` tiene un solo bit prendido, el
resultado es `m` cuando ese bit está en `L`, y $0$ cuando no. Con
$L = \{1,3\}$ = `101` $= 5$:

```text
  ¿Luz 3?     ¿Luz 2?
    101         101
  & 100       & 010
  -----       -----
    100 = 4     000 = 0
  prendida    apagada
```

Para la luz $3$, `L & (1 << 2)` dio $4$. ¿Está bien escribir la condición como
`(L & (1 << i - 1)) == 1`? No. El resultado es la máscara de la luz, $1$, $2$
o $4$, y no $1$: con la luz $3$ prendida la comparación da falso. La condición
correcta es `!= 0`.

### Prender o apagar: el `^`

| $a$ | $b$ | $a \oplus b$ |
|---|---|---|
| $0$ | $0$ | $0$ |
| $0$ | $1$ | $1$ |
| $1$ | $0$ | $1$ |
| $1$ | $1$ | $0$ |

`L ^ m` invierte los bits de `L` donde `m` tiene un $1$ y deja los demás. Con
la máscara de una luz, cambia solo esa luz: la prende si estaba apagada y la
apaga si estaba prendida. En la villa 1:

```text
  Prender 2 desde (1, 101)    Apagar 1 desde (2, 111)
    101                         111
  ^ 010                       ^ 001
  -----                       -----
    111 = 7                     110 = 6
```

Después de `nuevo = L ^ (1 << i - 1)`, ¿cómo se sabe si la luz $i$ se prendió
o se apagó sin mirar el bit? Comparando los enteros. Si el bit $i-1$ pasó de
$0$ a $1$, el número sube en $2^{i-1}$; si pasó de $1$ a $0$, baja en lo
mismo. Se prendió si `nuevo > L`: $7 > 5$ al prender $2$, y $6 < 7$ al apagar
$1$.

En el grafo de estados con máscaras, cada arista de *prende* o *apaga* cambia
un solo bit, y cada *a $j$* deja la máscara y exige el bit $j-1$ en $1$. La
columna Máscara de la tabla de capas lo muestra.

## La implementación

### La idea

Un estado es un `struct` con la habitación, la máscara de luces y la lista de
pasos que llevó hasta él. Un `map` guarda la distancia de cada estado
descubierto, y las puertas y los interruptores van en dos matrices de
booleanos. La búsqueda en amplitud empieza en $(1, 1)$ y para cuando saca de
la cola la meta $(r, 2^{r-1})$. En pseudocódigo:

```text
dist[(1,1)] = 0; meter (1,1) a la cola
mientras no se ha encontrado la meta y la cola no está vacía
    sacar curr; si es la meta, guardarla
    si no, para cada sucesor que no está en dist:
        dist[sucesor] = dist[curr] + 1; meterlo a la cola
imprimir los pasos de la meta, o que no hay solución
```

### El código completo

[321-new-villa.cpp](./codigo/321-new-villa.cpp) es el código del titular. Los
números de línea son los que citan las diapositivas y el resto de la nota.

```cpp linenums="1"
/*
The New Villa
https://uva.onlinejudge.org/external/3/321.pdf

BFS - State Space

*/

#include <cstdio>
#include <iostream>
#include <math.h>
#include <string>
#include <vector>
#include <queue>
#include <map>
#include <algorithm>

using namespace std;

struct step{
  string desc; // can be on, off and move
  int room;

  step(string d, int h){
    desc = d;
    room = h;
  }
};

struct state{
  int pos, light;
  vector<step> steps;

  state(){}

  state(int p, int c){
    pos = p;
    light = c;
    steps = vector<step>();
  }

  state(int p, int c, vector<step> &pa){
    pos = p;
    light = c;
    steps = pa;
  }
};

struct classcomp{
  bool operator() (const state& est1, const state& est2) const{
 bool ans = true;
 if(est1.pos != est2.pos)
   ans = est1.pos < est2.pos;
 else
   ans = est1.light < est2.light;
 return ans;
}
};

map<state, int, classcomp> dist;
bool roomAdj[11][11], lightAdj[11][11];

void solve(int r, int s, int d, int caso){
  int i, obj = 1 << r - 1;
  queue<state> q;
  state est(1, 1), curr, res;
  bool flag = false;
  dist[est] = 0;
  q.push(est);

  while(!flag && !q.empty()){
    curr = q.front();
    q.pop();

    if(curr.pos == r && obj == curr.light){
      res = curr;
      flag = true;
    }
    else{
      // verificar posibilidades de desplazarse a otra habitación
      for(i = 1; i <= r; i++){
	// se verifica que haya un pasillo hacía la habitación i y que la luz en esa roomitación esté
	// encendida
	if(roomAdj[curr.pos][i] && (curr.light & (1 << i - 1)) != 0){
	  est = state(i, curr.light, curr.steps);
	  est.steps.push_back(step("move", i));

	  if(dist.find(est) == dist.end()){
	    q.push(est);
	    dist[est] = dist[curr] + 1;
	  }
	}
      }

      // verificar posibilidades de encender o apagar una luz en otra habitación
      for(i = 1; i <= r; i++){
	// se verifica que haya un switch que permita encencer la luz de la habitación i
	// y que no sea la misma habitación en la que se está ubicado
	if(lightAdj[curr.pos][i] && i != curr.pos){
	  est = state(curr.pos, (curr.light ^ (1 << i - 1)), curr.steps);
	  est.steps.push_back(step((est.light > curr.light) ? "on" : "off", i));

	  if(dist.find(est) == dist.end()){
	    q.push(est);
	    dist[est] = dist[curr] + 1;
	  }
	}
      }
    }
  }

  printf("Villa #%d\n", caso);

  if(flag){
    printf("The problem can be solved in %d steps:\n", dist[res]);
    for(vector<step>::iterator itAux = res.steps.begin(); itAux != res.steps.end(); itAux++){
      if(itAux->desc == "on")
	printf("- Switch on light in room %d.\n", itAux->room);
      else if(itAux->desc == "off")
	printf("- Switch off light in room %d.\n", itAux->room);
      else
	printf("- Move to room %d.\n", itAux->room);
    }
  }
  else
    printf("The problem cannot be solved.\n");
  printf("\n");
}

int main(){
  int r, d, s, i, j, ini, fin, caso = 1;

  cin >> r >> d >> s;

  while(r != 0 || d != 0 || s != 0){
    for(i = 0; i < 11; i++){
      for(j = 0; j < 11; j++){
	roomAdj[i][j] = lightAdj[i][j] = false;
      }
    }
    dist.clear();

    for(i = 0; i < d; i++){
      cin >> ini >> fin;
      roomAdj[ini][fin] = roomAdj[fin][ini] = true;
    }

    for(i = 0; i < s; i++){
      cin >> ini >> fin;
      lightAdj[ini][fin] = true;
    }

    solve(r, d, s, caso);
    ++caso;
    cin >> r >> d >> s;
  }

  return 0;
}
```

### Un paso

```cpp linenums="20"
struct step{
  string desc; // can be on, off and move
  int room;

  step(string d, int h){
    desc = d;
    room = h;
  }
};
```

Las líneas 21 y 22 guardan qué se hizo, `"move"`, `"on"` u `"off"`, y la
habitación: a cuál se movió o de cuál es la luz. Las líneas 24 a 27 son el
constructor, que llena los dos campos.

### Un estado

```cpp linenums="30"
struct state{
  int pos, light;
  vector<step> steps;

  state(){}

  state(int p, int c){
    pos = p;
    light = c;
    steps = vector<step>();
  }

  state(int p, int c, vector<step> &pa){
    pos = p;
    light = c;
    steps = pa;
  }
};
```

En la línea 31, `pos` es la habitación $h$ y `light` la máscara de $L$. La
línea 32 guarda los pasos desde el inicio: cada estado lleva su camino, así
que al llegar a la meta no hay que reconstruirlo. En las líneas 42 a 46 el
estado nuevo copia los pasos del anterior, y después se le agrega el último.

### El comparador y las matrices

```cpp linenums="49"
struct classcomp{
  bool operator() (const state& est1, const state& est2) const{
 bool ans = true;
 if(est1.pos != est2.pos)
   ans = est1.pos < est2.pos;
 else
   ans = est1.light < est2.light;
 return ans;
}
};

map<state, int, classcomp> dist;
bool roomAdj[11][11], lightAdj[11][11];
```

Un `map` ordena sus claves y un `struct` no trae `<`. Por eso las líneas 52 a
55 dicen que un estado va antes que otro si su habitación es menor, o si es la
misma y su máscara es menor. En la línea 60, `dist` lleva cada estado a su
distancia. Los pasos no entran al comparador, y misma habitación con mismas
luces es la misma clave. En la línea 61, `roomAdj[i][j]` dice si hay puerta
entre $i$ y $j$, y `lightAdj[k][l]` si hay interruptor en $k$ para $l$.

### El inicio de la búsqueda

```cpp linenums="63"
void solve(int r, int s, int d, int caso){
  int i, obj = 1 << r - 1;
  queue<state> q;
  state est(1, 1), curr, res;
  bool flag = false;
  dist[est] = 0;
  q.push(est);
```

En la línea 64, `obj` es la máscara de la meta, solo la luz $r$:
`1 << (r - 1)`. La línea 66 crea el inicio, la habitación $1$ con la máscara
$1$, solo la luz $1$. Las líneas 68 y 69 lo ponen a distancia $0$ y lo meten a
la cola.

### Sacar y reconocer la meta

```cpp linenums="71"
  while(!flag && !q.empty()){
    curr = q.front();
    q.pop();

    if(curr.pos == r && obj == curr.light){
      res = curr;
      flag = true;
    }
    else{
```

La búsqueda sigue mientras no haya encontrado la meta y queden estados en la
cola (línea 71). Las líneas 72 y 73 sacan el primer estado de la cola. Si está
en el dormitorio y su máscara es `obj`, las líneas 75 a 77 lo guardan y
`flag` detiene el `while`. Si no, se calculan sus sucesores.

### Moverse

```cpp linenums="80"
      // verificar posibilidades de desplazarse a otra habitación
      for(i = 1; i <= r; i++){
	// se verifica que haya un pasillo hacía la habitación i y que la luz en esa roomitación esté
	// encendida
	if(roomAdj[curr.pos][i] && (curr.light & (1 << i - 1)) != 0){
	  est = state(i, curr.light, curr.steps);
	  est.steps.push_back(step("move", i));

	  if(dist.find(est) == dist.end()){
	    q.push(est);
	    dist[est] = dist[curr] + 1;
	  }
	}
      }
```

Las líneas 81 y 84 recorren cada habitación $i$ con puerta desde `curr.pos` y
revisan con el `&` que el bit $i-1$ esté prendido. Las líneas 85 y 86 arman el estado
nuevo, en $i$ con las mismas luces, y su último paso es `move`. Si no está en
`dist`, las líneas 88 a 90 lo descubren a un paso más que `curr` y lo meten a
la cola.

### Prender o apagar

```cpp linenums="95"
      // verificar posibilidades de encender o apagar una luz en otra habitación
      for(i = 1; i <= r; i++){
	// se verifica que haya un switch que permita encencer la luz de la habitación i
	// y que no sea la misma habitación en la que se está ubicado
	if(lightAdj[curr.pos][i] && i != curr.pos){
	  est = state(curr.pos, (curr.light ^ (1 << i - 1)), curr.steps);
	  est.steps.push_back(step((est.light > curr.light) ? "on" : "off", i));

	  if(dist.find(est) == dist.end()){
	    q.push(est);
	    dist[est] = dist[curr] + 1;
	  }
	}
      }
```

La línea 99 exige un interruptor en `curr.pos` para la luz $i$, con $i$
distinta de la habitación actual. La línea 100 deja la misma habitación con el
bit $i-1$ invertido por el `^`, y la línea 101 escribe `"on"` si la máscara
subió y `"off"` si bajó. Las líneas 103 a 105 hacen lo mismo que al moverse.

### Los sucesores del inicio

Con `curr` = A $= (1, 1)$, ¿qué estados descubren las líneas 81 a 93, cuáles
las líneas 96 a 108, y en qué orden entran a la cola? Las puertas no dan nada,
porque `1 & 2` y `1 & 4` son $0$. Los interruptores dan B, en la habitación
$1$ con la máscara `011`, por `1 ^ 2 = 3`, y C, con la máscara `101`, por
`1 ^ 4 = 5`. Entran en ese orden, porque el `for` recorre $i = 2$ antes que
$i = 3$.

### Imprimir la respuesta

```cpp linenums="112"
  printf("Villa #%d\n", caso);

  if(flag){
    printf("The problem can be solved in %d steps:\n", dist[res]);
    for(vector<step>::iterator itAux = res.steps.begin(); itAux != res.steps.end(); itAux++){
      if(itAux->desc == "on")
	printf("- Switch on light in room %d.\n", itAux->room);
      else if(itAux->desc == "off")
	printf("- Switch off light in room %d.\n", itAux->room);
      else
	printf("- Move to room %d.\n", itAux->room);
    }
  }
  else
    printf("The problem cannot be solved.\n");
  printf("\n");
```

Si se llegó a la meta, su distancia es el número de pasos (líneas 114 y 115).
Las líneas 116 a 122 imprimen los pasos que lleva la meta en el formato del
enunciado, y la línea 126 dice que no hay solución si la cola se vació sin
encontrarla.

### Leer cada villa

```cpp linenums="135"
  while(r != 0 || d != 0 || s != 0){
    for(i = 0; i < 11; i++){
      for(j = 0; j < 11; j++){
	roomAdj[i][j] = lightAdj[i][j] = false;
      }
    }
    dist.clear();

    for(i = 0; i < d; i++){
      cin >> ini >> fin;
      roomAdj[ini][fin] = roomAdj[fin][ini] = true;
    }

    for(i = 0; i < s; i++){
      cin >> ini >> fin;
      lightAdj[ini][fin] = true;
    }

```

Las líneas 136 a 141 limpian las matrices y `dist` antes de cada villa. En la
línea 145 una puerta sirve en los dos sentidos; en la línea 150, un
interruptor no.

### Lo que cuesta

Hay a lo sumo $r \cdot 2^r$ estados, cada uno sale una vez de la cola, y los
dos `for` recorren $r$ habitaciones cada uno: $2r$ candidatos por estado. Cada
candidato hace una búsqueda en `map`, que cuesta
$O(\lg(r \cdot 2^r)) = O(r)$, y copia los pasos, cuyo tamaño es la distancia
del estado. Con $r = 10$ son $10\,240$ estados y $20$ candidatos por estado,
unos $200\,000$ candidatos por villa.

## La búsqueda sobre la villa 1

La tabla sigue la búsqueda hasta la capa 3. La columna Sale es el estado que
saca la línea 72; Nuevos son los que descubren las líneas 88 a 90 y 103 a
105, y Ya en `dist` los sucesores que se descartan porque ya estaban.

| Sale | $d$ | Nuevos | Ya en `dist` | Cola |
|---|---|---|---|---|
| A | $0$ | B, C | | B C |
| B | $1$ | D, E | A | C D E |
| C | $1$ | F | E, A | D E F |
| D | $2$ | G | B | E F G |
| E | $2$ | H, I | C, B | F G H I |
| F | $2$ | | C, I | G H I |

Cada letra es el estado del mismo nombre en la tabla de capas, con su
habitación y su máscara.

De B sale primero la puerta a $2$, que da D, y después prender $3$, que da E:
las puertas van antes que los interruptores. Apagar $2$ vuelve a A. De C salen
F y, por prender $2$, otra vez E, que ya está en `dist`. En la capa 2, D
descubre G al apagar la luz $1$, E descubre H e I por sus dos puertas y F no
descubre nada, porque volver a $1$ da C y prender $2$ da I. La meta L, en la
habitación $3$ con la máscara `100`, sale de la cola con $d = 6$, y la línea 75
la reconoce.

### La salida

Con el ejemplo del enunciado, el programa imprime lo mismo, línea por línea,
que la salida del enunciado:

```text
Villa #1
The problem can be solved in 6 steps:
- Switch on light in room 2.
- Switch on light in room 3.
- Move to room 2.
- Switch off light in room 1.
- Move to room 3.
- Switch off light in room 2.

Villa #2
The problem cannot be solved.
```

**Consejo para el juez.** El estado es la pieza que hay que encontrar: lo que
hace falta saber para decidir qué pasos son posibles. La trampa está en
$r = 1$. El hall ya es el dormitorio, la línea 75 reconoce el inicio como meta
y la respuesta es `The problem can be solved in 0 steps:`. Si hay varias
soluciones con el menor número de pasos, el enunciado pide una sola.

## Errores comunes

**Buscar sobre las habitaciones.** Un arreglo de visitados por habitación
descarta la habitación $1$ con otras luces. Lo visitado es el estado completo.

**Comparar el `&` con $1$.** `L & (1 << i - 1)` vale $0$ o la máscara de la
luz, y la condición es `!= 0`.

**Olvidar $i \neq$ `curr.pos`.** Sin esa condición en la línea 99 se apaga la
luz propia, y la búsqueda puede devolver una solución que no vale.

**Un comparador que mira solo la habitación.** Si `classcomp` comparara solo
`pos`, dos estados en la misma habitación con luces distintas serían la misma
clave, y el segundo nunca entraría a la cola.

**No limpiar entre villas.** Sin `dist.clear()` la villa 2 encuentra los
estados de la villa 1 como ya descubiertos.

**Puertas en un solo sentido.** Una puerta `i j` se marca en `roomAdj[i][j]` y
en `roomAdj[j][i]`; un interruptor `k l`, solo en `lightAdj[k][l]`.

## El código de la clase

[321-new-villa.cpp](./codigo/321-new-villa.cpp) resuelve UVa 321 con la
búsqueda en amplitud sobre los estados. Lee de la entrada estándar las villas
en el formato del enunciado.

## Ejercicios

1. **Dibujar una parte del grafo.** Sea la villa con $r = 3$, puertas entre
   $1$ y $2$ y entre $2$ y $3$, e interruptores $1 \to 2$, $2 \to 1$,
   $2 \to 3$ y $3 \to 2$. Dibuje las capas $0$ a $3$ del grafo de estados
   desde $(1, \{1\})$, con la acción en cada arista, y marque las aristas que
   llegan a un estado que ya estaba dibujado. ¿Cuántos pasos tiene la
   solución?
2. **Máscaras de cuatro luces.** Sea la villa con $r = 4$, puertas entre $1$ y
   $2$, entre $1$ y $3$ y entre $3$ y $4$, e interruptores $1 \to 3$,
   $1 \to 4$, $3 \to 1$, $4 \to 3$, $3 \to 2$ y $2 \to 1$. El código imprime:
   prende 3, prende 4, a 3, apaga 1, a 4, apaga 3. Escriba la máscara de cada
   estado del camino en binario y en decimal. En cada paso, diga qué operación
   hace el código y con qué máscara, y cuánto vale `obj`.
3. **Una villa sin solución.** Sea la villa con $r = 3$, puertas entre $1$ y
   $2$ y entre $2$ y $3$, e interruptores $1 \to 2$, $2 \to 3$ y $3 \to 1$.
   Dibuje todos los estados que se alcanzan desde $(1, \{1\})$ y explique por
   qué la meta no está entre ellos.
4. **La luz propia.** Demuestre que en todo estado $(h, L)$ alcanzable desde
   $(1, \{1\})$ se cumple $h \in L$, y deduzca que toda transición se deshace
   con un paso. Escriba la demostración en cuatro partes: teorema, estrategia,
   desarrollo y conclusión.
5. **El orden de los `for`.** En `321-new-villa.cpp` se intercambian los dos
   `for`: primero los interruptores, líneas 95 a 108, y después las puertas,
   líneas 80 a 93. Rehaga la tabla de la búsqueda sobre la villa 1 hasta la
   capa $3$. ¿Qué estados cambian de letra? ¿Cambia lo que imprime el
   programa?
6. **Cuántos estados se alcanzan.** En la villa 1, ¿cuántos de los $24$
   estados cumplen $h \in L$? Compare con los $12$ que alcanza la búsqueda. En
   la villa del ejercicio 3, ¿qué estados con $h \in L$ no se alcanzan?

### Pistas

1. La capa $1$ tiene un solo estado, $(1, \{1,2\})$, y la capa $2$ también:
   $(2, \{1,2\})$. La solución tiene $6$ pasos y la búsqueda alcanza $12$
   estados.
2. El inicio es `0001` $= 1$ y `obj` es `1000` $= 8$. Los dos *prende* usan
   `^` con $4$ y con $8$.
3. Se alcanzan $10$ estados. La luz $2$ solo se controla desde la habitación
   $1$.
4. Se procede por inducción sobre el número de pasos. Para la vuelta de un
   movimiento de $h$ a $j$ hace falta $h \in L$.
5. D y E se intercambian, y la capa $3$ queda en otro orden. La salida no
   cambia.
6. En cada habitación, $4$ de los $8$ conjuntos contienen a $h$. En la villa
   del ejercicio 3 faltan dos, los dos en la habitación $3$.

## Lo que sigue

Bellman-Ford hace rondas porque no sabe en qué orden relajar las aristas. En
un grafo dirigido acíclico ese orden existe: el orden topológico.

Para investigar:

- CLRS, Sección 24.2: si las aristas se relajan una sola vez, vértice por
  vértice en orden topológico, ¿por qué basta una pasada, y cuánto cuesta?
- CLRS, Sección 24.3, el algoritmo de Dijkstra: si ningún peso es negativo,
  ¿qué vértice conviene sacar primero de la cola?
- Si en una villa moverse costara $2$ pasos y accionar un interruptor $1$,
  ¿seguiría sirviendo la búsqueda en amplitud?

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Sección 22.2 y Teorema 22.5 (búsqueda en amplitud); Secciones
  24.2 y 24.3.
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Capítulo 4:
  grafos de estados; Capítulo 2: máscaras de bits.
- UVa Online Judge, problema 321, The New Villa.
  <https://onlinejudge.org/external/3/321.pdf>
