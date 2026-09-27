# Clase 14. Iteradores y algoritmos de la STL

Miércoles 23 de septiembre de 2026, de 17:00 a 19:00.

En la sesión de los contenedores de la biblioteca, `v.begin()` apareció cuatro
veces: dentro de `insert`, dentro de `erase`, dentro de `sort` y adelante de
`min_element`. Las cuatro veces se leyó como la posición 0 y ninguna dijo
qué es. Lo que devuelve `begin()` es un iterador, y esta sesión lo abre: qué
guarda, por qué se le puede sumar un entero, por qué `min_element` necesita un
`*` adelante, cuándo deja de valer y qué algoritmos de la biblioteca lo piden.
Con el iterador se recorre cualquier contenedor, también los que no tienen
índice, y eso es lo que hace falta para `list`, `map` y `set` del segundo
corte.

Al terminar, el objetivo es poder explicar qué es un iterador, recorrer con él
un `vector` y un `string`, y pasar de posición a índice y de índice a posición;
reconocer cuándo un iterador deja de valer tras `insert` o `erase` y escribir
el recorrido que borra mientras avanza sin caer en ese error; aplicar
`lower_bound`, `unique`, `accumulate` y `find` sobre objetos, escogiendo entre
ellos por lo que cuestan; traducir a la biblioteca los ejercicios de los
contratos, la intersección con dos iteradores, las frecuencias y la mediana con
`sort` y la postfija con `stack`; y decir qué cuesta en tiempo y en espacio cada
operación de un iterador y cada algoritmo de la sesión.

## Diapositivas

