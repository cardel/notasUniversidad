#lang eopl
(define x
  ; declara x1
  (lambda (x)
    ; declara x2
    (map (lambda (x) ; declara x3
           (+ x 1)) ; referencia a x3
         x)))
; referencia a x2
(x '(1 2 3))
; referencia a x1


(define (cuantas-libres exp var)
  (cond ((symbol? exp) 
         (if
          (equal? exp var)
          1
          0
          ))
        ((equal? (car exp) 'lambda)
         (cond
           [(equal? (car (car (cdr exp))) var) 0]
           [else (cuantas-libres (car (cdr (cdr exp))) var)]
           )
         )
        (else
         (+
          (cuantas-libres (car exp) var)
          (cuantas-libres (car (cdr exp)) var)
          ))
        )
  )
