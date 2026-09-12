; Paradigma funcional: se dice QUE es el factorial, no como calcularlo
(define (factorial n)
  (if (= n 0)
      1
      (* n (factorial (- n 1)))))

(display (factorial 5))
(newline)
