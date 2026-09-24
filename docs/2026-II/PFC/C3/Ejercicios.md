# Ejercicios interactivos

Doce ejercicios para recorrer en el navegador, organizados por los temas de la
sesión y en su mismo orden. Cambia la mecánica respecto a las sesiones
anteriores: aquí nada se muestra antes de que usted lo produzca. Hay tablas
que se llenan de memoria, reducciones en las que se elige el paso siguiente,
una traza escrita con un error escondido y un banco de pruebas donde se
arma la llamada que delata un error. Los valores contra los que se comprueba
todo salieron de correr el código de la sesión.

Lo que se conserva en esta sesión es **el esqueleto**: la condición de parada,
el cero y la llamada recursiva de `suma` no cambian nunca. Lo que cambia son
dos parámetros, `f` y `prox`, y buena parte de los ejercicios consiste en no
confundir cuál hace qué.

## Motivación: un esquema que se repite

### [esqueleto](widgets/esqueleto.html){ target=_blank rel=noopener }

Tres sumas escritas en matemáticas, no en código: $1^3 + 2^3 + 3^3 + 4^3$,
$2 + 5 + 8 + 11 + 14$ y $1 + 2 + 4 + 8 + 16$. Para cada una hay que escoger
el par `f` / `prox` entre seis literales. Los distractores están puestos para
que el que confunde el término con el avance se entere: `x => x + 3` como `f`
compila, da un número y está mal. La tercera suma muestra que `prox` no tiene
por qué sumar.

## Funciones como parámetro

### [traza](widgets/traza.html){ target=_blank rel=noopener }

`suma(x => x * x, x => x * 2, 1, 20)` como tabla, una fila por llamada, con
las columnas `a`, `f(a)` y `prox(a)` vacías, incluido el `a` con el que se
detiene y el total. Se llena primero y se corre después. Los términos son 1,
2, 4, 8 y 16, y el 32 ya no entra. La segunda llamada,
`suma(x => 10 - x, x => x + 4, 1, 13)`, tiene términos negativos al final:
`f` puede devolver lo que quiera.

### [siguiente](widgets/siguiente.html){ target=_blank rel=noopener }

La reducción de `suma(cuadrado, suc, 1, 3)` por sustitución, pero no se
muestra: se construye. En cada uno de los trece pasos hay tres expresiones y
solo una es la que sigue. Algunos distractores cambian el valor (aplicar `f`
al término siguiente, avanzar `b`, cerrar con 1); otros no lo cambian y por
eso cuestan más (sustituir un cuerpo sin reducir antes sus argumentos, cerrar
la suma de afuera cuando la de adentro todavía no tiene dos valores). La
reducción crece hacia abajo: cada paso resuelto queda con su regla debajo y
la pregunta siempre al final, con el contador de equivocaciones.

### [trazaRota](widgets/trazaRota.html){ target=_blank rel=noopener }

Tres trazas escritas de `suma(x => x + 1, x => x + 2, 1, 7)`. Dos salieron
de versiones que compilan y dan un número equivocado; una está bien. Cada
traza es consistente consigo misma después del error, así que el total no
delata nada. Hay que marcar el primer paso equivocado, o decir que no hay
ninguno, y nombrar la versión: `sumaSinProx` o `sumaBaseUno`.

### [alReves](widgets/alReves.html){ target=_blank rel=noopener }

Las tres versiones están a la vista —`suma`, `sumaSinProx` y `sumaBaseUno`—
y lo que se arma es la llamada de prueba: se eligen `f`, `prox` y el rango, y
la tabla dice cuál de los dos errores quedó al descubierto. Con los valores
por omisión (`x => x`, `x => x + 1`, rango `(1, 1)`) el de `sumaSinProx` no
aparece, y ahí está el ejercicio: de las 48 llamadas que se pueden armar, 21
lo dejan pasar, y son exactamente las que usan `prox = x => x + 1` o un rango
de un solo término. El 1 de más de `sumaBaseUno` se ve con cualquiera. Cierra
preguntando por qué ese `prox` vuelve invisible el error.

