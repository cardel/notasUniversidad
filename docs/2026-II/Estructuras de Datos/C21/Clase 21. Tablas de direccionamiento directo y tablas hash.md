# Estructuras de Datos · Clase 21. Tablas de direccionamiento directo y tablas hash

Miércoles 21 de octubre de 2026, de 17:00 a 19:00.

La sesión abre un TAD nuevo, el Diccionario, con su implementación más directa:
guardar cada elemento en la casilla que dice su clave, para buscar sin
recorrer. Esa tabla reserva una casilla por cada clave posible, y con
documentos de 10 dígitos eso son $10^{10}$ casillas para guardar 40. La
segunda parte dobla ese universo sobre una tabla corta con una función hash,
resuelve los choques con una lista enlazada en cada casilla y mide lo que
cuesta cada operación según qué tan llenas están las listas.

Al terminar, el objetivo es poder definir el TAD Diccionario e implementarlo
con una tabla de direccionamiento directo, con el costo en tiempo y en espacio
de cada operación; reconocer cuándo el universo de claves hace inviable esa
tabla; calcular la casilla de una clave entera o de una cadena con el método
de la división; insertar, buscar y eliminar a mano y en C++ en una tabla hash
con encadenamiento; y dar el costo de cada operación en función del factor de
carga $\alpha = n/m$, escogiendo el número de casillas $m$.

## Diapositivas

