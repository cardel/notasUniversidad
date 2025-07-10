# 2. Abstracción de datos

### Concepto clave

Operadores binarios

Diseño incremental de datos (abstracción incremental)

¿Que elementos tiene un diseño incremental de datos?

¿Que es un trait?

### Notas

Es cuando un método en una clase tiene 1 argumento, los dos argumentos: this (instancia) y el 

argumento, por lo tanto podemos verlo como una OPERACIÓN BINARIA

```scala
class Pepito{
	def metodo(s:Int) = {...}
}

obj:Pepito metodo argumento
//Por ejemplo
val a = new Pepito()
a metodo 4
a.metodo(4)
```

![Untitled-2023-10-05-1246.png](2%20Abstraccio%CC%81n%20de%20datos%20a8cfe42aa426489f82ab56f43f988d83/Untitled-2023-10-05-1246.png)

1. Primero hay relación entre padre e hijas, el padre usualmente es un trait o un clase abstracta
2. Hay despacho dinamico de metodos (al ejecutar un metodo en ejecución puede ser que se ejecute una hija u otra)

1. Un trait es equivalante a una interfaz, pero que permite definiciones
2. Un trait a diferencia de una clase abstracta NO HEREDA NADA
3. 

```scala
trait A {}
class B {}

class C extends A with B ....

```