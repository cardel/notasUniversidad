
```scheme
#lang eopl
#|Definir las listas de tuplas

<lst-tuple> ::= '()                 empty-t-list()
                    ::= <tupla> <lst-tuple>  
                      non-empty-t-list(tu, lst)

<tupla> ::= <int> <int>  a-tuple(a,b)

lst-tuple->list: Toma una lista de tuplas retorna una lista de numeros
|#

(define-datatype lst-tuple lst-tuple?
  (empty-t-list)
  (non-empty-t-list
   (tu tupla?)
   (lst lst-tuple?)))

(define-datatype tupla tupla?
  (a-tuple
   (a integer?)
   (b integer?)))

; '( (1 2) (3 4) (5 6))
(define tupla1
  (non-empty-t-list
   (a-tuple 1 2)
   (non-empty-t-list
    (a-tuple 3 4)
    (non-empty-t-list
     (a-tuple 5 6)
     (empty-t-list)))))

;;lst-tuple->list: list of tuple -> list of number
(define lst-tuple->list
  (lambda (ltu)
    (cases lst-tuple ltu
      (empty-t-list () '())
      (non-empty-t-list (tu lst)
                        (append
                         (cases tupla tu
                           (a-tuple (a b) (list a b)))
                         (lst-tuple->list lst)
                         )
                        )
      )
    )
  )
(newline)
(display (lst-tuple->list tupla1))

```