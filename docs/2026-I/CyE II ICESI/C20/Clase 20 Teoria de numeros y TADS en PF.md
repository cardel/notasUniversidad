# Módulo en Scala

La operación módulo en Scala, al igual que en muchos lenguajes de programación, puede devolver un resultado negativo si el dividendo es negativo. Para obtener siempre un resultado positivo, se utiliza la siguiente fórmula:

`((a mod m) + m) mod m`

# Algoritmo de Euclides

El algoritmo de Euclides permite estimar el máximo común divisor (mcd) de dos números sin necesidad de realizar una factorización costosa. El procedimiento es el siguiente:

Dados a y b, se calcula:
- a mod b = r
- b mod r = r1
- r mod r1 = r2
- ...
- rn-1 mod rn = 0

El último residuo no nulo (rn) es el mcd(a, b).

# Representación de números grandes

- Los tipos `Int` y `Long` tienen un tamaño limitado (32 y 64 bits respectivamente). Si se intenta almacenar un número más grande, ocurre un desbordamiento (overflow).
- Para trabajar con números arbitrariamente grandes, se utiliza `BigInt`, que internamente es un arreglo de enteros.

```scala
// Ejemplo de BigInt para potencias grandes
scala> val x = BigInt(7).pow(153)
// Resultado: número de 130 dígitos sin desbordamiento
val x: scala.math.BigInt = 1995262876301749705743355733163350069567511859853733802691255552209426302648784449479340269807714289948321871472250346731193598407

scala> val x = BigInt(7).pow(153).mod(1613)
// Cálculo del módulo con BigInt, resultado exacto
val x: scala.math.BigInt = 790

scala> Math.pow(7,153)
// Double pierde precisión, solo 15-17 dígitos significativos
val res0: Double = 1.9952628763017497E129

scala> Math.pow(7,153) % 1653
// Double da un resultado incorrecto por pérdida de precisión
val res1: Double = 719.0
```

# Cálculo para exponentes grandes (Exponenciación modular rápida)

Para calcular $b^e \mod m$ de manera eficiente, se utiliza el método de exponenciación binaria:

1. Inicializar con b, e y acc = 1
2. Si e es par: $b = b \cdot b \mod m$ y acc permanece igual
3. Si e es impar: $b = b \cdot b \mod m$ y $acc = b \cdot acc \mod m$
4. En ambos casos, e se divide entre 2 (división entera)
5. Repetir hasta que e = 0

**Ejercicio propuesto:** Realiza la traza para calcular $5^{18925} \mod 2005$

# Congruencia

Se dice que a es congruente con b módulo m si y solo si se cumple alguna de las siguientes condiciones equivalentes:

1. a mod m = b mod m
2. (a - b) mod m = 0

Notación: $a \equiv b \pmod{m}$

# Números coprimos (o primos relativos)

Dos números a y b son coprimos si y solo si mcd(a, b) = 1.

# Teorema de Bezout (Identidad de Bezout)

Dado mcd(a, b) = p, existen enteros s y t tales que $p = a \cdot s + b \cdot t$. Si mcd(a, b) = 1, entonces s es el inverso modular de a módulo b, es decir, $a \cdot s \equiv 1 \pmod{b}$.

# Tipos Abstractos de Datos (TADs)

Un TAD encapsula la representación interna de los datos y expone solo las operaciones válidas. Ejemplo con Rational:

```scala
// TAD Rational: encapsula la representación de números racionales
// Las operaciones se realizan sin conocer la implementación interna
Rational(1,2) + Rational(3,2)
// En lugar de realizar las operaciones manualmente con numerador y denominador
```

---

## Tabla resumen de conceptos

| Concepto | Definición | Comentarios adicionales |
|----------|------------|-------------------------|
| Módulo positivo | `((a mod m) + m) mod m` | Evita resultados negativos en lenguajes como Scala |
| Algoritmo de Euclides | mcd(a,b) mediante residuos sucesivos | No requiere factorización, es O(log min(a,b)) |
| BigInt | Tipo para enteros arbitrariamente grandes | Internamente usa arreglos, evita overflow |
| Exponenciación modular rápida | $b^e \mod m$ con complejidad O(log e) | Divide y vencerás, evita calcular $b^e$ completo |
| Congruencia | $a \equiv b \pmod{m}$ si $m \mid (a-b)$ | Relación de equivalencia en los enteros |
| Números coprimos | mcd(a,b) = 1 | Propiedad fundamental para inversos modulares |
| Teorema de Bezout | $mcd(a,b) = a \cdot s + b \cdot t$ | Permite calcular inversos modulares |
| TAD (Tipo Abstracto de Dato) | Oculta implementación, expone operaciones | Principio de encapsulamiento en programación funcional |

**Comentarios adicionales:** La teoría de números es fundamental en criptografía (RSA, Diffie-Hellman). La exponenciación modular rápida es la base de algoritmos como el test de primalidad de Miller-Rabin. Los TADs en programación funcional se implementan típicamente con case classes y métodos que garantizan invariantes (ej: fracción irreducible en Rational).