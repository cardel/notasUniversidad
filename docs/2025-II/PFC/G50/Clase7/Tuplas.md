Las tuplas son una colección que permite agrupar elementos del mismo tipo, sin embargo a diferencia de la listas no son recursivas, es una abstracción de los arreglos, porque estas permiten abstraer diferentes patrones.

```scala
scala> scala.Tuple2(1,2)
val res3: (Int, Int) = (1,2)

scala> (1,2)
val res4: (Int, Int) = (1,2)
```

Las tuplas nos permiten hacer reconocimiento de patrones en diferentes ambitos, entre ellos la ligadura de variables

```scala
scala> val (x,y) = (1,2)
val x: Int = 1
val y: Int = 2
```

# Tuplas en reconocimiento de patrones

En ciertas ocasiones necesitamos que reconocer dos o mas patrones al mismo tipo.

# Suma de vectores
Dados
$$
\begin{aligned}
u = \{u_1,u_2, \ldots , u_n\} \\
v = \{v_1,v_2, \ldots , v_n\} 
\end{aligned}
$$
Para sumarlos
$$
w = \{u_1+v_1,u_2+v_2, \ldots , u_n+v_n\}
$$


```scala
object SumarL{

  // Función que suma dos listas elemento por elemento usando pattern matching anidado
  def sumarv1(u:List[Int], v:List[Int]):List[Int] = {
    u match {
      case Nil => {  // Caso cuando la primera lista está vacía
        v match {
          case Nil => Nil  // Ambas listas vacías - retorna lista vacía
          case _ => throw new Exception("Las listas no tienen el mismo tamanio")  // Listas de diferente tamaño
        }
      }
      case h :: t  => {  // Caso cuando la primera lista tiene elementos
        v match {
          case Nil => throw new Exception("Las listas no tienen el mismo tamanio")  // Listas de diferente tamaño
          case x  :: xs  => h + x :: sumarv1(t, xs)  // Suma elementos cabeza y procesa recursivamente las colas
        }
      }
    }
  }

  // Función que suma dos listas usando pattern matching con tuplas (más conciso)
  def sumarv2(u:List[Int], v:List[Int]):List[Int] = {
    (u,v) match {  // Pattern matching sobre la tupla (u,v)
      case (Nil, Nil) => Nil  // Ambas listas vacías
      case (Nil, _) => throw new Exception("Las listas no tienen el mismo tamanio")  // Primera lista vacía, segunda no
      case (_, Nil) => throw new Exception("Las listas no tienen el mismo tamanio")  // Segunda lista vacía, primera no
      case (x::xs,y::ys) => x + y:: sumarv1(xs, ys)  // Ambas tienen elementos - suma y procesa recursivamente
    }
  }

  // Función principal para probar las implementaciones
  def main(args:Array[String]):Unit = {
    val u = List(1,2,3,4,5,6)    // Primera lista de prueba
    val v = List(2,4,6,8,10,12)  // Segunda lista de prueba
    println(sumarv1(u,v))         // Prueba de sumarv1
    println(sumarv2(u,v))         // Prueba de sumarv2
  }
}
```


## Comentario del código

Este código Scala implementa dos versiones de una función que suma dos listas de enteros elemento por elemento:

### `sumarv1`
- **Enfoque**: Anidamiento de patrones
- **Funcionamiento**:
  - Primero hace pattern matching sobre `u`
  - Si `u` es vacía, verifica si `v` también lo es
  - Si `u` tiene elementos, verifica que `v` también los tenga
  - Suma recursivamente los elementos cabeza y procesa las colas

### `sumarv2`
- **Enfoque**: Pattern matching con tuplas
- **Funcionamiento**:
  - Hace pattern matching directamente sobre la tupla `(u, v)`
  - Analiza simultáneamente el estado de ambas listas
  - Casos más claros y concisos

## Ventajas de usar tuplas en pattern matching

### 1. **Sintaxis más limpia y concisa**
```scala
// Con tuplas (sumarv2)
case (x::xs, y::ys) => x + y :: sumarv1(xs, ys)

// Sin tuplas (sumarv1)  
case h :: t => {
  v match {
    case x :: xs => h + x :: sumarv1(t, xs)
```
El código con tuplas elimina el anidamiento y es más legible.

### 2. **Análisis simultáneo**
Las tuplas permiten analizar múltiples valores al mismo tiempo, lo que es especialmente útil cuando los casos están relacionados (como verificar que ambas listas tengan la misma estructura).

### 3. **Mejor manejo de casos relacionados**
Los casos como `(Nil, Nil)`, `(Nil, _)`, `(_, Nil)` expresan claramente la relación entre los estados de ambas listas.

### 4. **Reducción de código repetitivo**
Elimina la necesidad de verificar manualmente la correspondencia entre los diferentes casos de las listas.

### 5. **Mantenibilidad**
Es más fácil añadir nuevos casos o modificar la lógica cuando todos los patrones relacionados están en un solo bloque de matching.

**Salida esperada**: `List(3, 6, 9, 12, 15, 18)` para ambas funciones, ya que suman `(1+2, 2+4, 3+6, 4+8, 5+10, 6+12)`.