# Clase 19. Árboles de segmentos · AyG C19

**Viernes 20 de noviembre de 2026, de 7:00 a 9:00 el grupo B y de 9:00 a 11:00
el grupo A, con el mismo contenido en las dos sesiones. Es la última sesión del
curso.**

La sesión arranca con una pregunta que se repite: cuánto suman las posiciones
de $3$ a $8$ del arreglo `8 5 3 9 0 1 2 3 4 9`, y detrás de ella otras $Q$
preguntas sobre el mismo arreglo. Recorrer el rango da $19$ y cuesta $O(N)$
cada vez, así que con $N$ y $Q$ de cien mil son diez mil millones de sumas. Las
sumas acumuladas responden en una resta, $P[8] - P[2] = 35 - 16 = 19$, y se
caen apenas el arreglo se mueve: poner $A[3] = 10$ deja siete de los diez
prefijos con un valor viejo. El árbol de segmentos es el que sostiene la
consulta y la actualización a la vez, las dos en $O(\log N)$. Cada vértice
guarda el resultado de la operación sobre un intervalo, la raíz cubre el
arreglo entero y las hojas una posición; con $N = 10$ son $2N-1 = 19$ vértices
colgados de un arreglo de $4N$. La consulta parte el rango en los vértices que
ya quedan contenidos y la actualización recalcula solo la rama de ancestros de
una hoja. El cierre son dos problemas de juez: UVa 11235, donde el árbol no va
sobre el arreglo sino sobre los largos de las corridas de valores iguales, y
UVa 12086, que es el árbol de suma tal como quedó escrito.

<div class="grid cards" markdown>

-   :material-file-tree-outline:{ .lg .middle } **Árboles de segmentos**

    ---

    Las tres formas de responder una suma por rango con lo que cuesta cada
    una, qué guarda un vértice y qué se le pide a la operación, la numeración
    de los vértices y el porqué del arreglo de $4N$, la construcción, los tres
    casos de la consulta con la traza de $q(3,8)$, la actualización puntual,
    los dos problemas de juez con sus enunciados y hasta dónde llega la
    estructura.

    [:octicons-arrow-right-24: Entrar](./Arboles%20de%20segmentos.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con las anotaciones de clase. Trae la tabla de las
    tres formas lado a lado, el árbol dibujado nivel por nivel sobre el mismo
    arreglo de diez, la traza de $q(3,8)$ que crece un vértice por lámina con
    los colores de los tres casos, la compresión en corridas de *Frequent
    values* con sus tres consultas y la lectura de la entrada de
    *Potentiometers*. Después del código de la construcción va la lámina del
    tablero donde el árbol se armó a mano, vértice por vértice.

    [:octicons-arrow-right-24: Abrir](./clase19-arboles-segmentos.pdf)

</div>

## Apuntes de la sesión

- La medida que decide si una idea sirve: si el caso límite del enunciado pasa
  de cien millones de operaciones, esa idea se va a quedar corta. Con $N$ y $Q$
  de cien mil, recorrer el rango son $10^{10}$ sumas y las acumuladas son
  $2 \times 10^5$.
- Con el arreglo quieto las sumas acumuladas son imbatibles y no hace falta
  nada más. El árbol de segmentos no gana ninguna columna de la tabla por
  separado, y es el único que sostiene las dos últimas al tiempo.
- El árbol no existe como estructura enlazada: vive en un arreglo plano, igual
  que el montículo, con la raíz en el $0$ y los hijos de $v$ en $2v+1$ y
  $2(v+1)$. Lo que no se hereda del montículo es la propiedad de forma, porque
  aquí las hojas quedan en dos profundidades distintas cuando $N$ no es
  potencia de dos.
- La mitad derecha empieza en $m+1$ y no en $m$. Con $m$ la partición no
  avanza y el caso base nunca llega.
- Las hojas solo pueden quedar disjuntas o contenidas, nunca solapadas, porque
  en ellas $L = R$.
- Un vértice contenido se usa tal como está, sin bajar a sus hijos. En clase
  quedó como el sancocho: si uno ya encuentra el pollo hecho, lo usa.
- La actualización se parece a la búsqueda binaria en que baja por un solo
  lado. Lo que agrega es la recursión, que deja los ancestros en la pila de
  llamadas y los recalcula al regresar, y el padre se recalcula con sus dos
  hijos porque al volver no se sabe cuál de los dos cambió.
- El arreglo se pide de $4N$ posiciones porque la numeración deja huecos
  cuando $N$ no es potencia de dos. Con $N = 10$ el índice más grande que se
  usa es $24$, menor que $40$.
- En *Frequent values* lo difícil no es el árbol, es transformar el problema:
  el arreglo viene ordenado, así que los iguales quedan seguidos y lo que se
  consulta es el largo de las corridas. Tres cosas lo arman: contar las
  corridas, guardar los extremos de cada una, y resolver la consulta como una
  corrida cortada a la izquierda, otra cortada a la derecha y las completas del
  medio.
- Ese mismo problema enseña el borde: si todos los valores son distintos hay
  $N$ corridas de largo $1$ y la respuesta es siempre $1$; si todos son
  iguales hay una sola corrida y ninguna consulta llega al árbol.
- Las dos soluciones se enviaron en vivo. *Frequent values* pasó en Python.
  *Potentiometers* dio tiempo excedido en Python y pasó en C++, con el mismo
  algoritmo y la misma estructura.
- Actualizar un rango entero se sale del $O(\log N)$ y eso lo resuelve la marca
  pendiente, que se nombró sin desarrollarla. Los árboles de Fenwick quedaron
  nombrados igual.

## Ejercicios

Las actividades interactivas del tema están en la
[página de ejercicios](../../../actividades/ayg-puj/arboles-de-segmentos/index.md){ target=_blank rel=noopener }:
la construcción vértice por vértice, la consulta, la actualización, el valor
más frecuente de un rango, *Potentiometers* y la comparación contra el arreglo
de prefijos. Los dos problemas de juez, con su enunciado completo y el consejo
de cómo atacarlos, están al final de la
[nota](./Arboles%20de%20segmentos.md#ejercicios), junto con el código de la
sesión.

## Antes de entrar

Que un árbol de $n$ vértices tenga $n-1$ aristas y que la altura sea lo que
acota el recorrido está en la
[nota de generalidades de los árboles](../C16/Generalidades%20de%20arboles.md).
La forma de partir un rango en dos mitades y quedarse con una, que es la que
reaparece en la actualización, viene de la
[nota de búsqueda binaria](../C3/Busqueda%20binaria%20y%20biseccion.md).
