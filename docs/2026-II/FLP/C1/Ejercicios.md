# Ejercicios interactivos

Clase 1 — inducción y recursión: especificación de datos y de programas (8 de
septiembre). Cada enlace abre una actividad que se trabaja directo en el
navegador, sin instalar nada. Los ejemplos no son los de la sesión: mismo
tema, ronda nueva.

## [conjuntos](widgets/induccion.html){ target=_blank rel=noopener }

Tres bloques de decisiones. En los dos primeros hay que decir si un valor
pertenece al conjunto que definen unas reglas: primero las listas de enteros,
donde el estorbo son los valores de otro tipo y los pares impropios; después
las s-lists, donde dos conjuntos se nombran mutuamente y el anidamiento no
tiene fondo.

El tercero cambia la pregunta. Dada la misma gramática, se decide cuál llamada
recursiva queda justificada: la que baja por el `car` cuando ahí hay un entero,
la que no cambia el argumento, la que salta de dos en dos. Cada decisión
muestra la razón, se acierte o no, y la razón nombra la regla que decide.

## [escribir y correr](widgets/repl.html){ target=_blank rel=noopener }

Cuatro procedimientos por escribir, con el código corriendo en la página.
`suma-lista` recorre una lista, `duple` recorre un número, `elimina-primero`
necesita dos casos base y `ocurre-libre?` recorre expresiones lambda, que es
donde ligadura y alcance dejan de ser una definición y se vuelven una
cláusula.

Se llena el esqueleto y se presiona Probar. Cuando una prueba falla, el
mensaje dice qué llamada se cayó, qué dio y qué debía dar; los tropiezos más
frecuentes —devolver `'()` donde iba `0`, usar `append` donde iba `cons`,
quitar todas las apariciones en vez de la primera— traen además su
explicación. Al final hay una consola libre para probar cualquier otra cosa.

El evaluador de la página entiende `define`, `lambda`, `if`, `cond`, `let`,
`letrec` y las primitivas de listas y aritmética, y nada más: no hay
`define-datatype` ni `cases`. Sirve para tantear una idea sin cambiar de
ventana. Lo que se entrega se escribe y se corre en DrRacket.
