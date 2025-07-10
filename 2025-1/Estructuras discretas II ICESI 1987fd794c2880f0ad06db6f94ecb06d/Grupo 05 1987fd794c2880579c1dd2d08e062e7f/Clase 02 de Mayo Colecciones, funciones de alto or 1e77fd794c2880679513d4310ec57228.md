# Clase 02 de Mayo Colecciones, funciones de alto orden y expresiones for

---

Lista

- Es una colección de elementos del mismo tipo
- Es recursiva: cabeza y cola
- Es inmutable
- Tiempo de acceso es O(n)

---

Array

- Es una colección de elementos del mismo tipo
- Son secuenciales elemento posición 0, posición 1, .. posición n-1
- El acceso es O(1) no depende del tamaño

---

Conjuntos

- Es una colección de elementos del mismo tipo
- No son secuenciales
- No permiten elementos repetidos

---

Maps

- Colecciones de llave, valor
- No son secuenciales (se acceden por la llave)
- La llave debe ser única

---

Vectores

- Colecciones del mismo tipo
- Inmutables
- Secuenciales (posiciones 0,1,2)
- Estan pensadas para cambiar de tamaño (devuelve un valor)

```bash
scala> val l = List(1,2,3)
val l: List[Int] = List(1, 2, 3)

scala> l.head
val res0: Int = 1

scala> l.tail
val res1: List[Int] = List(2, 3)

scala> val a = Array(1,2,3,4,5)
val a: Array[Int] = Array(1, 2, 3, 4, 5)

scala> a(0)
val res2: Int = 1

scala> a(1)
val res3: Int = 2

scala> val mapa = Map("Carlos" -> 37, "Juan" -> 28, "Pedro" -> 16)
val mapa: scala.collection.immutable.Map[String,Int] = Map(Carlos -> 37, Juan -> 28, Pedro -> 16)

scala> val mapa = Map("Carlos" -> 37, "Juan" -> 28, "Pedro" -> 16, "Carlos"->12)
val mapa: scala.collection.immutable.Map[String,Int] = Map(Carlos -> 12, Juan -> 28, Pedro -> 16)

scala> mapa("Carlos")
val res4: Int = 12

scala> val conj = Set(1,1,2,3,123,12,312,312,3,13,123)
val conj: scala.collection.immutable.Set[Int] = HashSet(13, 2, 12, 3, 123, 1, 312)

scala> conj union Set(1,2,3)
val res6: scala.collection.immutable.Set[Int] = HashSet(13, 2, 12, 3, 123, 1, 312)

scala> val v1 = Vector(1,2,3,4)
val v1: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4)

scala> v1 :+ 1
val res7: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 1)

scala> v1(2)
val res8: Int = 3

scala> v1
val res9: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4)
```

| Tipo | Secuencial | Permite duplicados | Mutabilidad | Acceso por índice | Claves únicas (para Map) | Propósito principal |
| --- | --- | --- | --- | --- | --- | --- |
| List | Sí | Sí | Inmutable | O(n) | N/A | Colección inmutable que representa una lista enlazada. Ideal para operaciones recursivas. |
| Array | Sí | Sí | Mutable (Pero para programación funcional no es el objetivo) | O(1) | N/A | Colección mutable que permite acceso rápido por índice. Ideal para datos secuenciales que cambian. |
| Set | No | No | Inmutable (por defecto) | N/A | N/A | Colección que no permite duplicados. Ideal para garantizar elementos únicos. |
| Map | No | N/A | Inmutable (por defecto) | N/A | Sí | Colección de pares clave-valor. Ideal para búsquedas rápidas basadas en claves únicas. |
| Vector | Sí | Sí | Inmutable | O(1) (para acceso aleatorio) | N/A | Colección inmutable optimizada para acceso rápido y operaciones de crecimiento dinámico. |
| Tuple | Sí (ordenado por definición) | Sí | Inmutable | Acceso por posición fija | N/A | Estructura fija que agrupa un número específico de elementos, cada uno con su tipo. |

# Funciones de alto orden

- Map
- Filter
- Reduce

Aplicar operaciones sobre colecciones, map aplica una función a cada elemento, filter retorna los elementos que cumple condición (función predicado), reduce (retorna un valor a partir de una colección)

