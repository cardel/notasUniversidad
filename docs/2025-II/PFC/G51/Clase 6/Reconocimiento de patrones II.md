El reconocimiento de patrones lo podemos utilizar para estructuras como listas, pero tambien es util para reconocer clases.


El problema que vemos es que a medida que las operaciones crecen.

1. Crear una variable bandera en el trait (is?)
2. En todas las clases hijas es necesario darle un valor de falso a ese nuevo is
3. Toca crear una nueva clase hija con ese valor en verdadero.
En general, esto no es escalable

**Archivo 1: BoolExpr.scala**
```scala
// TRAIT que define el Tipo Abstracto de Datos (TAD) para expresiones booleanas
// Especifica la interfaz común que todas las expresiones deben implementar
trait BoolExpr {
  
  // Evalúa la expresión a un valor booleano
  def boolVal:Boolean

  // Métodos de reconocimiento de tipo (tagging)
  def isBoolean:Boolean  // True si es un valor literal
  def isAnd:Boolean      // True si es una operación AND
  def isOr:Boolean       // True si es una operación OR

  // Accesores a los operandos (solo válidos para operaciones binarias)
  def opIzq:BoolExpr     // Operando izquierdo
  def opDer:BoolExpr     // Operando derecho
}
```

**Archivo 2: ValorBool.scala**
```scala
// Implementación de valor booleano literal (hoja del árbol de expresión)
class ValorBool(v:Boolean) extends BoolExpr {

  // Retorna el valor almacenado directamente
  def boolVal = v
  
  // Métodos de identificación de tipo
  def isBoolean = true   // Sí es un valor literal
  def isAnd = false      // No es una operación AND
  def isOr = false       // No es una operación OR

  // Operandos no definidos para valores literales
  def opIzq = throw new Exception("Esto es un valor")
  def opDer = throw new Exception("Esto es un valor")
}
```

**Archivo 3: AndBool.scala**
```scala
// Implementación de la operación AND binaria
class AndBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr {
  
  // No puede evaluarse directamente (requiere evaluación recursiva)
  def boolVal = throw new Exception("Esto es una operacion")
  
  // Métodos de identificación de tipo
  def isBoolean = false  // No es un valor literal
  def isAnd = true       // Sí es una operación AND
  def isOr = false       // No es una operación OR
  
  // Retorna los operandos almacenados
  def opIzq = e1
  def opDer = e2
}
```

**Archivo 4: OrBool.scala**
```scala
// Implementación de la operación OR binaria
class OrBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr {
  
  // No puede evaluarse directamente (requiere evaluación recursiva)
  def boolVal = throw new Exception("Esto es una operacion")
  
  // Métodos de identificación de tipo
  def isBoolean = false  // No es un valor literal
  def isAnd = false      // No es una operación AND
  def isOr = true        // Sí es una operación OR
  
  // Retorna los operandos almacenados
  def opIzq = e1
  def opDer = e2
}
```

**Archivo 5: Main.scala**
```scala
object Main {
  // Función recursiva que evalúa cualquier expresión booleana
  def operar(b:BoolExpr): Boolean = {
    if (b.isBoolean) b.boolVal                    // Caso base: valor literal
    else if (b.isAnd) operar(b.opIzq) && operar(b.opDer)  // AND recursivo
    else if (b.isOr) operar(b.opIzq) || operar(b.opDer)   // OR recursivo
    else throw new Exception("Operacion no soportada") 
  }

  def main(args: Array[String]): Unit = {
    // Creación de expresiones booleanas
    val expr1:BoolExpr = new ValorBool(true)      // true
    val expr2:BoolExpr = new ValorBool(false)     // false
    val expr3:BoolExpr = new AndBool(expr1, expr2) // true AND false
    
    // Demostración del TAD
    println(expr1)  // Muestra referencia del objeto
    println(expr2)
    println(expr3)
    
    // Evaluación de expresiones
    println(operar(expr1)) // true
    println(operar(expr2)) // false
    println(operar(expr3)) // false (true AND false = false)
    println(operar(new OrBool(expr1, expr2))) // true (true OR false = true)
  }
}
```

**Diseño del TAD:**
- **Trait BoolExpr**: Define la interfaz abstracta común
- **ValorBool**: Representa valores terminales (hojas del árbol)
- **AndBool/OrBool**: Representan operaciones binarias (nodos internos)
- **Patrón de diseño**: Uso de métodos `isX` para reconocimiento de tipo (tagging)
- **Evaluación recursiva**: La función `operar` recorre la estructura árbol

Ahora vamos a utilizar reconocimiento de patrones por clases y usar case clase que es una forma de construir clases usando patrones.

Para esto vamos a tener un sealed trait que debe ser definido en el mismo archivo y vamos a reconocer con match la forma de la clase

**Archivo 1: BoolExpr.scala**
```scala
// TRAIT SELLADO: Restringe las posibles implementaciones a este archivo
// Permite pattern matching exhaustivo en tiempo de compilación
sealed trait BoolExpr

// CASE CLASSES: Implementaciones automáticas de equals, hashCode, toString
// Constructor público y extracción de parámetros gratuita
case class ValorBool(v:Boolean) extends BoolExpr           // Valor literal
case class AndBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr     // Conjunción
case class OrBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr      // Disyunción  
case class ImpliesBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr // Implicación
```

