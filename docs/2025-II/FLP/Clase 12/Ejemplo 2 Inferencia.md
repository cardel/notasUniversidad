```scheme
let
	f = proc(? x, ? y, ? z)
		if (x y) then *(z,2)
		         else z
	in
		let
			g = proc(? m)
			if m then true else false
		k = 5
		in
			(f g true k)
```

# 1. Variables de tipos


| Variable | expresion     | Tipo                         |
| -------- | ------------- | ---------------------------- |
| t0       | let ... in    | int                          |
| tf       | proc(? x ...) | `bool->bool*bool*int -> int` |
| tx       | x             | bool->bool                   |
| ty       | y             | bool                         |
| tz       | z             | int                          |
| t1       | (x y)         | bool                         |
| t2       | `*(z,2)`      | int                          |
| tg       | proc(? m) ... | bool -> bool                 |
| tk       | 5             | int                          |
| t3       | (f g true k)  | int                          |
| tm       | m             | bool                         |
# Resolver el sistema

```text
t0 = t3

//Declaracion
tf = tx*ty*tz -> t2
tf = tx*ty*tz -> tz
tg = tm -> bool

//Evaluaciones

tx*ty -> t1
t1 = bool //regla de if
t2 = tz //regla de if
tz*int -> t2   //regla prim int*int -> int
tz = int
t2 = int
tm = bool //regla de if
tg = bool -> bool


tf = tg*bool*int -> t3
tg = tx
ty = bool
tz = int
t2 = tz = t3
```

# Comprobación

```scheme
(type-to-external-form (type-of-expression (cases program (scan&parse " let
	f = proc(? x, ? y, ? z)
		if (x y) then *(z,2)
		         else z
	in
		let
			g = proc(? m)
			if m then true else false
		k = 5
		in let
		 	res = (f g true k) in res") (a-program(exp) exp)) (empty-tenv)))
int
> 
```
La salida es int

```scheme
(type-to-external-form (type-of-expression (cases program (scan&parse " let
	f = proc(? x, ? y, ? z)
		if (x y) then *(z,2)
		         else z
	in
		let
			g = proc(? m)
			if m then true else false
		k = 5
		in let
		 	res = (f g true k) in f") (a-program(exp) exp)) (empty-tenv)))
((bool -> bool) * bool * int -> int)
```

Aqui comprobamos a f

```scheme
(type-to-external-form (type-of-expression (cases program (scan&parse " let
	f = proc(? x, ? y, ? z)
		if (x y) then *(z,2)
		         else z
	in
		let
			g = proc(? m)
			if m then true else false
		k = 5
		in let
		 	res = (f g true k) in g") (a-program(exp) exp)) (empty-tenv)))
(bool -> bool)
> 
```
Aqui comprobamos a g