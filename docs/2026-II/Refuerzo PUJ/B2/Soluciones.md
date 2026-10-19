# Soluciones · Refuerzo PUJ B2

UVa 839 y los tres problemas de la tarea del
[bloque 2](./Bloque%202.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md),
cada uno con la idea, lo que cuesta y el código en Python y en C++. Los
archivos están también en la carpeta `codigo/`, listos para compilar y
enviar al juez. Las soluciones de
[UVa 507](../B1/Soluciones.md#uva-507-jill-rides-again) y
[UVa 108](../B1/Soluciones.md#uva-108-maximum-sum) están con las del
bloque 1.

## Hora 3. UVa 839, Not so Mobile

### Idea

Las líneas listan las barras de arriba hacia abajo y de izquierda a derecha, así que el móvil se lee con una función recursiva. `movil` lee una barra; por cada extremo con peso 0 se llama a sí misma, y esa llamada lee el submóvil completo y devuelve su peso y si está en equilibrio. Con los dos pesos de verdad compara $W_l D_l$ con $W_r D_r$. El extremo con objeto es el caso base, el de peso 0 el caso recursivo, y el árbol de llamadas es el mismo móvil.

En Python la función recibe la lista de palabras y la posición donde empieza la barra, y devuelve el peso, el equilibrio y la posición donde sigue la entrada. En C++ lee con `scanf`, devuelve el peso y recibe el equilibrio por referencia: una barra que falla lo pone en `false`. Las dos leen el submóvil entero aunque ya sepan que la respuesta es `NO`; si dejaran líneas sin leer, el caso siguiente empezaría en una línea que no le corresponde. Los pesos van en `long long` porque el enunciado no los acota.

### Complejidad

$\Theta(n)$ por caso, con $n$ barras: una llamada por barra y trabajo fijo en cada una. La pila llega a la altura del móvil, y como el enunciado no la acota, la versión en Python sube el límite de recursión.

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

Nueve desplazamientos por casilla, un número fijo: $O(nm)$ por campo, con $O(nm)$ de memoria.

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

## Tarea exigente. UVa 620, Cellular Structure

### Idea

La definición ya es una recursión. Para la cadena en las posiciones `ini..fin`:

1. Si tiene una sola célula y es `A`, es simple.
2. Si termina en `AB` y lo que queda, de `ini` a `fin-2`, es sana, es crecida.
3. Si empieza con `B`, termina en `A` y lo de adentro, de `ini+1` a `fin-1`, es sana, es mutagénica.
4. En otro caso, es mutante.

Los casos 2 y 3 no se pisan: uno exige terminar en `B` y el otro en `A`, y el caso 1 se distingue por su longitud. La condición `n >= 3` asegura que el interior no quede vacío, así que `AB` y `BA` son mutantes. Como `&&` se evalúa de izquierda a derecha y se detiene en el primer falso, la llamada recursiva solo ocurre cuando los extremos ya cuadran. La función devuelve un código, 0 mutante, 1 simple, 2 crecida y 3 mutagénica, y un arreglo de nombres lo traduce a la palabra de la salida.

Traza para `BAABA` (posiciones 0 a 4):

| llamada | `ini..fin` | primera y última | resultado |
|---|---|---|---|
| 1 | 0..4 | `B`, `A` | mutagénica si la 2 es sana |
| 2 | 1..3 | `A`, `B` | crecida si la 3 es sana |
| 3 | 1..1 | `A` | simple |

De la llamada 3 hacia arriba: simple, luego crecida, luego mutagénica.

### Complejidad

$O(n)$ por cadena de largo $n$: cada llamada hace a lo más una llamada recursiva, sobre un tramo dos células más corto, y nunca copia una subcadena. La pila llega a $n/2$ marcos. Copiar el interior en cada llamada costaría $\Theta(n)$ por nivel y llevaría el total a $\Theta(n^2)$.

### Python

Archivo: [cellular-structure.py](./codigo/cellular-structure.py)

```python
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
