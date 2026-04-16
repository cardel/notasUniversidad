# Evaluación perezosa

La **evaluación perezosa** (lazy evaluation) es una estrategia de evaluación por demanda donde los datos se calculan únicamente cuando se necesitan, en contraste con la evaluación estricta (eager evaluation) donde los valores se calculan inmediatamente.

## Concepto fundamental

En la evaluación perezosa, los cálculos se postergan hasta que su resultado es estrictamente necesario. Esto permite:
- Optimizar el uso de recursos (memoria y CPU)
- Trabajar con estructuras de datos potencialmente infinitas
- Evitar cálculos innecesarios

## Ejemplo ilustrativo

Supongamos que necesitamos encontrar el segundo número primo entre 1000 y 10000. Existen muchas estrategias, como acortar rangos, pero es difícil ajustarlas si no se conoce este número específico. La mejor aproximación es evaluar por demanda: buscar entre 1000 y 10000, y cuando se solicite el segundo primo, calcular primero el primer primo y luego el segundo. El sistema queda esperando la siguiente solicitud.

## Demostración en Scala

### Comparación entre `val`, `lazy val` y evaluación inmediata

```scala
// Ejemplo 1: Uso de lazy val dentro de un bloque
scala> val x = {
     | val x = {print("soy x");1}        // Evaluación inmediata: se ejecuta al definir
     | lazy val y = {print("soy y");2}   // Evaluación perezosa: se ejecuta solo al usarse
     | val z = {print("soy z");3}        // Evaluación inmediata: se ejecuta al definir
     | x + y + z}                        // Aquí se evalúa 'y' por primera vez
soy xsoy zsoy yval x: Int = 6

// Ejemplo 2: lazy val no utilizado
scala> val x = {
     | val x = {print("soy x");1}        // Evaluación inmediata
     | lazy val y = {print("soy y");2}   // Definición perezosa (no se ejecuta)
     | val z = {print("soy z");3}        // Evaluación inmediata
     | }                                 // 'y' nunca se usa, por lo que nunca se evalúa
soy xsoy zval x: Unit = ()
```

## LazyList

`LazyList` es una lista perezosa en Scala donde los elementos se calculan únicamente a medida que se solicitan. Esto permite trabajar con secuencias potencialmente infinitas sin consumir memoria infinita.

### Generador de números infinitos

```scala
// Definición de un generador perezoso de números naturales
def generadorNumeros(num:Int = 1):LazyList[Int] = {
    num #:: generadorNumeros(num+1)  // El operador #:: construye la lista perezosamente
}
```

**Explicación**:
- `#::` es el operador de cons perezoso (equivalente a `::` para listas normales pero con evaluación diferida)
- La recursión no se ejecuta inmediatamente, sino que se crea una promesa de cálculo
- Cada elemento se calcula solo cuando se accede a él

## Conceptos teóricos adicionales

### 1. **Memorización (Memoization)**
Los valores `lazy val` en Scala no solo se evalúan perezosamente, sino que también se memorizan. Una vez evaluado, el valor se almacena en caché y se reutiliza en accesos posteriores.

### 2. **Streams vs LazyList**
En versiones anteriores de Scala existía `Stream`, que fue reemplazado por `LazyList` en Scala 2.13. `LazyList` es más eficiente en memoria porque no retiene referencias a la cabeza evaluada.

### 3. **Ventajas de la evaluación perezosa**
- **Eficiencia**: Evita cálculos innecesarios
- **Modularidad**: Separa la generación de datos de su consumo
- **Infinitud**: Permite trabajar con estructuras de datos infinitas
- **Control de efectos**: Posterga efectos secundarios hasta que sean necesarios

### 4. **Desventajas**
- **Overhead**: Mayor complejidad en tiempo de ejecución
- **Dificultad de depuración**: Los errores pueden aparecer lejos de donde se definió el cálculo
- **Uso de memoria**: En algunos casos puede retener más memoria que la evaluación estricta

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| **Evaluación perezosa** | Estrategia donde los cálculos se postergan hasta que se necesitan | `lazy val`, `LazyList` |
| **Evaluación estricta** | Cálculos que se ejecutan inmediatamente al definirse | `val` normal |
| **`lazy val`** | Valor que se calcula solo en su primer acceso y se memoriza | `lazy val x = computacionCostosa()` |
| **`LazyList`** | Colección perezosa donde elementos se calculan bajo demanda | `LazyList.from(1)` |
| **Operador `#::`** | Constructor perezoso para `LazyList` | `1 #:: 2 #:: LazyList.empty` |
| **Memorización** | Almacenamiento en caché de valores ya calculados | Propiedad automática de `lazy val` |
| **Secuencias infinitas** | Estructuras de datos sin límite definido | `LazyList.continually(1)` |

## Comentarios adicionales

1. **Uso práctico de `LazyList`**:
   - Generación de secuencias matemáticas (Fibonacci, números primos)
   - Procesamiento de streams de datos (archivos grandes, datos de red)
   - Implementación de algoritmos de búsqueda con retroceso (backtracking)

2. **Consideraciones de rendimiento**:
   - `LazyList` es adecuada cuando se procesan elementos secuencialmente
   - Para acceso aleatorio frecuente, otras estructuras pueden ser más eficientes
   - El overhead de la pereza puede ser significativo para colecciones pequeñas

3. **Patrones comunes**:
   - **Generadores**: Funciones que producen `LazyList` infinitas
   - **Transformaciones perezosas**: `map`, `filter` aplicados a `LazyList` también son perezosos
   - **Forzado de evaluación**: Uso de métodos como `take`, `force`, o conversión a lista estricta

4. **Relación con otros conceptos**:
   - **Monadas**: `LazyList` es una mónada, permitiendo uso en expresiones `for`
   - **Funciones de orden superior**: Compatible con `map`, `flatMap`, `filter`
   - **Recursividad**: Ideal para definiciones recursivas perezosas

5. **Mejores prácticas**:
   - Usar `LazyList` para datos que no caben en memoria
   - Evitar efectos secundarios dentro de cálculos perezosos
   - Documentar claramente cuando se usan estructuras perezosas
   - Considerar el uso de `view` para evaluaciones perezosas en colecciones regulares

La evaluación perezosa es una herramienta poderosa en programación funcional que, cuando se usa apropiadamente, puede llevar a soluciones más elegantes y eficientes para problemas específicos, particularmente aquellos que involucran grandes volúmenes de datos o computaciones costosas.