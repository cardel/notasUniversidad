# Soluciones · Refuerzo PUJ 7 de noviembre

UVa 12100, UVa 156 y los tres problemas de la tarea de la
[sesión del 7 de noviembre](./7%20de%20noviembre.%20Recursi%C3%B3n,%20colas%20y%20diccionarios.md),
cada uno con la idea, lo que cuesta y el código en Python y en C++. Los
archivos están también en la carpeta `codigo/`. La solución de
[UVa 839](../B2/Soluciones.md#hora-3-uva-839-not-so-mobile) está con las del
24 de octubre.

## Hora 2. UVa 12100, Printer Queue

### Idea

Cada elemento de la cola es un par: la prioridad y si es el trabajo propio. Se saca el frente y se miran los contadores de las prioridades mayores. Si alguno es positivo, el par vuelve al final. Si no, se descuenta su contador, pasa un minuto, y la simulación termina cuando el par impreso es el marcado.

`cuenta[p]` guarda cuántos trabajos de prioridad `p` siguen en la cola, y solo baja al imprimir, porque rotar un trabajo no lo saca de ella. En Python el par es una tupla dentro de un `deque`; en C++, un `pair<int, bool>` dentro de una `queue`. El ciclo usa la bandera `impreso` como condición de salida. Comparar la prioridad en lugar de la marca da 2 en vez de 5 en el tercer caso de la muestra, y cobrar un minuto por rotar da 1, 7 y 7 en vez de 1, 2 y 5.

### Complejidad

Cada impresión deja a lo más $n$ rotaciones por delante, así que hay a lo más $n^2$ pasos con trabajo constante: $O(n^2)$ por caso, con memoria $\Theta(n)$. Con una lista de Python sacando del frente, cada paso paga $\Theta(n)$ y el total sube a $O(n^3)$.

### Python

Archivo: [printer-queue.py](./codigo/printer-queue.py)

```python
# UVa 12100 - Printer Queue
import sys
from collections import deque


def hay_mayor_prioridad(cuenta, p):
    hay = False
    for q in range(p + 1, 10):
        if cuenta[q] > 0:
            hay = True
    return hay


# cola de pares (prioridad, es_mio); cuenta[p] dice cuántos trabajos
# de prioridad p siguen en la cola
def minutos_hasta_imprimir(prioridades, m):
    cola = deque()
    cuenta = [0] * 10
    for i in range(len(prioridades)):
        cola.append((prioridades[i], i == m))
        cuenta[prioridades[i]] = cuenta[prioridades[i]] + 1
    minutos = 0
    impreso = False
    while not impreso:
        p, es_mio = cola.popleft()
        if hay_mayor_prioridad(cuenta, p):
            cola.append((p, es_mio))
        else:
            cuenta[p] = cuenta[p] - 1
            minutos = minutos + 1
            impreso = es_mio
    return minutos


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    pos = 1
    for c in range(casos):
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
        prioridades = []
        for i in range(n):
            prioridades.append(int(datos[pos + i]))
        pos = pos + n
        print(minutos_hasta_imprimir(prioridades, m))


main()
```

### C++

Archivo: [printer-queue.cpp](./codigo/printer-queue.cpp)

```cpp
// UVa 12100 - Printer Queue
#include <cstdio>
#include <queue>
#include <utility>
#include <vector>

using namespace std;

bool hayMayorPrioridad(const vector<int>& cuenta, int p) {
    bool hay = false;
    for (int q = p + 1; q < 10; q++) {
        if (cuenta[q] > 0) {
            hay = true;
        }
    }
    return hay;
}

// cola de pares (prioridad, es_mio); cuenta[p] dice cuántos trabajos
// de prioridad p siguen en la cola
int minutosHastaImprimir(const vector<int>& prioridades, int m) {
    queue<pair<int, bool> > cola;
    vector<int> cuenta(10, 0);
    for (int i = 0; i < (int) prioridades.size(); i++) {
        cola.push(make_pair(prioridades[i], i == m));
        cuenta[prioridades[i]] = cuenta[prioridades[i]] + 1;
    }
    int minutos = 0;
    bool impreso = false;
    while (!impreso) {
        pair<int, bool> trabajo = cola.front();
        cola.pop();
        if (hayMayorPrioridad(cuenta, trabajo.first)) {
            cola.push(trabajo);
        } else {
            cuenta[trabajo.first] = cuenta[trabajo.first] - 1;
            minutos = minutos + 1;
            impreso = trabajo.second;
        }
    }
    return minutos;
}

int main() {
    int casos;
    scanf("%d", &casos);
    for (int c = 0; c < casos; c++) {
        int n, m;
        scanf("%d %d", &n, &m);
        vector<int> prioridades(n);
        for (int i = 0; i < n; i++) {
            scanf("%d", &prioridades[i]);
        }
        printf("%d\n", minutosHastaImprimir(prioridades, m));
    }
    return 0;
}
```

## Hora 3. UVa 156, Ananagrams

### Idea

Se lee palabra por palabra hasta el `#`, se guarda cada palabra y se suma uno a la cuenta de su clave. Al final se ordenan las palabras originales y se imprimen las que tienen cuenta 1 en su clave.

`clave(palabra)` devuelve las letras en minúscula y ordenadas; en C++ usa `tolower` y `sort` sobre una copia. La lectura va por palabras, con `split` en Python y `scanf("%s", leida)` en C++, de modo que los saltos de línea y los espacios sobrantes no cambian nada. Armar la clave sin pasar a minúscula da 16 palabras en vez de 7 en la muestra. El enunciado no resuelve una palabra repetida ni la pareja `a` y `A`; con esta clave ambas cuentan como anagramas.

### Complejidad

$O(n\,L \log L)$ para las claves y $O(n \log n)$ comparaciones para ordenar la salida. Comparar una palabra con todas las demás pagaría $\Theta(n^2)$ comparaciones de claves.

### Python

Archivo: [ananagrams.py](./codigo/ananagrams.py)

```python
# UVa 156 - Ananagrams
import sys


def clave(palabra):
    # las letras en minúscula y ordenadas: dos anagramas dan la misma clave
    letras = sorted(palabra.lower())
    resultado = ""
    for c in letras:
        resultado = resultado + c
    return resultado


def main():
    datos = sys.stdin.read().split()
    palabras = []
    cuenta = {}
    i = 0
    while i < len(datos) and datos[i] != "#":
        k = clave(datos[i])
        if k in cuenta:
            cuenta[k] = cuenta[k] + 1
        else:
            cuenta[k] = 1
        palabras.append(datos[i])
        i = i + 1
    for p in sorted(palabras):
        if cuenta[clave(p)] == 1:
            print(p)


main()
```

### C++

Archivo: [ananagrams.cpp](./codigo/ananagrams.cpp)

```cpp
// UVa 156 - Ananagrams
#include <algorithm>
#include <cctype>
#include <cstdio>
#include <map>
#include <string>
#include <vector>

using namespace std;

// las letras en minúscula y ordenadas: dos anagramas dan la misma clave
string clave(const string& palabra) {
    string k = palabra;
    for (int i = 0; i < (int) k.size(); i++) {
        k[i] = tolower(k[i]);
    }
    sort(k.begin(), k.end());
    return k;
}

int main() {
    char leida[100];
    vector<string> palabras;
    map<string, int> cuenta;
    int ok = scanf("%s", leida);
    while (ok == 1 && leida[0] != '#') {
        string p = leida;
        cuenta[clave(p)] = cuenta[clave(p)] + 1;
        palabras.push_back(p);
        ok = scanf("%s", leida);
    }
    sort(palabras.begin(), palabras.end());
    for (int i = 0; i < (int) palabras.size(); i++) {
        if (cuenta[clave(palabras[i])] == 1) {
            printf("%s\n", palabras[i].c_str());
        }
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
