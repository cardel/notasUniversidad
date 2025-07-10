# Sesión 13: Objetos planos

¿Que se diferencia con los objetos simples?

1. La representación no usa listas, si no un datatype object, el cual contiene el nombre y un vector el cual contiene todos los cambios desde la clase object hasta la clase, ejemplo 

```python
class c1 extends object
	field x
	field y
....
class c2 extends c1
	field a
	field b
	...
class c3 extends c2
	field z
	field w
	....
class c4 extends c3
	field p
	
obj = new c4(...)

object("c4", [x y a b z w p]
```

---

La representacion de los métodos

En objetos simples teniamos la expresión de metodo dentro del ambiente de clases.

La clase se representa con un datatype el cual contiene una lista de datatype de metodos, que a su vez tienen el nombre de la superclase, NO TOCA CALCULAR cada que vez que se llama