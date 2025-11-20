Los objetos planos son los que utiliza Java, es basicamente un vector de campos, donde las primeras posiciones corresponden a las clases de mayor jerarquia y los ultimos a las menor jerarquia

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
#(struct:an-object c1 #(0 0))
```

Una parte contiene el nombre de la clase, y los valores de los campos

Cuando hago c2 observe que

```scheme
#(struct:an-object c2 #(0 0 0 0))
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
#(struct:an-object c3 #(0 0 0 0 0 0)))
```

Entonces nos va construir lo siguiente


```mermaid
graph TD
	A["C3 (0 0 0 0 0 0)"]
```

Los primeros elementos del vector representan la clase de mayor jerarquia c1, y los ultimos de la menor jerarquia que seria c3

Esta implementación es utiliza por Java para representar los objetos.

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
(9 16 38)
```

Vamos a dibujar los ambientes de los llamados de los objetos, comenzamos con o1 en o1 = new p1(2,3)

```mermaid
graph TD
	A["p1 (2,3)"]
```

```scheme
#(struct:an-object p1 #(2 3)) 
```

Vamos con o2 = new p2(3,4,5)

```mermaid
graph TD
	A["p2 3 4 4 6 5"]
```
```scheme
#(struct:an-object p2 #(3 4 4 6 5)))
```
Vamos con o3 = new p3(6)  

```mermaid
graph TD
	A["p3 (6 7 7 9 8 6 7)"]
```

```scheme
#(struct:an-object p3 #(6 7 7 9 8 6 7))
```

Aqui 6,7 son de p1, 7,9,8 son de p2 y 6,7 son de p3

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
	A["p1 (3,3)"]
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

El comportamiento es exactamente el mismo, solo que cambia la representación de los objetos