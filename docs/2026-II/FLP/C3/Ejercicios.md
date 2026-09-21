# Ejercicios interactivos

Clase 3 — datatypes y árboles de sintaxis abstracta (22 de septiembre). Cada
enlace abre una actividad que se trabaja directo en el navegador, sin instalar
nada. Los ejemplos no son los de la sesión: mismo tema, ronda nueva.

Van en el orden en que la sesión ve los temas. En las de analizar cada
respuesta muestra su razón, se acierte o no; en las de código, las pruebas
dicen qué pasó y los tropiezos frecuentes traen su explicación. El evaluador
de la página entiende `define-datatype` y `cases` con las mismas exigencias
de DrRacket: un `cases` sin `else` tiene que cubrir todas las variantes.

## La forma `define-datatype`

### [¿Compila este datatype?](widgets/datatype.html){ target=_blank rel=noopener }

Nueve declaraciones con `define-datatype`, unas bien y otras con el error que
aparece cada semestre: el tipo con el mismo nombre que su predicado, dos
campos con el mismo nombre, un campo sin predicado. Después siete
expresiones sobre un datatype ya cargado, para predecir qué acepta el
constructor y qué rechaza: el número de campos, el predicado de cada uno y
la lista que `list-of` revisa elemento por elemento. Lo que se juzga es lo
que DrRacket responde, con sus mensajes.

## Análisis por casos con `cases`

### [Recorrer con cases](widgets/cases.html){ target=_blank rel=noopener }

Un datatype nuevo, los comandos de un robot que avanza, gira y repite un
bloque de comandos, y cuatro procedimientos que lo analizan por casos:
cuánto avanza en total, cuántas veces gira, qué tan hondo se anidan los
`repite` y cómo se desdoblan en una lista plana. Los valores no son listas,
así que la única forma de abrirlos es `cases`, y la variante con `list-of`
obliga a recorrer la lista de comandos con un procedimiento aparte.

## Árboles de sintaxis abstracta

### [¿Cuál árbol es?](widgets/arboles.html){ target=_blank rel=noopener }

Programas del lenguaje de la sesión y tres árboles candidatos para cada uno,
dibujados; después al revés, un árbol dibujado y tres programas. Los dos
errores que acompañan a cada respuesta correcta son los que aparecen cada
semestre: hojas sin envolver en su variante, palabras clave que sobreviven en
el árbol, campos en otro orden.

## El parser, el unparser y la ida y vuelta

### [Parser y unparser de comandos](widgets/parser.html){ target=_blank rel=noopener }

De la sintaxis concreta del robot al datatype y de vuelta. Cada prueba de
`parse-cmd` muestra dibujado el árbol que se espera según la gramática; si el
código construye otro, aparece al lado el que construyó, para comparar forma
contra forma. Primero `avanza` y `gira`, después el `repite` con su lista de
comandos, y al cierre `unparse-cmd`, con la prueba de que parsear y
desparsear devuelve el programa con el que se empezó.
