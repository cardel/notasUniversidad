# Soluciones · Refuerzo PUJ 14 de noviembre

UVa 1203, UVa 10341, UVa 11413 y UVa 10810, los problemas propuestos de la
[sesión del 14 de noviembre](./14%20de%20noviembre.%20Planteamiento%20e%20invariantes%20de%20ciclo.md),
cada uno con la idea, lo que cuesta y el código en Python y en C++. Los
archivos están también en la carpeta `codigo/`.

## UVa 1203, Argus

### Idea

La cola de prioridad guarda un par por consulta, el instante de su próxima
respuesta y su número. Empieza con $(P, \mathit{num})$, porque la primera
respuesta llega a los $P$ segundos. Sale el par menor y la consulta vuelve a
entrar con el instante aumentado en su periodo. Comparar pares ya da el desempate
del enunciado: en el mismo instante sale primero el número menor.

### Complejidad

La cola nunca pasa de $q$ pares, porque cada extracción trae una inserción. Son
$q$ inserciones y $K$ vueltas: $O((q + K) \log q)$.

### Python

```python
import heapq
import sys


def primeras(consultas, k):
    # Los números de las primeras k respuestas, en orden.
    periodo = {}
    cola = []
    for num, p in consultas:
        periodo[num] = p
        heapq.heappush(cola, (p, num))
    salida = []
    respondidas = 0
    while respondidas < k:
        instante, num = heapq.heappop(cola)
        salida.append(str(num))
        heapq.heappush(cola, (instante + periodo[num], num))
        respondidas = respondidas + 1
    return salida


def main():
    datos = sys.stdin.read().split()
    pos = 0
    consultas = []
    while datos[pos] != '#':
        consultas.append((int(datos[pos + 1]), int(datos[pos + 2])))
        pos = pos + 3
    k = int(datos[pos + 1])
    print('\n'.join(primeras(consultas, k)))


main()
```

### C++

```cpp
#include <cstdio>
#include <functional>
#include <queue>
#include <utility>
#include <vector>

using namespace std;

int main() {
  // La cola saca primero el par menor: instante y, si empatan, número.
  priority_queue<pair<int, int>, vector<pair<int, int> >,
                 greater<pair<int, int> > > cola;
  vector<int> periodo(3001);
  char palabra[10];
  int num, p;
  while (scanf("%s", palabra) == 1 && palabra[0] != '#') {
    scanf("%d %d", &num, &p);
    periodo[num] = p;
    cola.push(make_pair(p, num));
  }
  int k;
  scanf("%d", &k);
  for (int i = 0; i < k; i++) {
    pair<int, int> menor = cola.top();
    cola.pop();
    printf("%d\n", menor.second);
    cola.push(make_pair(menor.first + periodo[menor.second], menor.second));
  }
  return 0;
}
```

## UVa 10341, Solve It

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

## UVa 11413, Fill the Containers

### Idea

La pregunta que se contesta de una pasada es si alcanza la capacidad $t$: se llena
el contenedor actual mientras quepa el recipiente siguiente, se abre otro cuando no
cabe, y $t$ alcanza si usa a lo más $m$. Con más capacidad nunca hacen falta más
contenedores, así que la decisión es monótona y se biseca entre el recipiente más
grande y la suma de todos.

### Complejidad

$O(\log S)$ decisiones de $O(n)$, con $S$ la suma de los recipientes:
$O(n \log S)$ por caso, sin importar $m$.

### Python

```python
import sys


def alcanza(c, m, t):
    # Con capacidad t, ¿bastan m contenedores?
    usados = 1
    lleno = 0
    for x in c:
        if lleno + x > t:
            usados = usados + 1
            lleno = x
        else:
            lleno = lleno + x
    return usados <= m


def menorCapacidad(c, m):
    # El menor t en [max(c), sum(c)] que cumple alcanza(c, m, t).
    lo = max(c)
    hi = sum(c)
    while lo < hi:
        medio = (lo + hi) // 2
        if alcanza(c, m, medio):
            hi = medio
        else:
            lo = medio + 1
    return lo


def main():
    datos = sys.stdin.read().split()
    pos = 0
    salida = []
    while pos < len(datos):
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
        c = [int(x) for x in datos[pos:pos + n]]
        pos = pos + n
        salida.append(str(menorCapacidad(c, m)))
    print('\n'.join(salida))


main()
```

### C++

```cpp
#include <cstdio>
#include <vector>

using namespace std;

bool alcanza(const vector<int> &c, int m, int t) {
  // Con capacidad t, bastan m contenedores?
  int usados = 1;
  int lleno = 0;
  for (size_t i = 0; i < c.size(); i++) {
    if (lleno + c[i] > t) {
      usados = usados + 1;
      lleno = c[i];
    } else {
      lleno = lleno + c[i];
    }
  }
  return usados <= m;
}

int menorCapacidad(const vector<int> &c, int m) {
  // El menor t en [max(c), suma(c)] que cumple alcanza(c, m, t).
  int lo = 0;
  int hi = 0;
  for (size_t i = 0; i < c.size(); i++) {
    if (c[i] > lo) {
      lo = c[i];
    }
    hi = hi + c[i];
  }
  while (lo < hi) {
    int medio = lo + (hi - lo) / 2;
    if (alcanza(c, m, medio)) {
      hi = medio;
    } else {
      lo = medio + 1;
    }
  }
  return lo;
}

int main() {
  int n, m;
  while (scanf("%d %d", &n, &m) == 2) {
    vector<int> c(n);
    for (int i = 0; i < n; i++) {
      scanf("%d", &c[i]);
    }
    printf("%d\n", menorCapacidad(c, m));
  }
  return 0;
}
```

## UVa 10810, Ultra-QuickSort

### Idea

Cada intercambio de vecinos arregla exactamente una pareja fuera de orden, así
que lo que se pide es el número de parejas $(i,j)$ con $i<j$ y $a_i > a_j$. Las
de un tramo se reparten en tres clases: las dos puntas en la mitad izquierda,
las dos en la derecha, y una en cada mitad. Las dos primeras son el mismo
problema más chico; la tercera se cuenta al mezclar, porque cuando sale un
elemento de la derecha todos los pendientes de la izquierda son mayores que él.

### Complejidad

Hay $\log_2 n$ niveles de llamadas y en cada uno la mezcla mueve los $n$
elementos una vez, de modo que el total es $\Theta(n \log n)$. El contador va en
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
