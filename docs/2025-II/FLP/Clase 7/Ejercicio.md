,
```scheme
let
	x = let x = let x = 3 in +(x,3)
						 in +(x,3)
	y = 5
	h = proc(m,n) if >(m,n) 
					then +(m,n) 
					else -(m,n)
	in
		letrec
			f(x,y) = if >(x,0) then
						+(y, (f -(x,1) +(y,2)))
					else
						let k = (h 2 3) in
							let s = (h 2 4)
								in +(k,s)
		in
			(f x y)
```
Da 114	

```mermaid
flowchart LR
	E["empty env"]
	ENV0["
	env0
	(x,y,h)
	(9,5,closure(..,empty-env))
	"]
	
	ENVX0["
	envx0
	x
	6
	"]
	ENVX1["
	envx1
	x
	3
	"]	
	ENVR0["
	envr0
	(f)
	((x,y))
	(...)"
	]
	ENVF1["
	envf1
	(x,y)
	(9,5)
	"]
	ENVF2["
	envf2
	(x,y)
	(8,7)
	"]
	ENVF3["
	envf3
	(x,y)
	(7,9)
	"]
	ENVF4["
	envf4
	(x,y)
	(6,11)
	"]
	ENVF5["
	envf5
	(x,y)
	(5,13)
	"]
	ENVF6["
	envf6
	(x,y)
	(4,15)
	"]
	ENVF7["
	envf7
	(x,y)
	(3,17)
	"]
	ENVF8["
	envf8
	(x,y)
	(2,19)
	"]
	ENVF9["
	envf9
	(x,y)
	(1,21)
	"]
	ENVF10["
	envf10
	(x,y)
	(0,23)
	"]
	
	ENVH1["
	envh1
	m,n
	2,3"
	]
	
	ENVH2["
	envh2
	m,n
	2,4"
	]
	
	ENVK["envk
	k
	-1	
	"]
	
	ENVS["envs
	s
	-2
	"]

	E --> ENV0
	E --> ENVX0
	E --> ENVX1
	ENV0 --> ENVR0
	ENVR0 --> ENVF1
	ENVR0 --> ENVF2
	ENVR0 --> ENVF3
	ENVR0 --> ENVF4
	ENVR0 --> ENVF5
	ENVR0 --> ENVF6
	ENVR0 --> ENVF7
	ENVR0 --> ENVF8
	ENVR0 --> ENVF9
	ENVR0 --> ENVF10
	
	ENVF10 --> ENVK
	ENVK --> ENVS
	E --> ENVH1
	E --> ENVH2
```

1. Envr0 (f x y) (f 9 5)
2. Al evaluar (f 9 5) genera una clausura que hereda de envr0
3. envf1 >(9,0) THEN +(5, (f 8 7))
4. envf2 >(8,0) THEN +(7, (f 7 9))
5. enf3,4,5,6,7,8,10 +(5,+(7, +(9, +
6. (11, +(13, +(15, +(17,+(19, +(21 (f 0 23)))))))))
7. envf10 x = 0 y = 23 >(x,0) NO
```scheme
						let k = (h 2 3) in
							let s = (h 2 4)
								in +(k,s)
```
El cuerpo de h es
```scheme
	 if >(m,n) 
					then +(m,n) 
					else -(m,n)
```
- -(2,3) = -1
- >(2,4) --> -(2,4) = -2
8. envs --> +(k,s) -->+(-1,-2) = -3
9. +(5, +(7,  +(9, (11, +(13, +(15, +(17,+(19, +(21 -3)))))))
	1.  +(5, +(7,  +(9, (11, +(13, +(15, +(17,+(19, 18))))))
	2. +(5, +(7,  +(9, (11, +(13, +(15, +(17,37)))))
	3. +(5, +(7,  +(9, (11, +(13, +(15, 54))))
	4. +(5, +(7,  +(9, (11, +(13, 69)))
	5. (11, 82))
	6. +(5, +(7,  +(9, 93)))
	7. +(5, +(7,  102))
	8. +(5, 109)
	9. 114