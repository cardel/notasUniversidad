# Clase 02 de Mayo: Funciones de alto orden, colecciones y expresiones for

# Colecciones

Listas

Es una colección de elementos del **mismo tipo**

- Son estructuras inmutables
- Son estructuras recursivas: cabeza y cola

```bash
scala> val l = List(1,2,3,4,5)
val l: List[Int] = List(1, 2, 3, 4, 5)

scala> (l.head, l.tail)
val res0: (Int, List[Int]) = (1,List(2, 3, 4, 5))
```

---

Arrays

- Son estructuras inmutasbles
- Son estructuras secuenciales

```bash
scala> val arr = Array(1,2,3,34,2,323,2)
val arr: Array[Int] = Array(1, 2, 3, 34, 2, 323, 2)

scala> arr(0)
val res1: Int = 1

scala> arr(1)
val res2: Int = 2

scala> arr(3)
val res3: Int = 34
```

---

Conjuntos

- Son estructuras inmutables
- No permiten elementos repetidos
- Es una coleccion desordenada (no hay orden para los elementos)

```bash
scala> val conjA = Set(1,2,3,4,5,5,5,5,5,5)
val conjA: scala.collection.immutable.Set[Int] = HashSet(5, 1, 2, 3, 4)

scala> conjA union Set(10,1)
val res4: scala.collection.immutable.Set[Int] = HashSet(5, 10, 1, 2, 3, 4)
```

---

Maps

- Colecciones que cuyos elementos son llave, valor
- Las llaves debe ser únicas

```bash
scala> val mapa = Map("Carlos" -> 18, "Maria" -> 12, "Juan" -> 23)
val mapa: scala.collection.immutable.Map[String,Int] = Map(Carlos -> 18, Maria -> 12, Juan -> 23)

scala> val mapa = Map("Carlos" -> 18, "Maria" -> 12, "Juan" -> 23, "Juan" -> 48)
val mapa: scala.collection.immutable.Map[String,Int] = Map(Carlos -> 18, Maria -> 12, Juan -> 48)

scala> mapa("Carlos")
val res5: Int = 18

scala> mapa("CarlosD")
java.util.NoSuchElementException: key not found: CarlosD
  at scala.collection.immutable.Map$Map3.apply(Map.scala:417)
  ... 34 elided
```

---

Vector

- Estructuras inmutables
- Las operaciones de insertar o eliminar elementos (generando un nuevo valor) estan optimizado

```bash
scala> val v1 = Vector(1,2,3,4)
val v1: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4)

scala> v1(0)
val res7: Int = 1

scala> v1(1)
val res8: Int = 2

scala> v1 :+ 1
val res9: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 1)
```

# Funciones de alto orden

Map

- Aplica una función a los elementos de una colección
- Me retorna una colección con los elementos modificados

```bash
scala> (1 to 10).toArray
val res10: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> val arr =  (1 to 10).toArray
val arr: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> arr map (x => 3*x)
}val res11: Array[Int] = Array(3, 6, 9, 12, 15, 18, 21, 24, 27, 30)

scala> arr map (x => "h"*x)
val res12: Array[String] = Array(h, hh, hhh, hhhh, hhhhh, hhhhhh, hhhhhhh, hhhhhhhh, hhhhhhhhh, hhhhhhhhhh)
```

Filter

1. Permite filtrar una colección devolviendo los elementos que cumplan condición
2. La función a aplicar debe retorar un booleano

```bash
scala> arr
val res13: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> arr.filter(x => x < 5)
val res14: Array[Int] = Array(1, 2, 3, 4)

scala> arr.filter(x => x % 2 == 0)
val res15: Array[Int] = Array(2, 4, 6, 8, 10)

scala> arr.filter(x => x % 2 != 0)
val res16: Array[Int] = Array(1, 3, 5, 7, 9)
```

---

reduce

1. Permite convertir una colección a un valor
2. La función debe tener dos entradas acc, elemento y retorna el nuevo acumulador (recursión cola)
3. Dos versiones
    1. reduceLeft Asocia por la izquierda
    2. reduceRight Asocia por la derecha

### Explicación de `reduceLeft` y `reduceRight` en Scala

En Scala, las funciones `reduceLeft` y `reduceRight` son usadas para reducir una colección a un único valor aplicando una operación binaria, pero tienen una diferencia importante en cómo asocian los elementos.

### `reduceLeft`

La operación `reduceLeft` asocia los elementos de izquierda a derecha. Esto significa que el cálculo comienza desde el primer elemento y se mueve secuencialmente hacia la derecha.

Ejemplo de suma con `List(1, 2, 3, 4, 5)`:

```scala
List(1, 2, 3, 4, 5).reduceLeft((acc, elem) => acc + elem)

```

