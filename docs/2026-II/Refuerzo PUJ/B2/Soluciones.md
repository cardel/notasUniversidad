# Soluciones · Refuerzo PUJ B2

Los seis problemas del [bloque 2](./Bloque%202.%20Conteo%20y%20recursi%C3%B3n.md),
cada uno con la idea, lo que cuesta y el código en Python y en C++. Los
archivos están también en la carpeta `codigo/`, listos para compilar y
enviar al juez.

## Hora 5. UVa 12149, Feynman

### Idea

Un cuadrado de lado $\ell$ queda fijo por su esquina de arriba a la izquierda, que puede estar en $N - \ell + 1$ filas y en otras tantas columnas. El triple ciclo sobre el lado, la fila y la columna de la esquina corre su cuerpo una vez por cuadrado, y con el lado congelado lo corre $(N - \ell + 1)^2$ veces. Con $m = N - \ell + 1$ la suma queda

$$\sum_{\ell=1}^{N} (N - \ell + 1)^2 = \sum_{m=1}^{N} m^2 = \frac{N(N+1)(2N+1)}{6},$$

que con $N = 8$ da 204, como en la muestra. La solución evalúa la fórmula. El producto siempre es múltiplo de 6, así que en Python la división es `//`; en C++ el producto más grande, $100 \cdot 101 \cdot 201 = 2\,030\,100$, cabe en `int`.

Recorrer la esquina hasta $N - \ell$ sin incluirlo da 140 con $N = 8$, y contar solo los cuadrados de lado 1 da 4 con $N = 2$. El 0 del final no lleva respuesta.

### Complejidad

$O(1)$ por caso. El triple ciclo cuesta $\Theta(N^3)$ y, con $N = 100$, su cuerpo corre $338\,350$ veces, así que también alcanzaría.

### Python

Archivo: [feynman.py](./codigo/feynman.py)

```python
# UVa 12149 - Feynman
import sys


def cuadrados(n):
    # suma de m * m para m de 1 a n: los cuadrados de lado n - m + 1
    return n * (n + 1) * (2 * n + 1) // 6


def main():
    datos = sys.stdin.read().split()
    pos = 0
    n = int(datos[pos])
    while n != 0:
        print(cuadrados(n))
        pos = pos + 1
        n = int(datos[pos])


main()
```

### C++

Archivo: [feynman.cpp](./codigo/feynman.cpp)

```cpp
// UVa 12149 - Feynman
#include <cstdio>

// suma de m * m para m de 1 a n: los cuadrados de lado n - m + 1
int cuadrados(int n) {
    return n * (n + 1) * (2 * n + 1) / 6;
}

int main() {
    int n;
    scanf("%d", &n);
    while (n != 0) {
        printf("%d\n", cuadrados(n));
        scanf("%d", &n);
    }
    return 0;
}
```

## Hora 6. UVa 839, Not so Mobile

### Idea

Las barras llegan de arriba hacia abajo y de izquierda a derecha, así que el móvil se lee con una función recursiva. `movil` lee una barra y, por cada extremo con peso 0, se llama a sí misma; esa llamada lee el submóvil completo y devuelve su peso y si está en equilibrio. Con los dos pesos reales compara $W_l D_l$ con $W_r D_r$. El extremo con objeto es el caso base y el de peso 0 el caso recursivo.

En Python la función recibe la lista de palabras y la posición donde empieza la barra, y devuelve el peso, el equilibrio y la posición donde sigue la entrada. En C++ lee con `scanf`, devuelve el peso y deja el equilibrio en una variable por referencia. Los pesos van en `long long` porque el enunciado no los acota, y Python sube su límite de recursión porque tampoco da la altura del móvil.

La función lee todas las líneas del submóvil aunque ya sepa que la respuesta es `NO`: si dejara de leer, las líneas restantes entrarían como el caso siguiente. Tampoco basta con mirar la barra de arriba, que puede estar en equilibrio con sus dos submóviles desequilibrados.

### Complejidad

$\Theta(L)$ por caso, con $L$ líneas: una llamada por barra y trabajo constante en cada una. La pila llega a la altura del móvil.

### Python

Archivo: [not-so-mobile.py](./codigo/not-so-mobile.py)

