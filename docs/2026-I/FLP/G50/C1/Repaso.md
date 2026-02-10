# Conceptos de programación funcional

1. **Ligaduras (bindings)**: Valores inmutables que no pueden modificarse después de su definición.
2. **Recursión como estrategia de solución**: Puede ser lineal, de cola (tail recursion) o en árbol.
3. **Funciones de alto orden (higher-order functions)**: Funciones que reciben otras funciones como argumentos o retornan funciones como resultado.

# Ejercicio

1. Desarrollar un programa que, dado un `n`, retorne la lista desde `0!` hasta `n!`. Usar recursión de cola.
2. Desarrollar un programa que reciba `n` y `m` y retorne los números primos en ese rango (donde `n < m`).

```scala
import scala.annotation.tailrec
class Ejemplo {

  // Función principal que retorna la lista de factoriales desde 0! hasta n!
  def listaFactoriales(n:Int):List[Long] = {
    // Función auxiliar recursiva de cola que construye la lista
    @tailrec
    def listaFactorialesAux(n:Int, acc:List[Long]):List[Long] = {
      if (n == 0) {
        1L :: acc  // Caso base: agrega 0! = 1 a la lista acumulada
      }
      else{
        listaFactorialesAux(n-1, factorial(n) :: acc)  // Caso recursivo: calcula n! y lo agrega
      }
    }
    
    // Función para calcular factorial con recursión de cola
    @tailrec
    def factorial(n:Int, acc:Long = 1L):Long = {
      if (n == 0) acc  // Caso base: retorna el acumulador
      else factorial(n-1, acc * n)  // Caso recursivo: multiplica y continúa
    }
    
    listaFactorialesAux(n, List())  // Llama a la función auxiliar con lista vacía inicial
  }

  // Función que retorna los números primos en el rango [n, m]
  def primosRango(n:Int, m:Int):List[Int] = {
    // Función auxiliar para verificar si un número es primo
    def esPrimo(num:Int):Boolean = {
      // Verifica divisibilidad desde 2 hasta √num
      (2 to Math.ceil(Math.sqrt(num)).toInt) forall (x => num % x != 0)
    }
    // Filtra el rango [n, m] conservando solo los números primos
    (n to m).filter(esPrimo).toList
  }

  // Método principal para probar las funciones
  def main(arr: Array[String]):Unit = {
    println(listaFactoriales(6))  // Imprime factoriales de 0 a 6
    println(primosRango(2, 100))  // Imprime primos entre 2 y 100
  }
}
```

## Conceptos teóricos adicionales

- **Recursión de cola (tail recursion)**: Una función es recursiva de cola cuando la llamada recursiva es la última operación que se ejecuta. Scala puede optimizarla para evitar crecimiento de la pila (stack overflow).
- **Inmutabilidad en Scala**: Aunque Scala permite mutabilidad, el estilo funcional favorece valores inmutables usando `val` en lugar de `var`.
- **Funciones de orden superior en Scala**: `map`, `filter`, `fold`, `forall` son ejemplos comunes que operan sobre colecciones.
- **Anotación `@tailrec`**: Garantiza en tiempo de compilación que la función es recursiva de cola; si no lo es, produce un error.
- **Rangos en Scala**: `(n to m)` crea un rango inclusivo; `(n until m)` crea un rango exclusivo del límite superior.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| **Ligaduras inmutables** | Valores que no cambian después de definirse. | `val x = 5` |
| **Recursión lineal** | Función que se llama a sí misma una vez por ejecución. | Función factorial clásica |
| **Recursión de cola** | Recursión donde la llamada recursiva es la última operación. | `factorial` con acumulador |
| **Anotación `@tailrec`** | Asegura optimización de recursión de cola. | `@tailrec def f(...)` |
| **Funciones de alto orden** | Funciones que operan sobre otras funciones. | `filter`, `map`, `forall` |
| **Funciones anidadas** | Funciones definidas dentro de otras funciones. | `listaFactorialesAux` dentro de `listaFactoriales` |
| **Rangos** | Secuencias de números enteros. | `(1 to 10)`, `(1 until 10)` |
| **Método `forall`** | Verifica que todos los elementos cumplan una condición. | `range.forall(predicate)` |
| **Inmutabilidad de listas** | Las listas en Scala son inmutables por defecto. | `List(1, 2, 3)` |
| **Operador `::`** | Agrega un elemento al inicio de una lista (cons). | `1 :: List(2, 3)` |

## Comentarios adicionales

- En programación funcional, la **inmutabilidad** es clave: evita efectos secundarios y hace el código más predecible.
- La **recursión de cola** es esencial para procesar grandes conjuntos de datos sin desbordar la pila.
- Scala es un lenguaje **multiparadigma** que combina programación funcional y orientada a objetos.
- El uso de **funciones de orden superior** (`filter`, `map`, etc.) produce código más declarativo y conciso.
- Para mejorar el rendimiento en la verificación de primos, se puede limitar la prueba de divisibilidad hasta la raíz cuadrada del número.
- En Scala, es buena práctica usar `val` para valores inmutables y reservar `var` para casos excepcionales donde se necesite mutabilidad.
- La anotación `@tailrec` es una herramienta de seguridad que ayuda a prevenir errores de desbordamiento de pila en funciones recursivas.