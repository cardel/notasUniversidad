# Sesión 01: Repaso Racket

- Racket es un lenguaje de programación multiparadigmas: Funciones, Imperativo, O.O, eventos
- Racket esta basado en el lenguaje LISP Basado en Listas
- Una lista esta compuesta por CABEZA y COLA, existe el caso base de la lista vacia, en otras palabras es una estructura RECURSIVA
- Tenemos nombres que son INMUTABLES y se definen con la palabra define (define variable 1)
- Sin embargo podemos manejar estado con el operador set!
- Los tipos son dinamicos, se determinan en ejecucion (define variableB “hola”)
- Las funciones son ciudadanos de primera clase: son iguales que los valores por ende se pueden enviar como parametro o retornar de funciones
- La sintaxis es en notacion prefija
    - Notacion infija Python/C/java  1+3
    - Racket (+ 1 3)
- La sintaxis esta regida por parentesis ( <f> <args>)
- Se evaluan los parentesis mas internos primero y se evalua de izquierda a derecha

¿Que tipo de notación usar Racket?

Notación prefija basada en parentesis, la operacion SIEMPRE VA DE PRIMERO

```racket
(+ 1 2)
(f 2 3)
(list 1 2 3)
(define a 2)
```

---

Condicionales

```racket
(cond
	[<pregunta> <respuesta>]
	...
	[else <respuesta>]
)

(if
	<pregunta>
	<respuesta si verdad>
	<respuesta otro caso>
)
```

---

Funciones

```racket
(define <nombre>
	(lambda ( <argumentos> )
		<expresion>
	)
)

(define operacion
	(lambda (a b c)
		(if (> a 3) b c)
	)
)
```

---

Listas

```racket
(cons 1 (cons 2 (cons 3 empty))))
(list 1 2 3)
'( 1 2 3) ;Tener cuidado con los llamados a funciones

(car lista) ;Primero/Cabeza
(cdr lista) ;Resto/Cola
(car (cdr lista)) ;Segundo
;Se resuelve primero los parentesis internos de izquierda a derecha
(cadr lista)
...
```