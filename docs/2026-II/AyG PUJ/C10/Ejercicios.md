# Ejercicios interactivos

Ocho ejercicios para el navegador, organizados por los temas de la sesión y en
el mismo orden; el último junta los cortes sobre la red de un campus. Ninguno
usa los grafos de las diapositivas: ni el plan de estudios, ni el dirigido de
ocho vértices donde se traza Tarjan, ni los tres triángulos de los cortes, ni
los grafos de los ocho ejercicios propuestos. Los temas y las técnicas son los
mismos; los grafos, los vértices y los números son otros.

## Orden topológico con la profundidad

### [topodfs](widgets/topodfs.html){ target=_blank rel=noopener }

La búsqueda en profundidad que entrega el orden topológico, en sus dos formas: la recursiva, que muestra la pila de llamadas, y la de pila explícita, que muestra la lista de pares. Cada vértice pasa de blanco a gris y a negro, con `d/f` escrito encima, mientras la lista `orden` crece y al final se invierte. Antes de ejecutar se predice cuál vértice queda primero. Cuatro grafos: una receta, las tareas de un proyecto y la compilación de unos paquetes, todos sin ciclos, y una red de señales con un ciclo, donde se ve el momento en que la búsqueda llega a un vértice gris y `ciclo[0]` pasa a True.

### [ordenes](widgets/ordenes.html){ target=_blank rel=noopener }

Un grafo sin ciclos con la tabla de `d` y `f` de una búsqueda ya hecha, y seis listas candidatas: por `f` decreciente, por `f` creciente, por `d` creciente, por `d` decreciente, un orden de Kahn distinto del de la profundidad y el de `f` decreciente con dos vecinos intercambiados. Hay que marcar cuáles son órdenes topológicos. Cada candidata trae su explicación: la flecha concreta que queda al revés, o la razón por la que vale aunque no sea el de la búsqueda. Tres grafos; en el último el orden por `d` creciente sirve por una coincidencia que la explicación desarma.

## El valor low

### [low](widgets/low.html){ target=_blank rel=noopener }

Un grafo dirigido con la búsqueda ya corrida: el árbol dibujado y el `d` de cada vértice. Se escribe el `low` de cada uno, y la comprobación dice por vértice qué hijo o qué flecha lo bajó, por qué una flecha hacia un vértice que ya salió de la pila no cuenta y por qué en una flecha que no es de árbol se usa `d` y no `low`. Tres grafos ordenados por dificultad; el segundo trae una flecha cruzada hacia un componente ya cerrado.

### [Los low de un componente](tarjan-valor-low.pdf){ target=_blank rel=noopener }

Una página con un grafo de cinco vértices y los catorce pasos de Tarjan sobre él. Los dos componentes salen distintos: en uno los `low` coinciden y en el otro no, y agrupar por `low` daría tres grupos donde hay dos componentes. Conviene rehacer la ejecución a mano antes de mirar la tabla.

## El algoritmo de Tarjan

### [tarjan](widgets/tarjan.html){ target=_blank rel=noopener }

Tarjan paso a paso, en la versión recursiva y en la que lleva su propia lista `llamadas` de pares `[u, i]`. Se ven la pila de vértices, `en_pila` y `d/low` sobre cada vértice, y cada componente estrena color cuando `low[u] == d[u]` lo saca de la pila. Antes de ejecutar se predice el número de componentes. Una tabla registra los componentes en el orden en que se cierran y, al terminar, se muestra que ese orden leído al revés es un orden topológico del grafo de componentes. Tres grafos: páginas web, calles de una ciudad y una red de seguidores.

## Puntos de articulación y puentes

### [cortesdfs](widgets/cortesdfs.html){ target=_blank rel=noopener }

`cortes` paso a paso en sus dos formas: la recursiva, con la pila de llamadas a la vista, y la de pila explícita, con la lista `llamadas` de ternas `[u, padre, i]`. Cada vértice lleva encima su `d/low` mientras corre, las aristas del árbol se pintan en azul, las de retroceso que bajan un low quedan punteadas en verde, y los puntos de articulación y los puentes se marcan en rojo en el momento en que el código los detecta, con una línea que explica la comparación con los números reales. Antes de ejecutar se predice cuántos puntos de articulación hay. Tres grafos de ocho a diez vértices: uno donde la raíz tiene dos hijos y es punto de articulación, uno donde la raíz tiene dos vecinos pero un solo hijo, y uno con un punto de articulación sin ningún puente al lado. La tarjeta final pregunta qué decide que la raíz lo sea.

### [criterio](widgets/criterio.html){ target=_blank rel=noopener }

Nueve escenarios, cada uno con el dibujo del grafo y su árbol de la profundidad, un vértice `u`, su hijo `v` y los números que el código tiene al volver de `v`: `d[u]`, `low[v]`, `low[u]` y si `u` es la raíz. Hay que decidir si el hijo hace de `u` un punto de articulación y si la arista `u–v` es puente. Cada respuesta equivocada explica la comparación que se hizo mal: `≥` donde iba `>` y al revés, la condición del hijo aplicada a la raíz, la raíz con un solo hijo aunque tenga varios vecinos, y `low[u]` leído en lugar de `low[v]`. Un escenario trae un vértice que sí es punto de articulación, pero por otro hijo.

## Errores comunes

### [errores](widgets/errores.html){ target=_blank rel=noopener }

Tres versiones con una línea cambiada: `cortes_aux` sin la guarda `v != padre`, `revisar_hijo` con `>=` en la condición del puente y `tarjan` con `elif d[v] != 0` en lugar de `elif en_pila[v]`. Cada una corre sobre un grafo pequeño y devuelve algo con apariencia de respuesta. Se comparan sus puntos de articulación, sus puentes y sus `low` con los de la versión correcta, se señala la línea, y al acertar aparece lo que se rompe: la primera pierde todos los puentes, la segunda inventa puentes en cada ciclo que se cierra en `u` y en cada arista de la raíz, y la tercera deja que una flecha hacia un componente ya cerrado baje un low y funda dos componentes en uno.

