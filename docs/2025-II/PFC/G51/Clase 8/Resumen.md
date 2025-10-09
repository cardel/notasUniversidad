# Resumen de la Clase - Colecciones en Scala

## Tabla Comparativa de Colecciones

| Colección | Mutabilidad | Acceso | Uso Ideal | Ejemplo |
|-----------|-------------|--------|-----------|---------|
| **Array** | Mutable | $O(1)$ | Acceso frecuente | `Array(1,2,3)(0)` |
| **Vector** | Inmutable | $O(log_32(n))$ | Operaciones funcionales | `Vector(1,2,3) :+ 4` |
| **Range** | Inmutable | Evaluación perezosa | Secuencias numéricas | `(1 to 10 by 2)` |
| **String** | Inmutable | $O(1)$ | Texto como colección | `"Hola".map(_.toUpper)` |
| **Set** | Inmutable | Hash-based | Elementos únicos | `Set(1,1,2,2)` |

## Funciones de Alto Orden

| Función | Propósito | Ejemplo |
|---------|-----------|---------|
| **forall** | Verifica si todos cumplen condición | `Array(1,2,3).forall(_ > 0)` |
| **exists** | Verifica si alguno cumple condición | `Array(1,2,3).exists(_ > 2)` |
| **map** | Transforma cada elemento | `(1 to 3).map(_ * 2)` |
| **flatMap** | Aplana colecciones anidadas | `(1 to 2).flatMap(x => (1 to 3))` |
| **filter** | Filtra elementos | `(1 to 10).filter(_ % 2 == 0)` |
| **zip** | Combina dos colecciones | `Array(1,2) zip Array("a","b")` |

## Ejemplos Adicionales

### Producto Cartesiano con flatMap
```scala
// Generar coordenadas (x,y) para x ∈ [1,3], y ∈ [1,2]
(1 to 3).flatMap(x => (1 to 2).map(y => (x,y)))
// Resultado: Vector((1,1), (1,2), (2,1), (2,2), (3,1), (3,2))
```

### Detección de Números Primos Mejorada
```scala
def esPrimo(n: Int): Boolean = n match {
  case 1 => true
  case 2 => true
  case _ => (2 to Math.sqrt(n).toInt).forall(n % _ != 0)
}

(1 to 20).map(x => (x, esPrimo(x)))
```

### Operaciones con Sets
```scala
val A = Set(1,2,3,4)
val B = Set(3,4,5,6)

A union B      // Set(1,2,3,4,5,6)
A intersect B  // Set(3,4)
A diff B       // Set(1,2)
```

### Expresiones For Complejas
```scala
// Encontrar triángulos rectángulos con lados enteros
for {
  a <- 1 to 10
  b <- 1 to 10  
  c <- 1 to 10
  if a*a + b*b == c*c
  if a <= b  // Evitar duplicados
} yield (a, b, c)
// Resultado: Vector((3,4,5), (6,8,10))
```

---

**Para el estudiante que se siente más aburrido que un anciano de 105 años:** 

La programación funcional es como descubrir que las matemáticas pueden bailar. Cada `map`, cada `filter`, cada `flatMap` es un paso coreografiado que transforma datos aburridos en soluciones elegantes. Hoy aprendiste que incluso el problema más tedioso se puede resolver con la gracia de una expresión `for` bien escrita. Si Scala te parece complejo ahora, recuerda que cada experto fue alguna vez un principiante que decidió que el aburrimiento era menos interesante que aprender algo nuevo. Sigue codificando - el mundo necesita más personas que prefieran resolver problemas sobre quejarse de ellos.