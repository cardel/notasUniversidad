# Clase 16. Generalidades de los árboles · AyG C16

**Viernes 30 de octubre de 2026, de 7:00 a 9:00 el grupo B y de 9:00 a 11:00 el
grupo A, con el mismo contenido en las dos sesiones.**

El árbol venía saliendo como subproducto de otros algoritmos y aquí pasa a ser
el objeto de estudio. Un ejemplo de seis vértices y cinco aristas sostiene las
cuatro propiedades que se demuestran, y colgarlo de $a$, de $f$ y de $c$ da
alturas $3$, $4$ y $2$ con las mismas cinco aristas. Después el árbol se mira
como estructura de datos, con tres maneras de guardarlo, y como definición
recursiva de dos renglones, de la que `contarNodos` y `altura` salen en cinco
líneas cada una. Los cuatro recorridos se leen sobre un árbol de diez
nodos, que produce cuatro salidas distintas con los mismos valores. El cierre
es la excentricidad sobre un grafo de nueve vértices y diez aristas, con radio
$2$, diámetro $4$ y un centro de un solo vértice, y el problema UVa 10459, *The
Tree Root*, que pide precisamente ese centro.

<div class="grid cards" markdown>

-   :material-file-tree:{ .lg .middle } **Generalidades de los árboles**

    ---

    Las tres formas de mirar un árbol, las cuatro propiedades con su
    demostración, la terminología con raíz, la especificación recursiva con el
    árbol de una fórmula lógica, los cuatro recorridos con sus salidas, la
    excentricidad con radio, diámetro y centro, y cinco ejercicios.

    [:octicons-arrow-right-24: Entrar](./Generalidades%20de%20arboles.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con el árbol de seis vértices y sus tres raíces una
    al lado de la otra y el grafo de la excentricidad con los nueve valores.

    [:octicons-arrow-right-24: Abrir](./clase16-generalidades-arboles.pdf)

</div>

## Apuntes de la sesión

- Un grafo conexo con $n-1$ aristas es un árbol, y uno acíclico con $n-1$
  aristas también. Son las dos formas de reconocerlo sin recorrerlo entero.
- La raíz no viene con el grafo. Al escogerla cambian el parentesco, la
  profundidad de cada nodo y la altura; las aristas, las distancias entre
  vértices y cuáles son las hojas se quedan como estaban, salvo el vértice que
  quedó arriba.
- El caso base de `altura` vale $-1$ porque la altura se cuenta en aristas y un
  árbol de un solo nodo tiene altura $0$.
- Posorden es el recorrido que sirve cuando el valor de un nodo depende de sus
  hijos: al llegar a la raíz, los dos subárboles ya están resueltos.
- Una amplitud por vértice da todas las excentricidades en
  $O(|V| \cdot (|V| + |E|))$. En un árbol el diámetro sale con dos recorridos,
  y eso es lo que viene.

## Ejercicios

Las actividades interactivas del tema están en la
[página de ejercicios](../../../actividades/ayg-puj/arboles-generalidades/index.md){ target=_blank rel=noopener }:
reconocer árboles, colgar el mismo árbol libre de cada una de sus raíces,
seguir una función recursiva con la pila de llamados a la vista, producir
los cuatro recorridos y reconstruir un árbol con dos de ellos, y calcular
las excentricidades con el radio, el diámetro y el centro. Los cinco
ejercicios de las diapositivas, con sus pistas, están al final de la
[nota](./Generalidades%20de%20arboles.md#ejercicios).

## Antes de entrar

Los recorridos en profundidad y en amplitud, con el árbol que cada uno deja y
lo que cuesta recorrer un grafo, están en la
[nota de representaciones y recorridos](../C6/Representaciones%20y%20recorridos.md#busqueda-en-profundidad).
El recorrido por niveles de esta sesión es la misma amplitud sobre un grafo que
nadie guardó, como los de la
[nota de grafos implícitos](../C7/Grafos%20implicitos.md). Que las aristas de un
árbol sean todas puentes se entiende mejor con el criterio del valor low y con
el árbol de puentes de la
[nota de problemas de cortes](../C11/Problemas%20de%20cortes.md#el-arbol-de-puentes).
