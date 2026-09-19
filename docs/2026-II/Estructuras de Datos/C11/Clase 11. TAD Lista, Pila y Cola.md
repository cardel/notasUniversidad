# Clase 11. TAD Lista, Pila y Cola

Miércoles 16 de septiembre de 2026.

El TAD Racional dejó un esquema: un conjunto de valores, unas operaciones con
su firma, unas ecuaciones y una precondición que se vigila con `assert`. Con
eso, `sumar`, `multiplicar` e `igual` se escribieron una sola vez y sirvieron
para dos representaciones distintas. Hoy el mismo esquema se aplica tres veces
a tipos que guardan **muchos** valores en vez de uno, y la pregunta que ordena
la sesión es por dónde se entra y por dónde se sale.

Al final de la sesión el objetivo era poder especificar los TAD Lista, Pila y
Cola con su dominio, sus operaciones y las precondiciones de cada una;
distinguir las tres disciplinas de acceso —por posición, por el último que
llegó, por el primero que llegó—; escribir funciones que resuelvan un problema
usando solo el contrato, sin saber cómo está guardada la estructura; trazar
una secuencia de operaciones y predecir el estado final; y decir qué cuesta
cada operación y cada función escrita sobre ella.

## Diapositivas

![](clase11.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Tres maneras de guardar muchos

El historial de un navegador con su botón *atrás*, la fila para pagar en la
cafetería y una lista de reproducción donde se puede saltar a la canción 7.
Los tres guardan una colección **lineal**: cada elemento tiene un anterior y
un siguiente, salvo los extremos. Lo distinto es por dónde se entra y por
dónde se sale: en la lista de reproducción, por cualquier posición; en el
historial, por el último que llegó; en la fila, por el primero que llegó.

!!! note "Estructura lineal"

    Una colección finita de elementos del mismo tipo en la que existe un
    orden: hay un primero, hay un último y cada elemento, salvo el último,
    tiene un único siguiente.

Esa unicidad del siguiente es lo que se rompe con los árboles, más adelante.
Una secuencia se escribe entre paréntesis angulares,
$\langle e_0, e_1, \ldots, e_{n-1} \rangle$ con $n \geq 0$; la vacía es
$\langle\,\rangle$ y $n$ es su tamaño. La notación no dice si los elementos
están en un arreglo o enlazados por punteros: eso vive debajo de la barrera y
es tema de las sesiones de implementación.

Menos operaciones no es menos poder. Es una promesa más fuerte sobre el
orden, y la implementación la cobra más barata.

## TAD Lista

!!! note "El TAD Lista"

    **Dominio**

    $$\{\, \langle e_0, \ldots, e_{n-1} \rangle \;:\; n \geq 0,\ e_i \in \text{Elemento} \,\}$$

    **Firmas**, con $n = \texttt{tamano}(l)$

    $$
    \begin{aligned}
      \texttt{crear} &: \to \text{Lista}\\
      \texttt{insertar} &: \text{Lista} \times \text{Entero} \times \text{Elemento} \to \text{Lista}, \quad \text{exige } 0 \leq p \leq n\\
      \texttt{eliminar} &: \text{Lista} \times \text{Entero} \to \text{Lista}, \quad \text{exige } 0 \leq p < n\\
      \texttt{obtener} &: \text{Lista} \times \text{Entero} \to \text{Elemento}, \quad \text{exige } 0 \leq p < n\\
      \texttt{asignar} &: \text{Lista} \times \text{Entero} \times \text{Elemento} \to \text{Lista}, \quad \text{exige } 0 \leq p < n\\
      \texttt{agregar} &: \text{Lista} \times \text{Elemento} \to \text{Lista}\\
      \texttt{tamano} &: \text{Lista} \to \text{Entero}\\
      \texttt{vacia} &: \text{Lista} \to \text{Booleano}
    \end{aligned}
    $$

Las operaciones vienen en tres familias. Las **constructoras** producen una
lista desde nada: `crear`. Las **modificadoras** reciben una lista y la
cambian: `insertar`, `eliminar`, `asignar`, `agregar`. Las **analizadoras**
preguntan sin cambiar nada: `obtener`, `tamano`, `vacia`. Con el Racional
bastaban un constructor y dos observadores porque el valor no cambiaba; una
lista sí cambia, y por eso aparecen las modificadoras.

### La única precondición que admite $p = n$

Con diez elementos, `eliminar`, `obtener` y `asignar` aceptan posiciones de 0
a 9. `insertar` acepta además la 10. La razón: insertar produce un elemento
nuevo, y si hay diez, el nuevo puede quedar de undécimo, en la posición 10.
Ninguna otra operación puede referirse a una posición que todavía no existe.

Sea $l = \langle e_0, \ldots, e_{n-1} \rangle$ antes de la operación:

| Operación | Exige | Deja |
|---|---|---|
| $\texttt{insertar}(l, p, e)$ | $0 \leq p \leq n$ | $\langle e_0, \ldots, e_{p-1}, e, e_p, \ldots, e_{n-1} \rangle$, tamaño $n + 1$ |
| $\texttt{eliminar}(l, p)$ | $0 \leq p < n$ | $\langle e_0, \ldots, e_{p-1}, e_{p+1}, \ldots, e_{n-1} \rangle$, tamaño $n - 1$ |
| $\texttt{asignar}(l, p, v)$ | $0 \leq p < n$ | $e_p = v$, lo demás igual |
| $\texttt{agregar}(l, e)$ | nada | $\langle e_0, \ldots, e_{n-1}, e \rangle$ |

Con $l = \langle 5, 8 \rangle$: $\texttt{insertar}(l, 1, 7)$ deja
$\langle 5, 7, 8 \rangle$, el 7 en la posición 1 y el 8 corrido;
$\texttt{insertar}(l, 2, 7)$ deja $\langle 5, 8, 7 \rangle$, porque $p = n$ es
agregar al final; e $\texttt{insertar}(l, 3, 7)$ viola la precondición, la
posición 3 no existe y el contrato no dice qué pasa. Eso es deliberado: quien
llama responde por $p$.

### El contrato en C++ y la implementación que corre hoy

```cpp
typedef int Elemento;

class Lista {
private:
  Elemento datos[CAPACIDAD];
  int n;
public:
  Lista();                          // crear
  void insertar(int p, Elemento e); // 0 <= p <= tamano()
  void eliminar(int p);             // 0 <= p <  tamano()
  Elemento obtener(int p);          // 0 <= p <  tamano()
  void asignar(int p, Elemento e);  // 0 <= p <  tamano()
  void agregar(Elemento e);
  int tamano();
  bool vacia();
};
```

`typedef int Elemento` le pone un nombre al tipo de lo que se guarda: cambiar
esa línea por `char` o por `double` cambia la lista entera sin tocar nada más.
La lista sobre la que actúa cada operación viaja en `this`, y por eso la firma
en C++ tiene un argumento menos que la de la caja.

Por dentro, la implementación provisional es un arreglo de `CAPACIDAD` casillas
y un contador `n` que marca el borde lógico: cuántas casillas están en uso. Se
crea con `n = 0`, es decir, vacía. Las dos modificadoras que mueven cosas son
las que hay que mirar despacio:

```cpp
// exige 0 <= p <= tamano()
void insertar(int p, Elemento e) {
  assert(0 <= p && p <= n && n < CAPACIDAD);
  int i = n;
  while (i > p) {
    datos[i] = datos[i - 1];
    i = i - 1;
  }
  datos[p] = e;
  n = n + 1;
}

// exige 0 <= p < tamano()
void eliminar(int p) {
  assert(0 <= p && p < n);
  int i = p;
  while (i < n - 1) {
    datos[i] = datos[i + 1];
    i = i + 1;
  }
  n = n - 1;
}
```

Con capacidad 5, $n = 3$ y $\langle 5, 8, 3 \rangle$, insertar el 10 en la
posición 1 obliga a correr a la derecha todo lo que está desde la 1: el 3 pasa
a la casilla 3, el 8 a la 2, y solo entonces el 10 cae en la 1. Queda
$\langle 5, 10, 8, 3 \rangle$ con $n = 4$. El orden del recorrido decide si
funciona: `insertar` arranca desde el **último** y va hacia $p$, porque si
moviera primero el 8 a la casilla 2, pisaría el 3 antes de haberlo movido.
`eliminar` hace lo contrario, arranca en $p$ y avanza hacia el final, y por la
misma razón: cada casilla recibe el valor de la siguiente antes de que esa
siguiente se sobreescriba. Al eliminar el 8 de $\langle 5, 10, 8, 3 \rangle$, el
3 ocupa su lugar y $n$ baja a 3.

La traza del programa de la sesión, con `imprimir` escrita solo con `tamano` y
`obtener`:

```cpp
Lista l;
imprimir(l);
l.agregar(5);
l.agregar(8);
imprimir(l);
l.insertar(1, 7);
imprimir(l);
l.eliminar(0);
imprimir(l);
l.asignar(1, 2);
imprimir(l);
printf("tamano: %d, vacia: %d\n", l.tamano(), l.vacia());
```

```text
< >
< 5 8 >
< 5 7 8 >
< 7 8 >
< 7 2 >
tamano: 2, vacia: 0
```

Después de `eliminar(0)` el 8 ya no está en la posición 2 sino en la 1.
Cada línea es una poscondición cumplida, y verificarlo a mano es la forma de
leer un contrato.

### Lo que cuesta cada operación de la lista

Se calcularon en la sesión, una por una, sobre la implementación de arreglo y
contador:

| Operación | Tiempo | Por qué |
|---|---|---|
| `crear` | $O(1)$ | poner $n$ en cero |
| `obtener(p)`, `asignar(p, e)` | $O(1)$ | se calcula la dirección de la casilla |
| `agregar(e)` | $O(1)$ | se escribe en la casilla $n$; nada se corre |
| `insertar(p, e)` | $O(n - p)$, peor caso $O(n)$ | se corren las casillas de $p$ a $n - 1$ |
| `eliminar(p)` | $O(n - p)$, peor caso $O(n)$ | se corren las casillas de $p + 1$ a $n - 1$ |
| `tamano`, `vacia` | $O(1)$ | se lee $n$ |

El peor caso de `insertar` es la posición 0: toca correr todo. Insertar en la
posición $n$ no entra al ciclo, porque $i = n$ no es mayor que $p = n$, y
cuesta lo mismo que `agregar`. Esa asimetría entre el final y el frente es la
que van a explotar la pila y la cola.

**Espacio.** $\Theta(\texttt{CAPACIDAD})$, porque el arreglo se reserva
completo al crear la lista: con capacidad 100 y diez elementos hay noventa
casillas sin usar. Una implementación que crezca según haga falta cobra
$\Theta(n)$. La ventaja de esta es la consulta: `obtener` es una
dirección y ya.

Esto explica algo que los que programan en Python ya han sentido:

```python
p = [1, 2, 3, 4]
p.append(10)      # al final: O(1)
p.insert(0, 100)  # al frente: O(n), corre todo lo demás
```

La lista de Python es un arreglo por debajo. `append` escribe en la casilla
$n$; `insert(0, x)` corre todos los elementos. Que un programa funcione no
dice que sea óptimo, y muchas veces esa es la diferencia entre una aplicación
que responde y una que se arrastra.

### El área del programador: mezclar dos listas ordenadas

$a$ y $b$ vienen ordenadas de menor a mayor. Construir una lista nueva con
todos los elementos de ambas, ordenada, sin ordenar nada. Dos posiciones, $i$
sobre $a$ y $j$ sobre $b$: en cada paso se copia el menor de los dos frentes y
avanza solo esa posición; cuando una lista se agota, se copia el resto de la
otra. Es el paso de *combinar* del ordenamiento por mezcla, escrito contra el
contrato de Lista.

```cpp
// copia al final de r los elementos de l desde la posicion p
void copiarDesde(Lista &r, Lista &l, int p) {
  while (p < l.tamano()) {
    r.agregar(l.obtener(p));
    p = p + 1;
  }
}

Lista mezclar(Lista &a, Lista &b) {
  Lista r;
  int i = 0;
  int j = 0;
  while (i < a.tamano() && j < b.tamano()) {
    if (a.obtener(i) <= b.obtener(j)) {
      r.agregar(a.obtener(i));
      i = i + 1;
    } else {
      r.agregar(b.obtener(j));
      j = j + 1;
    }
  }
  copiarDesde(r, a, i);
  copiarDesde(r, b, j);
  return r;
}
```

Las listas llegan por referencia, para no copiarlas: copiar costaría tanto
como recorrerlas. `copiarDesde` tiene nombre propio porque es la misma función
para el resto de $a$ y el resto de $b$; con `p = 3` copia desde el cuarto
elemento en adelante.

| $i$ | $j$ | comparación | se copia | $r$ |
|---:|---:|---|---|---|
| 0 | 0 | $4 \leq 1$ no | $b_0 = 1$ | $\langle 1 \rangle$ |
| 0 | 1 | $4 \leq 5$ sí | $a_0 = 4$ | $\langle 1, 4 \rangle$ |
| 1 | 1 | $5 \leq 5$ sí | $a_1 = 5$ | $\langle 1, 4, 5 \rangle$ |
| 2 | 1 | $9 \leq 5$ no | $b_1 = 5$ | $\langle 1, 4, 5, 5 \rangle$ |
| 2 | 2 | $9 \leq 8$ no | $b_2 = 8$ | $\langle 1, 4, 5, 5, 8 \rangle$ |
| 2 | 3 | $b$ agotada | `copiarDesde`: 9 | $\langle 1, 4, 5, 5, 8, 9 \rangle$ |

```text
< 1 4 5 5 8 9 >
```

El $\leq$ en vez de $<$ decide quién va primero en un empate: el de $a$. Aquí
da lo mismo; con registros de varios campos, no.

**Costo**, con $n = \texttt{tamano}(a) + \texttt{tamano}(b)$: $\Theta(n)$ en
tiempo, porque cada vuelta de cualquiera de los tres ciclos copia un elemento
con un `agregar` de $O(1)$ y avanza una posición; $\Theta(n)$ de espacio, la
lista nueva. Si `mezclar` se escribiera con `insertar` en una posición
intermedia en vez de `agregar` al final, cada copia costaría $O(n)$ y el total
subiría a $O(n^2)$. El contrato es el mismo; el costo lo decide qué operación
se elige.

### Revertir: la misma función, lineal o cuadrática

$\texttt{revertir}(l)$ devuelve una lista nueva con los elementos de $l$ en
orden inverso. Hay dos caminos y los dos cumplen sus precondiciones siempre:

```cpp
Lista revertir(Lista &l) {
  Lista r;
  int p = 0;
  while (p < l.tamano()) {
    r.insertar(0, l.obtener(p));
    p = p + 1;
  }
  return r;
}
```

```text
< 9 8 5 5 4 1 >
```

$\texttt{insertar}(r, 0, \cdot)$ vale incluso con $r$ vacía, porque
$0 \leq 0 \leq \texttt{tamano}(r)$. El otro camino recorre $l$ desde
$\texttt{tamano}(l) - 1$ hasta 0 con `agregar`, y da la misma lista.

| Versión | Tiempo | Por qué |
|---|---|---|
| `insertar(0, ·)` | $\Theta(n^2)$ | la $k$-ésima inserción corre los $k - 1$ que ya están: $0 + 1 + \cdots + (n - 1) = n(n-1)/2$ |
| `agregar` desde el final | $\Theta(n)$ | $n$ operaciones de $O(1)$ |

Las dos usan $\Theta(n)$ de espacio, la lista nueva. Mismo contrato, misma
salida, y una versión es cuadrática donde la otra es lineal. Antes de escribir
una función contra un contrato hay que mirar la tabla de costos de sus
operaciones.

## TAD Pila

Una lista en la que solo se toca un extremo, el **tope**: se agrega por el
tope, se quita por el tope y solo se puede ver el tope. Es la disciplina LIFO,
*last in, first out* (Thareja, capítulo 7). Aparece en deshacer y rehacer de
un editor, en el botón *atrás* del navegador y en las llamadas a funciones: la
que llamó espera a que termine la última que entró. Y en la montaña de ropa al
fondo del cuarto: solo se alcanza la última prenda que se quitó.

!!! note "El TAD Pila"

    **Dominio**: $\{\, \langle e_0, \ldots, e_{n-1} \rangle : n \geq 0 \,\}$,
    con $e_{n-1}$ el tope.

    $$
    \begin{aligned}
      \texttt{crear} &: \to \text{Pila}\\
      \texttt{apilar} &: \text{Pila} \times \text{Elemento} \to \text{Pila}\\
      \texttt{desapilar} &: \text{Pila} \to \text{Pila}, \quad \text{exige } n > 0\\
      \texttt{tope} &: \text{Pila} \to \text{Elemento}, \quad \text{exige } n > 0\\
      \texttt{tamano} &: \text{Pila} \to \text{Entero} \qquad
      \texttt{vacia} : \text{Pila} \to \text{Booleano}
    \end{aligned}
    $$

    **Poscondiciones**, con $p = \langle e_0, \ldots, e_{n-1} \rangle$:
    $\texttt{apilar}(p, e)$ deja $\langle e_0, \ldots, e_{n-1}, e \rangle$;
    $\texttt{desapilar}(p)$ deja $\langle e_0, \ldots, e_{n-2} \rangle$;
    $\texttt{tope}(p) = e_{n-1}$.

Ninguna operación recibe una posición. Esa es toda la diferencia con la lista.
Desapilar una pila vacía es el error con nombre propio, *underflow*, y por eso
`desapilar` y `tope` exigen $n > 0$.

| Operación | Pila (tope a la derecha) |
|---|---|
| `apilar(3)` | $\langle 3 \rangle$ |
| `apilar(8)` | $\langle 3, 8 \rangle$ |
| `apilar(1)` | $\langle 3, 8, 1 \rangle$ |
| `apilar(6)` | $\langle 3, 8, 1, 6 \rangle$ |
| `desapilar()` | $\langle 3, 8, 1 \rangle$ |
| `desapilar()` | $\langle 3, 8 \rangle$, tope 8 |

Después de cuatro `apilar`, `tope()` es 6; el 3 está abajo de todo y no hay
manera de leerlo sin desapilar tres veces. Cada `desapilar` descarta el tope y
no lo devuelve: quien lo quiera, lo lee antes con `tope`.

### La implementación que corre hoy

```cpp
class Pila {
private:
  Elemento datos[CAPACIDAD];
  int n;
public:
  Pila() {
    n = 0;
  }
  void apilar(Elemento e) {
    assert(n < CAPACIDAD);
    datos[n] = e;
    n = n + 1;
  }
  // exige !vacia()
  void desapilar() {
    assert(n > 0);
    n = n - 1;
  }
  // exige !vacia()
  Elemento tope() {
    assert(n > 0);
    return datos[n - 1];
  }
  int tamano() {
    return n;
  }
  bool vacia() {
    return n == 0;
  }
};
```

`apilar` es el `agregar` de la lista. `desapilar` solo descuenta `n`: el
valor sigue físicamente en la casilla, pero quedó fuera del borde lógico y el
siguiente `apilar` lo pisa. Una pila es una lista en la que todo pasa en la
última posición, que era justo la barata.

| Operación | Tiempo | Por qué |
|---|---|---|
| `crear` | $O(1)$ | poner $n$ en cero |
| `apilar(e)` | $O(1)$ | se escribe en la casilla $n$ |
| `desapilar` | $O(1)$ | se descuenta $n$; nada se corre |
| `tope` | $O(1)$ | se lee la casilla $n - 1$ |
| `tamano`, `vacia` | $O(1)$ | se lee $n$ |

**Espacio**: $\Theta(n)$ para $n$ elementos, con la misma salvedad de la
lista: hoy, `CAPACIDAD` casillas reservadas de antemano.

### La precondición vigilada

```cpp
Pila p;
p.apilar(4);
printf("tope: %d\n", p.tope());
p.desapilar();
printf("vacia: %d\n", p.vacia());
p.desapilar();
printf("esta linea no se alcanza\n");
```

```text
tope: 4
vacia: 1
pila_precondicion: pila.h:27: void Pila::desapilar(): Assertion `n > 0' failed.
```

La segunda llamada a `desapilar` viola $n > 0$ y el `assert` detiene el
programa ahí, con código de salida 134. Sin él, `n` quedaría en $-1$ y el
error aparecería mucho después, lejos de su causa.

### Imprimir una pila: el precio de mirar

Con el contrato de Pila no hay forma de ver el segundo elemento sin quitar el
primero. El primer intento imprime del tope hacia abajo y deja la pila vacía:

```cpp
void imprimirV1(Pila &p) {
  while (!p.vacia()) {
    printf(" %d", p.tope());
    p.desapilar();
  }
  printf("\n");
}
```

Una función que «solo imprime» y recibe la pila por referencia la destruye. Si
el llamador la necesitaba después, la perdió. La versión que la deja como
estaba usa una pila auxiliar:

```cpp
void imprimir(Pila &p) {
  Pila aux;
  while (!p.vacia()) {
    printf(" %d", p.tope());
    aux.apilar(p.tope());
    p.desapilar();
  }
  while (!aux.vacia()) {
    p.apilar(aux.tope());
    aux.desapilar();
  }
  printf("\n");
}
```

| Paso | $p$ | `aux` | Salida |
|---|---|---|---|
| inicio | $\langle 3, 8, 1, 6 \rangle$ | $\langle\,\rangle$ | |
| primer ciclo, 4 vueltas | $\langle\,\rangle$ | $\langle 6, 1, 8, 3 \rangle$ | `6 1 8 3` |
| segundo ciclo, 4 vueltas | $\langle 3, 8, 1, 6 \rangle$ | $\langle\,\rangle$ | |

```text
 6 1 8 3
tamano despues de la version 1: 0
 6 1 8 3
tamano despues de la version 2: 4
```

Al pasar todo a `aux` el orden se invierte: el 3 que estaba abajo queda en el
tope de `aux`. Al devolverlo se invierte otra vez y $p$ queda igual. Si se
olvida el segundo ciclo, $p$ queda vacía y `aux` con los elementos al revés.

| Versión | Tiempo | Espacio aparte de la pila |
|---|---|---|
| 1, destruye | $\Theta(n)$: $n$ `tope` y $n$ `desapilar` | $\Theta(1)$ |
| 2, conserva | $\Theta(n)$: $2n$ operaciones de $O(1)$ | $\Theta(n)$, la auxiliar llega a tener los $n$ |

### Eliminar debajo del tope

$\texttt{eliminarDesdeTope}(p, k)$ quita el elemento que está $k$ lugares
debajo del tope ($k = 0$ es el tope) y deja el resto en su orden. Con
$p = \langle 3, 8, 1, 6 \rangle$ y $k = 2$ debe quedar $\langle 3, 1, 6 \rangle$.

```cpp
// exige 0 <= k < tamano()
void eliminarDesdeTope(Pila &p, int k) {
  Pila aux;
  int i = 0;
  while (i < k) {
    aux.apilar(p.tope());
    p.desapilar();
    i = i + 1;
  }
  p.desapilar();
  while (!aux.vacia()) {
    p.apilar(aux.tope());
    aux.desapilar();
  }
}
```

```text
 6 1 3
```

Se mueven $k$ elementos, se descarta uno y se devuelven los $k$. La
precondición $k < \texttt{tamano}()$ es lo que hace legal el `desapilar`
suelto de la mitad. **Costo**: $\Theta(k)$ en tiempo, $2k + 1$ operaciones de
$O(1)$, y $\Theta(k)$ de espacio para la auxiliar. No depende de $n$: lo que
está debajo del elemento eliminado no se toca.

## TAD Cola

Una lista en la que se entra por un extremo, el **final**, y se sale por el
otro, el **frente**. Es la disciplina FIFO, *first in, first out* (Thareja,
capítulo 8): turnos, cajas, impresoras compartidas, las tareas que un sistema
atiende en el orden en que llegan, y el recorrido por niveles de un árbol, que
viene después. En inglés las operaciones son *enqueue* y *dequeue*.

!!! note "El TAD Cola"

    **Dominio**: $\{\, \langle e_0, \ldots, e_{n-1} \rangle : n \geq 0 \,\}$,
    con $e_0$ el frente.

    $$
    \begin{aligned}
      \texttt{crear} &: \to \text{Cola}\\
      \texttt{encolar} &: \text{Cola} \times \text{Elemento} \to \text{Cola}\\
      \texttt{desencolar} &: \text{Cola} \to \text{Cola}, \quad \text{exige } n > 0\\
      \texttt{frente} &: \text{Cola} \to \text{Elemento}, \quad \text{exige } n > 0\\
      \texttt{tamano} &: \text{Cola} \to \text{Entero} \qquad
      \texttt{vacia} : \text{Cola} \to \text{Booleano}
    \end{aligned}
    $$

    **Poscondiciones**, con $c = \langle e_0, \ldots, e_{n-1} \rangle$:
    $\texttt{encolar}(c, e)$ deja $\langle e_0, \ldots, e_{n-1}, e \rangle$;
    $\texttt{desencolar}(c)$ deja $\langle e_1, \ldots, e_{n-1} \rangle$;
    $\texttt{frente}(c) = e_0$.

`encolar` y `apilar` dejan lo mismo. La diferencia está en cuál extremo quita
`desencolar`.

| Operación | Cola (frente a la izquierda) |
|---|---|
| `encolar(7)` | $\langle 7 \rangle$ |
| `encolar(2)` | $\langle 7, 2 \rangle$ |
| `encolar(9)` | $\langle 7, 2, 9 \rangle$ |
| `desencolar()` | $\langle 2, 9 \rangle$ |
| `encolar(4)` | $\langle 2, 9, 4 \rangle$ |
| `desencolar()` | $\langle 9, 4 \rangle$ |

El 7 fue el primero en entrar y el primero en salir.

### Por qué la cola no es una lista que elimina en la posición 0

Con la lista sobre arreglo, `desencolar` sería `eliminar(0)`: correr todo el
arreglo una casilla, $O(n)$. Una cola de $n$ elementos que se vacía costaría
$O(n^2)$, y una estructura donde sacar cuesta lineal no sirve para lo que la
cola es. La implementación que corre hoy lo resuelve con un **arreglo
circular**, y ese fue el trabajo de tablero de la sesión.

Con capacidad 9: se encolan 5, 8, 10, 12 y 13, que ocupan las casillas 0 a 4.
Se desencola: sale el 5, y en vez de correr las demás, el frente pasa a la
casilla 1. Se desencolan el 8 y el 10 y el frente queda en la casilla 3. Se
encolan 20, 22 y 23, que caen en las casillas 5, 6 y 7. Las casillas 0, 1 y 2
quedaron libres, y el próximo `encolar` que pase de la casilla 8 tiene que
volver a la 0. Eso es lo que hace el módulo.

```cpp
class Cola {
private:
  Elemento datos[CAPACIDAD];
  int inicio;   // posicion del frente
  int n;
public:
  Cola() {
    inicio = 0;
    n = 0;
  }
  void encolar(Elemento e) {
    assert(n < CAPACIDAD);
    datos[(inicio + n) % CAPACIDAD] = e;
    n = n + 1;
  }
  // exige !vacia()
  void desencolar() {
    assert(n > 0);
    inicio = (inicio + 1) % CAPACIDAD;
    n = n - 1;
  }
  // exige !vacia()
  Elemento frente() {
    assert(n > 0);
    return datos[inicio];
  }
  int tamano() {
    return n;
  }
  bool vacia() {
    return n == 0;
  }
};
```

Dos números describen la cola: `inicio`, la casilla del frente, y `n`, cuántos
elementos hay. El final está en `(inicio + n) % CAPACIDAD`: con `inicio = 3` y
`n = 6` en capacidad 9, el siguiente entra en $9 \bmod 9 = 0$; el que sigue
en $10 \bmod 9 = 1$; el otro en $11 \bmod 9 = 2$. `desencolar` avanza el
frente con el mismo módulo: si se encolaron 9 y se desencolaron 9, `inicio`
dio la vuelta completa y volvió a 0. Ninguna operación corre nada.

Que todo cueste $O(1)$ se ve en la aritmética de direcciones de las sesiones de
punteros: la casilla del final está en
`datos + ((inicio + n) % CAPACIDAD) * sizeof(Elemento)`, una suma, un módulo y
una multiplicación con números fijos, y nada de eso depende de cuántos
elementos haya. El frente es `datos + inicio`, lo mismo.

| Operación | Tiempo | Por qué |
|---|---|---|
| `crear` | $O(1)$ | poner `inicio` y $n$ en cero |
| `encolar(e)` | $O(1)$ | se escribe en la casilla `(inicio + n) % CAPACIDAD` |
| `desencolar` | $O(1)$ | se avanza `inicio` con el módulo; nada se corre |
| `frente` | $O(1)$ | se lee la casilla `inicio` |
| `tamano`, `vacia` | $O(1)$ | se lee $n$ |

**Espacio**: $\Theta(n)$ para $n$ elementos; hoy `CAPACIDAD` casillas
reservadas, como en la lista y la pila. Cómo se construye esta cola desde cero
es tema de la sesión de implementación de la cola.

### El área del programador: particionar una cola

Dada una cola $c$ y un valor $v$, reordenarla de modo que queden primero los
elementos menores que $v$ y después los demás, cada grupo en el orden en que
estaba. Con $\langle 7, 2, 9, 4, 5 \rangle$ y $v = 5$ debe quedar
$\langle 2, 4, 7, 9, 5 \rangle$.

El recorrido de una cola es *dar la vuelta*: sacar del frente y volver a
encolar, tantas veces como elementos había. Por eso hay que leer `tamano`
antes de empezar.

```cpp
void particionar(Cola &c, Elemento v) {
  Cola mayores;
  int i = 0;
  int n = c.tamano();
  while (i < n) {
    Elemento x = c.frente();
    c.desencolar();
    if (x < v) {
      c.encolar(x);
    } else {
      mayores.encolar(x);
    }
    i = i + 1;
  }
  while (!mayores.vacia()) {
    c.encolar(mayores.frente());
    mayores.desencolar();
  }
}
```

| $i$ | $x$ y decisión | $c$ después | `mayores` |
|---:|---|---|---|
| 0 | $7 < 5$ no | $\langle 2, 9, 4, 5 \rangle$ | $\langle 7 \rangle$ |
| 1 | $2 < 5$ sí | $\langle 9, 4, 5, 2 \rangle$ | $\langle 7 \rangle$ |
| 2 | $9 < 5$ no | $\langle 4, 5, 2 \rangle$ | $\langle 7, 9 \rangle$ |
| 3 | $4 < 5$ sí | $\langle 5, 2, 4 \rangle$ | $\langle 7, 9 \rangle$ |
| 4 | $5 < 5$ no | $\langle 2, 4 \rangle$ | $\langle 7, 9, 5 \rangle$ |
| fin | vaciar `mayores` | $\langle 2, 4, 7, 9, 5 \rangle$ | $\langle\,\rangle$ |

```text
 7 2 9 4 5
 2 4 7 9 5
tamano: 5
```

Si el ciclo usara `!c.vacia()` en vez de $i < n$, los menores que vuelven a
entrar se procesarían otra vez y el ciclo no terminaría. Cada grupo conserva
su orden porque la cola es FIFO: es la poscondición de `encolar` aplicada $n$
veces. **Costo**: $\Theta(n)$ en tiempo, una vuelta completa más el vaciado de
`mayores`, todo con operaciones de $O(1)$; $O(n)$ de espacio para la auxiliar,
que en el peor caso —todos $\geq v$— recibe los $n$ elementos.

## Los tres contratos, juntos

| | Lista | Pila | Cola |
|---|---|---|---|
| entra por | cualquier $p$ | el tope | el final |
| sale por | cualquier $p$ | el tope | el frente |
| se lee | cualquier $p$ | solo el tope | solo el frente |
| recorrer | $p$ de 0 a $n - 1$ | vaciar y rehacer | dar la vuelta |
| precondición típica | $0 \leq p < n$ | $n > 0$ | $n > 0$ |
| costo de entrar y salir | $O(1)$ al final, $O(n)$ en medio | $O(1)$ | $O(1)$ |
| espacio | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |

Todo lo que hace una pila o una cola se puede hacer con una lista. Se escogen
igual porque prometen menos: quien las lee sabe de inmediato en qué orden
salen las cosas, y quien las implementa puede cobrar cada operación a costo
constante. Mirar sin destruir tiene precio en la pila —una auxiliar y dos
pasadas— y no lo tiene en la cola: dar la vuelta.

La biblioteca estándar de C++ trae los tres contratos ya implementados, con
otros nombres:

| Hoy | En la STL | Contenedor |
|---|---|---|
| `agregar`, `insertar`, `eliminar` | `push_back`, `insert`, `erase` | `vector`, `list` |
| `obtener`, `asignar` | `at`, `operator[]` | `vector` |
| `apilar`, `desapilar`, `tope` | `push`, `pop`, `top` | `stack` |
| `encolar`, `desencolar`, `frente` | `push`, `pop`, `front` | `queue` |
| `tamano`, `vacia` | `size`, `empty` | todos |

`pop` en la STL tampoco devuelve el valor. La decisión de contrato es la
misma.

## Ejercicios de la sesión

El último tramo de la sesión se fue en las actividades interactivas de la
página de ejercicios, resueltas en conjunto y trazadas en el tablero: una
secuencia de `apilar`, `desapilar` y `tope`; `contar` cuántas veces aparece un
valor en una pila dejándola como estaba, con el detalle de qué queda si se
olvida el ciclo que la restaura; y una secuencia de `encolar`, `desencolar` y
`frente`. Las trazas están en la actividad, para volver a hacerlas.

## Para practicar en casa

### Propuesto 1

Escribir $\texttt{convertir}(n)$, que recibe un entero no negativo y devuelve
la lista de sus dígitos de izquierda a derecha:
$\texttt{convertir}(305) = \langle 3, 0, 5 \rangle$. Hacerlo de dos maneras,
con `insertar` al frente y con `agregar` más `revertir`, y decir cuál hace
menos llamadas.

### Propuesto 2

Con una pila, decidir si una cadena de `(`, `)`, `[` y `]` está bien
balanceada: `([])()` sí, `([)]` no. Escribir primero, en palabras, qué se
apila y qué se desapila (Thareja, capítulo 7).

### Propuesto 3

Escribir `encolar`, `desencolar` y `frente` usando solamente dos pilas y su
contrato. Trazar con $\langle 7, 2, 9 \rangle$ y un `desencolar` en la mitad.

### Propuesto 4

Escribir $\texttt{contar}(p, x)$, cuántas veces aparece $x$ en la pila,
dejándola como estaba.

### Pistas

- **Propuesto 1**: los dígitos salen de derecha a izquierda con `% 10` y
  `/ 10`. Con `insertar(0, ·)` cada dígito corre los anteriores; con `agregar`
  quedan al revés y `revertir` los ordena en una pasada más.
- **Propuesto 2**: se apila cada apertura; cada cierre debe casar con el tope.
  Al final la pila tiene que estar vacía.
- **Propuesto 3**: una pila invierte el orden y dos lo restauran. Lo que
  entra se apila en una; cuando hace falta el frente y la otra está vacía, se
  pasa todo.
- **Propuesto 4**: es la traza de *contar sin destruir* de arriba: una
  auxiliar, un contador y dos ciclos.

## Ejercicios interactivos

Cinco actividades de esta sesión se trabajan en el navegador, una por tema:
las disciplinas de acceso, las operaciones de la lista y `intercalar`, la pila
con `contar` sin destruirla, la cola con `rotar` y el `frente` vacío, y los
tres contratos juntos con sus cuentas de costo:
[página de ejercicios interactivos](./Ejercicios.md). Los programas no son
los de arriba: mismo tema, ronda nueva.

## Código de la clase

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

Los tres contratos, con su implementación provisional, viven en cabeceras que
cada programa incluye:

- [lista.h](codigo/lista.h) — el TAD Lista sobre un arreglo y un contador
- [pila.h](codigo/pila.h) — el TAD Pila, con el `assert` de `desapilar` y
  `tope`
- [cola.h](codigo/cola.h) — el TAD Cola sobre un arreglo circular

**TAD Lista**

- [lista_contrato.cpp](codigo/lista_contrato.cpp) — las operaciones una por
  una, con `imprimir`
- [lista_uso.cpp](codigo/lista_uso.cpp) — `mezclar` y `revertir`

**TAD Pila**

- [pila_precondicion.cpp](codigo/pila_precondicion.cpp) — el `desapilar` de
  más y el `assert` que lo detiene
- [pila_uso.cpp](codigo/pila_uso.cpp) — las dos versiones de `imprimir` y
  `eliminarDesdeTope`

**TAD Cola**

- [cola_uso.cpp](codigo/cola_uso.cpp) — `imprimir` dando la vuelta y
  `particionar`

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 2 (tipos abstractos de datos), capítulo 7 (pilas), capítulo 8
  (colas).
- N. Kalicharan. *Data Structures in C*. 2008. Capítulo 4 (pilas y colas).
- R. Sebesta. *Concepts of Programming Languages*. Pearson, 2015. Capítulo 11
  (tipos abstractos de datos).
