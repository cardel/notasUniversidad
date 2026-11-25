# Ejercicios · PFC C12

Siete actividades para recorrer en el navegador los temas de la sesión de
paralelismo de tareas y de datos. Van en el orden de la clase. Las cifras se
calculan en la página: cada recorrido corre el código de la sesión con los
parámetros del preset, y de ahí salen los conteos de `parallel`, las
aplicaciones de la operación y los valores que quedan en cada posición.

Los números que hay que calcular se preguntan con opciones, y cada una
equivocada explica en qué se equivocó quien la escogió. Cada actividad cierra
con un ejercicio que se resuelve solo, sin solución ni pistas en la página.

## MergeSort paralelo

### [mergeSort](../../../actividades/pfc/mergesort-paralelo/mergeSort.html){ target=_blank rel=noopener }

Ocho enteros ordenados con las dos mitades en `parallel` y la mezcla en
secuencial. Mover la cota de profundidad lleva el reparto de ninguna a siete
llamadas a `parallel`, y el tamaño de la lista que cae a `mergeSortSec` baja de
ocho a dos; las comparaciones se quedan en diecisiete con los cuatro valores de
`profMax`, que es lo que dice que el trabajo no cambió. La mezcla de la raíz se
lee fila por fila y cuesta siete comparaciones, no ocho, porque el resto de la
última mitad sale sin comparar. Cierra con el análisis del deck: `W(n)` es
`O(n log n)` y `D(n) = D(n/2) + O(n)` queda en `O(n)` porque la mezcla es
lineal, de modo que el tope de la ganancia es `O(log n)` y no sube al agregar
núcleos.

## Map paralelo

### [mapPar](../../../actividades/pfc/map-paralelo/mapPar.html){ target=_blank rel=noopener }

El reparto sobre un arreglo y sobre un árbol inmutable. Con ocho posiciones y
umbral 2 hay siete llamadas a `parallel` y ocho segmentos base de una posición;
con dieciséis y umbral 4, las mismas siete llamadas y segmentos de dos. La
condición del umbral es estricta, así que con ocho posiciones y umbral 8 la
primera llamada todavía parte y deja dos pedazos de cuatro. Sobre el árbol de
cuatro hojas la profundidad es su altura, dos cuando está balanceado y tres
cuando no, sin umbral que ajustar. Hay un ítem sobre si la función tiene que ser
asociativa, que es la precondición de `reduce` y no de `map`, y otro sobre el
umbral 1, donde la recursión no termina porque en un rango de una posición el
punto medio coincide con el extremo izquierdo.

## Reduce paralelo y operaciones asociativas

### [reducePar](../../../actividades/pfc/reduce-y-asociatividad/reducePar.html){ target=_blank rel=noopener }

El árbol del reparto sobre ocho elementos, con la suma, el máximo y la media de
dos valores. Las dos primeras dan lo mismo repartidas y encadenadas; la media
no, y la página calcula los dos resultados lado a lado: 3,875 contra 5,0625. El
contraejemplo de la clase sale medido, 2,25 agrupando por la izquierda y 1,75
por la derecha, y sobre las hojas 1, 2, 3, 4 la media da 2,5 repartida contra
3,125 encadenada. Incluye la clasificación de ocho operaciones entre asociativas
y no asociativas, con la resta y la división adentro, y la corrida de 1024
copias de 0,1, que se separan en 2,46 por 10 a la menos 12: de ahí que el código
de la sesión compare los reales con tolerancia y no con igualdad.

## Scan paralelo

### [scanPar](../../../actividades/pfc/scan-paralelo/scanPar.html){ target=_blank rel=noopener }

Las dos pasadas sobre el árbol de hojas 1, 2, 3, 4. El upsweep anota 3 en el
subárbol izquierdo, 7 en el derecho y 10 en la raíz; el downsweep baja los
prefijos 0, 1, 3 y 6, y en las hojas quedan 1, 3, 6 y 10. Con `a0 = 100` quedan
101, 103, 106 y 110, que es la forma de ver que el `a0` entra en todas. Lo que
decide el algoritmo es qué baja por la rama derecha, que es `a0` combinado con
el reducido del hermano izquierdo, y eso es lo que el upsweep dejó anotado. Las
dos pasadas juntas aplican la operación diez veces sobre cuatro hojas, tres al
subir y siete al bajar.

## Idea básica de paralelismo de datos

### [rangoPar](../../../actividades/pfc/paralelismo-de-datos/rangoPar.html){ target=_blank rel=noopener }

El `for` paralelo escrito con `parallel`. Con ocho índices y umbral 2 son tres
llamadas a `parallel` y cuatro tramos base; con diez índices y umbral 4 los
tramos quedan de 2, 3, 2 y 3, que no es un reparto parejo. La segunda mitad es
el caso que falla: `xs(i) = xs(i - 1) + 1` lee lo que otra iteración todavía no
escribió, y la página corre ese reparto con cuatro órdenes distintos de las
ramas y muestra los cuatro arreglos que quedan. En la posición 5 aparecen 8, 1 y
3 según el orden, así que la pregunta por su valor no tiene una respuesta que se
pueda calcular. Un ítem separa esta falla de la condición de carrera de la
sesión anterior: aquí no hay estado compartido que dos hilos actualicen a la
vez, hay una dependencia entre iteraciones.

## fold no se paraleliza, aggregate sí

### [aggregate](../../../actividades/pfc/fold-y-aggregate/aggregate.html){ target=_blank rel=noopener }

Por qué la firma `(B, A) => B` no sabe juntar dos acumuladores, y qué agrega
`aggregate` para que sí se pueda. Sobre `1..8` con umbral 2 son ocho
aplicaciones de `seqop` y siete de `combop`; con umbral 8, una sola de `combop`,
porque la guarda del umbral es estricta y el rango completo todavía se parte. La
última carta va sobre el conteo de palabras: la página parte la frase de la
clase en cada una de las 49 posiciones posibles y compara con el conteo
secuencial. Cuarenta y dos cortes dan las ocho palabras y siete dan siete, y son
los que caen justo después de una palabra. Eso es la tercera precondición
fallando, la de compatibilidad entre `seqop` y `combop`, y el ejercicio de
cierre pide el dato que le falta al `Conteo` para que el combinador sea
correcto.

## Colecciones paralelas en Scala

### [splitter](../../../actividades/pfc/colecciones-paralelas/splitter.html){ target=_blank rel=noopener }

El contrato que hay detrás de `.par`. El recorrido de `reduceConSplitter` sobre
ocho elementos con umbral 2 hace siete `split`, ocho `next` y siete
aplicaciones de la operación; con umbral 8, un solo `split` y seis de esas
aplicaciones ocurren recorriendo, no combinando. Con doce elementos y umbral 4,
al splitter de la derecha le quedan seis después del primer corte. Incluye la
clasificación de las operaciones de la jerarquía entre las que respetan el
contrato paralelo y las que no, con la regla de la firma: asimétrica o con orden
supuesto, no se reparte; simétrica con operación asociativa, sí.
