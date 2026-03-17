# Condicionales

Los condicionales permiten la evaluación condicional de expresiones: si una condición se cumple, entonces realizamos una acción; de lo contrario, realizamos otra.

## Booleanos

Para manejar los condicionales, necesitamos los valores booleanos. Para esto, debemos agregar en la gramática del intérprete lo siguiente:

```scheme
    (expresion ("true") true-exp)   ; Expresión para el valor booleano verdadero
    (expresion ("false") false-exp) ; Expresión para el valor booleano falso
```

Y ahora en el evaluador:

```scheme
      (true-exp () #true)   ; Evalúa a verdadero (#t en Scheme/Racket)
      (false-exp () #false) ; Evalúa a falso (#f en Scheme/Racket)
```

Con esto, podemos trabajar en nuestro intérprete:

```scheme
#(struct:false-exp)
> (evaluar-expresion (true-exp) ambiente-inicial)
#t
> (evaluar-expresion (false-exp) ambiente-inicial)
#f

> ((sllgen:make-string-parser especificacion-lexica especificacion-gramatical) "true")
#(struct:a-program #(struct:true-exp))
> ((sllgen:make-string-parser especificacion-lexica especificacion-gramatical) "false")
#(struct:a-program #(struct:false-exp))
```

## Condicionales

Para agregar los condicionales, debo modificar la gramática:

```scheme
    (expresion ("if" expresion "then" expresion "else" expresion) if-exp) ; Expresión condicional if-then-else
```

Y en el evaluador:

```scheme
      (if-exp (condicion hace-verdadero hace-falso)
              (let
                  (
                   (test-value (evaluar-expresion condicion amb)) ; Evalúa la condición en el ambiente actual
                   )
                (if (boolean? test-value) ; Verifica que el resultado sea un booleano
                    (if
                     test-value ; Si la condición es verdadera
                     (evaluar-expresion hace-verdadero amb) ; Evalúa la expresión del 'then'
                     (evaluar-expresion hace-falso amb) ; Evalúa la expresión del 'else'
                     )
                    (eopl:error "El test-exp debe ser un booleano " condicion) ; Error si no es booleano
                    )
                )
              )
```

Ahora podemos evaluar los condicionales:

```scheme
> (evaluar-expresion (if-exp (prim-exp (mayor-prim) (list (var-exp 'x) (lit-exp 4))) ; Condición: x > 4
                              (prim-exp (sum-prim) (list (var-exp 'x) (lit-exp 1))) ; Then: x + 1
                              (prim-exp (mult-prim) (list (var-exp 'x) (lit-exp 2)))) ; Else: x * 2
                      ambiente-inicial)
8

> (evaluar-programa ((sllgen:make-string-parser especificacion-lexica especificacion-gramatical) "if >(x,4) then +(x,1) else *(x,2)"))
8
```

## Conceptos Teóricos

Los condicionales son estructuras de control fundamentales en programación que permiten la ejecución selectiva de código basada en una condición booleana. En lenguajes funcionales como el que se está implementando, el `if` es una expresión (devuelve un valor) y no solo una sentencia.

La evaluación de un condicional sigue estos pasos:
1. Se evalúa la expresión de la condición.
2. Si el resultado es `#t` (verdadero), se evalúa y retorna la expresión del `then`.
3. Si el resultado es `#f` (falso), se evalúa y retorna la expresión del `else`.
4. Es crucial que la condición evalúe a un valor booleano; de lo contrario, se genera un error de tipo.

La implementación presentada utiliza un enfoque de **evaluación estricta** (ambas ramas se evalúan solo después de determinar la condición), lo cual es típico en Scheme.

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en Gramática | Ejemplo de Evaluación |
|----------|-------------|----------------------|------------------------|
| **Valores Booleanos** | Tipos de datos que representan verdadero (`true`) o falso (`false`). | `(expresion ("true") true-exp)` | `(evaluar-expresion (true-exp) amb) → #t` |
| **Expresión Condicional (`if`)** | Estructura que evalúa una condición y ejecuta una de dos ramas según el resultado. | `(expresion ("if" expresion "then" expresion "else" expresion) if-exp)` | `(if-exp (cond) (then-exp) (else-exp))` |
| **Evaluación de Condición** | La condición debe evaluar a un booleano; si no, se lanza un error. | Verificación con `(boolean? test-value)` | `(if (boolean? test-value) ... (error ...))` |
| **Rama `then`** | Expresión que se evalúa si la condición es verdadera. | Parte `hace-verdadero` en `if-exp`. | `(evaluar-expresion hace-verdadero amb)` |
| **Rama `else`** | Expresión que se evalúa si la condición es falsa. | Parte `hace-falso` en `if-exp`. | `(evaluar-expresion hace-falso amb)` |
| **Sintaxis Concreta** | Representación textual del condicional en el lenguaje implementado. | `"if >(x,4) then +(x,1) else *(x,2)"` | Se parsea a un árbol sintáctico (`if-exp`). |

## Comentarios Adicionales

- La implementación asume que el ambiente inicial tiene una variable `x` definida (por ejemplo, con valor 5). Si `x` no está definida, se producirá un error.
- En lenguajes funcionales, es común que `if` sea una expresión obligatoria con ramas `then` y `else`, a diferencia de algunos lenguajes imperativos que permiten omitir el `else`.
- La verificación de tipo (`boolean?`) es esencial para la seguridad del lenguaje; sin ella, una condición que evalúe a un número podría causar comportamientos inesperados.
- Para extender este sistema, se podrían agregar operadores booleanos (`and`, `or`, `not`) y más operadores de comparación (`<`, `=`, etc.).