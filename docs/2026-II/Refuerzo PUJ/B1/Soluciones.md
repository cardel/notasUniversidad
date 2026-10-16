# Soluciones · Refuerzo PUJ B1

Los seis problemas del [bloque 1](./Bloque%201.%20Arreglos%20y%20matrices.md),
cada uno con la idea, lo que cuesta y el código en Python y en C++. Los
archivos están también en la carpeta `codigo/`, listos para compilar y
enviar al juez.

## Hora 1. UVa 11078, Open Credit System

### Idea

Para un $j$ fijo, el antiguo que más le saca es el de mayor puntaje entre $a[0], \dots, a[j-1]$. Ese máximo no se busca en cada vuelta: al avanzar $j$ entra un solo candidato, así que basta llevarlo actualizado en un recorrido. La respuesta es el mejor $\mathit{mayor} - a[j]$ que aparezca.

Probar todas las parejas cuesta $n(n-1)/2$, unos $5 \cdot 10^9$ con $n = 100\,000$. En Python, con $n = 10\,000$, esa versión tarda 2,8 s en un caso.

### Complejidad

$\Theta(n)$ por caso, con memoria $\Theta(n)$ para los puntajes.

### Python

Archivo: [open-credit-system.py](./codigo/open-credit-system.py)

```python
# UVa 11078 - Open Credit System
import sys


def mayor_diferencia(a):
    mayor = a[0]
    mejor = a[0] - a[1]
    for j in range(1, len(a)):
        if mayor - a[j] > mejor:
            mejor = mayor - a[j]
        if a[j] > mayor:
            mayor = a[j]
    return mejor


def main():
    datos = sys.stdin.read().split()
    t = int(datos[0])
    pos = 1
    for caso in range(t):
        n = int(datos[pos])
        a = []
        for k in range(n):
            a.append(int(datos[pos + 1 + k]))
        pos = pos + 1 + n
        print(mayor_diferencia(a))


main()
```

### C++

Archivo: [open-credit-system.cpp](./codigo/open-credit-system.cpp)

```cpp
// UVa 11078 - Open Credit System
#include <cstdio>
#include <vector>

using namespace std;

int mayor_diferencia(const vector<int>& a) {
    int mayor = a[0];
    int mejor = a[0] - a[1];
    for (int j = 1; j < (int) a.size(); j++) {
        if (mayor - a[j] > mejor) {
            mejor = mayor - a[j];
        }
        if (a[j] > mayor) {
            mayor = a[j];
        }
    }
    return mejor;
}

int main() {
    int t;
    scanf("%d", &t);
    for (int caso = 0; caso < t; caso++) {
        int n;
        scanf("%d", &n);
        vector<int> a(n);
        for (int k = 0; k < n; k++) {
            scanf("%d", &a[k]);
        }
        printf("%d\n", mayor_diferencia(a));
    }
    return 0;
}
```

## Hora 2. UVa 507, Jill Rides Again

### Idea

Se recorre la ruta llevando la suma del tramo que empezó en `inicio`. Un prefijo con suma negativa solo resta a lo que venga después, así que cuando la suma baja de cero se descarta y el tramo vuelve a empezar en la calle siguiente (la idea de Kadane).

El reinicio es con `suma < 0` y no con `suma <= 0`: un prefijo que suma cero no cambia la suma pero alarga el tramo, y el enunciado premia el largo. Al guardar el mejor, un tramo nuevo reemplaza al guardado si suma más, o si suma lo mismo y es estrictamente más largo. Con la comparación estricta, de dos tramos iguales en suma y en largo queda el primero que apareció, que es el de menor $i$.

Probar todos los tramos con acumulados cuesta $\Theta(s^2)$: en Python, una sola ruta de $20\,000$ paradas tarda 20,8 s.

### Complejidad

$\Theta(s)$ por ruta, con memoria $\Theta(s)$.

### Python

Archivo: [jill-rides-again.py](./codigo/jill-rides-again.py)

```python
# UVa 507 - Jill Rides Again
import sys


def mejor_tramo(v):
    # v[k] es la calle entre las paradas k + 1 y k + 2
    suma = 0
    inicio = 0
    mejor = 0
    mi = 0
    mj = -1
    for k in range(len(v)):
        suma = suma + v[k]
        if suma > mejor or (suma == mejor and k - inicio > mj - mi):
            mejor = suma
            mi = inicio
            mj = k
        if suma < 0:
            suma = 0
            inicio = k + 1
    return mejor, mi, mj


def main():
    datos = sys.stdin.read().split()
    b = int(datos[0])
    pos = 1
    for r in range(1, b + 1):
        s = int(datos[pos])
        v = []
        for k in range(s - 1):
            v.append(int(datos[pos + 1 + k]))
        pos = pos + s
        mejor, mi, mj = mejor_tramo(v)
        if mejor > 0:
            print("The nicest part of route %d is between stops %d and %d"
                  % (r, mi + 1, mj + 2))
        else:
            print("Route %d has no nice parts" % r)


main()
```