```python
# UVa 839 - Not so Mobile
import sys


def movil(datos, pos):
    # lee la barra que empieza en datos[pos] y todo lo que cuelga de ella;
    # devuelve el peso, si está en equilibrio y dónde sigue la entrada
    wl = int(datos[pos])
    dl = int(datos[pos + 1])
    wr = int(datos[pos + 2])
    dr = int(datos[pos + 3])
    pos = pos + 4
    equilibrio = True
    if wl == 0:
        wl, eq_izq, pos = movil(datos, pos)
        equilibrio = equilibrio and eq_izq
    if wr == 0:
        wr, eq_der, pos = movil(datos, pos)
        equilibrio = equilibrio and eq_der
    if wl * dl != wr * dr:
        equilibrio = False
    return wl + wr, equilibrio, pos


def main():
    sys.setrecursionlimit(10000)
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    pos = 1
    for c in range(casos):
        peso, equilibrio, pos = movil(datos, pos)
        if c > 0:
            print("")
        if equilibrio:
            print("YES")
        else:
            print("NO")


main()
```

### C++

Archivo: [not-so-mobile.cpp](./codigo/not-so-mobile.cpp)

```cpp
// UVa 839 - Not so Mobile
#include <cstdio>

// lee la barra y todo lo que cuelga de ella; devuelve el peso y deja
// equilibrio en false si alguna barra del submóvil no está en equilibrio
long long movil(bool& equilibrio) {
    long long wl, dl, wr, dr;
    scanf("%lld %lld %lld %lld", &wl, &dl, &wr, &dr);
    if (wl == 0) {
        wl = movil(equilibrio);
    }
    if (wr == 0) {
        wr = movil(equilibrio);
    }
    if (wl * dl != wr * dr) {
        equilibrio = false;
    }
    return wl + wr;
}

int main() {
    int casos;
    scanf("%d", &casos);
    for (int c = 0; c < casos; c++) {
        bool equilibrio = true;
        movil(equilibrio);
        if (c > 0) {
            printf("\n");
        }
        if (equilibrio) {
            printf("YES\n");
        } else {
            printf("NO\n");
        }
    }
    return 0;
}
```

## Hora 7. UVa 11173, Grey Codes

### Idea

Construir la lista cuesta $2^n$ números por caso, más de mil millones con $n = 30$. La recursión trabaja sobre el rango de posiciones $[ini, fin)$, que empieza en $[0, 2^n)$:

- un rango de una posición tiene el código 0;
- si $k$ cae en la mitad de arriba, el bit es 0 y se sigue con $[ini, mitad)$ y la misma $k$;
- si cae en la de abajo, el bit es 1, que vale $mitad - ini$, y se sigue con $[ini, mitad)$ y la posición reflejada $ini + fin - 1 - k$, porque esa mitad repite la de arriba al revés.

Con $n = 3$ y $k = 5$ la respuesta es $4 + 2 + 1 + 0 = 7$. Restar la mitad en lugar de reflejar, con $k - (mitad - ini)$, hace que la función devuelva $k$, el número en binario. En C++ los rangos van en `long long`, porque con $n = 30$ el valor $ini + fin - 1$ llega a $2^{31} - 1$.

### Complejidad

$T(m) = T(m/2) + c$ con $m = 2^n$: $n + 1$ llamadas por caso, 31 como máximo. Con $250\,000$ casos de $n$ al azar entre 1 y 30, la solución en Python tardó 0,94 s y la de C++ 0,11 s (Python 3.14, Ryzen 5 3600).

### Python

Archivo: [grey-codes.py](./codigo/grey-codes.py)

```python
# UVa 11173 - Grey Codes
import sys


def gris(ini, fin, k):
    # código que ocupa la posición k del rango [ini, fin) de posiciones
    if fin - ini == 1:
        codigo = 0
    else:
        mitad = (ini + fin) // 2
        if k < mitad:
            # mitad de arriba: bit 0, mismo orden
            codigo = gris(ini, mitad, k)
        else:
            # mitad de abajo: bit 1, la de arriba reflejada
            codigo = (mitad - ini) + gris(ini, mitad, ini + fin - 1 - k)
    return codigo


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    salida = []
    for c in range(casos):
        n = int(datos[1 + 2 * c])
        k = int(datos[2 + 2 * c])
        salida.append(str(gris(0, 2 ** n, k)))
    print("\n".join(salida))


main()
```

### C++

Archivo: [grey-codes.cpp](./codigo/grey-codes.cpp)

