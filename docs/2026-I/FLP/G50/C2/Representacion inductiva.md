La representacion inductiva nos permite especificar tipos de datos.

Para esto vamos a utilizar la noción de que un valor pertenece a un conjunto y posteriormente armamos los demas de acuerdo a la regla

Por ejemplo el caso de los pares

$$
\begin{align}
2 \in S \\
n \in S \therefore n+2 \in S
\end{align}
$$
Para el caso de las listas de pares

$$
\begin{align}
'() \in LP \\
l \in LP \wedge n  \in S \therefore n :: l \in LP
\end{align}
$$
De esta manera podemos construir los datos a partir de las reglas y podemos verificar si un dato pertenece a ese conjunto

```scheme
#lang eopl

#|
Numeros pares
2 e S
n e S -> n+2 e S
|#

;in-S?: number -> boolean
(define in-S?
  (lambda (n)
    (cond
      [(= n 2) #T]
      [(< n 2) #F]
      [else (in-S? (- n 2))]
      )))

(display "pares")
(newline)
(display (in-S? 10))
(newline)
(display (in-S? 21))

;#Lista de pares
;in-L? lista de pares -> boolean
(define in-L?
  (lambda (l)
    (cond
      [(null? l) #T]
      [(pair? l)
       (and
        (in-S? (car l))
        (in-L? (cdr l)))
       ]
      [else #F]
      )
    )
  )

(newline)
(display "Lista pares")
(newline)
(display (in-L? '(2 4 6 10 2 4 10)))
(newline)
(display (in-L? '(2 4 6 1 10 12 14)))
```