![](attachments/2025-09-02-Note-08-01_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}
# Currificación (Currying) en Scala

## 🧠 Concepto Fundamental

La **currificación** es la técnica de transformar una función que toma múltiples argumentos en una secuencia de funciones que toman un solo argumento cada una.

### Notación Matemática
Dada una función: 
$f: A × B → C$

Su versión currificada es:
$curry(f): A → (B → C)$

Donde:
- $curry(f)(a)$ retorna una función $g: B → C$
- $g(b) = f(a, b)$

## 🔧 En Scala

### Función Normal (no currificada)
```scala
def g(x: Int, y: Int): Int = x + y
// g: (Int, Int) => Int
```

### Función Currificada
```scala
def f(x: Int)(y: Int): Int = x + y
// f: Int => (Int => Int)
```

## 🎯 Comportamiento en Scala

```scala
// Aplicación parcial
val f3 = f(3)_        // Int => Int = y => 3 + y
f3(4)                 // Retorna 7

// Aplicación completa
f(3)(4)               // Retorna 7

// Tipo de la función currificada
f _                   // Int => (Int => Int)
```

## 📐 Composición Matemática con Currying

### Composición de Funciones Currificadas
Dadas:
- $f: A → (B → C)$
- $g: C → (D → E)$

La composición se define como:
$(g ∘ f)(a) = g(f(a))$

Pero como $f(a)$ retorna una función $B → C$, necesitamos:

### Composición con Múltiples Parámetros
Para $h = g ∘ f$:
$h(a)(b) = g(f(a)(b))$

### Ejemplo Matemático
Sea:
- $f(x)(y) = x + y$
- $g(z)(w) = z * w$

Entonces:
$(g ∘ f)(2)(3)(4) = g(f(2)(3))(4) = g(5)(4) = 20$

## 💡 Beneficios de la Currificación

1. **Aplicación Parcial**: Crear funciones especializadas
2. **Composición**: Encadenar funciones más fácilmente
3. **Flexibilidad**: Reutilizar lógica con diferentes parámetros
4. **Abstracción**: Separar concerns de manera natural

## 🚀 Aplicación Práctica

```scala
// Función currificada para cálculos
def calcular(tipo: String)(x: Double)(y: Double): Double = tipo match {
  case "suma" => x + y
  case "multiplica" => x * y
}

// Especialización
val sumador = calcular("suma")_
val multiplicador = calcular("multiplica")_

// Uso
sumador(5.0)(3.0)        // 8.0
multiplicador(4.0)(2.5)  // 10.0
```

La currificación convierte funciones complejas en **bloques modulares** que pueden componerse matemáticamente, permitiendo un estilo de programación más funcional y expresivo.