```cpp
// UVa 11173 - Grey Codes
#include <cstdio>

// código que ocupa la posición k del rango [ini, fin) de posiciones
long long gris(long long ini, long long fin, long long k) {
    long long codigo;
    if (fin - ini == 1) {
        codigo = 0;
    } else {
        long long mitad = (ini + fin) / 2;
        if (k < mitad) {
            // mitad de arriba: bit 0, mismo orden
            codigo = gris(ini, mitad, k);
        } else {
            // mitad de abajo: bit 1, la de arriba reflejada
            codigo = (mitad - ini) + gris(ini, mitad, ini + fin - 1 - k);
        }
    }
    return codigo;
}

int main() {
    int casos;
    scanf("%d", &casos);
    for (int c = 0; c < casos; c++) {
        int n;
        long long k;
        scanf("%d %lld", &n, &k);
        long long fin = 1;
        for (int i = 0; i < n; i++) {
            fin = fin * 2;
        }
        printf("%lld\n", gris(0, fin, k));
    }
    return 0;
}
```

## Tarea base. UVa 10079, Pizza Cutting

### Idea

Sea $T(n)$ el máximo de trozos con $n$ cortes. Sin cortes hay un trozo, $T(0) = 1$. El corte número $n$ puede cruzar a los $n - 1$ anteriores en puntos distintos, que lo dividen en $n$ tramos, y cada tramo parte en dos un trozo que ya existía:

$$T(n) = T(n-1) + n, \qquad T(0) = 1,$$

y al desenrollar, $T(n) = 1 + (1 + 2 + \cdots + n) = n(n+1)/2 + 1$. La suma es la misma que cuenta las vueltas de un ciclo triangular, y aquí el ciclo sobra porque la suma tiene fórmula cerrada.

El producto $n(n+1)$ se hace antes de dividir y siempre es par. Con $N = 210\,000\,000$ el resultado es $22\,050\,000\,105\,000\,001$, así que en C++ todo va en `long long`; el producto intermedio ya desborda 32 bits cerca de $N = 46\,341$. La lectura se detiene en el primer negativo.

### Complejidad

$O(1)$ por consulta. Un ciclo que sumara de 1 a $N$ costaría hasta $2{,}1 \times 10^8$ pasos por línea.

### Python

Archivo: [pizza-cutting.py](./codigo/pizza-cutting.py)

```python
# UVa 10079 - Pizza Cutting
import sys


def piezas(n):
    r = n * (n + 1) // 2 + 1
    return r


def main():
    datos = sys.stdin.read().split()
    t = 0
    n = 0
    while t < len(datos) and n >= 0:
        n = int(datos[t])
        if n >= 0:
            print(piezas(n))
        t = t + 1


main()
```

### C++

Archivo: [pizza-cutting.cpp](./codigo/pizza-cutting.cpp)

```cpp
// UVa 10079 - Pizza Cutting
#include <cstdio>

long long piezas(long long n) {
    long long r = n * (n + 1) / 2 + 1;
    return r;
}

int main() {
    long long n;
    int seguir = 1;
    while (seguir == 1 && scanf("%lld", &n) == 1) {
        if (n < 0) {
            seguir = 0;
        } else {
            printf("%lld\n", piezas(n));
        }
    }
    return 0;
}
```

## Tarea intermedia. UVa 913, Joana and the Odd Numbers

### Idea

La fila $k$ tiene $N = 2k - 1$ números, así que $k = (N+1)/2$. Hasta el final de la fila $k$ se han escrito $1 + 3 + \cdots + (2k-1) = k^2$ impares, y el impar de posición $p$ vale $2p - 1$, de modo que el último de la fila es $L = 2k^2 - 1$. Los tres últimos son $L - 4$, $L - 2$ y $L$, con suma $3L - 6$. Con $N = 3$: $k = 2$, $L = 7$ y la suma es 15.

En C++ todo es `long long`. Con $N = 999\,999\,999$ se tiene $k = 5 \times 10^8$ y $2k^2 = 5 \times 10^{17}$, que cabe en 64 bits pero no en 32; si `k` fuera `int`, el producto $k \cdot k$ desbordaría antes de ampliarse. Los tres últimos de la fila difieren de a 2.

### Complejidad

$O(1)$ por consulta. Recorrer las filas sería $O(k)$, hasta $5 \times 10^8$ pasos por consulta.

### Python

Archivo: [joana-odd-numbers.py](./codigo/joana-odd-numbers.py)

```python
# UVa 913 - Joana and the Odd Numbers
import sys


def suma_ultimos(n):
    k = (n + 1) // 2
    ultimo = 2 * k * k - 1
    return 3 * ultimo - 6


def main():
    datos = sys.stdin.read().split()
    t = 0
    while t < len(datos):
        print(suma_ultimos(int(datos[t])))
        t = t + 1


main()
```

### C++

Archivo: [joana-odd-numbers.cpp](./codigo/joana-odd-numbers.cpp)

