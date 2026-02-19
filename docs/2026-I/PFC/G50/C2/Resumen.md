# Resumen integral: Conceptos fundamentales de programación funcional en Scala

## Conceptos vistos en clase

### 1. Listas como estructura de datos recursiva

Una lista es una estructura de datos recursiva que contiene elementos del mismo tipo. Se compone de:

- **Cabeza (head)**: el primer elemento
- **Cola (tail)**: el resto de la lista (también una lista)
- **Lista vacía**: caso base de la recursión

```scala
// Construcción usando el operador cons (::)
val l: List[Int] = 1 :: 2 :: 3 :: 4 :: 5 :: List()
// Equivalente a: List(1, 2, 3, 4, 5)

// Deconstrucción
l.head           // 1
l.tail           // List(2, 3, 4, 5)
l.tail.head      // 2
l.tail.tail.head // 3
```

Las listas en Scala son **inmutables**, lo que significa que no se pueden modificar después de su creación. Cualquier operación retorna una nueva lista.

### 2. Evaluación de expresiones

Las expresiones se evalúan de izquierda a derecha, tomando en cuenta los operadores de precedencia:

```scala
1 + 2 * 3        // Se evalúa como: 1 + (2 * 3) = 7
(1 + 2) * 3      // Se evalúa como: (1 + 2) * 3 = 9
```

#### Estrategias de evaluación

**Evaluación por Valor (CBV - Call By Value)**:
- Los argumentos se evalúan **antes** de pasar a la función
- Cada parámetro se evalúa exactamente una vez
- Estrategia por defecto en Scala
- Más eficiente cuando los parámetros se usan múltiples veces

```scala
def test(x: Int, y: Int) = x * x
test(3 + 4, 8)   // Evalúa 3+4 → 7, luego 7*7 → 49
```

**Evaluación por Nombre (CBN - Call By Name)**:
- Los argumentos se pasan **sin evaluar**
- Se evalúan solo cuando se usan dentro de la función
- Un parámetro no usado nunca se evalúa
- Se especifica con `=>` en la definición

```scala
def test(x: => Int, y: => Int) = x * x
test(3 + 4, 8)   // Sustituye directamente: (3+4)*(3+4)
                 // Evalúa 3+4 dos veces → 7*7 → 49
```

### 3. Condicionales y booleanos

Los condicionales son estructuras de control que se reducen a un valor (en programación funcional):

```scala
val edad = 19
val estado = if (edad >= 18) "Mayor de edad" else "Menor de edad"
// estado = "Mayor de edad"

// Condicionales anidados
val clasificacion = if (edad >= 18) "Mayor" 
                    else if (edad < 10) "Niño" 
                    else "Adolescente"
```

**Operadores booleanos**:
- `&&` (AND): operador de corto circuito, detiene si encuentra `false`
- `||` (OR): operador de corto circuito, detiene si encuentra `true`
- `&` y `|`: versiones sin corto circuito

```scala
false && true    // false (no evalúa la derecha)
true || false    // true (no evalúa la derecha)
false & true     // false (evalúa ambos lados)
```

### 4. Definiciones: `def` vs `val`

**`def` (definición por nombre)**:
- Define una función o valor que se evalúa **cada vez que se accede**
- No se evalúa inmediatamente
- Ideal para funciones y valores costosos que pueden no usarse

```scala
def loop: Int = loop  // Compila sin error, solo se evalúa si se llama
def f(x: Int): Int = x + 2 * x * x  // Definición de función
```

**`val` (definición por valor)**:
- Define un valor que se evalúa **inmediatamente**
- El resultado se almacena y se reutiliza
- Ideal para valores que se usan múltiples veces

```scala
val x = 13                    // Se evalúa ahora
val s = if (x >= 18) "Mayor" else "Menor"  // Se evalúa a "Menor"
```

### 5. Alcance léxico (Lexical Scoping)

El alcance léxico permite que una función acceda a variables y parámetros de las funciones en cuyas que está definida. El alcance se determina **en el momento de la definición**, no en el de la ejecución.

