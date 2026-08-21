# Invariantes de ciclo

**Grupo B — viernes 21 de agosto de 2026.** Sesión virtual, de 7 a 9.

El tema de hoy es probar que un algoritmo iterativo es correcto, y la
advertencia con la que abrió la clase vale como resumen: este tema no se
adquiere a la primera. Hay quien lo coge rápido, pero la experiencia de los
semestres pasados dice que requiere práctica, y por eso esta nota termina con
ejercicios interactivos, ejercicios resueltos y código para experimentar. La
recompensa es grande: un método para garantizar, sin correr el programa, que
un ciclo hace lo que promete.

## Diapositivas

Esta versión incluye lo que se anotó durante la clase, en las páginas donde
apareció.

![](clase02-invariantes.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## La especificación de un problema

Antes de demostrar nada hay que decir con precisión qué promete el algoritmo.
Esa promesa es la **especificación**, y tiene dos elementos:

- **Entrada**: los datos y las condiciones que deben cumplir. Son las
  **precondiciones**: lo que tiene que ser cierto para que el algoritmo se
  ejecute correctamente.
- **Salida**: la especificación formal del resultado. Son las
  **poscondiciones**: si la entrada cumplió su parte, esto es lo que el
  algoritmo entrega.

Una **instancia** del problema es una asignación de valores para la entrada
que cumple la precondición. Para el factorial, $n = 5$ es una instancia;
$n = -1$ no lo es. Y un algoritmo es **correcto** si calcula el resultado
correcto para *todas* las instancias, no para las que uno probó. Esa palabra,
todas, es la razón de que exista el método de hoy: ninguna cantidad de casos
de prueba la alcanza.

La especificación más corta del curso:

- **Entrada**: $N \in \mathbb{N}$.
- **Salida**: $N!$.

Sobre esa $\mathbb{N}$ salió el paréntesis matemático de la mañana: ¿el cero
es un número natural? Depende del área. En teoría de conjuntos sí, porque es
el tamaño del conjunto vacío, y esa es la convención del curso; en otras
ramas no lo incluyen. Somos seres humanos y en muchas cosas no nos ponemos de
acuerdo; esta es una de tantas. Aquí: naturales con cero.

El segundo ejemplo fue la búsqueda. Dado un arreglo de números y un valor,
decidir si el valor aparece:

- **Entrada**: un arreglo $A[0..N)$ de números y un número $v$.
- **Salida**: $\exists\, p \in [0..N).\; A[p] = v$.

Dos detalles de notación que van a aparecer todo el semestre. El rango
$[0..N)$ es *semiabierto*: incluye el 0 y excluye $N$, igual que los índices
válidos del arreglo, cuyo último es $N-1$. Y la salida es una fórmula lógica:
el algoritmo debe devolver verdadero exactamente cuando exista una posición
$p$ con $A[p] = v$.

El mismo problema admite variantes, y cada una cambia la especificación: la
búsqueda que entrega la posición devuelve $p$ si existe y $-1$ si no; la
búsqueda sobre un arreglo ordenado pide lo mismo que la primera pero la
entrada gana una precondición, el orden ascendente. En la tarea que viene y
en el examen, la especificación se escribe de esta manera, con la enunciación
formal de las entradas y las salidas.

Para demostrar la correctitud hay dos técnicas, una por familia de
algoritmos: la **inducción estructural** para los recursivos, que aparece con
divide y vencerás, y el **análisis de invariantes de ciclo** para los
iterativos, que es el tema de hoy.

## El estado: qué cambia y cómo evoluciona

El primer ciclo bajo la lupa suma un arreglo:

- **Entrada**: un arreglo $A[0..N)$ de números, $N \geq 0$.
- **Salida**: $\displaystyle\sum_{j=0}^{N-1} A[j]$.

```python
def sumarArreglo(A):
    i = 0
    ans = 0
    while i < len(A):
        ans = ans + A[i]
        i = i + 1
    return ans
```

A ojo se ve que suma. Pero *a ojo* no es un argumento, y el método arranca
con dos preguntas que quedaron escritas en la diapositiva anotada:

1. **¿Qué cambia dentro del ciclo?** Aquí cambian `i` y `ans`. Eso que cambia
   es el **estado**: la tupla $(i, \mathtt{ans})$ con los valores de las
   variables en un chequeo de la condición.
2. **¿Cómo evoluciona ese estado?** Se toma una instancia y se sigue la
   ejecución a mano, chequeo por chequeo.

Con $A = [9, 4, -5, 1, 8, 3]$:

| Chequeo | $(i, \mathtt{ans})$ | `ans` acumula |
|:---:|:---:|---|
| 1 | $(0, 0)$ | nada todavía |
| 2 | $(1, 9)$ | $A[0]$ |
| 3 | $(2, 13)$ | $A[0] + A[1]$ |
| 4 | $(3, 8)$ | $A[0] + A[1] + A[2]$ |
| 5 | $(4, 9)$ | $A[0] + \cdots + A[3]$ |
| 6 | $(5, 17)$ | $A[0] + \cdots + A[4]$ |
| 7 | $(6, 20)$ | $A[0] + \cdots + A[5]$ |

$(0, 0)$ es el **estado inicial** y $(6, 20)$ el **estado final**: cuando
$i$ llega a 6, que es `len(A)`, el ciclo se rompe y lo que se retorna es el
`ans` del estado final. Fíjense en el chequeo 4: entró el $-5$ y el
acumulador *bajó* de 13 a 8. La propiedad que estamos persiguiendo no es que
`ans` crezca; es que en cada fila `ans` lleve la suma de los primeros $i$
elementos. Eso lo cumplen todas las filas, incluida esa.

## La generalización: los dos invariantes

El ejemplo ayuda a entender, pero se les va a pedir siempre de forma general:
la meta es saber qué pasa con *cualquier* arreglo. La cadena general va de
$(0, 0)$ hasta $\bigl(N, \sum_{j=0}^{N-1} A[j]\bigr)$, y el patrón que la
tabla insinúa se escribe así: en el chequeo con índice $i$, el acumulador
lleva $\sum_{j=0}^{i-1} A[j]$. Si duda del patrón, haga una fila más: con
$i = 3$ van sumados $A[0]$, $A[1]$ y $A[2]$, es decir, hasta el anterior al
$i$. Ese es el corazón del asunto.

Un **invariante** es una propiedad sobre las variables que debe ser cierta a
lo largo de la ejecución del ciclo. Aquí hay dos, porque hay dos variables
que cambian:

$$I_0:\; 0 \leq i \leq N \qquad\qquad I_1:\; \mathtt{ans} = \sum_{j=0}^{i-1} A[j]$$

$I_0$ acota el índice: dice por dónde puede ir $i$. $I_1$ habla del
acumulador: dice qué lleva calculado `ans` en función de $i$. Ninguno sobra:
sin $I_1$ no se sabe qué calcula el ciclo, y sin $I_0$ no se sabe con qué
valor de $i$ termina. Si hubiera más variables cambiando, habría más
invariantes: $I_2$, $I_3$ y las que hagan falta, una por variable.

## El método

Para mostrar que los invariantes se cumplen se demuestran tres cosas:

1. La fórmula lógica es verdadera antes de la primera iteración
   (**inicialización**).
2. Si es cierta antes de cualquier iteración, sigue siendo cierta después de
   la iteración (**estabilidad**).
3. El ciclo debe terminar, y los invariantes deben suministrar información
   importante acerca del objetivo del ciclo y del algoritmo
   (**terminación**).

En CLRS (pp. 18--20) van a encontrar la estabilidad con el nombre de
*mantenimiento*. Es lo mismo con otro rótulo.

## La demostración completa: la suma

Una regla del curso antes de arrancar, porque se evalúa: en talleres y
exámenes, primero se enuncia el **teorema** y después se escribe la
**demostración**. Es un requerimiento de este curso y del curso de Análisis
de Algoritmos que viene después. Quien entregue la demostración sin enunciar
los teoremas pierde puntos, así de simple.

**Teorema 1.** Los invariantes $I_0$ e $I_1$ se cumplen.

*Demostración*: se procede mostrando la validez de los invariantes para la
inicialización, la estabilidad y la terminación.

**Inicialización.** El truco es mirar qué pasó justo antes de que el ciclo
arranque. Las líneas 1--2 dejan $i = 0$ y $\mathtt{ans} = 0$. Para $I_0$:
$0 \leq 0 \leq N$. ✓ Para $I_1$ hay que evaluar $\sum_{j=0}^{-1} A[j]$, una
sumatoria cuyo índice superior quedó por debajo del inferior: por convención
vale 0, porque el rango $[0..0)$ es vacío y no se está sumando nada. Y 0 es
justo lo que vale `ans`. ✓

**Estabilidad.** Se considera una iteración arbitraria $i = j$, distinta de
la última (de lo contrario el cuerpo no se habría ejecutado, así que
$j < N$), y se asume que antes de ella los invariantes valen:
$0 \leq j \leq N$ y $\mathtt{ans} = \sum_{j'=0}^{j-1} A[j']$.

Aquí salió la pregunta de la clase, y vale la pena dejarla escrita: ¿qué es
esa $j'$? No es otra iteración; es el índice auxiliar de la sumatoria, un
nombre distinto para no chocar con la $j$ que ya está ocupada nombrando la
iteración. La sumatoria completa es *lo que llevo acumulado hasta este
momento*. En la diapositiva anotada quedó el ejemplo: si estoy parado en la
iteración $j = 4$, lo que llevo es $A[0] + A[1] + A[2] + A[3]$, o sea la
sumatoria hasta $j - 1$; el cuerpo le suma $A[4]$, el elemento actual, y el
índice pasa a 5.

En general, al ejecutar las líneas 4--5:

$$\mathtt{ans} = \sum_{j'=0}^{j-1} A[j'] + A[j] = \sum_{j'=0}^{j} A[j'], \qquad i = j + 1,$$

que es exactamente $I_1$ evaluado en $j+1$: donde el invariante decía
$j - 1$, al reemplazar $i$ por $j+1$ queda $j$, y la sumatoria coincide. Para
$I_0$: de $j < N$ sale $0 \leq j+1 \leq N$. Los dos invariantes sobreviven a
la iteración; por lo tanto, son estables. ✓

**Terminación.** Dos claves están en el propio código: dónde arranca el
índice y cómo cambia. Arranca en 0, la línea 5 le suma 1 en cada vuelta, y la
condición lo compara contra $N$: no importa qué tan grande sea $N$,
eventualmente $i$ llega y el ciclo se rompe. Eso garantiza que termina.
Finalmente, en la iteración en la que termina, la condición $i < N$ es falsa,
o sea $i \geq N$; junto con $I_0$, que dice $i \leq N$, la única posibilidad
es $i = N$. Sustituyendo ese valor en $I_1$:

$$\mathtt{ans} = \sum_{j=0}^{N-1} A[j],$$

que coincide con la poscondición. Por lo tanto, los invariantes son
correctos. $\blacksquare$

**Teorema 2.** La invocación `sumarArreglo(A)` para cualquier arreglo de
números $A[0..N)$ con $N \geq 0$ produce como resultado la suma de los
elementos en $A[0..N)$.

*Demostración*: es trivial a partir de la correctitud de los invariantes
$I_0$ e $I_1$ (Teorema 1): la terminación deja $i = N$, y sustituir ese valor
en $I_1$ da la poscondición, que es lo que retorna la línea 6. $\blacksquare$

!!! note "El caso límite: el arreglo vacío"

    Con $N = 0$ la condición falla desde el primer chequeo, el ciclo no corre
    y la función devuelve 0. ¿Hay que arreglar algo? No: la especificación
    admite $N \geq 0$, la suma sobre el rango vacío vale 0, y la
    inicialización ya había establecido los invariantes antes de la primera
    evaluación; la terminación los lee ahí mismo, con $i = 0 = N$. Los casos
    límite importan porque son donde los diseños suelen fallar: entradas
    raras, pero posibles, y que pertenecen al dominio. Un arreglo vacío es
    exactamente eso.

## El factorial

Con el segundo ejemplo el método se repite completo, y trae dos decisiones de
diseño que valen la pena.

```python
def fact(N):
    ans = 1
    i = 1
    while i <= N:
        ans = ans * i
        i = i + 1
    return ans
```

La cadena de estados para $N = 5$:

$$(1, 1) \to (2, 1) \to (3, 2) \to (4, 6) \to (5, 24) \to (6, 120)$$

Al proponer las cotas del índice en clase quedó primero $1 \leq i \leq N$, y
de la audiencia llegó la corrección al vuelo: la cota superior es $N + 1$,
porque el último chequeo, el que rompe la condición $i \leq N$, ocurre justo
con ese valor. Tienen toda la razón, y la moraleja quedó dicha: la cota
superior de $I_0$ se lee en la condición del `while`. En `sumarArreglo` la
condición era $i < N$ y el ciclo terminaba en $N$; aquí es $i \leq N$ y
termina en $N + 1$. El valor que hay que buscar es siempre el que vuelve
falsa la condición.

¿Y por qué `i` arranca en 1 y no en 0, como en la suma? Porque el cuerpo
multiplica por `i`, y multiplicar por 0 arruinaría el producto: todo daría
cero. Por eso el acumulador arranca en 1 y el índice también.

Los invariantes:

$$I_0:\; 1 \leq i \leq N+1 \qquad\qquad I_1:\; \mathtt{ans} = (i-1)!$$

El $(i-1)!$ sale de la cadena: en cada chequeo van multiplicados los factores
$1, 2, \ldots, i-1$, y el factor $i$ aún no entra. Compruébenlo fila por
fila: en $(3, 2)$, $\mathtt{ans} = 2 = 2!$; en $(6, 120)$,
$\mathtt{ans} = 120 = 5!$. Y $0! = 1$ por definición, lo que hace que el
estado inicial $(1, 1)$ también cumpla.

La demostración completa está en las diapositivas, con la misma receta:
Teorema 1, inicialización por las líneas 1--2 (donde $1 = 0!$ salva el
arranque), estabilidad con la iteración arbitraria $i = j$ (multiplicar
$(j-1)!$ por $j$ da $j!$, que es $I_1$ evaluado en $j+1$), terminación con
$i = N+1$ y el reemplazo $(N+1-1)! = N!$, y Teorema 2.

!!! warning "¿Y `fact(-1)`?"

    Con $N = -1$ la condición falla de una, el ciclo no corre y la función
    devuelve 1. ¿Está mal el algoritmo? No: la precondición pide
    $N \in \mathbb{N}$, y $-1$ no es una instancia del problema. Si en el
    examen o en el taller les preguntan qué pasa cuando la precondición no se
    cumple: no podemos asegurar nada. Si usted no cumple su parte del trato,
    no hay nada que hacer.

## La búsqueda de un valor

El tercer ejemplo pasó más rápido en clase, con la invitación a revisarlo con
calma en las diapositivas. El problema es la búsqueda ya especificada, y el
algoritmo, esta vez en C++:

```cpp
bool solve(vector<int>& A, int v) {
    bool ans = false;
    int i = 0;
    while (i < A.size()) {
        if (A[i] == v)
            ans = true;
        ++i;
    }
    return ans;
}
```

Antes de los invariantes, una decisión de diseño que no es casualidad: aquí
se pudo haber puesto un `return true` adentro del `if` y salir de una. Se
evitó a propósito, porque un retorno en la mitad complica mucho el análisis
del ciclo. Esa es la razón de fondo de la regla de calidad que el curso pide
en talleres y proyectos: un solo `return` por función, al final. Déjelo
correr; el resultado es el mismo y la demostración se deja escribir.

Con $A = [8, 1, 4, 2, 5, 6, 7, 10]$ y $v = 5$, la traza muestra algo nuevo:
`ans` arranca en falso, se vuelve verdadero en el sexto chequeo, cuando el 5
aparece, y de ahí en adelante se conserva. Ya no acumula una suma ni una
multiplicación: acumula una *respuesta*. ¿Y qué responde exactamente en cada
chequeo? La pregunta del problema, pero solo sobre el prefijo ya revisado:

$$I_0:\; 0 \leq i \leq N \qquad\qquad I_1:\; \mathtt{ans} = \exists\, p \in [0..i).\; A[p] = v$$

La especificación del invariante cambió por completo respecto a los
anteriores: es una fórmula con un existencial, no una ecuación aritmética. Es
legítimo; un invariante es una fórmula lógica.

De la demostración, los tres momentos que dejaron enseñanza:

- **Inicialización.** Con $i = 0$ hay que evaluar el existencial sobre el
  rango $[0..0)$. En clase la pregunta fue directa: ¿ese rango existe? Va del
  0 sin incluir el 0: es vacío. No puede existir un $p$ dentro de un rango
  donde no hay nada, así que el existencial es falso, que es justo el valor
  de `ans`. ✓
- **Estabilidad.** La comparación del `if` abre dos casos. Si $A[j] = v$,
  `ans` pasa a verdadero, y es correcto porque la posición $j$ hace verdadero
  el existencial sobre $[0..j{+}1)$. Si $A[j] \neq v$, `ans` conserva lo que
  traía, y también es correcto: agregar al prefijo una posición que no es $v$
  no cambia el existencial. ✓
- **Terminación.** El ciclo termina porque $i$ sube de 1 en 1 acotado por
  $N$. Al salir, la condición rota da $i \geq N$, y el invariante $I_0$ da
  $i \leq N$. La **intersección** de las dos cosas es un único valor,
  $i = N$; si la intersección diera vacía o diera más de un valor, habría que
  revisar el algoritmo. Sustituyendo $i = N$ en $I_1$ queda el existencial
  sobre $[0..N)$: la poscondición. $\blacksquare$

## La receta completa

Al cierre quedó escrita en el tablero la receta, tal cual se espera en tareas
y parciales:

1. **La especificación.** Precondición: qué cumplen las entradas.
   Poscondición: qué cumple la salida.
2. **El método.** Primero, estudiar cómo evoluciona el algoritmo: tomar una
   instancia y mirar cómo cambian las variables dentro del ciclo. Segundo,
   proponer los invariantes a partir de la generalización: $I_0$ para el
   índice, $I_1$ para la respuesta. Tercero, demostrar inicialización,
   estabilidad y terminación.
3. **Enunciar los teoremas.** Teorema, demostración y conclusión, con la
   notación formal. Sin esto se pierden puntos, aunque el resto esté bien.

Un matiz sobre el índice, que salió de una pregunta: a veces es *implícito*.
Si la suma se escribiera con un `for e in lista`, no habría ninguna `i` en el
código; para el análisis, usted la asume: un contador que arranca en 0 y sube
en 1 con cada vuelta, porque lo que hace el índice es contar iteraciones. La
pareja de invariantes se propone igual.

## Errores comunes

Los tropiezos de siempre, para esquivarlos:

- **Olvidar $I_0$.** Sin las cotas del índice, la estabilidad no puede usar
  que $j$ es un índice válido y la terminación no sabe con qué valor de $i$
  termina el ciclo.
- **Proponer la poscondición como invariante.** $\mathtt{ans} =
  \sum_{j=0}^{N-1} A[j]$ solo vale al final; el invariante debe valer en
  todos los chequeos, empezando por el primero. El invariante habla del
  prefijo recorrido, con $i$, no con $N$.
- **Probar en la estabilidad lo que se asume.** Los invariantes se *asumen*
  antes de la iteración y se *prueban* después de ella. Esto es inducción
  matemática: usted sabe que $P(j)$ vale y demuestra $P(j+1)$, la siguiente
  iteración. Confundir los dos momentos deja la demostración circular.
- **Saltarse la terminación.** Inicialización y estabilidad solas no
  concluyen nada del algoritmo; falta evaluar $I_1$ en el valor final de $i$
  y comparar contra la poscondición.
- **Leer mal la condición del `while`.** Con $i < N$ el ciclo termina en
  $i = N$; con $i \leq N$, en $i = N+1$. La cota superior de $I_0$ sale de
  ahí, y el último valor válido del índice es el que rompe el ciclo.

## Ejercicios

Propuestos en las diapositivas, para hacer con la receta completa:

1. **Cuántas veces aparece un valor.** Dado $A[0..N)$ y un número $v$,
   escriba un algoritmo iterativo que cuente cuántas posiciones de $A$
   contienen a $v$, y haga el análisis completo.
2. **La búsqueda que entrega la posición.** Para la variante que devuelve $p$
   o $-1$: escriba el algoritmo y proponga sus invariantes. ¿Qué guarda
   `ans` mientras no ha encontrado nada?
3. **La búsqueda en un arreglo ordenado.** La especificación gana la
   precondición de orden. ¿`solve` la aprovecha en algo? ¿Qué podría hacer un
   algoritmo que sí la aproveche? Lo retomamos con la búsqueda binaria.

Los dos primeros están resueltos al final de las diapositivas, junto con un
cuarto ciclo, `contarDigitos`, que no usa arreglo. Revísenlos: este tema
requiere ejercicios, no hay atajo.

Un detalle de lectura para `buscarPosicion`, porque en la clase de las 9
generó confusión y vale aclararlo aquí. Su cadena con $A = [3, 8, 5, 8, 1]$ y
$v = 8$ es

$$(0, -1) \to (1, -1) \to (2, 1) \to (3, 1) \to (4, 1) \to (5, 1)$$

y está verificada por computador. Lo que despista es el desfase entre la
posición y el chequeo: el 8 está en la posición 1, pero su efecto aparece en
el chequeo con $i = 2$, porque el estado se fotografía cuando el `while`
evalúa su condición, es decir, *después* de que el cuerpo procesó la posición
anterior. En general, lo que le pasa a la posición $j$ se ve en el chequeo
con $i = j + 1$. El segundo 8, en la posición 3, pasa sin dejar rastro, que
es justo lo que el `and ans == -1` garantiza.

## Ejercicios interactivos

Dos ejercicios en el navegador siguen el camino completo de la clase: ver el
patrón en la traza, nombrarlo como la pareja de invariantes $I_0$ e $I_1$ y
armar la demostración por inicialización, estabilidad y terminación. Son una
primera iteración de este tipo de material, así que la realimentación es
bienvenida. Están en la
[página de ejercicios interactivos](Ejercicios.md#invariantes-de-ciclo):

- [sumar](widgets/sumar.html){ target=_blank rel=noopener } — el mismo
  ejemplo de la clase, con el mismo arreglo: descubra qué se conserva en la
  traza, nombre $I_0$ e $I_1$ y complete la demostración del Teorema 1 hasta
  el Teorema 2.
- [factorial](widgets/factorial.html){ target=_blank rel=noopener } — el
  mismo recorrido con menos ayuda y la condición `i <= N`, que cambia las
  cotas. Cierra con el experimento de `fact(-1)`: fuera de la precondición no
  hay promesa.

## Código de la clase

Los códigos prometidos en la clase, cada uno con la cadena de estados impresa
y el invariante contrastado a mano:

- [sumarArreglo.py](codigo/sumarArreglo.py) — el ejemplo de la clase, con la
  traza de `[9, 4, -5, 1, 8, 3]`
- [contarOcurrencias.py](codigo/contarOcurrencias.py) — el ejercicio 1
  resuelto
- [buscarPosicion.py](codigo/buscarPosicion.py) — el ejercicio 2 resuelto
- [contarDigitos.py](codigo/contarDigitos.py) — el invariante numérico, sin
  arreglo ni índice
- [comprobar.py](codigo/comprobar.py) — los cuatro algoritmos con `assert`
  sobre sus invariantes, probados sobre 1 092 casos

El truco de los `assert` vale la pena por sí solo: un invariante afirma algo
que debe ser cierto en cada chequeo, así que se puede escribir tal cual como
un `assert` y ponerlo junto a la condición del ciclo. En Python es directo;
en Java tocaría lanzar una excepción cuando la condición falle. Que ningún
`assert` falle en mil arreglos no demuestra nada, pero un `assert` que falla
refuta el invariante de inmediato y dice en qué chequeo se rompió: es la
forma más barata de descartar una fórmula falsa antes de gastar media hora
demostrándola.

```bash
python3 sumarArreglo.py
python3 comprobar.py
```

## El material del profesor titular

El método de esta clase es el mismo que el profesor Camilo usa en su página,
donde hay ejemplos resueltos y parciales de semestres pasados con este
formato exacto: especificación con entrada y salida, invariantes $I_0$ e
$I_1$, y la demostración por inicialización, estabilidad (o mantenimiento,
que es el nombre de CLRS) y terminación. La invitación es a revisar ese
material; el punto del parcial se espera resuelto de esa manera. El material
de 2026-1 sirve igual: el curso no cambia.

## Apéndice

De la pregunta que salió en la clase de las 9 quedó un
[apéndice](Apéndice.md) que extiende esta nota: qué pasa con el invariante
cuando el algoritmo *modifica* el arreglo (dos ejercicios resueltos, con la
copia $A'$ y la zona intacta), cómo se manejan dos ciclos anidados con una
pareja de invariantes por ciclo ($I_0$, $I_1$ para el externo; $I_2$, $I_3$
para el interno), y la demostración por inducción estructural del máximo
recursivo. Los dos primeros temas se retoman el miércoles.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein. *Introduction to
  Algorithms*, 3.ª ed., MIT Press, 2009. Sección 2.1, pp. 18--20: invariantes
  de ciclo; su *mantenimiento* es la estabilidad del curso.
- C. Rocha. *Diseño y Análisis de Algoritmos*. Está en la biblioteca.
