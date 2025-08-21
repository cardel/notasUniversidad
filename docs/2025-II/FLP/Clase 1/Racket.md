# Definición

Es un lenguaje de programación multiparadigma, que trabaja diferentes paradigmas de programación

- Funcional
- Procedural
- Objetos
- Eventos

Vamos a trabajar en el enfoque funcional

# Carácteristicas

Utiliza notación prefija, primero va la función y después los argumentos. Utiliza una notación basada en paréntesis
```racket
#lang eopl

(define pollito 5)
(define gaillinita (* pollito 2)
```
Las funciones se van a declarar con lambda, no se acepta otra notación. Porque las funciones van ser **valores**
```racket
(define funcion
	(lambda (x y)
		(+ x y)	
	)
)

(funcion 1 2)

;Funciones con parametro por defectos
(define funcionPro
	(lambda (x [p 8])
		(+ x p)
	)
)
(funcionPro 4) ;12
(funcionPro 4 9) ;13
```

# Estructuras

# Condicionales
```
(define funcion
	(lambda (x y)
		(cond
			[(> x 5) (+ x y)]
			[(and (> x 0) (< x 5)) (* x y)]
			[else (+ x y 2)]
		)
	)
)
```
# Listas
```racket
(list 1 2 3 5) ;(1 2 3 4)
(cons 1 (cons 2 (cons 3 (cons 5 empty)))) ;(1 2 3 4)

'(1 2 3 4 a b (1 2 3))
(list 1 2 3 'a 'b (list 1 2 3))

(car l) ;cabeza
(cdr l) ;cola

(define l '(1 2 3 4 5))
(car l) ; 1
(cdr l) ; '(2 3 4 5)
(car (cdr l)) ; 2
(car (cdr (cdr l))) ; 3

(cadr l) ; car del cdr
(caddr l) ; car del cdr del cdr

(define sumarL
	(lambda (lst)
		(cond
			[(null? l) 0]
			[else (+ (car l) (sumarL (cdr l)))]
		)
	)
)

(define sumarColita
	(lambda (lst [acc 0])
		(cond
			[(null? l) acc]
			[else (sumarL (cdr l) (+ acc (car l))))]
		)
	)
)
```