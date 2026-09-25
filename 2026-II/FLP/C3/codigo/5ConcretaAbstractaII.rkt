#lang eopl
(define-datatype cmd cmd?
  (avanza-cmd (n number?))
  (gira-cmd   (dir symbol?))
  (repite-cmd (n number?) (cmds (list-of cmd?))))

(define (parse-cmd dato)
  (cond ((eq? (car dato) 'avanza) (avanza-cmd (cadr dato)))
        ((eq? (car dato) 'gira) (gira-cmd (cadr dato)))
        ((eq? (car dato) 'repite) (repite-cmd (cadr dato) (parse-cmds (cddr dato))))
        (else (eopl:error "no es un comando:" dato))))

(define (parse-cmds datos)
  (if (null? datos)
      '()
      (cons (parse-cmd (car datos)) (parse-cmds (cdr datos)))))
