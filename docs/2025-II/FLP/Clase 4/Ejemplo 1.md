# Arboles binarios
```scheme
#lang eopl
#|
<tree> ::= <int>
            leaf(datum)
       ::= <symbol> <tree> <tree>
            node(key, left, right)

|#

(define-datatype tree tree?
  (leaf (datum number?))
  (node
   (key symbol?)
   (left tree?)
   (right tree?)
   ))

;; Area del programador

(define treeA
  (node 'a
        (node 'b
              (node 'd
                   (node 'h (leaf 7) (leaf 8))
                   (node 'i (leaf 9) (leaf 10))
               )
              (node 'e (leaf 1) (leaf 2))
        )
        (node 'c
              (node 'f (leaf 3) (leaf 4) )
              (node 'g (leaf 5) (leaf 6) )
              )
        )
  )

;; preorder: tree -> lista
(define preorder
  (lambda (t)
    (cases tree t
      (leaf  (datum) (list datum))
      (node (key left right)
       (append
        (list key)
        (preorder left)
        (preorder right)
        )
      ))))
 

(display (preorder treeA))
(display "\n")


(define posorder
  (lambda (t)
    (cases tree t
      (leaf  (datum) (list datum))
      (node (key left right)
       (append
        (posorder left)
        (posorder right)
        (list key)
        )
      ))))
 

(display (posorder treeA))
(display "\n")


(define inorder
  (lambda (t)
    (cases tree t
      (leaf  (datum) (list datum))
      (node (key left right)
       (append
        (inorder left)
        (list key)
        (inorder right)
        )
      ))))
 

(display (inorder treeA))
(display "\n")
```