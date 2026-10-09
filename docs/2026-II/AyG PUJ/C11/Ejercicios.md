# Ejercicios · AyG C11

Ocho ejercicios para el navegador, organizados por los temas de la sesión y en
el mismo orden. Ninguno usa los grafos de las diapositivas: ni los tres
triángulos de diez vértices donde se construye el árbol, ni la ciudad de siete
intersecciones de UVa 610, ni la red de ocho estaciones de UVa 10765, ni los dos
grafos dirigidos de siete vértices del recuento, ni el mapa de siete planetas de
Interplanetary, ni el grafo $H$ de los ocho ejercicios propuestos. Los temas y
las técnicas son los mismos; los grafos, los vértices y los números son otros.

## Recuento

### [recuento](./widgets/recuento.html){ target=_blank rel=noopener }

Un grafo no dirigido con la profundidad ya corrida: el árbol en azul, las
aristas de retroceso punteadas en verde, el identificador de cada arista
encima y el `d` de cada vértice. Se escribe el `low` de todos y después se
marcan, de un lado, los vértices que son punto de articulación y, del otro, las
aristas que son puente. Cada `low` equivocado dice qué se contó mal: el `d` sin
mirar lo que lo baja, la arista de entrada tomada por retroceso, o el `low` del
otro extremo donde va su `d`. Cada marca trae la comparación con los números
reales y el conteo de pedazos que quedan al quitar la pieza. Tres grafos de
siete, ocho y diez vértices: el segundo tiene dos puntos de articulación y
ningún puente, y el tercero tiene tres puentes y cinco puntos de articulación.

## El árbol de puentes

### [arbolpuentes](./widgets/arbolpuentes.html){ target=_blank rel=noopener }

Las tres pasadas, una por una. Antes de empezar se predice cuántos nodos va a
tener el árbol. Después se marcan a mano los puentes, con la comparación
`low[w] > d[v]` explicada arista por arista; se escribe el `comp` de cada
vértice, y la comprobación distingue entre agrupar bien y numerar como lo hace
el código; y por último se ejecutan las pasadas dos y tres línea por línea, en
la versión recursiva y en la de pila explícita, con `comp` llenándose, la pila
a la vista y `T` creciendo arista por arista. El árbol queda dibujado con sus
conjuntos de vértices, la tabla de nodos contra aristas y una pregunta por
cuántos puentes hay que cruzar entre dos vértices dados. Tres grafos de nueve,
once y doce vértices, con árboles de tres nodos en camino, cuatro en estrella y
cinco en camino.

## Ejercicios resueltos

### [orientar](./widgets/orientar.html){ target=_blank rel=noopener }

UVa 610, Street Directions. Se predice cuántas líneas tiene la salida y después
se orienta la ciudad paso a paso, en las dos formas del recorrido. Las calles ya
orientadas aparecen con punta de flecha, y las que salen en los dos sentidos
quedan en rojo y curvadas.
Una tabla recoge calle por calle los sentidos emitidos y los cruza con la lista
de puentes, de modo que se ve que las de doble vía son exactamente esas y
ninguna más. Al final se elige una intersección y se mira a cuáles se llega por
la ciudad orientada. Tres ciudades de seis, ocho y siete intersecciones, con
ocho, once y nueve líneas de salida; la tercera no tiene ningún puente y queda
entera de una vía.

### [paloma](./widgets/paloma.html){ target=_blank rel=noopener }

UVa 10765, Doves and Bombs. La red con el `d/low` de cada estación a la vista.
Se predice el valor más alto y después se escribe el valor de cada una. La
comprobación lista, por vértice, la comparación de cada hijo y cuáles suman, y
señala aparte la raíz, que arranca
en 0 y cuenta hijos del árbol. Los diagnósticos separan los dos errores que más
aparecen: contar vecinos en lugar de hijos y usar la desigualdad estricta. Un
botón por estación la bombardea y recolorea los pedazos que quedan, para
contrastar la fórmula con la definición. Al final se arma la salida que pide el
juez, con el orden por valor decreciente y número creciente. Tres redes de
siete, nueve y once estaciones; los valores más altos son 2, 4 y 3, y la raíz
vale 2, 1 y 3.

### [capital](./widgets/capital.html){ target=_blank rel=noopener }

