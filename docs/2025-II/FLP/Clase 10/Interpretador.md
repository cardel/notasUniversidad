# Sistema de tipos para el intérprete

## Expresiones de tipo

Cuando escribimos `int a = 3`, `int` es una expresión de tipo que indica el tipo de la variable, no su representación en memoria.

### Gramática de tipos
```
<tipo-exp> ::= int
            int-type-exp()
           ::= bool
            bool-type-exp()
           ::= (<tipo-exp>*(,) -> <tipo-exp>)
            proc-type-exp(targs result-type)
```

### Ejemplos de expresiones tipadas
```scheme
proc(int a, int b) +(a,b)     ; (int * int) -> int
5                             ; int
true                          ; bool
```

## Ejemplos de tipos de procedimientos

```scheme
even?(x)                      ; int -> bool
+                             ; int * int -> int
(lambda (x) (lambda (y) (+ x y))) ; int -> (int -> int)
(lambda (f x) (zero? (f (+ x 1)))) ; ((int -> int) * int) -> bool
```

## Ejercicio de inferencia de tipos

```scheme
-(32, 26)                     ; int
proc(x) (x 26)                ; (int -> t) -> t
proc(x) if x then 1 else 3    ; bool -> int
proc(f, x) if (f x) then 1 else 2 ; (tx -> bool) * tx -> int
proc(x) proc(y) if y then x else 3 ; int -> (bool -> int)
```

Cuando un tipo no se puede determinar unívocamente, se conoce como **tipo polimórfico**.

## Especificación del lenguaje

El lenguaje será **fuertemente y estáticamente tipado**. Se emitirán errores de tipo cuando:

- Se intente aplicar algo distinto a un `procVal` (evaluación de no-procedimiento)
- Se envíe un número incorrecto de argumentos a un procedimiento
- Se aplique un argumento de tipo incorrecto a una primitiva (ej: booleano en suma)
- Se use algo diferente a un booleano en la condición de un condicional

**No se consideran** errores de tipo las divisiones por cero (errores semánticos).

## Implementación del verificador de tipos

Definiremos un procedimiento `type-of-expression` que recibe una expresión y un ambiente de tipos, y asigna un tipo a la expresión.

### Ambiente inicial de tipos
Contendrá los tipos de los valores primitivos del ambiente inicial.

### Comportamiento de `type-of-expression`

- **Número**: retorna `int`
- **Booleano**: retorna `bool`
- **Variable**: busca la ligadura en el ambiente de tipos
- **Condicional** (`if`):
  - La condición debe ser de tipo `bool`
  - Las expresiones `then` y `else` deben tener el mismo tipo
  - Retorna el tipo común de `then` y `else`
- **Procedimiento** (`proc`): retorna $(t_1 \times t_2 \times \ldots \times t_n) \rightarrow t$ donde $t_i$ son los tipos de los parámetros y $t$ es el tipo del cuerpo
- **Aplicación** (llamada a procedimiento): para `(rator rand₁ ... randₙ)`
  - `rator` debe tener tipo $(t_1 \times t_2 \times \ldots \times t_n) \rightarrow t$
  - Cada `randᵢ` debe tener tipo $t_i$
  - Retorna tipo $t$

## Limitación del sistema

Al evaluar una aplicación de procedimiento, debemos contrastar:
- `rator`: $(t_1 \times t_2 \times \ldots \times t_n) \rightarrow t$
- `rands`: $t_1, t_2, \ldots, t_n$

El problema surge cuando no tenemos forma de determinar directamente los tipos de los parámetros del `rator`:

```scheme
let
  f = proc(x, y) ...
in
  (f 1 2)
```

## Estrategias de solución

### 1. Chequeo de tipos explícito
Colocar anotaciones de tipo en los procedimientos:
```scheme
let
  f = proc(int x, int y) ...
in
  (f 1 2)
```

### 2. Inferencia de tipos
Utilizar reglas de tipado junto con un mecanismo de inferencia lógica:
```scheme
let
  f = proc(? x, ? y) ...
in
  (f 1 2)
```

La inferencia de tipos utiliza un sistema de ecuaciones de tipos y unificación para determinar los tipos de manera automática basándose en el contexto de uso.