# Ejercicios interactivos

Cada enlace abre un ejercicio que se trabaja directo en el navegador. La
mecánica es la de siempre: prediga antes de ejecutar, recorra el algoritmo
paso a paso y busque el patrón en la traza. La diferencia está en el
destino: aquí el patrón no es una fórmula de conteo sino un **invariante**,
y una vez lo encuentre el ejercicio lo lleva, paso por paso, a la
demostración completa de correctitud.

## Invariantes de ciclo

### [computa](widgets/computa.html){ target=_blank rel=noopener }

Un while corto que suma y suma. Primero descubra qué calcula; después mire
la traza por estados: todo cambia de fila en fila, menos una relación entre
i y res que se conserva desde el arranque hasta el final.

Cuando la encuentre, el ejercicio abre los cuatro pasos del método
—inicialización, invarianza, éxito y terminación— y usted arma la
demostración respondiendo una pregunta por paso.

### [factorial](widgets/factorial.html){ target=_blank rel=noopener }

El mismo recorrido, con menos ayuda: prediga, ejecute, encuentre el
invariante entre cuatro candidatos (dos de ellos son trampas instructivas)
y complete los cuatro pasos.

Al final hay un experimento: llamar `factorial(-1)` y ver con sus propios
ojos por qué la precondición no es decoración sino la hipótesis que
sostiene la terminación.

## Divide y vencerás

### [mezclar](widgets/mezclar.html){ target=_blank rel=noopener }

Dos listas ordenadas entran, una sola sale. Ejecute copia por copia y
fíjese en lo que resultado cumple al comenzar cada vuelta: es un invariante
igual a los de la primera parte, y con él se certifica el ciclo que hace
funcionar todo el ordenamiento por mezcla.

Pruebe las tres parejas de listas: una deja «sobras» cuando la izquierda se
agota y otra tiene empates que el `<=` resuelve.

### [ordenar](widgets/ordenar.html){ target=_blank rel=noopener }

El ordenamiento por mezcla dibujado completo: baje partiendo la lista nivel
por nivel hasta el caso base y súbala mezclando con el ejercicio anterior.

La tabla acumula el trabajo de cada nivel y ahí aparece el patrón que
explica el n·lg n: todos los pisos del árbol mueven exactamente n
elementos, y pisos hay lg n.
