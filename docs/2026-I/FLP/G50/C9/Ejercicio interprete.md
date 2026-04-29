
# Consulta de tipos

```scheme
(type-to-external-form (type-of-program (scan&parse "1")))
int
> (type-to-external-form (type-of-program (scan&parse "true")))
bool
> (type-to-external-form (type-of-program (scan&parse "proc (int x, int y) +(x,y)")))
(int * int -> int)
> (type-to-external-form (type-of-program (scan&parse "proc (int x, int y) proc(bool a, bool b) if a then x else y")))
(int * int -> (bool * bool -> int))

(type-to-external-form (type-of-program (scan&parse "let f = proc(int x, bool y) if y then x else +(x,1) in (f 2 true)")))
int
```

# Erores de tipo

```scheme
(type-to-external-form (type-of-program (scan&parse "proc (int x, int y) proc(bool a, bool b) if a then x else b")))
. . check-equal-type!: Types didn’t match: int != bool in
#(struct:if-exp #(struct:var-exp a) #(struct:var-exp x) #(struct:var-exp b))


(type-to-external-form (type-of-program (scan&parse "let f = proc(int x, bool y) if y then x else +(x,1) in (f true 2)")))
. . check-equal-type!: Types didn’t match: bool != int in
#(struct:true-exp)

(type-to-external-form (type-of-program (scan&parse "let f = proc(int x, bool y) if y then x else +(x,1) in (f 4 true 5)")))
. . type-of-expression: Wrong number of arguments in expression #(struct:app-exp #(struct:var-exp f) (#(struct:lit-exp 4) #(struct:true-exp) #(struct:lit-exp 5))):
expected (int bool)
got (int bool int)
```

# Ejemplo

```scheme
let g = proc (x, y, z)
	if x then +(y z)
		else -(z y)
	f = proc (m, n, o)
		if and(m n) then o
		else *(o 2)
	h = true
	i = false
	fun = proc (v1 , v2 )
			>(v1,v2)
	in
		(g (fun 5 7) (f h i 8) 6)
```

Regla del let, evaluamos al expresion en un ambiente extendido de tipo

Ambiente extendido tiene g,f,h,i, fun

1. Tipo g, x boolean, y int, z int. Evaluamos if x then +(y z)
		else -(z y) en el ambiente de tipo g, if x (bool) ok, +(y,z) la regla es $int*int -> int$ dado que y, z son enteros entonces la expresion int, $-(z,y)$ la regla de la resta $(int*int)->int$ como z, y son enteros entonces la expresion int, dado que then y else son iguales entonces la salida en int. De acuerdo a eso g es $(bool*int*int)->int$ 
2. f, dado que n,m son bool y o es int. ENtonces evaluamos lo interno con un ambiente extendido de tipos que incluye a estas variables. and(n,m) regla $(bool*bool)->bool$ esto se cumple entonces esta expresion es boolean que es lo espera el if. Por otra parte o es int, y $*(o,2)$ que tiene regla $(int*int)->int$ entonces o es entero, por lo que se cumple y la salida total es int, por lo tanto f es $(bool*bool*int)->int$ 
3. h es bool y i es bool
4. fun2, tenemos v1 y v2 son int, reviamos $>(v1,v2)$ que tiene regla $(int*int)->bool$ por lo tanto la salida es bool. Entonces fun2 es tipo $int*int->bool$
5. Esta expresion(g (fun 5 7) (f h i 8) 6) la vamos evaluar en un ambiente extendido de tipos que tiene a las variables anteriores.
	1.  (fun 5 7) y fun tiene tipo $int*int->bool$ aqui es correcto, por lo que esto es un bool (porque es una evaluación)
	2. (f h i 8), f tiene tipo $(bool*bool*int)->int$  entonces h es bool (correcto), i es bool (correcto), 8 es int (correcto), por lo que nos retorna un int
	3. Resolviendo (g bool int 6) comparamos con g, $(bool*int*int)->int$ , primer argumento ok, segundo argumento ok, tercer argumento ¿6 es int? si, por que lo la expresión nos retorna un int.