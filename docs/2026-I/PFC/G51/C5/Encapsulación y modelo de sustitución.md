# Encapsulación y modelo de sustitución

# Encapsulación

Las clases nos permiten determinar cómo se accede a los campos mediante modificadores de acceso:

1. **Público (public)**: Accesible desde cualquier parte. Es el acceso por defecto en Scala.
2. **Privado (private)**: Accesible únicamente por la misma clase.
3. **Protegido (protected)**: Accesible por la misma clase y sus subclases (herencia).

```scala
// Clase Racional que implementa números racionales con encapsulación
class Racional(x: Int, y: Int) {
    // Método privado para calcular el máximo común divisor
    // Solo accesible dentro de la clase Racional
    private def mcd(a: Int, b: Int): Int =
        if (b == 0) a else mcd(b, a % b)
    
    // Campo privado que almacena el máximo común divisor
    // No accesible desde fuera de la clase
    private val m = mcd(x, y)
    
    // Métodos públicos para acceder al numerador y denominador simplificados
    def numer = x / m
    def denom = y / m
    
    // Método público para sumar dos números racionales
    def suma(r: Racional) =
        new Racional(
            numer * r.denom + denom * r.numer,
            denom * r.denom
        )
    
    // Sobrescritura del método toString para representación legible
    override def toString = numer + "/" + denom
}
```

En este caso son accesibles desde fuera de la clase:
- `numer`
- `denom`
- `suma(r)`

No son accesibles desde fuera de la clase:
- `m` (campo privado)
- `mcd` (método privado)

Dado que estos valores únicamente son de interés interno de la misma clase para la simplificación de fracciones.

En este punto controlamos lo que queremos que se pueda acceder y lo que no, aplicando el principio de encapsulación.

# This

Es la referencia a la instancia actual de la clase. Implícitamente, cualquier llamado a un campo o método de la clase tiene `this` como referencia implícita.

```scala
class Racional(x: Int, y: Int) {
    // ...
    def funcion(r: Racional) {
        numer          // Es lo mismo que this.numer
        this.funcion2(..)  // También se puede escribir como funcion2(...)
    }
}
```

Todo llamado a los campos de la clase tiene `this` implícito, y todo llamado a métodos también. El uso explícito de `this` es opcional a menos que haya conflictos de nombres entre parámetros y campos de la clase.

# Precondiciones

## require

El método `require` define una condición que se debe cumplir (precondición) para poder instanciar la clase. Si no se cumple, lanza una `IllegalArgumentException` y no crea el objeto.

```scala
class Racional(x: Int, y: Int) {
    // Precondición: el denominador no puede ser cero
    require(y != 0, "El denominador debe ser distinto de cero")
    
    // Resto de la implementación...
}
```

## Assert

El método `assert` verifica una condición después de creado el objeto. Genera una `AssertionError` si no se cumple. Se usa principalmente en pruebas de software y desarrollo, y puede ser deshabilitado en producción.

```scala
class Racional(x: Int, y: Int) {
    require(y != 0, "El denominador debe ser distinto de cero")
    
    private val m = mcd(x, y)
    def numer = x / m
    def denom = y / m
    
    // Verificación post-construcción
    assert(denom != 0, "El denominador simplificado no debe ser cero")
    
    // Resto de la implementación...
}
```

La diferencia principal entre `require` y `assert` es:
- `require`: Verifica condiciones previas a la creación del objeto (precondiciones).
- `assert`: Verifica condiciones que deben ser siempre verdaderas (invariantes), principalmente para depuración.

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Uso en Scala |
|----------|-------------|--------------|
| Encapsulación | Principio de ocultar los detalles internos de implementación y exponer solo una interfaz pública. | Modificadores `private`, `protected`, y acceso público por defecto. |
| Modificador private | Restringe el acceso a miembros solo dentro de la misma clase. | `private def mcd(...)` o `private val m`. |
| Modificador protected | Permite acceso dentro de la clase y sus subclases. | `protected def metodoProtegido()`. |
| This | Referencia a la instancia actual de la clase, implícita en Scala. | `this.numer` o simplemente `numer`. |
| Precondiciones | Condiciones que deben cumplirse antes de crear un objeto o ejecutar un método. | `require(condición, "mensaje")`. |
| Postcondiciones | Condiciones que deben cumplirse después de crear un objeto o ejecutar un método. | `assert(condición, "mensaje")`. |
| Invariantes de clase | Propiedades que deben mantenerse verdaderas durante toda la vida del objeto. | Verificados con `assert` en métodos críticos. |
| Modelo de sustitución | Principio que permite tratar objetos de subclases como objetos de la superclase. | Relacionado con herencia y polimorfismo (no cubierto en este ejemplo). |

## Comentarios adicionales

- La encapsulación es uno de los cuatro pilares de la programación orientada a objetos, junto con la abstracción, herencia y polimorfismo.
- En Scala, a diferencia de Java, los modificadores de acceso pueden tener alcances más específicos usando modificadores de visibilidad como `private[this]` o `private[nombrePaquete]`.
- El uso de `require` es esencial para garantizar la consistencia de los objetos desde su creación, implementando el concepto de "objetos bien formados".
- Los métodos `assert` son útiles durante el desarrollo pero pueden tener impacto en el rendimiento. En Scala, se pueden deshabilitar con la opción `-Xdisable-assertions`.
- La encapsulación no solo protege los datos, sino también la lógica de implementación, permitiendo cambiar la implementación interna sin afectar a los clientes de la clase.
- Un buen diseño orientado a objetos sigue la regla "lo más privado posible": exponer solo lo necesario y mantener todo lo demás privado.
- El modelo de sustitución (Principio de Liskov) es fundamental para la herencia: los objetos de una subclase deben poder usarse en lugar de objetos de la superclase sin alterar el comportamiento correcto del programa.