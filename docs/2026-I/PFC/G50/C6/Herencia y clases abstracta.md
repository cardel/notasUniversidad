# Herencia y clases abstractas

La herencia permite construir clases a partir de clases existentes, lo que permite una construcción incremental de abstracciones de datos.

- **Clase abstracta**: Define una interfaz sin implementación completa.
- **Herencia simple**: Cada clase puede tener como máximo un padre.
- **Traits (interfaces)**: Permiten mezclar comportamiento de múltiples fuentes. Estos no pueden heredar de una clase.

Podemos implementar **abstracción de datos (TAD)**, es decir, un Tipo Abstracto de Dato.

```scala
// Clase abstracta que define la interfaz para un conjunto de enteros
abstract class ConjEnt {
  def insertar(x: Int): ConjEnt  // Método abstracto para insertar un elemento
  def pertenece(x: Int): Boolean // Método abstracto para verificar pertenencia
}

// Clase que representa el conjunto vacío
class Vacio extends ConjEnt {
  // En un conjunto vacío, ningún elemento pertenece
  def pertenece(x: Int): Boolean = false
  
  // Insertar en un conjunto vacío crea un nuevo conjunto no vacío
  def insertar(x: Int): ConjEnt = new NoVacio(x, new Vacio, new Vacio)
}

// Clase que representa un conjunto no vacío, implementado como un árbol binario de búsqueda
class NoVacio(elem: Int, izq: ConjEnt, der: ConjEnt) extends ConjEnt {
  // Verifica si un elemento pertenece al conjunto
  def pertenece(x: Int): Boolean = {
    if (x < elem) izq.pertenece(x)  // Busca en el subárbol izquierdo
    else if (x > elem) der.pertenece(x) // Busca en el subárbol derecho
    else true  // El elemento es igual a la raíz
  }
  
  // Inserta un elemento en el conjunto
  def insertar(x: Int): ConjEnt = {
    if (x < elem) new NoVacio(elem, izq.insertar(x), der)  // Inserta en izquierdo
    else if (x > elem) new NoVacio(elem, izq, der.insertar(x)) // Inserta en derecho
    else this  // El elemento ya existe, retorna el mismo conjunto
  }
}
```

**Despacho dinámico de métodos**: Cuando ejecutamos `insertar` o `pertenece`, el método puede ejecutarse en `Vacio` o `NoVacio`. Esto no se puede determinar en tiempo de compilación, sino en tiempo de ejecución.

Podemos hacer que la clase `Vacio` solo tenga una instancia (patrón singleton) dado que no necesitamos diferentes instancias del conjunto vacío.

```scala
abstract class ConjEnt {
  def insertar(x: Int): ConjEnt
  def pertenece(x: Int): Boolean
}

// Objeto singleton que representa el conjunto vacío
object Vacio extends ConjEnt {
  def pertenece(x: Int): Boolean = false
  def insertar(x: Int): ConjEnt = new NoVacio(x, Vacio, Vacio)
}

class NoVacio(elem: Int, izq: ConjEnt, der: ConjEnt) extends ConjEnt {
  def pertenece(x: Int): Boolean = {
    if (x < elem) izq.pertenece(x)
    else if (x > elem) der.pertenece(x)
    else true
  }
  
  def insertar(x: Int): ConjEnt = {
    if (x < elem) new NoVacio(elem, izq.insertar(x), der)
    else if (x > elem) new NoVacio(elem, izq, der.insertar(x))
    else this
  }
}
```

Cuando tenemos mecanismos de herencia podemos hacer dos cosas con los métodos:

1. **Implementar**: Dar un cuerpo a un método abstracto que no está implementado en la superclase.
2. **Anular (override)**: Cambiar el comportamiento de un método ya implementado en la superclase.

```scala
override def toString: String = "nuevo texto"
```

También Scala nos permite definir herencia rápidamente con las **case class**:

```scala
// 'sealed' restringe todas las subclases a estar en el mismo archivo
sealed abstract class ConjEnt {
  def insertar(x: Int): ConjEnt
  def pertenece(x: Int): Boolean
}

// Case class para el conjunto vacío
case class Vacio() extends ConjEnt {
  def pertenece(x: Int): Boolean = false
  def insertar(x: Int): ConjEnt = NoVacio(x, Vacio(), Vacio())
}

// Case class para el conjunto no vacío
case class NoVacio(elem: Int, izq: ConjEnt, der: ConjEnt) extends ConjEnt {
  def pertenece(x: Int): Boolean = {
    if (x < elem) izq.pertenece(x)
    else if (x > elem) der.pertenece(x)
    else true
  }
  
  def insertar(x: Int): ConjEnt = {
    if (x < elem) NoVacio(elem, izq.insertar(x), der)
    else if (x > elem) NoVacio(elem, izq, der.insertar(x))
    else this
  }
}
```

Las implementaciones anteriores normalmente requerirían archivos separados (`ConjEnt.scala`, `Vacio.scala` y `NoVacio.scala`), pero podemos hacer todo en un solo archivo usando:

1. **sealed**: Hace que todas las clases hijas deban ser implementadas en el mismo archivo.
2. **case class**: Permite definir clases con funcionalidades adicionales (equals, hashCode, toString, pattern matching).

Cuando se compila, solo se genera un archivo `.class` por cada clase.

