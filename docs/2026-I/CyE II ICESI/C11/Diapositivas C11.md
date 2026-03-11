
### Contenido
:::

# Objetivos terminales

::::: frame
Objetivos terminales

::: block
OT2 Aplicar el principio de inducción matemática para definir
estructuras discretas, demostrar sus propiedades y verificar algoritmos
formalmente, en particular, establecer y resolver relaciones de
recurrencia asociadas a la complejidad de dichos algoritmos.
:::

::: block
OT4 Expresar o comunicar con el vocabulario y lenguaje
adecuado/especializado las ideas principales sobre estructuras discretas
o la programación funcional.
:::
:::::

# Repaso de recursividad

::::: frame
Recursividad: Definición matemática

::: block
Definición Una **función recursiva** es aquella que se define en
términos de sí misma. Consta de dos partes esenciales:

-   **Caso base:** Valor conocido que detiene la recursión.

-   **Caso recursivo:** Definición que reduce el problema hacia el caso
    base.
:::

::: block
Notación formal $$f(n) = \begin{cases}
\text{valor conocido} & \text{si } n \text{ cumple condici\'{o}n base} \\
g(n, f(\ldots)) & \text{en otro caso}
\end{cases}$$ donde la expresión en el caso recursivo debe **converger**
hacia la condición base.
:::
:::::

:::::: frame
Ejemplos matemáticos clásicos

::: exampleblock
Factorial $$F(n) = \begin{cases}
1 & \text{si } n = 0 \\
n \cdot F(n-1) & \text{si } n > 0
\end{cases}$$
:::

::: exampleblock
Sumatoria $$H(n) = \sum_{k=0}^{n} a_k = \begin{cases}
a_0 & \text{si } n = 0 \\
H(n-1) + a_n & \text{si } n > 0
\end{cases}$$
:::

::: exampleblock
Fibonacci $$fib(n) = \begin{cases}
0 & \text{si } n = 0 \\
1 & \text{si } n = 1 \\
fib(n-1) + fib(n-2) & \text{si } n > 1
\end{cases}$$
:::
::::::

:::::: frame
Recursividad en Scala

::: block
Factorial en Scala

``` {.scala fontsize="\\small" bgcolor="grisclaro"}
def factorial(n: Int): Int =
  if (n == 0) 1              // Caso base
  else n * factorial(n - 1)  // Caso recursivo
```
:::

::: block
Fibonacci en Scala

``` {.scala fontsize="\\small" bgcolor="grisclaro"}
def fib(n: Int): Int =
  if (n == 0) 0              // Caso base 1
  else if (n == 1) 1         // Caso base 2
  else fib(n - 1) + fib(n - 2) // Caso recursivo
```
:::

::: alertblock
Recordar Sin `return`, `break` ni `continue`. La última expresión
evaluada es el valor de retorno.
:::
::::::

:::::: frame
Conjuntos definidos recursivamente

::: block
Definición inductiva de un conjunto Un conjunto $S$ se define
recursivamente mediante:

1.  **Paso base:** Elemento(s) que pertenecen a $S$.

2.  **Paso recursivo:** Regla(s) que generan nuevos elementos a partir
    de los existentes.
:::

::: exampleblock
Ejemplo: Múltiplos de 3

-   Paso base: $3 \in S$

-   Paso recursivo: Si $x \in S$ y $y \in S$, entonces $x + y \in S$

Así:
$S = \{3\} \to \{3, 6\} \to \{3, 6, 9\} \to \{3, 6, 9, 12\} \to \cdots$
:::

::: exampleblock
Ejemplo: Listas de números naturales

-   Paso base: $Nil \in S$ (lista vacía)

-   Paso recursivo: Si $x \in \mathbb{N}$ y $l \in S$, entonces
    $x :: l \in S$
:::
::::::

# Inducción estructural

::::: frame
Inducción estructural: Concepto

::: block
Definición (Rosen, Sección 5.3) La **inducción estructural** es una
forma particular de inducción matemática utilizada para demostrar
propiedades sobre **conjuntos definidos recursivamente**.
:::

::: block
Idea clave Así como la inducción matemática clásica recorre los números
naturales ($n \to n+1$), la inducción estructural recorre la
**estructura** del objeto: se demuestra la propiedad para los elementos
base, y luego se muestra que se preserva al aplicar las reglas de
construcción.
:::
:::::

::::: frame
Método formal

::: block
Inducción estructural: Esquema de demostración Sea $S$ un conjunto
definido recursivamente y $P$ una propiedad sobre los elementos de $S$.

**Paso base:** Demostrar que $P(s)$ es verdadera para cada elemento $s$
especificado en el paso base de la definición de $S$.

**Paso recursivo (inductivo):** Para cada regla de construcción del
conjunto $S$, suponer que $P$ es verdadera para los elementos usados en
la regla (**hipótesis inductiva**), y demostrar que $P$ también es
verdadera para el nuevo elemento generado.
:::

::: block
Conclusión
$$\Big[P(\text{bases}) \;\wedge\; \forall x \in S\;\big(P(\text{componentes de } x) \to P(x)\big)\Big] \;\to\; \forall s \in S,\; P(s)$$
:::
:::::

:::::: frame
Ejemplo: Longitud de concatenación de cadenas

::: exampleblock
Definición recursiva de cadena sobre un alfabeto $\Sigma$

-   Paso base: La cadena vacía $\lambda$ es una cadena
    ($\lambda \in \Sigma^*$).

-   Paso recursivo: Si $C$ es una cadena y $c \in \Sigma$, entonces
    $c \cdot C$ es una cadena.
:::

::: exampleblock
Definición recursiva de longitud $l$

-   $l(\lambda) = 0$

-   $l(c \cdot C) = 1 + l(C)$ para $c \in \Sigma$, $C \in \Sigma^*$
:::

::: block
Propiedad a demostrar Para todo $x, y \in \Sigma^*$:
$l(xy) = l(x) + l(y)$
:::

Hacemos inducción estructural sobre $y$. Sea $P(y)$:
"$l(xy) = l(x) + l(y)$ para todo $x \in \Sigma^*$".

**Paso base** ($y = \lambda$):

$l(x\lambda) = l(x) = l(x) + 0 = l(x) + l(\lambda)$. $\checkmark$

**Paso recursivo** ($y \to ya$ con $a \in \Sigma$):

Suponemos $P(y)$: $l(xy) = l(x) + l(y)$ (hipótesis inductiva).

Debemos demostrar $P(ya)$: $l(x(ya)) = l(x) + l(ya)$.

$l(x(ya)) = l((xy)a) = l(xy) + 1 = [l(x) + l(y)] + 1 = l(x) + [l(y) + 1] = l(x) + l(ya)$.
$\checkmark$
::::::

:::::: frame
Inducción estructural en Scala: Listas

::: block
Definición recursiva de `List[Int]` en Scala

-   Paso base: `Nil` (lista vacía)

-   Paso recursivo: `head :: tail` donde `head: Int` y `tail: List[Int]`
:::

::: block
Suma de una lista

``` {.scala fontsize="\\small" bgcolor="grisclaro"}
def sumarLista(lst: List[Int]): Int =
  if (lst.isEmpty) 0
  else lst.head + sumarLista(lst.tail)
```
:::

::: block
Traza de ejecución

``` {.text fontsize="\\scriptsize" bgcolor="grisclaro"}
sumarLista(List(1,2,3))
= 1 + sumarLista(List(2,3))
= 1 + 2 + sumarLista(List(3))
= 1 + 2 + 3 + sumarLista(Nil)
= 1 + 2 + 3 + 0 = 6
```
:::
::::::

::::: frame
Más algoritmos sobre listas

::: block
Longitud de una lista

``` {.scala fontsize="\\small" bgcolor="grisclaro"}
def longitud(lst: List[Int]): Int =
  if (lst.isEmpty) 0
  else 1 + longitud(lst.tail)
```
:::

::: block
Invertir una lista (con auxiliar)

``` {.scala fontsize="\\small" bgcolor="grisclaro"}
def invertirAux(n: Int, lst: List[Int]): List[Int] =
  if (lst.isEmpty) List(n)
  else lst.head :: invertirAux(n, lst.tail)

def invertir(lst: List[Int]): List[Int] =
  if (lst.isEmpty) List()
  else invertirAux(lst.head, invertir(lst.tail))
```
:::
:::::

::::: frame
Ordenar por inserción

::: block
Insertion sort recursivo

``` {.scala fontsize="\\small" bgcolor="grisclaro"}
def insertarOrdenado(n: Int, lst: List[Int]): List[Int] =
  if (lst.isEmpty) List(n)
  else {
    if (lst.head < n)
      lst.head :: insertarOrdenado(n, lst.tail)
    else n :: lst
  }

def ordenar(lst: List[Int]): List[Int] =
  if (lst.isEmpty) List()
  else insertarOrdenado(lst.head, ordenar(lst.tail))
```
:::

::: exampleblock
Receta de diseño para listas

1.  **Caso base:** Lista vacía $\to$ respuesta inmediata.

2.  **Caso recursivo:** Procesar `head`, llamar recursivamente con
    `tail`.
:::
:::::

:::: frame
Ejemplo: Propiedad de `longitud` y `++`

::: block
Propiedad a demostrar por inducción estructural Para toda lista
$l_1, l_2$:
$\texttt{longitud}(l_1 \texttt{++}\; l_2) = \texttt{longitud}(l_1) + \texttt{longitud}(l_2)$
:::

Inducción sobre la estructura de $l_1$.

**Paso base** ($l_1 = Nil$):

$\texttt{longitud}(Nil \texttt{++}\; l_2) = \texttt{longitud}(l_2) = 0 + \texttt{longitud}(l_2)$.
$\checkmark$

**Paso recursivo** ($l_1 = h :: t$):

Hipótesis inductiva:
$\texttt{longitud}(t \texttt{++}\; l_2) = \texttt{longitud}(t) + \texttt{longitud}(l_2)$.

Debemos demostrar:
$\texttt{longitud}((h :: t) \texttt{++}\; l_2) = \texttt{longitud}(h :: t) + \texttt{longitud}(l_2)$.

$$\begin{aligned}
\texttt{longitud}((h :: t) \texttt{++}\; l_2)
&= \texttt{longitud}(h :: (t \texttt{++}\; l_2)) \\
&= 1 + \texttt{longitud}(t \texttt{++}\; l_2) \\
&= 1 + \texttt{longitud}(t) + \texttt{longitud}(l_2) \\
&= \texttt{longitud}(h :: t) + \texttt{longitud}(l_2) \quad \checkmark
\end{aligned}$$
::::

:::: frame
Otro ejemplo: Concatenar y sumar

::: block
Propiedad
$\texttt{sumarLista}(l_1 \texttt{++}\; l_2) = \texttt{sumarLista}(l_1) + \texttt{sumarLista}(l_2)$
:::

**Paso base** ($l_1 = Nil$):

$\texttt{sumarLista}(Nil \texttt{++}\; l_2) = \texttt{sumarLista}(l_2) = 0 + \texttt{sumarLista}(l_2)$.
$\checkmark$

**Paso recursivo** ($l_1 = h :: t$):

H.I.:
$\texttt{sumarLista}(t \texttt{++}\; l_2) = \texttt{sumarLista}(t) + \texttt{sumarLista}(l_2)$.

$$\begin{aligned}
\texttt{sumarLista}((h :: t) \texttt{++}\; l_2)
&= \texttt{sumarLista}(h :: (t \texttt{++}\; l_2)) \\
&= h + \texttt{sumarLista}(t \texttt{++}\; l_2) \\
&= h + \texttt{sumarLista}(t) + \texttt{sumarLista}(l_2) \\
&= \texttt{sumarLista}(h :: t) + \texttt{sumarLista}(l_2) \quad \checkmark
\end{aligned}$$
::::

# Inducción generalizada

::::: frame
Inducción generalizada: Concepto

::: block
Definición La **inducción generalizada** extiende el principio de
inducción matemática para demostrar propiedades sobre conjuntos que no
son necesariamente los enteros, siempre que se garantice la **propiedad
del buen orden**.
:::

::: block
Método

1.  Se define un **orden** sobre el dominio (por ejemplo, orden
    lexicográfico).

2.  **Paso base:** Se verifica la propiedad para el elemento mínimo del
    orden.

3.  **Paso inductivo:** Se supone que la propiedad vale para todos los
    elementos **menores** que $(m,n)$ en dicho orden, y se demuestra
    para $(m,n)$.
:::
:::::

:::::: frame
Orden lexicográfico

::: block
Definición El **orden lexicográfico** de $\mathbb{N} \times \mathbb{N}$
define un orden total para las parejas de enteros no negativos:

$$(x_1, y_1) \leq (x_2, y_2) \iff x_1 < x_2 \;\;\text{o}\;\; (x_1 = x_2 \;\text{y}\; y_1 \leq y_2)$$
:::

::: exampleblock
Ejemplo
$(0,0) < (0,1) < (0,2) < \cdots < (1,0) < (1,1) < (1,2) < \cdots < (2,0) < \cdots$
:::

::: alertblock
Propiedad del buen orden Todo subconjunto no vacío de
$\mathbb{N} \times \mathbb{N}$ con el orden lexicográfico tiene un
elemento mínimo. Esto valida el uso de inducción sobre este conjunto.
:::
::::::

::::: frame
Ejemplo: Inducción generalizada con $a_{m,n}$

::: exampleblock
Definición recursiva Sea $a_{m,n}$ definida para
$(m,n) \in \mathbb{N} \times \mathbb{N}$ por $a_{0,0} = 0$ y:
$$a_{m,n} = \begin{cases}
a_{m-1,n} + 1 & \text{si } n = 0 \text{ y } m > 0 \\
a_{m,n-1} + n & \text{si } n > 0
\end{cases}$$
:::

::: block
Propiedad a demostrar $a_{m,n} = m + \dfrac{n(n+1)}{2}$ para todo
$(m,n) \in \mathbb{N} \times \mathbb{N}$.
:::

**Paso base:** $(m,n) = (0,0)$.

Por definición: $a_{0,0} = 0$.

Por fórmula: $0 + \frac{0 \cdot 1}{2} = 0$. $\checkmark$

**Paso inductivo:** Supongamos que $a_{m',n'} = m' + \frac{n'(n'+1)}{2}$
para todo $(m',n')$ menor que $(m,n)$ en el orden lexicográfico.

**Caso $n = 0$, $m > 0$:**

$a_{m,0} = a_{m-1,0} + 1$. Como $(m-1, 0) < (m, 0)$, por H.I.:

$a_{m-1,0} = (m-1) + \frac{0 \cdot 1}{2} = m - 1$

$\Rightarrow a_{m,0} = (m-1) + 1 = m = m + \frac{0 \cdot 1}{2}$
$\checkmark$

**Caso $n > 0$:**

$a_{m,n} = a_{m,n-1} + n$. Como $(m, n-1) < (m, n)$, por H.I.:

$a_{m,n-1} = m + \frac{(n-1)n}{2}$

$$\begin{aligned}
a_{m,n} &= m + \frac{(n-1)n}{2} + n \\
        &= m + \frac{n^2 - n}{2} + \frac{2n}{2} \\
        &= m + \frac{n^2 - n + 2n}{2} \\
        &= m + \frac{n^2 + n}{2} \\
        &= m + \frac{n(n+1)}{2} \quad \checkmark
\end{aligned}$$
:::::

::::: frame
Otro ejemplo: Inducción generalizada

::: exampleblock
Definición recursiva Sea $b_{m,n}$ definida para
$(m,n) \in \mathbb{Z}^+ \times \mathbb{Z}^+$ por $b_{1,1} = 5$ y:
$$b_{m,n} = \begin{cases}
b_{m-1,n} + 2 & \text{si } n = 1 \text{ y } m > 1 \\
b_{m,n-1} + 2 & \text{si } n > 1
\end{cases}$$
:::

::: block
Propiedad a demostrar $b_{m,n} = 2(m+n) + 1$ para todo
$(m,n) \in \mathbb{Z}^+ \times \mathbb{Z}^+$.
:::

**Paso base:** $(m,n) = (1,1)$.

Por definición: $b_{1,1} = 5$.

Por fórmula: $2(1+1) + 1 = 5$. $\checkmark$

**Caso $n = 1$, $m > 1$:**

$b_{m,1} = b_{m-1,1} + 2$. Por H.I.:
$b_{m-1,1} = 2((m-1)+1) + 1 = 2m + 1$.

$\Rightarrow b_{m,1} = 2m + 1 + 2 = 2m + 3 = 2(m + 1) + 1$. $\checkmark$

**Caso $n > 1$:**

$b_{m,n} = b_{m,n-1} + 2$. Por H.I.:
$b_{m,n-1} = 2(m + (n-1)) + 1 = 2(m+n) - 1$.

$\Rightarrow b_{m,n} = 2(m+n) - 1 + 2 = 2(m+n) + 1$. $\checkmark$
:::::

# Ejercicios

:::::::: frame
Ejercicios del libro de Rosen (Sección 5.3)

::: block
Ejercicio 1 (Rosen 5.3 -- 18) Obtenga $f(2), f(3), f(4)$ y $f(5)$ si $f$
se define recursivamente por $f(0) = f(1) = 1$ y para
$n = 1, 2, \ldots$:

1.  $f(n+1) = f(n) - f(n-1)$

2.  $f(n+1) = f(n) \cdot f(n-1)$

3.  $f(n+1) = f(n)^2 + f(n-1)^3$

4.  $f(n+1) = f(n) / f(n-1)$

*Pista:* Evalúe paso a paso reemplazando los valores ya calculados.
Comience con $f(2) = g(f(1), f(0))$ y continúe.
:::

::: block
Ejercicio 2 (Rosen 5.3 -- 27) Dé una definición recursiva de las
funciones $\max$ y $\min$ de tal forma que $\max(a_1, a_2, \ldots, a_n)$
y $\min(a_1, a_2, \ldots, a_n)$ sean el máximo y el mínimo de los
valores, respectivamente.

*Pista:* Defina el caso base para $n=1$ y el caso recursivo comparando
$a_n$ con $\max(a_1, \ldots, a_{n-1})$.
:::

::: block
Ejercicio 3 (Rosen 5.3 -- 29) Dé una definición recursiva de la función
$a_n = 4n - 2$ para $n = 1, 2, 3, \ldots$

*Pista:* Busque una relación entre $a_{n+1}$ y $a_n$. Note que
$a_{n+1} - a_n = 4$.
:::

::: block
Ejercicio 4 (Rosen 5.3 -- 32) Demuestre por inducción estructural que el
número de paréntesis izquierdos en un **sistema de paréntesis
balanceados** es igual al número de paréntesis derechos.

*Pista:* Considere la definición recursiva de paréntesis balanceados: la
cadena vacía es balanceada, y si $w$ y $x$ son balanceadas, entonces
$(w)$ y $wx$ son balanceadas. Haga inducción sobre esta estructura.
:::

::: block
Ejercicio 5 (Rosen 5.3 -- 41) Utilice la inducción generalizada para
demostrar que si $a_{m,n}$ se define recursivamente por $a_{0,0} = 0$ y
$$a_{m,n} = \begin{cases}
a_{m-1,n} + 1 & \text{si } n = 0 \text{ y } m > 0 \\
a_{m,n-1} + 1 & \text{si } n > 0
\end{cases}$$ entonces $a_{m,n} = m + n$ para todo
$(m,n) \in \mathbb{N} \times \mathbb{N}$.

*Pista:* Siga el mismo esquema del ejemplo de $a_{m,n} = m + n(n+1)/2$.
Considere los dos casos del paso inductivo por separado.
:::
::::::::

:::::: frame
Ejercicio de inducción estructural con Scala

::: block
Problema Considere la siguiente función que duplica cada elemento de una
lista:

``` {.scala fontsize="\\small" bgcolor="grisclaro"}
def duplicar(lst: List[Int]): List[Int] =
  if (lst.isEmpty) Nil
  else (lst.head * 2) :: duplicar(lst.tail)
```

Y la función `sumarLista` definida anteriormente.
:::

::: alertblock
Propiedad a demostrar Para toda lista $l$:
$$\texttt{sumarLista}(\texttt{duplicar}(l)) = 2 \cdot \texttt{sumarLista}(l)$$
Demuestre esta propiedad por inducción estructural sobre $l$.
:::

::: exampleblock
Pistas

1.  **Paso base** ($l = Nil$): Evalúe ambos lados y verifique que son
    iguales.

2.  **Paso recursivo** ($l = h :: t$):

    -   Establezca la hipótesis inductiva:
        $\texttt{sumarLista}(\texttt{duplicar}(t)) = 2 \cdot \texttt{sumarLista}(t)$.

    -   Expanda $\texttt{duplicar}(h :: t)$ según la definición.

    -   Aplique $\texttt{sumarLista}$ al resultado.

    -   Use la H.I. y álgebra para concluir.
:::
::::::

::::: frame
Resumen

::: block
Conceptos clave de hoy

-   **Recursión:** Caso base + caso recursivo. Tanto en matemáticas como
    en Scala.

-   **Inducción estructural:** Demostración sobre conjuntos definidos
    recursivamente siguiendo su estructura (cadenas, listas, árboles).

-   **Inducción generalizada:** Extiende la inducción a dominios con
    buen orden (ej: $\mathbb{N} \times \mathbb{N}$ con orden
    lexicográfico).
:::

::: block
Lecturas sugeridas

-   Rosen, Capítulo 5, Secciones 5.3 y 5.4.

-   Cormen et al., Capítulo 4: Divide and Conquer (Apéndice sobre
    inducción).

-   Odersky et al., Capítulo 16: Working with Lists.
:::
:::::