# Tipo abstracto de dato (TAD)

Son tipos de datos los cuales utilizamos para representar datos en el computador, TADs son independientes de como se trabajan en memoria

```java
int pollito = 8;
//Internamente 0000000000000000000..1000
//32 bits
```
Esto no es un TAD dado que es una representación 32 en memoria, esto tiene ventajas y desventajas

1. Operaciones son nivel de la CPU, por ende, eficientes
2. Limitaciones: por ejemplo el rango de trabajo $$ -2^{32}, 2^{32}-1 $$ si usted se pasa de ese rango, hay desbordamiento
3. Caso analogo pasa con los tipos de datos float, char, double, boolean, short, etc

```python
a = 3
#a no es un número, es un objeto
#las operaciones requiren una implemetación interna
```
1. La represenación es una instancia de una clase
2. Tiene un comportamiento definido en su implementación (esto no lo vemos)
3. No tiene limitaciones con respecto al tamaño

```lisp
(define x 10)
```
x es una representación de un numero, pero esta es recursiva, partiendo de este hecho
$$
\begin{align}
\lceil 0 \rceil \in \mathbb{ N } \\
n \in \mathbb{ N } \rightarrow n+1 \in \mathbb{ N }
\end{align}
$$

# Ejemplos de representación

# Recursiva

1. 0 es un numero natural
2. Si n es un numero natural succ(n) = n+1 es un numero natural y pred(n) = n-1 es un numero natural
3. zero?(n) si el numero es cero
```lisp
#lang eopl
;;Implementación interna (no lo ve el programador)
(define zero 0)
(define isZero? (lambda (n) (eqv? n zero)))

(define succ (lambda (n) (+ n 1)))
(define pred (lambda (n) (- n 1)))

;;; Area del programador

(define cinco (succ (succ (succ (succ (succ zero)))))) ; (define cinco 5)

(define suma
  (lambda (a b)
    (cond
      [(isZero? b) a]
      [else (suma (succ a) (pred b))]
      )
    )
  )

(define diez (suma cinco cinco))

(define multiplicacion
  (lambda (a b)
    (cond
      [(isZero? b) zero]
      [(eqv? (succ zero) b) a]
      [else (suma a (multiplicacion a (pred b)))]
      )
    )
  )

(define cincuenta (multiplicacion cinco diez))
```
