# Soluciones · Refuerzo PUJ 7 de noviembre

UVa 12032, UVa 336 y UVa 11686, los problemas extra UVa 10341 y UVa 10810 y los
tres problemas de la tarea de la
[sesión del 7 de noviembre](./7%20de%20noviembre.%20Bisecci%C3%B3n%20y%20dividir%20y%20vencer%C3%A1s.md),
cada uno con la idea, lo que cuesta y el código en Python y en C++. Los
archivos están también en la carpeta `codigo/`.

## Hora 1. UVa 12032, The Monkey and the Oiled Bamboo

### Idea

Encontrar el mínimo directamente obliga a razonar sobre todos los saltos a la
vez. La pregunta que sí se contesta de una pasada es *¿se llega arriba
empezando con fuerza $k$?*: se simula la subida llevando la fuerza actual, cada
salto se compara contra ella y el que la iguala la gasta en uno. Es monótona,
porque con $k+1$ ningún salto que cabía deja de caber. Los límites son el salto
más grande, que hay que dar, y ese mismo más $n$, porque cada salto baja la
fuerza a lo sumo en uno.

### Complejidad

$\Theta(n \log(\max s_i + n))$ por caso: cada vuelta de la bisección recorre
los saltos una vez.

### Python

```python
import sys


def alcanza(saltos, k):
    # Con fuerza inicial k, ¿se llega al último peldaño?
    fuerza = k
    puede = True
    for s in saltos:
        if s > fuerza:
            puede = False
        elif s == fuerza:
            fuerza = fuerza - 1
    return puede


def minimaFuerza(saltos):
    # El menor k que cumple alcanza(saltos, k).
    lo = max(saltos)
    hi = lo + len(saltos)
    while lo < hi:
        medio = (lo + hi) // 2
        if alcanza(saltos, medio):
            hi = medio
        else:
            lo = medio + 1
    return lo


def main():
    datos = sys.stdin.read().split()
    pos = 0
    casos = int(datos[pos])
    pos = pos + 1
    caso = 1
    salida = []
    while caso <= casos:
        n = int(datos[pos])
        pos = pos + 1
        alturas = []
        i = 0
        while i < n:
            alturas.append(int(datos[pos]))
            pos = pos + 1
            i = i + 1
        saltos = [alturas[0]]
        i = 1
        while i < n:
            saltos.append(alturas[i] - alturas[i - 1])
            i = i + 1
        salida.append('Case ' + str(caso) + ': ' + str(minimaFuerza(saltos)))
        caso = caso + 1
    print('\n'.join(salida))


main()
```

### C++

```cpp
#include <cstdio>
#include <vector>

using namespace std;

bool alcanza(const vector<int> &saltos, int k) {
  // Con fuerza inicial k, se llega al ultimo peldano?
  int fuerza = k;
  bool puede = true;
  for (size_t i = 0; i < saltos.size(); i++) {
    if (saltos[i] > fuerza) {
      puede = false;
    } else if (saltos[i] == fuerza) {
      fuerza = fuerza - 1;
    }
  }
  return puede;
}

int minimaFuerza(const vector<int> &saltos) {
  // El menor k que cumple alcanza(saltos, k).
  int lo = 0;
  for (size_t i = 0; i < saltos.size(); i++) {
    if (saltos[i] > lo) {
      lo = saltos[i];
    }
  }
  int hi = lo + (int)saltos.size();
  while (lo < hi) {
    int medio = lo + (hi - lo) / 2;
    if (alcanza(saltos, medio)) {
      hi = medio;
    } else {
      lo = medio + 1;
    }
  }
  return lo;
}

int main() {
  int casos;
  scanf("%d", &casos);
  for (int caso = 1; caso <= casos; caso++) {
    int n;
    scanf("%d", &n);
    vector<int> alturas(n);
    for (int i = 0; i < n; i++) {
      scanf("%d", &alturas[i]);
    }
    vector<int> saltos;
    saltos.push_back(alturas[0]);
    for (int i = 1; i < n; i++) {
      saltos.push_back(alturas[i] - alturas[i - 1]);
    }
    printf("Case %d: %d\n", caso, minimaFuerza(saltos));
  }
  return 0;
}
```

