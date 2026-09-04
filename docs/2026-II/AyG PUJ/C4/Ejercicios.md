# Ejercicios interactivos

Cuatro ejercicios que se trabajan en el navegador, uno por cada forma de ciclo
de la sesión. Ninguno repite los ejemplos de las diapositivas: la idea es
encontrar el invariante donde no está escrito todavía.

La mecánica es la de siempre. Primero prediga la respuesta sin ejecutar nada.
Después recorra el algoritmo paso a paso y busque, en la tabla de estados, lo
que se cumple en **todas** las filas mientras el resto cambia. Cuando lo
encuentre, el ejercicio abre la demostración y usted la arma respondiendo una
pregunta por movimiento.

Una advertencia que vale para los cuatro. Un invariante es una fórmula, no
una frase: lleva $N$, el índice y el arreglo, un cuantificador sobre las
posiciones y, adentro, una igualdad o una pertenencia. Se escribe
$\texttt{mayor} = \max A[0..i)$, o
$\forall k,\ 0 \leq k < \texttt{len(res)} - 1:\ \texttt{res}[k] \neq \texttt{res}[k+1]$,
y no ```mayor` guarda el más grande'' ni ``la lista no trae repetidos
seguidos''. Frases como ``mayor vale 9'' o ``la lista tiene cuatro
elementos'' describen una corrida y no otra; los ejercicios traen esa opción
entre las respuestas posibles, y elegirla lleva al preset donde la frase se
cae.

## Varias variables a la vez

### [dos mayores](widgets/mayores.html){ target=_blank rel=noopener }

Un solo recorrido que sostiene dos acumuladores: el mayor y el segundo mayor.
Ninguno de los dos se demuestra por separado —el argumento de `segundo`
necesita saber qué guarda `mayor`— y de ahí sale la idea de invariante
conjunto.

La estabilidad se parte en tres casos según dónde caiga el elemento nuevo, y
hay un preset con todos los valores iguales que decide cómo hay que enunciar
el segundo mayor para que los empates no rompan nada.

### [comprimir](widgets/comprimir.html){ target=_blank rel=noopener }

La salida es una lista que crece: $A$ sin repeticiones consecutivas. Un
invariante sobre una lista tiene que fijar dos cosas, cuántos elementos tiene
y qué hay en cada posición, y decir **qué lista es** las fija de un solo golpe.

Falta un tercer invariante, pequeño, sin el cual la estabilidad no se deja
escribir: el que relaciona el último elemento escrito con $A[i-1]$. Es el
puente entre lo que el código compara y lo que el enunciado pide, y el
ejercicio no avanza hasta que aparece.

## Ciclos anidados

### [ordenamiento burbuja](widgets/burbuja.html){ target=_blank rel=noopener }

El ciclo interno se demuestra solo y su conclusión se guarda con nombre
propio: al terminar la pasada, la posición $N-1-i$ tiene el máximo de
$A[0..N-1-i]$. El ciclo externo no vuelve a mirar ese código — cita el lema y
sigue. Ese orden de escritura es todo el ejercicio.

Entre las respuestas del ciclo externo hay una que solo habla del orden de la
cola y se queda corta, y otra que parece de trámite y no lo es: sin decir que
el arreglo sigue siendo una permutación del original, llenarlo de ceros
cumpliría el resto.

El arreglo ya ordenado hace las mismas comparaciones que el ordenado al revés
—$N(N-1)/2$ en los dos casos—, y la última tarjeta pide arreglar justamente
eso. CLRS plantea este algoritmo y pide sus dos invariantes en el
Problema 2-2, p. 40.

## Variantes de la búsqueda binaria

### [el mínimo de un arreglo rotado](widgets/rotado.html){ target=_blank rel=noopener }

Un arreglo ordenado que alguien rotó: ya no está ordenado, y aun así la
búsqueda binaria funciona. El código es el mismo de la clase, línea por línea;
lo único que cambia es la condición del `if`, y encontrarla es el ejercicio.

La primera tarjeta ofrece cuatro propiedades y solo una es monótona. Después
viene el invariante, con la opción de ``el mínimo está en la ventana'' entre
las respuestas: suena bien, se corre un preset y se ve terminar el ciclo con
la ventana vacía y el mínimo afuera.

## Para resolver en papel

Estos ejercicios entran en el material del parcial.

1. **Los récords.** Construya la lista de las posiciones $j$ donde $A[j]$ es
   mayor que todos los anteriores. Necesita un acumulador y una lista:
   escriba un invariante para cada uno y demuestre los tres pasos. Sobre
   $[3, 1, 4, 1, 5, 9, 2, 6]$ la respuesta es $[0, 2, 4, 5]$.

2. **Invertir un número.** Dado $n \geq 0$, devuelva el número con sus
   dígitos al revés. El dato del parámetro se consume en cada vuelta; el
   invariante tiene que relacionar lo consumido con lo construido. La pista
   está en el ejercicio de contar dígitos: si $n$ pierde un dígito por
   vuelta, ¿qué relación se mantiene entre lo que queda de $n$ y lo que
   lleva el resultado?

3. **La suma de los dígitos.** Igual que el anterior, pero acumulando en un
   número en vez de construir uno nuevo. ¿Qué cambia en el invariante?

4. **Ordenamiento por inserción** (CLRS, Sección 2.1, p. 18). El ciclo
   interno corre elementos hacia la derecha en lugar de solo mirar: su
   invariante habla de dónde quedó cada uno, no solo de dónde está el
   mínimo. Demuéstrelo como lema y después escriba el externo sobre esa
   conclusión.

5. **Contar inversiones.** Cuente los pares $(a, b)$ con $a < b$ y
   $A[a] > A[b]$, con dos ciclos. El invariante del interno cuenta las
   inversiones que empiezan en $a$; el del externo acumula las de
   $A[0..a)$. Sobre $[2, 4, 1, 3, 5]$ hay tres.

6. **El máximo de cada fila.** Dada una matriz de $F$ filas por $C$
   columnas, devuelva la lista con el máximo de cada fila. Junta las dos
   cosas de la clase: dos ciclos y una lista que crece.

7. Escriba `mayor_menor_o_igual` con su propio ciclo, sin llamar a las otras
   dos, y dé sus invariantes.

8. ¿Qué devuelve `primera_posicion_mayor_o_igual` sobre un arreglo vacío?
   Sígalo con los invariantes en la mano en vez de correrlo.

9. Un arreglo ordenado de $N$ enteros distintos guarda una permutación de
   $0$ a $N-1$ a la que le falta un número. Encuéntrelo en $O(\lg N)$.
   ¿Cuál es el predicado monótono?

## Para comprobar

Los cuatro programas de la clase traen los invariantes escritos como
`assert`. Al resolver estos ejercicios conviene hacer lo mismo: escribir el
invariante dos veces, al entrar y al salir del cuerpo, y correr el programa
sobre casos pequeños. Un `assert` que revienta señala dónde está mal el
invariante, aunque el programa entregue la respuesta correcta por
casualidad.

## De las clases anteriores

Los ejercicios de invariantes de ciclo y de divide y vencerás siguen
disponibles en la [página de la clase 2](../C2/Ejercicios.md) —`sumar` y
`factorial` para la pareja $I_0$, $I_1$ clásica, `mezclar` y `ordenar` para
el esquema recursivo—, y los de búsqueda binaria y bisección en la
[página de la clase 3](../C3/Ejercicios.md).
