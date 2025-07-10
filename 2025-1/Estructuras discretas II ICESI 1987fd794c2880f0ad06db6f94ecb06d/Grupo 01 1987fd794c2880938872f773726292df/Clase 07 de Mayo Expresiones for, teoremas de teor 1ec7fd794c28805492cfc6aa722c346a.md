# Clase 07 de Mayo: Expresiones for, teoremas de teoria de números

# Recursos

[Colecciones y Expresiones for.pdf](Academico/Universidad/2025-1/Estructuras%20discretas%20II%20ICESI%201987fd794c2880f0ad06db6f94ecb06d/Grupo%2001%201987fd794c2880938872f773726292df/Clase%2007%20de%20Mayo%20Expresiones%20for,%20teoremas%20de%20teor%201ec7fd794c28805492cfc6aa722c346a/Colecciones_y_Expresiones_for.pdf)

# Expresiones for

![image.png](Academico/Universidad/2025-1/Estructuras%20discretas%20II%20ICESI%201987fd794c2880f0ad06db6f94ecb06d/Grupo%2001%201987fd794c2880938872f773726292df/Clase%2007%20de%20Mayo%20Expresiones%20for,%20teoremas%20de%20teor%201ec7fd794c28805492cfc6aa722c346a/image.png)

![image.png](Academico/Universidad/2025-1/Estructuras%20discretas%20II%20ICESI%201987fd794c2880f0ad06db6f94ecb06d/Grupo%2001%201987fd794c2880938872f773726292df/Clase%2007%20de%20Mayo%20Expresiones%20for,%20teoremas%20de%20teor%201ec7fd794c28805492cfc6aa722c346a/image%201.png)

```scala
object Ejemplo {
  
  def generador(n:Int, f:Int=>Boolean):Seq[Any] ={
    for {
      i <- (1 to n)
      if f(i)
      j <- (i to n)
    } yield (i,j)
  }
/*
 * 1. Lista de números entre 1 y 100 (inclusive) que sean divisibles por 8
*/
  def generadorProblema1():Seq[Int] ={
    for {
      i <- (1 to 100)
      if i%8 == 0
    } yield i
  }
/*
2. Lista de números entre 1 y 100 que tengan un 4
*/
  def generadorProblema2():Seq[Int] ={
    for {
      i <- (1 to 100)
      if i.toString.contains('4')
    } yield i
  }

/*
3. Lista de parejas (i,j) en donde i es par y j es impar, i y j entre 1 y 100
*/
  def generadorProblema3():Seq[(Int,Int)] = {
    for{
    i <- (1 to 100)
    j <- (1 to 100)
    if (i%2 == 0 && j%2 != 0)
  } yield (i,j)
}
  def main(arr:Array[String]):Unit = {
    println(generador(10, x => x%2 == 0))
    println(generadorProblema1())
    println(generadorProblema2())
    println(generadorProblema3())
  }
}
```

## Explicación de las expresiones for en Scala

Las **expresiones for** en Scala son una herramienta poderosa para trabajar con colecciones de datos de forma funcional. Estas expresiones permiten generar nuevas colecciones aplicando reglas específicas, y están compuestas por tres elementos principales: el **generador**, el **filtro** y el uso de **flatMap** implícito.

### 1. Generador

El **generador** se utiliza para iterar sobre una colección. Por ejemplo, `i <- (1 to 10)` genera valores del 1 al 10.

### 2. Filtro

El **filtro** permite incluir condiciones para seleccionar únicamente los elementos que cumplen con ciertos criterios. Por ejemplo, `if i % 2 == 0` selecciona solo los números pares.

### 3. FlatMap implícito

Scala convierte internamente las expresiones for en llamadas a métodos como `map`, `flatMap` y `filter`. Esto significa que las expresiones for son equivalentes a combinaciones de estos métodos y mantienen el enfoque funcional del lenguaje.

### Ejemplo práctico: Encuentra números mágicos

Imagina que queremos encontrar todos los números entre 1 y 50 que sean divisibles entre 3 y cuyo dígito contenga un "5". Vamos a usar una expresión for para lograrlo:

```scala
object EjemploPractico {
  def numerosMagicos(): Seq[Int] = {
    for {
      num <- 1 to 50                // Generador: Itera del 1 al 50
      if num % 3 == 0              // Filtro: Solo divisibles entre 3
      if num.toString.contains('5') // Filtro: Contienen el dígito '5'
    } yield num                     // Produce una nueva colección con los números que cumplen las condiciones
  }

  def main(args: Array[String]): Unit = {
    println("Números mágicos encontrados:")
    println(numerosMagicos()) // Muestra los resultados
  }
}

```

### ¿Por qué es interesante este ejemplo?

1. **Es visual y sencillo**: Los estudiantes pueden ver cómo se generan y filtran los números.
2. **Es interactivo**: Pueden modificar las condiciones para experimentar con diferentes resultados.
3. **Aplicación funcional**: Introduce conceptos de filtrado y transformación de datos usando programación funcional.

¡Anímate a probar este código en tu celular o computadora y descubre cuántos números mágicos puedes encontrar! Scala es un lenguaje moderno y funcional que te permite trabajar con colecciones de forma concisa y expresiva.

# Evaluación perezosa

Mecanismo para generar valores hasta el punto que se requiere

- Evaluación por nombre: Se calcula cuando se invoca (def)
- Evaluación por valor o ansiosa: Se calcula de inmediato
- Evaluación perezosa: Se calcula hasta cuando es necesario

```scala
object Ejemplo2 {
  def generador(n:Int):LazyList[Int] = {
    if (n%2 == 0) n #:: generador(n+1)
    else generador(n+1)
  }

  def main(arr:Array[String]):Unit = {
    val gen = generador(100)
    println(gen)
    println(gen(3)) //Obtener el cuarto elemento
    println(gen)
    val k = gen(10)
    println(gen)
    val kacito = gen(2)
    println(gen)
  }
}
```

La **evaluación perezosa** en programación funcional, y en particular en Scala, es una estrategia en la cual los valores o expresiones no se calculan hasta que son realmente necesarios. Esto permite optimizar el uso de los recursos del sistema, como la memoria y el tiempo de ejecución, al evitar cálculos innecesarios.

### Colecciones en Scala para evaluación perezosa

Scala proporciona ciertas colecciones diseñadas específicamente para soportar evaluación perezosa:

1. **LazyList** (anteriormente llamada `Stream`): Es una colección que genera sus elementos bajo demanda. Los elementos son calculados solo cuando se accede a ellos, y los resultados se almacenan en caché para que no tengan que ser recalculados.
    
    ```scala
    val numeros = LazyList.from(1) // Genera una lista infinita de números empezando desde 1
    println(numeros.take(10).toList) // Toma los primeros 10 números: List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    
    ```
    
2. **View**: Permite realizar operaciones sobre colecciones de manera perezosa sin crear estructuras intermedias. Es útil para trabajar con operaciones encadenadas sobre colecciones grandes.
    
    ```scala
    val lista = (1 to 1000000).view
    val resultado = lista.map(_ * 2).filter(_ % 3 == 0).take(5)
    println(resultado.toList) // Resultado: List(6, 12, 18, 24, 30)
    
    ```
    

### Aplicación práctica: Evitar Stack Overflow al cargar grandes cantidades de datos

Un uso práctico de la evaluación perezosa es trabajar con flujos de datos muy grandes o incluso infinitos sin consumir demasiada memoria. Por ejemplo, si necesitas procesar una cantidad masiva de datos (como registros en un archivo o base de datos), puedes usar una colección perezosa para evitar cargar todos los datos en memoria al mismo tiempo.

### Ejemplo en Scala

Imaginemos que queremos leer un archivo de registros muy grande y procesarlo línea por línea:

```scala
import scala.io.Source

object ProcesarArchivo {
  def procesarLineas(archivo: String): LazyList[String] = {
    // Usamos LazyList para leer líneas de forma perezosa
    val fuente = Source.fromFile(archivo)
    def lineas(stream: Iterator[String]): LazyList[String] = {
      if (stream.hasNext) stream.next() #:: lineas(stream)
      else LazyList.empty
    }
    lineas(fuente.getLines())
  }

  def main(args: Array[String]): Unit = {
    val archivo = "datos_grandes.txt" // Archivo con millones de líneas
    val lineas = procesarLineas(archivo)

    // Procesamos solo las primeras 10 líneas
    lineas.take(10).foreach(println)

    // Cerramos la fuente de datos
    Source.fromFile(archivo).close()
  }
}

```

### ¿Por qué evita el Stack Overflow?

1. **Carga bajo demanda**: Solo se cargan y procesan las líneas necesarias, en lugar de cargar el archivo completo en memoria.
2. **Eficiencia**: Al utilizar `LazyList`, la memoria se libera automáticamente para las líneas que ya no se necesitan.
3. **Escalabilidad**: Permite trabajar con archivos o datos de tamaño prácticamente ilimitado sin desbordar la pila.

Este enfoque es ideal para manejar grandes volúmenes de datos en aplicaciones que requieren eficiencia y rendimiento óptimo.

# Aritmetica modular

## Teorema de Bezout

El teorema de Bézout establece que, dado dos números enteros a y b, existen dos enteros s y t tales que:

mcd(a, b) = a * s + b * t

Esto significa que el máximo común divisor (mcd) de a y b puede expresarse como una combinación lineal de a y b.

Ejemplo con mcd(123, 981):

Primero, usamos el algoritmo de Euclides para encontrar el mcd(123, 981):

981 = 7 * 123 + 90

123 = 1 * 90 + 33

90 = 2 * 33 + 24

33 = 1 * 24 + 9

24 = 2 * 9 + 6

9 = 1 * 6 + 3

6 = 2 * 3 + 0

Por lo tanto, mcd(123, 981) = 3.

Ahora, retrocedemos para encontrar los valores de s y t:

3 = 9 - 1 * 6

6 = 24 - 2 * 9

Sustituimos:

3 = 9 - 1 * (24 - 2 * 9)

3 = 3 * 9 - 1 * 24

Sustituimos 9 y seguimos:

9 = 33 - 1 * 24

3 = 3 * (33 - 1 * 24) - 1 * 24

3 = 3 * 33 - 4 * 24

Sustituimos 24:

24 = 90 - 2 * 33

3 = 3 * 33 - 4 * (90 - 2 * 33)

3 = 11 * 33 - 4 * 90

Sustituimos 33:

33 = 123 - 90

3 = 11 * (123 - 90) - 4 * 90

3 = 11 * 123 - 15 * 90

Sustituimos 90:

90 = 981 - 7 * 123

3 = 11 * 123 - 15 * (981 - 7 * 123)

3 = 11 * 123 - 15 * 981 + 105 * 123

3 = 116 * 123 - 15 * 981

Por lo tanto, los valores son s = 116 y t = -15, y la ecuación queda:

mcd(123, 981) = 123 * 116 + 981 * (-15)

# Congruencia lineal

1. Congruencia lineal $ax \equiv b \texttt{ mod } m$
2. Primo relativo mcd(a,b) = 1

Para encontrar el inverso tenemos a mod (m) = a’  → a*a’ congrente 1 mod m

La congruencia lineal ax ≡ b (mod m) se puede resolver fácilmente siguiendo estos pasos:

1. Mediante el algoritmo de Euclides, se halla el inverso multiplicativo de a, denotado como a', tal que:
aa' ≡ 1 (mod m)
2. Se multiplica la congruencia por b a ambos lados para obtener:
aa'b ≡ b (mod m)
donde x = a'b es una solución a la congruencia lineal.
3. La solución general tiene la forma x = a'b + mk, donde k es cualquier entero.

### Ejemplo práctico: Resolver la congruencia 3x ≡ 4 mod 7

Vamos a resolver la congruencia lineal 3x ≡ 4 mod 7 siguiendo los pasos descritos.

---

### Paso 1: Verificar que 3 y 7 son primos relativos (mcd = 1)