## Hora 2. UVa 336, A Node Too Far

### Idea

Se construye la lista de adyacencia y se corre un recorrido en amplitud por
consulta, con una cola y un arreglo de distancias que arranca en $-1$. El recorrido
visita los nodos por distancia creciente, así que la condición `dist[u] < ttl` deja
en la cola los nodos a distancia TTL sin expandirlos. La respuesta es el total de
nodos menos los alcanzados, y el nodo de partida cuenta como alcanzado, incluso con
TTL 0. `indiceDe` traduce el número del nodo a un índice entre 0 y $V - 1$, y `main`
pregunta si el nodo está antes de llamar a `bfs`: un nodo ausente no alcanza a
ninguno.

### Complejidad

$O(V + E)$ por consulta para el recorrido, con $V \le 30$ y $E \le 435$. Cada
búsqueda en el diccionario cuesta $O(\log V)$ en C++ y $O(1)$ en promedio en Python.

### Python

Archivo: [a-node-too-far.py](./codigo/a-node-too-far.py)

```python
import sys
from collections import deque


def indiceDe(indice, adj, nodo):
    # El índice del nodo; si es la primera vez que aparece, se le asigna uno.
    if nodo not in indice:
        indice[nodo] = len(indice)
        adj.append([])
    return indice[nodo]


def bfs(adj, inicio, ttl):
    # Cuántos nodos quedan a distancia menor o igual a ttl desde inicio.
    dist = [-1] * len(adj)
    cola = deque()
    dist[inicio] = 0
    cola.append(inicio)
    alcanzados = 1
    while len(cola) > 0:
        u = cola.popleft()
        if dist[u] < ttl:
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    alcanzados = alcanzados + 1
                    cola.append(v)
    return alcanzados


def main():
    datos = sys.stdin.read().split()
    pos = 0
    caso = 0
    salida = []
    conexiones = int(datos[pos])
    pos = pos + 1
    while conexiones != 0:
        indice = {}
        adj = []
        i = 0
        while i < conexiones:
            ia = indiceDe(indice, adj, int(datos[pos]))
            ib = indiceDe(indice, adj, int(datos[pos + 1]))
            pos = pos + 2
            adj[ia].append(ib)
            adj[ib].append(ia)
            i = i + 1
        nodo = int(datos[pos])
        ttl = int(datos[pos + 1])
        pos = pos + 2
        while nodo != 0 or ttl != 0:
            caso = caso + 1
            alcanzados = 0
            if nodo in indice:
                alcanzados = bfs(adj, indice[nodo], ttl)
            salida.append('Case ' + str(caso) + ': ' + str(len(adj) - alcanzados)
                          + ' nodes not reachable from node ' + str(nodo)
                          + ' with TTL = ' + str(ttl) + '.')
            nodo = int(datos[pos])
            ttl = int(datos[pos + 1])
            pos = pos + 2
        conexiones = int(datos[pos])
        pos = pos + 1
    print('\n'.join(salida))


main()
```

### C++

Archivo: [a-node-too-far.cpp](./codigo/a-node-too-far.cpp)

