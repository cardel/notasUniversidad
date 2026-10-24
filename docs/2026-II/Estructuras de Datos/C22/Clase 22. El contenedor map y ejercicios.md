# Estructuras de Datos · Clase 22. El contenedor map y ejercicios

Viernes 23 de octubre de 2026, de 14:00 a 17:00.

La tabla hash con encadenamiento busca e inserta en $\Theta(1 + \alpha)$ en
promedio, pero recorre sus claves en el orden de las casillas. Cuando la salida
tiene que ir en orden de clave, eso obliga a copiar y ordenar al final. Esta
sesión presenta el contenedor `map` de la biblioteca de C++, un diccionario que
guarda las parejas ordenadas por clave desde que entran, mide lo que cuesta cada
operación y lo pone frente a la tabla hash en problemas de juez y ejercicios.
Después llega `unordered_map`, la tabla hash de la biblioteca, con sus funciones
hash, su factor de carga y su rehash, y al final una persona entera como clave
de los dos contenedores.

Al terminar, el objetivo es poder usar `map<K, V>` para insertar con `[]`,
consultar con `count` y `find`, eliminar con `erase` y recorrer las claves de
menor a mayor con un iterador; seguir a mano el contenido de un `map`, incluida
la inserción que hace `[]` cuando solo se quería consultar; dar el costo de cada
operación y compararlo con el de la tabla hash; y escoger entre las dos según lo
que pide el problema.

También se trata de usar `unordered_map<K, V>`, explicar su factor de carga y su
rehash y preferirlo al `map` cuando el orden no hace falta; comparar las
funciones hash de división, multiplicación, Horner y `std::hash` por cómo
reparten y por lo que cuestan; y usar un `struct` como clave, con un orden para
el `map` y con un hash y su igualdad para el `unordered_map`.

## Diapositivas

