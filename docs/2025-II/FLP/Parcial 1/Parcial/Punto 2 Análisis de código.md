
(35 puntos) Dibuje los ambientes generados por la siguiente expresión, suponga como ambiente inicial el vacío.

```scheme
let 
  a = let x = 5 in *(2,x)
  b = letrec f(n) = if <(n,1) then 1 else *(n, (f -(n,1))) in (f 4)
  c = proc (m) let x = *(m,2) in +(x,m)
  in
      let
        d = proc (n) proc (m ) +(n,m)
        e = letrec h(n,m) = if >(n,0) then +(m, (h -(n,1)  +(m,1))) else 0 in (h 5 (c 3))
        in
          ((d (c +(a, b))) e)

```

Los ambientes generados son:

```mermaid
flowchart LR
	A["Empty env"]
	B["env0
	a,b,c
	10,24, 
	closure .. empty-env
	"]
	C["env1
	d,e
	closure .. env0, 55
	"]
	D["envx
	x
	5
	"]
	E["envrb
	(f)
	((n))
	if ...."	
	]
	F1["envf1
	n
	4"]
	F2["envf2
	n
	3"]
	F3["envf3
	n
	2"]
	F4["envf4
	n
	1"]
	F5["envf5
	n
	0"]
	G["envc
	m
	3"
	]
	GX["envcx
	x
	6"
	]
	H["envre
	(h)
	((m,n))
	....
	"
	]
	H1["envh1
	m,n
	5,9"]
	H2["envh2
	m,n
	4,10"]
	H3["envh3
	m,n
	3,11"]
	H4["envh4
	m,n
	2,12"]
	H5["envh5
	m,n
	1,13"]
	H6["envh6
	m,n
	0,14"]
	H7["envh7
	m,n
	5,9"]	
	I["envc2
	m
	34"
	]
	IX["envcx2
	x
	68"
	]
	J["envd
	n
	102
	"]
	K["envprocd
	m
	55"
	]
	A --> B
	B --> C
	A --> D
	A --> E
	E --> F1
	E --> F2
	E --> F3
	E --> F4
	E --> F5
	A --> G
	G --> GX
	B --> H
	H --> H1
	H --> H2
	H --> H3
	H --> H4
	H --> H5
	H --> H6
	H --> H7
	A --> I
	I --> IX
	B --> J
	J --> K
```

En total 102 + 55 = 157
