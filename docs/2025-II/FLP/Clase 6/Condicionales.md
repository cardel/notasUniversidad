Los condicionales permiten un flujo de ejecución condicional, si se cumple una condición se ejecuta cierto número de instrucciones y no se cumple se ejecutan otras

Para los condicionales necesitamos **booleanos** porque necesitamos evaluar si una condición es verdadera false.

- Valores expresados: Números y booleanos
- Valores denotados: Números y booleanos

```bnc
<expression> ::= "if" <expresion> "then" <expresion> "else" <expresion>
```

## Modificación a la gramática

```scheme
    (expression ("if" expression "then" expression "else" expression) if-exp)

```

Se agrega a la expresión if-exp a la gramática para poder declararlo
```scheme
if >(x,3) then 4 else 5
```

# Modificación a eval-expression

```scheme
      (if-exp (cond-exp true-exp false-exp)
               (let
                   (
                    (cond-value (eval-expression cond-exp env))
                    )
                 (if (boolean? cond-value)
                     (if
                      cond-value
                      (eval-expression true-exp env)
                      (eval-expression false-exp env)
                      )
                     (eopl:error "The condition must be a boolean " cond-exp)
                     )
                 )
               )
      (else "Not implemeted yet")))) 
```