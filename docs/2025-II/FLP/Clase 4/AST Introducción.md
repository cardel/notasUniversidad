
# Arboles de sintaxis abtracta

En este momento tenemos limitaciones con respecto a la presentación, vimos dos representaciones

1. Basada en listas
2. Basada en procedimientos

Sin embargo estamos limitados por el lenguaje de programación (Racket), vamos a utilizar los arboles de sintaxis abstracta

# ¿Que son?

Son represent
aciones desde la gramatica, donde relaciona la estructura del tipo de dato con respecto a su especificación

```
<lc-exp> ::= <identifier>
			var-exp(id)
		 ::= "lambda" "(" <identifier>* ")" <lc-exp>
		  lambda-exp(lid, exp)
		 ::= "(" <lc-exp> <lc-exp> ")"
		  app-exp(rator, rand)
```

Usando los constructores var-exp, lambda-exp y app-exp

```lisp
(var-exp 'x)
```
```mermaid
graph TD
    var-exp -->|id| x
```
```lisp
(lambda-exp (list x y z) (var-exp 'y))
```
```mermaid
graph TD
	lambda-exp -->|lid|A[x,y,z]
	lambda-exp -->|exp|B[var-exp]
	B -->|id|y
```
```lisp
(app-exp
	(app-exp 
		(lambda-exp  '(a b c) (lambda '(x y z) (var-exp 'x)))
		(var-exp 'z)
	)
	(lambda-exp '(a b c d e f) (var-exp 'e))
)
```
```mermaid
graph TD
	A[app-exp] -->|rator| B[app-exp]
	A[app-exp] -->|rand| C[lambda-exp]
	B -->|rator| D[lambda-exp]
	B -->|rand| E[var-exp]
	D -->|lid| F[a,b,c]
	D -->|exp| G[lambda-exp]
	G -->|lid| H[x,y,z]
	G -->|exp| I[var-exp]
	I -->|id| J[x]
	E -->|id| K[z]
	C -->|lid| L[a,b,c,d,e,f]
	C -->|exp| M[var-exp]
	M -->|id| N[e]
```

Esta representación permite

1. Saber si el código fuente está bien escrito
2. Representar los datos de una forma independiente de los lenguajes de programación


```lisp
(app-exp
	(app-exp
		(app-exp
			(app-exp
				(var-exp 'x)
				(lambda-exp '(a b c) 
					(var-exp 'y)
				)
			)
			(app-exp
				(lambda '(x y z) (var-exp 'p))
				(lambda '(m n o p q r t u)
					(lambda '(v w x y z)
						(lambda
							 '(a b c)
							 (var-exp 'p)
						)
					)
				)
			)
		)
		(app-exp
			(var-exp 's)
			(var-exp 'r)
		)
	)
	(app-exp
		(app-exp
			(var-exp 'a)
			(var-exp 'b)
		)
		(var-exp 'x)
	)
)
```
```mermaid
graph TD
	A[app-exp] -->|rator| B[app-exp]
	A -->|rand| C[app-exp]
	B[app-exp] -->|rator| D[app-exp]
	B -->|rand| E[app-exp]
	D[app-exp] -->|rator| F[app-exp]
	D -->|rand| G[app-exp]
	F -->|rator| H[var-exp]
	H -->|id| I[x]
	F -->|rand| J[lambda-exp]
	J -->|lid| K[a,b,c]
	J -->|exp| L[var-exp]
	L -->|id| M[y]
	G -->|rator| N[lambda-exp]
	G -->|rand| O[lambda-exp]
	N -->|lid| P[x,y,z]
	N -->|exp| Q[var-exp]
	Q -->|id| R[p]
	O -->|lid| S[m n o p q r t u]
	O -->|exp| T[lambda-exp]
	T -->|lid| U[v w x y z]
	T -->|exp| V[lambda-exp]
	V -->|lid| W[a b c]
	V -->|exp| X[var-exp]
	X -->|id| Y[p]
	C -->|rator| Z[app-exp]
	C -->|rand| AA[var-exp]
	AA -->|id| AF[x]
	Z -->|rator| AB[var-exp]
	AB -->|id| AC[a]
	Z --> |rand| AD[var-exp]
	AD -->|id| AE[b]
	E -->|rator| AG[var-exp]
	AG -->|id| AH[s]
	E -->|rand| AI[var-exp]
	AI -->|id| AJ[r]
```