## Funciones anónimas

### [literales](widgets/literales.html){ target=_blank rel=noopener }

Cuatro preguntas donde el literal elegido tiene consecuencias sobre `suma`:
cuál `f` la deja siempre en 0, con cuáles `prox` revienta la pila (dos, y
ninguno de los dos *gira para siempre*, porque `suma` no es de cola), cuál par
da 9 con el rango `(1, 3)`, y cuánto da `suma(x => x + 2, x => x + 2, 1, 3)`,
donde el mismo literal hace dos trabajos distintos según la posición.

### [precedencia](widgets/precedencia.html){ target=_blank rel=noopener }

`(x, y) => x + y / 2` compila, tiene el tipo correcto y no es un promedio.
Siete llamadas para predecir y luego reducir operación por operación: los dos
promedios con `(4, 8)` y con `(7, 9)`, donde la división entera descarta el
resto, y tres literales con `*`, `+` y `-` mezclados sin paréntesis.

## Funciones que devuelven funciones

### [sumador](widgets/sumador.html){ target=_blank rel=noopener }

`sumador(n)` fabrica la función *sumar n*. Tres expresiones para predecir y
seguir por sustitución: `sumador(5)(3)`; `val s = sumador(5); val t =
sumador(s(1)); t(10)`, donde la segunda función se fabrica con el resultado
de aplicar la primera; y `aplicaDos(sumador(3), 4)`, donde la función se
fabrica una vez y se usa dos. Un chip muestra qué `n` guarda cada función en
cada paso.

### [suma2](widgets/suma2.html){ target=_blank rel=noopener }

`suma2(f, prox)` devuelve `sumaF` sin correrla. Tres predicciones sobre
`val g = suma2(x => x, x => x + 1)` seguido de `g(1, 3) + g(4, 5)`: el valor,
cuántas veces se evalúa el `if` de `sumaF` en total (siete, no cinco: la
llamada que cierra también lo evalúa) y cuántas de esas ocurren en la línea
del `val` (cero). Los contadores por línea lo confirman.

### [derivada](widgets/derivada.html){ target=_blank rel=noopener }

`derivada(cube, dx)(2)` no da 12, y se puede calcular exactamente cuánto se
aleja: $((2 + dx)^3 - 8) / dx = 12 + 6\,dx + dx^2$. Con esa expansión se
llenan los valores para `dx = 1`, `0.1` y `0.0001` y se comparan con lo que
imprime el programa. Después, `derivada(derivada(cube, 0.01), 0.01)(2)`:
`derivada` devuelve una función del mismo tipo que recibe, así que se puede
aplicar a su propio resultado, y el número que sale también se explica.

## Currificación

### [tipos](widgets/tipos.html){ target=_blank rel=noopener }

Cada grupo de paréntesis que se llena quita una flecha del tipo. Cinco
expresiones con cuatro tipos cada una, todas verificadas con el compilador:
`suma4(x => x)`, `suma4(x => x)(x => x + 1)`, `sumaC(2)`,
`derivada(cube, 0.1)` y `sumador` sin aplicar. Cierra con la trampa de
`restaC(5)`: fija el minuendo, no el sustraendo, y `menosCinco(3)` da 2.

### [reducirC](widgets/reducirC.html){ target=_blank rel=noopener }

El ejercicio de consolidación de la sesión, como tabla que se llena de abajo
hacia arriba: lo que devuelve cada llamada pendiente de
`reducirC((x, y) => x * y)(1)(x => x, x => x + 1)(1, 4)` y de
`reducirC((x, y) => x + y)(0)(x => x * x, x => x + 2)(1, 7)`. La última fila
devuelve `inicio` y cada una de arriba combina su `f(a)` con la de abajo. La
pregunta final es qué pasa si `inicio` fuera 0 en el producto, y la
respuesta explica por qué `op` e `inicio` van siempre juntos.
