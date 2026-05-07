# Scan

Esta operación retorna los residuos parciales del *reduce*.

**Concepto teórico:** La operación *scan* (también conocida como *prefix sum* o *suma de prefijos*) genera una secuencia donde cada elemento $i$ es el resultado de aplicar una operación binaria asociativa a todos los elementos anteriores (incluyendo el actual), partiendo de un valor inicial (neutro). Formalmente, dado un arreglo $[x_1, x_2, ..., x_n]$ y un valor inicial $e$, el scan produce $[e, e \oplus x_1, e \oplus x_1 \oplus x_2, ..., e \oplus x_1 \oplus ... \oplus x_n]$.

```scala
// foldLeft: combina todos los elementos en un solo valor acumulado
scala> List(1,2,3,4).foldLeft(0)((acc,x)=>x+acc)
val res0: Int = 10

// scan: retorna una lista con todos los acumulados parciales, incluyendo el valor inicial
scala> List(1,2,3,4).scan(0)((acc,x)=>x+acc)
val res1: List[Int] = List(0, 1, 3, 6, 10)

// foldRight: combina los elementos en orden inverso, resultando en el mismo valor final
scala> List(1,2,3,4).foldRight(0)((acc,x)=>x+acc)
val res2: Int = 10

// scanRight: retorna los acumulados parciales recorriendo la lista de derecha a izquierda
scala> List(1,2,3,4).scanRight(0)((acc,x)=>x+acc)
val res3: List[Int] = List(10, 9, 7, 4, 0)
```

Dado que la operación se hace en orden diferente, los acumuladores son diferentes. Además, esta operación no es fácil de paralelizar dado que hay dependencia de datos entre elementos consecutivos.

**Concepto teórico:** La dependencia secuencial inherente del scan (cada resultado depende del anterior) hace que la paralelización directa no sea trivial. Sin embargo, existen algoritmos paralelos eficientes para el scan, como el *Hillis-Steele algorithm* (paralelización en $O(\log n)$ pasos con $O(n \log n)$ trabajo total) o el *Blelloch algorithm* (paralelización en $O(\log n)$ pasos con $O(n)$ trabajo total, más eficiente). Estos algoritmos utilizan un árbol de reducción y una fase de distribución (*down-sweep*) para romper la dependencia aparente.

**Concepto teórico:** La operación scan es fundamental en programación paralela y se utiliza en algoritmos como:
- Radix sort paralelo
- Compactación de arreglos (*stream compaction*)
- Asignación de recursos en GPUs
- Implementación de operaciones de filtrado y particionado paralelo

## Tabla resumen de conceptos

| Concepto | Descripción |
|----------|-------------|
| Scan (prefix sum) | Operación que retorna una secuencia con todos los resultados parciales acumulados de izquierda a derecha, incluyendo el valor inicial |
| foldLeft | Operación que combina todos los elementos en un solo valor, recorriendo la colección de izquierda a derecha |
| foldRight | Operación que combina todos los elementos en un solo valor, recorriendo la colección de derecha a izquierda |
| scanRight | Operación que retorna los acumulados parciales recorriendo la colección de derecha a izquierda |
| Dependencia de datos | Situación donde el resultado de una operación depende del resultado de la operación anterior, dificultando la paralelización directa |
| Hillis-Steele algorithm | Algoritmo paralelo para scan con $O(\log n)$ pasos y $O(n \log n)$ trabajo total |
| Blelloch algorithm | Algoritmo paralelo para scan con $O(\log n)$ pasos y $O(n)$ trabajo total, más eficiente que Hillis-Steele |

**Comentarios adicionales:**
- Aunque el scan parece inherentemente secuencial, los algoritmos paralelos mencionados demuestran que es posible paralelizarlo eficientemente utilizando un enfoque de árbol binario.
- La elección entre scan izquierdo y derecho depende de la dirección en que se necesiten los prefijos para el algoritmo específico.
- En el contexto de programación funcional, scan es una operación de orden superior que generaliza el concepto de suma de prefijos a cualquier operación binaria asociativa.
- La implementación paralela de scan requiere que la operación binaria sea asociativa para garantizar resultados correctos independientemente del orden de evaluación.