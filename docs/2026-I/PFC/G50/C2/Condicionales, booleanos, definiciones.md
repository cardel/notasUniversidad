
Los condicionales son estructuras de control de flujo condicional, si se cumple algo se ejecuta una instruccion en caso contrario se ejecuta otra instruccion

En PF hacer los condicionales siempre else, porque el condicional se reduce a un valor.

```
scala> def mayorEdad(x:Int):String = if (x >= 18) "Mayor de edad" else "Menor de edad"
def mayorEdad(x: Int): String

scala> mayorEdad(10)
val res17: String = "Menor de edad"

scala> mayorEdad(19)
val res18: String = "Mayor de edad"
```

Recordar que en PF todo debe reducirse a un valor

```scala
scala> val x = 13
val x: Int = 13

scala> val s = if (x>=18) "Mayor edad" else "Menor edad"
val s: String = "Menor edad"

scala> s
val res19: String = "Menor edad"
```

Observe que el condicional se reduce a un String

```scala
scala> val s = if (x>=18) "Mayor edad" else if (x < 10) "Niño" else "A
dolecente"
val s: String = "Adolecente"
```

## Booleanos

```scala
scala> false && true
val res21: Boolean = false

scala> false & true
val res22: Boolean = false

scala> true || false
val res23: Boolean = true

scala> true | false
val res24: Boolean = true
```

Anotacion && y || son operadores de corto circuito, es decir en el caso de && si encuentra un false, no evalua mas, caso analogo con || si encuentra un true

# def y val

def define por nombre, es decir no evalua de inmediato

val define por valor, es decir que obtiene el valor de inmediato

Por ejemplo para las funciones tenemos:

```scala
scala> def f(x:Int):Int = x
def f(x: Int): Int

scala> val f(x:Int):Int = x
-- [E127] Pattern Match Error: -----------------------------------------------------------------------------------------------
1 |val f(x:Int):Int = x
  |    ^
  |f cannot be used as an extractor in a pattern because it lacks an unapply or unapplySeq method with the appropriate signature
  |
  | longer explanation available when compiling with `-explain`
1 error found
```

Observar las definiciones recursivas

```scala
scala> def loop:Int = loop
1 warning found
-- Warning: ------------------------------------------------------------------------------------------------------------------
1 |def loop:Int = loop
  |^^^^^^^^^^^^^^^^^^^
  |Infinite recursive call
def loop: Int

scala> val l:Int = l
val l: Int = 0
```

en el primero loop solo se evalua por nombre, se va a evaluar cuando se llame

En el segundo caso l, se evalua por valor y se aplica la politica de java de valores por defecto, en este caso 0