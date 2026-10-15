# Ejercicios · FLP C6

Clase 6 — procedimientos recursivos y `letrec` (13 de octubre). Cada enlace
abre una actividad que se trabaja directo en el navegador, sin instalar nada.
Las secciones siguen las de la sesión y en su mismo orden.

Los programas están escritos como los recibe el interpretador del curso:
`letrec fact(n) = if ==(n,0) then 1 else *(n, (fact sub1(n))) in (fact 5)`.
Las primitivas van antes del paréntesis y con comas: `+(x, y)`, `add1(n)`,
`==(n, 0)`. La aplicación lleva paréntesis y va sin comas, `(f z 2)`. El
ambiente inicial liga `x = 4`, `y = 2`, `z = 5` sobre otro eslabón con
`a = 4`, `b = 5`, `c = 6`. Los programas no son los de clase: mismo lenguaje,
ronda nueva. Lo que aquí se afirma sobre valores, ambientes, clausuras y
número de llamadas se midió corriéndolo contra el interpretador de
`6.Recursivos`.

## El factorial que no se encuentra a sí mismo

### [El procedimiento que no se encuentra a sí mismo](../../../actividades/flp/procedimientos-recursivos-letrec/encuentra.html){ target=_blank rel=noopener }

Cinco intentos de recursión con `let` y `proc`. El primero vale 7 y crea una
clausura sin aplicar nada; el segundo es el mismo procedimiento, ahora
aplicado, y se detiene. El cuarto es el que más cuesta: dos `fact` anidados,
el de afuera devolviendo 1 para todo, y el programa no falla —da 3— porque
la llamada recursiva encuentra al de afuera. El quinto muestra qué sí
funciona sin `letrec`: nombrar un procedimiento declarado antes.

## La expresión letrec

### [La producción de letrec](../../../actividades/flp/procedimientos-recursivos-letrec/gramatica.html){ target=_blank rel=noopener }

La producción nueva (EOPL §3.4) en los dos sentidos. Diez programas para
decidir si la gramática los genera, y hay sorpresas en las dos direcciones:
`letrec in +(x,1)` se parsea y vale 5, porque el `arbno` admite cero
declaraciones, mientras `letrec x = 5 in +(x,1)` no se parsea. Después, el
reparto de un programa en los cuatro campos de la variante, con el campo que
llega como lista de listas. Y al final, cuatro árboles que la gramática no
genera, con lo que habría que cambiarle para admitirlos: es lo que se hace al
extender un lenguaje, y la dirección en que casi nunca se practica.

## El ambiente extendido recursivo

### [El ambiente extendido recursivo](../../../actividades/flp/procedimientos-recursivos-letrec/marco.html){ target=_blank rel=noopener }

Qué guarda la variante nueva del tipo `ambiente` y qué deliberadamente no
guarda, y la línea donde se decide todo: el tercer campo de la clausura que
`apply-env` fabrica. Con `old-env` en ese campo el lenguaje quedaría igual
que con `let` y `proc`, y el programa de la primera actividad se detendría.
El tercer bloque mide una consecuencia que suele sorprender: la cadena de
ambientes tiene los mismos cuatro eslabones con `(g 3)` que con `(g 10)`,
porque los marcos de llamada cuelgan del marco recursivo y no uno del otro.

## Generación diferida de clausuras

### [Cuándo nace la clausura](../../../actividades/flp/procedimientos-recursivos-letrec/diferida.html){ target=_blank rel=noopener }

Tres cuentas se confunden todo el tiempo: cuántas declaraciones hay, cuántas
clausuras fabrica `apply-env` y cuántos procedimientos se aplican. Cinco
programas las separan. Uno declara un procedimiento y no crea ninguna
clausura; otro tiene por valor una clausura sin haber aplicado nada; en el
recursivo las clausuras son tantas como llamadas. Se predicen los números y
después se abre la traza.

## Ejemplo trabajado

### [La traza de una recursión](../../../actividades/flp/procedimientos-recursivos-letrec/trazas.html){ target=_blank rel=noopener }

Una de las cuatro vale 2 y no 50: su cuerpo nombra una variable libre que se
liga después de la declaración, en un `let` que la clausura nunca llega a ver.
Las otras tres tienen dos parámetros donde uno baja y el otro acumula, llegan
al caso base con el resultado ya armado, o tienen un parámetro que tapa una
ligadura de afuera. Al comprobar, la página abre la traza con el ambiente de
cada paso, la cadena en su punto más hondo y cada clausura con el marco que
capturó.

## Un letrec dentro de un let

### [Dibujar la cadena con un marco recursivo](../../../actividades/flp/procedimientos-recursivos-letrec/dibujar.html){ target=_blank rel=noopener }

Al revés que las anteriores: en vez de leer la cadena hay que construirla.
Para cada programa se señala un momento de la evaluación y se escriben los
eslabones que existen entonces, uno por línea y del más nuevo al más viejo;
la página los dibuja mientras se escriben y al comprobar señala la primera
diferencia con la del interpretador. Uno de los cuatro tiene dos marcos
recursivos en la misma cadena, y otro tiene `t` ligado a 10 y a 99 a la vez.

## Recursión mutua

### [Recursión mutua](../../../actividades/flp/procedimientos-recursivos-letrec/mutua.html){ target=_blank rel=noopener }

Varios procedimientos declarados en un mismo `letrec` que se nombran entre
sí. El mismo programa vale 100 empezando por uno y 0 empezando por el otro,
según cuál reciba el cero. Hay uno que encadena tres declaraciones sin que
ninguna se llame a sí misma, y en todos el marco recursivo es uno solo: tres
declaraciones no son tres marcos, son tres listas paralelas dentro del mismo.

## Implementación con listas

### [El ambiente recursivo con listas etiquetadas](../../../actividades/flp/procedimientos-recursivos-letrec/listas.html){ target=_blank rel=noopener }

Aquí se escribe código. Seis retos que construyen el TAD desde abajo: el
predicado y los cuatro extractores, el auxiliar que va del nombre a la
posición, el constructor que solo empaqueta, y el caso de `apply-env` que
decide entre fabricar la clausura y delegar en `old-env`. Las pruebas
distinguen capturar el marco de capturar el ambiente que extiende, así que
una implementación que confunda los dos falla y lo dice.

## Práctica y cierre

### [Contar consultas y extender el lenguaje](../../../actividades/flp/procedimientos-recursivos-letrec/cierre.html){ target=_blank rel=noopener }

La práctica final, también escribiendo código: el conteo de clausuras que
fabrica `apply-env` durante una recursión completa, modelado como función
para poder comprobarlo, y la extensión del lenguaje con una forma nueva: la
producción, la variante y la cláusula del evaluador.
