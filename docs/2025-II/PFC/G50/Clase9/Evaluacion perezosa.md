En ocasiones tenemos situaciones en la que no sabemos cuantos elementos necesitamos o cuanto necesitamos evaluar para encontrar un número de valores dado, por ejemplo, quiero el tercer valor entre 1 y 1000 en la que $x^2 + y^2 = z^2$ por (3,4) (4,3) pero quisiera el siguiente.

1. Que sucede si genero todos los valores posibles y tomo el tercero: requiere tiempo, y pueden ser muchos ...
2. ¿Puedo recortar el rango con seguridad? por ejemplo ahora 1 a 100. Tampoco es buena idea porque no se donde esta el elemento que esta buscando

Para esto se definen los flujos (Stream) vamos generando los elementos a medida que se necesitan, este principio es ampliamente utilizando en Big Data y en Deep Learning (grandes cantidades de datos)


## Análisis del código:

### `generador(min:Int, max:Int):LazyList[Int]`
- Crea una lista perezosa de números desde `min` hasta `max-1`
- Solo genera elementos cuando se necesitan
- Usa recursión para construir la secuencia incrementalmente

### `resolverProblema():LazyList[(Int, Int, Int)]`
- Busca tripletas pitagóricas donde $x^2 + y^2 = z^2$
- Usa comprensión de listas con tres generadores anidados
- La evaluación perezosa evita generar todas las combinaciones posibles (que serían 1000×1000×1000 = 1 billón)

### Comportamiento en `main`:
```scala
val g = generador(1,1000)
println(g)        // Muestra: LazyList(<not computed>)
println(g(10))    // Calcula hasta el elemento 10: 11
println(g)        // Ahora muestra elementos computados
```

## Ventajas de la evaluación perezosa:
- **Eficiencia**: Solo se calcula lo necesario
- **Manejo de secuencias infinitas**: Podrías buscar tripletas sin límite superior
- **Memoria**: No almacena todos los resultados intermedios

## Ejemplo de tripletas que encontraría:
- (3, 4, 5) → $3^2 + 4^2 = 9 + 16 = 25 = 5^2$
- (6, 8, 10) → $36 + 64 = 100 = 10^2$
- (5, 12, 13) → $25 + 144 = 169 = 13^2$

Este enfoque es ideal para tu caso de uso: encontrar el tercer valor sin generar todas las combinaciones posibles primero.

```scala
object Lazy {
  // Generador va generar las tripleta de 1 a 1000
  // Para cumplir x*x + y*y = z*z
  def generador(min:Int, max:Int):LazyList[Int] = {
    if (min >= max) LazyList.empty
    else LazyList.cons(min, generador(min+1,max))
  }
  
  def resolverProblema():LazyList[(Int, Int, Int)] = {
    for {
      x <- generador(1,1000)
      y <- generador(1,1000)
      z <- generador(1,1000)
      if x*x + y*y == z*z
    } yield (x,y,z)
  }

  def main(arr: Array[String]):Unit = {
    val g = generador(1,1000)
    println(g)
    println(g(10))
    println(g)
    println(g(4))
    println(g)
    println(g(15))
    println(g)
    val s = resolverProblema()  
    println(s)
    println(s(2))
    println(s)
  }
}
```