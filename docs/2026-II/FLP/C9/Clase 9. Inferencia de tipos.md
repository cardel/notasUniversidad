# Clase 9. Inferencia de tipos

Martes 17 de noviembre de 2026.

El chequeador de la sesión anterior funciona porque el programador escribe las
anotaciones: `proc` declara el tipo de cada parámetro y `letrec` declara además
el del resultado. Esta sesión quita esa obligación. Donde iba el tipo se escribe
`?`, y el chequeador tiene que deducirlo a partir de cómo se usa la variable en
el resto del programa.

El procedimiento son tres pasos. Ponerle una variable de tipo a cada hueco,
generar una ecuación por cada construcción del lenguaje y resolver el sistema.
Lo que resuelve el sistema se llama unificación, y es lo que decide si el
programa tipa.

## El hueco que deja la pregunta

La gramática gana una categoría, el tipo opcional, con dos formas:

```text
<optional-type-exp> ::= ?                no-type-exp
                      | <type-exp>       a-type-exp
```

`proc` y `letrec` la usan en lugar del tipo, y las dos formas se mezclan en el
mismo programa:

```text
proc (? f, ? x) (f +(x,1) >(x,0))
proc (int x, ? y) if (y x) then +(x,1) else +(x,3)
```

El puente entre lo que escribió el programador y el tipo que manipula el
chequeador es una sola función:

```racket
(define expand-optional-type-expression
  (lambda (otexp tenv)
    (cases optional-type-exp otexp
      (no-type-exp () (fresh-tvar))
      (a-type-exp (texp) (expand-type-expression texp)))))
```

Donde hay `?` nace una variable de tipo; donde hay un tipo escrito se expande
como antes.

## La variable de tipo

El TAD `type` gana una tercera variante:

```racket
(define-datatype type type?
  (atomic-type (name symbol?))
  (proc-type (arg-types (list-of type?)) (result-type type?))
  (tvar-type (serial-number integer?) (container vector?)))
```

Una variable de tipo lleva un número que la identifica y un contenedor que
empieza vacío y se llena una sola vez. El contenedor es un vector de tamaño uno,
y el número sale de un contador que avanza con `set!`:

```racket
(define fresh-tvar
  (let ((serial-number 0))
    (lambda ()
      (set! serial-number (+ 1 serial-number))
      (tvar-type serial-number (vector '())))))
```

Ese contador es una de las pocas veces que el curso usa `set!` a propósito: sin
él, dos variables distintas podrían salir con el mismo número y la cuenta se
confundiría. El número que aparece impreso, `tvar13` o `tvar56`, depende de
cuántas variables se hayan creado antes en la sesión de DrRacket, de modo que el
mismo programa evaluado en dos momentos imprime números distintos. Lo que
importa es cuáles números coinciden dentro de un tipo, no el valor de cada uno.

La variable tiene dos estados. Vacía, cuando no se sabe nada de ella, y llena,
cuando ya guarda un tipo. `tvar-non-empty?` dice en cuál está y
`tvar-set-contents!` la llena. Llenarla es definitivo: un segundo intento con
otro tipo no la sobrescribe, hace fallar el programa.

En un lenguaje de tipado dinámico el tipo viaja con el valor y se reemplaza sin
que nadie reclame: en Python, `a = 8` y después `a = "hola"` dejan a `a` con
otro tipo. Aquí la variable de tipo no es el valor sino el hueco, y se llena una
vez con lo que el programa obligue.

## Las ecuaciones que genera cada forma

| Expresión | Qué exige | Qué entrega |
|---|---|---|
| `if p then c else a` | `p` es `bool`, y `c` y `a` son del mismo tipo | el tipo de las ramas |
| `proc (? x1, …, ? xn) cuerpo` | nada por sí sola | `(t1 * … * tn -> tcuerpo)` |
| `(rator rand1 … randn)` | `rator` es un procedimiento de `n` argumentos y el tipo de cada `rand` coincide con el del parámetro | el tipo de resultado de `rator` |
| `let x = e in cuerpo` | nada | el tipo del cuerpo, con `x` ligado al tipo de `e` |
| `letrec ? p (? x) = cuerpo in e` | el cuerpo tiene el tipo del resultado | el tipo de `e` |

Las primitivas se tratan como procedimientos, igual que en el chequeador con
anotaciones:

| Primitiva | Tipo |
|---|---|
| `+`, `-`, `*` | `(int * int -> int)` |
| `add1`, `sub1` | `(int -> int)` |
| `<`, `>` | `(int * int -> bool)` |
| `zero?` | `(int -> bool)` |

