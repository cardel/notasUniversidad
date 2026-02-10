# Repaso PF

La programación funcional tiene los siguientes elementos:

1. Valores inmutables
2. Funciones como ciudadanos de primer clase
3. Recursión como elemento de solución de problemas

## Anotaciones

La recursión tiene dos casos:

a. Caso base: solución inmediata o trivial
b. Caso recursivo: solución compuesta por otros subproblemas que eventualmente me llevan hacia el caso base

Los tipos de recursión son:

1. Lineal: requiere marcos de pila para cada llamado
2. De cola: requiere un solo marco de pila (optimización importante en lenguajes funcionales)
3. De árbol: múltiples llamados recursivos

**Concepto adicional**: La recursión de cola es especialmente importante en programación funcional porque permite que el compilador realice la optimización de llamadas de cola (tail call optimization), evitando el desbordamiento de pila incluso con recursiones profundas.

## Ejercicio

Conocimientos previos: programación en Scala

1) Desarrollar un programa que proporcione los números múltiplos de 2 o 3 en un rango entre n y m (donde n < m) en una lista de enteros, utilizando recursión de cola.

2) Desarrollar un programa que genere los números palíndromos entre m y n. Utilizar funciones de alto orden.

```scala
import scala.annotation.tailrec

class Ejemplo {

  // Función que encuentra múltiplos de 2 o 3 usando recursión de cola
  // La anotación @tailrec asegura que el compilador optimice esta recursión
  def multiplo2y3(n:Int, m:Int):List[Int] = {
    // Función auxiliar con acumulador para garantizar recursión de cola
    @tailrec
    def multiplo2y3Aux(n:Int, m:Int, acc:List[Int]):List[Int] = {
      // Caso base: cuando n supera m, retorna el acumulador invertido
      if (n > m) acc.reverse
      // Caso recursivo: si n es múltiplo de 2 o 3, lo agrega al acumulador
      else if (n % 2 == 0 || n % 3 == 0) multiplo2y3Aux(n + 1, m, n :: acc)
      // Caso recursivo: si no es múltiplo, continúa sin agregar
      else multiplo2y3Aux(n + 1, m, acc)
    }
    multiplo2y3Aux(n, m, Nil)
  }

  // Función que encuentra números palíndromos usando funciones de alto orden
  // filter es una función de alto orden que aplica un predicado a cada elemento
  def numeroPalindromo(n:Int, m:Int):List[Int] = {
    // Crea un rango, filtra números cuya representación en String es igual a su reverso
    (n to m).filter(x => x.toString == x.toString.reverse).toList
  }

  def main(args: Array[String]): Unit = {
    println(multiplo2y3(1, 100))
    println(numeroPalindromo(1, 1000))
  }
}
```

## Tabla de Resumen

| Concepto | Descripción | Aplicación en el código |
|----------|-------------|-------------------------|
| Valores inmutables | Los datos no pueden cambiar después de su creación; se crean nuevas estructuras en lugar de modificar las existentes | Las listas se construyen de forma inmutable usando el operador `::` |
| Funciones como ciudadanos de primer clase | Las funciones pueden pasarse como parámetros, retornarse como valores y asignarse a variables | `filter` recibe una función lambda como parámetro |
| Recursión lineal | Una única llamada recursiva en cada rama del código | Se presenta en la estructura base de `multiplo2y3Aux` |
| Recursión de cola | La llamada recursiva es la última operación; permite optimización de compilador | `multiplo2y3Aux` utiliza `@tailrec` para garantizar optimización |
| Acumulador | Parámetro que almacena resultados intermedios para evitar construir estructuras innecesarias | `acc` acumula los múltiplos encontrados |
| Funciones de alto orden | Funciones que reciben o retornan otras funciones | `filter` es una función de alto orden que recibe un predicado |
| Palíndromos | Números que se leen igual de izquierda a derecha y viceversa | Se valida mediante comparación de String y su reverso |

## Comentarios Adicionales

- **Optimización de recursión de cola**: La anotación `@tailrec` en Scala no solo documenta la intención de recursión de cola, sino que también genera un error de compilación si la recursión no puede optimizarse, garantizando la eficiencia.

- **Reversión de acumulador**: En `multiplo2y3`, el acumulador construye la lista en orden inverso (`n :: acc`) por eficiencia, luego se invierte al final (`acc.reverse`) para obtener el resultado en orden correcto.

- **Rango y conversión**: En `numeroPalindromo`, `(n to m)` crea un rango inclusivo, `filter` aplica la condición de palíndromo, y `toList` convierte el rango filtrado a una lista.

- **Diferencia entre ambos enfoques**: El primer ejercicio enfatiza recursión explícita con optimización de cola, mientras que el segundo aprovecha funciones de alto orden integradas en Scala, demostrando la flexibilidad de la programación funcional.