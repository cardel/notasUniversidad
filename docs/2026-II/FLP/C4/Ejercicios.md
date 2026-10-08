# Ejercicios · FLP C4

Clase 4 — del texto al resultado: el proceso completo del interpretador
(29 de septiembre). Cada enlace abre una actividad que se trabaja directo en
el navegador, sin instalar nada. Esta sesión es de entender qué hace cada
pieza, así que casi todo es analizar y predecir: las respuestas muestran su
razón, se acierte o no.

El lenguaje es el de la sesión —números, variables, las primitivas `+`, `-`,
`*`, `/`, `add1` y `sub1`, y `let`— con el ambiente inicial de dos eslabones:
`x = 1`, `y = 2`, `z = 3` sobre `a = 4`, `b = 5`, `c = 6`. Los programas no son
los de clase: mismo lenguaje, ronda nueva.
Lo que aquí se afirma sobre tokens, valores y número de llamadas se midió
contra el interpretador en Racket de la sesión.

## Del texto al resultado

### [Del texto al resultado](widgets/etapas.html){ target=_blank rel=noopener }

El reparto del trabajo entre las tres etapas: quién tira a la basura los
espacios y el comentario, quién decide que `-(x, 3)` es una primitiva con
dos operandos, quién averigua que `x` vale 1. Después, qué recibe y qué
produce cada una, y en qué etapa se detiene cada programa que no llega a dar
un valor: uno al que le falta el signo igual, uno que menciona una variable
que nadie ligó, uno al que le sobra un token al final.

## Interpretación y compilación

### [Interpretar o compilar](widgets/compilado.html){ target=_blank rel=noopener }

Seis situaciones que se notan al usar un lenguaje —un error en la última
línea que impide que corra la primera, un cambio que se prueba de inmediato,
un programa que hay que volver a construir para otra máquina— y de cuál de
los dos caminos es cada una. Después, qué parte del trabajo comparten los
dos y dónde se separan, y qué hace la máquina virtual en los casos híbridos.

## Scanner y parser

### [Lo que ve el scanner](widgets/tokens.html){ target=_blank rel=noopener }

Cuántos tokens deja cada programa, contando los paréntesis y las comas y sin
contar los espacios ni los comentarios. Después la clase de cada lexema,
donde aparece la sorpresa: `add1` no es un identificador sino un literal de
la gramática, y por eso no sirve como nombre de variable, mientras que
`zero?` sí sirve mientras esa primitiva no exista. Al final, el bocado más
largo: `x5` es un token y `5x` son dos, `-7` es uno y `- 7` son dos.

## SLLGEN: la especificación léxica y la gramática

### [Leer una especificación de SLLGEN](widgets/sllgen.html){ target=_blank rel=noopener }

Qué salida lleva cada regla léxica y qué significa cada una: `skip` para lo
que se reconoce solo para descartarlo, `symbol` y `number` para lo que se
convierte en un dato de Scheme. Después, qué cadenas reconoce la expresión
regular del identificador y cuáles no. Y al final, la variante que SLLGEN
genera de cada producción, con `separated-list`, con `arbno` y con literales
que no dejan campo.

## Un primer lenguaje interpretado

### [Los valores del lenguaje y el punto de entrada](widgets/valores.html){ target=_blank rel=noopener }

Los dos conjuntos que se deciden antes de escribir el evaluador: qué puede
resultar de evaluar una expresión y qué puede quedar ligado a un nombre. En
este lenguaje coinciden, y el bloque muestra qué los separa en cuanto el
lenguaje crece. Después, el punto de entrada: qué hace `evaluar-programa`
—que no es evaluar— y por qué `ambiente-inicial` es una constante y no un
procedimiento.

## Primitivas y evaluación

### [El interpretador por dentro](widgets/simulador.html){ target=_blank rel=noopener }

Cinco programas para predecir qué hará el interpretador antes de verlo:
cuánto vale, cuántas veces se llama a `evaluar-expresion`, cuántas búsquedas
hace en el ambiente, cuántos ambientes crea. Al comprobar, la página abre
las tres etapas de ese mismo programa: la tabla de tokens, el árbol dibujado
y la traza del evaluador fila por fila, con su ambiente y su valor, y con
las llamadas que consultan el ambiente marcadas. Al final queda la máquina
abierta para cualquier programa que se quiera escribir, incluidos los que
fallan: se ve en qué etapa se detienen.

### [El reparto del trabajo al evaluar](widgets/traza.html){ target=_blank rel=noopener }

Quién hace qué entre `evaluar-expresion`, `map`, `evaluar-primitiva`,
`operacion-prim` y `apply-env`, y por qué la primitiva no recibe el ambiente. Después el orden:
de tres secuencias de valores, cuál es la que va obteniendo el
interpretador. Y al final lo que la gramática deja pasar y el evaluador no
verifica: `add1(b, 99)` vale 6 sin decir nada y `-()` se cae con un
mensaje que habla de Racket.

## Ligadura local

### [La ligadura local](widgets/ambientes.html){ target=_blank rel=noopener }

En qué ambiente se evalúa cada parte de un `let`, que es toda la regla: la
expresión ligada en el de afuera y el cuerpo en el nuevo. Después, qué pasa
cuando el nombre ya existía, con cuatro programas donde la respuesta depende
de eso —`let b = *(b, b) in b` no es circular y vale 25—, y al final una
cadena de tres eslabones sobre el inicial, con un nombre repetido y una
ligadura que queda tapada pero no borrada.
