# Ejercicios interactivos

Ocho ejercicios para el navegador, organizados por los temas de la sesión y en
el mismo orden; el último junta todo sobre un sitio de quince páginas. Ninguno
usa los grafos de las diapositivas: ni el dirigido de ocho vértices que se
traza entero en clase, ni el no dirigido de tres componentes, ni los dos
triángulos unidos por una arista, ni los grafos de los ocho ejercicios
propuestos. Los temas y las técnicas son los mismos; los grafos, los vértices y
los números son otros.

## Recuento

### [tiempos](widgets/tiempos.html){ target=_blank rel=noopener }

Los dos relojes de la búsqueda en profundidad sobre un grafo dirigido, con
`d/f` escrito encima de cada vértice mientras corre y el color pasando de
blanco a gris al entrar y de gris a negro al salir. Antes de ejecutar se
predice cuántos árboles tendrá el bosque, que es cuántas veces se ejecuta la
línea del arranque; tres grafos, de uno a cuatro árboles. La tabla de la
derecha acumula los vértices en el orden en que terminan, y al final la misma
lista invertida es la que Kosaraju usa para arrancar. La tarjeta del cierre
pregunta cuál vértice tiene el `f` más grande y por qué tiene que ser una raíz.

## Conectividad

### [conexo](widgets/conexo.html){ target=_blank rel=noopener }

Cinco grafos, dos sin dirección y tres con ella, y cinco opciones de
clasificación de las que dos solo valen en el caso no dirigido y tres solo en
el dirigido. Escoger de la columna equivocada deja su propia explicación: en un
grafo no dirigido no hay direcciones que ignorar, y en uno dirigido decir
«conexo» a secas deja la pregunta a medias. Después se cuenta el número de
componentes, con un aviso aparte cuando el número escrito es el de los débiles
en un grafo donde se piden los fuertes.

## Componentes conexos con los recorridos

### [componentes](widgets/componentes.html){ target=_blank rel=noopener }

El mismo grafo con las tres versiones del recorrido: profundidad recursiva,
profundidad con pila explícita y amplitud. Se ve la lista `actual` llenándose y
cada componente estrenando color, y la tabla registra dónde arrancó cada uno y
en qué orden quedaron sus vértices. Tres grafos, uno de ellos de una sola
pieza; se predice cuántos componentes hay antes de ejecutar. La tarjeta del
final pide correr las tres versiones y decir en qué se diferencian las salidas,
con los tres resultados a la vista para comprobarlo.

## Puntos de articulación y puentes

### [cortes](widgets/cortes.html){ target=_blank rel=noopener }

Cada vértice y cada arista traen un botón que la quita del dibujo y vuelve a
colorear lo que queda, que es la definición ejecutada. Hay que marcar cuáles
vértices son puntos de articulación y cuáles aristas son puentes; la
comprobación dice, por cada uno, cuántos componentes deja al quitarlo, y por
cada arista que no es puente, el camino que sobrevive y que la mete en un
ciclo. Tres grafos: uno con un punto de articulación que no tiene ningún puente
al lado, uno sin ninguno de los dos y un árbol donde todas las aristas son
puentes.

## Componentes fuertemente conexos

### [transpuesto](widgets/transpuesto.html){ target=_blank rel=noopener }

Un grafo de nueve vértices con un botón que voltea todas las flechas y otro que
pinta los componentes: los colores no se mueven al voltear. El algoritmo se
corre sobre los dos grafos y devuelve los mismos grupos en orden contrario.
Escogiendo dos vértices se dibuja el camino que los une en G y el mismo camino
leído de derecha a izquierda, que es el que los une al revés en el
transpuesto. Al final, el grafo de componentes: cuántas aristas tiene, de qué
arista de G sale cada una y qué es lo que le impide tener un ciclo.

## El algoritmo de Kosaraju

### [kosaraju](widgets/kosaraju.html){ target=_blank rel=noopener }

Las dos pasadas seguidas línea por línea, con el dibujo cambiando de G a Gᵀ
cuando arranca la segunda. En la primera los vértices se ennegrecen al entrar a
`orden`; en la segunda cada llamada que encuentra su vértice sin asignar pinta
un componente entero. Antes de ejecutar se predice cuántos componentes hay y
con cuál vértice arranca `ord`. Comparar el contador de la línea que asigna con
el de la línea que pregunta muestra cuántas llamadas se devuelven sin hacer
nada. Tres grafos: uno con cuatro componentes, uno fuertemente conexo y uno
donde ningún par se junta.

## Errores comunes

### [errores](widgets/errores.html){ target=_blank rel=noopener }

Tres versiones del algoritmo con una línea cambiada cada una, sobre un grafo de
siete vértices y cuatro componentes. Ninguna revienta: las tres devuelven una
lista de listas que parece una respuesta. La que recorre G en vez de Gᵀ
devuelve un solo grupo con los siete vértices; la que olvida `orden.reverse()`
junta dos componentes que estaban separados y deja un tercero suelto; la que
pasa `u` en vez de `g` devuelve siete grupos de un vértice. Antes de comprobar
la segunda se predice cuántos grupos entrega.

