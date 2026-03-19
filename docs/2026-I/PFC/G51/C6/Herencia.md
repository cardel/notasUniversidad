# Herencia

La herencia en programación orientada a objetos permite reutilizar clases ya implementadas.

1. **Clase abstracta**: Define una interfaz sin una implementación completa.
2. **Herencia simple**: Solo se puede heredar de una clase. La herencia múltiple permite heredar de varias clases, pero puede generar problemas como el "diamante" en árboles de ancestros.
3. **Traits**: Permiten mezclar comportamiento de múltiples fuentes sin los problemas de la herencia múltiple clásica.

## Despacho dinámico de métodos

Cuando tenemos métodos definidos en clases que heredan de otra, estos se ejecutan de acuerdo al tipo real del objeto en tiempo de ejecución. Esto no puede determinarse en tiempo de compilación, solo durante la ejecución.

```scala
// Clase abstracta que define un contrato para los mamíferos
abstract class Mamifero(nombre: String) {
  def sonido(): String  // Método abstracto, debe ser implementado por las subclases
}

// Subclase Perro que extiende Mamifero
class Perro(nombre: String, color: String) extends Mamifero(nombre) {
  def sonido(): String = "guau"  // Implementación específica para Perro
}

// Subclase Gato que extiende Mamifero
class Gato(nombre: String, velocidad: Double) extends Mamifero(nombre) {
  def sonido(): String = "miau"  // Implementación específica para Gato
}
```

Podemos ejecutar el método `sonido()` de un `Mamifero`, pero dependiendo del tipo real del objeto (Perro o Gato), se retornará "guau" o "miau".

## Anulación de métodos

1. **Implementación**: Cuando extendemos una clase abstracta y el método no está definido (es abstracto), procedemos a definirlo (implementarlo).
2. **Anulación (override)**: Cuando extendemos una clase concreta y el método ya está definido, procedemos a reescribirlo usando la palabra clave `override`.

## Objetos únicos

En Java se utiliza `static` para definir miembros de clase que no requieren instanciación. En Scala, usamos `object` para definir un objeto único (singleton) que no se puede instanciar y se utiliza directamente.

## Conceptos adicionales

**Polimorfismo**: Capacidad de objetos de diferentes clases de responder al mismo mensaje (método) de manera específica. El despacho dinámico es un mecanismo que implementa polimorfismo.

**Encapsulación**: La herencia respeta la encapsulación, ya que las subclases pueden acceder a los miembros protegidos (`protected`) de la superclase, pero no a los privados (`private`).

**Constructores en herencia**: En Scala, los constructores de las subclases deben llamar al constructor de la superclase, típicamente pasando los parámetros requeridos.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| Herencia | Mecanismo que permite crear nuevas clases basadas en clases existentes, reutilizando código y estableciendo relaciones jerárquicas | `class Perro extends Mamifero` |
| Clase abstracta | Clase que no puede instanciarse y puede contener métodos abstractos (sin implementación) y concretos (con implementación) | `abstract class Mamifero` |
| Herencia simple | Una clase solo puede heredar directamente de una superclase | Scala solo permite herencia simple de clases |
| Traits | Mecanismos que permiten composición de comportamiento, similar a interfaces en Java pero con implementación | `trait Nadador { def nadar() }` |
| Despacho dinámico | Selección en tiempo de ejecución de la implementación de un método basado en el tipo real del objeto | `mamifero.sonido()` puede llamar a `Perro.sonido()` o `Gato.sonido()` |
| Anulación (override) | Redefinición de un método heredado de la superclase en la subclase | `override def sonido() = "miau"` |
| Objeto único (Singleton) | Objeto del que solo existe una instancia en toda la aplicación | `object Configuracion { val timeout = 5000 }` |
| Polimorfismo | Capacidad de objetos de diferentes tipos de responder al mismo mensaje de forma específica | Un `Mamifero` puede ser tratado como `Perro` o `Gato` |

## Comentarios adicionales

- La herencia establece una relación "es-un" entre clases, mientras que la composición establece una relación "tiene-un".
- En Scala, los `traits` son preferidos sobre la herencia múltiple de clases porque evitan los problemas del diamante mediante linearización.
- El uso excesivo de herencia puede llevar a jerarquías de clases frágiles y difíciles de mantener (fragile base class problem).
- El principio de sustitución de Liskov establece que los objetos de una superclase deben poder ser reemplazados por objetos de sus subclases sin alterar la corrección del programa.
- En diseño orientado a objetos, se recomienda favorecer la composición sobre la herencia cuando sea posible.