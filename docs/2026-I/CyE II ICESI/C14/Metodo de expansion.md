# Método de iteración para resolver ecuaciones de recurrencia

## 1. Contexto: ecuaciones de recurrencia por divide y vencerás

Una ecuación de recurrencia asociada a un algoritmo de divide y vencerás tiene la forma general:

$$T(n) = \underbrace{a}_{\text{subproblemas}} \cdot T!\left(\frac{n}{b}\right) + \underbrace{f(n)}_{\text{costo de dividir y combinar}}$$

donde:

- $a \geq 1$ es el número de subproblemas generados en cada llamada recursiva.
- $b > 1$ es el factor de reducción del tamaño del problema en cada nivel.
- $f(n)$ es el trabajo realizado fuera de las llamadas recursivas (dividir la entrada y combinar los resultados).

Esta forma general es el punto de partida tanto del método maestro como del método de iteración. El método maestro ofrece una respuesta directa bajo ciertas condiciones, pero el método de iteración permite entender _paso a paso_ cómo se acumula el costo.

## 2. Concepto previo: serie geométrica finita

Antes de aplicar el método de iteración, es indispensable recordar la serie geométrica finita, ya que las sumatorias obtenidas al expandir la recurrencia suelen tener esta forma.

Sea $r \neq 1$ un número real. La **serie geométrica finita** es:

$$\sum_{i=0}^{k} r^i = \frac{r^{k+1} - 1}{r - 1}$$

Cuando $|r| < 1$, al tomar $k \to \infty$ la serie converge:

$$\sum_{i=0}^{\infty} r^i = \frac{1}{1 - r}$$

Esto implica que la suma es $\Theta(1)$: una constante independiente de $k$.

Al resolver recurrencias por iteración, frecuentemente obtenemos sumas de la forma:

$$n \sum_{i=0}^{k} \left(\frac{a}{b}\right)^i$$

El comportamiento asintótico depende del valor de la razón $a/b$:

- Si $a/b < 1$: la suma es $\Theta(n)$ (dominada por el primer término, es decir, la raíz del árbol).
- Si $a/b = 1$: la suma es $\Theta(n \log_b n)$ (todos los niveles aportan la misma cantidad).
- Si $a/b > 1$: la suma es $\Theta(n^{\log_b a})$ (dominada por el último término, es decir, las hojas del árbol de recursión).

Estos tres casos son análogos a los tres casos del teorema maestro. Comprender esta relación es clave para verificar que los resultados obtenidos por iteración son consistentes con el método maestro.

## 3. Idea del método de iteración

El método de iteración (también llamado método de expansión o _unfolding_) consiste en **expandir** (desenrollar) la recurrencia sustituyendo repetidamente $T$ por su propia definición, hasta llegar al caso base. Luego, se expresa el resultado como una **sumatoria** y se evalúa su forma cerrada.

### Pasos del método

1. **Expandir** la recurrencia varias veces (2 o 3 iteraciones) sustituyendo $T(n/b)$ por su definición.
2. **Identificar el patrón** general después de $i$ iteraciones.
3. **Determinar cuándo se detiene:** hallar el valor de $i$ tal que el argumento de $T$ alcanza el caso base.
4. **Expresar como sumatoria** y evaluar usando formas cerradas conocidas (típicamente series geométricas).

La fortaleza de este método radica en que es mecánico y directo: no requiere conjeturar la respuesta de antemano. Su limitación es que el álgebra puede volverse compleja para recurrencias no estándar.

## 4. Ejemplo de clase: $T(n) = n + 3T(n/4)$

### Enunciado

Resolver $T(n) = n + 3T(n/4)$, con $T(1) = \Theta(1)$.

### Paso 1: Expandir

**Iteración 1:**

$$T(n) = n + 3T(n/4)$$

**Iteración 2:** sustituimos $T(n/4) = n/4 + 3T(n/16)$:

$$T(n) = n + 3\left(\frac{n}{4} + 3T!\left(\frac{n}{16}\right)\right) = n + \frac{3n}{4} + 9 \cdot T!\left(\frac{n}{16}\right)$$

**Iteración 3:** sustituimos $T(n/16) = n/16 + 3T(n/64)$:

$$T(n) = n + \frac{3n}{4} + \frac{9n}{16} + 27 \cdot T!\left(\frac{n}{64}\right)$$

### Paso 2: Patrón general

Después de $i$ iteraciones:

$$T(n) = n \sum_{j=0}^{i-1} \left(\frac{3}{4}\right)^j + 3^i \cdot T!\left(\frac{n}{4^i}\right)$$

