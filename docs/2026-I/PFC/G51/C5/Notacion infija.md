# Notación infija

Dado que tenemos funciones currificadas, estas van a tener dos argumentos de entrada:

1. `this` que es implícito
2. `arg`: argumento de entrada explícito

```scala
def f(x: Int): Int = ...
```

Esta función tiene dos argumentos: `this` que es implícito y `x` que es explícito.

Esto nos permite usar la notación infija:

```scala
class Racional(x: Int, y: Int) {
    // ...
    def suma(r: Racional): Racional = {}
}

val p = new Racional(3, 2)
val q = new Racional(4, 5)

// Notación punto tradicional
p.suma(q)

// Notación infija (equivalente a la anterior)
p suma q
```

En la notación infija, `suma` actúa como una función externa que recibe dos argumentos: `this` (que es `p`) y `q` (que es `r`).

```scala
// Esquema conceptual de cómo funciona
def suma(this: Racional, r: Racional): Racional
```

Adicionalmente, Scala permite usar símbolos como `+`, `-`, `*` como nombres de funciones, y estos respetan el orden de precedencia de operadores.

```scala
// Clase Racional con operadores simbólicos
class Racional(x: Int, y: Int) {
    // Precondición: el denominador debe ser positivo
    require(y > 0, "y debe ser mayor que 0")

    // Método privado para calcular el máximo común divisor
    private def mcd(a: Int, b: Int): Int = {
        if (b == 0) a
        else mcd(b, a % b)
    }
    
    // Campos simplificados usando el máximo común divisor
    val m = mcd(x, y)
    val denom = y / m
    val numer = x / m

    // Operador de suma (+) para números racionales
    def +(r: Racional): Racional = {
        new Racional(
            this.numer * r.denom + this.denom * r.numer,
            this.denom * r.denom
        )
    }

    // Operador de multiplicación (*) para números racionales
    def *(r: Racional): Racional = {
        new Racional(
            this.numer * r.numer,
            this.denom * r.denom
        )
    }
    
    // Sobrescritura del método toString para representación legible
    override def toString = this.numer + "/" + this.denom
}

object Main {
    def main(arr: Array[String]): Unit = {
        val r1 = new Racional(2, 3)
        val r2 = new Racional(3, 4)
        
        // Uso de operadores con notación infija
        println(r1 + r2 * r1)      // Respetando precedencia de operadores
        println(r1 + (r2 * r1))    // Equivalente explícito
        println((r1 + r2) * r1)    // Diferente agrupación (puede dar resultado diferente)
        
        /*
         * Ejemplo conceptual:
         * 1/4 = new Racional(1, 4)
         * Si pudiese escribir x/y y esto hiciera new Racional(x, y)
         * No notaría que son clases
         */
    }
}
```

Esto nos permite abstraer totalmente el concepto de `Racional` como un número, ignorando el hecho de que está implementado como una clase. Un ejemplo clásico de esto son los tipos de datos en Python.

Esto tiene aplicaciones en todas partes. Por ejemplo, en Java es usual representar una tabla de base de datos como un objeto. Este objeto nos ofrece las funciones CRUD sin necesidad de preocuparse por SQL.

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| Notación infija | Sintaxis que permite escribir `a.metodo(b)` como `a metodo b`. | `p suma q` en lugar de `p.suma(q)`. |
| Operadores simbólicos | Uso de símbolos como `+`, `-`, `*`, `/` como nombres de métodos. | `def +(r: Racional): Racional`. |
| Precedencia de operadores | Orden en que se evalúan los operadores cuando aparecen juntos. | `r1 + r2 * r1` evalúa primero la multiplicación. |
| Currificación implícita | Métodos de instancia reciben implícitamente `this` como primer parámetro. | `def suma(r: Racional)` tiene `this` implícito. |
| Abstracción completa | Ocultar la implementación de clase para que el tipo se comporte como primitivo. | Usar `Racional` como si fuera un tipo numérico nativo. |
| Métodos de un parámetro | Condición necesaria para usar notación infija (un parámetro explícito). | `def +(r: Racional)` tiene un parámetro explícito. |

## Comentarios adicionales

- La notación infija es una característica sintáctica que mejora la legibilidad del código, especialmente para operaciones matemáticas o de dominio específico.
- En Scala, cualquier método que tome un solo parámetro puede usarse con notación infija, no solo los operadores simbólicos.
- Los operadores simbólicos en Scala siguen las reglas de precedencia basadas en el primer carácter del operador (por ejemplo, `*` tiene mayor precedencia que `+`).
- La capacidad de definir operadores personalizados permite crear DSLs (Domain-Specific Languages) embebidos dentro de Scala.
- El uso de `this` es opcional dentro de los métodos de la clase, pero puede ser útil para claridad o cuando hay conflictos de nombres.
- La abstracción lograda con esta técnica es tan efectiva que los usuarios de la clase `Racional` pueden operar con ella sin conocer su implementación interna.
- Esta aproximación sigue el principio de "programación a la interfaz, no a la implementación", uno de los principios fundamentales del diseño orientado a objetos.
- En la práctica, es importante documentar bien los operadores personalizados, ya que pueden no ser intuitivos para otros desarrolladores.