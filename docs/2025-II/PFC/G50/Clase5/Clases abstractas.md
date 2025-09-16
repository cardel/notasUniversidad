# Definiciones
Son aquellas que no pueden ser instanciadas, en Scala podemos definir metodos dentro de ellas.

1. abstract class que puede heredar de otra clase
2. trait que son equivalentes a las interfaces

# Uso
Cuando declaramos una clase abstracta o un trait, no podemos instanciarlos, si no que debemos crear una clase hija que herede de ellos y esta define o sobreescribe los métodos

## Ejemplo conjuntos

Conjunto: Es una colección de elementos que no se
repiten.

Conjunto vacio que no tiene elementos
Conjunto noVacio que tiene elementos, este se define
como un elemento y dos conjuntos.

Vamos a llenar el conjunto como arbol binario, en la
izquierda de un nodo estan los elementos menores al 
actual y la derecha los mayores

![](attachments/Pasted%20image%2020250916092557.png)

Para esto vamos a definir que dado un nodo los elementos a izquierda son menores, para esto vamos a utilizar una clase abstracta

```scala
abstract class Set() {
  def insert(n:Int):Set
  def belongs(n:Int):Boolean
}
```


Definimos los conjuntos vacios

```scala
class EmptySet extends Set{
  def insert(n:Int):Set = {
    new NonEmptySet(
      n,
      new EmptySet(),
      new EmptySet()
      )
  }
  def belongs(n:Int):Boolean = false
  override
  def toString():String = ""
}
```

Definimos los conjuntos novacios

```scala
class NonEmptySet(k:Int, left:Set, right:Set) extends Set{
  def insert(n:Int):Set = {
    if (n < k) new NonEmptySet(k, left.insert(n), right)
    else {
      if (n == k) this
      else new NonEmptySet(k, left, right.insert(n))
    }
  }
  def belongs(n:Int):Boolean = {
    if (n==k) true
    else {
      if (n<k) left.belongs(n)
      else right.belongs(n)
    }
  }
  override
  def toString():String = {
    this.k + "(" + this.left.toString() + ")" + "(" + this.right.toString() + ")"
  }
}
```
Ahora usamos los métodos
```scala
abstract class Set() {
  def insert(n:Int):Set
  def belongs(n:Int):Boolean
}

```
## Explicacion ejemplo
### 1. Abstracción funcional

La implementación utiliza **abstracción funcional** mediante una jerarquía de clases que encapsulan el comportamiento de conjuntos matemáticos. La clase abstracta `Set` define la interfaz funcional con operaciones esenciales (`insert` y `belongs`), mientras que las implementaciones concretas (`EmptySet` y `NonEmptySet`) proporcionan la lógica específica.

- **EmptySet**: Representa el conjunto vacío con comportamiento canónico (insertar crea un nuevo conjunto, pertenencia siempre falsa).
- **NonEmptySet**: Implementa un árbol binario de búsqueda donde:
  - Los elementos menores van al subárbol izquierdo
  - Los elementos mayores van al subárbol derecho
  - La inserción y búsqueda siguen el patrón recursivo típico de BST

La abstracción permite tratar ambos tipos de conjuntos de manera uniforme a través de la interfaz común.

### 2. Despacho dinámico de métodos

El **despacho dinámico** ocurre en las llamadas recursivas a `insert` y `belongs`. Cuando se invoca `left.insert(n)` o `right.insert(n)` en `NonEmptySet`, el método específico que se ejecuta se determina en tiempo de ejecución según el tipo real del objeto referenciado por `left` o `right`.

Ejemplos:
- `left.insert(n)` puede ejecutar `EmptySet.insert` o `NonEmptySet.insert` dependiendo del tipo concreto de `left`
- `left.belongs(n)` se resuelve dinámicamente según la implementación concreta

Este mecanismo permite la recursión polimórfica esencial para la estructura arbórea.

### 3. Clases abstractas vs Traits

**Clase abstracta** (`Set`):
- Define interfaz incompleta que debe ser implementada por subclases
- Permite parámetros de constructor
- Establece una relación "es-un" fuerte
- Soporta herencia simple

**Traits** (alternativa en Scala):
- Similar a interfaces con implementación parcial
- No permiten parámetros de constructor
- Soportan mixin composition (herencia múltiple)
- Mejor para composición horizontal de comportamiento

La diferencia principal: las clases abstractas son más adecuadas para jerarquías de tipos con estado compartido, mientras los traits son mejores para composición modular de funcionalidades. En este caso, una clase abstracta es apropiada por la relación de herencia clara entre conjuntos vacíos y no vacíos.