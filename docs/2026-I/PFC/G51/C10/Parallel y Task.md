# Estrategia de paralelización

Vamos a paralelizar utilizando partición por índices (no de la estructura). Vamos a hacer las operaciones desde un índice `i` hasta un índice `j`.

Por ejemplo, un arreglo de tamaño 1000 tiene índices [0, 1000).

Si partimos en 2: [0, 500) y [500, 1000).
Si partimos en 4: [0, 250), [250, 500), [500, 750), [750, 1000).

Hay que tener en cuenta que los índices no se pueden solapar: la intersección debe ser vacía, y la unión de ellos debe cubrir todo el rango.

```scala
// Función recursiva que suma los elementos de un segmento del arreglo
// arr: arreglo de enteros
// ini: índice inicial (incluido)
// fin: índice final (excluido)
// acc: acumulador para la suma parcial
def sumaSegmento(arr: Array[Int], ini: Int, fin: Int, acc: Int = 0): Int = {
  if (ini >= fin) acc
  else sumaSegmento(arr, ini + 1, fin, acc + arr[ini])
}
```

En este caso podemos hacer estos llamados:

```scala
// arr tiene 1000 elementos (ejemplo)
val total = sumaSegmento(arr, 0, 250) + 
            sumaSegmento(arr, 250, 500) + 
            sumaSegmento(arr, 500, 750) + 
            sumaSegmento(arr, 750, 1000)
```

# Parallel

`Parallel` es una abstracción que nos permite partir en 2 o 4 tareas, aunque podemos hacer particiones internas, pero siempre en ese orden. Esta abstracción nos da directamente el valor y no es necesario gestionar nada.

```scala
import common._

// arr tiene 1000 elementos (ejemplo)
// parallel ejecuta las 4 tareas en paralelo y devuelve una tupla con los resultados
val (r1, r2, r3, r4) = parallel(
  sumaSegmento(arr, 0, 250),
  sumaSegmento(arr, 250, 500),
  sumaSegmento(arr, 500, 750),
  sumaSegmento(arr, 750, 1000)
)
val total = r1 + r2 + r3 + r4
```

```scala
import common._

// arr tiene 1000 elementos (ejemplo)
// parallel anidado: primero parte en 2, y cada parte se subdivide en 2
val ((r1, r2), (r3, r4)) = parallel(
  parallel(
    sumaSegmento(arr, 0, 250),
    sumaSegmento(arr, 250, 500)
  ),
  parallel(
    sumaSegmento(arr, 500, 750),
    sumaSegmento(arr, 750, 1000)
  )
)
val total = r1 + r2 + r3 + r4
```

Esto se vuelve impractico cuando necesitamos muchas particiones. Una forma de hacerlo es usando un umbral:

```scala
val UMBRAL = 125

// Función que suma en paralelo usando un umbral para decidir cuándo cambiar a secuencial
// Si el tamaño del segmento es menor al umbral, se ejecuta secuencialmente
// Si es mayor o igual, se divide en dos y se ejecuta en paralelo
def sumaParalela(arr: Array[Int], ini: Int, fin: Int): Int = {
  if (fin - ini < UMBRAL) {
    sumaSegmento(arr, ini, fin) // Secuencial
  } else {
    val m = (fin + ini) / 2
    val (r1, r2) = parallel(
      sumaSegmento(arr, ini, m),
      sumaSegmento(arr, m, fin)
    )
    r1 + r2 // Se suman los resultados de ambas mitades
  }
}
```

# Task

La abstracción `task` permite hacer divisiones directamente y no dependemos de un número fijo a diferencia de `parallel`, pero debemos hacer `join`, lo que requiere cuidado dado que podemos volver el código secuencial (si un hilo tiene que esperar que termine otro). Los `join` deben ir al final.

```scala
import common._

// arr tiene 1000 elementos (ejemplo)
// task crea una tarea que se ejecutará en paralelo
// join() espera a que la tarea termine y devuelve su resultado
val r1 = task(sumaSegmento(arr, 0, 250))
val r2 = task(sumaSegmento(arr, 250, 500))
val r3 = task(sumaSegmento(arr, 500, 750))
val r4 = task(sumaSegmento(arr, 750, 1000))
val total = r1.join() + r2.join() + r3.join() + r4.join()
```

# Tabla resumen de conceptos

| Concepto | Definición | Características clave |
| :--- | :--- | :--- |
| **Partición por índices** | Dividir un rango de índices en subrangos disjuntos que cubren todo el rango | Intersección vacía; unión total del rango |
| **Parallel** | Abstracción que ejecuta tareas en paralelo y devuelve los resultados directamente | No requiere gestión manual de hilos; soporta 2 o 4 tareas |
| **Umbral** | Tamaño mínimo de un segmento para decidir si paralelizar o ejecutar secuencialmente | Evita el overhead de crear tareas para problemas pequeños |
| **Task** | Abstracción que crea una tarea ejecutable en paralelo | Requiere `join()` para obtener el resultado; los `join` deben ir al final para evitar serialización |
| **join()** | Método que espera a que una tarea termine y devuelve su resultado | Si se llama antes de lanzar todas las tareas, el código se vuelve secuencial |

**Comentarios adicionales:**
- La partición por índices es una estrategia común para paralelizar operaciones sobre arreglos porque evita la dependencia entre datos y permite dividir el trabajo de forma equitativa.
- `parallel` es más simple de usar que `task` porque maneja automáticamente la sincronización, pero está limitado a un número fijo de tareas (2 o 4).
- `task` ofrece más flexibilidad al permitir cualquier número de tareas, pero requiere que el programador gestione correctamente los `join` para evitar que el código se vuelva secuencial.
- El uso de un umbral es una técnica de optimización importante: para segmentos pequeños, el overhead de crear tareas supera la ganancia de paralelización, por lo que es mejor ejecutar secuencialmente.
- En la función `sumaParalela`, el cálculo del punto medio `m = (fin - ini) / 2` asume que `ini` comienza en 0. Para un caso general, debería ser `m = ini + (fin - ini) / 2`.