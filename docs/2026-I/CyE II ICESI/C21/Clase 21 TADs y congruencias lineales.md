# TADs y Congruencias Lineales

## Tipos Abstractos de Datos (TADs)

Un **Tipo Abstracto de Datos (TAD)** permite representar estructuras complejas de datos y sus operaciones, de tal forma que el programador no se preocupe por su implementación interna. Esto promueve la encapsulación y la separación entre interfaz e implementación.

### Ejemplo: Racionales

Los números racionales $\frac{a}{b} \in \mathbb{Q}$ con $b > 0$ son un ejemplo clásico de TAD.

```scala
// Definición de un TAD para números racionales
sealed case class Rational(a:Int, b:Int) {
  // Precondición: el denominador debe ser positivo
  require(b > 0, "denominator must be positive")

  // Método para calcular el máximo común divisor (algoritmo de Euclides)
  def mcd(a:Int, b:Int):Int = if (b == 0) a else mcd(b, a % b)

  // Propiedades que almacenan el numerador y denominador reducidos
  val num = a / mcd(a, b)  // Numerador simplificado
  val den = b / mcd(a, b)  // Denominador simplificado

  // Sobrecarga del operador + para sumar dos racionales
  def +(r:Rational):Rational = {
    new Rational(
      this.num * r.den + r.num * this.den,  // Numerador: a*d + c*b
      this.den * r.den                       // Denominador: b*d
    )
  }

  // Sobrecarga del operador * para multiplicar dos racionales
  def *(r:Rational):Rational = {
    new Rational(
      this.num * r.num,  // Numerador: a*c
      this.den * r.den   // Denominador: b*d
    )
  }
}
```

```scala
object Main {
  def main(arr:Array[String]):Unit = {
    // Creación de racionales: 6/9 se simplifica a 2/3
    val r1 = new Rational(6, 9)
    // Creación de racional: 4/7
    val r2 = new Rational(4, 7)
    
    // Prueba de suma y multiplicación
    println(r1 + r2)  // 2/3 + 4/7 = 14/21 + 12/21 = 26/21
    println(r1 * r2)  // 2/3 * 4/7 = 8/21
    
    // Intento de crear un racional con denominador negativo
    val r3 = new Rational(1, -2)  // Esto lanza una excepción
  }
}
```

En este ejemplo, no nos preocupamos por cómo se implementan internamente las operaciones de suma (+) ni multiplicación (*), sino que simplemente las usamos. El TAD oculta los detalles de implementación.

```bash
 scalac *.scala && scala Main
Rational(26,21)
Rational(8,21)
java.lang.IllegalArgumentException: requirement failed: denominator must be positive
```

## Teorema de Bézout

El **Teorema de Bézout** establece que para dos enteros $a$ y $b$, existen enteros $s$ y $t$ tales que:

$$\text{mcd}(a,b) = a \cdot s + b \cdot t$$

Donde $s$ es el **inverso modular** de $a$ módulo $b$ (cuando $\text{mcd}(a,b) = 1$).

### Procedimiento para encontrar la combinación lineal

1. **Calcular el MCD** mediante el algoritmo de Euclides.
2. **Resolver a través de los residuos** (algoritmo de Euclides extendido) para encontrar la expresión lineal $a \cdot s + b \cdot t = \text{mcd}(a,b)$.

### Aplicaciones del Teorema de Bézout

- Cálculo de inversos modulares en criptografía (RSA).
- Resolución de ecuaciones diofánticas lineales.
- Demostración de propiedades aritméticas fundamentales.

## Tabla Resumen de Conceptos

| Concepto | Descripción | Observaciones |
|----------|-------------|---------------|
| TAD (Tipo Abstracto de Datos) | Estructura que encapsula datos y operaciones, ocultando la implementación | Permite trabajar a nivel conceptual sin preocuparse por detalles internos |
| Números Racionales | $\frac{a}{b} \in \mathbb{Q}$ con $b > 0$ | Ejemplo clásico de TAD; requiere simplificación y validación del denominador |
| Algoritmo de Euclides | Método para calcular el MCD de dos números | Base para simplificar fracciones y encontrar combinaciones lineales |
| Teorema de Bézout | $\text{mcd}(a,b) = a \cdot s + b \cdot t$ | Fundamental para encontrar inversos modulares y resolver ecuaciones diofánticas |
| Inverso Modular | Entero $s$ tal que $a \cdot s \equiv 1 \pmod{b}$ | Existe solo si $\text{mcd}(a,b) = 1$; esencial en criptografía |

### Comentarios Adicionales

- La **precondición** en el TAD de racionales ($b > 0$) es una invariante que garantiza la consistencia del tipo de dato.
- El **algoritmo de Euclides extendido** es la herramienta práctica para encontrar los coeficientes $s$ y $t$ del Teorema de Bézout.
- Los TADs son fundamentales en la programación funcional y orientada a objetos, permitiendo construir abstracciones robustas y reutilizables.
- La relación entre TADs y congruencias lineales radica en que ambos trabajan con estructuras matemáticas donde las operaciones están bien definidas y cumplen propiedades algebraicas (asociatividad, conmutatividad, existencia de elemento neutro, etc.).