# Funciones de Alto Orden y Anónimas en Scala

## 🎯 Funciones como Ciudadanos de Primera Clase

En Scala, las funciones son **valores de primera clase**, lo que significa que pueden ser manipuladas como cualquier otro dato:

### Asignación a Variables
```scala
val suma = (x: Int, y: Int) => x + y
println(suma(5, 3)) // Output: 8
```

### Paso como Parámetros
```scala
def operar(f: (Int, Int) => Int, a: Int, b: Int): Int = f(a, b)
operar((x, y) => x * y, 4, 5) // Retorna 20
```

### Retorno desde Funciones
```scala
def crearMultiplicador(n: Int): Int => Int = (x: Int) => x * n
val doble = crearMultiplicador(2)
doble(5) // Retorna 10
```

## 🔥 Funciones Anónimas (Lambdas)

Funciones sin nombre definidas directamente donde se necesitan:

### Sintaxis Básica
```scala
// Formas válidas:
(x: Int, y: Int) => x + y
(a, b) => a * b          // Scala infiere tipos
x => x * 2               // Un parámetro
```

### Ejemplos Prácticos
```scala
// En colecciones
List(1, 2, 3).map(x => x * 2) // [2, 4, 6]

// Como callbacks
button.onClick(() => println("Click!"))

// En funciones de alto orden
def filtrar(pred: Int => Boolean, nums: List[Int]) = 
  nums.filter(pred)
```

## 💡 Beneficios Clave

- **Flexibilidad**: Comportamiento configurable en tiempo de ejecución
- **Concisión**: Código más limpio y expresivo
- **Reutilización**: Patrones comunes aplicables múltiples veces
- **Abstracción**: Separación clara de qué hacer vs cómo hacerlo

## 📊 Tabla Resumen de Conceptos

| Concepto | Definición | Ejemplo Scala | Uso Principal |
|----------|------------|---------------|---------------|
| **Función de Alto Orden** | Función que recibe o retorna otras funciones | `def map(f: A => B): List[B]` | Operaciones sobre colecciones |
| **Función Anónima** | Función sin nombre, definida inline | `(x, y) => x + y` | Callbacks, parámetros breves |
| **Ciudadano Primera Clase** | Tratamiento de funciones como valores | `val f = (x: Int) => x*2` | Asignación y composición |
| **Parámetro Función** | Función recibida como argumento | `def sort(compare: (A,A)=>Boolean)` | Personalizar comportamiento |
| **Función como Retorno** | Función que crea y retorna otra función | `def factory() = () => println("Hola")` | Generación dinámica de código |

## 🚀 Mensaje de Motivación

**¡Para los que llegaron sin leer!** 

Estos conceptos parecen complejos, pero son tu superpoder en programación. Las funciones de alto orden te permiten escribir código que se adapta como plastilina: hoy resuelves un problema, mañana diez más con la misma solución.

Cada vez que usas `map`, `filter` o `reduce` estás aplicando estos conceptos. Son la razón por la que puedes hacer en una línea lo que antes tomaba 10. 

**No es magia, es elegir las herramientas correctas.** Dedica 15 minutos a practicar con ejemplos simples y verás cómo se abre un mundo nuevo de posibilidades. ¡El esfuerzo de hoy te ahorrará horas de código mañana!

**Recuerda**: Los mejores programadores no escriben más código, escriben código más inteligente. ✨