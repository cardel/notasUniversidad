#lang eopl
#|
<lc-exp> ::= <identifier>
                     var-exp(id)
                 ::= "lambda" "(" <identifier> ")" <lc-exp>
                    lambda-exp(id exp)
                 ::= <lc-exp> <lc-exp>
                    app-exp(rator rand)
|#

;; TAD lambda-exp

(define var-exp
  (lambda (id)
    (lambda (s)
      (cond
        [(= s 0) 'var-exp]
        [(= s 1) id]))))

(define lambda-exp
  (lambda (id exp)
    (lambda (s)
      (cond
        [(= s 0) 'lambda-exp]
        [(= s 1) id]
        [(= s 2) exp]))))

(define app-exp
  (lambda (rator rand)
    (lambda (s)
      (cond
        [(= s 0)'app-exp]
        [(= s 1) rator]
        [(= s 2) rand]))))

;; Observadores

;; Predicados
(define var-exp?
  (lambda (e)
    (equal? (e 0) 'var-exp)))

(define lambda-exp?
  (lambda (e)
    (equal? (e 0) 'lambda-exp)))

(define app-exp?
  (lambda (e)
    (equal? (e 0) 'app-exp)))

;; Extractores

(define var-exp->id
  (lambda (e)
    (e 1)))

(define lambda-exp->id
  (lambda (e)
    (e 1)))

(define lambda-exp->exp
  (lambda (e)
    (e 2)))

(define app-exp->rator
  (lambda (e)
    (e 1)))

(define app-exp->rand
  (lambda (e)
    (e 2)))

;; Area de programador

(define e
  (lambda-exp 'e
              (app-exp
               (var-exp 'x)
               (lambda-exp 'p
                           (var-exp 'y)))))

#|
Occurs-free?
1. Si es un var-exp debe ser igual al id
2. Si es lambda-exp debe ser diferente al id y ocurrir libre en la exp
3. Si es app-exp entonces ocurre libre en rator o en el rand
|#
(define occurs-free?
  (lambda (e var)
    (cond
      [(var-exp? e) (equal? (var-exp->id e) var)]
      [(lambda-exp? e)
       (and
        (not (equal? var (lambda-exp->id e)))
             (occurs-free? (lambda-exp->exp e) var)
             )]
      [(app-exp? e)
       (or
        (occurs-free? (app-exp->rator e) var)
        (occurs-free? (app-exp->rand e) var))]
      [else
       (eopl:error 'occurs-free?
                   "La expresion ~s no es correcta"
                   e)]
      )
    )
  )

#|
occurs-bound?
1. Si es un var-exp nunca ocurre ligada
2. Si es lambda-exp ocurre ligada en la exp, o bien id = var y var ocurre libre en la exp
3. Si es app-exp ocurre ligada en el rator o en el rand
|#

(define occurs-bound?
  (lambda (e var)
    (cond
      [(var-exp? e) #f]
      [(lambda-exp? e)
       (or
        (occurs-bound? (lambda-exp->exp e) var)
        (and
         (equal? var (lambda-exp->id e))
         (occurs-free? (lambda-exp->exp e) var)))]
      [(app-exp? e)
       (or
        (occurs-bound? (app-exp->rator e) var)
        (occurs-bound? (app-exp->rand e) var))
       ]
      [else
       (eopl:error 'occurs-bound?
                   "La expresion ~s no es correcta"
                   e)]
      )
    )
  )