Los coeficientes del término $n$ siguen una progresión geométrica con razón $3/4$, y el coeficiente del término recursivo crece como $3^i$.

### Paso 3: ¿Cuándo se detiene?

El caso base se alcanza cuando $\dfrac{n}{4^i} = 1$, es decir:

$$4^i = n \implies i = \log_4 n$$

### Paso 4: Sumatoria y forma cerrada

Sustituyendo $i = \log_4 n$:

$$T(n) = n \sum_{j=0}^{\log_4 n - 1} \left(\frac{3}{4}\right)^j + 3^{\log_4 n} \cdot \Theta(1)$$

Como $3/4 < 1$, la serie geométrica converge:

$$\sum_{j=0}^{\log_4 n - 1} \left(\frac{3}{4}\right)^j \leq \sum_{j=0}^{\infty} \left(\frac{3}{4}\right)^j = \frac{1}{1 - 3/4} = 4$$

Además, usando la identidad $a^{\log_b n} = n^{\log_b a}$:

$$3^{\log_4 n} = n^{\log_4 3} \approx n^{0.79}$$

Dado que $n^{0.79}$ crece más lento que $n$, el término dominante es $4n$:

$$\boxed{T(n) = O(n)}$$

## 5. Ejemplo de clase: $T(n) = 2T(n/2) + n$

### Enunciado

Resolver $T(n) = 2T(n/2) + n$, con $T(1) = \Theta(1)$.

### Expansión

**Iteración 1:**

$$T(n) = n + 2T(n/2)$$

**Iteración 2:**

$$T(n) = n + 2\left(\frac{n}{2} + 2T(n/4)\right) = 2n + 4T(n/4)$$

**Iteración 3:**

$$T(n) = 2n + 4\left(\frac{n}{4} + 2T(n/8)\right) = 3n + 8T(n/8)$$

### Patrón general

Después de $i$ iteraciones:

$$T(n) = i \cdot n + 2^i \cdot T!\left(\frac{n}{2^i}\right)$$

Cada nivel aporta exactamente $n$ al costo acumulado (los $2^i$ nodos del nivel $i$ contribuyen $n/2^i$ cada uno, sumando $n$ en total). Esta propiedad es característica de la razón $a/b = 2/2 = 1$.

### Condición de parada y resultado

$n/2^i = 1 \implies i = \log_2 n$.

Sustituyendo:

$$T(n) = n \log_2 n + 2^{\log_2 n} \cdot \Theta(1) = n \log n + n \cdot \Theta(1)$$

$$\boxed{T(n) = \Theta(n \log n)}$$

Cada nivel de la recursión aporta exactamente $n$ al costo total. Como hay $\log_2 n$ niveles, el total es $n \log n$. Esta es la recurrencia del algoritmo _Merge Sort_ (Cormen, Sección 2.3.1).

## 6. Ejemplo de clase: $T(n) = 2T(n/2) + 1$

### Enunciado

Resolver $T(n) = 2T(n/2) + 1$, con $T(1) = \Theta(1)$.

### Patrón general

Después de $i$ iteraciones:

$$T(n) = \sum_{j=0}^{i-1} 2^j + 2^i \cdot T!\left(\frac{n}{2^i}\right)$$

### Condición de parada y resultado

$i = \log_2 n$.

$$T(n) = \sum_{j=0}^{\log_2 n - 1} 2^j + n \cdot \Theta(1) = (2^{\log_2 n} - 1) + \Theta(n) = (n-1) + \Theta(n)$$

$$\boxed{T(n) = \Theta(n)}$$

El costo por nivel crece geométricamente ($1, 2, 4, \ldots$), y las hojas dominan la suma. La serie geométrica con razón $r = 2 > 1$ está dominada por su último término: $2^{\log n} = n$. En notación del teorema maestro, esto corresponde al caso donde $f(n) = 1 = O(n^{\log_2 2 - \varepsilon}) = O(n^{1-\varepsilon})$, por lo que domina la contribución de las hojas.

## 7. Ejemplo de clase: $T(n) = T(n/2) + 1$

### Enunciado

Resolver $T(n) = T(n/2) + 1$, con $T(1) = \Theta(1)$.

### Patrón general

Después de $i$ iteraciones:

$$T(n) = i + T!\left(\frac{n}{2^i}\right)$$

### Condición de parada y resultado

$i = \log_2 n$.

$$T(n) = \log_2 n + \Theta(1)$$

