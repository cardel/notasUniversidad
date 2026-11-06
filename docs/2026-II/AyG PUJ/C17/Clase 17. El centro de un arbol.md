# Clase 17. El centro de un árbol · AyG C17

**Viernes 6 de noviembre de 2026, de 7:00 a 9:00 el grupo B y de 9:00 a 11:00
el grupo A, con el mismo contenido en las dos sesiones.**

La sesión anterior dejó dos preguntas para investigar y esta arranca con ellas.
La primera, por qué el vértice más lejano a uno cualquiera es siempre un
extremo de un camino más largo, cierra la justificación de los dos recorridos.
La segunda abre el tema: si se quitan todas las hojas de un árbol y se repite,
lo que queda es el centro. El camino hasta ahí empieza por una cuenta de una
línea, $\varepsilon(\ell) = 1 + \varepsilon(p)$ para una hoja y su vecino, que
descarta a todas las hojas sin recorrer nada; sigue por el teorema de Jordan de
1869, cuya demostración se apoya en que el camino que realiza la excentricidad
de un vértice interno siempre termina en una hoja, de modo que al quitar la
capa entera todas las excentricidades bajan exactamente uno y el mínimo se
queda donde estaba; y termina en un algoritmo de doce líneas que no borra nada,
solo baja grados, como el orden topológico de Kahn. Sobre el árbol de once
vértices de la sesión anterior el pelado da tres vueltas y deja el vértice $0$,
el mismo centro que daban las once excentricidades, en $\Theta(n)$ en vez de
$\Theta(n^2)$. El cierre es la cuenta que traduce lo que el algoritmo devuelve:
las vueltas son $\lfloor \mathit{diam}/2 \rfloor$ y no el radio, cosa que el
camino de cuatro vértices deja ver de inmediato, y el radio y el diámetro salen
según queden uno o dos centros. El problema UVa 11695, *Flight Planning*, cierra
la sesión usando las tres medidas a la vez.

<div class="grid cards" markdown>

-   :material-file-tree:{ .lg .middle } **El centro de un árbol**

    ---

    La cuenta que descarta una hoja, el teorema de Jordan con su demostración,
    el algoritmo de pelar capas bajando grados, la traza sobre el árbol de once
    vértices, la regla que lleva de las vueltas al radio y al diámetro con sus
    dos casos, los cuatro errores que lo rompen y cuatro ejercicios.

    [:octicons-arrow-right-24: Entrar](./El%20centro%20de%20un%20arbol.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con el árbol de once vértices pelado capa por capa,
    la tabla del camino de cinco donde cada excentricidad baja uno, el código
    con los grados y el contraejemplo del camino de cuatro.

    [:octicons-arrow-right-24: Abrir](./clase17-centro-arbol.pdf)

</div>

## Apuntes de la sesión

- Una hoja $\ell$ con vecino $p$ cumple $\varepsilon(\ell) = 1 + \varepsilon(p)$,
  porque todo camino que sale de $\ell$ pasa por $p$. Con tres vértices o más,
  eso basta para descartarla como centro sin recorrer el árbol.
- El camino que realiza la excentricidad de un vértice interno termina siempre
  en una hoja: si terminara en un interno, su otro vecino alargaría el camino.
- Al quitar todas las hojas de golpe, la excentricidad de cada sobreviviente
  baja exactamente uno. Por eso el radio cambia y el centro no.
- El algoritmo no borra vértices: baja el grado del vecino y marca con grado
  cero al que se fue. Es el mecanismo del orden topológico de Kahn, con el
  grado a secas y la condición de llegar a uno.
- La capa se quita completa antes de mirar la siguiente. Si los vértices nuevos
  entran a la lista que se está recorriendo, el árbol se consume de un lado.
- Las vueltas son $\lfloor \mathit{diam}/2 \rfloor$, no el radio. Coinciden solo
  cuando queda un centro, que es cuando el diámetro es par.
- Nunca quedan más de dos centros: con diámetro par la mitad del camino más
  largo cae en un vértice y con diámetro impar cae entre dos.
- El pelado cuenta pasos, no pesos. En un árbol con longitudes sirven los dos
  recorridos, no el pelado.

## Ejercicios

Las actividades interactivas del tema están en la
[página de ejercicios](../../../actividades/ayg-puj/centro-arbol/index.md){ target=_blank rel=noopener }:
descartar candidatos sin calcular, predecir la fila de excentricidades después
de pelar una capa, seguir el algoritmo línea por línea con los grados a la
vista, traducir vueltas a radio y a diámetro en cuatro árboles, decidir qué le
pasa a cuatro versiones cambiadas del código, y probar cada corte del problema
de juez para ver por qué los dos pedazos se vuelven a unir por sus centros. Los ejercicios de la sesión,
con sus pistas y los dos problemas de juez, están al final de la
[nota](./El%20centro%20de%20un%20arbol.md#ejercicios).

## Antes de entrar

La excentricidad, el radio, el diámetro y el centro, con los dos recorridos que
dan el diámetro de un árbol, están en la
[nota de generalidades de los árboles](../C16/Generalidades%20de%20arboles.md#la-excentricidad).
El mecanismo de ir bajando grados y sacar por capas es el mismo del algoritmo
de Kahn, en la
[nota de orden topológico](../C8/Orden%20topologico.md#el-algoritmo-de-kahn). Que las aristas de un
árbol sean todas puentes, que es lo que hace que quitar una hoja desconecte
solo a esa hoja, está en la
[nota de problemas de cortes](../C11/Problemas%20de%20cortes.md#el-arbol-de-puentes).
