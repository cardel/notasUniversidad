#lang eopl
#|
<arb> ::= <int>
          leaf(dato)
      ::= <symbol> <arb> <arb>
          node(key left right)
|#

(define-datatype arb arb?
  (leaf (dato number?))
  (node (key symbol?)
        (left arb?)
        (right arb?)
        ))

;; Area del programador

(define arbol1
  (node
   'a
   (node 'b (leaf 1) (leaf 2))
   (node 'c (leaf 2) (leaf 3))))

(define suma-arb
  (lambda (exp)
    (cases arb exp
      (leaf (dato) dato)
      (node (key left right)
            (+ (suma-arb left) (suma-arb right))
            )
      )
    )
  )

(define arbol->lista
  (lambda (exp)
    (cases arb exp
      (leaf (dato) (list dato))
      (node (key left right)
            (append
             (list key)
             (arbol->lista left)
             (arbol->lista right))))))