```bash
scala> val arr = (1 to 100).toArray
val arr: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100)

scala> arr map (x => x*x)
val res10: Array[Int] = Array(1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961, 1024, 1089, 1156, 1225, 1296, 1369, 1444, 1521, 1600, 1681, 1764, 1849, 1936, 2025, 2116, 2209, 2304, 2401, 2500, 2601, 2704, 2809, 2916, 3025, 3136, 3249, 3364, 3481, 3600, 3721, 3844, 3969, 4096, 4225, 4356, 4489, 4624, 4761, 4900, 5041, 5184, 5329, 5476, 5625, 5776, 5929, 6084, 6241, 6400, 6561, 6724, 6889, 7056, 7225, 7396, 7569, 7744, 7921, 8100, 8281, 8464, 8649, 8836, 9025, 9216, 9409, 9604, 9801, 10000)

scala> arr filter (x => x%2 == 0)
val res11: Array[Int] = Array(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100)

scala> arr reduceLeft ((acc, el) => acc+el)
val res12: Int = 5050

scala> arr reduceRight ((acc, el) => acc+el)
val res13: Int = 5050
```

### Diferencia entre reduceLeft y reduceRight

En Scala, `reduceLeft` y `reduceRight` son métodos que permiten reducir una colección a un único valor aplicando una operación binaria de forma asociativa. La diferencia entre ambos radica en el orden en que aplican la operación, lo que puede ser importante dependiendo de la naturaleza de la misma (por ejemplo, en operaciones no conmutativas como la resta).

### Ejemplo: Suma con `reduceLeft` en `Array(2, 4, 6, 8)`

Con `reduceLeft`, la operación se evalúa de izquierda a derecha:

1. Comienza con los dos primeros elementos: `(2 + 4)` = `6`
2. Toma el resultado y suma el siguiente elemento: `(6 + 6)` = `12`
3. Toma el resultado y suma el siguiente elemento: `(12 + 8)` = `20`

El resultado final de la operación es `20`.

Asociación de la operación:

```
((2 + 4) + 6) + 8

```

---

### Ejemplo: Suma con `reduceRight` en `Array(2, 4, 6, 8)`

Con `reduceRight`, la operación se evalúa de derecha a izquierda:

1. Comienza con los dos últimos elementos: `(6 + 8)` = `14`
2. Toma el resultado y suma el elemento anterior: `(4 + 14)` = `18`
3. Toma el resultado y suma el elemento anterior: `(2 + 18)` = `20`

El resultado final de la operación es también `20`.

Asociación de la operación:

```
2 + (4 + (6 + 8))

```

---

### Ejemplo: Resta con `reduceLeft` en `Array(2, 4, 6, 8)`

Con `reduceLeft`, la operación se evalúa de izquierda a derecha:

1. Comienza con los dos primeros elementos: `(2 - 4)` = `2`
2. Toma el resultado y resta el siguiente elemento: `(-2 - 6)` = `8`
3. Toma el resultado y resta el siguiente elemento: `(-8 - 8)` = `16`

El resultado final de la operación es `-16`.

Asociación de la operación:

```
((2 - 4) - 6) - 8

```

---

### Ejemplo: Resta con `reduceRight` en `Array(2, 4, 6, 8)`

Con `reduceRight`, la operación se evalúa de derecha a izquierda:

1. Comienza con los dos últimos elementos: `(6 - 8)` = `2`
2. Toma el resultado y lo resta al elemento anterior: `(4 - (-2))` = `6`
3. Toma el resultado y lo resta al elemento anterior: `(2 - 6)` = `4`

El resultado final de la operación es `-4`.

Asociación de la operación:

```
2 - (4 - (6 - 8))

```

---

### Diferencia clave entre `reduceLeft` y `reduceRight`

La diferencia principal radica en la **asociación** de las operaciones:

- `reduceLeft` evalúa de **izquierda a derecha**, lo que equivale a asociar las operaciones de esta manera: `((x op y) op z) ...`.
- `reduceRight` evalúa de **derecha a izquierda**, lo que equivale a asociar las operaciones de esta manera: `x op (y op (z ...))`.

En operaciones **conmutativas** (como la suma), el orden no afecta el resultado. Sin embargo, en operaciones **no conmutativas** (como la resta), el orden cambia el resultado final, como se muestra en los ejemplos anteriores.

