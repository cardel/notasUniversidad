# Paralelismo

Es aprovechar que existen varios núcleos en la CPU para poder distribuir una tarea en varias subtareas y así ganar *speedup* (terminar más rápido la ejecución).

# Concurrencia

Capacidad de gestionar una tarea y resolverla en múltiples subtareas (diseño). No necesariamente tiene que haber paralelismo porque podemos manejar con una sola CPU haciendo planificación de procesos.

## Concurrencia vs Paralelismo

1. **Concurrencia**: Juego, necesito varias cosas funcionando al tiempo, pero no me interesa que funcione más rápido.
2. **Paralelismo**: Necesito procesar 10 millones de datos que se pueden dividir.

# Nivel de paralelismo

1. **A nivel de bits**: Esto lo hace la CPU con operaciones matemáticas o lógicas.
2. **A nivel de instrucción**: Aprovechar los ciclos de instrucción (pipeline, ejecución fuera de orden).
3. **A nivel de tareas**: Conjuntos de instrucciones que se pueden paralelizar.

# Proceso vs Hilo

## Proceso

Es una unidad de ejecución de un programa que es independiente en memoria. Un proceso no puede ver la memoria de otro. Un fallo de segmentación en C++ tiene que ver cuando un programa trata de acceder a memoria que no le corresponde; el S.O. bloquea esa acción y por ello se genera el error.

## Hilo

Es una unidad de ejecución de instrucciones que pueden ir en paralelo. Los hilos están dentro de un mismo proceso (un proceso tiene uno o más hilos). Estos comparten la memoria principal (*heap*) pero no comparten su espacio propio (*pila* o *stack*) con variables locales.

---

## Tabla resumen de conceptos

| Concepto | Definición | Características principales |
| --- | --- | --- |
| **Paralelismo** | Ejecución simultánea de múltiples tareas en distintos núcleos físicos | Busca *speedup* (reducir tiempo de ejecución); requiere hardware con múltiples núcleos |
| **Concurrencia** | Diseño que permite gestionar múltiples tareas de forma entrelazada | No requiere múltiples núcleos; se enfoca en la estructura del programa, no en la velocidad |
| **Proceso** | Unidad de ejecución independiente con espacio de memoria propio | Aislamiento de memoria; comunicación entre procesos requiere mecanismos explícitos (IPC) |
| **Hilo (Thread)** | Unidad de ejecución ligera dentro de un proceso | Comparte *heap* con otros hilos del mismo proceso; tiene su propia *pila* para variables locales |
| **Condición de carrera** | Comportamiento no determinista cuando múltiples hilos acceden a un recurso compartido sin sincronización | El resultado depende del orden de ejecución; se soluciona con exclusión mutua |
| **Exclusión mutua** | Mecanismo que garantiza que solo un hilo ejecute una sección crítica a la vez | Se implementa con `synchronized`, locks, semáforos o monitores |
| **Sección crítica** | Fragmento de código que accede a un recurso compartido | Debe protegerse para evitar condiciones de carrera |

## Comentarios adicionales

- La **Ley de Amdahl** establece que el *speedup* máximo alcanzable mediante paralelismo está limitado por la porción secuencial del programa. Si el 10% del código debe ejecutarse secuencialmente, el *speedup* máximo teórico es 10x, sin importar cuántos núcleos se agreguen.
- La **planificación de procesos** (*scheduling*) es la técnica que permite la concurrencia en un solo núcleo: el S.O. alterna rápidamente entre procesos/hilos dando la ilusión de ejecución simultánea.
- En sistemas modernos, la **memoria caché** introduce problemas adicionales de coherencia cuando múltiples hilos modifican datos compartidos, lo que puede causar que un hilo no vea los cambios realizados por otro (problema de visibilidad).
- Para evitar condiciones de carrera se pueden usar:
  - **Mecanismos de sincronización**: `synchronized`, `Lock`, `Semaphore`
  - **Estructuras atómicas**: `AtomicInteger`, `AtomicReference`
  - **Modelos de memoria**: `volatile` para garantizar visibilidad entre hilos
  - **Estructuras de datos concurrentes**: `ConcurrentHashMap`, `CopyOnWriteArrayList`