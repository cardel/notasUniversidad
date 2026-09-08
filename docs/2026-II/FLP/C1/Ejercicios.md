# Ejercicios interactivos

Clase 1 — inducción y recursión: especificación de datos y de programas (8 de
septiembre). Cada enlace abre una actividad que se trabaja directo en el
navegador, sin instalar nada. Los ejemplos no son los de la sesión: mismo
tema, ronda nueva.

Son siete, en el orden en que la sesión ve los temas. Las dos primeras se
alcanzan en clase; las demás quedan para volver sobre el tema, y entre las
seis que piden código suman veintinueve procedimientos por escribir.

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

## [de las reglas al reconocedor](widgets/reconocedores.html){ target=_blank rel=noopener }

Cinco conjuntos definidos por reglas y, para cada uno, el procedimiento que
decide la pertenencia. Empieza por las potencias de dos, donde la regla
multiplica y el reconocedor tiene que dividir; sigue con un conjunto de
parejas, donde las dos componentes se mueven al tiempo y verificar una sola
deja entrar valores ajenos; y con cuatro conjuntos encadenados, que dan cuatro
procedimientos preguntándose entre ellos. Ahí aparece el caso del cero, que
`modulo` acepta y las reglas no.

Los dos últimos toman gramáticas en lugar de reglas de inferencia: la de las
expresiones lambda y la de los árboles binarios. Decidir si `(lambda x x)`
pertenece es lo mismo que se hace a ojo mirando paréntesis, ahora escrito
como procedimiento.

## [gramáticas BNF](widgets/bnf.html){ target=_blank rel=noopener }

Una sola gramática para los cinco retos, con las dos abreviaturas de la
notación: la estrella, que significa cero o más, y la cruz, uno o más. Los
argumentos de una operación dejan de ser una cantidad fija, y eso obliga a que
cada procedimiento traiga un auxiliar que recorra la tira.

Primero el reconocedor, donde la diferencia entre las dos cerraduras se vuelve
una condición concreta: `(suma)` pertenece y `(mayor)` no. Después evaluar la
expresión, que ya es un intérprete de un lenguaje diminuto —sintaxis definida
por una gramática, recorrido por casos, un valor por cada forma—, y contar
operaciones, medir la profundidad y recoger los números que aparecen.

## [recorrer siguiendo la gramática](widgets/recorridos.html){ target=_blank rel=noopener }

Cinco procedimientos que ya no responden sí o no: buscan un elemento, arman
una lista nueva, miden. `nth-element` baja dos argumentos al tiempo,
`subst` necesita dos procedimientos que se llaman entre sí porque la gramática
nombra dos conjuntos, y `profundidad` compara las dos ramas en vez de sumarlas.

Los dos últimos son los más exigentes: contar cuántas veces ocurre libre una
variable, que es la versión con números de lo que antes se respondía con
booleanos, y encontrar el camino hasta un número en un árbol ordenado, donde la
comparación descarta media estructura en cada nivel.

## [declaración, referencia y alcance](widgets/alcance.html){ target=_blank rel=noopener }

Cinco procedimientos que vuelven código la pregunta de a cuál declaración
pertenece cada aparición de un nombre. Los dos primeros separan los dos tipos
de aparición: `declaradas` recoge los identificadores que las lambdas
introducen y `referencias` los que se usan, con sus repeticiones, porque cada
aparición cuenta aparte.

Los tres siguientes se apoyan en esa separación. `libres` deja los usos que
ninguna lambda declara, que es lo que después habrá que buscar en un ambiente.
`sombra?` detecta un nombre que tapa a otro, llevando en un acumulador los
nombres declarados hasta ese punto. Y `renombra` cambia las referencias libres
de un identificador sin tocar las que pertenecen a otra declaración, que es la
regla del alcance escrita como procedimiento.

## [ligaduras locales al recorrer la gramática](widgets/locales.html){ target=_blank rel=noopener }

Cinco recorridos donde el nombre local deja de ser una comodidad. En `rango` y
en `quita-y-cuenta` el resultado de la llamada se necesita dos veces, y
escribirla dos veces la evalúa dos veces: el trabajo se duplica en cada nivel.
El segundo además devuelve dos respuestas de un solo recorrido, la lista sin
las apariciones y cuántas quitó.

Los otros tres reparten las tres formas. `resumen` arma con `let*` la cantidad
de nodos y la altura de un árbol binario, por etapas sobre las dos ramas.
`con-posicion` esconde con `letrec` el contador que empareja cada elemento con
su posición, de modo que quien lo llama pase solo la lista. Y el último vuelve
a la gramática de las s-lists: dos conjuntos que se nombran mutuamente dan dos
procedimientos que se llaman entre sí, ligados en un mismo `letrec`.
