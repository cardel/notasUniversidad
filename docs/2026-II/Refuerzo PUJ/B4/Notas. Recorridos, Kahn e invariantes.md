# Recorridos, Kahn e invariantes · Refuerzo PUJ 14 de noviembre

La sesión arrancó con el recorrido en profundidad que pinta los nodos de blanco,
gris y negro y anota dos tiempos por nodo, y con lo que esos colores dicen de cada
arista. Siguió UVa 11080, *Place the Guards*: primero a mano con las dos muestras,
después como un recorrido que pinta con dos colores, y la solución en Python pasó
el juez. La tercera parte fue el algoritmo de Kahn, que detecta ciclos con los
grados de entrada, con UVa 10305, *Ordering Tasks*. La hora de lógica cerró con
los invariantes de ciclo de la mayor diferencia hacia adelante, el ciclo de
UVa 11078.

Al terminar la sesión se espera poder:

- Clasificar cada arista de un recorrido en profundidad por el color del nodo al
  que llega y, si es negro, por sus tiempos.
- Decidir si un grafo se pinta con dos colores y contar cuántos nodos lleva cada
  color en cada pedazo.
- Detectar un ciclo en un grafo dirigido con los grados de entrada y leer de la
  cola un orden topológico.
- Escribir el invariante de un ciclo como fórmula y demostrarlo en tres pasos.

## Diapositivas y tablero

[recorridos-anotada.pdf](./recorridos-anotada.pdf){ target=_blank rel=noopener },
69 páginas: las 66 del deck de recorridos con lo escrito encima durante la sesión
y tres hojas de tablero, las páginas 42, 43 y 56.

- En la 13 está la traza sobre $G_1$ con los tiempos de entrada y de salida de
  cada nodo, y en la 18, los intervalos de vida: el de 2 cabe dentro del de 0, y
  el de 1 queda fuera del de 3.
- La 42 tiene las dos muestras de UVa 11080 dibujadas: las dos calles sueltas,
  que piden 2 guardias, y el ciclo de cinco cruces, donde cada intento deja una
  calle sin vigilar y la respuesta es $-1$.
- La 43 tiene el código de `pintar`, `guardias` y la lectura, con el color de
  cada cruce marcado sobre el grafo.
- La 56 tiene la muestra de UVa 10305 con el grafo de las tareas y la salida
  `1 4 2 5 3`.

[logica-anotada.pdf](./logica-anotada.pdf){ target=_blank rel=noopener },
31 páginas: el deck de lógica con lo escrito encima. En la 3 están los
cuantificadores del invariante de `mayor`, y en la 14, su demostración. La 17, la
20 y la 22 hacen lo mismo con `mejor`, y en la 24 está la traza del ciclo de
UVa 11078 con el arreglo $[2, 3, 5, 1, 7, 9, 3]$: el valor de `mayor` y de
`mejor` en cada vuelta.

