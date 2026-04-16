# Evaluación perezosa

La **evaluación perezosa** (lazy evaluation) es una técnica que permite obtener valores solo cuando son necesarios (a demanda). Esto nos permite trabajar con secuencias potencialmente infinitas sin problemas de rendimiento o memoria. En Scala, la colección principal para evaluación perezosa es `LazyList`.

```scala
// Definición de una función que genera un rango de enteros de forma perezosa
def rangoPerezoso(min: Int, max: Int): LazyList[Int] = {
  if (min > max) LazyList.empty  // Caso base: rango vacío
  else min #:: rangoPerezoso(min + 1, max)  // Construcción perezosa: min seguido del resto del rango
}

// Creación de una LazyList para el rango 1000 a 10000
val x = rangoPerezoso(1000, 10000)
// x: LazyList[Int] = LazyList(<not computed>)  // Aún no se ha calculado nada

// Acceso al elemento en posición 1 (segundo elemento)
x(1)
// res13: Int = 1001  // Solo se calculan los elementos necesarios

// Estado actual de x: los primeros dos elementos ya están calculados
x
// res14: LazyList[Int] = LazyList(1000, 1001, <not computed>)

// Acceso al elemento en posición 4 (quinto elemento)
x(4)
// res15: Int = 1004

// Estado actual: ahora tenemos los primeros 5 elementos calculados
x
// res16: LazyList[Int] = LazyList(1000, 1001, 1002, 1003, 1004, <not computed>)
```

## Variables perezosas

También podemos tener **variables perezosas** usando `lazy val`, que solo se calculan cuando se acceden por primera vez.

```scala
// Bloque que demuestra la diferencia entre val, lazy val y el orden de evaluación
{
  val x = { println("soy x"); 10 }      // Se evalúa inmediatamente
  lazy val y = { println("soy y"); 20 } // No se evalúa hasta que se use
  val z = { println("soy z"); 30 }      // Se evalúa inmediatamente
}
// Salida: soy x
//         soy z
// Nota: 'y' no se imprime porque nunca se usa

// Bloque donde sí se usa 'y'
{
  val x = { println("soy x"); 10 }
  lazy val y = { println("soy y"); 20 }
  val z = { println("soy z"); 30 }
  x + y + z  // Aquí 'y' se evalúa porque se usa en la suma
}
// Salida: soy x
//         soy z
//         soy y  // 'y' se evalúa solo cuando se necesita
// res20: Int = 60
```

Observese que `y` solo se calcula cuando es utilizada.

## Secuencias infinitas

`LazyList` permite trabajar con colecciones que son infinitas, como un generador de números naturales.

```scala
// Generador infinito de números naturales a partir de 'n'
def generador(n: Int = 0): LazyList[Int] = {
  n #:: generador(n + 1)  // Construcción infinita perezosa
}

val x = generador()  // Creación de la secuencia infinita
// x: LazyList[Int] = LazyList(<not computed>)

x(3)  // Acceso al cuarto elemento (índice 3)
// res22: Int = 3

x  // Estado después de acceder a algunos elementos
// res23: LazyList[Int] = LazyList(0, 1, 2, 3, <not computed>)
```

## Aplicación: Criba de Eratóstenes

Un caso clásico es la implementación de la **criba de Eratóstenes** para generar números primos de forma perezosa.

```scala
// Definición de la criba de Eratóstenes (función criba asumida previamente)
// Nota: La función criba no está definida en el código original, pero se asume que filtra números primos

def generador(n: Int = 0): LazyList[Int] = {
  n #:: generador(n + 1)
}

val y = criba(generador(2))  // Aplicar criba a números desde 2 en adelante
// y: LazyList[Int] = LazyList(<not computed>)

y(1)  // Segundo número primo
// res34: Int = 3

y(1300)  // Número primo en la posición 1301
// res35: Int = 10663

y  // Estado actual: muchos primos ya calculados
// res36: LazyList[Int] = LazyList(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883,...
```

## Limitaciones

Al pedir un número de índice muy grande, puede fallar por profundidad de recursión o por la cantidad de filtros sucesivos que debe aplicar.

```scala
// Error típico al acceder a un índice muy grande en una LazyList con muchos filtros anidados
  at scala.collection.immutable.LazyList$.$anonfun$filterImpl$1(LazyList.scala:339)
  at scala.collection.immutable.LazyList.initState(LazyList.scala:318)
  at scala.collection.immutable.LazyList.scala$collection$immutable$LazyList$$evaluated(LazyList.scala:331)
  at scala.collection.immutable.LazyList$.$anonfun$filterImpl$1(LazyList.scala:339)
  at scala.collection.immutable.LazyList.initState(LazyList.scala:318)
```

Son demasiados filtros que debe aplicar de forma sucesiva, lo que puede causar desbordamiento de pila (stack overflow) en implementaciones recursivas profundas.

---

## Tabla de resumen

Concepto | Descripción | Observaciones
--- | --- | ---
Evaluación perezosa | Técnica que retrasa el cálculo de valores hasta que son necesarios. | Mejora eficiencia al evitar cálculos innecesarios.
`LazyList` | Colección en Scala que implementa evaluación perezosa para secuencias. | Reemplazó a `Stream` en versiones recientes de Scala.
`#::` | Operador para construir `LazyList` de forma perezosa. | Similar a `::` para `List`, pero con evaluación diferida.
`<not computed>` | Indicador en `toString` de que elementos aún no se han evaluado. | Muestra el estado perezoso de la colección.
`lazy val` | Variable que se calcula solo en su primer acceso. | Útil para valores costosos que podrían no usarse.
Secuencias infinitas | Estructuras de datos que representan series sin fin. | Posibles gracias a la evaluación perezosa.
Criba de Eratóstenes | Algoritmo para generar números primos. | Ejemplo clásico de uso de pereza para algoritmos infinitos.
Limitaciones | Profundidad de recursión y rendimiento con muchos filtros. | Acceder a índices muy grandes puede causar stack overflow.

---

## Comentarios adicionales

- La evaluación perezosa es fundamental para la **programación funcional** y permite patrones como **generadores infinitos** y **procesamiento de flujos de datos**.
- `LazyList` **memoriza** (cachea) los valores una vez calculados, por lo que accesos posteriores al mismo elemento son inmediatos.
- La diferencia clave entre `LazyList` y `Iterator` es que `LazyList` es persistente (puede ser recorrida múltiples veces) mientras que `Iterator` es consumible (solo se recorre una vez).
- En algoritmos como la criba de Eratóstenes, la evaluación perezosa permite implementaciones elegantes que serían imposibles con colecciones estrictas debido a la infinitud de la secuencia.
- Para evitar desbordamientos de pila en implementaciones recursivas profundas, considere usar **trampolines** o enfoques iterativos cuando trabaje con índices muy grandes.