$$\boxed{T(n) = \Theta(\log n)}$$

Esta es la recurrencia de la **búsqueda binaria**: en cada paso se reduce el problema a la mitad con trabajo constante $O(1)$. El número total de pasos es $\log_2 n$. Aquí $a = 1$ y $b = 2$, de modo que el número de hojas es $1^{\log_2 n} = 1$, y todo el costo proviene de los niveles internos.

## 8. Ejemplo adicional: $T(n) = 4T(n/2) + n$

Este ejemplo no aparece en la clase; se incluye como ejercicio resuelto para reforzar el método con un caso donde la razón $a/b > 1$.

### Enunciado

Resolver $T(n) = 4T(n/2) + n$, con $T(1) = \Theta(1)$.

### Paso 1: Expandir

**Iteración 1:**

$$T(n) = n + 4T(n/2)$$

**Iteración 2:** sustituimos $T(n/2) = n/2 + 4T(n/4)$:

$$T(n) = n + 4\left(\frac{n}{2} + 4T(n/4)\right) = n + 2n + 16T(n/4) = 3n + 16T(n/4)$$

**Iteración 3:** sustituimos $T(n/4) = n/4 + 4T(n/8)$:

$$T(n) = 3n + 16\left(\frac{n}{4} + 4T(n/8)\right) = 3n + 4n + 64T(n/8) = 7n + 64T(n/8)$$

### Paso 2: Patrón general

Después de $i$ iteraciones:

$$T(n) = n \sum_{j=0}^{i-1} 2^j + 4^i \cdot T!\left(\frac{n}{2^i}\right)$$

Aquí la razón es $a/b = 4/2 = 2 > 1$, lo que indica que la serie geométrica será dominada por su último término.

### Paso 3: Condición de parada

$n/2^i = 1 \implies i = \log_2 n$.

### Paso 4: Sumatoria y forma cerrada

$$T(n) = n \sum_{j=0}^{\log_2 n - 1} 2^j + 4^{\log_2 n} \cdot \Theta(1)$$

La serie geométrica finita con razón $r = 2$:

$$\sum_{j=0}^{\log_2 n - 1} 2^j = 2^{\log_2 n} - 1 = n - 1$$

Además:

$$4^{\log_2 n} = (2^2)^{\log_2 n} = 2^{2\log_2 n} = n^2$$

Por lo tanto:

$$T(n) = n(n - 1) + \Theta(n^2) = n^2 - n + \Theta(n^2)$$

$$\boxed{T(n) = \Theta(n^2)}$$

La suma está dominada por las hojas ($n^2$), ya que $a/b = 2 > 1$. Verificación con el teorema maestro: $f(n) = n = O(n^{\log_2 4 - \varepsilon}) = O(n^{2-\varepsilon})$ para $\varepsilon = 1$, por lo que aplica el caso 1 y $T(n) = \Theta(n^{\log_2 4}) = \Theta(n^2)$.

## 9. Implementación en Scala

### Ejemplo: $T(n) = 2T(n/2) + n$

**Proceso recursivo (lineal):**

```scala
// Implementación directa de la recurrencia T(n) = 2T(n/2) + n.
// Genera un proceso recursivo: cada llamada espera el resultado
// de las dos subllamadas antes de sumar n.
// Complejidad espacial del proceso: O(log n) por la pila de llamadas.
def tRec(n: Int): Int =
  if (n <= 1) 1           // Caso base: T(1) = 1
  else 2 * tRec(n / 2) + n // Caso recursivo: 2T(n/2) + n
```

**Proceso iterativo (con acumulador):**

```scala
// Versión iterativa usando recursión de cola.
// Acumula el costo nivel por nivel sin crecer en la pila.
// - n: tamaño actual del problema en el nivel actual.
// - acc: acumulador del costo total procesado hasta ahora.
// - numProblemas: cantidad de subproblemas en el nivel actual.
def tIter(n: Int): Int = {
  def aux(n: Int, acc: Int, numProblemas: Int): Int =
    if (n <= 1) acc + numProblemas  // Caso base: suma el costo de las hojas
    else aux(n / 2, acc + n * numProblemas / numProblemas,
             numProblemas * 2)       // Avanza al siguiente nivel
  aux(n, 0, 1)  // Inicia con tamaño n, acumulador 0, un solo problema
}
```

**Versión simplificada:**