```cpp
#include <cstdio>
#include <map>
#include <queue>
#include <vector>

using namespace std;

int indiceDe(map<int, int> &indice, vector<vector<int> > &adj, int nodo) {
  // El indice del nodo; si es la primera vez que aparece, se le asigna uno.
  if (indice.count(nodo) == 0) {
    int nuevo = (int)indice.size();
    indice[nodo] = nuevo;
    adj.push_back(vector<int>());
  }
  return indice[nodo];
}

int bfs(const vector<vector<int> > &adj, int inicio, int ttl) {
  // Cuantos nodos quedan a distancia menor o igual a ttl desde inicio.
  vector<int> dist(adj.size(), -1);
  queue<int> cola;
  dist[inicio] = 0;
  cola.push(inicio);
  int alcanzados = 1;
  while (!cola.empty()) {
    int u = cola.front();
    cola.pop();
    if (dist[u] < ttl) {
      for (size_t i = 0; i < adj[u].size(); i++) {
        int v = adj[u][i];
        if (dist[v] == -1) {
          dist[v] = dist[u] + 1;
          alcanzados = alcanzados + 1;
          cola.push(v);
        }
      }
    }
  }
  return alcanzados;
}

int main() {
  int conexiones;
  int caso = 0;
  while (scanf("%d", &conexiones) == 1 && conexiones != 0) {
    map<int, int> indice;
    vector<vector<int> > adj;
    for (int i = 0; i < conexiones; i++) {
      int a, b;
      scanf("%d %d", &a, &b);
      int ia = indiceDe(indice, adj, a);
      int ib = indiceDe(indice, adj, b);
      adj[ia].push_back(ib);
      adj[ib].push_back(ia);
    }
    int nodo, ttl;
    while (scanf("%d %d", &nodo, &ttl) == 2 && (nodo != 0 || ttl != 0)) {
      caso = caso + 1;
      int alcanzados = 0;
      if (indice.count(nodo) > 0) {
        alcanzados = bfs(adj, indice[nodo], ttl);
      }
      printf("Case %d: %d nodes not reachable from node %d with TTL = %d.\n",
             caso, (int)adj.size() - alcanzados, nodo, ttl);
    }
  }
  return 0;
}
```

## Hora 3. UVa 11686, Pick up sticks

### Idea

Cada nodo pasa por tres estados: sin visitar, en el camino actual y terminado. Una
arista hacia un nodo en camino cierra un ciclo, porque desde ese nodo ya se había
bajado hasta el actual. Una arista hacia un nodo terminado no cierra nada por sí sola:
ese nodo ya revisó todo lo que sale de él, y si pudiera volver al actual, la arista de
regreso ya se habría detectado. `orden` recibe cada nodo al terminar, y `main` lo
imprime del último al primero. El recorrido arranca desde todo nodo sin visitar,
porque el grafo puede tener varias componentes.

### Complejidad

$\Theta(n + m)$ por caso en las tres soluciones. La memoria adicional del recorrido es
$\Theta(n)$, en la pila de llamadas o en el `vector`. Medida con `ulimit -s` de
8192 KB, la recursiva de C++ pasó con 86 851 nodos de profundidad y reventó con
87 826, así que al juez se envía la versión con pila. La de Python tampoco se envía:
en Python 3.8, con el mismo límite de recursión, reventó con 10 968.

### Python

Archivo: [pick-up-sticks.py](./codigo/pick-up-sticks.py)

```python
import sys

SIN_VISITAR = 0
EN_CAMINO = 1
TERMINADO = 2


def dfs(adj, color, orden, u):
    # Recorre lo que sale de u y devuelve si encontró un ciclo.
    hayCiclo = False
    color[u] = EN_CAMINO
    for v in adj[u]:
        if color[v] == EN_CAMINO:
            hayCiclo = True
        elif color[v] == SIN_VISITAR:
            if dfs(adj, color, orden, v):
                hayCiclo = True
    color[u] = TERMINADO
    orden.append(u)
    return hayCiclo


def main():
    sys.setrecursionlimit(1100000)
    datos = sys.stdin.buffer.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
    while n != 0 or m != 0:
        adj = [[] for u in range(n + 1)]
        i = 0
        while i < m:
            adj[int(datos[pos])].append(int(datos[pos + 1]))
            pos = pos + 2
            i = i + 1
        color = [SIN_VISITAR] * (n + 1)
        orden = []
        hayCiclo = False
        u = 1
        while u <= n:
            if color[u] == SIN_VISITAR:
                if dfs(adj, color, orden, u):
                    hayCiclo = True
            u = u + 1
        if hayCiclo:
            salida.append('IMPOSSIBLE')
        else:
            orden.reverse()
            salida.append('\n'.join([str(u) for u in orden]))
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
    print('\n'.join(salida))


main()
```

### C++, recursiva

Archivo: [pick-up-sticks.cpp](./codigo/pick-up-sticks.cpp)