```bash
scala> arr.foldLeft(0)_
val res23: ((Int, Int) => Int) => Int = $Lambda$2719/0x00007d74f4613288@2d1c376b

scala> (arr foldLeft 0)((acc,el)=> acc + el)
val res24: Int = 5050

scala> (List() foldLeft 0)((acc:Int,el:Int)=> acc + el)
val res25: Int = 0
```

### `foldLeft` y `foldRight` en Scala

En Scala, `foldLeft` y `foldRight` son operaciones que permiten reducir una colección a un único valor, comenzando desde un valor inicial y aplicando una función binaria de forma acumulativa. La diferencia principal entre ambos radica en el orden en el que se realiza la evaluación:

- **`foldLeft`**: Evalúa de izquierda a derecha.
- **`foldRight`**: Evalúa de derecha a izquierda.

A continuación, se explica cómo funcionan con ejemplos utilizando el `Array(2, 4, 6, 8)`.

---

### Suma con `foldLeft`

Con `foldLeft`, el cálculo comienza con el valor inicial y avanza de izquierda a derecha. Supongamos que usamos como valor inicial `0`. La operación sería:

```scala
val arr = Array(2, 4, 6, 8)
val result = arr.foldLeft(0)(_ + _)

```

1. Valor inicial: `0`
2. Primera operación: `(0 + 2) = 2`
3. Segunda operación: `(2 + 4) = 6`
4. Tercera operación: `(6 + 6) = 12`
5. Cuarta operación: `(12 + 8) = 20`

El resultado final es `20`.

**Asociación de las operaciones**:

```
(((0 + 2) + 4) + 6) + 8

```

---

### Suma con `foldRight`

Con `foldRight`, el cálculo comienza con el valor inicial y avanza de derecha a izquierda. Supongamos que usamos como valor inicial `0`. La operación sería:

```scala
val arr = Array(2, 4, 6, 8)
val result = arr.foldRight(0)(_ + _)

```

1. Valor inicial: `0`
2. Primera operación: `(8 + 0) = 8`
3. Segunda operación: `(6 + 8) = 14`
4. Tercera operación: `(4 + 14) = 18`
5. Cuarta operación: `(2 + 18) = 20`

El resultado final también es `20`.

**Asociación de las operaciones**:

```
2 + (4 + (6 + (8 + 0)))

```

---

### Resta con `foldLeft`

Con `foldLeft`, el cálculo avanza de izquierda a derecha. Supongamos que usamos como valor inicial `0`. La operación sería:

```scala
val arr = Array(2, 4, 6, 8)
val result = arr.foldLeft(0)(_ - _)

```

1. Valor inicial: `0`
2. Primera operación: `(0 - 2) = -2`
3. Segunda operación: `(-2 - 4) = -6`
4. Tercera operación: `(-6 - 6) = -12`
5. Cuarta operación: `(-12 - 8) = -20`

El resultado final es `-20`.

**Asociación de las operaciones**:

```
(((0 - 2) - 4) - 6) - 8

```

---

### Resta con `foldRight`

Con `foldRight`, el cálculo avanza de derecha a izquierda. Supongamos que usamos como valor inicial `0`. La operación sería:

```scala
val arr = Array(2, 4, 6, 8)
val result = arr.foldRight(0)(_ - _)

```

1. Valor inicial: `0`
2. Primera operación: `(8 - 0) = 8`
3. Segunda operación: `(6 - 8) = -2`
4. Tercera operación: `(4 - (-2)) = 6`
5. Cuarta operación: `(2 - 6) = -4`

El resultado final es `-4`.

**Asociación de las operaciones**:

```
2 - (4 - (6 - (8 - 0)))

```

---

### Diferencias clave entre `foldLeft` y `foldRight`

1. **Orden de evaluación**:
    - `foldLeft` evalúa de izquierda a derecha: **(((A op B) op C) op D)**.
    - `foldRight` evalúa de derecha a izquierda: **A op (B op (C op D))**.
2. **Impacto en operaciones no conmutativas**:
    - En operaciones como la suma, el orden no afecta el resultado porque es conmutativa.
    - En operaciones como la resta, el orden cambia el resultado porque no es conmutativa.