**Archivo 2: Main.scala**
```scala
object Main {
  // EVALUACIÓN MEDIANTE PATTERN MATCHING
  // El compilador verifica exhaustividad gracias al 'sealed trait'
  def operar(b:BoolExpr): Boolean = {
    b match{
      case ValorBool(v) => v                    // Caso base: valor directo
      case AndBool(b1, b2) => operar(b1) && operar(b2)      // AND recursivo
      case OrBool(b1, b2) => operar(b1) || operar(b2)       // OR recursivo
      case ImpliesBool(p, q) => !operar(p) || operar(q)     // IMPLIES: p → q ≡ ¬p ∨ q
      case _ => throw new Exception("Expresión no reconocida") // Redundante por sealed
    }  
  }

  def main(args: Array[String]): Unit = {
    // Sintaxis concisa gracias a case classes
    val expr1:BoolExpr = ValorBool(true)        // true
    val expr2:BoolExpr = ValorBool(false)       // false  
    val expr3:BoolExpr = AndBool(expr1, expr2)  // true AND false
    
    // toString automático muestra estructura legible
    println(expr1)  // ValorBool(true)
    println(expr2)  // ValorBool(false)
    println(expr3)  // AndBool(ValorBool(true),ValorBool(false))
    
    // Evaluación
    println(operar(expr1)) // true
    println(operar(expr2)) // false
    println(operar(expr3)) // false
    println(operar(OrBool(expr1, expr2))) // true
    println(operar(ImpliesBool(expr1, expr2))) // false (true → false = false)
  }
}
```

**COMPARACIÓN DE ESCALABILIDAD:**

**Versión anterior (con métodos isX):**
- **Acoplamiento alto**: Cada nueva operación requiere modificar el trait base
- **Verificación en runtime**: Errores solo se detectan durante ejecución
- **Código repetitivo**: Múltiples métodos isX/getX por cada clase
- **Difícil extensión**: Añadir ImpliesBool requiere modificar todas las clases existentes

**Versión actual (sealed trait + case classes):**
- **Bajo acoplamiento**: Nuevas operaciones son case classes independientes
- **Verificación en compilación**: Pattern matching exhaustivo garantiza cobertura completa
- **Código conciso**: Sin métodos boilerplate, sintaxis automática
- **Fácil extensión**: Añadir ImpliesBool solo requiere:
  1. Nueva case class
  2. Nuevo caso en pattern matching (compilador avisa si falta)

**Escalabilidad demostrada:**
- ImpliesBool se añadió sin modificar clases existentes
- Compilador fuerza actualización de `operar` para mantener exhaustividad
- Menos código repetitivo y más mantenible
- Mejor rendimiento (pattern matching vs múltiples if-else)

**Archivo 1: BoolExpr.scala**
```scala
// TRAIT SELLADO: Restringe las posibles implementaciones a este archivo
// Permite pattern matching exhaustivo en tiempo de compilación
sealed trait BoolExpr

// CASE CLASSES: Implementaciones automáticas de equals, hashCode, toString
// Constructor público y extracción de parámetros gratuita
case class ValorBool(v:Boolean) extends BoolExpr           // Valor literal
case class AndBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr     // Conjunción
case class OrBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr      // Disyunción  
case class ImpliesBool(e1:BoolExpr, e2:BoolExpr) extends BoolExpr // Implicación
```

**Archivo 2: Main.scala**
```scala
object Main {
  // EVALUACIÓN MEDIANTE PATTERN MATCHING
  // El compilador verifica exhaustividad gracias al 'sealed trait'
  def operar(b:BoolExpr): Boolean = {
    b match{
      case ValorBool(v) => v                    // Caso base: valor directo
      case AndBool(b1, b2) => operar(b1) && operar(b2)      // AND recursivo
      case OrBool(b1, b2) => operar(b1) || operar(b2)       // OR recursivo
      case ImpliesBool(p, q) => !operar(p) || operar(q)     // IMPLIES: p → q ≡ ¬p ∨ q
      case _ => throw new Exception("Expresión no reconocida") // Redundante por sealed
    }  
  }

  def main(args: Array[String]): Unit = {
    // Sintaxis concisa gracias a case classes
    val expr1:BoolExpr = ValorBool(true)        // true
    val expr2:BoolExpr = ValorBool(false)       // false  
    val expr3:BoolExpr = AndBool(expr1, expr2)  // true AND false
    
    // toString automático muestra estructura legible
    println(expr1)  // ValorBool(true)
    println(expr2)  // ValorBool(false)
    println(expr3)  // AndBool(ValorBool(true),ValorBool(false))
    
    // Evaluación
    println(operar(expr1)) // true
    println(operar(expr2)) // false
    println(operar(expr3)) // false
    println(operar(OrBool(expr1, expr2))) // true
    println(operar(ImpliesBool(expr1, expr2))) // false (true → false = false)
  }
}
```

**COMPARACIÓN DE ESCALABILIDAD:**

**Versión anterior (con métodos isX):**
- **Acoplamiento alto**: Cada nueva operación requiere modificar el trait base
- **Verificación en runtime**: Errores solo se detectan durante ejecución
- **Código repetitivo**: Múltiples métodos isX/getX por cada clase
- **Difícil extensión**: Añadir ImpliesBool requiere modificar todas las clases existentes

**Versión actual (sealed trait + case classes):**
- **Bajo acoplamiento**: Nuevas operaciones son case classes independientes
- **Verificación en compilación**: Pattern matching exhaustivo garantiza cobertura completa
- **Código conciso**: Sin métodos boilerplate, sintaxis automática
- **Fácil extensión**: Añadir ImpliesBool solo requiere:
  1. Nueva case class
  2. Nuevo caso en pattern matching (compilador avisa si falta)

**Escalabilidad demostrada:**
- ImpliesBool se añadió sin modificar clases existentes
- Compilador fuerza actualización de `operar` para mantener exhaustividad
- Menos código repetitivo y más mantenible
- Mejor rendimiento (pattern matching vs múltiples if-else)