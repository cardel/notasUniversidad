Supone ambiente inicial env0

```scheme
(x y z g)
(2 4 6 (closure '(x) +(x,3) empty-env))
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

```mermaid
graph TD
	A["empty-env"] --> B["env0
	x y z g
	2 4 6 (closure '(x) +(x,3) empty-env)"]
	B --> C["envR1
	'(f)
	'((x y))
	 if >(x,0) ..."]
	 
	 A --> G1["env_proc_g1
	 x
	 6"]
	 A --> G2["env_proc_g2
	 x
	 6"]
	 A --> G3["env_proc_g3
	 x
	 6"]
	 
	 A --> G4["env_proc_else_g1
	 x
	 12"]
	 A --> G4["env_proc_else_g2
	 x
	 15"]
	 A --> G5["env_proc_else_g3
	 x
	 18"]
	 
	 C --> F1["envf1
	 x y
	 6 6"]
	 C --> F2["envf2
	 x y
	 4 6"]
	 C --> F3["envf3
	 x y
	 2 6"]
	 C --> F4["envf4
	 x y
	 0 6"]
```

1. Sobre envR1 vamos a evaluar (f z +(x,y)) --> (f 6 6)
2. Se sabe que f esta en un ambiente extendido recursivo, entonces mirar que pasa
	1. (f 6 6) = +((g 6), (f 4 6)) = +(9, (f 4 6)) = +(9,39) = 48
	2. (f 4 6) = +((g 6), (f 2 6)) = +(9, (f 2 6)) = +(9,30) = 39
	3. (f 2 6) = +((g 6), (f 0 6)) = +(9, (f 2 6)) = +(9,21) = 30
	4. (f 0 6) = (g (g (g +(x,y,z))))= (g (g (g 12))))= (g (g 15)) = = (g 18) = 21 