# Sesión 05: Funciones y datos

# Conceptos

## Parametros implicitos / explicitos: Ligadura dinámica

```java
public class Ejemplo {
	private int a;
	private int b;
	public Ejemplo(int x, int y) {
		this.a = x;
		this.b = y;
	}
	
	public int getA(){
		return this.a;
	}
}
```

```python
class Ejemplo:
	def __init__(self,a,b):
		self.x = a
		self.y = b
		
	def getX():
		return self.x;
```

# Abstracción de datos

¿Que es?

1. Los datos los podemos representar a traves combinaciones de clases y funciones
2. La idea es trabajar desde un concepto funcional más elevado, nos preocupamos en cómo funcionan los datos más cómo se implementan internamiento

---

Aspectos a tener en cuenta sobre O.O

1. Existe una ligadura dinámica (this, self), algunos lenguajes la tienen EXPLICITA (python, javascript), otros la tienen IMPLICITA  (C++,Java, scala, Ruby)
2. Al instanciar un clase se asignan vía parametros las propiedades de clase.
3. Al instanciar una función de en un objeto, se asigna el this (referencia al objeto) y los parametros de clase

---

Consejos para diseñar datos abstractos (TAD)

1. Se utilizan clases para representar los TADs
2. Tenemos funciones que nos apoyan en las operaciones
3. Aplicamos tecnicas como la normalización para facilitar la visualización del dato
4. Sobrecarga de algunos métodos para facilitar el entendimiento del tipo de dato

---

Operación binaria

Cuando tenemos una función del estilos

```scala
class Ejemplo(...) {

	def f(a:<T1>):<T> = {
		....
	}
}
```

f recibe explicamente a la variable a, pero implicitamente recibe a this

```scala
val objEjemplo = new Ejemplo(...)
objEjemplo.f(x)
objEjemplo f x
```