Capital, el único de los cuatro sobre un grafo dirigido. Tres países de ocho,
siete y nueve ciudades con carreteras de una sola vía. Se predice cuántas
candidatas hay y después se escribe, ciudad por ciudad, la menor de su
componente fuertemente conexo. La comprobación sostiene cada grupo con los dos
caminos que lo forman, y el diagnóstico separa las tres maneras de errarle:
agrupar bien y numerar por otro vértice, tomar una sola dirección por las dos, y
juntar ciudades sin camino entre ellas. Con los componentes puestos aparece la
condensación, que dice cuántas carreteras salen de cada nodo; se clasifica
componente por componente si sale alguna, y los que no tienen salida quedan
marcados. El segundo país tiene dos sumideros y la respuesta es `0`. Ahí es
donde más se pierde la gente, porque la tentación es juntar las ciudades de los
dos. Un botón por ciudad recorre las carreteras al revés y dice desde cuántas se
llega a ella, que es la definición del enunciado sin pasar por los componentes.
Las salidas son `2` con `7 8`, `0` y `1` con `9`.

### [interplanetary](./widgets/interplanetary.html){ target=_blank rel=noopener }

Interplanetary, el que trae influencia en los vértices. Tres mapas no dirigidos
de diez, nueve y once planetas, cada uno con su planeta de arranque. Se predice
cuántos alcanza el recorrido y después van los tres pasos: clasificar cada ruta
en puente o no, sumar la influencia de cada grupo que los puentes no separan, y
decidir puente por puente entre tres situaciones. Esas tres son que el recorrido
lo cruce, que lo mire y la condición falle, o que no llegue a mirarlo. Van en el
orden en que el recorrido se los encuentra, porque la decisión sobre uno depende
de haber cruzado el anterior. El primer mapa trae un puente donde los dos grupos
valen lo mismo, y la desigualdad estricta no lo deja pasar: detrás queda el
planeta de más influencia de todo el mapa, con 30, al que nunca se llega. En el
de nueve el recorrido no sale del anillo de arranque, y detrás del puente que
rechaza hay un planeta que vale 100. El tercero arranca en la mitad de la
cadena, cruza hacia el grupo de más influencia y rechaza los dos extremos. La
lista final se ordena por influencia del grupo, después por influencia propia y
por último
por número, y el veredicto separa el caso de acertar el conjunto y equivocar el
orden. Los alcanzados son ocho, cuatro y siete planetas.

## Cómo atacar estos problemas

### [atacar](./widgets/atacar.html){ target=_blank rel=noopener }

Tres enunciados cortos y, en cada uno, cuatro decisiones: quiénes son los
vértices y quiénes las aristas, si lo que se quita es un vértice o una arista,
cuál comparación lo decide y hasta dónde hay que llegar. Cada opción
equivocada explica qué se confundió: el criterio del puente aplicado a un corte
por vértice, la salvedad de la raíz olvidada, la comparación `low[u] > d[u]`
que no se cumple nunca, los componentes fuertemente conexos pedidos a un grafo
no dirigido. Un distrito de riego donde se tapona un canal, una red de torres
donde cae una torre y un dique donde se rompe un tramo; los tres se paran en
puntos distintos de los cinco pasos, y de los tres uno pide contraer y los
otros dos no.

## Errores comunes

### [errores](./widgets/errores.html){ target=_blank rel=noopener }

Tres versiones con una línea distinta de la correcta: `paloma_aux` con
`low[v] > d[u]` donde va `>=`, la misma función con el valor de la raíz
arrancando en `len(G[u])` en lugar de 0, y `etiquetar_con_pila` sin la
condición `i not in es_puente`. Cada una corre sobre un grafo pequeño y
devuelve algo con aspecto de respuesta; se comparan las dos salidas junto con
los `d` y los `low`, que coinciden en las tres, y después se señala la línea.
Al acertar aparece lo que se rompe: la primera deja en 1 el valor de dos
vértices cuyo hijo tiene un retroceso que llega hasta ellos mismos, la segunda
pone 4 donde va 1 y encabeza la lista con la estación equivocada, y la tercera
devuelve un componente donde van tres y deja dos lazos en `T`.

## Para resolver en papel

