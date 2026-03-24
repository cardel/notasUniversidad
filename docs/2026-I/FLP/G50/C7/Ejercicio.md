Considere el ambiente inicial env0
```scheme
(x,y,z,f)
(9,10,11, closure (a,b) if >(a,b) then a else b empty-env)
```

```scheme
let
	u = (f x y)
	v = (f y z)
	p = 6
	in
		letrec
			f(x,y) = if >(x,0) 
					then +(y, (g -(x,2) +(y,1)))
					else +(u,v)
			g(m,n) = if >(m,0)
			         then +(n, (f sub1(m) +(n,2)))
			         else *(u,v)
		in
			+((f 20 p), (proc (x,y) +(x,y) u v))		

```
Resultado 3112