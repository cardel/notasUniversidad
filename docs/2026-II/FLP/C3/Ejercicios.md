# Ejercicios interactivos

Clase 3 — datatypes y árboles de sintaxis abstracta (22 de septiembre). Cada
enlace abre una actividad que se trabaja directo en el navegador, sin instalar
nada. Los ejemplos no son los de la sesión: mismo tema, ronda nueva.

Van en el orden en que la sesión ve los temas, y en cada tema hay de analizar
y de escribir. En las de analizar cada respuesta muestra su razón, se acierte
o no; en las de código, las pruebas dicen qué pasó y los tropiezos frecuentes
traen su explicación. El evaluador de la página entiende `define-datatype` y
`cases` con las mismas exigencias de DrRacket: un `cases` sin `else` tiene
que cubrir todas las variantes.

Dos lenguajes pequeños recorren la página completa, del datatype al parser:
los comandos de un robot, con la palabra clave adelante, y las expresiones
booleanas, que se escriben con el conectivo en medio, `(p and q)`.

## Un programa visto como dato

### [Leer el programa como lista](widgets/lista.html){ target=_blank rel=noopener }

Una expresión lambda guardada como lista de Scheme y tres bloques sobre ella.
Primero qué devuelve cada acceso con `car` y `cdr`, hasta un `(caadr (cadr
(caddr e)))` que trae una sola letra. Después qué hace `occurs-free?` con
listas que no son expresiones: una de un elemento, una de tres, un lambda sin
cuerpo; a veces sale un error y a veces una respuesta, y cuál de las dos no
depende de la lista. Al final el equipo cambia la representación y hay que
decir qué accesos fallan, cuáles siguen bien y cuáles devuelven otra cosa sin
avisar, que son los peores. La consola trae la expresión cargada.

## La forma `define-datatype`

### [¿Compila este datatype?](widgets/datatype.html){ target=_blank rel=noopener }

Nueve declaraciones con `define-datatype`, unas bien y otras con el error que
aparece cada semestre: el tipo con el mismo nombre que su predicado, dos
campos con el mismo nombre, un campo sin predicado. Después siete
expresiones sobre un datatype ya cargado, para predecir qué acepta el
constructor y qué rechaza: el número de campos, el predicado de cada uno y
la lista que `list-of` revisa elemento por elemento. Lo que se juzga es lo
que DrRacket responde, con sus mensajes.

### [Escribir el datatype](widgets/declarar.html){ target=_blank rel=noopener }

Tres gramáticas y, para cada una, la declaración que le corresponde: las
expresiones booleanas, con dos variantes sin campos y tres recursivas; un
directorio, donde los puntos suspensivos piden `list-of`; y las s-lists de
EOPL §2.4, que son dos tipos que se nombran el uno al otro. Los nombres los
da la gramática; el predicado de cada campo lo decide quien declara, y las
pruebas construyen valores y preguntan por los predicados.

## Análisis por casos con `cases`

### [Recorrer con cases](widgets/cases.html){ target=_blank rel=noopener }

Un datatype nuevo, los comandos de un robot que avanza, gira y repite un
bloque de comandos, y cuatro procedimientos que lo analizan por casos:
cuánto avanza en total, cuántas veces gira, qué tan hondo se anidan los
`repite` y cómo se desdoblan en una lista plana. Los valores no son listas,
así que la única forma de abrirlos es `cases`, y la variante con `list-of`
obliga a recorrer la lista de comandos con un procedimiento aparte.

### [Evaluar y reescribir](widgets/evaluar.html){ target=_blank rel=noopener }

Cuatro procedimientos con `cases` sobre las expresiones booleanas. Los dos
primeros devuelven un valor de Scheme: `evalua`, con una lista de los
símbolos que valen verdad, y `negaciones`, que cuenta. Los dos últimos
devuelven otra expresión booleana, reconstruida variante por variante:
quitar las dobles negaciones y empujar el `not` hasta las hojas con las
leyes de De Morgan. En esos dos la cláusula del `not` lleva un `cases`
anidado, y el árbol que se espera va dibujado bajo cada prueba.

