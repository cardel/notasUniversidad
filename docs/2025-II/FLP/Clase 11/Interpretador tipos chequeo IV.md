# Let

El `let` genera un ambiente extendido de tipos, considerando las declaraciones y la expresión en el `in` que se evalúa en el ambiente extendido de tipos.

```scheme
(let-exp (lid lval exp)
               (type-of-expression
                exp
                (extend-env
                 lid
                 (list->vector (map (lambda (x) (type-of-expression x tenv)) lval))
                 tenv)))
```

Se calculan los tipos de los valores y se crea un ambiente extendido con ellos, y ahí se evalúa la expresión.