Podemos hacer **reconocimiento de patrones** usando case classes. Por ejemplo, para obtener una lista de enteros con los elementos de un conjunto:

```scala
// Función que convierte un conjunto en una lista de enteros (recorrido in-order)
def listaEnteros(conj: ConjEnt): List[Int] = {
  conj match {
    case Vacio() => List()  // Caso base: conjunto vacío retorna lista vacía
    case NoVacio(elm, izq, der) => {
      // Recursivamente obtiene las listas de los subárboles y las concatena
      List(elm) ++ listaEnteros(izq) ++ listaEnteros(der)
    }
  }
}

def main(args: Array[String]): Unit = {
  // Construcción de un árbol binario de búsqueda
  val conjA = NoVacio(
    10,
    NoVacio(
      8,
      NoVacio(
        6,
        Vacio(),
        Vacio()
      ),
      NoVacio(
        9,
        Vacio(),
        Vacio()
      )
    ),
    NoVacio(
      15,
      NoVacio(
        13,
        Vacio(),
        Vacio()
      ),
      NoVacio(
        16,
        Vacio(),
        Vacio()
      )
    )
  )
  println(listaEnteros(conjA))  // Imprime: List(6, 8, 9, 10, 13, 15, 16)
}
```

El reconocimiento de patrones nos permite trabajar con case classes directamente y extraer la información de sus campos.

**Traits** son un mecanismo para poder reutilizar código de diferentes fuentes (similar a las interfaces de Java), pero pueden tener métodos implementados. Los traits no tienen constructores, no pueden heredar de otras clases y no se pueden instanciar directamente.

```scala
class X extends ClaseBase with TraitA with TraitB {
  // Implementación de la clase
}
```

- **Trait**: Utilizarlo cuando no se requiere una cadena de herencia compleja y se necesita mezclar comportamientos.
- **Abstract class**: Utilizarlo cuando se requiere reutilización de clases en una cadena de herencia con estado compartido.

## Tabla de resumen

| Concepto | Descripción | Uso en Scala | Ejemplo |
|----------|-------------|--------------|---------|
| **Clase abstracta** | Clase que define una interfaz sin implementación completa, puede contener métodos abstractos y concretos. | `abstract class Nombre { ... }` | `abstract class ConjEnt` |
| **Herencia simple** | Cada clase puede heredar de una sola clase padre. | `class Hijo extends Padre` | `class Vacio extends ConjEnt` |
| **Método abstracto** | Método declarado sin implementación en una clase abstracta o trait. | `def metodo(): Tipo` | `def insertar(x: Int): ConjEnt` |
| **Override** | Redefinición de un método heredado de la superclase. | `override def metodo() = ...` | `override def toString` |
| **Despacho dinámico** | Selección en tiempo de ejecución de qué implementación de método ejecutar. | Automático en Scala | `conj.pertenece(5)` |
| **Singleton (object)** | Objeto único que representa una instancia global. | `object Nombre extends Clase` | `object Vacio extends ConjEnt` |
| **Case class** | Clase especial con funcionalidades automáticas (equals, hashCode, toString, pattern matching). | `case class Nombre(...)` | `case class NoVacio(...)` |
| **Sealed class** | Clase cuyas subclases deben estar definidas en el mismo archivo. | `sealed abstract class Nombre` | `sealed abstract class ConjEnt` |
| **Pattern matching** | Mecanismo para descomponer estructuras de datos según su forma. | `valor match { case ... }` | `conj match { case Vacio() => ... }` |
| **Trait** | Mecanismo para composición de comportamientos, similar a interfaces con implementación. | `trait Nombre { ... }` | `trait Ordenable { ... }` |
| **Composición con traits** | Mezclar múltiples traits en una clase. | `class X extends A with B with C` | `class MiClase extends Base with T1 with T2` |

## Comentarios adicionales

1. **Inmutabilidad**: La implementación presentada del conjunto es inmutable. Cada operación de inserción retorna un nuevo conjunto en lugar de modificar el existente.

2. **Árbol binario de búsqueda**: La estructura `NoVacio` implementa un ABB donde los elementos menores están en el subárbol izquierdo y los mayores en el derecho.

3. **Eficiencia**: En un ABB balanceado, las operaciones `pertenece` e `insertar` tienen complejidad $O(\log n)$. En el peor caso (árbol degenerado), la complejidad es $O(n)$.

4. **Ventajas de case classes**:
   - Implementación automática de `equals` y `hashCode`
   - Método `copy` para crear copias modificadas
   - Soporte nativo para pattern matching
   - Método `toString` legible

5. **Sealed traits/classes**: Son especialmente útiles para definir tipos algebraicos de datos (ADTs), donde el compilador puede verificar la exhaustividad del pattern matching.

6. **Diferencias clave entre abstract classes y traits**:
   - Las abstract classes pueden tener parámetros de constructor, los traits no.
   - Las abstract classes pueden tener inicialización de variables, los traits tienen campos abstractos.
   - En la resolución lineal de métodos, las traits son más flexibles para composición múltiple.

7. **Aplicaciones prácticas**: Este patrón de diseño (clase abstracta con case classes) es común en:
   - Representación de expresiones en compiladores
   - Árboles sintácticos abstractos (AST)
   - Estructuras de datos funcionales persistentes