```scala
def raiz(x: Double): Double = {
  // mejorar y esBuenaEstimacion acceden a x por alcance léxico
  def mejorar(estimacion: Double): Double = (x / estimacion + estimacion) / 2
  def esBuenaEstimacion(estimacion: Double): Boolean = 
    estimacion * estimacion - x < 0.001
  
  // raizCuadrada accede a mejorar y esBuenaEstimacion
  def raizCuadrada(estimacion: Double): Double = {
    if (esBuenaEstimacion(estimacion)) estimacion
    else raizCuadrada(mejorar(estimacion))
  }
  
  raizCuadrada(1.0)
}
```

### 6. Shadowing (Ocultamiento de variables)

Cuando una variable en un ámbito interno tiene el mismo nombre que una variable en un ámbito exterior, la interna oculta a la externa:

```scala
def raiz(x: Double): Double = {
  // Este x oculta el x de raiz dentro del cuerpo de abs
  def abs(x: Double): Double = if (x < 0) -x else x
  
  // Aquí x se refiere al parámetro de raiz, no al de abs
  def mejorar(estimacion: Double): Double = (x / estimacion + estimacion) / 2
  
  mejorar(1.0)
}
```

### 7. Encapsulamiento mediante bloques

Los bloques permiten agrupar definiciones dentro de un ámbito local, ocultando las funciones auxiliares del resto del programa:

```scala
def raiz(x: Double): Double = {
  // Estas funciones no son accesibles desde fuera
  def abs(x: Double): Double = if (x < 0) -x else x
  def mejorar(estimacion: Double): Double = (x / estimacion + estimacion) / 2
  def esBuenaEstimacion(estimacion: Double): Boolean = 
    abs(estimacion * estimacion - x) < 0.001
  def raizCuadrada(estimacion: Double): Double = {
    if (esBuenaEstimacion(estimacion)) estimacion
    else raizCuadrada(mejorar(estimacion))
  }
  
  // El bloque retorna el último valor evaluado
  raizCuadrada(1.0)
}
```

### 8. Recursión de cola (Tail Recursion)

La recursión de cola es una forma especial de recursión donde la llamada recursiva es la **última operación**. Scala la optimiza automáticamente a un bucle iterativo:

```scala
// Recursión de cola: la llamada a si mismo es lo último
def raizCuadrada(estimacion: Double): Double = {
  if (esBuenaEstimacion(estimacion)) estimacion
  else raizCuadrada(mejorar(estimacion))  // Última operación
}

// No es recursión de cola: hay operaciones después de la llamada recursiva
def suma(n: Int): Int = {
  if (n <= 0) 0
  else n + suma(n - 1)  // Se suma después de la recursión
}
```

### 9. Clausuras (Closures)

Una clausura es una función que "captura" variables de su ámbito externo y las conserva durante su ejecución:

```scala
def raiz(x: Double): Double = {
  def mejorar(estimacion: Double): Double = (x / estimacion + estimacion) / 2
  // mejorar es una clausura que captura x
  // x permanece accesible cada vez que se llama mejorar
  mejorar(1.0)
}
```

### 10. Método de Newton

Algoritmo iterativo para encontrar aproximaciones de raíces:

$$x_{n+1} = \frac{1}{2}\left(x_n + \frac{a}{x_n}\right)$$

Converge cuadráticamente: el número de dígitos correctos se duplica aproximadamente cada iteración.

```scala
def mejorar(estimacion: Double, x: Double): Double = 
  (x / estimacion + estimacion) / 2

def esBuenaEstimacion(estimacion: Double, x: Double): Boolean = 
  (estimacion * estimacion - x).abs < 0.001
```

## Conceptos teóricos adicionales

### Diferencia entre alcance léxico y dinámico

- **Alcance léxico**: la variable es accesible según donde se define en el código
- **Alcance dinámico**: la variable es accesible según la cadena de llamadas en tiempo de ejecución

Scala usa alcance léxico, que es más predecible y seguro.

### Naturaleza recursiva de las listas

Las listas son intrínsecamente recursivas:
- Una lista es un elemento seguido de una lista
- Una lista vacía es el caso base
- Muchas operaciones sobre listas se implementan naturalmente con recursión

### Inmutabilidad en programación funcional

