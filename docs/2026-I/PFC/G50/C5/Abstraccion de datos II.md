# Abstracción de datos II

## Validación con `require`

Para establecer una precondición en la creación de objetos, utilizamos `require`. En el caso de la clase `Racional`, debemos garantizar que el denominador no sea cero. Además, es una buena práctica exigir que sea positivo para mantener una representación consistente (el signo se maneja en el numerador).

```scala
class Racional(x: Int, y: Int) {

    // Precondición: el denominador debe ser positivo
    // Si no se cumple, se lanza IllegalArgumentException antes de crear el objeto
    require(y > 0, "El denominador debe ser positivo")
    
    // Método privado: cálculo del máximo común divisor (algoritmo de Euclides)
    private def mcd(a: Int, b: Int): Int = 
        if (b == 0) a else mcd(b, a % b)
    
    // Campos simplificados al crear la instancia
    val numer = x / mcd(x, y)
    val denom = y / mcd(x, y)
    
    // Método de suma
    def suma(r: Racional): Racional = {
        new Racional(
            this.numer * r.denom + r.numer * this.denom,
            this.denom * r.denom
        )
    }
    
    // Método de resta
    def resta(r: Racional): Racional = {
        new Racional(
            this.numer * r.denom - r.numer * this.denom,
            this.denom * r.denom
        )
    }
    
    // Continúa con otras operaciones (multiplicación, división, etc.)
    
    // Método toString para representación legible
    override def toString = this.numer + "/" + this.denom
}
```

Con `require`, la validación falla **antes** de que el objeto sea creado. Por ejemplo:
- `new Racional(10, 0)` lanzará una excepción porque el denominador es cero.
- `new Racional(20, -2)` lanzará una excepción porque el denominador no es positivo.

En estos casos, se lanzará una excepción `IllegalArgumentException` con el mensaje proporcionado.

## Diferencia entre `require` y `assert`

- **`require`**: Se utiliza para validar las **precondiciones** de los parámetros de entrada (condiciones que debe cumplir el cliente al invocar el constructor o método). Lanza `IllegalArgumentException`.
- **`assert`**: Se utiliza para verificar **condiciones internas** del programa (invariantes, postcondiciones). Lanza `AssertionError`. Es comúnmente utilizado en pruebas de software y para verificar suposiciones durante el desarrollo.

---

## Tabla de resumen

Concepto | Descripción | Ejemplo/Implementación |
| --- | --- | --- |
| **Precondición** | Condición que debe cumplirse antes de que se ejecute un método o se cree un objeto. | En `Racional`, el denominador debe ser positivo. |
| **`require`** | Función en Scala que valida una precondición. Si falla, lanza `IllegalArgumentException`. | `require(y > 0, "El denominador debe ser positivo")` |
| **Validación temprana** | La validación ocurre antes de que el objeto sea completamente construido, evitando estados inválidos. | `require` se ejecuta al inicio del constructor. |
| **`IllegalArgumentException`** | Excepción lanzada cuando un argumento pasado a un método o constructor no es válido. | Se lanza si `y <= 0` en `new Racional(x, y)`. |
| **`assert`** | Función que verifica una condición interna del programa; usada para debugging y pruebas. Lanza `AssertionError`. | `assert(numer > 0, "El numerador debe ser positivo después de la simplificación")` |
| **Invariante de clase** | Propiedad que se mantiene verdadera para todas las instancias de la clase durante su ciclo de vida. | En `Racional`: `denom > 0` y la fracción está simplificada. |
| **Manejo de signos** | Convención para representar fracciones: el signo se lleva en el numerador, denominador siempre positivo. | `require(y > 0)` asegura denominador positivo; signo manejado en `numer`. |

## Comentarios adicionales

- El uso de `require` es una práctica esencial en el diseño de clases robustas, ya que garantiza que los objetos se creen en un estado válido (principio de "fallar rápido").
- La elección de exigir denominador positivo (en lugar de simplemente distinto de cero) es una decisión de diseño que simplifica la lógica de operaciones y comparaciones, evitando múltiples representaciones equivalentes (ej: 1/2 y -1/-2).
- En Scala, `require` es una función definida en `Predef` que está disponible automáticamente en todos los programas.
- Es importante distinguir claramente entre:
  - **Errores del cliente** (precondiciones violadas) → se manejan con `require`.
  - **Errores internos del programa** (invariantes violadas) → se manejan con `assert`.
- Para una implementación más completa, podrían considerarse precondiciones adicionales, como evitar desbordamientos numéricos en operaciones con números muy grandes.
- El mensaje de error en `require` debe ser descriptivo para ayudar al desarrollador a entender rápidamente la causa del fallo.
- En un contexto de producción, estas excepciones podrían capturarse y transformarse en respuestas de error más amigables para el usuario final.