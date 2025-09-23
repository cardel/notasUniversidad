# Problematica

En programación funcional vamos tener casos de problemas en los cuales tenemos que trabajar con objetos con comportamiento polimorfico.

Usualmente utilizamos condicionales para determinar como trabajar el comportamiento

## Ejemplo de Expr

```scala
trait Expr {
  def num:Int
  def isNum:Boolean
  def isSum:Boolean
  def isMult:Boolean
  def Expr1:Expr
  def Expr2:Expr

}
```
Tenemos un trait Expr que puede ser un número, una suma o una multiplicación

Vamos a definir las clases hijas

```scala
class Num(n:Int) extends Expr {

  def num = n
  def isNum = true
  def isSum = false
  def isMult = false
  def Expr1 = throw new Exception("No es una suma")
  def Expr2 = throw new Exception("No es una suma")
}
```
La clase número define una expresión que es un número, por lo que las variables flag (is..) unicamente debe ser cierta isNum

```scala
class Sum(e1:Expr, e2:Expr) extends Expr {
  def num = throw new Exception("Esto no es un número")
  def isNum = false
  def isSum = true
  def isMult = false
  def Expr1 = e1
  def Expr2 = e2

}
```

```scala
class Mult(e1:Expr, e2:Expr) extends Expr {
  def num = throw new Exception("Esto no es un número")
  def isNum = false
  def isSum = false
  def isMult = true
  def Expr1 = e1
  def Expr2 = e2

}
```

Hemos definido las clases Sum y Mult, ahora vamos a definir una clase que las utilice y evalue

```scala
object Main {
  def evaluar(e:Expr):Int = {
    if (e.isNum) e.num
    else{
      if (e.isSum) {
        evaluar(e.Expr1)+evaluar(e.Expr2)
      }
      else{
        if (e.isMult) evaluar(e.Expr1)*evaluar(e.Expr2)
        else throw new Exception("Expresión no válida")
      }
    }
  }

  def main(arr:Array[String]):Unit  = {
    val e1:Expr = new Num(5)
    val e2:Expr = new Sum(
        new Num(7),
        new Sum(new Num(10), new Num(14))
      )
    val e3:Expr = new Mult(e1,e2)
    println(evaluar(e1))
    println(evaluar(e2))
    println(evaluar(e3))
  }
}
```
Esta debe tener un condicional que value si es número, suma o multiplicación usando las variables flag (banderas)

Sin embargo esto **no es facil de mantener ni de escalar** porque si deseo agregar más operaciones.
1. Aumenta el número de variables bandera
2. Debo editar todos los archivos
3. Se generan nuevos archivos

Para resolver este problema usemos un enfoque funcional

## Case class

Una case class permite definir una cadena de herencia  partir de otra clase o trait sin tener que definir los detalles, tambien sobreescribe el método toString. Esto permite generar TAD más facilmente.

```scala
trait Expr
case class Num(n:Int) extends Expr
case class Sum(e1:Expr, e2:Expr) extends Expr
case class Mult(e1:Expr, e2:Expr) extends Expr
case class Sub(e1:Expr, e2:Expr) extends Expr
```

Para usarla vamos a utilizar reconocimiento de patrones

```scala
object Main {
  def evaluar(e:Expr):Int = {
    e match {
      case Num(n) => n
      case Sum(e1,e2) => evaluar(e1) + evaluar(e2)
      case Mult(e1,e2) => evaluar(e1) * evaluar(e2)
      case Sub(e1,e2) => evaluar(e1) - evaluar(e2)
      case _ => throw new Error("Unknown expression")
    }

  }

  def main(arr:Array[String]):Unit  = {
    val e1:Expr = new Num(5)
    val e2:Expr = new Sum(
        new Num(7),
        new Sum(new Num(10), new Num(14))
      )
    val e3:Expr = new Mult(e1,e2)
    println(evaluar(e1))
    println(evaluar(e2))
    println(evaluar(e3))
    println(evaluar(new Sub(e3,e2)))
  }
}
```

El reconocimiento de patrones permite

1. Identificar la clase sin usar condicionales
2. En el mismo paso extraer las variables del constructor

En otras palabras me olvido del nombre de los campos, yo solo se, que la clase tiene $n$ parametros, por lo que en el reconocimiento indicaré con n variables.

El reconocimiento de patrones no sirve para identificar situaciones condicionales, por ejemplo, num menor que 5.

```scala
var match {
	case patron1 => comportamiento
	case patron2 => comportamiento
	...
	case patronn => comportamiento
	case _ => ...
}
```