### C++

Archivo: [jill-rides-again.cpp](./codigo/jill-rides-again.cpp)

```cpp
// UVa 507 - Jill Rides Again
#include <cstdio>
#include <vector>

using namespace std;

// v[k] es la calle entre las paradas k + 1 y k + 2
long long mejor_tramo(const vector<int>& v, int& mi, int& mj) {
    long long suma = 0;
    int inicio = 0;
    long long mejor = 0;
    mi = 0;
    mj = -1;
    for (int k = 0; k < (int) v.size(); k++) {
        suma = suma + v[k];
        if (suma > mejor || (suma == mejor && k - inicio > mj - mi)) {
            mejor = suma;
            mi = inicio;
            mj = k;
        }
        if (suma < 0) {
            suma = 0;
            inicio = k + 1;
        }
    }
    return mejor;
}

int main() {
    int b;
    scanf("%d", &b);
    for (int r = 1; r <= b; r++) {
        int s;
        scanf("%d", &s);
        vector<int> v(s - 1);
        for (int k = 0; k < s - 1; k++) {
            scanf("%d", &v[k]);
        }
        int mi, mj;
        long long mejor = mejor_tramo(v, mi, mj);
        if (mejor > 0) {
            printf("The nicest part of route %d is between stops %d and %d\n",
                   r, mi + 1, mj + 2);
        } else {
            printf("Route %d has no nice parts\n", r);
        }
    }
    return 0;
}
```

## Hora 3. UVa 108, Maximum Sum

### Idea

Hay $(N(N+1)/2)^2 \approx 2{,}6 \cdot 10^7$ rectángulos. Sumarlos celda por celda es $O(N^6)$; con acumulados en dos dimensiones cada suma sale en $O(1)$ y el total baja a $O(N^4)$.

La solución fija dos filas, `arriba` y `abajo`. Cada rectángulo entre ellas es un tramo de columnas, y si cada columna se reemplaza por su suma entre esas filas, el problema es el tramo de suma máxima de un arreglo, que se resuelve con un recorrido (Kadane). Al bajar `abajo` una fila, a cada columna se le suma la celda nueva, así que `col` se actualiza en $\Theta(N)$.

### Complejidad

$N(N+1)/2$ pares de filas, cada uno con $\Theta(N)$ para actualizar `col` y $\Theta(N)$ para el recorrido: $O(N^3)$. Memoria $\Theta(N^2)$.

### Python

Archivo: [maximum-sum.py](./codigo/maximum-sum.py)

```python
# UVa 108 - Maximum Sum
import sys


def mejor_tramo(v):
    mejor = v[0]
    suma = 0
    for x in v:
        suma = suma + x
        if suma > mejor:
            mejor = suma
        if suma < 0:
            suma = 0
    return mejor


def mayor_rectangulo(m):
    n = len(m)
    mejor = m[0][0]
    for arriba in range(n):
        col = [0] * n
        for abajo in range(arriba, n):
            for c in range(n):
                col[c] = col[c] + m[abajo][c]
            s = mejor_tramo(col)
            if s > mejor:
                mejor = s
    return mejor


def main():
    datos = sys.stdin.read().split()
    n = int(datos[0])
    m = []
    for i in range(n):
        fila = []
        for j in range(n):
            fila.append(int(datos[1 + i * n + j]))
        m.append(fila)
    print(mayor_rectangulo(m))


main()
```

### C++

Archivo: [maximum-sum.cpp](./codigo/maximum-sum.cpp)

```cpp
// UVa 108 - Maximum Sum
#include <cstdio>
#include <vector>

using namespace std;

int mejor_tramo(const vector<int>& v) {
    int mejor = v[0];
    int suma = 0;
    for (int c = 0; c < (int) v.size(); c++) {
        suma = suma + v[c];
        if (suma > mejor) {
            mejor = suma;
        }
        if (suma < 0) {
            suma = 0;
        }
    }
    return mejor;
}

int mayor_rectangulo(const vector<vector<int>>& m) {
    int n = m.size();
    int mejor = m[0][0];
    for (int arriba = 0; arriba < n; arriba++) {
        vector<int> col(n, 0);
        for (int abajo = arriba; abajo < n; abajo++) {
            for (int c = 0; c < n; c++) {
                col[c] = col[c] + m[abajo][c];
            }
            int s = mejor_tramo(col);
            if (s > mejor) {
                mejor = s;
            }
        }
    }
    return mejor;
}

int main() {
    int n;
    scanf("%d", &n);
    vector<vector<int>> m(n, vector<int>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            scanf("%d", &m[i][j]);
        }
    }
    printf("%d\n", mayor_rectangulo(m));
    return 0;
}
```