3. **Valor inicial**:
    - Tanto `foldLeft` como `foldRight` requieren un valor inicial que sirve como punto de partida para las operaciones.
4. **Eficiencia**:
    - `foldLeft` puede ser más eficiente porque se evalúa de forma estricta (evaluación inmediata).
    - `foldRight` suele ser menos eficiente para colecciones grandes, ya que utiliza recursión y puede provocar desbordamientos de pila.

---

### Resumen

| Operación | Resultado `foldLeft` | Resultado `foldRight` | Asociación `foldLeft` | Asociación `foldRight` |
| --- | --- | --- | --- | --- |
| Suma | 20 | 20 | `(((0 + 2) + 4) + 6) + 8` | `2 + (4 + (6 + (8 + 0)))` |
| Resta | -20 | -4 | `(((0 - 2) - 4) - 6) - 8` | `2 - (4 - (6 - (8 - 0)))` |

# Otros operadores de alto orden

- exists $\exists x P(x)$
- forall $\forall x P(x)$
- zip (empaquetar colecciones paralelas)
- unzip (desempaquetar)
- flatten (aplanar)

```bash
scala> val arr = (1 to 10).toArray
val arr: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> arr exists (x => x%2==0)
val res0: Boolean = true

scala> arr forall (x => x%2==0)
val res1: Boolean = false

scala> arr forall (x => x>0)
val res2: Boolean = true
```

```bash
scala> val mascotas = List("Lucas", "Toby", "Bruno", "Camilo")
val mascotas: List[String] = List(Lucas, Toby, Bruno, Camilo)

scala> val duenios = List("Juan", "Maria", "Pedro", "Camilo")
val duenios: List[String] = List(Juan, Maria, Pedro, Camilo)

scala> mascotas zip duenios
val res3: List[(String, String)] = List((Lucas,Juan), (Toby,Maria), (Bruno,Pedro), (Camilo,Camilo))

scala> duenios zip mascotas
val res4: List[(String, String)] = List((Juan,Lucas), (Maria,Toby), (Pedro,Bruno), (Camilo,Camilo))

scala> val duenios = List("Juan", "Maria", "Pedro", "Camilo", "Sofia")
val duenios: List[String] = List(Juan, Maria, Pedro, Camilo, Sofia)

scala> duenios zip mascotas
val res5: List[(String, String)] = List((Juan,Lucas), (Maria,Toby), (Pedro,Bruno), (Camilo,Camilo))

scala> val s = duenios zip mascotas
val s: List[(String, String)] = List((Juan,Lucas), (Maria,Toby), (Pedro,Bruno), (Camilo,Camilo))

scala> s
val res6: List[(String, String)] = List((Juan,Lucas), (Maria,Toby), (Pedro,Bruno), (Camilo,Camilo))

scala> s.unzip
val res8: (List[String], List[String]) = (List(Juan, Maria, Pedro, Camilo),List(Lucas, Toby, Bruno, Camilo))

scala> duenios zip mascotas zip temp
val res10: List[((String, String), Int)] = List(((Juan,Lucas),10), ((Maria,Toby),20), ((Pedro,Bruno),30), ((Camilo,Camilo),10))

scala> val r = Array(Array(1,2), Array(1,2,3), Array(0))
val r: Array[Array[Int]] = Array(Array(1, 2), Array(1, 2, 3), Array(0))

scala> r.flatten
val res11: Array[Int] = Array(1, 2, 1, 2, 3, 0)
```

# Flatmap

Permite aplicar un mapeo sobre dos colecciones aplicando **producto cartesiano**

```bash
(1 to 5) map (y => l map (x => x*y))
val res12: IndexedSeq[List[Int]] = Vector(List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20), List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40), List(3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60), List(4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80), List(5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100))

scala> ((1 to 5) map (y => l map (x => x*y))).flatten
val res14: IndexedSeq[Int] = Vector(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100)

scala> (1 to 5) flatMap (y => l map (x => x*y))
val res15: IndexedSeq[Int] = Vector(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100)
```

El objetivo de esta función es calcular el **producto cartesiano** entre los números del rango `(1 to 4)` y los elementos de la lista `List(1, 2, 3)`. Esto se hace utilizando las funciones de alto orden `flatMap` y `map`.

