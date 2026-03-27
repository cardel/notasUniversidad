# Tuplas

Las tuplas son colecciones de tamaño fijo que agrupan elementos de tipos posiblemente diferentes. Son útiles para retornar múltiples valores desde una función sin necesidad de definir una clase o estructura específica.

Ejemplo básico:

```scala
scala> val x = (50,30)
val x: (Int, Int) = (50,30)

scala> x
val res2: (Int, Int) = (50,30)

// También se pueden crear usando el constructor TupleN
scala> val y = scala.Tuple2(50,30)
val y: (Int, Int) = (50,30)

// Desestructuración de tuplas (pattern matching)
scala> val (x1,x2) = x
val x1: Int = 50
val x2: Int = 30
```

## Acceso a elementos de una tupla

Los elementos de una tupla se acceden mediante los métodos `._1`, `._2`, etc., donde el índice comienza en 1:

```scala
scala> val tupla = (1,2,3,4)
val tupla: (Int, Int, Int, Int) = (1,2,3,4)

scala> tupla._1
val res9: Int = 1

scala> tupla._2
val res10: Int = 2

scala> tupla._3
val res11: Int = 3

scala> tupla._4
val res12: Int = 4

// Alternativamente, se puede usar desestructuración
scala> val (a,b,c,d) = tupla
val a: Int = 1
val b: Int = 2
val c: Int = 3
val d: Int = 4
```

El reconocimiento de patrones con tuplas se realiza mediante la sintaxis `(e1,e2,e3,...,en) = tupla`, permitiendo agrupar y desagrupar datos de manera eficiente.

# Reconocimiento de patrones con tuplas

Las tuplas permiten agrupar patrones de entrada para evitar `match` anidados, mejorando la legibilidad del código.

En lugar de:
```scala
exp1 match {
    case patron1 => exp2 match {....}
    case patron2 => exp2 match {....}
    case ...
    case patronn => exp2 match {....}
}
```

Podemos escribir:
```scala
(exp1,exp2) match {
    case (patron1, ....) => ...
    case (patron2, ....) => ...
    case ...
    case (patronn, ....) => ...
}
```

## Ejemplo: Producto punto entre dos listas

El producto punto (o producto escalar) de dos listas se calcula sumando los productos de los elementos correspondientes.

```scala
/*
Ejemplo: List(1,2,3) • List(4,5,6) = 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
*/
def productoPunto(l1: List[Int], l2: List[Int]): Int = {
    (l1, l2) match {
        case (Nil, Nil) => 0  // Ambas listas vacías, producto punto es 0
        case (Nil, _) => throw new Exception("l2 es más grande que l1")  // l1 vacía pero l2 no
        case (_, Nil) => throw new Exception("l1 es más grande que l2")  // l2 vacía pero l1 no
        case (x :: xs, y :: ys) => x * y + productoPunto(xs, ys)  // Caso recursivo
    }
}

// Versión con recursividad de cola (tail recursion) para evitar desbordamiento de pila
def productoPuntoCola(l1: List[Int], l2: List[Int]): Int = {
    @scala.annotation.tailrec  // Anotación que verifica que la recursión sea de cola
    def productoPunto(l1: List[Int], l2: List[Int], acc: Int = 0): Int = {
        (l1, l2) match {
            case (Nil, Nil) => acc  // Ambas vacías, retorna el acumulador
            case (Nil, _) => throw new Exception("l2 es más grande que l1")
            case (_, Nil) => throw new Exception("l1 es más grande que l2")
            case (x :: xs, y :: ys) => productoPunto(xs, ys, acc + x * y)  // Actualiza acumulador
        }
    }
    productoPunto(l1, l2)  // Llama a la función auxiliar con acumulador inicial 0
}
```

## Tabla de resumen

Concepto | Descripción | Ejemplo
--- | --- | ---
Definición | Colección de tamaño fijo que agrupa elementos de tipos posiblemente diferentes | `val t = (1, "hola", true)`
Acceso por índice | Se accede a elementos con `._1`, `._2`, ... (índice comienza en 1) | `t._1` retorna `1`
Desestructuración | Asignación de elementos de tupla a variables individuales | `val (a, b, c) = t`
Pattern matching con tuplas | Permite coincidir patrones sobre múltiples valores simultáneamente | `(x, y) match { case (0, 0) => ... }`
Producto punto | Operación que multiplica elementos correspondientes de dos secuencias y suma los resultados | `List(1,2,3) • List(4,5,6) = 32`
Recursividad de cola | Forma de recursión donde la llamada recursiva es la última operación, optimizable por el compilador | Función `productoPuntoCola`

## Comentarios adicionales

1. **Inmutabilidad**: Las tuplas en Scala son inmutables, una vez creadas no pueden modificarse.
2. **Límite de tamaño**: Scala soporta tuplas hasta Tuple22 (22 elementos), suficiente para la mayoría de casos prácticos.
3. **Uso común**: Se utilizan frecuentemente para retornar múltiples valores de funciones, especialmente cuando los valores son de tipos diferentes.
4. **Alternativas**: Para agrupaciones más complejas o con semántica específica, es preferible usar case classes en lugar de tuplas.
5. **Errores en tiempo de compilación**: El acceso con índice incorrecto (ej: `._5` en una tupla de 4 elementos) se detecta en tiempo de compilación.
6. **Interoperabilidad**: Las tuplas son especialmente útiles para interoperar con APIs Java que retornan múltiples valores.