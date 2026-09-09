# Ejercicios interactivos

Siete ejercicios para el navegador, uno por cada tema de la sesión y en el
mismo orden en que se dieron. Ninguno usa los programas ni los grafos de las
diapositivas: aquí aparecen $H_1$, no dirigido de seis vértices y siete
aristas, y $H_2$, dirigido, más un tercero para el caso del vértice al que no
se llega.

La mecánica cambia de uno a otro a propósito. En unos hay que predecir un
número antes de ejecutar; en otros, recorrer paso a paso y leer los
contadores; en otros, decidir entre opciones donde cada respuesta equivocada
explica por qué lo es.

## Las cuatro representaciones

### [construir](widgets/construir.html){ target=_blank rel=noopener }

Las tres representaciones del mismo grafo, escritas a mano y comprobadas por
separado: la matriz a clic sobre las celdas, la lista de adyacencia vértice
por vértice y la lista de aristas en un campo de texto. Cuando las tres
quedan bien aparecen lado a lado, con lo que ocupa cada una en este grafo y
en general.

Cada comprobación dice qué falta y qué sobra, no solo si está bien. En la
lista de aristas de un grafo no dirigido, escribir $(0,2)$ y $(2,0)$ cuenta
como repetir la misma arista.

El segundo grafo es dirigido, y ahí la matriz deja de ser simétrica: la arista
$(3,2)$ pone un uno en la fila $3$ y nada en la fila $2$.

## Cuál conviene

### [consultas](widgets/consultas.html){ target=_blank rel=noopener }

Una sola pregunta —la secuencia de grados de $H_1$— contestada sobre las tres
representaciones, con el contador de ejecuciones al lado de cada línea. Salen
$6$, $36$ y $7$, es decir $V$, $V^2$ y $E$.

El resultado sorprende: para esta pregunta la lista de aristas le gana a la
matriz. Sirve para lo que el titular dejó planteado, que no hay una
representación mejor sino una mejor para cada pregunta.

## Recorrer un grafo

### [marcar](widgets/marcar.html){ target=_blank rel=noopener }

El mismo recorrido con la marca de visitados y sin ella. Sin marca se detiene
a las cuarenta vueltas porque llegó al tope del ejercicio, habiendo anotado
cuarenta visitas para cinco vértices distintos y con cuarenta y tres entradas
todavía en la pila. Con marca termina en ocho vueltas.

El tercer montaje agrega el otro asunto: un grafo dirigido donde desde el
arranque se llega a seis de siete vértices, y hace falta el ciclo externo.

## Búsqueda en profundidad

### [profundidad](widgets/profundidad.html){ target=_blank rel=noopener }

El programa no devuelve el orden de visita sino el nivel en que quedó cada
vértice dentro del árbol de la búsqueda. La pila de llamadas se ve crecer y
encogerse al lado del dibujo.

Al final, la tabla pone ese nivel contra la distancia mínima y resalta las
filas donde no coinciden: en $H_1$ desde el $0$, el vértice $4$ queda en el
nivel $4$ y está a dos aristas.

## Búsqueda en amplitud

### [amplitud](widgets/amplitud.html){ target=_blank rel=noopener }

Encontrar el vértice más lejano del arranque, que es la excentricidad y el
primer paso hacia el radio y el diámetro. Un color por capa, y la cola visible
en cada momento.

La pregunta del cierre es por qué la primera vez que alguien toca a un vértice
es siempre por el camino más corto, y la respuesta está en lo que cabe dentro
de la cola: nunca más de dos capas consecutivas.

## El costo

### [costo](widgets/costo.html){ target=_blank rel=noopener }

Dos controles, número de vértices y grado medio, y tres barras que se separan
o se juntan. Con $V = 10^5$ y grado $4$ el recorrido sobre listas hace medio
millón de operaciones y sobre la matriz diez mil millones: cinco milisegundos
contra casi dos minutos.

