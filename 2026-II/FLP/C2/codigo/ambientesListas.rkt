#lang eopl
#|
<environment> ::= '()
                 empty-env()
             ::= <lista id> <list val> <environment>
                 extend-env(lid lval old-env)
|#

;; Interfaz
;; Constructores
(define empty-env
  (lambda ()
    (list 'empty-env)))

(define extend-env
  (lambda (lid lval old-env)
    (list 'extend-env lid lval old-env)))

;; Predicados
(define empty-env?
  (lambda (e)
    (equal? (car e) 'empty-env)))

(define extend-env?
  (lambda (e)
    (equal? (car e) 'extend-env)))

;; Extractores

(define extend-env->lid
  (lambda (e)
    (cadr e)))

(define extend-env->lval
  (lambda (e)
    (caddr e)))

(define extend-env->old-env
  (lambda (e)
    (cadddr e)))

;; Area del programador

(define e
  (extend-env '(a b c) '(1 2 3)
              (extend-env '(x y z) '(4 5 6)
                      (empty-env))))


(define apply-env
  (lambda (e var)
    (cond
      [(empty-env? e) (eopl:error 'apply-env "La variable ~s no está en el ambiente" var)]
      [(extend-env? e)
       (letrec
           (
            (buscar-var
             (lambda (lid lval old-env)
               (cond
                 [(null? lid)
                  (apply-env old-env var)]
                 [(equal? (car lid) var)
                  (car lval)]
                 [else
                  (buscar-var (cdr lid) (cdr lval) old-env)]
                 )
               )
             )
            )
         (buscar-var
          (extend-env->lid e)
          (extend-env->lval e)
          (extend-env->old-env e)
          )
         )

       ]
      [else (eopl:error 'apply-env "El dato ~s es invalido" e)]
      )
    )
  )