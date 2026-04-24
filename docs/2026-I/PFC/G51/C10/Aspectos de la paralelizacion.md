# Condición de carrera

Es cuando dos o más hilos intentan acceder y modificar un valor. Un hilo podría ver un valor antiguo y producir un valor incorrecto.

En el modelo de la JVM, usualmente hay una latencia cuando los hilos modifican el *heap*. Es posible que otro hilo lea un valor antiguo, por eso es necesario hacer `join()` antes de leer.

Afortunadamente, en la **Programación Funcional (PF)** no tenemos ese problema, porque los valores son inmutables.

Por esa razón, en *cloud* se prefieren lenguajes como **Erlang**, **Haskell** y **Clojure**, ¡son funcionales!

# Estrategias

Para programación imperativa usamos `synchronized`, que garantiza que la función es ejecutada por un hilo a la vez.

Pero esto no es para programación funcional.

# Modelo de memoria JVM

1. El *heap* tiene una latencia con respecto a la escritura de hilos.
2. Si dos hilos escriben en partes diferentes del *heap*, no hay ningún problema.
3. Se garantiza que un hilo escribe en el *heap* cuando hacemos `join`.

# Definición de paralelización

La aceleración con $p$ núcleos:

$$S_p = \frac{T_1}{T_p}$$

Cuando tenemos paralelización infinita, entonces:

$$S_\infty = \frac{1}{f}$$

Donde $f$ es la parte secuencial del programa.

1. **Overhead**: Cuando tenemos muchos hilos, gestionarlos cuesta.
2. **Contención**: Latencias relacionadas con la memoria, caché, etc.

No vamos a tener el escenario ideal nunca.

---

## Tabla resumen de conceptos

| Concepto | Definición | Características principales |
| --- | --- | --- |
| **Condición de carrera** | Situación donde múltiples hilos acceden y modifican un recurso compartido sin sincronización | Resultado no determinista; se soluciona con exclusión mutua o inmutabilidad |
| **Inmutabilidad** | Propiedad de un dato que no puede modificarse después de su creación | Elimina condiciones de carrera; fundamental en programación funcional |
| **`synchronized`** | Mecanismo de exclusión mutua en Java/JVM | Garantiza que solo un hilo ejecute un bloque a la vez; propio de programación imperativa |
| **Modelo de memoria JVM** | Conjunto de reglas que define cómo los hilos interactúan con la memoria | Incluye latencias de escritura en *heap*; `join()` garantiza visibilidad |
| **Ley de Amdahl** | Fórmula que calcula el *speedup* máximo teórico | $S_p = T_1 / T_p$; limitado por la fracción secuencial $f$ |
| **Overhead** | Costo adicional de gestionar múltiples hilos | Incluye creación, sincronización, cambio de contexto |
| **Contención** | Competencia por recursos compartidos (memoria, caché, buses) | Reduce el *speedup* real; aumenta con más hilos |

## Comentarios adicionales

- La **Ley de Amdahl** establece que si una fracción $f$ del programa debe ejecutarse secuencialmente, el *speedup* máximo con $p$ núcleos es $S_p = 1 / (f + (1-f)/p)$. Cuando $p \to \infty$, $S_\infty = 1/f$, lo que significa que incluso con infinitos núcleos, la parte secuencial limita la ganancia.
- En programación funcional, la **inmutabilidad** evita condiciones de carrera porque ningún hilo puede modificar un valor que otro hilo está leyendo. Esto simplifica enormemente la programación concurrente.
- El **modelo de actores** (usado en Erlang y Akka) es una alternativa a los hilos tradicionales: cada actor tiene su propio estado y se comunica mediante mensajes inmutables, evitando compartir memoria.
- La **contención de caché** ocurre cuando múltiples núcleos intentan acceder a la misma línea de caché, forzando invalidaciones y reduciendo el rendimiento. Este problema se conoce como *false sharing*.
- En la práctica, el *speedup* real siempre es menor al teórico debido al *overhead* de gestión de hilos y a la contención de recursos. La elección del número óptimo de hilos depende de la naturaleza del problema y del hardware disponible.