Veamos el proceso paso a paso:

1. **Rango `(1 to 4)` y lista `List(1, 2, 3)`**:
    - El rango `(1 to 4)` se itera elemento por elemento. Estos elementos serán los valores de `y`.
    - Para cada valor de `y`, la lista `List(1, 2, 3)` se multiplica por ese valor `y`.
2. **Uso de `flatMap`**:
    - `flatMap` toma cada elemento del rango `(1 to 4)` y lo mapea a una nueva colección. La función que se pasa a `flatMap` realiza este mapeo.
    - En este caso, para cada `y` del rango `(1 to 4)`, se aplica una operación `map` sobre la lista `List(1, 2, 3)`.
3. **Uso de `map`**:
    - `map` toma cada elemento `x` de la lista `List(1, 2, 3)` y lo multiplica por el valor actual de `y`.
    - Esto genera una nueva lista para cada `y`.
4. **Resultado intermedio (listas anidadas)**:
    - Para cada `y`, se genera una lista de resultados. Por ejemplo:
        - Si `y = 1`, el resultado de `List(1, 2, 3).map(x => x * 1)` será `List(1, 2, 3)`.
        - Si `y = 2`, el resultado será `List(2, 4, 6)`.
        - Si `y = 3`, el resultado será `List(3, 6, 9)`.
        - Si `y = 4`, el resultado será `List(4, 8, 12)`.
    
    El conjunto resultante en este punto sería una lista de listas:
    
    ```
    List(List(1, 2, 3), List(2, 4, 6), List(3, 6, 9), List(4, 8, 12))
    
    ```
    
5. **Uso de `flatMap` para aplanar las listas**:
    - `flatMap` aplanará estas listas anidadas en una sola lista continua.
    - En este caso, los elementos de todas las listas generadas se concatenan en una única lista:
    
    ```
    List(1, 2, 3, 2, 4, 6, 3, 6, 9, 4, 8, 12)
    
    ```
    

### Desglose del cálculo

Para cada valor de `y` en el rango `(1 to 4)`, se calcula lo siguiente:

- **Si `y = 1`**:
    
    ```
    List(1, 2, 3).map(x => x * 1) = List(1, 2, 3)
    
    ```
    
- **Si `y = 2`**:
    
    ```
    List(1, 2, 3).map(x => x * 2) = List(2, 4, 6)
    
    ```
    
- **Si `y = 3`**:
    
    ```
    List(1, 2, 3).map(x => x * 3) = List(3, 6, 9)
    
    ```
    
- **Si `y = 4`**:
    
    ```
    List(1, 2, 3).map(x => x * 4) = List(4, 8, 12)
    
    ```
    

### Resultado final

Después de aplanar las listas, el resultado es:

```
List(1, 2, 3, 2, 4, 6, 3, 6, 9, 4, 8, 12)

```

### Conclusión

Esta operación realiza un **producto cartesiano** entre el rango `(1 to 4)` y la lista `List(1, 2, 3)`, multiplicando cada combinación posible de elementos y devolviendo una lista aplanada con todos los resultados.

# Expresiones for

Combinan

- Generadores (productos cartesianos)
- Filter
- Flatmap

El código presentado define dos funciones `generadorParejas` y `generadorParejasFor`, las cuales generan todas las parejas de números `(i, j)` donde `i` y `j` están en un rango, y la suma de ambos números es un número primo. Ambas funciones logran el mismo resultado, pero utilizan enfoques diferentes: una emplea funciones de alto orden (`flatMap`, `map`, `filter`) y la otra usa una **expresión for**. A continuación, se explican los elementos clave y se comparan los enfoques.

### Elementos del código

### 1. **Generadores**

- Un **generador** crea un rango o secuencia de valores que se iteran.
- En `generadorParejas`:
    
    ```scala
    (1 until n) flatMap (j => (j+1 until n) map (i => (i, j)))
    
    ```
    
    - `(1 until n)` genera un rango de números desde `1` hasta `n-1` para `j`.
    - Para cada valor de `j`, `(j+1 until n)` genera un rango de números desde `j+1` hasta `n-1` para `i`.
    - Estas combinaciones se generan como pares `(i, j)`.
