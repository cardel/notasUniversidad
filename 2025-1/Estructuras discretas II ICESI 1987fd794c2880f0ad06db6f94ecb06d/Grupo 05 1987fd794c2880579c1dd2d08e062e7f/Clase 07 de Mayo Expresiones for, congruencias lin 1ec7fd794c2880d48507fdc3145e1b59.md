# Clase 07 de Mayo: Expresiones for, congruencias lineales

# Material

[Colecciones y Expresiones for.pdf](Academico/2025-1/Estructuras%20discretas%20II%20ICESI%201987fd794c2880f0ad06db6f94ecb06d/Grupo%2005%201987fd794c2880579c1dd2d08e062e7f/Clase%2007%20de%20Mayo%20Expresiones%20for,%20congruencias%20lin%201ec7fd794c2880d48507fdc3145e1b59/Colecciones_y_Expresiones_for.pdf)

```scala
object Ejemplo {

  def generador(n:Int):Seq[(Int,Int)] = {
    for {
      i <- (1 to n)
      j <- (1 to n)
      if ((i+j)%2 == 0)
    } yield (i,j)
  }
  /*
   *Expresión for con múltiples generadores y condiciones
Dadas tres listas List(1, 2), List(3, 4) y List(5, 6), usa una expresión for para generar todas las combinaciones de tres elementos (x, y, z) donde x + y + z > 10.
*/
  def generadorB():Seq[(Int,Int,Int)] = {
    for{
      x <- List(1,2)
      y <- List(3,4)
      z <- List(5,6)
      if x+y+z > 10
    } yield (x,y,z)
  }
/*
 *Dados 3 enteros: x, y, z escriba una expresión for que retorne las listas [i,j, k] en donde se cumple lacondición k= i+ j y tenemos que  

a. 1 ≤ i ≤ x
b. 1 ≤ j ≤ y
c. 1 ≤ k ≤ z
 */
def generadorC(x:Int, y:Int, z:Int):Seq[(Int,Int,Int)] = {
  for {
    i <- (1 to x)
    j <- (1 to y)
    k <- (1 to z)
    if (k == i+j)
  } yield (i,j,k)
}
  def main(arr:Array[String]):Unit = {
    println(generador(20))
    println(generadorB())
    println(generadorC(20,20,20))
  } 

}
```

# Expresiones for

![image.png](Academico/2025-1/Estructuras%20discretas%20II%20ICESI%201987fd794c2880f0ad06db6f94ecb06d/Grupo%2005%201987fd794c2880579c1dd2d08e062e7f/Clase%2007%20de%20Mayo%20Expresiones%20for,%20congruencias%20lin%201ec7fd794c2880d48507fdc3145e1b59/image.png)

**Expresión `for` con múltiples generadores y condiciones**

Dadas tres listas **`List(1, 2)`**, **`List(3, 4)`** y **`List(5, 6)`**, usa una expresión **`for`** para generar todas las combinaciones de tres elementos **`(x, y, z)`** donde **`x + y + z > 10`**.

```jsx
  def generadorB():Seq[(Int,Int,Int)] = {
    for{
      x <- List(1,2)
      y <- List(3,4)
      z <- List(5,6)
      if x+y+z > 10
    } yield (x,y,z)
  }
```

La diferencia principal entre estas dos expresiones radica en cómo se manejan las estructuras de datos y los métodos utilizados para generar las combinaciones.

La primera expresión utiliza la sintaxis de **`for`** en Scala, que es una sintaxis declarativa y funcional. Internamente, utiliza métodos como `flatMap` y `map` para iterar sobre las listas y generar el resultado. Esto tiene una complejidad computacional que depende de las operaciones aplicadas y del tamaño de las listas, pero el enfoque funcional tiende a ser más legible y menos propenso a errores.

Por otro lado, el código que emplea `for` en combinación con **`ArrayList`** parece estar escrito en un estilo más imperativo (posiblemente en Java). Aunque conceptualmente realiza la misma operación, el manejo manual de la estructura de datos y la inserción explícita en una lista de salida puede ser menos eficiente y más propenso a errores. 