![](./clase21.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## TAD tabla de direccionamiento directo

### ¿Quién entró al laboratorio?

En la puerta de un laboratorio se registra a cada estudiante que entra, con un
código entre 0 y 999 y su nombre. Durante el día llegan miles de preguntas:
¿entró el 412? Y a veces se retira un registro. Hay tres clases de orden:
registrar un código con un nombre, preguntar por un código y retirar un código.
Un código no se registra dos veces; si llega otra vez, cambia el nombre. Por
cada pregunta se imprime el nombre registrado con ese código, o `no esta`.

Con códigos de 0 a 9, se registran 3 Ana, 7 Luis y 0 Eva; se pregunta por el 7
y por el 5, se retira el 3 y se pregunta por el 3. Salen `buscar(7): Luis`,
`buscar(5): no esta` y `buscar(3): no esta`: el 3 estuvo registrado, pero se
retiró antes de la pregunta.

### Primera idea: una lista

Los registros en una `list`, en orden de llegada. Preguntar camina desde el
comienzo hasta encontrar el código. De
[asistencia_lista.cpp](./codigo/asistencia_lista.cpp):

```cpp
// Theta(n) en el peor caso: camina hasta encontrar la clave o hasta el final
list<Registro>::iterator buscar(list<Registro> &l, int clave) {
  list<Registro>::iterator it = l.begin();
  while (it != l.end() && it->clave != clave) {
    ++it;
  }
  return it;
}
```

| Operación | Tiempo | Por qué |
|---|---|---|
| registrar | $\Theta(1)$ | `push_back`, si no se revisa que el código ya esté |
| preguntar | $\Theta(n)$ en el peor caso | camina nodo a nodo; un código que no está recorre los $n$ |
| retirar | $\Theta(n)$ en el peor caso | buscar el nodo; `erase` ya es $\Theta(1)$ |

Con 800 registrados y 10 000 preguntas por códigos que no están, se recorren
8 000 000 nodos. El espacio es $\Theta(n)$. Pero el código ya es un número
entre 0 y 999: puede decir él mismo dónde está guardado.

### La clave dice la casilla

Un arreglo con una casilla por cada código posible: el registro del código $k$
va en la casilla $k$. Con códigos de 0 a 9 son diez casillas, todas vacías al
comenzar.

| Operación | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| `insertar(3, Ana)` | | | | **Ana** | | | | | | |
| `insertar(7, Luis)` | | | | Ana | | | | **Luis** | | |
| `insertar(0, Eva)` | **Eva** | | | Ana | | | | Luis | | |
| `eliminar(3)` | Eva | | | | | | | Luis | | |

`buscar(7)` lee una casilla, la 7, y ahí está Luis. `buscar(5)` también lee una
sola: la casilla 5 está vacía, así que el 5 no está registrado, y no hace falta
mirar las demás. Después de `eliminar(3)`, `buscar(3)` lee la casilla 3 vacía y
dice que no está. Ninguna operación miró más de una casilla, y ninguna dependió
de cuántos registros había.

### El TAD Diccionario

Un **diccionario** es un conjunto dinámico de elementos, cada uno con una
*clave* y datos que la acompañan, con tres operaciones (CLRS, introducción del
capítulo 11): `insertar(x)` agrega el elemento `x`; `buscar(k)` devuelve el
elemento de clave `k`, o `NULL` si no hay; `eliminar(k)` quita el elemento de
clave `k`.

Una **tabla de direccionamiento directo** (CLRS, §11.1) sirve cuando las claves
salen de un universo $U = \{0, 1, \ldots, m - 1\}$, con $m$ no muy grande, y dos
elementos no tienen la misma clave. La tabla es un arreglo $T[0..m-1]$: la
casilla $k$ apunta al elemento de clave $k$, o vale `NULL` si no hay ninguno.
En el laboratorio el universo son los códigos de 0 a 999, $m = 1000$; el
elemento es un registro con código y nombre, y la clave es el código.

En pseudocódigo, cada operación calcula una dirección y lee o escribe una
casilla, sin ciclo ni comparación de claves:

```text
buscar(T, k)
    devolver T[k]

insertar(T, x)
    T[x.clave] <- x

eliminar(T, k)
    T[k] <- NULL
```

!!! warning "Lo que la tabla supone"

    - Toda clave está entre 0 y $m - 1$. Una clave fuera de ese rango escribe
      fuera del arreglo.
    - Las claves no se repiten: con dos registros de clave 3, el segundo ocupa
      la casilla del primero.

### `TablaDirecta` en C++

Un arreglo de punteros a `Registro` pedido con `new`, todos en `NULL` al
comenzar. De [tabla_directa.h](./codigo/tabla_directa.h):

```cpp
struct Registro {
  int clave;
  char nombre[20];
};

class TablaDirecta {
private:
  Registro **T;      // T[k] apunta al registro de clave k, o vale NULL
  int m;             // tamano del universo de claves

public:
  // Theta(m): todas las casillas empiezan vacias
  TablaDirecta(int tam) {
    m = tam;
    T = new Registro*[m];
    int k = 0;
    while (k < m) {
      T[k] = NULL;
      k = k + 1;
    }
  }

  // Theta(m): se revisan todas las casillas
  ~TablaDirecta() {
    int k = 0;
    while (k < m) {
      delete T[k];
      k = k + 1;
    }
    delete[] T;
  }

  // exige 0 <= clave < m; si la clave ya estaba, cambia el nombre
  void insertar(int clave, const char *nombre) {
    assert(clave >= 0 && clave < m);
    if (T[clave] == NULL) {
      T[clave] = new Registro;
      T[clave]->clave = clave;
    }
    strcpy(T[clave]->nombre, nombre);
  }

  // exige 0 <= clave < m; devuelve NULL si no hay registro
  Registro *buscar(int clave) {
    assert(clave >= 0 && clave < m);
    return T[clave];
  }

  // exige 0 <= clave < m
  void eliminar(int clave) {
    assert(clave >= 0 && clave < m);
    delete T[clave];
    T[clave] = NULL;
  }
```

La tabla es dueña de los registros: `insertar` los pide con `new` y `eliminar`
los libera con `delete`. `delete` sobre `NULL` no hace nada, así que eliminar un
código que no está es válido. `buscar` devuelve el puntero de la casilla: o el
registro, o `NULL`.

El nombre se copia con `strcpy` dentro del arreglo del registro. Si `Registro`
guardara un `const char *nombre` y `insertar` asignara el puntero, la tabla
apuntaría al arreglo de quien llamó: cuando ese arreglo se reutiliza para leer
el siguiente nombre, el registro cambia con él, y cuando se libera, el registro
apunta a memoria que ya no es suya.

[tabla_uso.cpp](./codigo/tabla_uso.cpp) repite el laboratorio con la tabla:

```cpp
int main() {
  TablaDirecta t(10);
  t.insertar(3, "Ana");
  t.insertar(7, "Luis");
  t.insertar(0, "Eva");
  t.imprimir();
  consultar(t, 7);
  consultar(t, 5);
  t.eliminar(3);
  consultar(t, 3);
  t.imprimir();
  return 0;
}
```

| Operación | Casilla | Leídas | Salida |
|---|---|---|---|
| `insertar(3, Ana)` | 3 | 1 | |
| `insertar(7, Luis)` | 7 | 1 | |
| `insertar(0, Eva)` | 0 | 1 | |
| `imprimir()` | todas | 10 | ` 0:Eva 1:- 2:- 3:Ana 4:- 5:- 6:- 7:Luis 8:- 9:-` |
| `consultar(7)` | 7 | 1 | `buscar(7): Luis` |
| `consultar(5)` | 5 | 1 | `buscar(5): no esta` |
| `eliminar(3)` | 3 | 1 | |
| `consultar(3)` | 3 | 1 | `buscar(3): no esta` |
| `imprimir()` | todas | 10 | ` 0:Eva 1:- 2:- 3:- 4:- 5:- 6:- 7:Luis 8:- 9:-` |

La salida es la misma que la de la lista. Cambia cuántas casillas se miran: una
por operación, salvo `imprimir`, que recorre las $m$.

### Lo que cobra la tabla

| Operación | Tiempo | Por qué |
|---|---|---|
| crear la tabla | $\Theta(m)$ | cada casilla empieza en `NULL` |
| `insertar(k, nombre)` | $\Theta(1)$ | la clave es la dirección: una casilla y, si está vacía, un `new` |
| `buscar(k)` | $\Theta(1)$ | se lee $T[k]$ |
| `eliminar(k)` | $\Theta(1)$ | un `delete` y $T[k] \gets$ `NULL` |
| `imprimir`, destruir | $\Theta(m)$ | recorren todas las casillas, llenas o vacías |

El espacio es $\Theta(m)$ punteros, uno por clave *posible*, más $\Theta(n)$
registros, uno por clave guardada. Como $n \leq m$, el total es
$\Theta(m) = \Theta(|U|)$: lo fija el universo, no lo que se guarda. Con
$m = 1000$ y punteros de 8 bytes, la tabla vacía ya ocupa 8000 bytes.

Llena, la cuenta suma los registros. Un `Registro` guarda la clave, un `int` de
4 bytes, y `nombre[20]`, 20 bytes de un `char` cada uno; con `g++` en una
máquina de 64 bits, `sizeof(Registro)` da 24. Las 1000 casillas ocupadas piden
$1000 \cdot 8 + 1000 \cdot 24 = 32\,000$ bytes, y la parte de los punteros no
baja aunque se borren todos los registros.

## Pocas claves, universo enorme: la función hash

### El límite: un universo grande

La puerta del laboratorio registra ahora por número de documento, de hasta 10
dígitos, y en un día entran 40 personas. [limite.cpp](./codigo/limite.cpp)
calcula lo que ocupan solo los punteros: imprime `puntero: 8 bytes`,
`m = 1000: 8000 bytes` y `m = 10000000000: 80000000000 bytes`. Son 80 GB para
guardar 40 registros, que usarían 40 casillas de $10^{10}$, y crear la tabla
cuesta $\Theta(m)$: poner $10^{10}$ casillas en `NULL` antes de la primera
pregunta.

Las entradas son los $n$ documentos registrados y una lista de consultas; la
salida, `si` o `no` por consulta. Con `8920104417`, `8920104452` y
`8920103990` registrados, `8920104452` da `si`, `8920104400` da `no` y
`8920103990` da `si`.

| | Buscar | Espacio | Sirve cuando |
|---|---|---|---|
| Lista enlazada | $\Theta(n)$ | $\Theta(n)$ | $n$ es pequeño |
| Tabla directa | $\Theta(1)$ | $\Theta(\lvert U \rvert)$, con $\lvert U \rvert = 10^{10}$ | $\lvert U \rvert$ es pequeño |
| Lo que se quiere | cerca de $\Theta(1)$ | cerca de $\Theta(n)$ | $n$ y $\lvert U \rvert$ son grandes |

Con la lista, $q$ consultas por documentos que no están recorren $q \cdot n$
nodos; con la tabla directa, casi todas las casillas quedan vacías.

### La función hash

Con una tabla de 100 casillas y la casilla dada por los dos últimos dígitos,
`8920104417` va a la 17, `8920104452` a la 52 y `8920103990` a la 90. Buscar es
mirar una casilla. Pero `8920105517` también va a la 17: dos documentos distintos
piden la misma casilla.

**Definición (CLRS, §11.2).** Una *función hash*
$h : U \to \{0, 1, \ldots, m - 1\}$ asigna a cada clave del universo una
casilla de la tabla $T[0..m-1]$; la clave $k$ se guarda en $T[h(k)]$, y $h(k)$
es su *valor hash*. Dos claves distintas con el mismo valor hash forman una
*colisión*. Si $|U| > m$, las colisiones no se pueden evitar del todo.

**El método de la división (CLRS, §11.3).** $h(k) = k \bmod m$. Los dos últimos
dígitos son $k \bmod 100$. Con $m = 7$:

| $k$ | $k \bmod 7$ | $h(k)$ |
|---|---|---|
| 10 | $10 = 1 \cdot 7 + 3$ | 3 |
| 23 | $23 = 3 \cdot 7 + 2$ | 2 |
| 5 | $5 = 0 \cdot 7 + 5$ | 5 |
| 17 | $17 = 2 \cdot 7 + 3$ | 3 |

10 y 17 colisionan en la casilla 3. Calcular $h(k)$ es una división,
$\Theta(1)$. En C++, `k % m` da el residuo solo si $k \geq 0$.

### Claves que son palabras

Sumar los códigos de los caracteres no ve el orden: con $m = 13$, `sol` da
$115 + 111 + 108 = 334$ y $334 \bmod 13 = 9$, y `los` también da 9. Toda
palabra choca con sus anagramas.

La cadena $c_0 c_1 \cdots c_{L-1}$ se lee como un número en base $b$,
$(\cdots((c_0 \cdot b + c_1) \cdot b + c_2) \cdots) \cdot b + c_{L-1}$, y la
casilla es ese número módulo $m$. Con $b = 31$ y $m = 13$, reduciendo en cada
paso:

| Paso | Carácter | Código | $h \leftarrow (h \cdot 31 + c) \bmod 13$ |
|---|---|---|---|
| 1 | `s` | 115 | $(0 \cdot 31 + 115) \bmod 13 = 11$ |
| 2 | `o` | 111 | $452 \bmod 13 = 10$ |
| 3 | `l` | 108 | $418 \bmod 13 = 2$ |

Se reduce en cada paso porque, sin reducir, una palabra de seis letras
minúsculas ya pasa de $97 \cdot 31^5 \approx 2{,}8 \cdot 10^9$, más de lo que
cabe en un `int`. Con la reducción, $h < m$ siempre, y el residuo final es el
mismo. Con `sol` se comprueba sin la tabla:
$115 \cdot 31^2 + 111 \cdot 31 + 108 = 114\,064 = 13 \cdot 8774 + 2$. El residuo
de una suma y el de un producto se pueden sacar de los residuos de sus
términos, así que reducir en cada vuelta da el mismo 2 con números que se
quedan en unos cientos. Sin reducir, una palabra de ocho letras como `solecito`
aporta en su primera letra $115 \cdot 31^7 \approx 3{,}2 \cdot 10^{12}$, unas
1500 veces el máximo de un `int`.

[hash_cadenas.cpp](./codigo/hash_cadenas.cpp) calcula las dos funciones:

| Palabra | Suma | Polinomio |
|---|---|---|
| `sol` | 9 | 2 |
| `los` | 9 | 3 |
| `gato` | 11 | 1 |
| `toga` | 11 | 12 |

Calcular el valor hash de una cadena de $L$ caracteres cuesta $\Theta(L)$.

## Encadenamiento

**Encadenamiento (CLRS, §11.2).** Cada casilla $T[i]$ guarda la cabeza de una
lista enlazada con todas las claves $k$ tales que $h(k) = i$; una casilla sin
claves guarda `NULL`. Cada nodo es el de la lista enlazada simple: la clave y
el puntero al siguiente.

Con $m = 7$ se insertan 10, 23, 5, 17, 12 y 31, en ese orden. Cada clave nueva
se cuelga al frente de su lista: el nodo nuevo apunta a la cabeza vieja y la
casilla apunta al nodo nuevo, dos punteros sin importar el largo de la lista.

| Clave | $h(k)$ | Largo de su lista | Casillas vacías |
|---|---|---|---|
| 10 | 3 | 1 | 6 |
| 23 | 2 | 1 | 5 |
| 5 | 5 | 1 | 4 |
| 17 | 3 | 2 | 4 |
| 12 | 5 | 2 | 4 |
| 31 | 3 | 3 | 4 |

La tabla queda así:

```text
0:
1:
2: 23
3: 31 17 10
4:
5: 12 5
6:
```

- **Buscar 17.** $h(17) = 3$: se compara con 31 y con 17. Dos comparaciones, y
  las listas de las casillas 2 y 5 no se miran.
- **Buscar 24.** $h(24) = 3$: se compara con 31, 17 y 10 y se llega a `NULL`.
  Una búsqueda que falla recorre la lista completa de su casilla.
- **Eliminar 17.** Se recorre la lista de la casilla 3 con `anterior` y
  `actual`; cuando `actual` llega al 17, el `siguiente` de 31 pasa a ser el 10 y
  el nodo se libera. Si la clave está en la cabeza no hay `anterior`, y la que
  cambia es la casilla: eliminar 31 deja `casillas[3]` en el 17.

!!! warning "Un arreglo de `Lista` no sirve"

    Con `Lista casillas[7]`, `insertar(0, k)` cuesta $\Theta(1)$, pero buscar con
    `obtener(p)` para $p = 0, 1, \ldots$ camina desde la cabeza en cada llamada:
    $0 + 1 + \cdots + (L - 1) = L(L-1)/2$ pasos en una lista de largo $L$,
    $\Theta(L^2)$ en lugar de $\Theta(L)$. La tabla recorre sus nodos con un
    puntero que avanza.

La implementación está en [tabla_hash.h](./codigo/tabla_hash.h): un arreglo
`Nodo **casillas` de $m$ cabezas creado con `new[]`, y `buscar`, `insertar`,
`eliminar`, `largo` e `imprimir`. `insertar` no revisa si la clave ya está; si
las claves pueden repetirse, se llama a `buscar` antes. El destructor libera
cada nodo con `delete` y el arreglo con `delete[]`.
[hash_uso.cpp](./codigo/hash_uso.cpp) corre el ejemplo y reproduce la tabla de
arriba.

## Lo que cuesta

**Factor de carga (CLRS, §11.2).** Con $n$ claves en $m$ casillas,
$\alpha = n/m$ es el largo promedio de las listas. En el ejemplo,
$\alpha = 6/7 \approx 0{,}86$, y tras eliminar 17, $5/7 \approx 0{,}71$.

**Peor caso.** Las claves 3, 10, 17, 24, 31 y 38 dejan todas residuo 3 con
$m = 7$: una sola lista con las $n$ claves y seis casillas vacías. Buscar 45
compara con las seis. Buscar y eliminar cuestan $\Theta(n)$, como en la lista
enlazada.

**Caso promedio.** Con hashing uniforme independiente (cada clave cae en
cualquiera de las $m$ casillas con la misma probabilidad, sin importar dónde
cayeron las demás), CLRS (teoremas 11.1 y 11.2) concluye que una búsqueda que
falla y una que acierta cuestan, en promedio, $\Theta(1 + \alpha)$: el 1 es
calcular $h(k)$ y llegar a la casilla, y $\alpha$ es el recorrido.

El cociente $n/m$ se calcula para cualquier función; el hashing uniforme es lo
que lo vuelve el largo esperado de la lista que se recorre. Sigue siendo un
promedio: con 70 claves en 7 casillas, $\alpha = 10$, y aun con una buena
función alguna lista pasa de 10 y otra se queda corta. En el ejemplo, con
$\alpha \approx 0{,}86$, hay una lista de 3 y cuatro casillas vacías.

Ordenar cada lista no trae búsqueda binaria. Para llegar al nodo del medio de
una lista enlazada hay que caminar desde la cabeza, y partir en mitades cuesta
lo mismo que recorrer; la búsqueda binaria pide el acceso por posición en
$\Theta(1)$ de un arreglo. Con la lista ordenada, una búsqueda que falla se
detiene en la primera clave mayor, pero sigue en $\Theta(1 + \alpha)$ promedio
y $\Theta(n)$ en el peor caso, e `insertar` sube de $\Theta(1)$ a
$\Theta(1 + \alpha)$ porque primero busca el lugar.

Las tablas de las bibliotecas mantienen $\alpha$ acotado agrandándose: cuando
$\alpha$ pasa de un umbral reservan un arreglo más grande, recalculan $h(k)$ con
el $m$ nuevo y cuelgan cada clave en su lista nueva. Esa pasada cuesta
$\Theta(m + n)$ y no ocurre en cada inserción. En un diccionario de Python,
`d["Carlos"] = 40` sobre una clave que ya estaba reemplaza el valor, como
`insertar` en la tabla directa: es la misma clave, no una colisión. Dos claves
distintas que caen en la misma casilla quedan guardadas las dos.

**Teorema.** Si la tabla tiene $m \geq n/2$ casillas, entonces
$f(n) = 1 + n/m$ es $O(1)$.

**Demostración.** Se procede de forma directa: se busca una constante $c$ y un
$k$ tales que $f(n) \leq c \cdot 1$ para todo $n \geq k$.

**Desarrollo.**

$$
\begin{aligned}
f(n) &= 1 + \frac{n}{m} && \text{definición de } \alpha \\
&\leq 1 + \frac{n}{n/2} && m \geq n/2\text{: dividir entre más da menos} \\
&= 1 + 2 = 3 && \frac{n}{n/2} = 2 \text{ para } n \geq 1 \\
&= 3 \cdot 1 && \text{se toma } c = 3
\end{aligned}
$$

La desigualdad vale desde $n = 1$, así que $k = 1$.

**Conclusión.** Por lo tanto, se puede concluir que $1 + \alpha \in O(1)$ con
testigos $c = 3$ y $k = 1$: si la tabla mantiene al menos una casilla por cada
dos claves, buscar y eliminar cuestan $O(1)$ en promedio. Con $m$ fijo, en
cambio, $\alpha$ crece con $n$ y buscar vuelve a ser lineal.

| Operación | Promedio | Peor caso | Por qué |
|---|---|---|---|
| $h(k)$, clave entera | $\Theta(1)$ | $\Theta(1)$ | una división |
| $h(s)$, cadena de $L$ | $\Theta(L)$ | $\Theta(L)$ | una vuelta por carácter |
| `insertar(k)` | $\Theta(1)$ | $\Theta(1)$ | se cuelga al frente de su lista |
| `buscar(k)` | $\Theta(1 + \alpha)$ | $\Theta(n)$ | se recorre una lista; en el peor caso tiene todas las claves |
| insertar sin repetir | $\Theta(1 + \alpha)$ | $\Theta(n)$ | primero se busca |
| `eliminar(k)` | $\Theta(1 + \alpha)$ | $\Theta(n)$ | se busca con `anterior`; desenlazar es $\Theta(1)$ |
| `largo(i)` | $\Theta(1 + \alpha)$ | $\Theta(n)$ | se cuentan los nodos de una lista |
| `imprimir`, destructor | $\Theta(m + n)$ | $\Theta(m + n)$ | se visitan las $m$ casillas y los $n$ nodos |
| constructor | $\Theta(m)$ | $\Theta(m)$ | $m$ cabezas en `NULL` |

La tabla ocupa $\Theta(m + n)$: el arreglo de $m$ cabezas y un nodo por clave.
Ninguna operación pide memoria aparte que crezca con $n$.

### Escoger $m$

[dispersion.cpp](./codigo/dispersion.cpp) inserta las 1000 claves
$k = \mathit{paso} \cdot i$, con $i = 1, \ldots, 1000$, y cuenta con `largo`:

| $m$ | paso | Casillas vacías | Lista más larga | $\alpha$ |
|---|---|---|---|---|
| 64 | 1 | 0 | 16 | 15,6 |
| 64 | 4 | 48 | 63 | 15,6 |
| 61 | 4 | 0 | 17 | 16,4 |
| 61 | 61 | 60 | 1000 | 16,4 |

- $64 = 2^6$, y $k \bmod 2^6$ son los últimos 6 bits de $k$. Un múltiplo de 4
  termina en `00`: solo quedan las 16 casillas múltiplos de 4, y las listas
  miden cuatro veces $\alpha$.
- Con el primo 61, los múltiplos de 4 recorren todos los residuos.
- Ningún $m$ resiste un patrón hecho a su medida: con paso 61, las 1000 claves
  caen en la casilla 0.

Con el método de la división se escoge un primo que no esté cerca de una
potencia de 2 (CLRS, §11.3). Una potencia de 2 o de 10 usa solo los últimos
bits o los últimos dígitos de la clave, como la tabla de 100 casillas con los
documentos.

Multiplicar por $2^j$ corre los bits $j$ lugares a la izquierda:
$7 = 111_2$ y $7 \cdot 8 = 111000_2 = 32 + 16 + 8 = 56$. Dividir entre $2^j$
los corre a la derecha, y lo que sale por la derecha es el residuo: $111_2$
entre 2 da $11_2 = 3$ y sobra el último bit, 1. Con
$1000 = 1111101000_2$, el residuo módulo 4 son los dos últimos bits,
$00_2 = 0$, y módulo 64 los seis últimos, $101000_2 = 40$. De ahí salen las
dos caras de $m = 2^j$. El procesador cambia la división por un
desplazamiento, que es más barato; y dos claves con los mismos $j$ bits finales
caen juntas, sin importar el resto. Con un primo lejos de una potencia de 2 o
de 10, cada bit de la clave influye en el residuo. Ninguna elección de $m$
evita todos los choques: para cualquier $m$ hay claves que caen en la misma
casilla.

## Para el juez

### UVa 484: The Department of Redundancy Department

*UVa 484, The Department of Redundancy Department*:
<https://onlinejudge.org/external/4/484.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=425>.

Una tabla hash con encadenamiento cuyo nodo guarda la clave y un contador.

La entrada es una secuencia de enteros positivos, negativos o cero, tan larga
como se quiera, hasta el fin del archivo. Por cada entero distinto se imprime
una línea con el entero y cuántas veces apareció, en el orden en que apareció
por primera vez. Con `3 1 2 2 1 3 5 3 3 2` sale `3 4`, `1 2`, `2 3` y `5 1`: el
3 va primero porque fue el primero en llegar.

Por cada número se busca en su lista: si está, se suma uno; si no, se cuelga
un nodo con cuenta 1 y el número se anota en un arreglo de claves en orden de
llegada. Al final se recorre ese arreglo y se busca la cuenta de cada una. Con
$m = 100\,003$, primo, cada número cuesta $\Theta(1 + \alpha)$ en promedio.

!!! warning "Las trampas"

    - Los negativos: en C++, `-7 % 5` da $-2$. Con `k % m` como casilla, un
      negativo escribe fuera del arreglo. La casilla es `((k % m) + m) % m`.
    - No se sabe cuántos números vienen, así que no hay $n$ para dimensionar:
      $m$ se fija grande desde el comienzo.
    - $-100\,003$, $0$ y $100\,003$ caen en la misma casilla y son claves
      distintas: la lista compara la clave, no la casilla.

### Solución

Lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uva484.in`.

- UVa 484, The Department of Redundancy Department:
  [uva484.cpp](./codigo/uva484.cpp), [entrada](./codigo/uva484.in),
  [salida](./codigo/uva484.out)

## Lo que se vio

- El TAD Diccionario tiene `insertar`, `buscar` y `eliminar`. Con claves en
  $U = \{0, \ldots, m - 1\}$, la tabla de direccionamiento directo hace las tres
  en $\Theta(1)$: la clave es la casilla.
- Crear, recorrer y destruir la tabla directa cuestan $\Theta(m)$, y el espacio
  es $\Theta(\lvert U \rvert)$ aunque se guarden pocas claves: con documentos de
  10 dígitos, solo los punteros ocupan 80 000 000 000 bytes.
- Una función hash $h : U \to \{0, \ldots, m - 1\}$ lleva cada clave a una
  casilla. Con el método de la división, $h(k) = k \bmod m$.
- Una cadena se lee como un número en base 31 y se reduce módulo $m$ en cada
  paso; sumar los códigos de los caracteres hace chocar a todos los anagramas.
  El valor hash de una cadena de $L$ caracteres cuesta $\Theta(L)$.
- Si el universo tiene más claves que la tabla casillas, las colisiones son
  inevitables. Con encadenamiento cada casilla es la cabeza de una lista
  enlazada, y una clave nueva se cuelga al frente en $\Theta(1)$.
- Buscar y eliminar recorren una sola lista, la de $h(k)$; eliminar en la
  cabeza cambia la casilla, no un `siguiente`.
- Con $\alpha = n/m$, buscar y eliminar cuestan $\Theta(1 + \alpha)$ en promedio
  bajo hashing uniforme independiente y $\Theta(n)$ en el peor caso; con
  $m \geq n/2$, $1 + \alpha \leq 3$. La tabla ocupa $\Theta(m + n)$.
- Con $m = 64$ y claves múltiplos de 4, 48 casillas quedaron vacías y la lista
  más larga midió 63; con $m = 61$, ninguna vacía y 17 la más larga.
- En C++ el residuo de un negativo es negativo: la casilla se calcula con
  `((k % m) + m) % m`.

## Ejercicios

### A mano

Inserten, en este orden, 22, 5, 16, 38, 27, 49 y 3 en una tabla con
encadenamiento de $m = 11$ casillas, colgando al frente. Dibujen la tabla.
¿Cuánto vale $\alpha$ y cuánto mide la lista más larga? ¿Cuántas comparaciones
hace buscar 60? Repitan con $m = 10$: ¿qué tabla queda mejor repartida, y por
qué no es la del primo?

Con $m = 11$, 22 va a la casilla 0, 3 a la 3, y 5, 16, 38, 27 y 49 a la 5, con
la lista `49 27 38 16 5`; $\alpha = 7/11 \approx 0{,}64$ y la lista más larga
mide 5. Buscar 60 hace cinco comparaciones y llega a `NULL`. Con $m = 10$ cada
clave va a su propia casilla: las claves 5, 16, 27, 38 y 49 van de 11 en 11, un
patrón hecho a la medida de $m = 11$.

### Dos que suman $x$

Dado un arreglo de $n$ enteros no negativos y un número $x$, decir si hay dos
casillas distintas cuyos valores suman $x$. Con
$a = \langle 8, 3, 11, 6, 2, 15 \rangle$: $x = 9$ sí ($3 + 6$), $x = 21$ sí
($6 + 15$) y $x = 12$ no, porque hay un solo 6. Probar todas las parejas cuesta
$\Theta(n^2)$. Con la tabla, al llegar a $a[i]$ se busca $x - a[i]$ entre los
ya vistos y después se guarda $a[i]$; buscar antes de guardar es lo que impide
usar el 6 dos veces. Son $n$ búsquedas e inserciones: $\Theta(n)$ en promedio
con $m$ proporcional a $n$, más $\Theta(n)$ de espacio aparte.
[sumapar.cpp](./codigo/sumapar.cpp) imprime `1`, `1` y `0`.

## Para practicar en casa

### Propuesto 1: conjunto de banderas

Implemente un conjunto de enteros de 0 a $m - 1$ con un arreglo de `bool`:
`agregar`, `quitar`, `pertenece`, `unir` e `intersecar`. Dé el costo de cada
una.

Pista: las tres primeras leen o escriben una casilla, $\Theta(1)$; unir e
intersecar recorren las $m$ casillas con `||` y `&&`, $\Theta(m)$.

### Propuesto 2: ¿hay repetidos?

Dado un arreglo de $n$ enteros, todos entre 0 y 999, diga si algún valor
aparece dos veces. Escriba la versión que compara cada par y la que usa una
tabla de 1000 casillas, y compare sus costos con
$\langle 412, 87, 903, 15, 87, 230 \rangle$ y con
$\langle 5, 999, 0, 314 \rangle$.

??? note "Lo que debe salir"

    El primer arreglo tiene el 87 dos veces: `si`. El segundo, `no`. La versión
    que compara pares revisa los $n(n-1)/2$ pares: $\Theta(n^2)$ en el peor
    caso, con espacio aparte $\Theta(1)$. Con la tabla, la casilla $v$ guarda
    una bandera: si ya apareció el valor $v$. Iniciar cuesta $\Theta(m)$ y
    recorrer $O(n)$, en total $O(n + m)$ con $m = 1000$, y $\Theta(m)$ de
    espacio aparte. Las dos versiones de [repetidos.cpp](./codigo/repetidos.cpp)
    imprimen `a: si si` y `b: no no`.

### Propuesto 3: un universo que no empieza en 0

Los códigos del laboratorio van ahora de 1000 a 1999. Escriba `buscar` e
`insertar` con una tabla de 1000 casillas. Después, los códigos válidos son
solo los pares entre 0 y 1998: ¿cuántas casillas hacen falta, y qué cuenta
convierte un código en su casilla?

Pista: restar 1000 deja las claves entre 0 y 999. Con los pares, la cuenta que
se busca también es una sola operación.

### Propuesto 4: distintos

Escriba una función que cuente cuántos valores distintos hay en un arreglo de
$n$ enteros no negativos con la tabla hash. ¿Cuánto cuesta? ¿Y ordenando
primero?

Pista: se busca cada valor y, si no estaba, se inserta y se suma uno.
$\Theta(n)$ en promedio con $m$ proporcional a $n$; ordenando,
$\Theta(n \log n)$ y un recorrido que compara vecinos.

### Propuesto 5: tabla de palabras

Cambie la clave de `TablaHash` a una cadena de hasta 20 letras, con
`hashPolinomio` como $h$. ¿Qué cambia en `buscar`?

Pista: el nodo guarda un arreglo de `char`; la comparación `actual->clave != k`
pasa a ser `strcmp`, y cada comparación cuesta lo que la cadena.

### Propuesto 6: el peor caso a la medida

Para $m = 13$, escriba ocho claves que caigan todas en la casilla 4, y cuente
cuántas comparaciones hace buscar una clave que no está.

Pista: sirve cualquier clave $4 + 13j$. Buscar una que no está recorre las
ocho.

### Propuesto 7: repartir documentos

Genere 2000 documentos de 10 dígitos que comparten los seis primeros y mida,
con `largo`, la lista más larga y las casillas vacías con $m = 100$, $m = 128$
y $m = 101$.

Pista: con 100 casillas solo cuentan los dos últimos dígitos, y con 128, los
últimos 7 bits. Compare con el primo.

### Propuesto 8: eliminar con la lista doble

Si cada casilla fuera una lista doblemente enlazada y se tuviera el nodo en la
mano, ¿cuánto costaría eliminar?

Pista: con `anterior` en cada nodo no hay que buscar al de antes: desenlazar es
$\Theta(1)$ (CLRS, §11.2).

### Propuesto para el juez: UVa 442, Matrix Chain Multiplication

*UVa 442, Matrix Chain Multiplication*,
<https://onlinejudge.org/external/4/442.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=383>.

Llegan $n \leq 26$ matrices, cada una con una letra mayúscula, sus filas y sus
columnas. Después, hasta el fin de archivo, una expresión por línea con
paréntesis completos, como `(A(BC))`. Multiplicar una matriz de $p \times q$
por una de $q \times r$ cuesta $p \cdot q \cdot r$ multiplicaciones. Por cada
expresión se imprime el total, o `error` si dos matrices no se pueden
multiplicar. Con $A$ de $50 \times 10$, $B$ de $10 \times 20$ y $C$ de
$20 \times 5$: `A` da 0, `(AA)` da `error`, `(A(BC))` da 3500 y `((AB)C)` da
15000.

Pista: las dimensiones van en una tabla directa de 26 casillas, la de la letra
`c` en la casilla `c - 'A'`, y leerla cuesta $\Theta(1)$, sin buscar. La
expresión se lee de izquierda a derecha con una `stack` de dimensiones. Una
letra apila su matriz; un `)` saca dos, revisa que las columnas de la izquierda
sean las filas de la derecha, suma $p \cdot q \cdot r$ y apila la matriz de
$p \times r$ que resulta. $\Theta(L)$ por expresión de largo $L$.

!!! warning "Las trampas"

    - El primero que sale de la pila es la matriz de la *derecha*. Con el orden
      al revés, `(AB)` revisa las columnas de $B$ contra las filas de $A$ y da
      `error`.
    - Una expresión de una sola letra no multiplica nada: imprime 0.
    - El enunciado no acota las dimensiones: el total se acumula en
      `long long`.

??? note "Solución"

    [uva442.cpp](./codigo/uva442.cpp), con la [entrada](./codigo/uva442.in) y
    la [salida](./codigo/uva442.out) del enunciado: `./sol < uva442.in`.

## Ejercicios interactivos

Doce actividades que se trabajan en el navegador, ordenadas por los temas de la
sesión, en la [página de ejercicios](./Ejercicios.md): una tabla directa de
ocho casillas paso a paso; el costo de cada operación y tres universos para
decidir si la tabla directa sirve; una tabla de contadores y lo que ocupa; la
búsqueda de repetidos con banderas; cuánto ocupa una tabla directa para
teléfonos de 7 dígitos; la casilla de cada clave con $m = 17$; el polinomio de
`mar` y `ram`; seis claves que entran a una tabla de cinco casillas; cuántas
comparaciones hace cada búsqueda; el factor de carga frente a la lista más
larga; las mismas claves con $m = 100$, 128 y 97; y el residuo de C++ con
claves negativas. Los valores no son los de la sesión: mismo tema, ronda nueva.

## Lo que sigue

El contenedor `map` de la biblioteca, que guarda pares de clave y valor, y
problemas que se resuelven con él.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

**Tabla de direccionamiento directo**

- [asistencia_lista.cpp](./codigo/asistencia_lista.cpp): el laboratorio con una
  `list`. Imprime `buscar(7): Luis`, `buscar(5): no esta` y
  `buscar(3): no esta`.
- [tabla_directa.h](./codigo/tabla_directa.h): la clase `TablaDirecta`.
- [tabla_uso.cpp](./codigo/tabla_uso.cpp): el laboratorio con la tabla; las
  mismas tres respuestas y la tabla antes y después de `eliminar(3)`.
- [limite.cpp](./codigo/limite.cpp): los bytes de los punteros para
  $m = 1000$ y para $m = 10^{10}$.
- [repetidos.cpp](./codigo/repetidos.cpp): la versión que compara pares y la
  de banderas. Imprime `a: si si` y `b: no no`.

**Tabla hash con encadenamiento**

- [tabla_hash.h](./codigo/tabla_hash.h): `buscar`, `insertar`, `eliminar`,
  `largo` e `imprimir`.
- [hash_uso.cpp](./codigo/hash_uso.cpp): el ejemplo con $m = 7$. Imprime el
  valor hash de 10, 23, 5, 17, 12 y 31, la tabla con `2: 23`, `3: 31 17 10` y
  `5: 12 5`, y después `buscar 17: 1`, `buscar 24: 0`, `eliminar 17: 1`,
  `largo de la casilla 3: 2` y `n = 5, m = 7`.
- [hash_cadenas.cpp](./codigo/hash_cadenas.cpp): la suma de los códigos y el
  polinomio en base 31 con $m = 13$ para `sol`, `los`, `gato` y `toga`.
- [dispersion.cpp](./codigo/dispersion.cpp): vacías y lista más larga con
  1000 claves para $m = 64$ y $m = 61$; imprime la tabla de *Escoger $m$*.
- [sumapar.cpp](./codigo/sumapar.cpp): dos que suman $x$; imprime `x = 9: 1`,
  `x = 21: 1` y `x = 12: 0`.

Las soluciones de los problemas de juez están en *Para el juez* y en
*Para practicar en casa*, con su entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 11, tablas hash: introducción,
  operaciones de diccionario; §11.1 tablas de direccionamiento directo; §11.2
  tablas hash, encadenamiento y su análisis; §11.3 funciones hash, método de la
  división.
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 15, *Hashing and Collision*: §15.2 tablas hash; §15.4.1 método
  de la división; §15.5.2 resolución de colisiones por encadenamiento.
- UVa Online Judge. Problema 484, *The Department of Redundancy Department*:
  <https://onlinejudge.org/external/4/484.pdf>.
- UVa Online Judge. Problema 442, *Matrix Chain Multiplication*:
  <https://onlinejudge.org/external/4/442.pdf>.
