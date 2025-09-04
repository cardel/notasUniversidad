# Funciones anónimas en Scala

Las funciones anónimas son funciones que se definen directamente como valores literales, sin asignarles un nombre explícito. Esto permite un código más conciso al evitar la creación de funciones auxiliares que solo se utilizan una vez.

## Problema con el enfoque de funciones nombradas

```scala
def funcion(f: (Int, Int) => Boolean, a: Int, b: Int): Int = {
    if (f(a, b)) a else b
}

// Enfoque menos eficiente: definir múltiples funciones
def mayor(x: Int, y: Int): Boolean = x > y
def menor(x: Int, y: Int): Boolean = x < y
def igual(x: Int, y: Int): Boolean = x == y
def diferente(x: Int, y: Int): Boolean = x != y
def mayorIgual(x: Int, y: Int): Boolean = x >= y

funcion(mayor, 2, 3)       // Resultado: 3
funcion(menor, 2, 3)       // Resultado: 2
funcion(igual, 2, 3)       // Resultado: 3
funcion(diferente, 2, 3)   // Resultado: 2
```

## Solución elegante con funciones anónimas

```scala
// Uso de funciones anónimas para mayor concisión
funcion((x: Int, y: Int) => x > y, 2, 3)        // x > y → 3
funcion((x: Int, y: Int) => x < y, 2, 3)        // x < y → 2
funcion((x: Int, y: Int) => x == y, 2, 3)       // x == y → 3
funcion((x: Int, y: Int) => x != y, 2, 3)       // x != y → 2
funcion((x: Int, y: Int) => x >= y, 5, 3)       // x >= y → 5
funcion((x: Int, y: Int) => x <= y, 2, 5)       // x <= y → 2

// Sintaxis más concisa con inferencia de tipos
funcion((x, y) => x > y, 2, 3)
funcion((x, y) => x % 2 == 0, 4, 3)             // x es par → 4
funcion((x, y) => x * y > 10, 3, 4)             // producto > 10 → 3
```

## Ventajas del uso de funciones anónimas

- **Reducción de código**: Elimina la necesidad de funciones auxiliares
- **Mejor legibilidad**: La lógica está donde se utiliza
- **Flexibilidad**: Fácil crear variaciones sin definir nuevas funciones
- **Mantenimiento**: Menos código que mantener y depurar

## Ejemplos adicionales

```scala
// Operaciones más complejas
funcion((x, y) => (x + y) % 2 == 0, 2, 4)       // suma par → 2
funcion((x, y) => Math.abs(x - y) > 2, 1, 5)    // diferencia > 2 → 1
funcion((x, y) => x.toString == y.toString, 12, 12) // iguales como string → 12

// Múltiples condiciones
funcion((x, y) => x > 0 && y > 0 && x != y, -1, 5) // ambos positivos y diferentes → 5
```

El uso de funciones anónimas permite expresar la lógica de comparación directamente en el punto de uso, haciendo el código más expresivo y evitando la proliferación de funciones que solo sirven para un propósito específico y único.