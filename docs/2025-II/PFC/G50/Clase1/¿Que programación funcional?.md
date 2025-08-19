Programar pensando en el concepto de función, una función hace algo de acuerdo a unas entradas que se le proporciones

$$
f(x) = x^2
$$
Esta función
- x es un valor numérico $x \in \mathbb{R}$ 
- f(x) es un valor numérico $f(x) \in \mathbb{R}$
- En otras palabras esta función recibe un valor numérico, hace algo con el y lo opera


En computación las funciones tienen **un enfoque más amplio** 
- Cualquier valor: cadena de texto, colección, booleano, número, caracter, otra función, etc
- Puede retornar un sólo valor: colección, booleano, etc

# Paradigma funcional

En general es programar pensando en **funciones** , las funciones se invocan
- Paradigma imperativo: Secuencia de instrucciones, asignación (hay variables) la ejecución del programa está gobernado los cambios en las variables, estructuras de control: ciclos for y while, switch-case, condicional
- Paradigma orientado a objetos: Es un paradigma de programación orientado a una abstracción del mundo real: un objeto tiene **propiedades** y **comportamiento** (campos y métodos)
	- Los objetos se derivan a partir de las clases, las cuales definen su campos y comportamiento, un objeto es una **instancia** de una clase, instanciar darle valores a los campos una clase.
	- Los objetos son encapsulados: Se controla como se ven sus campos internos, para eso tenemos los modificadores de alcance: private, public, protected.
	- Las clases se relacionan entre sí:
		1. Herencia: una clase toma elementos de una o más clases para su definición
			1. Herencia puede ser simple o múltiple
			2. Clases abstractas: Que no se puede instanciar y sirven de plantilla de otras clases
			3. Polimorfismo: Cuando tenemos un método que se hereda y podemos cambiar su comportamiento 
		2. Composición: Una clase está compuesta por otras (ejemplo PC: Disco duro, pantalla, etc)
		3. Uso: Una clase usa métodos de otra
- Paradigma orientado a eventos: La programación está enfocado a los eventos de usuario: presionar una tecla, hacer clic con el mouse, pasar encima el mouse, etc

## Ejemplo de polimorfimos

```java
abstract class A {
	public void sonido() {
		return "sonido";
	}
}	  

public class B extends A {
	public  void sonido() {
		return "B";
	}
}

public class C extends A {

	public void  sonido(){
		return "C";
	}
}

public class Main(){
	public static void main(String args[]){
		A objB = new B();
		A objC = new C();
		//objB y objC son de tipo A
		objB.sonido(); //B
		objC.sonido(); //C
	}

}

```

El paradigma funcional

- Se trabaja con variables no mutables (ligaduras) en scala es con la palabra val
- Se trabaja con recursión en lugar de estructuras de control (for o while)
- Las funciones son ciudadanos de primera clase, son iguales que otros valores, una función es un valor que se puede **invocar** 
- Se manejan estrategias de programación: diseño funcional de programas
	- Escritura de código
	- Uso de recursión
	- Uso de reconocimiento de patrones
	- Uso de abstracción funcional