```cpp
#include <cstdio>
#include <vector>

using namespace std;

const int SIN_VISITAR = 0;
const int EN_CAMINO = 1;
const int TERMINADO = 2;

void dfs(const vector<vector<int> > &adj, vector<int> &color,
         vector<int> &orden, bool &hayCiclo, int u) {
  // Recorre lo que sale de u; una arista a un nodo en camino cierra un ciclo.
  color[u] = EN_CAMINO;
  for (size_t i = 0; i < adj[u].size(); i++) {
    int v = adj[u][i];
    if (color[v] == EN_CAMINO) {
      hayCiclo = true;
    } else if (color[v] == SIN_VISITAR) {
      dfs(adj, color, orden, hayCiclo, v);
    }
  }
  color[u] = TERMINADO;
  orden.push_back(u);
}

int main() {
  int n, m;
  while (scanf("%d %d", &n, &m) == 2 && (n != 0 || m != 0)) {
    vector<vector<int> > adj(n + 1);
    for (int i = 0; i < m; i++) {
      int a, b;
      scanf("%d %d", &a, &b);
      adj[a].push_back(b);
    }
    vector<int> color(n + 1, SIN_VISITAR);
    vector<int> orden;
    bool hayCiclo = false;
    for (int u = 1; u <= n; u++) {
      if (color[u] == SIN_VISITAR) {
        dfs(adj, color, orden, hayCiclo, u);
      }
    }
    if (hayCiclo) {
      printf("IMPOSSIBLE\n");
    } else {
      for (int i = n - 1; i >= 0; i--) {
        printf("%d\n", orden[i]);
      }
    }
  }
  return 0;
}
```

### C++, con pila

`siguiente[u]` recuerda cuál arista de `u` toca revisar, el dato que en la recursiva
guarda la variable `i` de cada llamada. Imprime los mismos órdenes que la recursiva.

Archivo: [pick-up-sticks-pila.cpp](./codigo/pick-up-sticks-pila.cpp)

```cpp
#include <cstdio>
#include <vector>

using namespace std;

const int SIN_VISITAR = 0;
const int EN_CAMINO = 1;
const int TERMINADO = 2;

void dfs(const vector<vector<int> > &adj, vector<int> &color,
         vector<size_t> &siguiente, vector<int> &orden, bool &hayCiclo,
         int inicio) {
  // La pila guarda el camino actual; siguiente[u] es la arista de u que
  // toca revisar, lo que en la recursiva guarda la variable i de cada llamada.
  vector<int> pila;
  color[inicio] = EN_CAMINO;
  pila.push_back(inicio);
  while (!pila.empty()) {
    int u = pila.back();
    if (siguiente[u] < adj[u].size()) {
      int v = adj[u][siguiente[u]];
      siguiente[u] = siguiente[u] + 1;
      if (color[v] == EN_CAMINO) {
        hayCiclo = true;
      } else if (color[v] == SIN_VISITAR) {
        color[v] = EN_CAMINO;
        pila.push_back(v);
      }
    } else {
      color[u] = TERMINADO;
      orden.push_back(u);
      pila.pop_back();
    }
  }
}

int main() {
  int n, m;
  while (scanf("%d %d", &n, &m) == 2 && (n != 0 || m != 0)) {
    vector<vector<int> > adj(n + 1);
    for (int i = 0; i < m; i++) {
      int a, b;
      scanf("%d %d", &a, &b);
      adj[a].push_back(b);
    }
    vector<int> color(n + 1, SIN_VISITAR);
    vector<size_t> siguiente(n + 1, 0);
    vector<int> orden;
    bool hayCiclo = false;
    for (int u = 1; u <= n; u++) {
      if (color[u] == SIN_VISITAR) {
        dfs(adj, color, siguiente, orden, hayCiclo, u);
      }
    }
    if (hayCiclo) {
      printf("IMPOSSIBLE\n");
    } else {
      for (int i = n - 1; i >= 0; i--) {
        printf("%d\n", orden[i]);
      }
    }
  }
  return 0;
}
```

## Problema extra. UVa 10341, Solve It