El `letrec` se tipa con lo que dice la declaración y no con lo que resulte del
cuerpo: el nombre entra al ambiente de tipos con el tipo armado desde sus
anotaciones, aunque sean huecos, y solo después se tipa el cuerpo. Es lo que
permite que la llamada recursiva encuentre algo con qué unificar, porque tipar
el cuerpo exige conocer el tipo del nombre que el cuerpo está definiendo.

## Un ejemplo completo

```text
let func = proc (? f, ? x) (f +(x,1) >(x,0))
in let res = (func proc (? a, ? b) a 10)
   in res
```

Cada hueco recibe su variable: `tf` y `tx` para los parámetros de `func`, `ta` y
`tb` para los del procedimiento que se le pasa. De ahí salen las ecuaciones:

```text
tfunc = tf * tx -> t1            por la regla del proc
tf    = int * bool -> t1         por la aplicación (f +(x,1) >(x,0))
tx    = int                      porque x entra a +(x,1) y a >(x,0)
ta * tb -> ta = tf               el primer argumento de func
tx    = int                      el segundo argumento, que es 10
```

La cuarta ecuación hace el trabajo. Unificar `(ta * tb -> ta)` con
`(int * bool -> t1)` llena `ta` con `int`, `tb` con `bool` y, como el resultado
de ese procedimiento es `ta`, llena `t1` con `int`. El sistema queda resuelto:

```text
> (type-to-external-form (type-of-program (scan&parse "… in func")))
((int * bool -> int) * int -> int)
> (type-to-external-form (type-of-program (scan&parse "… in res")))
int
```

## La unificación

`check-equal-type!` recibe dos tipos y los vuelve iguales, llenando variables si
hace falta, o falla. Antes de decidir qué caso aplica, `prune-type` sigue las
cadenas de variables ya llenas hasta llegar al tipo que de verdad hay detrás.

| Los dos tipos | Qué pasa |
|---|---|
| el mismo valor | éxito, sin escribir nada |
| una variable llena | se unifica contra su contenido |
| una variable vacía | se llena con el otro tipo |
| dos atómicos | los nombres tienen que coincidir |
| dos procedimientos | misma cantidad de argumentos, y se unifican uno a uno y los resultados |
| cualquier otra combinación | error de tipos |

Seis casos concretos:

| Se unifica | Resultado |
|---|---|
| `int` con `int` | éxito, nada que escribir |
| `t1` con `int` | éxito, `t1` queda en `int` |
| `bool` con `t1` | éxito, `t1` queda en `bool` |
| `int` con `t1`, con `t1` ya en `bool` | falla, `int` contra `bool` |
| `(t1 * int -> bool)` con `(int * int -> bool)` | éxito, `t1` queda en `int` |
| `(t1 -> bool)` con `(int * int -> bool)` | falla, uno recibe uno y el otro dos |

## Los tres errores

```text
check-equal-type!: Type mismatch: int doesn't match bool
check-equal-type!: Different numbers of arguments (int * int -> int) and (int -> tvar7)
check-equal-type!: Can't unify: tvar8 occurs in type (tvar8 -> tvar9)
```

Cada uno tiene un programa de tres líneas que lo produce:

```text
let f = proc (? x) zero?(x) in (f true)
let f = proc (? x, ? y) +(x,y) in (f 1)
proc (? x) (x x)
```

El tercero es el chequeo de ocurrencia. Antes de llenar una variable,
`check-no-occurrence!` recorre el tipo con que se la quiere llenar buscando esa
misma variable adentro. En `proc (? x) (x x)`, aplicar `x` a sí mismo pide que
`tx` sea `(tx -> t)`, y para saber qué es `tx` habría que saber primero qué es
`tx`. Sin ese chequeo la variable quedaría apuntándose a sí misma y leerla
después daría vueltas sin terminar.

## El tipo se fija al usarlo

La misma identidad recibe tres tipos distintos según con qué se use:

```text
let f = proc (? x) x in let p = (f 1) in f                      → (int -> int)
let f = proc (? x) x in let p = (f true) in f                   → (bool -> bool)
let f = proc (? x) x in let p = (f proc (? x) +(x,1)) in f      → ((int -> int) -> (int -> int))
```

Y no admite dos usos distintos en el mismo programa:

```text
let f = proc (? x) x in let p = (f 1) in let q = (f true) in f
check-equal-type!: Type mismatch: int doesn't match bool
```

