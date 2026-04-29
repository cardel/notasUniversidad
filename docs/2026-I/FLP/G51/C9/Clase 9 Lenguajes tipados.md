
# Contenido

1. [Interprete de chequeo](Interprete%20de%20chequeo.md)
2. [Pruebas sobre el interprete](Pruebas%20sobre%20el%20interprete.md)
3. [Ejercicio](Ejercicio.md)

Un tipo es un conjunto de valores sobre el cual realizamos operaciones

# Clasificacion de los lenguajes tipados

# De acuerdo al manejo

1. Estaticamente tipado: Usualmente se colocan los tipos en la sintaxis (int a, bool b,...) Java/C++
2. Dinamicamente tipado: Los tipos se determinan en tiempo de ejecución: Racket/Python/Javascript

# Como maneja los errores

1. Fuertemente tipado: No permite errores de tipo (falla)
2. Debilmente tipo: Permite errores de tipo y el lenguaje aplica alguna solución (casteo), pero es impredecible

Caso de un lenguaje debilmente tipado

```javascript
> 1+2
3
> 1+"3"
'13'
> "3"+1
'31'
> "3"+"1"
'31'
> "4"*3
12
> 4*"5"
20
> "0" == []
false
> "0" == 0
true
> 0 == []
true
```

Caso fuertemente tipado

```scala
scala> "1"*"3"
           ^
       error: type mismatch;
        found   : String("3")
        required: Int

scala> 1*"3"
        ^
       error: overloaded method * with alternatives:
         (x: Double)Double <and>
         (x: Float)Float <and>
         (x: Long)Long <and>
         (x: Int)Int <and>
         (x: Char)Int <and>
         (x: Short)Int <and>
         (x: Byte)Int
        cannot be applied to (String)


scala> "3"*3
val res6: String = 333
```

Cuando hay una operación invalida con respecto a los tipos **este falla**

En el caso de javascript una operación invalida no hace que falle si no que siempre da una respuesta (la cual no es fácil predecir)

```javascript
> "1"+"10"
'110'
> 1+"10"
'110'
> "1"*"3"
3
> "5"*"3"
15
> "5"*"xd"
NaN
```

