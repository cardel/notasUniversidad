Los objetos simples son una implementación basada en listas de partes, cada parte representa una clase en una cadena herencia, por ejemplo:

```scheme
class c1 extends object
	field x
	field y
	method initialize() 1
	
class c2 extends c1
	field z
	field w
	method initialize() 1
	
let
	o1 = new c1()
	o2 = new c2()
	in ??
```

Cuando es o1 se muestra

```scheme
(#(struct:a-part c1 #(0 0)))
```

Una parte contiene el nombre de la clase, y los valores de los campos

Cuando hago c2 observe que

```scheme
(#(struct:a-part c2 #(0 0)) #(struct:a-part c1 #(0 0)))

```
El primer elemento es la clase c2 y el segundo la clase c1, se asument object como la lista vacia.

```scheme
class c1 extends object
	field x
	field y
	method initialize() 1
	
class c2 extends c1
	field z
	field w
	method initialize() 1
	
class c3 extends c2
	field a
	field b
	method initialize() 1
let
	o3 = new c3()
	in o3
```

En este caso vemos

```scheme
(#(struct:a-part c3 #(0 0)) #(struct:a-part c2 #(0 0)) #(struct:a-part c1 #(0 0)))
```

Entonces nos va construir lo siguiente

```mermaid
flowchart LR
	A["C3
	a = 0, b = 0
	"]
	B["C2
	z = 0, w = 0
	"]
	C["C1
	x = 0, y = 0
	"]
	D["object
	'()
	"]
	A --> B
	B --> C
	C --> D
```

En este caso el primer elemento siempre va a ser la clase menor jerarquia y la lista vacia va a representar a object

Esta implementación es utiliza por C++ para representar los objetos.

```scheme
class p1 extends object
	field a
	field b
	method initialize(x,y)
		begin
			set a = x;
			set b = y
		end
	
	method sum(x)
		begin
			set a = +(a,1);
			+(a,b,x, send self m1())
		end
	method m1() 1

class p2 extends p1
	field c
	field d
	field e
	method initialize(x,y,z)
		begin
			super initialize(x,y);
			set c = +(x,1);
			set d = +(y,2);
			set e = z
		end
		
	method sum(s)
		+(c,d,e, send self m1()) 
	
class p3 extends p2
	field f
	field g
	method initialize(u)
		begin
			set f = u;
			set g = +(u,1);
			super initialize(u,+(u,1),+(u,2))
	end
	method sum(a)
		+(a, super sum(+(a,2)))
		
	method m1() 10

let
	o1 = new p1(2,3)
	o2 = new p2(3,4,5)
	o3 = new p3(6)
	in
		list(
			send o1 sum(2),
			send o2 sum(3),
			send o3 sum(4)
		)
	
```

Esto da
```scheme
(9 16 39)
```

Vamos a dibujar los ambientes de los llamados de los objetos, comenzamos con o1 en o1 = new p1(2,3)

```mermaid
flowchart LR
	A["c1
	a = 2, b = 3
	"]
	B["object"]
	A --> B
```

```scheme
(#(struct:a-part p1 #(2 3)))
```

Vamos con o2 = new p2(3,4,5)

```mermaid
flowchart LR
	A["c2
	c = 4 d = 6 e = 5
	"]
	B["c1
	a = 3, b = 4
	"]
	C["object"]
	B --> C
	A --> B
```
```scheme
(#(struct:a-part p2 #(4 6 5)) #(struct:a-part p1 #(3 4)))
```
Vamos con o3 = new p3(6)  

```mermaid
flowchart LR
	A["c3
	f = 6, g = 7
	"]
	B["c2
	c = 7 d = 9 e = 8
	"]
	C["c1
	a = 6, b = 7
	"]
	D["object"]
	B --> C
	A --> B
	C --> D
```

```scheme
(#(struct:a-part p3 #(6 7)) #(struct:a-part p2 #(7 9 8)) #(struct:a-part p1 #(6 7))
```

# Ejecución de metodos

Cuando se invoca un método se tiene un diagrama de clases independiente (propiedad en encapsulación), en este se tiene cada llamado es independiente, llamar dos métodos no se afectan entre a excepción si uno de ellos ha modificado los campos del objeto

## Llamado send o1 sum(2)

```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	2,3
	"]
	C["envsum
	x,super,self
	2,object,o1
	"]
	A --> B
	B --> C

```

Sobre el ambiente envsum vamos a ejecutar

```scheme
		begin
			set a = +(a,1);
			+(a,b,x, send self m1())
		end
```
al hacer set x = +(x,1) cambia la representación del objeto
```mermaid
flowchart LR
	A["c1
	a = 3, b = 3
	"]
	B["object"]
	A --> B
```

Cambia el ambiente env1
```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	3,3
	"]
	C["envsum
	x,super,self
	2,object,o1
	"]
	A --> B
	B --> C

```

Cuando ejecutamos +(a,b,x, send self m1())

+(3,3,2, send o1 m1())

 send o1 m1()

```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	3,3
	"]
	C["envm1
	super,self
	object,o1
	"]
	A --> B
	B --> C

```
+(3,3,2,1) = 9

## Llamado send o2 sum(3),

Cuando invocamos este caso

```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	3,4
	"]
	C["env2
	c,d,e
	4,6,5
	"]
	D["envsum
	s,super,self
	3,p1,o2
	"]
	A --> B
	B --> C
	C --> D

```
Ejecutamos en el ambiente envsum

```scheme
+(c,d,e, send self m1()) 
+(4,6,5, send o2 m1())
```

### send o2 m1()


```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	3,4
	"]
	C["envm1
	super,self
	p1,object, o2
	"]
	A --> B
	B --> C

```

Aqui evaluo en el cuerpo la expresión 1

```scheme
+(4,6,5, 1)
16
```

## send o3 sum(4)

Para este caso caso tenemos que el diagrama de ambientes para sum de o3 es

```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	6,7
	"]
	C["env2
	c,d,e
	7,9,8
	"]
	D["env3
	f,g
	6,7
	"]
	E["envsum
	a,super,self
	4,p2,o3
	"]
	A --> B
	B --> C
	C --> D
	D --> E
```

Vamos a ejecutar el cuerpo

```scheme
+(a, super sum(+(a,2)))
+(4, super sum(6))
```

## super sum(6)

Este se encuentra en p2

```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	6,7
	"]
	C["env2
	c,d,e
	7,9,8
	"]
	D["envsum
	s,super,self
	6,p1,o3
	"]
	A --> B
	B --> C
	C --> D
```
Sobre el ambiente envsum

```scheme
+(c,d,e, send self m1())
+(7,9,8, send o3 m1()) 
```

## send o3 m1()

```mermaid
flowchart LR
	A["empty-env"]
	B["env1
	a,b
	6,7
	"]
	C["env2
	c,d,e
	7,9,8
	"]
	D["env3
	f,g
	6,7
	"]
	E["envm1
	super,self
	p2,o3
	"]
	A --> B
	B --> C
	C --> D
	D --> E
```

Bajo el ambiente envm1 voy a ejecutar

```scheme
10
```

Por lo que al evaluar

```
+(7,9,8, 10) 
34
+(4, 34)
38
```
