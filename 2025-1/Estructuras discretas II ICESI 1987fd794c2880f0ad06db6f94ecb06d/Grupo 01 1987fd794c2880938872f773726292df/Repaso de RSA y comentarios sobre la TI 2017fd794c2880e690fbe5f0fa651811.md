# Repaso de RSA y comentarios sobre la TI

# RSA

1. Transformación de los caracteres en código ASCII [https://www.ibm.com/docs/es/aix/7.1.0?topic=adapters-ascii-decimal-hexadecimal-octal-binary-conversion-table](https://www.ibm.com/docs/es/aix/7.1.0?topic=adapters-ascii-decimal-hexadecimal-octal-binary-conversion-table)
2. Tener en cuenta que esto nos ve generar cadenas de 8 bits, dependiendo del algoritmo (Addler32 y Fletcher) se selecciona un grupo
3. Tener en cuenta usar binarios en Scala porque vamos a tener operaciones bit a bit, desplazamientos, or, and, etc

```scala
scala> "Hola mundo".map(x => x.toInt).map(x => x.toBinaryString)
val res0: IndexedSeq[String] = ArraySeq(1001000, 1101111, 1101100, 1100001, 100000, 1101101, 1110101, 1101110, 1100100, 1101111)

scala> val x = 0b00001
val x: Int = 1

scala> x
val res1: Int = 1

scala> x << 2
val res2: Int = 4

scala> x & 0001
val res3: Int = 1

scala> x | 0001
val res4: Int = 1
```

# Diseño de las Clases

- Puede usar un patrón de diseño TI: [https://refactoring.guru/es/design-patterns](https://refactoring.guru/es/design-patterns)
- Tener en cuenta el uso de TAD
    - Representación de la clase teniendo en cuenta la receta de diseño
    - Utilizar case class
    - Utilizar traits o abstract class
    - Currificación de las funciones
    - toString para la representación
- Arboles: Manejador (Tree.scala) y un nodo (Node.scala) que tiene diferentes casos: leaf o noleaf (o los que desee añadir)
- Trabajar dentro de la carpeta src/main/scala

Tener en cuenta un diseño apropiado de clase, por ejemplo

[2025-05-28-Note-12-20_annotated.pdf](2025-05-28-Note-12-20_annotated.pdf)