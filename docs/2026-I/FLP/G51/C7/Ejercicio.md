Supone ambiente inicial env0

```scheme
(x y z g)
(2 4 6 (closure '(x) +(x,3) empty-env)
```

Evaluar
```scheme

letrec
	f(x,y) = if >(x,0) then +((g y), (f -(x,2) y))
			else (g (g (g +(x,y,z))))
	in
		(f z +(x,y))
```
Resultado es 48