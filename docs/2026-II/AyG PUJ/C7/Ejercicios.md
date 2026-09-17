# Ejercicios interactivos

Cuatro ejercicios para el navegador, en el orden de los temas de la sesión.
Ninguno usa el laberinto, el grafo ni la cuadrícula de las diapositivas.

## Recuento

Los dos recorridos y su costo se practican en la
[página de la clase 6](../C6/Ejercicios.md): `profundidad`, `amplitud` y
`costo`.

## Grafos implícitos

### [laberinto](widgets/laberinto.html){ target=_blank rel=noopener }

Un laberinto nuevo y la amplitud paso a paso, con las capas creciendo sobre
el dibujo y la cola a la vista. No hay lista de adyacencia: las líneas que
calculan los vecinos están marcadas en el código y se ven ejecutarse.

Tres montajes: cuatro direcciones, ocho direcciones —cambia la tabla de
desplazamientos y nada más, y el café pasa de 11 a 7 pasos— y un laberinto
donde el café queda en $-1$.

## Un ejercicio tipo tarea: Rumor

### [componentes](widgets/componentes.html){ target=_blank rel=noopener }

Cuántos grupos hay que no se alcanzan entre sí y de qué tamaño es cada uno.
Cada componente se pinta de un color a medida que el ciclo externo lo
descubre, y los contadores de las líneas 7 y 8 muestran la diferencia entre
pasar por un vértice y arrancar un recorrido.

La pregunta del cierre es por qué el costo es $\Theta(n+m)$ y no
$\Theta(k \cdot (n+m))$ con $k$ componentes.

## Un ejercicio con estado: Robot

### [estados](widgets/estados.html){ target=_blank rel=noopener }

Una cuadrícula de $4 \times 4$ con $k = 2$ y dos programas: uno marca la celda,
el otro marca la celda junto con la racha. El primero devuelve $-1$ y el
segundo $6$. La tabla de la tarjeta 3 registra las llegadas a la celda $(1,3)$
y muestra la llegada que el programa ingenuo descarta.

Con $k = 1$ los dos programas coinciden siempre, porque la racha queda fijada
por la celda. Hace falta $k \geq 2$ para que el estado importe.

## Errores comunes

### [errores](widgets/errores.html){ target=_blank rel=noopener }

Tres programas sobre un laberinto de $4 \times 4$, cada uno con una línea
equivocada, y ninguno da error al correr. La regla de vecinos sin
comprobación de rango deja el café a 2 pasos cuando está a 6, porque un
índice negativo en Python lee desde el final. La amplitud sin la pregunta por
$-1$ no termina. La profundidad usada como distancia devuelve 12.

## Para resolver en papel

Estos ejercicios entran en el material del parcial.

1. Corra la profundidad desde el simio en el laberinto de la clase siguiendo
   el orden de `DR`, `DC` y escriba el orden en que se visitan las primeras
   diez celdas. Compare con el orden de la amplitud.

2. Si el simio también pudiera moverse en diagonal, ¿cuántas entradas
   tendrían `DR` y `DC` y en cuánto quedaría la distancia al café?

3. Dibuje un laberinto de $4 \times 4$ donde la profundidad llegue al café por
   un camino de más del doble de la distancia mínima.

4. En Robot, ¿qué pasa si la esquina final tuviera obstáculo? ¿En qué estado
   habría que buscar la respuesta?

5. Un robot que puede usar el turbo a lo sumo $k$ veces en todo el recorrido,
   no $k$ seguidas. ¿Cuál es el estado ahora y cuántos hay?

6. Escriba $DFSAux$ y $BFS$ sobre matriz de adyacencia y sobre lista de
   aristas y diga cuánto cuesta cada recorrido en términos de $V$ y $E$.

## Para enviar al juez

- **UVa 439 — Knight Moves.** Enunciado en
  <https://onlinejudge.org/external/4/439.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=380>.
  Un grafo implícito que no es una cuadrícula de vecinos contiguos: las 64
  casillas y los ocho saltos del caballo. La tabla `DR`, `DC` tiene ocho
  entradas y el resto es la amplitud de la clase.

- **UVa 469 — Wetlands of Florida.** Enunciado en
  <https://onlinejudge.org/external/4/469.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=410>.
  El tamaño del lago que contiene a una celda es el tamaño de su componente:
  cuente mientras recorre. La trampa está en la lectura de la entrada.

- **UVa 10653 — Bombs! NO they are Mines!!** Enunciado en
  <https://onlinejudge.org/external/106/10653.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1594>.
  El laberinto del simio tal cual, con la cuadrícula descrita por filas de
  minas. Con $1000 \times 1000$ celdas la amplitud cabe y la profundidad
  recursiva no.

## De las clases anteriores

Los ejercicios de representaciones y recorridos están en la
[página de la clase 6](../C6/Ejercicios.md); los de invariantes, en la
[de la clase 4](../C4/Ejercicios.md).