```java
Linkedlist<int[]> salida = new Linkedlist<>();
for (int i : Arrays.asList(1, 2)) {
    for (int j : Arrays.asList(3, 4)) {
        for (int k : Arrays.asList(5, 6)) {
            if (i + j + k > 10) {
                salida.add(new int[]{i, j, k});
            }
        }
    }
}

```

### Diferencias en complejidad computacional:

1. **Scala (expresión `for`):** Maneja las operaciones de manera funcional y trabaja con listas inmutables. Aunque el comportamiento es similar, el enfoque funcional puede tener optimizaciones internas que reduzcan la sobrecarga.
2. **Java (imperativo con `ArrayList`):** Realiza las operaciones de manera explícita, con bucles anidados y modificaciones directas en una lista mutable. Esto suele ser más propenso a errores, aunque puede ser más eficiente en algunos casos debido a la mutabilidad de las estructuras de datos.

En términos de complejidad, ambos enfoques tienen una complejidad equivalente de **O(n³)**, ya que iteran sobre tres listas de longitud fija. Sin embargo, el estilo funcional de Scala tiende a ser preferido por su claridad y menor riesgo de errores en comparación con el enfoque imperativo.

## Ejercicio 2 Expresiones for

Dados 3 enteros: x, y, z escriba una expresión for que retorne las listas [i,j, k] en donde se cumple lacondición k= i+ j y tenemos que  

a. 1 ≤ i ≤ x
b. 1 ≤ j ≤ y
c. 1 ≤ k ≤ z

Las **expresiones `for`** en programación funcional en Scala son una forma concisa y expresiva de trabajar con colecciones y realizar operaciones como filtrado, mapeo y combinación de elementos. Estas expresiones están basadas en métodos como `map`, `flatMap` y `filter`. Son declarativas, lo que significa que describen el "qué" se quiere lograr en lugar del "cómo", y son muy útiles para trabajar con datos inmutables.

### Partes de una expresión `for` en Scala:

1. **Generadores**: Son las partes que declaran las colecciones desde las cuales se van a tomar los elementos. Se escriben usando el operador `<-`. Por ejemplo, `x <- List(1, 2, 3)` significa que `x` tomará cada valor de la lista.
2. **Filtros**: Usan la palabra clave `if` para incluir solo aquellos elementos que cumplan con una condición. Por ejemplo, `if x % 2 == 0` seleccionará solo los valores pares.
3. **Cuerpo de la expresión**: Especifica qué se debe hacer con los elementos seleccionados. Normalmente, se utiliza para construir o devolver un nuevo valor.

### Ejemplo en Scala:

```scala
val resultado = for {
  x <- List(1, 2, 3) // Generador: `x` toma valores de la lista
  y <- List(4, 5)    // Generador: `y` toma valores de otra lista
  if x + y > 5       // Filtro: Solo se incluyen pares (x, y) donde x + y > 5
} yield (x, y)       // Cuerpo: Se genera un par (x, y)

println(resultado) // Salida: List((2,4), (2,5), (3,4), (3,5))

```

### Explicación del ejemplo:

1. **Generadores**: `x` toma valores de `List(1, 2, 3)` y `y` toma valores de `List(4, 5)`.
2. **Filtro**: Solo se incluyen combinaciones donde la suma de `x` y `y` es mayor que 5.
3. **Cuerpo**: Usa `yield` para devolver una lista de pares `(x, y)` que cumplen con la condición.

---

### Ejemplo en Haskell:

En Haskell, se pueden usar **list comprehensions**, que son similares a las expresiones `for` de Scala.

```haskell
resultado = [(x, y) | x <- [1, 2, 3], y <- [4, 5], x + y > 5]

main = print resultado -- Salida: [(2,4),(2,5),(3,4),(3,5)]

```

