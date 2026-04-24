# Condición de carrera

Se trata de cuando un valor es modificado por más de un hilo. Cuando se lanzan, puede pasar que un hilo capture el valor antes de que sea actualizado, lo que produce una condición de no determinismo: no siempre producimos la misma salida.

Los lenguajes de programación ofrecen la directiva `synchronized`. La función solo puede ser ejecutada por un hilo a la vez, lo que produce que lleguemos a un valor concreto (determinista).

# Modelo de memoria de la JVM

Para los hilos:

1. El heap es compartido por los hilos.
2. Cada hilo tiene su propia pila de ejecución: los marcos de pila y las variables locales.

En la JVM puede pasar que un hilo lea un valor antes de que se vea la modificación realizada por otro hilo.

# Ganancia

Es el *speedup*. Es la relación entre el tiempo de ejecución secuencial y el tiempo de ejecución paralela.

$T_1$ = Tiempo secuencial
$T_p$ = Tiempo paralelo

$$
s = \frac{T_1}{T_p}
$$

1. $s = 1$: no hay ganancia.
2. $s < 1$: usualmente hay *overhead* (mala gestión de hilos).
3. $S_p = p$: donde $p$ es el número de núcleos (ideal).
4. $S_p > p$: es un caso poco frecuente.

*Overhead* de crear hilos y hacer *join*.
Parte secuencial: dividir la entrada y sumar los sub-resultados.
Contención de memoria: cachés, bus, etc.

# ¿Cuándo paralelizar?

Hay que tener en cuenta la parte secuencial y la parte que se puede paralelizar. Por ejemplo, si el programa tiene 50% secuencial y 50% paralelo:

¿Cuánto es lo máximo que puedo acelerar?

2x

# Tabla resumen de conceptos

| Concepto | Definición | Características clave |
| :--- | :--- | :--- |
| **Condición de carrera** | Situación donde múltiples hilos acceden y modifican un recurso compartido sin sincronización | Produce no determinismo; el resultado depende del orden de ejecución |
| **synchronized** | Directiva que permite que solo un hilo ejecute un bloque o método a la vez | Garantiza exclusión mutua; elimina condiciones de carrera |
| **Heap (JVM)** | Espacio de memoria compartido por todos los hilos de un proceso | Contiene objetos; accesible por todos los hilos |
| **Pila de ejecución (JVM)** | Espacio de memoria privado por hilo | Contiene marcos de pila y variables locales |
| **Speedup ($s$)** | Relación entre tiempo secuencial y tiempo paralelo | $s = T_1 / T_p$; idealmente $s = p$ (número de núcleos) |
| **Overhead** | Costo adicional de gestionar la paralelización | Incluye creación de hilos, sincronización, contención de caché |
| **Ley de Amdahl** | Establece el límite máximo de aceleración dado un porcentaje de código secuencial | Si el 50% es secuencial, la aceleración máxima es 2x |

**Comentarios adicionales:**
- La condición de carrera es uno de los problemas más difíciles de depurar en programación concurrente porque es no determinista.
- El modelo de memoria de la JVM permite que cada hilo tenga una copia local de las variables en caché, lo que puede causar inconsistencias incluso si se usa el heap compartido. Para garantizar visibilidad se usan `volatile` o `synchronized`.
- La Ley de Amdahl es fundamental para entender los límites prácticos de la paralelización: incluso con infinitos núcleos, la parte secuencial impone un límite superior al *speedup*.
- El *overhead* de crear y gestionar hilos puede hacer que la versión paralela sea más lenta que la secuencial para problemas pequeños.