El primer uso llena la variable y el segundo se estrella contra lo que quedó.
Un sistema que aceptara los dos a la vez sería polimórfico; este no lo es.

Cuando ningún uso obliga, la variable sobrevive en la respuesta:

```text
> (type-to-external-form (type-of-program (scan&parse "proc (? f, ? x) (f +(1,x) zero?(x))")))
((int * bool -> tvar13) * int -> tvar13)
```

La salida de `f` no quedó determinada, y el mismo número en los dos lugares dice
que son la misma. Basta aplicarlo una vez para que se llene:

```text
> … "let k = proc (? f, ? x) (f +(1,x) zero?(x)) in let s = (k proc (int x, bool y) x 10) in k"
((int * bool -> int) * int -> int)
```

## Un examen que no tipa

```text
let f = proc (? x, ? y) if zero?(y) then proc (? k, ? l) >(k,l) else x
    g = proc (? z, ? a, ? b) if (a b 9) then a else b
in let h = proc (? c, ? d) (d d c c)
   in (h f g)
```

`f` por separado tipa, y queda en
`((int * int -> bool) * int -> (int * int -> bool))`: las dos ramas del `if`
obligan a que `x` sea del mismo tipo que `proc (? k, ? l) >(k,l)`.

`g` no:

```text
check-equal-type!: Can't unify: tvar9 occurs in type (tvar9 * int -> bool)
```

`(a b 9)` pide que `a` sea un procedimiento que recibe a `b` y un entero, o sea
`ta = (tb * int -> t)`. El `if` pide además que las dos ramas coincidan,
`ta = tb`. Reemplazando, `ta = (ta * int -> bool)`, y la variable aparece dentro
de su propio tipo.

`h` falla por lo mismo en otro sitio: `(d d c c)` aplica `d` a tres argumentos y
uno de ellos es `d`, de modo que `td` tendría que ser a la vez un procedimiento
de tres argumentos y el primero de esos tres. En la primera ecuación `td` es un
procedimiento y en la segunda es lo que reciba, y las dos no se pueden cumplir.

Queda abierto qué habría que cambiarle al programa para que tipe, sin tocar la
cantidad de parámetros. La pista es que `z` no se usa en ningún lado.

## Otro examen, con las respuestas

```text
let a = proc (int x, ? y) if (y x) then +(x,1) else +(x,3)
    b = proc (? n, ? m, ? o, ? p) if (p m) then (n m o) else (n *(m,3) o)
    c = proc (int q) zero?(q)
    d = 3
in let t = proc (? f, ? g, ? z, ? w) (f g w z z)
   in let tp = (t b a c d) in tp
```

Conviene resolverlo con lápiz antes de mirar la tabla.

| Nombre | Tipo |
|---|---|
| `a` | `(int * (int -> bool) -> int)` |
| `c` | `(int -> bool)` |
| `d` | `int` |
| `b` | `((int * (int -> bool) -> int) * int * (int -> bool) * (int -> bool) -> int)` |
| `t` | `(((int * (int -> bool) -> int) * int * (int -> bool) * (int -> bool) -> int) * (int * (int -> bool) -> int) * (int -> bool) * int -> int)` |
| `tp` | `int` |

## Lo mismo en Java

Java tiene `var` para variables locales desde la versión 10, y es el mismo
mecanismo:

```java
var n = 1 + 2;                        // n queda en int
var nombres = new ArrayList<String>();
```

Nadie escribió el tipo de `n` y el compilador lo sacó de la expresión. Por eso
`n.length()` no compila, porque `n` es un `int`, y `var x;` tampoco: sin algo
que lo inicialice no hay de dónde deducir. El contraste con `int x;` es que ahí el
tipo está escrito y la declaración se sostiene sola, aunque el valor haya que
asignarlo antes de usar la variable.

## Ejercicios de la segunda mitad

[Ejercicios · FLP · Inferencia de tipos](../../../actividades/flp/inferencia-de-tipos/index.md){ target=_blank rel=noopener }:
qué cambia cuando la anotación es `?`, qué es una variable de tipo y cuándo dos
partes del programa llevan la misma, cómo se genera el sistema de ecuaciones y
cómo se resuelve unificando, con el chequeo de ocurrencia al final.

## Lo que sigue

Objetos. Objetos simples y objetos planos, métodos, mensajes, despacho dinámico
y cómo se implementa todo eso en Racket. Con esa sesión cierra el contenido
evaluable del curso.
