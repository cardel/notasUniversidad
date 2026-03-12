# Abstracción

Hasta el momento hemos construido abstracciones funcionales: funciones a partir de otras funciones.

Ahora nos vamos a enfocar en la **abstracción de datos**: datos compuestos a partir de datos más simples.

- **Elevar el nivel conceptual**: Pensar en el objeto compuesto desde su funcionalidad. Ejemplo: una clase que mapea una tabla en una base de datos (CRUD). Esto normalmente requiere SQL, pero podemos crear un objeto que evite escribir consultas SQL directamente, usando sus métodos para manipular la tabla.
- **Incrementar la modularidad**: Al separar la funcionalidad, podemos tener una clase que represente un producto en un modelo de negocio.
- **Fortalecer el poder expresivo**: Utilizar el tipo generado como si fuera un dato primitivo del lenguaje.

# Objetos en Scala

```scala
// Definición de una clase con tres parámetros en el constructor
class Example(a: Int, b: Int, c: Boolean) {
    // Métodos para acceder a los campos (getters)
    def campo1 = a
    def campo2 = b
    def campo3 = c
}

// Creación de una instancia de la clase Example
val objExample = new Example(5, 10, true)
```

La clase `Example` tiene un constructor con tres parámetros, que se mapean a los métodos `campo1`, `campo2` y `campo3`. Al inicializar un objeto de la clase, debemos proporcionar valores para `a`, `b` y `c`.

```scala
// Acceso a los campos del objeto
objExample.campo1
objExample.campo2
objExample.campo3
```

## Enfoque 1: Funciones externas

Podemos crear funciones independientes para operar con los datos:

```scala
// Funciones externas que operan sobre el tipo Racional
// Este enfoque dispersa la lógica relacionada con el tipo
def suma(r: Racional, s: Racional): Racional = {
    // Implementación de la suma
}

def mult(r: Racional, s: Racional): Racional = {
    // Implementación de la multiplicación
}

def div(r: Racional, s: Racional): Racional = {
    // Implementación de la división
}

def pow(r: Racional, s: Racional): Racional = {
    // Implementación de la potencia
}
```

Este es un mal enfoque porque tenemos muchas funciones dispersas para un solo tipo de dato, lo que reduce la cohesión.

## Enfoque 2: Métodos dentro de la clase

```scala
// Definición de la clase Racional con métodos internos
class Racional(x: Int, y: Int) {
    // Métodos para acceder al numerador y denominador
    def numer = x
    def denom = y
    
    // Método para multiplicar dos números racionales
    // 'this' representa la instancia actual del objeto
    def mult(r: Racional): Racional = {
        new Racional(this.numer * r.numer, this.denom * r.denom)
    }
    
    // Sobrescritura del método toString para representación legible
    override def toString = numer + "/" + denom
    
    // Método para sumar dos números racionales
    def suma(s: Racional): Racional = {
        // Implementación de la suma
    }
    
    // Método para multiplicar (ya definido arriba, se muestra como ejemplo de estructura)
    def mult(s: Racional): Racional = {
        // Implementación de la multiplicación
    }
    
    // Método para dividir dos números racionales
    def div(s: Racional): Racional = {
        // Implementación de la división
    }
    
    // Método para calcular la potencia
    def pow(s: Racional): Racional = {
        // Implementación de la potencia
    }
}
```

En este caso, observe que hemos eliminado un parámetro en los métodos de operación, porque el racional actual se puede acceder con la variable `this`.

**This** (o ligadura dinámica) es la representación de la instancia de la clase. Contiene la clase con sus valores inicializados. Cuando usamos métodos, los invocamos desde `this`. Esta variable representa la instanciación del objeto y permite que cada instancia tenga un comportamiento diferente según sus valores.

En el caso de Python:

```python
# Definición de una clase Persona en Python
>>> class Persona:
     def __init__(self, nombre, edad):
         # 'self' es explícito en Python, equivalente a 'this' en Scala
         self.nombre = nombre
         self.edad = edad

>>> personaA = Persona("Juan", 25)
>>> personaA
<__main__.Persona object at 0x7f533a96b770>
>>> personaA.nombre
'Juan'
>>> personaA.edad
25
```

En Python, observe que el `self` (equivalente a `this`) se declara de forma explícita en los métodos.

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| Abstracción funcional | Construir funciones a partir de otras funciones para ocultar detalles de implementación. | `def suma(a:Int, b:Int) = a + b` |
| Abstracción de datos | Crear tipos compuestos a partir de tipos simples para elevar el nivel de conceptualización. | Clase `Racional` que combina dos enteros. |
| Clase | Molde o plantilla que define la estructura y comportamiento de un tipo de dato. | `class Racional(x:Int, y:Int)` |
| Constructor | Método especial que inicializa los atributos de un objeto al crearlo. | `new Example(5, 10, true)` |
| Método | Función definida dentro de una clase que opera sobre los datos de la instancia. | `def mult(r:Racional):Racional` |
| This/self | Referencia a la instancia actual del objeto, usada para acceder a sus atributos y métodos. | `this.numer` en Scala, `self.nombre` en Python. |
| Encapsulación | Agrupar datos y métodos que operan sobre ellos dentro de una unidad (clase). | Métodos `suma`, `mult`, `div` dentro de `Racional`. |
| Modularidad | Separar funcionalidad en componentes independientes y cohesivos. | Clase `Producto` en un modelo de negocio. |
| Poder expresivo | Usar tipos definidos por el usuario como si fueran tipos primitivos del lenguaje. | Operar con `Racional` igual que con `Int` o `Double`. |

## Comentarios adicionales

- La abstracción de datos permite modelar entidades del mundo real de manera más fiel que usando solo tipos primitivos.
- En Scala, los parámetros del constructor pueden usarse directamente en el cuerpo de la clase sin necesidad de declararlos como campos explícitos (a menos que se necesiten como métodos de acceso).
- El uso de `this` es implícito en Scala cuando se hace referencia a miembros de la instancia actual, pero puede usarse explícitamente para claridad o cuando hay conflictos de nombres.
- La sobreescritura del método `toString` es crucial para obtener representaciones legibles de los objetos al depurar o imprimir.
- Comparado con Python, Scala tiene una sintaxis más concisa para la definición de clases y métodos, pero ambos lenguajes comparten los mismos principios de la programación orientada a objetos.
- Un buen diseño orientado a objetos mantiene la cohesión alta (métodos relacionados en una misma clase) y el acoplamiento bajo (dependencias mínimas entre clases).