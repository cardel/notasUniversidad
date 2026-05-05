
# ¿Que es?

En chequeo anotamos todos los tipos en los procedimientos.

```scheme
let
	f = proc(int x, int y)
	in
		(f 2 3)
```

Observe que x e y son int, porque asi lo he anotado.

Sin embargo, no en todas las ocasiones tenemos la forma saber el tipo de una expresión, para esto vamos a introducir el ? (no tipo)

```scheme
let
	f = proc(? x, int y) +(x,y)
	in
		letrec
			? p(? x, ? y) = ...
		in
			...

```

Cuando tenemos ?, debemos aplicar las reglas de inferencia

1. Regla del if e1 then e2 else e3, e1 = bool, e2 = e3, consecuencia tipo e2 y e3
2. Regla proc: $(t1*t2*\ldots*tn)->t$ (Recuerde es declaracion)
3. Regla app: (rator rands), rator es tipo $(t1*t2*\ldots*tn)->t$, y los rands deben ser tipo t1,t2,..,tn (coincidir)
4. Primitivas
	1. Aritmeticas $(int*int)->int$
	2. Relacionales $(int*int)->bool$
	3. Logicas $(bool*bool)->bool$
5. Regla del letrec, es similar a los de procedimientos solo que de entrada conocemos la salida del procedimiento.

Comportamiento con ?.

1. Creamos una variable de tipo. Una variable puede ser vacia o asignada. Una vez ha sido asignada no puede cambiar
2. Cuando tenemos una ocurrencia:
	1. Si la variable de tipo está ligada comparamos, si son diferentes falla
	2. Si está vacia, la asignamos, validando que no existan recursiones en los tipo procval ($tx -> tx$)