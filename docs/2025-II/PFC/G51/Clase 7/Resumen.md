1. Exploramos lo que son las tuplas
2. Parametrizacion de tipos para que las funciones acepten cualquier tipo de dato (siempre y cuando se pueda operar)
3. Vimos las funciones de alto orden
	1. Map: Transformacion de listas
	2. Filter: Filtro de listas
	3. Reduce: Transformar listas a un valor
		1. ReduceLeft (izquierda), ReduceRight (derecha) toma un elemento de la lista como acumulador
		2. FoldLeft (Izquierda), FoldRight (derecha) establecer el acumulador, el fold retorna un reduce con el acumulador establecido

# Resumen de Conceptos Vistos en Clase

## Tabla Comparativa de Operaciones sobre Listas

| **Concepto** | **Propósito** | **Características** | **Ejemplo** | **Resultado** |
|-------------|---------------|-------------------|-------------|---------------|
| **Tuplas** | Agrupar valores heterogéneos | Inmutables, no recursivas, pattern matching | `(1, "hola", 3.14)` | `(Int, String, Double)` |
| **Pattern Matching con Tuplas** | Simplificar código anidado | Evita nested matches, más legible | `(u,v) match { case (x::xs, y::ys) => ... }` | Código más limpio |
| **Map** | Transformar elementos | Cambia tipo, mantiene estructura | `List(1,2,3).map(_ * 2)` | `List(2,4,6)` |
| **Filter** | Filtrar elementos | Predicado booleano, mantiene tipo | `List(1,2,3,4).filter(_ % 2 == 0)` | `List(2,4)` |
| **Reduce** | Reducir lista a valor | Mismo tipo, no funciona con vacías | `List(1,2,3).reduce(_ + _)` | `6` |
| **Fold** | Reducir con acumulador | Cambia tipo, funciona con vacías | `List(1,2,3).fold(0)(_ + _)` | `6` |

## Diferencias Clave entre Reduce y Fold

| **Aspecto** | **Reduce** | **Fold** |
|-------------|------------|----------|
| **Tipo de retorno** | Mismo que elementos | Puede ser diferente |
| **Listas vacías** | Lanza excepción | Retorna acumulador |
| **Acumulador inicial** | Primer/último elemento | Se especifica |
| **Asociatividad** | Left/Right importante | Left/Right importante |

## Asociatividad en Operaciones

| **Operación** | **Associativa** | **Left** | **Right** | **Ejemplo** |
|---------------|-----------------|----------|-----------|-------------|
| **Suma** | ✅ | `(((1+2)+3)+4)=10` | `(1+(2+(3+4)))=10` | Mismo resultado |
| **Resta** | ❌ | `(((1-2)-3)-4)=-8` | `(1-(2-(3-4)))=-2` | Diferente resultado |

## Implementaciones Prácticas

### Producto Punto con Tuplas
```scala
// Antes: código anidado complejo
case x :: xs => v match {
  case y :: ys => prodI(xs)(ys)(x*y + acc)
}

// Después: código limpio con tuplas
case (x :: xs, y :: ys) => prodI(xs)(ys)(x*y + acc)
```

### Funciones Genéricas
```scala
// Permite reutilización con diferentes tipos
def funcion[T](l: List[T]): ... 
funcion[Int](List(1,2,3))
funcion[String](List("a","b"))
```

## Aplicaciones Prácticas

1. **Producto punto**: Combinar elementos de listas paralelas
2. **Concatenación tipada**: Crear tuplas de diferentes tipos
3. **Filtrado genérico**: Aplicar predicados a cualquier tipo
4. **Reducción flexible**: Sumas, multiplicaciones, concatenaciones
5. **Transformación de tipos**: Lista de strings → suma de longitudes

## Ventajas del Enfoque

- **Type safety**: Scala detecta errores en tiempo de compilación
- **Reutilización**: Funciones genéricas trabajan con múltiples tipos
- **Expresividad**: Pattern matching simplifica lógica compleja
- **Eficiencia**: Tail recursion optimiza uso de memoria
- **Flexibilidad**: Fold supera limitaciones de reduce