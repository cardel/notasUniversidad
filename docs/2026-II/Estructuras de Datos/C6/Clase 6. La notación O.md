# Clase 6. La notación O

Miércoles 26 de agosto de 2026.

La sesión pagó la promesa que dejaron los ejercicios de conteo: la
definición precisa de ``crece a lo sumo como''. Al final de la clase el
objetivo era poder enunciar la definición de la notación $O$, demostrar
que un costo $T(n)$ pertenece a un $O(g(n))$ exhibiendo testigos $c$ y
$k$ con la estructura de cuatro partes, refutar una pertenencia falsa
por contradicción, y clasificar los costos de las semanas de conteo con
justificación. En Árboles y Grafos este tema se retoma con mayor
profundidad —las notaciones son tres, $O$, $\Theta$ y $\Omega$—; en
este curso el vocabulario de trabajo es $O$.

## Diapositivas

![](clase06.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El punto de partida

La cosecha de las clases de conteo, en una tabla:

| Función | $T$ | Término que manda |
|---|---|---|
| `paso_grande` | a lo sumo 28 | constante |
| `mitades` | $3\lfloor\log_2 n\rfloor + 7$ | $\log_2 n$ |
| `promedio` | $3n + 4$ | $n$ |
| `prefijos` | $\frac{3n^2+11n}{2} + 4$ | $n^2$ |
| `tercetos` | cerca de $\frac{n^3}{6}$ | $n^3$ |

Las fórmulas completas dicen el costo exacto, pero comparar con ellas
es un complique: entre $3n + 6$, $5n - 6$ y $3n^2 - 2n$, ¿cuál crece
más? Lo que decide la comparación es el término más alto, y la
notación $O$ es la forma precisa de quedarse solo con él.

Dos condiciones acompañan todo lo que sigue. Un costo computacional
nunca es negativo —una complejidad negativa no tiene sentido—, así que
las funciones que se comparan son no negativas, y el término que manda
lleva coeficiente estrictamente positivo.

## El experimento: un punto de corte

Antes de la definición, un tanteo. ¿Quién crece más, $3n + 4$ o $n^2$?

| $n$ | $3n + 4$ | $n^2$ |
|---:|---:|---:|
| 1 | 7 | 1 |
| 2 | 10 | 4 |
| 3 | 13 | 9 |
| 4 | 16 | 16 |
| 5 | 19 | 25 |

Al principio $n^2$ pierde, pero en $n = 4$ empata y de ahí en adelante
gana siempre. La razón se ve con la derivada: la razón de cambio de
$3n + 4$ es 3, fija, mientras que la de $n^2$ es $2n$ y crece con la
entrada. Es un vehículo a velocidad constante contra uno que acelera:
el que acelera termina pasando adelante, sin importar la ventaja
inicial.

De aquí salen las dos piezas de la definición:

- **La comparación honesta es de un punto en adelante.** Ese punto de
  corte se llama $k$; lo que pase a la izquierda de $k$ no cuenta,
  porque el interés es el crecimiento hacia el infinito.
- **Falta un permiso de escala.** Comparar $3n + 4$ contra $n$ a secas
  no funciona ni con un $k$ gigante: $3n + 4$ siempre está por encima
  de $n$. Pero si se permite multiplicar por una constante $c$, la
  cuenta cierra.

## La definición

Sean $T(n)$ y $g(n)$ funciones no negativas. Se dice que
$T(n) \in O(g(n))$ si existen constantes $c > 0$ y $k > 0$ tales que

$$T(n) \leq c \cdot g(n) \qquad \text{para todo } n \geq k.$$

Las constantes $c$ y $k$ son los **testigos** de la pertenencia: $c$
es el permiso de escala y $k$ el punto de arranque. En CLRS (sección
3.1) el punto de arranque se escribe $n_0$; en el curso se llama $k$.

La notación $O$ es un **techo asintótico**: desde $k$ hacia el
infinito, $c \cdot g(n)$ queda por encima de $T(n)$. A la izquierda de
$k$ puede pasar cualquier cosa y no importa. En la gráfica de la
clase, $7n$ contra $3n + 4$: desde $n = 1$ la recta $7n$ tapa a la
otra y no la suelta más.

Demostrar que $T(n) \in O(g(n))$ es exhibir una pareja de testigos que
funcione, con la estructura de cuatro partes de siempre: teorema,
estrategia, desarrollo y conclusión con los testigos.

## La primera demostración

**Teorema.** $3n + 4 \in O(n)$.

**Demostración.** Se procede de forma directa, inflando el término
menor.

**Desarrollo.** Para todo $n \geq 1$ se cumple que $4 \leq 4n$.
Entonces

$$3n + 4 \;\leq\; 3n + 4n \;=\; 7n.$$

**Conclusión.** Por lo tanto, se puede concluir que $3n + 4 \in O(n)$,
con testigos $c = 7$ y $k = 1$. $\blacksquare$

La comprobación de la desigualdad, tabulando:

| $n$ | $3n + 4$ | $7n$ |
|---:|---:|---:|
| 1 | 7 | 7 |
| 2 | 10 | 14 |
| 10 | 34 | 70 |

Como las dos son crecientes, la desigualdad que arranca en $k = 1$ ya
no se rompe.

## Los testigos no son únicos

¿Sirve otra pareja? Depende de cuál.

**Con $c = 3$ no hay $k$ que salve.** La desigualdad exigiría
$3n + 4 \leq 3n$, es decir $4 \leq 0$: un absurdo. El permiso de
escala tiene que superar al coeficiente del término que manda.

**Con $c = 4$ sirve, pero el arranque se corre.** De
$3n + 4 \leq 4n$ sale $4 \leq n$: la desigualdad se cumple desde
$n = 4$. La tabla lo confirma:

| $n$ | $3n + 4$ | $4n$ | ¿Cumple? |
|---:|---:|---:|---|
| 3 | 13 | 12 | no |
| 4 | 16 | 16 | sí |
| 5 | 19 | 20 | sí |
| 6 | 22 | 24 | sí |

Con $c = 4$ los testigos son $c = 4$ y $k = 4$. La moraleja: los
testigos no son únicos; cualquier pareja que cumpla la desigualdad
desde su $k$ hacia el infinito demuestra la pertenencia. Un $c$ más
holgado permite un $k$ más temprano, y al revés.

## El ejercicio del chat: $5n + 5$

El primer ejercicio en vivo: demostrar que $5n + 5 \in O(n)$. Un
camino trabajado en clase: proponer $c = 8$ y despejar el $k$. De
$5n + 5 \leq 8n$ sale $5 \leq 3n$, es decir $n \geq \frac{5}{3}
\approx 1.7$, así que $k = 2$ funciona:

| $n$ | $5n + 5$ | $8n$ | ¿Cumple? |
|---:|---:|---:|---|
| 1 | 10 | 8 | no |
| 2 | 15 | 16 | sí |
| 3 | 20 | 24 | sí |
| 4 | 25 | 32 | sí |

Testigos: $c = 8$ y $k = 2$. La demostración por inflado da otra
pareja igual de válida: para $n \geq 1$, $5 \leq 5n$ y entonces
$5n + 5 \leq 10n$, con testigos $c = 10$ y $k = 1$.

En general hay dos caminos, y los dos aparecieron durante la clase con
$7n + 3$:

- **Fijar $c$ y despejar $k$.** Con $c = 10$: de $7n + 3 \leq 10n$
  sale $3 \leq 3n$, es decir $n \geq 1$, y los testigos son $c = 10$,
  $k = 1$.
- **Fijar $k$ y despejar $c$.** Con $k = 1$: evaluando la desigualdad
  en $n = 1$ queda $7 + 3 \leq c$, así que cualquier $c \geq 10$
  funciona.

## Un cuadrático completo: el costo de `prefijos`

El costo contado para `prefijos` fue
$T(n) = \frac{3n^2 + 11n}{2} + 4$.

**Teorema.** $\dfrac{3n^2 + 11n}{2} + 4 \in O(n^2)$.

**Demostración.** Se procede de forma directa, inflando cada término
hasta $n^2$.

**Desarrollo.** Para todo $n \geq 1$ se cumple que $n \leq n^2$ y que
$1 \leq n^2$. Entonces

$$\frac{3n^2 + 11n}{2} + 4
= \frac{3}{2}\,n^2 + \frac{11}{2}\,n + 4
\;\leq\; \frac{3}{2}\,n^2 + \frac{11}{2}\,n^2 + 4n^2
\;=\; 11n^2.$$

**Conclusión.** Por lo tanto, se puede concluir que
$\frac{3n^2 + 11n}{2} + 4 \in O(n^2)$, con testigos $c = 11$ y
$k = 1$. $\blacksquare$

El mismo resultado sale por el otro camino: fijando $k = 1$ y
evaluando en $n = 1$ queda $\frac{3}{2} + \frac{11}{2} + 4 = 11 \leq
c$. Y la comprobación tabulada:

| $n$ | $\frac{3n^2+11n}{2} + 4$ | $11n^2$ |
|---:|---:|---:|
| 1 | 11 | 11 |
| 2 | 21 | 44 |
| 3 | 34 | 99 |

### El teorema del polinomio

El inflado término a término funciona con cualquier polinomio, y eso
da un atajo general. Si

$$T(n) = a_d\,n^d + a_{d-1}\,n^{d-1} + \cdots + a_1\,n + a_0$$

con todos los coeficientes no negativos y $a_d > 0$, entonces
$T(n) \in O(n^d)$: para $n \geq 1$ cada $n^i$ con $i \leq d$ cumple
$n^i \leq n^d$, cada término se infla hasta $a_i\,n^d$, y

$$T(n) \;\leq\; (a_d + a_{d-1} + \cdots + a_0)\,n^d.$$

Los testigos son $c = a_d + \cdots + a_0$ —la suma de los
coeficientes— y $k = 1$. Aplicado a `prefijos`: $\frac{3}{2} +
\frac{11}{2} + 4 = 11$, el mismo $c$ de la demostración. La regla
informal ``el término que manda decide'' dejó de ser un lema de uso:
es un teorema con testigos.

## El logaritmo entra

El costo contado para `mitades` fue
$T(n) = 3\lfloor\log_2 n\rfloor + 7$.

Aquí el punto de arranque exige cuidado: en $n = 1$ el logaritmo vale
0, la desigualdad pediría $7 \leq c \cdot 0 = 0$ y eso es falso. El
arranque tiene que ser $k = 2$, donde $\log_2 n$ ya vale 1.

**Teorema.** $3\lfloor\log_2 n\rfloor + 7 \in O(\log n)$.

**Demostración.** Se procede de forma directa, inflando el término
constante.

**Desarrollo.** Para todo $n \geq 2$ se cumple que $1 \leq \log_2 n$,
y por lo tanto $7 \leq 7\log_2 n$. Además
$3\lfloor\log_2 n\rfloor \leq 3\log_2 n$. Entonces

$$3\lfloor\log_2 n\rfloor + 7 \;\leq\; 3\log_2 n + 7\log_2 n
\;=\; 10\log_2 n.$$

**Conclusión.** Por lo tanto, se puede concluir que
$3\lfloor\log_2 n\rfloor + 7 \in O(\log n)$, con testigos $c = 10$ y
$k = 2$. $\blacksquare$

La clase se escribe $O(\log n)$, sin base. La razón es el cambio de
base: $\log_a n = \frac{\log_b n}{\log_b a}$, y $\frac{1}{\log_b a}$
es una constante que el permiso de escala $c$ absorbe. Base 2, base 5
o base 10 describen el mismo ritmo.

## Refutar también se demuestra: $n^2 \notin O(n)$

La notación también dice que no. Que $3n + 4 \in O(n^2)$ es cierto
—sirven $c = 1$ y $k = 4$—, pero al revés no hay manera, y eso se
demuestra.

**Teorema.** $n^2 \notin O(n)$.

**Demostración.** Se procede por contradicción.

**Desarrollo.** Suponga que existen testigos $c > 0$ y $k > 0$ tales
que $n^2 \leq c \cdot n$ para todo $n \geq k$. Como $n$ es positivo,
se puede dividir la desigualdad entre $n$, y queda

$$n \leq c \qquad \text{para todo } n \geq k.$$

Pero $n$ crece sin límite. Tome $n = k + c$: cumple $n \geq k$, así
que la desigualdad obliga $n \leq c$; y a la vez $n = k + c > c$,
porque $k$ es positivo. Entonces $n \leq c$ y $n > c$ al mismo tiempo:
una contradicción.

**Conclusión.** La contradicción muestra que los testigos supuestos no
existen. Por lo tanto, se puede concluir que $n^2 \notin O(n)$.
$\blacksquare$

Ninguna constante alcanza a una función que crece más rápido: por
grande que sea $c$, la recta $c \cdot n$ queda atrás.

## La escalera de clases

Cada notación $O$ describe un **conjunto de funciones**: $O(1)$ agrupa
las constantes; $O(\log n)$ las logarítmicas y también las constantes;
$O(n)$ las lineales y todo lo de abajo. Por eso la pertenencia se
escribe con $\in$ y las clases se encadenan con contenciones
estrictas:

$$O(1) \;\subset\; O(\log n) \;\subset\; O(n) \;\subset\; O(n^2)
\;\subset\; O(n^3).$$

Cada peldaño contiene al anterior, y subir un peldaño es genuinamente
crecer más. Las diferencias, en operaciones:

| $n$ | $\log_2 n$ | $n$ | $n^2$ | $n^3$ |
|---:|---:|---:|---:|---:|
| $10$ | $\approx 3$ | $10$ | $100$ | $1000$ |
| $10^3$ | $\approx 10$ | $10^3$ | $10^6$ | $10^9$ |
| $10^6$ | $\approx 20$ | $10^6$ | $10^{12}$ | $10^{18}$ |

Y en segundos de máquina. Con un equipo que ejecuta cerca de $10^9$
operaciones por segundo y una entrada de $10^6$ datos:

| Clase | Operaciones | Tiempo |
|---|---:|---|
| $O(\log n)$ | $\approx 20$ | instantáneo |
| $O(n)$ | $10^6$ | 1 milisegundo |
| $O(n^2)$ | $10^{12}$ | cerca de 17 minutos |
| $O(n^3)$ | $10^{18}$ | más de 30 años |

La conclusión no es comprar una máquina más rápida: la máquina no es
lo más importante, el algoritmo sí. En la arena esta tabla tiene un
veredicto con nombre propio: *time limit exceeded* casi siempre
significa que la solución vive un peldaño más arriba de lo que el
problema tolera.

El resto del curso consiste en elegir estructuras de datos que bajen
peldaños: esa elección determina si un problema se resuelve rápido o
no se resuelve. El diseño de algoritmos como tema propio queda para
Árboles y Grafos y para Algoritmos; aquí la pregunta de cada
implementación va a ser por qué una estructura de datos es la
apropiada.

## Ejercicios de cierre

Tres pertenencias trabajadas en vivo al final de la sesión.

### $2n + 10 \in O(n)$

Fijando $k = 1$ y evaluando: $2 + 10 \leq c$, así que $c = 12$
funciona.

| $n$ | $2n + 10$ | $12n$ |
|---:|---:|---:|
| 1 | 12 | 12 |
| 2 | 14 | 24 |
| 3 | 16 | 36 |

Testigos: $c = 12$ y $k = 1$.

### $4n + 7 \in O(n)$

Con el truco del polinomio: los coeficientes son no negativos, así que
$c$ es su suma, $4 + 7 = 11$, y $k = 1$. La verificación en $n = 1$:
$11 \leq 11$.

### $\dfrac{n^2}{2} - \dfrac{n}{2} \in O(n^2)$

Aquí hay una resta, y el truco de sumar coeficientes no aplica: pide
coeficientes no negativos. Pero un término que resta solo ayuda a la
desigualdad, así que se descarta:

$$\frac{n^2}{2} - \frac{n}{2} \;\leq\; \frac{n^2}{2} \;\leq\; n^2
\qquad \text{para todo } n \geq 1,$$

y los testigos son $c = 1$ y $k = 1$. La comprobación resolviendo la
desigualdad completa llega a lo mismo: $\frac{n^2}{2} - \frac{n}{2}
\leq n^2$ equivale, dividiendo entre $n$ positivo, a $\frac{n}{2} -
\frac{1}{2} \leq n$, es decir $n \geq -1$, que se cumple para todo
$n$ positivo.

## Para practicar en casa

### Propuesto 1

Demuestre con testigos que
$7\left\lceil \frac{n}{2} \right\rceil + 4 \in O(n)$. Es el costo ya
contado de `de_dos_en_dos`, con otra constante. Pista: para $n \geq
1$, $\lceil n/2 \rceil \leq n$.

### Propuesto 2

Demuestre que $5n^2 + 3n \notin O(n)$. Pista: la misma contradicción
de $n^2 \notin O(n)$; después de dividir entre $n$, busque el valor de
$n$ que rompe la desigualdad.

### Propuesto 3

Para $3n + 4 \in O(n)$ con $c = 4$, encuentre el menor $k$ que
funciona y justifique con la desigualdad, no solo con la tabla.

!!! note "Tarea 1"

    La Tarea 1 se presenta el miércoles 2 de septiembre y cierra el
    lunes 14 de septiembre a las 23:59 en la arena.

## Ejercicios interactivos

Dos actividades de esta sesión se pueden trabajar en el navegador: la
caza de parejas de testigos para $3n + 4$ y $5n + 5$, y la
clasificación de costos en la escalera de clases:
[página de ejercicios interactivos](./Ejercicios.md).

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction
  to Algorithms*. 4.ª ed., MIT Press, 2022. Secciones 3.1 y 3.2.
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 2.