## Tarea base. UVa 100, The 3n + 1 problem

### Idea

Una función calcula la longitud del ciclo de un número; otra recorre el rango del menor al mayor con un índice y conserva el máximo. Se ordena el rango solo para recorrerlo: lo que se imprime es la pareja original.

### Complejidad

Por pareja, $O((b-a+1) \cdot L)$ con $L$ la longitud media de ciclo, unos cientos de pasos para valores menores que 10 000. Memoria $O(1)$.

### Python

Archivo: [3n-plus-1.py](./codigo/3n-plus-1.py)

```python
import sys


def longitud_ciclo(n):
    cuenta = 1
    while n != 1:
        if n % 2 == 1:
            n = 3 * n + 1
        else:
            n = n // 2
        cuenta = cuenta + 1
    return cuenta


def maximo_ciclo(a, b):
    mejor = 0
    k = a
    while k <= b:
        c = longitud_ciclo(k)
        if c > mejor:
            mejor = c
        k = k + 1
    return mejor


def main():
    datos = sys.stdin.read().split()
    t = 0
    while t + 1 < len(datos):
        i = int(datos[t])
        j = int(datos[t + 1])
        if i <= j:
            m = maximo_ciclo(i, j)
        else:
            m = maximo_ciclo(j, i)
        print("%d %d %d" % (i, j, m))
        t = t + 2


main()
```

### C++

Archivo: [3n-plus-1.cpp](./codigo/3n-plus-1.cpp)

```cpp
#include <cstdio>

int longitud_ciclo(long long n) {
    int cuenta = 1;
    while (n != 1) {
        if (n % 2 == 1) {
            n = 3 * n + 1;
        } else {
            n = n / 2;
        }
        cuenta = cuenta + 1;
    }
    return cuenta;
}

int maximo_ciclo(int a, int b) {
    int mejor = 0;
    for (int k = a; k <= b; k++) {
        int c = longitud_ciclo(k);
        if (c > mejor) {
            mejor = c;
        }
    }
    return mejor;
}

int main() {
    int i, j;
    while (scanf("%d %d", &i, &j) == 2) {
        int m;
        if (i <= j) {
            m = maximo_ciclo(i, j);
        } else {
            m = maximo_ciclo(j, i);
        }
        printf("%d %d %d\n", i, j, m);
    }
    return 0;
}
```

## Tarea intermedia. UVa 10189, Minesweeper

### Idea

Para cada casilla libre se recorren los nueve desplazamientos $(df, dc) \in \{-1,0,1\}^2$ y se cuentan las minas dentro del tablero. Las casillas con mina se copian tal cual.

### Complejidad

$O(9nm)$ por campo, es decir $O(nm)$. Memoria $O(nm)$.

### Python

Archivo: [minesweeper.py](./codigo/minesweeper.py)

```python
import sys


def contar(campo, n, m, f, c):
    total = 0
    df = -1
    while df <= 1:
        dc = -1
        while dc <= 1:
            g = f + df
            h = c + dc
            if (df != 0 or dc != 0) and g >= 0 and g < n and h >= 0 and h < m:
                if campo[g][h] == "*":
                    total = total + 1
            dc = dc + 1
        df = df + 1
    return total


def main():
    datos = sys.stdin.read().split()
    pos = 0
    numero = 0
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
    while n != 0 or m != 0:
        campo = datos[pos:pos + n]
        pos = pos + n
        numero = numero + 1
        if numero > 1:
            print("")
        print("Field #%d:" % numero)
        f = 0
        while f < n:
            fila = ""
            c = 0
            while c < m:
                if campo[f][c] == "*":
                    fila = fila + "*"
                else:
                    fila = fila + str(contar(campo, n, m, f, c))
                c = c + 1
            print(fila)
            f = f + 1
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2


main()
```

### C++

Archivo: [minesweeper.cpp](./codigo/minesweeper.cpp)

