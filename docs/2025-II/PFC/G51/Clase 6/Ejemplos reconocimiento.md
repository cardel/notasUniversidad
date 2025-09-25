```scala
import scala.annotation.tailrec

object Listas {
  
  // SUMA CON IF-ELSE
  // Versión imperativa usando isEmpty, head y tail
  def suma(l:List[Int]):Int = {
    @tailrec
    def sumaR(l:List[Int])(acc:Int):Int = {
      if (l.isEmpty) acc                    // Caso base: lista vacía
      else sumaR(l.tail)(l.head + acc)      // Recursión: cabeza + acumulador
    }
    sumaR(l)(0)  // Inicia con acumulador 0
  }
  
  // SUMA CON PATTERN MATCHING
  // Versión funcional usando reconocimiento de patrones
  def sumaM(l:List[Int]):Int = {
    @tailrec
    def sumaR(l:List[Int])(acc:Int):Int = {
      l match {
        case Nil => acc                     // Patrón: lista vacía
        case h :: t => sumaR(t)(acc + h)    // Patrón: cabeza + cola
      }    
    }
    sumaR(l)(0)
  }

  // MAPEO CON PATTERN MATCHING
  // Aplica función f a cada elemento de la lista
  def mapeo(l:List[Int])(f:Int => Int):List[Int] = {
    @tailrec
    def mapeoR(l:List[Int])(acc:List[Int]):List[Int] = {
      l match {
      case Nil => acc.reverse               // Caso base: reversa para mantener orden
      case h :: t => mapeoR(t)(f(h) :: acc) // Aplica f y acumula
      }
    }
    mapeoR(l)(Nil)
  }

  // FILTRO CON PATTERN MATCHING  
  // Conserva elementos que cumplen condición f
  def filtro(l:List[Int])(f:Int => Boolean):List[Int] = {
    @tailrec
    def filtroR(l:List[Int])(acc:List[Int]):List[Int] = {
      l match {
      case Nil => acc.reverse               // Caso base
      case h :: t => 
        if (f(h)) filtroR(t)(h :: acc)      // Si cumple, añade al acumulador
        else filtroR(t)(acc)                // Si no, ignora
      }
    }
    filtroR(l)(Nil)
  }

  def main(arr:Array[String]):Unit = {
    val x = List(1,2,3,4,5)
    
    // Pruebas de suma
    println(suma(x))      // 15
    println(sumaM(x))     // 15
    
    // Comparación mapeo manual vs built-in
    println(mapeo(x)(a => a * 2))    // [2,4,6,8,10] (manual)
    println(mapeo(x)(a => a * a))    // [1,4,9,16,25] (manual)
    println(x.map(a => a * 2))       // [2,4,6,8,10] (built-in)
    println(x.map(a => a * a))       // [1,4,9,16,25] (built-in)
    
    // Comparación filtro manual vs built-in  
    println(filtro(x)(a => a % 2 == 0))  // [2,4] (manual)
    println(x.filter(a => a % 2 == 0))   // [2,4] (built-in)
    println(filtro(x)(a => a > 3))       // [4,5] (manual)
    println(x.filter(a => a > 3))        // [4,5] (built-in)
  }
}
```

**2. RECONOCIMIENTO DE PATRONES PARA LISTAS:**

El pattern matching descompone listas en dos patrones fundamentales:
- `Nil`: Lista vacía (caso base)
- `h :: t`: Cabeza (primer elemento) y cola (resto de la lista)

**Ventajas:**
- **Sintaxis clara**: `h :: t` es más expresivo que `l.head`/`l.tail`
- **Seguridad**: Evita excepciones con acceso a listas vacías
- **Exhaustividad**: Compilador verifica que se cubren todos los casos

**3. LIMITACIÓN DEL PATTERN MATCHING:**

El pattern matching solo reconoce **estructuras**, no **condiciones sobre valores**:

```scala
// NO ES POSIBLE hacer esto:
l match {
  case (h if h % 2 == 0) :: t => ...  // Error: no se puede poner condición en patrón de lista
  case _ => ...
}

// POR ESO se necesita el if dentro del caso:
case h :: t => if (h % 2 == 0) ... else ...
```

**Limitación:** El pattern matching no puede evaluar propiedades específicas de los elementos (como "ser par"), solo puede reconocer la estructura de la lista.

**4. INTRODUCCIÓN A MAP Y FILTER:**

**Map:** Transforma cada elemento aplicando una función
- `List(1,2,3).map(x => x * 2)` → `List(2,4,6)`
- No cambia la longitud de la lista
- Aplica la misma operación a todos los elementos

**Filter:** Selecciona elementos que cumplen una condición
- `List(1,2,3,4).filter(x => x % 2 == 0)` → `List(2,4)`
- Puede reducir la longitud de la lista
- Conserva el orden original

**Características comunes:**
- Operaciones de orden superior (reciben funciones como parámetros)
- No modifican la lista original (inmutabilidad)
- Retornan nuevas listas
- Fundamentales en programación funcional