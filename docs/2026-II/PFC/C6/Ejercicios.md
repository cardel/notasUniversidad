# Ejercicios · PFC C6

Doce ejercicios para recorrer en el navegador, organizados por los temas de la
sesión y en su mismo orden: primero las listas y lo que se construye con
ellas, después las tuplas, el ordenamiento por mezclas y las funciones de alto
orden. Ninguno muestra nada antes de que usted produzca algo: hay trazas que
se llenan paso a paso, valores que hay que predecir antes de verlos y patrones
entre los que hay que escoger. Lo que se compara en cada caso salió de correr
el código de la sesión.

La idea que los atraviesa es que una lista se define por sus dos
constructores, `Nil` y `::`, y que toda función que la recorra tiene un caso
por cada uno. Lo que cambia es quién escribe el recorrido: usted con
recursión, o `map`, `filter` y `fold`, que ya lo traen hecho.

## Construir y descomponer listas

### [construir](./widgets/construir.html){ target=_blank rel=noopener }

`1 :: 2 :: 3 :: Nil` se arma de derecha a izquierda, porque `::` asocia por la
derecha. El paso a paso lo muestra naciendo desde `Nil` y después descompone
una lista de frutas con `head`, `tail` e `isEmpty`. El contador de la última
línea deja ver cuántas veces se llega a `isEmpty` sobre la lista vacía.

## Reconocimiento de patrones con listas

### [patrones](./widgets/patrones.html){ target=_blank rel=noopener }

Los cuatro patrones del `match` están en el orden en que los escribe la
sesión, y el ejercicio da una lista concreta y pregunta cuál la captura. El
punto está en que `x :: Nil` y `x :: y :: Nil` son casos de uno y de dos
elementos, mientras `x :: xs` toma cualquier lista no vacía: por eso el orden
en que se escriben decide cuál gana.

## Funciones recursivas sobre listas

### [reversa](./widgets/reversa.html){ target=_blank rel=noopener }

`reversa` es recursión lineal: en cada marco queda pendiente un `++ List(x)`
que solo se resuelve al desarmar la pila. La traza cuenta las celdas que
recorre la concatenación, y ahí se ve de dónde sale el costo cuadrático con
una lista de cuatro elementos.

## Ordenamiento por inserción

### [insercion](./widgets/insercion.html){ target=_blank rel=noopener }

Antes de cada paso usted dice en qué posición va a quedar el elemento que se
inserta, y después lo comprueba. `insertar` recorre la parte ya ordenada hasta
hallar su sitio, y `iSort` la llama una vez por elemento.

## Tuplas en reconocimiento de patrones

### [sumarVec](./widgets/sumarVec.html){ target=_blank rel=noopener }

La suma de dos vectores se puede escribir sin tuplas, y queda larga. Con
`(u, v) match` los dos recorridos avanzan a la vez y cada caso dice qué hacer
con un par: dos listas vacías, dos con cabeza, o una de cada clase, que es el
error de tamaños distintos.

## Ordenamiento por mezclas

### [msort](./widgets/msort.html){ target=_blank rel=noopener }

El árbol de llamadas se recorre por niveles: baja partiendo la lista por la
mitad y sube mezclando. La frontera entre las tres cosas que hace la función
queda marcada en el código, y es la misma frontera del ejercicio de la tarde.

### [merge](./widgets/merge.html){ target=_blank rel=noopener }

`merge` aislada, suponiendo que las dos listas llegan ordenadas. En cada paso
usted elige qué cabeza sale, y el historial va armando la cadena de `::` que
devuelve la función. Si se equivoca, el mensaje dice qué comparación mandaba.

### [polimorfico](./widgets/polimorfico.html){ target=_blank rel=noopener }

Qué hay que cambiar para que `msort` sirva con cualquier tipo, y qué se rompe
si falta la función de comparación o si la llamada recursiva no la vuelve a
pasar. Con `x > y` en lugar de `x < y`, la misma función ordena al revés.

## Map y filter

### [mapFilter](./widgets/mapFilter.html){ target=_blank rel=noopener }

Con la misma lista de entrada se predice qué devuelve `map` y qué devuelve
`filter`. La diferencia que queda a la vista es la longitud: `map` transforma
cada elemento y conserva cuántos hay, `filter` conserva los elementos y cambia
cuántos quedan.

### [empaquetar](./widgets/empaquetar.html){ target=_blank rel=noopener }

`empaquetar` agrupa los elementos iguales que están seguidos, y para eso parte
la lista con `span` en cada vuelta. La traza muestra el grupo que se está
cerrando y lo que queda por recorrer.

## Reduce y fold

### [reduceFold](./widgets/reduceFold.html){ target=_blank rel=noopener }

Ocho preguntas sobre lo que más se enreda: con qué asociatividad acumula cada
uno. `reduceLeft` y `reduceRight` dan resultados distintos con la resta, y
`reduce` sobre la lista vacía falla, que es justo la razón de que `fold` pida
un valor inicial.

### [reversaFold](./widgets/reversaFold.html){ target=_blank rel=noopener }

La misma inversión del principio, ahora con `foldLeft` y sin recursión
escrita a mano. El acumulador crece por el frente, y esa es toda la diferencia
que hace falta para que la lista salga al revés.
