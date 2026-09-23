#lang eopl
#|
<lc-exp> ::= <identifier>
             var-exp(id)
         ::= "lambda" "(" <identifier> ")" <lc-exp>
             lambda-exp(id body)
         ::= "(" <lc-exp> <lc-exp> ")"
             app-exp(rator rand)
|#
(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))
  (lambda-exp (id symbol?)
              (body lc-exp?))
  (app-exp (rator lc-exp?)
           (rand lc-exp?)))


;; Area del programador
;; occurs-free?
;; 1. Si es var-exp debe ser igual al id
;; 2. Si es lambda-exp, debe ser diferente que el id y ocurrir libre en el body
;; 3. Si es app-exp ocurre libre en rator o en rand
(define occurs-free?
  (lambda (exp var)
    (cases lc-exp exp
      (var-exp (id) (equal? id var))
      (lambda-exp (id body)
                  (and
                   (not (equal? id var))
                   (occurs-free? body var)))
      (app-exp (rator rand)
       (or
        (occurs-free? rator var)
        (occurs-free? rand var))))))

;; occurs-bound?
;; 1. Un var-exp nunca ocurre ligado
;; 2. En lambda-exp ocurre ligado en el body, o bien var es el id y ocurre libre en el body
;; 3. En app-exp ocurre ligado en el rator o en el rand

(define occurs-bound?
  (lambda (exp var)
    (cases lc-exp exp
      (var-exp (id) #f)
      (lambda-exp (id body)
                  (or
                   (occurs-bound? body var)
                   (and
                    (equal? var id)
                    (occurs-free? body var))))
      (app-exp (rator rand)
               (or
                (occurs-bound? rator var)
                (occurs-bound? rand var))))))
