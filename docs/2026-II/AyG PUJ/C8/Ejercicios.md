# Ejercicios interactivos

Cuatro ejercicios para el navegador, en el orden de los temas de la sesión.
Ninguno usa el plan de estudios de las diapositivas ni la muestra de
Ordering Tasks.

## Orden topológico

### [ordenes](widgets/ordenes.html){ target=_blank rel=noopener }

Antes de cualquier algoritmo. Un grafo de seis vértices y seis listas: hay
que marcar cuáles son órdenes topológicos, y la comprobación dice, por cada
lista descartada, qué flecha quedó al revés. La segunda tarjeta pregunta
cuántos órdenes distintos tiene el grafo; son más de uno y muchos menos que
las $720$ permutaciones.

## El algoritmo de Kahn

### [kahn](widgets/kahn.html){ target=_blank rel=noopener }

El algoritmo paso a paso sobre tres grafos, con el contador de entrada de
cada vértice dibujado encima: se ve bajar cuando sale un predecesor y ponerse
en verde en el instante en que el vértice entra a la cola. Antes de ejecutar
se predice cuántas fuentes hay, y la tabla de la tarjeta 3 registra cada
salida con los contadores que bajó. Las dos preguntas del final son las que
sostienen la demostración: cuándo entra un vértice a la cola y por qué eso
basta para que el orden sea topológico.

### [ciclo](widgets/ciclo.html){ target=_blank rel=noopener }

El mismo algoritmo sobre grafos con ciclos. La cola se vacía antes de tiempo
y hay que predecir cuántos vértices alcanzan a salir; el tercer grafo no
tiene ciclos y sirve de contraste. Las tarjetas 3 y 4 preguntan quién queda
por fuera —los del ciclo y todo lo que depende de ellos— y por qué
`len(orden) < n` es la señal en las dos direcciones.

## Ejercicios

### [variantes](widgets/variantes.html){ target=_blank rel=noopener }

Para los ejercicios 2 y 3 de la clase. Un grafo de siete vértices y las tres
versiones del algoritmo: con cola, con pila y con la fuente de número más
bajo. Antes de correrlas hay que decir cuál orden devuelve cada una; los tres
órdenes son distintos y los tres son topológicos, y la tabla muestra en cada
paso qué fuentes había para escoger.

## Para resolver en papel

Estos ejercicios entran en el material del parcial. Los tres primeros se
propusieron en clase.

1. Escriba `tiene_ciclo(G)` usando búsqueda en profundidad, sin el algoritmo
   de Kahn. Sobre `[[4], [3], [0], [0, 6], [], [2], []]` responde `False`;
   sobre `[[4], [3], [0], [0, 6], [3], [2], []]` responde `True`. La marca de
   visitado no alcanza: llegar a un vértice ya visitado por otro camino no es
   un ciclo. Cada vértice pasa por tres estados: sin visitar, en proceso (su
   llamada no ha terminado) y terminado. Piense qué significa toparse con uno
   en proceso.

2. En $Kahn(G)$ se cambia la cola por una pila: las fuentes se apilan y sale
   la última que entró. ¿Sigue devolviendo un orden topológico? Justifíquelo
   con lo que sostiene el algoritmo. Ejecútelo a mano sobre el plan de
   estudios y compare con `[1, 5, 3, 2, 6, 0, 4]`.

3. Modifique $Kahn(G)$ para que, entre todos los órdenes topológicos,
   devuelva el menor en orden lexicográfico: el que tiene el menor primer
   vértice; entre los que empatan, el menor segundo, y así. Sobre el plan de
   estudios debe devolver `[1, 3, 5, 2, 0, 4, 6]`. Diga qué estructura
   reemplaza a la cola y cuánto cuesta el algoritmo con ella. La versión
   ingenua ya lo devuelve, porque busca desde el vértice $0$; la pregunta es
   cómo sacar siempre la fuente de número más bajo sin recorrer la lista
   entera.

4. Dibuje un grafo dirigido de cinco vértices que tenga exactamente un orden
   topológico, y otro de cinco vértices que tenga $120$. Diga qué tienen las
   aristas en cada caso.

5. En un grafo dirigido acíclico, ¿puede haber más de una fuente? ¿Más de un
   sumidero (vértice con grado de salida $0$)? ¿Puede un vértice ser las dos
   cosas? Dé un ejemplo de cada respuesta afirmativa.

6. Escriba $Kahn(G)$ sobre matriz de adyacencia y diga cuánto cuesta en
   términos de $V$ y $E$. ¿Dónde se pierde la cuenta de $\Theta(V + E)$?

7. Un grafo dirigido tiene un solo ciclo y $k$ vértices desde los que hay
   camino hasta algún vértice del ciclo, sin contar los del ciclo. ¿Cuántos
   vértices emite Kahn? ¿Y si los $k$ vértices tienen camino *desde* el ciclo
   en vez de *hacia* él?

## Para programar

- **UVa 10305 — Ordering Tasks.** Enunciado en
  <https://onlinejudge.org/external/103/10305.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1246>.
  El problema de la clase, tal cual: para enviar la solución y ver el
  veredicto.

- **UVa 11686 — Pick up sticks.** Enunciado en
  <https://onlinejudge.org/external/116/11686.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2733>.
  $n$ palitos y $m$ parejas *$a$ está encima de $b$*, con $n$ y $m$ hasta un
  millón; un orden para recogerlos sin levantar uno que tenga otro encima, o
  `IMPOSSIBLE`. Es la segunda variante de la clase, con `len(orden) < n`
  decidiendo la palabra. Con un millón de líneas se lee todo de una vez con
  `sys.stdin.read()`.

- **UVa 11060 — Beverages.** Enunciado en
  <https://onlinejudge.org/external/110/11060.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2001>.
  $N$ bebidas con nombre y $M$ parejas *$B_1$ antes que $B_2$*; cuando dos no
  están relacionadas va primero la que apareció primero en la entrada. Es el
  ejercicio 3 con los nombres numerados por orden de aparición. La salida
  lleva `Case #` y una línea en blanco después de cada caso; se copia del
  enunciado letra por letra.

## De las clases anteriores

Los recorridos y su costo, que el algoritmo de hoy reutiliza, se practican en
la [página de la clase 6](../C6/Ejercicios.md); los grafos implícitos, en la
[de la clase 7](../C7/Ejercicios.md).
