# Ejercicio de funciones de orden superior

La fórmula general para calcular la distancia entre dos puntos representados como listas es:

$$
\begin{align}
A = \{a_1,a_2,\ldots,a_n\} \\
B = \{b_1,b_2,\ldots,b_n\} \\
\texttt{dist}_{a,b} = \sqrt[p]{(a_1-b_1)^p+(a_2-b_2)^p+\ldots+(a_n-b_n)^p}
\end{align}
$$

Por ejemplo, dados A = List(1,2,3) y B = List(2,4,6):

1. Para p = 2: $\sqrt[2]{(1-2)^2+(2-4)^2+(3-6)^2}$
2. Para p = 3: $\sqrt[3]{(1-2)^3+(2-4)^3+(3-6)^3}$
3. Y así sucesivamente para otros valores de p

Desarrollar una función que realice este proceso directamente. La firma de la función es:

```scala
def calcularDistancia(a: List[Int], b: List[Int], f: (Int, Int) => Int, g: Int => Double): Double
// f: toma a y b, los resta y eleva el resultado a la potencia p
// g: toma el valor de la suma y calcula la raíz p-ésima usando Math.pow(valor, 1/p)
```

# Solución

```scala
object Ejercicio {

  // Función de orden superior para calcular distancia generalizada entre dos puntos
  // a, b: listas de coordenadas de los puntos
  // f: función que calcula la diferencia elevada a la potencia p
  // g: función que calcula la raíz p-ésima del resultado acumulado
  def calcularDistancia(a: List[Int], b: List[Int], f: (Int, Int) => Int, g: Int => Double): Double = {
    
    // Función auxiliar recursiva que procesa las listas elemento por elemento
    // a, b: listas restantes por procesar
    // acc: acumulador de la suma de diferencias elevadas a p
    @scala.annotation.tailrec
    def calcularDistanciaAux(a: List[Int], b: List[Int], acc: Int): Int = {
      if (a.isEmpty) acc  // Caso base: listas vacías, retorna acumulador
      else calcularDistanciaAux(a.tail, b.tail, f(a.head, b.head) + acc)  // Caso recursivo
    }
    
    // Aplica la función g (raíz p-ésima) al resultado acumulado
    g(calcularDistanciaAux(a, b, 0))
  }

  def main(args: Array[String]): Unit = {
    // Ejemplo 1: Distancia euclidiana (p = 2)
    println(
      calcularDistancia(
        List(1, 2, 3),
        List(2, 4, 6),
        (x: Int, y: Int) => Math.pow((x - y), 2).toInt,  // (x-y)²
        (s: Int) => Math.pow(s, 1 / 2.0)                 // √s
      )
    ) // Resultado: √(1+4+9) = √14 ≈ 3.7416573867739413
    
    // Ejemplo 2: Distancia de Minkowski con p = 3
    println(
      calcularDistancia(
        List(1, 2, 3),
        List(2, 4, 6),
        (x: Int, y: Int) => Math.pow(Math.abs(x - y), 3).toInt,  // |x-y|³
        (s: Int) => Math.pow(s, 1 / 3.0)                         // ∛s
      )
    ) // Resultado: ∛(1+8+27) = ∛36 ≈ 3.3019272488946263
  }
}
```

En el caso p = 3, se ha optado por utilizar `Math.abs` para evitar problemas con raíces de números negativos cuando la base es impar.

Observar que con `f` podemos calcular directamente la diferencia elevada a la potencia p, y con `g` podemos calcular la raíz p-ésima. Esta abstracción permite cambiar el comportamiento a voluntad; por ejemplo, en lugar de calcular la diferencia, podríamos sumar los elementos o aplicar cualquier otra operación.

# Conceptos teóricos adicionales

## Distancia de Minkowski
La fórmula implementada corresponde a la **distancia de Minkowski**, que es una generalización de varias métricas de distancia:
- Para p = 1: Distancia de Manhattan (o L1)
- Para p = 2: Distancia euclidiana (o L2)
- Para p → ∞: Distancia de Chebyshev (o L∞)

## Validación de entradas
En una implementación robusta, deberíamos verificar que:
1. Ambas listas tengan la misma longitud
2. El valor de p sea mayor que 0
3. Las listas no estén vacías


## Recursividad y listas
El algoritmo utiliza recursividad sobre listas, que es un patrón común en programación funcional. En Scala, las listas son inmutables y se procesan eficientemente de manera recursiva.

# Tabla de resumen

| Concepto | Definición | Ejemplo en el ejercicio | Observaciones |
|----------|------------|-------------------------|---------------|
| **Distancia de Minkowski** | Generalización de métricas de distancia | $\sqrt[p]{\sum_{i=1}^n |a_i-b_i|^p}$ | Base matemática del ejercicio |
| **Función de transformación (f)** | Calcula la contribución de cada coordenada | `(x: Int, y: Int) => Math.pow((x - y), 2).toInt` | Eleva la diferencia a la potencia p |
| **Función de reducción (g)** | Aplica la operación final al resultado | `(s: Int) => Math.pow(s, 1 / 2.0)` | Calcula la raíz p-ésima |
| **Recursividad sobre listas** | Procesamiento elemento por elemento | `calcularDistanciaAux(a.tail, b.tail, ...)` | Patrón común en programación funcional |
| **Valor absoluto en potencias impares** | Evita raíces de números negativos | `Math.pow(Math.abs(x - y), 3)` | Necesario para p impar cuando x < y |
| **Abstracción de métricas** | Separación entre cálculo y métrica específica | Parámetros f y g definen la métrica | Permite cambiar fácilmente entre distancias |

# Comentarios adicionales

1. **Generalización del problema**:
   - La solución presentada es específica para `List[Int]`, pero podría extenderse a otros tipos numéricos
   - Podría implementarse usando `zip` para un código más declarativo: `a.zip(b).map(f).sum`
   - En Scala, existen bibliotecas como Breeze o Spire que implementan estas métricas de forma optimizada

2. **Consideraciones numéricas**:
   - La conversión a `Int` con `.toInt` puede causar pérdida de precisión
   - Para valores grandes de p, puede ocurrir desbordamiento numérico
   - El uso de `Double` en lugar de `Int` para los cálculos intermedios mejoraría la precisión

3. **Optimizaciones posibles**:
   - Usar `foldLeft` o `foldRight` en lugar de recursividad explícita
   - Implementar versión iterativa para mejorar rendimiento con listas grandes
   - Añadir memoización si se calculan múltiples distancias con los mismos parámetros

4. **Aplicaciones prácticas**:
   - **Machine Learning**: Cálculo de similitud entre vectores de características
   - **Procesamiento de imágenes**: Comparación de píxeles entre imágenes
   - **Sistemas de recomendación**: Medición de distancia entre perfiles de usuarios
   - **Geolocalización**: Cálculo de distancias entre coordenadas

5. **Extensiones del ejercicio**:
   - Implementar distancias ponderadas donde cada dimensión tiene un peso diferente
   - Crear una función que genere automáticamente f y g dado un valor de p
   - Añadir soporte para distancias con diferentes normas (L1, L2, L∞)
   - Implementar versión paralela para procesamiento de grandes volúmenes de datos

6. **Buenas prácticas de código**:
   - Documentar precondiciones (listas de igual longitud, p > 0)
   - Manejar casos de error (listas vacías, p = 0)
   - Usar nombres más descriptivos para f y g (ej: `transformacion` y `raiz`)
   - Considerar el uso de `require` para validar parámetros