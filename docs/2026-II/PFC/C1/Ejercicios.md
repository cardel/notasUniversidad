# Ejercicios interactivos

Los dos ejercicios de la sesión, para recorrer en el navegador. La mecánica
es la de siempre: prediga antes de ejecutar, avance paso a paso y busque qué
se conserva mientras todo lo demás cambia.

Aquí lo que se conserva es **el valor**. Cada paso reemplaza un trozo de la
expresión por otro que vale lo mismo, y por eso la reducción se puede leer al
revés y sigue siendo cierta. Evaluar no es ejecutar instrucciones: es
reemplazar hasta que no quede nada por reemplazar.

## [sustituir](widgets/sustituir.html){ target=_blank rel=noopener }

El modelo de sustitución sobre `sumaDeCuadrados(3, 2 + 2)`. Cada vuelta
resalta el único trozo que cambia, y el pie dice por qué ese y no otro.

La predicción inicial pide el número de reemplazos hasta llegar al valor.
Cuesta más de lo que parece, porque es fácil contar de a dos: reducir el
argumento y reemplazar la llamada son pasos distintos.

Mire el contador de cada definición. `cuadrado` está escrita una sola vez y
se usa dos: la definición no se copia al programa, se usa desde donde está.
Es la diferencia entre una función y una macro, y aquí se ve sin explicarla.

La tarjeta de opción única pregunta qué se reduce primero cuando hay una
llamada con argumentos a medio evaluar. La respuesta es el nombre de la
estrategia que Scala usa de manera predeterminada, y prepara el segundo
ejercicio.

## [evaluación](widgets/evaluacion.html){ target=_blank rel=noopener }

Las dos estrategias corriendo lado a lado sobre la misma expresión: por
valor a la izquierda, por nombre a la derecha. Avanzan a la vez, y la que
llega antes al valor se queda quieta mientras la otra sigue.

Los dos primeros presets terminan en el mismo valor por caminos distintos, y
`cuadrado(2 + 3)` es el más corto donde se ve la duplicación: como `x`
aparece dos veces en el cuerpo, por nombre el argumento se reduce dos veces.

El tercero es el que decide. En `primero(1, bucle)`, con `bucle` definido
como sí mismo, por valor hay que reducir el argumento antes de entrar a la
función y esa reducción no termina nunca; por nombre el argumento no se mira,
porque el cuerpo no lo usa, y el resultado es `1`. Dos estrategias, la misma
expresión, y una responde donde la otra se cuelga.

De ahí sale la relación que hay que poder enunciar al final: **cuando las dos
terminan dan el mismo valor**, y la diferencia está en cuáles terminan y en
cuánto trabajo repiten. Scala evalúa por valor por lo segundo; cuando se
quiere lo primero, se pide escribiendo el parámetro como `=> Int`.
