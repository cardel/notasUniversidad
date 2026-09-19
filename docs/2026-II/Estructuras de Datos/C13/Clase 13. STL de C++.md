# Clase 13. STL de C++

Sábado 19 de septiembre de 2026, de 9:00 a 12:00.

Hasta esta sesión los tres contratos corrían sobre implementaciones propias,
estáticas y con capacidad fija. Hoy se cambian por las de la biblioteca
estándar de C++: `vector`, `string`, `stack` y `queue`, con los primeros
algoritmos de `<algorithm>`. Lo que se escribió contra `lista.h` se escribe
igual contra `vector`; esa es la prueba de que valió la pena separar el
contrato de la representación. La sesión cerró con un problema de juez
resuelto en vivo, UVa 673, donde lo que costó no fue la pila sino leer la
entrada.

Al final de la sesión el objetivo era poder usar `vector`, `string`, `stack`
y `queue` como implementaciones de los contratos ya vistos; traducir una
función escrita contra el TAD Lista a una escrita contra `vector` y explicar
qué cambió y qué no; distinguir el acceso vigilado (`at`) del no vigilado
(`[]`), y el paso por valor del paso por referencia en un contenedor; aplicar
`sort`, `find`, `binary_search`, `reverse`, `count`, `min_element` y
`max_element` con un criterio propio cuando haga falta; y decir qué cuesta en
tiempo y en espacio cada operación y cada algoritmo, escogiendo la operación
barata cuando el contrato ofrece dos caminos.

## Diapositivas