### Idea

La función viene dada, así que lo que queda es comprobarle dos cosas.
Derivando, cada sumando de $f'$ es menor o igual que cero en $[0,1]$ por los
rangos del enunciado, de modo que $f$ no crece y hay a lo sumo una raíz. Y hay
raíz exactamente cuando $f(0) \geq 0 \geq f(1)$: sin esa comprobación el ciclo
igual termina y devuelve un número que no es raíz de nada. Cien vueltas dejan
el intervalo en $2^{-100}$ del original y evitan discutir la tolerancia.

### Complejidad

Cien evaluaciones por caso, o sea constante; el total es lineal en la cantidad
de casos.

### Python

```python
import math
import sys


def f(p, q, r, s, t, u, x):
    # El lado izquierdo de la ecuación, evaluado en x.
    return (p * math.exp(-x) + q * math.sin(x) + r * math.cos(x)
            + s * math.tan(x) + t * x * x + u)


def resolver(p, q, r, s, t, u):
    # f es decreciente en [0, 1]: hay raíz solo si f(0) >= 0 >= f(1).
    if f(p, q, r, s, t, u, 0.0) < 0.0 or f(p, q, r, s, t, u, 1.0) > 0.0:
        respuesta = 'No solution'
    else:
        lo = 0.0
        hi = 1.0
        vuelta = 0
        while vuelta < 100:
            medio = (lo + hi) / 2.0
            if f(p, q, r, s, t, u, medio) > 0.0:
                lo = medio
            else:
                hi = medio
            vuelta = vuelta + 1
        respuesta = '%.4f' % ((lo + hi) / 2.0)
    return respuesta


def main():
    salida = []
    for linea in sys.stdin:
        datos = linea.split()
        if len(datos) == 6:
            p = int(datos[0])
            q = int(datos[1])
            r = int(datos[2])
            s = int(datos[3])
            t = int(datos[4])
            u = int(datos[5])
            salida.append(resolver(p, q, r, s, t, u))
    print('\n'.join(salida))


main()
```

### C++

```cpp
#include <cmath>
#include <cstdio>

double f(int p, int q, int r, int s, int t, int u, double x) {
  // El lado izquierdo de la ecuacion, evaluado en x.
  return p * exp(-x) + q * sin(x) + r * cos(x) + s * tan(x) + t * x * x + u;
}

int main() {
  int p, q, r, s, t, u;
  while (scanf("%d %d %d %d %d %d", &p, &q, &r, &s, &t, &u) == 6) {
    if (f(p, q, r, s, t, u, 0.0) < 0.0 || f(p, q, r, s, t, u, 1.0) > 0.0) {
      printf("No solution\n");
    } else {
      double lo = 0.0, hi = 1.0;
      for (int vuelta = 0; vuelta < 100; vuelta++) {
        double medio = (lo + hi) / 2.0;
        if (f(p, q, r, s, t, u, medio) > 0.0) {
          lo = medio;
        } else {
          hi = medio;
        }
      }
      printf("%.4f\n", (lo + hi) / 2.0);
    }
  }
  return 0;
}
```

## Problema extra. UVa 10810, Ultra-QuickSort

### Idea

Cada intercambio de vecinos arregla exactamente una pareja fuera de orden, así
que lo que se pide es el número de parejas $(i,j)$ con $i<j$ y $a_i > a_j$. Las
de un tramo se reparten en tres clases: las dos puntas en la mitad izquierda,
las dos en la derecha, y una en cada mitad. Las dos primeras son el mismo
problema más chico; la tercera se cuenta al mezclar, porque cuando sale un
elemento de la derecha todos los pendientes de la izquierda son mayores que él.

### Complejidad

$T(n) = 2T(n/2) + \Theta(n)$, o sea $\Theta(n \log n)$. El contador va en
`long long`. Medido con $n = 499\,999$: 0,20 s en C++ y 5,1 s en Python, así
que al juez se envía la de C++.

### Python

