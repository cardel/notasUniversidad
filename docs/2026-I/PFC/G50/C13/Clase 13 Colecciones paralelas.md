# Clase 13: Colecciones Paralelas

## Introducción a las Colecciones Paralelas

Las colecciones paralelas en Scala permiten ejecutar operaciones sobre colecciones de manera concurrente, aprovechando múltiples núcleos del procesador. Esto mejora el rendimiento en operaciones con grandes volúmenes de datos.

### ¿Cómo funcionan?

Scala divide automáticamente la colección en subconjuntos (particiones) y procesa cada partición en un hilo separado. Luego, combina los resultados parciales para obtener el resultado final.

### Convertir una colección secuencial a paralela

Para convertir una colección secuencial a paralela, se utiliza el método `.par`:

```scala
val listaSecuencial = List(1, 2, 3, 4, 5)
val listaParalela = listaSecuencial.par
```

## Métodos Principales

### `aggregate`

El método `aggregate` es similar a `fold`, pero permite trabajar en paralelo. Recibe tres parámetros:

1. **Valor inicial** (`zeroValue`): Valor desde el cual se comienza la acumulación.
2. **Operación de secuencia** (`seqOp`): Función que combina el acumulador con cada elemento de la colección.
3. **Operación de combinación** (`combOp`): Función que combina los resultados parciales de diferentes particiones.

```scala
// Sumar las longitudes de las cadenas en un arreglo
Array("a", "ab", "c").aggregate(0)(  // Valor inicial: 0
  (acc, x) => acc + x.length,        // seqOp: suma la longitud de cada elemento al acumulador
  (A, B) => A + B                    // combOp: suma los resultados parciales
)
// Resultado: 4 (1 + 2 + 1)
```

### `fold`

Similar a `aggregate`, pero requiere que la operación sea asociativa y que el valor inicial sea un elemento neutro (identidad) para la operación.

```scala
// Sumar los elementos de un arreglo en paralelo
Array(1, 2, 3, 4, 5).par.fold(0)(_ + _)
// Resultado: 15
```

### `reduce`

Similar a `fold`, pero no requiere un valor inicial. La colección debe tener al menos un elemento.

```scala
// Encontrar el máximo elemento
Array(3, 7, 2, 9, 5).par.reduce((a, b) => if (a > b) a else b)
// Resultado: 9
```

## Consideraciones Importantes

### Operaciones Asociativas

Para que las colecciones paralelas funcionen correctamente, las operaciones deben ser **asociativas**. Una operación es asociativa si:

$(a \circ b) \circ c = a \circ (b \circ c)$

Ejemplos de operaciones asociativas:
- Suma: $(1 + 2) + 3 = 1 + (2 + 3)$
- Multiplicación: $(2 \times 3) \times 4 = 2 \times (3 \times 4)$
- Máximo: $max(max(1,2),3) = max(1,max(2,3))$

### Operaciones No Asociativas

La resta no es asociativa:
- $(5 - 3) - 2 = 0$
- $5 - (3 - 2) = 4$

### Hilos y Paralelismo

Scala utiliza un pool de hilos (ForkJoinPool) para ejecutar las operaciones paralelas. El número de hilos disponibles depende del número de núcleos del procesador.

```scala
// Verificar el número de hilos disponibles
println(Runtime.getRuntime.availableProcessors())
```

## Ejemplo Completo

```scala
// Calcular la suma de cuadrados en paralelo
val numeros = (1 to 1000000).toArray.par

val sumaCuadrados = numeros.aggregate(0)(  // Valor inicial: 0
  (acc, x) => acc + (x * x),               // seqOp: suma el cuadrado de cada elemento
  (acc1, acc2) => acc1 + acc2              // combOp: combina resultados parciales
)

println(s"Suma de cuadrados: $sumaCuadrados")
```

## Tabla Resumen

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| `.par` | Convierte una colección secuencial a paralela | `lista.par` |
| `aggregate` | Acumula valores con valor inicial, operación de secuencia y combinación | `coleccion.aggregate(0)(_+_, _+_)` |
| `fold` | Similar a aggregate pero requiere operación asociativa | `coleccion.par.fold(0)(_+_)` |
| `reduce` | Similar a fold pero sin valor inicial | `coleccion.par.reduce(_+_)` |
| Asociatividad | Propiedad necesaria para operaciones paralelas | `(a+b)+c = a+(b+c)` |
| ForkJoinPool | Pool de hilos usado por Scala para paralelismo | Configuración automática |

**Comentarios adicionales:**
- Las colecciones paralelas son ideales para operaciones intensivas en CPU con grandes conjuntos de datos.
- No todas las operaciones se benefician del paralelismo; para colecciones pequeñas, la sobrecarga de crear hilos puede ser mayor que la ganancia.
- Es importante asegurar que las operaciones sean **sin efectos secundarios** (inmutables) para evitar condiciones de carrera.
- El orden de los resultados no está garantizado en operaciones paralelas.