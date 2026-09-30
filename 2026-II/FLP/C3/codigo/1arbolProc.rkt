#lang eopl
#|
<arb> ::= <int>
          leaf(dato)
      ::= <symbol> <arb> <arb>
          node(key left right)
|#

(define leaf
  (lambda (dato)
    (lambda (s)
      (cond
        [(= s 0) 'leaf]
        [(= s 1) dato]
        [else (eopl:error 'leaf "Error en leaf ~s" s)]
        )
      ) 
    )
  )

(define node
  (lambda (key left right)
    (lambda (s)
      (cond
        [(= s 0) 'node]
        [(= s 1) key]
        [(= s 2) left]
        [(= s 3) right]
        [else (eopl:error 'node "Error en node ~s" s)])
      )
    )
  )

;;Procedimientos observadores
;; Predicados

(define leaf?
  (lambda (arb)
    (eqv? (arb 0) 'leaf)))

(define node?
  (lambda (arb)
    (eqv? (arb 0) 'node)))

;; Extractores
(define leaf->dato
  (lambda (arb)
    (arb 1)))

(define node->key
  (lambda (arb)
    (arb 1)))

(define node->left
  (lambda (arb)
    (arb 2)))

(define node->right
  (lambda (arb)
    (arb 3)))

;;; Area del programador

(define suma-arb
  (lambda (arb)
    (cond
      [(leaf? arb) (leaf->dato arb)]
      [(node? arb) (+
                    (suma-arb (node->left arb))
                    (suma-arb (node->right arb)))]
      [else (eopl:error 'sum-arb "El dato no es un arbol ~s" arb)]
      )))

(define arbol1
  (node
   'a
   (node 'b (leaf 1) (leaf 2))
   (node 'c (leaf 2) (leaf 3))))