```python
import sys


def mezclar(a, aux, ini, medio, fin):
    # Mezcla a[ini:medio) con a[medio:fin) y cuenta las parejas que cruzan:
    # cada elemento que sale de la derecha aporta los que faltan a la izquierda.
    i = ini
    j = medio
    k = ini
    cruzadas = 0
    while k < fin:
        if i < medio and (j >= fin or a[i] <= a[j]):
            aux[k] = a[i]
            i = i + 1
        else:
            aux[k] = a[j]
            j = j + 1
            cruzadas = cruzadas + (medio - i)
        k = k + 1
    a[ini:fin] = aux[ini:fin]
    return cruzadas


def contar(a, aux, ini, fin):
    # Ordena a[ini:fin) en el lugar y devuelve cuántas inversiones tenía.
    total = 0
    if fin - ini > 1:
        medio = (ini + fin) // 2
        total = contar(a, aux, ini, medio)
        total = total + contar(a, aux, medio, fin)
        total = total + mezclar(a, aux, ini, medio, fin)
    return total


def main():
    datos = sys.stdin.buffer.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        a = [0] * n
        i = 0
        while i < n:
            a[i] = int(datos[pos])
            pos = pos + 1
            i = i + 1
        aux = [0] * n
        salida.append(str(contar(a, aux, 0, n)))
        n = int(datos[pos])
        pos = pos + 1
    sys.stdout.write('\n'.join(salida) + '\n')


main()
```

### C++

```cpp
#include <cstdio>
#include <vector>

using namespace std;

long long mezclar(vector<int> &a, vector<int> &aux, int ini, int medio, int fin) {
  // Mezcla a[ini:medio) con a[medio:fin) y cuenta las parejas fuera de orden.
  int i = ini, j = medio, k = ini;
  long long cruzadas = 0;
  while (k < fin) {
    if (i < medio && (j >= fin || a[i] <= a[j])) {
      aux[k] = a[i];
      i = i + 1;
    } else {
      aux[k] = a[j];
      j = j + 1;
      cruzadas = cruzadas + (medio - i);
    }
    k = k + 1;
  }
  for (k = ini; k < fin; k++) {
    a[k] = aux[k];
  }
  return cruzadas;
}

long long contar(vector<int> &a, vector<int> &aux, int ini, int fin) {
  // Ordena a[ini:fin) en el lugar y devuelve cuantas inversiones tenia.
  long long total = 0;
  if (fin - ini > 1) {
    int medio = (ini + fin) / 2;
    total = contar(a, aux, ini, medio);
    total = total + contar(a, aux, medio, fin);
    total = total + mezclar(a, aux, ini, medio, fin);
  }
  return total;
}

int main() {
  int n;
  while (scanf("%d", &n) == 1 && n != 0) {
    vector<int> a(n), aux(n);
    for (int i = 0; i < n; i++) {
      scanf("%d", &a[i]);
    }
    printf("%lld\n", contar(a, aux, 0, n));
  }
  return 0;
}
```

## Tarea base. UVa 10935, Throwing cards away I

### Idea

Se llena la cola con las cartas de 1 a $n$. En cada ronda se saca el frente, se imprime y se pasa el nuevo frente al final. `primera` decide el separador: un espacio antes de la primera carta y `, ` antes de las otras, y así $n = 1$ deja `Discarded cards:` sin espacio final. En Python, `jugar(n)` arma la línea como texto y la devuelve con la carta que queda; en C++ se imprime a medida que salen las cartas.

### Complejidad

$\Theta(n)$ por número de entrada: $n - 1$ rondas con trabajo constante.

### Python

Archivo: [throwing-cards-away-i.py](./codigo/throwing-cards-away-i.py)

```python
# UVa 10935 - Throwing cards away I
import sys
from collections import deque


def jugar(n):
    # devuelve la línea de descartadas y la carta que queda
    mazo = deque()
    for carta in range(1, n + 1):
        mazo.append(carta)
    linea = "Discarded cards:"
    primera = True
    while len(mazo) >= 2:
        if primera:
            linea = linea + " " + str(mazo.popleft())
            primera = False
        else:
            linea = linea + ", " + str(mazo.popleft())
        mazo.append(mazo.popleft())
    return linea, mazo[0]


def main():
    datos = sys.stdin.read().split()
    i = 0
    while i < len(datos) and int(datos[i]) != 0:
        linea, ultima = jugar(int(datos[i]))
        print(linea)
        print("Remaining card: %d" % ultima)
        i = i + 1


main()
```

