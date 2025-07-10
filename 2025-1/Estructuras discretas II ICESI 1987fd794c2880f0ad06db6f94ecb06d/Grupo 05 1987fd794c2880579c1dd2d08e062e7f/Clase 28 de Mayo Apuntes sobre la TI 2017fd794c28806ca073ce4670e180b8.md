# Clase 28 de Mayo: Apuntes sobre la TI

# Algoritmo de Checksum

1. Transformar los valores de cadenas de caracteres a su representación ASCII https://es.wikipedia.org/wiki/ASCII
2. Se debe normalizar el tamaño de las cadenas a 8 bits siempre, porque los ceros a la izquierda se suelen ignorar pero en el algoritmo se **necesitan**
3. Tener en cuenta las operaciones bit a bit

Ejemplos de operaciones bit a bit en Scala:

```scala
val a = 12 // 1100 en binario
val b = 5  // 0101 en binario

// AND bit a bit
val andResult = a & b // 0100 -> 4

// OR bit a bit
val orResult = a | b // 1101 -> 13

// XOR bit a bit
val xorResult = a ^ b // 1001 -> 9

// Desplazamiento a la izquierda
val leftShift = a << 2 // 110000 -> 48

// Desplazamiento a la derecha
val rightShift = a >> 2 // 0011 -> 3

```

## Ejemplo de transformación

```scala
scala> val x = "Hoy hay paro"
val x: String = Hoy hay paro

scala> x(0)
val res10: Char = H

scala> val l = x.map(x => x.toBinaryString)
val l: IndexedSeq[String] = ArraySeq(1001000, 1101111, 1111001, 100000, 1101000, 1100001, 1111001, 100000, 1110000, 1100001, 1110010, 1101111)
```

```scala
// Ejemplo de combinar dos números binarios de 16 bits en una cadena de 32 bits

val a = 0b1010101010101010 // Número binario de 16 bits
val b = 0b1111000011110000 // Otro número binario de 16 bits

// Operación para combinar los dos números en una cadena de 32 bits
val combined = (b << 16) | a

// Mostrar los resultados en binario y decimal
println(f"a: ${a.toBinaryString}%16s (binario), $a (decimal)")
println(f"b: ${b.toBinaryString}%16s (binario), $b (decimal)")
println(f"Resultado combinado: ${combined.toBinaryString}%32s (binario), $combined (decimal)")

```

### Explicación:

1. `b << 16`: Desplaza los 16 bits de `b` hacia la izquierda, dejando espacio para los 16 bits de `a`.
2. `(b << 16) | a`: Combina los bits de `b` (ya desplazados) con los bits de `a` usando la operación OR bit a bit.
3. El resultado es una cadena binaria de 32 bits que contiene los bits de `b` seguidos por los bits de `a`.

### Salida esperada:

```
a:   1010101010101010 (binario), 43690 (decimal)
b:   1111000011110000 (binario), 61680 (decimal)
Resultado combinado: 11110000111100001010101010101010 (binario), 4042322162 (decimal)

```

[2025-05-28-Note-16-39_annotated.pdf](2025-05-28-Note-16-39_annotated.pdf)

# Anotaciones sobre el algoritmo de Huffman

1. Usar patrón de diseño dentro de la carpeta del paquete src/main/scala https://refactoring.guru/es/design-patterns
2. Usar receta de TAD
    1. Currificación
    2. Sobreescribir toString
    3. Seguir las pautas vistas en clase con respecto a estructuración de archivos
3. Tener en cuenta la estructura para codificar y decodificar

[2025-05-28-Note-16-57_annotated.pdf](2025-05-28-Note-16-57_annotated.pdf)