Esta representación también es recursiva, pero es más poderosa que la representación inductiva ya que podemos manejar diferentes casos. Vamos a utilizar gramáticas regulares por la izquierda.

```bnf
<lista> ::= <empty>
		::= <int> <lista>
```

```lisp
'()
'(1)
'(1 2 3)
```

```bnc
<arbol> ::= <int>
		::= <symbol> <arbol> <arbol>
```

```lisp
4
'(k 3 (p 2 (f 1 2)))
```
```bnc
<arbol-t> ::= <int>
		  ::= <symbol><arbol-t> <arbol-t> <arbol-t>
```
```lisp
7
'(k 1 2 3)
'(k (k 2 3 4) 4 (s (t 1 3 2) 2 3))
```

```lisp
#lang eopl
#|
<arbol-t> ::= <int>
		  ::= <symbol><arbol-t> <arbol-t> <arbol-t>

|#
(define arbol1 2)
(define arbol2 '(k 1 2 3))
(define arbol3 '(k (k 2 3 4) 4 (s (t 1 3 2) 2 3)))
(define ovejamala  '(2 (k 2 3 4) 4 (s (t 1 3 2) 2 3)))
;;in-A? arbol -> booleano
(define in-A?
  (lambda (arb)
    (cond
      [(number? arb)]
      [(and
        (symbol? (car arb))
        (in-A? (cadr arb))
        (in-A? (caddr arb))
        (in-A? (cadddr arb))
        )]
      [else #F])))
```