```scala
// Versión simplificada del proceso iterativo.
// Observación: en T(n) = 2T(n/2) + n, cada nivel aporta exactamente n,
// así que basta dividir el tamaño sucesivamente y acumular.
def tIterSimple(n: Int): Int = {
  def aux(tamano: Int, acum: Int): Int =
    if (tamano <= 1) acum + tamano  // Caso base: suma la hoja
    else aux(tamano / 2, acum + tamano)  // Acumula el costo del nivel
  aux(n, 0)  // Inicia con tamaño n y acumulador 0
}
```

### Ejemplo: $T(n) = 3T(n/4) + n$

**Proceso recursivo:**

```scala
// Implementación directa de T(n) = 3T(n/4) + n.
// Genera un proceso recursivo con ramificación triple:
// cada llamada genera 3 subllamadas de tamaño n/4.
def tRec2(n: Int): Int =
  if (n <= 1) 1              // Caso base: T(1) = 1
  else 3 * tRec2(n / 4) + n  // Caso recursivo: 3T(n/4) + n
```

**Proceso iterativo (acumulador):**

```scala
// Versión iterativa para T(n) = 3T(n/4) + n.
// - tamano: tamaño del problema en el nivel actual.
// - numNodos: número de nodos en el nivel actual (3^i en el nivel i).
// - acum: costo acumulado de los niveles ya procesados.
// En cada nivel, el costo es tamano * numNodos (= n * (3/4)^i).
def tIter2(n: Int): Int = {
  def aux(tamano: Int, numNodos: Int, acum: Int): Int =
    if (tamano <= 1) acum + numNodos  // Caso base: suma las hojas
    else aux(tamano / 4, numNodos * 3,
             acum + tamano * numNodos) // Avanza al siguiente nivel
  aux(n, 1, 0)  // Inicia con tamaño n, 1 nodo, acumulador 0
}
```

### Verificación empírica

```scala
// Compara T(n) con n*lg(n) para verificar empíricamente la complejidad.
// Si T(n)/(n*lg(n)) tiende a una constante, entonces T(n) = Θ(n log n).
def verificar(): Unit = {
  val valores = List(4, 16, 64, 256, 1024)
  valores.foreach { n =>
    val t = tRec(n)  // Calcula T(n) usando la implementación recursiva
    val nlogn = n * (Math.log(n) / Math.log(2)).toInt  // n * floor(lg n)
    println(s"n=$n, T(n)=$t, n*lg(n)=$nlogn, "
          + s"T(n)/(n*lg(n))=${t.toDouble/nlogn}")
  }
}
```

## 10. Tabla de resumen

| Concepto                            | Descripción                                                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Recurrencia divide y vencerás**   | Forma general $T(n) = aT(n/b) + f(n)$, donde $a$ es el número de subproblemas, $b$ el factor de reducción y $f(n)$ el trabajo por nivel.                                             |
| **Método de iteración**             | Expandir repetidamente la recurrencia sustituyendo $T$ por su definición, identificar el patrón, encontrar la condición de parada y evaluar la sumatoria resultante.                 |
| **Serie geométrica finita**         | $\sum_{i=0}^{k} r^i = \frac{r^{k+1}-1}{r-1}$. Converge a $\frac{1}{1-r}$ si $\|r\| < 1$.                                                                                             |
| **Caso $a/b < 1$**                  | La sumatoria converge; el primer término (raíz) domina. La complejidad depende de $f(n)$.                                                                                            |
| **Caso $a/b = 1$**                  | Todos los niveles aportan lo mismo. El costo total es $f(n) \cdot \log_b n$.                                                                                                         |
| **Caso $a/b > 1$**                  | La serie diverge; el último término (hojas) domina. La complejidad es $\Theta(n^{\log_b a})$.                                                                                        |
| **Condición de parada**             | Se alcanza el caso base cuando $n/b^i = 1$, es decir, $i = \log_b n$.                                                                                                                |
| **Identidad clave**                 | $a^{\log_b n} = n^{\log_b a}$. Permite expresar el número de hojas como potencia de $n$.                                                                                             |
| **Verificación empírica**           | Calcular $T(n)/g(n)$ para valores crecientes de $n$; si tiende a una constante, entonces $T(n) = \Theta(g(n))$.                                                                      |
| **Proceso recursivo vs. iterativo** | El proceso recursivo sigue directamente la definición de la recurrencia; el proceso iterativo usa un acumulador y recursión de cola para evitar crecimiento de la pila.              |
| **Limitación del método**           | El álgebra puede volverse compleja para recurrencias no estándar o con términos $f(n)$ irregulares. En esos casos, el método del árbol o el método maestro pueden ser más prácticos. |