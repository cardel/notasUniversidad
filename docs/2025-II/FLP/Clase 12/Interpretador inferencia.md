En inferencia de tipos el interpretador va a realizar calculos para estimar los tipos de los argumentos en los procedimientos, va haber muchas veces en las que no son proporcionados

```scheme
letrec
	? f(? x, ? y) = if >(x,0) then (f -(x,1) +(y,1)) else y
	in
		(f 10 20)
```

En este punto podemos decir que el procedimiento que retorna un int y que los argumentos son int

Para esto se va introducir en el interprete algo conocido como optional-type (?), este es el que vamos a inferir.

Para inferir vamos a crear algo que se llama variable de tipo, la cual es de asignación unica, esta variable si se intenta asignar con un valor diferente va dar un error de tipo

```scheme
(type-of-expression (cases program (scan&parse " letrec
	int f(? x, ? y) = if x then (f x +(y,1)) else y
	in
		f") (a-program(exp) exp)) (empty-tenv))
```

Aqui es correcto decir que x es un bool

Pero

```scheme
(type-of-expression (cases program (scan&parse " letrec
	int f(? x, ? y) = if x then (f +(x,2) +(y,1)) else y
	in
		f") (a-program(exp) exp)) (empty-tenv))
```

x por la regla del condicional es un bool, pero en el cuerpo encontramos +(x,2) lo que dice que x debe ser un int, al intentar reasignar nos da un error de tipo

# Inferencia

Vamos a establecer unas reglas

## Condicionales

```ebnf
<expression> ::= "if" <expression> "then" <expression> "else" <expression>
                 (cond-exp true-exp false-exp)
```

1. cond-exp tiene que ser bool
2. true-exp debe ser igual a false-exp

# Procedimientos

```ebnf
<expression> ::= "proc" "("(type-exp identifer ',')*")" <expression>
               proc-exp(targs args body)
```

La regla de un procedimiento es

```
(t1*t2*t3*...*tn) -> t
```
Naturalmente, los tipos de los argumentos depende de los argumentos que enviemos y del cuerpo del procedimiento

```scheme
(type-of-expression (cases program (scan&parse " proc(? x) +(x,1)") (a-program(exp) exp)) (empty-tenv))
#(struct:proc-type
  (#(struct:tvar-type 39 #(#(struct:atomic-type int))))
  #(struct:tvar-type 40 #(#(struct:atomic-type int))))
```

Si no podemos condicionar los procedimientos, entonces es de tipo **polimorfico** es decir que no hay tipo establecido

```scheme
(type-of-expression (cases program (scan&parse " proc(? x) x") (a-program(exp) exp)) (empty-tenv))
#(struct:proc-type (#(struct:tvar-type 41 #(()))) #(struct:tvar-type 41 #(())))
```

Podemos condicionar el procedimiento

```scheme
(type-of-expression (cases program (scan&parse "let k = proc(? x) x in let f = (k 10) in k") (a-program(exp) exp)) (empty-tenv))
```

El llamado (k 10) condiciona que la entrada y salida del proc deben ser int

```scheme
(type-of-expression (cases program (scan&parse "let k = proc(? x) x in let f = (k 10) in let s = (k true) in k") (a-program(exp) exp)) (empty-tenv))
. . check-equal-type!: Type mismatch: int doesn't match bool in #(struct:app-exp #(struct:var-exp k) (#(struct:true-exp)))
```

Ya en este da un error de tipos dado que inicialmente el proc es int->int pero el segundo llamado (k true) implica bool -> bool lo que contradice el primer valor encontrado.


## Primitivas

1. Primitivas numericas `int*int*...*int -> int`
2. Primitivas relacionales `int*int -> bool`
3. Primitivas lógicas `bool*bool*...*bool -> bool`

Las primitivas funcionan como procedimientos
# Aplicacion de procedimientos

Es invocar un procedimiento, ejemplo (f 1 2 3), el tipo de la aplicación es el tipo resultado de procedimiento

tf = bool -> int
(f true) esto tiene que dar un int

```ebnf
<expression> ::= "(" expression (expression)* ")"
                  app-exp(rator rands)
```

Tenemos

1. El rator tiene que ser un proc-type el cual tiene targs -> result-type
2. El tamaño targs debe ser igual al tamaño de los rands
3. Los tipos de los targs deben ser iguales a los tipos de los rands

# Como hacemos inferencia

1. Establecemos las variables de tipo, cada expresión dentro del código tiene asociado una variable de tipo
2. Establecemos los tipos de los procedimientos
3. Establecemos los tipos de las aplicaciones a los procedimientos.