## De la gramática al tipo de dato

### [¿Cuál datatype le corresponde?](widgets/gramatica.html){ target=_blank rel=noopener }

Producciones de varios lenguajes pequeños, `print`, `set`, `while`, `call`,
`lambda` con varios parámetros, un condicional con signos en medio, y para
cada una tres variantes candidatas: una sigue la receta y las otras dos
guardan una palabra clave como campo, pierden un no terminal o ponen un
`list-of` donde no va. Después al revés, de la variante a la producción, y
al final el predicado que lleva cada campo: `number?`, `symbol?`, el del
propio tipo o `list-of` de alguno de ellos.

### [Del árbol a la gramática](widgets/desde-arbol.html){ target=_blank rel=noopener }

La receta al revés, que es lo que se hace al extender un lenguaje: los
árboles están dibujados y lo que falta es la gramática. Primero una
producción por árbol, en un lenguaje de figuras: cuántos hijos tiene el nodo
y si cada uno es una hoja con un número, una hoja con una palabra, otro nodo
del mismo lenguaje o el nodo `lista`. Después la gramática completa de un
lenguaje de listas de reproducción, leída de varios de sus árboles a la vez,
que es lo que hace falta para saber si una lista puede ir vacía o si un campo
admite más variantes de las que se ven en uno solo. Al final, un árbol que la
gramática no genera y la producción que hay que agregarle.

## Árboles de sintaxis abstracta

### [¿Cuál árbol es?](widgets/arboles.html){ target=_blank rel=noopener }

Programas del lenguaje de la sesión y tres árboles candidatos para cada uno,
dibujados; después al revés, un árbol dibujado y tres programas. Los dos
errores que acompañan a cada respuesta correcta son los que aparecen cada
semestre: hojas sin envolver en su variante, palabras clave que sobreviven en
el árbol, campos en otro orden.

### [Construir el árbol a mano](widgets/construir.html){ target=_blank rel=noopener }

Tres programas del lenguaje del curso y, para cada uno, la expresión con los
constructores que arma su árbol: una resta dentro de otra, un `if` con una
resta en la prueba y dos `let` anidados, donde el identificador que se
declara va suelto y el que se usa va en `var-exp`. El árbol esperado va
dibujado y, si el código construye otro, aparece al lado. Después la
dirección contraria: un lenguaje de figuras del que solo se tienen los
árboles, y hay que escribir el `define-datatype` que los construye, contando
los hijos de cada nodo y mirando qué es cada uno. Al cierre, `hojas`, el
recorrido que devuelve las hojas del árbol de izquierda a derecha.

## El parser, el unparser y la ida y vuelta

### [Parser y unparser de comandos](widgets/parser.html){ target=_blank rel=noopener }

De la sintaxis concreta del robot al datatype y de vuelta. Cada prueba de
`parse-cmd` muestra dibujado el árbol que se espera según la gramática; si el
código construye otro, aparece al lado el que construyó, para comparar forma
contra forma. Primero `avanza` y `gira`, después el `repite` con su lista de
comandos, y al cierre `unparse-cmd`, con la prueba de que parsear y
desparsear devuelve el programa con el que se empezó.

### [Parser y unparser con sintaxis infija](widgets/parsear.html){ target=_blank rel=noopener }

Las expresiones booleanas se escriben con el conectivo en medio, y el parser
tiene que mirar `(cadr d)` en lugar de `(car d)`. Primero las hojas y el
`not`, donde `true` y `false` son símbolos que la gramática nombra aparte;
después `and` y `or` en medio; al cierre `unparse-bexp` y la ida y vuelta.
Los árboles dibujados muestran que `(p and q)` tiene la misma forma que un
`(- x 1)` del lenguaje del curso: la sintaxis abstracta no sabe dónde iba la
palabra.