Paso a paso:

1. `(1 + 2) = 3`
2. `(3 + 3) = 6`
3. `(6 + 4) = 10`
4. `(10 + 5) = 15`

Resultado final: `15`

En este caso, los paréntesis se asocian de la siguiente manera:

```
((((1 + 2) + 3) + 4) + 5)

```

Si aplicamos la resta en lugar de la suma:

```scala
List(1, 2, 3, 4, 5).reduceLeft((acc, elem) => acc - elem)

```

Paso a paso:

1. `(1 - 2) = -1`
2. `(-1 - 3) = -4`
3. `(-4 - 4) = -8`
4. `(-8 - 5) = -13`

Resultado final: `-13`

La asociación para la resta sería:

```
((((1 - 2) - 3) - 4) - 5)

```

### `reduceRight`

La operación `reduceRight` asocia los elementos de derecha a izquierda. Esto significa que el cálculo comienza desde el último elemento y se mueve hacia la izquierda.

Ejemplo de suma con `List(1, 2, 3, 4, 5)`:

```scala
List(1, 2, 3, 4, 5).reduceRight((elem, acc) => elem + acc)

```

Paso a paso:

1. `(4 + 5) = 9`
2. `(3 + 9) = 12`
3. `(2 + 12) = 14`
4. `(1 + 14) = 15`

Resultado final: `15`

En este caso, los paréntesis se asocian de la siguiente manera:

```
(1 + (2 + (3 + (4 + 5))))

```

Si aplicamos la resta en lugar de la suma:

```scala
List(1, 2, 3, 4, 5).reduceRight((elem, acc) => elem - acc)

```

Paso a paso:

1. `(4 - 5) = -1`
2. `(3 - (-1)) = 4`
3. `(2 - 4) = -2`
4. `(1 - (-2)) = 3`

Resultado final: `3`

La asociación para la resta sería:

```
(1 - (2 - (3 - (4 - 5))))

```

### Diferencia clave

- **`reduceLeft`** asocia desde la izquierda, procesando los elementos en orden desde el primero hasta el último.
- **`reduceRight`** asocia desde la derecha, procesando los elementos en orden inverso, desde el último hasta el primero.

Esto genera diferencias en los resultados cuando la operación no es conmutativa (como la resta). En la suma, que es conmutativa, el resultado es el mismo para ambas funciones.

```bash
scala> val l = (1 to 100).toArray
val l: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100)

scala> l reduce ( (acc,el) => acc + el)
val res17: Int = 5050

scala> l reduce ( (acc,el) => acc)
val res18: Int = 1

scala> l reduceLeft ( (acc,el) => acc)
val res19: Int = 1

scala> l reduceRight ( (acc,el) => acc+el)
val res20: Int = 5050
```

---

## FoldLeft y FoldRight

1. Permiten colocar el acumulador inicial 
2. A colocar el acumulador la función me retorna una función que espera otra función que es la de aplica la reducción
3. Fold retorna un reduce que espera la función y está seteado el acumulador

```bash
scala> arr
val res22: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> (arr foldLeft (0))_
val res23: ((Int, Int) => Int) => Int = $Lambda$2678/0x000075af0c656000@34545f5f

scala> (arr foldLeft (0))((acc,el) => acc + el)
val res24: Int = 55

scala> (arr foldRight (0))((acc,el) => acc + el)
val res25: Int = 55

scala> (arr foldRight (0))((acc,el) => acc / el)
java.lang.ArithmeticException: / by zero
  at $anonfun$res26$1(<console>:1)
  at scala.runtime.java8.JFunction2$mcIII$sp.apply(JFunction2$mcIII$sp.scala:17)
  at scala.collection.ArrayOps$.f$mIc$sp$2(ArrayOps.scala:889)
  at scala.collection.ArrayOps$.foldRight$extension(ArrayOps.scala:897)
  ... 34 elided

scala> (arr foldLeft (0))((acc,el) => acc / el)
val res27: Int = 0
```

### Explicación de `foldLeft` y `foldRight` en Scala

En Scala, `foldLeft` y `foldRight` son funciones de alto orden utilizadas en programación funcional para reducir una colección a un único valor. Ambas funciones permiten especificar un valor inicial para el acumulador y una función que define cómo combinar el acumulador con cada elemento de la colección.

---

### `foldLeft`

- **Asociación de izquierda a derecha**: el cálculo comienza desde el valor inicial y se mueve secuencialmente desde el primer elemento hasta el último.
- **Sintaxis**: `list.foldLeft(valorInicial)(funcion)`

### Ejemplo de suma con `List(1, 2, 3, 4, 5)`

```scala
List(1, 2, 3, 4, 5).foldLeft(0)((acc, elem) => acc + elem)

```