### C++

Archivo: [throwing-cards-away-i.cpp](./codigo/throwing-cards-away-i.cpp)

```cpp
// UVa 10935 - Throwing cards away I
#include <cstdio>
#include <queue>

using namespace std;

void jugar(int n) {
    queue<int> mazo;
    for (int carta = 1; carta <= n; carta++) {
        mazo.push(carta);
    }
    printf("Discarded cards:");
    bool primera = true;
    while (mazo.size() >= 2) {
        if (primera) {
            printf(" %d", mazo.front());
            primera = false;
        } else {
            printf(", %d", mazo.front());
        }
        mazo.pop();
        mazo.push(mazo.front());
        mazo.pop();
    }
    printf("\nRemaining card: %d\n", mazo.front());
}

int main() {
    int n = 0;
    scanf("%d", &n);
    while (n != 0) {
        jugar(n);
        n = 0;
        scanf("%d", &n);
    }
    return 0;
}
```

## Tarea intermedia. UVa 11286, Conformity

### Idea

Por cada estudiante se ordenan sus cinco cursos y se suma uno a esa clave. Después se recorre el diccionario llevando la mayor cuenta y el total acumulado: una cuenta mayor reinicia el total y una cuenta igual se le suma.

En Python la clave es una tupla, porque una lista no puede ser clave de `dict`. Los cursos tienen tres dígitos, así que ordenarlos como texto da el mismo orden que como número. En C++ la clave es un `vector<int>` ya ordenado, y `map` lo compara elemento por elemento. Sin ordenar los cursos la muestra da 3 y 3, y sin sumar los empates da 2 y 1, en lugar de 2 y 3.

### Complejidad

$O(n \log n)$ por caso en C++, con $n$ operaciones sobre un `map` y trabajo constante por clave. En Python, $O(n)$ en promedio con `dict`. Comparar cada estudiante con todos los demás pagaría $\Theta(n^2)$, unos $10^8$ pasos en el caso más grande.

### Python

Archivo: [conformity.py](./codigo/conformity.py)

```python
# UVa 11286 - Conformity
import sys


def ganadores(combinaciones):
    # combinaciones trae una tupla ordenada de cursos por estudiante
    cuenta = {}
    for k in combinaciones:
        if k in cuenta:
            cuenta[k] = cuenta[k] + 1
        else:
            cuenta[k] = 1
    mayor = 0
    total = 0
    for k in cuenta:
        if cuenta[k] > mayor:
            mayor = cuenta[k]
            total = cuenta[k]
        elif cuenta[k] == mayor:
            total = total + cuenta[k]
    return total


def main():
    datos = sys.stdin.read().split()
    pos = 0
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        combinaciones = []
        for i in range(n):
            combinaciones.append(tuple(sorted(datos[pos:pos + 5])))
            pos = pos + 5
        print(ganadores(combinaciones))
        n = int(datos[pos])
        pos = pos + 1


main()
```

### C++

Archivo: [conformity.cpp](./codigo/conformity.cpp)

```cpp
// UVa 11286 - Conformity
#include <algorithm>
#include <cstdio>
#include <map>
#include <vector>

using namespace std;

int main() {
    int n = 0;
    scanf("%d", &n);
    while (n != 0) {
        // la clave es el vector de cursos ya ordenado
        map<vector<int>, int> cuenta;
        for (int i = 0; i < n; i++) {
            vector<int> cursos(5);
            for (int j = 0; j < 5; j++) {
                scanf("%d", &cursos[j]);
            }
            sort(cursos.begin(), cursos.end());
            cuenta[cursos] = cuenta[cursos] + 1;
        }
        int mayor = 0;
        int total = 0;
        for (map<vector<int>, int>::iterator it = cuenta.begin(); it != cuenta.end(); it++) {
            if (it->second > mayor) {
                mayor = it->second;
                total = it->second;
            } else if (it->second == mayor) {
                total = total + it->second;
            }
        }
        printf("%d\n", total);
        n = 0;
        scanf("%d", &n);
    }
    return 0;
}
```

