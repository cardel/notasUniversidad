# Notación infija

Cuando un método tiene exactamente un parámetro de entrada (además del parámetro implícito `this`), Scala permite utilizar notación infija. Esto significa que el método puede ser invocado colocando el objeto receptor, un espacio, el nombre del método, y luego el argumento.

Realmente, el método tiene dos parámetros:
1. `this` (implícito)
2. El parámetro explícito del método

Por ejemplo, en el caso de la clase `Racional`:

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

Puedo invocar los métodos de dos formas:

```scala
val r1 = new Racional(1, 2)
val r2 = new Racional(2, 3)
r1.suma(r2) // Forma tradicional (notación de punto)
r1 suma r2   // Notación infija: aquí se entiende que r1 es 'this' y r2 es el parámetro de 'suma'
```

## Operadores como métodos

Para mejorar el nivel de abstracción, Scala nos permite utilizar símbolos como `+`, `-`, `*`, `/` como nombres de métodos. Además, respeta el orden de precedencia de operadores (primero se hace `*` y luego `+`).

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
    
    // Método de suma usando el operador '+'
    def +(r: Racional): Racional = {
        new Racional(
            this.numer * r.denom + r.numer * this.denom,
            this.denom * r.denom
        )
    }
    
    // Método de resta usando el operador '-'
    def -(r: Racional): Racional = {
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

Entonces podemos usar:

```scala
val r1 = new Racional(1, 2)
val r2 = new Racional(2, 3)
r1.+(r2) // Forma tradicional (notación de punto)
r1 + r2  // Notación infija con operador: aquí se entiende que r1 es 'this' y r2 es el parámetro del método '+'
```

## Abstracción y equivalencia natural

Ahora podemos modificar el comportamiento del lenguaje para crear una equivalencia natural:

```scala
val unMedio = new Racional(1, 2)
val unSexto = new Racional(1, 6)

// Podemos operar con ellos de forma natural
val resultado = unMedio + unSexto  // Equivalente a: 1/2 + 1/6
```

En este punto, no nos damos cuenta directamente de que estamos trabajando con objetos, sino que los tratamos como números matemáticos. Esto eleva el nivel de abstracción, permitiéndonos pensar en términos del dominio del problema en lugar de los detalles de implementación.

## Aplicaciones prácticas

Esto tiene múltiples aplicaciones, ya que nos permite pensar en alto nivel sin preocuparnos por lo que ocurre por debajo, sino en cómo se comporta el sistema. Un ejemplo de esto son los **DTO (Data Transfer Objects)** u **ORM (Object-Relational Mapping)**:

- Tenemos una clase que representa una tabla en una base de datos.
- Sobre esta clase podemos realizar operaciones CRUD (Create, Read, Update, Delete) sin saber SQL directamente.
- Esto permite reducir errores comunes, como hacer `UPDATE` o `DELETE` sin cláusula `WHERE`, ya que la abstracción puede prevenir operaciones peligrosas.
- El código se vuelve más expresivo y menos propenso a errores sintácticos de SQL.

---

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **Notación infija** | Sintaxis que permite invocar métodos de un parámetro colocando el objeto receptor, un espacio, el nombre del método y el argumento. | `r1 suma r2` en lugar de `r1.suma(r2)` |
| **Métodos con operadores** | En Scala, los operadores como `+`, `-`, `*`, `/` son simplemente métodos con nombres simbólicos. | `def +(r: Racional): Racional` |
| **Precedencia de operadores** | Scala respeta la precedencia matemática estándar cuando se usan operadores como nombres de métodos. | `*` y `/` tienen mayor precedencia que `+` y `-` |
| **Abstracción elevada** | Uso de operadores para hacer que los objetos se comporten como tipos primitivos, ocultando detalles de implementación. | `r1 + r2` se ve como suma matemática, no como invocación de método |
| **Equivalencia natural** | Capacidad de hacer que la sintaxis de los objetos imite la sintaxis natural del dominio del problema. | `new Racional(1, 6)` representa matemáticamente $\frac{1}{6}$ |
| **DTO/ORM** | Patrones de diseño donde objetos representan estructuras de datos externas (como tablas de BD), abstraendo los detalles de acceso. | Clase `Usuario` que mapea a tabla `usuarios` en BD |
| **Prevención de errores** | Las abstracciones bien diseñadas pueden prevenir errores comunes al encapsular operaciones peligrosas. | Evitar `DELETE` sin `WHERE` mediante métodos seguros en la abstracción |

## Comentarios adicionales

- La notación infija no es exclusiva de métodos con nombres simbólicos; funciona con cualquier método que tome exactamente un parámetro.
- En Scala, la precedencia de operadores está determinada por el primer carácter del nombre del método:
  - Los operadores que comienzan con `*`, `/`, `%` tienen mayor precedencia.
  - Les siguen `+` y `-`.
  - Los operadores que no son alfanuméricos generalmente tienen menor precedencia.
- Esta característica de Scala permite el desarrollo de **DSLs (Domain-Specific Languages)** internos, donde se puede crear sintaxis específica para un dominio particular.
- El uso de operadores debe ser moderado y claro; operadores muy oscuros pueden reducir la legibilidad del código.
- La capacidad de definir operadores personalizados es poderosa pero debe usarse con criterio, manteniendo siempre la **principio de menor asombro**: el comportamiento de los operadores debe ser intuitivo para otros desarrolladores.
- En el contexto de DTO/ORM, esta abstracción permite escribir código que es más resistente a cambios en el esquema de la base de datos, ya que los cambios se encapsulan en la clase.