**Paso a paso**:

1. Inicialmente, `acc = 0` y `elem = 1`: `0 + 1 = 1`
2. Ahora, `acc = 1` y `elem = 2`: `1 + 2 = 3`
3. Ahora, `acc = 3` y `elem = 3`: `3 + 3 = 6`
4. Ahora, `acc = 6` y `elem = 4`: `6 + 4 = 10`
5. Finalmente, `acc = 10` y `elem = 5`: `10 + 5 = 15`

**Resultado final**: `15`

La asociación de las operaciones es de izquierda a derecha (los paréntesis lo indican):

```
((((0 + 1) + 2) + 3) + 4) + 5

```

### Ejemplo de resta con `List(1, 2, 3, 4, 5)`

```scala
List(1, 2, 3, 4, 5).foldLeft(0)((acc, elem) => acc - elem)

```

**Paso a paso**:

1. Inicialmente, `acc = 0` y `elem = 1`: `0 - 1 = -1`
2. Ahora, `acc = -1` y `elem = 2`: `1 - 2 = -3`
3. Ahora, `acc = -3` y `elem = 3`: `3 - 3 = -6`
4. Ahora, `acc = -6` y `elem = 4`: `6 - 4 = -10`
5. Finalmente, `acc = -10` y `elem = 5`: `10 - 5 = -15`

**Resultado final**: `-15`

La asociación de las operaciones es:

```
((((0 - 1) - 2) - 3) - 4) - 5

```

---

### `foldRight`

- **Asociación de derecha a izquierda**: el cálculo comienza desde el valor inicial y se mueve secuencialmente desde el último elemento hacia el primero.
- **Sintaxis**: `list.foldRight(valorInicial)(funcion)`

### Ejemplo de suma con `List(1, 2, 3, 4, 5)`

```scala
List(1, 2, 3, 4, 5).foldRight(0)((elem, acc) => elem + acc)

```

**Paso a paso**:

1. Inicialmente, `elem = 5` y `acc = 0`: `5 + 0 = 5`
2. Ahora, `elem = 4` y `acc = 5`: `4 + 5 = 9`
3. Ahora, `elem = 3` y `acc = 9`: `3 + 9 = 12`
4. Ahora, `elem = 2` y `acc = 12`: `2 + 12 = 14`
5. Finalmente, `elem = 1` y `acc = 14`: `1 + 14 = 15`

**Resultado final**: `15`

La asociación de las operaciones es de derecha a izquierda:

```
1 + (2 + (3 + (4 + (5 + 0))))

```

### Ejemplo de resta con `List(1, 2, 3, 4, 5)`

```scala
List(1, 2, 3, 4, 5).foldRight(0)((elem, acc) => elem - acc)

```

**Paso a paso**:

1. Inicialmente, `elem = 5` y `acc = 0`: `5 - 0 = 5`
2. Ahora, `elem = 4` y `acc = 5`: `4 - 5 = -1`
3. Ahora, `elem = 3` y `acc = -1`: `3 - (-1) = 4`
4. Ahora, `elem = 2` y `acc = 4`: `2 - 4 = -2`
5. Finalmente, `elem = 1` y `acc = -2`: `1 - (-2) = 3`

**Resultado final**: `3`

La asociación de las operaciones es:

```
1 - (2 - (3 - (4 - (5 - 0))))

```

---

### Diferencia principal entre `foldLeft` y `foldRight`

- **`foldLeft`**: Asocia las operaciones de izquierda a derecha y procesa los elementos en orden natural.
- **`foldRight`**: Asocia las operaciones de derecha a izquierda y procesa los elementos en orden inverso.

La diferencia se vuelve importante cuando la operación no es conmutativa (como la resta), ya que cambiar el orden de asociación afecta el resultado.

---

### Resumen de los resultados

1. **Suma con `foldLeft` y `foldRight`**:
    - Resultado igual (`15`) porque la suma es conmutativa.
    - Asociación:
        - `foldLeft`: `((((0 + 1) + 2) + 3) + 4) + 5`
        - `foldRight`: `1 + (2 + (3 + (4 + (5 + 0))))`
2. **Resta con `foldLeft` y `foldRight`**:
    - Resultado diferente debido a la no conmutatividad:
        - `foldLeft`: `15`
        - `foldRight`: `3`
    - Asociación:
        - `foldLeft`: `((((0 - 1) - 2) - 3) - 4) - 5`
        - `foldRight`: `1 - (2 - (3 - (4 - (5 - 0))))`

# Flatmap

- Permite hacer map entre dos colecciones
- Se toma el producto cartesiano entre la primera colección y la segunda
- Permite devolver una colección de elementos, el map me retornaría una colección de colecciones (no deseable)

