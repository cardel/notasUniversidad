# Concurrencia en la JVM

En la **Máquina Virtual de Java (JVM)**:

1. **Proceso**: Es una instancia de un sistema operativo, la cual puede tener una o más tareas paralelas. Los procesos se encuentran aislados en memoria de otros procesos.
2. **Hilo**: Es una unidad de ejecución que ejecuta una o más instrucciones secuenciales. Un proceso puede contener uno o más hilos. Los hilos comparten la memoria del proceso, sin embargo, tienen su propia pila de ejecución.
3. Existe un hilo denominado **main** o hilo principal de ejecución.
4. Para esto contamos con la clase `Thread` que nos proporciona la posibilidad de ejecutar instrucciones en hilos.

## Creación de Hilos

```scala
def thread(body: => Unit): Thread = {
    val t = new Thread {
        override def run() = body
    }
    t.start()
    t
}
```

Al ejecutar `thread(...)` se lanza un nuevo hilo que ejecuta el proceso.

```scala
def log(msg: String): Unit = {
    println(s"${Thread.currentThread.getName}: $msg")
}
```

## Ejemplo de Ejecución Concurrente

```scala
def main(arr:Array[String]): Unit = {
    log("Desde main")
    thread(log("Desde thread 1"))
    thread(log("Desde thread 2"))
    thread(log("Desde thread 3"))
    log("Fin de main")
}
```

**Resultados de ejecución:**
```bash
main: Desde main
Thread-1: Desde thread 1
Thread-2: Desde thread 2
Thread-3: Desde thread 3
main: Fin de main

# Otra ejecución posible:
main: Desde main
Thread-1: Desde thread 1
Thread-2: Desde thread 2
main: Fin de main
Thread-3: Desde thread 3
```

## Observaciones Clave

1. El hilo principal del programa se llama **main**
2. Cada vez que se lanza un hilo se nombra como **Thread-num** donde num es el número del hilo
3. Al ejecutar varias veces el programa, el orden de los resultados puede ser diferente, esto hace que la ejecución de los hilos no sea **determinista**

## Atomicidad

En ocasiones necesitamos asegurar que una secuencia de instrucciones se ejecuten en un orden dado, es decir, no puede haber lugar a **intercalación**.

```scala
object Ejemplo2 {
    var id = 0

    def getId():Int = {
        val newId = id + 1
        Thread.sleep(1000)
        id = newId
        newId
    }
    
    def thread(body: => Unit): Thread = {
        val t = new Thread {
            override def run() = body
        }
        t.start()
        t
    }

    def main(arr:Array[String]):Unit = {
        thread(println(getId()))
        thread(println(getId()))
        thread(println(getId()))
        println(id)
    }
}
```

**Problema de sincronización:**
```bash
0
1
1
1
```

Se observa que debido a la espera de 1 segundo, todos los hilos ven a la variable `id` con el valor 0.

## Solución con Sincronización

Para arreglar esto, los lenguajes de programación incluyen directivas de **sincronización**. En Scala contamos con la directiva **synchronized**:

```scala
object Ejemplo2 {
    var id = 0

    def getId():Int = synchronized {
        val newId = id + 1
        Thread.sleep(1000)
        id = newId
        newId
    }
    
    def thread(body: => Unit): Thread = {
        val t = new Thread {
            override def run() = body
        }
        t.start()
        t
    }

    def main(arr:Array[String]):Unit = {
        thread(println(getId()))
        thread(println(getId()))
        thread(println(getId()))
        println("linea 22 " + id)
    }
}
```

**Resultado con sincronización:**
```bash
linea 22 0
1
2
3
```

## Uso de Join para Sincronización

Ahora podemos usar **join** para esperar que los hilos terminen, es decir, se unan al hilo principal de ejecución:

```scala
object Ejemplo2 {
    var id = 0

    def getId():Int = synchronized {
        val newId = id + 1
        Thread.sleep(1000)
        id = newId
        newId
    }
    
    def thread(body: => Unit): Thread = {
        val t = new Thread {
            override def run() = body
        }
        t.start()
        t
    }

    def main(arr:Array[String]):Unit = {
        val t1 = thread(println(getId()))
        val t2 = thread(println(getId()))
        val t3 = thread(println(getId()))
        t1.join()
        t2.join()
        t3.join()
        println("linea 22 " + id)
    }
}
```

**Resultado con join:**
```bash
1
2
3
linea 22 3
```

## Tabla de Resumen

| Concepto            | Definición                                                            | Características                                                             | Ejemplo                    |
| ------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------- |
| **Proceso**         | Instancia de sistema operativo con tareas paralelas                   | Aislamiento de memoria entre procesos, un proceso puede tener uno más hilos | -                          |
| **Hilo**            | Unidad de ejecución de instrucciones secuenciales                     | Comparte memoria del proceso, tiene pila propia                             | `Thread-1`, `Thread-2`     |
| **Hilo Main**       | Hilo principal de ejecución en la JVM                                 | Punto de entrada del programa                                               | `main`                     |
| **No Determinismo** | Ejecución no predecible de hilos                                      | Orden de ejecución puede variar entre ejecuciones                           | Diferente orden de salida  |
| **Atomicidad**      | Ejecución indivisible de secuencias de instrucciones                  | Previene intercalación entre hilos                                          | Problema con variable `id` |
| **Race Condition**  | Condición de carrera cuando múltiples hilos acceden datos compartidos | Resultado depende del timing de ejecución                                   | `getId()` sin synchronized |
| **Synchronized**    | Directiva de sincronización en Scala                                  | Garantiza acceso exclusivo a secciones críticas                             | `synchronized { ... }`     |
| **Join**            | Método para esperar que un hilo termine                               | Sincroniza la finalización de hilos                                         | `t1.join()`, `t2.join()`   |