Subiendo el grado medio hasta el máximo que admite el grafo, las dos barras se
igualan exactamente. Ese es el caso denso, y explica por qué la matriz no
siempre es un desperdicio.

## Errores comunes

### [errores](widgets/errores.html){ target=_blank rel=noopener }

Cuatro programas que corren sin fallar y contestan mal, con una sola línea
equivocada cada uno. Al señalarla aparece la salida de las dos versiones.

El tercero es el más incómodo: poner la marca al desencolar en lugar de al
encolar no cambia ni el orden de visita ni las distancias sobre un grafo
pequeño, así que pasa las pruebas. Lo único que crece es la cola.

## Para resolver en papel

Estos ejercicios entran en el material del parcial.

1. **Las tres conversiones.** Las implementaciones de la clase suponen lista
   de adyacencia. Reescriba $DFSAux$ y $BFS$ —primero el pseudocódigo, después
   el código— sobre matriz de adyacencia, sobre lista de aristas y sobre un
   diccionario que lleva cada nombre de vértice a la lista de sus vecinos. Para
   las tres, diga cuánto cuesta el recorrido completo en términos de $V$ y $E$,
   y sobre qué línea cae ese costo.

2. **La matriz de incidencia.** Tiene una fila por vértice y una columna por
   arista. Escríbala para $H_1$ y compruebe las dos propiedades que salen de
   la definición: cuánto suma cada fila y cuántos unos tiene cada columna.
   ¿Cuánto ocupa comparada con las otras tres?

3. **Las seis conversiones.** Entre las tres representaciones hay seis
   conversiones posibles. Escriba las funciones y diga, para cada una, cuánto
   cuesta en términos de $V$ y $E$. Hay una que no puede costar menos de
   $\Theta(V^2)$ pase lo que pase: encuéntrela y explique por qué.

4. **Cuándo conviene convertir.** Un problema entrega el grafo como lista de
   aristas y hay que hacer un recorrido completo. Compare $\Theta(V+E)$ de
   convertir más $\Theta(V+E)$ de recorrer, contra $\Theta(V \cdot E)$ de
   recorrer sin convertir, y diga a partir de qué tamaño la conversión se paga
   sola.

5. Recorra $H_1$ en profundidad y en amplitud arrancando en el $2$ en lugar
   del $0$. ¿Cambian los órdenes de visita? ¿Cambian las distancias?

6. En $H_1$, ¿desde cuáles vértices se alcanza a todos los demás? ¿Y en
   $H_2$?

7. Invierta todas las aristas de $H_2$ y recorra en profundidad desde el $5$.
   ¿Qué vértices alcanza ahora?

8. Guarde los vecinos de cada vértice de $H_1$ en orden decreciente y vuelva a
   recorrer en profundidad desde el $0$. El orden de visita cambia; el conjunto
   de vértices alcanzados, no. Explique por qué.

9. Dibuje un grafo de cinco vértices donde la profundidad y la amplitud den el
   mismo orden de visita desde el mismo arranque.

10. **UVa 11902 — Dominator.** Enunciado en
   <https://onlinejudge.org/external/119/11902.pdf> y envío en
   <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3053>.
   La entrada llega como matriz de adyacencia de un grafo dirigido. Se recorre
   desde el $0$ una vez para saber a quién se alcanza, y después una vez por
   cada vértice $v$, borrándolo y volviendo a recorrer: los que dejaron de
   alcanzarse están dominados por $v$. Con $n \leq 100$ los $n$ recorridos
   sobre matriz caben de sobra.

## De las clases anteriores

Los ejercicios de invariantes están en la
[página de la clase 4](../C4/Ejercicios.md), los de búsqueda binaria y
bisección en la [de la clase 3](../C3/Ejercicios.md), y los de invariantes de
ciclo y divide y vencerás en la [de la clase 2](../C2/Ejercicios.md).
