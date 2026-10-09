# Ejercicios · PFC C4

Ocho ejercicios para recorrer en el navegador, organizados por los temas de la
sesión y en su mismo orden. Lo que cambia respecto a las sesiones anteriores es
el objeto de estudio: hasta ahora el programa era una función y un valor; aquí
es un dato con sus operaciones adentro, y casi todos los ejercicios piden
distinguir qué pertenece al dato y qué pertenece a quien lo usa.

Lo que se conserva en esta sesión es **el valor del racional**: un medio es un
medio escrito `1/2`, `2/4` o `33/66`, y las operaciones tienen que dar lo mismo
en los tres casos. Lo que cambia es dónde vive la regla que lo garantiza.

## Motivación: ¿por qué abstraer datos?

### [dosEnteros](widgets/dosEnteros.html){ target=_blank rel=noopener }

Sumar `1/2` más `2/3` con cuatro enteros sueltos. Hay que escoger la expresión
del numerador entre cuatro candidatas, y las cuatro compilan y devuelven un
`Int`: emparejar cada numerador con su propio denominador da 8, cruzar los
factores por tipo da 8 también, y sumar numeradores con numeradores da `3/5`.
Solo una cruza los factores como manda la regla. Cuando el racional es un dato
con nombre, la misma cuenta no admite ninguno de esos tres errores, porque ya
no hay cuatro enteros que emparejar a mano.

## Clases y objetos en Scala

### [claseRacional](widgets/claseRacional.html){ target=_blank rel=noopener }

Cuatro respuestas del REPL para predecir antes de verlas, sobre `val x = new
Racional(1, 2)`. Dos son las esperadas; la tercera, escribir `x` solo, devuelve
`Racional@2faf6e4a` y no `1/2`, porque todavía no hay `toString` propio. La
cuarta, `x.x`, ni siquiera compila: `x` es parámetro del constructor y lo que
el cliente alcanza con el punto es `numer`, que es un método. Ahí se separa el
nombre que se escribe en la cabecera de la clase del nombre que queda público.

## De funciones externas a métodos

### [externasVsMetodos](widgets/externasVsMetodos.html){ target=_blank rel=noopener }

Las dos versiones de la suma, lado a lado y con el mismo contador de línea:
`sumaRacional(r, s)` recibe los dos operandos como parámetros, y `x.suma(y)`
recibe uno y encuentra el otro en el receptor. La aritmética del cuerpo es la
misma letra por letra; lo único que cambia es que `numer` y `denom` sin
calificar son `this.numer` y `this.denom`. La traza de seis pasos termina en
`x.suma(y).mult(z)` con `66/42`, que es correcto y está sin simplificar: esa
incomodidad es la que abre la sección siguiente.

## Control de acceso y encapsulación

### [privados](widgets/privados.html){ target=_blank rel=noopener }

Cinco expresiones sobre `val r = new Racional(66, 42)` y una pregunta por cada
una: ¿la puede escribir el cliente? `r.numer` responde 11. `r.mcd(66, 42)` y
`r.m` no compilan, aunque `suma` los use sin problema desde adentro. Y
`new Racional(1, 0)` compila sin que nadie reclame y revienta al correr con
`IllegalArgumentException`, porque `require` es una condición de ejecución y no
del compilador. Distinguir *no compila* de *compila y falla* es la mitad del
ejercicio.

### [mcdEnMemoria](widgets/mcdEnMemoria.html){ target=_blank rel=noopener }

La tabla que se llena de memoria y se comprueba contra los contadores por
línea. Para `new Racional(66, 42)` seguido de `r.numer`, `r.numer` y `r.denom`,
la variante que calcula en cada selectora llama a `mcd` quince veces, la que
precalcula con `val` diez, y la de la sesión, con un `private val` intermedio,
cinco: la cadena `mcd(66,42) → mcd(42,24) → mcd(24,18) → mcd(18,6) → mcd(6,0)`
corre una sola vez. La última fila es la clase sin simplificación, donde `numer`
da 66 y no 11. Es el ejercicio más exigente de la sesión: hay que contar sin
ejecutar y después seguir la cuenta paso a paso para ver dónde falló.

## Modelo de sustitución con clases

### [sustitucion](widgets/sustitucion.html){ target=_blank rel=noopener }

Tres sustituciones, en este orden: parámetros del método, parámetros de la
clase y `this`. Cada reescritura se escribe antes de verla. El cierre es
`r1 max r2`, que no construye nada: devuelve `r` o devuelve `this`, uno de los
dos objetos que ya existían. Esa diferencia queda anotada para el ejercicio
siguiente, donde `+` sí fabrica un objeto nuevo.

## Operadores como métodos

### [operadores](widgets/operadores.html){ target=_blank rel=noopener }

Hay siete respuestas que predecir, y por el camino aparecen dos cosas: `r1 + r2` es
`r1.+(r2)`, y después de la suma `r1` sigue valiendo `1/2`, porque el método
construye un racional nuevo en lugar de modificar el receptor; y
`r1 * r1 + r2 * r2` se agrupa por la precedencia del símbolo, no por el orden
en que se lee. Un chip muestra `numer` y `denom` de los dos operandos después
de cada línea, siempre iguales.

### [punto2d](widgets/punto2d.html){ target=_blank rel=noopener }

Lo mismo en otro dominio, y ahí aparece una diferencia que en `Racional` pasaba
inadvertida: en `Punto` los parámetros van declarados `val` en la cabecera, así
que `p1.x` responde, mientras que `r.x` no existe. Se llenan los valores de
`p1.x`, `p1 + p2`, `p1 distancia p2`, `p2 distancia p1` y `(p1 + p2).x`, con los
`.0` que aparecen porque los literales entran como `Double`.