```bash
scala> arr map (x => Math.pow(x,2))
val res30: Array[Double] = Array(1.0, 4.0, 9.0, 16.0, 25.0, 36.0, 49.0, 64.0, 81.0, 100.0)

scala> arr map (x => (1 to 5).toArray map (y => Math.pow(x,y)))
val res31: Array[Array[Double]] = Array(Array(1.0, 1.0, 1.0, 1.0, 1.0), Array(2.0, 4.0, 8.0, 16.0, 32.0), Array(3.0, 9.0, 27.0, 81.0, 243.0), Array(4.0, 16.0, 64.0, 256.0, 1024.0), Array(5.0, 25.0, 125.0, 625.0, 3125.0), Array(6.0, 36.0, 216.0, 1296.0, 7776.0), Array(7.0, 49.0, 343.0, 2401.0, 16807.0), Array(8.0, 64.0, 512.0, 4096.0, 32768.0), Array(9.0, 81.0, 729.0, 6561.0, 59049.0), Array(10.0, 100.0, 1000.0, 10000.0, 100000.0))

scala> arr map (x => (1 to 5).toArray map (y => Math.pow(y,x)))
val res32: Array[Array[Double]] = Array(Array(1.0, 2.0, 3.0, 4.0, 5.0), Array(1.0, 4.0, 9.0, 16.0, 25.0), Array(1.0, 8.0, 27.0, 64.0, 125.0), Array(1.0, 16.0, 81.0, 256.0, 625.0), Array(1.0, 32.0, 243.0, 1024.0, 3125.0), Array(1.0, 64.0, 729.0, 4096.0, 15625.0), Array(1.0, 128.0, 2187.0, 16384.0, 78125.0), Array(1.0, 256.0, 6561.0, 65536.0, 390625.0), Array(1.0, 512.0, 19683.0, 262144.0, 1953125.0), Array(1.0, 1024.0, 59049.0, 1048576.0, 9765625.0))

scala> arr map (x => (1 to 5).toArray map (y => Math.pow(x,y)))
val res33: Array[Array[Double]] = Array(Array(1.0, 1.0, 1.0, 1.0, 1.0), Array(2.0, 4.0, 8.0, 16.0, 32.0), Array(3.0, 9.0, 27.0, 81.0, 243.0), Array(4.0, 16.0, 64.0, 256.0, 1024.0), Array(5.0, 25.0, 125.0, 625.0, 3125.0), Array(6.0, 36.0, 216.0, 1296.0, 7776.0), Array(7.0, 49.0, 343.0, 2401.0, 16807.0), Array(8.0, 64.0, 512.0, 4096.0, 32768.0), Array(9.0, 81.0, 729.0, 6561.0, 59049.0), Array(10.0, 100.0, 1000.0, 10000.0, 100000.0))

scala> (1 to 5).Array map(y => arr map (x => Math.pow(x,y).toInt))
                ^
       error: value Array is not a member of scala.collection.immutable.Range.Inclusive
       did you mean toArray?

scala> (1 to 5).toArray map(y => arr map (x => Math.pow(x,y).toInt))
val res35: Array[Array[Int]] = Array(Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), Array(1, 4, 9, 16, 25, 36, 49, 64, 81, 100), Array(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000), Array(1, 16, 81, 256, 625, 1296, 2401, 4096, 6561, 10000), Array(1, 32, 243, 1024, 3125, 7776, 16807, 32768, 59049, 100000))

scala> (1 to 5).toArray flatMap(y => arr map (x => Math.pow(x,
y).toInt))
val res36: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1, 16, 81, 256, 625, 1296, 2401, 4096, 6561, 10000, 1, 32, 243, 1024, 3125, 7776, 16807, 32768, 59049, 100000)

scala> Array(Array(1,2),Array(2,3), Array(1,2,2))
val res37: Array[Array[Int]] = Array(Array(1, 2), Array(2, 3), Array(1, 2, 2))

scala> Array(Array(1,2),Array(2,3), Array(1,2,2)).flatten
val res38: Array[Int] = Array(1, 2, 2, 3, 1, 2, 2)

scala> (1 to 10) flatMap (x => (20 to 25) map (y => (x,y)))
val res39: IndexedSeq[(Int, Int)] = Vector((1,20), (1,21), (1,22), (1,23), (1,24), (1,25), (2,20), (2,21), (2,22), (2,23), (2,24), (2,25), (3,20), (3,21), (3,22), (3,23), (3,24), (3,25), (4,20), (4,21), (4,22), (4,23), (4,24), (4,25), (5,20), (5,21), (5,22), (5,23), (5,24), (5,25), (6,20), (6,21), (6,22), (6,23), (6,24), (6,25), (7,20), (7,21), (7,22), (7,23), (7,24), (7,25), (8,20), (8,21), (8,22), (8,23), (8,24), (8,25), (9,20), (9,21), (9,22), (9,23), (9,24), (9,25), (10,20), (10,21), (10,22), (10,23), (10,24), (10,25))

```