```cpp
// UVa 913 - Joana and the Odd Numbers
#include <cstdio>

long long suma_ultimos(long long n) {
    long long k = (n + 1) / 2;
    long long ultimo = 2 * k * k - 1;
    long long s = 3 * ultimo - 6;
    return s;
}

int main() {
    long long n;
    while (scanf("%lld", &n) == 1) {
        printf("%lld\n", suma_ultimos(n));
    }
    return 0;
}
```

## Tarea exigente. UVa 620, Cellular Structure

### Idea

La definición ya es una recursión. Para la cadena en las posiciones `ini..fin`:

1. Si tiene una sola célula y es `A`, es simple.
2. Si termina en `AB` y lo que queda, de `ini` a `fin-2`, es sana, es crecida.
3. Si empieza con `B`, termina en `A` y lo de adentro, de `ini+1` a `fin-1`, es sana, es mutagénica.
4. En otro caso, es mutante.

Los casos 2 y 3 no se pisan, porque uno exige terminar en `B` y el otro en `A`. Traza para `BAABA`, posiciones 0 a 4:

| llamada | `ini..fin` | primera y última | resultado |
|---|---|---|---|
| 1 | 0..4 | `B`, `A` | mutagénica si la 2 es sana |
| 2 | 1..3 | `A`, `B` | crecida si la 3 es sana |
| 3 | 1..1 | `A` | simple |

La función devuelve un código, 0 mutante, 1 simple, 2 crecida y 3 mutagénica, con un solo `return`, y un arreglo de nombres lo traduce a la salida. La condición `n >= 3` asegura que el interior no sea vacío: `AB` y `BA` son mutantes. Como `&&` se evalúa de izquierda a derecha y se detiene en el primer falso, la llamada recursiva ocurre solo cuando los extremos ya cuadran. Nunca se copia una subcadena: `s[1:-1]` costaría $\Theta(n)$ por nivel.

### Complejidad

$T(m) = T(m-2) + c$ con $T(1) = c'$, así que $T(m) = \Theta(m)$. La memoria es $O(n)$ por la pila de llamadas, de profundidad hasta $n/2$.

### Python

Archivo: [cellular-structure.py](./codigo/cellular-structure.py)

```python
# UVa 620 - Cellular Structure
import sys

sys.setrecursionlimit(100000)


# 0 mutante, 1 simple, 2 crecido, 3 mutagenico; s[ini..fin] inclusive
def clasificar(s, ini, fin):
    r = 0
    n = fin - ini + 1
    if n == 1 and s[ini] == "A":
        r = 1
    elif n >= 3 and s[fin - 1] == "A" and s[fin] == "B" and clasificar(s, ini, fin - 2) != 0:
        r = 2
    elif n >= 3 and s[ini] == "B" and s[fin] == "A" and clasificar(s, ini + 1, fin - 1) != 0:
        r = 3
    return r


def main():
    datos = sys.stdin.read().split()
    nombres = ["MUTANT", "SIMPLE", "FULLY-GROWN", "MUTAGENIC"]
    casos = int(datos[0])
    t = 1
    while t <= casos and t < len(datos):
        s = datos[t]
        print(nombres[clasificar(s, 0, len(s) - 1)])
        t = t + 1


main()
```

### C++

Archivo: [cellular-structure.cpp](./codigo/cellular-structure.cpp)

```cpp
// UVa 620 - Cellular Structure
#include <cstdio>
#include <cstring>

// 0 mutante, 1 simple, 2 crecido, 3 mutagenico; s[ini..fin] inclusive
int clasificar(const char *s, int ini, int fin) {
    int r = 0;
    int n = fin - ini + 1;
    if (n == 1 && s[ini] == 'A') {
        r = 1;
    } else if (n >= 3 && s[fin - 1] == 'A' && s[fin] == 'B' && clasificar(s, ini, fin - 2) != 0) {
        r = 2;
    } else if (n >= 3 && s[ini] == 'B' && s[fin] == 'A' && clasificar(s, ini + 1, fin - 1) != 0) {
        r = 3;
    }
    return r;
}

int main() {
    const char *nombres[4] = {"MUTANT", "SIMPLE", "FULLY-GROWN", "MUTAGENIC"};
    static char s[1000005];
    int casos;
    if (scanf("%d", &casos) == 1) {
        int t = 0;
        while (t < casos && scanf("%1000000s", s) == 1) {
            printf("%s\n", nombres[clasificar(s, 0, (int)strlen(s) - 1)]);
            t = t + 1;
        }
    }
    return 0;
}
```