## Todo junto, sobre un grafo grande

### [red](widgets/red.html){ target=_blank rel=noopener }

El último y el más exigente, para cuando los anteriores ya salen solos. Quince
páginas de un sitio y veintitrés enlaces: demasiado para seguir la traza de
memoria. Se predice cuántos bloques de páginas mutuamente alcanzables hay, se
avanza por `ord` llamada por llamada viendo cuáles se tachan y cuáles pintan un
bloque, se cuenta y se dibuja el grafo de componentes, y se compara con el
mismo sitio sin las direcciones, que resulta ser de una sola pieza y sin ningún
punto de articulación. Un solo enlace de vuelta, 14 → 0, deja el sitio entero
en un bloque.

## Para resolver en papel

Estos ejercicios entran en el material del parcial, igual que los ocho de las
diapositivas.

1. Sea $G$ el grafo dirigido con $V = \{0,1,\ldots,6\}$ y aristas
   $0 \to 2$, $0 \to 5$, $1 \to 3$, $2 \to 4$, $3 \to 5$, $4 \to 0$,
   $5 \to 6$, $6 \to 1$. Calcule $v.d$ y $v.f$ de cada vértice recorriendo los
   vértices de $0$ a $6$ y las listas de adyacencia en orden creciente.
   Escriba la expresión de paréntesis del recorrido, clasifique las dos
   aristas que no son del árbol y dé el orden por finalización decreciente.
   Debe salir $\texttt{[0, 5, 6, 1, 3, 2, 4]}$.

2. Sea $H$ el grafo no dirigido con $V = \{0,1,\ldots,9\}$ y aristas
   $0\text{--}7$, $7\text{--}3$, $3\text{--}0$, $1\text{--}8$, $8\text{--}5$,
   $2\text{--}6$, $6\text{--}9$, $9\text{--}4$, $4\text{--}2$. Liste sus
   componentes conexos y diga en qué orden los encuentra
   $ComponentesConexosDFS$ recorriendo los vértices de $0$ a $9$. Después
   escriba el orden de visita dentro del componente del $2$ con la versión
   recursiva y con la de pila explícita, y explique por qué difieren sin que el
   reparto cambie.

3. Sea $J$ el grafo no dirigido con $V = \{0,1,\ldots,7\}$ y aristas
   $0\text{--}1$, $1\text{--}2$, $2\text{--}0$, $2\text{--}3$, $3\text{--}4$,
   $4\text{--}5$, $5\text{--}6$, $6\text{--}3$, $6\text{--}7$. Liste los puntos
   de articulación y los puentes. Para cada pieza de la lista diga cuántos
   componentes quedan al quitarla y cuáles son; para cada una que no esté, dé
   el camino o el ciclo que la salva. Hay tres puntos de articulación y dos
   puentes.

4. Demuestre que si $G$ es fuertemente conexo entonces $G^{T}$ también lo es.
   Escriba la demostración en cuatro partes: teorema, estrategia, desarrollo y
   conclusión. Después diga si vale el recíproco y por qué.

5. Un grafo dirigido con $n$ vértices tiene exactamente dos componentes
   fuertemente conexos, uno con $n-1$ vértices y otro con uno solo. ¿Cuál es el
   mínimo número de aristas que puede tener? Justifique por qué con una menos
   no alcanza y dibuje un ejemplo con $n = 5$.

6. Sea $K$ el grafo dirigido con $V = \{0,1,\ldots,7\}$ y aristas
   $0 \to 1$, $1 \to 2$, $2 \to 0$, $2 \to 3$, $3 \to 4$, $4 \to 5$,
   $5 \to 3$, $5 \to 6$, $6 \to 7$, $7 \to 6$, $4 \to 7$. Ejecute Kosaraju dos
   veces: una con las listas de adyacencia en orden creciente y otra con las
   mismas listas en orden decreciente. Escriba las dos listas $ord$, que salen
   distintas, y los componentes de cada corrida, que salen iguales. Explique
   qué parte de la demostración garantiza que el resultado no dependa de ese
   orden.

7. Escriba `es_fuertemente_conexo(grafo)` en $\Theta(V+E)$ sin calcular todos
   los componentes. Dos recorridos bastan: uno sobre $G$ y otro sobre $G^{T}$,
   los dos desde el mismo vértice. Diga qué se concluye si el primero alcanza
   todos los vértices y el segundo no, y por qué elegir el vértice de partida
   es indiferente.

8. Un grafo dirigido tiene $k$ componentes fuertemente conexos. ¿Cuál es el
   mínimo número de aristas que hay que agregar para dejarlo fuertemente
   conexo? Cuente en $G^{SCC}$ cuántos componentes no reciben ninguna arista y
   cuántos no envían ninguna, y pruebe su respuesta sobre el sitio de quince
   páginas del último ejercicio interactivo.

## De las clases anteriores

Las dos formas de la búsqueda en profundidad y su costo, que los algoritmos de
hoy reutilizan sin cambiarles una línea, se practican en la
[página de la clase 6](../C6/Ejercicios.md); el orden por finalización y el
cálculo que lo produce, en la [de la clase 8](../C8/Ejercicios.md).
