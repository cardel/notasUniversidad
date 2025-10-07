Cuando queremos hacer secuencias que son el producto cartesiano entre dos conjuntos, podemos utiliza rangos y map

```scala
scala> val N = 10
val N: Int = 10

scala> val M = 5
val M: Int = 5

scala> (1 to M) map (x => (1 to N) map (y => (x,y)))
val res45: IndexedSeq[IndexedSeq[(Int, Int)]] = Vector(Vector((1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7), (1,8), (1,9), (1,10)), Vector((2,1), (2,2), (2,3), (2,4), (2,5), (2,6), (2,7), (2,8), (2,9), (2,10)), Vector((3,1), (3,2), (3,3), (3,4), (3,5), (3,6), (3,7), (3,8), (3,9), (3,10)), Vector((4,1), (4,2), (4,3), (4,4), (4,5), (4,6), (4,7), (4,8), (4,9), (4,10)), Vector((5,1), (5,2), (5,3), (5,4), (5,5), (5,6), (5,7), (5,8), (5,9), (5,10)))
```

Pero estamos teniendo el problema que nos esta generando un vector de vectores

```scala
scala> (1 to M) flatMap (x => (1 to N) map (y => (x,y)))
val res47: IndexedSeq[(Int, Int)] = Vector((1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7), (1,8), (1,9), (1,10), (2,1), (2,2), (2,3), (2,4), (2,5), (2,6), (2,7), (2,8), (2,9), (2,10), (3,1), (3,2), (3,3), (3,4), (3,5), (3,6), (3,7), (3,8), (3,9), (3,10), (4,1), (4,2), (4,3), (4,4), (4,5), (4,6), (4,7), (4,8), (4,9), (4,10), (5,1), (5,2), (5,3), (5,4), (5,5), (5,6), (5,7), (5,8), (5,9), (5,10))

scala> ((1 to M) map (x => (1 to N) map (y => (x,y)))).flatten
val res48: IndexedSeq[(Int, Int)] = Vector((1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7), (1,8), (1,9), (1,10), (2,1), (2,2), (2,3), (2,4), (2,5), (2,6), (2,7), (2,8), (2,9), (2,10), (3,1), (3,2), (3,3), (3,4), (3,5), (3,6), (3,7), (3,8), (3,9), (3,10), (4,1), (4,2), (4,3), (4,4), (4,5), (4,6), (4,7), (4,8), (4,9), (4,10), (5,1), (5,2), (5,3), (5,4), (5,5), (5,6), (5,7), (5,8), (5,9), (5,10))
```

El flatmap permite aplicar una función entre dos o más colecciones, retornando una colección no una colección de colecciones. Esto podemos extenderlo a operaciones entre más de dos colecciones

```
scala> (1 to M) map (x => (1 to N) map (y => (1 to M) map(z => (x,y,z))))
val res54: IndexedSeq[IndexedSeq[IndexedSeq[(Int, Int, Int)]]] = Vector(Vector(Vector((1,1,1), (1,1,2), (1,1,3), (1,1,4), (1,1,5)), Vector((1,2,1), (1,2,2), (1,2,3), (1,2,4), (1,2,5)), Vector((1,3,1), (1,3,2), (1,3,3), (1,3,4), (1,3,5)), Vector((1,4,1), (1,4,2), (1,4,3), (1,4,4), (1,4,5)), Vector((1,5,1), (1,5,2), (1,5,3), (1,5,4), (1,5,5)), Vector((1,6,1), (1,6,2), (1,6,3), (1,6,4), (1,6,5)), Vector((1,7,1), (1,7,2), (1,7,3), (1,7,4), (1,7,5)), Vector((1,8,1), (1,8,2), (1,8,3), (1,8,4), (1,8,5)), Vector((1,9,1), (1,9,2), (1,9,3), (1,9,4), (1,9,5)), Vector((1,10,1), (1,10,2), (1,10,3), (1,10,4), (1,10,5))), Vector(Vector((2,1,1), (2,1,2), (2,1,3), (2,1,4), (2,1,5)), Vector((2,2,1), (2,2,2), (2,2,3), (2,2,4), (2,2,5)), Vector((2,3,1), (2,3,2), (2,3,3), (2,3,4), ...
```
Este caso es un vector, de vectores de vectores de tripletas.