1. `x <- [1, 2, 3]`: Generador que itera sobre los valores de la lista `[1, 2, 3]`.
2. `y <- [4, 5]`: Generador que itera sobre los valores de `[4, 5]`.
3. `x + y > 5`: Filtro que selecciona solo los valores donde la suma es mayor que 5.
4. `(x, y)`: Cuerpo que genera un par `(x, y)`.

---

### Ejemplo en F#:

En F#, las expresiones `for` pueden lograrse utilizando **list comprehensions** o expresiones de secuencia.

```fsharp
let resultado =
    [ for x in [1; 2; 3] do
        for y in [4; 5] do
            if x + y > 5 then
                yield (x, y) ]

printfn "%A" resultado // Salida: [(2, 4); (2, 5); (3, 4); (3, 5)]

```

1. `for x in [1; 2; 3]`: Generador que asigna valores a `x` desde la lista `[1; 2; 3]`.
2. `for y in [4; 5]`: Generador que asigna valores a `y` desde la lista `[4; 5]`.
3. `if x + y > 5`: Filtro para incluir solo combinaciones donde la suma es mayor que 5.
4. `yield (x, y)`: Devuelve los pares `(x, y)` que cumplen con la condición.

---

### Comparación entre lenguajes:

1. **Scala**: Usa `for` con generadores, filtros y `yield`. Es muy expresivo y declarativo.
2. **Haskell**: Usa **list comprehensions**, similares a las de matemáticas, para crear listas de manera declarativa.
3. **F#**: Combina expresiones `for` con `yield` en listas o secuencias, manteniendo un enfoque funcional.

En general, las expresiones `for` y sus equivalentes en otros lenguajes funcionales son herramientas poderosas para iterar, filtrar y transformar datos de manera declarativa y concisa.

# Evaluación perezosa

Tenemos diferentes tipo de evaluación en programación funcional

- Evaluación por valor o ansiosa: calcula el valor de inmediato (val)
- por nombre. Solo cuando se llama (def)
- Perezosa: Se evalua a medida que se requiere LazyList

```jsx
object Ejemplo1 {

  def generador(n:Int):LazyList[Int] = {
    n #:: generador(n+1)
  }

  def main(arr:Array[String]):Unit = {
    val gen = generador(10)
    println(gen)
    println(gen(3))
    println(gen)
    println(gen(10))
    println(gen)
    println(gen(8))
    println(gen)
  }
}
```

### Evaluación perezosa en programación funcional

La evaluación perezosa, también conocida como evaluación diferida, es una técnica en programación funcional donde una expresión no se calcula inmediatamente cuando se encuentra, sino hasta que su valor es realmente necesario. En lugar de ejecutar instrucciones de manera inmediata, el programa construye una estructura que se evalúa solo cuando es requerida.

### Ventajas para la carga de datos grandes

1. **Eficiencia en el uso de recursos**: Con la evaluación perezosa, no es necesario cargar o calcular todos los datos de forma inmediata. Esto permite que programas que manejan grandes volúmenes de datos puedan procesar solo las partes necesarias, reduciendo significativamente el uso de memoria y CPU.
2. **Trabajo con flujos infinitos**: La evaluación perezosa permite trabajar con estructuras de datos infinitas o muy grandes, ya que solo se evalúan los elementos que se necesitan en un momento dado.
3. **Reducción de cálculos innecesarios**: Las operaciones costosas se ejecutan únicamente si son estrictamente necesarias, lo que evita realizar cálculos redundantes.

### Ejemplo en TensorFlow

En TensorFlow, un marco popular para el aprendizaje automático, la evaluación perezosa es utilizada ampliamente. En este marco, las operaciones no se ejecutan inmediatamente cuando se definen, sino que se construye un grafo computacional que se evalúa únicamente cuando se le solicita mediante una sesión.

