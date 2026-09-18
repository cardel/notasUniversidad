# Ejercicios interactivos

Seis ejercicios para el navegador, en el orden de los temas de la sesión.
Ninguno usa el laberinto, el bosque, las redes ni los grafos de las
diapositivas.

## Recuento

Los dos recorridos y su costo se practican en la
[página de la clase 6](../C6/Ejercicios.md): `profundidad`, `amplitud` y
`costo`.

## Grafos implícitos: Jaimico y el café

### [laberinto](widgets/laberinto.html){ target=_blank rel=noopener }

Un laberinto nuevo y la amplitud paso a paso, con las capas creciendo sobre
el dibujo y la cola a la vista. No hay lista de adyacencia: las líneas que
calculan los vecinos están marcadas en el código y se ven ejecutarse.

Tres montajes: cuatro direcciones, ocho direcciones —cambia la tabla de
desplazamientos y nada más, y el café pasa de 11 a 7 pasos— y un laberinto
donde el café queda en $-1$.

## UVa 10977: el bosque encantado

### [bosque](widgets/bosque.html){ target=_blank rel=noopener }

La amplitud del bosque es la misma del laberinto de arriba; lo que cambia es
armar el mundo a partir de los Jigglypuffs, y eso es lo que aquí se hace a
mano: sobre el dibujo se marcan las celdas que quedan a distancia $L$ o menos
de cada uno, y el recorrido no arranca hasta que la marca esté bien. Al
comprobar, cada celda de más viene con su cuenta: $(2,2)$ está a $\sqrt{5}$
del Jigglypuff de $(3,4)$, y $\sqrt{5}$ pasa de $2$. El peligro es un
círculo, no un cuadrado.

Tres bosques: uno con un solo Jigglypuff de volumen $2$, otro donde dos de
volumen $1$ estrechan los pasos entre las rocas y la salida queda a $25$
pasos cuando en línea recta serían $13$, y uno donde la salida misma cae
dentro de un volumen y la respuesta es `Impossible.`. La última tarjeta
pregunta qué hace el programa cuando la que cae en el volumen es la
entrada.

## UVa 627: la ruta con menos saltos

### [ruta](widgets/ruta.html){ target=_blank rel=noopener }

Una red dirigida de siete enrutadores. La amplitud guarda el predecesor de
cada uno —las flechas azules— y al final la ruta se reconstruye hacia atrás
y se invierte. Entre las cuatro consultas hay una sin ruta y una donde el
vecino de menor número lleva por el camino largo: la amplitud no cae en esa
trampa, y la pregunta del cierre es por qué.

## UVa 11749: el componente más grande

### [componentes](widgets/componentes.html){ target=_blank rel=noopener }

Cuántos grupos hay que no se alcanzan entre sí y de qué tamaño es cada uno.
Cada componente se pinta de un color a medida que el ciclo externo lo
descubre, y los contadores de las líneas 7 y 8 muestran la diferencia entre
pasar por un vértice y arrancar un recorrido. Es la pieza que Poor Trade
Advisor usa después de quedarse con las carreteras de PPA máxima.

## Errores comunes

### [errores](widgets/errores.html){ target=_blank rel=noopener }

Tres programas sobre un laberinto de $4 \times 4$, cada uno con una línea
equivocada, y ninguno da error al correr. La regla de vecinos sin
comprobación de rango deja el café a 2 pasos cuando está a 6, porque un
índice negativo en Python lee desde el final. La amplitud sin la pregunta por
$-1$ no termina. La profundidad usada como distancia devuelve 12.

## Ejercicios propuestos

### [estados](widgets/estados.html){ target=_blank rel=noopener }

Para el problema del robot. Una cuadrícula de $4 \times 4$ con $k = 2$ y dos
programas: uno marca la celda, el otro marca la celda junto con la racha. El
primero devuelve $-1$ y el segundo $6$, y la tabla de la tarjeta 3 registra la
llegada que el programa ingenuo descarta. Con $k = 1$ los dos coinciden
siempre; hace falta $k \geq 2$ para que el estado importe.

## Para resolver en papel

Estos ejercicios entran en el material del parcial.

1. Corra `dfsAux` desde Jaimico en el laberinto de la clase siguiendo el
   orden de `dr`, `dc` y escriba el orden en que se visitan las primeras
   diez celdas. Compare con el orden de la amplitud.

2. Si Jaimico también pudiera moverse en diagonal, ¿cuántas entradas tendrían
   `dr` y `dc` y en cuánto quedaría la distancia al café?

3. Dibuje un laberinto de $4 \times 4$ donde la profundidad llegue al café por
   un camino de más del doble de la distancia mínima.

4. Un bosque de $4 \times 4$ sin bloqueos, con un Jigglypuff en $(2,3)$ de
   volumen $1$ y otro en $(4,2)$ de volumen $1$. Marque a mano las celdas
   peligrosas con la distancia euclidiana y diga cuántos pasos hay de $(1,1)$
   a $(4,4)$, o si es imposible.

5. En The Net, ¿qué devuelve `ruta` si el origen y el destino son el mismo
   enrutador? ¿Es lo que el enunciado quiere?

6. En Poor Trade Advisor, ¿qué pasa si todas las carreteras tienen la misma
   PPA? ¿Y si la única carretera de PPA máxima une dos ciudades que no tienen
   otras carreteras?

7. Escriba $DFSAux$ y $BFS$ sobre matriz de adyacencia y sobre lista de
   aristas y diga cuánto cuesta cada recorrido en términos de $V$ y $E$.

## Para programar

- **Rumor** (Codeforces 893C, <https://codeforces.com/problemset/problem/893/C>).
  Personajes, amistades y un costo por sobornar a cada uno; el rumor llega
  gratis a todo lo alcanzable. Mínimo de monedas para que todos lo oigan. Es
  Poor Trade Advisor al revés: se necesitan todos los componentes, y de cada
  uno importa el mínimo en vez del tamaño.

- **Robot.** Una cuadrícula de $m \times n$ con obstáculos; entrar en uno usa el
  turbo, y no se puede pasar por más de $k$ obstáculos seguidos. Mínimo de
  pasos de $(1,1)$ a $(m,n)$ o $-1$. Con $k = 1$ basta llevar la racha en la
  celda; con $k \geq 2$ el vértice es la celda más la racha.

- **UVa 439 — Knight Moves.** Enunciado en
  <https://onlinejudge.org/external/4/439.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=380>.
  Las 64 casillas y los ocho saltos del caballo: `dr`, `dc` con ocho entradas.

- **UVa 469 — Wetlands of Florida.** Enunciado en
  <https://onlinejudge.org/external/4/469.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=410>.
  El tamaño del lago que contiene a una celda es el tamaño de su componente.

- **UVa 10653 — Bombs! NO they are Mines!!** Enunciado en
  <https://onlinejudge.org/external/106/10653.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1594>.
  El laberinto de Jaimico con las minas descritas por filas; con
  $1000 \times 1000$ celdas la amplitud cabe y la profundidad recursiva no.

## De las clases anteriores

Los ejercicios de representaciones y recorridos están en la
[página de la clase 6](../C6/Ejercicios.md); los de invariantes, en la
[de la clase 4](../C4/Ejercicios.md).
