## Operación generalizada con currificación

### Suma generalizada de términos

La implementación original permite calcular sumatorias de la forma:
$$\sum \limits_{i=1}^{n} k(i)$$

```scala
def f(k: Int => Int)(n: Int): Int = {
  @tailrec
  def fc(n: Int)(acc: Int): Int = {
    if (n == 1) acc
    else fc(n - 1)(acc + k(n))
  }
  fc(n)(1)
}

// Ejemplos:
println(f(x => x * x)(5))        // 1² + 2² + 3² + 4² + 5² = 55
println(f(x => x * x * x)(5))    // 1³ + 2³ + 3³ + 4³ + 5³ = 225
println(f(x => x)(5))            // 1 + 2 + 3 + 4 + 5 = 15
```

### Generalización para operaciones binarias arbitrarias

Para extender a productorias y otras operaciones:

```scala
def f(k: Int => Int)(g: (Int, Int) => Int)(n: Int): Int = {
  @tailrec
  def fc(n: Int)(acc: Int): Int = {
    if (n == 1) acc
    else fc(n - 1)(g(acc, k(n)))
  }
  fc(n)(1)
}
```

**Ejemplos de uso:**

**Sumatorias:**
```scala
println(f(x => x * x)((a, b) => a + b)(5))        // 55
println(f(x => x * x * x)((a, b) => a + b)(5))    // 225  
println(f(x => x)((a, b) => a + b)(5))            // 15
```

**Productorias:**
```scala
println(f(x => x * x)((a, b) => a * b)(5))        // 1² × 2² × 3² × 4² × 5² = 14400
println(f(x => x * x * x)((a, b) => a * b)(5))    // 1³ × 2³ × 3³ × 4³ × 5³ = 1728000
println(f(x => x)((a, b) => a * b)(5))            // 1 × 2 × 3 × 4 × 5 = 120
```

**Otras operaciones:**
```scala
// Máximo de los términos
println(f(x => x * x)((a, b) => Math.max(a, b))(5))  // 25

// Mínimo de los términos  
println(f(x => x * x)((a, b) => Math.min(a, b))(5))  // 1
```

### Características del diseño

1. **Currificación completa**: Cada parámetro está en su propia lista
2. **Recursión de cola**: Optimizada con anotación `@tailrec`
3. **Polimorfismo funcional**: La operación `g` puede ser cualquier función binaria
4. **Flexibilidad**: Permite sumatorias, productorias y cualquier operación asociativa

### Nota sobre el caso base

El diseño asume que la operación tiene elemento identidad en 1:
- Para suma: $1 + k(2) + k(3) + ... + k(n)$
- Para producto: $1 × k(2) × k(3) × ... × k(n)$

Para operaciones sin identidad en 1, sería necesario ajustar el valor inicial del acumulador.