Para entender el funcionamiento de la expresión `(1 to 5).flatMap(x => (12 to 16).map(y => (x + y)))`, vamos a analizarla paso a paso:

---

1. **`1 to 5`:**
    - Esta expresión crea un rango que incluye los números enteros desde 1 hasta 5 (inclusive). El rango generado es:
        
        ```
        Range(1, 2, 3, 4, 5)
        
        ```
        

---

1. **`flatMap`:**
    - La función `flatMap` aplica una función a cada elemento del rango `(1 to 5)` y luego "aplana" (flatten) los resultados. Esto significa que si la función aplicada devuelve colecciones (como listas o rangos), `flatMap` las combinará en una sola colección.

---

1. **Para cada elemento `x` en el rango `(1 to 5)`...**
    - La función `flatMap` toma cada valor `x` del rango `(1 to 5)` y aplica la función `(12 to 16).map(y => (x + y))`.
    - La función `map` devuelve una nueva colección transformada al aplicar una operación a cada elemento del rango `(12 to 16)`.

---

1. **`12 to 16`:**
    - Esta expresión genera otro rango, que incluye los números enteros desde 12 hasta 16 (inclusive). El rango generado es:
        
        ```
        Range(12, 13, 14, 15, 16)
        
        ```
        

---

1. **Mapear cada `y` en `12 to 16`:**
    - La función `(12 to 16).map(y => (x + y))` toma cada valor `y` del rango `(12 to 16)` y le suma el valor `x` proporcionado por el rango `(1 to 5)`.
    
    Para cada valor de `x` en `(1 to 5)`, se genera un nuevo rango sumando `x` a cada valor de `y` en `(12 to 16)`.
    
    Por ejemplo:
    
    - Si `x = 1`, entonces:
        
        ```
        (12 to 16).map(y => (1 + y)) = [13, 14, 15, 16, 17]
        
        ```
        
    - Si `x = 2`, entonces:
        
        ```
        (12 to 16).map(y => (2 + y)) = [14, 15, 16, 17, 18]
        
        ```
        
    - Si `x = 3`, entonces:
        
        ```
        (12 to 16).map(y => (3 + y)) = [15, 16, 17, 18, 19]
        
        ```
        
    - Si `x = 4`, entonces:
        
        ```
        (12 to 16).map(y => (4 + y)) = [16, 17, 18, 19, 20]
        
        ```
        
    - Si `x = 5`, entonces:
        
        ```
        (12 to 16).map(y => (5 + y)) = [17, 18, 19, 20, 21]
        
        ```
        

---

1. **Aplicar `flatMap`:**
    - Después de calcular los resultados de `map` para cada valor de `x`, `flatMap` combina todas las listas generadas en una sola colección, eliminando cualquier estructura anidada.
    
    El resultado final será:
    
    ```
    [13, 14, 15, 16, 17, 14, 15, 16, 17, 18, 15, 16, 17, 18, 19, 16, 17, 18, 19, 20, 17, 18, 19, 20, 21]
    
    ```
    

---

### Resumen:

1. Para cada valor de `x` en `(1 to 5)`, se genera una lista sumando `x` a cada valor de `y` en `(12 to 16)`.
2. `flatMap` combina todas esas listas en una sola colección.
3. El resultado final es una lista de números enteros:
    
    ```
    [13, 14, 15, 16, 17, 14, 15, 16, 17, 18, 15, 16, 17, 18, 19, 16, 17, 18, 19, 20, 17, 18, 19, 20, 21]
    
    ```
    

# Rangos

Inclusivos

(1 to 10) 

1,2,3,4,5,6,7,8,9,10

(1 to 10 by 2)

1,3,5,7,9

(10 to 1 by -1)

10,9,8,7,6,5,4,3,2,1

---

No inclusivo

(1 until 11)

1,2,3,4,5,6,7,8,9,10

(1 until 11 by 2)

1,3,5,7,9

(10 until 0 by -1)

10,9,8,7,6,5,4,3,2,1

---

Otras funciones de alto orden