```scala
scala> (1 to M) flatMap (x => (1 to N) flatMap (y => (1 to M) map(z => (x,y,
z))))
val res55: IndexedSeq[(Int, Int, Int)] = Vector((1,1,1), (1,1,2), (1,1,3), (1,1,4), (1,1,5), (1,2,1), (1,2,2), (1,2,3), (1,2,4), (1,2,5), (1,3,1), (1,3,2), (1,3,3), (1,3,4), (1,3,5), (1,4,1), (1,4,2), (1,4,3), (1,4,4), (1,4,5), (1,5,1), (1,5,2), (1,5,3), (1,5,4), (1,5,5), (1,6,1), (1,6,2), (1,6,3), (1,6,4), (1,6,5), (1,7,1), (1,7,2), (1,7,3), (1,7,4), (1,7,5), (1,8,1), (1,8,2), (1,8,3), (1,8,4), (1,8,5), (1,9,1), (1,9,2), (1,9,3), (1,9,4), (1,9,5), (1,10,1), (1,10,2), (1,10,3), (1,10,4), (1,10,5), (2,1,1), (2,1,2), (2,1,3), (2,1,4), (2,1,5), (2,2,1), (2,2,2), (2,2,3), (2,2,4), (2,2,5), (2,3,1), (2,3,2), (2,3,3), (2,3,4), (2,3,5), (2,4,1), (2,4,2), (2,4,3), (2,4,4), (2,4,5), (2,5,1), (2,5,2), (2,5,3), (2,5,4), (2,5,5), (2,6,1), (2,6,2), (2,6,3), (2,6,4), (2,6,5)...
```

En este caso tenemos una secuencia. Por ejemplo el caso de un producto escalar entre dos vectores

```scala
scala> x
val res60: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3)

scala> y
val res61: scala.collection.immutable.Vector[Int] = Vector(4, 5, 6)

scala> (x zip y)
val res62: scala.collection.immutable.Vector[(Int, Int)] = Vector((1,4), (2,5), (3,6))

scala> ((x zip y) map (x => x._1 * x._2))
val res63: scala.collection.immutable.Vector[Int] = Vector(4, 10, 18)

scala> ((x zip y) map (x => x._1 * x._2)).sum
val res64: Int = 32
```

# Ejemplo

Deseo generar los tripletas i,j,k entre 1 y m, las cuales cumplen

1. i es par
2. j es impar
3. k es un número primo

## 1. Generar la secuencia (i,j,k)

Vamos a generar una secuencia de 3 numeros que van entre 1 y M

```scala
scala> val seq = (1 to M) flatMap (x => (1 to M) flatMap (y => (1 to M) map (z => (x,y,z))))
val res65: IndexedSeq[(Int, Int, Int)] = Vector((1,1,1), (1,1,2), (1,1,3), (1,1,4), (1,1,5), (1,1,6), (1,1,7), (1,1,8), (1,1,9), (1,1,10), (1,2,1), (1,2,2), (1,2,3), (1,2,4), (1,2,5), (1,2,6), (1,2,7), (1,2,8), (1,2,9), (1,2,10), (1,3,1), (1,3,2), (1,3,3), (1,3,4), (1,3,5), (1,3,6), (1,3,7), (1,3,8), (1,3,9), (1,3,10), (1,4,1), (1,4,2), (1,4,3), (1,4,4), (1,4,5), (1,4,6), (1,4,7), (1,4,8), (1,4,9), (1,4,10), (1,5,1), (1,5,2), (1,5,3), (1,5,4), (1,5,5), (1,5,6), (1,5,7), (1,5,8), (1,5,9), (1,5,10), (1,6,1), (1,6,2), (1,6,3), (1,6,4), (1,6,5), (1,6,6), (1,6,7), (1,6,8), (1,6,9), (1,6,10), (1,7,1), (1,7,2), (1,7,3), (1,7,4), (1,7,5), (1,7,6), (1,7,7), (1,7,8), (1,7,9), (1,7,10), (1,8,1), (1,8,2), (1,8,3), (1,8,4), (1,8,5), (1,8,6), (1,8,7), (1,8,8), (1,8,9), (1,8,...
```

## 2. Filtramos i y j (par e impar)

