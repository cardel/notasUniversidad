# Recursión de cola

En la recursión de cola se maneja un solo marco de pila, ya que el compilador la puede optimizar para que funcione como un proceso iterativo, conservando únicamente un marco de pila.

## Implementación en Scala

```scala
import scala.annotation.tailrec

/**
  * Calcula el factorial de un número entero usando recursión de cola.
  * 
  * @param n El número entero para calcular su factorial.
  * @param cnt Contador que inicia en 1 y se incrementa hasta n.
  * @param acc Acumulador que almacena el resultado parcial del factorial.
  * @return El factorial de n.
  * @throws IllegalArgumentException si n es negativo.
  */
@tailrec
def factorialIter(n: Int, cnt: Int = 1, acc: Int = 1): Int = {
  // Caso base: cuando el contador supera n, retornamos el acumulador
  if (cnt > n) acc
  // Caso recursivo de cola: llamada recursiva como última operación
  else factorialIter(n, cnt + 1, cnt * acc)
}

// Ejemplo de ejecución: factorialIter(5)
// factorialIter(5, 1, 1)
// factorialIter(5, 2, 1*1)   // cnt=2, acc=1
// factorialIter(5, 3, 2*1)   // cnt=3, acc=2
// factorialIter(5, 4, 3*2)   // cnt=4, acc=6
// factorialIter(5, 5, 4*6)   // cnt=5, acc=24
// factorialIter(5, 6, 5*24)  // cnt=6 > 5, retorna acc=120
```

## Características de la recursión de cola

En la recursión de cola, se va acumulando el resultado en uno de los parámetros (el acumulador), calculando secuencialmente: 0!, 1!, 2!, 3!, ..., n!. En este caso, solo se necesita un marco de pila, ya que cada llamada recursiva puede reutilizar el mismo espacio de memoria.

Scala requiere la anotación `@tailrec` para garantizar la optimización de recursión de cola. No todos los lenguajes de programación soportan esta optimización automáticamente.

## Función recursiva ≠ proceso recursivo

Es importante distinguir entre:
- **Función recursiva**: Una función que se define en términos de sí misma.
- **Proceso recursivo**: Un proceso de evaluación que genera una expansión seguida de una contracción.

En el caso de la recursión lineal, tenemos tanto una función recursiva como un proceso recursivo (múltiples marcos de pila). En el caso de la recursión de cola, tenemos una función recursiva pero un proceso iterativo (un solo marco de pila).

No todos los lenguajes de programación soportan la optimización de recursión de cola. Para más información, consultar el [artículo de Wikipedia sobre Tail Call](https://en.wikipedia.org/wiki/Tail_call).

## Conceptos teóricos adicionales

### Definición formal de recursión de cola
Una llamada de cola (tail call) ocurre cuando una función retorna el valor de otra función sin realizar operaciones adicionales después de la llamada. Cuando esta llamada es a la misma función, se denomina recursión de cola.

### Optimización de llamada de cola (TCO)
La optimización de llamada de cola es una técnica del compilador que reemplaza una llamada de cola por un salto (jump), reutilizando el marco de pila actual en lugar de crear uno nuevo. Esto convierte la recursión en iteración a nivel de máquina.

### Ventajas de la recursión de cola
1. **Eficiencia de memoria**: O(1) espacio en lugar de O(n) en la pila.
2. **Evita desbordamiento de pila**: Permite recursión profunda sin riesgo de StackOverflowError.
3. **Mejor rendimiento**: Elimina la sobrecarga de crear y destruir marcos de pila.

### Limitaciones
1. **Soporte del lenguaje**: No todos los lenguajes implementan TCO.
2. **Legibilidad**: Puede ser menos intuitiva que la recursión lineal para algunos problemas.
3. **Parámetros adicionales**: Requiere parámetros de acumulación que pueden no ser naturales para el problema.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| Recursión de cola | Tipo de recursión donde la llamada recursiva es la última operación en la función | `@tailrec def f(...) = ... f(...)` |
| Llamada de cola | Llamada a función que es la última operación antes del retorno | `return g(x)` o `f(x)` como última línea |
| Optimización de llamada de cola | Técnica del compilador que reutiliza el marco de pila para llamadas de cola | Implementado en Scala con `@tailrec` |
| Acumulador | Parámetro que almacena el resultado parcial durante la recursión | `acc` en `factorialIter` |
| Anotación `@tailrec` | Anotación en Scala que verifica y fuerza la optimización de recursión de cola | `@tailrec def factorialIter(...)` |
| Complejidad espacial | O(1) en recursión de cola optimizada vs O(n) en recursión lineal | Un solo marco de pila |
| Proceso iterativo | Evaluación que no requiere expansión/contracción de la pila | Recursión de cola optimizada |

## Comparación: Recursión lineal vs. Recursión de cola

| Aspecto | Recursión lineal | Recursión de cola |
|---------|-----------------|-------------------|
| Espacio en pila | O(n) | O(1) (con optimización) |
| Proceso de evaluación | Recursivo (expansión/contracción) | Iterativo |
| Riesgo de StackOverflow | Alto para n grande | Bajo o nulo |
| Legibilidad | Generalmente más clara | Puede requerir parámetros adicionales |
| Optimización automática | No aplica | Requiere soporte del lenguaje |

## Comentarios adicionales

1. **Verificación en Scala**: La anotación `@tailrec` no solo habilita la optimización, sino que también verifica en tiempo de compilación que la función sea realmente recursiva de cola. Si no lo es, el compilador genera un error.

2. **Lenguajes con soporte TCO**: Además de Scala, lenguajes como Scheme, Haskell, Erlang y Elixir tienen soporte nativo para TCO. En contraste, Java y Python (CPython) no implementan esta optimización por defecto.

3. **Transformación a recursión de cola**: Cualquier función recursiva lineal puede transformarse en recursión de cola mediante:
   - Añadir un parámetro acumulador
   - Calcular el resultado incrementalmente
   - Asegurar que la llamada recursiva sea la última operación

4. **Aplicaciones prácticas**: La recursión de cola es esencial para:
   - Procesamiento de listas y secuencias largas
   - Máquinas de estado y autómatas
   - Algoritmos que requieren profundidad de recursión significativa
   - Programación funcional donde la iteración explícita es menos común

5. **Limitaciones de la optimización**: Incluso en lenguajes que soportan TCO, ciertas características pueden impedir la optimización:
   - Try-catch blocks alrededor de la llamada recursiva
   - Closures que capturan el contexto de la llamada
   - Llamadas indirectas (a través de funciones de orden superior)

6. **Alternativa en lenguajes sin TCO**: En lenguajes que no soportan TCO, se puede usar el patrón "trampolín" (trampolining) para simular recursión de cola sin consumir espacio en la pila.