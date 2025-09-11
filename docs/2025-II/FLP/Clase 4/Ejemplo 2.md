# Ejemplo con ambientes
```scheme
#lang eopl
#|
<enviroment> ::= '()
                 empty-env()
             ::= <symbol>* <values>* <enviroment>
                 extend-env(lid lval old-env)
|#

(define-datatype environment environment?
  (empty-env)
  (extend-env
   (lid (list-of symbol?))
   (lval (list-of  value?))
   (old-env environment?)))

(define value? (lambda (x) #T))

(define env1
  (extend-env
   '(x y z)
   '(1 2 3)
   (extend-env
    '(a b c)
    '(4 5 6)
    (empty-env))))
;;apply-env: environment -> value
(define apply-env
  (lambda (env var)
    (cases environment env
      (empty-env () (eopl:error "No encuentro a " var))
      (extend-env (lid lval old-env)
                  (letrec
                      (
                       (search-var
                        (lambda (li lv)
                          (cond
                            [(null? li) (apply-env old-env var)]
                            [(equal? (car li) var) (car lv)]
                            [else (search-var (cdr li) (cdr lv))]
                            ))
                        )
                       )
                   (search-var lid lval)
                    )
                  )
      )
    )
  )

(display (apply-env env1 'x))
(display "\n")
(display (apply-env env1 'y))
(display "\n")
(display (apply-env env1 'z))
(display "\n")
(display (apply-env env1 'a))
(display "\n")
(display (apply-env env1 'b))
(display "\n")
(display (apply-env env1 'c))
(display "\n")
(display (apply-env env1 'w))
```