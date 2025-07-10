# Sesión 02: Elementos PF

### Concepto

**Evaluación**

**Condicionales**

**Diseño de programas funcionales**

### Notas

- Evaluación por valor (CBV) Esta evaluación primero evalua los argumentos de izquierda a derecha y posteriormente llama a la función, para llamarla SIEMPRE se deben tener valores

```scala
def s(x:Int, y:Int):Int = x + x

s(1+2,1+3)
s(3,1+3) 
s(3,4) //La función se invoca cuando tenemos valores
3+3
6
```

- CBN Evaluación por nombre: Los argumentos se evaluan cuando se USAN

```scala
def s(x:Int, y:Int):Int = x + x

s(1+2,1+3)
(1+2)+(1+2)
3+(1+2)
3+3
6
```

```scala
if <condicion> <respuesta-true> else <respuesta-falso>

if (x>8) 10 else 20

//Operadores de cortocircuito

val x = 8
x < 5 && x > 8 = False
x < 5 & x > 8  = False

En el primero solo se evalua x < 5, ya que al dar falso la expresión es falsa

x > 5 || x < 8 = True
x > 5 | x <8 = True

Mis caso, en el caso de and solo aplica cuando uno de los terminos da falso, en el caso de or cuando uno de los terminos da verdadero

T or ? = T
F and ? = F

```

A la hora de diseñar soluciones en PF debemos tener en cuenta

- Se hace una solución con funciones
- Se agrugan usando bloques {} estos bloques nos permiten tener alcance LOCAL de valores
- Podemos eliminar las variables que están repetidas

```scala
def a(x) = b(x,x+1)
def b(x,y) = x+y

def a(x) = {
	def b(x,y) = x+y
	b(x,x+1) //En los bloques siempre se retorna la última expresión
}
//Eliminamos las ocurrencias repetidas
def a(x) = {
	def b(y) = x+y
	b(x+1)
}
```