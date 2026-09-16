#lang eopl
(define (in-lc-exp? e)
  (cond ((symbol? e) #t)
        ((not (pair? e)) #f)
        ((eq? (car e) 'lambda)
         (and
          (list? (car (cdr e)))
          (symbol? (car (car (cdr e))))
          (in-lc-exp? (car (cdr (cdr e))))
          )
         )
         (else
          (and
           (= (length e) 2)
           (or
                (in-lc-exp? (car e))
                (in-lc-exp? (cadr e))
                )
           )
          )
         )
  )


(define (in-b-tree? t)
  (cond ((number? t) #t)
        ((not (pair? t)) #f)
        (else
         (and 
          (= (length t) 3)
          (symbol? (car t))
          (in-b-tree? (car (cdr t)))
          (in-b-tree? (car (cdr (cdr t))))
          )
         )
        )
  )
