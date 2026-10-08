# Clase 17. El TAD Pila por dentro

Miércoles 7 de octubre de 2026, de 17:00 a 19:00.

La pila que el curso viene usando guarda los elementos en un arreglo con el
tope en la casilla `n`. Apilar y desapilar son $\Theta(1)$, y el precio es el
de siempre: `CAPACIDAD` se fija al compilar y el elemento que no cabe detiene
el programa. Esta sesión la construye de nuevo sobre el TAD Lista, usándolo por
un solo extremo, y mide algo que no se ve en el contrato: el costo de `apilar`
no es una propiedad de la pila, sino de la lista que se escoja debajo y del
extremo que se nombre tope. Con el arreglo debajo, el tope al frente cuesta
$\Theta(n)$; con la enlazada, $\Theta(1)$. Las dos estructuras son el espejo
una de la otra.

Al terminar, el objetivo es poder construir la pila sobre el TAD Lista
escogiendo el extremo que sirve, explicar por qué el mismo diseño cuesta
$\Theta(1)$ o $\Theta(n)$ según lo que haya debajo, escribirla también
directamente sobre nodos, escribir el invariante de representación de las dos
versiones y la precondición que comparten `desapilar` y `tope`, y dar el costo
en tiempo y en espacio de cada operación en cada combinación.

## Diapositivas

