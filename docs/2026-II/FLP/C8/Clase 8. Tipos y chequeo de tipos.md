# Clase 8. Tipos y chequeo de tipos

Martes 10 de noviembre de 2026.

Hasta aquí el lenguaje aceptaba cualquier programa que el analizador pudiera
leer, y los errores aparecían al correr: sumar un booleano, aplicar un número,
pasarle dos argumentos a un procedimiento de uno. Esta sesión agrega un
chequeador que recorre el programa antes de ejecutarlo y decide si tiene
sentido. A cambio, el programador anota los tipos: `proc` declara el de cada
parámetro y `letrec` declara además el del resultado.

El chequeador no responde qué va a pasar. Responde si puede garantizar que
nada falle por tipos, que es menos y es decidible.

## La regla de la aplicación

`type-of-application` recibe el tipo del operador y la lista de tipos de los
operandos, y comprueba tres cosas en este orden:

1. Que el operador sea de tipo procedimiento. Si no lo es, el error dice
   `Rator not a proc type`.
2. Que la cantidad de argumentos coincida con la de parámetros. Si no,
   `Wrong number of arguments`.
3. Que el tipo de cada argumento sea igual al del parámetro que le toca, uno
   contra uno, con `check-equal-type!`.

Cumplidas las tres, el tipo de la aplicación es el tipo de resultado del
procedimiento. De ahí sale la lectura que conviene tener a mano: un
procedimiento de tipo `(int * int -> bool)` recibe dos enteros y entrega un
booleano, y aplicarlo a dos enteros es una expresión de tipo `bool`.

## La regla del letrec

`type-of-letrec-exp` hace algo que a primera vista parece trampa: arma el tipo
del procedimiento con lo que el programador declaró, lo mete al ambiente de
tipos **antes** de mirar el cuerpo, y recién entonces chequea el cuerpo en ese
ambiente extendido.

```text
letrec int f (int x) = ...
       int g (int x, bool y) = ...
in body
```

Con eso, `f` vale `(int -> int)` y `g` vale `(int * bool -> bool)` mientras se
chequea el cuerpo de cada uno, así que la llamada recursiva se puede tipar sin
haber terminado de tipar el cuerpo donde aparece. Para eso sirve la anotación
del tipo de retorno: sin ella habría que adivinarlo, que es justo lo que hace
la inferencia.

El cuerpo se chequea con `extend-tenv` sobre los parámetros, y al final
`check-equal-type!` compara el tipo que dio el cuerpo con el que se declaró.

## El factorial, tipo a tipo

```text
letrec int fact (int x) =
         if zero?(x)
         then 1
         else *(x, (fact sub1(x)))
in (fact 5)
```

La anotación dice que `fact` es `(int -> int)`, y con eso el ambiente de tipos
ya lo tiene cuando se mira el cuerpo:

| Expresión | Tipo | De dónde sale |
|---|---|---|
| `zero?(x)` | `bool` | `zero?` es `(int -> bool)` y `x` es `int` |
| `1` | `int` | literal |
| `sub1(x)` | `int` | `sub1` es `(int -> int)` |
| `(fact sub1(x))` | `int` | `fact` es `(int -> int)` aplicado a un `int` |
| `*(x, (fact sub1(x)))` | `int` | `*` es `(int * int -> int)` |
| el `if` completo | `int` | prueba `bool` y las dos ramas `int` |
| `(fact 5)` | `int` | la aplicación da el tipo de resultado |

El cuerpo dio `int` y se declaró `int`, así que el programa pasa y corre.

## Cinco intentos que no pasan

La forma más rápida de entender qué comprueba cada regla es romperla. Los
cinco programas se escribieron en el interpretador de la sesión y cada mensaje
es el que respondió:

```text
if zero?(x) then 1 else *(x, (fact true))
    bool != int
```

El `true` llega donde `fact` espera un `int`: falla la comparación de la
aplicación, entre el tipo del argumento y el del parámetro.

```text
if zero?(true) then 1 else *(x, (fact sub1(x)))
    bool != int
```

Ahora el `true` llega a `zero?`, que pide un `int`. El error es el mismo
mensaje por otra razón: también es la regla de la aplicación.

```text
if +(x, 1) then 1 else *(x, (fact sub1(x)))
    int != bool
```

La prueba del condicional da `int` y la regla la compara contra `bool`. Aquí
falla la primera de las dos comparaciones del `if`.

```text
if proc (int x) >(x, 1) then 1 else *(x, (fact sub1(x)))
    (int -> bool) != bool
```

El procedimiento está sin aplicar, así que la prueba vale `(int -> bool)`.
Declarar un procedimiento no es llamarlo, y el tipo lo muestra.

```text
if (proc (int x) <(x, 1) x) then 1 else *(x, (fact sub1(x)))
    120
```

El mismo procedimiento, ahora aplicado a `x`: la prueba vale `bool`, el
programa pasa el chequeo y entrega 120.

## Lo que hay que verificar siempre

1. Sacar el tipo del procedimiento de la primitiva. `+` es
   `(int * int -> int)`, `zero?` es `(int -> bool)`, `<` es
   `(int * int -> bool)`.
2. La regla del `if`: la prueba es `bool` y las dos ramas son del mismo tipo.
   Son dos comparaciones distintas y fallan por separado.
3. `let` y `letrec` generan ambientes de tipos, y el cuerpo se chequea ahí.
4. En la aplicación, el número de argumentos es el mismo y el tipo de cada uno
   coincide con el que espera el parámetro.
5. Aplicar un procedimiento da su tipo de resultado: a un `(int * int -> bool)`
   se le mandan dos enteros y entrega un booleano.

## Ejercicios de la segunda mitad

[Ejercicios · FLP · Chequeo de tipos](../../../actividades/flp/chequeo-de-tipos/index.md){ target=_blank rel=noopener }:
las reglas de tipamiento una por una, el TAD del tipo, qué alcanza a decidir
el chequeador antes de correr y por qué rechaza programas que habrían
funcionado.

## Lo que sigue

El chequeador funciona porque el programador anota los tipos, y esas
anotaciones son las que el `letrec` necesita para tipar una llamada recursiva.
La sesión siguiente quita las anotaciones y deja que el chequeador las
deduzca, con variables de tipo que se van llenando a medida que el programa
las obliga.