```python
import tensorflow as tf

# Definimos dos tensores y una operación (nada se ejecuta aquí)
a = tf.constant(5)
b = tf.constant(6)
c = tf.multiply(a, b)

# La operación no se ejecuta hasta que llamemos explícitamente a una sesión
print(c)  # Muestra solo la definición del tensor y no el resultado

with tf.Session() as sess:
    result = sess.run(c)  # Aquí se evalúa realmente
    print(result)  # Salida: 30

```

En este caso, TensorFlow utiliza la evaluación perezosa para optimizar las operaciones, construyendo el grafo y ejecutándolo solo cuando es necesario.

### Importancia en el manejo de datos grandes

En el manejo de datos grandes, como en sistemas de análisis de datos o aprendizaje automático, la evaluación perezosa tiene un rol crucial:

1. **Carga progresiva de datos**: En lugar de cargar toda la base de datos o todos los elementos de un archivo masivo de inmediato, se pueden procesar los datos en pequeños fragmentos a medida que se necesitan. Por ejemplo, al leer archivos CSV con librerías como `pandas` en Python, la evaluación perezosa puede ayudar a manejar archivos que no caben completamente en memoria.
2. **Optimización de recursos**: Cuando se trabaja con grandes conjuntos de datos, el procesamiento inmediato de todas las operaciones puede ser inviable. La evaluación perezosa permite optimizar el uso de recursos al realizar solo los cálculos necesarios.

### Ejemplo con un flujo perezoso en Python

```python
def generador_infinito(n):
    while True:
        yield n
        n += 1

# Creamos un generador infinito
gen = generador_infinito(10)

# Accedemos solo a los primeros números
print(next(gen))  # Salida: 10
print(next(gen))  # Salida: 11
print(next(gen))  # Salida: 12

```

Aquí, el generador utiliza evaluación perezosa para producir números uno a la vez, en lugar de generar toda la secuencia de forma anticipada.

### Conclusión

La evaluación perezosa es esencial en programación funcional y en bibliotecas que manejan grandes volúmenes de datos, como TensorFlow o PyTorch. Su capacidad para diferir cálculos hasta que son necesarios permite optimizar recursos, manejar datos grandes de manera eficiente y trabajar con estructuras de datos infinitas o muy grandes. Es una herramienta poderosa para mejorar el rendimiento y la escalabilidad de los sistemas modernos.

# Teorema de Bezout

El teorema de Bezout establece que, dados dos enteros a y b, si d es el máximo común divisor (mcd) de a y b, entonces existen dos enteros s y t tales que:

mcd(a, b) = s * a + t * b

### Ejemplo:

Sean a = 56 y b = 15. El mcd(56, 15) es 1. Según el teorema de Bezout, existen enteros s y t que satisfacen:

1 = s * 56 + t * 15

Resolviendo, encontramos que s = -4 y t = 15, por lo que:

1 = (-4) * 56 + 15 * 15

# Calculo del inverso a mod m

1. mcd(a,m) = 1 significa que son primos relativos
2. expresamos mcd(a,m) = 1 = s*a + t*m donde s es el inverso, teorema de bezout
3. comprobamos que s = a' donde a*a' ≡ 1 (mod m)

# Resolución de sistemas congruente

ax ≡ b (mod m)

a , b y m valores constantes, x es el valor a encontrar

## Pasos

La congruencia lineal ax ≡ b (mod m) se puede resolver fácilmente siguiendo estos pasos:

1. Mediante el algoritmo de Euclides, se halla el inverso a' tal que
aa' ≡ 1 (mod m) cumpliendo mcd(a,m) = 1
2. Se multiplica la congruencia anterior por b en ambos lados, obteniendo
aa'b ≡ b (mod m)

donde x = a'b es una solución a la congruencia lineal.

1. Para cualquier entero k, x = a'b + mk es una solución a la congruencia lineal.

### Ejemplo de resolución de una congruencia lineal

Resolvamos la congruencia lineal 3x ≡ 7 (mod 10) siguiendo los pasos mencionados:

a = 3, b = 7, m = 10