```cpp
#include <cstdio>

char campo[105][105];

int contar(int n, int m, int f, int c) {
    int total = 0;
    for (int df = -1; df <= 1; df++) {
        for (int dc = -1; dc <= 1; dc++) {
            int g = f + df;
            int h = c + dc;
            if ((df != 0 || dc != 0) && g >= 0 && g < n && h >= 0 && h < m) {
                if (campo[g][h] == '*') {
                    total = total + 1;
                }
            }
        }
    }
    return total;
}

int main() {
    int n, m;
    int numero = 0;
    scanf("%d %d", &n, &m);
    while (n != 0 || m != 0) {
        for (int f = 0; f < n; f++) {
            scanf("%s", campo[f]);
        }
        numero = numero + 1;
        if (numero > 1) {
            printf("\n");
        }
        printf("Field #%d:\n", numero);
        for (int f = 0; f < n; f++) {
            for (int c = 0; c < m; c++) {
                if (campo[f][c] == '*') {
                    printf("*");
                } else {
                    printf("%d", contar(n, m, f, c));
                }
            }
            printf("\n");
        }
        scanf("%d %d", &n, &m);
    }
    return 0;
}
```

## Tarea exigente. UVa 10920, Spiral Tap

### Idea

Con centro $c = (SZ+1)/2$, el anillo $r$ contiene los números de $(2r-1)^2+1$ a $(2r+1)^2$. Se halla el menor $r$ con $(2r+1)^2 \ge P$ avanzando anillo por anillo desde el centro y se calcula $d = P - (2r-1)^2 - 1$, el desplazamiento dentro del anillo, que tiene $8r$ casillas en cuatro lados de $2r$:

- $0 \le d < 2r$: línea $c+r$, columna $c+r-1-d$ (lado de arriba, hacia la izquierda).
- $2r \le d < 4r$: columna $c-r$, línea $c+r-(d-2r+1)$ (lado izquierdo, hacia abajo).
- $4r \le d < 6r$: línea $c-r$, columna $c-r+(d-4r+1)$ (lado de abajo, hacia la derecha).
- $6r \le d < 8r$: columna $c+r$, línea $c-r+(d-6r+1)$ (lado derecho, hacia arriba).

Si $P = 1$ (anillo 0) la respuesta es el centro.

### Complejidad

$O(SZ)$ por consulta, porque el anillo se busca paso a paso. Memoria $O(1)$.

### Python

Archivo: [spiral-tap.py](./codigo/spiral-tap.py)

```python
import sys


def anillo(p):
    r = 0
    while (2 * r + 1) * (2 * r + 1) < p:
        r = r + 1
    return r


def coordenadas(sz, p):
    c = (sz + 1) // 2
    r = anillo(p)
    if r == 0:
        linea = c
        col = c
    else:
        d = p - (2 * r - 1) * (2 * r - 1) - 1
        if d < 2 * r:
            linea = c + r
            col = c + r - 1 - d
        elif d < 4 * r:
            linea = c + r - (d - 2 * r + 1)
            col = c - r
        elif d < 6 * r:
            linea = c - r
            col = c - r + (d - 4 * r + 1)
        else:
            linea = c - r + (d - 6 * r + 1)
            col = c + r
    return (linea, col)


def main():
    datos = sys.stdin.read().split()
    t = 0
    sz = int(datos[t])
    p = int(datos[t + 1])
    while sz != 0 or p != 0:
        res = coordenadas(sz, p)
        print("Line = %d, column = %d." % (res[0], res[1]))
        t = t + 2
        sz = int(datos[t])
        p = int(datos[t + 1])


main()
```

### C++

Archivo: [spiral-tap.cpp](./codigo/spiral-tap.cpp)

```cpp
#include <cstdio>

long long anillo(long long p) {
    long long r = 0;
    while ((2 * r + 1) * (2 * r + 1) < p) {
        r = r + 1;
    }
    return r;
}

int main() {
    long long sz, p;
    scanf("%lld %lld", &sz, &p);
    while (sz != 0 || p != 0) {
        long long c = (sz + 1) / 2;
        long long r = anillo(p);
        long long linea, col;
        if (r == 0) {
            linea = c;
            col = c;
        } else {
            long long d = p - (2 * r - 1) * (2 * r - 1) - 1;
            if (d < 2 * r) {
                linea = c + r;
                col = c + r - 1 - d;
            } else if (d < 4 * r) {
                linea = c + r - (d - 2 * r + 1);
                col = c - r;
            } else if (d < 6 * r) {
                linea = c - r;
                col = c - r + (d - 4 * r + 1);
            } else {
                linea = c - r + (d - 6 * r + 1);
                col = c + r;
            }
        }
        printf("Line = %lld, column = %lld.\n", linea, col);
        scanf("%lld %lld", &sz, &p);
    }
    return 0;
}
```
