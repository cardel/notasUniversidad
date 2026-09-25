#lang eopl
#|
<lst> ::= '()
      ::= <int> <lst>
|#

(define sumar-lista
  (lambda (lst)
    (cond
      [(null? lst) 0] ;; <lst> ::= '()
      [else (+ (car lst) (sumar-lista (cdr lst)))] ;; <lst> ::= <int> <lst>
      )))

(sumar-lista '(1 2 3 4 5))