- Las listas, valores y datos no cambian después de su creación
- Cualquier "modificación" retorna un nuevo objeto
- Facilita razonamiento sobre el código
- Permite optimizaciones de compilación

## Tabla de resumen integrado

| Concepto | Descripción | Uso principal |
|----------|-------------|---------------|
| **Lista** | Estructura recursiva de elementos del mismo tipo | Almacenar colecciones ordenadas de datos |
| **Head/Tail** | Primer elemento y resto de la lista | Deconstruir listas recursivamente |
| **Operador cons (::)** | Agrega elemento al inicio de lista | Construir listas de forma funcional |
| **CBV vs CBN** | Estrategias de evaluación de parámetros | Optimizar eficiencia según contexto |
| **Condicionales** | Estructuras que se reducen a valores | Control de flujo en PF |
| **def vs val** | Evaluación por nombre vs por valor | Definir funciones y valores |
| **Alcance léxico** | Variables accesibles según estructura del código | Acceder a parámetros de funciones externas |
| **Shadowing** | Variable interna oculta variable externa | Entender resolución de nombres |
| **Encapsulamiento** | Ocultar definiciones en bloques locales | Mantener interfaz simple y segura |
| **Recursión de cola** | Recursión optimizable a bucle iterativo | Implementar iteración de forma funcional |
| **Clausura** | Función que captura variables externas | Crear funciones especializadas dinámicamente |
| **Método de Newton** | Algoritmo de convergencia cuadrática | Calcular raíces eficientemente |

## Aplicaciones prácticas integradas

### 1. Algoritmos que procesan listas

La naturaleza recursiva de las listas permite algoritmos elegantes:
- **Búsqueda**: recorrer head y tail recursivamente
- **Transformación**: aplicar función a cada elemento
- **Filtrado**: mantener elementos que cumplen condición
- **Reducción**: acumular resultado sobre toda la lista

```scala
// Sumar todos elementos de una lista
def sumar(lista: List[Int]): Int = 
  if (lista.isEmpty) 0
  else lista.head + sumar(lista.tail)
```

### 2. Optimización numérica

El método de Newton con recursión de cola y encapsulamiento proporciona:
- Algoritmos eficientes sin variables mutables
- Código limpio y seguro
- Convergencia rápida para resolver ecuaciones

### 3. Sistemas de tipos seguros

El alcance léxico y las clausuras permiten:
- Crear abstracciones type-safe
- Compiladores que verifican tipos antes de ejecución
- Detectar errores en tiempo de compilación

### 4. Compiladores y intérpretes

La evaluación por valor/nombre es fundamental para:
- Parsing y análisis de programas
- Optimización de código
- Ejecución eficiente

## Por qué estos conceptos son fundamentales

| Concepto | Por qué importa |
|----------|-----------------|
| Listas | Base de estructuras de datos. Permiten expresar patrones recursivos naturalmente. |
| Evaluación de expresiones | Determina eficiencia del programa. Comprender estrategias evita sorpresas. |
| Alcance léxico | Permite crear abstracciones poderosas sin contaminar namespace global. |
| Recursión de cola | Permite algoritmos elegantes con eficiencia de bucles iterativos. |
| Clausuras | Permiten programación funcional avanzada. Base de callbacks y eventos. |
| Encapsulamiento | Reduce complejidad. Facilita mantenimiento y testing de código. |
| Método de Newton | Ejemplo práctico de algoritmo eficiente. Base de optimización moderna. |

## Frase de motivación

**Cada concepto que aprendiste hoy —desde la naturaleza recursiva de las listas hasta el alcance léxico y el método de Newton— aparece en el código de sistemas que afectan directamente tu vida. Los algoritmos de machine learning que ves en redes sociales usan optimización numérica basada en Newton. Los videojuegos que juegas utilizan recursión de cola para manejar millones de objetos eficientemente. Los compiladores que traducen código a máquina usan alcance léxico para garantizar que tu programa funcione de manera predecible. No estás memorizando teoría abstracta; estás aprendiendo el lenguaje fundamental en que están escritas las herramientas que transforman el mundo. Cada línea de código que dominas es un paso hacia la capacidad de construir cualquier cosa que imagines.**