![](clase17.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El proyecto del curso

Los cuatro escenarios, qué estructura se compara con cuál en cada entrega, el
formato del repositorio y la rúbrica con sus descriptores están en
[Proyecto del curso](../Proyecto/Proyecto%20del%20curso.md), que es el
documento que manda. Las fechas de las dos entregas y de las sustentaciones
salen de ahí.

## La pila que ya tienen

El contrato de la pila atiende por un solo extremo: lo último que entra es lo
primero que sale. La implementación con la que se viene trabajando guarda los
elementos en un arreglo y lleva un contador.

```cpp
class Pila {
private:
  Elemento datos[CAPACIDAD];
  int n;
public:
  void apilar(Elemento e) {
    assert(n < CAPACIDAD);
    datos[n] = e;
    n = n + 1;
  }
```

`n` tiene dos lecturas que coinciden: es el número de elementos adentro y es la
casilla donde va el que entre. De ahí salen las dos líneas de `apilar`, y de ahí
sale que el tope sea `datos[n - 1]`. Desapilar no borra nada: baja el contador,
y la casilla que ocupaba el tope deja de contar hasta que alguien escriba encima.
Las dos operaciones tocan una casilla y un entero, así que son $\Theta(1)$.

El `assert(n < CAPACIDAD)` es la precondición de `apilar` sobre esta
implementación, y es la frontera entera de la estructura. `CAPACIDAD` se fija al
compilar, de modo que el tamaño máximo hay que saberlo antes de correr el
programa; el elemento que no cabe no se rechaza, detiene el proceso; y las
casillas que sobran quedan reservadas aunque la pila esté vacía. Una pila de
diez elementos declarada con capacidad para un millón ocupa el millón.

Las tres cosas son el mismo problema visto de tres lados, y es el problema que
la lista enlazada ya resolvió para el TAD Lista.

## Una pila es una lista por un solo extremo

### Lo único que hay que decidir

La lista enlazada ya sabe insertar, eliminar y consultar por posición, y ya
maneja los nodos. Una pila no necesita más que eso en un solo extremo, así que
puede construirse usando una lista en vez de repetir el manejo de punteros.

```cpp
class Pila {
private:
  Lista l;
};
```

Queda una sola decisión, y es cuál extremo de la lista hace de tope:

| Si el tope es | `apilar(e)` | `desapilar()` | `tope()` |
|---|---|---|---|
| la posición 0 | `l.insertar(0, e)` | `l.eliminar(0)` | `l.obtener(0)` |
| el final | `l.agregar(e)` | `l.eliminar(l.tamano() - 1)` | `l.obtener(l.tamano() - 1)` |

Las dos filas cumplen el mismo contrato. Un programa que use la pila no puede
distinguirlas: apila, desapila, consulta el tope, y en los dos casos sale lo
último que entró. La pregunta es si da lo mismo escoger cualquiera.

### Las cuatro combinaciones, contadas

No da lo mismo, y lo que decide no es la pila sino la lista que esté debajo. Son
dos implementaciones de lista por dos extremos: cuatro combinaciones.

Con cincuenta elementos la cuenta se hace a mano. Sobre el arreglo con el tope
al frente, insertar en la posición 0 obliga a correr todo lo que ya está: la
primera inserción corre 0 elementos, la segunda 1, la última 49. Son
$0 + 1 + \cdots + 49 = \frac{49 \cdot 50}{2} = 1225$ corrimientos. Vaciar la
pila cuesta lo mismo al revés: la primera eliminación cierra el hueco corriendo
49 elementos, la siguiente 48, la última ninguno. Otros 1225. Apilar y desapilar
cincuenta veces son **2450** elementos movidos.

Sobre la enlazada con el tope al final la cuenta parece la misma y no lo es. Da
**2352**, y los 98 de diferencia tienen una razón concreta: la enlazada se
detiene un nodo antes. Para empalmar al final hace falta el nodo que va a quedar
delante del nuevo, que es el último que hay; para desenganchar el último hace
falta el penúltimo, y al último no se llega, se desengancha desde el que lo
apunta. Cada una de las 49 inserciones no triviales visita un nodo menos que el
corrimiento equivalente del arreglo, y cada una de las 49 eliminaciones también:
$2450 - 98 = 2352$.

Las otras dos combinaciones no cuestan nada. El arreglo con el tope al final
escribe la casilla que sigue, que ya está; la enlazada con el tope al frente
escribe dos punteros y no camina.

`extremos.cpp` repite la cuenta con tres tamaños, contando los elementos que se
corren en el arreglo y los nodos que se visitan en la enlazada:

| $n$ | arreglo, tope al frente | arreglo, tope al final | enlazada, tope al frente | enlazada, tope al final |
|---:|---:|---:|---:|---:|
| 100 | 9900 | 0 | 0 | 9702 |
| 1000 | 999 000 | 0 | 0 | 997 002 |
| 10000 | 99 990 000 | 0 | 0 | 99 970 002 |

Las columnas segunda y tercera son ceros exactos, no números pequeños: ninguna
de esas dos combinaciones toca un solo elemento que ya estuviera adentro.
Multiplicar $n$ por diez multiplica por cien las otras dos, que es la firma de
$\Theta(n^2)$ sobre $n$ operaciones, o sea $\Theta(n)$ por operación.

### El espejo

El arreglo es gratis por el final, porque la casilla siguiente ya está en su
sitio, y cuadrático por el frente, porque abrir hueco en la posición 0 obliga a
correr todo. La enlazada es gratis por el frente, porque son dos escrituras de
puntero que no dependen de cuántos nodos haya, y cuadrática por el final, porque
hay que caminar hasta allá y no hay forma de calcular esa dirección.

Las dos estructuras tienen la misma tabla con las columnas cambiadas. Y de ahí
sale la frase que vale más que la tabla: **el costo de `apilar` no es una
propiedad del TAD Pila.** Es una propiedad de la lista que se escoja debajo y
del extremo que se nombre tope. Escribir $\Theta(1)$ al lado de `apilar` sin
decir cuál de las dos cosas es afirmar algo que puede ser falso.

Construir un TAD sobre otro traslada el costo al de abajo, y el de abajo no
aparece en el contrato del de arriba. Esa es la cuenta que hay que hacer antes
de escoger, y es la misma cuenta del proyecto: una estructura que se elige por
su contrato y resulta cara por su implementación.

## La pila sobre la lista enlazada

### Seis llamadas

Con la lista enlazada debajo, el tope va al frente. Insertar y eliminar en la
posición 0 son dos escrituras de puntero, y la pila entera queda en seis
llamadas.

```cpp
class Pila {
private:
  Lista l;

public:
  void apilar(Elemento e) {
    l.insertar(0, e);
  }

  // exige !vacia()
  void desapilar() {
    assert(!vacia());
    l.eliminar(0);
  }

  // exige !vacia()
  Elemento tope() {
    assert(!vacia());
    return l.obtener(0);
  }

  int tamano() {
    return l.tamano();
  }

  bool vacia() {
    return l.vacia();
  }
};
```

Lo que `l.insertar(0, e)` hace por dentro son dos líneas: el campo `siguiente`
del nodo nuevo pasa a ser la cabeza actual y la cabeza pasa a ser el nodo nuevo.
Ninguna depende del tamaño de la lista, y esa independencia es toda la razón de
que la pila enlazada pueda crecer sin que apilar se encarezca.

No aparece un solo `new`, un solo `delete` ni un solo puntero. Eso ya lo
resolvió la lista, y el destructor de la lista libera los nodos cuando la pila
sale de alcance, sin que `Pila` tenga que escribir uno. Tampoco hay constructor:
`Lista l` se construye sola, vacía.

### El invariante de representación

!!! note "Invariante de representación: la pila sobre la lista"

    Sea $P = \langle P[0], \ldots, P[n-1] \rangle$ la sucesión que el contrato
    de la pila nombra, escrita del tope hacia abajo, con $n = \texttt{tamano}()$.
    Sea $L = \langle L[0], \ldots, L[m-1] \rangle$ la sucesión que el contrato
    de la lista nombra, con $m = \texttt{l.tamano}()$. Sea $\tau(x)$ el número
    de la llamada a `apilar` que metió el elemento $x$, y sea
    $\mathrm{Inv}_L(\texttt{l})$ la conjunción de los invariantes de la lista
    enlazada.

    $$
    \begin{aligned}
      K_1:&\quad n = m\\
      K_2:&\quad \forall i,\ 0 \leq i < n:\ P[i] = L[i]\\
      K_3:&\quad \forall i, j,\ 0 \leq i < j < n:\ \tau(P[i]) > \tau(P[j])\\
      K_4:&\quad \mathrm{Inv}_L(\texttt{l})
    \end{aligned}
    $$

$K_1$ y $K_2$ juntos dicen que la pila no guarda estado propio: todo lo que hay
es la lista, y la sucesión de la pila es la de la lista leída desde la posición
0. Cambiar la decisión de extremo cambia $K_2$ y nada más, porque con el tope al
final la fórmula pasa a ser $P[i] = L[n - 1 - i]$.

$K_3$ es el contrato de la pila escrito en fórmula: si $P[i]$ está más arriba
que $P[j]$, entró después. No es una propiedad de un estado suelto sino de la
historia, y por eso $\tau$ se define aparte y no vive en ningún campo. Es lo que
separa a la pila de la lista: la lista admite que alguien meta un elemento en la
posición 2 y rompa ese orden, y la pila no ofrece la operación con la que se
rompería.

$K_4$ es lo que la composición delega. Los nodos, los `NULL` y el contador de la
cadena no son asunto de la pila; la única forma de romperlos desde aquí es
llamar a la lista fuera de su precondición, que es justamente lo que impide el
`assert` de la sección siguiente.

### La precondición vive en la pila, no en la lista

`desapilar()` y `tope()` exigen $n > 0$, y la exigencia es parte del contrato,
al mismo nivel que lo que las dos prometen. Sobre la pila vacía ninguna tiene un
elemento que sacar ni un valor que devolver.

Sobre esta implementación, `l.eliminar(0)` con la lista vacía viola la
precondición de la lista, $0 \leq p < \texttt{tamano}()$, que ningún $p$ cumple
cuando `tamano()` vale 0. El `assert` que saltaría sería el de `lista.h`, y el
mensaje nombraría una posición `p` y un campo `n` de una lista que quien llamó
nunca escribió. Por eso la comprobación va en la pila:

```cpp
void desapilar() {
  assert(!vacia());
  l.eliminar(0);
}
```

El `assert` evalúa la condición y, si es falsa, imprime la expresión, el archivo
y la línea, y aborta el programa. Lo que vigila es el contrato de quien llama,
no un caso que la operación deba resolver: `desapilar` no tiene nada sensato que
hacer con una pila vacía, y devolver un valor inventado escondería el error
hasta que apareciera lejos del sitio donde se cometió. La obligación queda del
lado del programador, y la forma de cumplirla es preguntar antes, como hace el
ciclo que vacía la pila en `pila_uso.cpp`:

```cpp
while (!p.vacia()) {
  cout << p.tope() << " ";
  p.desapilar();
}
```

!!! note "Dos contratos, uno encima del otro"

    La pila promete menos que la lista: no deja entrar por el medio, no deja
    consultar la posición 3 y no deja recorrer. A cambio garantiza lo que la
    lista no garantiza, que lo último que entró es lo que sale. Construir un
    TAD sobre otro es escoger qué parte del de abajo se deja ver, y lo que se
    tapa es lo que se puede prometer.

### La traza

Apilando 5, 8 y 2, desapilando una vez y apilando 9:

| Operación | La cadena, del tope hacia abajo | `tope()` | `tamano()` |
|---|---|---:|---:|
| `apilar(5)` | 5 | 5 | 1 |
| `apilar(8)` | 8, 5 | 8 | 2 |
| `apilar(2)` | 2, 8, 5 | 2 | 3 |
| `desapilar()` | 8, 5 | 8 | 2 |
| `apilar(9)` | 9, 8, 5 | 9 | 3 |

El 5 no se mueve nunca. Entró primero, quedó al fondo y ahí se queda hasta que
los tres de encima salgan; lo único que cambia de paso a paso es a cuál nodo
apunta la cabeza. Vaciar la pila desde el último estado imprime 9, 8 y 5, que es
el orden inverso al de entrada, y deja la pila en 0 elementos. `pila_uso.cpp`
imprime exactamente eso:

```
2 3
8 2
9 8 5
0 1
```

## Sin la lista de por medio

### La cadena directa

Si la pila solo toca un extremo, la lista de abajo no camina nunca: `nodoEn`
se llama siempre con 0 y devuelve la cabeza sin dar un paso, los casos de
insertar y eliminar en el medio no se ejecutan jamás, y `asignar` y `agregar` no
se llaman. La lista queda cargando operaciones que esta estructura no va a usar.
La cadena se puede escribir directamente.

```cpp
class Pila {
private:
  Nodo *cima;
  int n;

public:
  Pila() {
    cima = NULL;
    n = 0;
  }

  ~Pila() {
    while (cima != NULL) {
      Nodo *muerto = cima;
      cima = cima->siguiente;
      delete muerto;
    }
  }
```

```cpp
  void apilar(Elemento e) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    nuevo->siguiente = cima;
    cima = nuevo;
    n = n + 1;
  }
```

```cpp
  // exige !vacia()
  void desapilar() {
    assert(!vacia());
    Nodo *muerto = cima;
    cima = cima->siguiente;
    delete muerto;
    n = n - 1;
  }
```

`apilar` es la inserción al frente de la lista enlazada sin intermediario: el
nodo nuevo apunta a donde apuntaba `cima` y `cima` pasa a apuntar al nodo nuevo.
Dos escrituras de puntero, una reserva y un entero. No hay `CAPACIDAD`, no hay
desbordamiento y el único `assert` que queda es el de la precondición.

`desapilar` tiene tres líneas y el orden de dos de ellas no es libre. Primero se
guarda la dirección del nodo que va a morir, después se mueve `cima` al
siguiente, y solo al final se libera. Escrito al revés, con `delete cima;`
adelante, `cima` queda apuntando a memoria devuelta al sistema, y leer
`cima->siguiente` de ahí es leer un puntero colgante: el valor que se saque
puede ser el correcto, puede ser basura o puede ser un nodo de otro programa, y
la cadena entera queda inalcanzable sin que nadie avise. La dirección del
siguiente hay que sacarla mientras el nodo todavía existe.

El destructor repite esas tres líneas en ciclo hasta que `cima` vale `NULL`.
Es lo único que la versión sobre la lista no tiene que escribir, porque allí el
destructor ya existe y es el de la lista.

### El invariante de representación

!!! note "Invariante de representación: la pila sobre nodos"

    Sea $\mathrm{Alc}$ el conjunto de nodos que se alcanzan desde `cima`
    siguiendo el campo `siguiente` un número finito de veces, y sea
    $v_0, v_1, \ldots$ la sucesión definida por $v_0 = \texttt{cima}$ y
    $v_{i+1} = v_i\texttt{->siguiente}$ mientras $v_i \neq \texttt{NULL}$. $P$
    y $\tau$ son los de la sección anterior.

    $$
    \begin{aligned}
      N_1:&\quad |\mathrm{Alc}| = n\\
      N_2:&\quad \forall i, j,\ 0 \leq i < j < n:\ v_i \neq v_j\\
      N_3:&\quad n > 0 \implies v_{n-1}\texttt{->siguiente} = \texttt{NULL}\\
      N_4:&\quad \forall i,\ 0 \leq i < n:\ P[i] = v_i\texttt{->dato}\\
      N_5:&\quad \forall i, j,\ 0 \leq i < j < n:\ \tau(P[i]) > \tau(P[j])
    \end{aligned}
    $$

$N_1$, $N_2$ y $N_3$ son los de la lista enlazada con `cima` en el papel de la
cabeza, y aquí sí son asunto de la pila, porque los punteros los escribe ella.
$N_1$ evaluado en $n = 0$ obliga a que `cima` valga `NULL`, que es como se
reconoce la pila vacía y lo que `vacia()` reporta al mirar el contador.

$N_4$ es la decisión de diseño: el orden de la cadena es el orden de la pila,
con el tope en la cabeza. Junto con $N_5$ dice que el nodo que cuelga de `cima`
es el que entró último. Una implementación que agregara al final mantendría
$N_1$, $N_2$ y $N_3$ intactos y rompería $N_5$, y el programa seguiría corriendo
sin fallar: sacaría los elementos en el orden equivocado, que es la clase de
error que no aborta nada y aparece mucho después.

### El techo que desaparece

Apilando hasta donde cada una aguanta, con una capacidad de 1000:

| intentos | caben en el arreglo | caben en la enlazada | memoria de los nodos |
|---:|---:|---:|---:|
| 500 | 500 | 500 | 7 KiB |
| 1000 | 1000 | 1000 | 15 KiB |
| 100 000 | 1000 | 100 000 | 1562 KiB |

En la tercera fila el arreglo se queda en 1000 y la enlazada mete los cien mil.
Eso es lo que compra no tener techo, y lo que cuesta está en la última columna.

`sizeof(Nodo)` da 16 bytes, y la cuenta no suma sola: el entero ocupa 4 y el
puntero 8, que son 12. Los otros 4 son relleno. El
compilador alinea el puntero en una dirección múltiplo de 8 porque así lo lee el
procesador de una sola vez, y para lograrlo deja un hueco detrás del entero. El
dato es la cuarta parte de lo que se guarda, y las otras tres cuartas partes son
la dirección del siguiente y el hueco que esa dirección obliga a dejar.

El puntero ocupa 8 bytes porque la máquina es de 64 bits: los registros son de
64 bits y una dirección entra completa en uno. En las máquinas de 32 bits el
puntero ocupaba 4, el nodo cabía en 8 sin relleno, y el precio estaba en otro
lado: con 32 bits para una dirección solo se pueden nombrar $2^{32}$ bytes, que
son 4 GiB, y ese era el límite de memoria que un proceso podía ver por mucha RAM
que tuviera la máquina.

La escogencia entre las dos no es cuál es mejor. El arreglo pide saber de
antemano cuántos elementos van a entrar y, sabiéndolo, no paga ni un byte de más
por elemento. La enlazada no lo pide y paga el puntero. La pregunta que decide
es si ese número se conoce antes de correr el programa, y en la mayoría de los
casos la respuesta es que no.

### Cuál de las dos escribir

Las dos dan exactamente la misma salida sobre el mismo programa, y la diferencia
está en otra parte.

| | Sobre la lista | Directa sobre nodos |
|---|---|---|
| tamaño | seis llamadas, ningún puntero a la vista | unas treinta líneas con `new` y `delete` |
| liberar | lo hace el destructor de la lista | hay que escribir el destructor |
| por operación | un salto de llamada | toca la cadena de una vez |
| el costo | depende de qué lista haya debajo | está a la vista en el código |
| lo que sobra | la lista trae operaciones que la pila no usa | nada: solo están las cinco |

La primera reutiliza trabajo ya hecho y probado, que es la razón de tener un TAD
en primer lugar, y el costo de mantenerla es cero mientras la lista no cambie.
La segunda se escribe cuando la estructura de abajo arrastra operaciones que
esta no va a usar nunca y cargarlas sale más caro que escribir las cinco que sí.

Hay una pregunta que la pila contesta igual en las dos, y es qué hacer cuando el
programa necesita un elemento que no está en el tope. No se recorre: se desapila
hasta llegar a él. El contrato no ofrece acceso por posición, y eso tiene un
precio, que es el que paga el ejercicio de copiar una pila.

## Lo que cobra cada operación

$n$ es el número de elementos en la pila y $k$ la profundidad a la que está un
elemento contado desde el tope.

| Operación | Pila sobre arreglo | Pila sobre la lista enlazada | Pila sobre nodos | Por qué |
|---|---|---|---|---|
| `apilar(e)` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | se escribe la casilla `n` / se reserva un nodo y se escriben dos punteros / lo mismo sin el salto de llamada |
| `desapilar()` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | se baja el contador / se mueve la cabeza y se libera un nodo / se mueve `cima` y se libera un nodo |
| `tope()` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | se lee `datos[n - 1]` / se lee el dato de la cabeza / se lee `cima->dato` |
| `tamano()`, `vacia()` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | el contador está guardado en las tres |
| llegar al elemento de profundidad $k$ | $\Theta(k)$ | $\Theta(k)$ | $\Theta(k)$ | el contrato no da acceso por posición: hay que desapilar hasta él y volver a apilar lo que salió |
| construir la pila vacía | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | poner el contador en 0, y el puntero en `NULL` donde lo hay |
| liberar la estructura | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | el arreglo se va solo / un `delete` por nodo |
| espacio de la estructura | $\Theta(\texttt{CAPACIDAD})$ | $\Theta(n)$ | $\Theta(n)$ | casillas reservadas de antemano / un nodo por elemento |
| espacio por elemento | el dato | el dato, el puntero y el relleno: 16 bytes | los mismos 16 bytes | la dirección del siguiente se paga por nodo |
| espacio aparte por operación | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | punteros y contadores sueltos |
| techo de elementos | `CAPACIDAD`, fijado al compilar | la memoria | la memoria | el arreglo se dimensiona antes de correr |

Las cinco operaciones del contrato son $\Theta(1)$ en las tres columnas, así
que la cota no decide nada. Lo que decide está en las filas de espacio y de
techo: el arreglo cobra memoria que puede no usar y pone un tope de elementos;
las dos enlazadas cobran 16 bytes por elemento y no ponen ninguno. La pila es el TAD donde la
lista enlazada no pierde nada, porque nunca pregunta por una posición del medio,
que es lo único que la enlazada hace caro.

Falta la columna que la tabla no trae y la sección de los extremos ya midió: la
pila sobre la lista **con el tope al final** es $\Theta(n)$ en `apilar`,
`desapilar` y `tope`. Es la misma clase `Pila`, el mismo contrato y la misma
lista, con una decisión distinta en tres líneas.

## Para el juez

**UVa 732 — Anagrams by Stack**,
<https://onlinejudge.org/external/7/732.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=673>.

Cada caso trae dos palabras, la de entrada y la de salida. Hay que imprimir
todas las secuencias de las letras `i` y `o` que convierten la primera en la
segunda: la `i` mete a la pila la siguiente letra de la entrada y la `o` saca la
del tope y la escribe. Las secuencias van en orden alfabético, una por línea, con las
letras separadas por espacio, y el bloque de cada caso va entre `[` y `]`.

### Dos palabras trazadas

Con `foo` y `oof`, la secuencia `i i o i o o` paso a paso:

| Jugada | Pila, tope a la izquierda | Salida |
|---|---|---|
| `i` | f | |
| `i` | o f | |
| `o` | f | o |
| `i` | o f | o |
| `o` | f | oo |
| `o` | | oof |

Esa pareja admite otra, `i i i o o o`: meter las tres letras y sacarlas en bloque.
No hay más, y dos observaciones recortan la búsqueda antes de empezar. Con
palabras de $m$ letras, toda secuencia válida tiene exactamente $m$ letras `i` y
$m$ letras `o`, porque cada letra de la entrada se mete una vez y cada letra de
la salida se saca una vez; `i o o` queda descartada por longitud sin mirar lo que
hace. Y ningún prefijo puede llevar más `o` que `i`: en `i i o o o` la tercera
`o` saca de una pila vacía, que no es una jugada mala sino una precondición
violada.

El primer caso de la entrada de ejemplo es `madam` y `adamm`. La secuencia
`i i o i o i o i o o`:

| Jugada | Pila, tope a la izquierda | Salida |
|---|---|---|
| `i` | m | |
| `i` | a m | |
| `o` | m | a |
| `i` | d m | a |
| `o` | m | ad |
| `i` | a m | ad |
| `o` | m | ada |
| `i` | m m | ada |
| `o` | m | adam |
| `o` | | adamm |

Esa no es la única. `madam` tiene dos `a`, y la primera letra de la salida es
`a`, así que hay dos formas de empezar: parar de meter en cuanto la primera `a`
queda en el tope, con `i i o`, o seguir metiendo hasta que la segunda `a` quede
en el tope, con `i i i i o`. Las dos aperturas dejan `ada` escrito y una `m` en
la pila, con la última `m` de la entrada todavía sin meter, y ahí se bifurca otra
vez: sacar la `m` que ya está y después meter y sacar la que falta, o meter la
que falta y sacar las dos seguidas. Dos aperturas por dos cierres dan las cuatro
secuencias que el problema pide para ese caso:

```
[
i i i i o o o i o o
i i i i o o o o i o
i i o i o i o i o o
i i o i o i o o i o
]
```

### Cómo atacarlo con la pila

En cada estado hay a lo sumo dos jugadas: meter la siguiente letra de la entrada,
si queda alguna, o sacar el tope, si la pila no está vacía y el tope coincide con
la letra que la salida necesita ahora. Se prueban las dos y se deshace la que no
lleve a ninguna solución. Deshacer una jugada es exacto: la `i` se deshace
sacando la letra que se metió y retrocediendo el índice de la entrada, y la `o`
se deshace volviendo a meter la letra que se sacó y retrocediendo el índice de la
salida.

Ahí es donde el problema mide la pila. Sobre palabras de pocas letras las jugadas
se hacen y se deshacen miles de veces, y cada una que se deshace cuesta otra
operación. Con la pila enlazada y el tope al frente las dos
son $\Theta(1)$ y el tiempo se va en recorrer las secuencias, no en mantener la
estructura. El programa que viene se apoya en la pila de la sesión.

Antes de entrar a probar jugadas conviene descartar: si las dos palabras tienen
distinta longitud, o si no tienen las mismas letras con las mismas repeticiones,
no existe ninguna secuencia y el caso se resuelve sin buscar nada.

!!! warning "Las trampas"

    El orden alfabético sale solo si en cada estado se intenta primero `i` y
    después `o`, porque la letra `i` va antes que la `o`. No hay que ordenar
    nada al final.

    Al deshacer una jugada hay que devolver la pila al estado exacto en que
    estaba, incluida la letra que se había sacado. Una `o` que se deshace sin
    devolver la letra deja la pila corta y las ramas que siguen salen mal sin
    que el programa falle.

    Una palabra de salida que no sea anagrama de la de entrada no imprime
    ninguna línea, pero sí imprime los corchetes. En el ejemplo, `long` y
    `short` producen un bloque vacío.

### El programa

El programa es corto porque la pila ya está escrita. Lo nuevo es la función que
prueba jugadas y se devuelve cuando la rama no lleva a ninguna parte.

```cpp
// UVa 732 - Anagrams by Stack: todas las secuencias de i y o que convierten
// la palabra de entrada en la de salida, en orden alfabetico.
#include <iostream>
#include <string>
#include "pila_nodos.h"

using std::cin;
using std::cout;
using std::endl;
using std::string;

string entrada;
string salida;
int largo;        // las dos palabras miden lo mismo cuando se busca
string jugadas;   // la secuencia en construccion: 2 * largo jugadas

void imprimir() {
  int k = 0;
  while (k < 2 * largo) {
    if (k > 0) {
      cout << " ";
    }
    cout << jugadas[k];
    k = k + 1;
  }
  cout << endl;
}

// metidas: letras de la entrada que ya estan en la pila o salieron de ella.
// escritas: letras de la salida ya escritas.
// La jugada que se decide aqui es la numero metidas + escritas.
void buscar(Pila &p, int metidas, int escritas) {
  if (escritas == largo) {
    imprimir();
  } else {
    if (metidas < largo) {
      p.apilar(entrada[metidas]);
      jugadas[metidas + escritas] = 'i';
      buscar(p, metidas + 1, escritas);
      p.desapilar();
    }
    if (!p.vacia() && p.tope() == salida[escritas]) {
      Elemento letra = p.tope();
      p.desapilar();
      jugadas[metidas + escritas] = 'o';
      buscar(p, metidas, escritas + 1);
      p.apilar(letra);
    }
  }
}

int main() {
  while (cin >> entrada >> salida) {
    cout << "[" << endl;
    if (entrada.size() == salida.size()) {
      largo = entrada.size();
      jugadas = string(2 * largo, 'i');
      Pila p;
      buscar(p, 0, 0);
    }
    cout << "]" << endl;
  }
  return 0;
}
```

`buscar` recibe cuántas letras de la entrada ya se metieron y cuántas de la
salida ya se escribieron. Esos dos números describen el estado completo: la
próxima letra por meter es `entrada[metidas]` y la que la salida necesita ahora
es `salida[escritas]`. Cuando `escritas` llega al largo de la palabra la
secuencia está terminada y se imprime. No hay que comprobar nada más: escribir
$m$ letras exigió sacar $m$ veces, sacar $m$ veces exigió meter $m$, y entonces
la entrada se agotó y la pila quedó vacía.

Las dos jugadas son los dos `if` de adentro. La primera mete `entrada[metidas]`
mientras queden letras por meter. La segunda saca el tope, y solo cuando el tope
es la letra que la salida necesita: sacar otra escribe una letra equivocada y
ninguna jugada posterior la arregla, porque lo escrito no se borra.

La jugada que se decide en cada llamada es la número `metidas + escritas`, que es
la cuenta de jugadas hechas hasta ahí. Ese es el índice en que se anota la letra,
y por eso deshacer no tiene que borrarla: la otra rama escribe encima, en la
misma casilla.

`main` imprime el corchete de apertura y el de cierre alrededor de la búsqueda,
así que una pareja sin solución deja el bloque vacío. Si los dos largos no
coinciden no se busca nada, porque cada letra de la entrada se mete una vez y
cada letra de la salida se saca una vez; `long` y `short` caen en ese caso.
El `while (cin >> entrada >> salida)` se vuelve falso cuando ya no hay nada por
leer.

### Por qué se intenta `i` antes que `o`

Todas las secuencias válidas de un mismo caso miden lo mismo, $2m$ letras. Entre
dos de ellas, entonces, el orden alfabético lo decide la primera posición en que
difieren, y en esa posición una tiene `i` y la otra tiene `o`. La `i` va primero
en el alfabeto. Agotar la rama de meter antes de abrir la de sacar imprime las
secuencias de menor a mayor, y no queda nada por ordenar al final: cambiar los
dos `if` de orden imprime las mismas secuencias al revés.

### Deshacer una jugada

Deshacer es devolver el estado al que había antes de la jugada. Los dos índices
se deshacen solos: viajan como parámetros, cada llamada tiene su copia y al
volver de la recursión los de aquí siguen donde estaban. La pila no. Es un solo
objeto que todas las llamadas comparten, y lo que una rama le deje hecho lo
encuentra la siguiente.

La `i` se deshace con `desapilar`, que quita la letra que se metió. La `o` se
deshace con `apilar(letra)`, con la letra que se leyó con `tope()` antes de
sacarla: `desapilar` libera el nodo y después no hay de dónde leerla. Una `o`
deshecha sin devolver la letra deja la pila más corta, y entonces el programa
sigue corriendo sobre un estado que no corresponde a ninguna jugada e imprime
secuencias que no convierten una palabra en la otra.

### Qué cuesta

| Qué | Costo | Por qué |
|---|---|---|
| hacer y deshacer una `i` | $\Theta(1)$ | `apilar` y `desapilar` trabajan en la cabeza de la cadena |
| hacer y deshacer una `o` | $\Theta(1)$ | `tope`, `desapilar` y el `apilar` que devuelve la letra |
| imprimir una secuencia | $\Theta(m)$ | se recorren las $2m$ jugadas anotadas |
| el recorrido completo | $O(4^m)$ estados | a lo sumo dos ramas por estado, profundidad $2m$ |
| espacio | $\Theta(m)$ | $2m$ marcos de recursión, $m$ nodos en la pila, $2m$ letras anotadas |

El peor caso es la palabra de una sola letra repetida. Ahí cualquier secuencia
que respete la precondición de la pila escribe la palabra de salida, y cuántas
hay lo dice el número de Catalan $C_m = \binom{2m}{m}/(m+1)$: con `aaaa` el programa
imprime 14 secuencias, con `aaaaa` imprime 42 y con diez letras iguales, 16 796.
Contando lo que cuesta imprimir cada una, el tiempo total queda en $O(m\,4^m)$.

Con letras todas distintas pasa lo contrario. El tope coincide con la letra
que toca en un solo momento, la rama de sacar casi nunca abre y sobrevive a lo
sumo una secuencia: `abcdefgh` contra `hgfedcba` da exactamente una. Las cuatro
parejas del enunciado dan 4, 4, 0 y 1, y `foo` contra `oof` da 2,
`i i i o o o` y `i i o i o o`.

El espacio no depende de cuántas secuencias se impriman. En el punto más
profundo hay $2m$ marcos de recursión abiertos, la pila llega a $m$ nodos y la
secuencia en construcción ocupa $2m$ letras.

### Compilar y probar

El fuente está en [uva732.cpp](codigo/uva732.cpp), con la entrada del enunciado
en [uva732.in](codigo/uva732.in) y la salida esperada en
[uva732.out](codigo/uva732.out). La cabecera `pila_nodos.h` es la misma de más
arriba y vive en esa carpeta.

```bash
g++ -Wall -Wextra uva732.cpp -o sol
./sol < uva732.in > salida.txt
diff salida.txt uva732.out
```

El `diff` no imprime nada cuando los cuatro bloques salen como en el enunciado.

## Ejercicios

### El tope al final

Escriba la pila sobre la lista enlazada poniendo el tope en el final: `apilar`
pasa a ser `l.agregar(e)` y `desapilar` pasa a ser `l.eliminar(l.tamano() - 1)`.

1. ¿Cuánto cuesta cada una sobre la lista enlazada simple?
2. Con el puntero al último nodo guardado aparte, ¿cuál de las dos baja de
   costo?
3. ¿Y la otra? Diga por qué.
4. ¿Con cuál variante de la lista quedarían las dos en $\Theta(1)$?

Sobre la simple las dos son $\Theta(n)$, porque hay que caminar hasta el final y
la única dirección guardada es la de la cabeza. Con el puntero al último,
`agregar` baja a $\Theta(1)$: el nodo al que hay que engancharse ya está
localizado. `eliminar` del final no baja, y la razón es la misma que explicó los
2352 de la sección de los extremos: para desenganchar el último hay que
reescribir el campo `siguiente` del penúltimo, y al penúltimo no se llega desde
el último. Guardar el final sirve para poner, no para quitar.

Las dos quedan en $\Theta(1)$ con la doblemente enlazada, donde cada nodo sabe
quién es su anterior y el último se desengancha en cuatro escrituras.

Lo que cierra el ejercicio es que nada de eso hacía falta. Con el tope al frente,
la lista enlazada simple ya daba $\Theta(1)$ en las tres operaciones, sin campo
adicional y sin puntero guardado. Escoger bien el extremo ahorró la estructura
entera.

### Copiar una pila

Escriba una función que reciba una pila y devuelva otra con el mismo contenido en
el mismo orden, dejando la original como estaba. Solo se pueden usar las
operaciones del contrato: `apilar`, `desapilar`, `tope`, `tamano` y `vacia`.

1. ¿Cuántas pilas auxiliares hacen falta?
2. Con una sola, ¿en qué orden queda la copia?
3. ¿Cuántas operaciones hace en total con $n$ elementos?
4. ¿Qué operación del TAD Lista haría esto trivial, y por qué la pila no la
   ofrece?

Vaciar la original en una auxiliar deja la auxiliar al revés: lo que estaba al
fondo queda arriba. Ese estado intermedio es el que hace falta, porque vaciar
ahora la auxiliar apilando cada elemento en dos pilas a la vez reconstruye la
original en su orden y deja la copia en el mismo. Cada elemento se consulta dos
veces, sale dos veces y entra tres, a la auxiliar, de vuelta a la original y a la
copia: siete llamadas por elemento, $\Theta(n)$ en tiempo y $\Theta(n)$ de
espacio para la auxiliar.

Con `obtener(i)` de la lista se recorrería sin desarmar nada, en un solo pase y
sin pila auxiliar. La pila no la ofrece a propósito: el contrato existe para
impedir que alguien lea por el medio, y esa garantía es lo que permite razonar
sobre el orden de salida sin leer el código de quien usa la pila. El precio de
la garantía es que copiar cuesta desarmar.

## Para practicar en casa

### Propuesto 1

Agregue un límite máximo de elementos a la pila enlazada. ¿Dónde va el `assert`
y por qué no en la lista? ¿Qué invariante nuevo hay que escribir?

### Propuesto 2

En `desapilar`, ¿qué pasa si se escribe `delete cima;` antes de
`cima = cima->siguiente;`? Diga qué queda en `cima` y cuál de los cinco
invariantes se rompe primero.

### Propuesto 3

Dos pilas que crecen desde los dos extremos de un mismo arreglo de $C$ casillas,
una hacia arriba y otra hacia abajo. ¿Cuándo se chocan, cuántos elementos caben
entre las dos y qué condición reemplaza al `assert(n < CAPACIDAD)`?

### Propuesto 4

El programa de equilibrio de paréntesis sobre la pila enlazada. ¿Cambia su costo
frente a la pila de arreglo? ¿Y su consumo de memoria, con una expresión de mil
caracteres?

### Propuesto 5

Agregue una operación `minimo()` que devuelva el menor elemento de la pila sin
recorrerla, en $\Theta(1)$. Una segunda pila que guarde el mínimo hasta cada
punto alcanza; diga qué hay que apilar en ella en cada `apilar` y qué hay que
desapilar en cada `desapilar`.

### Propuesto 6

Sobre `madam` y `adamm` quedaron cuatro secuencias. Cuente a mano cuántas hay
para `bahama` y `bahama`, y diga de dónde sale cada bifurcación.

## Ejercicios interactivos

Cinco actividades que se trabajan en el navegador, una por tema de la sesión, en
la [página de ejercicios interactivos](./Ejercicios.md): siete operaciones sobre
la pila de arreglo hasta la que ya no entra; los elementos que se mueven al
apilar y desapilar cincuenta veces en las cuatro combinaciones; la cadena y el
puntero a la cima paso a paso; qué queda si `desapilar` libera el nodo antes de
mover `cima`; y qué pila conviene a tres programas con restricciones distintas.
Los programas no son los de la sesión: mismo tema, valores nuevos.

## Lo que sigue

La cola, que atiende por los dos extremos a la vez: por uno entra y por el otro
sale. Con la pila alcanzaba con escoger el extremo bueno y dejar el caro sin
usar; con la cola los dos extremos se usan en cada vuelta, así que ninguno puede
ser el caro. Eso descarta implementaciones que aquí servían y obliga a mirar de
nuevo la tabla de la lista. Sobre el arreglo aparece además un problema que la
pila no tenía: la cola se desplaza hacia el final a medida que entra y sale
gente, y hay que decidir qué pasa cuando llega al borde con casillas libres
atrás.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

**La pila sobre la lista y la pila sobre nodos**

- [pila.h](codigo/pila.h) — la pila sobre el TAD Lista: seis llamadas, el tope
  en la posición 0 y ningún puntero a la vista.
- [pila_nodos.h](codigo/pila_nodos.h) — la pila directa sobre nodos, con la cima
  en la cabeza de la cadena, el destructor y el `delete` después de mover el
  puntero.
- [lista.h](codigo/lista.h) — la lista enlazada que queda debajo de `pila.h`,
  que la incluye.
- [pila_uso.cpp](codigo/pila_uso.cpp) — el mismo programa sobre las dos.

`pila_uso.cpp` no nombra la cabecera que incluye: escribe `#include CABECERA` y
deja que la línea de órdenes diga cuál. La opción `-DCABECERA='"pila.h"'` define
el símbolo `CABECERA` como el texto `"pila.h"`, el preprocesador lo sustituye
antes de compilar y la directiva queda completa. Las comillas dobles van adentro
de las simples porque el `#include` las exige y el intérprete de órdenes se las
comería sin ellas.

```bash
g++ -Wall -Wextra -DCABECERA='"pila.h"' pila_uso.cpp -o sobre_lista
g++ -Wall -Wextra -DCABECERA='"pila_nodos.h"' pila_uso.cpp -o sobre_nodos
./sobre_lista
./sobre_nodos
```

Los dos ejecutables imprimen las mismas cuatro líneas, `2 3`, `8 2`, `9 8 5` y
`0 1`. El programa es el mismo byte por byte y lo único que cambia es qué clase
`Pila` entra: eso es lo que significa que las dos cumplen el contrato.

**Los extremos y el techo**

- [extremos.cpp](codigo/extremos.cpp) — qué cuesta poner el tope en cada extremo
  según la lista de abajo, contando los elementos que se corren en el arreglo y
  los nodos que se visitan en la enlazada, con las cuatro combinaciones para
  $n = 100$, 1000 y 10 000.
- [techo.cpp](codigo/techo.cpp) — hasta dónde aguanta cada una con capacidad
  1000, el tamaño de un `Nodo` y la memoria que ocupan los nodos.

**La solución del problema del juez**

- [uva732.cpp](codigo/uva732.cpp) — las secuencias de `i` y `o` que convierten
  una palabra en la otra, con retroceso sobre la pila de la sesión.
- [uva732.in](codigo/uva732.in) y [uva732.out](codigo/uva732.out) — la entrada y
  la salida de ejemplo del enunciado, para probar con `./sol < uva732.in`.

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 7, pilas: el contrato, la implementación con arreglos, la
  implementación con listas enlazadas y las aplicaciones.
- N. Kalicharan. *Data Structures in C*, 2008. Capítulo 4, pilas y colas:
  el manejo de los nodos y las dos representaciones.
- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Sección 10.1, pilas y colas; sección
  10.2, listas enlazadas.