- exists (Aplica el operador existencia $\exists x P(x)$
- forall (APlicar el operador para todo) $\forall x P(x)$

```bash
scala> arr
val res40: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> arr exists (x => x%2 == 0)
val res41: Boolean = true

scala> arr exists (x => x < 1)
val res42: Boolean = false

scala> arr forall (x => x%2 == 0)
val res43: Boolean = false
```

---

Operamos colecciones paralela

- Colecciones del mismo tamaño
- Los elementos están relacionados entre sí dada su posición

```bash
scala> val nombres = List("Juan", "Maria", "Sofia", "Diana", "Paulo")
val nombres: List[String] = List(Juan, Maria, Sofia, Diana, Paulo)

scala> nombres zip edades
val res44: List[(String, Int)] = List((Juan,10), (Maria,20), (Sofia,30), (Diana,40), (Paulo,50))

scala> val nombres = List("Juan", "Maria", "Sofia", "Diana", "Paulo", "Mario")

val nombres: List[String] = List(Juan, Maria, Sofia, Diana, Paulo, Mario)

scala> edades
val res45: List[Int] = List(10, 20, 30, 40, 50)

scala> nombres zip edades
val res46: List[(String, Int)] = List((Juan,10), (Maria,20), (Sofia,30), (Diana,40), (Paulo,50))

scala> val t =  nombres zip edades
val t: List[(String, Int)] = List((Juan,10), (Maria,20), (Sofia,30), (Diana,40), (Paulo,50))

scala> t.unzip
```

# Expresiones for

## Numeros primos

Para explicar el código `(2 to Math.ceil(Math.sqrt(n)).toInt) forall (i => n % i != 0)` para `n = 97` y `n = 99`, lo desglosaremos paso a paso:

---

### **1. Contexto del código**

Este código verifica si un número `n` es primo. Un número primo es aquel que solo es divisible entre 1 y sí mismo, es decir, no tiene divisores entre 2 y `n-1`.

La idea detrás de este código es la siguiente:

- No es necesario verificar todos los números entre 2 y `n-1`.
- Basta con verificar los divisores entre 2 y la raíz cuadrada de `n`. Esto se debe a que cualquier divisor mayor que la raíz cuadrada de `n` tendría como pareja un divisor menor que la raíz cuadrada.

Por lo tanto:
`(2 to Math.ceil(Math.sqrt(n)).toInt)` genera un rango de números desde 2 hasta el valor entero de la raíz cuadrada de `n` (redondeado hacia arriba).
`forall (i => n % i != 0)` verifica que `n` no sea divisible por ningún número en ese rango.

---

### **2. Paso a paso con `n = 97`**

1. **Cálculo de la raíz cuadrada de `n`**:
    - `Math.sqrt(97)` = aproximadamente `9.8488578018`.
    - `Math.ceil(9.8488578018)` = `10`.
    - Por lo tanto, el rango es `(2 to 10)` = `[2, 3, 4, 5, 6, 7, 8, 9, 10]`.
2. **Verificación de divisibilidad**:
    - El código evalúa si `n % i != 0` para cada `i` en el rango `[2, 3, 4, 5, 6, 7, 8, 9, 10]`.
    - Esto implica que probamos si `97` es divisible por cada número del rango. Veamos:
        - `97 % 2 != 0` → `97` no es divisible por `2`.
        - `97 % 3 != 0` → `97` no es divisible por `3`.
        - `97 % 4 != 0` → `97` no es divisible por `4`.
        - `97 % 5 != 0` → `97` no es divisible por `5`.
        - `97 % 6 != 0` → `97` no es divisible por `6`.
        - `97 % 7 != 0` → `97` no es divisible por `7`.
        - `97 % 8 != 0` → `97` no es divisible por `8`.
        - `97 % 9 != 0` → `97` no es divisible por `9`.
        - `97 % 10 != 0` → `97` no es divisible por `10`.
3. **Resultado**:
    - Como `97` no es divisible por ningún número del rango `[2, 10]`, el código concluye que `97` es un número primo.

---

### **3. Paso a paso con `n = 99`**

1. **Cálculo de la raíz cuadrada de `n`**:
    - `Math.sqrt(99)` = aproximadamente `9.9498743711`.
    - `Math.ceil(9.9498743711)` = `10`.
    - Por lo tanto, el rango es `(2 to 10)` = `[2, 3, 4, 5, 6, 7, 8, 9, 10]`.
2. **Verificación de divisibilidad**:
    - El código evalúa si `n % i != 0` para cada `i` en el rango `[2, 3, 4, 5, 6, 7, 8, 9, 10]`.
    - Veamos el proceso para `99`:
        - `99 % 2 != 0` → `99` no es divisible por `2`.
        - `99 % 3 != 0` → **Falso**, porque `99` es divisible por `3` (`99 % 3 = 0`).
3. **Resultado**:
    - En el paso anterior, encontramos que `99` es divisible por `3`. Por lo tanto, el código concluye que `99` **no** es un número primo.

---

### **4. Resumen de los resultados**

- Para `n = 97`, el resultado es `true`, ya que `97` es un número primo.
- Para `n = 99`, el resultado es `false`, ya que `99` no es un número primo (es divisible por `3`).

---

### **5. Explicación del operador `forall`**

- La función `forall` aplica una condición a todos los elementos de la colección (en este caso, el rango `[2, to Math.ceil(Math.sqrt(n)).toInt]`).
- Si **todos** los elementos cumplen la condición (es decir, si `n % i != 0` para todos los `i`), entonces `forall` devuelve `true`.
- Si **algún** elemento no cumple la condición, `forall` devuelve `false`.

En este caso, `forall` verifica si `n` no es divisible por ningún número en el rango `[2, Math.ceil(Math.sqrt(n)).toInt]`.

---

Espero que esta explicación te haya sido útil. Si tienes más dudas, ¡estaré encantado de ayudarte!

Ejercicio me piden generar parejas (i,j) donde 1 ≤ j < n  y j < i < n y (i+j) sea un numero primo.

1. Generar las parejas sin discriminización n = 10,  (2,1) (3,1) (3,2) (4,1) (4,2) ….. (10,9)
2. Posteriormente filtramos aquellas donde (i+j) es un primo

## Expresiones for

- Cuenta con un generador el cual aplica producto cartesiano
- Puede aplicar uno o más filtros
- Yield la unión (flatMap)

Las expresiones `for` en Scala son una forma más declarativa y legible de generar colecciones y aplicar filtros, en comparación con las estrategias basadas en combinaciones explícitas de métodos como `flatMap`, `map` y `filter`. A continuación, se explica la diferencia entre las expresiones `for` y las estrategias alternativas, basándonos en el código proporcionado:

---

### Código basado en métodos `flatMap`, `map` y `filter`

```scala
def generador(n: Int): Seq[(Int, Int)] = {
  ((1 until n) flatMap (j => (j + 1 until n) map (i => (i, j)))) filter (x => esPrimo(x._1 + x._2))
}

```

1. **Descripción del código**:
    - Se utiliza `flatMap` para generar un producto cartesiano parcial. Para cada `j` en el rango `1 until n`, se calculan todos los posibles valores de `i` en el rango `j + 1 until n`.
    - Se utiliza `map` para formar pares `(i, j)` a partir de los valores generados por `flatMap`.
    - Finalmente, se aplica un `filter` para conservar únicamente los pares `(i, j)` donde la suma `i + j` sea un número primo.
2. **Desventajas**:
    - **Complejidad visual**: El uso combinado de `flatMap`, `map` y `filter` puede resultar difícil de leer y comprender, especialmente para programadores que no están familiarizados con la programación funcional.
    - **Orden de lectura no natural**: La combinación de métodos puede hacer que el flujo lógico del código no sea evidente a primera vista, ya que se debe rastrear cómo interactúan entre sí los métodos.
    - **Menor expresividad**: Este enfoque describe "cómo" se realiza la operación (los pasos específicos), en lugar de centrarse en "qué" se quiere lograr.

---

### Código basado en una expresión `for`

```scala
def generadorFor(n: Int): Seq[(Int, Int)] = {
  for {
    j <- (1 until n)                // Generador: para cada j en el rango 1 hasta n-1
    i <- (j + 1 until n)            // Generador: para cada i en el rango j+1 hasta n-1
    if esPrimo(i + j)               // Filtro: conservar solo si la suma i + j es un número primo
  } yield (i, j)                    // Producción: generar el par (i, j)
}

```

1. **Descripción del código**:
    - La expresión `for` combina generadores, filtros y la producción de resultados en una única estructura.
    - El bloque `for` genera los mismos pares `(i, j)` que el código anterior, pero lo hace de manera más declarativa.
    - Se representa claramente el flujo lógico: generación de valores (`j` e `i`), aplicación de un filtro (`if esPrimo(i + j)`) y la creación del resultado final (`yield (i, j)`).
2. **Ventajas**:
    - **Mayor legibilidad**: La estructura del `for` es más intuitiva y fácil de leer, ya que sigue un flujo lógico que se asemeja al lenguaje natural.
    - **Declaratividad**: Describe "qué" se quiere lograr (pares `(i, j)` donde `i + j` es primo), en lugar de "cómo" se realiza la operación.
    - **Menor riesgo de errores**: Al agrupar generadores y filtros en un solo lugar, se reduce la posibilidad de errores relacionados con el uso incorrecto de combinaciones como `flatMap` o `filter`.
    - **Flexibilidad**: Es más fácil agregar o modificar filtros o generadores directamente dentro del bloque `for`.

---

### Comparación entre ambos enfoques

| Aspecto | `flatMap + map + filter` | Expresión `for` |
| --- | --- | --- |
| **Legibilidad** | Menos legible debido a la combinación de múltiples métodos. | Más legible y fácil de seguir. |
| **Mantenimiento** | Más difícil de modificar o extender. | Más fácil de modificar o extender. |
| **Curva de aprendizaje** | Requiere comprender cómo interactúan los métodos funcionales. | Más intuitivo, especialmente para principiantes. |
| **Declaratividad** | Centrado en "cómo" realizar la operación. | Centrado en "qué" se quiere lograr. |
| **Expresividad** | Menos expresivo, requiere más código para expresar la misma lógica. | Más expresivo, combina generadores, filtros y resultados en una estructura compacta. |

---

### Conclusión

El uso de expresiones `for` en Scala ofrece varias ventajas sobre las combinaciones de `flatMap`, `map` y `filter`, especialmente en términos de legibilidad, declaratividad y facilidad de mantenimiento. Las expresiones `for` son especialmente útiles para trabajos complejos que involucran múltiples generadores y filtros, ya que permiten expresar la lógica de manera clara y compacta, lo que facilita el entendimiento y la colaboración en proyectos de programación funcional.

```bash
object Ejercicio {
  def esPrimo(n:Int):Boolean = {
    (2 to Math.ceil(Math.sqrt(n)).toInt) forall (i => n % i != 0)
  }

  def generador(n:Int):Seq[(Int,Int)] = {
    ((1 until n) flatMap (j => (j+1 until n) map (i => (i,j)))) filter (x => esPrimo(x._1 + x._2))
  }
  
  def generadorFor(n:Int):Seq[(Int,Int)] = {
    for {
      j <- (1 until n)
      i <- (j+1 until n)
      if esPrimo(i+j)
    } yield (i,j)
  }

  def main(arr:Array[String]):Unit = {
    println(generador(7))
    println(generadorFor(7))
  }
}
```

## Resumen

Este documento abarca conceptos fundamentales de programación funcional en Scala, enfocado en las colecciones, funciones de alto orden y expresiones `for`. A continuación, se destacan los aspectos más importantes:

### **Colecciones**

1. **Listas**:
    - Estructuras inmutables y recursivas (cabeza y cola).
    - Ejemplo: `List(1, 2, 3, 4, 5)`.
2. **Arrays**:
    - Estructuras inmutables y secuenciales.
    - Acceso directo a elementos mediante índices.
3. **Conjuntos**:
    - Estructuras inmutables y desordenadas.
    - No permiten elementos repetidos.
4. **Maps**:
    - Colecciones de pares clave-valor, donde las claves son únicas.
5. **Vectores**:
    - Estructuras inmutables optimizadas para insertar y eliminar elementos.

### **Funciones de alto orden**

1. **Map**:
    - Aplica una función a los elementos de una colección y retorna una nueva colección.
2. **Filter**:
    - Filtra una colección devolviendo elementos que cumplan una condición.
3. **Reduce**:
    - Permite reducir una colección a un único valor, asociando elementos desde la izquierda (`reduceLeft`) o la derecha (`reduceRight`).
4. **Fold**:
    - Similar a `reduce`, pero permite especificar un acumulador inicial.
5. **FlatMap**:
    - Combina `map` y `flatten` para trabajar con colecciones anidadas y generar colecciones planas.

### **Expresiones `for`**

- Son utilizadas para generar colecciones, aplicar filtros y producir resultados.
- Ventajas:
    - Mayor legibilidad y expresividad.
    - Más declarativas y fáciles de mantener.
- Diferencia principal: las expresiones `for` describen "qué" se quiere lograr, mientras que combinaciones como `flatMap` y `filter` muestran "cómo" hacerlo.

### **Ventajas y desventajas**

### **Ventajas de Scala y programación funcional**:

- Mayor legibilidad en código declarativo.
- Uso eficiente de colecciones inmutables.
- Potencia y flexibilidad en el manejo de funciones de alto orden.

### **Desventajas**:

- Puede ser complejo para principiantes.
- Requiere acostumbrarse a nuevos paradigmas (como la inmutabilidad y funciones puras).

---

## Mensaje de motivación

¡No te desanimes si este tema parece complicado al principio! Al igual que aprender a tocar un instrumento o practicar un deporte, la programación funcional requiere tiempo, paciencia y práctica. Pero aquí está la magia: una vez que domines estos conceptos, desarrollarás un superpoder como programador. Podrás escribir código más claro, eficiente y libre de errores, habilidades que son muy valoradas en la industria tecnológica.

Recuerda, cada experto en programación también fue un principiante en algún momento. No te enfoques en las dificultades del presente, sino en el potencial de lo que puedes lograr. ¡Tu esfuerzo de hoy es el éxito de mañana!

¡Sigue adelante, confía en ti y nunca dejes de aprender!