## Tarea exigente. UVa 699, The Falling Leaves

### Idea

`subarbol` recibe la columna donde está su raíz. Lee un valor; si no es `-1`, lo suma a la pila de esa columna y se llama dos veces, una para cada hijo. Al volver al programa principal, el árbol ya está leído completo y las pilas tienen su suma. Las columnas se imprimen de la menor a la mayor.

Las columnas pueden ser negativas, y por eso las pilas van en un diccionario: `dict` en Python, recorrido con `sorted`, y `map` en C++, que ya recorre en orden. En Python, `subarbol` lee de la lista de palabras y devuelve la posición donde sigue la entrada, como en UVa 839. En C++ el programa principal lee la raíz para reconocer el `-1` final, y `subarbol` recibe ese valor ya leído. El enunciado acota el ancho de la salida y no la altura del árbol, así que la versión en Python sube el límite de recursión con `sys.setrecursionlimit(100000)`.

### Complejidad

$O(t \log c)$ por árbol en C++ con `map`, con $t$ nodos y $c$ columnas distintas. En Python, $O(t + c \log c)$ en promedio. La pila de llamadas llega a la altura del árbol.

### Python

Archivo: [the-falling-leaves.py](./codigo/the-falling-leaves.py)

```python
# UVa 699 - The Falling Leaves
import sys


def sumar(pilas, x, valor):
    if x in pilas:
        pilas[x] = pilas[x] + valor
    else:
        pilas[x] = valor


def subarbol(datos, pos, x, pilas):
    # lee el subárbol que empieza en datos[pos], cuya raíz está en la
    # columna x, y devuelve dónde sigue la entrada
    valor = int(datos[pos])
    pos = pos + 1
    if valor != -1:
        sumar(pilas, x, valor)
        pos = subarbol(datos, pos, x - 1, pilas)
        pos = subarbol(datos, pos, x + 1, pilas)
    return pos


def main():
    sys.setrecursionlimit(100000)
    datos = sys.stdin.read().split()
    caso = 1
    pos = 0
    while int(datos[pos]) != -1:
        pilas = {}
        pos = subarbol(datos, pos, 0, pilas)
        linea = ""
        for x in sorted(pilas):
            if linea != "":
                linea = linea + " "
            linea = linea + str(pilas[x])
        print("Case %d:" % caso)
        print(linea)
        print("")
        caso = caso + 1


main()
```

### C++

Archivo: [the-falling-leaves.cpp](./codigo/the-falling-leaves.cpp)

```cpp
// UVa 699 - The Falling Leaves
#include <cstdio>
#include <map>

using namespace std;

// lee un subárbol cuya raíz está en la columna x y suma sus valores a las
// pilas; ya se sabe que la raíz vale raiz y no es -1
void subarbol(int raiz, int x, map<int, long long>& pilas) {
    pilas[x] = pilas[x] + raiz;
    int izq;
    scanf("%d", &izq);
    if (izq != -1) {
        subarbol(izq, x - 1, pilas);
    }
    int der;
    scanf("%d", &der);
    if (der != -1) {
        subarbol(der, x + 1, pilas);
    }
}

int main() {
    int caso = 1;
    int raiz = -1;
    scanf("%d", &raiz);
    while (raiz != -1) {
        map<int, long long> pilas;
        subarbol(raiz, 0, pilas);
        printf("Case %d:\n", caso);
        bool primera = true;
        for (map<int, long long>::iterator it = pilas.begin(); it != pilas.end(); it++) {
            if (primera) {
                printf("%lld", it->second);
                primera = false;
            } else {
                printf(" %lld", it->second);
            }
        }
        printf("\n\n");
        caso = caso + 1;
        raiz = -1;
        scanf("%d", &raiz);
    }
    return 0;
}
```