1. **Mediante el algoritmo de Euclides, hallamos el inverso de 3 módulo 10 (a'):**
    - Sabemos que mcd(3, 10) = 1, por lo que el inverso de 3 módulo 10 existe.
    - Usamos el teorema de Bezout para encontrar enteros s y t tales que 3s + 10t = 1.
    - Resolviendo, obtenemos s = 7, por lo que el inverso de 3 módulo 10 es a' = 7.
2. Verificamos:
    - a × a' ≡ 1 (mod 10)
    - 3 × 7 ≡ 1 (mod 10)
    - 21 ≡ 1 (mod 10)
3. Multiplicamos ambos lados por b = 7
- 3 × 7 × 7 ≡ 7 (mod 10)
- x = 49
1. Fórmula general: x = a'b + mk
- x = 49 + 10k k pertenece a los enteros
1. Verificamos la congruencia:
- k = 0 → 3 × 49 ≡ 7 (mod 10), pues 147 ≡ 7 (mod 10)
- k = 1 → 3 × 59 ≡ 7 (mod 10), pues 157 ≡ 7 (mod 10)

# Resumen para Estudiantes Desmotivados

Sabemos que estás cansado, quizás aburrido, y puede que incluso hayas perdido algo de fe en lo que estás aprendiendo. Pero aquí hay un resumen rápido y directo de los aspectos más importantes de este documento. ¡Quizás encuentres algo interesante (o útil para aprobar)!

---

## 1. **Expresiones `for` en Programación Funcional**

- **Qué son**: Una forma poderosa y elegante de generar combinaciones, filtrar datos y procesar listas.
- **Características**:
    - Usa generadores (`<-`) para iterar.
    - Usa filtros (`if`) para incluir solo lo que importa.
    - Produce resultados claros con `yield`.
- **Ventajas**: Más legible, menos errores, muy funcional.
- **Desventajas**: Puede parecer complicado al inicio.

**Ejemplo práctico**: Generar combinaciones de números donde su suma sea mayor a 10. Ideal para resolver problemas complejos de forma ordenada.

---

## 2. **Evaluación Perezosa**

- **Qué es**: Solo calcula datos cuando realmente los necesitas.
- **Ventajas**:
    - Ahorra memoria y recursos.
    - Funciona con datos infinitos sin problemas.
    - Evita cálculos innecesarios.
- **Ejemplo real**: Leer y procesar solo los datos necesarios de un archivo gigante, en lugar de cargarlo todo.
- **Desventajas**: Puede ser difícil de entender al principio, pero promete ser útil si trabajas con grandes volúmenes de datos.

---

## 3. **Teorema de Bezout**

- **Qué dice**: Puedes encontrar dos números que combinados con operaciones básicas te dan el MCD (máximo común divisor) de dos enteros.
- **Por qué importa**: Es la base para resolver ecuaciones importantes en teoría de números.
- **Desventajas**: Parece abstracto, pero es útil en problemas matemáticos reales, como encontrar inversos modulares.

---

## 4. **Congruencias Lineales**

- **Problema**: Resolver ecuaciones del tipo `ax ≡ b (mod m)`.
- **Pasos**:
    - Encuentra el inverso modular con el Teorema de Bezout.
    - Multiplica y encuentra soluciones.
- **Ejemplo práctico**: Resolver `3x ≡ 7 (mod 10)` y obtener soluciones claras.
- **Ventajas**:
    - Esencial para criptografía y sistemas numéricos.
    - Se puede aplicar a problemas reales de programación.
- **Desventajas**: Requiere paciencia para entender.

---

### **Mensaje Final**

Sabemos que puede parecer mucha información, pero lo importante es que estas herramientas no solo son matemáticas abstractas; tienen aplicaciones reales. Desde optimizar programas hasta resolver problemas complejos, lo que estás aprendiendo aquí puede ser mucho más útil de lo que parece. ¿Quién sabe? Tal vez te sorprendas. ¡Ánimo, que ya estás más cerca de dominarlo!

[2025-05-07-Note-18-00_annotated.pdf](2025-05-07-Note-18-00_annotated.pdf)