#lang eopl
(define x 3)
(define y (* x 3))

(define f
  (lambda (x) (* x 2)))

(define g
  (lambda (x [acc 0])
    (cond
      [(= x 0) acc]
      [else (g (- x 1) (+ x acc))]
      )
    )
  )

(define h
  (lambda (x [acc 0])
    (if
      (= x 0)
      acc
      (h (- x 1) (+ x acc))
      )
    )
  )

(define lst1 (cons 4 (cons 3 (cons 2 empty))))
(define lst2 (list 4 3 2))
(define lst3 '(4 3 2))

(define ll1 (list (list 1 2) (list 4 3)))
(define ll2 '( ( 1 2) (4 3)))

(define ll3 (list (g 10) (g 20)))
(define ll4 '((g 10) (g 20)))

(define sim 'xads)
(define str "xads")