## Para cerrar

### [red](widgets/red.html){ target=_blank rel=noopener }

La fibra de un campus: quince edificios y veinte enlaces. Primero se marcan a mano los puntos únicos de falla, edificios y enlaces, con un botón por pieza que la quita del dibujo y vuelve a colorear los componentes que quedan. Después se corre `cortes`, se comprueba que `cortes_con_pila` devuelve lo mismo y se compara con lo marcado: cada fila trae lo que pasa al quitar la pieza y los valores `d` y `low` que la hacen punto de articulación o puente. Al final se puede agregar un enlace de prueba entre dos edificios y volver a correr para ver cuántos puntos únicos de falla quita.

## Para resolver en papel

Estos ejercicios entran en el material del parcial, igual que los ocho de las
diapositivas.

1. Sea $G$ el grafo dirigido con $V = \{0,1,\ldots,7\}$ y aristas
   $0 \to 3$, $1 \to 3$, $1 \to 4$, $2 \to 4$, $2 \to 7$, $3 \to 5$,
   $4 \to 5$, $4 \to 6$, $6 \to 7$. Calcule $v.d$ y $v.f$ recorriendo los
   vértices de $0$ a $7$ y las listas en orden creciente, y escriba el orden
   por $f$ decreciente. Debe salir $\texttt{[2, 1, 4, 6, 7, 0, 3, 5]}$.
   Corra Kahn con cola sobre el mismo grafo y explique por qué los dos
   órdenes son distintos y los dos son válidos.

2. Al grafo del ejercicio 1 se le agrega $7 \to 1$. Diga qué arista
   encuentra un vértice gris, escriba el ciclo que cierra y explique por qué
   la arista $1 \to 3$, que llega a un vértice ya visitado, no lo detectó
   antes.

3. Sea $T$ el grafo dirigido con $V = \{0,1,\ldots,8\}$ y aristas
   $0 \to 1$, $1 \to 2$, $1 \to 3$, $2 \to 0$, $2 \to 6$, $3 \to 4$,
   $4 \to 5$, $5 \to 3$, $5 \to 6$, $6 \to 7$, $7 \to 8$, $8 \to 6$. Ejecute
   Tarjan arrancando en $0$ con las listas en orden creciente. Escriba $d$ y
   $low$ de cada vértice y los componentes en el orden en que salen; deben
   ser $\{6,7,8\}$, $\{3,4,5\}$ y $\{0,1,2\}$. Señale las aristas que llegan
   a un vértice que ya salió de la pila.

4. Demuestre que si en $G^{SCC}$ hay una arista de $C$ a $C'$, Tarjan cierra
   $C'$ antes que $C$. Escriba la demostración en cuatro partes: teorema,
   estrategia, desarrollo y conclusión. Use el teorema del camino blanco
   sobre la raíz de $C$.

5. Sea $H$ el grafo no dirigido con $V = \{0,1,\ldots,9\}$ y aristas
   $0\text{--}1$, $0\text{--}2$, $1\text{--}2$, $1\text{--}3$, $3\text{--}4$,
   $3\text{--}5$, $4\text{--}5$, $4\text{--}6$, $6\text{--}7$, $6\text{--}8$,
   $7\text{--}8$, $8\text{--}9$. Corra la profundidad desde $0$ con las
   listas en orden creciente, escriba $d$ y $low$ de cada vértice y llene la
   tabla de aristas de árbol. Hay cinco puntos de articulación y tres
   puentes.

6. Demuestre que una arista de retroceso de un grafo no dirigido nunca es
   puente. Escriba la demostración en cuatro partes.

7. Al quitar un punto de articulación $v$, ¿cuántos componentes quedan?
   Muestre que, si $v$ no es raíz, son $1 + c$, donde $c$ es el número de
   hijos $w$ con $w.low \geq v.d$, y diga cuántos son si $v$ es la raíz.
   Modifique `revisar_hijo` para que cuente $c$ en una lista en lugar de
   marcar `es_art`, y compruebe la fórmula sobre el grafo del ejercicio 5.

8. Un grafo no dirigido conexo no tiene puentes. ¿Puede tener puntos de
   articulación? ¿Y un grafo conexo sin puntos de articulación, con al menos
   tres vértices, puede tener puentes? Dé un ejemplo o una demostración para
   cada pregunta.

## Problemas de juez

Los cuatro de las diapositivas, con el enunciado y el enlace de envío:

- UVa 796 — Critical Links:
  <https://onlinejudge.org/external/7/796.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=737>.
  Los puentes de una red, ordenados y con el extremo menor primero.
- UVa 315 — Network:
  <https://onlinejudge.org/external/3/315.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=251>.
  Cuántos puntos de articulación hay; la lectura trae los vecinos de cada
  vértice en una línea de largo variable.
- UVa 247 — Calling Circles:
  <https://onlinejudge.org/external/2/247.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=183>.
  Los círculos de llamadas son los componentes fuertemente conexos.
- UVa 11838 — Come and Go:
  <https://onlinejudge.org/external/118/11838.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2938>.
  La ciudad es fuertemente conexa si Tarjan saca un solo componente.

## De las clases anteriores

Las dos formas de la búsqueda en profundidad se practican en la
[página de la clase 6](../C6/Ejercicios.md); el orden topológico con Kahn, en
la [de la clase 8](../C8/Ejercicios.md), y Kosaraju, en la
[de la clase 9](../C9/Ejercicios.md).