- En `generadorParejasFor`:
    
    ```scala
    for {
      j <- (1 until n)
      i <- (j+1 until n)
    }
    yield (i, j)
    
    ```
    
    - `j <- (1 until n)` y `i <- (j+1 until n)` son los **generadores** que iteran sobre los mismos rangos que en el enfoque anterior, pero en una sintaxis más legible.

### 2. **Mapeo**

- El **mapeo** transforma elementos de una colección en otra. Se utiliza para construir los pares `(i, j)`.
- En `generadorParejas`:
    
    ```scala
    (j+1 until n) map (i => (i, j))
    
    ```
    
    - Para cada valor de `j`, se mapea cada valor de `i` a un par `(i, j)`.
- En `generadorParejasFor`, el mapeo está implícito en la construcción del par `(i, j)` dentro del `yield`.

### 3. **FlatMap**

- La función **`flatMap`** aplica un mapeo y luego aplana las colecciones anidadas en una sola colección.
- En `generadorParejas`:
    
    ```scala
    (1 until n) flatMap (j => ...)
    
    ```
    
    - Cada `j` genera una lista de pares `(i, j)` que luego se combinan en una sola lista mediante `flatMap`.
- En `generadorParejasFor`, el aplanamiento es implícito y no es necesario usar `flatMap` directamente.

### 4. **Filtro**

- El **filtro** elimina elementos que no cumplen una condición.
- En `generadorParejas`:
    
    ```scala
    filter (x => esPrimo(x._1 + x._2))
    
    ```
    
    - Después de generar todas las parejas `(i, j)`, se filtran aquellas en las que la suma `i + j` es un número primo.
- En `generadorParejasFor`:
    
    ```scala
    if esPrimo(i + j)
    
    ```
    
    - Se incluye una condición `if` dentro de la expresión for, que filtra las parejas mientras se generan (ahorrando un paso).

---

### Ventajas de las expresiones for

1. **Legibilidad:**
    - Las expresiones for tienen una sintaxis más clara y fácil de leer, especialmente cuando se combinan múltiples generadores, mapeos y filtros.
    - Ejemplo:
    Es más intuitivo que anidar funciones de alto orden como `flatMap`, `map` y `filter`.
        
        ```scala
        for {
          j <- (1 until n)
          i <- (j+1 until n)
          if esPrimo(i + j)
        } yield (i, j)
        
        ```
        
2. **Menor complejidad visual:**
    - En el enfoque `flatMap` + `map` + `filter`, las operaciones anidadas pueden ser difíciles de seguir, especialmente en casos más complejos. La expresión for evita esta complejidad al combinar todas las operaciones en una estructura coherente.
3. **Expresión declarativa:**
    - Las expresiones for permiten expresar el "qué hacer" (generar pares, filtrarlos) en lugar del "cómo hacerlo" (aplanar colecciones, mapear elementos). Esto mejora la claridad del código.
4. **Equivalencia funcional:**
    - Internamente, las expresiones for se traducen a combinaciones de `flatMap`, `map` y `filter`, por lo que no hay pérdida de eficiencia.
5. **Fácil de extender:**
    - Agregar más condiciones o generadores en una expresión for es más sencillo y limpio que anidar más funciones de alto orden.

---

### Conclusión

Ambos enfoques son equivalentes en términos de funcionalidad, pero las **expresiones for** ofrecen una ventaja significativa en términos de **legibilidad**, **mantenimiento** y **claridad**. Para tareas complejas que combinan múltiples operaciones (como generadores, filtros y mapeos), las expresiones for son más fáciles de entender y trabajar. Sin embargo, para operaciones simples, las funciones de alto orden son igual de válidas y pueden ser más compactas.

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

## Resumen

### Aspectos más importantes:

1. **Colecciones en Scala**:
    - **Listas**: Inmutables, recursivas (cabeza y cola), con O(n) para acceso.
    - **Arrays**: Mutables, secuenciales (acceso por índice O(1)).
    - **Conjuntos (Sets)**: Inmutables, no permiten duplicados.
    - **Maps**: Pares clave-valor, claves únicas, ideales para búsquedas rápidas.
    - **Vectores**: Inmutables, acceso rápido O(1), eficientes para operaciones dinámicas.
    - **Tuplas (Tuples)**: Estructuras fijas que agrupan elementos heterogéneos.
