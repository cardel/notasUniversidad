#lang eopl
#|
zero = |0|
succ(n) = n+1
pred(n) = n-1
|#

;;Representacion por base (cons r q)
;; Por ejemplo base es 16 (F 10) = F + 10*16 = 15 + 160 = 175
;; Por ejemplo base es 10 (2 3) = 2 + 3*10 = 32
;; Por ejemplo base es 10 (1 2 3) = 321
;; Por ejemplo base es 2 (1 1 0 1) = 1011 = 11
;; Por ejemplo base 10 (9 8) -> (0 9)
;; '() es zero
;; succ(n) Siguiente numero |q| + 1
;; pred(n) Anterior numero |q| - 1

(define base 16)
(define zero '())
(define iszero? null?)

;; 1299 + 1 => 129  9 -> 0, 12 9+1 0 -> 1 2+1 0 0 -> 1300
;; Acarreo
(define succ
  (lambda (n)
    (cond
      [(iszero? n) '(1)]
      [(equal? (car n) (- base 1)) (cons 0 (succ (cdr n)))]
      [else (cons (+ 1 (car n)) (cdr n))]
      )
    )
  )
;;

;; 10 - 1 -> (1-1) 9 = 09 = 9
(define pred
  (lambda (n)
    (if (iszero? n)
        (eopl:error "No se puede obtener el predecesor de 0")
        (cond
          [(equal? n (succ zero)) '()]
          [(equal? (car n) 0) (cons (- base 1) (pred (cdr n)))]
          [else (cons (- (car n) 1) (cdr n))]
          )
        )
    )
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