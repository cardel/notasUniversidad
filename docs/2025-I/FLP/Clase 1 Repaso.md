# Clase 1: Repaso

[https://docs.racket-lang.org/eopl/](https://docs.racket-lang.org/eopl/)  Documentación de Racket

# Racket

¿Que es Racket?

- Lenguaje de programación basado en parentesis y notación prefija
- (+ 1 2)
- Estructura: (operacion arg1 arg2 arg3 … argn)

---

Listas

- (cons elemento lista)

```racket
(cons 1 (cons 2 empty))
```

- car primer elemento
- cdr resto
- Se pueden combinar y hay expresiones para hacerlos en un solo paso

```racket
(car (cdr l)) ;; El segundo
(cadr l)

(car (cdr (cdr l))) ;; Tercero
(caddr l)
```

---

Funciones

```racket
(define l
  (lambda (x y) (+ x y))
 )
 
 (define <nombre>
   (lambda (<argumentos>)
          <expresion>
    )
  )
```