```scheme
let
	func = proc(? f, ? x) (f +(x,1) >(x,0))
	in
		(func 
		 proc (? a, ? b)  a
		 10
		 )
```

# Procedimiento

## 1. Establecer las variables de tipo

| Variable | Expresión                                        | Encontrado                         |
| -------- | ------------------------------------------------ | ---------------------------------- |
| t0       | let .. in ...                                    | int                                |
| tfunc    | proc(? f, ? x) ...                               | <br>`(int*bool-> int)*int -> int ` |
| tf       | f                                                | `int*bool-> int`                   |
| tx       | x                                                | int                                |
| t1       | (f +(x,1) >(x,0)                                 | int                                |
| t2       | +(x,1)                                           | int                                |
| t3       | >(x,0)                                           | bool                               |
| t4       | (func <br>		 proc (? a, ? b)  a<br>		 10<br>		 ) | int                                |
| t5       | proc (? a, ? b)  a                               | `int*bool-> int`                   |
| ta       | a                                                | int                                |
| tb       | b                                                | bool                               |
La variable resultado es t0

## 2. Observar las declaraciones

```text
//Declaraciones de proc
tfunc = tf * tx -> t1
//Evaluaciones
tf = t2*t3 -> t1
tx*int -> t2   int*int -> int   tx = int, t2 = int
tx*int -> t3   int*int -> bool  tx = int, t3 = bool
tfunc = t5*int -> t4
t5 = tf
tx = int
t4 = t1
t5 = ta*tb -> ta
ta = t2
tb = t3
ta = t1
//let
t0 = t4
```

# Demostración

```scheme
(type-of-expression (cases program (scan&parse " let
	func = proc(? f, ? x) (f +(x,1) >(x,0))
	in  let
		res = (func 
		 proc (? a, ? b)  a
		 10
		 ) in res ") (a-program(exp) exp)) (empty-tenv))
#(struct:tvar-type 16 #(#(struct:atomic-type int)))
```

Y ahora con tfunc

```scheme
(type-to-external-form (type-of-expression (cases program (scan&parse " let
	func = proc(? f, ? x) (f +(x,1) >(x,0))
	in  let
		res = (func 
		 proc (? a, ? b)  a
		 10
		 ) in func ") (a-program(exp) exp)) (empty-tenv)))

((int * bool -> int) * int -> int)
```