```scala
seq filter (t => t._1 % 2 == 0 && t._2 % 2 != 0)

val res67: IndexedSeq[(Int, Int, Int)] = Vector((2,1,1), (2,1,2), (2,1,3), (2,1,4), (2,1,5), (2,1,6), (2,1,7), (2,1,8), (2,1,9), (2,1,10), (2,3,1), (2,3,2), (2,3,3), (2,3,4), (2,3,5), (2,3,6), (2,3,7), (2,3,8), (2,3,9), (2,3,10), (2,5,1), (2,5,2), (2,5,3), (2,5,4), (2,5,5), (2,5,6), (2,5,7), (2,5,8), (2,5,9), (2,5,10), (2,7,1), (2,7,2), (2,7,3), (2,7,4), (2,7,5), (2,7,6), (2,7,7), (2,7,8), (2,7,9), (2,7,10), (2,9,1), (2,9,2), (2,9,3), (2,9,4), (2,9,5), (2,9,6), (2,9,7), (2,9,8), (2,9,9), (2,9,10), (4,1,1), (4,1,2), (4,1,3), (4,1,4), (4,1,5), (4,1,6), (4,1,7), (4,1,8), (4,1,9), (4,1,10), (4,3,1), (4,3,2), (4,3,3), (4,3,4), (4,3,5), (4,3,6), (4,3,7), (4,3,8), (4,3,9), (4,3,10), (4,5,1), (4,5,2), (4,5,3), (4,5,4), (4,5,5), (4,5,6), (4,5,7), (4,5,8), (4,5,9), (4,5,...
```

## El calculo del primo

```scala
scala> val f = ((x : Int) => 2 to Math.sqrt(x).toInt + 1)
val f: Int => scala.collection.immutable.Range.Inclusive = $Lambda$2830/0x00007f993c68df98@243f3de7

scala> f(10)
val res72: scala.collection.immutable.Range.Inclusive = Range 2 to 4

scala> val f = (x : Int) => (2 to Math.sqrt(x).toInt + 1).toList
val f: Int => List[Int] = $Lambda$2831/0x00007f993c68f808@76d1004a
```

Genero un rango entre 2 y $\lceil \sqrt{n} \rceil$ , luego lo transformo a lista para poder aplicar funciones de alto orden

El código define una función `f` que determina si un número es primo:

```scala
val f = (x : Int) => (2 to Math.ceil(Math.sqrt(x)).toInt).toList forall (t => x % t != 0)
```

**Funcionalidad:**
- Toma un entero `x` como entrada
- Genera un rango desde 2 hasta $\lceil \sqrt{x} \rceil$ (techo de la raíz cuadrada de x)
- Convierte el rango a lista para usar funciones de alto orden
- Aplica `forall` para verificar que **todos** los números `t` en el rango cumplan que `x % t != 0`
- Retorna `true` si ningún número en el rango divide a `x` (es primo), `false` en caso contrario

**Ejecución de ejemplos:**
- `f(101)` = `true` (101 es primo)
- `f(99)` = `false` (99 es divisible por 3 y 9)
- `f(13)` = `true` (13 es primo)

**Optimización:** Solo verifica divisores hasta $\sqrt{x}$ porque si un número tiene un divisor mayor que $\sqrt{x}$, también tendría uno menor.

```scala
scala> seq filter (t => t._1 % 2 == 0 && t._2 % 2 != 0 && ((2 to Math.ceil(M
ath.sqrt(t._3)).toInt).toList forall (x => t._3 % x != 0)))
val res83: IndexedSeq[(Int, Int, Int)] = Vector((2,1,1), (2,1,3), (2,1,5), (2,1,7), (2,3,1), (2,3,3), (2,3,5), (2,3,7), (2,5,1), (2,5,3), (2,5,5), (2,5,7), (2,7,1), (2,7,3), (2,7,5), (2,7,7), (2,9,1), (2,9,3), (2,9,5), (2,9,7), (4,1,1), (4,1,3), (4,1,5), (4,1,7), (4,3,1), (4,3,3), (4,3,5), (4,3,7), (4,5,1), (4,5,3), (4,5,5), (4,5,7), (4,7,1), (4,7,3), (4,7,5), (4,7,7), (4,9,1), (4,9,3), (4,9,5), (4,9,7), (6,1,1), (6,1,3), (6,1,5), (6,1,7), (6,3,1), (6,3,3), (6,3,5), (6,3,7), (6,5,1), (6,5,3), (6,5,5), (6,5,7), (6,7,1), (6,7,3), (6,7,5), (6,7,7), (6,9,1), (6,9,3), (6,9,5), (6,9,7), (8,1,1), (8,1,3), (8,1,5), (8,1,7), (8,3,1), (8,3,3), (8,3,5), (8,3,7), (8,5,1), (8,5,3), (8,5,5), (8,5,7), (8,7,1), (8,7,3), (8,7,5), (8,7,7), (8,9,1), (8,9,3), (8,9,5), (8,9,7), (10...
```

Al integrar esta función en el flatMap obtenemos el resultado esperado