# Resumen de Operaciones Funcionales en Scala

## Tabla Comparativa de Operaciones sobre Listas

| Operación | Propósito | Manejo Lista Vacía | Asociatividad | Ejemplo | Resultado |
|-----------|-----------|-------------------|---------------|---------|-----------|
| **map** | Transformar elementos | Retorna lista vacía | No aplica | `List(1,2,3).map(_ * 2)` | `List(2,4,6)` |
| **filter** | Filtrar elementos | Retorna lista vacía | No aplica | `List(1,2,3).filter(_ % 2 == 0)` | `List(2)` |
| **reduceLeft** | Reducir a un valor | Lanza excepción | Izquierda | `List(1,2,3).reduceLeft(_ + _)` | `6` |
| **reduceRight** | Reducir a un valor | Lanza excepción | Derecha | `List(1,2,3).reduceRight(_ + _)` | `6` |
| **foldLeft** | Reducir con valor inicial | Retorna valor inicial | Izquierda | `List(1,2,3).foldLeft(0)(_ + _)` | `6` |
| **foldRight** | Reducir con valor inicial | Retorna valor inicial | Derecha | `List(1,2,3).foldRight(0)(_ + _)` | `6` |

## Características Clave

### Tuplas en Pattern Matching
- **Ventaja**: Sintaxis más concisa y análisis simultáneo
- **Ejemplo**: `case (x::xs, y::ys)` vs pattern matching anidado

### Diferencias en Reducción
- **Operaciones asociativas** (suma, multiplicación): Mismo resultado en left/right
- **Operaciones no asociativas** (resta, división): Resultados diferentes
- **Ejemplo resta**: 
  - `reduceLeft`: `((1-2)-3)-4 = -8`
  - `reduceRight`: `1-(2-(3-4)) = -2`

### Fold vs Reduce
- **Fold**: Acepta valor inicial, maneja listas vacías
- **Reduce**: Usa primer/último elemento, falla con listas vacías

### Estrategias de Procesamiento
- **Left**: Procesa de izquierda a derecha, iterativo
- **Right**: Procesa de derecha a izquierda, recursivo

Esta tabla resume las principales operaciones funcionales y sus características distintivas para el manejo de colecciones en Scala.