2. **Funciones de alto orden**:
    - **Map**: Aplica una función a cada elemento de la colección.
    - **Filter**: Retorna solo los elementos que cumplen una condición.
    - **Reduce**: Reduce una colección a un solo valor aplicando una operación binaria.
    - **Fold**: Similar a `reduce`, pero comienza con un valor inicial y respeta un orden (`foldLeft` o `foldRight`).
3. **Expresiones for**:
    - Son combinaciones declarativas de generadores, filtros y mapeos.
    - Más legibles y fáciles de mantener que anidar funciones como `flatMap` y `filter`.
    - Útiles para operaciones complejas, como generar combinaciones o filtrar resultados.
4. **Operaciones avanzadas**:
    - **Zip y Unzip**: Empaquetar y desempaquetar colecciones paralelas.
    - **Flatten**: Aplanar estructuras anidadas.
    - **FlatMap**: Combina mapeo y aplanamiento, ideal para productos cartesianos.
    - **Rangos**: Inclusivos (`to`) o no inclusivos (`until`), permiten iterar de forma controlada.
5. **Diferencias clave**:
    - Operaciones como `reduceLeft` y `reduceRight` o `foldLeft` y `foldRight` pueden variar en resultados dependiendo del orden de evaluación, especialmente en operaciones no conmutativas como la resta.

---

### Características, ventajas y desventajas:

### Características:

- Scala ofrece estructuras inmutables por defecto, favoreciendo un estilo de programación funcional.
- Las colecciones son versátiles y permiten operaciones avanzadas con funciones de alto orden.
- La sintaxis de expresiones for es clara y se traduce directamente a funciones como `flatMap`, `map` y `filter`.

### Ventajas:

- **Eficiencia**: Operaciones optimizadas para colecciones grandes.
- **Legibilidad**: Expresiones for son más fáciles de entender y trabajar.
- **Flexibilidad**: Amplia variedad de métodos para manipular colecciones.
- **Seguridad**: Las estructuras inmutables reducen errores asociados a cambios inesperados.

### Desventajas:

- **Curva de aprendizaje**: Las funciones de alto orden y conceptos como `reduce` o `fold` pueden ser desafiantes al inicio.
- **Complejidad inicial**: Para principiantes, las expresiones como `flatMap` o `foldRight` pueden parecer abstractas.
- **Sobrecarga mental**: Entender la diferencia entre enfoques como `reduceLeft` y `reduceRight` puede ser confuso.

---

### Mensaje de motivación:

¡No te preocupes si al principio parece complicado! Aprender Scala y sus conceptos funcionales puede sentirse como aprender un idioma completamente nuevo, pero recuerda: cada pequeño paso que das te acerca a dominar herramientas que están transformando el mundo de la tecnología. Las colecciones, las expresiones for y las funciones de alto orden no son solo conceptos teóricos; son las herramientas que usan los ingenieros para resolver problemas reales, desde análisis de datos hasta inteligencia artificial.

Piensa en esto: cada vez que te enfrentas a un desafío, tu cerebro está creciendo, desarrollando nuevas conexiones y habilidades que te harán más fuerte, no solo como programador, sino como pensador crítico. Así que, ¡no te rindas! Este conocimiento es una inversión en tu futuro, en tu capacidad de crear soluciones innovadoras y marcar la diferencia en el mundo tecnológico. ¡Tú puedes hacerlo!

```bash
object Ejercicio {
  def esPrimo(n:Int):Boolean = {
    (2 to Math.ceil(Math.sqrt(n)).toInt) forall (i => n%i != 0)
  }

  def generadorParejas(n:Int):Seq[(Int,Int)] = {
    ((1 until n) flatMap (j => (j+1 until n) map (i => (i,j)))) filter (x => esPrimo(x._1+x._2))
  }

  def generadorParejasFor(n:Int):Seq[(Int,Int)] = {
    for {
      j <- (1 until n)
      i <- (j+1 until n)
      if esPrimo(i+j)
    } yield (i,j)
  }

  def main(arr:Array[String]):Unit = {
    println(esPrimo(97))
    println(esPrimo(111))
    println(esPrimo(121))
    println(generadorParejas(7))
    println(generadorParejasFor(7))
  }
}

```