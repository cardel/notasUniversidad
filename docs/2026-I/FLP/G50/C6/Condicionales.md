# Condicionales

Para trabajar con los condicionales en nuestro lenguaje, debemos extender tanto los valores que puede manejar como las operaciones disponibles.

**Valores expresados:** Número + Booleano  
**Valores denotados:** Número + Booleano

Para implementar esta funcionalidad, vamos a incluir:

1. Booleanos como `false-exp` y `true-exp`, que son procesados como falso y verdadero en Racket.
2. Las operaciones relacionales (mayor, menor, igual, etc.) como primitivas.
3. La expresión `if` en la gramática.
4. La evaluación del `if` en el evaluador (función `evaluar-expresion`).

## Cambios en la gramática

```scheme
    ; Expresiones booleanas literales
    (expresion ("true") true-exp)
    (expresion ("false") false-exp)
    
    ; Expresión condicional if-then-else
    (expresion ("if" expresion "then" expresion "else" expresion) if-exp)
    
    ; Primitivas de comparación (relacionales)
    (primitiva (">") mayor-prim)
    (primitiva (">=") mayorigual-prim)
    (primitiva ("<") menor-prim)
    (primitiva ("<=") menorigual-prim)
    (primitiva ("==") igual-prim)
```

## Cambios en el evaluador

```scheme
      ; Evaluación de literales booleanos
      (true-exp () #true)
      (false-exp () #false)
      
  ; Evaluación de la expresión if
  (if-exp (condicion hace-verdadero hace-falso)
              (let
                  (
                   ; Primero evaluamos la condición en el ambiente actual
                   (test-value (evaluar-expresion condicion amb))
                   )
                ; Verificamos que el resultado de la condición sea un booleano
                (if (boolean? test-value)
                    ; Si es booleano, evaluamos la rama correspondiente
                    (if
                     test-value
                     (evaluar-expresion hace-verdadero amb)   ; Rama verdadera
                     (evaluar-expresion hace-falso amb)       ; Rama falsa
                     )
                    ; Si no es booleano, lanzamos un error
                    (eopl:error "El test-exp debe ser un booleano " condicion)
                    )
                )
              )
```

**Nota importante:** En el caso del `if`, `(evaluar-expresion condicion amb)` debe retornar un valor booleano. De lo contrario, se genera un error de tipo.

## Conceptos teóricos

Los condicionales son estructuras de control fundamentales en los lenguajes de programación que permiten la ejecución selectiva de código basada en una condición. En nuestra implementación:

1. **Valores booleanos:** Se añaden como nuevos tipos de datos primitivos (`true`/`false`).
2. **Operadores relacionales:** Permiten comparar valores numéricos y producir resultados booleanos.
3. **Estructura if-then-else:** Sigue la semántica estándar: evalúa la condición, si es verdadera ejecuta la rama `then`, si es falsa ejecuta la rama `else`.
4. **Verificación de tipos:** Es crucial asegurar que la condición del `if` evalúe a un valor booleano, de lo contrario se produce un error.

La evaluación es **estricta** (eager evaluation): primero se evalúa completamente la condición, luego solo se evalúa la rama correspondiente (verdadera o falsa).

## Pruebas

```scheme
-->==(5,3)
#f
-->x
4
-->if >(x,3) then 1 else 2
1
-->if <(x,4) then 1 else 2
2
> (evaluar-expresion (if-exp (false-exp) (lit-exp 10) (lit-exp 40)) ambiente-inicial)
40
> (evaluar-expresion (if-exp (true-exp) (lit-exp 10) (lit-exp 40)) ambiente-inicial)
10
> (evaluar-expresion (if-exp (prim-exp (menor-prim) (list (lit-exp 1) (lit-exp 3))) (lit-exp 10) (lit-exp 40)) ambiente-inicial)
10
> (evaluar-expresion (if-exp (prim-exp (mayor-prim) (list (lit-exp 1) (lit-exp 3))) (lit-exp 10) (lit-exp 40)) ambiente-inicial)
40
```

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Notas |
|----------|-------------|---------------|
| **Valores booleanos** | Nuevos tipos de datos primitivos: verdadero (`true`) y falso (`false`). | `true-exp`, `false-exp` |
| **Operadores relacionales** | Primitivas que comparan números y devuelven booleanos. | `>`, `>=`, `<`, `<=`, `==` |
| **Expresión `if`** | Estructura condicional con sintaxis `if cond then exp1 else exp2`. | Se evalúa la condición y luego solo la rama correspondiente. |
| **Evaluación estricta** | La condición se evalúa completamente antes de elegir la rama. | Característica del lenguaje implementado. |
| **Verificación de tipos** | La condición del `if` debe evaluar a un booleano. | Error si el resultado no es booleano. |
| **Extensión de valores** | El lenguaje ahora maneja números y booleanos como valores expresados/denotados. | Dominio ampliado: $\mathbb{Z} \cup \mathbb{B}$ |

## Comentarios adicionales

- La implementación presentada sigue un enfoque **minimalista** pero funcional para los condicionales.
- Es importante notar que los operadores relacionales solo están definidos para números en esta versión. Extenderlos a otros tipos requeriría más verificación de tipos.
- La estructura `if` aquí implementada es **binaria** (solo dos ramas). Algunos lenguajes permiten múltiples ramas con `else if`.
- En futuras extensiones, se podría considerar añadir operadores booleanos (`and`, `or`, `not`) para construir condiciones más complejas.
- El manejo de errores es básico pero efectivo: se identifica cuando la condición no es booleana y se reporta adecuadamente.
- Esta implementación asume **ambientes léxicos** para la evaluación de expresiones dentro de las ramas del `if`.