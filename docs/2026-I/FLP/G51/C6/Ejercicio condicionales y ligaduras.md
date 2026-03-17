
Considere el ambiente inicial env0 con (x,y,z) con valores (1,2,3)
```scheme
let
	a = +(x,1)
	b = let x = x in let x = y in let x = z in x
	c = let x = let y = let z = +(x,y) in +(z,y)
				in +(x,y)
		in +(x,y)
	in
		let
		u = +(a,b)
		v = +(a,let p = +(x,y) in let q = +(x,z) in +(p,q))
		w = +(a,let b = let b = +(x,y) in +(b,2) in +(a,b))
		in
			+(u,v,w)
```
Da 23