![](clase13.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Lo que dejaron los contratos

Lista, Pila y Cola son secuencias con distinta disciplina de acceso: por
posición, por el tope, por el frente. `mezclar`, `revertir`, `balanceado`,
`particionar` y la papa caliente se escribieron con el contrato solo, sobre una
implementación provisional que nadie miró por dentro. La pregunta con la que
abrió la sesión fue quién escribe esa implementación cuando el programa es de
verdad, cuando maneja cantidades grandes de datos y la capacidad fija de un
arreglo interno deja de servir. La respuesta de hoy es la biblioteca estándar
de C++, que trae esos tres contratos, y varios más, implementados, probados y
medidos. Las implementaciones propias siguen siendo el objetivo del curso
--saber cómo funcionan por dentro--, y las dinámicas llegan en el segundo
corte.

Para el parcial cuentan los contratos de `lista.h`, `pila.h` y `cola.h` tal
como quedaron en la sesión de contratos: en el examen no hay computador ni
celular, y la lectura de esos tres archivos es lo que hay que llevar en la
cabeza.

## Qué es la STL

La *Standard Template Library* es la parte de la biblioteca estándar que
provee tres piezas: **contenedores**, estructuras que guardan elementos;
**algoritmos**, operaciones sobre secuencias como ordenar o buscar; e
**iteradores**, la forma de señalar posiciones dentro de un contenedor, común
a todos ellos. Hoy se usan `vector`, `string`, `stack` y `queue`; `list`,
`deque`, `map`, `set` y `priority_queue` llegan cada uno cuando se haya
construido a mano la estructura que lo respalda. Los iteradores tienen sesión
propia: por ahora solo aparecen `v.begin()` y `v.end()`, que señalan el
principio y el final del contenedor, y son lo que hace falta para recorrer
colecciones que no tienen índice, como los conjuntos del segundo corte.

`vector` no es un tipo: es un molde de tipos. `vector<int>` produce la clase
para enteros, `vector<Estudiante>` la clase para estudiantes, y se puede tener
un vector de vectores, de pilas o de colas. En `lista.h` el tipo del elemento
era un `typedef` fijo; el `<int>` entre ángulos resuelve eso. Lo que se gana
es no escribir la implementación; lo que se cede es no verla: el costo de cada
operación hay que leerlo en la documentación, y se verifica cuando se
construyan las propias.

### Todo vive en el espacio de nombres `std`

El primer programa de la sesión no compiló. Con `#include <string>` arriba y
`string s = "hola"` abajo, el compilador respondió:

```
error: 'string' was not declared in this scope
note: suggested alternatives: 'std::string'
```

El `#include` trajo la declaración, pero cada nombre de la biblioteca estándar
está declarado dentro de un **espacio de nombres** llamado `std`, y desde
afuera solo se ve con su nombre completo, `std::string`. Son dos cosas
distintas: sin el `#include` el nombre no existe; sin el `std`, existe pero no
se alcanza. Hay tres maneras de alcanzarlo:

```cpp
std::string s = "hola";   // el nombre completo, cada vez

using std::string;        // se trae ese nombre y nada mas
string t = "hola";

using namespace std;      // se traen todos, de una vez
```

En el curso se escribe `using std::nombre`: una línea por cada nombre de la
biblioteca que el programa usa, debajo de los `#include`. El encabezado dice
qué se toma prestado y nada más entra. Con `using namespace std` entran
cientos de nombres a la vez, y si el programa declara una variable `count`, o
`size`, cada uso choca con la función de la biblioteca que se llama igual:

```
error: reference to 'count' is ambiguous
```

Vale también para lo que viene de C: `fgets` de `<cstdio>` se trae con
`using std::fgets`, como quedó en el programa del juez al final de la sesión.
Todos los programas de esta clase llevan sus `using` así.

## vector

### Crear, medir, leer

```cpp
vector<int> v;                  // vacio
vector<int> w(5, 0);            // cinco ceros
vector<int> a = {4, 5, 9};      // con valores

int n = a.size();               // 3
int x = a[1];                   // 5, sin vigilar
int y = a.at(1);                // 5, vigilado
bool e = v.empty();             // true
```

En `w(5, 0)` el primer argumento es el tamaño y el segundo el valor que va en
todas las posiciones. `size()` devuelve un entero sin signo; al compararlo con
un `int` el compilador avisa, y en el curso se escribe `(int) v.size()`.

`v[p]` y `v.at(p)` responden lo mismo cuando $0 \leq p < \texttt{size}()$ y
difieren en qué pasa cuando no. `at` hace lo que hacía el `assert` de
`lista.h`: comprueba la precondición y detiene el programa donde nace el
error, diciendo qué índice y qué tamaño:

```
v.at(1) = 2
terminate called after throwing an instance of 'std::out_of_range'
  what():  vector::_M_range_check: __n (which is 5) >= this->size() (which is 2)
```

`v[5]` sobre ese mismo vector no avisa: lee memoria que no es del vector. A
veces sale basura, a veces el programa sigue como si nada, a veces se cae más
adelante. Es la misma situación del `struct` expuesto con denominador cero:
ninguna regla del lenguaje se violó y el resultado no significa nada. `[]` es
más rápido porque no comprueba, y se usa cuando el programa ya aseguró el
rango, como en un ciclo de $0$ a $\texttt{size}() - 1$. Fuera de eso, `at`.

### Las operaciones, una por una

| con `vector` | con el TAD Lista | estado |
|---|---|---|
| `push_back(5)`, `push_back(8)` | `agregar(5)`, `agregar(8)` | `< 5 8 >` |
| `insert(v.begin() + 1, 7)` | `insertar(1, 7)` | `< 5 7 8 >` |
| `erase(v.begin() + 0)` | `eliminar(0)` | `< 7 8 >` |
| `v[1] = 2` | `asignar(1, 2)` | `< 7 2 >` |
| `size()`, `empty()` | `tamano()`, `vacia()` | `2, 0` |

Es la traza de la sesión de contratos con otros nombres. `v.begin() + p` es
la manera de decir *la posición $p$* a `insert` y a `erase`: el mismo
corrimiento sobre un puntero que se vio con los arreglos. `insert` admite
$p = \texttt{size}()$ y `erase` no, exactamente como `insertar` y `eliminar`,
y ninguna de las dos vigila el rango.

### Por valor o por referencia

```cpp
void duplicarCopia(vector<int> v) {   // recibe una copia
  int p = 0;
  while (p < (int) v.size()) {
    v[p] = 2 * v[p];
    p = p + 1;
  }
}

void duplicar(vector<int> &v) {       // trabaja sobre el mismo vector
  int p = 0;
  while (p < (int) v.size()) {
    v[p] = 2 * v[p];
    p = p + 1;
  }
}
```

Con `v = {3, 4}`, tras `duplicarCopia` el vector sigue en `3 4`; tras
`duplicar` queda en `6 8`. Sin `&` la función recibe una copia completa: sus
cambios se pierden al volver y copiar costó tantos pasos como elementos había.
Con `&` trabaja sobre el mismo vector, la regla que ya se usaba con
`Lista &l`. En Java y en Python las colecciones pasan por referencia sin que
uno lo pida; en C++ hay que escribir el `&`, y los contenedores se pasan
siempre así salvo que se quiera la copia a propósito.

### El área del programador, ahora sobre `vector`

`copiarDesde`, `revertir` y `mezclar` se tradujeron una a una. Cambiaron los
nombres y no cambió una sola decisión: las dos posiciones de `mezclar`, el
$\leq$ del empate, el resto copiado con la función auxiliar. Las salidas son
las mismas de la sesión de contratos, `< 1 4 5 5 8 9 >` y `< 9 8 5 5 4 1 >`.

| antes | ahora |
|---|---|
| `Lista &a` | `vector<int> &a` |
| `a.tamano()` | `(int) a.size()` |
| `a.obtener(i)` | `a[i]` |
| `r.agregar(x)` | `r.push_back(x)` |
| `r.insertar(0, x)` | `r.insert(r.begin(), x)` |

Los costos, con $n$ el total de elementos: `mezclar` cuesta $\Theta(n)$ en
tiempo, $n$ `push_back` de $O(1)$, y $\Theta(n)$ de espacio, el vector nuevo.
`revertir` con `insert` al frente cuesta $\Theta(n^2)$, y en el tablero se
contó por qué: insertar al inicio corre todo lo que ya está, así que la
$k$-ésima inserción corre $k - 1$ elementos. Con $1, 2, 3, 4, 5$ las
inserciones corren $0 + 1 + 2 + 3 + 4 = 10$ elementos; con $n$ elementos,
$n(n-1)/2$. Con `push_back` recorriendo desde el final sería $\Theta(n)$ con
el mismo espacio. Mismo contrato, mismo resultado, costo distinto.

### Un vector de vectores

```cpp
vector<vector<int> > m(3, vector<int>(4, 0));
m[1][2] = 6;          // fila 1, columna 2
m[1].push_back(99);   // la fila 1 ahora tiene 5 columnas
int filas = m.size();
int columnasFila1 = m[1].size();
```

`m` es un vector cuyos elementos son vectores: una matriz de 3 filas y 4
columnas, todas en cero. A diferencia del arreglo bidimensional de C, cada
fila puede cambiar de tamaño por su cuenta; es cómodo y a veces una trampa,
porque un recorrido que asume filas iguales se cae en la que creció. El
número de columnas de una fila se pregunta con `m[i].size()`, no con una
constante. Los dos `>` van con un espacio entre ellos: antes de C++11 el
compilador leía `>>` como el operador de corrimiento de bits y no compilaba,
y aunque los compiladores actuales lo aceptan pegado, el espacio se sigue
escribiendo. Salida real del programa que la llena con $i \cdot 4 + j$: la
fila 1 imprime `4 5 6 7 99`.

Antes de pasar a las cadenas se trabajó en clase la actividad interactiva de
`vector`, con una secuencia de `push_back`, `insert`, `erase` y asignación para
predecir el estado final.

## string

Para cadenas de caracteres hay dos opciones: `char *`, un puntero a `char`
que solo permite lo mismo que un arreglo, consultar y cambiar posiciones; y
`string`, que además concatena, compara, convierte, saca pedazos y, más
adelante, reconoce formatos. Se incluye con `<string>` y se escribe entre
comillas dobles: las simples son para un `char`.

```cpp
#include <string>
using std::string;

string s = "estructura";
string t = s + " de datos";    // 19 caracteres
char c = s[0];                 // 'e'
int n = s.size();              // 10
bool igual = (s == "pila");    // false
bool antes = (s < "pila");     // true: orden alfabetico
printf("%s\n", t.c_str());     // para printf, c_str()
```

Tiene `size`, `[]`, `at` y `push_back`: el mismo contrato de `vector<char>`,
más lo propio del texto. La comparación con `<` va letra a letra: `estructura`
está antes que `pila` porque la `e` está antes que la `p`; y una cadena que es
prefijo de otra se asume menor, así que `cola < colar`. `printf` no sabe de
`string`: se le pasa `s.c_str()`, el arreglo de `char` que la cadena guarda por
dentro. Contar las vocales de una cadena es el recorrido de todo vector, de la
posición $0$ a $\texttt{size}() - 1$: `vocales de estructura: 4`.

### Al revés, en vivo

El ejercicio en parejas era escribir `alReves(s)`, una cadena nueva con los
caracteres en orden inverso, y usarla para decidir si `reconocer` se lee igual
al derecho y al revés. Se resolvió en el terminal insertando siempre al
principio:

```cpp
string alreves(string s) {
  string r = "";
  for (int i = 0; i < (int)s.size(); i++) {
    r.insert(r.begin(), s[i]);
  }
  return r;
}
```

Al compilar salió el error del espacio de nombres, `'string' was not declared
in this scope`, y se arregló con `using std::string;`. Después faltó el
`c_str()` para el `%s` del `printf`. Con `estructuras` la función devuelve
`sarutcurtse` y la comparación con `==` da falso; con `reconocer` devuelve
`reconocer` y da verdadero. En el archivo quedó `%b` para imprimir el booleano,
que las versiones recientes de gcc aceptan; `%d` hace lo mismo en cualquier
compilador.

El costo de esta versión es el de `revertir` con `insert` al frente: cada
inserción corre lo ya escrito y el tiempo es $\Theta(n^2)$. Recorrer desde el
final con `push_back` hace $n$ pasos de $O(1)$, $\Theta(n)$ en tiempo, con el
mismo $\Theta(n)$ de espacio para la cadena nueva. `vocales` cuesta
$\Theta(n)$ en tiempo y $\Theta(1)$ de espacio aparte de la cadena.

## stack y queue

| contrato del curso | `stack<T>` | `queue<T>` |
|---|---|---|
| `apilar` / `encolar` | `push(x)` | `push(x)` |
| `desapilar` / `desencolar` | `pop()` | `pop()` |
| `tope` / `frente` | `top()` | `front()` |
| `tamano`, `vacia` | `size()`, `empty()` | `size()`, `empty()` |

Se incluyen con `<stack>` y `<queue>`. `pop` no devuelve el valor, igual que
`desapilar`: se lee con `top` o `front` antes. Y `top`, `front` y `pop` sobre
un contenedor vacío no avisan: no hay `at` para ellos. La precondición
$n > 0$ sigue siendo del llamador y se vigila con `empty()` antes de llamar.

`balanceado` sobre `stack<char>` es el de la sesión de ejercicios con cinco
palabras cambiadas: `stack<char>`, `push`, `empty`, `top`, `pop`. La lógica,
las precondiciones y la traza son las mismas. `imprimir` una `queue` sin
destruirla es dar la vuelta completa: `size()` veces, leer el frente,
sacarlo y volverlo a encolar; no hay forma de leer el segundo elemento sin
sacar el primero, porque la biblioteca no agrega operaciones al contrato,
solo lo implementa.

Los costos son los de `Pila` y `Cola`: `push`, `pop`, `top`, `front`, `size`
y `empty` cuestan $O(1)$ y la estructura ocupa $\Theta(n)$. `balanceado` sigue
en $\Theta(n)$ de tiempo y $O(n)$ de espacio; `imprimir`, en $\Theta(n)$ de
tiempo y $\Theta(1)$ aparte de la cola.

### UVa 673 en vivo: lo que costó fue la entrada

Enunciado: <https://onlinejudge.org/external/6/673.pdf>. Envío:
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=614>.

Es `balanceado` tal cual, y así quedó la pila: apertura, `push`; cierre con la
pila vacía, falso; cierre con pila, se lee el tope, se compara con `cierre` y
se saca. La respuesta es `Yes` cuando todo cerró bien y la pila quedó vacía.
Un primer intento marcaba falso en el cierre que no casaba pero dejaba el
símbolo en la pila, y el siguiente cierre lo volvía a comparar; el `pop` va
siempre que la pila no esté vacía.

La lectura fue lo que se llevó la media hora. La primera línea trae $n$ y se
lee con `scanf("%d")`, que deja el salto de línea sin consumir; hay que
gastarlo con `while (getchar() != '\n');` antes de leer las cadenas. Cada
cadena se lee entera con `fgets` en un arreglo de `char` de tamaño fijo
(`SIZE 1024`; el enunciado garantiza 128), porque `scanf("%s")` se salta las
líneas vacías y una línea vacía es una cadena correcta que vale `Yes`. `fgets`
deja el `\n` al final, así que el recorrido termina en `\n` o en `\0`. Y en
el primer ciclo faltó el `j++`: el programa se quedó dando vueltas sobre el
mismo carácter hasta que se encontró la causa imprimiendo lo que leía.

```cpp
int n;
scanf("%d", &n);
while (getchar() != '\n')
  ;
for (int i = 0; i < n; i++) {
  char linea[SIZE];
  fgets(linea, SIZE, stdin);
  int j = 0;
  bool ok = true;
  stack<char> p;
  while (linea[j] != '\n' && linea[j] != '\0') {
    char s = linea[j];
    if (s == '(' || s == '[') {
      p.push(s);
    } else {
      if (p.empty()) {
        ok = false;
      } else {
        char c = p.top();
        if (!cierre(c, s)) {
          ok = false;
        }
        p.pop();
      }
    }
    j++;
  }
  string sal = (ok && p.empty()) ? "Yes" : "No";
  printf("%s\n", sal.c_str());
}
```

La cuenta de UVa no dejó entrar durante la clase, así que el programa se
comprobó con los casos de prueba de udebug para el problema,
<https://www.udebug.com/UVa/673>: con la segunda entrada, `diff` entre la
salida del programa y la esperada no reportó diferencias. En Python `input()`
captura la línea completa; en C++ hay que decidir cuánto reservar y quién
consume cada salto de línea, y eso es lo que hay que ensayar antes de enviar
a la arena.

## Los primeros algoritmos

```cpp
#include <algorithm>
using std::sort;   using std::reverse;   using std::count;
using std::min_element;   using std::max_element;

vector<int> v = {9, 4, 7, 1, 4, 8};
sort(v.begin(), v.end());        // < 1 4 4 7 8 9 >
reverse(v.begin(), v.end());     // < 9 8 7 4 4 1 >
int c = count(v.begin(), v.end(), 4);      // 2
int menor = *min_element(v.begin(), v.end());   // 1
int mayor = *max_element(v.begin(), v.end());   // 9
```

Todo algoritmo recibe un **rango**: desde dónde y hasta dónde. `v.begin()`
señala el primer elemento y `v.end()` señala justo después del último, así que
el rango cubre el vector completo. `min_element` devuelve la posición del
menor, no el menor; el `*` adelante lee lo que hay en esa posición. Qué es
exactamente esa posición es el tema de la sesión de iteradores.

`find` recorre de principio a fin y devuelve la posición del primer igual, o
`v.end()` si no lo halla; restar `v.begin()` convierte la posición en índice.
`binary_search` responde solo sí o no, en muchos menos pasos, porque parte el
rango por la mitad cada vez; a cambio exige que el vector esté ordenado. Con
`{9, 4, 7, 1, 4, 8}` sin ordenar, `binary_search` de 7 responde 0 y `find`
de 7 dice que está. No avisa: la precondición *ordenado* es del llamador,
como $q \neq 0$ era del que llamaba a `crear`. Un algoritmo rápido con la
precondición rota es un algoritmo que miente; `find` no exige nada y por eso
acierta, y cobra recorrer todo.

### Ordenar con un criterio propio

`sort` sabe ordenar enteros porque sabe comparar enteros. Con estudiantes hay
que decirle quién va antes: una función que recibe dos y responde verdadero
si el primero debe quedar antes que el segundo.

```cpp
// dice si a debe ir antes que b
bool antes(Estudiante a, Estudiante b) {
  bool r = false;
  if (a.nota != b.nota) {
    r = a.nota > b.nota;
  } else {
    r = a.nombre < b.nombre;
  }
  return r;
}

sort(g.begin(), g.end(), antes);
```

Con Sara 3.8, Luis 4.5, Ana 3.8 y Juan 4.1 el orden queda Luis, Juan, Ana,
Sara: con $>$ en la nota queda descendente y, en el empate de 3.8, el $<$ en
el nombre pone a Ana antes que a Sara. El tercer argumento de `sort` es la
función. Un criterio que responda verdadero para `antes(a, b)` y también para
`antes(b, a)` rompe a `sort`, y por eso el empate se resuelve con $<$ estricto
y no con $\leq$.

## Lo que cobra cada operación

| Operación | Tiempo | Espacio aparte del contenedor |
|---|---|---|
| `v[p]`, `at`, `size`, `empty` | $O(1)$ | $O(1)$ |
| `push_back`, `pop_back` | $O(1)$ amortizado | $O(1)$ |
| `insert`, `erase` en la posición $p$ | $O(n - p)$ | $O(1)$ |
| `string`: `+` | $O(n)$ | $O(n)$, la cadena nueva |
| `string`: `==`, `<` | $O(n)$ | $O(1)$ |
| `stack` y `queue`: todas | $O(1)$ | $O(1)$ |
| `find`, `count`, `min_element`, `reverse` | $\Theta(n)$ | $O(1)$ |
| `binary_search` | $O(\log n)$ | $O(1)$ |
| `sort` | $O(n \log n)$ | $O(\log n)$, la recursión |

Las de $O(1)$ tocan una casilla calculada o un extremo; las de $O(n - p)$
corren lo que sigue; `find` y compañía recorren una vez; `binary_search`
parte por la mitad y por eso exige orden; `push_back` es amortizado porque de
vez en cuando copia todo a un arreglo mayor. `vector`, `string`, `stack` y
`queue` ocupan $\Theta(n)$ para $n$ elementos, y el `vector` reserva de más
para que `push_back` no copie cada vez: su capacidad puede superar su tamaño
hasta el doble. Un `insert` en la mitad de seis elementos corre cuatro;
`revertir` insertando al frente cinco elementos corre diez en total;
`binary_search` sobre un millón de elementos da unos veinte pasos, porque
$\log_2 10^6 \approx 20$.

## Para practicar en casa

### Propuesto 1

Reescriba `particionar` de la sesión de contratos sobre `queue<int>`. Cuente
cuántas palabras cambiaron.

### Propuesto 2

Lo mismo con la papa caliente, `ultimo(n, k)`, sobre `queue<int>`. Verifique
que con $n = 5$ y $k = 3$ queda 4.

### Propuesto 3

Dado un `vector<int>`, devuelva la mediana usando `sort`. ¿Qué costo tiene?
¿Hace falta ordenar todo para hallarla?

### Propuesto 4

Dado un `vector<string>`, imprima cada palabra distinta con el número de veces
que aparece. Ordene primero; después el recuento es un solo recorrido.

### Propuesto 5

Escriba el criterio para que `sort` deje un `vector<int>` de mayor a menor, y
compare con `sort` seguido de `reverse`.

## Ejercicios interactivos

Cinco actividades, una por tema de la sesión: el estado final de un `vector`
tras una secuencia de operaciones, cuatro expresiones con `string`, un `stack`
con un `pop` en la mitad, `sort` con un criterio que desempata por nombre al
revés junto a `binary_search` sobre un vector sin ordenar, y las cuentas de
costo: [página de ejercicios interactivos](./Ejercicios.md). Los programas
no son los de arriba: mismo tema, ronda nueva. Las de `vector`, `algoritmos`
y `costos` se recorrieron en clase.

## Lo que sigue

La sesión siguiente es de ejercicios con la STL: qué es de verdad
`v.begin()`, cómo recorrer cualquier contenedor con iteradores y los
algoritmos que faltan, y con eso cierra el material del primer parcial. El
parcial cubre todo desde la primera sesión, teoría y código.

## Código de la clase

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

Todos los programas traen sus `using std::nombre` debajo de los `#include`.

**vector**

- [vector_operaciones.cpp](codigo/vector_operaciones.cpp) — `push_back`,
  `insert`, `erase` y asignación, con la traza de la tabla
- [vector_at.cpp](codigo/vector_at.cpp) — `at` fuera de rango y lo que
  imprime el programa al detenerse
- [vector_paso.cpp](codigo/vector_paso.cpp) — `duplicarCopia` y `duplicar`
- [vector_area.cpp](codigo/vector_area.cpp) — `copiarDesde`, `revertir` y
  `mezclar` sobre `vector<int>`
- [matriz.cpp](codigo/matriz.cpp) — el vector de vectores con una fila que
  crece

**string**

- [cadena.cpp](codigo/cadena.cpp) — las operaciones de `string` y `vocales`
- [alreves.cpp](codigo/alreves.cpp) — `alreves` tal como quedó en pantalla,
  con `estructuras` y `reconocer`

**stack y queue**

- [stack_queue.cpp](codigo/stack_queue.cpp) — `balanceado` con `stack` e
  `imprimir` con `queue`
- [uva673.cpp](codigo/uva673/uva673.cpp) — la solución de UVa 673 tal como
  quedó en pantalla, con las entradas [1.in](codigo/uva673/1.in),
  [2.in](codigo/uva673/2.in) y [3.in](codigo/uva673/3.in) y las salidas
  esperadas [1.out](codigo/uva673/1.out) y [2.out](codigo/uva673/2.out)

**Los primeros algoritmos**

- [algoritmos.cpp](codigo/algoritmos.cpp) — `sort`, `reverse`, `count`,
  `min_element`, `max_element`, `find` y `binary_search`
- [binary_sin_ordenar.cpp](codigo/binary_sin_ordenar.cpp) —
  `binary_search` y `find` sobre el vector sin ordenar
- [ordenar_estudiantes.cpp](codigo/ordenar_estudiantes.cpp) — `sort` con el
  criterio `antes`

## Referencias

- B. Stroustrup. *The C++ Programming Language*, 4.ª ed. Addison-Wesley,
  2013. Capítulo 14 (espacios de nombres), capítulo 31 (contenedores de la
  STL), capítulo 32 (algoritmos de la STL).
- cppreference: `std::vector`, `std::stack`, `std::sort`.
  <https://en.cppreference.com/w/cpp/container/vector>,
  <https://en.cppreference.com/w/cpp/container/stack>,
  <https://en.cppreference.com/w/cpp/algorithm/sort>
- UVa Online Judge, problema 673, Parentheses Balance.
  <https://onlinejudge.org/external/6/673.pdf>
- udebug, casos de prueba del problema 673. <https://www.udebug.com/UVa/673>