![](./clase22.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: la tabla hash con encadenamiento

$h(k) = k \bmod m$ lleva cada clave a una de $m$ casillas, y cada casilla es la
cabeza de una lista enlazada. Insertar al frente cuesta $\Theta(1)$; buscar y
eliminar recorren una lista, $\Theta(1 + \alpha)$ en promedio con
$\alpha = n/m$ y $\Theta(n)$ en el peor caso. El espacio es $\Theta(m + n)$.

## Un problema donde importa el orden

Una tienda anota cada entrada de mercancía con el código del producto y la
cantidad. Al cerrar el día imprime, por cada código, el total recibido, de menor
a mayor código. Con los registros (305, 4), (112, 2), (305, 1), (87, 6) y
(112, 3) la salida es `87 6`, `112 5` y `305 5`: va por código, no por orden de
llegada. Los códigos llegan hasta $10^9$, así que la tabla directa no cabe.

**Primera idea: la tabla hash.** Sumar es buscar e insertar, $\Theta(1 + \alpha)$
en promedio por registro. Pero con $m = 7$ las claves 305, 112, 87 y 450 van a
las casillas 4, 0, 3 y 2, y el recorrido imprime `112 450 87 305`: la tabla
ordena por casilla, no por clave. Copiar y ordenar al final cuesta
$\Theta(m + n)$ más $\Theta(n \log n)$, y se paga otra vez cada que se pide el
orden.

**Segunda idea: un vector ordenado.** Buscar es una búsqueda binaria,
$\Theta(\log n)$, pero un código nuevo menor que todos corre a los demás una
casilla: insertar cuesta $\Theta(n)$.

Con el vector `3 7 9 12` y un 2 que llega, la búsqueda binaria encuentra en dos
comparaciones que el 2 va en la posición 0, pero antes de escribirlo hay que
correr el 12, el 9, el 7 y el 3 una casilla a la derecha, empezando por el
último para no pisar ninguno. Queda `2 3 7 9 12`: dos comparaciones para
buscar y cuatro movimientos para abrir el hueco, que con $n$ elementos son $n$.

| | Buscar | Insertar un código nuevo | Recorrer en orden |
|---|---|---|---|
| Tabla hash | $\Theta(1 + \alpha)$ promedio | $\Theta(1 + \alpha)$ promedio | $\Theta(m + n) + \Theta(n \log n)$ |
| Vector ordenado | $\Theta(\log n)$ | $\Theta(n)$ | $\Theta(n)$ |
| Lo que se quiere | $O(\log n)$ | $O(\log n)$ | $\Theta(n)$ |

## El contenedor map

Un `map<K, V>` guarda parejas $(\mathit{clave}, \mathit{valor})$ con claves
distintas, siempre en orden creciente de clave. Se busca por clave, como en la
tabla hash, y se recorre de la menor clave a la mayor, como un vector ordenado.
La clave tiene que poderse comparar con `<`; no hace falta una función hash. La
biblioteca lo guarda en un árbol balanceado, una estructura que el curso
construye más adelante (CLRS, cap. 13), y de ella salen los costos de abajo.

| Operación | Qué hace |
|---|---|
| `m[k]` | el valor de `k`; si `k` no está, inserta $(k, 0)$ y devuelve ese 0 |
| `m[k] = v` | inserta $(k, v)$, o cambia el valor si `k` ya estaba |
| `m.count(k)` | 1 si `k` está, 0 si no; no inserta |
| `m.find(k)` | iterador a la pareja de `k`, o `m.end()` si no está |
| `m.erase(k)` | saca la pareja de `k`; devuelve cuántas sacó, 1 o 0 |
| `m.size()`, `m.empty()` | cuántas parejas hay; si no hay ninguna |
| `m.begin()`, `m.end()` | iterador a la menor clave; iterador después de la mayor |
| `it->first`, `it->second` | la clave y el valor de la pareja a la que apunta `it` |

`it->second` se puede cambiar; `it->first` no, porque cambiar una clave en su
sitio rompería el orden.

### Paso a paso

`inv[305] = 4` hace dos cosas: `inv[305]` busca 305 y, al no hallarlo, lo
inserta con 0; después la asignación pone el 4. Cuando la clave ya está,
`inv[305]` devuelve su valor sin insertar.

| Línea | Contenido, en orden | `size()` |
|---|---|---|
| `map<int, int> inv;` | (vacío) | 0 |
| `inv[305] = 4;` | (305, 4) | 1 |
| `inv[112] = 2;` | (112, 2) (305, 4) | 2 |
| `inv[305] = inv[305] + 1;` | (112, 2) (305, 5) | 2 |
| `inv[87] = 6;` | (87, 6) (112, 2) (305, 5) | 3 |
| `inv.erase(305);` | (87, 6) (112, 2) | 2 |

112 queda antes de 305 aunque llegó después, y 87 pasa a ser la menor clave, a
la que apunta `begin()`. `size()` sube solo cuando entra una clave que no
estaba y baja solo con `erase`.

### Buscar, contar y eliminar

Con (87, 6) (112, 2) (305, 5), `inv.find(112)` devuelve un iterador `f` con
`f->first` igual a 112 y `f->second` igual a 2; `inv.find(200)` devuelve
`inv.end()`, la posición después de la mayor clave, que no guarda ninguna
pareja y se compara antes de leer `->second`. `inv.count(112)` da 1 y
`inv.count(200)` da 0. Dos llamadas seguidas a `inv.erase(305)` devuelven 1 y
0: sacar una clave que no está es válido. Ninguna de las tres inserta.

`end()` no apunta a la última pareja sino a la casilla que sigue, como la
puerta de un salón, que queda después del último puesto. El iterador que
devuelve `find` señala la pareja guardada dentro del `map`; un `int`, en
cambio, guarda una copia del valor:

```cpp
map<int, int>::iterator f = inv.find(112);
int copia = f->second;   // copia el valor: 2
copia = 9;               // inv[112] sigue en 2
f->second = 9;           // inv[112] pasa a 9
```

Cambiar `copia` no toca el `map`; cambiar `f->second` sí. El programa completo
está en [iterador_valor.cpp](./codigo/iterador_valor.cpp).

### Recorrer en orden

El recorrido es el de `vector` y `list`: un iterador desde `begin()` hasta
`end()`. `it->first` es la clave, `it->second` el valor, y `++it` pasa a la
siguiente clave mayor. Con (87, 6) (112, 2) (305, 5) el iterador visita 87, 112
y 305, y en la cuarta vuelta vale `end()` y el ciclo termina.

### Preguntar con corchetes

Con el inventario en (87, 6) (112, 5) (305, 5), consultar 200, 112 y 999 con
`if (inv[k] != 0)` responde bien pero inserta (200, 0) y (999, 0): `size()` pasa
de 3 a 5, y un recorrido imprimiría dos productos que nunca llegaron. Para
preguntar se usa `count` o `find`. La misma inserción es la que hace funcionar
`total[codigo] = total[codigo] + cantidad`, porque un código nuevo empieza en 0.

### Claves que son palabras

Un `map<char *, int>` compara direcciones, no letras. Si todas las palabras se
leen con `scanf("%s", pal)` en el mismo arreglo, todas son la misma clave: con
`sol mar sol luna mar sol` el `map` termina con una sola pareja, `sol 6`. La
clave tiene que ser un `string`: `string clave = pal;` copia las letras, y dos
`string` se comparan en orden alfabético. La misma entrada da `luna 1`, `mar 2`
y `sol 3`. Ese orden alfabético compara letra por letra según el código ASCII,
donde las mayúsculas (65 a 90) van antes que las minúsculas (97 a 122): con
las claves `carlos`, `Carlos` y `Zoe` el recorrido da `Carlos`, `Zoe` y
`carlos`. Para imprimir el `string` con `printf` se usa `c_str()`. Con palabras
de largo $L$, cada comparación cuesta hasta $L$ y cada operación
$O(L \log n)$.

El inventario se resuelve con `total[codigo] = total[codigo] + cantidad` por
registro y un recorrido al final: $O(n \log n)$ en tiempo y $\Theta(d)$ en
espacio, con $d$ códigos distintos.

## Lo que cuesta

Como en la búsqueda binaria, cada comparación descarta cerca de la mitad de las
claves que quedan: con un millón de claves, unas veinte comparaciones, porque
$\log_2 10^6 \approx 19{,}9$. A diferencia del vector ordenado, insertar no
corre a nadie.

Es el juego de adivinar un número entre 1 y 100 cuando solo se responde
*mayor*, *menor* o *es ese*. Se pregunta por 50; si la respuesta es *mayor*,
quedan 51 a 100 y se pregunta por 75; si ahora es *menor*, quedan 51 a 74. Cada
pregunta descarta la mitad, y como $2^7 = 128 \ge 100$, siete preguntas
alcanzan siempre. Probar de uno en uno puede pedir las cien.

| Operación | Tiempo | Por qué |
|---|---|---|
| `m[k]`, `m[k] = v` | $O(\log n)$ | se busca `k`; si no está, entra en su lugar sin correr a nadie |
| `count(k)`, `find(k)` | $O(\log n)$ | la misma búsqueda, sin insertar |
| `erase(k)` | $O(\log n)$ | se busca `k` y se saca su pareja |
| `size()`, `empty()` | $\Theta(1)$ | el `map` lleva la cuenta |
| `begin()` | $\Theta(1)$ | la biblioteca tiene a mano la menor clave |
| recorrido completo | $\Theta(n)$ | cada pareja se visita una vez |
| destructor | $\Theta(n)$ | se libera un nodo por pareja |

El espacio es $\Theta(n)$: un nodo por pareja con la clave, el valor y los
punteros de la estructura.

| | Tabla hash, $m$ proporcional a $n$ | `map` |
|---|---|---|
| Buscar, insertar, eliminar | $\Theta(1 + \alpha)$ promedio; $\Theta(n)$ peor | $O(\log n)$, también en el peor caso |
| Recorrer en orden de clave | $\Theta(m + n)$ y ordenar, $\Theta(n \log n)$ | $\Theta(n)$ |
| La menor clave | $\Theta(m + n)$, revisando todo | $\Theta(1)$ con `begin()` |
| Espacio | $\Theta(m + n)$ | $\Theta(n)$ |
| Lo que pide de la clave | una función hash $h$ | comparar con `<` |

Un programa inserta $n$ claves distintas y las busca todas en las dos
estructuras. Compilado con `g++ -Wall -Wextra`, sin optimizaciones, en el
equipo donde se preparó la sesión. Las cifras, al lado de las del
`unordered_map`, están al final de la sección siguiente.

La tabla hash conviene cuando solo se pregunta si una clave está y qué valor
tiene. El `map`, cuando la salida va en orden de clave, cuando se pide la menor
clave en cualquier momento, o cuando el peor caso tiene que quedar acotado: con
claves hechas a la medida de $m$, la tabla llega a $\Theta(n)$.

## El contenedor unordered_map

Cuando el orden de las claves no hace falta, la tabla hash del tema anterior
busca en $O(1)$ en promedio y el `map` en $O(\log n)$. La biblioteca trae esa
tabla ya escrita. Un `unordered_map<K, V>` guarda parejas
$(\mathit{clave}, \mathit{valor})$ con claves distintas en una tabla hash con
encadenamiento, la de CLRS, capítulo 11, §11.2. Busca por clave como el `map`,
pero las claves no quedan en orden. Se incluye con `<unordered_map>`, y la
clave necesita una función hash y una comparación con `==`; para `int` y
`string` la biblioteca ya trae las dos.

### La misma interfaz que map

El inventario de la sección del `map` cambia solo en el tipo:

```cpp
unordered_map<int, int> inv;
inv[305] = 4;
inv[112] = 2;
inv[305] = inv[305] + 1;
inv[87] = 6;
imprimir(inv);
printf("count(112) = %d, count(200) = %d\n", (int) inv.count(112), (int) inv.count(200));
unordered_map<int, int>::iterator f = inv.find(112);
if (f != inv.end()) {
  printf("find(112): clave %d, valor %d\n", f->first, f->second);
}
printf("erase(305) = %d\n", (int) inv.erase(305));
imprimir(inv);
```

`imprimir` recorre con un iterador, igual que en el `map`, y `unordered_uso.cpp`
imprime:

```text
 (87, 6) (112, 2) (305, 5)   size = 3
count(112) = 1, count(200) = 0
find(112): clave 112, valor 2
erase(305) = 1
 (87, 6) (112, 2)   size = 2
```

`[]`, `find`, `count`, `erase`, `size`, `it->first` e `it->second` hacen lo
mismo que en el `map`. También `m[k]` inserta $(k, 0)$ cuando `k` no estaba.

### Funciones hash

Una buena función hash es determinista: a la misma clave le toca la misma
cubeta. Además reparte claves distintas en cubetas distintas tan a menudo como
se pueda, y es rápida, $\Theta(1)$ para un entero y $\Theta(L)$ para una cadena
de $L$ caracteres.

**División.** Del tema anterior viene $h(k) = k \bmod m$ (CLRS, §11.3), con $m$
primo y lejos de una potencia de 2, porque $k \bmod 2^p$ son solo los últimos
$p$ bits de $k$. `hash_division.cpp` lo muestra con los múltiplos de 8:

| $k$ | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 |
|---|---|---|---|---|---|---|---|---|
| $k \bmod 16$ | 8 | 0 | 8 | 0 | 8 | 0 | 8 | 0 |
| $k \bmod 17$ | 8 | 16 | 7 | 15 | 6 | 14 | 5 | 13 |

Con $m = 16$ las ocho claves se amontonan en dos cubetas. Con el primo 17 cada
una tiene la suya.

**Horner.** Sumar los códigos de los caracteres no ve el orden, y `amor`, `roma`
y `mora` chocan. El polinomio $h \leftarrow (h \cdot b + c) \bmod m$ hace pesar
a cada carácter según su posición:

```cpp
// Horner en base 31, reduciendo modulo m en cada paso
int hashPolinomio(string s, int m) {
  int h = 0;
  int i = 0;
  while (i < (int) s.size()) {
    h = (h * 31 + s[i]) % m;
    i = i + 1;
  }
  return h;
}
```

| Paso | Carácter | Código | $h \leftarrow (h \cdot 31 + c) \bmod 13$ |
|---|---|---|---|
| 0 | | | $h = 0$ |
| 1 | `a` | 97 | $(0 \cdot 31 + 97) \bmod 13 = 6$ |
| 2 | `m` | 109 | $(6 \cdot 31 + 109) \bmod 13 = 295 \bmod 13 = 9$ |
| 3 | `o` | 111 | $(9 \cdot 31 + 111) \bmod 13 = 390 \bmod 13 = 0$ |
| 4 | `r` | 114 | $(0 \cdot 31 + 114) \bmod 13 = 10$ |

Con $m = 13$, `hash_cadenas.cpp` imprime:

```text
amor: suma 2, polinomio 10
roma: suma 2, polinomio 0
mora: suma 2, polinomio 11
```

La suma deja las tres palabras en la cubeta 2; el polinomio las separa.
`hashPolinomio` da una vuelta por carácter: $\Theta(L)$ en tiempo y
$\Theta(1)$ de espacio aparte.

**Multiplicación.** Con $m = 16$ la división deja los múltiplos de 8 en dos
cubetas. El método de la multiplicación (CLRS, §11.3) funciona bien también con
$m$ potencia de 2. Se fija una constante $0 < A < 1$, se multiplica $k$ por
$A$, se toma la parte fraccionaria y se multiplica por $m$:

$$h(k) = \lfloor m \, (k A \bmod 1) \rfloor .$$

Con $A = (\sqrt{5} - 1)/2 \approx 0{,}6180339887$, el valor de $m$ deja de pesar
tanto y puede ser una potencia de 2.

```cpp
const double A = 0.6180339887;   // (raiz de 5 - 1) / 2

int hashMult(int k, int m) {
  double t = k * A;
  double frac = t - (long long) t;   // parte fraccionaria de k * A
  return (int) (m * frac);
}
```

La conversión `(long long) t` trunca, es decir, quita los decimales. Si
$t = 1{,}5$, el truncado es 1 y la parte fraccionaria es $1{,}5 - 1 = 0{,}5$; si
$t = 3{,}88$, queda $3{,}88 - 3 = 0{,}88$. Como $k$ y $A$ son positivos, truncar
coincide con tomar el piso, y la resta da $k A \bmod 1$.

Para $k = 123456$ y $m = 10\,000$: $k A = 76300{,}0041\ldots$, la parte
fraccionaria es $0{,}0041\ldots$, al multiplicarla por $10\,000$ queda
$41{,}1\ldots$, y $h(k) = 41$. Sobre los múltiplos de 8 con $m = 16$,
`hash_multiplicacion.cpp` da ocho cubetas distintas donde la división daba dos:

| $k$ | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 |
|---|---|---|---|---|---|---|---|---|
| $h(k)$, multiplicación | 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 |
| $k \bmod 16$ | 8 | 0 | 8 | 0 | 8 | 0 | 8 | 0 |

`hashMult` hace una multiplicación y una resta: $\Theta(1)$.

**`std::hash` en `g++`.** El `unordered_map` calcula el valor hash con
`std::hash<K>` y lo reduce a una cubeta con el residuo entre `bucket_count()`.
La salida de `std_hash.cpp`:

```text
hash<int>(305) = 305, 305 mod 13 = 6, bucket = 6
hash<int>(112) = 112, 112 mod 13 = 8, bucket = 8
hash<int>(87) = 87, 87 mod 13 = 9, bucket = 9
hash<int>(450) = 450, 450 mod 13 = 8, bucket = 8
hash<string>(amor) = 467008054202664005
hash<string>(roma) = 7437365954172961582
```

`std::hash<int>` devuelve el mismo entero, y `bucket(k)` resulta ser
$k \bmod m$: el método de la división con $m$ primo, en $\Theta(1)$.
`std::hash<string>` mezcla todos los caracteres en un número de 64 bits, en
$\Theta(L)$, y a `amor` y `roma` les da valores distintos.

### Cubetas

La biblioteca llama *cubetas* (*buckets*) a las casillas de la tabla.
`bucket_count()` dice cuántas hay y `bucket(k)` en cuál está `k`. Con 305, 112,
87 y 450 en una tabla que arranca con 13 cubetas, $305 \bmod 13 = 6$,
$112 \bmod 13 = 8$, $87 \bmod 13 = 9$ y $450 \bmod 13 = 8$: el 112 y el 450
chocan y comparten la lista de la cubeta 8. Es la estructura de `tabla_hash.h`,
un arreglo de cubetas con una lista enlazada en cada una. `cubetas.cpp`
imprime:

```text
bucket_count() = 13
load_factor() = 0.308, max_load_factor() = 1.0
bucket(305) = 6
bucket(112) = 8
bucket(87) = 9
bucket(450) = 8
```

### El recorrido no sale en orden

`orden_hash.cpp` inserta 305, 112, 87 y 450 en un `map` y en un `unordered_map`
y recorre los dos con su iterador:

```text
map: 87 112 305 450
unordered_map: 87 450 112 305
```

El `map` sale de menor a mayor. El `unordered_map` sale como la biblioteca
enlaza sus cubetas, 9, 8, 8 y 6, que no es el orden de las claves ni el de las
cubetas de menor a mayor. Un programa que imprime con el `unordered_map` y
espera la salida en orden falla en el juez.

### Factor de carga y rehash

El factor de carga es $\alpha = n/m$, con $n$ claves y $m$ cubetas, y lo da
`load_factor()`. Con 13 cubetas fijas y mil claves, $\alpha = 1000/13$: cada
lista guardaría en promedio más de 76 claves, y buscar dejaría de costar
$O(1)$. Para evitarlo, `max_load_factor()` vale 1: si una inserción deja
$\alpha > 1$, la tabla pide más cubetas, cerca del doble y en número primo, y
vuelve a colgar todas las claves en sus cubetas nuevas. Eso es un *rehash*.

`rehash.cpp` inserta claves de una en una y anota cada vez que
`bucket_count()` cambia:

| $n$ al insertar | `bucket_count()` |
|---|---|
| 0 | 1 |
| 1 | 13 |
| 14 | 29 |
| 30 | 59 |
| 60 | 127 |
| 128 | 257 |
| 258 | 541 |
| 542 | 1 109 |

Entre fila y fila, $\alpha$ sube hasta 1 sin que la tabla crezca. El número
nuevo de cubetas es un primo de al menos el doble de las que había: de 13 se
pasa a 29, no a 23, que queda por debajo de $2 \cdot 13 = 26$. Tampoco es
siempre el primo siguiente al doble: de 257 se pasa a 541, aunque 521 ya es
primo y mayor que 514, porque la biblioteca escoge de una lista fija de primos. El rehash
recorre las $n$ claves y las cuelga otra vez, $\Theta(n)$ en esa inserción.
Después de crecer de $m$ a cerca de $2m$ cubetas hacen falta unas $m$
inserciones más para volver a $\alpha = 1$, así que el costo $\Theta(m)$ del
rehash se reparte entre ellas y cada inserción sigue costando $O(1)$ en
promedio. Con $\alpha \le 1$ cada lista guarda en promedio a lo sumo una clave,
y buscar cuesta $O(1)$ en promedio para cualquier $n$.

`rehash_traza.cpp` hace entrar 5, 18, 31, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11 y 12,
en ese orden. Con 13 cubetas, 5, 18 y 31 caen en la cubeta 5:

| Entra | $n$ | $m$ | $\alpha$ | `bucket(5)` | `bucket(18)` | `bucket(31)` |
|---|---|---|---|---|---|---|
| 5 | 1 | 13 | 0,08 | 5 | 5 | 5 |
| 18 | 2 | 13 | 0,15 | 5 | 5 | 5 |
| 31 | 3 | 13 | 0,23 | 5 | 5 | 5 |
| 1 | 4 | 13 | 0,31 | 5 | 5 | 5 |
| 2 | 5 | 13 | 0,38 | 5 | 5 | 5 |
| 3 | 6 | 13 | 0,46 | 5 | 5 | 5 |
| 4 | 7 | 13 | 0,54 | 5 | 5 | 5 |
| 6 | 8 | 13 | 0,62 | 5 | 5 | 5 |
| 7 | 9 | 13 | 0,69 | 5 | 5 | 5 |
| 8 | 10 | 13 | 0,77 | 5 | 5 | 5 |
| 9 | 11 | 13 | 0,85 | 5 | 5 | 5 |
| 10 | 12 | 13 | 0,92 | 5 | 5 | 5 |
| 11 | 13 | 13 | 1,00 | 5 | 5 | 5 |
| **12** | **14** | **29** | **0,48** | **5** | **18** | **2** |

Con el 11, $\alpha$ llega a $13/13 = 1$; no pasa de 1 y la tabla se queda como
está. El 12 dejaría $\alpha = 14/13 > 1$, de modo que la tabla pasa a 29
cubetas, reubica las 13 claves que tenía y cuelga el 12, con
$\alpha = 14/29 \approx 0{,}48$. La cubeta 5 tenía una lista de tres claves;
con 29 cubetas, $5 \bmod 29 = 5$, $18 \bmod 29 = 18$ y $31 \bmod 29 = 2$, y cada
una queda sola. Las trece inserciones anteriores costaron $\Theta(1)$ cada una.
La del 12 pagó las 14.

### Lo que cobra cada uno

| Operación | `map` | `unordered_map` | Por qué |
|---|---|---|---|
| Buscar | $O(\log n)$ | $O(1)$ promedio; $\Theta(n)$ peor | el `map` baja por un árbol balanceado; el otro calcula la cubeta y recorre su lista, de largo $\alpha \le 1$ en promedio |
| Insertar | $O(\log n)$ | $O(1)$ promedio; $\Theta(n)$ la que hace rehash | la misma búsqueda y un nodo nuevo; el rehash se reparte entre las inserciones que lo siguen |
| Borrar | $O(\log n)$ | $O(1)$ promedio | se busca la clave y se desenlaza su nodo |
| Recorrer | $\Theta(n)$, en orden | $\Theta(n)$, sin orden | cada pareja se visita una vez; el `unordered_map` enlaza todos sus nodos en una sola lista y no pasa por las cubetas vacías |
| Recorrer en orden | $\Theta(n)$ | $\Theta(n \log n)$ | el `unordered_map` tiene que copiar las claves a otra estructura y ordenarlas |
| Espacio | $\Theta(n)$ | $\Theta(m + n)$, con $m \ge n$ | un nodo por pareja; el `unordered_map` guarda además el arreglo de cubetas |

### La medición, con unordered_map

`medir_hash.cpp` repite con un `unordered_map` las inserciones y las búsquedas
de `medir.cpp`:

```cpp
void medirUnordered(int n) {
  clock_t ini = clock();
  unordered_map<int, int> u;
  int i = 0;
  while (i < n) {
    u[(int) ((long long) i * 7919 % P)] = i;
    i = i + 1;
  }
  int hallados = 0;
  i = 0;
  while (i < n) {
    if (u.count((int) ((long long) i * 7919 % P)) == 1) {
      hallados = hallados + 1;
    }
    i = i + 1;
  }
  double s = (double) (clock() - ini) / CLOCKS_PER_SEC;
  printf("unordered_map, n = %d: %.3f s (%d hallados)", n, s, hallados);
  printf(", %d cubetas\n", (int) u.bucket_count());
}
```

En esta tabla las tres columnas salen de una misma sesión, con `medir.cpp` para
la tabla hash y el `map` y con `medir_hash.cpp` para el `unordered_map`, sin
optimizaciones; cada tiempo es la mediana de tres corridas.

| $n$ | $m$ | Tabla hash | `map` | `unordered_map` |
|---|---|---|---|---|
| $10^5$ | 99 991 | 0,005 s | 0,091 s | 0,033 s |
| $10^6$ | 999 983 | 0,045 s | 1,018 s | 0,320 s |

La tabla del curso le gana al `map` unas dieciocho veces con $n = 10^5$ y unas
veintidós con $n = 10^6$. El `unordered_map` resulta unas tres veces más rápido que el `map` y unas siete
veces más lento que la tabla del curso. La tabla del curso arranca con $m$
cercano a $n$, nunca crece y su `insertar` no revisa si la clave ya estaba. El
`unordered_map` empieza con 13 cubetas, crece 17 veces hasta 1 447 153 con
$n = 10^6$ y busca la clave antes de cada inserción.

### Lo que puede salir mal

!!! warning "Todas las claves en la misma cubeta"

    Si la función hash manda todas las claves a una cubeta, la tabla es una sola
    lista enlazada y buscar cuesta $O(n)$. El $O(1)$ es un promedio que depende
    de que la función reparta bien.

!!! warning "El orden cambia con un rehash"

    El recorrido sigue las cubetas, y un rehash las cambia todas. Las mismas
    claves pueden salir en otro orden después de una inserción más.

!!! warning "Un rehash invalida los iteradores"

    Un iterador guardado antes de un rehash ya no se usa ni se avanza. Las
    referencias a los elementos siguen valiendo, porque los nodos no se mueven:
    solo se vuelven a colgar.

### ¿map o unordered_map?

El `map` se escoge cuando la salida va en orden de clave, cuando se pide la
menor o la mayor clave, o las claves entre $a$ y $b$, y cuando hace falta
$O(\log n)$ también en el peor caso. El `unordered_map`, cuando solo se busca,
se cuenta o se suma por clave y el orden de las claves no aparece en la salida:
es la tabla hash del curso, ya escrita y con el crecimiento incluido.

## Claves compuestas en map y unordered_map

Una oficina guarda en qué turno llegó cada persona, y la clave es la persona
entera:

```cpp
struct Persona {
  string nombre;   // se lee en char[101] y se copia
  int edad;
  int salario;
};
```

Con solo esto no compila `map<Persona, int>` ni `unordered_map<Persona, int>`.
El `map` compara claves con `<`, y `Persona` no lo trae; el `unordered_map`
pide una función hash y `==`, y `std::hash` no sabe nada de `Persona`. Se le
dan como el `==` de `Estudiante` en el tema de iteradores o el `+` de
`Racional`: una función `operator<` u `operator==` dentro del `struct`, que C++
llama cuando se escribe `a < b` o `a == b`.

### Un orden para el map

El orden es lexicográfico por campos: primero la edad; si empatan, el salario;
si también empatan, el nombre. Es el orden de un diccionario con los campos en
el papel de las letras. La primera forma lo escribe como `operator<` dentro de
`Persona`, en `persona.h`:

```cpp
// edad, luego salario, luego nombre
bool operator<(const Persona &o) const {
  bool menor;
  if (edad != o.edad) {
    menor = edad < o.edad;
  } else if (salario != o.salario) {
    menor = salario < o.salario;
  } else {
    menor = nombre < o.nombre;
  }
  return menor;
}
```

La segunda forma es un `struct` comparador con `operator()`, que se pasa como
tercer parámetro del `map`:

```cpp
// El mismo orden, como un struct aparte que se pasa al map
struct CompararPersona {
  bool operator()(const Persona &a, const Persona &b) const {
    bool menor;
    if (a.edad != b.edad) {
      menor = a.edad < b.edad;
    } else if (a.salario != b.salario) {
      menor = a.salario < b.salario;
    } else {
      menor = a.nombre < b.nombre;
    }
    return menor;
  }
};
```

```cpp
map<Persona, int> turno;                     // usa operator< de Persona
map<Persona, int, CompararPersona> turno2;   // usa el comparador aparte
map<Persona, int, SoloEdad> malo;            // compara solo la edad
```

Las dos formas dan el mismo orden y el mismo `map`. Una comparación cuesta
$\Theta(1)$ cuando decide la edad o el salario y hasta $O(L)$ cuando hay que
comparar nombres de largo $L$, así que las operaciones del `map` pasan a
$O(L \log n)$.

### Traza del recorrido

Llegan, en este orden, `ana 30 2000`, `beto 25 3000`, `carla 30 2000`,
`dario 30 1500` y `eva 25 3000`. `persona_map.cpp` las recorre así:

| Edad | Salario | Nombre | Llegó | Qué la ubica |
|---|---|---|---|---|
| 25 | 3000 | `beto` | 1 | la edad: 25 antes que 30 |
| 25 | 3000 | `eva` | 4 | empata en edad y salario: el nombre |
| 30 | 1500 | `dario` | 3 | empata en edad: el salario |
| 30 | 2000 | `ana` | 0 | empata en edad: el salario |
| 30 | 2000 | `carla` | 2 | empata en edad y salario: el nombre |

El recorrido muestra los tres desempates, y `size()` vale 5 con las dos formas.

### Un comparador que solo mira la edad

```cpp
// Solo mira la edad: dos personas de la misma edad quedan como una
struct SoloEdad {
  bool operator()(const Persona &a, const Persona &b) const {
    return a.edad < b.edad;
  }
};
```

Con `map<Persona, int, SoloEdad>` y las mismas cinco personas, la salida de
`persona_map.cpp` termina en:

```text
size: 5 con operator<, 5 con CompararPersona, 2 con SoloEdad
SoloEdad: 25 3000 beto -> 4
SoloEdad: 30 2000 ana -> 3
```

!!! warning "Dos claves distintas, tomadas como iguales"

    El `map` decide que $a$ y $b$ son la misma clave cuando ni $a < b$ ni
    $b < a$. Con `SoloEdad`, dos personas de la misma edad son la misma clave:
    `eva` cayó sobre `beto` y le cambió el valor a 4, y `carla` y `dario`
    cayeron sobre `ana`. Se perdieron tres personas. Con `<=` en lugar de `<`
    pasa algo peor: una clave queda menor que sí misma y el `map` deja de
    encontrar lo que guardó.

### Hash e igualdad para el unordered_map

La igualdad compara los tres campos:

```cpp
// la misma persona: los tres campos iguales
bool operator==(const Persona &o) const {
  return edad == o.edad && salario == o.salario
         && nombre == o.nombre;
}
```

El hash también mezcla los tres. Aplica Horner sobre el nombre y después trata
la edad y el salario como dos caracteres más:

```cpp
// Horner en base 31 sobre el nombre, y despues la edad y el salario
struct HashPersona {
  unsigned long long operator()(const Persona &p) const {
    unsigned long long h = 0;
    int i = 0;
    while (i < (int) p.nombre.size()) {
      h = h * 31 + p.nombre[i];
      i = i + 1;
    }
    h = h * 31 + p.edad;
    h = h * 31 + p.salario;
    return h;
  }
};
```

Se declara con `unordered_map<Persona, int, HashPersona> turno;`, y con las
mismas cinco personas `persona_unordered.cpp` imprime:

```text
size = 5, count(carla 30 2000) = 1
count(carla 30 1500) = 0
```

`h` no se reduce en cada paso: un `unsigned long long` que pasa de
$2^{64} - 1$ sigue la cuenta módulo $2^{64}$, y la reducción a la cubeta la
hace el `unordered_map`. `HashPersona` cuesta $\Theta(L)$ y `==`, $O(L)$, de
modo que buscar cuesta $O(L)$ en promedio.

### ¿Cuántas chocan?

Para comparar hay dos combinaciones malas:

```cpp
// Dos combinaciones malas: solo la edad, y la edad mas el salario
struct HashEdad {
  unsigned long long operator()(const Persona &p) const {
    return p.edad;
  }
};

struct HashSuma {
  unsigned long long operator()(const Persona &p) const {
    return p.edad + p.salario;
  }
};
```

`colisiones_persona.cpp` inserta 2000 personas, con 10 nombres, edades de 20 a
39 y salarios de 1000 a 1090 de 10 en 10, una vez con cada función hash, y
recorre las cubetas con `bucket_size(b)`:

| Función hash | Cubetas | Cubetas usadas | Lista más larga |
|---|---|---|---|
| solo la edad | 2 357 | 20 | 100 |
| edad $+$ salario | 2 357 | 110 | 20 |
| los tres campos | 2 357 | 1 487 | 3 |

La edad sola toma 20 valores: 100 personas por lista, y buscar recorre hasta
100 nodos. La suma toma 110 valores y además junta parejas distintas, porque
$(30, 1000)$ y $(20, 1010)$ suman 1030. Con los tres campos las listas miden a
lo sumo 3.

### Lo que puede salir mal con el hash

!!! warning "Dos claves iguales con hash distinto"

    Si `==` dice que dos claves son iguales, el hash tiene que dar el mismo
    valor. Un hash que usa un campo que `==` no mira manda a dos personas
    iguales a cubetas distintas: `count` busca en la cubeta equivocada y
    responde 0, y la misma clave entra dos veces.

Al revés no se rompe nada. Un hash que solo mira la edad da respuestas
correctas, pero lentas, como en la tabla de colisiones.

Si la estructura trae un campo que ya identifica a cada persona, como el
número de cédula, el hash puede mirar solo ese campo. Dos personas iguales
tienen la misma cédula y caen en la misma cubeta, y dos distintas tienen
cédulas distintas, así que el campo reparte tan bien como los tres juntos y
cuesta $\Theta(1)$ en lugar de $\Theta(L)$.

### Qué le pide cada contenedor a la clave

| | `map` | `unordered_map` |
|---|---|---|
| Lo que pide | un orden estricto: `operator<` o un comparador | una función hash y `==` (o un `struct` de igualdad) |
| Si falla | con un orden que no distingue campos, claves distintas se toman como iguales | con iguales de hash distinto, una clave entra dos veces |
| Buscar, insertar, borrar | $O(\log n)$ comparaciones; con nombres de largo $L$, $O(L \log n)$ | un hash $\Theta(L)$ y $O(1)$ comparaciones en promedio: $O(L)$ |
| Recorrer | en el orden del comparador, $\Theta(n)$ | sin orden, $\Theta(n)$ |

## Para el juez

### UVa 11286, Conformity

*UVa 11286, Conformity*: <https://onlinejudge.org/external/112/11286.pdf>.
Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2261>.

Un `map<long long, int>` que cuenta combinaciones de cursos.

Varios casos, terminados por un 0. Cada caso trae $n \le 10\,000$ estudiantes
que escogen cinco cursos distintos, numerados de 100 a 499, y se imprime cuántos
estudiantes tienen una combinación de popularidad máxima. Se ordenan los cinco
cursos con `sort`, se pegan en un número de 15 cifras, tres por curso, y se
cuenta con el `map`; un recorrido final halla la popularidad mayor y suma los
estudiantes de las combinaciones que la alcanzan. $O(n \log n)$ por caso.

!!! warning "Las trampas"

    - El orden de los cursos en la línea no importa: sin ordenar,
      `100 101 102 103 488` y `103 102 101 488 100` serían claves distintas.
    - Se imprime el total de estudiantes de todas las combinaciones empatadas en
      el máximo, no cuántas combinaciones son. En el segundo caso del ejemplo
      las tres combinaciones tienen popularidad 1 y la respuesta es 3.
    - La clave no cabe en `int`: 499 499 499 499 499 pide `long long`, con
      `%lld`.

### UVa 10295, Hay Points

*UVa 10295, Hay Points*: <https://onlinejudge.org/external/102/10295.pdf>.
Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1236>.

Un `map<string, double>` con el diccionario, consultado con `find`.

El diccionario trae $m \le 1000$ palabras con un valor en dólares, y después
vienen $n \le 100$ descripciones de varias líneas, cada una terminada por una
línea con un punto. Por cada descripción se imprime la suma de los valores de
todas sus palabras; las que no están valen 0, y cada aparición cuenta. Se lee
palabra por palabra con `scanf` hasta la palabra `.`, que se detecta con
`strcmp`. Con $w$ palabras, una descripción cuesta $O(w \log m)$ comparaciones
de palabras.

!!! warning "Las trampas"

    - Consultar con `valor[pal]` inserta con 0 cada palabra desconocida: la
      suma no cambia, pero el diccionario crece y las búsquedas se alargan.
      `find` no inserta.
    - El valor es un número real: se lee como `double` con `%lf` y la suma se
      imprime con `%.0f`.
    - `managing` no es `manage`: la palabra tiene que coincidir completa.

### Soluciones

Cada una lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uva11286.in`.

- UVa 11286, Conformity: [uva11286.cpp](./codigo/uva11286.cpp),
  [entrada](./codigo/uva11286.in), [salida](./codigo/uva11286.out)
- UVa 10295, Hay Points: [uva10295.cpp](./codigo/uva10295.cpp),
  [entrada](./codigo/uva10295.in), [salida](./codigo/uva10295.out)

## Ejercicios

### A mano

Tras `m[40] = 3`, `m[15] = 8`, `m[72] = 1`, `m[15] = m[15] - 8`,
`m.erase(72)`, `m.erase(99)` y `if (m[60] == 0) { m[33] = 2; }`, el `map`
queda en (15, 0) (33, 2) (40, 3) (60, 0) con `size()` igual a 4. La condición
del `if` inserta 60 con 0; dejar el valor de 15 en 0 no lo saca, y
`erase(99)` devuelve 0 sin cambiar nada.

### Quiénes faltaron

Con inscritos $\langle 4021, 3307, 5590, 1288, 4410, 2765 \rangle$ y asistentes
$\langle 5590, 4021, 4410 \rangle$, faltaron 3307, 1288 y 2765. Con la tabla
hash de los asistentes salen en el orden de los inscritos, en
$\Theta(n_a + n_b)$ en promedio. Con un `map` de inscritos del que se borran
los asistentes salen como `1288 2765 3307`, en $O((n_a + n_b) \log n_a)$.

### La moda

Con $a = \langle 5, 2, 8, 2, 5, 9, 5, 2 \rangle$ la moda es 2: 2 y 5 aparecen
tres veces y 2 es el menor. El recorrido del `map` va de menor a mayor clave,
así que con `>` estricto la primera clave que alcanza la cuenta mayor no se
reemplaza. Con la tabla hash hay que comparar también las claves en el empate.

### ¿Tabla hash o map?

Un corrector que solo dice si cada palabra está: tabla hash. Una agenda que se
imprime en orden alfabético después de cada cambio: `map`. El código más pequeño
registrado en cualquier momento: `map`, con `begin()`. Los cinco números más
frecuentes de una lista: tabla hash, porque la salida se ordena por frecuencia
y no por clave.

### Otro orden para las personas

Un comparador `PorSalario` para `map<Persona, int, PorSalario>` pone primero el
salario mayor y, si empatan, ordena por nombre:

```cpp
struct PorSalario {
  bool operator()(const Persona &a, const Persona &b) const {
    bool menor;
    if (a.salario != b.salario) {
      menor = a.salario > b.salario;   // el salario mayor va primero
    } else {
      menor = a.nombre < b.nombre;
    }
    return menor;
  }
};
```

Con las cinco personas de la traza salen `3000 beto`, `3000 eva`, `2000 ana`,
`2000 carla` y `1500 dario`, con `size()` igual a 5. `PorSalario` no mira la
edad, así que `ana 41 2000` empata en salario y nombre con `ana 30 2000`, se
toma como la misma clave y `size()` sigue en 5. Cada comparación cuesta $O(L)$.

### La primera palabra sin repetir

Se leen palabras hasta el fin de la entrada y se imprime la primera, en el orden
de llegada, que aparece una sola vez, o `ninguna`. Con `sol mar luna sol mar rio`
la respuesta es `luna`: `rio` también aparece una vez, pero llega después. El
`unordered_map` cuenta en $O(1)$ promedio por palabra, y el orden de llegada se
guarda aparte en un `vector`; la segunda pasada recorre el `vector`, no el mapa:

```cpp
int main() {
  vector<string> texto;              // las palabras en el orden de llegada
  unordered_map<string, int> veces;
  char pal[101];
  while (scanf("%s", pal) == 1) {
    string clave = pal;
    texto.push_back(clave);
    veces[clave] = veces[clave] + 1;
  }
  int i = 0;
  while (i < (int) texto.size() && veces[texto[i]] != 1) {
    i = i + 1;
  }
  if (i < (int) texto.size()) {
    printf("%s\n", texto[i].c_str());
  } else {
    printf("ninguna\n");
  }
  return 0;
}
```

Con el ejemplo imprime `luna`, y con `sol mar sol mar`, `ninguna`. Para $n$
palabras de largo a lo sumo $L$ son dos pasadas con un hash $\Theta(L)$ por
palabra, $O(nL)$ en promedio, y $\Theta(nL)$ de espacio para el `vector` y el
mapa. Con un `map` serían $O(nL \log n)$.

## Para practicar en casa

### Propuesto 1: entradas y salidas

Cada registro del inventario trae un tipo, 1 para entrada y 2 para salida, un
código y una cantidad; un código cuyo total llega a 0 desaparece. *Pista:* se
suma o se resta con `[]` y, si el total queda en 0, se llama a `erase`.
$O(\log n)$ por registro.

### Propuesto 2: distintos en orden

Imprimir los valores distintos de un arreglo de menor a mayor, con un `map` y
con la tabla hash y `sort`. *Pista:* con el `map`, $O(n \log n)$; con la tabla,
$\Theta(n)$ en promedio más $\Theta(d \log d)$ para ordenar los $d$ distintos.

### Propuesto 3: anagramas

Decidir si dos palabras usan las mismas letras el mismo número de veces con un
`map<char, int>`. *Pista:* se suma uno por cada letra de la primera y se resta
uno por cada letra de la segunda; con 26 letras minúsculas, una tabla directa de
26 casillas hace cada paso en $\Theta(1)$.

### Propuesto 4: Hay Points con la tabla hash

Resolver UVa 10295 con una tabla hash de palabras cuyo nodo guarda la palabra y
su valor. *Pista:* la casilla sale del polinomio en base 31 y la comparación de
la lista pasa a `strcmp`.

### Propuesto 5: promedio por estudiante

Cada registro trae un código y una nota en décimas; imprimir, en orden de
código, el promedio de cada estudiante. *Pista:* dos `map<int, int>`, uno con
la suma y otro con la cantidad de notas.

### Reto de cierre

Un `map<int, int>` tiene $n$ claves y se quieren imprimir las que están entre
$a$ y $b$. ¿Se puede pagar algo cercano a $\log n$ más lo que se imprime, sin
recorrer las $n$? ¿Qué operación le faltaría al contrato?

## Ejercicios interactivos

Doce actividades que se trabajan en el navegador, ordenadas por los temas de la
sesión, en la [página de ejercicios](./Ejercicios.md). Seis son del `map`: las
mismas claves en una tabla hash y en un `map`; un `map` línea por línea con lo
que inserta `m[k]`; lo que devuelven `count`, `find` y `erase`; un `map` de
palabras y la clave `char *`; cuándo conviene cada estructura; y una
combinación de cursos como clave. Las otras seis siguen el método de la
multiplicación paso a paso, ubican la cubeta de cada clave y lo que imprime el
recorrido, piden decir cuándo cambia el número de cubetas, elegir entre `map` y
`unordered_map`, ordenar personas con un comparador y con uno defectuoso, y
escoger la función hash de `Persona`. Las claves y los programas no son los de
la sesión: mismo tema, ronda nueva.

## Lo que sigue

Los árboles: la estructura con la que la biblioteca guarda el `map`, y de donde
sale su $O(\log n)$.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [tabla_hash.h](./codigo/tabla_hash.h): la tabla hash con encadenamiento.
- [orden.cpp](./codigo/orden.cpp): 305, 112, 87 y 450 en la tabla de siete
  casillas y en un `map`; imprime las casillas y después `87 112 305 450`.
- [map_uso.cpp](./codigo/map_uso.cpp): el paso a paso, con `count`, `find` y
  `erase`.
- [corchete.cpp](./codigo/corchete.cpp): consultar con `[]` frente a `count`.
- [palabras.cpp](./codigo/palabras.cpp): cuántas veces aparece cada palabra,
  con [entrada](./codigo/palabras.in) y [salida](./codigo/palabras.out).
- [inventario.cpp](./codigo/inventario.cpp): el problema del inventario, con
  [entrada](./codigo/inventario.in) y [salida](./codigo/inventario.out).
- [medir.cpp](./codigo/medir.cpp): el tiempo de la tabla hash y del `map`.
- [iterador_valor.cpp](./codigo/iterador_valor.cpp): un iterador frente a una
  copia del valor, y el orden de las claves con mayúsculas, con
  [salida](./codigo/iterador_valor.out).
- [unordered_uso.cpp](./codigo/unordered_uso.cpp): el inventario con
  `unordered_map`, la misma interfaz que `map`.
- [hash_division.cpp](./codigo/hash_division.cpp) y
  [hash_multiplicacion.cpp](./codigo/hash_multiplicacion.cpp): los múltiplos de
  8 con la división, con $m = 16$ y $m = 17$, y con la multiplicación.
- [hash_cadenas.cpp](./codigo/hash_cadenas.cpp): la suma de códigos frente a
  Horner, con [entrada](./codigo/hash_cadenas.in) y
  [salida](./codigo/hash_cadenas.out).
- [std_hash.cpp](./codigo/std_hash.cpp): lo que devuelve `std::hash` en `g++` y
  la cubeta que resulta.
- [cubetas.cpp](./codigo/cubetas.cpp): `bucket_count()`, `load_factor()` y la
  cubeta de cada clave.
- [orden_hash.cpp](./codigo/orden_hash.cpp): las mismas cuatro claves recorridas
  en un `map` y en un `unordered_map`.
- [rehash.cpp](./codigo/rehash.cpp) y [rehash_traza.cpp](./codigo/rehash_traza.cpp):
  cuándo cambia `bucket_count()` y la traza de las catorce inserciones.
- [medir_hash.cpp](./codigo/medir_hash.cpp): el tiempo del `unordered_map`.
- [persona.h](./codigo/persona.h): `Persona` con su orden, su igualdad, el
  comparador aparte, `SoloEdad` y las tres funciones hash.
- [persona_map.cpp](./codigo/persona_map.cpp): personas como clave de un `map`,
  con [entrada](./codigo/persona_map.in) y [salida](./codigo/persona_map.out).
- [persona_unordered.cpp](./codigo/persona_unordered.cpp): personas como clave
  de un `unordered_map`, con [salida](./codigo/persona_unordered.out).
- [colisiones_persona.cpp](./codigo/colisiones_persona.cpp): las 2000 personas
  con tres funciones hash, con [salida](./codigo/colisiones_persona.out).
- [a_mano.cpp](./codigo/a_mano.cpp), [faltaron.cpp](./codigo/faltaron.cpp),
  [moda.cpp](./codigo/moda.cpp) y
  [persona_salario.cpp](./codigo/persona_salario.cpp), con su
  [salida](./codigo/persona_salario.out): los ejercicios en parejas.
- [unica.cpp](./codigo/unica.cpp): la primera palabra sin repetir, con
  [entrada](./codigo/unica.in) y [salida](./codigo/unica.out).

`persona_unordered.cpp` y `persona_salario.cpp` leen el mismo formato que
`persona_map.cpp`: `./persona_salario < persona_map.in`.

Las soluciones de los problemas de juez están en la sección *Para el juez*, con
su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 11, tablas hash; capítulo 12,
  árboles binarios de búsqueda; capítulo 13, árboles rojinegros.
- cppreference.com. *std::map*:
  <https://en.cppreference.com/w/cpp/container/map>.
- cppreference.com. *std::unordered_map*:
  <https://en.cppreference.com/w/cpp/container/unordered_map>. Cubetas, factor
  de carga, rehash e invalidación de iteradores.
- UVa Online Judge. Problema 11286, *Conformity*:
  <https://onlinejudge.org/external/112/11286.pdf>.
- UVa Online Judge. Problema 10295, *Hay Points*:
  <https://onlinejudge.org/external/102/10295.pdf>.