Utilizamos el algoritmo de Euclides para verificar que el máximo común divisor (mcd) entre 3 y 7 es 1:

7 = 2 * 3 + 1

3 = 3 * 1 + 0

El mcd(3, 7) = 1, por lo que son primos relativos y la congruencia tiene solución.

---

### Paso 2: Encontrar el inverso multiplicativo de 3 mod 7

Buscamos un número a' tal que:

3 * a' ≡ 1 mod 7

Usamos el algoritmo extendido de Euclides para expresar 1 como una combinación lineal de 3 y 7:

7 = 2 * 3 + 1

1 = 7 - 2 * 3

Por lo tanto:

1 ≡ -2 * 3 mod 7

El inverso multiplicativo de 3 mod 7 es a' = -2. Como trabajamos en aritmética modular, convertimos -2 a su equivalente positivo en mod 7:

a' ≡ 5 mod 7

Por lo tanto, el inverso multiplicativo de 3 mod 7 es 5.

---

### Paso 3: Multiplicar ambos lados de la congruencia por el inverso

Multiplicamos ambos lados de la congruencia original (3x ≡ 4 mod 7) por el inverso multiplicativo de 3, que es 5:

5 * 3x ≡ 5 * 4 mod 7

Esto simplifica a:

15x ≡ 20 mod 7

---

### Paso 4: Simplificar la congruencia

Reducimos 15 mod 7 y 20 mod 7:

15 mod 7 = 1

20 mod 7 = 6

Por lo tanto, la congruencia se reduce a:

x ≡ 6 mod 7

---

### Paso 5: Escribir la solución general

La solución general de la congruencia es:

x = 6 + 7k, donde k es cualquier número entero.

---

### Respuesta final:

La solución de la congruencia 3x ≡ 4 mod 7 es x ≡ 6 mod 7 o, de forma general, x = 6 + 7k, para cualquier entero k.

### Resumen para estudiantes desmotivados

### Aspectos más importantes:

1. **Expresiones for en Scala**:
    - Una herramienta útil para trabajar con colecciones de forma sencilla.
    - Permite generar listas basadas en condiciones específicas.
    - **Ejemplo clave**: Encuentra números mágicos (divisibles entre 3 y que contengan un "5").
2. **Evaluación perezosa**:
    - No se calcula nada hasta que sea estrictamente necesario.
    - Optimiza el uso de memoria y recursos.
    - **Aplicación práctica**: Procesa grandes volúmenes de datos sin sobrecargar la memoria.
3. **Aritmética modular**:
    - Resuelve problemas matemáticos como máximos comunes divisores y ecuaciones congruentes.
    - **Ejemplo clave**: Resolver la congruencia 3x ≡ 4 mod 7.

---

### Características:

- **Scala** es un lenguaje poderoso y funcional.
- **Lógica matemática práctica**: Aplicable incluso en problemas cotidianos.
- **Código reutilizable**: Los ejemplos dados pueden ser adaptados a múltiples escenarios.

---

### Ventajas:

- **Facilidad de aprendizaje**: Los ejemplos son visuales y directos.
- **Eficiencia**: Métodos como la evaluación perezosa ahorran tiempo y recursos.
- **Aplicabilidad**: La matemática modular y las expresiones for tienen usos prácticos en programación y resolución de problemas.

---

### Desventajas:

- **Requiere atención**: Si te distraes, podrías perderte en los conceptos.
- **Matemáticas involucradas**: Si no eres fan de los números, puede parecer intimidante.
- **Paciencia necesaria**: Los resultados no siempre son inmediatos, especialmente con cálculos grandes.

---

### Reflexión para estudiantes aburridos:

Aunque ahora todo parezca inútil, piensa en esto como una herramienta para entender problemas de manera más simple y eficiente. Quizás no creas en nada hoy, pero estas habilidades podrían abrirte puertas en aplicaciones prácticas, desde videojuegos hasta análisis de datos. Dale una oportunidad, porque incluso los conceptos más aburridos pueden ser útiles algún día. ¡Ánimo, el esfuerzo vale la pena!