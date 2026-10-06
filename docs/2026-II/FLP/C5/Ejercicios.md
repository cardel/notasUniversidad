# Ejercicios interactivos

Clase 5 — condicionales, procedimientos y alcance estático (6 de octubre).
Cada enlace abre una actividad que se trabaja directo en el navegador, sin
instalar nada. La sesión es de entender qué hace el interpretador, así que
casi todo es analizar y predecir: las respuestas muestran su razón, se
acierte o no.

Los programas están escritos como los recibe el interpretador del curso:
`+(y,11)`, `if >(x,4) then 1 else 2`, `let x = -(y,1) in add1(x)`,
`proc(u) *(u,u)`, `(f z)`. El ambiente inicial liga `x = 4`, `y = 2`,
`z = 5` sobre otro eslabón con `a = 4`, `b = 5`, `c = 6`. Los programas no
son los de clase: mismo lenguaje, ronda nueva. Lo que aquí se afirma sobre
valores, ambientes y número de llamadas se midió corriéndolo contra el
interpretador de `5.SemanticaProcedimientos`.

## Qué le falta al evaluador

### [Qué le falta al evaluador](widgets/falta.html){ target=_blank rel=noopener }

Seis encargos para decidir cuáles se escriben con lo que había (números,
variables, primitivas y `let`) y cuáles piden algo que el lenguaje todavía
no tiene. Aparecen las dos carencias juntas: escoger entre dos caminos según
una comparación y nombrar un cálculo con huecos para llenarlos después.
Después, el conjunto de valores, que crece de Número a Número, Booleano y
Procedimiento, y las dos tareas que eso trae consigo.

## Condicionales

### [El condicional y su regla](widgets/condicional.html){ target=_blank rel=noopener }

Hay que predecir qué da cada condicional. Dos de ellos solo se diferencian
en la prueba, y uno da 9 mientras el otro se detiene: la rama que no se
escoge no se evalúa, así que puede mencionar lo que quiera. Después, la
comparación entre delegar en el `if` de Racket y verificar con `boolean?`:
con el primero, `(if 5 then 1 else 2)` devuelve 1 y el error queda
enterrado.

## Ligaduras locales con let

### [Varias ligaduras a la vez](widgets/ligaduras.html){ target=_blank rel=noopener }

Cinco programas donde la respuesta depende de en qué ambiente se evalúa cada
parte derecha: una variable que se redefine con su propio valor y no es
circular, una ligadura que no alcanza a ver a su vecina y se detiene, un
`let` dentro de una parte derecha cuyo ambiente aparece y desaparece.
Después, qué separa un `let` de tres ligaduras de tres `let` anidados.

## Cadenas de ambientes: un ejemplo completo

### [La cadena de ambientes](widgets/cadena.html){ target=_blank rel=noopener }

Se predice el valor, cuántos eslabones se crean y cuántas variables se
evalúan. Al comprobar, la página abre la traza con el ambiente
de cada paso y dibuja la cadena en su punto más hondo, con el ambiente vacío
al final y las flechas del más nuevo al más viejo. Al final queda la máquina
abierta para cualquier programa que se quiera escribir.

### [Dibujar la cadena de ambientes](widgets/dibujar.html){ target=_blank rel=noopener }

Lo mismo, pero al revés: en vez de leer la cadena hay que construirla. Para
cada programa se señala un momento de la evaluación y se escriben los
eslabones que existen entonces, uno por línea y del más nuevo al más viejo;
la página los dibuja mientras se escriben y al comprobar señala la primera
diferencia con la del interpretador. Los dos últimos tienen procedimientos:
en uno, el eslabón del parámetro no cuelga de donde el programa parece
decir, y en el otro sobrevive un eslabón de una aplicación que ya terminó.

## Procedimientos y clausuras

### [Procedimientos y clausuras](widgets/clausuras.html){ target=_blank rel=noopener }

Qué guarda una clausura: los parámetros, el cuerpo sin evaluar y el ambiente
donde se creó. También qué no guarda. `let f = proc(u) (g u) in 7` vale 7 aunque
`g` no exista en ninguna parte, y el mismo cuerpo se detiene en cuanto
alguien aplica `f`. Después, qué pasa al aplicar: `(3 4)` se detiene porque
el operador no es un procedimiento, y una llamada con argumentos de más o de
menos se detiene por la verificación de la cantidad.

## Alcance estático

### [Alcance estático y alcance dinámico](widgets/alcance.html){ target=_blank rel=noopener }

El mismo programa con las dos reglas, cuatro veces. Se predicen los dos
resultados y la página abre las dos trazas, una debajo de la otra: dónde
busca la variable libre cada una, qué programa da 3 con una regla y 101 con
la otra, cuándo las dos coinciden y cuándo una acepta un programa que la
otra rechaza. El lenguaje usa la estática, y en el diagrama se ve por qué:
el ambiente del parámetro cuelga del que la clausura capturó.

## Tres ejemplos con procedimientos

### [Procedimientos en acción](widgets/procedimientos.html){ target=_blank rel=noopener }

Aquí los procedimientos hacen de todo: el primero se aplica dos veces sobre
su propio resultado, el segundo recibe otro procedimiento como argumento, el
tercero devuelve uno y el último tiene en el cuerpo una variable que se
vuelve a ligar más abajo. La clausura del tercero recuerda el argumento de
una llamada que ya terminó. La máquina queda abierta al final, con la casilla
para correr el mismo programa con alcance dinámico.