![](clase14.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Lo que dejó la STL

`vector`, `string`, `stack` y `queue` son los contratos del curso con los
nombres de la biblioteca, con `at` vigilando el rango que `[]` no vigila.
`sort`, `reverse`, `count`, `find` y `binary_search` no reciben un contenedor:
reciben un **rango**, escrito `[begin, end)`. El corchete de la izquierda dice
que el primero entra; el paréntesis de la derecha, que el último queda afuera.
Todo nombre de la biblioteca vive en el espacio `std` y se trae con
`using std::nombre`, una línea por nombre debajo de los `#include`.

Sobre `[]` conviene insistir, porque es el error que más tiempo cuesta
encontrar. `v[7]` en un vector de tres elementos no avisa: calcula la dirección
de la casilla 7 y lee lo que haya ahí. Si esa dirección todavía pertenece al
proceso, sale un número cualquiera y el programa sigue; si no le pertenece, el
núcleo del sistema operativo, que es quien administra qué memoria puede tocar
cada proceso, lo detiene con un fallo de segmentación. Las dos salidas son la
misma falta, y una de las dos es más difícil de descubrir. `at` comprueba y
detiene el programa donde nace el error.

## Un iterador es un puntero que sabe recorrer

El recorrido con punteros sobre un arreglo ya estaba escrito desde la sesión de
arreglos y punteros:

```cpp
int a[5] = {9, 1, 8, 3, 5};
int *p = a;            // la direccion de la primera casilla
while (p != a + 5) {   // a + 5: justo despues de la ultima
  printf(" %d", *p);   // lo que hay en esa casilla
  ++p;                 // la siguiente casilla
}
```

Ese puntero sabe tres cosas: dónde está, qué hay ahí y cuál es la siguiente.
Eso, y nada más, es un iterador.

> **Definición.** Un iterador es un objeto que señala un elemento dentro de un
> contenedor y sabe pasar al siguiente. Se lee con `*it`, se avanza con `++it`
> y se compara con `==` y `!=`. Cada contenedor define el suyo:
> `vector<int>::iterator`, `string::iterator`. Stroustrup, capítulo 33.

### El dibujo de memoria

Un `vector<int>` de cinco casillas ocupa cinco enteros seguidos. Con la primera
en la dirección 1000 y cuatro bytes por `int`:

| índice | 0 | 1 | 2 | 3 | 4 | fin |
|---|---|---|---|---|---|---|
| dirección | 1000 | 1004 | 1008 | 1012 | 1016 | 1020 |
| valor | 9 | 1 | 8 | 3 | 5 | |

El recorrido por índice arranca en 1000, porque `v[0]` es la primera casilla.
El recorrido por iterador arranca también en 1000, porque `v.begin()` es esa
misma dirección. La diferencia está en quién hace la cuenta: con índice, el
programa escribe el número de casilla y el compilador multiplica por el tamaño
del tipo; con iterador, la cuenta ya está hecha adentro. Sumarle 1 a un
iterador no mueve un byte, mueve `sizeof(int)`, igual que con el puntero: de
1000 a 1004, no a 1001.

`v.end()` es 1020, la dirección que sigue a la última casilla. No es el último
elemento y no se lee nunca: sirve para saber que el recorrido terminó.

Imprimir la dirección confirma el dibujo, y pide un detalle de formato: `%p`
espera un `void *`, y un iterador no es un puntero, así que la dirección se
saca con `&(*it)` y se convierte.

```cpp
printf("it en %p, *it = %d\n", (void *) &(*it), *it);
printf("indice %ld\n", (long) (it - v.begin()));
```

La resta de dos iteradores tampoco es un `int`: es un entero con signo del
tamaño de un puntero, y con `%d` el compilador avisa. Las direcciones que salen
cambian en cada corrida, porque el sistema operativo entrega otra zona de
memoria cada vez; lo que no cambia es la distancia entre ellas, cuatro bytes
por `int`.

### El mismo recorrido, dos veces

```cpp
void imprimirIndice(vector<int> &v) {
  int p = 0;
  while (p < (int) v.size()) {
    printf(" %d", v[p]);
    p = p + 1;
  }
  printf("\n");
}

void imprimirIterador(vector<int> &v) {
  vector<int>::iterator it = v.begin();
  while (it != v.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
}
```

| con puntero sobre arreglo | con índice | con iterador |
|---|---|---|
| `int *p = a` | `int p = 0` | `it = v.begin()` |
| `p != a + n` | `p < n` | `it != v.end()` |
| `*p` | `v[p]` | `*it` |
| `++p` | `p = p + 1` | `++it` |
| `p - a` | `p` | `it - v.begin()` |
| `a + k` | `k` | `v.begin() + k` |

Las dos funciones imprimen `7 2 9 4` sobre `v = {7, 2, 9, 4}`. Las dos últimas
filas son las que se usan todo el tiempo: `v.begin() + k` es la posición $k$, e
`it - v.begin()` es el índice de la posición `it`. Con ese vector,
`*(v.begin() + 2)` es 9 y `(v.begin() + 2) - v.begin()` es 2.

Quien viene de Python ya escribió las dos formas. `for i in range(len(l))`
nombra la posición y llega al elemento con `l[i]`; `for x in l` nombra el
elemento directamente. El iterador es la segunda forma, con la posición
disponible por resta cuando se necesita.

`++it` e `it++` hacen lo mismo en un recorrido como el de arriba, porque el
valor de la expresión no se usa: solo interesa el efecto de avanzar. La
diferencia entre preincremento y posincremento aparece cuando el resultado se
usa de inmediato, en una asignación o en un argumento, y ahí el primero
entrega el valor nuevo y el segundo el viejo.

### El iterador frente al índice

En `vector` las dos formas cuestan lo mismo, $O(1)$ por paso. Hay dos razones
para aprender la segunda. La primera es que `begin()` y `end()` delimitan el
rango sin que nadie lleve el tamaño aparte: un arreglo de C no sabe cuántas
casillas tiene y hay que pasar el `n` en un parámetro, mientras que el par de
iteradores viaja completo. La segunda es que `list`, `map` y `set` no tienen
índice; ahí el recorrido por iterador es el único que existe.

### La cadena y el arreglo de C, con el mismo recorrido

```cpp
int vocales(string &s) {
  int c = 0;
  string::iterator it = s.begin();
  while (it != s.end()) {
    if (*it == 'a' || *it == 'e' || *it == 'i'
        || *it == 'o' || *it == 'u') {
      c = c + 1;
    }
    ++it;
  }
  return c;
}
```

Con `s = "iterador"` la función responde 4. Y un par de punteros a un arreglo
también es un rango de iteradores:

```cpp
int a[5] = {9, 1, 8, 3, 5};
sort(a, a + 5);            // un puntero es un iterador
```

Tras el `sort` el arreglo queda `1 3 5 8 9`. Los algoritmos de `<algorithm>`
piden un rango y no preguntan de dónde salió: el mismo `sort` ordena un
`vector`, un `string` o un arreglo de C.

`begin()`, `end()`, `*it`, `++it`, `it + k` e `it - v.begin()` cuestan $O(1)$
en un `vector` o un `string`, porque todas son sumas de direcciones. Un
recorrido completo cuesta $\Theta(n)$ en tiempo y $\Theta(1)$ de espacio aparte
del contenedor: lo único que se guarda es el iterador.

## El iterador colgante

```cpp
vector<int> v = {7, 2, 9, 4};
vector<int>::iterator it = v.begin() + 1;   // senala el 2
v.insert(v.begin(), 5);
printf("%d\n", *it);                        // ?
```

El vector queda en `5 7 2 9 4`, con el 2 corrido a la posición 2. La pregunta
es qué hay en la dirección que `it` guardó, y hay dos respuestas según lo que
haya pasado por dentro. Si el vector tenía capacidad de sobra, los elementos se
corrieron una casilla hacia la derecha dentro del mismo bloque de memoria y esa
dirección ahora guarda el 7, el elemento que se mudó a esa casilla: `it` no
señala al 2, señala una posición. Si no tenía capacidad, el vector pidió un
bloque más grande, copió todo allá y devolvió el viejo; entonces `it` guarda la
dirección de memoria que el vector ya no ocupa y lo que se lea ahí no significa
nada. Dos corridas del programa que hace eso con `{1, 2, 3, 4, 5}` imprimieron
340783330 y 1032748276.

Es el puntero colgante de la sesión de memoria dinámica con otro nombre. La
dirección vieja deja de servir cuando lo que estaba ahí se movió: quien llega
al salón que anuncia el registro académico, y no al que el curso se mudó,
encuentra el aula vacía aunque la dirección esté bien copiada.

La regla es una sola: **tras `insert` o `erase` el iterador guardado no vale y
se toma de nuevo.** Las dos operaciones devuelven uno para eso, y el que
devuelven no es el mismo:

- `insert` devuelve un iterador sobre el elemento que acabó de insertar.
- `erase` devuelve un iterador sobre el elemento que quedó inmediatamente
  después del borrado.

```cpp
vector<int> v = {7, 2, 9, 4};
vector<int>::iterator it = v.insert(v.begin(), 5);  // *it = 5, indice 0
it = v.begin() + 2;                                 // se vuelve a tomar: el 2
it = v.erase(it);                                   // *it = 9, indice 2
```

El vector queda `5 7 9 4`. Esa diferencia es la que hay que tener clara para
recorrer borrando.

Dos detalles sobre las posiciones que admiten estas operaciones. `insert` acepta
como posición hasta `v.end()`, que es `v.begin() + v.size()`, e insertar ahí
equivale a un `push_back`; más allá de `end()` la posición no está en el
contrato y el resultado no está definido, igual que `erase` sobre `end()`. Y
para cambiar un elemento no hay ninguna operación nueva: `v[p] = x` o
`v.at(p) = x`. `<algorithm>` sí trae `replace(v.begin(), v.end(), viejo,
nuevo)`, que cambia **todas** las apariciones de un valor en el rango y cuesta
$\Theta(n)$ porque recorre una vez; y `string` trae su propio `replace`, que
sustituye un tramo de texto por otro.

### Borrar mientras se recorre

Quitar todos los ceros de `{0, 3, 0, 0, 8, 1, 0}`:

```cpp
void quitarCerosErase(vector<int> &v) {
  vector<int>::iterator it = v.begin();
  while (it != v.end()) {
    if (*it == 0) {
      it = v.erase(it);   // el siguiente ya queda en it
    } else {
      ++it;               // se avanza solo si no se borro
    }
  }
}
```

El descuido típico al escribirla es llamar `v.erase(it)` sin recoger lo que
devuelve y hacer `++it` siempre. Tras el
`erase`, ese `it` no vale, y el `++` avanza sobre una posición que ya no
existe; cuando por casualidad no se cae, se salta un elemento, porque el
siguiente ya se había corrido a la casilla del borrado.

El costo es lo que hay que mirar antes de darla por buena. Cada `erase` en la
posición $p$ corre $n - p$ elementos hacia la izquierda, así que con $k$ ceros
el total es $O(kn)$, y $\Theta(n^2)$ cuando la mitad del vector son ceros. La
versión que compacta hace el mismo trabajo en un recorrido:

```cpp
void quitarCeros(vector<int> &v) {
  int destino = 0;
  int p = 0;
  while (p < (int) v.size()) {
    if (v[p] != 0) {
      v[destino] = v[p];     // se copia hacia el frente
      destino = destino + 1;
    }
    p = p + 1;
  }
  v.erase(v.begin() + destino, v.end());   // se recorta la cola
}
```

Las dos imprimen `3 8 1`. La segunda cuesta $\Theta(n)$ en tiempo y
$\Theta(1)$ de espacio: el `erase` de un rango que termina en `end()` no corre
nada, solo baja el tamaño. Las dos quedan, porque responden preguntas
distintas: la primera, cómo se borra sin invalidar el iterador; la segunda,
cuánto se ahorra no corriendo los elementos una vez por cada cero.

Una ventaja del contenedor sobre el arreglo manual aparece aquí: el vector
actualiza su tamaño solo. Borrar a mano era correr los elementos y además bajar
el `n`, y un `n` olvidado deja el arreglo mintiendo sobre lo que tiene.

## Los algoritmos que faltaban

### lower_bound: la posición que binary_search no daba

`binary_search` responde sí o no. Cuando lo que se necesita es **dónde**, el
algoritmo es `lower_bound`.

```cpp
vector<int> v = {5, 2, 3, 5, 1, 5, 8};
sort(v.begin(), v.end());              // < 1 2 3 5 5 5 8 >
vector<int>::iterator it = lower_bound(v.begin(), v.end(), 5);
int pos = (int) (it - v.begin());
if (it != v.end() && *it == 5) {
  printf("5 esta, la primera vez en la posicion %d\n", pos);
} else {
  printf("5 no esta; iria en la posicion %d\n", pos);
}
```

> **Contrato.** Sobre un rango ordenado, `lower_bound` devuelve la primera
> posición cuyo valor **no es menor** que $x$: la primera aparición de $x$ si
> está, o el sitio donde tendría que entrar si no está. Parte el rango por la
> mitad cada vez, $O(\log n)$, y exige el orden igual que `binary_search`.

Con las consultas 5, 4, 9 y 1 sobre ese vector:

```text
5 esta, la primera vez en la posicion 3
4 no esta; iria en la posicion 3
9 no esta; iria en la posicion 7
1 esta, la primera vez en la posicion 0
```

Las dos comprobaciones del `if` son necesarias y por razones distintas. La
segunda, `*it == 5`, separa el valor que está del sitio donde entraría: con 4
la respuesta también es la posición 3, que es donde está el primer 5. La
primera, `it != v.end()`, protege la lectura: cuando $x$ es mayor que todos, `lower_bound` devuelve
`end()`, y leer `*it` ahí es el error de la sección anterior. Con 9 el índice
es 7, que es el tamaño del vector.

`find` responde lo mismo sin exigir orden, en $\Theta(n)$. La cuenta que
decide entre los dos es cuántas consultas se van a hacer sobre el mismo
vector: ordenar cuesta $O(n \log n)$ una vez, y después cada consulta cuesta
$O(\log n)$ en lugar de $\Theta(n)$. Con una sola consulta gana `find`; con
muchas, ordenar y preguntar con `lower_bound`.

### unique: quitar repetidos en dos pasos

```cpp
vector<int> v = {4, 1, 4, 9, 1, 1, 4};
sort(v.begin(), v.end());                        // < 1 1 1 4 4 4 9 >
vector<int>::iterator fin = unique(v.begin(), v.end());
v.erase(fin, v.end());                           // < 1 4 9 >
```

Lo que deja cada paso:

```text
 1 1 1 4 4 4 9        tras sort
 1 4 9 4 4 4 9        tras unique: 3 distintos al frente
 1 4 9                tras erase
```

`unique` no borra. Copia hacia el frente cada valor distinto del anterior, como
`quitarCeros`, y devuelve el iterador que marca dónde termina lo válido; lo que
queda detrás de ese punto es basura del acomodo y no significa nada. El `erase`
desde `fin` hasta `end()` es el que completa la operación, y por eso la misma
variable aparece en las dos líneas.

La condición de uso es que solo junta repetidos **consecutivos**. Sin el `sort`
previo, `{4, 1, 4}` queda igual, porque los dos cuatros nunca se ven. El costo
total es $O(n \log n)$ del `sort`, más $\Theta(n)$ de `unique`, más el `erase`
final que no corre nada: manda el `sort`. La versión de la sesión de ejercicios
que borraba en medio con `eliminar` era $O(n^2)$; esta es más barata y cobra su
precio en otra parte, porque deja el vector ordenado y pierde el orden
original.

### accumulate: la suma y el tipo de la suma

```cpp
#include <numeric>
using std::accumulate;

vector<int> v(3, 1000000000);           // tres veces 10^9
int chico = accumulate(v.begin(), v.end(), 0);
long long grande = accumulate(v.begin(), v.end(), 0LL);
```

```text
con 0:   -1294967296
con 0LL: 3000000000
```

`accumulate` suma el rango partiendo del valor inicial, y el tipo de ese valor
inicial es el tipo en el que se acumula. Con `0` la suma se lleva en `int`, y
$3 \cdot 10^9$ no cabe en 32 bits: el resultado da la vuelta y sale negativo.
Con `0LL` se acumula en `long long` y el número cabe. El contenedor puede ser
de `int` y la suma no, y quien lo decide es el tercer argumento. Cuesta
$\Theta(n)$ en tiempo y $\Theta(1)$ de espacio.

Reducir un rango a un solo valor con una operación y un valor inicial tiene
nombre propio: `accumulate` es una reducción, la misma que en programación
funcional se escribe `reduce`.

### find sobre objetos

```cpp
#include <cstdio>
#include <vector>
#include <string>
#include <algorithm>
using std::vector;
using std::string;
using std::find;

class Estudiante {
public:
  string nombre;
  double nota;
  Estudiante(string n, double x) {
    nombre = n;
    nota = x;
  }
  // dos estudiantes son el mismo si tienen el mismo nombre
  bool operator==(const Estudiante &otro) const {
    return nombre == otro.nombre;
  }
};

int main() {
  vector<Estudiante> g;
  g.push_back(Estudiante("Sara", 3.8));
  g.push_back(Estudiante("Luis", 4.5));
  g.push_back(Estudiante("Ana", 3.8));
  vector<Estudiante>::iterator it = find(g.begin(), g.end(), Estudiante("Ana", 0));
  if (it != g.end()) {
    printf("Ana esta en la posicion %d con nota %.1f\n",
           (int) (it - g.begin()), it->nota);
  }
  it = find(g.begin(), g.end(), Estudiante("Juan", 0));
  printf("Juan %s\n", it == g.end() ? "no esta" : "esta");
  return 0;
}
```

Salida: `Ana esta en la posicion 2 con nota 3.8` y `Juan no esta`.

`find` compara con `==`, y cuando los elementos son de una clase propia ese
`==` lo escribe la clase, como el `+` de `Racional` en la sesión de
abstracción. Aquí igualdad quiere decir mismo nombre, así que el `0` de
`Estudiante("Ana", 0)` no participa de la búsqueda: es el relleno que pide el
constructor. Esta es la misma decisión que se toma al escribir `antes` para
`sort`: la biblioteca trae el algoritmo y la clase dice qué significan igual y
menor.

`it->nota` es `(*it).nota`: el iterador se usa como un puntero a objeto, con
la misma flecha. El costo es $\Theta(n)$ comparaciones en el peor caso, y cada
comparación cuesta lo que cueste el `==` de la clase; con nombres de hasta $m$
caracteres, la búsqueda completa es $O(nm)$, no $O(n)$.

## Ejercicios con la biblioteca

### La intersección con dos iteradores

Dados dos `vector<int>` ordenados, devolver los valores que están en los dos.
Con `{1, 3, 4, 7, 9}` y `{2, 3, 7, 8, 9}` el resultado es `3 7 9`, y debe
costar lo mismo que con las listas de la sesión de ejercicios,
$\Theta(n_a + n_b)$ en tiempo y $O(\min(n_a, n_b))$ de espacio para el
resultado. Con las listas eran dos índices que avanzaban; con iteradores es lo
mismo, cambiando `obtener(i)` por `*i` e `i + 1` por `++i`. Termina cuando
cualquiera de los dos llega a su `end()`.

```cpp
vector<int> interseccion(vector<int> &a, vector<int> &b) {
  vector<int> r;
  vector<int>::iterator i = a.begin();
  vector<int>::iterator j = b.begin();
  while (i != a.end() && j != b.end()) {
    if (*i < *j) {
      ++i;
    } else if (*j < *i) {
      ++j;
    } else {
      r.push_back(*i);
      ++i;
      ++j;
    }
  }
  return r;
}
```

Olvidar uno de los dos `++` de la rama de igualdad deja el ciclo girando sobre
el mismo par, y es el descuido más fácil de cometer aquí: cada vuelta tiene que
avanzar al menos un iterador, y esa es justamente la razón del costo
$\Theta(n_a + n_b)$.

**Con valores repetidos.** El recorrido conjunto empareja de uno en uno: con
`{3, 3, 3}` y `{3, 3, 3, 3}` el resultado es `3 3 3`, tantos como el mínimo de
las dos cantidades. Si lo que se quiere es el conjunto de valores comunes, el
resultado pasa por `unique` y `erase` y queda `3`. Con
`{1, 3, 3, 3, 4, 7, 9}` y `{2, 3, 3, 3, 3, 3, 7, 8, 9}` la intersección es
`3 3 3 7 9` y el conjunto es `3 7 9`. Un vector ordenado y sin repetidos ya es
un conjunto: se pregunta pertenencia en $O(\log n)$ con `lower_bound`. El
contenedor `set` ofrece ese mismo contrato con otra representación, un árbol
equilibrado, y llega cuando se haya construido el árbol.

**¿Conviene mirar primero cuál de los dos es más corto?** Con este recorrido no
se gana nada, porque el ciclo ya termina cuando el más corto llega a su
`end()`, y una comprobación previa solo agrega una rama. Donde el tamaño sí
decide es en la otra estrategia: buscar cada elemento del más corto dentro del
más largo con `lower_bound`, que cuesta $O(n_{\min} \log n_{\max})$. Con diez
elementos contra un millón, eso son unos $10 \cdot 20 = 200$ pasos frente al
millón y pico del recorrido conjunto, porque $\log_2 10^6 \approx 20$. Con
tamaños parecidos gana el recorrido conjunto. Las dos versiones son correctas y
la elección se hace con esa cuenta.

### Frecuencias con sort

Dado `vector<string> p = {"cola", "pila", "cola", "lista", "cola", "pila"}`,
imprimir cada palabra distinta con el número de veces que aparece, en orden
alfabético. Ordenar primero deja los iguales juntos, y entonces el conteo es un
solo recorrido, como en `unique`.

```cpp
sort(p.begin(), p.end());
vector<string>::iterator it = p.begin();
while (it != p.end()) {
  string actual = *it;
  int cuenta = 0;
  while (it != p.end() && *it == actual) {
    cuenta = cuenta + 1;
    ++it;
  }
  printf("%s %d\n", actual.c_str(), cuenta);
}
```

Salida: `cola 3`, `lista 1`, `pila 2`. Los dos ciclos comparten el mismo
iterador, y por eso cada elemento se visita una sola vez entre los dos: el de
afuera toma una palabra, el de adentro avanza mientras se repita. El conteo es
$\Theta(n)$ y el total lo manda el `sort`, $O(n \log n)$, con $\Theta(1)$ de
espacio aparte. Buscar cada palabra entre las ya contadas, sin ordenar, sería
$O(n^2)$.

### La mediana con sort

```cpp
double mediana(vector<int> v) {     // por valor: ordena una copia
  sort(v.begin(), v.end());
  int n = (int) v.size();
  double m = 0;
  if (n % 2 == 1) {
    m = v[n / 2];
  } else {
    m = (v[n / 2 - 1] + v[n / 2]) / 2.0;
  }
  return m;
}
```

Con `{9, 1, 7, 3, 5}` da 5.0 y con `{9, 1, 7, 4}` da 5.5; el vector del
llamador sigue como estaba. El parámetro va por valor a propósito: es la
decisión de que el llamador conserve su orden, y se paga con la copia,
$\Theta(n)$ de espacio, más el `sort`, $O(n \log n)$. Hallar el del medio sin
ordenar todo se puede en $\Theta(n)$, con `nth_element`, y es tema de un curso
posterior.

### La postfija con stack

El `evaluar` de la sesión de ejercicios, ahora sobre `stack<int>`: `"3 4 + 2 *"`
da 14 y `"8 2 - 3 *"` da 18.

```cpp
int evaluar(const char *s) {
  stack<int> p;
  int i = 0;
  while (s[i] != '\0') {
    if (s[i] >= '0' && s[i] <= '9') {
      p.push(s[i] - '0');
    } else if (s[i] != ' ') {
      int b = p.top();
      p.pop();
      int a = p.top();
      p.pop();
      if (s[i] == '+') {
        p.push(a + b);
      } else if (s[i] == '-') {
        p.push(a - b);
      } else {
        p.push(a * b);
      }
    }
    i = i + 1;
  }
  return p.top();
}
```

El orden de los dos `top` importa: el primero que sale es el operando derecho,
y con la resta `8 2 -` eso es la diferencia entre 6 y $-6$. La lógica es la de
la pila del curso con cinco palabras cambiadas; el recorrido es $\Theta(n)$ y
la pila llega a guardar tantos operandos como traiga la expresión, $O(n)$.

## Para el juez

Los tres problemas se resuelven con lo de esta sesión. Cada uno trae el
enunciado y el enlace de envío, que es donde el juez responde.

### UVa 10474 — Where is the Marble?

- Enunciado: <https://onlinejudge.org/external/104/10474.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1415>

$N$ canicas numeradas y $Q$ consultas. Para cada consulta $x$ hay que decir en
qué posición, contando desde 1, está la **primera** canica con ese número una
vez ordenadas, o que no está. Los casos llegan hasta la línea `0 0`; ningún
valor pasa de 10 000 y hay hasta 65 casos. La salida lleva `CASE# k:` y
después, por consulta, `x found at y` o `x not found`.

Cómo atacarlo: `sort` una vez por caso y `lower_bound` por consulta, que
devuelve exactamente la primera aparición; la posición pedida es
`it - v.begin() + 1`, porque el juez cuenta desde 1. Cuesta
$O(N \log N + Q \log N)$ por caso. La trampa son los dos chequeos de
`lower_bound`, que no sea `end()` y que el valor sea $x$, y vaciar el vector
entre casos: un vector que conserva las canicas del caso anterior responde
posiciones que no existen.

### UVa 11849 — CD

- Enunciado: <https://onlinejudge.org/external/118/11849.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2949>

Jack tiene $N$ discos y Jill $M$, cada lista en orden creciente y sin
repetidos, con hasta un millón de números cada una y valores hasta $10^9$. La
pregunta es cuántos títulos tienen los dos. Los casos terminan en `0 0` y la
salida es un entero por caso.

Cómo atacarlo: es la intersección contando en vez de guardando, dos iteradores
que avanzan, $\Theta(N + M)$. Las listas ya vienen ordenadas, así que no hay
`sort`. La trampa es el volumen: hasta dos millones de números por caso, que se
leen con `scanf` y no con `cin`. Buscar cada disco de Jack entre los de Jill
con `find` es $O(NM)$ y no alcanza el tiempo; con `binary_search` es $O(N \log M)$, que
alcanza a pasar pero es más lento que avanzar los dos iteradores.

### UVa 10008 — What's Cryptanalysis?

- Enunciado: <https://onlinejudge.org/external/100/10008.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=949>

Contar cuántas veces aparece cada letra en un texto, sin distinguir mayúsculas
de minúsculas, e imprimir las letras que aparecen de mayor a menor frecuencia;
en empate, en orden alfabético. La entrada trae una línea con $n$ y luego $n$
líneas de texto con espacios y signos, que se leen con `fgets`. Por cada letra
que aparece se imprime la mayúscula, un espacio y su cuenta.

Cómo atacarlo: un arreglo de 26 cuentas y después un `vector` de objetos
`{letra, cuenta}` ordenado con un criterio `antes`, cuenta de mayor a menor y,
en el empate, letra de menor a mayor con $<$ estricto. Es el `antes` de los
estudiantes con otros dos campos. La trampa es que solo cuentan las letras,
que `isalpha` decide y `toupper` unifica, y que una letra con cuenta 0 no se
imprime.

## Lo que cobra cada operación

$n$ es el número de elementos del contenedor.

| Operación | Tiempo | Espacio aparte del contenedor | Por qué |
|---|---|---|---|
| `begin`, `end`, `*it`, `++it`, `it + k`, `it - v.begin()` | $O(1)$ | $O(1)$ | se calcula la dirección con una suma y se lee esa casilla |
| recorrido completo con iterador | $\Theta(n)$ | $\Theta(1)$ | se pasa una vez por cada elemento y solo se guarda el iterador |
| `insert`, `erase` en la posición $p$ | $O(n - p)$ | $O(1)$ | se corre lo que sigue para abrir o cerrar el hueco |
| `erase` de un rango que termina en `end()` | $O(1)$ | $O(1)$ | detrás no queda nada que correr; solo baja el tamaño |
| borrar $k$ elementos con `it = v.erase(it)` | $O(kn)$ | $O(1)$ | cada borrado corre la cola completa otra vez |
| borrar $k$ elementos compactando | $\Theta(n)$ | $O(1)$ | un solo recorrido copia hacia el frente y el recorte al final no corre nada |
| `lower_bound` sobre rango ordenado | $O(\log n)$ | $O(1)$ | parte el rango por la mitad cada vez |
| `find` sobre un rango cualquiera | $\Theta(n)$ | $O(1)$ | se recorre una vez comparando con `==` |
| `find` sobre objetos con nombres de $m$ caracteres | $O(nm)$ | $O(1)$ | se recorre una vez y cada `==` compara dos cadenas |
| `unique` | $\Theta(n)$ | $O(1)$ | un recorrido que copia hacia el frente lo distinto del anterior |
| `accumulate` | $\Theta(n)$ | $O(1)$ | se suma una vez cada elemento |
| `replace` de `<algorithm>` | $\Theta(n)$ | $O(1)$ | hay que mirar todas las casillas para cambiar todas las apariciones |
| `sort` | $O(n \log n)$ | $O(\log n)$ | parte el rango y la recursión guarda los tramos pendientes |
| `interseccion` con dos iteradores | $\Theta(n_a + n_b)$ | $O(\min(n_a, n_b))$ | cada vuelta avanza al menos un iterador; el resultado no pasa del más corto |
| frecuencias con `sort` | $O(n \log n)$ | $\Theta(1)$ | manda el `sort`; el conteo visita cada palabra una vez |
| `mediana` recibida por valor | $O(n \log n)$ | $\Theta(n)$ | manda el `sort` y la copia del parámetro ocupa otro vector |
| `evaluar` postfija con `stack` | $\Theta(n)$ | $O(n)$ | un paso por carácter; la pila guarda los operandos pendientes |

Las operaciones del iterador son aritmética de direcciones y por eso no
dependen de $n$. Los algoritmos cobran lo que recorren, salvo `lower_bound`,
que parte por la mitad, y ese descuento es lo que paga exigiendo el orden. Lo
que queda de la sesión es que hay dos rutas al mismo resultado con costos
distintos, y que escoger es parte de programar: borrar uno a uno o compactar,
`find` por consulta u ordenar una vez y preguntar con `lower_bound`, recorrer
los dos vectores a la vez o buscar el corto dentro del largo.

## Para practicar en casa

### Propuesto 1

Escriba `alReves` recorriendo el `string` desde `s.end() - 1` hacia
`s.begin()`. ¿Cuál es la condición de parada?

### Propuesto 2

Con `{7, 2, 9, 4}` e `it = v.begin() + 3`, decida cuáles de `v[0] = 1`,
`sort`, `push_back` y `erase(v.begin())` dejan `it` válido.

### Propuesto 3

`upper_bound` devuelve la posición siguiente a la última aparición de $x$. Con
él y `lower_bound`, cuente cuántas veces está $x$ en $O(\log n)$.

### Propuesto 4

Cuente las frecuencias de las palabras sin ordenar, buscando cada una entre las
ya contadas con `find`. ¿Cuántas comparaciones hace con 6 palabras y con 60?

### Propuesto 5

Escriba la mediana en Python con `sorted`. ¿Qué operación paga ahí la copia que
en C++ se pagó al recibir el parámetro por valor?

## Ejercicios interactivos

Cinco actividades, una por tema de la sesión: posición e índice con
`v.begin() + 3` y qué es `end()` tras cinco avances; quitar los negativos con
`it = v.erase(it)` y el ciclo que se salta un elemento; `lower_bound` con
cuatro consultas, `unique` con `erase` y el `accumulate` que desborda; la
intersección con sus vueltas del `while`, las frecuencias y la mediana; y las
cuentas de costo, incluidas las mitades de `lower_bound` sobre 4096:
[página de ejercicios interactivos](./Ejercicios.md). Los programas no son los
de arriba: mismo tema, ronda nueva.

## Lo que sigue

Las implementaciones. Cómo se construye por dentro la lista estática que la
biblioteca ya trae, con su arreglo, su tamaño y sus corrimientos escritos a
mano, y con ella el primer algoritmo de ordenamiento del curso, insertion sort.

## Código de la clase

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

Todos los programas traen sus `using std::nombre` debajo de los `#include`.

**Iteradores**

- [iterador.cpp](codigo/iterador.cpp) — los dos recorridos, `vocales` con
  `string::iterator` y `sort` sobre un arreglo de C
- [ejemIterVector.cpp](codigo/ejemIterVector.cpp) — las direcciones que
  imprime un iterador antes y después de `insert`, con la salida observada en
  [ejemIterVector.out](codigo/ejemIterVector.out)
- [ejemIterVector2.cpp](codigo/ejemIterVector2.cpp) — el iterador que
  devuelve `insert` y su índice, con
  [ejemIterVector2.out](codigo/ejemIterVector2.out)

**El iterador colgante**

- [colgante.cpp](codigo/colgante.cpp) — lo que devuelven `insert` y `erase`,
  y el vector al final
- [quitar_ceros.cpp](codigo/quitar_ceros.cpp) — las dos versiones, con
  `erase` y compactando

**Los algoritmos que faltaban**

- [canicas.cpp](codigo/canicas.cpp) — `lower_bound` con las cuatro consultas
- [repetidos.cpp](codigo/repetidos.cpp) — `sort`, `unique` y `erase`, con lo
  que deja cada paso
- [acumular.cpp](codigo/acumular.cpp) — `accumulate` con `0` y con `0LL`
- [buscar_objeto.cpp](codigo/buscar_objeto.cpp) — `find` sobre
  `vector<Estudiante>` con `operator==`

**Ejercicios con la biblioteca**

- [interseccion.cpp](codigo/interseccion.cpp) — la intersección que devuelve
  un vector nuevo
- [ejercicio.cpp](codigo/ejercicio.cpp) — la variante que recibe el
  resultado por referencia y lo pasa por `unique` y `erase`
- [frecuencias.cpp](codigo/frecuencias.cpp) — el conteo con `sort` y los dos
  ciclos sobre el mismo iterador
- [mediana.cpp](codigo/mediana.cpp) — la mediana con el vector par y el impar
- [postfija_stack.cpp](codigo/postfija_stack.cpp) — `evaluar` sobre
  `stack<int>`

## Referencias

- B. Stroustrup. *The C++ Programming Language*, 4.ª ed. Addison-Wesley, 2013.
  Capítulo 33 (iteradores), capítulo 32 (algoritmos de la STL).
- cppreference: `std::vector::iterator`, `std::lower_bound`, `std::unique`,
  `std::accumulate`. <https://en.cppreference.com/w/cpp/iterator>,
  <https://en.cppreference.com/w/cpp/algorithm/lower_bound>,
  <https://en.cppreference.com/w/cpp/algorithm/unique>,
  <https://en.cppreference.com/w/cpp/algorithm/accumulate>
- UVa Online Judge, problema 10474, Where is the Marble?
  <https://onlinejudge.org/external/104/10474.pdf>
- UVa Online Judge, problema 11849, CD.
  <https://onlinejudge.org/external/118/11849.pdf>
- UVa Online Judge, problema 10008, What's Cryptanalysis?
  <https://onlinejudge.org/external/100/10008.pdf>
