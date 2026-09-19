#lang eopl

#|(quita-y-cuenta 'a '(a b a c)) → ((b c) 2)
(quita-y-cuenta 'a '()) → (() 0)
(quita-y-cuenta 'z '(a b)) → ((a b) 0)
(quita-y-cuenta 'a '(a a a)) → (() 3)
|#

(define (quita-y-cuenta s lst)
  (cond ((null? lst) (list '() 0))
        ((eq? (car lst) s)
         (let ([resto (quita-y-cuenta s (cdr lst))])
           (list (car resto) (+ 1 (car (cdr resto))))))
        (else
         (let ([resto (quita-y-cuenta s (cdr lst))])
           (list (cons (car lst) (car resto)) (car (cdr resto)))))))