La grabación de la sesión, partida en videos cortos por tema, está en la
[lista de reproducción del refuerzo](https://www.youtube.com/playlist?list=PLKsjj1jEesqU){ target=_blank rel=noopener }.

## Código de la sesión

Lo que se escribió y se envió en clase es la solución de UVa 11080 que está en
`codigo/`, en Python y en C++. Todo el código de la sesión está en la
[página de la sesión](./14%20de%20noviembre.%20Planteamiento%20e%20invariantes%20de%20ciclo.md),
con la lectura de cada problema.

## Tipos de arista en el recorrido en profundidad

Un nodo blanco no se ha visitado, uno gris está abierto en la pila de llamadas y
uno negro ya revisó todas sus salidas. El reloj sube cada vez que un nodo cambia de
color: $u.d$ se anota al pintarlo de gris y $u.f$ al pintarlo de negro.

Sobre $G_1$, desde 0, los tiempos quedan $d = [1, 2, 3, 7, 8]$ y
$f = [6, 5, 4, 10, 9]$. Tres aristas llegan a un nodo ya visitado, y solo una
cierra un ciclo:

| Arista | Color de llegada | Tiempos | Tipo |
|---|---|---|---|
| $2 \to 0$ | gris | | retroceso |
| $0 \to 2$ | negro | $1 < 3$: el intervalo de 2 cabe en el de 0 | avance |
| $3 \to 1$ | negro | $7 > 2$: los intervalos no se tocan | cruzada |

Un arreglo de visitados no distingue estas tres aristas; los colores sí. Hay ciclo
si y solo si aparece una arista de retroceso. La 3 abre un segundo árbol, porque
el recorrido en profundidad deja un bosque.

En clase surgió si una arista cruzada puede unir dos ramas del mismo árbol. Sí:
basta que el nodo de llegada haya terminado en otra rama antes de que la actual
lo alcance.

Actividad: [tipos de arista](../../../actividades/ayg-puj/orden-topologico-dfs-low/aristas.html){ target=_blank rel=noopener }.

## UVa 11080, Place the Guards

<https://vjudge.net/problem/UVA-11080>. La página pide cuenta.

Un guardia cuida su cruce y las calles que salen de él; dos guardias en los
extremos de una misma calle pelean, y toda calle tiene que quedar cuidada. Las dos
muestras se resolvieron a mano antes de escribir nada:

- **4 cruces y las calles $0$-$1$ y $2$-$3$.** Un guardia en cada calle: 2.
- **5 cruces en ciclo** ($0$-$1$, $1$-$2$, $2$-$3$, $3$-$4$, $0$-$4$). Con un
  guardia en 0 y otro en 3, la calle $1$-$2$ queda sin cuidar. Con uno en 1 y
  otro en 4, se queda sin cuidar la $2$-$3$. No hay forma: $-1$.

Cada calle necesita exactamente un guardia en uno de sus extremos, así que poner o
no un guardia es pintar el grafo con dos colores. El ciclo de cinco no se deja
pintar, porque un ciclo de longitud impar vuelve al punto de partida con el color
cambiado.

La solución recorre en profundidad cada pedazo del grafo, pinta el vecino con
`1 - c` y cuenta cuántos nodos quedan de cada color. Si hay choque, $-1$. Si no,
se suma el menor de los dos conteos, o 1 cuando el pedazo es un cruce suelto, que
igual necesita su guardia. Los detalles que se cuidaron al escribirla:

- El grafo es no dirigido: cada calle entra a la lista de los dos extremos.
- El color arranca en $-1$ para todos.
- La recursión de Python no hizo falta subirla: la solución pasó el juez sin
  `sys.setrecursionlimit`, con a lo sumo 200 cruces.

Costo: $O(V + A)$ por caso.

Actividad: [guardias](../../../actividades/ayg-puj/representaciones-y-recorridos/guardias.html){ target=_blank rel=noopener }.

## Kahn: ciclos con los grados de entrada

El grado de entrada de $v$ es cuántas aristas llegan a $v$. La lista de adyacencia
solo guarda las que salen, así que el grado de entrada va en un vector aparte, que
arranca en ceros y se llena mientras se leen las aristas: por cada $u \to v$,
`entrada[v] = entrada[v] + 1`.

1. Entran a la cola los nodos con grado de entrada 0.
2. Al sacar $u$, cada arista $u \to v$ le baja 1 al grado de $v$; si llega a 0,
   $v$ entra a la cola.
3. Si al vaciarse la cola no salieron todos los nodos, hay un ciclo: los que
   faltan se esperan unos a otros.

En $G_1$ la cola se queda sin nodos con 0, 1 y 2 adentro, y ahí está el ciclo.
Sin la arista $2 \to 0$, el orden que sale es $0, 3, 1, 4, 2$. Costo: $O(V + A)$.

**UVa 10305, Ordering Tasks.** <https://vjudge.net/problem/UVA-10305>. La página
pide cuenta. Cada caso trae $n$ y $m$ y luego $m$ parejas $i$ $j$: la tarea $i$ va
antes que la $j$. La entrada termina con `0 0`. En la muestra, con 5 tareas y las
parejas $1\,2$, $2\,3$, $1\,3$ y $1\,5$, la cola arranca con 1 y 4, y el orden que
sale es `1 4 2 5 3`.

UVa 11686, *Pick up sticks*, se resuelve igual, con $-1$ cuando queda un ciclo.

Actividades: [kahn](../../../actividades/ayg-puj/orden-topologico-kahn/kahn.html){ target=_blank rel=noopener },
[ciclo](../../../actividades/ayg-puj/orden-topologico-kahn/ciclo.html){ target=_blank rel=noopener } y
[tareas](../../../actividades/ayg-puj/orden-topologico-kahn/tareas.html){ target=_blank rel=noopener }.

## Invariantes de ciclo: la mayor diferencia hacia adelante

Un programa es correcto si, cuando se cumple la precondición $P$, al terminar se
cumple la poscondición $Q$. El ciclo de UVa 11078 busca el mayor
$a[s] - a[t]$ con $s < t$, y su precondición pide $n \ge 2$, porque con un solo
número no hay diferencia.

Antes de escribir un invariante se entiende el problema y se hace la prueba de
escritorio. Con $[2, 3, 5, 1, 7, 9, 3]$, `mayor` guarda el máximo del tramo ya
visto y `mejor` la mayor diferencia hasta ahí; la primera vuelta da $2 - 3 = -1$,
después aparece $5 - 1 = 4$ y al final $9 - 3 = 6$. Un ejemplo no prueba nada
sobre los demás arreglos: con $[1, 9, 2, 8, 3]$, un ciclo con los dos `if` al
revés devuelve 7, lo mismo que el original, y con otros arreglos se equivoca.

La demostración tiene tres pasos:

- **Inicialización**: el invariante vale antes de la primera vuelta. Para `mejor`,
  con $j = 1$ no hay parejas con $t < 1$, así que el conjunto de parejas se
  escribe incluyendo la $(0, 1)$, la que fija el valor inicial.
- **Estabilidad**: si vale al empezar una vuelta, vale al terminarla. Es el paso
  de inducción.
- **Terminación**: el ciclo para cuando $j = n$, y el invariante con $j = n$ es la
  poscondición.

El primer invariante sale del contador, $1 \le j \le n$, y los demás dicen qué
guarda cada variable sobre el tramo $a[0..j)$.
