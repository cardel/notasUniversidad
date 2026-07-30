# Currificación

## Fundamentos matemáticos

La currificación es una transformación que convierte una función de múltiples argumentos en una secuencia de funciones de un solo argumento. Formalmente:

Sea $f: A \times B \rightarrow C$ una función que toma dos argumentos. La versión currificada de $f$ es una función:

$$\text{curry}(f): A \rightarrow (B \rightarrow C)$$

Donde para cada $a \in A$, $\text{curry}(f)(a)$ es una función $g: B \rightarrow C$ tal que:

$$g(b) = f(a, b) \quad \text{para todo } b \in B$$

La propiedad fundamental es:

$$\text{curry}(f)(a)(b) = f(a, b)$$

## Ejemplo matemático

Dada la función:

$$f: \mathbb{N} \times \mathbb{N} \rightarrow \mathbb{N}$$

$$f(a, b) = a + b$$

Su versión currificada es:

$$\text{curry}(f): \mathbb{N} \rightarrow (\mathbb{N} \rightarrow \mathbb{N})$$

$$\text{curry}(f)(a) = g_a \quad \text{donde } g_a(b) = a + b$$

## Representación de la currificación
![](attachments/Currificacion.pdf){ type=application/pdf style="min-height:70vh;width:100%"}
## Implementación en Scala

```scala
// Función normal de dos parámetros
def f(a: Int, b: Int): Int = a + b
f(2, 3)  // Resultado: 5

// Tipo: (Int, Int) => Int

// Función currificada
def f2(a: Int)(b: Int): Int = a + b
f2(2)(3)  // Resultado: 5

// Tipo: Int => (Int => Int)

// La currificación explícita
val fCurried: Int => (Int => Int) = a => b => a + b
fCurried(2)(3)  // Resultado: 5
```

## Análisis de tipos

```scala
f _       // Tipo: (Int, Int) => Int
f2 _      // Tipo: Int => (Int => Int)
f2(2) _   // Tipo: Int => Int (función parcialmente aplicada)
```

## Ventajas de la currificación

1. **Abstracción funcional**: Permite crear funciones especializadas
2. **Composición**: Facilita la creación de nuevas funciones
3. **Aplicación parcial**: Se pueden fijar algunos argumentos

```scala
// Aplicación parcial
val sumar5: Int => Int = f2(5) _  // fija a = 5
sumar5(3)  // Resultado: 8

val sumar10: Int => Int = f2(10) _ // fija a = 10  
sumar10(7)  // Resultado: 17
```

## Equivalencia matemática

La currificación establece un isomorfismo entre los espacios de funciones:

$$(A \times B \rightarrow C) \cong (A \rightarrow (B \rightarrow C))$$

Esto significa que ambas representaciones son equivalentes en poder expresivo, pero la versión currificada ofrece mayor flexibilidad para la aplicación parcial y composición funcional.
