# Ejercicio de funciones de alto orden y anónimas

Tenemos la **norma-p** dada una lista que contiene $n$ elementos. La norma se calcula de la siguiente manera:

$$
\begin{align}
A = \{a_0,a_1,a_2,\ldots,a_n\} \\
\texttt{norm} = \sqrt[p]{a_0^p + a_1^p + \ldots + a_n^p}
\end{align}
$$

Ejemplo: dada la lista (1, 2, 3), entonces:

1. Norma 2: $\sqrt{1^2 + 2^2 + 3^2} = \sqrt{14}$
2. Norma 3: $\sqrt[3]{1^3 + 2^3 + 3^3} = \sqrt[3]{36}$

## Solución

```scala
object NormaP {

  // Función de alto orden que calcula la norma-p de una lista
  // l: lista de enteros
  // f: función que eleva cada elemento a la potencia p y lo suma al acumulador
  // g: función que aplica la raíz p-ésima al resultado acumulado
  def normaP(l: List[Int], f: (Int, Double) => Double, g: Double => Double): Double = {
    @scala.annotation.tailrec
    def normaPAux(l: List[Int], acc: Double): Double = {
      if (l.isEmpty) acc
      else normaPAux(l.tail, f(l.head, acc))
    }
    g(normaPAux(l, 0))
  }

  def main(args: Array[String]): Unit = {
    // Cálculo de norma-2: sqrt(x₁² + x₂² + ... + xₙ²)
    println(normaP(
      List(1, 2, 3),
      (x, acc) => x * x + acc,           // f: eleva al cuadrado y suma
      s => Math.sqrt(s)                  // g: raíz cuadrada
    ))
    
    // Cálculo de norma-3: ³√(x₁³ + x₂³ + ... + xₙ³)
    println(normaP(
      List(1, 2, 3),
      (x, acc) => x * x * x + acc,       // f: eleva al cubo y suma
      s => Math.pow(s, 1 / 3.0)          // g: raíz cúbica
    ))
  }
}
```

Aquí podemos ver el uso de `f` y `g` para las operaciones de la norma. Obsérvese que en ningún momento se pasa el parámetro `p` explícitamente; en su lugar, se encapsula en las funciones `f` y `g`.

## Conceptos teóricos

### Norma-p (Norma de Minkowski)
La norma-p es una generalización de las normas vectoriales comunes:
- **p = 1**: Norma Manhattan (suma de valores absolutos)
- **p = 2**: Norma Euclidiana (distancia habitual)
- **p = ∞**: Norma del máximo (valor absoluto máximo)

Matemáticamente, para un vector $\vec{x} = (x_1, x_2, \ldots, x_n)$:
$$
\|\vec{x}\|_p = \left( \sum_{i=1}^n |x_i|^p \right)^{1/p}
$$

### Abstracción mediante funciones de alto orden
La implementación demuestra cómo abstraer dos aspectos diferentes:
1. **Operación de acumulación**: Cómo transformar cada elemento y combinarlo con el acumulador
2. **Operación final**: Cómo transformar el resultado acumulado en la norma final

### Funciones anónimas (lambdas)
Las funciones `(x, acc) => x * x + acc` y `s => Math.sqrt(s)` son **funciones anónimas** o **expresiones lambda**. No tienen nombre y se definen en el lugar donde se usan, lo que hace el código más conciso.

### Tail recursion optimizada
La función interna `normaPAux` utiliza recursión de cola (`@tailrec`), lo que permite al compilador de Scala optimizarla para evitar desbordamiento de pila, incluso con listas grandes.

## Correcciones y mejoras

1. **Error corregido**: En el código original había `Math.sqr**w**` que parece ser un error tipográfico. Se corrigió a `Math.sqrt(s)`.

2. **Precisión numérica**: Para la raíz cúbica, se usa `1 / 3.0` en lugar de `1/3` para evitar división entera que daría 0.

3. **Tipo de datos**: Se usa `Double` para el acumulador y resultado para manejar valores fraccionarios y raíces.

## Tabla de resumen

Concepto | Descripción | Ejemplo en el ejercicio
--- | --- | ---
Norma-p | Generalización de normas vectoriales | $\sqrt[p]{\sum x_i^p}$
Función de alto orden | Función que opera sobre otras funciones | `normaP(l, f, g)`
Abstracción de patrones | Separar la acumulación de la transformación final | `f` para suma de potencias, `g` para raíz
Función anónima (lambda) | Función sin nombre definida in situ | `(x, acc) => x*x + acc`
Recursión de cola | Recursión optimizable donde la llamada es la última operación | `@tailrec def normaPAux`
Composición funcional | Aplicar funciones en secuencia | `g(normaPAux(...))`
Inmutabilidad | Las listas en Scala son inmutables por defecto | `l.tail` crea nueva lista

## Comentarios adicionales

1. **Generalización adicional**: La función podría extenderse para trabajar con `List[Double]` en lugar de `List[Int]` para mayor flexibilidad.

2. **Manejo de casos especiales**:
   - Lista vacía: Actualmente devuelve 0 (por `acc` inicial 0), pero matemáticamente la norma de un vector vacío podría considerarse 0 o indefinida.
   - Valores negativos: Para normas con p par, se debería usar valores absolutos: `Math.abs(x).pow(p)`.

3. **Eficiencia**: La implementación es O(n) en tiempo y O(1) en espacio adicional (gracias a la recursión de cola).

4. **Relación con funciones de la biblioteca estándar**: Este ejercicio ilustra el principio detrás de funciones como `foldLeft`:
   ```scala
   def normaPConFold(l: List[Int], p: Int): Double = {
     val suma = l.foldLeft(0.0)((acc, x) => acc + Math.pow(x.abs, p))
     Math.pow(suma, 1.0/p)
   }
   ```

5. **Aplicaciones prácticas**: Las normas-p se usan en:
   - Machine Learning: regularización L1 (p=1) y L2 (p=2)
   - Procesamiento de señales: medidas de distancia
   - Gráficos por computadora: cálculos de iluminación

6. **Extensibilidad**: El diseño permite fácilmente crear nuevas normas sin modificar `normaP`, solo cambiando las funciones `f` y `g` (principio abierto/cerrado).

Este ejercicio muestra elegantemente cómo las funciones de alto orden permiten crear código genérico, reutilizable y expresivo que captura patrones matemáticos complejos de manera simple y elegante.