## Currificación

La currificación es una técnica en programación funcional que transforma funciones con múltiples parámetros en una secuencia de funciones de un solo parámetro.

### Ejemplo básico

```scala
// Función normal de dos parámetros
def f(a: Int, b: Int): Int = {
  a * b
}

// Función currificada
def f(a: Int)(b: Int): Int = {
  a * b
}
```

**Diferencias de tipo:**
- `f(a: Int, b: Int): Int` tiene tipo `(Int, Int) => Int`
- `f(a: Int)(b: Int): Int` tiene tipo `Int => (Int => Int)`

### Fundamentos matemáticos

Matemáticamente, la currificación transforma:
$$f(a, b) = g(h(a))(b) = (g \circ h)(a)(b)$$

Donde:
- $h(a)$ produce una función intermedia
- $g$ es la aplicación de esa función a $b$

### Utilidad en abstracción funcional

La currificación es particularmente útil en la abstracción funcional porque:

```scala
class Pollito(nombre: String) {
  def llorar(self: String): String = {
    self + this.nombre
  }
}

val objPollito = Pollito("Pepe")
```

**Equivalencias de llamada:**
```scala
// Notación estándar
objPollito.llorar("Gane funcional")

// Notación infija (posible gracias a la estructura de un parámetro)
objPollito llorar "Gane funcional"

// Equivalente funcional (this implícito + parámetro explícito)
llorar(objPollito, "Gane funcional")
```

### Ventajas de la currificación

1. **Composición funcional**: Permite crear funciones parcialmente aplicadas
2. **Flexibilidad sintáctica**: Habilita la notación infija
3. **Consistencia estructural**: Mantiene el esquema de dos "parámetros":
   - `this` (implícito, instancia de clase)
   - Parámetro explícito del método

4. **Reutilización**: Facilita la creación de funciones especializadas:
```scala
val duplicar = f(2)_  // Función que multiplica por 2
duplicar(5)           // Resultado: 10
```

La currificación es fundamental para el diseño de APIs funcionales y permite un estilo de programación más declarativo y composible.