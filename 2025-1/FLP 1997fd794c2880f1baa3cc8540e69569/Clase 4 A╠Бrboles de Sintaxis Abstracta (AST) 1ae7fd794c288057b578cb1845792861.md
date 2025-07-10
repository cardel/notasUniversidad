# Clase 4. Árboles de Sintaxis Abstracta (AST)

[NotasClase_annotated.pdf](Clase%204%20A%CC%81rboles%20de%20Sintaxis%20Abstracta%20(AST)%201ae7fd794c288057b578cb1845792861/NotasClase_annotated.pdf)

# Ejemplos

## Ejemplo lc-exp

```racket
#lang eopl
#|
<lc-exp> ::= <identificador>
             var-exp(id)
         ::= "lambda" "(" <identificador> ")" <lc-exp>
             lambda-exp(id, exp)
         ::= "(" <lc-exp> <lc-exp> ")"
             app-exp(rator, rand)
|#
(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))
  (lambda-exp (id symbol?)
              (exp lc-exp?))
  (app-exp (rator lc-exp?)
           (rand lc-exp?)))

;;;Area del programador
;;Constructores
;;lambda(x) lambda (y) z
(define exp1
  (lambda-exp 'x (lambda-exp 'y (var-exp 'z))))

;;(x y)
(define exp2
  (app-exp (var-exp 'x) (var-exp 'y)))

;;Observadores
;; cases
;;Ocurre libre
;; 1. si es un var-exp la variables deben ser iguales
;; 2. Si es un lambda-exp debe ser diferente del identificador y ocurrir libre en la exp
;; 3. Si es un app-exp debe ocurrir libre en rator o en rand
(define occurs-free?
  (lambda (exp var)
    (cases lc-exp exp
      (var-exp (id) (eqv? var id))
      (lambda-exp (id exp1)
                  (and
                   (not (eqv? var id))
                   (occurs-free? exp1 var)))
      (app-exp (rat ran)-
               (or
                (occurs-free? rat var)
                (occurs-free? ran var))))))

```

## Caso listas

```racket
#lang eopl
#|
<lista-s> ::= '()
             empty-list()
          :: <symbol> <lista-s>
             non-empty-list(s,l)
|#
(define-datatype lista-s lista-s?
  (empty-list)
  (non-empty-list (s symbol?)
                  (l lista-s?)))

;;Area del programador
(define lista1
  (non-empty-list 'x (non-empty-list 'y (empty-list))))

;;Función que me busque un simbolo

;;find-sym: <lista-s> => <bool>
(define find-sym
  (lambda (l s)
    (cases lista-s l
      (empty-list () #F)
      (non-empty-list (sy ls)
                      (if
                       (eqv? sy s)
                       #T
                       (find-sym ls s))))))

(display (find-sym lista1 'y)) ;T
(display "\n")
(display (find-sym lista1 'w)) ;F

```

## Caso ambientes

```racket
#lang eopl
#|
<env> ::= '()
                 empty-env-record()
           (<identificador>* <expression>*)
                 extend-env-record(lid lval)
|#

(define-datatype environment environment?
  (empty-env-record)
  (extend-env-record
   (lid (list-of symbol?))
   (lval (list-of value?))
   (env environment?)
   ))

(define value? (lambda (x) #T))

(define e
  (extend-env-record
   '(a b c)
   '(1 2 3)
   (extend-env-record
    '(e f g)
    '(4 5 6)
    (empty-env-record))))
```

# Ejercicio en clase

[ejercicio_annotated.pdf](Clase%204%20A%CC%81rboles%20de%20Sintaxis%20Abstracta%20(AST)%201ae7fd794c288057b578cb1845792861/ejercicio_annotated.pdf)

```racket
#lang eopl
#|
<lc-exp> ::= <identificador>
              var-exp(id)
         ::= "(" "lambda" "(" <identificador>* ")" <lc-exp> ")"
              lambda-exp(lid, exp)
         ::= "(" <lc-exp> <lc-exp> ")"
              app-exp(rator, rand)
|#
(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))
  (lambda-exp (lid (list-of symbol?))
              (exp lc-exp?))
  (app-exp (rator lc-exp?)
           (rand lc-exp?)))
;;Area del programador
;;(lambda (x y z ) (lambda (x y) (x (lambda (x) y))))
(define exp1
  (lambda-exp
   '(x y z)
   (lambda-exp
    '(x y)
    (app-exp
     (var-exp 'x)
     (lambda-exp
      '(x)
      (var-exp 'y))))))

;;unparser: lc-exp --> lista
(define unparser
  (lambda (exp)
    (cases lc-exp exp
      (var-exp (d) (list 'var-exp d))
      (lambda-exp (lid body)
                  (list 'lambda-exp lid
                        (unparser body)))
      (app-exp (rator rand)
       (list
        'app-exp
        (unparser rator)
        (unparser rand))))))

(define lista1 (unparser exp1))

;;parser: lista -> lc-exp
(define parser
  (lambda (lst)
    (cond
      [(eqv? (car lst) 'var-exp)
       (var-exp (cadr lst))]
      [(eqv? (car lst) 'lambda-exp)
       (lambda-exp
        (cadr lst)
        (parser (caddr lst)))]
      [(eqv? (car lst) 'app-exp)
             (app-exp
              (parser (cadr lst))
              (parser (caddr lst)))]
      [else (eopl:error "La expresión no tiene la forma correcta")])))
```