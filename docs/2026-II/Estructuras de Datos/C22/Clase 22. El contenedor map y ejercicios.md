# Estructuras de Datos · Clase 22. El contenedor map y ejercicios

Viernes 23 de octubre de 2026, de 14:00 a 17:00.

La tabla hash con encadenamiento busca e inserta en $\Theta(1 + \alpha)$ en
promedio, pero recorre sus claves en el orden de las casillas. Cuando la salida
tiene que ir en orden de clave, eso obliga a copiar y ordenar al final. Esta
sesión presenta el contenedor `map` de la biblioteca de C++, un diccionario que
guarda las parejas ordenadas por clave desde que entran, mide lo que cuesta cada
operación y lo pone frente a la tabla hash en problemas de juez y ejercicios.

Al terminar, el objetivo es poder usar `map<K, V>` para insertar con `[]`,
consultar con `count` y `find`, eliminar con `erase` y recorrer las claves de
menor a mayor con un iterador; seguir a mano el contenido de un `map`, incluida
la inserción que hace `[]` cuando solo se quería consultar; dar el costo de cada
operación y compararlo con el de la tabla hash; y escoger entre las dos según lo
que pide el problema.

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
y `sol 3`. Para imprimir el `string` con `printf` se usa `c_str()`. Con palabras
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
equipo donde se preparó la sesión:

| $n$ | $m$ | Tabla hash | `map` |
|---|---|---|---|
| $10^5$ | 99 991 | 0,005 s | 0,068 s |
| $10^6$ | 999 983 | 0,076 s | 0,780 s |

La tabla hash conviene cuando solo se pregunta si una clave está y qué valor
tiene. El `map`, cuando la salida va en orden de clave, cuando se pide la menor
clave en cualquier momento, o cuando el peor caso tiene que quedar acotado: con
claves hechas a la medida de $m$, la tabla llega a $\Theta(n)$.

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

Seis actividades que se trabajan en el navegador, ordenadas por los temas de la
sesión, en la [página de ejercicios](./Ejercicios.md): las mismas claves en una
tabla hash y en un `map`; un `map` línea por línea con lo que inserta `m[k]`;
lo que devuelven `count`, `find` y `erase`; un `map` de palabras y la clave
`char *`; cuándo conviene cada estructura; y una combinación de cursos como
clave. Las claves y los programas no son los de la sesión: mismo tema, ronda
nueva.

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
- [a_mano.cpp](./codigo/a_mano.cpp), [faltaron.cpp](./codigo/faltaron.cpp) y
  [moda.cpp](./codigo/moda.cpp): los ejercicios en parejas.

Las soluciones de los problemas de juez están en la sección *Para el juez*, con
su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 11, tablas hash; capítulo 12,
  árboles binarios de búsqueda; capítulo 13, árboles rojinegros.
- cppreference.com. *std::map*:
  <https://en.cppreference.com/w/cpp/container/map>.
- UVa Online Judge. Problema 11286, *Conformity*:
  <https://onlinejudge.org/external/112/11286.pdf>.
- UVa Online Judge. Problema 10295, *Hay Points*:
  <https://onlinejudge.org/external/102/10295.pdf>.