Estos ejercicios entran en el material del parcial, igual que los ocho de las
diapositivas.

Sean $K$ y $L$ los grafos no dirigidos siguientes:

- $K$, con $V = \{0, 1, \ldots, 9\}$ y aristas $0\text{–}1$, $0\text{–}2$,
  $1\text{–}2$, $2\text{–}3$, $3\text{–}4$, $3\text{–}5$, $4\text{–}5$,
  $5\text{–}6$, $6\text{–}7$, $6\text{–}9$, $7\text{–}8$, $8\text{–}9$.
- $L$, con $V = \{0, 1, \ldots, 6\}$ y aristas $0\text{–}1$, $0\text{–}3$,
  $1\text{–}2$, $2\text{–}3$, $3\text{–}4$, $3\text{–}6$, $4\text{–}5$,
  $5\text{–}6$.

1. Corra la profundidad de $K$ desde el $0$ con las listas en orden creciente,
   escriba $d$ y $low$ de cada vértice y llene la tabla de aristas de árbol con
   la comparación $w.low > v.d$. Deben salir dos puentes y cuatro puntos de
   articulación. Dibuje el árbol de puentes con sus nodos etiquetados por
   conjuntos de vértices y diga cuántos puentes hay que cruzar, como máximo,
   entre dos vértices de $K$.

2. En $L$ no hay ningún puente y el árbol de puentes es un solo nodo, pero $L$
   sí tiene un punto de articulación. Encuéntrelo, explique con $d$ y $low$ por
   qué lo es, y diga por qué el árbol de puentes no lo delata. Nombre la
   partición que sí lo señala y sobre qué reparte sus piezas.

3. A $K$ se le agrega la arista $2\text{–}5$. Diga qué puentes sobreviven,
   cuántos nodos pierde el árbol, cuál punto de articulación se pierde y por
   qué la arista nueva no es puente. Exhiba el ciclo que lo explica.

4. Demuestre que un nodo que es hoja del árbol de puentes de un grafo conexo
   corresponde a un conjunto de vértices del que sale exactamente un puente de
   $G$. Escriba la demostración en cuatro partes: teorema, estrategia,
   desarrollo y conclusión. Compruébela sobre las dos hojas del árbol de $K$.

5. Corra la profundidad de $K$ desde el $6$ en vez del $0$ y calcule el valor
   paloma de los diez vértices. Los $d$ y los $low$ cambian; los valores, no.
   Explique por qué, teniendo en cuenta que la fórmula tiene dos ramas
   distintas y que el vértice que era raíz pasa a usar la otra.

6. A $K$ se le agrega una segunda arista $5\text{–}6$, paralela a la que ya
   estaba. Diga qué queda de la lista de puentes, cuántos nodos tiene el árbol,
   cuántas líneas tiene la salida de UVa 610 y qué devolvería un programa que
   excluye la arista de entrada preguntando `v != padre` en lugar de comparar
   identificadores de arista.

## Problemas de juez

Los tres de las diapositivas, con el enunciado y el enlace de envío:

- UVa 610 — Street Directions:
  <https://onlinejudge.org/external/6/610.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=551>.
  El parámetro es la calle y la propiedad está en que un puente no puede ser de
  una vía. La trampa es el formato: línea en blanco tras el número de caso y
  una línea con `#` al cerrar.
- UVa 10765 — Doves and Bombs:
  <https://onlinejudge.org/external/107/10765.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1706>.
  El parámetro es la estación y la propiedad es el conteo de hijos con
  $w.low \geq v.d$. La trampa es doble: el `-1 -1` que cierra las vías y los
  diez mil vértices, que obligan a la pila explícita.
- UVa 796 — Critical Links:
  <https://onlinejudge.org/external/7/796.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=737>.
  Pide la lista de puentes ordenada, con el extremo menor primero. Sirve para
  probar la primera de las tres pasadas por separado antes de armar el árbol.

## De las clases anteriores

Los puntos de articulación y los puentes se presentan en la
[página de la clase 10](../C10/Ejercicios.md), junto con el valor `low` y el
algoritmo de Tarjan; las dos formas de la búsqueda en profundidad se practican
en la [de la clase 6](../C6/Ejercicios.md), y el orden topológico, en la
[de la clase 8](../C8/Ejercicios.md).
