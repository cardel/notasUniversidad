# Clase 12. Ejercicios con los TAD Lista, Pila y Cola

Viernes 18 de septiembre de 2026.

Los tres contratos ya están escritos. La sesión anterior los especificó y
mostró cuánto cuesta cada operación; hoy se usan para resolver problemas que
cualquiera reconoce —paréntesis, calculadoras, un juego en círculo, dos listas
que se cruzan— sin mirar nunca cómo está guardada la estructura. La sesión
abrió con la Tarea 2, siguió con los ejercicios y cerró con una cola construida
sobre dos pilas.

Al final de la sesión el objetivo era poder escoger entre lista, pila y cola a
partir del orden en que un problema necesita entrar y sacar sus datos; resolver
con solo el contrato el balance de paréntesis, la evaluación postfija, la
eliminación circular y la intersección de listas ordenadas; trazar a mano el
estado de la estructura en cada paso y detectar dónde una solución viola una
precondición; construir un TAD sobre otro; y decir qué cuesta cada solución en
tiempo y en espacio a partir de los costos de las operaciones del contrato.

## Diapositivas

![](clase12.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## La Tarea 2

Quedó abierta en la arena desde el miércoles 17 y se entrega el lunes 5 de
octubre a las 23:59. Son cinco problemas pensados para pilas, colas y listas,
con el enunciado en PDF y las entradas y salidas de prueba descargables desde
cada uno. Se pueden resolver con la biblioteca estándar de C++ o con las
implementaciones de esta sesión.

Los cuatro que se leyeron en clase: recuperar la celda tapada de un **cuadrado
mágico** para que filas, columnas y diagonales sumen lo mismo; descifrar un
mensaje escrito en un **teclado numérico** de los celulares viejos, donde cada
grupo de dígitos repetidos produce una letra; seguir a un **robot** que avanza
y gira sobre una grilla infinita y reportar dónde termina; y responder
consultas sobre un arreglo diciendo si, al **reemplazar hipotéticamente** una
posición por otro valor, la suma queda múltiplo de cinco. En el último las
consultas son independientes: cada una se evalúa sobre el arreglo original, y
la suma puede desbordar un `int`.

Esta vez los casos de prueba son grandes y traen los límites del enunciado.
Un programa que se cae con ellos se cae antes de enviarse, no en la arena. La
razón viene de la tarea anterior: un `int` que se desbordó a negativo en la
secuencia de Collatz produjo un ciclo sin fin y tumbó el servidor. Y un aviso
sobre la salida: la arena trabaja en codificación ANSI, así que las salidas no
llevan eñes ni tildes.

## Cómo se ataca un ejercicio con un TAD

| | Lista | Pila | Cola |
|---|---|---|---|
| entra por | cualquier $p$ | el tope | el final |
| sale por | cualquier $p$ | el tope | el frente |
| se lee | cualquier $p$ | solo el tope | solo el frente |
| precondición | $0 \leq p < n$ | $n > 0$ | $n > 0$ |

Los cinco pasos que se siguieron en cada ejercicio:

1. Decir qué se guarda y en qué orden tiene que salir. Eso escoge el TAD.
2. Escribir, en palabras, qué operación se hace en cada paso.
3. Vigilar las precondiciones: antes de `tope` o `frente`, ¿quién asegura que
   no está vacía?
4. Trazar con un caso pequeño antes de dar la solución por buena.
5. Decir qué cuesta: cuántas operaciones del contrato hace en función de $n$
   y cuánto espacio pide aparte de la estructura. Las operaciones de pila y
   cola cuestan $O(1)$; en la lista, `obtener` y `agregar` $O(1)$,
   `insertar` y `eliminar` en medio $O(n)$.

## Con una pila

### Paréntesis balanceados

Dada una cadena con `(`, `)`, `[` y `]`, decidir si está bien balanceada:
cada apertura tiene su cierre, del mismo tipo, y en el orden correcto.
`([])()` sí; `([)]` no.

Al leer `([)]` de izquierda a derecha, el error se descubre en el `)`: en ese
punto hay que saber cuál fue la **última** apertura sin cerrar, que es `[`. No
la primera: la última. Recordar lo último que llegó y olvidarlo cuando se
cierra es la disciplina LIFO. Este problema, con esa observación, es uno de
los clásicos de las entrevistas de ingreso a las empresas de software.

```cpp
// dice si c cierra lo que a abre
bool cierra(Elemento a, Elemento c) {
  return (a == '(' && c == ')') || (a == '[' && c == ']');
}

bool balanceado(const char *s) {
  Pila p;
  bool ok = true;
  int i = 0;
  while (ok && s[i] != '\0') {
    if (s[i] == '(' || s[i] == '[') {
      p.apilar(s[i]);
    } else if (p.vacia()) {
      ok = false;
    } else if (cierra(p.tope(), s[i])) {
      p.desapilar();
    } else {
      ok = false;
    }
    i = i + 1;
  }
  return ok && p.vacia();
}
```

La traza con `([])()`:

| $i$ | `s[i]` | acción | pila (tope a la derecha) |
|---:|---|---|---|
| 0 | `(` | apilar | $\langle ( \rangle$ |
| 1 | `[` | apilar | $\langle (, [ \rangle$ |
| 2 | `]` | cierra `[`: desapilar | $\langle ( \rangle$ |
| 3 | `)` | cierra `(`: desapilar | $\langle\,\rangle$ |
| 4 | `(` | apilar | $\langle ( \rangle$ |
| 5 | `)` | cierra `(`: desapilar | $\langle\,\rangle$ |
| fin | | `ok` y vacía: **sí** | |

Y con `([)]`:

| $i$ | `s[i]` | acción | pila |
|---:|---|---|---|
| 0 | `(` | apilar | $\langle ( \rangle$ |
| 1 | `[` | apilar | $\langle (, [ \rangle$ |
| 2 | `)` | el tope es `[`, no cierra: `ok = false` | $\langle (, [ \rangle$ |
| fin | | **no** | |

```text
([])()   si
([)]     no
((       no
)(       no
         si
```

Las dos últimas líneas de la salida son los casos que engañan. `((` termina el
ciclo con `ok` en verdadero y dos elementos en la pila: lo rechaza el
`p.vacia()` del `return`, y sin esa mitad toda cadena de puras aperturas
pasaría. `)(` llega con un cierre a una pila vacía: lo rechaza la rama
`p.vacia()` del ciclo, que además es lo que impide llamar `tope` sobre una
pila vacía. Esa rama es la precondición de `tope`, vigilada desde el área del
programador. La cadena vacía es balanceada: no entra al ciclo y la pila está
vacía.

**Costo**, con $n$ la longitud de la cadena: $\Theta(n)$ en tiempo, una vuelta
por carácter con operaciones de $O(1)$; $O(n)$ de espacio para la pila, que en
el peor caso —una cadena de puras aperturas— guarda los $n$ caracteres.

### Evaluar una expresión postfija

En notación postfija el operador va después de sus dos operandos:
`3 4 + 2 *` es $(3 + 4) \cdot 2 = 14$. No hay paréntesis ni precedencia, y por
eso las calculadoras HP y la máquina virtual de Java evalúan así. Se lee de
izquierda a derecha: un número se guarda; un operador toma los **dos últimos**
números guardados, opera y guarda el resultado. Al final queda un solo número.
«Los dos últimos» otra vez es LIFO.

```cpp
int aplicar(char op, int a, int b) {
  int r = 0;
  if (op == '+') {
    r = a + b;
  } else if (op == '-') {
    r = a - b;
  } else if (op == '*') {
    r = a * b;
  } else {
    r = a / b;
  }
  return r;
}

// s trae digitos y operadores separados por espacios; exige que sea valida
int evaluar(const char *s) {
  Pila p;
  int i = 0;
  while (s[i] != '\0') {
    if (s[i] >= '0' && s[i] <= '9') {
      p.apilar(s[i] - '0');
    } else if (s[i] != ' ') {
      int b = p.tope();
      p.desapilar();
      int a = p.tope();
      p.desapilar();
      p.apilar(aplicar(s[i], a, b));
    }
    i = i + 1;
  }
  return p.tope();
}
```

#### El truco de `s[i] - '0'`

La línea `p.apilar(s[i] - '0')` mereció un programa aparte. Un carácter no es
un número: lo que viaja en `s[i]` es su código ASCII, y el del `'0'` es 48, el
del `'3'` es 51. Restar `'0'` convierte el carácter en el dígito que
representa.

```c
char d;
scanf("%c", &d);
printf("El numero es %d\n", (int)(d - '0'));
printf("El char de %c\n", d);
```

```text
El numero es 5
El char de 5
```

Sin la resta, `(int) d` imprime 53, que es el código del `'5'`, no el cinco. La
tabla ASCII pone los dígitos seguidos, del 48 al 57, y por eso la resta sirve
para los diez.

Con números de varias cifras hace falta un ciclo más: acumular cada dígito
multiplicando lo que se lleva por diez. Para `999`, $9 \cdot 10^2 + 9 \cdot
10^1 + 9 \cdot 10^0$. Queda propuesto.

#### El orden de los operandos

| se lee | acción | pila (tope a la derecha) | |
|---|---|---|---|
| `3` | apilar 3 | $\langle 3 \rangle$ | |
| `4` | apilar 4 | $\langle 3, 4 \rangle$ | |
| `+` | $b = 4$, $a = 3$, apilar $3 + 4$ | $\langle 7 \rangle$ | |
| `2` | apilar 2 | $\langle 7, 2 \rangle$ | |
| `*` | $b = 2$, $a = 7$, apilar $7 \cdot 2$ | $\langle 14 \rangle$ | |
| fin | `tope()` | | **14** |

```text
3 4 + 2 *   = 14
5 3 -       = 2
8 2 / 3 -   = 1
2 3 4 * +   = 14
```

`5 3 -` da 2: el 3 es el tope y sale primero, por eso se guarda en $b$, el
segundo operando. El primero que se desapila es siempre $b$ y el segundo es
$a$. Con las dos líneas intercambiadas el programa compila, no viola ninguna
precondición y responde $-2$. La pila no sabe de aritmética; el orden lo pone
el programador, y es el error más fácil de cometer en este ejercicio.

**Costo**, con $n$ la longitud de la cadena: $\Theta(n)$ en tiempo, cada
carácter dispara a lo sumo tres operaciones de $O(1)$; $O(n)$ de espacio para
la pila de operandos, que crece cuando los números vienen antes que sus
operadores: `2 3 4 * +` llega a tener tres.

## Con una cola

### Imprimir una cola sin destruirla

En la pila hizo falta una auxiliar porque lo que se devuelve entra por el
mismo extremo por el que salió. En la cola lo que sale por el frente se
devuelve por el final, y al dar la vuelta completa cada elemento vuelve a su
lugar:

```cpp
void imprimir(Cola &c) {
  int i = 0;
  int n = c.tamano();
  while (i < n) {
    Elemento x = c.frente();
    printf(" %d", x);
    c.desencolar();
    c.encolar(x);
    i = i + 1;
  }
  printf("\n");
}
```

Una pasada, no dos, y sin auxiliar. El tamaño se lee una vez, antes del ciclo:
con `!c.vacia()` el ciclo no terminaría nunca, porque cada elemento que sale
vuelve a entrar.

### La papa caliente

$n$ personas en círculo, numeradas de 1 a $n$. Se cuenta desde la primera y
la $k$-ésima sale del juego; se sigue contando desde la siguiente. ¿En qué
orden salen y quién queda de última? Pasar la papa a la siguiente persona es
sacar del frente y volver a encolar: la persona va al final del círculo. Salir
del juego es desencolar sin volver a encolar. El círculo es una cola que da
vueltas.

```cpp
// devuelve quien queda de ultimo; imprime el orden en que salen
int ultimo(int n, int k) {
  Cola c;
  int i = 1;
  while (i <= n) { c.encolar(i); i = i + 1; }
  while (c.tamano() > 1) {
    int j = 1;
    while (j < k) {
      Elemento x = c.frente();
      c.desencolar();
      c.encolar(x);
      j = j + 1;
    }
    printf("sale %d\n", c.frente());
    c.desencolar();
  }
  return c.frente();
}
```

| ronda | cola antes (frente a la izquierda) | pasan $k - 1 = 2$, sale |
|---:|---|---|
| 1 | $\langle 1, 2, 3, 4, 5 \rangle$ | $\langle 3, 4, 5, 1, 2 \rangle$: sale **3** |
| 2 | $\langle 4, 5, 1, 2 \rangle$ | $\langle 1, 2, 4, 5 \rangle$: sale **1** |
| 3 | $\langle 2, 4, 5 \rangle$ | $\langle 5, 2, 4 \rangle$: sale **5** |
| 4 | $\langle 2, 4 \rangle$ | $\langle 2, 4 \rangle$: sale **2** |
| fin | $\langle 4 \rangle$ | queda **4** |

```text
sale 3
sale 1
sale 5
sale 2
queda 4
```

En la ronda 4 la cola tiene dos personas y hay que pasar la papa dos veces: 2
va al final, luego 4 va al final, y el frente vuelve a ser 2. Sin trazarlo es
fácil creer que sale el 4. El ciclo externo termina cuando queda una persona;
con $n = 1$ no entra y devuelve la única. Con $n = 0$ el `frente` final
violaría la precondición: el enunciado exige $n \geq 1$.

**Costo**: cada ronda hace $k - 1$ pases de $O(1)$ y una salida, y hay $n - 1$
rondas: $\Theta(nk)$ en tiempo; $\Theta(n)$ de espacio, la cola con las $n$
personas. Con $k$ grande frente a $n$ se pasa la papa muchas vueltas
completas; $k \bmod$ tamaño actual las ahorra, y queda propuesto.

### Invertir una cola

$\texttt{invertir}(c)$ deja la cola con sus elementos en orden inverso:
$\langle 7, 2, 9, 4 \rangle$ pasa a $\langle 4, 9, 2, 7 \rangle$. Dar la
vuelta completa no invierte nada: cada elemento vuelve a su lugar. Hace falta
algo que devuelva las cosas en orden contrario al que entraron, y eso es una
pila.

```cpp
void invertir(Cola &c) {
  Pila p;
  while (!c.vacia()) {
    p.apilar(c.frente());
    c.desencolar();
  }
  while (!p.vacia()) {
    c.encolar(p.tope());
    p.desapilar();
  }
}
```

```text
 7 2 9 4
 4 9 2 7
```

La cola entra a la pila en su orden y sale al revés: eso es todo lo que la
pila hace, y es justo lo que faltaba. Con dos colas no se puede: cualquier
combinación de desencolar y encolar conserva el orden relativo. **Costo**:
$\Theta(n)$ en tiempo, $2n$ operaciones de $O(1)$; $\Theta(n)$ de espacio, la
pila auxiliar recibe los $n$ elementos.

## Con una lista

### Quitar repetidos de una lista ordenada

$l$ viene ordenada de menor a mayor y puede traer valores repetidos. Dejar una
sola copia de cada valor, sin crear otra lista:
$\langle 1, 1, 2, 3, 3, 3, 5 \rangle$ queda $\langle 1, 2, 3, 5 \rangle$.

```cpp
// l viene ordenada; deja una sola copia de cada valor
void quitarRepetidos(Lista &l) {
  int p = 0;
  while (p < l.tamano() - 1) {
    if (l.obtener(p) == l.obtener(p + 1)) {
      l.eliminar(p + 1);
    } else {
      p = p + 1;
    }
  }
}
```

| $p$ | compara | acción | lista |
|---:|---|---|---|
| 0 | $1 = 1$ | eliminar(1) | $\langle 1, 2, 3, 3, 3, 5 \rangle$ |
| 0 | $1 \neq 2$ | $p = 1$ | |
| 1 | $2 \neq 3$ | $p = 2$ | |
| 2 | $3 = 3$ | eliminar(3) | $\langle 1, 2, 3, 3, 5 \rangle$ |
| 2 | $3 = 3$ | eliminar(3) | $\langle 1, 2, 3, 5 \rangle$ |
| 2 | $3 \neq 5$ | $p = 3$ | |
| 3 | $3 < 4 - 1$ no | fin | $\langle 1, 2, 3, 5 \rangle$ |

```text
< 1 1 2 3 3 3 5 >
< 1 2 3 5 >
```

$p$ no avanza cuando elimina, porque al eliminar la posición $p + 1$ el
siguiente elemento se corre a esa misma posición y hay que volver a compararlo
con $e_p$. Si avanzara siempre, $\langle 3, 3, 3 \rangle$ quedaría en
$\langle 3, 3 \rangle$. La condición $p < n - 1$ se reevalúa con el tamaño
nuevo en cada vuelta, y por eso el ciclo termina aunque la lista se acorte.

**Costo**: cada `eliminar(p + 1)` corre lo que sigue, $O(n)$ con la lista
sobre arreglo. Si hay $d$ repetidos, el tiempo es $O(n + d \cdot n)$:
$\Theta(n)$ cuando no hay repetidos y $\Theta(n^2)$ en el peor caso, todos
iguales. El espacio aparte de la lista es $\Theta(1)$, solo $p$. La otra
opción es construir una lista nueva con `agregar` de cada valor que difiera
del anterior: $\Theta(n)$ en tiempo y $\Theta(n)$ de espacio. Se cambia
espacio por tiempo, y el enunciado, al pedir «sin crear otra lista», eligió
la versión en sitio.

### Intersección de listas ordenadas

$a$ y $b$ vienen ordenadas y sin repetidos. Escribir
$\texttt{interseccion}(a, b)$, que devuelve una lista nueva con los valores
que están en ambas, ordenada: $\langle 1, 3, 4, 7, 9 \rangle$ y
$\langle 2, 3, 7, 8, 9 \rangle$ dan $\langle 3, 7, 9 \rangle$.

Este se escribió en pantalla, sobre la `lista.h` de la sesión anterior. Es la
estructura de `mezclar`, dos posiciones que avanzan, y cambia lo que se hace en
cada comparación: hay tres casos, no dos. Iguales: se guarda y avanzan las
dos. Menor en $a$: avanza $i$. Menor en $b$: avanza $j$.

```cpp
void interseccion(Lista &l1, Lista &l2, Lista &r) {
  int i = 0, j = 0;
  while (i < l1.tamano() && j < l2.tamano()) {
    if (l1.obtener(i) == l2.obtener(j)) {
      r.agregar(l1.obtener(i));
      i++;
      j++;
    } else {
      if (l1.obtener(i) < l2.obtener(j)) {
        i++;
      } else {
        j++;
      }
    }
  }
}
```

```bash
g++ -Wall -Wextra interseccion_pantalla.cpp -o interseccion && ./interseccion
```

```text
3 7 9
```

La versión que devuelve la lista en vez de recibirla por referencia está en
`lista_ejercicios.cpp` y responde lo mismo. El menor de los dos frentes no
puede estar en la otra lista más adelante, porque están ordenadas: se descarta
sin mirar más. Y no hay «copiar el resto»: lo que sobra en una lista no tiene
pareja.

**Costo**: $\Theta(\texttt{tamano}(a) + \texttt{tamano}(b))$ en tiempo,
porque cada vuelta avanza al menos una posición y todas las operaciones son
$O(1)$; espacio $O(\min(\texttt{tamano}(a), \texttt{tamano}(b)))$, la lista
nueva, que no puede tener más elementos que la más corta. Un doble ciclo que
buscara cada elemento de $a$ en toda $b$ costaría el producto de los tamaños.

## Un TAD sobre otro: la cola con dos pilas

Construir el contrato de Cola usando **solo** el contrato de Pila. Una pila
invierte el orden; dos pilas lo invierten dos veces, y dos inversiones dejan
el orden original. Lo que entra se apila en `entrada`; cuando hace falta el
frente y `salida` está vacía, se pasa todo de `entrada` a `salida`, y el
primero que entró queda en el tope.

```cpp
class ColaDP {
private:
  Pila entrada;
  Pila salida;
  // pasa todo lo que hay en entrada a salida, invirtiendo el orden
  void trasvasar() {
    while (!entrada.vacia()) {
      salida.apilar(entrada.tope());
      entrada.desapilar();
    }
  }
public:
  void encolar(Elemento e) {
    entrada.apilar(e);
  }
  Elemento frente() {
    if (salida.vacia()) {
      trasvasar();
    }
    return salida.tope();
  }
  void desencolar() {
    if (salida.vacia()) {
      trasvasar();
    }
    salida.desapilar();
  }
  bool vacia() { return entrada.vacia() && salida.vacia(); }
};
```

| operación | `entrada` (tope a la derecha) | `salida` (tope a la derecha) | responde |
|---|---|---|---|
| encolar 7, 2, 9 | $\langle 7, 2, 9 \rangle$ | $\langle\,\rangle$ | |
| frente | $\langle\,\rangle$ | $\langle 9, 2, 7 \rangle$ | 7 |
| desencolar | $\langle\,\rangle$ | $\langle 9, 2 \rangle$ | |
| encolar 4 | $\langle 4 \rangle$ | $\langle 9, 2 \rangle$ | |
| frente | $\langle 4 \rangle$ | $\langle 9, 2 \rangle$ | 2 |
| desencolar, desencolar | $\langle 4 \rangle$ | $\langle\,\rangle$ | |
| frente | $\langle\,\rangle$ | $\langle 4 \rangle$ | 4 |

```text
frente: 7
frente: 2
frente: 4
vacia: 1
```

El 4 entró después que el 9 y sale después: FIFO cumplido, aunque por dentro
solo haya pilas. Mientras `salida` tenga elementos, lo que llega se queda
esperando en `entrada`, y solo cuando `salida` se vacía se trasvasa lo
acumulado.

!!! note "Costo amortizado"

    Trasvasar cuesta tantos `apilar` como elementos haya, pero cada elemento
    se trasvasa **una sola vez** en su vida. Repartido entre todas las
    operaciones, cada una cuesta constante. Ese argumento tiene nombre, costo
    amortizado, y vuelve con las tablas hash.

**Costos**: `encolar` $O(1)$; `frente` y `desencolar` $O(n)$ en la llamada
que trasvasa y $O(1)$ en las demás, y como cada elemento se trasvasa una sola
vez, $n$ operaciones cualesquiera cuestan $O(n)$ en total: $O(1)$ amortizado
por operación. Espacio $\Theta(n)$, repartido entre las dos pilas.

## Lo que costó cada solución

| Función | Tiempo | Espacio aparte de la estructura |
|---|---|---|
| `balanceado` | $\Theta(n)$ | $O(n)$, pila de aperturas |
| `evaluar` | $\Theta(n)$ | $O(n)$, pila de operandos |
| `ultimo(n, k)` | $\Theta(nk)$ | $\Theta(n)$, la cola |
| `invertir` | $\Theta(n)$ | $\Theta(n)$, pila auxiliar |
| `quitarRepetidos` | $O(n^2)$; $\Theta(n)$ sin repetidos | $\Theta(1)$ |
| `interseccion` | $\Theta(n_a + n_b)$ | $O(\min(n_a, n_b))$, lista nueva |
| `ColaDP` | $O(1)$ amortizado por operación | $\Theta(n)$, las dos pilas |

En pila y cola el costo de la solución es el número de operaciones, porque
cada una vale $O(1)$. En la lista hay que mirar cuál operación: `obtener` y
`agregar` valen $O(1)$, `eliminar` en medio $O(n)$, y eso vuelve cuadrático a
`quitarRepetidos`. El espacio de una función es lo que pide aparte: una pila
auxiliar, una lista nueva. Devolver una lista cuesta $\Theta$ de su tamaño
aunque el tiempo sea el mismo.

## Para el juez

Tres problemas de UVa que son estos mismos ejercicios con formato de entrada
y salida. Son del tipo que aparece en las pruebas de ingreso de las empresas
de software, y vale la pena resolverlos con la mano ya caliente.

### UVa 673 — Parentheses Balance

Enunciado: <https://onlinejudge.org/external/6/673.pdf>
Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=614>

Cadenas hechas solo de `()` y `[]`. Una cadena es correcta si es vacía, si es
la concatenación de dos correctas, o si es `(A)` o `[A]` con `A` correcta. Es
`balanceado` tal cual. La entrada trae una línea con $n$ y luego $n$ líneas,
una cadena por línea, de a lo sumo 128 caracteres; la salida, `Yes` o `No` por
cada una.

La trampa es la línea vacía: es correcta y vale `Yes`, y `scanf("%s")` se la
salta y toma la siguiente en su lugar, con lo que todas las respuestas se
corren una posición. Lea $n$ con `scanf`, consuma el resto de esa línea con
un `fgets`, y de ahí en adelante un `fgets` por cadena, quitando el `\n`
final antes de recorrerla.

### UVa 10935 — Throwing cards away I

Enunciado: <https://onlinejudge.org/external/109/10935.pdf>
Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1876>

Un mazo con las cartas $1, \ldots, n$ en orden, la 1 arriba. Mientras queden
al menos dos: se descarta la de arriba y la que queda arriba pasa al fondo.
Reportar las descartadas, en orden, y la que queda. Es la papa caliente con
otra regla: encole $1, \ldots, n$ y, mientras el tamaño sea mayor que 1,
desencole (descartada) y luego desencole y encole (pasa al fondo). $n - 1$
descartes y $n - 1$ pases de $O(1)$: $\Theta(n)$.

| Cola (frente a la izquierda) | Descartada | Pasa al fondo |
|---|---:|---:|
| $\langle 1, 2, 3, 4, 5, 6, 7 \rangle$ | 1 | 2 |
| $\langle 3, 4, 5, 6, 7, 2 \rangle$ | 3 | 4 |
| $\langle 5, 6, 7, 2, 4 \rangle$ | 5 | 6 |
| $\langle 7, 2, 4, 6 \rangle$ | 7 | 2 |
| $\langle 4, 6, 2 \rangle$ | 4 | 6 |
| $\langle 2, 6 \rangle$ | 2 | 6 |
| $\langle 6 \rangle$ | queda la 6 | |

La salida es `Discarded cards: 1, 3, 5, 7, 4, 2` y `Remaining card: 6`. Las
trampas: con $n = 1$ no se descarta nada y la primera línea es
`Discarded cards:` sin espacio después; la coma y el espacio van antes de cada
carta menos la primera; y se lee hasta encontrar el `0`.

### UVa 514 — Rails

Enunciado: <https://onlinejudge.org/external/5/514.pdf>
Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=455>

Los vagones $1, \ldots, N$ llegan en ese orden por la vía A a una estación de
una sola vía sin salida y siguen por la vía B; el que entró no vuelve a A y
el que salió no regresa. ¿Pueden salir en el orden $a_1, \ldots, a_N$? La
estación es una pila. Lleve `siguiente`, el próximo vagón que puede entrar,
desde 1. Para cada $a_i$: mientras el tope no sea $a_i$ y queden vagones,
apile `siguiente` y avance; si el tope es $a_i$, desapile; si no, la
respuesta es `No`.

| Pedido | Entran | Pila (tope a la derecha) | Sale |
|---:|---|---|---|
| 5 | 1, 2, 3, 4, 5 | $\langle 1, 2, 3, 4, 5 \rangle$ | 5 |
| 4 | | $\langle 1, 2, 3, 4 \rangle$ | 4 |
| 1 | no quedan | $\langle 1, 2, 3 \rangle$, tope 3 | `No` |

Con `1 2 3 4 5` cada vagón entra y sale de inmediato: `Yes`. Las trampas: la
línea en blanco va después de cada bloque, también del último con datos;
cuando la respuesta ya es `No` a mitad de una permutación hay que seguir
leyendo los $N$ números de esa línea; y la pila se vacía antes de cada
permutación.

## Para practicar en casa

### Propuesto 1

Extender `balanceado` para que acepte `{` y `}`. ¿Cuántas líneas cambian?

### Propuesto 2

Hacer que `evaluar` lea números de más de un dígito: `12 2 / 3 -` debe dar 3.

### Propuesto 3

Hacer que `evaluar` devuelva un indicador de error cuando la expresión esté
mal formada: un operador sin dos operandos, o más de un número al final.
Escribir primero qué precondición de la pila se violaría en cada caso.

### Propuesto 4

Con una pila y una cola, decidir si una palabra se lee igual al derecho y al
revés. Explicar por qué hacen falta las dos.

### Propuesto 5

Con la estructura de `interseccion`, escribir `union` de dos listas ordenadas
sin repetidos: cada valor una sola vez.

### Propuesto 6

Una pila con dos colas es posible, pero una de las operaciones cuesta $n$.
Escribirla y decir cuál.

### Pistas

- **Propuesto 1**: dos, la condición que apila y `cierra`.
- **Propuesto 2**: mientras el carácter sea dígito, `valor = valor * 10 +
  (s[i] - '0')`; se apila al llegar al espacio.
- **Propuesto 3**: un operador sin dos operandos pide `tope` sobre una pila
  vacía o con un solo elemento; más de un número al final deja la pila con
  tamaño mayor que 1 cuando se termina la cadena.
- **Propuesto 4**: la cola devuelve la palabra en su orden y la pila al revés;
  se comparan carácter por carácter.
- **Propuesto 5**: en los tres casos se agrega algo; cuando se agota una
  lista, se copia el resto de la otra, como en `mezclar`.
- **Propuesto 6**: `apilar` encola en la cola que no está vacía; `desapilar`
  pasa todos menos el último a la otra cola, y ese pase es el que cuesta $n$.

## Ejercicios interactivos

Cinco actividades de esta sesión se trabajan en el navegador, una por tema:
cadenas con llaves y una postfija más larga para la pila, las cartas al aire y
la papa caliente para la cola, `quitarRepetidos` y la unión ordenada para la
lista, la cola con dos pilas ante otra secuencia, y las cuentas de costo:
[página de ejercicios interactivos](./Ejercicios.md). Los programas no son
los de arriba: mismo tema, ronda nueva.

## Código de la clase

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

Las cabeceras son las de la sesión anterior y cada programa incluye la que
necesita:

- [lista.h](codigo/lista.h), [pila.h](codigo/pila.h),
  [cola.h](codigo/cola.h) — los tres contratos con su implementación
  provisional

**Con una pila**

- [parentesis.cpp](codigo/parentesis.cpp) — `balanceado` con los cinco casos
  de la sesión
- [postfija.cpp](codigo/postfija.cpp) — `evaluar` con las cuatro expresiones
- [conversion.c](codigo/conversion.c) — el `- '0'`, tal como quedó en pantalla

**Con una cola**

- [papa_caliente.cpp](codigo/papa_caliente.cpp) — `ultimo(5, 3)`
- [invertir_cola.cpp](codigo/invertir_cola.cpp) — `imprimir` dando la vuelta
  e `invertir` con una pila

**Con una lista**

- [lista_ejercicios.cpp](codigo/lista_ejercicios.cpp) — `quitarRepetidos` e
  `interseccion`
- [interseccion_pantalla.cpp](codigo/interseccion_pantalla.cpp) — la
  intersección tal como quedó en pantalla, con la lista de respuesta por
  referencia

**Un TAD sobre otro**

- [cola_dos_pilas.cpp](codigo/cola_dos_pilas.cpp) — `ColaDP` y su traza

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 7 (pilas y sus aplicaciones), capítulo 8 (colas).
- N. Kalicharan. *Data Structures in C*. 2008. Capítulo 4 (pilas y colas).
- UVa Online Judge, problemas 673, 10935 y 514. <https://onlinejudge.org>
