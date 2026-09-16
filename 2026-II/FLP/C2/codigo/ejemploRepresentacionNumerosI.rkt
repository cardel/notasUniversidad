#lang eopl
#|
zero = |0|
succ(n) = n+1
pred(n) = n-1
|#

;;Representacion unaria
;; '() es zero
;; succ(n) (cons #t n)
;; pred(n) (cdr n)

(define zero '())
(define iszero? null?)

(define succ
  (lambda (n)
    (cons #t n)))

(define pred
  (lambda (n)
    (if (iszero? n)
        (eopl:error "No se puede obtener el predecesor de 0")
        (cdr n)))
  )

;; Area del programador
;;Este TAD me ofrece
;; 1) zero  2) iszero?  3) succ 4) pred

(define cinco (succ (succ (succ (succ (succ zero))))))
(define cuatro (succ (succ (succ (succ zero)))))

(define suma
  (lambda (a b)
    (cond
      [(iszero? b) a]
      [else (suma (succ a) (pred b))]
      )
    )
  )

(define mult
  (lambda (a b)
    (letrec
        (
         (multaux
          (lambda (a b acc)
            (cond
              [(iszero? b) acc]
              [else (multaux a (pred b) (suma acc a)) ]))
          )
         )
      (multaux a b zero)
      )
    )
  )
      

(define potencia
  (lambda (a b)
    (letrec
        (
         (potencia
          (lambda (a b acc)
            (cond
              [(iszero? b) acc]
              [else (potencia a (pred b) (mult acc a)) ]))
          )
         )
      (potencia a b (succ zero))
      )
    )
  )