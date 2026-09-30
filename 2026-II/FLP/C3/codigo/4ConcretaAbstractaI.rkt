#lang eopl
#|
<lc-exp> ::= <identifier>
             var-exp(id)
         ::= "lambda" "(" <identifier> ")" <lc-exp>
             lambda-exp(id body)
         ::= "(" <lc-exp> <lc-exp> ")"
             app-exp(rator rand)
|#

(define exp1 'x)
(define exp2 '(lambda (x) (y x)))
(define exp3 '( (lambda (j) x) (y (lambda (f) (f y)))))


(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))
  (lambda-exp (id symbol?)
              (body lc-exp?))
  (app-exp (rator lc-exp?)
           (rand lc-exp?)))


;; Parser
;; sintaxis concreta -> sintaxis abstracta
(define parser
  (lambda (exp)
    (cond
      [(symbol? exp) (var-exp exp)]
      [(equal? (car exp) 'lambda)
       (lambda-exp (caadr exp)
                   (parser (caddr exp)))]
      [else
       (app-exp
        (parser (car exp))
        (parser (cadr exp)))]
      )
    )
  )

;;unparser: sintaxis abstracta a concreta
(define unparser
  (lambda (exp)
    (cases lc-exp exp
      (var-exp (id) id)
      (lambda-exp (id body)
                  (list 'lambda (list id)
                        (unparser body)))
      (app-exp (rator rand)
               (list
                (unparser rator)
                (unparser rand)))
      ))
  )
                   